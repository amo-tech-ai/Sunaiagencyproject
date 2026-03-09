# TODO — Sun AI Agency Website

**Project:** Sun AI Agency — AI Consulting & Solutions Website
**Current Version:** v0.24.1
**Last Updated:** 2026-03-09

---

## IMMEDIATE PRIORITIES (This Sprint)

### Deployment Steps
- [ ] **Deploy Edge Function** — Deploy updated server with all 63 routes (49 prior + 14 strategy) to Supabase Edge Functions. Includes: Phase 8 documents, Phase 11 workflows, Phase 13 financial, CRM auth fix, dashboard-insights 404 fix, and **Phase 14 strategy engine** (14 endpoints mounted directly on main Hono app)
- [ ] **Run CRM Pipeline Migrations** — Execute `20260307120300_create_crm_pipeline_tables.sql` and `20260307120400_seed_default_pipeline_and_verify.sql` in Supabase SQL Editor to create `crm_pipelines`, `crm_stages`, `crm_deals`, `crm_interactions` tables and seed default pipelines
- [ ] **Run Strategy Engine Migration** — Execute `/imports/create-strategy-tables.txt` in Supabase SQL Editor to create 12 strategy tables (`lean_canvases`, `lean_canvas_versions`, `strategy_insights`, `automation_opportunities`, `strategy_recommendations`, `strategy_actions`, + 6 advanced tables). Verified against docs 15 and 16 with 5 extra indexes, append-only RLS on audit tables
- [ ] **Verify CRM Auth Fix** — Test `GET /crm/clients` and `GET /crm/pipelines` with both anonymous and authenticated tokens after deploy; confirm JWT decode anon detection works
- [ ] **Verify Document Storage** — The `make-283466b6-documents` bucket auto-creates on first upload; verify in Supabase Dashboard > Storage
- [ ] **Verify Strategy Engine** — Test `/app/strategy` page loads, canvas CRUD works, "Run Analysis" triggers 5-agent orchestration, version history saves/reverts
- [ ] **Watch for Hono Sub-Router 404s** — After deploy, test all AI routes (`/ai/generate`, `/ai/cache`, `/agent-stats/*`, etc.) for 404s caused by Hono sub-router mounting. If any 404, move route handler from `ai-routes.tsx` to direct registration in `index.tsx` (same fix applied to `/dashboard-insights` in v0.22.2 and all 14 strategy routes in v0.23.0)

### Smoke Testing — All Dashboard Phases
- [ ] Dashboard home loads at `/app/dashboard` with metrics
- [ ] Projects & Tasks page loads at `/app/projects`
- [ ] AI Insights page loads at `/app/insights`
- [ ] AI Agent Management page loads at `/app/agents`
- [ ] Settings page loads at `/app/settings`
- [ ] CRM Clients page loads at `/app/clients` without 401 errors
- [ ] CRM Pipeline page loads at `/app/crm/pipelines` with kanban board
- [ ] Documents page loads at `/app/documents`
- [ ] Workflows page loads at `/app/workflows`
- [ ] Financial page loads at `/app/financial`
- [ ] **Strategy Engine** loads at `/app/strategy` with 3-column layout (desktop) or 3-tab nav (mobile)

### Testing Checklist — Phase 14: Lean Strategy Engine
- [ ] Empty state shows "Create from Wizard" and "Start Fresh Canvas" CTAs
- [ ] "Start Fresh Canvas" creates blank 9-block Lean Canvas grid
- [ ] Click any block opens editor; save persists to backend
- [ ] Sparkle icon on block triggers "Ask AI" per-block synthesis
- [ ] "Run Analysis" button opens 5-agent animated progress overlay
- [ ] Analysis progress sheet shows phases A (data gathering) and B (synthesis)
- [ ] After analysis, Intelligence panel populates with insights/recommendations/opportunities
- [ ] Roadmap Execution panel shows phase cards with progress bars (from wizard data)
- [ ] "History" button opens version history side-sheet with timeline
- [ ] Version history supports view snapshot and revert-with-confirmation
- [ ] Mobile: 3-tab nav [Canvas|Roadmap|Intel] appears below 768px
- [ ] Mobile: tabs switch between panels correctly, pending badge shows count

