# Screen 0 / Entry: Auth & Routing

## Overview

The auth entry point consists of three sub-screens:

- **Screen A** -- Login/Signup at `/auth` (split-screen: left branding, right form with Sign In / Create Account tabs, Google OAuth)
- **Screen B** -- Post-Auth Routing at `/app` (checks org, wizard sessions, projects, then routes to appropriate destination)
- **Screen C** -- Welcome at `/app/welcome` (for new users, 3 preview cards, "Start Discovery" CTA)

---

## 1. Auth Flow

```mermaid
%%{init: {'theme': 'forest'}}%%
flowchart TD
    A[User visits /auth] --> B{Already authenticated?}
    B -- Yes --> G[Redirect to /app]
    B -- No --> C[Show Auth Screen<br/>Split-screen layout]
    C --> D{Active Tab}
    D -- Sign In --> E1[Email + Password form]
    D -- Create Account --> E2[Name + Email + Password form]
    C --> F[Google OAuth button]
    E1 --> H{Credentials valid?}
    H -- No --> I[Show error message]
    I --> E1
    H -- Yes --> G
    E2 --> J{Validation passes?}
    J -- No --> K[Show field errors]
    K --> E2
    J -- Yes --> L[Create Supabase user]
    L --> M[Create profile record]
    M --> G
    F --> N[Google OAuth popup]
    N --> O{OAuth success?}
    O -- No --> P[Show OAuth error]
    P --> C
    O -- Yes --> Q{New user?}
    Q -- Yes --> M
    Q -- No --> G
    G --> R[Post-Auth Routing Logic]
```

---

## 2. Post-Auth Routing Logic

```mermaid
%%{init: {'theme': 'forest'}}%%
flowchart TD
    START[User lands on /app<br/>authenticated] --> CHECK_ORG{Has organization?}

    CHECK_ORG -- No --> CREATE_ORG[Redirect to /app/welcome<br/>Welcome Screen C]
    CREATE_ORG --> WELCOME[Show 3 preview cards<br/>+ Start Discovery CTA]
    WELCOME --> START_WIZARD[Create org + Start new wizard session]
    START_WIZARD --> WIZARD_STEP1[Redirect to /app/wizard/step-1]

    CHECK_ORG -- Yes --> CHECK_WIZARD{Has active<br/>wizard session?}

    CHECK_WIZARD -- Yes --> CHECK_COMPLETE{Wizard<br/>completed?}
    CHECK_COMPLETE -- No --> RESUME[Resume wizard at<br/>last incomplete step]
    CHECK_COMPLETE -- Yes --> CHECK_PROJECT{Has projects?}

    CHECK_WIZARD -- No --> CHECK_PROJECT

    CHECK_PROJECT -- Yes --> DASHBOARD[Redirect to /app/dashboard]
    CHECK_PROJECT -- No --> CHECK_PREV_WIZARD{Has any previous<br/>wizard sessions?}

    CHECK_PREV_WIZARD -- Yes --> DASHBOARD
    CHECK_PREV_WIZARD -- No --> WELCOME
```

---

## 3. Auth Sequence

```mermaid
%%{init: {'theme': 'forest'}}%%
sequenceDiagram
    actor User
    participant AuthForm as Auth Form<br/>/auth
    participant Supabase as Supabase Auth
    participant DB as Database
    participant Router as Post-Auth Router<br/>/app

    User->>AuthForm: Visit /auth
    AuthForm->>AuthForm: Check active session

    alt Already authenticated
        AuthForm->>Router: Redirect to /app
    end

    alt Email Sign In
        User->>AuthForm: Enter email + password
        AuthForm->>Supabase: signInWithPassword()
        Supabase-->>AuthForm: Session token / error
        alt Invalid credentials
            AuthForm-->>User: Show error message
        end
    else Email Sign Up
        User->>AuthForm: Enter name + email + password
        AuthForm->>Supabase: signUp()
        Supabase-->>AuthForm: New user / error
        alt Validation error
            AuthForm-->>User: Show field errors
        end
        AuthForm->>DB: INSERT INTO profiles (user_id, name, email)
        DB-->>AuthForm: Profile created
    else Google OAuth
        User->>AuthForm: Click Google OAuth
        AuthForm->>Supabase: signInWithOAuth('google')
        Supabase-->>AuthForm: OAuth callback with session
        AuthForm->>DB: UPSERT profile from OAuth data
        DB-->>AuthForm: Profile ready
    end

    AuthForm->>Router: Redirect to /app with session

    Router->>DB: SELECT org FROM organizations WHERE user_id = ?
    DB-->>Router: Org result

    alt No organization
        Router->>User: Redirect to /app/welcome
        User->>Router: Click "Start Discovery"
        Router->>DB: INSERT INTO organizations (...)
        Router->>DB: INSERT INTO wizard_sessions (org_id, status='in_progress')
        DB-->>Router: New wizard session
        Router->>User: Redirect to /app/wizard/step-1
    else Has organization
        Router->>DB: SELECT * FROM wizard_sessions WHERE org_id = ? AND status = 'in_progress'
        DB-->>Router: Wizard session result

        alt Active incomplete wizard
            Router->>DB: SELECT MAX(step) FROM wizard_answers WHERE session_id = ?
            DB-->>Router: Last completed step
            Router->>User: Redirect to /app/wizard/step-{next}
        else No active wizard
            Router->>DB: SELECT * FROM projects WHERE org_id = ?
            DB-->>Router: Projects result
            alt Has projects
                Router->>User: Redirect to /app/dashboard
            else No projects
                Router->>User: Redirect to /app/welcome
            end
        end
    end
```
