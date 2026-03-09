# 058: Frontend-Backend Wiring Map

> Complete map of which frontend components connect to which backend endpoints
> **Last verified:** 2026-03-09 (v0.24.1)

---

## API Layer (src/lib/supabase.ts)

### aiApi — Wizard AI Endpoints
| Method | Edge Function Route | Wizard Step | Status |
|--------|-------------------|-------------|--------|
| `analyzeBusiness(data)` | `POST /analyze-business` | Step 1 | Wired |
| `industryDiagnostics(data)` | `POST /industry-diagnostics` | Step 2 | Wired |
| `systemRecommendations(data)` | `POST /system-recommendations` | Step 3 | Wired |
| `readinessScore(sessionId)` | `POST /readiness-score` | Step 4 | Wired |
| `generateRoadmap(data)` | `POST /generate-roadmap` | Step 5 | Wired |
| `dashboardInsights(data, token)` | `POST /dashboard-insights` | Dashboard Home | Wired |

### wizardApi — Session Persistence
| Method | Supabase Table | Component | Status |
|--------|---------------|-----------|--------|
| `save(sessionId, state)` | wizard_sessions, wizard_answers | WizardContext | Wired |
| `load(sessionId)` | wizard_sessions, wizard_answers | WizardContext | Wired |

### authApi — Authentication (5 methods)
| Method | Backend | Component | Status |
|--------|---------|-----------|--------|
| `signup(email, password, name)` | `POST /signup` edge function | SignupPage | Wired |
| `signIn(email, password)` | Supabase Auth client | LoginPage | Wired |
| `signInWithGoogle(returnPath?)` | Supabase OAuth (Google) | LoginPage | Wired |
| `signInWithLinkedIn(returnPath?)` | Supabase OAuth (linkedin_oidc) | LoginPage | Wired |
| `signOut()` | Supabase Auth client | DashboardSidebar | Wired |
| `getSession()` | Supabase Auth client | AuthContext | Wired |

### agentApi — AI Agent Management (3 methods)
| Method | Edge Function Route | Component | Status |
|--------|-------------------|-----------|--------|
| `getRunLogs(params, token)` | `GET /ai/run-logs` | RunHistoryTable | Wired |
| `getAggregateStats(token)` | `GET /ai/aggregate-stats` | AgentSummaryHeader, PerformanceChart | Wired |
| `getCacheStats(token)` | `GET /ai/cache-stats` | CacheStatsPanel | Wired |

### crmApi — Client Management (6 methods)
| Method | Edge Function Route | Component | Status |
|--------|-------------------|-----------|--------|
| `listClients(token)` | `GET /crm/clients` | ClientsPage | Wired |
| `getClient(id, token)` | `GET /crm/clients/:id` | ClientDetailPage | Wired |
| `createClient(data, token)` | `POST /crm/clients` | ClientsPage | Wired |
| `updateClient(id, data, token)` | `PUT /crm/clients/:id` | ClientDetailPage | Wired |
| `deleteClient(id, token)` | `DELETE /crm/clients/:id` | ClientsPage | Wired |
| `createContact(clientId, data, token)` | `POST /crm/clients/:id/contacts` | ClientDetailPage | Wired |

### pipelineApi — CRM Pipeline Kanban (9 methods)
| Method | Edge Function Route | Component | Status |
|--------|-------------------|-----------|--------|
| `listPipelines(token)` | `GET /crm/pipelines` | CRMPipelinePage | Wired |
| `getPipeline(id, token)` | `GET /crm/pipelines/:id` | CRMPipelinePage | Wired |
| `createDeal(data, token)` | `POST /crm/deals` | DealQuickCreate | Wired |
| `getDeal(id, token)` | `GET /crm/deals/:id` | DealDetailPanel | Wired |
| `updateDeal(id, updates, token)` | `PUT /crm/deals/:id` | StageColumn (drag-drop) | Wired |
| `deleteDeal(id, token)` | `DELETE /crm/deals/:id` | DealDetailPanel | Wired |
| `logInteraction(data, token)` | `POST /crm/interactions` | DealDetailPanel | Wired |
| `getInteractions(dealId, token)` | `GET /crm/deals/:id/interactions` | DealDetailPanel | Wired |
| `listContacts(token)` | `GET /crm/contacts` | DealQuickCreate | Wired |

