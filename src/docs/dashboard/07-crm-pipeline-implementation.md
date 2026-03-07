# 07 — CRM Pipeline Implementation Notes

**Status:** IMPLEMENTED (v0.19.0)
**Route:** `/app/crm/pipelines`
**Phase:** 7

---

## Files Created / Modified

### New Files (Phase 7)

| File | Purpose |
|------|---------|
| `/lib/types/crm-pipeline.ts` | TypeScript interfaces: Pipeline, Stage, Deal, Interaction, ForecastDataPoint |
| `/supabase/functions/server/pipeline-routes.tsx` | Hono backend: 9 routes for pipelines, deals, interactions, contacts |
| `/components/dashboard/crm/CRMPipelinePage.tsx` | Main page: kanban board, pipeline tabs, forecast chart |
| `/components/dashboard/crm/StageColumn.tsx` | Kanban column with drop zone, stage header (name, count, value) |
| `/components/dashboard/crm/DealCard.tsx` | Deal card: title, value, probability, contact, stale indicators |
| `/components/dashboard/crm/DealDetailPanel.tsx` | Sheet panel: Details, Interactions, Activity tabs |
| `/components/dashboard/crm/DealQuickCreate.tsx` | Dialog: create deal with title, value, probability, stage |
| `/components/dashboard/crm/ForecastChart.tsx` | Recharts BarChart: weighted monthly pipeline forecast |

### Modified Files

| File | Change |
|------|--------|
| `/routes.tsx` | Replaced CRMPipelinePage placeholder with real component import |
| `/supabase/functions/server/index.tsx` | Mounted pipeline routes |
| `/lib/supabase.ts` | Added `pipelineApi` with all CRM pipeline API methods |
| `/components/dashboard/DashboardSidebar.tsx` | Version bump to v0.19.0 |

---

## Backend Routes

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/crm/pipelines` | List all pipelines with deal counts |
| GET | `/crm/pipelines/:id` | Full pipeline: stages, deals, forecast |
| POST | `/crm/deals` | Create a new deal |
| PUT | `/crm/deals/:id` | Update deal (stage move, value, probability) |
| GET | `/crm/deals/:id` | Deal detail with interactions and contact |
| DELETE | `/crm/deals/:id` | Delete a deal |
| POST | `/crm/interactions` | Log interaction (call/email/meeting/note) |
| GET | `/crm/deals/:id/interactions` | Get interactions for a deal |
| GET | `/crm/contacts` | List all contacts for deal creation |

---

## Database Tables Required

These tables must exist (from migrations `20260307120300` and `20260307120400`):

- `crm_pipelines` — Named pipeline groups
- `crm_stages` — Ordered stages per pipeline
- `crm_deals` — Deals with value, probability, stage_id
- `crm_interactions` — Activity log (call/email/meeting/note)

Seed data creates:
- "New Business" pipeline (default): Lead, Qualified, Proposal Sent, Negotiation, Closed Won, Closed Lost
- "Upsell" pipeline: Identified, Pitched, Approved, Delivered

---

## Features Implemented

1. Horizontal kanban board with drag-and-drop (HTML5 native)
2. Multiple pipeline support via tabs
3. Deal cards with value, probability, contact, stale indicators
4. Stage columns with deal count and total value
5. Optimistic updates on drag-and-drop
6. Deal detail slide-out panel (Motion animated)
7. Interaction logging (call/email/meeting/note) with inline form
8. Interaction timeline in deal detail
9. Deal quick-create dialog
10. Forecast chart (Recharts BarChart, weighted monthly pipeline)
11. Stale deal indicators: amber >7 days, red >14 days
12. High-value deal indicator: green accent >$10K
13. Mobile responsive: stacked collapsible columns
14. Loading skeleton states
15. Empty pipeline state with CTA
16. Error state with retry button

---

## Acceptance Criteria Status

- [x] Pipeline page renders at `/app/crm/pipelines` with kanban board
- [x] Pipeline tabs switch between pipelines
- [x] Stage columns render in position order with name, deal count, total value
- [x] Deal cards show title, value, contact, probability, days-in-stage
- [x] Deal cards draggable between stages (optimistic + persist)
- [x] Deal click opens Sheet detail panel with tabs
- [x] Interaction form logs to `crm_interactions` table
- [x] "Add Deal" dialog creates new deals
- [x] Forecast chart shows weighted monthly pipeline value
- [x] Stale indicators: amber >7d, red >14d
- [x] Empty pipeline: "No deals yet" with Add Deal CTA
- [x] Loading: skeleton columns and cards
- [x] Responsive: columns stack vertically on mobile
- [ ] Wizard Data tab (deferred — requires wizard session linking)
- [ ] Conversion funnel chart (deferred — Phase 7b)

---

## Pre-requisites

1. **Run migrations**: `20260307120300_create_crm_pipeline_tables.sql` and `20260307120400_seed_default_pipeline_and_verify.sql`
2. **Deploy edge function**: The server must include `pipeline-routes.tsx`
3. **Auth**: User must be logged in (DashboardLayout auth guard)
