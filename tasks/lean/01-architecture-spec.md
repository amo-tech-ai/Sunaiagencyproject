# Autonomous Strategy Engine — Full Architecture Spec

> **Version:** 1.0 | **Date:** 2026-03-08
> **Route:** `/app/strategy` | **Sidebar:** Brain icon after AI Insights
> **Phase 1 Scope:** Assistant mode — AI suggests, human approves

---

## 1. System Overview

The Autonomous Strategy Engine turns the dashboard from a passive display into an active strategic operating system. It watches wizard data, CRM activity, project tasks, AI usage signals, and metrics — then generates Lean Canvas updates, roadmap suggestions, automation opportunities, and new AI system recommendations.

### Engine Loop

```
Business data changes
  → AI agents analyze signals
    → Strategy updates generated (draft)
      → Human reviews & approves
        → Canvas/roadmap/tasks updated
          → New insights appear
            → Business improves
```

### Four Operating Layers

| Layer | Purpose | Tables |
|-------|---------|--------|
| **Data Monitoring** | Collect signals from wizard, CRM, projects, AI logs | (reads existing tables) |
| **Strategy Interpretation** | AI agents reason over signals | strategy_actions |
| **Decision** | Generate governed recommendations | strategy_insights, automation_opportunities, strategy_recommendations |
| **Execution** | Apply approved changes | lean_canvases, lean_canvas_versions |

---

## 2. Database Schema

### 6 New Tables

Migration file: `src/supabase/migrations/20260308120000_create_strategy_engine_tables.sql`

#### 2.1 lean_canvases

Stores the current strategic canvas per project/session.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | gen_random_uuid() |
| session_id | text null | FK to wizard_sessions.id |
| project_id | uuid null | FK to projects.id |
| user_id | uuid null | Creator |
| version | integer default 1 | Auto-incremented on updates |
| is_current | boolean default true | Latest version flag |
| problem | jsonb default '[]' | Array of CanvasBlockItem |
| customer_segments | jsonb default '[]' | Array of CanvasBlockItem |
| value_proposition | jsonb default '[]' | Array of CanvasBlockItem |
| solution | jsonb default '[]' | Array of CanvasBlockItem |
| channels | jsonb default '[]' | Array of CanvasBlockItem |
| revenue_streams | jsonb default '[]' | Array of CanvasBlockItem |
| cost_structure | jsonb default '[]' | Array of CanvasBlockItem |
| key_metrics | jsonb default '[]' | Array of CanvasBlockItem |
| unfair_advantage | jsonb default '[]' | Array of CanvasBlockItem |
| metadata | jsonb default '{}' | Industry, scores, etc. |
| created_at | timestamptz | now() |
| updated_at | timestamptz | now() |

**CanvasBlockItem shape:**
```json
{ "id": "uuid", "text": "...", "source": "manual|ai", "confidence": 0.85, "updatedAt": "ISO" }
```

**Indexes:** session_id, project_id, is_current WHERE true

#### 2.2 lean_canvas_versions

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | gen_random_uuid() |
| canvas_id | uuid FK | → lean_canvases(id) CASCADE |
| version | integer | Version number |
| snapshot | jsonb | Full canvas snapshot |
| change_summary | text | What changed |
| changed_by | text | 'user' or 'ai-strategy-synthesizer' |
| created_at | timestamptz | now() |

**Unique:** (canvas_id, version)

#### 2.3 strategy_insights

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | gen_random_uuid() |
| canvas_id | uuid null FK | → lean_canvases(id) SET NULL |
| session_id | text null | Wizard session link |
| agent_name | text | Which AI agent |
| insight_type | text | opportunity / risk / recommendation / trend |
| title | text | Short title |
| description | text | Full description |
| priority | text default 'medium' | high / medium / low |
| impact_score | numeric null | 0-100 |
| confidence | numeric null | 0-1 |
| data_sources | jsonb default '[]' | What data fed this |
| status | text default 'draft' | draft / approved / dismissed / acted_on |
| action_taken | text null | What user did |
| created_at | timestamptz | now() |
| expires_at | timestamptz null | TTL |

