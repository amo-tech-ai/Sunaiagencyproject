---
id: lean-17-wiring-plan-checklist
title: Strategy Engine — Wiring Plan Implementation Checklist
skill: fullstack
phase: LEAN
priority: P0
status: In Progress
dependencies: [lean-13-frontend-backend-wiring, lean-12-sidebar-navigation]
estimated_effort: XL
percent_complete: 88
area: fullstack
spec_refs:
  - imports/strategy-wiring-plan-1.md
  - imports/strategy-sidebar-nav-1.md
---

# Strategy Engine — Wiring Plan Implementation Checklist

**Spec:** `/imports/strategy-wiring-plan-1.md` (9 steps, 13 components, 14 routes, 12 tables)
**Audited:** v0.24.5 — 2026-03-09 → v0.24.6 component extraction complete

---

## Overall Progress

| Step | Description | Status | Completion |
|------|-------------|--------|------------|
| 1 | Database Migration (12 tables) | BLOCKED | 0% |
| 2 | TypeScript Types (`strategy.ts`) | DONE | 100% |
| 3 | Frontend API Object (`strategyApi`) | DONE | 100% |
| 4 | Edge Function CRUD Routes | DONE | 100% |
| 5 | Edge Function AI Routes | DONE | 100% |
| 6 | Mount Routes + Routing + Sidebar | DONE | 100% |
| 7 | `useStrategyData` Hook | DONE | 100% |
| 8 | Frontend Components (13 files) | DONE | 100% |
| 9 | End-to-End Verification | READY | 0% |

---

## Step 1: Database Migration (12 tables)

**Status: BLOCKED** — Cannot run DDL/migrations from Make environment.
**File expected:** `supabase/migrations/20260308120000_create_strategy_engine_tables.sql`
**File present:** No

Manual action required: apply via Supabase Dashboard or MCP `apply_migration`.

| # | Table | Status | Notes |
|---|-------|--------|-------|
| 1 | `lean_canvases` | PENDING | Core — 9 JSONB block columns + indexes |
| 2 | `lean_canvas_versions` | PENDING | Version snapshots, FK to lean_canvases |
| 3 | `strategy_insights` | PENDING | Agent-generated insights + status check |
| 4 | `automation_opportunities` | PENDING | 6-value status check constraint |
| 5 | `strategy_recommendations` | PENDING | 5-value approval_status check |
| 6 | `strategy_actions` | PENDING | Audit log for agent actions |
| 7 | `strategy_events` | PENDING | Event bus (Phase 1 = log only) |
| 8 | `strategy_event_triggers` | PENDING | All disabled in Phase 1 |
| 9 | `strategy_agent_memory` | PENDING | Self-referential FK (superseded_by) |
| 10 | `strategy_signals` | PENDING | Signal tracking with trend |
| 11 | `strategy_roles` | PENDING | RBAC: admin/strategist/viewer |
| 12 | `strategy_budgets` | PENDING | Token limits + analysis caps |
| — | RLS policies (all 12 tables) | PENDING | Authenticated CRUD |
| — | Indexes (8 total) | PENDING | Performance indexes per spec |

---

## Step 2: TypeScript Types

**Status: DONE**
**File:** `/lib/types/strategy.ts`

| Type/Interface | Present |
|---------------|---------|
| `CanvasBlockItem` | YES |
| `CanvasBlockKey` (union type) | YES |
| `CANVAS_BLOCK_LABELS` (const map) | YES |
| `LeanCanvas` | YES |
| `CanvasVersion` | YES |
| `InsightType`, `InsightStatus` | YES |
| `StrategyInsight` | YES |
| `OpportunityStatus` | YES |
| `AutomationOpportunity` | YES |
| `RecommendationType`, `ApprovalStatus` | YES |
| `StrategyRecommendation` | YES |
| `StrategyAction` | YES |
| `StrategyMetrics` (8-dim health + 10 fields) | YES |
| `StrategyDashboardData` | YES |
| `StrategyAnalysisResponse` | YES |
| `BlockSynthesisResponse` | YES |

---

## Step 3: Frontend API Object

**Status: DONE**
**File:** `/lib/supabase.ts` (line 689)
**Object:** `strategyApi`