### documentApi — Document Management (7 methods)
| Method | Edge Function Route | Component | Status |
|--------|-------------------|-----------|--------|
| `list(params, token)` | `GET /documents` | DocumentManagementPage | Wired |
| `get(id, token)` | `GET /documents/:id` | DocumentManagementPage | Wired |
| `upload(file, meta, token)` | `POST /documents/upload` (FormData) | DocumentManagementPage | Wired |
| `update(id, updates, token)` | `PUT /documents/:id` | DocumentManagementPage | Wired |
| `delete(id, token)` | `DELETE /documents/:id` | DocumentManagementPage | Wired |
| `share(id, expiresIn, token)` | `POST /documents/:id/share` | DocumentManagementPage | Wired |
| `getStats(token)` | `GET /documents/stats` | DocumentManagementPage | Wired |

### workflowApi — Workflow Automation (9 methods)
| Method | Edge Function Route | Component | Status |
|--------|-------------------|-----------|--------|
| `list(token)` | `GET /dashboard/workflows` | WorkflowAutomationPage | Wired |
| `create(data, token)` | `POST /dashboard/workflows` | WorkflowAutomationPage | Wired |
| `update(id, data, token)` | `POST /dashboard/workflows` (with id) | WorkflowAutomationPage | Wired |
| `delete(id, token)` | `DELETE /dashboard/workflows/:id` | WorkflowAutomationPage | Wired |
| `toggle(id, status, token)` | `POST /dashboard/workflows/toggle` | WorkflowAutomationPage | Wired |
| `getMetrics(token)` | `GET /dashboard/workflows/metrics` | WorkflowAutomationPage | Wired |
| `getExecutions(workflowId, token)` | `GET /dashboard/workflows/executions` | WorkflowAutomationPage | Wired |
| `run(workflowId, dryRun, token)` | `POST /dashboard/workflows/run` | WorkflowAutomationPage | Wired |
| `installTemplate(template, token)` | `POST /dashboard/workflows/install-template` | WorkflowAutomationPage | Wired |

### financialApi — Financial Dashboard (9 methods)
| Method | Edge Function Route | Component | Status |
|--------|-------------------|-----------|--------|
| `getMetrics(token)` | `GET /dashboard/financial/metrics` | FinancialDashboardPage | Wired |
| `listInvoices(params, token)` | `GET /dashboard/financial/invoices` | FinancialDashboardPage | Wired |
| `createInvoice(data, token)` | `POST /dashboard/financial/invoices` | FinancialDashboardPage | Wired |
| `updateInvoice(id, updates, token)` | `PUT /dashboard/financial/invoices/:id` | FinancialDashboardPage | Wired |
| `deleteInvoice(id, token)` | `DELETE /dashboard/financial/invoices/:id` | FinancialDashboardPage | Wired |
| `sendReminder(id, token)` | `POST /dashboard/financial/invoices/:id/reminder` | FinancialDashboardPage | Wired |
| `recordPayment(data, token)` | `POST /dashboard/financial/payments/record` | FinancialDashboardPage | Wired |
| `listPayments(invoiceId, token)` | `GET /dashboard/financial/payments` | FinancialDashboardPage | Wired |
| `getCharts(token)` | `GET /dashboard/financial/charts` | FinancialDashboardPage | Wired |
| `getProfitability(token)` | `GET /dashboard/financial/profitability` | FinancialDashboardPage | Wired |

