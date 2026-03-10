# TODO — Sun AI Agency Website

**Project:** Sun AI Agency — AI Consulting & Solutions Website
**Current Version:** v0.25.0
**Last Updated:** 2026-03-10

---

## IMMEDIATE PRIORITIES (This Sprint)

### Deployment Steps
- [ ] **Deploy Edge Function** — Deploy updated server with all 65 routes (63 prior + 2 onboarding) to Supabase Edge Functions. Includes: Phase 8 documents, Phase 11 workflows, Phase 13 financial, CRM auth fix, dashboard-insights 404 fix, **Phase 14 strategy engine** (14 endpoints), and **Task 064 onboarding agent** (2 endpoints with auto-migration)
- [ ] **Run CRM Pipeline Migrations** — Execute `20260307120300_create_crm_pipeline_tables.sql` and `20260307120400_seed_default_pipeline_and_verify.sql` in Supabase SQL Editor to create `crm_pipelines`, `crm_stages`, `crm_deals`, `crm_interactions` tables and seed default pipelines
- [ ] **Run Strategy Engine Migration** — Execute `/imports/create-strategy-tables.txt` in Supabase SQL Editor to create 12 strategy tables (`lean_canvases`, `lean_canvas_versions`, `strategy_insights`, `automation_opportunities`, `strategy_recommendations`, `strategy_actions`, + 6 advanced tables). Verified against docs 15 and 16 with 5 extra indexes, append-only RLS on audit tables
- [ ] **Run Realtime Broadcast Triggers (4 files)** — Execute all 4 SQL files in Supabase SQL Editor to enable live Realtime on all channels:
  1. `/imports/ai-runs-broadcast-trigger.sql` — trigger on `ai_run_logs` + RLS policy `ai_runs_read`
  2. `/imports/wizard-sessions-broadcast-trigger.sql` — conditional trigger on `wizard_sessions` + RLS policy `wizard_sessions_read`
  3. `/imports/crm-deals-realtime-trigger.sql` — trigger on `crm_deals` + RLS policy `pipeline_deals_read`
  4. `/imports/lean-canvases-broadcast-trigger.sql` — dual-trigger on `lean_canvases` + `lean_canvas_versions` + RLS policy `canvas_blocks_read`
- [ ] **Enable Private-Only Channels** — In Supabase Dashboard > Project Settings > Realtime Settings, enable "Private-only channels" for production security (recommended by supabase-realtime-guide.md)
- [ ] **Verify CRM Auth Fix** — Test `GET /crm/clients` and `GET /crm/pipelines` with both anonymous and authenticated tokens after deploy; confirm JWT decode anon detection works
- [ ] **Verify Document Storage** — The `make-283466b6-documents` bucket auto-creates on first upload; verify in Supabase Dashboard > Storage
- [ ] **Verify Strategy Engine** — Test `/app/strategy` page loads, canvas CRUD works, "Run Analysis" triggers 5-agent orchestration, version history saves/reverts
- [ ] **Run Onboarding Tables Migration** — Execute `20260310120000_create_onboarding_tables.sql` in Supabase SQL Editor to create `projects`, `roadmaps`, `roadmap_phases`, `activities` tables with CHECK constraints and indexes (or rely on auto-migration via `ensureOnboardingSchema()` for basic table creation)
- [ ] **Watch for Hono Sub-Router 404s** — After deploy, test all AI routes (`/ai/generate`, `/ai/cache`, `/agent-stats/*`, etc.) for 404s caused by Hono sub-router mounting. If any 404, move route handler from `ai-routes.tsx` to direct registration in `index.tsx` (same fix applied to `/dashboard-insights` in v0.22.2 and all 14 strategy routes in v0.23.0)

### Smoke Testing — Onboarding Agent (Task 064)
- [ ] Complete wizard end-to-end (Steps 1-5) and verify onboarding status indicator shows "Project saved" in Step 5
- [ ] Verify `projects` table has a new row with correct `wizard_session_id`, `client_id`, `name`, `industry`, `selected_systems`
- [ ] Verify `roadmaps` table has a new row linked to the project with `quick_wins`, `risk_factors`, `success_metrics`
- [ ] Verify `roadmap_phases` table has N rows (matching AI roadmap phases) with phase 1 `status = 'active'`
- [ ] Verify `activities` table has a new row with `type = 'onboarding'` and correct metadata
- [ ] Verify `clients` table has a new or updated row with company name from wizard Step 1
- [ ] Re-complete the same wizard session and verify idempotent response (no duplicate project created)
- [ ] Test with anonymous user (no auth) — verify graceful handling
- [ ] Test Retry button on error state in Step 5 UI
- [ ] Verify health check at `/health` reports `onboardingSchema: "migrated"`

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

