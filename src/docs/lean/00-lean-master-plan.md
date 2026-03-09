# Lean Strategy Engine — Master Implementation Plan

**Phase:** LEAN (Phase 14)
**Version Target:** v0.24.0
**Status:** Planning
**Last Updated:** 2026-03-09
**Depends On:** All 13 dashboard phases complete (v0.22.2)
**Spec Docs:** 17 files in `/docs/lean/`

---

## Progress Tracker

| # | Task | Spec Doc | Phase | Priority | Effort | Status | % |
|---|------|----------|-------|----------|--------|--------|---|
| 0 | Database migration (12 tables) — run in SQL Editor | 15, 16 | Pre-req | P0 | L | Done (external) | 100% |
| 1 | TypeScript types (`/lib/types/strategy.ts`) | 15 §2 | 14a | P0 | S | **Done** | 100% |
| 2 | Backend routes (`strategy-routes.tsx`) | 08, 15 §4-5 | 14a | P0 | XL | **Done** | 100% |
| 3 | Mount routes in `index.tsx` | 09, 15 §6 | 14a | P0 | S | **Done** | 100% |
| 4 | `strategyApi` module in `lib/supabase.ts` | 09, 15 §3 | 14a | P0 | M | **Done** | 100% |
| 5 | `useStrategyData` hook | 15 §7 | 14a | P0 | M | **Done** | 100% |
| 6 | `StrategyEnginePage` shell + routing | 01, 15 §8 | 14a | P0 | M | **Done** | 100% |
| 7 | Empty state | 02 | 14a | P0 | S | **Done** | 100% |
| 8 | Sidebar nav + header label | 14 | 14a | P0 | S | **Done** | 100% |
| 9 | Metrics bar (5 cards) | 03 | 14a | P0 | M | **Done** | 100% |
| 10 | Lean Canvas 3x3 grid | 04 | 14a | P0 | L | **Done** | 100% |
| 11 | Canvas block editor (inline expand) | 05 | 14a | P0 | L | **Done** (v1) | 80% |
| 12 | Intelligence panel container | 06 | 14b | P0 | M | **Done** | 100% |
| 13 | RecommendationCard component | 07 §1 | 14b | P0 | M | **Done** | 100% |
| 14 | InsightCard component | 07 §2 | 14b | P0 | M | **Done** | 100% |
| 15 | OpportunityCard component | 07 §3 | 14b | P0 | M | **Done** | 100% |
| 16 | Approve/reject/dismiss animations | 07 | 14b | P0 | M | **Done** | 100% |
| 17 | "Ask AI" per-block synthesis (Gemini) | 05, 08 | 14c | P1 | L | **Done** | 100% |
| 18 | "Run Analysis" full-canvas analysis flow | 08, 15 §5 | 14c | P1 | L | **Done** | 100% |
| 19 | "Create from Wizard" canvas auto-population | 02, 15 §4 | 14c | P1 | M | **Done** | 100% |
| 20 | Analysis progress sheet (5-agent overlay) | 11 | 14c | P1 | M | **Done** | 100% |
| 21 | Roadmap Execution panel (center column) | 10 | 14d | P1 | M | **Done** | 100% |
| 22 | Canvas version history sheet | 12 | 14d | P1 | S | **Done** | 100% |
| 23 | Mobile tab nav + bottom sheet editor | 13 | 14d | P1 | M | **Done** | 100% |
| 24 | Skeleton loading states for all components | All | 14d | P2 | S | **Done** | 100% |
| 25 | End-to-end verification (14 tests) | 15 §9 | 14d | P0 | M | **Done** | 100% |
| | **TOTALS** | | | | | **26 / 26** | **100%** |

### Quick Stats
- **Tasks:** 26 total (12 P0, 10 P1, 4 P2)
- **Spec Docs:** 17 (`00`–`16`)
- **New Files:** 19 CREATE + 5 MODIFY = 24 files touched
- **New Components:** 15 React components
- **New Routes:** 14+ backend routes
- **New Tables:** 12 (6 core + 6 advanced)
- **Estimated Effort:** ~10 days

---

## Spec Document Index