### strategyApi — Lean Strategy Engine (14 methods)
| Method | Edge Function Route | Component | Status |
|--------|-------------------|-----------|--------|
| `getCanvas(params, token)` | `GET /strategy/canvas` | StrategyEnginePage | Wired |
| `createCanvas(data, token)` | `POST /strategy/canvas` | StrategyEnginePage | Wired |
| `updateCanvasBlocks(id, blocks, summary, token)` | `PUT /strategy/canvas/:id` | StrategyEnginePage | Wired |
| `getCanvasVersions(canvasId, token)` | `GET /strategy/canvas/:id/versions` | CanvasVersionHistory | Wired |
| `listInsights(params, token)` | `GET /strategy/insights` | IntelligencePanel | Wired |
| `updateInsight(id, updates, token)` | `PUT /strategy/insights/:id` | IntelligencePanel | Wired |
| `listOpportunities(token)` | `GET /strategy/opportunities` | IntelligencePanel | Wired |
| `updateOpportunity(id, updates, token)` | `PUT /strategy/opportunities/:id` | IntelligencePanel | Wired |
| `listRecommendations(params, token)` | `GET /strategy/recommendations` | IntelligencePanel | Wired |
| `approveRecommendation(id, approved, comment, token)` | `POST /strategy/recommendations/:id/approve` | IntelligencePanel | Wired |
| `getActions(params, token)` | `GET /strategy/actions` | StrategyEnginePage | Wired |
| `getMetrics(token)` | `GET /strategy/metrics` | StrategyEnginePage | Wired |
| `runAnalysis(canvasId, sessionId, token)` | `POST /strategy/analyze` | AnalysisProgressSheet | Wired |
| `synthesizeBlock(canvasId, block, context, token)` | `POST /strategy/synthesize-block` | CanvasBlockEditor | Wired |

---

## Realtime Channels

| Channel | Table/Event | Component | Hook | Status |
|---------|------------|-----------|------|--------|
| `ai-runs` | `ai_run_logs` INSERT | AgentsPage | `useRealtimeAIRuns` | Wired (v0.24.1) |
| `wizard-progress-{id}` | `wizard_sessions` UPDATE | WizardContext | `useRealtimeWizardSync` | Wired (v0.24.1) |

**Prerequisites for Realtime:**
1. Enable Realtime on `ai_run_logs` table: Supabase Dashboard > Database > Replication > Toggle on
2. Enable Realtime on `wizard_sessions` table: Same process
3. Both hooks degrade gracefully — if Realtime is not enabled, AgentsPage falls back to manual Refresh and wizard continues with localStorage + cloud save

**Realtime Architecture:**
- Generic hook: `useSupabaseRealtime` — manages channel lifecycle, status tracking, reconnection
- `useRealtimeAIRuns` — throttled (3s) auto-refresh on new AI runs, live indicator with event count
- `useRealtimeWizardSync` — session-scoped UPDATE listener with self-write filtering (3s window), multi-tab sync toast, backend completion notification

---

## Dashboard Data Flow

All dashboard pages go through **Edge Function APIs** — no direct `supabase.from()` calls from frontend components. The data flow is:

```
Frontend Component → API module (lib/supabase.ts) → Edge Function → Supabase Tables / KV Store
```