### Testing Checklist — Phase 11: Workflow Automation
- [ ] Templates tab shows 5 pre-built templates
- [ ] Install template creates workflow in active list
- [ ] Create custom workflow via builder modal (trigger + conditions + actions)
- [ ] Toggle workflow enabled/disabled updates status badge
- [ ] Run Now executes workflow and adds entry to execution log
- [ ] Dry Run simulates without persisting execution
- [ ] Execution log shows expandable action results
- [ ] Metrics row shows runs today, success rate, avg time, active count

### Testing Checklist — Phase 13: Financial Dashboard
- [ ] Create Invoice modal saves draft invoice
- [ ] Invoice list shows with correct status badges
- [ ] Status filter tabs filter invoices (All/Draft/Sent/Paid/Overdue)
- [ ] Send action transitions draft -> sent
- [ ] Record Payment transitions sent/overdue -> paid
- [ ] Delete only works on draft invoices
- [ ] Revenue metrics row shows MRR, revenue, outstanding, overdue
- [ ] Revenue trend line chart renders (Recharts)
- [ ] Revenue by client horizontal bar chart renders
- [ ] Project profitability table shows margin colors (green/amber/red)

---

## PHASE COMPLETION STATUS

| Phase | Name | Status | Version |
|-------|------|--------|---------|
| 1 | Dashboard Shell + Home | Done | v0.12.0 |
| 2 | Roadmap + Activity | Done | v0.13.0 |
| 3 | AI Insights API | Done | v0.14.0 |
| 4 | Projects + Tasks | Done | v0.13.0 |
| 5 | Settings | Done | v0.13.0 |
| 6 | Client Management CRM | Done | v0.15.0 |
| 7 | CRM Pipeline Kanban | Done | v0.19.0 |
| 8 | Document Management | Done | v0.20.0 |
| 9 | AI Insights Full Page | Done | v0.15.0 |
| 10 | AI Agent Management | Done | v0.15.0 |
| 11 | Workflow Automation | Done | v0.22.0 |
| 12 | (Merged into Phase 8) | — | — |
| 13 | Financial Dashboard | Done | v0.22.0 |
| 14 | Lean Strategy Engine | Done | v0.24.0 |

**ALL 14 DASHBOARD PHASES COMPLETE** (26/26 strategy tasks) | CRM Auth Hardened in v0.22.1 | Hono 404 Fix in v0.22.2 | Sitemap v13 in v0.24.1

---

## COMPLETED — Phase 14: Lean Strategy Engine (v0.24.0)

> Full plan at `/docs/lean/00-lean-master-plan.md` (16 spec documents in `/docs/lean/`)
> Progress: **26 / 26 tasks** (100%) ✅

### Phase 14a — Core Canvas & Infrastructure ✅
- [x] **Types** — `/lib/types/strategy.ts` (20+ interfaces matching 12 tables)
- [x] **Backend** — `strategy-routes.tsx` with 14 route handlers
- [x] **Mount Routes** — All 14 routes registered directly on main Hono app (sub-router 404 workaround)
- [x] **API Layer** — `strategyApi` module in `lib/supabase.ts` (14 typed methods)
- [x] **Data Hook** — `useStrategyData` hook with 8 action methods
- [x] **Page Shell** — `StrategyEnginePage.tsx` at `/app/strategy`
- [x] **Empty State** — "Create from Wizard" and "Start Fresh Canvas" CTAs
- [x] **Sidebar Nav** — Brain icon + pending badge in DashboardSidebar
- [x] **Metrics Bar** — 5-metric bar (Score, Insights, Recommendations, Opportunities, Actions)
- [x] **Canvas Grid** — 3×3 Lean Canvas with 9 blocks
- [x] **Block Editor** — Inline editor with AI synthesis

### Phase 14b — Intelligence Layer ✅
- [x] **Intelligence Panel** — Tabbed panel (Insights, Recommendations, Opportunities)
- [x] **Recommendation Cards** — With approve/reject actions
- [x] **Insight Cards** — With severity indicators
- [x] **Opportunity Cards** — With ROI estimates
- [x] **Card Animations** — Motion animations for approve/reject/dismiss

### Phase 14c — AI Integration ✅
- [x] **Ask AI** — Per-block Gemini synthesis via sparkle icon
- [x] **Run Analysis** — Full-canvas 5-agent orchestration
- [x] **Create from Wizard** — Auto-populate canvas from wizard session
- [x] **Analysis Progress** — `AnalysisProgressSheet.tsx` — 5-agent animated overlay (Task 20)

