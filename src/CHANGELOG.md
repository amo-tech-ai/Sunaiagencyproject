# CHANGELOG — Sun AI Agency Website

**Project:** Sun AI Agency — AI Consulting & Solutions Website
**Stack:** Vite + React + Tailwind CSS v4 + Supabase + Vercel
**Design System:** BCG Consulting-Inspired (Calm Luxury Editorial)
**Current Version:** v0.28.0
**Last Updated:** 2026-03-13

---

## [0.28.0] — 2026-03-13 — KV Store Migration + Gemini Model Update

### Summary

Migrated all 3 remaining KV store consumers to proper Supabase tables with typed columns, RLS policies, indexes, and triggers. Created new `dashboard_documents` table. Updated all Gemini model references from deprecated `gemini-2.0-flash` to `gemini-3-flash-preview`.

### Changed — KV Store Migration (25 endpoints)

- **`workflow-routes.tsx`** — Migrated from `kv.getByPrefix("workflow:")` / `kv.set()` to `adminClient().from("workflows")` and `.from("workflow_executions")`. 8 endpoints: list, create/update, delete, toggle, metrics, executions, run, install-template.
- **`financial-routes.tsx`** — Migrated from `kv.getByPrefix("invoice:")` / `kv.set()` to `adminClient().from("dashboard_invoices")` and `.from("dashboard_payments")`. 10 endpoints: metrics, invoices CRUD, payments, charts, profitability, reminder.
- **`document-routes.tsx`** — Migrated from `kv.get("doc:")` / `kv.set()` to `adminClient().from("dashboard_documents")`. 7 endpoints: list, stats, get, upload, delete, share, update. Storage operations unchanged.
- **`kv_store.tsx`** — Marked deprecated. No route modules import it. KV table is empty.

### Added

- `supabase/migrations/20260313120000_create_dashboard_documents.sql` — New table with RLS, 3 indexes, `updated_at` trigger

### Changed — Gemini Model Update

- `gemini.tsx` — `GEMINI_MODEL` constant: `gemini-2.0-flash` → `gemini-3-flash-preview`
- `ai-routes.tsx` — Hardcoded model string in aggregate-stats response
- `agent-routes.tsx` — Model strings in run response and ai_run_logs insert
- `ensure-schema.tsx` — Default column values for `ai_run_logs.model` and `ai_cache.model`

### Database Tables (New)

| Table | Columns | RLS | Indexes |
|-------|---------|-----|---------|
| `dashboard_documents` | 15 (id, name, category, file_type, storage_path, project_id, project_name, uploaded_by, uploaded_by_name, version, file_size, mime_type, ai_summary, created_at, updated_at) | 5 policies (authenticated CRUD + service_role) | category, uploaded_by+created_at, project_id |

---

## [0.27.0] — 2026-03-13 — Dashboard Agent Team Widget, CRM Deal Scoring, 116-Agent Catalog

### Summary

Three major deliverables: (1) Rebuilt the Dashboard Agent Team Widget with AgentAvatar, live API matching via POST /agents/match, fit score badges, running/online/idle status indicators, and scrollable agent list with catalog link. (2) Integrated CRM deal scoring into the pipeline kanban — every deal now gets a deterministic health score (0-100) computed from probability alignment, recency, value, contact coverage, and notes coverage. Pipeline Analyst scores early-pipeline deals; Deal Strategist scores late-pipeline deals. DealHealthBar from shared components replaces the inline health bar. (3) Expanded the agent catalog from 16 to 116 agents across all 10 divisions. (4) Created comprehensive agent list documentation cataloging all 116 agents in table format with division breakdowns, data model reference, and usage matrix.

### Added

- `/components/wizard/data/agentCatalogExpanded.ts` — 100 additional agents across 10 divisions
- `/lib/dealScoring.ts` — Deterministic deal health scoring with scoreDeals() and getPipelineHealthSummary()
- `/docs/agency/09-agents-list.md` — Complete 116-agent reference doc: summary table (10 divisions with curated/expanded/total counts), per-division detail tables (emoji, slug, name, role, curated status), flat quick-reference table of all 116 agents, `CatalogAgent` TypeScript interface spec, source file index, and agent usage matrix across wizard/dashboard/CRM/catalog/runner surfaces

### Changed

- `/components/dashboard/AgentTeamWidget.tsx` (v2) — Complete rebuild with AgentAvatar, API matching, fit scores, status dots
- `/components/dashboard/DashboardHome.tsx` — Passes industry/goals/companySize/systemIds to AgentTeamWidget
- `/components/dashboard/crm/DealCard.tsx` (v2) — Uses DealHealthBar with agent attribution
- `/components/dashboard/crm/CRMPipelinePage.tsx` — Auto-scores all deals via scoreDeals()
- `/components/wizard/data/agentCatalog.ts` — Added ALL_CATALOG_AGENTS export (116 total), updated getAgentBySlug()

---

## [0.26.2] — 2026-03-13 — Agent Loader, 6 Reusable UI Components, Wizard AI Team Wiring

### Summary

Built the server-side `agent-loader.tsx` utility for runtime agent prompt compilation (16-agent registry, 4-layer prompt assembly, deterministic matching algorithm with scoring by system/industry/goal). Created 6 reusable UI components (AgentAvatar, AgentBadge, AgentTeamCard, AgentStatusRow, InsightCard, DealHealthBar) in `/components/shared/agents/`. Wired `POST /agents/match` into wizard Steps 3-5: Step 3 shows `AgentReasoningBadge` per system card, Steps 4-5 call the match API on mount and display the AI-matched team using `AgentTeamCard` components with fit scores, division labels, and first tasks. The match endpoint now uses deterministic server-side scoring (no Gemini call needed) while `/agents/run` uses `compilePrompt()` to inject agent capabilities into Gemini prompts.

### Added

- **`/supabase/functions/server/agent-loader.tsx`** — Server-side agent prompt utility. 16-agent registry with capabilities, rules, mission, industries, goals. Functions: `getAgentMeta()`, `getAllAgentMeta()`, `extractExcerpt()`, `selectAgents()` (deterministic scoring: +25 system, +15 industry, +10 goal, +12 industry extras), `compilePrompt()` (4-layer: base → agent excerpt → route instructions → JSON schema). System-agent map for 12 AI systems. Industry extras for 9 industries. Goal-agent map for 6 goal types. Task templates for system-specific first tasks.
- **`/components/shared/agents/AgentAvatar.tsx`** — Emoji in colored circle. Props: slug, size (sm/md/lg), emoji override, color override.
- **`/components/shared/agents/AgentBadge.tsx`** — Compact pill: emoji + name. Color from division. Used on insight cards, deal cards, recommendations.
- **`/components/shared/agents/AgentTeamCard.tsx`** — Full agent card: avatar, name, division, role, first task, fit score badge, reason, status dot. Used in wizard Steps 4-5 and dashboard.
- **`/components/shared/agents/AgentStatusRow.tsx`** — Compact row: avatar, name, status dot (online/idle/running/error), last output preview, last run time.
- **`/components/shared/agents/InsightCard.tsx`** — Priority-coded insight: left border color, icon, agent attribution badge, impact label, action buttons.
- **`/components/shared/agents/DealHealthBar.tsx`** — Horizontal score bar (0-100) with color coding, risk label, agent attribution.
- **`/components/shared/agents/index.ts`** — Barrel export for all 6 components.

### Changed

- **`/supabase/functions/server/agent-routes.tsx`** — `POST /agents/match` now uses deterministic `selectAgents()` from agent-loader (no Gemini call). `POST /agents/run` now uses `compilePrompt()` to inject agent capabilities/rules/mission into the Gemini prompt (4-layer compilation).
- **`/lib/supabase.ts`** — `AgentMatchResponse` type updated with emoji, division, role, firstTask fields.
- **`/components/wizard/steps/StepSystemRecommendations.tsx`** — Added `AgentReasoningBadge` showing which agent powers each system recommendation (emoji + name pill per card).
- **`/components/wizard/steps/StepExecutiveSummary.tsx`** — Calls `POST /agents/match` on mount. Shows AI-matched team using `AgentTeamCard` components with fit scores. Falls back to local `matchAgents()` if API fails.
- **`/components/wizard/steps/StepLaunchProject.tsx`** — Calls `POST /agents/match` on mount. Replaces old icon-based agent list with `AgentTeamCard` grid. Shows loading state during match.

### Production Status

- Shared UI components: 6 new reusable agent components
- Server utilities: 1 new (agent-loader.tsx with 5 exported functions)
- Wizard steps enhanced: 3 (Steps 3, 4, 5)
- API routes enhanced: 2 (`/agents/match`, `/agents/run`)

---

## [0.26.1] — 2026-03-13 — Full-Stack Architecture Diagram (Blueprint Aesthetic)

### Summary

Created an interactive three-column system architecture diagram at `/app/agents/architecture-diagram` with a dark navy blueprint aesthetic. Maps the complete data flow: 31 frontend components (left column, nested boxes) → 38 API edge function routes (center column, method-colored horizontal bars) → 25 database tables (right column, table icons with column counts). 20 data flow paths shown as bezier curve arrows connecting all three columns. Hover any element to highlight its complete data path and dim unrelated elements. Click an API route to open a detail panel showing source file, group, and connected components/tables.

### Added

- **`/components/dashboard/agents/AgentArchitectureDiagram.tsx`** — Interactive SVG architecture diagram. Blueprint grid background (20px fine + 100px major). Color-coded groups: Wizard (purple), AI (orange), Agents (cyan), CRM (amber), Strategy (indigo), Onboarding (teal). Method badges (GET=green, POST=blue, PUT=yellow, DELETE=red). Rotated group labels. Stats footer + summary cards.
- **`/docs/agency/08-architecture-diagram.md`** — Full documentation: 31 components, 38 API routes, 25 tables, 20 data flows, interactive features.

### Changed

- **`/routes.tsx`** — Added route `agents/architecture-diagram`
- **`/components/dashboard/DashboardSidebar.tsx`** — AI Agents: 5 sub-items (Catalog, System Map, Data Model, Architecture, Monitor)

### Production Status

- Dashboard pages: 46 | Agency docs: 9 (00-08) | Total routes: 54

---

## [0.26.0] — 2026-03-13 — Agency Agents: Server Wiring, Live API, System Map & Data Model ERD

### Summary

Major Agency Agents infrastructure release. Fixed a critical server bug where `agent-routes.tsx` (3 endpoints) was defined but never mounted — `POST /agents/run`, `POST /agents/match`, and `GET /agents/history/:slug` were unreachable. Added typed `agentCatalogApi` to the frontend API layer. Wired AgentRunnerPage to call the real Gemini-backed edge function (with graceful simulated fallback). Wired RunHistoryTab to fetch real `ai_run_logs` entries (with mock fallback). Created two interactive SVG documentation diagrams: an Agent System Map showing product areas connected to color-coded agent circles with single/multi-agent call legend, and an Entity-Relationship Diagram showing the 5 agent database tables with PK/FK badges, monospace columns, and one-to-many relationship arrows. Both diagrams are hover-interactive with highlight/dim behavior. Added 2 new docs to `/docs/agency/`.

### Fixed — Agent Routes Not Mounted (Critical)

- **`/supabase/functions/server/index.tsx`** — Imported `agents` from `agent-routes.tsx` and mounted with `app.route("/", agents)`. Added `ensureAISchema()` middleware for `/agents/*` routes. Previously, all 3 agent endpoints were defined in `agent-routes.tsx` but never reachable because the file was not imported or mounted on the Hono app. Edge function route count: 65 → 68.

### Added — Frontend Agent API (`agentCatalogApi`)

- **`/lib/supabase.ts`** — Added `agentCatalogApi` module with 3 typed methods:
  - `agentCatalogApi.run({ slug, agentName, task, context?, format? }, token?)` → `AgentRunResponse`
  - `agentCatalogApi.match({ industry, goals?, companySize?, systemIds? }, token?)` → `AgentMatchResponse`
  - `agentCatalogApi.history(slug, limit?, token?)` → `{ runs: AgentRunHistoryEntry[] }`
- **TypeScript interfaces:** `AgentRunResponse`, `AgentMatchResponse`, `AgentRunHistoryEntry`

### Changed — AgentRunnerPage: Real Gemini API

- **`/components/dashboard/agents/AgentRunnerPage.tsx`** — `handleRun()` now calls `agentCatalogApi.run()` which hits the real `POST /agents/run` edge function (Gemini 2.0 Flash). On API failure, gracefully falls back to the existing `generateSimulatedOutput()` function with a yellow warning banner. Added `error` state for fallback notice display.

### Changed — AgentDetailPage: Live Run History

- **`/components/dashboard/agents/AgentDetailPage.tsx`** — `RunHistoryTab` now calls `agentCatalogApi.history()` on mount to fetch real `ai_run_logs` entries filtered by `prompt_type = "agent-run:{slug}"`. Falls back to mock data with an amber "Showing sample data" notice if API returns empty or errors. Added loading spinner state.

### Added — Agent System Map (`/app/agents/system-map`)

- **`/components/dashboard/agents/AgentSystemMap.tsx`** — Interactive SVG diagram mapping 9 product areas (Wizard Steps 3-5, Dashboard, Insights, CRM, Workflows, Financial, Strategy) to 13 agent circles. Color-coded by division (Engineering=blue, Sales=amber, Marketing=purple, PM=indigo, Testing=red, Support=emerald). Bezier curve connections with hover highlight/dim. Legend bar shows single-agent (solid line), multi-agent (dashed line), and no-call (dotted line) patterns. Zoom controls. Info panel with token cost summary.

### Added — Agent Data Model ERD (`/app/agents/er-diagram`)

- **`/components/dashboard/agents/AgentERDiagram.tsx`** — Interactive SVG entity-relationship diagram showing 5 database tables: `agent_catalog`, `agent_assignments`, `agent_runs`, `agent_outputs`, `insight_cards`. White table cards on dot-grid background with monospace column names, PK (blue) and FK (amber) badges, column types, and nullable indicators. One-to-many relationship arrows with "1" circle markers and arrowhead markers. Hover highlights connected tables and dims unrelated ones. Click any table to open a detailed inspector panel with full column specs and clickable cross-references to related tables. Zoom controls with reset.

### Added — Sidebar Sub-Items

- **`/components/dashboard/DashboardSidebar.tsx`** — AI Agents section now has 4 sub-items (was 3): Catalog, System Map, Data Model, Monitor. Sub-items only show when the AI Agents section is active.

### Added — Documentation

- **`/docs/agency/06-agent-system-mapping.md`** — Agent-to-product mapping table, implementation status checklist, output combination patterns (Parallel+Merge, Primary+Augmentation, Independent+Display), token budget per feature, files modified/created index.
- **`/docs/agency/07-data-model-erd.md`** — Full schema documentation for 5 agent tables with column specs, types, keys, relationships diagram, implementation notes, migration path guidance.