| Doc | Title | Phase | Covers |
|-----|-------|-------|--------|
| `00` | Master Plan (this file) | — | Overview, architecture, tracker |
| `01` | [Strategy Page Layout](01-strategy-page-layout.md) | 14a | 3-col desktop, tablet, mobile layout, component tree, states |
| `02` | [Empty State](02-strategy-empty-state.md) | 14a | No-canvas CTA, wizard detection, feature list |
| `03` | [Metrics Bar](03-metrics-bar.md) | 14a | 5 metric cards, trend indicators, responsive grid |
| `04` | [Lean Canvas Grid](04-lean-canvas-grid.md) | 14a | 9-block 3x3, collapsed state, AI badge, mobile accordion |
| `05` | [Canvas Block Editor](05-canvas-block-editor.md) | 14a | Inline editor, AI suggestions, accept/dismiss, add/edit/delete |
| `06` | [Intelligence Panel](06-intelligence-panel.md) | 14b | 3-section right column, empty states, scroll |
| `07` | [Card Components](07-recommendation-cards.md) | 14b | RecommendationCard, InsightCard, OpportunityCard, animations |
| `08` | [Backend Routes](08-backend-routes.md) | 14a | 14 routes, auth, Gemini prompts, KV schema |
| `09` | [API Layer & Wiring](09-api-layer-and-wiring.md) | 14a | strategyApi, routing, sidebar, types, server mount |
| `10` | [Roadmap Execution Panel](10-roadmap-execution-panel.md) | 14d | Phase cards, progress bars, wizard data, empty state |
| `11` | [Analysis Progress Sheet](11-analysis-progress-sheet.md) | 14c | 5-agent overlay, phase A/B execution, simulated progress |
| `12` | [Canvas Version History](12-canvas-version-history.md) | 14d | Side sheet, version timeline, view snapshot, revert |
| `13` | [Responsive Layout](13-responsive-layout.md) | 14d | Mobile tabs, tablet 2-col, bottom sheet, breakpoints |
| `14` | [Sidebar Navigation](14-sidebar-navigation.md) | 14a | Nav item, Brain icon, pending badge, header label |
| `15` | [Frontend ↔ Backend Wiring](15-frontend-backend-wiring.md) | All | 9-step build order, 12 tables, types, API, routes, hook, components |
| `16` | [Supabase Database Plan](16-supabase-database-plan.md) | Pre-req | ERD, data flows, 12 tables, RLS, indexes, triggers, migration SQL, rollback, verification |

---

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────────┐
│  Frontend (React + Tailwind + Motion)                           │
│                                                                 │
│  StrategyEnginePage (/app/strategy)                             │
│  ├── StrategyHeader (title, Run Analysis btn, last-run stamp)   │
│  ├── StrategyMetricsBar (5 metric cards)                        │
│  └── 3-column grid (desktop) / tabs (mobile)                   │
│      ├── LeanCanvasPanel (3x3 grid + block editor)              │
│      ├── RoadmapExecutionPanel (phase cards + progress)         │
│      └── IntelligencePanel                                      │
│          ├── PendingApprovals (RecommendationCards)              │
│          ├── InsightsFeed (InsightCards)                         │
│          └── OpportunitiesList (OpportunityCards)                │
├─────────────────────────────────────────────────────────────────┤
│  API Layer (lib/supabase.ts → strategyApi)                      │
│                                                                 │
│  strategyApi.getCanvas()        strategyApi.getMetrics()        │
│  strategyApi.updateBlock()      strategyApi.synthesizeBlock()   │
│  strategyApi.createCanvas()     strategyApi.runAnalysis()       │
│  strategyApi.listRecommendations()  strategyApi.approveRec()    │
│  strategyApi.listInsights()     strategyApi.listOpportunities() │
│  strategyApi.getCanvasHistory() strategyApi.evaluateOpp()       │
├─────────────────────────────────────────────────────────────────┤
│  Backend (Hono edge function — strategy-routes.tsx)             │
│                                                                 │
│  GET  /strategy/canvas/:id      POST /strategy/canvas           │
│  PUT  /strategy/canvas/:id/block/:key                           │
│  GET  /strategy/metrics         POST /strategy/run-analysis     │
│  GET  /strategy/recommendations POST /strategy/recommendations/:id/approve │
│  POST /strategy/recommendations/:id/reject                      │
│  GET  /strategy/insights        POST /strategy/insights/:id/dismiss │
│  GET  /strategy/opportunities   POST /strategy/opportunities/:id/evaluate │
│  GET  /strategy/canvas/:id/history                              │
│  POST /strategy/canvas/from-wizard                              │
│  POST /strategy/synthesize-block                                │
├─────────────────────────────────────────────────────────────────┤
│  Data Layer (KV Store)                                          │
│                                                                 │
│  canvas:{id}           → LeanCanvas (full 9-block document)     │
│  canvas-version:{id}:v{n} → Snapshot for version history        │
│  strategy-rec:{id}     → Recommendation (pending/approved/rejected) │
│  strategy-insight:{id} → Insight (from AI analysis)             │
│  strategy-opp:{id}     → Opportunity (detected automation)      │
│  strategy-metrics:{userId} → Cached StrategyMetrics             │
│  strategy-analysis:{id} → Analysis run log                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 14a — Core Canvas & Infrastructure (P0, ~4 days)

