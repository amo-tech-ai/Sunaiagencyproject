# Task 15 — Frontend ↔ Backend Wiring Plan

**ID:** lean-15-frontend-backend-wiring
**Phase:** LEAN (Phase 14a–14c, cross-cutting)
**Priority:** P0
**Effort:** XL
**Status:** Not Started
**Dependencies:** lean-01, lean-08, lean-14
**Target Files:** Multiple (see Files Summary below)

---

## Objective

Complete wiring plan connecting the Strategy Engine frontend (15 React components) to the backend (14+ Hono edge routes, 12 Supabase tables, 5 Gemini AI agents). Follows existing patterns from `pipelineApi`, `CRMPipelinePage`, and `pipeline-routes.tsx`.

---

## Build Order (Sequential Dependencies)

```
Step 1  Database Migration (12 tables) — run in Supabase SQL Editor
  ↓
Step 2  TypeScript Types (lib/types/strategy.ts)
  ↓
Step 3  Frontend API Object (strategyApi in lib/supabase.ts)
  ↓
Step 4  Edge Function CRUD Routes (strategy-routes.tsx)
  ↓
Step 5  Edge Function AI Routes (analyze, synthesize-block)
  ↓
Step 6  Mount Routes + Routing + Sidebar
  ↓
Step 7  useStrategyData Hook (lib/hooks/useStrategyData.ts)
  ↓
Step 8  Frontend Components (15 files)
  ↓
Step 9  End-to-End Verification
```

---

## Step 1: Database Migration

**File:** `supabase/migrations/20260308120000_create_strategy_engine_tables.sql`
**Apply via:** Supabase SQL Editor (not auto-run — see project constraints)

### 12 Tables

#### Core (6)

| Table | Purpose |
|-------|---------|
| `lean_canvases` | Main canvas document (9 JSONB block columns + metadata) |
| `lean_canvas_versions` | Version snapshots with change summary |
| `strategy_insights` | AI-generated insights (trends, risks, opportunities) |
| `automation_opportunities` | Detected automation candidates with scores |
| `strategy_recommendations` | AI recommendations requiring human approval |
| `strategy_actions` | Audit log of all agent actions |

#### Advanced (6) — for future phases

| Table | Purpose |
|-------|---------|
| `strategy_events` | Event bus (Phase 1 = log only) |
| `strategy_event_triggers` | Agent triggers (all disabled in Phase 1) |
| `strategy_agent_memory` | Per-agent memory for context continuity |
| `strategy_signals` | Business signal tracking |
| `strategy_roles` | User roles per canvas (admin/strategist/viewer) |
| `strategy_budgets` | Token budget and rate limiting |

All tables: RLS enabled, authenticated CRUD policies, relevant indexes.

Full SQL in reference doc: `/imports/strategy-wiring-plan.md` §Step 1.

**NOTE:** The project constraint prevents running migrations from code. The user must run the SQL manually in the Supabase SQL Editor. The plan document includes the full SQL for copy-paste.

---

## Step 2: TypeScript Types

**File:** `/lib/types/strategy.ts`

Comprehensive types including:
- `CanvasBlockItem`, `CanvasBlockKey`, `LeanCanvas`, `CanvasVersion`
- `StrategyInsight`, `AutomationOpportunity`, `StrategyRecommendation`, `StrategyAction`
- `StrategyMetrics` (with 8-dimension health breakdown)
- `StrategyDashboardData`, `StrategyAnalysisResponse`, `BlockSynthesisResponse`
- Constants: `CANVAS_BLOCK_LABELS`, `CANVAS_BLOCK_ORDER`

Full type definitions in reference doc: `/imports/strategy-wiring-plan.md` §Step 2.

---

## Step 3: Frontend API Object

**File:** `/lib/supabase.ts` — add `strategyApi` after `financialApi`

### Methods (16)

| Method | HTTP | Route |
|--------|------|-------|
| `getCanvas()` | GET | `/strategy/canvas` |
| `createCanvas()` | POST | `/strategy/canvas` |
| `updateCanvasBlocks()` | PUT | `/strategy/canvas/:id` |
| `getCanvasVersions()` | GET | `/strategy/canvas/:id/versions` |
| `listInsights()` | GET | `/strategy/insights` |
| `updateInsight()` | PUT | `/strategy/insights/:id` |
| `listOpportunities()` | GET | `/strategy/opportunities` |
| `updateOpportunity()` | PUT | `/strategy/opportunities/:id` |
| `listRecommendations()` | GET | `/strategy/recommendations` |
| `approveRecommendation()` | POST | `/strategy/recommendations/:id/approve` |
| `getActions()` | GET | `/strategy/actions` |
| `getMetrics()` | GET | `/strategy/metrics` |
| `runAnalysis()` | POST | `/strategy/analyze` |
| `synthesizeBlock()` | POST | `/strategy/synthesize-block` |

