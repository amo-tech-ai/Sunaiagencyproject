# 058: Frontend-Backend Wiring Map

> Complete map of which frontend components connect to which backend endpoints

---

## API Layer (src/lib/supabase.ts)

### aiApi — Wizard AI Endpoints
| Method | Edge Function | Wizard Step | Status |
|--------|--------------|-------------|--------|
| `analyzeBusiness(data)` | `analyze-business` | Step 1 | Wired |
| `industryDiagnostics(data)` | `generate-diagnostics` | Step 2 | Wired |
| `systemRecommendations(data)` | `recommend-systems` | Step 3 | Wired |
| `readinessScore(sessionId)` | `assess-readiness` | Step 4 | Wired |
| `generateRoadmap(data)` | `generate-roadmap` | Step 5 | Wired |

### wizardApi — Session Persistence
| Method | Supabase Table | Component | Status |
|--------|---------------|-----------|--------|
| `save(state)` | wizard_sessions, wizard_answers | WizardContext | Wired |
| `load(sessionId)` | wizard_sessions, wizard_answers | WizardContext | Wired |

### Dashboard API — NOT YET WIRED
| Needed Endpoint | Edge Function | Dashboard Page | Status |
|-----------------|--------------|----------------|--------|
| `GET /dashboard/overview` | analytics | OverviewPage | P4 |
| `GET /dashboard/activities` | analytics | ActivityPage | P4 |
| `GET /dashboard/readiness` | scorer | ReadinessPage | P4 |
| `GET /dashboard/metrics` | analytics | MetricsPage | P4 |
| `GET /dashboard/insights` | analyst | InsightsPage | Partial |

---

## Route-to-Component-to-Data Map

```mermaid
flowchart TD
    subgraph "Public Routes"
        HP[/ HomePageV3]
        SOL[/solutions SolutionsPage]
        IND[/industries/* IndustryPages]
        ABT[/about AboutPage]
        BK[/booking BookingPage]
    end

    subgraph "Auth Routes"
        LG[/auth/login LoginPage]
        SU[/auth/signup SignupPage]
    end

    subgraph "Wizard Routes"
        WZ[/wizard WizardShell]
        S1[Step1: BusinessContext]
        S2[Step2: IndustryDiagnostics]
        S3[Step3: SystemRecommendations]
        S4[Step4: ExecutiveSummary]
        S5[Step5: LaunchProject]
    end

    subgraph "Dashboard Routes (Protected)"
        DO[/app DashboardOverview]
        DC[/app/clients ClientsPage]
        DP[/app/pipeline PipelinePage]
        DA[/app/agents AgentsPage]
        DD[/app/documents DocumentsPage]
        DF[/app/financial FinancialPage]
        DW[/app/workflows WorkflowsPage]
        DAN[/app/analytics AnalyticsPage]
        DS[/app/services ServicesCatalogPage]
    end

    WZ --> S1 -->|aiApi.analyzeBusiness| AB[analyze-business]
    S2 -->|aiApi.industryDiagnostics| GD[generate-diagnostics]
    S3 -->|aiApi.systemRecommendations| RS[recommend-systems]
    S4 -->|aiApi.readinessScore| AR[assess-readiness]
    S5 -->|aiApi.generateRoadmap| GR[generate-roadmap]

    DO -.->|NOT WIRED| analytics
    DA -->|useRealtimeChannel| RT[Realtime: ai-runs]
```

---

## Supabase Direct Queries (Client-Side)

| Component | Table | Operation | RLS |
|-----------|-------|-----------|-----|
| WizardContext | wizard_sessions | SELECT, INSERT, UPDATE | Auth + Anon |
| WizardContext | wizard_answers | SELECT, INSERT, UPDATE | Auth + Anon |
| AgentsPage | ai_run_logs | SELECT (realtime) | Auth |
| PipelinePage | crm_pipelines, crm_stages, crm_deals | SELECT | Auth |
| ClientsPage | clients, crm_contacts | SELECT, INSERT, UPDATE | Auth |
| FinancialPage | invoices, payments | SELECT | Auth |
| DocumentsPage | documents | SELECT, INSERT | Auth |

---

## Realtime Channels

| Channel | Table/Event | Component | Status |
|---------|------------|-----------|--------|
| `ai-runs` | ai_run_logs INSERT | AgentsPage | Wired |
| `wizard-progress` | wizard_sessions UPDATE | WizardShell | Wired |

---

## Missing Wiring (Blockers)

1. **Dashboard overview** — No data endpoint. OverviewPage needs aggregated stats.
2. **Client management** — CRUD operations not wired to frontend forms.
3. **CRM pipeline** — Kanban drag-drop needs deal stage UPDATE mutations.
4. **Financial** — Invoice/payment creation forms not built.
5. **Documents** — File upload to Supabase Storage not configured.
6. **Workflows** — No workflow engine or state machine implemented.
7. **Analytics** — No aggregation queries or chart data endpoints.