### Files Created

```
/components/dashboard/agents/AgentSystemMap.tsx — Interactive SVG system mapping diagram
/components/dashboard/agents/AgentERDiagram.tsx — Interactive SVG ER diagram
/docs/agency/06-agent-system-mapping.md — System mapping documentation
/docs/agency/07-data-model-erd.md — Data model ER documentation
```

### Files Modified

```
/supabase/functions/server/index.tsx — Mount agent routes + AI schema middleware
/lib/supabase.ts — agentCatalogApi module (3 methods + 3 interfaces)
/components/dashboard/agents/AgentRunnerPage.tsx — Real Gemini API + fallback
/components/dashboard/agents/AgentDetailPage.tsx — Live run history + fallback
/components/dashboard/DashboardSidebar.tsx — 2 new sub-items (System Map, Data Model)
/routes.tsx — 2 new routes (agents/system-map, agents/er-diagram)
```

### Production Status

- Edge function routes: 68 (65 prior + 3 agent catalog now mounted)
- Dashboard pages: 45 production components (43 prior + 2 diagrams)
- Agency docs: 8 (00-07)
- Total routes: 53 (51 prior + 2 new dashboard pages)

---

## [0.25.0] — 2026-03-10 — Onboarding Agent (Task 064) + Home Page Cleanup

### Summary

Full implementation of the Onboarding Agent (task 064) — the backend pipeline that converts completed wizard sessions into proper database records. When a user finishes the 5-step Project Brief Wizard, the agent reads wizard data, upserts a client record, creates a project with roadmap/phases, logs an activity event, and returns a full summary. Also removed the Strategic Framework (PlaybookSection) and Testimonial quote sections from HomePageV3 to streamline the home page flow.

### Added — Onboarding Agent Backend (2 routes)

- **`/supabase/functions/server/onboarding-routes.tsx`** — New Hono route group with 2 endpoints:
  - `POST /onboarding/complete` — Main agent: reads `wizard_sessions` + `wizard_answers`, upserts `clients`, inserts `projects` + `roadmaps` + `roadmap_phases` + `activities`. Idempotent (checks `wizard_session_id` uniqueness). Returns `{ success, client, project, roadmap, phases[], activity, summary, durationMs }`.
  - `GET /onboarding/status/:sessionId` — Check if a wizard session has already been onboarded. Graceful fallback if tables don't exist yet.
- **Auth:** Uses `requireAuth()` with anonymous fallback via `getUserFromToken()`. Both authenticated and anonymous users supported.

### Added — Auto-Migration for Onboarding Tables

- **`/supabase/functions/server/ensure-schema.tsx`** — Added `ensureOnboardingSchema()` function. Auto-creates 4 tables on first request: `projects`, `roadmaps`, `roadmap_phases`, `activities`. Uses `CREATE TABLE IF NOT EXISTS` (idempotent). Adds RLS policies for `service_role`. Runs once per server lifecycle via `onboardingMigrationDone` guard.

### Added — Frontend API Layer

- **`/lib/supabase.ts`** — Added `onboardingApi` module with 2 methods:
  - `onboardingApi.complete(sessionId, token?)` — Calls `POST /onboarding/complete`
  - `onboardingApi.status(sessionId, token?)` — Calls `GET /onboarding/status/:sessionId`
- **TypeScript interfaces:** `OnboardingCompleteResponse`, `OnboardingStatusResponse`

### Changed — Server Entry Point

- **`/supabase/functions/server/index.tsx`** — Mounted onboarding routes with schema auto-migration middleware (`ensureOnboardingSchema()` runs before first `/onboarding/*` request). Health check now reports `onboardingSchema` migration status.

### Changed — Wizard Step 5 Integration

- **`/components/wizard/steps/StepLaunchProject.tsx`** — Wired onboarding agent to fire automatically after roadmap generation completes. Added live status indicator in the "What's been created" checklist section:
  - `idle` — "Preparing to save project to database…"
  - `checking` — "Checking existing records…"
  - `running` — "Creating project records…"
  - `done` — "Project saved — N phases, client record created (Xms)"
  - `error` — "Could not save to database" with Retry button
- Checks `onboardingApi.status()` first (idempotent guard), then calls `onboardingApi.complete()`.

### Removed — Home Page Sections

- **`/components/HomePageV3.tsx`** — Removed 2 sections from the home page:
  - **Strategic Framework** (`PlaybookSection`) — The "Future-Ready Playbook for Climbing the AI Maturity Curve" accordion with 4 items (Data Readiness, Use Case Prioritization, Model Selection, Operationalization)
  - **Testimonial** (`TestimonialSection`) — The Sarah Mitchell quote "Sun AI didn't just build us an AI system — they transformed how our entire team thinks about operations."
- Cleaned up dead code: `PLAYBOOK_ITEMS` array, `TESTIMONIAL_IMG` constant, `PlaybookSection` function, `TestimonialSection` function
- Page now flows: How We Deliver → Metrics Band → Final CTA

### Files Created

```
/supabase/functions/server/onboarding-routes.tsx — Onboarding agent (2 routes)
```

### Files Modified

```
/supabase/functions/server/ensure-schema.tsx — ensureOnboardingSchema() auto-migration
/supabase/functions/server/index.tsx — Mount onboarding routes + schema middleware
/lib/supabase.ts — onboardingApi module (2 methods + 2 interfaces)
/components/wizard/steps/StepLaunchProject.tsx — Auto-trigger onboarding + status UI
/components/HomePageV3.tsx — Removed PlaybookSection + TestimonialSection
```

### Production Status

- Edge function routes: 65 (63 prior + 2 onboarding)
- Database tables: 48 (44 prior + 4 onboarding: projects, roadmaps, roadmap_phases, activities)
- Auto-migration functions: 2 (ensureAISchema + ensureOnboardingSchema)

---

## [0.24.6] — 2026-03-09 — Service Card Content & Cloudinary Image Migration

### Summary

Renamed "Industry Chatbot Packages" card to "AI Automations" with updated description and extended copy. Migrated 3 more service card images to Cloudinary (Custom AI Development, AI-Powered Web Development, AI Automations), bringing the total to 10 of 12 service grid cards on Cloudinary. Created `/docs/cloudinary-image-swap-guide.md` with a 5-step process for future image swaps.

### Changed — HomePageV3.tsx (Service Cards)

- **Industry Chatbot Packages → AI Automations** — Renamed card title, updated `desc` to "Industry-specific AI-powered workflows that automate repetitive business processes, connect your tools, and run operations automatically.", updated `extended` to "AI solutions designed to automate operations, customer communication, and workflows across Healthcare, Real Estate, Automotive, Tourism, and E-commerce." Route unchanged (`/industries`).
- **Custom AI Development image** — Unsplash → `https://res.cloudinary.com/ddysyn5rr/image/upload/v1772367392/screens16_b9nxog.jpg`
- **AI-Powered Web Development image** — Unsplash → `https://res.cloudinary.com/ddysyn5rr/image/upload/v1772367392/screens9_uyjzie.jpg`
- **AI Automations image** — Unsplash → `https://res.cloudinary.com/ddysyn5rr/image/upload/v1773099619/automation_coppbc.jpg`

### Added — Documentation

- **`/docs/cloudinary-image-swap-guide.md`** — 5-step guide for swapping images to Cloudinary: file identification map, URL format, data array location, replacement instructions, verification steps. Includes common mistakes table and current Cloudinary image tracking table.

### Cloudinary Migration Status

| Card | Status |
|---|---|
| Hero | Cloudinary |
| AI Agent Systems | Cloudinary |
| AI Chatbots | Cloudinary |
| WhatsApp AI Automation | Cloudinary (v0.24.5) |
| AI Sales & Marketing CRM | Cloudinary |
| AI MVP Development | Cloudinary |
| Custom AI Development | Cloudinary (v0.24.6) |
| AI-Powered Web Development | Cloudinary (v0.24.6) |
| E-commerce AI | Cloudinary |
| AI Automations | Cloudinary (v0.24.6) |
| Story section | Unsplash |
| Testimonial | Unsplash |
| Specialized Services (×3) | Unsplash |

### Files Modified

```
/components/HomePageV3.tsx — 3 image swaps + 1 card rename with new copy
```

### Files Created

```
/docs/cloudinary-image-swap-guide.md — Cloudinary image swap guide
```

---

## [0.24.5] — 2026-03-09 — Auth Split-Screen UI: Full Spec Alignment

### Summary

Complete rewrite of `AuthPage.tsx` to match spec `003-auth-ui-layout` (`/imports/auth-split-screen-ui.md`). All 15 spec deviations resolved: route changed from `/login` to `/auth`, left panel updated to `#0A211F` dark teal with subtle geometric pattern, right panel now white with 380px max-width form container, tab toggle UI replacing bottom text link, 48px input heights, per-field inline validation on blur, "Forgot password?" link, password strength indicator with 4-bar meter, Terms of Service/Privacy Policy links, Playfair Display headings, Lora body text, and responsive breakpoints (mobile 120px header band, tablet 40/60 split, desktop 50/50 split). All internal links updated from `/login` to `/auth` across Header, DashboardLayout, and AuthCallbackPage.

### Changed — AuthPage Full Rewrite (15 spec items)

- **Route** — `/login` → `/auth` (primary), `/login` now redirects to `/auth` via `<Navigate replace />`
- **Left panel background** — `#1A1A1A` (charcoal) → `#0A211F` (dark teal per spec)
- **Left panel pattern** — Added subtle geometric pattern overlay at 4% opacity
- **Left panel layout** — Fixed 480px → responsive: mobile 120px band, tablet 40%, desktop 50%
- **Right panel background** — `#F5F5F0` (off-white) → `#FFFFFF` (white per spec)
- **Form max-width** — 420px → 380px per spec
- **Tab toggle** — Replaced bottom text link ("Don't have an account? Sign up") with proper top tab toggle ("Sign In" | "Create Account") with animated green underline indicator
- **Input height** — ~40px (`py-2.5`) → 48px explicit height per spec
- **Per-field inline errors** — Replaced single error banner with per-field inline errors on blur (with AnimatePresence enter/exit). General error banner retained for server-side auth errors.
- **Forgot password link** — Added "Forgot password?" link in Sign In mode (placeholder for future flow)
- **Password strength indicator** — Added 4-bar strength meter (Weak/Fair/Good/Strong) with color coding on Create Account form
- **Terms link** — Added "By creating an account you agree to our Terms of Service and Privacy Policy" with styled links on signup form
- **Submit disabled** — Submit button now disabled until all fields validate (per spec: "disabled submit until valid")
- **Typography** — All headings now use `Playfair Display`, all body/labels/inputs now use `Lora` (fonts already imported in globals.css)
- **Text color** — Updated heading color references from `#1A1A1A` to `#0A211F` to match dark teal brand panel

### Changed — Route References (4 files)

- **`/routes.tsx`** — `/auth` is now primary route, `/login` redirects to `/auth`
- **`/components/Header.tsx`** — Both desktop and mobile Sign In links now point to `/auth`
- **`/components/dashboard/DashboardLayout.tsx`** — Auth guard redirect now uses `/auth?return=...`
- **`/components/AuthCallbackPage.tsx`** — All error/timeout fallbacks now redirect to `/auth`

### Files Modified

```
/components/AuthPage.tsx — Full rewrite (15 spec deviations resolved)
/routes.tsx — /auth primary route, /login redirect alias
/components/Header.tsx — 2 link updates (desktop + mobile)
/components/dashboard/DashboardLayout.tsx — Auth guard redirect
/components/AuthCallbackPage.tsx — 3 redirect + 2 comment updates
```

### Spec Compliance

| # | Spec Requirement | Status |
|---|---|---|
| 1 | `/auth` route | Done |
| 2 | Left panel `#0A211F` | Done |
| 3 | Tab toggle UI | Done |
| 4 | 48px input height | Done |
| 5 | Forgot password link | Done |
| 6 | Password strength indicator | Done |
| 7 | Terms link | Done |
| 8 | Per-field inline errors | Done |
| 9 | White right panel | Done |
| 10 | 380px max-width | Done |
| 11 | Mobile 120px header band | Done |
| 12 | Tablet 40/60 split | Done |
| 13 | Desktop 50/50 split | Done |
| 14 | Playfair Display + Lora fonts | Done |
| 15 | Minimal pattern on left panel | Done |

---

## [0.24.4] — 2026-03-09 — Full Broadcast Migration + Canvas Realtime Sync

### Summary

Migrated all Realtime hooks from deprecated `postgres_changes` to `broadcast` + database triggers per `supabase-realtime-guide.md`. All 4 channels now use private broadcast channels with `useSupabaseBroadcast` as base. Added `useRealtimeCanvasSync` for collaborative strategy canvas editing.

### Migrated

- **`useRealtimeAIRuns`** — Switched to broadcast on `ai-runs:global` topic. Same public API, same 3s throttle.
- **`useRealtimeWizardSync`** — Switched to broadcast on `wizard:session:{id}` topic. Now exposes `markLocalSave()`. Conditional trigger (step/status/form_data only).

### Added

- **`useRealtimeCanvasSync`** — Canvas-scoped broadcast for collaborative editing (`canvas:{id}:blocks`). Dual-trigger: `lean_canvases` UPDATE + `lean_canvas_versions` INSERT.
- **3 SQL trigger files** — `ai-runs-broadcast-trigger.sql`, `wizard-sessions-broadcast-trigger.sql`, `lean-canvases-broadcast-trigger.sql`

### Changed

- **`WizardContext.tsx`** — Calls `markLocalSave()` before cloud saves.
- **`StrategyEnginePage.tsx`** — Integrated canvas sync with live indicator and `markCanvasWrite()`.
- **Wiring map** — Fully rewritten Realtime section: 4 broadcast channels, 4 SQL triggers.

---

## [0.24.3] — 2026-03-09 — CRM Pipeline Realtime: Live Multi-User Kanban

### Summary

Extended Supabase Realtime to the CRM Pipeline Kanban board using the **broadcast** pattern (per `supabase-realtime-guide.md`) instead of the deprecated `postgres_changes` pattern. Created `useRealtimeDealUpdates` hook built on top of the user-created `useSupabaseBroadcast` base hook. When another user creates, moves, or deletes a deal, the board auto-refreshes. Self-write suppression via `markLocalWrite()` prevents optimistic updates from being overwritten by the echo from the database trigger.

### Added

- **`/lib/hooks/useRealtimeDealUpdates.ts`** — Pipeline-scoped deal broadcast listener. Subscribes to `pipeline:{pipelineId}:deals` private channel for INSERT/UPDATE/DELETE events. Self-write suppression via `markLocalWrite()` (2s window). Re-subscribes on active pipeline change.
- **`/imports/crm-deals-realtime-trigger.sql`** — Database trigger SQL for `crm_deals` table. Uses `realtime.broadcast_changes()` to scoped `pipeline:{pipeline_id}:deals` topics. Includes RLS policy, verification queries, and optional conditional-broadcast variant.