| # | Task | Spec | Effort | Depends On |
|---|------|------|--------|------------|
| 0 | Database migration (12 tables) — run in SQL Editor | 15 | L | — |
| 1 | TypeScript types (`/lib/types/strategy.ts`) | 15 §2 | S | — |
| 2 | Backend routes (`strategy-routes.tsx`) | 08, 15 §4-5 | XL | 0, 1 |
| 3 | Mount routes in `index.tsx` | 09, 15 §6 | S | 2 |
| 4 | `strategyApi` module in `lib/supabase.ts` | 09, 15 §3 | M | 2 |
| 5 | `useStrategyData` hook | 15 §7 | M | 4 |
| 6 | `StrategyEnginePage` shell + routing | 01, 15 §8 | M | 5 |
| 7 | Empty state | 02 | S | 6 |
| 8 | Sidebar nav + header label | 14 | S | 6 |
| 9 | Metrics bar (5 cards) | 03 | M | 6 |
| 10 | Lean Canvas 3x3 grid | 04 | L | 6 |
| 11 | Canvas block editor (inline expand) | 05 | L | 10 |

### Phase 14b — Intelligence Layer (P0, ~2 days)

| # | Task | Spec | Effort | Depends On |
|---|------|------|--------|------------|
| 12 | Intelligence panel container | 06 | M | 5 |
| 13 | RecommendationCard component | 07 §1 | M | 12 |
| 14 | InsightCard component | 07 §2 | M | 12 |
| 15 | OpportunityCard component | 07 §3 | M | 12 |
| 16 | Approve/reject/dismiss actions with animations | 07 | M | 13, 14, 15 |

### Phase 14c — AI Integration (P1, ~2 days)

| # | Task | Spec | Effort | Depends On |
|---|------|------|--------|------------|
| 17 | "Ask AI" per-block synthesis (Gemini) | 05, 08 | L | 11 |
| 18 | "Run Analysis" full-canvas analysis flow | 08, 15 §5 | L | 9, 10, 12 |
| 19 | "Create from Wizard" canvas auto-population | 02, 15 §4 | M | 7 |
| 20 | Analysis progress overlay/sheet | 11 | M | 18 |

### Phase 14d — Enhancements & Polish (P2, ~2 days)

| # | Task | Spec | Effort | Depends On |
|---|------|------|--------|------------|
| 21 | Roadmap Execution panel (center column) | 10 | M | 6 |
| 22 | Canvas version history panel | 12 | S | 10 |
| 23 | Mobile tab navigation + bottom sheet editor | 13 | M | 10, 11 |
| 24 | Skeleton loading states for all components | All | S | All |
| 25 | End-to-end verification (14 tests) | 15 §9 | M | All |

---

## Route Registration Strategy

**IMPORTANT:** Based on the Hono sub-router 404 fix documented in v0.22.2, strategy routes should start with sub-router mounting (`app.route("/", strategy)`) for code organization. If any routes 404 after deploy, apply the direct-registration fix (same pattern as dashboard-insights).

**Preferred approach** (per wiring plan Task 15): Use sub-router first, fall back to direct registration if needed.

```typescript
// Option A — Sub-router (try first)
import { strategy } from "./strategy-routes.tsx";
app.route("/", strategy);

// Option B — Direct registration (fallback if 404s)
import { strategyHandlers } from "./strategy-routes.tsx";
app.get(`${PREFIX}/strategy/canvas`, strategyHandlers.getCanvas);
app.post(`${PREFIX}/strategy/canvas`, strategyHandlers.createCanvas);
// ... etc
```

---

## Data Layer

### Primary: Supabase Tables (12)

The wiring plan (Task 15) specifies 12 dedicated Supabase tables instead of KV store for structured data:

| Table | Purpose |
|-------|---------|
| `lean_canvases` | Main canvas (9 JSONB block columns + metadata) |
| `lean_canvas_versions` | Version snapshots with change summary |
| `strategy_insights` | AI-generated insights |
| `automation_opportunities` | Detected automation candidates |
| `strategy_recommendations` | AI recs requiring human approval |
| `strategy_actions` | Audit log of agent actions |
| `strategy_events` | Event bus (Phase 1 = log only) |
| `strategy_event_triggers` | Agent triggers (disabled in Phase 1) |
| `strategy_agent_memory` | Per-agent context memory |
| `strategy_signals` | Business signal tracking |
| `strategy_roles` | User roles per canvas |
| `strategy_budgets` | Token budget + rate limiting |

All tables require RLS enabled with authenticated CRUD policies.

**NOTE:** User must run the migration SQL manually in the Supabase SQL Editor (project constraint — no auto-migrations).

---

## TypeScript Types (`/lib/types/strategy.ts`)

Updated types from the wiring plan (Task 15) — database-aligned with snake_case columns:

```typescript
// ── Canvas Block Item ──
export interface CanvasBlockItem {
  id: string;
  text: string;
  source: 'manual' | 'ai';
  confidence?: number;       // 0-1
  updatedAt: string;
}

export type CanvasBlockKey =
  | 'problem' | 'customer_segments' | 'value_proposition' | 'solution'
  | 'channels' | 'revenue_streams' | 'cost_structure' | 'key_metrics'
  | 'unfair_advantage';

// ── Lean Canvas ──
export interface LeanCanvas {
  id: string;
  session_id: string | null;
  project_id: string | null;
  user_id: string | null;
  version: number;
  is_current: boolean;
  problem: CanvasBlockItem[];
  customer_segments: CanvasBlockItem[];
  value_proposition: CanvasBlockItem[];
  solution: CanvasBlockItem[];
  channels: CanvasBlockItem[];
  revenue_streams: CanvasBlockItem[];
  cost_structure: CanvasBlockItem[];
  key_metrics: CanvasBlockItem[];
  unfair_advantage: CanvasBlockItem[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ── Metrics (with 8-dimension health breakdown) ──
export interface StrategyMetrics {
  healthScore: number;
  healthBreakdown: {
    strategyClarity: number;
    aiReadiness: number;
    pipelineHealth: number;
    automationProgress: number;
    revenueTrajectory: number;
    operationalEfficiency: number;
    engagementQuality: number;
    strategyFreshness: number;
  };
  automationCoverage: number;
  insightCount: number;
  pendingApprovals: number;
  opportunitiesDetected: number;
  totalROIEstimate: string;
  canvasCompleteness: number;
  tokenBudgetUsed: number;
  tokenBudgetRemaining: number;
}

// ── Intelligence (database-aligned) ──
export interface StrategyRecommendation { ... }  // See Task 15 §2
export interface StrategyInsight { ... }          // See Task 15 §2
export interface AutomationOpportunity { ... }    // See Task 15 §2
export interface StrategyAction { ... }           // See Task 15 §2

// ── API Responses ──
export interface StrategyAnalysisResponse { ... } // See Task 15 §2
export interface BlockSynthesisResponse { ... }   // See Task 15 §2
export interface StrategyDashboardData { ... }    // See Task 15 §2
```

Full type definitions: see `/docs/lean/15-frontend-backend-wiring.md` §Step 2.

---

## Backend Routes (14+ total)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/strategy/canvas` | Required | Create new canvas (blank or from wizard) |
| `GET` | `/strategy/canvas/:id` | Required | Get full canvas with all blocks |
| `PUT` | `/strategy/canvas/:id/block/:key` | Required | Update a single block (add/edit/delete items) |
| `GET` | `/strategy/canvas/:id/history` | Required | Get version history list |
| `POST` | `/strategy/canvas/from-wizard` | Required | Auto-populate canvas from wizard session data |
| `GET` | `/strategy/metrics` | Required | Get strategy metrics (health, completeness, etc.) |
| `POST` | `/strategy/run-analysis` | Required | Trigger full AI analysis (Gemini) |
| `POST` | `/strategy/synthesize-block` | Required | Ask AI for suggestions on a specific block |
| `GET` | `/strategy/recommendations` | Required | List pending recommendations |
| `POST` | `/strategy/recommendations/:id/approve` | Required | Approve a recommendation |
| `POST` | `/strategy/recommendations/:id/reject` | Required | Reject a recommendation |
| `GET` | `/strategy/insights` | Required | List insights |
| `GET` | `/strategy/opportunities` | Required | List detected opportunities |
| `POST` | `/strategy/opportunities/:id/evaluate` | Required | Start evaluating an opportunity |