**Check constraint:** status IN ('draft', 'approved', 'dismissed', 'acted_on')

#### 2.4 automation_opportunities

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | gen_random_uuid() |
| canvas_id | uuid null FK | → lean_canvases(id) SET NULL |
| session_id | text null | |
| title | text | Opportunity name |
| description | text | Full description |
| process_area | text | sales / operations / support / marketing |
| current_state | text | How it works now |
| proposed_state | text | How AI would improve it |
| impact_score | integer default 50 | 0-100 |
| roi_estimate | text null | e.g. '200-400%' |
| complexity | text default 'medium' | low / medium / high |
| estimated_weeks | integer null | Implementation time |
| estimated_cost | text null | Budget estimate |
| recommended_system | text null | From systems catalog |
| status | text default 'detected' | detected / evaluating / approved / in_progress / completed / dismissed |
| created_at | timestamptz | now() |
| updated_at | timestamptz | now() |

#### 2.5 strategy_recommendations

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | gen_random_uuid() |
| canvas_id | uuid null FK | → lean_canvases(id) SET NULL |
| session_id | text null | |
| agent_name | text | Which agent |
| recommendation_type | text | canvas_update / roadmap_change / new_system / task_creation / metric_alert |
| title | text | Short title |
| rationale | text | Why this recommendation |
| proposed_changes | jsonb default '{}' | Structured change data |
| approval_status | text default 'pending' | pending / approved / rejected / auto_approved |
| approved_by | uuid null | Who approved |
| approved_at | timestamptz null | When approved |
| created_at | timestamptz | now() |

#### 2.6 strategy_actions

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | gen_random_uuid() |
| canvas_id | uuid null FK | → lean_canvases(id) SET NULL |
| session_id | text null | |
| agent_name | text | Which agent ran |
| action_type | text | analyze / synthesize / recommend / score / alert |
| input_summary | text | What was sent |
| output_summary | text | What was returned |
| tokens_used | integer default 0 | Token count |
| duration_ms | integer default 0 | Latency |
| success | boolean default true | Pass/fail |
| error_message | text null | Error if failed |
| created_at | timestamptz | now() |

**All tables:** RLS enabled, authenticated CRUD policies (using (true) / with check (true))

---

## 3. TypeScript Types

File: `src/lib/types/strategy.ts`

```typescript
// ── Canvas Block Item ──
export interface CanvasBlockItem {
  id: string;
  text: string;
  source: 'manual' | 'ai';
  confidence?: number;
  updatedAt: string;
}

export type CanvasBlockKey =
  | 'problem' | 'customer_segments' | 'value_proposition' | 'solution'
  | 'channels' | 'revenue_streams' | 'cost_structure' | 'key_metrics'
  | 'unfair_advantage';

export const CANVAS_BLOCK_LABELS: Record<CanvasBlockKey, string> = {
  problem: 'Problem',
  customer_segments: 'Customer Segments',
  value_proposition: 'Unique Value Proposition',
  solution: 'Solution',
  channels: 'Channels',
  revenue_streams: 'Revenue Streams',
  cost_structure: 'Cost Structure',
  key_metrics: 'Key Metrics',
  unfair_advantage: 'Unfair Advantage',
};

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

export interface CanvasVersion { ... }
export interface StrategyInsight { ... }
export interface AutomationOpportunity { ... }
export interface StrategyRecommendation { ... }
export interface StrategyAction { ... }

// ── Dashboard composite ──
export interface StrategyDashboardData {
  canvas: LeanCanvas | null;
  insights: StrategyInsight[];
  opportunities: AutomationOpportunity[];
  recommendations: StrategyRecommendation[];
  recentActions: StrategyAction[];
  metrics: StrategyMetrics;
}

export interface StrategyMetrics {
  automationCoverage: number;
  insightCount: number;
  pendingApprovals: number;
  opportunitiesDetected: number;
  totalROIEstimate: string;
  canvasCompleteness: number;
  healthScore: number;
}
```

---

## 4. Edge Function Routes

File: `src/supabase/functions/server/strategy-routes.tsx`
Mount in index.tsx: `app.route("/", strategy);`

### Route Map (14 routes)