All methods use `'use-fresh-token'` pattern.

---

## Step 4: Edge Function CRUD Routes

**File:** `/supabase/functions/server/strategy-routes.tsx`

All routes use `adminClient()` from `db.tsx` and `requireAuth()` from `auth.tsx`. Pattern follows `pipeline-routes.tsx`.

Key route details:
- `POST /strategy/canvas` — seeds from wizard data if `session_id` provided using `seedCanvasFromWizard()` mapping
- `PUT /strategy/canvas/:id` — increments version, creates snapshot in `lean_canvas_versions`
- `POST /strategy/recommendations/:id/approve` — approval logic varies by type (canvas_update applies block changes)

### Wizard → Canvas Seed Mapping

```
Step 1: painPoints → problem[], targetAudience → customer_segments[], opportunities → value_proposition[]
Step 2: signals → key_metrics[], channelAnalysis → channels[]
Step 3: selectedSystems → solution[], pricing → cost_structure[]
Step 4: strengths → unfair_advantage[], gaps → problem[] (additional)
Step 5: phases → metadata.phases, totalInvestment → revenue_streams[]
```

---

## Step 5: Edge Function AI Routes

### POST /strategy/analyze (core orchestration)

1. Budget check → reject if over limit (429)
2. Load context: canvas + wizard_answers + clients + deals + agent_memory
3. Phase A: `Promise.all([synthesizer, detector, interpreter])` — 3 Gemini calls
4. Phase B: `Promise.all([roadmap, system])` — 2 Gemini calls (depends on Phase A)
5. Phase C: conflict resolution + ranking
6. Persist: insert recommendations, insights, opportunities, actions
7. Save agent memories, update budget counters
8. Return aggregated results

### 5 Agent Specs

| Agent | Gemini Name | Cache TTL | Max Output |
|-------|-------------|-----------|------------|
| Strategy Synthesizer | `strategy-synthesize` | 4h | 3 recs |
| Opportunity Detector | `opportunity-detect` | 12h | 5 opps |
| Metrics Interpreter | `metrics-interpret` | 2h | 5 insights |
| Roadmap Planner | `roadmap-suggest` | 24h | 3 recs |
| System Recommender | `system-recommend-strategy` | 48h | 3 recs |

### POST /strategy/synthesize-block (per-block AI)

- Input: canvas_id, block key, optional context
- Loads canvas + wizard data
- Calls Gemini with block-specific prompt
- Returns 2-4 suggestions with confidence scores

---

## Step 6: Route Mounting Strategy

### Option A — Sub-router (existing pattern)
```typescript
import { strategy } from "./strategy-routes.tsx";
app.route("/", strategy);
```

### Option B — Direct registration (safer, per v0.22.2 fix)
Import handler functions individually and register on main `app`.

**Recommendation:** Start with Option A (sub-router) for code organization. If any routes 404 after deploy, apply the direct-registration fix (same as dashboard-insights in v0.22.2).

---

## Step 7: useStrategyData Hook

**File:** `/lib/hooks/useStrategyData.ts`

### State
- `canvas`, `insights`, `opportunities`, `recommendations`, `metrics`
- `loading`, `error`, `analysisRunning`, `synthesizingBlock`, `blockSuggestions`

### Actions
- `createCanvas(fromWizard)`, `runAnalysis()`, `synthesizeBlock(block, context)`
- `updateBlock(block, items, summary)`, `approveRecommendation(id, approved, comment)`
- `dismissInsight(id)`, `updateOpportunityStatus(id, status)`, `refresh()`

### Pattern
- Uses `useAuth()` hook for `accessToken`
- Fresh-token pattern: `const token = accessToken ? 'use-fresh-token' : undefined`
- Parallel fetch on mount via `Promise.all()`

Full implementation in reference doc: `/imports/strategy-wiring-plan.md` §Step 7.

---

## Step 8: Frontend Components

### Component → Data Wiring Map

| Component | Hook State | Hook Actions |
|-----------|-----------|--------------|
| `StrategyEnginePage` | All state | All actions |
| `StrategyHeader` | `metrics.healthScore`, `analysisRunning` | `runAnalysis()` |
| `StrategyMetricsBar` | `metrics` | — |
| `LeanCanvasPanel` | `canvas`, `blockSuggestions` | — (delegates) |
| `CanvasBlock` | `canvas[blockKey]`, `blockSuggestions[blockKey]` | `synthesizeBlock()` |
| `CanvasBlockEditor` | block items, `synthesizingBlock` | `updateBlock()`, `synthesizeBlock()` |
| `IntelligencePanel` | `recommendations`, `insights`, `opportunities` | — (delegates) |
| `RecommendationCard` | single recommendation | `approveRecommendation()` |
| `InsightCard` | single insight | `dismissInsight()` |
| `OpportunityCard` | single opportunity | `updateOpportunityStatus()` |
| `PendingApprovalsSection` | filtered recommendations | — |
| `CanvasVersionHistory` | fetches via `strategyApi.getCanvasVersions()` | — |
| `StrategyAnalysisSheet` | `analysisRunning`, agent results | — |
| `RoadmapExecutionPanel` | `canvas.metadata.phases` | — |
| `StrategyEmptyState` | — | `createCanvas()` |