### Changed

- **`/components/dashboard/crm/CRMPipelinePage.tsx`** — Integrated `useRealtimeDealUpdates`. All 4 mutation handlers call `markLocalWrite()` before optimistic update. Live indicator (green pulsing dot / amber fallback). Full refresh on external deal events.
- **`/lib/hooks/index.ts`** — Added exports for `useSupabaseBroadcast`, `useRealtimeDealUpdates`, and associated types.
- **`/imports/frontend-backend-map-1.md`** — Added `pipeline:{id}:deals` channel, updated Realtime Architecture section.

### Architecture Decision

First hook to use the **broadcast** pattern per `supabase-realtime-guide.md` (replaces deprecated `postgres_changes`).

---

## [0.24.2] — 2026-03-09 — Supabase Realtime Channels: ai-runs + wizard-progress

### Summary

Implemented the two missing Supabase Realtime channels identified in the frontend-backend wiring map audit. Created a 3-layer hook architecture: generic `useSupabaseRealtime` base hook, `useRealtimeAIRuns` for live AI agent monitoring, and `useRealtimeWizardSync` for multi-tab wizard session synchronization. Both hooks degrade gracefully when Realtime is not enabled on their tables — AgentsPage falls back to manual Refresh, wizard continues with localStorage + cloud save. Updated the wiring map from its early-snapshot state to reflect all 8 API modules (72 methods), 63 edge function routes, and 2 Realtime channels.

### Added — Realtime Hooks (3 files)

- **`/lib/hooks/useSupabaseRealtime.ts`** — Generic Supabase Realtime subscription hook. Manages channel lifecycle (subscribe, reconnect, cleanup), tracks connection status (`connecting | connected | disconnected | error`), counts events, uses callback refs to avoid re-subscriptions on handler changes, and cleans up on unmount.
- **`/lib/hooks/useRealtimeAIRuns.ts`** — Subscribes to `ai_run_logs` INSERT events. Throttled (3s default) auto-refresh callback, live event counter, `isLive` boolean for UI indicator. Used by AgentsPage for real-time dashboard updates.
- **`/lib/hooks/useRealtimeWizardSync.ts`** — Subscribes to `wizard_sessions` UPDATE filtered by session ID. Self-write filtering (3s window) to avoid notification from own saves. Detects backend status changes (e.g., AI processing completed) and multi-tab step changes.

### Changed — Component Integration

- **`/components/dashboard/agents/AgentsPage.tsx`** — Integrated `useRealtimeAIRuns` hook. Replaced static label with live connection indicator: green pulsing dot when connected, amber dot with "retry live" link on error, "Connecting..." during initial subscription. Auto-refreshes all panels (stats, cache, logs) on new AI run events.
- **`/components/wizard/WizardContext.tsx`** — Integrated `useRealtimeWizardSync` hook. On external `status: completed`, shows toast "Your AI analysis is ready!". On external step change (multi-tab), shows toast with "Sync" action button to adopt the new step.
- **`/lib/hooks/index.ts`** — Added exports for all 3 new hooks + their TypeScript types.

### Updated — Documentation

- **`/imports/frontend-backend-map-1.md`** — Complete rewrite from early-snapshot to current state. Now documents all 8 API modules (72+ methods), 63 edge function routes, 2 Realtime channels with prerequisites, dashboard data flow table, Mermaid route map, server route summary, and all 8 resolved blockers.

### Prerequisites (Manual)

To activate Realtime subscriptions, enable Realtime replication on the following tables in **Supabase Dashboard > Database > Replication**:
1. `ai_run_logs` — for live AI agent monitoring
2. `wizard_sessions` — for multi-tab wizard sync

If Realtime is not enabled, both hooks degrade gracefully with no user-facing errors.

### Files Created

```
/lib/hooks/useSupabaseRealtime.ts
/lib/hooks/useRealtimeAIRuns.ts
/lib/hooks/useRealtimeWizardSync.ts
```

### Files Modified

```
/components/dashboard/agents/AgentsPage.tsx — Realtime integration + live indicator
/components/wizard/WizardContext.tsx — Realtime sync + multi-tab detection
/lib/hooks/index.ts — 3 new hook exports + types
/imports/frontend-backend-map-1.md — Complete rewrite to current state
```

### Production Status

- Total routes: 51 (32 public + 16 authenticated + 3 aliases)
- Dashboard pages: 43 production components
- Edge function routes: 63
- Realtime channels: 2 (ai-runs, wizard-progress)
- Custom hooks: 8 (was 5)
- Project completion: ~91%

---

## [0.24.1] — 2026-03-09 — Sitemap v13 Update (51 Routes Documented)

### Updated

- **`/docs/sitemap.md`** — Bumped to Version 13. Added 23 new routes across 4 sections:
  - **Auth (2):** `/login`, `/auth/callback`
  - **Wizard (3):** `/wizard`, `/wizard/processing`, `/wizard/proposal`
  - **Additional Services (3):** `/services/chatbot`, `/whatsapp-ai`, `/docs/supabase`
  - **App Dashboard (15):** `/app/dashboard`, `/app/strategy` (with 6 sub-features), `/app/projects`, `/app/projects/:id`, `/app/roadmap`, `/app/clients`, `/app/clients/:id`, `/app/crm/pipelines`, `/app/insights`, `/app/documents`, `/app/financial`, `/app/workflows`, `/app/agents`, `/app/settings`
- Route-to-component mapping table expanded to 52 rows
- Full URL list updated (51 entries)
- All previously planned routes moved to ✅ Completed
- Technical notes updated: Vite + React, `react-router` v7, Supabase Auth, Hono backend, Motion
- Added document changelog table

### Production Status

- Total routes: 51 (32 public + 16 authenticated + 3 aliases)
- Dashboard pages: 43 production components
- Edge function routes: 63 (49 prior + 14 strategy)
- Project completion: ~90% (All 14 dashboard phases complete)

---

## [0.24.0] — 2026-03-09 — Lean Strategy Engine: Complete (Phase 14 — 26/26 Tasks)

### Added

- **`AnalysisProgressSheet.tsx`** (Task 20) — 5-agent animated overlay with phase A/B simulation
- **`RoadmapExecutionPanel.tsx`** (Task 21) — Phase cards with progress bars from wizard data
- **`CanvasVersionHistory.tsx`** (Task 22) — Side-sheet with timeline, view snapshots, revert
- **Mobile Tab Bar** (Task 23) — 3-tab responsive nav with pending badge

### Updated

- **`StrategyEnginePage.tsx`** — Integrated all 3 new components + mobile tabs + desktop 3-col grid

---

## [0.23.0] — 2026-03-09 — Lean Strategy Engine: Full Data Pipeline + UI (Phase 14a)

### Summary

Complete implementation of the Strategy Engine data pipeline (Tasks 1-8): TypeScript types, backend CRUD + AI routes, frontend API, data hook, production page with 3x3 Lean Canvas grid, 5-metric bar, intelligence panel, AI synthesis per block, "Run Analysis" 3-agent orchestration, wizard-to-canvas seeding, sidebar nav, and route registration. All 14+ edge function routes wired to 12 Supabase tables.

### Added

- **`/lib/types/strategy.ts`** — 20+ TypeScript interfaces/types matching all 12 strategy tables
- **`/supabase/functions/server/strategy-routes.tsx`** — 14 Hono routes: canvas CRUD, versions, insights, opportunities, recommendations, actions, metrics, analyze, synthesize-block
- **`/lib/hooks/useStrategyData.ts`** — Data hook with 8 action methods
- **`/components/dashboard/strategy/StrategyEnginePage.tsx`** — Full production page

### Updated

- **`/supabase/functions/server/index.tsx`** — Mounted strategy routes
- **`/lib/supabase.ts`** — Added `strategyApi` with 14 typed methods
- **`/lib/hooks/index.ts`** — Exported `useStrategyData`
- **`/routes.tsx`** — Added `/app/strategy` route
- **`/components/dashboard/DashboardSidebar.tsx`** — Added Strategy nav item (Brain icon), version bumped to v0.23.0

---

## [0.22.5] — 2026-03-09 — Supabase Database Plan with ERD & Data Flow Diagrams

### Summary

Created comprehensive Supabase database plan at `/docs/lean/16-supabase-database-plan.md`. Includes full ERD diagrams (12-table Strategy Engine ERD + 44-table Full Platform ERD), 5 data flow diagrams (canvas creation, block editing, 5-agent analysis orchestration, recommendation approval, per-block AI synthesis), complete table specs, cross-domain relationship maps, RLS policies, indexes, triggers, copy-paste migration SQL, rollback SQL, and post-migration verification queries. Updated master plan to 17 spec docs. No code — planning only.

### Added

- **`/docs/lean/16-supabase-database-plan.md`** — 12-section plan: ERDs, table specs, data flows, RLS, indexes, triggers, migration SQL, rollback, verification

### Updated

- **`/docs/lean/00-lean-master-plan.md`** — Spec doc count → 17, index updated with doc 16

---

## [0.22.4] — 2026-03-09 — Lean Strategy Engine Plan Expanded (16 Docs)

### Summary

Expanded the Lean Strategy Engine planning from 10 to 16 spec docs. Added 6 new specs: Roadmap Execution Panel, Analysis Progress Sheet (5-agent overlay), Canvas Version History, Responsive Layout, Sidebar Navigation, and a comprehensive Frontend-Backend Wiring Plan (9-step build order, 12 Supabase tables, useStrategyData hook, component-to-data wiring map). Updated master plan with 26-task progress tracker, spec document index, version milestones, and suggested next steps. No code — planning only.

### Added — 6 New Spec Docs

- **`10-roadmap-execution-panel.md`** — Phase cards, progress bars, wizard data, empty state
- **`11-analysis-progress-sheet.md`** — 5-agent modal: phases A/B, simulated progress, completion summary
- **`12-canvas-version-history.md`** — Side sheet: version timeline, view snapshot, revert dialog
- **`13-responsive-layout.md`** — Mobile tabs, tablet 2-col, bottom sheet, breakpoint table
- **`14-sidebar-navigation.md`** — Brain icon, pending badge, header label, active/hover states
- **`15-frontend-backend-wiring.md`** — 9-step build, 12 tables, types, API, routes, hook, 15 component wiring, 14 E2E tests

### Updated — Master Plan (major revision)

- 26-task progress tracker table at top with phase/priority/effort/status columns
- Spec document index (16 docs with links)
- Phase 14a expanded to 12 tasks (added useStrategyData, sidebar, DB migration)
- Data layer upgraded from KV-only to 12 Supabase tables
- 5-agent specs with cache TTLs and analysis orchestration flow
- Version milestones: v0.23.0 (core CRUD), v0.23.1 (intelligence), v0.24.0 (full AI)
- 9-step suggested next steps for implementation

---

## [0.22.3] — 2026-03-09 — Lean Strategy Engine Initial Planning (10 Docs)

### Summary

Created initial 10 planning docs for Phase 14 — Lean Strategy Engine at `/docs/lean/` covering page layout, empty state, metrics bar, canvas grid, block editor, intelligence panel, card components, backend routes, and API wiring.

---

## [0.22.2] — 2026-03-08 — Hono Sub-Router 404 Fix for Dashboard Insights

### Summary

Fixed a Hono sub-router 404 issue where the `/dashboard-insights` route returned 404 when mounted via `app.route("/", ai)` in the AI sub-router. The root cause is that Hono's sub-router mounting can silently fail to register certain route patterns. The fix moves the `/dashboard-insights` route handler from `ai-routes.tsx` to direct registration on the main `app` in `/supabase/functions/server/index.tsx`. This is a known Hono pattern issue — other AI routes may need the same direct-registration treatment if they also 404 after deployment.

### Fixed — Hono Sub-Router 404

- **S00-SERVER** `index.tsx` — Moved `/dashboard-insights` route handler from `ai-routes.tsx` sub-router to direct registration on the main Hono `app` instance. Hono's `app.route("/", subRouter)` can silently drop certain route registrations, causing 404s. Direct registration on the main app is the reliable workaround.
- **S04-AI** `ai-routes.tsx` — Removed `/dashboard-insights` handler (now registered directly in `index.tsx`)

### Known Issue — Other AI Routes

Other routes mounted via the AI sub-router (`app.route("/", ai)`) may also exhibit 404 behavior. If additional AI routes return 404 after deployment, apply the same fix: move their handlers from `ai-routes.tsx` to direct registration in `index.tsx`.

### Files Modified

```
/supabase/functions/server/index.tsx — Direct registration of /dashboard-insights route
/supabase/functions/server/ai-routes.tsx — Removed /dashboard-insights handler
```

### Production Status

- Dashboard components: 43 production + 0 placeholder stubs (ALL PHASES COMPLETE)
- Edge function routes: 49 (6 wizard/AI + 3 agent stats + 6 CRM CRUD + 9 pipeline + 7 documents + 8 workflows + 10 financial)
- Supabase Storage: 1 private bucket (make-283466b6-documents)
- Project completion: ~85% (All 13 dashboard phases complete; remaining work is enhancements + infrastructure)

---

## [0.22.1] — 2026-03-07 — CRM Auth Hardening + Fresh Token Pattern

### Summary

Fixed CRM authentication errors where `getUserFromToken` in `/supabase/functions/server/auth.tsx` had a fragile anonymous key comparison that broke under certain token conditions. The fix adds JWT-payload decode checking for `"role": "anon"` instead of direct string comparison against `publicAnonKey`. Switched all CRM routes from `requireAuth()` middleware to the more flexible `getUserFromToken()` pattern, which allows both authenticated and anonymous access where appropriate. Updated `CRMPipelinePage.tsx` to use the `useAuth()` hook with the `'use-fresh-token'` pattern for authenticated API calls instead of hardcoded `publicAnonKey`. Both workflow and financial backend routes already use KV-based storage with this same pattern.

### Fixed — CRM Auth (`getUserFromToken` JWT Decode)

- **S00-AUTH** `auth.tsx` — `getUserFromToken()` previously compared the raw `Authorization` header value against `publicAnonKey` to detect anonymous requests. This broke when the header format varied (e.g., `Bearer <token>` vs raw key). Fixed by decoding the JWT payload and checking for `"role": "anon"` claim, which is the canonical way to identify Supabase anonymous tokens. Falls back gracefully if JWT decode fails.

### Changed — CRM Route Auth Pattern

- **S06-CRM** `crm-routes.tsx` — Switched all CRM CRUD routes from `requireAuth()` middleware (which returned 401 for anonymous tokens) to `getUserFromToken()` (which returns `null` for anonymous, allowing routes to handle both cases). This matches the pattern used by workflow and financial routes.
- **C-CRM-PIPELINE** `crm/CRMPipelinePage.tsx` — Replaced hardcoded `publicAnonKey` in API Authorization headers with `useAuth()` hook's `accessToken` using the `'use-fresh-token'` pattern. This ensures authenticated users send their actual session token (enabling RLS and user-scoped data) while still working for anonymous browsing.