| Route | Method | Purpose | Auth | AI |
|-------|--------|---------|------|-----|
| `/strategy/canvas` | GET | Get current canvas | Required | No |
| `/strategy/canvas` | POST | Create canvas (seed from wizard) | Required | Optional |
| `/strategy/canvas/:id` | PUT | Update blocks (creates version) | Required | No |
| `/strategy/canvas/:id/versions` | GET | Version history | Required | No |
| `/strategy/insights` | GET | List insights (?status, ?type, ?limit) | Required | No |
| `/strategy/insights/:id` | PUT | Update status (approve/dismiss) | Required | No |
| `/strategy/opportunities` | GET | List opportunities | Required | No |
| `/strategy/opportunities/:id` | PUT | Update opportunity | Required | No |
| `/strategy/recommendations` | GET | List recommendations (?status) | Required | No |
| `/strategy/recommendations/:id/approve` | POST | Approve/reject | Required | No |
| `/strategy/actions` | GET | Action log (?limit) | Required | No |
| `/strategy/metrics` | GET | Aggregate metrics | Required | No |
| `/strategy/analyze` | POST | Full analysis cycle (5 agents) | Required | Yes |
| `/strategy/synthesize-block` | POST | Per-block AI synthesis | Required | Yes |

### Key Route: POST /strategy/analyze

The core orchestration endpoint. Runs all 5 AI agents:

```
1. Load canvas + wizard_answers + CRM data + AI logs
2. callGemini('strategy-synthesize', ...)     → strategy_recommendations
3. callGemini('opportunity-detect', ...)      → automation_opportunities
4. callGemini('roadmap-suggest', ...)         → strategy_recommendations
5. callGemini('system-recommend-strategy', ...)→ strategy_recommendations
6. callGemini('metrics-interpret', ...)       → strategy_insights
7. Log each call to strategy_actions
8. Compute aggregate metrics
9. Return combined results
```

### Key Route: POST /strategy/canvas (with wizard seeding)

When session_id is provided:
1. Load wizard_answers steps 1-5
2. Extract step 1 ai_results (business analysis) → problem, customer_segments, solution
3. Extract step 2 ai_results (diagnostics) → key_metrics, channels
4. Extract step 3 answers (selected systems) → solution items
5. Extract step 4 ai_results (readiness) → metadata.readinessScore
6. Extract step 5 ai_results (roadmap) → value_proposition from phases
7. Return populated canvas

---

## 5. AI Agent Specifications

### Agent 1: Strategy Synthesizer (`strategy-synthesize`)

**Model:** gemini-2.0-flash | **Cache TTL:** 4h

**Input:** Current canvas blocks, wizard analysis, CRM deal data, milestones

**Output:**
```json
{
  "blockUpdates": [
    {
      "block": "problem",
      "action": "add|replace|remove",
      "items": [{ "id": "...", "text": "...", "confidence": 0.85 }],
      "rationale": "Based on CRM data showing 40% of leads cite X"
    }
  ],
  "overallAssessment": "Canvas is 70% complete...",
  "completenessScore": 70
}
```

**Governance:** Creates `strategy_recommendations` with type `canvas_update`, status `pending`

---

### Agent 2: Opportunity Detector (`opportunity-detect`)

**Model:** gemini-2.0-flash | **Cache TTL:** 12h

**Input:** Canvas, wizard diagnostics, CRM patterns, AI run logs

**Output:**
```json
{
  "opportunities": [
    {
      "title": "Automate Lead Qualification",
      "description": "...",
      "process_area": "sales",
      "current_state": "Manual review takes 2-3 hours",
      "proposed_state": "AI scores leads in real-time",
      "impact_score": 85,
      "roi_estimate": "300-500%",
      "complexity": "low",
      "estimated_weeks": 3,
      "recommended_system": "sales-automation"
    }
  ]
}
```

**Governance:** Auto-inserts to `automation_opportunities` with status `detected`

---

### Agent 3: Roadmap Planner (`roadmap-suggest`)

**Model:** gemini-2.0-flash | **Cache TTL:** 24h

**Input:** Current roadmap phases, canvas, approved opportunities, progress