| Method | Route | Present |
|--------|-------|---------|
| `getCanvas` | GET `/strategy/canvas` | YES |
| `createCanvas` | POST `/strategy/canvas` | YES |
| `updateCanvasBlocks` | PUT `/strategy/canvas/:id` | YES |
| `getCanvasVersions` | GET `/strategy/canvas/:id/versions` | YES |
| `listInsights` | GET `/strategy/insights` | YES |
| `updateInsight` | PUT `/strategy/insights/:id` | YES |
| `listOpportunities` | GET `/strategy/opportunities` | YES |
| `updateOpportunity` | PUT `/strategy/opportunities/:id` | YES |
| `listRecommendations` | GET `/strategy/recommendations` | YES |
| `approveRecommendation` | POST `/strategy/recommendations/:id/approve` | YES |
| `getActions` | GET `/strategy/actions` | YES |
| `getMetrics` | GET `/strategy/metrics` | YES |
| `runAnalysis` | POST `/strategy/analyze` | YES |
| `synthesizeBlock` | POST `/strategy/synthesize-block` | YES |

All 14 methods match spec. Token pattern: `'use-fresh-token'`.

---

## Step 4: Edge Function CRUD Routes

**Status: DONE**
**File:** `/supabase/functions/server/strategy-routes.tsx`

| # | Route | Method | Line | Present |
|---|-------|--------|------|---------|
| 1 | `/strategy/canvas` | GET | 217 | YES |
| 2 | `/strategy/canvas` | POST | 244 | YES |
| 3 | `/strategy/canvas/:id` | PUT | 311 | YES |
| 4 | `/strategy/canvas/:id/versions` | GET | 357 | YES |
| 5 | `/strategy/insights` | GET | 381 | YES |
| 6 | `/strategy/insights/:id` | PUT | 405 | YES |
| 7 | `/strategy/opportunities` | GET | 429 | YES |
| 8 | `/strategy/opportunities/:id` | PUT | 447 | YES |
| 9 | `/strategy/recommendations` | GET | 473 | YES |
| 10 | `/strategy/recommendations/:id/approve` | POST | 494 | YES |
| 11 | `/strategy/actions` | GET | 605 | YES |
| 12 | `/strategy/metrics` | GET | 629 | YES |

All 12 CRUD routes present. Uses `requireAuth()`, `adminClient()`, `errorResponse()` pattern.
Includes `seedCanvasFromWizard()` helper (line 27) for wizard-to-canvas seeding.

---

## Step 5: Edge Function AI Routes

**Status: DONE**
**File:** `/supabase/functions/server/strategy-routes.tsx`

| Route | Method | Line | Present | Notes |
|-------|--------|------|---------|-------|
| `/strategy/analyze` | POST | 669 | YES | 5-agent orchestration (Phase A/B/C) |
| `/strategy/synthesize-block` | POST | 919 | YES | Per-block AI suggestion |

Both routes use `callGemini()` from `gemini.tsx`. Budget checking included.

---

## Step 6: Mount Routes + Routing + Sidebar

**Status: DONE**

| Item | File | Line | Present |
|------|------|------|---------|
| Import strategy routes | `/supabase/functions/server/index.tsx` | 16 | YES |
| Mount `app.route("/", strategy)` | `/supabase/functions/server/index.tsx` | 170 | YES |
| Import StrategyEnginePage | `/routes.tsx` | 53 | YES |
| Route `{ path: 'strategy' }` | `/routes.tsx` | 125 | YES |
| Sidebar nav item (Brain icon) | `/components/dashboard/DashboardSidebar.tsx` | 26 | YES |
| Position: after AI Insights, before Documents | `/components/dashboard/DashboardSidebar.tsx` | 24-27 | YES |
| Badge: `pendingApprovals` (amber `#D97706`) | `/components/dashboard/DashboardSidebar.tsx` | 130 | YES |
| Badge fetch from `strategyApi.getMetrics()` | `/components/dashboard/DashboardLayout.tsx` | 25-41 | YES |
| Active state: `bg-[#00875A]/10` + green text + left border | `/components/dashboard/DashboardSidebar.tsx` | 122 | YES |
| Header ROUTE_LABELS: `'Strategy Engine'` | `/components/dashboard/DashboardHeader.tsx` | 16 | YES |
| Breadcrumb: `Dashboard / Strategy Engine` | `/components/dashboard/DashboardHeader.tsx` | auto | YES |

### Sidebar spec deviations (intentional)
- **Hover state**: Adapted from spec's `bg-[#F5F5F0]` / `text-[#1A1A1A]` (light sidebar) to `hover:bg-white/8` / `hover:text-[#F5F5F0]` (dark sidebar adaptation). Spec colors would create jarring white rows on the `#1A1A1A` dark sidebar.

---

## Step 7: useStrategyData Hook

**Status: DONE**
**File:** `/lib/hooks/useStrategyData.ts`

