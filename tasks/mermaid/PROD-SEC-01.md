---
id: PROD-SEC-01
phase: PRODUCTION
prd_section: Security & Access Control
title: Security Model — RLS, JWT, Access Control
type: flowchart
---

# Security Model — RLS, JWT, Access Control

Production security architecture for the Sun AI Agency platform: Row Level Security enforcement, JWT verification pipeline, role-based access control, and security hardening checklist.

## RLS Policy Flow — Request to Data

Every database query passes through this pipeline. No request reaches data without JWT verification and org-scoped RLS filtering.

```mermaid
---
config:
  theme: forest
---
flowchart TD
    Request([Client Request]) --> AuthHeader{Authorization<br/>header present?}

    AuthHeader -->|No| Reject401([401 Unauthorized])

    AuthHeader -->|Yes| VerifyJWT[Verify JWT Signature<br/>via Supabase Auth]
    VerifyJWT --> JWTValid{JWT valid<br/>and not expired?}

    JWTValid -->|No| Reject401

    JWTValid -->|Yes| ExtractClaims["Extract Claims<br/>user_id, email, role"]
    ExtractClaims --> LookupOrg["Lookup org_id<br/>from user profile"]
    LookupOrg --> SetContext["SET LOCAL auth.uid()<br/>SET LOCAL app.org_id"]

    SetContext --> RLSCheck{"RLS Policy<br/>Evaluation"}

    RLSCheck --> SelectPolicy["SELECT Policy<br/>WHERE org_id = app.org_id"]
    RLSCheck --> InsertPolicy["INSERT Policy<br/>WITH CHECK org_id = app.org_id"]
    RLSCheck --> UpdatePolicy["UPDATE Policy<br/>USING org_id = app.org_id<br/>WITH CHECK org_id = app.org_id"]
    RLSCheck --> DeletePolicy["DELETE Policy<br/>USING org_id = app.org_id"]

    SelectPolicy --> DataReturn([Filtered Results])
    InsertPolicy --> DataReturn
    UpdatePolicy --> DataReturn
    DeletePolicy --> DataReturn

    subgraph RLS_Enforcement["RLS Enforcement Layer — 58+ Tables"]
        direction TB
        RLSCheck
        SelectPolicy
        InsertPolicy
        UpdatePolicy
        DeletePolicy
    end

    subgraph Known_Issues["Known Issue: 9 Tables"]
        direction TB
        MissingCheck["UPDATE policies missing<br/>WITH CHECK clause<br/>Could allow org_id mutation"]
        FixNeeded["FIX: Add WITH CHECK<br/>on all UPDATE policies"]
    end

    UpdatePolicy -.->|"Audit needed"| MissingCheck
    MissingCheck --> FixNeeded

    classDef requestNode fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#F1EEEA
    classDef rejectNode fill:#991b1b,stroke:#ef4444,stroke-width:2px,color:#F1EEEA
    classDef processNode fill:#F1EEEA,stroke:#0A211F,stroke-width:2px,color:#0A211F
    classDef rlsNode fill:#1a5c3a,stroke:#84CC16,stroke-width:2px,color:#F1EEEA
    classDef warningNode fill:#92400e,stroke:#f59e0b,stroke-width:2px,color:#F1EEEA
    classDef decisionNode fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#84CC16

    class Request,DataReturn requestNode
    class Reject401 rejectNode
    class AuthHeader,JWTValid decisionNode
    class VerifyJWT,ExtractClaims,LookupOrg,SetContext processNode
    class RLSCheck,SelectPolicy,InsertPolicy,UpdatePolicy,DeletePolicy rlsNode
    class MissingCheck,FixNeeded warningNode
```

## JWT Verification in Edge Functions

All 17 Edge Functions follow the same JWT verification pattern before processing any request.

```mermaid
---
config:
  theme: forest
---
flowchart LR
    subgraph EdgeFunction["Edge Function (Deno Runtime)"]
        direction TB
        Receive["Receive Request"] --> ExtractBearer["Extract Bearer Token<br/>from Authorization header"]
        ExtractBearer --> VerifySupabase["supabase.auth.getUser(token)<br/>Verify with Supabase Auth"]
        VerifySupabase --> Valid{Valid?}
        Valid -->|No| Return401["Return 401<br/>masked error message"]
        Valid -->|Yes| CheckRate{Rate limit<br/>exceeded?}
        CheckRate -->|Yes| Return429["Return 429<br/>Too Many Requests"]
        CheckRate -->|No| ProcessRequest["Process Request<br/>with verified user context"]
    end

    subgraph KeySecurity["API Key Isolation"]
        direction TB
        GeminiKey["GEMINI_API_KEY<br/>Edge Function env only"]
        StripeKey["STRIPE_SECRET_KEY<br/>Edge Function env only"]
        GoogleKey["GOOGLE_API_KEY<br/>Edge Function env only"]
        NoClient["Client-side code:<br/>ZERO secret keys"]
    end

    ProcessRequest --> ExternalAPIs["Call External APIs<br/>with server-side keys"]
    ExternalAPIs --> GeminiKey
    ExternalAPIs --> StripeKey
    ExternalAPIs --> GoogleKey

    classDef edgeNode fill:#F1EEEA,stroke:#0A211F,stroke-width:2px,color:#0A211F
    classDef rejectNode fill:#991b1b,stroke:#ef4444,stroke-width:2px,color:#F1EEEA
    classDef keyNode fill:#1a5c3a,stroke:#84CC16,stroke-width:2px,color:#F1EEEA
    classDef safeNode fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#84CC16

    class Receive,ExtractBearer,VerifySupabase,CheckRate,Valid,ProcessRequest edgeNode
    class Return401,Return429 rejectNode
    class GeminiKey,StripeKey,GoogleKey keyNode
    class NoClient,ExternalAPIs safeNode
```

