# Task 08 — Strategy Engine Backend Routes

**ID:** lean-08-backend-routes
**Phase:** LEAN (Phase 14a)
**Priority:** P0
**Effort:** L
**Status:** Not Started
**Dependencies:** None (types defined in 00-lean-master-plan.md)
**Target File:** `/supabase/functions/server/strategy-routes.tsx`

---

## Objective

Create 14 backend routes for the Strategy Engine covering canvas CRUD, block editing, AI synthesis, analysis runs, recommendations, insights, and opportunities. All data stored in KV store (same pattern as documents, workflows, financial).

---

## Route Registration

**CRITICAL:** Register all routes directly on the main `app` in `index.tsx` — do NOT use `app.route("/", strategy)` sub-router mounting (Hono 404 bug, see v0.22.2).

### Pattern

```typescript
// strategy-routes.tsx — export handler functions
export const strategyHandlers = {
  getCanvas: async (c: Context) => { ... },
  createCanvas: async (c: Context) => { ... },
  // ...
};

// index.tsx — direct registration
import { strategyHandlers } from "./strategy-routes.tsx";

app.get(`${PREFIX}/strategy/canvas/:id`, strategyHandlers.getCanvas);
app.post(`${PREFIX}/strategy/canvas`, strategyHandlers.createCanvas);
// ... etc
```

---

## Routes (14 total)

### Canvas CRUD (5 routes)

#### `POST /strategy/canvas`
- Auth: Required
- Body: `{ source?: 'blank' | 'wizard', wizardSessionId?: string }`
- Creates blank canvas with 9 empty blocks (or populated from wizard data)
- Stores: `canvas:{uuid}`, `canvas-user:{userId}`
- Returns: `{ success: true, canvas: LeanCanvas }`

#### `GET /strategy/canvas/:id`
- Auth: Required
- Returns full canvas with all 9 blocks and items
- Returns: `{ success: true, canvas: LeanCanvas }`

#### `PUT /strategy/canvas/:id/block/:key`
- Auth: Required
- Body: `{ action: 'add' | 'edit' | 'delete' | 'accept_ai', itemId?: string, text?: string, item?: CanvasBlockItem }`
- Updates a single block's items
- Increments canvas version, saves snapshot to `canvas-ver:{id}:v{n}`
- Returns: `{ success: true, block: CanvasBlock, version: number }`

#### `POST /strategy/canvas/from-wizard`
- Auth: Required
- Body: `{ wizardSessionId: string }`
- Reads wizard session data, calls Gemini to generate initial canvas items for all 9 blocks
- Returns: `{ success: true, canvas: LeanCanvas }`

#### `GET /strategy/canvas/:id/history`
- Auth: Required
- Returns list of version snapshots (version number, timestamp, blocks changed)
- Returns: `{ success: true, versions: Array<{ version: number, updatedAt: string, blocksChanged: string[] }> }`

---

### Metrics (1 route)

#### `GET /strategy/metrics`
- Auth: Required
- Computes from canvas + recommendations + insights + opportunities:
  - `healthScore`: weighted average of completeness + recent activity + pending ratio
  - `canvasCompleteness`: (blocks with >=1 item) / 9 * 100
  - `opportunitiesDetected`: count of non-dismissed opportunities
  - `pendingApprovals`: count of recommendations with status 'pending'
  - `totalROIEstimate`: sum of opportunity ROI estimates
- Returns: `{ success: true, metrics: StrategyMetrics }`

---

### AI (2 routes)

#### `POST /strategy/synthesize-block`
- Auth: Required
- Body: `{ canvasId: string, blockKey: CanvasBlockKey, context?: object }`
- Calls Gemini with current block items + context from adjacent blocks
- System prompt instructs Gemini to suggest 1-4 new items with confidence scores
- Returns: `{ success: true, suggestions: CanvasBlockItem[] }`

#### `POST /strategy/run-analysis`
- Auth: Required
- Body: `{ canvasId: string }`
- Sends full canvas + available CRM/financial/wizard data to Gemini
- Gemini returns recommendations, insights, and opportunities
- Stores each as individual KV entries, adds IDs to user lists
- Returns: `{ success: true, analysis: AnalysisRun }`

---

### Recommendations (3 routes)

#### `GET /strategy/recommendations`
- Auth: Required
- Query: `?status=pending` (optional filter)
- Returns: `{ success: true, recommendations: Recommendation[] }`

#### `POST /strategy/recommendations/:id/approve`
- Auth: Required
- Updates recommendation status to 'approved'
- If type is `canvas_update`: applies the proposed change to the canvas block
- Returns: `{ success: true, recommendation: Recommendation }`

#### `POST /strategy/recommendations/:id/reject`
- Auth: Required
- Updates recommendation status to 'rejected'
- Returns: `{ success: true, recommendation: Recommendation }`

---

### Insights (1 route)

#### `GET /strategy/insights`
- Auth: Required
- Returns non-dismissed insights sorted by priority (high first)
- Returns: `{ success: true, insights: Insight[] }`

(Dismiss is handled via `POST /strategy/insights/:id/dismiss` — updates `dismissed: true`)

---

### Opportunities (2 routes)

#### `GET /strategy/opportunities`
- Auth: Required
- Returns all non-dismissed opportunities
- Returns: `{ success: true, opportunities: Opportunity[] }`

#### `POST /strategy/opportunities/:id/evaluate`
- Auth: Required
- Updates status from `detected` to `evaluating`
- Returns: `{ success: true, opportunity: Opportunity }`

---

## Auth Pattern

All routes use `getUserFromToken(c)` from `auth.tsx` — same pattern as CRM routes (v0.22.1). Returns 401 if no valid user token.

```typescript
const user = await getUserFromToken(c);
if (!user) {
  return c.json({ error: 'Authorization required for strategy operations' }, 401);
}
```

---

## Error Handling

All routes follow the project pattern:
- Try/catch around all logic
- `console.log()` with `[Strategy]` prefix for all errors
- Return detailed error messages: `{ error: "Context-specific error message: ${error}" }`
- HTTP status codes: 400 (bad input), 401 (unauthorized), 404 (not found), 500 (server error)

---

## Gemini Prompts

### Synthesize Block Prompt

```
System: You are a strategy consultant analyzing a Lean Canvas. Given the current items
in the "{blockKey}" block and context from related blocks, suggest 1-4 new items that
would strengthen this section. Each item should be specific, actionable, and data-driven.

Return JSON: { "suggestions": [{ "text": "...", "confidence": 0.0-1.0, "rationale": "..." }] }
```

### Run Analysis Prompt

```
System: You are a senior AI strategy consultant. Analyze the complete Lean Canvas and
business data to generate:
1. Recommendations (canvas updates, new systems, roadmap changes) requiring human approval
2. Insights (trends, risks, opportunities observed in the data)
3. Automation opportunities (with impact score, ROI estimate, complexity, timeline)

Return JSON: {
  "recommendations": [...],
  "insights": [...],
  "opportunities": [...],
  "healthScore": 0-100,
  "summary": "..."
}
```
