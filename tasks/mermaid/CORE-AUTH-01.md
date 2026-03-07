---
id: CORE-AUTH-01
phase: CORE
prd_section: Authentication and Entry Flow
title: Authentication and Entry Flow
type: flowchart
---

# Authentication and Entry Flow

Covers the `/auth` route UI, sign-in/sign-up flows, Google OAuth, and post-authentication routing logic that determines where the user lands.

## Auth Page Layout and Flow

```mermaid
---
config:
  theme: forest
---
flowchart TD
    Visit([User visits /auth]) --> SplitScreen["Split-Screen Layout<br/>Left: brand imagery + tagline<br/>Right: auth form panel"]

    SplitScreen --> TabToggle{"Tab Toggle"}
    TabToggle -->|Sign In| SignInForm["Sign In Form<br/>Email input<br/>Password input<br/>Submit button"]
    TabToggle -->|Create Account| SignUpForm["Create Account Form<br/>Full name input<br/>Email input<br/>Password input<br/>Confirm password<br/>Submit button"]

    SignInForm --> EmailLogin["Email/Password Login"]
    SignUpForm --> EmailSignUp["Email/Password Sign Up"]

    SplitScreen --> GoogleBtn["Google OAuth Button<br/>Continue with Google"]
    GoogleBtn --> GoogleFlow

    subgraph GoogleFlow["Google OAuth Flow"]
        direction TB
        G1["Redirect to Google consent screen"] --> G2["User grants permission"]
        G2 --> G3["Google returns auth code"]
        G3 --> G4["Supabase exchanges code for session"]
        G4 --> G5["Session stored, JWT issued"]
    end

    subgraph EmailAuthFlow["Email Auth Flow"]
        direction TB
        EmailLogin --> E1["supabase.auth.signInWithPassword"]
        EmailSignUp --> E2["supabase.auth.signUp"]
        E2 --> E3["Create profile record in profiles table"]
        E1 --> E4["JWT session returned"]
        E3 --> E4
    end

    GoogleFlow --> PostAuth
    EmailAuthFlow --> PostAuth

    PostAuth{{"Post-Auth Router<br/>/app entry point"}}

    PostAuth --> CheckOrg{"Has organization?"}
    CheckOrg -->|No| Welcome["/app/welcome<br/>3 cards layout<br/>Begin AI Strategy CTA"]

    CheckOrg -->|Yes| CheckWizard{"Has wizard_sessions?"}
    CheckWizard -->|No| WizardStart["/app/wizard/step-1<br/>Start new wizard session"]

    CheckWizard -->|Yes| CheckComplete{"wizard status = completed?"}
    CheckComplete -->|No| ResumeWizard["/app/wizard/step-N<br/>Resume at current_step"]

    CheckComplete -->|Yes| CheckProject{"Has projects?"}
    CheckProject -->|Yes| DashboardRoute["/app/dashboard<br/>Project overview"]
    CheckProject -->|No| WizardStart

    Welcome --> CreateOrg["User creates org via wizard"] --> WizardStart

    classDef startEnd fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#F1EEEA
    classDef formNode fill:#F1EEEA,stroke:#0A211F,stroke-width:2px,color:#0A211F
    classDef decision fill:#84CC16,stroke:#0A211F,stroke-width:2px,color:#0A211F
    classDef route fill:#1a5c3a,stroke:#84CC16,stroke-width:2px,color:#F1EEEA

    class Visit,DashboardRoute startEnd
    class SignInForm,SignUpForm,GoogleBtn formNode
    class TabToggle,CheckOrg,CheckWizard,CheckComplete,CheckProject,PostAuth decision
    class Welcome,WizardStart,ResumeWizard,DashboardRoute route
```

## Auth Sequence Diagram — Email Sign In