### Phase 14d — Enhancements & Polish ✅
- [x] **Roadmap Panel** — `RoadmapExecutionPanel.tsx` — Phase cards with progress bars (Task 21)
- [x] **Version History** — `CanvasVersionHistory.tsx` — Side-sheet with timeline, revert (Task 22)
- [x] **Mobile Polish** — 3-tab nav [Canvas|Roadmap|Intel] below 768px (Task 23)
- [x] **E2E Verification** — All wiring verified: routes, sidebar, edge functions, API, hooks (Task 25)

---

## NEXT PRIORITIES — Enhancement Phases

### Phase 11b: Workflow Execution Engine (High Priority)
- [ ] Add real execution engine (actually create projects, deals, send notifications)
- [ ] Add cron-based scheduled workflow execution
- [ ] Add webhook-based triggers for external events
- [ ] Add workflow dependency chains (run A after B completes)
- [ ] Add workflow versioning and rollback

### Phase 13b: Financial Intelligence (High Priority)
- [ ] Add AI revenue forecasting with confidence bands on trend chart
- [ ] Add invoice PDF generation and download
- [ ] Add line items editor in invoice creation
- [ ] Add partial payment support with remaining balance tracking
- [ ] Add recurring invoice templates
- [ ] Add cash flow projection chart (weekly, 4 weeks)
- [ ] Add export to CSV/PDF for invoices and reports

### Phase 7b: CRM Pipeline Enhancements
- [ ] Add deal search within kanban board
- [ ] Add pipeline analytics summary (conversion rate, avg deal time)
- [ ] Add bulk deal operations (multi-select, bulk move)
- [ ] Improve mobile drag-and-drop experience (react-dnd)

### Phase 8b: Document Management Enhancements
- [ ] Add version history (upload new version, restore previous)
- [ ] Add project folder tree sidebar for organization
- [ ] Add inline preview for PDFs and images
- [ ] Add batch upload with queue (3 concurrent max)
- [ ] Add auto-generated documents from wizard data (proposal PDF, roadmap PDF)

---

## IMPROVEMENTS & TECH DEBT

### AI Enhancements
- [ ] Add AI-powered workflow suggestions from activity patterns
- [ ] Add natural language workflow input parsing ("notify me when deal is stale for 7 days")
- [ ] Add AI client payment history timeline
- [ ] Add document search full-text indexing

### General UX
- [ ] Update StyleGuidePage to show BCG design system tokens
- [ ] Add breadcrumb navigation for nested dashboard pages
- [ ] Add keyboard shortcuts for common actions
- [ ] Add toast notifications for success/error states (sonner)
- [ ] Performance audit: lazy-load heavy dashboard pages

### Testing
- [ ] Add E2E testing for critical flows (wizard, auth, CRM)
- [ ] Add integration tests for all 63 edge function routes
- [ ] Add visual regression tests for BCG design system components

---

## INFRASTRUCTURE

- [ ] Set up CI/CD pipeline for automatic edge function deploys
- [ ] Configure production environment variables
- [ ] Set up error monitoring (Sentry or similar)
- [ ] Configure CDN caching for static assets
- [ ] Set up database backups schedule
- [ ] Configure Google OAuth (Cloud Console + Supabase Dashboard)
- [ ] Configure LinkedIn OIDC (Developer Dashboard + Supabase Dashboard)

---

## PROJECT STATS

- **Total Routes:** 51 (32 public + 16 authenticated + 3 aliases)
- **Dashboard Pages:** 43 production components, 0 placeholders
- **Edge Function Routes:** 63 total (49 prior + 14 strategy engine)
- **Auth Methods:** 5 (email sign-in, email sign-up, Google OAuth, LinkedIn OIDC, guest/anonymous)
- **Supabase Storage:** 1 private bucket (make-283466b6-documents)
- **Database Tables:** 44 (32 prior + 12 strategy engine)
- **Planning Docs:** 17 spec documents in `/docs/lean/`
- **Current Version:** v0.24.1
- **Project Completion:** ~90% (all 14 dashboard phases complete; enhancements + infrastructure remaining)