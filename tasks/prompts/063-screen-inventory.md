# 063: Screen Inventory — All Pages and Routes

> Complete list of every screen in the application with status

---

## Public Routes (Marketing Site)

| Route | Component | Status | Content Source |
|-------|-----------|--------|---------------|
| `/` | HomePageV3 | Complete | Static |
| `/home-v1` | HomePage | Complete | Static |
| `/home-v4` | HomePageV2 | Complete | Static |
| `/solutions` | SolutionsPage | Complete | Static |
| `/about` | AboutPage | Complete | Static |
| `/process` | ProcessPage | Complete | Static |
| `/projects` | ProjectsPage | Complete | Static |
| `/agents` | AgentsLandingPage | Complete | Static |
| `/chatbots` | ChatbotsPage | Complete | Static |
| `/booking` | BookingPage | Complete | Static |
| `/financial` | FinancialServicesPage | Complete | Static |
| `/industries/healthcare` | IndustryPage | Complete | Static |
| `/industries/ecommerce` | EcommercePage | Complete | Static |
| `/industries/fashion` | FashionPage | Complete | Static |
| `/industries/travel` | TravelPage | Complete | Static |
| `/industries/financial` | FinancialPage | Complete | Static |

---

## Wizard Routes

| Route | Component | Status | Data Source |
|-------|-----------|--------|------------|
| `/wizard` | WizardShell | Complete | localStorage + Supabase |
| Step 1 | StepBusinessContext | Complete | aiApi.analyzeBusiness |
| Step 2 | StepIndustryDiagnostics | Complete | aiApi.industryDiagnostics |
| Step 3 | StepSystemRecommendations | Complete | aiApi.systemRecommendations |
| Step 4 | StepExecutiveSummary | Complete | aiApi.readinessScore |
| Step 5 | StepLaunchProject | Complete | aiApi.generateRoadmap |

---

## Auth Routes

| Route | Component | Status |
|-------|-----------|--------|
| `/auth/login` | LoginPage | Complete |
| `/auth/signup` | SignupPage | Complete |
| `/auth/callback` | AuthCallback | Complete |
| `/auth/forgot-password` | ForgotPasswordPage | Planned |

---

## Dashboard Routes (Protected)

| Route | Component | Status | Data Wired |
|-------|-----------|--------|------------|
| `/app` | DashboardOverview | UI Built | No backend |
| `/app/clients` | ClientsPage | Planned | No |
| `/app/clients/:id` | ClientDetailPage | Planned | No |
| `/app/pipeline` | PipelinePage | Planned | No |
| `/app/agents` | AgentsPage | Complete | Realtime wired |
| `/app/documents` | DocumentsPage | Planned | No |
| `/app/financial` | FinancialPage | Planned | No |
| `/app/workflows` | WorkflowsPage | Planned | No |
| `/app/analytics` | AnalyticsPage | Planned | No |
| `/app/services` | ServicesCatalogPage | Planned | No |
| `/app/settings` | SettingsPage | Planned | No |
| `/app/roadmap` | RoadmapPage | Planned | No |

---

## Screen Content Requirements

### Dashboard Overview
- **Stats Cards:** Total clients, Active projects, Pipeline value, Health score avg
- **Activity Feed:** Recent activities (last 20)
- **Pipeline Summary:** Deals by stage (mini chart)
- **AI Insights:** Latest agent recommendations
- **Quick Actions:** New client, New deal, Run analysis

### Client Management
- **List View:** Filterable/sortable table of clients
- **Detail View:** Client profile + contacts + deals + interactions + activities
- **Forms:** Create/edit client, Add contact, Log interaction
- **Health Dashboard:** Score breakdown, trend chart, risk indicators

### CRM Pipeline
- **Kanban Board:** Stages as columns, deals as cards
- **Drag-Drop:** Move deals between stages
- **Deal Cards:** Title, amount, probability, close date, owner
- **Filters:** By pipeline, owner, date range, amount

### AI Agents
- **Agent Grid:** Card per agent with status, last run, success rate
- **Run History:** Timeline of agent executions
- **Live Monitor:** Realtime run status via WebSocket
- **Configuration:** Agent parameters, schedules

### Financial
- **Revenue Dashboard:** MRR, ARR, revenue by client
- **Invoice List:** Status, amount, due date
- **Payment Tracking:** Received, pending, overdue
- **Projections:** AI-generated revenue forecast

### Documents
- **Document Library:** Grid/list view with search
- **Upload:** Drag-drop file upload to Supabase Storage
- **Categorization:** Tags, client/project association
- **AI Processing:** Auto-extract metadata via Extractor agent

### Workflows
- **Workflow List:** Active/inactive workflows
- **Builder:** Visual workflow step editor
- **Execution Log:** Run history with status
- **Templates:** Pre-built workflow templates

### Analytics
- **Metric Cards:** KPIs with trend indicators
- **Charts:** Activity over time, deal conversion funnel, client growth
- **AI Insights:** Auto-generated observations
- **Export:** PDF/CSV report generation
