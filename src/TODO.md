# TODO — Sun AI Agency Website

**Project:** Sun AI Agency — AI Consulting & Solutions Website
**Current Version:** v0.22.1
**Last Updated:** 2026-03-07

---

## IMMEDIATE PRIORITIES (This Sprint)

### Deployment Steps
- [ ] **Deploy Edge Function** — Deploy updated server with all 49 routes (Phase 8 documents + Phase 11 workflows + Phase 13 financial + CRM auth fix) to Supabase Edge Functions
- [ ] **Run CRM Pipeline Migrations** — Execute `20260307120300_create_crm_pipeline_tables.sql` and `20260307120400_seed_default_pipeline_and_verify.sql` in Supabase SQL Editor to create `crm_pipelines`, `crm_stages`, `crm_deals`, `crm_interactions` tables and seed default pipelines
- [ ] **Verify CRM Auth Fix** — Test `GET /crm/clients` and `GET /crm/pipelines` with both anonymous and authenticated tokens after deploy; confirm JWT decode anon detection works
- [ ] **Verify Document Storage** — The `make-283466b6-documents` bucket auto-creates on first upload; verify in Supabase Dashboard > Storage

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

**ALL 13 DASHBOARD PHASES COMPLETE** | CRM Auth Hardened in v0.22.1

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