| Feature | Present |
|---------|---------|
| Parallel fetch on mount (`Promise.all`) | YES |
| `canvas` state + `setCanvas` | YES |
| `insights`, `opportunities`, `recommendations` state | YES |
| `metrics` state | YES |
| `loading`, `error` state | YES |
| `analysisRunning` flag | YES |
| `synthesizingBlock` flag | YES |
| `blockSuggestions` state | YES |
| `createCanvas(sessionId?)` action | YES |
| `runAnalysis()` action | YES |
| `synthesizeBlock(block, context)` action | YES |
| `updateBlock(block, items, summary)` action | YES |
| `approveRecommendation(id, approved, comment)` action | YES |
| `dismissInsight(id)` action | YES |
| `updateOpportunityStatus(id, status)` action | YES |
| `refresh()` / `fetchAll()` | YES |
| Auth token: `'use-fresh-token'` pattern | YES |

---

## Step 8: Frontend Components (13 files)

**Status: DONE**

All 13 components now exist as separate production files in `/components/dashboard/strategy/`.

| # | Spec File | Actual File | Status |
|---|-----------|-------------|--------|
| 1 | `StrategyEnginePage.tsx` | `StrategyEnginePage.tsx` | YES |
| 2 | `StrategyHeader.tsx` | `StrategyHeader.tsx` | YES |
| 3 | `StrategyMetricsBar.tsx` | `StrategyMetricsBar.tsx` | YES |
| 4 | `LeanCanvasPanel.tsx` | `LeanCanvasPanel.tsx` | YES |
| 5 | `CanvasBlock.tsx` | `CanvasBlock.tsx` | YES |
| 6 | `CanvasBlockEditor.tsx` | `CanvasBlockEditor.tsx` (exports `SuggestionsPanel` + `BlockEditorBottomSheet`) | YES |
| 7 | `IntelligencePanel.tsx` | `IntelligencePanel.tsx` (includes PendingApprovalsSection) | YES |
| 8 | `RecommendationCard.tsx` | `RecommendationCard.tsx` | YES |
| 9 | `InsightCard.tsx` | `InsightCard.tsx` | YES |
| 10 | `OpportunityCard.tsx` | `OpportunityCard.tsx` | YES |
| 11 | `PendingApprovalsSection` | Integrated in `IntelligencePanel.tsx` (amber Shield section) | YES |
| 12 | `CanvasVersionHistory.tsx` | `CanvasVersionHistory.tsx` | YES |
| 13 | `StrategyAnalysisSheet.tsx` | `AnalysisProgressSheet.tsx` (renamed) | YES |
| 14 | `RoadmapExecutionPanel.tsx` | `RoadmapExecutionPanel.tsx` | YES |

### Component Dependency Tree (verified acyclic)

```
StrategyEnginePage.tsx (orchestrator — default export)
├── StrategyHeader.tsx
├── StrategyMetricsBar.tsx
├── LeanCanvasPanel.tsx
│   └── CanvasBlock.tsx
├── IntelligencePanel.tsx
│   ├── InsightCard.tsx
│   ├── RecommendationCard.tsx
│   └── OpportunityCard.tsx
├── CanvasBlockEditor.tsx (SuggestionsPanel + BlockEditorBottomSheet)
├── AnalysisProgressSheet.tsx
├── RoadmapExecutionPanel.tsx
└── CanvasVersionHistory.tsx
```

### Import Validation

| From | To | Import Path | Verified |
|------|----|-------------|----------|
| `StrategyEnginePage` | `StrategyHeader` | `./StrategyHeader` | YES |
| `StrategyEnginePage` | `StrategyMetricsBar` | `./StrategyMetricsBar` | YES |
| `StrategyEnginePage` | `LeanCanvasPanel` | `./LeanCanvasPanel` | YES |
| `StrategyEnginePage` | `IntelligencePanel` | `./IntelligencePanel` | YES |
| `StrategyEnginePage` | `CanvasBlockEditor` | `./CanvasBlockEditor` (named) | YES |
| `StrategyEnginePage` | `AnalysisProgressSheet` | `./AnalysisProgressSheet` | YES |
| `StrategyEnginePage` | `RoadmapExecutionPanel` | `./RoadmapExecutionPanel` | YES |
| `StrategyEnginePage` | `CanvasVersionHistory` | `./CanvasVersionHistory` | YES |
| `LeanCanvasPanel` | `CanvasBlock` | `./CanvasBlock` | YES |
| `IntelligencePanel` | `InsightCard` | `./InsightCard` | YES |
| `IntelligencePanel` | `RecommendationCard` | `./RecommendationCard` | YES |
| `IntelligencePanel` | `OpportunityCard` | `./OpportunityCard` | YES |
| `routes.tsx` | `StrategyEnginePage` | `./components/dashboard/strategy/StrategyEnginePage` | YES |

