# 062: Architecture Diagrams (Mermaid)

> System architecture, data flows, and deployment topology

---

## 1. High-Level System Architecture

```mermaid
flowchart TB
    subgraph "Frontend (Vercel)"
        SPA[React SPA]
        RT[React Router v7]
        SC[Supabase Client]
        RC[Realtime Client]
    end

    subgraph "Supabase Platform"
        subgraph "Edge Functions (Deno)"
            WF[Wizard Functions x5]
            AF[Agent Functions x10]
            CF[CRM Intelligence]
            IF[Infrastructure]
        end

        subgraph "PostgreSQL"
            TB[32 Tables]
            RLS[Row Level Security]
            TG[Triggers + Functions]
            RL[Realtime Engine]
        end

        AU[Supabase Auth]
        ST[Supabase Storage]
    end

    subgraph "External APIs"
        GM[Google Gemini API]
    end

    SPA --> SC --> TB
    SPA --> RC --> RL
    SPA --> AU
    SC --> WF & AF & CF
    WF & AF & CF --> GM
    WF & AF & CF --> TB
    TG --> RL
```

---

## 2. Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as React SPA
    participant SA as Supabase Auth
    participant DB as PostgreSQL
    participant TG as handle_new_user()

    U->>FE: Click "Sign Up"
    FE->>SA: supabase.auth.signUp()
    SA->>U: Verification email
    U->>SA: Confirm email link
    SA-->>DB: INSERT auth.users
    DB->>TG: AFTER INSERT trigger
    TG->>DB: INSERT profiles
    TG->>DB: INSERT organizations
    TG->>DB: INSERT team_members
    SA->>FE: Session token (JWT)
    FE->>FE: Redirect to /app
    FE->>DB: Load dashboard data (RLS-scoped)
```

---

## 3. Wizard Data Flow

```mermaid
flowchart LR
    subgraph "Step 1"
        S1[Company Info Form]
        AB[analyze-business]
    end

    subgraph "Step 2"
        S2[Industry Questions]
        GD[generate-diagnostics]
        LS[Local Signal Detection]
    end

    subgraph "Step 3"
        S3[System Selection]
        RS[recommend-systems]
    end

    subgraph "Step 4"
        S4[Brief Editor]
        AR[assess-readiness]
    end

    subgraph "Step 5"
        S5[Launch Confirmation]
        GR[generate-roadmap]
    end

    S1 -->|company data| AB -->|enrichment| S1
    S1 -->|state| S2
    S2 -->|answers| GD -->|AI signals| S2
    S2 -->|signals| LS -->|local signals| S2
    S2 -->|state| S3
    S3 -->|systems| RS -->|ranking| S3
    S3 -->|state| S4
    S4 -->|sessionId| AR -->|brief + score| S4
    S4 -->|state| S5
    S5 -->|config| GR -->|roadmap| S5

    S1 & S2 & S3 & S4 & S5 -->|auto-save| LS2[localStorage]
    LS2 -->|debounced 2s| WS[wizard_sessions]
```

---

## 4. CRM Entity Relationships

```mermaid
erDiagram
    organizations {
        uuid id PK
        text name
    }

    clients {
        uuid id PK
        uuid org_id FK
        text name
        text lifecycle_stage
        integer health_score
        uuid assigned_to FK
    }

    crm_contacts {
        uuid id PK
        uuid org_id FK
        uuid client_id FK
        text first_name
        text email
        boolean is_primary
    }

    crm_pipelines {
        uuid id PK
        uuid org_id FK
        text name
        boolean is_default
    }

    crm_stages {
        uuid id PK
        uuid pipeline_id FK
        text name
        integer probability
        integer display_order
    }

    crm_deals {
        uuid id PK
        uuid org_id FK
        uuid client_id FK
        uuid stage_id FK
        text title
        numeric amount
        text status
    }

    crm_interactions {
        uuid id PK
        uuid org_id FK
        uuid client_id FK
        uuid deal_id FK
        uuid contact_id FK
        text type
        text sentiment
    }

    organizations ||--o{ clients : has
    organizations ||--o{ crm_pipelines : has
    clients ||--o{ crm_contacts : has
    clients ||--o{ crm_deals : has
    clients ||--o{ crm_interactions : has
    crm_pipelines ||--o{ crm_stages : has
    crm_stages ||--o{ crm_deals : in_stage
    crm_deals ||--o{ crm_interactions : has
    crm_contacts ||--o{ crm_interactions : participates
```

---

## 5. Deployment Topology

```mermaid
flowchart TB
    subgraph "Client Browser"
        B[React SPA Bundle]
    end

    subgraph "Vercel CDN"
        V[Static Hosting]
        VR[SPA Rewrite Rules]
    end

    subgraph "Supabase Cloud (us-west-2)"
        subgraph "Edge Network"
            EF[Edge Functions - Deno Runtime]
        end
        subgraph "Database"
            PG[(PostgreSQL 17)]
            PGV[pgvector extension]
        end
        subgraph "Services"
            AUTH[GoTrue Auth]
            REAL[Realtime WebSocket]
            STOR[Storage / S3]
            REST[PostgREST API]
        end
    end

    subgraph "Google Cloud"
        GEM[Gemini API]
    end

    B --> V
    V --> VR --> B
    B -->|HTTPS| REST
    B -->|WSS| REAL
    B -->|HTTPS| AUTH
    B -->|HTTPS| EF
    EF -->|HTTPS| GEM
    EF --> PG
    REST --> PG
```

---

## 6. Realtime Event Flow

```mermaid
sequenceDiagram
    participant EF as Edge Function
    participant DB as PostgreSQL
    participant TG as Trigger Function
    participant RL as Realtime Engine
    participant FE as Frontend

    EF->>DB: INSERT ai_run_logs
    DB->>TG: broadcast_ai_run_insert()
    TG->>RL: pg_notify('realtime', payload)
    RL->>FE: WebSocket: ai-run event
    FE->>FE: Update AgentsPage UI

    Note over EF,FE: Same pattern for wizard_sessions updates
```

---

## 7. Multi-Tenant Data Isolation

```mermaid
flowchart TD
    U[Authenticated User]
    U -->|auth.uid()| TM[team_members]
    TM -->|org_id| ORG[organizations]

    ORG -->|RLS Filter| C[clients WHERE org_id = ...]
    ORG -->|RLS Filter| P[projects WHERE org_id = ...]
    ORG -->|RLS Filter| D[crm_deals WHERE org_id = ...]
    ORG -->|RLS Filter| A[activities WHERE org_id = ...]

    style ORG fill:#e6f4ed,stroke:#00875a
    style TM fill:#e6f4ed,stroke:#00875a
```