---

## Frontend Components (15 new)

| Component | File | Spec Doc |
|-----------|------|----------|
| `StrategyEnginePage` | `strategy/StrategyEnginePage.tsx` | 01, 15 |
| `StrategyHeader` | `strategy/StrategyHeader.tsx` | 01 |
| `StrategyMetricsBar` | `strategy/StrategyMetricsBar.tsx` | 03 |
| `MetricCard` | `strategy/MetricCard.tsx` | 03 |
| `LeanCanvasPanel` | `strategy/LeanCanvasPanel.tsx` | 04 |
| `CanvasBlock` | `strategy/CanvasBlock.tsx` | 04 |
| `CanvasBlockEditor` | `strategy/CanvasBlockEditor.tsx` | 05 |
| `IntelligencePanel` | `strategy/IntelligencePanel.tsx` | 06 |
| `PendingApprovalsSection` | `strategy/PendingApprovalsSection.tsx` | 06 |
| `RecommendationCard` | `strategy/RecommendationCard.tsx` | 07 |
| `InsightCard` | `strategy/InsightCard.tsx` | 07 |
| `OpportunityCard` | `strategy/OpportunityCard.tsx` | 07 |
| `StrategyEmptyState` | `strategy/StrategyEmptyState.tsx` | 02 |
| `RoadmapExecutionPanel` | `strategy/RoadmapExecutionPanel.tsx` | 10 |
| `StrategyAnalysisSheet` | `strategy/StrategyAnalysisSheet.tsx` | 11 |
| `CanvasVersionHistory` | `strategy/CanvasVersionHistory.tsx` | 12 |

All files under `/components/dashboard/strategy/`.

---

## Routing Changes

```typescript
// routes.tsx — add inside /app children:
{ path: 'strategy', Component: StrategyEnginePage },
```

---

## Sidebar Navigation

Add to `DashboardSidebar.tsx` navigation items:
- Icon: `Brain` (from lucide-react)
- Label: "Strategy Engine"
- Route: `/app/strategy`
- Position: after "AI Insights" and before "Documents"

---

## Design System Compliance

All components follow the existing BCG consulting-inspired design system:

| Token | Value | Usage |
|-------|-------|-------|
| `bg-page` | `#F5F5F0` | Page background |
| `bg-card` | `#FFFFFF` | Card backgrounds |
| `border` | `#E8E8E4` | Card borders |
| `text-heading` | `#1A1A1A` | Headings (Georgia serif) |
| `text-body` | `#4A4A4A` | Body text |
| `text-muted` | `#9CA39B` | Timestamps, secondary |
| `accent-green` | `#00875A` | Primary buttons, positive |
| `accent-red` | `#DC2626` | High priority, alerts |
| `accent-amber` | `#D97706` | Medium priority, warnings |
| `accent-blue` | `#3B82F6` | New items, AI suggestions |
| `accent-purple` | `#7C3AED` | In-progress status |
| `radius` | `8px` | Card border-radius |

---

## Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| Desktop (>=1280px) | 3-column grid: Canvas 45% / Roadmap 25% / Intelligence 30% |
| Tablet (768-1279px) | 2-column: Canvas 60% + Intelligence 40%; Roadmap below Canvas |
| Mobile (<768px) | Full-width tabs: [Canvas] [Roadmap] [Intelligence] |

---

## Auth Pattern

All strategy routes use the same `getUserFromToken()` + `useAuth()` + `'use-fresh-token'` pattern established in v0.22.1 for CRM routes. Strategy data is user-scoped — each user has their own canvas, recommendations, insights, and opportunities.

---

## AI Integration (Gemini)

### 5 AI Agents (from Task 15 §5)

| # | Agent | Gemini Name | Phase | Cache TTL | Max Output |
|---|-------|-------------|-------|-----------|------------|
| 1 | Strategy Synthesizer | `strategy-synthesize` | A (parallel) | 4h | 3 recs |
| 2 | Opportunity Detector | `opportunity-detect` | A (parallel) | 12h | 5 opps |
| 3 | Metrics Interpreter | `metrics-interpret` | A (parallel) | 2h | 5 insights |
| 4 | Roadmap Planner | `roadmap-suggest` | B (after A) | 24h | 3 recs |
| 5 | System Recommender | `system-recommend-strategy` | B (after A) | 48h | 3 recs |