**Output:**
```json
{
  "suggestions": [
    {
      "type": "new_phase|modify_phase|new_task|reorder",
      "title": "Add AI Lead Scoring Phase",
      "description": "Insert between Phase 2 and 3",
      "rationale": "High-impact opportunity with low complexity",
      "requires_approval": true,
      "proposed_changes": { "phaseNumber": 2.5, "weeks": "3-4" }
    }
  ]
}
```

**Governance:** Creates `strategy_recommendations` with type `roadmap_change`, status `pending`

---

### Agent 4: System Recommender (`system-recommend-strategy`)

**Model:** gemini-2.0-flash | **Cache TTL:** 48h

**Input:** Canvas, opportunities, current systems, industry benchmarks

**Output:**
```json
{
  "systemSuggestions": [
    {
      "systemId": "recommendation-engine",
      "reason": "E-commerce focus + 3+ product categories need personalization",
      "fit_score": 0.92,
      "blocks_addressed": ["revenue_streams", "channels"],
      "estimated_impact": "15-25% revenue uplift"
    }
  ]
}
```

**Governance:** Creates `strategy_recommendations` with type `new_system`, status `pending`

---

### Agent 5: Metrics Interpreter (`metrics-interpret`)

**Model:** gemini-2.0-flash | **Cache TTL:** 2h

**Input:** Readiness score, pipeline value, project progress, AI usage, canvas completeness

**Output:**
```json
{
  "summary": "Overall health strong at 78/100...",
  "alerts": [
    { "metric": "pipeline_health", "level": "warning", "message": "2 stale deals", "action": "Review" }
  ],
  "trends": [
    { "metric": "ai_readiness", "direction": "up", "change": "+5", "interpretation": "..." }
  ],
  "healthScore": 78
}
```

**Governance:** Auto-inserts to `strategy_insights` with status `draft` (auto-approved)

---

## 6. Governance Model

### Three Tiers

| Tier | Actions | Behavior |
|------|---------|----------|
| **Auto-approve** | Draft insights, metric alerts, opportunity detection, scoring, action logging | No human intervention needed |
| **Require approval** | Canvas block updates, roadmap changes, new system suggestions, task creation | Pending → user approves/rejects in UI |
| **User-initiated only** | Create canvas, run full analysis, delete items, revert versions | User must explicitly trigger |

### Approval Flow

```
AI generates recommendation (status: pending)
  → Appears in Intelligence Panel with badge
    → User clicks Approve → Backend applies changes → Canvas updated
    → User clicks Reject → Record updated to rejected
```

---

## 7. Frontend API Object

Added to `src/lib/supabase.ts` following existing patterns:

```typescript
export const strategyApi = {
  getCanvas: (params?, token?) => api('/strategy/canvas?...', { token }),
  createCanvas: (data, token?) => api('/strategy/canvas', { method: 'POST', body: data, token }),
  updateCanvasBlocks: (id, blocks, summary?, token?) => api(`/strategy/canvas/${id}`, { method: 'PUT', ... }),
  getCanvasVersions: (canvasId, token?) => api(`/strategy/canvas/${canvasId}/versions`, { token }),
  listInsights: (params?, token?) => api('/strategy/insights?...', { token }),
  updateInsight: (id, updates, token?) => api(`/strategy/insights/${id}`, { method: 'PUT', ... }),
  listOpportunities: (token?) => api('/strategy/opportunities', { token }),
  updateOpportunity: (id, updates, token?) => api(`/strategy/opportunities/${id}`, { method: 'PUT', ... }),
  listRecommendations: (params?, token?) => api('/strategy/recommendations?...', { token }),
  approveRecommendation: (id, approved, comment?, token?) => api(`/strategy/recommendations/${id}/approve`, { method: 'POST', ... }),
  getActions: (params?, token?) => api('/strategy/actions?...', { token }),
  getMetrics: (token?) => api('/strategy/metrics', { token }),
  runAnalysis: (canvasId, sessionId?, token?) => api('/strategy/analyze', { method: 'POST', ... }),
  synthesizeBlock: (canvasId, block, context?, token?) => api('/strategy/synthesize-block', { method: 'POST', ... }),
};
```