---

## Step 9: End-to-End Verification

| # | Test | Expected |
|---|------|----------|
| 1 | TypeScript check | `tsc --noEmit` passes |
| 2 | Build | Production build succeeds |
| 3 | Navigate `/app/strategy` | Empty state renders |
| 4 | "Create from Wizard" | Canvas populates (9 blocks) |
| 5 | Click canvas block | Editor expands with items |
| 6 | "Ask AI" on block | AI suggestions appear (2-4) |
| 7 | Accept AI suggestion | Item added, version incremented |
| 8 | "Run Analysis" | Progress sheet, 5 agents, results appear |
| 9 | Approve canvas_update rec | Canvas updates, version increments |
| 10 | Reject recommendation | Removed from pending |
| 11 | View version history | Timeline sheet |
| 12 | Sidebar | Strategy nav with pending badge |
| 13 | Mobile responsive | Tabs, bottom sheet, stacked |
| 14 | Budget enforcement | Rate limit on analysis runs |

---

## Key Patterns (Match Existing Codebase)

| Pattern | Reference | Strategy Usage |
|---------|-----------|----------------|
| Auth token | `CRMPipelinePage` — `'use-fresh-token'` | Same in useStrategyData |
| API object | `pipelineApi` in supabase.ts | `strategyApi` same shape |
| Edge route auth | `pipeline-routes.tsx` — `getUserFromToken()` | `requireAuth()` |
| Hono sub-router | `const pipeline = new Hono()` | `const strategy = new Hono()` |
| DB access | `adminClient()` from `db.tsx` | Same |
| AI calls | `callGemini()` from `gemini.tsx` | 5 agents + 1 per-block |

---

## Files Summary

| Action | File | What |
|--------|------|------|
| CREATE | `supabase/migrations/20260308120000_create_strategy_engine_tables.sql` | 12 tables + RLS |
| CREATE | `/lib/types/strategy.ts` | All types + constants |
| CREATE | `/supabase/functions/server/strategy-routes.tsx` | 14+ route handlers |
| CREATE | `/lib/hooks/useStrategyData.ts` | Data hook |
| CREATE | `/components/dashboard/strategy/StrategyEnginePage.tsx` | Main orchestrator |
| CREATE | `/components/dashboard/strategy/StrategyHeader.tsx` | Header + Run Analysis |
| CREATE | `/components/dashboard/strategy/StrategyMetricsBar.tsx` | 5 metric cards |
| CREATE | `/components/dashboard/strategy/LeanCanvasPanel.tsx` | 3x3 grid |
| CREATE | `/components/dashboard/strategy/CanvasBlock.tsx` | Individual block |
| CREATE | `/components/dashboard/strategy/CanvasBlockEditor.tsx` | Inline editor |
| CREATE | `/components/dashboard/strategy/IntelligencePanel.tsx` | Right column |
| CREATE | `/components/dashboard/strategy/InsightCard.tsx` | Insight display |
| CREATE | `/components/dashboard/strategy/OpportunityCard.tsx` | Opportunity scores |
| CREATE | `/components/dashboard/strategy/RecommendationCard.tsx` | Approval card |
| CREATE | `/components/dashboard/strategy/PendingApprovalsSection.tsx` | Filtered list |
| CREATE | `/components/dashboard/strategy/CanvasVersionHistory.tsx` | Version sheet |
| CREATE | `/components/dashboard/strategy/StrategyAnalysisSheet.tsx` | Progress overlay |
| CREATE | `/components/dashboard/strategy/RoadmapExecutionPanel.tsx` | Phase cards |
| CREATE | `/components/dashboard/strategy/StrategyEmptyState.tsx` | Empty state |
| MODIFY | `/lib/supabase.ts` | Add strategyApi (~60 lines) |
| MODIFY | `/supabase/functions/server/index.tsx` | Mount strategy routes |
| MODIFY | `/components/dashboard/DashboardSidebar.tsx` | Add nav item + badge |
| MODIFY | `/components/dashboard/DashboardHeader.tsx` | Add route label |
| MODIFY | `/routes.tsx` | Add strategy route |
