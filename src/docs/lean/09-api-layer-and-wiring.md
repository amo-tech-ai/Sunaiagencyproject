# Task 09 — API Layer, Routing & Sidebar Wiring

**ID:** lean-09-api-wiring
**Phase:** LEAN (Phase 14a)
**Priority:** P0
**Effort:** M
**Status:** Not Started
**Dependencies:** lean-08-backend-routes
**Target Files:** `/lib/supabase.ts`, `/routes.tsx`, `/components/dashboard/DashboardSidebar.tsx`

---

## Objective

Wire the Strategy Engine into the existing frontend infrastructure: add `strategyApi` module to the Supabase API layer, register the route in React Router, and add the sidebar navigation item.

---

## 1. strategyApi Module (`lib/supabase.ts`)

Add to the existing `lib/supabase.ts` file, following the same pattern as `workflowApi`, `financialApi`, `documentApi`:

```typescript
export const strategyApi = {
  // Canvas
  getCanvas: async (token?: string) => { ... },
  createCanvas: async (source: 'blank' | 'wizard', wizardSessionId?: string, token?: string) => { ... },
  createCanvasFromWizard: async (wizardSessionId: string, token?: string) => { ... },
  updateBlock: async (canvasId: string, blockKey: string, action: string, data: object, token?: string) => { ... },
  getCanvasHistory: async (canvasId: string, token?: string) => { ... },

  // Metrics
  getMetrics: async (token?: string) => { ... },

  // AI
  synthesizeBlock: async (canvasId: string, blockKey: string, context: object, token?: string) => { ... },
  runAnalysis: async (canvasId: string, token?: string) => { ... },

  // Recommendations
  listRecommendations: async (status?: string, token?: string) => { ... },
  approveRecommendation: async (id: string, token?: string) => { ... },
  rejectRecommendation: async (id: string, token?: string) => { ... },

  // Insights
  listInsights: async (token?: string) => { ... },
  dismissInsight: async (id: string, token?: string) => { ... },

  // Opportunities
  listOpportunities: async (token?: string) => { ... },
  evaluateOpportunity: async (id: string, token?: string) => { ... },
};
```

### Token pattern
All methods use the `'use-fresh-token'` pattern:
```typescript
async function getAuthHeaders(token?: string) {
  const t = token === 'use-fresh-token' ? await getFreshAccessToken() : token;
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${t || publicAnonKey}`,
  };
}
```

### Base URL
All strategy routes: `${BASE_URL}/strategy/...`

---

## 2. Route Registration (`routes.tsx`)

```typescript
// Add import at top with other dashboard imports
import StrategyEnginePage from './components/dashboard/strategy/StrategyEnginePage';

// Add inside /app children, after insights and before documents:
{ path: 'strategy', Component: StrategyEnginePage },
```

Position in route list:
```
{ path: 'insights', Component: InsightsPage },
// Phase 14: Strategy Engine — production page
{ path: 'strategy', Component: StrategyEnginePage },
// Phase 8: Document Management — production page
{ path: 'documents', Component: DocumentManagementPage },
```

---

## 3. Sidebar Navigation (`DashboardSidebar.tsx`)

Add new nav item:

```typescript
{
  icon: Brain,  // from lucide-react
  label: 'Strategy Engine',
  path: '/app/strategy',
}
```

Position: after "AI Insights" (`/app/insights`) and before "Documents" (`/app/documents`).

Also bump sidebar version display to target version (e.g., `v0.24.0`).

---

## 4. Type Exports

Create `/lib/types/strategy.ts` with all TypeScript interfaces defined in `00-lean-master-plan.md`:

- `LeanCanvas`, `CanvasBlock`, `CanvasBlockItem`, `CanvasBlockKey`
- `StrategyMetrics`
- `Recommendation`, `Insight`, `Opportunity`
- `AnalysisRun`

Export constants:
- `CANVAS_BLOCK_ORDER`: Array of 9 `CanvasBlockKey` values in grid display order
- `CANVAS_BLOCK_CONFIG`: Record mapping each key to `{ label, placeholder, row, col }`
- `RECOMMENDATION_TYPE_CONFIG`: Record mapping type to `{ icon, label, color }`
- `INSIGHT_TYPE_CONFIG`: Record mapping type to `{ label, color }`
- `OPPORTUNITY_STATUS_CONFIG`: Record mapping status to `{ label, color }`

---

## 5. Server Mount (`index.tsx`)

Import strategy handlers and register directly on main app:

```typescript
import { strategyHandlers } from "./strategy-routes.tsx";

// ── Strategy Engine routes (direct registration — avoids sub-router 404s) ──
app.post(`${PREFIX}/strategy/canvas`, strategyHandlers.createCanvas);
app.get(`${PREFIX}/strategy/canvas/:id`, strategyHandlers.getCanvas);
app.put(`${PREFIX}/strategy/canvas/:id/block/:key`, strategyHandlers.updateBlock);
app.post(`${PREFIX}/strategy/canvas/from-wizard`, strategyHandlers.createCanvasFromWizard);
app.get(`${PREFIX}/strategy/canvas/:id/history`, strategyHandlers.getCanvasHistory);
app.get(`${PREFIX}/strategy/metrics`, strategyHandlers.getMetrics);
app.post(`${PREFIX}/strategy/synthesize-block`, strategyHandlers.synthesizeBlock);
app.post(`${PREFIX}/strategy/run-analysis`, strategyHandlers.runAnalysis);
app.get(`${PREFIX}/strategy/recommendations`, strategyHandlers.listRecommendations);
app.post(`${PREFIX}/strategy/recommendations/:id/approve`, strategyHandlers.approveRecommendation);
app.post(`${PREFIX}/strategy/recommendations/:id/reject`, strategyHandlers.rejectRecommendation);
app.get(`${PREFIX}/strategy/insights`, strategyHandlers.listInsights);
app.get(`${PREFIX}/strategy/opportunities`, strategyHandlers.listOpportunities);
app.post(`${PREFIX}/strategy/opportunities/:id/evaluate`, strategyHandlers.evaluateOpportunity);
```

---

## Files Modified (Summary)

```
/lib/types/strategy.ts — NEW: TypeScript types + constants
/lib/supabase.ts — ADD: strategyApi module (16 methods)
/routes.tsx — ADD: strategy route in /app children
/components/dashboard/DashboardSidebar.tsx — ADD: Strategy Engine nav item + version bump
/supabase/functions/server/index.tsx — ADD: 14 direct route registrations
/supabase/functions/server/strategy-routes.tsx — NEW: handler functions
```

---

## Post-Implementation Route Count

Edge function routes: **63** (49 existing + 14 new strategy)