---

## Step 9: End-to-End Verification

**Status: READY** — Migration completing. Run these in order.

### 9A. Post-Migration Verification (run immediately after migration)

Run these SQL queries in Supabase SQL Editor to confirm all 12 tables + RLS exist:

```sql
-- Verify all 12 tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'lean_canvases', 'lean_canvas_versions', 'strategy_insights',
  'automation_opportunities', 'strategy_recommendations', 'strategy_actions',
  'strategy_events', 'strategy_event_triggers', 'strategy_agent_memory',
  'strategy_signals', 'strategy_roles', 'strategy_budgets'
)
ORDER BY table_name;
-- Expected: 12 rows

-- Verify RLS is enabled on all 12 tables
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
  'lean_canvases', 'lean_canvas_versions', 'strategy_insights',
  'automation_opportunities', 'strategy_recommendations', 'strategy_actions',
  'strategy_events', 'strategy_event_triggers', 'strategy_agent_memory',
  'strategy_signals', 'strategy_roles', 'strategy_budgets'
);
-- Expected: all 12 show rowsecurity = true

-- Verify indexes exist
SELECT indexname FROM pg_indexes
WHERE tablename IN ('lean_canvases', 'strategy_insights', 'automation_opportunities', 'strategy_recommendations', 'strategy_actions', 'strategy_events', 'strategy_agent_memory', 'strategy_signals')
AND indexname LIKE 'idx_%';
-- Expected: 8+ custom indexes
```

| # | Check | Expected | Status |
|---|-------|----------|--------|
| A1 | 12 tables exist | All 12 in `information_schema.tables` | |
| A2 | RLS enabled on all 12 | `rowsecurity = true` for all | |
| A3 | 8+ indexes created | `idx_canvas_session`, `idx_canvas_project`, etc. | |
| A4 | RLS policies created | 4 policies per table (select/insert/update/delete) | |

### 9B. Realtime Triggers (run in Supabase SQL Editor)

These SQL files enable live collaborative editing via `useRealtimeCanvasSync`:

| # | SQL File | What It Does | Status |
|---|----------|-------------|--------|
| B1 | `/imports/lean-canvases-broadcast-trigger.sql` | Creates `lean_canvases_broadcast_trigger()` on lean_canvases UPDATE → broadcasts to `canvas:{id}:blocks` | |
| B2 | (same file, second trigger) | Creates `lean_canvas_versions_broadcast_trigger()` on lean_canvas_versions INSERT → broadcasts `version_created` event | |
| B3 | `/imports/crm-deals-realtime-trigger.sql` | CRM deals broadcast (v0.24.4 backlog) | |
| B4 | `/imports/ai-runs-broadcast-trigger.sql` | AI run logs broadcast (v0.24.4 backlog) | |
| B5 | `/imports/wizard-sessions-broadcast-trigger.sql` | Wizard sessions broadcast (v0.24.4 backlog) | |

**B1 + B2 are required** for Strategy Engine live sync. B3-B5 are optional (other features).

After running B1 + B2, verify:
```sql
-- Check trigger functions exist
SELECT proname FROM pg_proc
WHERE proname IN ('lean_canvases_broadcast_trigger', 'lean_canvas_versions_broadcast_trigger');
-- Expected: 2 rows

-- Check triggers are attached
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name IN ('lean_canvases_broadcast_trigger', 'lean_canvas_versions_broadcast_trigger');
-- Expected: 2 rows (UPDATE on lean_canvases, INSERT on lean_canvas_versions)
```

### 9C. Enable Realtime Replication

In **Supabase Dashboard → Database → Replication**:

| # | Table | Publication | Status |
|---|-------|------------|--------|
| C1 | `lean_canvases` | Add to `supabase_realtime` publication | |
| C2 | `lean_canvas_versions` | Add to `supabase_realtime` publication | |