### Smoke Testing — Realtime Channels (4 channels, all broadcast pattern)
- [ ] **AI Runs** — Open AgentsPage, trigger an AI run from wizard, verify green "Live" pulsing dot appears and stats auto-refresh within 3s
- [ ] **Wizard Sync** — Open wizard in two tabs, save in tab A, verify tab B shows "Session updated in another tab" toast with Sync button
- [ ] **CRM Pipeline** — Open pipeline in two browser sessions (different users), move a deal in session A, verify session B's kanban auto-refreshes
- [ ] **Canvas Sync** — Open strategy canvas in two tabs, edit a block in tab A, verify tab B auto-refreshes with updated content
- [ ] **Self-Write Suppression** — Verify that your own actions (drag deal, save canvas, save wizard) do NOT cause a double-refresh (check browser console for suppressed broadcast logs)
- [ ] **Graceful Degradation** — If triggers are not installed, verify pages still function with manual Refresh button and amber "retry live" indicator (no errors/crashes)
- [ ] **Trigger Verification** — After running SQL files, confirm triggers exist:
  ```sql
  SELECT tgname FROM pg_trigger WHERE tgrelid = 'ai_run_logs'::regclass;
  SELECT tgname FROM pg_trigger WHERE tgrelid = 'wizard_sessions'::regclass;
  SELECT tgname FROM pg_trigger WHERE tgrelid = 'crm_deals'::regclass;
  SELECT tgname FROM pg_trigger WHERE tgrelid = 'lean_canvases'::regclass;
  SELECT tgname FROM pg_trigger WHERE tgrelid = 'lean_canvas_versions'::regclass;
  ```
- [ ] **RLS Policy Verification** — Confirm all 4 policies exist on `realtime.messages`:
  ```sql
  SELECT policyname FROM pg_policies WHERE tablename = 'messages' AND schemaname = 'realtime';
  -- Expected: ai_runs_read, wizard_sessions_read, pipeline_deals_read, canvas_blocks_read
  ```

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
| T064 | Onboarding Agent | Done | v0.25.0 |

**ALL 14 DASHBOARD PHASES COMPLETE** (26/26 strategy tasks) | CRM Auth Hardened in v0.22.1 | Hono 404 Fix in v0.22.2 | Sitemap v13 in v0.24.1 | Onboarding Agent in v0.25.0

---

## REALTIME SYSTEM STATUS

> All 4 channels migrated to **broadcast** pattern (v0.24.4)
> Base hook: `useSupabaseBroadcast` — private channels, database triggers, RLS
> Legacy `useSupabaseRealtime` (postgres_changes) still exported but no longer used

| Channel | Hook | Topic Pattern | Trigger | Self-Write | Status |
|---------|------|---------------|---------|------------|--------|
| AI Runs | `useRealtimeAIRuns` | `ai-runs:global` | INSERT only | Throttle (3s) | Migrated v0.24.4 |
| Wizard Sync | `useRealtimeWizardSync` | `wizard:session:{id}` | Conditional UPDATE | `markLocalSave()` (3s) | Migrated v0.24.4 |
| CRM Pipeline | `useRealtimeDealUpdates` | `pipeline:{id}:deals` | INSERT/UPDATE/DELETE | `markLocalWrite()` (2s) | Wired v0.24.3 |
| Canvas Sync | `useRealtimeCanvasSync` | `canvas:{id}:blocks` | Dual-trigger (UPDATE + INSERT) | `markLocalWrite()` (2s) | New v0.24.4 |

### SQL Trigger Files (run in Supabase SQL Editor)
1. `/imports/ai-runs-broadcast-trigger.sql`
2. `/imports/wizard-sessions-broadcast-trigger.sql`
3. `/imports/crm-deals-realtime-trigger.sql`
4. `/imports/lean-canvases-broadcast-trigger.sql`

---

## COMPLETED — Realtime System (v0.24.2 → v0.24.4)

### v0.24.2 — Initial Realtime (postgres_changes)
- [x] **useSupabaseRealtime** — Generic postgres_changes base hook (now legacy)
- [x] **useRealtimeAIRuns** — AI run monitoring with throttled refresh
- [x] **useRealtimeWizardSync** — Multi-tab wizard sync with self-write filtering
- [x] **AgentsPage integration** — Live indicator (green/amber dots)
- [x] **WizardContext integration** — External change toasts, multi-tab sync

