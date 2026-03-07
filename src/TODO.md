# TODO — Sun AI Agency Website

**Project:** Sun AI Agency — AI Consulting & Solutions Website
**Current Version:** v0.22.0
**Last Updated:** 2026-03-07

---

## IMMEDIATE PRIORITIES (This Sprint)

### Manual Steps Required
- [ ] **Run CRM Pipeline Migrations** — Execute `20260307120300_create_crm_pipeline_tables.sql` and `20260307120400_seed_default_pipeline_and_verify.sql` in Supabase SQL Editor to create `crm_pipelines`, `crm_stages`, `crm_deals`, `crm_interactions` tables and seed default pipelines
- [ ] **Deploy Edge Functions** — Deploy updated server with Phase 8 document routes + Phase 11 workflow routes + Phase 13 financial routes to Supabase Edge Functions
- [ ] **Verify CRM Auth Fix** — Test `GET /crm/clients` and `GET /crm/pipelines` with both anonymous and authenticated tokens after deploy
- [ ] **Create Supabase Storage Bucket** — The `make-283466b6-documents` bucket auto-creates on first upload, but verify in Supabase Dashboard > Storage

### Testing Checklist — Phase 11: Workflow Automation
- [ ] Workflows page loads at `/app/workflows` with empty state
- [ ] Templates tab shows 5 pre-built templates
- [ ] Install template creates workflow in active list
- [ ] Create custom workflow via builder modal (trigger + conditions + actions)
- [ ] Toggle workflow enabled/disabled updates status badge
- [ ] Run Now executes workflow and adds entry to execution log
- [ ] Dry Run simulates without persisting execution
- [ ] Execution log shows expandable action results
- [ ] Edit workflow opens builder pre-populated
- [ ] Delete workflow removes from list
- [ ] Metrics row shows runs today, success rate, avg time, active count
- [ ] Mobile responsive: stacked cards, 44px touch targets

### Testing Checklist — Phase 13: Financial Dashboard
- [ ] Financial page loads at `/app/financial` with empty state
- [ ] Create Invoice modal saves draft invoice
- [ ] Invoice list shows with correct status badges
- [ ] Status filter tabs filter invoices (All/Draft/Sent/Paid/Overdue)
- [ ] Send action transitions draft -> sent
- [ ] Record Payment transitions sent/overdue -> paid
- [ ] Delete only works on draft invoices
- [ ] Send Reminder shows confirmation for sent/overdue invoices
- [ ] Revenue metrics row shows MRR, revenue, outstanding, overdue
- [ ] Overdue alert banner appears when overdue amount > 0
- [ ] Revenue trend line chart renders (Recharts)
- [ ] Revenue by client horizontal bar chart renders
- [ ] Revenue by service breakdown renders
- [ ] Project profitability table shows margin colors (green/amber/red)
- [ ] Search filters invoices by client/project/number
- [ ] Mobile responsive: stacked cards, 44px touch targets

### Testing Checklist — Previous Phases
- [ ] Documents page loads at `/app/documents` with empty state
- [ ] File upload via button works (PDF, DOCX, PNG, JPG, XLS, CSV)
- [ ] File upload via drag-and-drop works
- [ ] CRM Clients page loads without 401 errors
- [ ] CRM Pipeline page loads without auth errors
- [ ] Pipeline drag-and-drop deal moves work

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

**ALL 13 DASHBOARD PHASES COMPLETE**

---

## IMPROVEMENTS & TECH DEBT

### Phase 7b: CRM Pipeline Enhancements
- [ ] Add deal search within kanban board
- [ ] Add pipeline analytics summary (conversion rate, avg deal time)
- [ ] Add bulk deal operations (multi-select, bulk move)
- [ ] Add deal notes/comments inline editing
- [ ] Improve mobile drag-and-drop experience (react-dnd)

### Phase 8b: Document Management Enhancements
- [ ] Add version history (upload new version, restore previous)
- [ ] Add project folder tree sidebar for organization
- [ ] Add inline preview for PDFs and images
- [ ] Add batch upload with queue (3 concurrent max)
- [ ] Add auto-generated documents from wizard data (proposal PDF, roadmap PDF)
- [ ] Add document search full-text indexing

### Phase 11b: Workflow Automation Enhancements
- [ ] Add real execution engine (actually create projects, deals, etc.)
- [ ] Add cron-based scheduled workflow execution
- [ ] Add AI-powered workflow suggestions from activity patterns
- [ ] Add natural language input parsing ("notify me when deal is stale for 7 days")
- [ ] Add workflow versioning and rollback
- [ ] Add workflow dependency chains (run A after B completes)
- [ ] Add webhook-based triggers for external events

### Phase 13b: Financial Dashboard Enhancements
- [ ] Add line items editor in invoice creation
- [ ] Add partial payment support with remaining balance tracking
- [ ] Add AI revenue forecasting with confidence bands on trend chart
- [ ] Add invoice PDF generation and download
- [ ] Add recurring invoice templates
- [ ] Add client payment history timeline
- [ ] Add cash flow projection chart (weekly, 4 weeks)
- [ ] Add export to CSV/PDF for invoices and reports

### General
- [ ] Update StyleGuidePage to show BCG design system tokens
- [ ] Add E2E testing for critical flows (wizard, auth, CRM)
- [ ] Performance audit: lazy-load heavy dashboard pages
- [ ] Add breadcrumb navigation for nested dashboard pages
- [ ] Add keyboard shortcuts for common actions
- [ ] Add toast notifications for success/error states (sonner)

---

## INFRASTRUCTURE

- [ ] Set up CI/CD pipeline for automatic edge function deploys
- [ ] Configure production environment variables
- [ ] Set up error monitoring (Sentry or similar)
- [ ] Configure CDN caching for static assets
- [ ] Set up database backups schedule