### Files Modified

```
/supabase/functions/server/auth.tsx — JWT decode check for anon role
/supabase/functions/server/crm-routes.tsx — requireAuth() → getUserFromToken()
/components/dashboard/crm/CRMPipelinePage.tsx — useAuth() + fresh token pattern
```

### Production Status

- Dashboard components: 43 production + 0 placeholder stubs (ALL PHASES COMPLETE)
- Edge function routes: 49 (6 wizard/AI + 3 agent stats + 6 CRM CRUD + 9 pipeline + 7 documents + 8 workflows + 10 financial)
- Supabase Storage: 1 private bucket (make-283466b6-documents)
- Project completion: ~85% (All 13 dashboard phases complete; remaining work is enhancements + infrastructure)

---

## [0.22.0] — 2026-03-07 �� Phase 11: Workflow Automation + Phase 13: Financial Dashboard

### Summary

Full implementation of the two remaining dashboard phases, completing all 13 phases of the Sun AI Agency dashboard. Phase 11 — Workflow Automation: 8 backend routes for workflow CRUD, toggle, execution, metrics, and template installation (all using KV store). Frontend features active workflows list with status toggles, workflow builder modal (trigger-condition-action chain editor), 5 pre-built templates (Wizard Complete -> Project Setup, Deal Stage Change -> Notify, Milestone Due -> Alert, Weekly Report, Lead Qualification), execution log with expandable action results, manual trigger with dry-run option, and 4-metric summary row. Phase 13 — Financial Dashboard: 10 backend routes for invoice CRUD, payment recording, revenue metrics, chart data, profitability, and payment reminders. Frontend features 4-card revenue metrics row (MRR, revenue, outstanding, overdue with red alert), invoice management with status lifecycle (draft -> sent -> paid/overdue), status filter tabs with counts, revenue trend line chart, revenue by client horizontal bar chart, revenue by service breakdown, project profitability table with color-coded margins, create invoice modal, record payment modal, and overdue alert banner.

### Added — Phase 11: Workflow Automation Components

- **C-WORKFLOWS-PAGE** `workflows/WorkflowAutomationPage.tsx` — Main page at `/app/workflows`: active workflows list with toggle/edit/delete/run/dry-run, workflow builder modal, 5 pre-built templates, execution log with expandable details, metrics row, tabbed interface, empty states, responsive mobile layout
- **T-WORKFLOWS** `/lib/types/workflows.ts` — TypeScript interfaces: Workflow, WorkflowExecution, WorkflowMetrics, WorkflowTrigger, WorkflowCondition, WorkflowAction, WorkflowCreateInput. Constants: WORKFLOW_TEMPLATES, TRIGGER_LABELS, ACTION_LABELS

### Added — Phase 11: Workflow Backend (8 routes)

- **S11-WORKFLOWS** `workflow-routes.tsx` — `GET /dashboard/workflows` (list all), `POST /dashboard/workflows` (create/update), `DELETE /dashboard/workflows/:id`, `POST /dashboard/workflows/toggle` (enable/disable), `GET /dashboard/workflows/metrics` (aggregate stats), `GET /dashboard/workflows/executions` (execution log), `POST /dashboard/workflows/run` (manual trigger with dry-run), `POST /dashboard/workflows/install-template`

### Added — Phase 13: Financial Dashboard Components

- **C-FINANCIAL-PAGE** `financial/FinancialDashboardPage.tsx` — Main page at `/app/financial`: revenue metrics row, invoice table with status filters and search, revenue trend chart (Recharts LineChart), revenue by client chart (Recharts BarChart), revenue by service breakdown, project profitability table, create invoice modal, record payment modal, overdue alert banner, responsive layout
- **T-FINANCIAL** `/lib/types/financial.ts` — TypeScript interfaces: Invoice, Payment, RevenueMetrics, ProjectProfitability, RevenueTrendPoint, RevenueByClient, RevenueByService, InvoiceCreateInput, PaymentRecordInput. Constants: INVOICE_STATUS_CONFIG. Utils: formatCurrency, formatCompactCurrency

### Added — Phase 13: Financial Backend (10 routes)

- **S13-FINANCIAL** `financial-routes.tsx` — `GET /dashboard/financial/metrics`, `GET /dashboard/financial/invoices` (with status/search filters), `POST /dashboard/financial/invoices` (create), `PUT /dashboard/financial/invoices/:id` (update with status transition validation), `DELETE /dashboard/financial/invoices/:id` (draft only), `POST /dashboard/financial/payments/record`, `GET /dashboard/financial/payments`, `GET /dashboard/financial/charts` (by client, by service, monthly trend with 3-month forecast), `GET /dashboard/financial/profitability`, `POST /dashboard/financial/invoices/:id/reminder`

### Added — Frontend API Layer

- **L01-SUPABASE** `lib/supabase.ts` — Added `workflowApi` module (list, create, update, delete, toggle, getMetrics, getExecutions, run, installTemplate) and `financialApi` module (getMetrics, listInvoices, createInvoice, updateInvoice, deleteInvoice, sendReminder, recordPayment, listPayments, getCharts, getProfitability)

### Changed — Routing, Navigation & Wiring

- **routes.tsx** — Replaced final 2 placeholder stubs with production pages: `WorkflowAutomationPage` (Phase 11) and `FinancialDashboardPage` (Phase 13)
- **S00-SERVER** `index.tsx` — Mounted workflow and financial routes
- **C80-SIDEBAR** `DashboardSidebar.tsx` — Version bump to v0.22.0

### Files Created

```
/lib/types/workflows.ts
/lib/types/financial.ts
/supabase/functions/server/workflow-routes.tsx
/supabase/functions/server/financial-routes.tsx
/components/dashboard/workflows/WorkflowAutomationPage.tsx
/components/dashboard/financial/FinancialDashboardPage.tsx
```

### Files Modified

```
/routes.tsx — Replaced 2 placeholders with production pages
/supabase/functions/server/index.tsx — Mounted workflow + financial routes
/lib/supabase.ts — Added workflowApi + financialApi with 19 methods
/components/dashboard/DashboardSidebar.tsx — Version bump to v0.22.0
```

### Production Status

- Dashboard components: 43 production + 0 placeholder stubs (ALL PHASES COMPLETE)
- Edge function routes: 49 (6 wizard/AI + 3 agent stats + 6 CRM CRUD + 9 pipeline + 7 documents + 8 workflows + 10 financial)
- Supabase Storage: 1 private bucket (make-283466b6-documents)
- Project completion: ~85% (All 13 dashboard phases complete; remaining work is enhancements + infrastructure)

---

## [0.20.0] — 2026-03-07 — Phase 8: Document Management with Supabase Storage

### Summary

Full implementation of Phase 8 — Document Management with Supabase Storage. Created a private storage bucket (`make-283466b6-documents`) with signed URLs for secure access. Backend provides 7 routes for upload (multipart FormData), list, get (with signed URL), update metadata, delete (storage + KV), share link generation with configurable expiry (1h/1d/1w/30d), and aggregate stats. Frontend features grid/list view toggle, category filter tabs (Proposals/Contracts/Deliverables/Reports/Exports), real-time search, drag-and-drop upload with progress indicators, document detail slide-out panel, share link generation with copy-to-clipboard, and delete confirmation dialog. Document metadata stored in KV store (`doc:{uuid}`), files in Supabase Storage. Also created TODO.md project tracker.

### Added — Document Management Components (1 page + types)

- **C-DOCUMENTS-PAGE** `documents/DocumentManagementPage.tsx` — Main page at `/app/documents`: grid/list view, category pills, search, drag-drop upload zone, file progress indicators, document detail slide-out panel with download/share/delete, delete confirmation dialog, empty/loading/error states, responsive mobile layout
- **T-DOCUMENTS** `/lib/types/documents.ts` — TypeScript interfaces: DocumentMeta, DocumentCategory, FileType, ShareLink, DocumentUploadInput. Utility functions: formatFileSize, formatRelativeTime, getFileType. Constants: CATEGORY_CONFIG (5 categories with colors), FILE_TYPE_ICONS

### Added — Document Backend (7 routes)

- **S08-DOCUMENTS** `document-routes.tsx` — `GET /documents` (list with category/search filter), `GET /documents/:id` (with signed URL), `POST /documents/upload` (multipart FormData, 50MB limit), `PUT /documents/:id` (metadata update), `DELETE /documents/:id` (storage + KV), `POST /documents/:id/share` (configurable expiry signed URL), `GET /documents/stats` (aggregate stats by category/type)

### Added — Frontend API Layer

- **L01-SUPABASE** `lib/supabase.ts` — Added `documentApi` module with: `list()`, `get()`, `upload()` (FormData with fresh token), `update()`, `delete()`, `share()`, `getStats()` methods + type exports

### Changed — Routing, Navigation & Wiring

- **routes.tsx** — Replaced Documents placeholder stub with production `DocumentManagementPage`
- **S00-SERVER** `index.tsx` — Mounted document routes via `app.route("/", documents)`
- **C80-SIDEBAR** `DashboardSidebar.tsx` — Version bump to v0.20.0

### Added — Project Tracking

- **TODO.md** — Comprehensive project TODO with immediate priorities, phase completion matrix, next phases breakdown, improvement lists, and infrastructure tasks

### Features

1. Grid view with file-type-colored icons (PDF=red, DOCX=blue, images=purple, Excel=green)
2. List view with sortable table layout
3. 5 category filter tabs with count badges
4. Real-time search filtering by name
5. Drag-and-drop file upload with overlay
6. Multi-file upload with per-file progress indicators
7. Document detail slide-out panel (Motion animated)
8. Time-limited share link generation (1h, 1d, 1w, 30d)
9. Copy-to-clipboard for share URLs
10. Delete with confirmation dialog
11. Signed URL download (1h expiry)
12. Private Supabase Storage bucket (auto-created on first upload)
13. Stats: total files, total size, this-week count, per-category breakdown
14. Mobile responsive: stacked cards, 44px touch targets

### Files Created

```
/lib/types/documents.ts
/supabase/functions/server/document-routes.tsx
/components/dashboard/documents/DocumentManagementPage.tsx
/TODO.md
```

### Files Modified

```
/routes.tsx — Replaced Documents placeholder with DocumentManagementPage
/supabase/functions/server/index.tsx — Mounted document routes
/lib/supabase.ts — Added documentApi with 7 methods
/components/dashboard/DashboardSidebar.tsx — Version bump to v0.20.0
```

### Production Status

- Dashboard components: 41 production + 2 placeholder stubs (Financial, Workflows)
- Edge function routes: 31 (6 wizard/AI + 3 agent stats + 6 CRM CRUD + 9 pipeline + 7 documents)
- Supabase Storage: 1 private bucket (make-283466b6-documents)
- Project completion: ~68% (Phases 1-10 done; Phase 11, 13 pending)

---

## [0.19.1] — 2026-03-07 — PerformanceChart Recharts Duplicate Key Fix

### Summary

Fixed a persistent React warning ("Encountered two children with the same key, null") caused by a known recharts internal SVG key-generation bug in vertical `BarChart` layout mode. Replaced the recharts-based `PerformanceChart` component with a lightweight CSS-based horizontal bar chart that preserves the same visual design (green bars, labels, hover tooltips with run/token/latency details) while eliminating the duplicate-key issue entirely. Also removed the unused `Cell` import.

### Fixed

- **C103-PERFORMANCE-CHART** `agents/PerformanceChart.tsx` — Replaced recharts `BarChart` (vertical layout) with pure CSS horizontal bars to eliminate recharts internal `null` key warnings. Added null/empty type filtering on `stats.byType` entries. Hover tooltips preserved via CSS `group-hover` pattern. Removed `recharts` dependency from this component. Visual output unchanged: green `#00875A` bars, `#F5F5F0` background, Georgia labels, runs/tokens/avgMs/successRate tooltip.

### Files Modified

```
/components/dashboard/agents/PerformanceChart.tsx — Rewrote from recharts BarChart to CSS bars
```

### Production Status

- Dashboard components: 40 production + 1 placeholder stub
- Edge function routes: 24 (6 wizard/AI + 3 agent stats + 6 CRM CRUD + 9 pipeline)
- Project completion: ~62% (Phases 1–7, 9–10 done; Phase 8, 11–13 pending)

---

## [0.19.0] — 2026-03-07 — Phase 7: CRM Pipeline Kanban Board

### Summary

Full implementation of Phase 7 — CRM Pipeline Management with a horizontal Kanban board, drag-and-drop deal management, multiple pipeline support, deal detail slide-out panel, interaction logging, quick-create dialog, and weighted pipeline forecast chart. Added 9 new backend routes for pipelines, deals, interactions, and contacts. Frontend features include optimistic drag-and-drop updates, stale deal indicators (amber >7 days, red >14 days), high-value deal accents (>$10K), and mobile-responsive stacked collapsible columns.

### Added — CRM Pipeline Components (6 new)

- **C07-FORECAST** `crm/ForecastChart.tsx` — Recharts BarChart showing weighted monthly pipeline forecast with conditional bar coloring and custom tooltip
- **C-CRM-PAGE** `crm/CRMPipelinePage.tsx` — Main page at `/app/crm/pipelines`: kanban board, pipeline tabs, forecast chart, loading/error/empty states
- **C-STAGE-COL** `crm/StageColumn.tsx` — Kanban column with HTML5 drop zone, stage header (name, deal count, total value)
- **C-DEAL-CARD** `crm/DealCard.tsx` — Deal card with title, value, probability, contact, stale indicators, drag handle
- **C-DEAL-DETAIL** `crm/DealDetailPanel.tsx` — Motion-animated slide-out panel with Details, Interactions, and Activity tabs, inline interaction logging form
- **C-DEAL-CREATE** `crm/DealQuickCreate.tsx` — Dialog for creating deals with title, value, probability, and stage selection

### Added — CRM Pipeline Types

- **T-CRM-PIPELINE** `/lib/types/crm-pipeline.ts` — TypeScript interfaces: Pipeline, Stage, Deal, Interaction, ForecastDataPoint

### Added — CRM Pipeline Backend (9 routes)

- **S07-PIPELINE** `pipeline-routes.tsx` — `GET /crm/pipelines` (list with deal counts), `GET /crm/pipelines/:id` (full pipeline with stages/deals/forecast), `POST /crm/deals`, `PUT /crm/deals/:id`, `GET /crm/deals/:id` (with interactions + contact), `DELETE /crm/deals/:id`, `POST /crm/interactions`, `GET /crm/deals/:id/interactions`, `GET /crm/contacts`

### Changed — Routing, Navigation & Data Layer