Or via SQL:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE lean_canvases;
ALTER PUBLICATION supabase_realtime ADD TABLE lean_canvas_versions;
```

### 9D. Edge Function Deployment

The server at `/supabase/functions/server/index.tsx` already mounts strategy routes (line 170). The edge function auto-deploys on save in this Make environment. If running externally:

```bash
supabase functions deploy make-server-283466b6
```

### 9E. Functional Smoke Tests

Run these in order after 9A-9D are complete:

| # | Test | How to Verify | Expected | Status |
|---|------|--------------|----------|--------|
| E1 | Navigate `/app/strategy` | Log in → click Strategy in sidebar | Empty state with "Create from Wizard" + "Start Fresh Canvas" buttons | |
| E2 | Create fresh canvas | Click "Start Fresh Canvas" | Canvas grid appears (9 empty blocks), metrics bar shows 0%, sidebar badge loads | |
| E3 | Canvas block display | View the 9-block grid | All 9 blocks show placeholder descriptions, Ask AI (sparkle) button on each | |
| E4 | Ask AI on a block | Click sparkle icon on "Problem" block | Floating SuggestionsPanel appears with 2-4 AI-generated items, rationale text | |
| E5 | Accept AI suggestions | Check 2+ items → click "Accept" | Items added to Problem block, version increments (check header: v2) | |
| E6 | Run Analysis | Click green "Run Analysis" button | AnalysisProgressSheet opens showing 3 agents (Phase A) → results populate Intelligence Panel | |
| E7 | Pending approvals | After analysis completes | Recommendations appear in Intelligence Panel with Approve/Reject buttons | |
| E8 | Approve recommendation | Click "Approve" on a canvas_update rec | Item removed from pending, canvas version increments if type=canvas_update | |
| E9 | Reject recommendation | Click "Reject" on a rec | Item shows "rejected" status, removed from pending list | |
| E10 | Dismiss insight | Click X on an insight card | Insight animates out, removed from list | |
| E11 | Version history | Click "History" button in header | Side sheet opens with version timeline, view snapshot button works | |
| E12 | Sidebar badge | After analysis creates pending recs | Amber badge appears on Strategy nav item in sidebar, count matches pending count | |
| E13 | Mobile responsive | Resize to <768px | 3-tab bar appears (Canvas/Roadmap/Intel), metrics collapse to 2×2 grid | |
| E14 | Mobile block editor | (Mobile) tap a canvas block | Bottom sheet slides up with block items + AI button | |
| E15 | Budget enforcement | Run analysis 5× in quick succession | 429 error: "Daily analysis limit reached" after max_analyses_per_day | |
| E16 | Rate limit interval | Run analysis, then immediately again | 429 error: "Please wait X minutes before running another analysis" | |
| E17 | Live sync indicator | With canvas open | Green "Live" dot appears next to version info (if triggers installed) | |
| E18 | Create from Wizard | Complete wizard first → click "Create from Wizard" | Canvas blocks pre-populated from wizard answers (problem, customer_segments, etc.) | |

### 9F. Error Resilience Tests

| # | Test | How to Trigger | Expected | Status |
|---|------|---------------|----------|--------|
| F1 | Unauthenticated access | Visit `/app/strategy` logged out | Redirect to `/auth?return=/app/strategy` | |
| F2 | Network error | Disconnect network → click refresh | Error banner shows, Retry button works | |
| F3 | Realtime fallback | Don't install triggers → open page | Status shows amber dot, "retry live" link, manual refresh still works | |
| F4 | Empty analysis results | Run analysis on empty canvas | Graceful handling — no crash, may show "No intelligence yet" | |

---

## Blockers & Next Actions

| Priority | Action | Owner | Dependency | Status |
|----------|--------|-------|------------|--------|
| P0 | ~~Apply strategy tables migration (12 tables + RLS + indexes)~~ | Manual | None | IN PROGRESS |
| P0 | Run canvas broadcast triggers (9B.B1 + B2) | Manual | Migration | TODO |
| P0 | Enable Realtime replication (9C) | Manual | Migration | TODO |
| P1 | Run 9E smoke tests E1-E6 (core flow) | Dev | 9A + 9B + 9C | TODO |
| P1 | Run 9E smoke tests E7-E18 (full coverage) | Dev | E1-E6 passing | TODO |
| P2 | Run remaining broadcast triggers (9B.B3-B5) | Manual | Migration | TODO |
| P2 | Run 9F error resilience tests | QA | E1-E6 passing | TODO |
| P3 | Real device testing (iOS Safari, Android Chrome) | QA | Deployed build | TODO |

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-03-09 | v0.24.5 | Initial audit. Steps 2-7 complete. Step 6 sidebar gaps fixed. Step 1 blocked. Step 8 partial (9/13 inlined). Step 9 pending. |
| 2026-03-09 | v0.24.6 | Component extraction complete. All 13 files created. Step 8 100%. |
| 2026-03-09 | v0.24.7 | Post-migration runbook added to Step 9. Migration in progress. Added verification SQL, trigger install order, smoke test sequence (18 functional + 4 resilience tests). |