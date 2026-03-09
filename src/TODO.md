# TODO — Sun AI Agency Website

**Project:** Sun AI Agency — AI Consulting & Solutions Website
**Current Version:** v0.22.5
**Last Updated:** 2026-03-09

---

## IMMEDIATE PRIORITIES (This Sprint)

### Deployment Steps
- [ ] **Deploy Edge Function** — Deploy updated server with all 49 routes (Phase 8 documents + Phase 11 workflows + Phase 13 financial + CRM auth fix + dashboard-insights 404 fix) to Supabase Edge Functions
- [ ] **Run CRM Pipeline Migrations** — Execute `20260307120300_create_crm_pipeline_tables.sql` and `20260307120400_seed_default_pipeline_and_verify.sql` in Supabase SQL Editor to create `crm_pipelines`, `crm_stages`, `crm_deals`, `crm_interactions` tables and seed default pipelines
- [ ] **Verify CRM Auth Fix** — Test `GET /crm/clients` and `GET /crm/pipelines` with both anonymous and authenticated tokens after deploy; confirm JWT decode anon detection works
- [ ] **Verify Document Storage** — The `make-283466b6-documents` bucket auto-creates on first upload; verify in Supabase Dashboard > Storage
- [ ] **Watch for Hono Sub-Router 404s** — After deploy, test all AI routes (`/ai/generate`, `/ai/cache`, `/agent-stats/*`, etc.) for 404s caused by Hono sub-router mounting. If any 404, move route handler from `ai-routes.tsx` to direct registration in `index.tsx` (same fix applied to `/dashboard-insights` in v0.22.2)

### Smoke Testing — All Dashboard Phases
- [ ] Dashboard home loads at `/app/dashboard` with metrics
- [ ] Projects & Tasks page loads at `/app/projects`
- [ ] AI Insights page loads at `/app/ai-insights`
- [ ] AI Agent Management page loads at `/app/agents`
- [ ] Settings page loads at `/app/settings`
- [ ] CRM Clients page loads at `/app/crm/clients` without 401 errors
- [ ] CRM Pipeline page loads at `/app/crm/pipelines` with kanban board
- [ ] Documents page loads at `/app/documents`
- [ ] Workflows page loads at `/app/workflows`
- [ ] Financial page loads at `/app/financial`

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

**ALL 13 DASHBOARD PHASES COMPLETE** | CRM Auth Hardened in v0.22.1 | Hono 404 Fix in v0.22.2 | Lean Strategy Plan in v0.22.3

---

## NEXT PHASE — Phase 14: Lean Strategy Engine (Planned)

> Full plan at `/docs/lean/00-lean-master-plan.md` (16 spec documents in `/docs/lean/`)
> Progress: **0 / 26 tasks** (0%)

### Pre-Requisite
- [ ] **Database Migration** — Run `20260308120000_create_strategy_engine_tables.sql` in Supabase SQL Editor (12 tables: lean_canvases, lean_canvas_versions, strategy_insights, automation_opportunities, strategy_recommendations, strategy_actions + 6 advanced tables)

### Phase 14a — Core Canvas & Infrastructure (P0, ~4 days)
- [ ] **Types** — Create `/lib/types/strategy.ts` (full types from doc 15 §2)
- [ ] **Backend** — Create `strategy-routes.tsx` with 14+ route handlers (doc 08, 15 §4-5)
- [ ] **Mount Routes** — Register strategy routes in `index.tsx` (sub-router first, direct if 404s)
- [ ] **API Layer** — Add `strategyApi` module to `lib/supabase.ts` (16 methods, doc 15 §3)
- [ ] **Data Hook** — Create `useStrategyData` hook in `lib/hooks/` (doc 15 §7)
- [ ] **Page Shell** — Create `StrategyEnginePage.tsx` at `/app/strategy` (doc 01, 15 §8)
- [ ] **Empty State** — Create `StrategyEmptyState.tsx` with wizard/fresh CTAs (doc 02)
- [ ] **Sidebar Nav** — Add Strategy item with Brain icon + pending badge (doc 14)
- [ ] **Metrics Bar** — Create `StrategyMetricsBar.tsx` + `MetricCard.tsx` (doc 03)
- [ ] **Canvas Grid** — Create `LeanCanvasPanel.tsx` + `CanvasBlock.tsx` (doc 04)
- [ ] **Block Editor** — Create `CanvasBlockEditor.tsx` (doc 05)

### Phase 14b — Intelligence Layer (P0, ~2 days)
- [ ] **Intelligence Panel** — Create `IntelligencePanel.tsx` (doc 06)
- [ ] **Recommendation Cards** — Create `RecommendationCard.tsx` (doc 07 §1)
- [ ] **Insight Cards** — Create `InsightCard.tsx` (doc 07 §2)
- [ ] **Opportunity Cards** — Create `OpportunityCard.tsx` (doc 07 §3)
- [ ] **Card Animations** — Motion animations for approve/reject/dismiss (doc 07)

### Phase 14c — AI Integration (P1, ~2 days)
- [ ] **Ask AI** — Per-block Gemini synthesis via 5 agents (doc 05, 08)
- [ ] **Run Analysis** — Full-canvas 5-agent orchestration A/B phases (doc 08, 15 §5)
- [ ] **Create from Wizard** — Auto-populate canvas from wizard session (doc 02, 15 §4)
- [ ] **Analysis Progress** — 5-agent progress sheet with simulated phases (doc 11)

### Phase 14d — Enhancements & Polish (P2, ~2 days)
- [ ] **Roadmap Panel** — Phase cards with progress bars from wizard data (doc 10)
- [ ] **Version History** — Side sheet with timeline, view snapshot, revert (doc 12)
- [ ] **Mobile Polish** — Tab nav, bottom sheet editor, responsive breakpoints (doc 13)
- [ ] **Skeleton States** — Loading skeletons for all components
- [ ] **E2E Verification** — 14-point test checklist (doc 15 §9)

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
- [ ] Add integration tests for all 49 edge function routes
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

- **Dashboard Pages:** 43 production components, 0 placeholders
- **Edge Function Routes:** 49 total
- **Auth Methods:** 5 (email sign-in, email sign-up, Google OAuth, LinkedIn OIDC, guest/anonymous)
- **Supabase Storage:** 1 private bucket (make-283466b6-documents)
- **Project Completion:** ~85% (all 13 dashboard phases complete; enhancements + infrastructure remaining)