### Analysis Orchestration Flow

```
POST /strategy/analyze
  1. Budget check (429 if over limit)
  2. Load context: canvas + wizard + CRM + deals + agent memory
  3. Phase A: Promise.all([synthesizer, detector, interpreter])
  4. Phase B: Promise.all([roadmap, system]) — depends on A
  5. Phase C: Conflict resolution + ranking
  6. Persist: recommendations, insights, opportunities, actions
  7. Save agent memories + update budget counters
  8. Return aggregated results
```

### Per-Block Synthesis

```
POST /strategy/synthesize-block
  1. Load canvas + wizard answers
  2. Build block-specific prompt with adjacent block context
  3. Call Gemini → 2-4 suggestions with confidence scores
  4. Return suggestions + rationale
```

---

## Estimated Total Effort

| Phase | Tasks | Effort |
|-------|-------|--------|
| 14a — Core Canvas & Infrastructure | 12 tasks | ~4 days |
| 14b — Intelligence Layer | 5 tasks | ~2 days |
| 14c — AI Integration | 4 tasks | ~2 days |
| 14d — Enhancements & Polish | 5 tasks | ~2 days |
| **Total** | **26 tasks** | **~10 days** |

---

## Production Status (Post-Implementation)

- Dashboard components: 58 production (43 existing + 15 new strategy)
- Edge function routes: 63+ (49 existing + 14+ new strategy)
- Supabase tables: 12 new strategy-specific tables
- New hook: `useStrategyData` (data + actions)
- AI agents: 5 (Strategy Synthesizer, Opportunity Detector, Metrics Interpreter, Roadmap Planner, System Recommender)

---

## Risk Factors

| Risk | Mitigation |
|------|------------|
| Hono sub-router 404s | Start with sub-router; fall back to direct registration if needed (proven fix from v0.22.2) |
| Gemini rate limits on "Run Analysis" | Token budgets table + rate limiting + cache TTLs per agent |
| Database migration failures | Full SQL provided for manual execution; RLS + indexes included |
| Large canvas + history growth | Version snapshots in separate table; query with LIMIT |
| Mobile UX complexity | Tab navigation; bottom sheet editor; responsive breakpoints |
| AI suggestion quality | Confidence scores; human approval required; agent memory for context |
| 5 concurrent Gemini calls | Phase A/B execution (3+2); conflict resolution before persisting |

---

## Suggested Next Steps

### Immediate (start implementation)

1. **Run the database migration** — Copy the SQL from Task 15 §Step 1 into Supabase SQL Editor and execute. This creates all 12 tables with RLS, indexes, and constraints. Must be done before any backend route works.

2. **Create `/lib/types/strategy.ts`** (Task 1) — Copy the comprehensive type definitions from Task 15 §Step 2. This unblocks all other tasks since every component and route depends on shared types.

3. **Create `strategy-routes.tsx`** (Task 2) — Start with the CRUD routes (canvas GET/POST/PUT, versions, insights, opportunities, recommendations). AI routes (analyze, synthesize-block) can come later in Phase 14c.

4. **Create `strategyApi` + `useStrategyData`** (Tasks 4-5) — Follow the wiring plan in Task 15 §Steps 3 and 7. These two files wire frontend to backend and are needed before any UI component.

### Then (build UI layer)

5. **Build the page shell** (Task 6) + **sidebar nav** (Task 8) — Gets `/app/strategy` navigable in the dashboard with empty state fallback.

6. **Build canvas grid + block editor** (Tasks 10-11) — The core interactive feature. Reference Task 04 and 05 specs.

7. **Build intelligence panel + cards** (Tasks 12-16) — The right column. All card variants from Task 07 spec.

### Finally (AI + polish)

8. **Wire AI endpoints** (Tasks 17-20) — Gemini integration for block synthesis and full analysis with progress sheet.

9. **Add enhancements** (Tasks 21-25) — Roadmap panel, version history, responsive polish, skeletons, E2E tests.

### Version Milestones

| Version | Milestone | Tasks |
|---------|-----------|-------|
| v0.23.0 | Core canvas with CRUD (no AI) | 0-11 |
| v0.23.1 | Intelligence panel + cards | 12-16 |
| v0.24.0 | Full AI integration + polish | 17-25 |