```mermaid
---
config:
  theme: forest
---
sequenceDiagram
    autonumber
    actor User
    participant AuthPage as Auth Page /auth
    participant SBAuth as Supabase Auth
    participant DB as PostgreSQL
    participant Router as App Router

    User->>AuthPage: Navigate to /auth
    AuthPage-->>User: Render split-screen with Sign In tab active

    User->>AuthPage: Enter email and password
    User->>AuthPage: Click Sign In

    AuthPage->>+SBAuth: signInWithPassword(email, password)

    alt Invalid credentials
        SBAuth-->>AuthPage: Error: Invalid login credentials
        AuthPage-->>User: Show error toast
    else Valid credentials
        SBAuth-->>-AuthPage: Session object with JWT + user
        AuthPage->>AuthPage: Store session in auth context

        AuthPage->>+Router: Navigate to /app
        Router->>+DB: SELECT * FROM organizations WHERE owner_id = user.id
        DB-->>-Router: Organization record or null

        alt No organization found
            Router-->>User: Redirect to /app/welcome
        else Organization exists
            Router->>+DB: SELECT * FROM wizard_sessions WHERE org_id = org.id ORDER BY created_at DESC LIMIT 1
            DB-->>-Router: Latest wizard session or null

            alt No wizard session
                Router-->>User: Redirect to /app/wizard/step-1
            else Wizard session exists
                alt status != completed
                    Router-->>User: Redirect to /app/wizard/step-{current_step}
                else status = completed
                    Router->>+DB: SELECT * FROM projects WHERE org_id = org.id LIMIT 1
                    DB-->>-Router: Project record or null

                    alt Has projects
                        Router-->>User: Redirect to /app/dashboard
                    else No projects
                        Router-->>-User: Redirect to /app/wizard/step-1
                    end
                end
            end
        end
    end
```

## Auth Sequence Diagram — Google OAuth

```mermaid
---
config:
  theme: forest
---
sequenceDiagram
    autonumber
    actor User
    participant AuthPage as Auth Page /auth
    participant SBAuth as Supabase Auth
    participant Google as Google OAuth
    participant DB as PostgreSQL
    participant Router as App Router

    User->>AuthPage: Click Continue with Google
    AuthPage->>SBAuth: signInWithOAuth(provider: google)
    SBAuth-->>User: Redirect to Google consent screen

    User->>Google: Grant permission
    Google-->>SBAuth: Authorization code callback

    SBAuth->>Google: Exchange code for tokens
    Google-->>SBAuth: Access token + ID token

    SBAuth->>SBAuth: Create or update auth.users record
    SBAuth->>DB: UPSERT profiles (name, email, avatar from Google)
    DB-->>SBAuth: Profile confirmed

    SBAuth-->>AuthPage: Redirect to /app with session

    Note over AuthPage,Router: Same post-auth routing logic applies
    AuthPage->>Router: Navigate to /app
    Router->>DB: Check org, wizard, projects
    DB-->>Router: Routing data

    alt New user, no org
        Router-->>User: Redirect to /app/welcome
    else Returning user
        Router-->>User: Redirect to appropriate route
    end
```

## Protected Route Guard

```mermaid
---
config:
  theme: forest
---
flowchart TD
    Request([Request to /app/* route]) --> CheckSession{"Valid JWT session?"}

    CheckSession -->|No session| RedirectAuth["/auth<br/>Redirect with return URL"]
    CheckSession -->|Expired| RefreshToken["Attempt token refresh"]

    RefreshToken --> RefreshResult{"Refresh successful?"}
    RefreshResult -->|No| RedirectAuth
    RefreshResult -->|Yes| CheckSession

    CheckSession -->|Valid| CheckRole{"Route requires specific role?"}

    CheckRole -->|No| RenderRoute["Render protected route"]
    CheckRole -->|Yes| VerifyRole{"User has required role?<br/>Owner / Consultant / Client"}

    VerifyRole -->|Yes| RenderRoute
    VerifyRole -->|No| Forbidden["403 — Insufficient permissions<br/>Show access denied page"]

    classDef guard fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#F1EEEA
    classDef fail fill:#dc2626,stroke:#991b1b,stroke-width:2px,color:#F1EEEA
    classDef pass fill:#1a5c3a,stroke:#84CC16,stroke-width:2px,color:#F1EEEA

    class Request guard
    class RedirectAuth,Forbidden fail
    class RenderRoute pass
```
