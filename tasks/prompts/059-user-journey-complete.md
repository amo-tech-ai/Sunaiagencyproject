# 059: Complete User Journey — End-to-End Flow

> Every touchpoint from first visit to active dashboard user

---

## Journey Phases

```mermaid
flowchart TD
    subgraph "Phase 1: Discovery"
        V1[Visit Homepage]
        V2[Browse Solutions]
        V3[View Industry Page]
        V4[Check Process]
        V5[View Case Studies]
    end

    subgraph "Phase 2: Wizard (Pre-Auth)"
        W1[Start Wizard]
        W2[Step 1: Company Info]
        W3[Step 2: Industry Diagnostics]
        W4[Step 3: System Recommendations]
        W5[Step 4: Executive Summary]
        W6[Step 5: Launch Project]
    end

    subgraph "Phase 3: Authentication"
        A1[Sign Up / Login]
        A2[Email Verification]
        A3[Profile Created]
        A4[Org + Team Member Auto-Created]
    end

    subgraph "Phase 4: Dashboard Onboarding"
        D1[Dashboard Overview]
        D2[Client Auto-Created from Wizard]
        D3[Project Auto-Created]
        D4[Roadmap Generated]
        D5[Initial Tasks Created]
    end

    subgraph "Phase 5: Active Usage"
        U1[Manage Clients]
        U2[Track Deals in Pipeline]
        U3[Monitor AI Agents]
        U4[Review Documents]
        U5[Track Financials]
        U6[Run Workflows]
    end

    V1 --> V2 --> V3 --> W1
    V4 --> W1
    V5 --> W1
    W1 --> W2 -->|AI: analyze-business| W3
    W3 -->|AI: generate-diagnostics| W4
    W4 -->|AI: recommend-systems| W5
    W5 -->|AI: assess-readiness| W6
    W6 -->|AI: generate-roadmap| A1

    A1 --> A2 --> A3 -->|handle_new_user trigger| A4
    A4 --> D1
    D1 -->|handle_wizard_completion| D2
    D2 --> D3 --> D4 --> D5

    D5 --> U1 & U2 & U3 & U4 & U5 & U6
```

---

## Phase 1: Discovery (Marketing Site)

| Screen | Route | Key Actions | CTA |
|--------|-------|-------------|-----|
| Homepage | `/` | View hero, metrics, testimonials | "Start Discovery" |
| Solutions | `/solutions` | Browse AI service offerings | "Book Consultation" |
| Industry | `/industries/healthcare` etc. | Industry-specific value props | "Start Wizard" |
| Process | `/process` | Understand methodology | "Begin Assessment" |
| Projects | `/projects` | View case studies | "See Results" |
| Booking | `/booking` | Schedule a call | Calendar embed |

**Data:** All static/hardcoded in `src/lib/constants.ts` and `src/lib/data/`

---

## Phase 2: Wizard (5 Steps, Pre-Auth)

| Step | Component | AI Call | Fallback | Time |
|------|-----------|--------|----------|------|
| 1 | StepBusinessContext | analyze-business | Manual input | 2 min |
| 2 | StepIndustryDiagnostics | generate-diagnostics | Local signal detection | 3 min |
| 3 | StepSystemRecommendations | recommend-systems | Static scoring | 2 min |
| 4 | StepExecutiveSummary | assess-readiness | Mock templates | 3 min |
| 5 | StepLaunchProject | generate-roadmap | Static 3-phase | 1 min |

**State:** localStorage primary, cloud backup via wizardApi
**Session:** Created server-side, stored in `sun-ai-wizard-session-id`

---

## Phase 3: Authentication

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant SB as Supabase Auth
    participant DB as Database
    participant TR as Trigger

    U->>FE: Click "Enter Dashboard"
    FE->>SB: signUp(email, password)
    SB->>U: Verification email
    U->>SB: Confirm email
    SB->>TR: auth.users INSERT
    TR->>DB: handle_new_user()
    DB->>DB: INSERT profiles
    DB->>DB: INSERT organizations
    DB->>DB: INSERT team_members
    FE->>FE: Redirect to /app
```

---

## Phase 4: Dashboard Onboarding

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant DB as Database
    participant EF as Edge Functions

    FE->>DB: Load wizard_session data
    FE->>DB: handle_wizard_completion()
    DB->>DB: INSERT clients (from wizard step1)
    DB->>DB: INSERT projects (AI Transformation)
    DB->>DB: INSERT roadmaps + roadmap_phases
    DB->>DB: INSERT briefs (from step4)
    EF->>DB: task-generator creates 12 initial tasks
    FE->>FE: Show dashboard with populated data
```

---

## Phase 5: Active Usage

| Feature | Route | Key Operations |
|---------|-------|---------------|
| Client Management | /app/clients | CRUD clients, contacts, health scores |
| CRM Pipeline | /app/pipeline | Drag deals between stages, track revenue |
| AI Agents | /app/agents | Monitor agent runs, view insights |
| Documents | /app/documents | Upload, categorize, search docs |
| Financial | /app/financial | Invoices, payments, revenue tracking |
| Workflows | /app/workflows | Automated task sequences |
| Analytics | /app/analytics | Performance dashboards, metrics |
| Services | /app/services | Service catalog, system assignments |

---

## Conversion Metrics to Track

| Event | Trigger | Measurement |
|-------|---------|-------------|
| Wizard Start | Step 1 loaded | Funnel entry |
| Wizard Complete | Step 5 CTA clicked | Wizard completion rate |
| Sign Up | Auth success | Conversion rate |
| Dashboard Active | First client action | Activation rate |
| Deal Created | First crm_deal INSERT | Revenue engagement |
| Agent Used | First ai_run_log | AI adoption |