| Dashboard Page | API Module | Auth Pattern | Data Source |
|---|---|---|---|
| DashboardHome | `useDashboardData` hook + `aiApi.dashboardInsights()` | `useAuth()` + fresh token | wizard_sessions + Gemini AI |
| AgentsPage | `agentApi.*()` | anonKey (service-role on server) | ai_run_logs, ai_cache |
| ClientsPage | `crmApi.*()` | `useAuth()` + fresh token | clients, crm_contacts |
| CRMPipelinePage | `pipelineApi.*()` | `useAuth()` + fresh token | crm_pipelines, crm_stages, crm_deals |
| DocumentManagementPage | `documentApi.*()` | `useAuth()` + fresh token | Supabase Storage + KV metadata |
| WorkflowAutomationPage | `workflowApi.*()` | `useAuth()` + fresh token | KV store |
| FinancialDashboardPage | `financialApi.*()` | `useAuth()` + fresh token | KV store |
| StrategyEnginePage | `strategyApi.*()` | `useAuth()` + fresh token | 12 strategy tables |

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
        LG[/login LoginPage]
        CB[/auth/callback AuthCallbackPage]
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
        DO[/app/dashboard DashboardHome]
        DS[/app/strategy StrategyEnginePage]
        DC[/app/clients ClientsPage]
        DP[/app/crm/pipelines PipelinePage]
        DA[/app/agents AgentsPage]
        DD[/app/documents DocumentsPage]
        DF[/app/financial FinancialPage]
        DW[/app/workflows WorkflowsPage]
        DI[/app/insights InsightsPage]
        DST[/app/settings SettingsPage]
    end

    WZ --> S1 -->|aiApi.analyzeBusiness| AB[analyze-business]
    S2 -->|aiApi.industryDiagnostics| GD[industry-diagnostics]
    S3 -->|aiApi.systemRecommendations| RS[system-recommendations]
    S4 -->|aiApi.readinessScore| AR[readiness-score]
    S5 -->|aiApi.generateRoadmap| GR[generate-roadmap]

    DO -->|aiApi.dashboardInsights| DIN[dashboard-insights]
    DO -->|useDashboardData| WSD[wizard session data]
    DS -->|strategyApi.*| STRAT[14 strategy routes]
    DC -->|crmApi.*| CRM[6 CRM routes]
    DP -->|pipelineApi.*| PIPE[9 pipeline routes]
    DA -->|agentApi.*| AGENT[3 agent routes]
    DD -->|documentApi.*| DOC[7 document routes]
    DF -->|financialApi.*| FIN[10 financial routes]
    DW -->|workflowApi.*| WORK[9 workflow routes]

    DA -.->|useRealtimeAIRuns| RT1[Realtime: ai_run_logs INSERT]
    WZ -.->|useRealtimeWizardSync| RT2[Realtime: wizard_sessions UPDATE]
```

---

## Server Route Summary (63 total)

| Module | File | Route Count | Mount Method |
|--------|------|-------------|--------------|
| Health | index.tsx | 1 | Direct |
| Auth | index.tsx | 1 | Direct |
| Wizard | wizard-routes.tsx | 4 | Sub-router |
| AI | ai-routes.tsx | 2 | Sub-router |
| Dashboard Insights | index.tsx | 1 | Direct (Hono 404 fix) |
| Agent Stats | ai-routes.tsx | 3 | Sub-router |
| CRM Clients | crm-routes.tsx | 6 | Sub-router |
| CRM Pipeline | pipeline-routes.tsx | 9 | Sub-router |
| Documents | document-routes.tsx | 7 | Sub-router |
| Workflows | workflow-routes.tsx | 9 | Sub-router |
| Financial | financial-routes.tsx | 10 | Sub-router |
| Strategy | strategy-routes.tsx | 14 | Sub-router (direct-registered) |

---

## Previous Blockers — ALL RESOLVED

| # | Blocker | Resolution | Version |
|---|---------|-----------|---------|
| 1 | Dashboard overview — no data endpoint | `useDashboardData` hook + `aiApi.dashboardInsights()` | v0.13.0 |
| 2 | Client management CRUD not wired | `crmApi` — 6 methods | v0.15.0 |
| 3 | CRM pipeline drag-drop needs mutations | `pipelineApi.updateDeal()` | v0.19.0 |
| 4 | Invoice/payment creation not built | `financialApi` — 9 methods | v0.22.0 |
| 5 | Document upload not configured | `documentApi.upload()` with Supabase Storage | v0.20.0 |
| 6 | No workflow engine | `workflowApi` — 9 methods | v0.22.0 |
| 7 | No analytics/chart endpoints | `financialApi.getCharts()`, `strategyApi.getMetrics()` | v0.22.0 |
| 8 | Realtime channels not implemented | `useRealtimeAIRuns` + `useRealtimeWizardSync` | v0.24.1 |