- **routes.tsx** — Replaced CRM Pipeline placeholder stub with production `CRMPipelinePage` component
- **S00-SERVER** `index.tsx` — Mounted pipeline routes
- **L01-SUPABASE** `lib/supabase.ts` — Added `pipelineApi` module with all CRM pipeline API methods
- **C80-SIDEBAR** `DashboardSidebar.tsx` — Version bump to v0.19.0

### Database Tables Required

- `crm_pipelines` — Named pipeline groups
- `crm_stages` — Ordered stages per pipeline
- `crm_deals` — Deals with value, probability, stage_id
- `crm_interactions` — Activity log (call/email/meeting/note)

Seed data creates "New Business" pipeline (Lead, Qualified, Proposal Sent, Negotiation, Closed Won, Closed Lost) and "Upsell" pipeline (Identified, Pitched, Approved, Delivered).

### Features

1. Horizontal kanban board with HTML5 native drag-and-drop
2. Multiple pipeline support via tabs
3. Optimistic updates on deal stage moves
4. Deal detail slide-out panel (Motion animated)
5. Interaction logging (call/email/meeting/note)
6. Deal quick-create dialog
7. Weighted monthly forecast chart (Recharts)
8. Stale deal indicators: amber >7 days, red >14 days
9. High-value deal indicator: green accent >$10K
10. Mobile responsive: stacked collapsible columns

### Files Created

```
/lib/types/crm-pipeline.ts
/supabase/functions/server/pipeline-routes.tsx
/components/dashboard/crm/CRMPipelinePage.tsx
/components/dashboard/crm/StageColumn.tsx
/components/dashboard/crm/DealCard.tsx
/components/dashboard/crm/DealDetailPanel.tsx
/components/dashboard/crm/DealQuickCreate.tsx
/components/dashboard/crm/ForecastChart.tsx
/docs/dashboard/07-crm-pipeline-implementation.md
```

### Files Modified

```
/routes.tsx — Replaced placeholder with CRMPipelinePage
/supabase/functions/server/index.tsx — Mounted pipeline routes
/lib/supabase.ts — Added pipelineApi
/components/dashboard/DashboardSidebar.tsx — Version bump
```

### Production Status

- Dashboard components: 40 production + 1 placeholder stub
- Edge function routes: 24 (6 wizard/AI + 3 agent stats + 6 CRM CRUD + 9 pipeline)
- Project completion: ~62% (Phases 1–7, 9–10 done; Phase 8, 11–13 pending)

---

## [0.18.0] — 2026-03-07 — Database Migrations + Auto-Schema Utility

### Summary

Created 5 SQL migration files covering wizard_sessions enhancement, AI tables, CRM core tables, CRM pipeline tables, and seed data — all with RLS policies, indexes, and column parity to existing edge functions and frontend types. Added an auto-migration utility (`ensure-schema.tsx`) that handles `ALTER TABLE ADD COLUMN IF NOT EXISTS` for `ai_run_logs` and `ai_cache` tables, runs once per server lifecycle as middleware on `/ai/*` routes and from `gemini.tsx` write operations.

### Added — Database Migrations (5 files)

- **`20260307120000_enhance_wizard_sessions.sql`** — Wizard sessions table enhancements
- **`20260307120100_create_ai_tables.sql`** — AI run logs and cache tables with RLS
- **`20260307120200_create_crm_core_tables.sql`** — CRM core tables (clients, contacts) with RLS and indexes
- **`20260307120300_create_crm_pipeline_tables.sql`** — CRM pipeline tables (pipelines, stages, deals, interactions)
- **`20260307120400_seed_default_pipeline_and_verify.sql`** — Seed data for default pipelines and verification

### Added — Auto-Schema Utility

- **`ensure-schema.tsx`** — Runtime schema migration utility using `ALTER TABLE ADD COLUMN IF NOT EXISTS` for `ai_run_logs` and `ai_cache` tables. Runs once per server lifecycle via singleton guard. Wired as middleware on `/ai/*` routes in `index.tsx` and called from `gemini.tsx` write operations.

### Changed — Server Wiring

- **S00-SERVER** `index.tsx` — Added ensure-schema middleware for `/ai/*` routes
- **S04-AI** `ai-routes.tsx` — Wired ensure-schema call
- **S05-GEMINI** `gemini.tsx` — Calls ensure-schema before AI table writes

### Files Created

```
/supabase/migrations/20260307120000_enhance_wizard_sessions.sql
/supabase/migrations/20260307120100_create_ai_tables.sql
/supabase/migrations/20260307120200_create_crm_core_tables.sql
/supabase/migrations/20260307120300_create_crm_pipeline_tables.sql
/supabase/migrations/20260307120400_seed_default_pipeline_and_verify.sql
/supabase/functions/server/ensure-schema.tsx
```

### Production Status

- Dashboard components: 34 production + 4 placeholder stubs
- Edge function routes: 15
- Project completion: ~58% (Phases 1–6, 9–10 done; Phase 7–8, 11–13 pending)

---

## [0.17.0] — 2026-03-07 — LinkedIn OIDC Auth + Multi-Provider Login

### Summary

Added LinkedIn (OIDC) as a second social login provider alongside Google. The existing provider-agnostic `AuthCallbackPage` and session infrastructure required zero changes — only 3 files modified with ~30 lines of net new code. The `/login` page now shows Google, LinkedIn, and email/password options. LinkedIn login is code-complete but **not yet active** — requires manual LinkedIn Developer Dashboard + Supabase Dashboard configuration (same pattern as Google auth).

### Changed — LinkedIn OIDC Support (3 files)

- **L01-SUPABASE** `lib/supabase.ts` — Added `authApi.signInWithLinkedIn(returnPath?)` method using `supabase.auth.signInWithOAuth({ provider: 'linkedin_oidc' })` with dynamic `redirectTo` URL. Uses `linkedin_oidc` (not deprecated `linkedin`) per Supabase requirements
- **C90-AUTH** `AuthContext.tsx` — Added `signInWithLinkedIn()` to `AuthContextType` interface, `useAuth()` fallback, and `AuthProvider` value. Identical pattern to `signInWithGoogle()`: sets loading state, delegates to `authApi`, keeps loading on success (browser redirects)
- **C91-AUTH-PAGE** `AuthPage.tsx` — Added LinkedIn OIDC button below Google button with official LinkedIn "in" logo SVG (`#0A66C2` brand color), separate `linkedinRedirecting` state, `handleLinkedInSignIn` handler, and updated `isDisabled` flag to include `linkedinRedirecting`. Submit button opacity now accounts for both OAuth redirect states
- **C92-AUTH-CALLBACK** `AuthCallbackPage.tsx` — Updated comment to reflect multi-provider support (no code changes needed — already provider-agnostic)
- **routes.tsx** — Updated OAuth callback route comment to reference both Google and LinkedIn

### Added — Documentation

- **`/docs/supabase/07-linkedin-auth-plan.md`** (v2.0.0) — Comprehensive implementation plan with 7 Mermaid diagrams (system architecture, OIDC sequence, session lifecycle, component architecture, user journey flowchart, Gantt implementation order, secret management), LinkedIn vs Google comparison table, 10 test scenarios, 5 error scenarios, setup checklists, and code reuse summary

### Auth Flow — LinkedIn Data Path

```
User clicks "Continue with LinkedIn" on /login
  -> signInWithLinkedIn(returnPath="/app/dashboard")
  -> authApi.signInWithLinkedIn() builds redirectTo: /auth/callback?return=%2Fapp%2Fdashboard
  -> supabase.auth.signInWithOAuth({ provider: 'linkedin_oidc', redirectTo })
  -> Browser redirects to LinkedIn authorization screen
  -> User approves -> LinkedIn sends authorization code to Supabase
  -> Supabase exchanges code for OIDC tokens, validates ID token
  -> Supabase creates/updates auth.users row with LinkedIn profile data
  -> Supabase redirects to /auth/callback?return=%2Fapp%2Fdashboard#access_token=...
  -> AuthCallbackPage (provider-agnostic) restores session
  -> onAuthStateChange fires SIGNED_IN -> AuthContext updates user state
  -> navigateOnce("/app/dashboard") -> DashboardHeader shows LinkedIn avatar
```

### Activation Checklist (Manual Steps Required)