### v0.24.3 — CRM Pipeline Realtime (broadcast)
- [x] **useSupabaseBroadcast** — New broadcast base hook (recommended pattern)
- [x] **useRealtimeDealUpdates** — Pipeline-scoped deal broadcast listener
- [x] **CRMPipelinePage integration** — Live indicator, `markLocalWrite()` on all 4 handlers
- [x] **crm-deals-realtime-trigger.sql** — Database trigger + RLS policy

### v0.24.4 — Full Broadcast Migration + Canvas Sync
- [x] **Migrate useRealtimeAIRuns** — postgres_changes → broadcast (`ai-runs:global`)
- [x] **Migrate useRealtimeWizardSync** — postgres_changes → broadcast (`wizard:session:{id}`), added `markLocalSave()`
- [x] **useRealtimeCanvasSync** — New canvas-scoped broadcast for collaborative editing
- [x] **StrategyEnginePage integration** — Live indicator, `markCanvasWrite()` on accept/revert
- [x] **WizardContext update** — Calls `markLocalSave()` before cloud saves
- [x] **3 SQL trigger files** — ai-runs, wizard-sessions, lean-canvases broadcast triggers
- [x] **Wiring map rewrite** — 4 broadcast channels, 4 SQL triggers, updated architecture docs

---

## COMPLETED — Task 064: Onboarding Agent (v0.25.0)

> Spec: `/imports/onboarding-agent-rewrite.md`
> Progress: **10 / 10 steps** (100%)

- [x] **Read wizard_sessions + wizard_answers** — Loads session + all step answers by session ID
- [x] **Validate wizard completeness** — Checks steps 1-3 are present (4-5 optional)
- [x] **Extract business profile** — Parses Step 1 data (company, industry, size, goal, challenge)
- [x] **Extract selected systems** — Parses Step 3 data (AI system selections)
- [x] **UPSERT client record** — Creates or updates `clients` row by `created_by` user ID
- [x] **INSERT project record** — Creates `projects` row with `wizard_session_id` (idempotent guard)
- [x] **INSERT roadmap record** — Creates `roadmaps` row with AI-generated quick wins, risks, metrics
- [x] **INSERT roadmap_phases** — Creates N phase rows from AI roadmap (or 1 default phase)
- [x] **UPDATE wizard_sessions** — Sets `user_id` and `status = 'completed'` on the session
- [x] **INSERT activity event** — Logs onboarding completion to `activities` table
- [x] **Auto-migration** — `ensureOnboardingSchema()` creates all 4 tables on first request
- [x] **Frontend wiring** — `onboardingApi` in `lib/supabase.ts` + Step 5 live status UI
- [x] **Idempotent** — Checks existing project by `wizard_session_id` before creating

---

## COMPLETED — Phase 14: Lean Strategy Engine (v0.24.0)

> Full plan at `/docs/lean/00-lean-master-plan.md` (16 spec documents in `/docs/lean/`)
> Progress: **26 / 26 tasks** (100%)

### Phase 14a — Core Canvas & Infrastructure
- [x] **Types** — `/lib/types/strategy.ts` (20+ interfaces matching 12 tables)
- [x] **Backend** — `strategy-routes.tsx` with 14 route handlers
- [x] **Mount Routes** — All 14 routes registered directly on main Hono app (sub-router 404 workaround)
- [x] **API Layer** — `strategyApi` module in `lib/supabase.ts` (14 typed methods)
- [x] **Data Hook** — `useStrategyData` hook with 8 action methods
- [x] **Page Shell** — `StrategyEnginePage.tsx` at `/app/strategy`
- [x] **Empty State** — "Create from Wizard" and "Start Fresh Canvas" CTAs
- [x] **Sidebar Nav** — Brain icon + pending badge in DashboardSidebar
- [x] **Metrics Bar** — 5-metric bar (Score, Insights, Recommendations, Opportunities, Actions)
- [x] **Canvas Grid** — 3x3 Lean Canvas with 9 blocks
- [x] **Block Editor** — Inline editor with AI synthesis

### Phase 14b — Intelligence Layer
- [x] **Intelligence Panel** — Tabbed panel (Insights, Recommendations, Opportunities)
- [x] **Recommendation Cards** — With approve/reject actions
- [x] **Insight Cards** — With severity indicators
- [x] **Opportunity Cards** — With ROI estimates
- [x] **Card Animations** — Motion animations for approve/reject/dismiss