## Role-Based Access Control Model

Four distinct roles with strictly scoped data access and UI capabilities.

```mermaid
---
config:
  theme: forest
---
classDiagram
    class Role {
        <<enumeration>>
        OWNER
        CONSULTANT
        CLIENT
        GUEST
    }

    class Owner {
        <<role: owner>>
        +viewAllClients()
        +viewAllProjects()
        +viewAgencyDashboard()
        +viewAnalytics()
        +manageConsultants()
        +manageBilling()
        +exportData()
        +configureOrg()
        ___
        RLS scope: own org_id
        UI access: Full agency panel
    }

    class Consultant {
        <<role: consultant>>
        +viewAssignedClients()
        +viewAssignedProjects()
        +viewAgencyDashboard()
        +editBriefs()
        +manageTasks()
        ___
        RLS scope: own org_id + assigned clients
        UI access: Agency panel filtered
    }

    class Client {
        <<role: client>>
        +viewOwnProjects()
        +viewOwnBriefs()
        +viewOwnRoadmap()
        +completeWizard()
        +viewInvoices()
        ___
        RLS scope: own org_id + own user_id
        UI access: Client dashboard only
    }

    class Guest {
        <<role: guest>>
        +browseMarketingSite()
        +startWizard()
        +saveToLocalStorage()
        ___
        RLS scope: NONE - no DB access
        UI access: Marketing site + wizard
        Persistence: localStorage only
    }

    class Organization {
        <<multi-tenant>>
        +UUID org_id
        +String name
        +String plan
        +enforceRLS()
        ___
        Every table has org_id column
        RLS filters ALL queries by org_id
    }

    class SupabaseAuth {
        <<service>>
        +signUp(email, password)
        +signIn(email, password)
        +signInWithGoogle()
        +getSession()
        +refreshToken()
        +signOut()
        ___
        JWT contains user_id and email
        Profile lookup maps to org_id + role
    }

    Role <|-- Owner
    Role <|-- Consultant
    Role <|-- Client
    Role <|-- Guest

    Organization "1" --> "1..*" Owner : has
    Organization "1" --> "0..*" Consultant : employs
    Organization "1" --> "0..*" Client : serves

    SupabaseAuth --> Role : assigns
    SupabaseAuth --> Organization : scopes to
```

## Security Hardening Checklist

```mermaid
---
config:
  theme: forest
---
flowchart TB
    subgraph Transport["Transport Security"]
        direction LR
        HTTPS["All connections HTTPS/TLS"]
        WSS["WebSocket via WSS"]
        HSTS["HSTS headers enabled"]
    end

    subgraph DataProtection["Data Protection"]
        direction LR
        MaskedLogs["Sensitive data masked in logs<br/>No PII in ai_run_logs"]
        NoLeaks["Error messages do not<br/>leak internal details"]
        EncryptedSecrets["Secrets in env vars only<br/>Never in client bundle"]
    end

    subgraph ClientSecurity["Client-Side Security"]
        direction LR
        NoKeys["Zero API keys in<br/>client-side code"]
        CSP["Content Security Policy<br/>headers configured"]
        XSS["Input sanitization<br/>on all user inputs"]
    end

    subgraph AuthSecurity["Authentication Security"]
        direction LR
        RateLimit["Rate limiting on<br/>auth endpoints"]
        JWTExpiry["Short JWT expiry<br/>with refresh tokens"]
        PasswordHash["Passwords hashed<br/>via Supabase Auth bcrypt"]
    end

    subgraph AuditTrail["Audit & Monitoring"]
        direction LR
        AILogs["ai_run_logs table<br/>tracks all AI calls"]
        AuthEvents["Auth events logged"]
        ErrorTracking["Error tracking<br/>with masked details"]
    end

    Transport --> DataProtection --> ClientSecurity --> AuthSecurity --> AuditTrail

    classDef sectionNode fill:#F1EEEA,stroke:#0A211F,stroke-width:2px,color:#0A211F
    classDef transportNode fill:#1a5c3a,stroke:#84CC16,stroke-width:1px,color:#F1EEEA
    classDef dataNode fill:#0A211F,stroke:#84CC16,stroke-width:1px,color:#F1EEEA
    classDef clientNode fill:#1a5c3a,stroke:#84CC16,stroke-width:1px,color:#F1EEEA
    classDef authNode fill:#0A211F,stroke:#84CC16,stroke-width:1px,color:#F1EEEA
    classDef auditNode fill:#1a5c3a,stroke:#84CC16,stroke-width:1px,color:#F1EEEA

    class HTTPS,WSS,HSTS transportNode
    class MaskedLogs,NoLeaks,EncryptedSecrets dataNode
    class NoKeys,CSP,XSS clientNode
    class RateLimit,JWTExpiry,PasswordHash authNode
    class AILogs,AuthEvents,ErrorTracking auditNode
```