| Step | Action | Status |
|------|--------|--------|
| 1 | Create LinkedIn App at [LinkedIn Developer Dashboard](https://www.linkedin.com/developers/) | Pending |
| 2 | Go to Products tab, request "Sign In with LinkedIn using OpenID Connect" | Pending |
| 3 | Go to Auth tab, add redirect URL: `https://<PROJECT_ID>.supabase.co/auth/v1/callback` | Pending |
| 4 | Copy Client ID + Client Secret | Pending |
| 5 | Enable LinkedIn (OIDC) provider in Supabase Dashboard > Authentication > Providers | Pending |
| 6 | Paste Client ID + Client Secret into Supabase LinkedIn (OIDC) provider config | Pending |
| 7 | Verify scopes: `openid`, `profile`, `email` at bottom of LinkedIn Auth tab | Pending |

### Files Modified

```
/lib/supabase.ts — Added authApi.signInWithLinkedIn() with linkedin_oidc provider
/components/AuthContext.tsx — Added signInWithLinkedIn() to interface, fallback, provider
/components/AuthPage.tsx — LinkedIn button, linkedinRedirecting state, isDisabled update
/components/AuthCallbackPage.tsx — Updated comment (multi-provider)
/routes.tsx — Updated comment (multi-provider)
/components/dashboard/DashboardSidebar.tsx — Version bump to v0.17.0
```

### Files Created

```
/docs/supabase/07-linkedin-auth-plan.md — LinkedIn OIDC auth implementation plan (v2.0.0)
```

### Production Status

- Dashboard components: 34 production + 4 placeholder stubs
- Edge function routes: 15 (unchanged — LinkedIn OAuth handled by Supabase Auth service)
- Auth methods: 5 (email sign-in, email sign-up, Google OAuth, LinkedIn OIDC, guest/anonymous)
- Project completion: ~58% (Phases 1-6, 9-10 done; Google + LinkedIn Auth code-complete; Phases 7-8, 11-13 pending)

---

## [0.16.0] — 2026-03-07 — Google OAuth + Auth Flow Hardening

### Summary

Full Google OAuth implementation with production-grade error handling. Added `signInWithGoogle()` across the auth stack (`lib/supabase.ts` → `AuthContext` → `AuthPage`), created a dedicated `AuthCallbackPage` at `/auth/callback` that handles the Supabase OAuth redirect with race-condition-proof session detection, and hardened the entire auth flow with 6 bug fixes: fixed loading state leak during Google redirect, added Google avatar/name extraction to `AuthUser`, corrected post-login redirect from `/wizard` to `/app/dashboard`, resolved `AuthCallbackPage` race condition between `getSession()` and `onAuthStateChange`, added spinner feedback on the Google button during redirect, and wired the `?return=` query parameter through the full OAuth round-trip so users land back on their originally-requested dashboard page. Google login is code-complete but **not yet active** — requires manual Google Cloud Console + Supabase Dashboard configuration.

### Added — Google OAuth Components

- **C92-AUTH-CALLBACK** `/components/AuthCallbackPage.tsx` — OAuth redirect handler at `/auth/callback`. Uses `onAuthStateChange` as primary session detection (not `getSession()`) to avoid race condition with URL hash parsing. Includes `handledRef` guard against double-navigation, 8-second safety timeout, proper cleanup of all timeouts and subscriptions on unmount, reads `?return=` param from URL to redirect to originally-requested page
- **routes.tsx** — Registered `/auth/callback` route with `AuthCallbackPage`
- **`/docs/supabase/06-google-auth-plan.md`** — Comprehensive implementation plan (v2.0.0) with Mermaid diagrams covering OAuth PKCE flow, session lifecycle state machine, complete user journey flowchart, token refresh sequence, security architecture, Google Cloud Console setup checklist, and 8 manual test scenarios

### Changed — Auth Flow (6 Bug Fixes)

- **L01-SUPABASE** `lib/supabase.ts` — Added `authApi.signInWithGoogle(returnPath?)` method using `supabase.auth.signInWithOAuth({ provider: 'google' })` with dynamic `redirectTo` URL that encodes the optional `returnPath` as a `?return=` query parameter on `/auth/callback`
- **C90-AUTH** `AuthContext.tsx` — (1) `signInWithGoogle()` no longer resets `loading: false` on success — browser is about to redirect to Google, so keeping loading state prevents UI flash; (2) Added `avatarUrl` to `AuthUser` interface, extracted from `session.user.user_metadata.avatar_url` (populated by Google OAuth); (3) `signInWithGoogle()` now accepts optional `returnPath` parameter and passes it through to `authApi`; (4) Interface updated: `signInWithGoogle: (returnPath?: string) => Promise<void>`
- **C91-AUTH-PAGE** `AuthPage.tsx` — (1) Post-login redirect changed from `/wizard` to `/app/dashboard` (both `useEffect` auto-redirect and `handleSubmit` success redirect); (2) Now reads `?return=` query parameter from URL (set by `DashboardLayout` auth guard) and uses it as redirect target; (3) Google button now shows `<Loader2>` spinner with "Redirecting to Google…" text during redirect; (4) Added `googleRedirecting` local state to distinguish Google loading from email loading; (5) All form inputs disabled during any auth operation via `isDisabled` flag; (6) Passes `returnPath` to `signInWithGoogle()` for round-trip preservation
- **C81-HEADER** `DashboardHeader.tsx` — User avatar now displays Google profile photo via `user.avatarUrl` when available (with `referrerPolicy="no-referrer"` for Google CDN images), falls back to initials. Added "Client Detail" label for `/app/clients/:id` paths.

### Auth Flow — Complete Data Path

```
User visits /app/dashboard (unauthenticated)
  → DashboardLayout auth guard → Navigate to /login?return=%2Fapp%2Fdashboard
  → AuthPage reads ?return= param
  → User clicks "Continue with Google"
  → signInWithGoogle(returnPath="/app/dashboard")
  → authApi.signInWithGoogle() builds redirectTo: /auth/callback?return=%2Fapp%2Fdashboard
  → supabase.auth.signInWithOAuth({ provider: 'google', redirectTo })
  → Browser redirects to Google consent screen
  → User approves → Google sends code to Supabase
  → Supabase exchanges code, creates/updates auth.users row
  → Supabase redirects to /auth/callback?return=%2Fapp%2Fdashboard#access_token=...
  → AuthCallbackPage mounts, reads ?return= param
  → onAuthStateChange fires SIGNED_IN with new session
  → AuthContext updates user state (name, email, avatarUrl from Google)
  → navigateOnce("/app/dashboard") via handledRef guard
  → DashboardHeader shows Google avatar photo + display name
```

### Activation Checklist (Manual Steps Required)

| Step | Action | Status |
|------|--------|--------|
| 1 | Create OAuth 2.0 Web Client in [Google Cloud Console](https://console.cloud.google.com) | Pending |
| 2 | Add scopes: `openid`, `email`, `profile` | Pending |
| 3 | Set authorized redirect URI to `https://<PROJECT_ID>.supabase.co/auth/v1/callback` | Pending |
| 4 | Enable Google provider in Supabase Dashboard > Authentication > Providers | Pending |
| 5 | Paste Client ID + Client Secret into Supabase Google provider config | Pending |
| 6 | Add app callback URLs to Supabase Dashboard > Authentication > URL Configuration | Pending |

### Files Created

```
/components/AuthCallbackPage.tsx
/docs/supabase/06-google-auth-plan.md
```

### Files Modified

```
/lib/supabase.ts — Added authApi.signInWithGoogle() with returnPath support
/components/AuthContext.tsx — Added signInWithGoogle(), avatarUrl, loading state fix
/components/AuthPage.tsx — Google button, return param, redirect fix, loading states
/components/dashboard/DashboardHeader.tsx — Google avatar display, client detail label
/routes.tsx — Added /auth/callback route
```

### Production Status

- Dashboard components: 34 production + 4 placeholder stubs
- Edge function routes: 15 (unchanged — Google OAuth handled by Supabase Auth service)
- Auth methods: 4 (email sign-in, email sign-up, Google OAuth, guest/anonymous)
- Project completion: ~57% (Phases 1–6, 9–10 done; Google Auth code-complete; Phases 7–8, 11–13 pending)

---

## [0.15.0] — 2026-03-07 — Phase 9 AI Insights + Phase 10 AI Agents + Phase 6 CRM

### Summary

Three full production phases implemented: (1) Phase 9 — AI Insights full page with recharts RadarChart, animated score ring, dimension breakdown with progress bars, detailed insight cards, localStorage snapshot history with before/after comparison, and re-run button; (2) Phase 10 — AI Agent Management with 3 new Edge Function routes querying `ai_run_logs` and `ai_cache` Supabase tables, summary stats dashboard, horizontal bar chart by agent type, token usage breakdown, cache status panel, and paginated/filterable run history table; (3) Phase 6 — Client Management CRM with full CRUD Edge Function routes reading/writing the `clients` and `crm_contacts` Supabase tables (no KV store), client list with search/filter/health badges, client detail page with contacts, and create/edit modal form. All three phases use proper Supabase table queries via `adminClient()` — zero KV store usage.

### Added — Phase 9: AI Insights Full Page (6 components)

- **C96-INSIGHTS-PAGE** `insights/InsightsPage.tsx` — Orchestrator page at `/app/insights` with live AI fetch, re-run, loading/error/empty states
- **C97-READINESS-RADAR** `insights/ReadinessRadar.tsx` — Recharts RadarChart with 5 readiness dimensions, color-coded legend, tooltip
- **C98-READINESS-BREAKDOWN** `insights/ReadinessBreakdown.tsx` — Animated progress bars per dimension, strengths/gaps lists with icons
- **C99-INSIGHT-DETAIL-CARDS** `insights/InsightDetailCards.tsx` — Full-width priority-coded cards with badges and action links
- **C100-SNAPSHOT-HISTORY** `insights/SnapshotHistory.tsx` — localStorage snapshot storage (max 10), before/after comparison bars, save/delete/compare
- **C101-INSIGHTS-SUMMARY** `insights/InsightsSummaryHeader.tsx` — Animated SVG score ring, AI greeting, stats row, re-run button

### Added — Phase 10: AI Agent Management (6 components + 3 server routes)

- **S04-AI** `ai-routes.tsx` — Added `GET /ai/run-logs` (paginated + filterable), `GET /ai/cache-stats`, `GET /ai/aggregate-stats` server routes querying `ai_run_logs` and `ai_cache` tables
- **L01-SUPABASE** `lib/supabase.ts` — Added `agentApi` module with typed `getRunLogs()`, `getAggregateStats()`, `getCacheStats()` methods + `RunLogEntry`, `AggregateStats`, `CacheStats` interfaces
- **C102-AGENT-SUMMARY** `agents/AgentSummaryHeader.tsx` — 5-stat row: total runs, success rate, total tokens, avg latency, cache entries
- **C103-PERFORMANCE-CHART** `agents/PerformanceChart.tsx` — Recharts horizontal BarChart of runs by agent type with tooltips
- **C104-TOKEN-USAGE** `agents/TokenUsagePanel.tsx` — Animated proportional bars by prompt type with color coding
- **C105-CACHE-STATS** `agents/CacheStatsPanel.tsx` — Active/expired/rate stats, recent cache entry list with hash + status
- **C106-RUN-HISTORY** `agents/RunHistoryTable.tsx` — Paginated table (md+) / card list (xs), filter by prompt type, status icons
- **C107-AGENTS-PAGE** `agents/AgentsPage.tsx` — Orchestrator at `/app/agents` with refresh, parallel API calls, motion stagger

### Added — Phase 6: Client Management CRM (5 components + 6 server routes)

- **S06-CRM** `crm-routes.tsx` — Full CRUD: `GET /crm/clients`, `POST /crm/clients`, `GET /crm/clients/:id`, `PUT /crm/clients/:id`, `DELETE /crm/clients/:id`, `POST /crm/clients/:id/contacts` — all using `adminClient()` with `requireAuth()` guard
- **S00-SERVER** `index.tsx` — Mounted CRM routes via `app.route("/", crm)`
- **L01-SUPABASE** `lib/supabase.ts` — Added `crmApi` module with `listClients()`, `getClient()`, `createClient()`, `updateClient()`, `deleteClient()`, `createContact()` + `Client`, `CRMContact` interfaces
- **C108-CLIENT-HEALTH** `clients/ClientHealthBadge.tsx` — Color-coded health score badge (green/amber/red)
- **C109-CLIENT-STATUS** `clients/ClientStatusBadge.tsx` — Status badge (active/prospect/onboarding/churned)
- **C110-CLIENT-FORM** `clients/ClientForm.tsx` — Modal create/edit form with validation, all fields, responsive layout
- **C111-CLIENT-DETAIL** `clients/ClientDetailPage.tsx` — Single client view at `/app/clients/:id` with edit, contacts list
- **C112-CLIENTS-LIST** `clients/ClientsListPage.tsx` — Main CRM page at `/app/clients` with search, stats row, table (md+) / cards (xs), create modal

### Changed — Routes & Navigation

- **routes.tsx** — Replaced 3 placeholder stubs with production pages: `InsightsPage` (Phase 9), `DashAgentsPage` (Phase 10), `ClientsListPage` + `ClientDetailPage` (Phase 6)
- **C80-SIDEBAR** `DashboardSidebar.tsx` — Version bump to v0.15.0
- **C87-ACTIONS** `QuickActionsGrid.tsx` — Updated AI Insights description

### Production Status

- Dashboard components: 34 production + 4 placeholder stubs
- Edge function routes: 15 (6 wizard/AI + 3 agent stats + 6 CRM CRUD)
- New Supabase tables required: `clients`, `crm_contacts` (must be created via Supabase UI)
- Existing tables queried: `ai_run_logs`, `ai_cache` (already populated by Gemini calls)
- Project completion: ~55% (Phases 1–6, 9–10 done; Phases 7–8, 11–13 pending)

---

## [0.14.0] — 2026-03-07 — Live AI Insights, Wizard 401 Fix, Progress Tracker

### Summary

Three targeted improvements: (1) rewrote the dashboard master doc as a comprehensive color-coded progress tracker showing ~42% project completion across 13 phases; (2) wired live Gemini-powered AI insights into the dashboard home page with loading skeleton, deduplication with static fallbacks, and on-mount fetch; (3) fixed the wizard 401 cloud-save error by switching wizard edge function routes from `userClient()` to `adminClient()` and adding a 401-retry-with-anon-key fallback in the frontend API helper.

### Changed — AI Insights (Live Wiring)

- **C82-HOME** `DashboardHome.tsx` — Now calls `aiApi.dashboardInsights()` on mount, passes live AI recommendations to `AIInsightsPanel`, merges with static fallbacks using title-based deduplication, includes loading skeleton state during fetch
- **C88-INSIGHTS** `AIInsightsPanel.tsx` — Accepts live AI insights prop alongside static fallbacks, renders Gemini-generated next-best-action recommendations with priority indicators, handles empty/loading/error states gracefully

### Fixed — Wizard Cloud Save 401

- **S03-WIZARD** `wizard-routes.tsx` — Switched all three wizard routes (`POST /wizard/save`, `GET /wizard/:sessionId`, `GET /wizard/list/:userId`) from `userClient(authHeader)` to `adminClient()` to resolve 401 Unauthorized errors when saving wizard state. Auth validation still performed via `getUserFromToken()` before database operations.
- **L01-SUPABASE** `lib/supabase.ts` — Added 401-retry fallback in `api()` helper: when a request returns 401, automatically retries with the public anon key (`publicAnonKey`) as the Authorization bearer token before surfacing the error to the caller

### Changed — Documentation

- **`/docs/dashboard/00-dashboard-master.md`** — Complete rewrite from feature spec to progress tracker format with color-coded status tables (green = done, yellow = in progress, red = not started) covering all 13 implementation phases, per-component completion status, and overall project health metrics showing ~42% completion

### Production Status

- Dashboard components: 17 production + 7 placeholder stubs
- Edge function routes: 6
- AI endpoints wired end-to-end: 6 (5 wizard + 1 dashboard insights)
- Project completion: ~42% (Phases 1–5 done, Phases 6–13 pending)

---

## [0.13.0] — 2026-03-07 — Dashboard Phases 2–5: Roadmap, Projects, Insights API, Settings

### Summary

Implemented dashboard Phases 2–5 as production components: interactive RoadmapTimeline with expandable phases and task status toggling (localStorage persistence), RoadmapPage full-screen view, ProjectsList and ProjectDetail pages reading from wizard AI results, SettingsPage with account/org/session info, and a new POST `/dashboard-insights` edge function for AI-powered next-best-action recommendations. Added Roadmap nav item to sidebar. Replaced 4 placeholder stubs with production components (Projects, Project Detail, Roadmap, Settings). All new components are mobile-first responsive with 44px touch targets and ARIA accessibility.

### Added — Phase 2: Roadmap + Activity

- **C91-ROADMAP-TIMELINE** `/components/dashboard/RoadmapTimeline.tsx` — Interactive phase timeline with expand/collapse, task status cycling (not-started → in-progress → completed), progress computed from task states, localStorage persistence keyed by sessionId, phase locking for upcoming phases, quick wins/risk factors/success metrics sections, compact mode for dashboard embedding, staggered Motion animations, connector arrows between phases
- **C92-ROADMAP-PAGE** `/components/dashboard/RoadmapPage.tsx` — Full-page roadmap at `/app/roadmap` reading from useDashboardData, back-to-dashboard link, empty state with wizard CTA, loading skeleton, error retry

### Added — Phase 3: AI Insights Endpoint

- **S04-AI** `ai-routes.tsx` — New `POST /dashboard-insights` endpoint generating 2–4 prioritized action recommendations via Gemini from org data, readiness score, project state, and recent activities. Returns structured insights with title, description, priority, actionLabel, actionRoute, plus contextual greeting and summary. Auth required.
- **L01-SUPABASE** `supabase.ts` — Added `aiApi.dashboardInsights()` frontend method with typed response

### Added — Phase 4: Projects + Tasks

- **C93-PROJECTS-LIST** `/components/dashboard/ProjectsList.tsx` — Projects list at `/app/projects` showing project cards from wizard data with progress bar, systems tags, next milestone hint, View Project and View Roadmap CTAs, empty state with wizard link
- **C94-PROJECT-DETAIL** `/components/dashboard/ProjectDetail.tsx` — Project detail at `/app/projects/:id` with header stats (duration, systems, investment, readiness), two-column systems/milestones layout, full RoadmapTimeline with task toggling, breadcrumb navigation

### Added — Phase 5: Settings

- **C95-SETTINGS** `/components/dashboard/SettingsPage.tsx` — Account/org/session settings at `/app/settings` with user profile (name, email, user ID), organization info (company, industry, size, description from wizard), session/security info, re-run wizard action, sign-out with confirmation state

### Changed — Routing & Navigation

- **routes.tsx** — Replaced `ProjectsListPage`, `ProjectDetailPage`, `SettingsPage` placeholder imports with production components (`ProjectsList`, `ProjectDetail`, `SettingsPageComponent`). Added `/app/roadmap` route with `RoadmapPage`. Remaining placeholder stubs: Clients, CRM Pipeline, AI Insights, Documents, Financial, Workflows, AI Agents (Phases 6–13).
- **C80-SIDEBAR** `DashboardSidebar.tsx` — Added Roadmap nav item (`/app/roadmap`) with Map icon between Projects and Clients. Updated version to v0.13.0.
- **C81-HEADER** `DashboardHeader.tsx` — Added route labels for Roadmap (`/app/roadmap`), dynamic "Project Detail" label for `/app/projects/:id` paths
- **C87-ACTIONS** `QuickActionsGrid.tsx` — Updated "View Roadmap" quick action to link to `/app/roadmap`

### Changed — Data Layer

- **H01-DASHBOARD-DATA** `useDashboardData.ts` — Extended `DashboardData` interface with `quickWins`, `riskFactors`, `successMetrics` fields parsed from step 5 ai_results roadmap data

### Production File Count

- Dashboard components: 17 (12 existing + 5 new)
- Dashboard hooks: 1
- Edge function routes: 6 (5 existing + 1 new)
- Placeholder stubs remaining: 7 (of original 10)

---

## [0.12.1] — 2026-03-07 — UX Best Practices Pass + Mobile-First Responsive

### Summary

Applied comprehensive UX improvements from `/imports/ux-best-practices-review.md` across all 12 dashboard components. Converted from desktop-first to mobile-first responsive design with systemized breakpoints (xs→sm→md→lg), added tablet icon-only sidebar mode (64px), enforced 44–48px minimum touch targets on all interactive elements, added keyboard support (Escape to close sidebar/dropdown), improved accessibility with ARIA attributes, and added "Client Dashboard" link to the Footer Resources column.

### Changed — UX Improvements

- **C79-LAYOUT** `DashboardLayout.tsx` — Added `min-h-[100dvh]` for mobile viewport safety, mobile-first padding scale (`px-4 py-5 → sm:px-6 sm:py-6 → lg:px-8 lg:py-8`), auto-close sidebar on route change
- **C80-SIDEBAR** `DashboardSidebar.tsx` — **Three responsive modes**: mobile (240px overlay, hamburger), tablet md-lg (64px static icon-only with tooltips), desktop lg+ (240px static full labels). Added Escape key handler, body scroll lock when open, 44px min touch targets, `title` tooltip on nav items, `role="navigation"`, responsive label hiding (`md:hidden lg:inline`)
- **C81-HEADER** `DashboardHeader.tsx` — Added breadcrumb trail (Dashboard → Page), 44px min touch targets on all buttons, Escape key closes dropdown, route change closes dropdown, user name shown on lg+ screens, `aria-expanded` and `aria-haspopup` on dropdown, `role="menu"` on dropdown panel, Settings icon in dropdown, separator before Sign Out
- **C82-HOME** `DashboardHome.tsx` — Mobile-first spacing (`space-y-4 → sm:space-y-6`), skeleton heights match live layout per breakpoint, error state with `break-words` and 44px retry button
- **C83-WELCOME** `WelcomeBanner.tsx` — Score ring always shows "Readiness" label (was hidden on mobile), `role="img"` with `aria-label` on ring, responsive padding, conditional industry separator, `line-clamp-2` on mobile description
- **C84-METRICS** `MetricsRow.tsx` — Compact mobile text (`text-[10px] → sm:text-xs`), responsive padding (`p-3 → sm:p-4`), responsive icon sizes, condensed phase display (`1/3` format on mobile)
- **C85-PROJECT** `ProjectSummaryCard.tsx` — `h-full flex flex-col` for equal-height grid alignment, `role="progressbar"` with `aria-valuenow` on progress bar, `title` tooltips on phase blocks, 44px touch target on View link, `max-w-[140px]` truncation on system badges
- **C86-ACTIVITY** `ActivityFeed.tsx` — `h-full flex flex-col` for equal-height alignment, timestamps on separate line on mobile (inline with dot separator on sm+), responsive heading size, centered empty state
- **C87-ACTIONS** `QuickActionsGrid.tsx` — **1-column on xs** (stacked with icon+text inline), 2-col on sm, 4-col on lg. `focus-visible:outline-2` ring, 56px min height, icon inline with text on mobile
- **C88-INSIGHTS** `AIInsightsPanel.tsx` — `aria-expanded` on expand button, 52px min touch height, `focus-visible` outline, insight count shown, `section` with `aria-labelledby`, responsive padding
- **C89-EMPTY** `EmptyDashboard.tsx` — **Sticky mobile CTA bar** at bottom with safe-area padding (sm:hidden), full-width stacked buttons on mobile with 48px min-height, Calendar icon on secondary CTA, `aria-hidden` on ghost preview
- **C90-PLACEHOLDER** `PlaceholderPage.tsx` — Responsive padding, 44px min-height on back link, `focus-visible` ring
- **C02** `Footer.tsx` — Added "Client Dashboard" (`/app/dashboard`) to Resources column

### UX Best Practices Applied (from review)

| Area | Before | After |
|------|--------|-------|
| Responsive approach | Desktop-first | Mobile-first |
| Breakpoints | Rough (lg only) | Systemized: xs, sm (640), md (768), lg (1024) |
| Touch targets | Mixed sizes | 44–48px minimum on all interactive elements |
| Sidebar (tablet) | Same as desktop | Icon-only 64px with tooltips |
| CTA buttons (mobile) | Fixed width | Full-width, 48px height, sticky bar on empty |
| Keyboard support | None | Escape closes sidebar/dropdown |
| ARIA attributes | Minimal | role, aria-expanded, aria-current, aria-label, aria-valuenow |
| Focus indicators | Browser default | `focus-visible:outline-2 outline-[#00875A]` |
| Body scroll lock | None | Prevents scroll behind mobile sidebar overlay |

---

## [0.12.0] — 2026-03-07 — Dashboard Phase 1: Shell + Home MVP

### Summary

Built the full dashboard infrastructure: layout shell with sidebar navigation and auth-guarded routes, home page assembling wizard data into a command center with welcome banner, readiness score ring, metrics row, project summary, activity feed, quick actions, and AI insights. All 12 dashboard routes registered with placeholder pages for future phases. Documentation suite expanded with 4 new prompt docs (workflow automation, document management, financial dashboard, expanded AI agent management).

### Added — Dashboard Production Components

- **C79-LAYOUT** `/components/dashboard/DashboardLayout.tsx` — Full viewport layout shell with 240px sidebar (fixed desktop, hamburger overlay mobile), sticky header (h-14), auth guard redirecting to `/login?return=...`, skip-to-content a11y link, and `<Outlet />` for child routes
- **C80-SIDEBAR** `/components/dashboard/DashboardSidebar.tsx` — Dark (#1A1A1A) left navigation with 10 nav items (Dashboard, Projects, Clients, CRM Pipeline, AI Insights, Documents, Financial, Workflows, AI Agents, Settings), active state with green dot, mobile slide-in overlay with backdrop, "Re-run Wizard" link, version badge
- **C81-HEADER** `/components/dashboard/DashboardHeader.tsx` — Sticky header with route-aware page title, hamburger menu trigger (mobile), notification bell, user avatar dropdown with initials, settings link, sign-out button
- **C82-HOME** `/components/dashboard/DashboardHome.tsx` — Dashboard home page assembling all sub-components with Motion staggered fade-in animations, loading skeleton state, error state with retry, empty state routing
- **C83-WELCOME** `/components/dashboard/WelcomeBanner.tsx` — Org name + industry + company size card with animated SVG readiness score ring (0-100, color-coded: green ≥70, amber ≥40, red <40)
- **C84-METRICS** `/components/dashboard/MetricsRow.tsx` — 4 stat cards (Readiness Score, AI Systems Count, Current Phase, Total Investment) with dl/dt/dd accessibility, staggered fade-in, monospace values
- **C85-PROJECT** `/components/dashboard/ProjectSummaryCard.tsx` — Project name, phase indicator, overall progress bar, mini roadmap phase blocks (active/completed/upcoming), system badges
- **C86-ACTIVITY** `/components/dashboard/ActivityFeed.tsx` — Chronological event list with type-coded icons (wizard/project/milestone/ai), relative timestamps, staggered slide-in animation
- **C87-ACTIONS** `/components/dashboard/QuickActionsGrid.tsx` — 4 action cards (View Roadmap, AI Insights, Schedule Call, Documents) with hover lift effect
- **C88-INSIGHTS** `/components/dashboard/AIInsightsPanel.tsx` — Expandable AI recommendation cards with priority indicators (high/medium/low), AnimatePresence expand/collapse, action links
- **C89-EMPTY** `/components/dashboard/EmptyDashboard.tsx` — No-wizard-completed state with centered CTA to start wizard, "Book a Call" alternative, ghost preview of dashboard metrics
- **C90-PLACEHOLDER** `/components/dashboard/PlaceholderPage.tsx` — Stub pages for all 10 unimplemented dashboard routes with title, description, phase number, and back link

### Added — Data Hook

- **H01-DASHBOARD-DATA** `/lib/hooks/useDashboardData.ts` — Custom hook that fetches wizard_sessions via `wizardApi.list()`, loads the most recent completed session via `wizardApi.load()`, then parses `ai_results` from all 5 steps into structured dashboard data (org profile, readiness scores, project summary, roadmap phases, activity timeline, AI insights). Works with zero new tables — reads entirely from existing wizard data.

### Added — Documentation (4 new prompt docs)

- `/docs/dashboard/10-workflow-automation.md` — Full spec for DASH-07 workflow automation dashboard
- `/docs/dashboard/11-document-management.md` — Full spec for DASH-08 document management dashboard
- `/docs/dashboard/12-financial-dashboard.md` — Full spec for DASH-09 financial dashboard

### Changed

- **Routes** `/routes.tsx` — Added `/app` route group with `DashboardLayout` parent and 12 child routes (dashboard, projects, projects/:id, clients, clients/:id, crm/pipelines, insights, documents, financial, workflows, agents, settings). Index redirects to `/app/dashboard`.
- **`/docs/dashboard/00-dashboard-master.md`** — Expanded screen index (9→12 entries), IA tree (added /workflows, /financial), route structure (added agents, workflows, financial child routes), sidebar layout (added Workflows, Financial nav items), component inventory (added 33 new components for workflows, documents, financial), implementation phases (added Phases 11-13)
- **`/docs/dashboard/04-data-hooks-wiring.md`** — Added full hook specs, API layer additions, data freshness strategy, error handling, and progressive enhancement entries for workflow automation (5 hooks, 10 API endpoints), document management (5 hooks, 9 API endpoints), and financial dashboard (5 hooks, 11 API endpoints)
- **`/docs/dashboard/09-ai-agent-management.md`** — Expanded from summary to full production spec with TypeScript interfaces, custom hooks, state management table, backend wiring with Supabase queries, RLS policies, API response interfaces, edge cases, detailed ASCII wireframes (desktop/tablet/mobile), and component detail specs

### Design System Applied

All dashboard components follow BCG design system tokens:
- Background: #F5F5F0 (main), #1A1A1A (sidebar), #FFFFFF (cards)
- Text: #1A1A1A (primary), #6B6B63 (secondary), #9CA39B (muted)
- Accent: #00875A (green, used sparingly for active states, CTAs, scores)
- Border: #E8E8E4 (cards, dividers)
- Typography: Georgia serif (headings), system sans-serif (body), JetBrains Mono (metrics)
- Border radius: 4px (rounded), no shadows, no gradients

### Files Created

```
/components/dashboard/DashboardLayout.tsx
/components/dashboard/DashboardSidebar.tsx
/components/dashboard/DashboardHeader.tsx
/components/dashboard/DashboardHome.tsx
/components/dashboard/WelcomeBanner.tsx
/components/dashboard/MetricsRow.tsx
/components/dashboard/ProjectSummaryCard.tsx
/components/dashboard/ActivityFeed.tsx
/components/dashboard/QuickActionsGrid.tsx
/components/dashboard/AIInsightsPanel.tsx
/components/dashboard/EmptyDashboard.tsx
/components/dashboard/PlaceholderPage.tsx
/lib/hooks/useDashboardData.ts
/docs/dashboard/10-workflow-automation.md
/docs/dashboard/11-document-management.md
/docs/dashboard/12-financial-dashboard.md
```

### Files Modified

```
/routes.tsx — Added /app route group with 12 dashboard child routes
/docs/dashboard/00-dashboard-master.md — Expanded index, IA, routes, components, phases
/docs/dashboard/04-data-hooks-wiring.md — Added workflow/document/financial hooks + API specs
/docs/dashboard/09-ai-agent-management.md — Full expansion with interfaces, wireframes, wiring
```

---

## [0.11.0] — 2026-03-07 — Auth UI, Step 4 Readiness, Step 5 Roadmap Wiring

### Summary

Completed the three remaining integration priorities: built a full login/signup UI with session-scoped wizard persistence, wired Step 4 to call `/readiness-score` for live AI readiness assessments, and wired Step 5 to call `/generate-roadmap` for AI-generated implementation roadmaps.

### Added

- **C90-AUTH** `/components/AuthContext.tsx` — React context wrapping Supabase Auth with `useAuth()` hook providing `signIn`, `signUp`, `signOut`, `clearError`, session restoration on mount, and `onAuthStateChange` listener for automatic state sync
- **C91-AUTH-PAGE** `/components/AuthPage.tsx` — Standalone login/signup page at `/login` with BCG design system styling: two-column layout (dark brand panel + form), mode toggle (login ↔ signup), client-side validation, loading/error/success states, password visibility toggle, and "Continue as Guest" fallback to `/wizard`

### Changed

- **C33** `StepExecutiveSummary.tsx` — Now calls `aiApi.readinessScore(sessionId)` on mount to fetch live AI readiness assessment; displays overall score (0-100) with color coding, 5-dimension breakdown with progress bars, strengths list, gaps with priority indicators, and AI-recommended next steps; includes loading spinner, error state with retry button, and graceful fallback when session not yet saved
- **C34** `StepLaunchProject.tsx` — Now calls `aiApi.generateRoadmap()` on mount with selected systems, industry, and company size; displays AI-generated phases (replacing static `ROADMAP_PHASES` when available), project investment estimate, quick wins section, success metrics table; includes loading state, error with retry button, and automatic fallback to static phases
- **C29-STATE** `WizardContext.tsx` — Now imports `useAuth()` and passes `accessToken` to `wizardApi.save()` for user-scoped cloud persistence; authenticated users get RLS-enforced wizard data isolation
- **C01** `Header.tsx` — Added user menu dropdown (avatar initial, name, email, sign out) when authenticated; shows "Sign In" link when not authenticated; mobile menu includes account section with sign-out
- **L01-SUPABASE** `lib/supabase.ts` — `wizardApi.save()`, `saveStep()`, `load()` now accept optional `token` parameter for authenticated requests; added `wizardApi.list(userId, token)` for listing user sessions
- **App.tsx** — Wrapped `RouterProvider` with `AuthProvider` for app-wide auth state
- **Routes** — Added `/login` as standalone top-level route (no site header/footer, has own brand panel)

### Auth Flow

```
/login → Sign Up → POST /signup (edge function, admin create + auto email confirm)
       → Auto Sign In → Supabase Auth signInWithPassword
       → Auth state change → AuthContext updates → redirect to /wizard
       → WizardContext passes accessToken to wizardApi.save()
       → Edge function userClient(JWT) enforces RLS on wizard data
```

---

## [0.10.0] — 2026-03-07 — KV Store → Relational Tables Refactor

### Summary

Replaced all KV store (`kv_store_283466b6`) usage in edge functions with proper Supabase table queries against `wizard_sessions`, `wizard_answers`, `ai_cache`, and `ai_run_logs`. This eliminates the Figma Make workaround, enables RLS enforcement, foreign key integrity, indexing, and type safety.

### Added

- **S05-DB** `/supabase/functions/server/db.tsx` — New Supabase client factory with `adminClient()` (service-role for ai_cache/ai_run_logs) and `userClient(authHeader)` (JWT-scoped for wizard data, respects RLS)

### Changed — Backend

- **S01-GEMINI** `gemini.tsx` — Cache now reads/writes `ai_cache` table (upsert on `input_hash` PK, `expires_at` timestamptz for TTL) instead of `kv.get/set`; AI run logging now inserts into `ai_run_logs` table with `session_id`, `org_id`, `prompt_type`, `model`, `tokens_used`, `duration_ms`, `success`, `error_message`; `callGemini()` now accepts optional `sessionId` parameter for log correlation
- **S03-WIZARD** `wizard-routes.tsx` — All routes now query `wizard_sessions` and `wizard_answers` tables via `userClient()` (RLS-scoped); `POST /wizard/save` upserts session row + answer row; `GET /wizard/:sessionId` joins session with ordered answers including `ai_results`; `GET /wizard/list/:userId` filters by `user_id` column with `updated_at` sort
- **S04-AI** `ai-routes.tsx` — All 5 AI endpoints now store results in `wizard_answers.ai_results` jsonb via `saveAIResult()` helper (step 1=analysis, step 2=diagnostics, step 3=recommendations, step 4=readiness, step 5=roadmap); `readiness-score` endpoint aggregates prior steps from `wizard_answers` table instead of KV multi-get
- **S00-SERVER** `index.tsx` — Removed `import * as kv from "./kv_store.tsx"`

### Changed — Frontend

- **L01-SUPABASE** `lib/supabase.ts` — Updated `WizardLoadResponse` type to match new table-backed response shape: `session` now includes `org_id`, `user_id`, `status`, `context_snapshot`, `created_at`; `answers` now include `step_number`, `answers`, `ai_results`, `updated_at`

### Removed

- All `import * as kv from "./kv_store.tsx"` references from edge function files
- All KV key pattern operations (`kv.set`, `kv.get`, `kv.mget`, `kv.getByPrefix`)

### Migration Notes

- The `kv_store_283466b6` table is preserved for historical data — not dropped
- Requires `wizard_sessions`, `wizard_answers`, `ai_cache`, and `ai_run_logs` tables to exist in Supabase (created via migrations 000000–000004)
- `wizard_answers` requires a unique constraint on `(session_id, step_number)` for upserts
- `wizard_answers` requires an `ai_results` jsonb column (add via migration if missing)
- `ai_cache` uses `input_hash` text as primary key with `expires_at` timestamptz for TTL

### KV → Table Mapping

| Old KV Key Pattern | New Table | Column |
|---|---|---|
| `wizard:session:{id}` | `wizard_sessions` | Full row (id, user_id, current_step, status, context_snapshot) |
| `wizard:answer:{id}:step{n}` | `wizard_answers` | `answers` jsonb |
| `wizard:analysis:{id}` | `wizard_answers` (step 1) | `ai_results` jsonb |
| `wizard:diagnostics:{id}` | `wizard_answers` (step 2) | `ai_results` jsonb |
| `wizard:recommendations:{id}` | `wizard_answers` (step 3) | `ai_results` jsonb |
| `wizard:readiness:{id}` | `wizard_answers` (step 4) | `ai_results` jsonb |
| `wizard:roadmap:{id}` | `wizard_answers` (step 5) | `ai_results` jsonb |
| `ai:cache:{sha256}` | `ai_cache` | `input_hash` PK, `response` jsonb, `expires_at` |
| `ai:log:{ts}-{rand}` | `ai_run_logs` | Full row with prompt_type, model, tokens, duration |

---

## [0.9.0] — 2026-03-07 — Supabase Integration & Backend Stack

### Added — Backend (Edge Functions)

- **S00-SERVER** `/supabase/functions/server/index.tsx` — Main Hono server entry point with CORS, logger, health check, signup route, and mounted sub-routers for wizard and AI routes
- **S01-GEMINI** `/supabase/functions/server/gemini.tsx` — Gemini 2.0 Flash AI client with SHA-256 input hashing for cache keys, 24h/7d TTL caching via KV store, structured JSON response parsing, token usage tracking, and AI run audit logging
- **S02-AUTH** `/supabase/functions/server/auth.tsx` — Authentication utilities: `createUser` (admin signup with auto email confirm), `getUserFromToken` (JWT validation with anon key passthrough), `requireAuth` (protected route guard)
- **S03-WIZARD** `/supabase/functions/server/wizard-routes.tsx` — Wizard session persistence: `POST /wizard/save` (full state or per-step saves), `GET /wizard/:sessionId` (load session + all step answers), `GET /wizard/list/:userId` (list user sessions)
- **S04-AI** `/supabase/functions/server/ai-routes.tsx` — Five Gemini-powered AI endpoints:
  - `POST /analyze-business` — Company analysis from URL/description with industry detection, tech signals, AI opportunities, and readiness indicators
  - `POST /industry-diagnostics` — Industry-specific pain points, opportunities, benchmarks, and priority actions
  - `POST /system-recommendations` — Ranked AI system recommendations with fit scores, ROI projections, and implementation order
  - `POST /readiness-score` — AI readiness assessment with 5-dimension scoring, maturity level, gaps, strengths, and next steps
  - `POST /generate-roadmap` — Phased implementation roadmap with deliverables, milestones, risk factors, and success metrics

### Added — Frontend API Layer

- **L01-SUPABASE** `/lib/supabase.ts` — Singleton Supabase client, typed `api()` helper for Edge Function calls, and three API modules:
  - `wizardApi` — `save()`, `saveStep()`, `load()` for wizard session persistence
  - `aiApi` — `analyzeBusiness()`, `industryDiagnostics()`, `systemRecommendations()`, `readinessScore()`, `generateRoadmap()`
  - `authApi` — `signup()`, `signIn()`, `signOut()`, `getSession()` using Supabase Auth
- TypeScript interfaces: `WizardSaveResponse`, `WizardLoadResponse`, `AnalysisResponse`, `RoadmapResponse`

### Changed — Wizard Components

- **C29-STATE** `WizardContext.tsx` — Now dual-saves wizard state to localStorage (500ms debounce) and Supabase cloud via `wizardApi.save()` (2s debounce) with automatic session ID generation and management
- **C30** `StepBusinessContext.tsx` — Enhanced with real Gemini `/analyze-business` integration; attempts live AI analysis on URL blur, falls back to mock simulation on failure; includes inline trust pills, ~4s analysis flow, Company Analysis results card, smart autofill suggestions, and error handling per `/imports/wizard-step1-update.md`
- **C32** `StepSystemRecommendations.tsx` — Now uses `getIndustryPrioritizedSystems()` for spec-accurate industry-based ordering with signal boosting from diagnostic data

### Not Yet Wired

- **C33** `StepExecutiveSummary.tsx` — Needs `/readiness-score` endpoint integration for live AI readiness assessments
- **C34** `StepLaunchProject.tsx` — Needs `/generate-roadmap` endpoint integration for AI-generated implementation roadmaps
- Login/signup UI with user-scoped wizard sessions not yet built
- `StyleGuidePage.tsx` still shows old palette instead of BCG design system tokens

---

## [0.8.0] — 2026-03-06 — Supabase Architecture Documentation

### Added

- **SupabaseArchitecturePage** `/components/SupabaseArchitecturePage.tsx` — Visual reference page for the full Supabase integration plan, routed at `/docs/supabase`
- 9 sub-components in `/components/supabase-arch/`:
  - `SystemArchitectureDiagram` — Three-tier architecture overview
  - `DatabaseStructure` — 21-table schema visualization
  - `EdgeFunctionArch` — Edge function routing diagram
  - `AuthFlow` — Authentication flow walkthrough
  - `AIPipeline` — Gemini AI pipeline stages
  - `RealtimeSystem` — Supabase Realtime subscriptions
  - `FrontendDataFlow` — Frontend data flow patterns
  - `FrontendHooks` — React hook integration layer
  - `APIReference` — Endpoint documentation
- `/docs/supabase/00-architecture-overview.md` — Architecture spec markdown
- `/docs/supabase/01-implementation-guide.md` — Step-by-step implementation guide
- `/imports/supabase-architecture-overview.md` — Full backend integration plan with 21-table database schema, edge functions, auth, realtime, storage, and AI pipeline specs

---

## [0.7.0] — 2026-03-05 — Project Brief Wizard (5-Step Flow)

### Added

- **Wizard Documentation Suite** `/docs/wizard/` — 9 documents:
  - `00-wizard.md` — Master plan and flow overview
  - `01-business-context.md` through `07-proposal.md` — Per-screen specs with ASCII wireframes, content data tables, UI component trees, interaction states, validation rules, Gemini prompt structures, animation specs, and accessibility requirements
  - `08-flow-diagrams.md` — Complete workflow diagrams
- **C29-STATE** `WizardContext.tsx` — React Context with localStorage persistence, draft resume toast, per-field validation errors, save status, keyboard nav support
- **C30** `StepBusinessContext.tsx` — Step 1: Company info form with URL analysis simulation, inline trust pills, Company Analysis card, smart autofill
- **C31** `StepIndustryDiagnostics.tsx` — Step 2: Industry-specific diagnostic questions
- **C32** `StepSystemRecommendations.tsx` — Step 3: AI system cards ranked by fit with sort controls and expandable details
- **C33** `StepExecutiveSummary.tsx` — Step 4: Strategy brief with 7 sections, inline editing, approval flow
- **C34** `StepLaunchProject.tsx` — Step 5: Launch confirmation with staggered animations
- **WizardLayout** — Three-panel layout: sidebar, main content, context panel
- **WizardSidebar** — Step progress tracker
- **WizardFooter** — Back/Next navigation with validation gating
- **WizardPage** — Standalone route wrapper (no site header/footer)
- **ProcessingPage** — AI processing transition screen
- **ProposalPage** — Final proposal output
- `/components/wizard/data/wizardData.ts` — All wizard content data, industry configs, AI system definitions, and `getIndustryPrioritizedSystems()` utility

---

## [0.6.0] — 2026-03-04 — Service Pages (Superside-Inspired Layout)

### Added

- **Sales CRM Page** `/pages/SalesCRMPage.tsx` with 7 sub-components in `/components/sales-crm/`
- **WhatsApp AI Page** `/pages/WhatsAppAIPage.tsx`
- **Chatbot Service Page** `/components/services/ChatbotServicePage.tsx`
- `/imports/sun-ai-service-page.md` — Superside-inspired service page layout spec

---

## [0.5.0] — 2026-03-03 — Industry Verticals & Web Services

### Added

- **E-Commerce Page** with 12 sub-components in `/components/ecommerce/`
- **Fashion & Retail Page** with 12 sub-components in `/components/fashion/`
- **Travel & Tourism Page** with 9 sub-components in `/components/travel/`
- **Financial Services Page** with 12 sub-components in `/components/financial/`
- **Web Design Page** `/pages/WebDesignPage.tsx` with 12 sub-components in `/components/web-design/`
- **Web Apps Page** `/pages/WebAppsPage.tsx` with 8 sub-components in `/components/web-apps/`
- **MVP Builder Pages** `/pages/MVPBuilderPage.tsx` and `/pages/MVPv2Page.tsx`

---

## [0.4.0] — 2026-03-02 — AI Solutions Pages

### Added

- **AI Agents Page** `/pages/AIAgentsPage.tsx` with 7 sub-components in `/components/ai-agents/`
- **Agents Overview Page** with 9 sub-components in `/components/agents/`
- **Chatbots Page** with 10 sub-components in `/components/chatbots/`
- **Solutions Page** with 4 sub-components in `/components/solutions/`

---

## [0.3.0] — 2026-03-01 — Homepage Variants & Core Pages

### Added

- **HomePageV3** (current default) — BCG Luxury editorial homepage
- **HomePageV2** — Luxury editorial variant at `/home-v4`
- **HomePage** — Original variant at `/home-v1`
- 17 home sub-components across `/components/home/` and `/components/homev2/`
- **Process Page V12** with 8 sub-components in `/components/process/v12/`
- **Projects Page** with 10 sub-components in `/components/projects/`
- **About Page** with 10 sub-components in `/components/about/`
- **Industries Page** with 10 sub-components in `/components/industries/`
- **Case Studies Page** with 10 sub-components in `/components/case-studies/`
- **Booking Page** with form components in `/components/booking/`
- **How It Works Carousel** with 6 sub-components in `/components/carousel/`

---

## [0.2.0] — 2026-02-28 — Layout & Navigation

### Added

- **Layout** `/components/Layout.tsx` — Site shell with header + footer
- **Header** `/components/Header.tsx` — Navigation with responsive menu
- **Footer** `/components/Footer.tsx` — Site footer
- **Routes** `/routes.tsx` — React Router Data Mode with 29 routes using `createBrowserRouter`
- **Sitemap Page** `/components/SitemapPage.tsx` — Visual sitemap at `/sitemap`
- **Style Guide Page** `/components/StyleGuidePage.tsx` — Design system reference at `/style-guide`
- **Sections Page** `/components/SectionsPage.tsx` — Component gallery at `/sections`

---

## [0.1.0] — 2026-02-27 — Project Foundation

### Added

- Vite + React + Tailwind CSS v4 project scaffold
- BCG consulting-inspired design tokens in `/styles/globals.css`:
  - Background: `#F5F5F0` (warm off-white)
  - Text: `#1A1A1A` (charcoal)
  - Accent: `#00875A` (BCG signature green, used sparingly)
  - Cards: flat white with `#E8E8E4` borders
  - Typography: Georgia serif headlines, Inter body
  - Spacing: `1120px` max-width container, generous whitespace
  - Radius: `4px` — no glassmorphism, no gradients
- shadcn/ui component library in `/components/ui/` (40+ components)
- Shared components: `PageHeader`, `HowWeDeliverSection`
- Utility hooks: `useScrollAnimation`, `useCarouselNavigation`, `useSwipeGesture`, `useBookingForm`
- `/lib/constants.ts`, `/lib/navigation.ts` — Site-wide constants and nav config
- Design system docs: `/imports/bcg-style-guide.md`, `/imports/bcg-style-guide-1.md`, `/imports/design-system-overview.md`

---

## Architecture Notes

### Data Persistence

As of v0.10.0, all data persistence uses proper Supabase relational tables with RLS, foreign keys, and indexing:

| Table | Purpose | Client |
|---|---|---|
| `wizard_sessions` | Session state (id, user_id, current_step, status, context_snapshot) | `userClient` (RLS) |
| `wizard_answers` | Per-step answers + AI results (session_id FK, step_number, answers, ai_results) | `userClient` (RLS) / `adminClient` (AI writes) |
| `ai_cache` | Gemini response cache (input_hash PK, response, model, tokens_used, expires_at) | `adminClient` |
| `ai_run_logs` | AI run audit trail (session_id FK, prompt_type, model, tokens_used, duration_ms) | `adminClient` |

The legacy `kv_store_283466b6` table is preserved for historical data but no longer referenced by any edge function code.

### Authentication

Supabase Auth handles signup (server-side admin create with auto email confirm) and sign-in (client-side `signInWithPassword`). JWT tokens are passed via `Authorization: Bearer {token}` headers. `adminClient()` is now used for all wizard routes (save/load/list) after the v0.14.0 fix, with auth validation still performed via `getUserFromToken()` before database operations. `userClient(authHeader)` is available for future RLS-scoped queries. Frontend `api()` helper includes a 401-retry-with-anon-key fallback.

### AI Pipeline

All AI calls go through the `callGemini()` utility which: checks `ai_cache` table → calls Gemini 2.0 Flash API with structured JSON output → logs to `ai_run_logs` table → caches result in `ai_cache` → returns parsed JSON. Five specialized endpoints wrap this with domain-specific prompts and persist results to `wizard_answers.ai_results`.

---

## Remaining Priorities

1. **Phase 7** — CRM Pipeline Kanban board (deal stages, drag-and-drop, AI deal scoring)
2. **Phase 8** — Documents & Files (Supabase Storage integration, file upload/download)
3. **Phase 11** — Workflow Automation (triggers, logic chains, automated actions)
4. **Phase 12** — Financial Dashboard (revenue tracking, invoices, project profitability)
5. **Phase 13** — Final polish, testing, production hardening
6. Add Supabase Storage integration for document uploads in wizard Step 1
7. Implement Supabase Realtime for live collaboration on wizard sessions