### Phase 14c — AI Integration
- [x] **Ask AI** — Per-block Gemini synthesis via sparkle icon
- [x] **Run Analysis** — Full-canvas 5-agent orchestration
- [x] **Create from Wizard** — Auto-populate canvas from wizard session
- [x] **Analysis Progress** — `AnalysisProgressSheet.tsx` — 5-agent animated overlay (Task 20)

### Phase 14d — Enhancements & Polish
- [x] **Roadmap Panel** — `RoadmapExecutionPanel.tsx` — Phase cards with progress bars (Task 21)
- [x] **Version History** — `CanvasVersionHistory.tsx` — Side-sheet with timeline, revert (Task 22)
- [x] **Mobile Polish** — 3-tab nav [Canvas|Roadmap|Intel] below 768px (Task 23)
- [x] **E2E Verification** — All wiring verified: routes, sidebar, edge functions, API, hooks (Task 25)

---

## CLOUDINARY IMAGE MIGRATION

> Guide: `/docs/cloudinary-image-swap-guide.md`

| Card | File | Status |
|---|---|---|
| Hero | HomePageV3.tsx | ✅ Cloudinary |
| AI Agent Systems | HomePageV3.tsx | ✅ Cloudinary |
| AI Chatbots | HomePageV3.tsx | ✅ Cloudinary |
| WhatsApp AI Automation | HomePageV3.tsx | ✅ Cloudinary (v0.24.5) |
| AI Sales & Marketing CRM | HomePageV3.tsx | ✅ Cloudinary |
| AI MVP Development | HomePageV3.tsx | ✅ Cloudinary |
| Custom AI Development | HomePageV3.tsx | ✅ Cloudinary (v0.24.6) |
| AI-Powered Web Development | HomePageV3.tsx | ✅ Cloudinary (v0.24.6) |
| E-commerce AI | HomePageV3.tsx | ✅ Cloudinary |
| AI Automations | HomePageV3.tsx | ✅ Cloudinary (v0.24.6) |
| Story section | HomePageV3.tsx | ⬜ Unsplash |
| ~~Testimonial~~ | ~~HomePageV3.tsx~~ | ❌ Removed (v0.25.0) |
| Specialized Service 1 | HomePageV3.tsx | ⬜ Unsplash |
| Specialized Service 2 | HomePageV3.tsx | ⬜ Unsplash |
| Specialized Service 3 | HomePageV3.tsx | ⬜ Unsplash |

**Progress:** 10/14 migrated to Cloudinary (1 section removed)

---

## NEXT PRIORITIES — Enhancement Phases

### Realtime Enhancements (Medium Priority)
- [ ] **Canvas Presence Tracking** — Add online user avatars on the strategy canvas using Supabase Realtime `presence` feature (who's viewing/editing which block)
- [ ] **Deal Activity Feed** — Add a live activity ticker to the pipeline page showing recent deal movements across all team members
- [ ] **Remove Legacy Hook** — Delete `useSupabaseRealtime.ts` (postgres_changes) once all consumers are confirmed migrated and tested
- [ ] **Broadcast Throttling** — Add server-side throttling to high-frequency triggers (e.g., canvas block edits during rapid typing) to reduce broadcast volume
- [ ] **Conditional Canvas Trigger** — Switch from the catch-all canvas trigger to the optional conditional variant (only broadcast on block content changes, not metadata)

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
- **Edge Function Routes:** 65 total (49 prior + 14 strategy engine + 2 onboarding agent)
- **Realtime Channels:** 4 (all broadcast pattern — ai-runs, wizard-sync, pipeline-deals, canvas-sync)
- **Custom Hooks:** 13 (6 utility + 4 Realtime domain + 2 data + 1 legacy base)
- **Auth Methods:** 5 (email sign-in, email sign-up, Google OAuth, LinkedIn OIDC, guest/anonymous)
- **Supabase Storage:** 1 private bucket (make-283466b6-documents)
- **Database Tables:** 48 (32 prior + 12 strategy engine + 4 onboarding: projects, roadmaps, roadmap_phases, activities)
- **Auto-Migration Functions:** 2 (ensureAISchema + ensureOnboardingSchema)
- **SQL Trigger Files:** 4 (broadcast triggers for Realtime)
- **RLS Policies on realtime.messages:** 4 (ai_runs_read, wizard_sessions_read, pipeline_deals_read, canvas_blocks_read)
- **Planning Docs:** 17 spec documents in `/docs/lean/`
- **Current Version:** v0.25.0
- **Project Completion:** ~93% (all 14 dashboard phases complete; onboarding agent wired; full Realtime system; enhancements + infrastructure remaining)