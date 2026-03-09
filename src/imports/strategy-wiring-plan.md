---
id: lean-13-frontend-backend-wiring
title: Strategy Engine — Frontend ↔ Backend Wiring Plan
skill: fullstack
phase: LEAN
priority: P0
status: Not Started
dependencies: [lean-01-strategy-page-layout, lean-12-sidebar-navigation]
estimated_effort: XL
percent_complete: 0
area: fullstack
spec_refs:
  - tasks/lean/01-architecture-spec.md (schema, types, routes, agents, API)
  - tasks/lean/03-agent-workflows.md (data flows, seeding, approval)
  - tasks/lean/06-advanced-architecture.md (parallel execution, conflict resolution, budgets)
---

# Strategy Engine — Frontend ↔ Backend Wiring Plan

## Overview

Complete wiring plan connecting the Strategy Engine frontend (13 React components) to the backend (14 Hono edge routes, 12 Supabase tables, 5 Gemini AI agents). Follows existing patterns from `pipelineApi`, `CRMPipelinePage`, and `pipeline-routes.tsx`.

---

## Build Order (Sequential Dependencies)

```
Step 1  Database Migration (12 tables)
  ↓
Step 2  TypeScript Types (strategy.ts)
  ↓
Step 3  Frontend API Object (strategyApi in supabase.ts)
  ↓
Step 4  Edge Function CRUD Routes (strategy-routes.tsx)
  ↓
Step 5  Edge Function AI Routes (analyze, synthesize-block)
  ↓
Step 6  Mount Routes + Routing + Sidebar
  ↓
Step 7  useStrategyData Hook
  ↓
Step 8  Frontend Components (13 files)
  ↓
Step 9  End-to-End Verification
```

---

## Step 1: Database Migration

**File:** `src/supabase/migrations/20260308120000_create_strategy_engine_tables.sql`
**Apply via:** Supabase MCP `apply_migration`

### 12 Tables

#### Core (6)

```sql
-- 1. lean_canvases
create table lean_canvases (
  id uuid primary key default gen_random_uuid(),
  session_id text,
  project_id uuid,
  user_id uuid,
  version integer default 1,
  is_current boolean default true,
  problem jsonb default '[]'::jsonb,
  customer_segments jsonb default '[]'::jsonb,
  value_proposition jsonb default '[]'::jsonb,
  solution jsonb default '[]'::jsonb,
  channels jsonb default '[]'::jsonb,
  revenue_streams jsonb default '[]'::jsonb,
  cost_structure jsonb default '[]'::jsonb,
  key_metrics jsonb default '[]'::jsonb,
  unfair_advantage jsonb default '[]'::jsonb,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_canvas_session on lean_canvases(session_id);
create index idx_canvas_project on lean_canvases(project_id);
create index idx_canvas_current on lean_canvases(is_current) where is_current = true;

-- 2. lean_canvas_versions
create table lean_canvas_versions (
  id uuid primary key default gen_random_uuid(),
  canvas_id uuid references lean_canvases(id) on delete cascade,
  version integer not null,
  snapshot jsonb not null,
  change_summary text,
  changed_by text,
  created_at timestamptz default now(),
  unique(canvas_id, version)
);

-- 3. strategy_insights
create table strategy_insights (
  id uuid primary key default gen_random_uuid(),
  canvas_id uuid references lean_canvases(id) on delete set null,
  session_id text,
  agent_name text not null,
  insight_type text not null,
  title text not null,
  description text not null,
  priority text default 'medium',
  impact_score numeric,
  confidence numeric,
  data_sources jsonb default '[]'::jsonb,
  status text default 'draft' check (status in ('draft','approved','dismissed','acted_on')),
  action_taken text,
  created_at timestamptz default now(),
  expires_at timestamptz
);
create index idx_insight_canvas on strategy_insights(canvas_id);
create index idx_insight_status on strategy_insights(status);

-- 4. automation_opportunities
create table automation_opportunities (
  id uuid primary key default gen_random_uuid(),
  canvas_id uuid references lean_canvases(id) on delete set null,
  session_id text,
  title text not null,
  description text not null,
  process_area text,
  current_state text,
  proposed_state text,
  impact_score integer default 50,
  roi_estimate text,
  complexity text default 'medium',
  estimated_weeks integer,
  estimated_cost text,
  recommended_system text,
  status text default 'detected' check (status in ('detected','evaluating','approved','in_progress','completed','dismissed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_opp_canvas on automation_opportunities(canvas_id);

-- 5. strategy_recommendations
create table strategy_recommendations (
  id uuid primary key default gen_random_uuid(),
  canvas_id uuid references lean_canvases(id) on delete set null,
  session_id text,
  agent_name text not null,
  recommendation_type text not null,
  title text not null,
  rationale text not null,
  proposed_changes jsonb default '{}'::jsonb,
  approval_status text default 'pending' check (approval_status in ('pending','approved','rejected','auto_approved','archived')),
  approved_by uuid,
  approved_at timestamptz,
  created_at timestamptz default now()
);
create index idx_rec_canvas on strategy_recommendations(canvas_id);
create index idx_rec_status on strategy_recommendations(approval_status);

-- 6. strategy_actions
create table strategy_actions (
  id uuid primary key default gen_random_uuid(),
  canvas_id uuid references lean_canvases(id) on delete set null,
  session_id text,
  agent_name text not null,
  action_type text not null,
  input_summary text,
  output_summary text,
  tokens_used integer default 0,
  duration_ms integer default 0,
  success boolean default true,
  error_message text,
  created_at timestamptz default now()
);
create index idx_action_canvas on strategy_actions(canvas_id);
```

#### Advanced (6) — from audit

```sql
-- 7. strategy_events (event bus, Phase 1 = log only)
create table strategy_events (
  id uuid primary key default gen_random_uuid(),
  canvas_id uuid references lean_canvases(id) on delete set null,
  event_type text not null,
  source_table text not null,
  source_id text,
  payload jsonb default '{}'::jsonb,
  processed boolean default false,
  processed_at timestamptz,
  created_at timestamptz default now()
);
create index idx_event_unprocessed on strategy_events(processed, created_at) where processed = false;

-- 8. strategy_event_triggers (all disabled in Phase 1)
create table strategy_event_triggers (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  agent_name text not null,
  enabled boolean default false,
  cooldown_minutes integer default 60,
  last_triggered_at timestamptz,
  created_at timestamptz default now(),
  unique(event_type, agent_name)
);

-- 9. strategy_agent_memory
create table strategy_agent_memory (
  id uuid primary key default gen_random_uuid(),
  canvas_id uuid references lean_canvases(id) on delete cascade,
  agent_name text not null,
  memory_type text not null,
  content jsonb not null,
  relevance_score numeric default 1.0,
  superseded_by uuid references strategy_agent_memory(id),
  created_at timestamptz default now(),
  expires_at timestamptz
);
create index idx_memory_canvas_agent on strategy_agent_memory(canvas_id, agent_name);

-- 10. strategy_signals
create table strategy_signals (
  id uuid primary key default gen_random_uuid(),
  canvas_id uuid references lean_canvases(id) on delete set null,
  signal_category text not null,
  signal_name text not null,
  value numeric not null,
  previous_value numeric,
  unit text default '',
  trend text default 'stable',
  source text,
  collected_at timestamptz default now()
);
create index idx_signal_canvas on strategy_signals(canvas_id);

-- 11. strategy_roles
create table strategy_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  canvas_id uuid references lean_canvases(id) on delete cascade,
  role text not null check (role in ('admin','strategist','viewer')),
  created_at timestamptz default now(),
  unique(user_id, canvas_id)
);

-- 12. strategy_budgets
create table strategy_budgets (
  id uuid primary key default gen_random_uuid(),
  canvas_id uuid references lean_canvases(id) on delete cascade,
  monthly_token_limit integer default 500000,
  tokens_used_this_month integer default 0,
  analysis_count_this_month integer default 0,
  max_analyses_per_day integer default 5,
  analyses_today integer default 0,
  last_analysis_at timestamptz,
  min_analysis_interval_minutes integer default 30,
  budget_month text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: enable on all tables, authenticated CRUD
```

For each of the 12 tables, enable RLS and add:
```sql
alter table <TABLE> enable row level security;
create policy "<TABLE>_select" on <TABLE> for select to authenticated using (true);
create policy "<TABLE>_insert" on <TABLE> for insert to authenticated with check (true);
create policy "<TABLE>_update" on <TABLE> for update to authenticated using (true);
create policy "<TABLE>_delete" on <TABLE> for delete to authenticated using (true);
```

---

## Step 2: TypeScript Types

**File:** `src/lib/types/strategy.ts`
**Pattern:** Follow `src/lib/types/crm-pipeline.ts`

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

export interface CanvasVersion {
  id: string;
  canvas_id: string;
  version: number;
  snapshot: Record<string, unknown>;
  change_summary: string;
  changed_by: string;
  created_at: string;
}

export type InsightType = 'opportunity' | 'risk' | 'recommendation' | 'trend';
export type InsightStatus = 'draft' | 'approved' | 'dismissed' | 'acted_on';

export interface StrategyInsight {
  id: string;
  canvas_id: string | null;
  session_id: string | null;
  agent_name: string;
  insight_type: InsightType;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact_score: number | null;
  confidence: number | null;
  data_sources: string[];
  status: InsightStatus;
  action_taken: string | null;
  created_at: string;
  expires_at: string | null;
}

export type OpportunityStatus = 'detected' | 'evaluating' | 'approved' | 'in_progress' | 'completed' | 'dismissed';

export interface AutomationOpportunity {
  id: string;
  canvas_id: string | null;
  session_id: string | null;
  title: string;
  description: string;
  process_area: string;
  current_state: string;
  proposed_state: string;
  impact_score: number;
  roi_estimate: string | null;
  complexity: 'low' | 'medium' | 'high';
  estimated_weeks: number | null;
  estimated_cost: string | null;
  recommended_system: string | null;
  status: OpportunityStatus;
  created_at: string;
  updated_at: string;
}

export type RecommendationType = 'canvas_update' | 'roadmap_change' | 'new_system' | 'task_creation' | 'metric_alert';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'auto_approved' | 'archived';

export interface StrategyRecommendation {
  id: string;
  canvas_id: string | null;
  session_id: string | null;
  agent_name: string;
  recommendation_type: RecommendationType;
  title: string;
  rationale: string;
  proposed_changes: Record<string, unknown>;
  approval_status: ApprovalStatus;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
}

export interface StrategyAction {
  id: string;
  canvas_id: string | null;
  session_id: string | null;
  agent_name: string;
  action_type: string;
  input_summary: string;
  output_summary: string;
  tokens_used: number;
  duration_ms: number;
  success: boolean;
  error_message: string | null;
  created_at: string;
}

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
  pendingSignals: number;
  opportunitiesDetected: number;
  totalROIEstimate: string;
  canvasCompleteness: number;
  tokenBudgetUsed: number;
  tokenBudgetRemaining: number;
}

export interface StrategyDashboardData {
  canvas: LeanCanvas | null;
  insights: StrategyInsight[];
  opportunities: AutomationOpportunity[];
  recommendations: StrategyRecommendation[];
  recentActions: StrategyAction[];
  metrics: StrategyMetrics;
}

// ── Analysis response (from POST /strategy/analyze) ──
export interface StrategyAnalysisResponse {
  insights: StrategyInsight[];
  opportunities: AutomationOpportunity[];
  recommendations: StrategyRecommendation[];
  metrics: StrategyMetrics;
  agentResults: {
    agent: string;
    duration_ms: number;
    tokens_used: number;
    success: boolean;
    summary: string;
    error?: string;
  }[];
}

// ── Block synthesis response (from POST /strategy/synthesize-block) ──
export interface BlockSynthesisResponse {
  suggestions: CanvasBlockItem[];
  rationale: string;
}
```

---

## Step 3: Frontend API Object

**File:** `src/lib/supabase.ts`
**Pattern:** Follow `pipelineApi` / `financialApi` (same file)
**Add after:** `financialApi` block (~line 674)

```typescript
// ── Strategy API (Lean Canvas + AI Strategy Engine) ──
import type {
  LeanCanvas, CanvasVersion, StrategyInsight, AutomationOpportunity,
  StrategyRecommendation, StrategyAction, StrategyMetrics,
  StrategyAnalysisResponse, BlockSynthesisResponse, CanvasBlockKey,
  CanvasBlockItem,
} from './types/strategy';
export type {
  LeanCanvas, CanvasVersion, StrategyInsight, AutomationOpportunity,
  StrategyRecommendation, StrategyAction, StrategyMetrics,
  StrategyAnalysisResponse, BlockSynthesisResponse,
};

export const strategyApi = {
  // Canvas CRUD
  getCanvas: (params?: { session_id?: string; project_id?: string }, token?: string) => {
    const qs = new URLSearchParams();
    if (params?.session_id) qs.set('session_id', params.session_id);
    if (params?.project_id) qs.set('project_id', params.project_id);
    const query = qs.toString();
    return api<{ canvas: LeanCanvas }>(`/strategy/canvas${query ? `?${query}` : ''}`, { token });
  },

  createCanvas: (data: { session_id?: string; project_id?: string }, token?: string) =>
    api<{ canvas: LeanCanvas }>('/strategy/canvas', { method: 'POST', body: data, token }),

  updateCanvasBlocks: (
    id: string,
    blocks: Partial<Record<CanvasBlockKey, CanvasBlockItem[]>>,
    changeSummary?: string,
    token?: string
  ) => api<{ canvas: LeanCanvas; version: CanvasVersion }>(
    `/strategy/canvas/${id}`,
    { method: 'PUT', body: { blocks, change_summary: changeSummary }, token }
  ),

  getCanvasVersions: (canvasId: string, token?: string) =>
    api<{ versions: CanvasVersion[] }>(`/strategy/canvas/${canvasId}/versions`, { token }),

  // Insights
  listInsights: (params?: { status?: string; type?: string; limit?: number }, token?: string) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.type) qs.set('type', params.type);
    if (params?.limit) qs.set('limit', String(params.limit));
    const query = qs.toString();
    return api<{ insights: StrategyInsight[] }>(`/strategy/insights${query ? `?${query}` : ''}`, { token });
  },

  updateInsight: (id: string, updates: { status?: string; action_taken?: string }, token?: string) =>
    api<{ insight: StrategyInsight }>(`/strategy/insights/${id}`, { method: 'PUT', body: updates, token }),

  // Opportunities
  listOpportunities: (token?: string) =>
    api<{ opportunities: AutomationOpportunity[] }>('/strategy/opportunities', { token }),

  updateOpportunity: (id: string, updates: Partial<AutomationOpportunity>, token?: string) =>
    api<{ opportunity: AutomationOpportunity }>(
      `/strategy/opportunities/${id}`,
      { method: 'PUT', body: updates as Record<string, unknown>, token }
    ),

  // Recommendations
  listRecommendations: (params?: { status?: string }, token?: string) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    const query = qs.toString();
    return api<{ recommendations: StrategyRecommendation[] }>(
      `/strategy/recommendations${query ? `?${query}` : ''}`, { token }
    );
  },

  approveRecommendation: (id: string, approved: boolean, comment?: string, token?: string) =>
    api<{ recommendation: StrategyRecommendation; canvas?: LeanCanvas; version?: CanvasVersion }>(
      `/strategy/recommendations/${id}/approve`,
      { method: 'POST', body: { approved, comment }, token }
    ),

  // Actions (audit log)
  getActions: (params?: { limit?: number }, token?: string) => {
    const qs = new URLSearchParams();
    if (params?.limit) qs.set('limit', String(params.limit));
    const query = qs.toString();
    return api<{ actions: StrategyAction[] }>(`/strategy/actions${query ? `?${query}` : ''}`, { token });
  },

  // Metrics
  getMetrics: (token?: string) =>
    api<StrategyMetrics>('/strategy/metrics', { token }),

  // AI endpoints
  runAnalysis: (canvasId: string, sessionId?: string, token?: string) =>
    api<StrategyAnalysisResponse>('/strategy/analyze', {
      method: 'POST',
      body: { canvas_id: canvasId, session_id: sessionId },
      token,
    }),

  synthesizeBlock: (canvasId: string, block: CanvasBlockKey, context?: string, token?: string) =>
    api<BlockSynthesisResponse>('/strategy/synthesize-block', {
      method: 'POST',
      body: { canvas_id: canvasId, block, context },
      token,
    }),
};
```

---

## Step 4: Edge Function CRUD Routes

**File:** `src/supabase/functions/server/strategy-routes.tsx`
**Pattern:** Follow `pipeline-routes.tsx`

```typescript
import { Hono } from "npm:hono";
import { adminClient } from "./db.tsx";
import { requireAuth, getUserFromToken } from "./auth.tsx";

const strategy = new Hono();
const PREFIX = "/make-server-283466b6";

// ── GET /strategy/canvas ──
// Query: ?session_id=X or ?project_id=X
// Returns current canvas for user
strategy.get(`${PREFIX}/strategy/canvas`, async (c) => {
  const userId = await requireAuth(c.req.header("Authorization") ?? null);
  const sessionId = c.req.query("session_id");
  const projectId = c.req.query("project_id");
  const db = adminClient();

  let query = db.from("lean_canvases").select("*").eq("is_current", true);
  if (sessionId) query = query.eq("session_id", sessionId);
  else if (projectId) query = query.eq("project_id", projectId);
  else query = query.eq("user_id", userId);

  const { data, error } = await query.order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ canvas: data });
});

// ── POST /strategy/canvas ──
// Body: { session_id?, project_id? }
// If session_id provided: seeds canvas from wizard_answers
strategy.post(`${PREFIX}/strategy/canvas`, async (c) => {
  const userId = await requireAuth(c.req.header("Authorization") ?? null);
  const body = await c.req.json();
  const db = adminClient();

  // Canvas seeding from wizard — see §6 in 01-architecture-spec.md
  let canvasData: Record<string, unknown> = {
    user_id: userId,
    session_id: body.session_id || null,
    project_id: body.project_id || null,
    version: 1,
    is_current: true,
  };

  if (body.session_id) {
    // Load wizard_answers steps 1-5 and map to canvas blocks
    // (full mapping logic in spec §4 of 03-agent-workflows.md)
    const { data: wizardAnswers } = await db
      .from("wizard_answers")
      .select("step_number, answers, ai_results")
      .eq("session_id", body.session_id)
      .order("step_number");

    if (wizardAnswers?.length) {
      canvasData = { ...canvasData, ...seedCanvasFromWizard(wizardAnswers) };
    }
  }

  const { data: canvas, error } = await db.from("lean_canvases").insert(canvasData).select().single();
  if (error) return c.json({ error: error.message }, 500);

  // Create initial version snapshot
  await db.from("lean_canvas_versions").insert({
    canvas_id: canvas.id,
    version: 1,
    snapshot: canvas,
    change_summary: body.session_id ? "Created from wizard data" : "Created fresh canvas",
    changed_by: "system",
  });

  // Auto-assign admin role
  await db.from("strategy_roles").insert({ user_id: userId, canvas_id: canvas.id, role: "admin" });

  // Create default budget
  await db.from("strategy_budgets").insert({
    canvas_id: canvas.id,
    budget_month: new Date().toISOString().slice(0, 7),
  });

  return c.json({ canvas });
});

// ── PUT /strategy/canvas/:id ──
// Body: { blocks: { problem: [...], ... }, change_summary? }
// Creates a new version snapshot before applying changes
strategy.put(`${PREFIX}/strategy/canvas/:id`, async (c) => {
  const userId = await requireAuth(c.req.header("Authorization") ?? null);
  const canvasId = c.req.param("id");
  const { blocks, change_summary } = await c.req.json();
  const db = adminClient();

  // Load current canvas
  const { data: current } = await db.from("lean_canvases").select("*").eq("id", canvasId).single();
  if (!current) return c.json({ error: "Canvas not found" }, 404);

  const newVersion = current.version + 1;

  // Apply block updates
  const updates: Record<string, unknown> = { version: newVersion, updated_at: new Date().toISOString() };
  for (const [key, items] of Object.entries(blocks)) {
    updates[key] = items;
  }

  const { data: updated, error } = await db
    .from("lean_canvases").update(updates).eq("id", canvasId).select().single();
  if (error) return c.json({ error: error.message }, 500);

  // Create version snapshot
  const { data: version } = await db.from("lean_canvas_versions").insert({
    canvas_id: canvasId,
    version: newVersion,
    snapshot: updated,
    change_summary: change_summary || `Updated ${Object.keys(blocks).join(", ")} blocks`,
    changed_by: "user",
  }).select().single();

  return c.json({ canvas: updated, version });
});

// ── GET /strategy/canvas/:id/versions ──
strategy.get(`${PREFIX}/strategy/canvas/:id/versions`, async (c) => {
  await requireAuth(c.req.header("Authorization") ?? null);
  const canvasId = c.req.param("id");
  const db = adminClient();

  const { data, error } = await db
    .from("lean_canvas_versions").select("*").eq("canvas_id", canvasId)
    .order("version", { ascending: false });
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ versions: data });
});

// ── GET /strategy/insights ──
strategy.get(`${PREFIX}/strategy/insights`, async (c) => { /* filter by status, type, limit */ });

// ── PUT /strategy/insights/:id ──
strategy.put(`${PREFIX}/strategy/insights/:id`, async (c) => { /* update status */ });

// ── GET /strategy/opportunities ──
strategy.get(`${PREFIX}/strategy/opportunities`, async (c) => { /* list all */ });

// ── PUT /strategy/opportunities/:id ──
strategy.put(`${PREFIX}/strategy/opportunities/:id`, async (c) => { /* update status */ });

// ── GET /strategy/recommendations ──
strategy.get(`${PREFIX}/strategy/recommendations`, async (c) => { /* filter by status */ });

// ── POST /strategy/recommendations/:id/approve ──
// CRITICAL: approval logic differs by recommendation_type (see spec §5 in 03-agent-workflows.md)
strategy.post(`${PREFIX}/strategy/recommendations/:id/approve`, async (c) => {
  // canvas_update → apply block changes + create version
  // roadmap_change → log approved
  // new_system → log approved
  // task_creation → log approved
});

// ── GET /strategy/actions ──
strategy.get(`${PREFIX}/strategy/actions`, async (c) => { /* list with limit */ });

// ── GET /strategy/metrics ──
strategy.get(`${PREFIX}/strategy/metrics`, async (c) => {
  // Aggregate from: lean_canvases, automation_opportunities,
  // strategy_recommendations, strategy_insights, strategy_budgets
  // Compute 8-dimension health breakdown (see spec §4 in 06-advanced-architecture.md)
});

export { strategy };
```

### seedCanvasFromWizard() mapping (spec §4 in 03-agent-workflows.md)

```
Wizard Step 1 (Business Analysis):
  ai_results.analysis.painPoints      → problem[]
  ai_results.analysis.targetAudience  → customer_segments[]
  ai_results.analysis.opportunities   → value_proposition[]
  answers.industry                    → metadata.industry
  answers.companySize                 → metadata.companySize

Wizard Step 2 (Industry Diagnostics):
  ai_results.diagnostics.signals       → key_metrics[] (top 3)
  ai_results.diagnostics.channelAnalysis → channels[]

Wizard Step 3 (System Recommendations):
  answers.selectedSystems              → solution[] (system names)
  ai_results.recommendations           → cost_structure[] (pricing)

Wizard Step 4 (Readiness Score):
  ai_results.readiness.overallScore    → metadata.readinessScore
  ai_results.readiness.strengths       → unfair_advantage[]
  ai_results.readiness.gaps            → problem[] (additional)

Wizard Step 5 (Roadmap):
  ai_results.roadmap.phases            → metadata.phases
  ai_results.roadmap.totalInvestment   → revenue_streams[] (target)
```

Each extracted item becomes a `CanvasBlockItem`:
```typescript
{ id: crypto.randomUUID(), text: "...", source: "ai", confidence: 0.85, updatedAt: new Date().toISOString() }
```

---

## Step 5: Edge Function AI Routes

### POST /strategy/analyze

The core orchestration endpoint. Runs 5 agents in 2 parallel phases + conflict resolution.

```typescript
strategy.post(`${PREFIX}/strategy/analyze`, async (c) => {
  const userId = await requireAuth(c.req.header("Authorization") ?? null);
  const { canvas_id, session_id } = await c.req.json();
  const db = adminClient();

  // 1. Budget check (spec §9 in 06-advanced-architecture.md)
  const budgetCheck = await checkBudget(canvas_id);
  if (!budgetCheck.allowed) return c.json({ error: budgetCheck.reason }, 429);

  // 2. Load context data
  const canvas = await db.from("lean_canvases").select("*").eq("id", canvas_id).single();
  const wizardAnswers = await db.from("wizard_answers").select("*").eq("session_id", session_id);
  const clients = await db.from("clients").select("*").limit(50);
  const deals = await db.from("crm_deals").select("*").order("updated_at", { ascending: false }).limit(30);
  const aiLogs = await db.rpc("count_ai_logs_by_type"); // or select + group

  // 3. Load agent memory per agent (spec §2 in 06-advanced-architecture.md)
  const memories = await db.from("strategy_agent_memory").select("*")
    .eq("canvas_id", canvas_id).gt("relevance_score", 0.3);

  // 4. Phase A — 3 agents in parallel
  const [synthResult, oppResult, metricsResult] = await Promise.all([
    runAgent("strategy-synthesize", canvas.data, wizardAnswers.data, deals.data, memories.data),
    runAgent("opportunity-detect", canvas.data, wizardAnswers.data, deals.data, memories.data),
    runAgent("metrics-interpret", canvas.data, wizardAnswers.data, deals.data, memories.data),
  ]);

  // 5. Phase B — 2 agents in parallel (depend on Phase A)
  const [roadmapResult, systemResult] = await Promise.all([
    runAgent("roadmap-suggest", canvas.data, wizardAnswers.data, oppResult, memories.data),
    runAgent("system-recommend-strategy", canvas.data, wizardAnswers.data, oppResult, memories.data),
  ]);

  // 6. Phase C — Conflict resolution + ranking
  const resolved = resolveConflicts(synthResult, oppResult, roadmapResult, systemResult);

  // 7. Persist results (batch inserts)
  // 8. Save agent memories
  // 9. Update budget counters
  // 10. Compute aggregate metrics

  return c.json({ insights, opportunities, recommendations, metrics, agentResults });
});
```

Each `runAgent()` call:
1. Builds system + user prompt with agent memory context
2. Calls `callGemini(agentName, systemPrompt, userPrompt, inputData, sessionId)` from `gemini.tsx`
3. Logs to `strategy_actions` table
4. Returns parsed output

### POST /strategy/synthesize-block

Per-block AI suggestion (user clicks "Ask AI" on a specific block).

```typescript
strategy.post(`${PREFIX}/strategy/synthesize-block`, async (c) => {
  const userId = await requireAuth(c.req.header("Authorization") ?? null);
  const { canvas_id, block, context } = await c.req.json();
  const db = adminClient();

  const canvas = await db.from("lean_canvases").select("*").eq("id", canvas_id).single();
  const wizardAnswers = await db.from("wizard_answers").select("*")
    .eq("session_id", canvas.data.session_id);

  const systemPrompt = `You are analyzing the "${block}" section of a Lean Canvas.
Given the current items, business analysis, and industry data,
suggest 2-4 additions, modifications, or removals.
Each suggestion must cite specific data.
Return JSON: { "suggestions": [{ "id": "uuid", "text": "...", "source": "ai", "confidence": 0.85 }], "rationale": "..." }`;

  const result = await callGemini("strategy-synthesize-block", systemPrompt, userPrompt, inputData, null);

  return c.json(result);
});
```

### 5 Agent Prompt Specs

| Agent | callGemini Name | Model | Cache TTL | Max Output |
|-------|-----------------|-------|-----------|------------|
| Strategy Synthesizer | `strategy-synthesize` | gemini-2.0-flash | 4h | 3 recs |
| Opportunity Detector | `opportunity-detect` | gemini-2.0-flash | 12h | 5 opps |
| Roadmap Planner | `roadmap-suggest` | gemini-2.0-flash | 24h | 3 recs |
| System Recommender | `system-recommend-strategy` | gemini-2.0-flash | 48h | 3 recs |
| Metrics Interpreter | `metrics-interpret` | gemini-2.0-flash | 2h | 5 insights |

Full prompt specifications: see `tasks/lean/01-architecture-spec.md §5`.

---

## Step 6: Mount Routes + Routing + Sidebar

### Mount in index.tsx

**File:** `src/supabase/functions/server/index.tsx`

```typescript
import { strategy } from "./strategy-routes.tsx";

// After financial routes mount (~line 166):
// ── Mount Strategy Engine routes ──
app.route("/", strategy);
```

### Route in routes.tsx

**File:** `src/routes.tsx`

Already present in the current routes.tsx:
```typescript
import StrategyPage from './components/dashboard/strategy/StrategyPage';
// ...
{ path: 'strategy', Component: StrategyPage },
```

### Sidebar nav item

**File:** `src/components/dashboard/DashboardSidebar.tsx`

Add to NAV_ITEMS array after "AI Insights" entry:
```typescript
{ to: '/app/strategy', label: 'Strategy', icon: Brain },
```

Import `Brain` from `lucide-react`.

Badge: query `pendingApprovals` count from `strategyApi.getMetrics()` on mount.

### Header label

**File:** `src/components/dashboard/DashboardHeader.tsx`

Add to ROUTE_LABELS:
```typescript
strategy: 'Strategy Engine',
```

---

## Step 7: useStrategyData Hook

**File:** `src/lib/hooks/useStrategyData.ts`
**Pattern:** Follow `useDashboardData.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';
import { strategyApi } from '../supabase';
import { useAuth } from '../../components/AuthContext';
import type {
  LeanCanvas, StrategyInsight, AutomationOpportunity,
  StrategyRecommendation, StrategyAction, StrategyMetrics,
  StrategyAnalysisResponse, BlockSynthesisResponse,
  CanvasBlockKey, CanvasBlockItem,
} from '../types/strategy';

export function useStrategyData(sessionId?: string) {
  const { accessToken } = useAuth();
  const token = accessToken ? 'use-fresh-token' : undefined;

  // State
  const [canvas, setCanvas] = useState<LeanCanvas | null>(null);
  const [insights, setInsights] = useState<StrategyInsight[]>([]);
  const [opportunities, setOpportunities] = useState<AutomationOpportunity[]>([]);
  const [recommendations, setRecommendations] = useState<StrategyRecommendation[]>([]);
  const [metrics, setMetrics] = useState<StrategyMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisRunning, setAnalysisRunning] = useState(false);
  const [synthesizingBlock, setSynthesizingBlock] = useState<CanvasBlockKey | null>(null);
  const [blockSuggestions, setBlockSuggestions] = useState<Partial<Record<CanvasBlockKey, CanvasBlockItem[]>>>({});

  // Fetch all data on mount
  const fetchAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [canvasRes, insightsRes, oppsRes, recsRes, metricsRes] = await Promise.all([
        strategyApi.getCanvas({ session_id: sessionId }, token),
        strategyApi.listInsights({ status: 'draft' }, token),
        strategyApi.listOpportunities(token),
        strategyApi.listRecommendations({ status: 'pending' }, token),
        strategyApi.getMetrics(token),
      ]);

      if (canvasRes.data?.canvas) setCanvas(canvasRes.data.canvas);
      if (insightsRes.data?.insights) setInsights(insightsRes.data.insights);
      if (oppsRes.data?.opportunities) setOpportunities(oppsRes.data.opportunities);
      if (recsRes.data?.recommendations) setRecommendations(recsRes.data.recommendations);
      if (metricsRes.data) setMetrics(metricsRes.data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [token, sessionId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Actions
  const createCanvas = async (fromWizard: boolean) => {
    const res = await strategyApi.createCanvas(
      fromWizard && sessionId ? { session_id: sessionId } : {},
      token
    );
    if (res.data?.canvas) { setCanvas(res.data.canvas); }
    return res;
  };

  const runAnalysis = async () => {
    if (!canvas) return;
    setAnalysisRunning(true);
    try {
      const res = await strategyApi.runAnalysis(canvas.id, sessionId, token);
      if (res.data) {
        setInsights(res.data.insights);
        setOpportunities(res.data.opportunities);
        setRecommendations(res.data.recommendations);
        setMetrics(res.data.metrics);
      }
      return res;
    } finally {
      setAnalysisRunning(false);
    }
  };

  const synthesizeBlock = async (block: CanvasBlockKey, context?: string) => {
    if (!canvas) return;
    setSynthesizingBlock(block);
    try {
      const res = await strategyApi.synthesizeBlock(canvas.id, block, context, token);
      if (res.data?.suggestions) {
        setBlockSuggestions(prev => ({ ...prev, [block]: res.data!.suggestions }));
      }
      return res;
    } finally {
      setSynthesizingBlock(null);
    }
  };

  const updateBlock = async (block: CanvasBlockKey, items: CanvasBlockItem[], summary?: string) => {
    if (!canvas) return;
    const res = await strategyApi.updateCanvasBlocks(canvas.id, { [block]: items }, summary, token);
    if (res.data?.canvas) setCanvas(res.data.canvas);
    return res;
  };

  const approveRecommendation = async (id: string, approved: boolean, comment?: string) => {
    const res = await strategyApi.approveRecommendation(id, approved, comment, token);
    if (res.data) {
      // Remove from pending list
      setRecommendations(prev => prev.filter(r => r.id !== id));
      // If canvas was updated, refresh it
      if (res.data.canvas) setCanvas(res.data.canvas);
      // Refresh metrics
      const metricsRes = await strategyApi.getMetrics(token);
      if (metricsRes.data) setMetrics(metricsRes.data);
    }
    return res;
  };

  const dismissInsight = async (id: string) => {
    const res = await strategyApi.updateInsight(id, { status: 'dismissed' }, token);
    if (res.data) setInsights(prev => prev.filter(i => i.id !== id));
    return res;
  };

  const updateOpportunityStatus = async (id: string, status: string) => {
    const res = await strategyApi.updateOpportunity(id, { status } as any, token);
    if (res.data?.opportunity) {
      setOpportunities(prev => prev.map(o => o.id === id ? res.data!.opportunity : o));
    }
    return res;
  };

  return {
    // State
    canvas, insights, opportunities, recommendations, metrics,
    loading, error, analysisRunning, synthesizingBlock, blockSuggestions,
    // Actions
    createCanvas, runAnalysis, synthesizeBlock, updateBlock,
    approveRecommendation, dismissInsight, updateOpportunityStatus,
    refresh: fetchAll,
  };
}
```

---

## Step 8: Frontend Components

**Directory:** `src/components/dashboard/strategy/`
**13 files** — see Figma prompts `01-12` for visual specs.

### Component → Data Wiring Map

| Component | Hook Properties Used | Actions Used |
|-----------|---------------------|--------------|
| `StrategyEnginePage.tsx` | All state | All actions |
| `StrategyHeader.tsx` | `metrics.healthScore`, `analysisRunning` | `runAnalysis()` |
| `StrategyMetricsBar.tsx` | `metrics` (all fields) | — |
| `LeanCanvasPanel.tsx` | `canvas`, `blockSuggestions` | — (delegates to CanvasBlock) |
| `CanvasBlock.tsx` | `canvas[blockKey]`, `blockSuggestions[blockKey]` | `synthesizeBlock(block)` |
| `CanvasBlockEditor.tsx` | `canvas[blockKey]`, `blockSuggestions[blockKey]`, `synthesizingBlock` | `updateBlock()`, `synthesizeBlock()` |
| `IntelligencePanel.tsx` | `recommendations`, `insights`, `opportunities` | — (delegates to cards) |
| `RecommendationCard.tsx` | single `StrategyRecommendation` | `approveRecommendation()` |
| `InsightCard.tsx` | single `StrategyInsight` | `dismissInsight()` |
| `OpportunityCard.tsx` | single `AutomationOpportunity` | `updateOpportunityStatus()` |
| `PendingApprovalsSection.tsx` | `recommendations.filter(r => r.approval_status === 'pending')` | — |
| `CanvasVersionHistory.tsx` | fetches via `strategyApi.getCanvasVersions()` | — |
| `StrategyAnalysisSheet.tsx` | `analysisRunning`, streamed agent results | — |
| `RoadmapExecutionPanel.tsx` | wizard step 5 roadmap data from `canvas.metadata.phases` | — |

### StrategyEnginePage (main orchestrator)

```typescript
export default function StrategyEnginePage() {
  const {
    canvas, insights, opportunities, recommendations, metrics,
    loading, error, analysisRunning, synthesizingBlock, blockSuggestions,
    createCanvas, runAnalysis, synthesizeBlock, updateBlock,
    approveRecommendation, dismissInsight, updateOpportunityStatus, refresh,
  } = useStrategyData(sessionId);

  if (loading) return <StrategySkeleton />;
  if (!canvas) return <StrategyEmptyState onCreateFromWizard={...} onCreateFresh={...} />;

  return (
    <div>
      <StrategyHeader metrics={metrics} onRunAnalysis={runAnalysis} analysisRunning={analysisRunning} />
      <StrategyMetricsBar metrics={metrics} />
      <div className="grid grid-cols-[1fr_0.6fr_0.75fr] gap-6">
        <LeanCanvasPanel canvas={canvas} blockSuggestions={blockSuggestions}
          onSynthesizeBlock={synthesizeBlock} onUpdateBlock={updateBlock}
          synthesizingBlock={synthesizingBlock} />
        <RoadmapExecutionPanel phases={canvas.metadata?.phases} />
        <IntelligencePanel
          recommendations={recommendations} insights={insights} opportunities={opportunities}
          onApprove={approveRecommendation} onDismissInsight={dismissInsight}
          onUpdateOpportunity={updateOpportunityStatus} />
      </div>
      {analysisRunning && <StrategyAnalysisSheet />}
    </div>
  );
}
```

---

## Step 9: End-to-End Verification

| # | Test | Expected |
|---|------|----------|
| 1 | `npx tsc --noEmit` | Type check passes |
| 2 | `npm run build` | Production build succeeds |
| 3 | Navigate to `/app/strategy` | Empty state renders |
| 4 | Click "Create from Wizard" | Canvas populates from wizard data (9 blocks) |
| 5 | Click a canvas block | Block editor expands with items |
| 6 | Click "Ask AI" on a block | AI suggestions appear (2-4 items) |
| 7 | Accept an AI suggestion | Item added to block, canvas version incremented |
| 8 | Click "▶ Run Analysis" | Progress sheet shows 5 agents, results appear |
| 9 | Approve a canvas_update recommendation | Canvas updates, version increments |
| 10 | Reject a recommendation | Removed from pending list |
| 11 | View version history | Sheet shows version timeline |
| 12 | Check sidebar | Strategy nav item with pending badge count |
| 13 | Mobile responsive | Tabs work, columns stack |
| 14 | Budget enforcement | Rate limit blocks excessive analysis runs |

---

## Data Flow Diagram

```
User clicks "Run Analysis"
  │
  ├─ Frontend: strategyApi.runAnalysis(canvasId, sessionId, token)
  │   └─ api('/strategy/analyze', { method: 'POST', body: {...}, token: 'use-fresh-token' })
  │       └─ fetch(BASE_URL + '/strategy/analyze', { Authorization: Bearer <fresh-jwt> })
  │
  ├─ Edge Function: POST /strategy/analyze
  │   ├─ requireAuth(header) → userId
  │   ├─ checkBudget(canvasId) → { allowed: true }
  │   ├─ Load: canvas + wizard_answers + clients + deals + ai_logs + memories
  │   ├─ Phase A: Promise.all([ synthesizer, detector, interpreter ])
  │   │   ├─ callGemini('strategy-synthesize', ...) → blockUpdates
  │   │   ├─ callGemini('opportunity-detect', ...) → opportunities
  │   │   └─ callGemini('metrics-interpret', ...) → insights
  │   ├─ Phase B: Promise.all([ roadmap, system ])
  │   │   ├─ callGemini('roadmap-suggest', ...) → suggestions
  │   │   └─ callGemini('system-recommend-strategy', ...) → systemSuggestions
  │   ├─ Phase C: resolveConflicts() → ranked results
  │   ├─ Persist: INSERT INTO strategy_recommendations, automation_opportunities, strategy_insights, strategy_actions
  │   ├─ Save memories: INSERT INTO strategy_agent_memory
  │   ├─ Update budget: UPDATE strategy_budgets
  │   └─ Return: { insights, opportunities, recommendations, metrics, agentResults }
  │
  └─ Frontend: useStrategyData hook
      ├─ setInsights(response.insights)
      ├─ setOpportunities(response.opportunities)
      ├─ setRecommendations(response.recommendations)
      ├─ setMetrics(response.metrics)
      └─ UI re-renders: Intelligence Panel shows new cards
```

---

## Key Patterns (Match Existing Codebase)

| Pattern | Reference | Usage in Strategy |
|---------|-----------|-------------------|
| Auth token | `CRMPipelinePage:24` — `const token = accessToken ? 'use-fresh-token' : undefined` | Same in useStrategyData |
| API object | `pipelineApi` in supabase.ts | `strategyApi` follows same shape |
| Edge route auth | `pipeline-routes.tsx:76` — `getUserFromToken(authHeader)` | All strategy routes use `requireAuth()` |
| Hono sub-router | `const pipeline = new Hono()` + `export { pipeline }` | `const strategy = new Hono()` + `export { strategy }` |
| Error handling | `pipeline-routes.tsx:12` — `errorResponse()` helper | Same pattern |
| DB access | `adminClient()` from `db.tsx` | Same — service role for all strategy ops |
| AI calls | `callGemini()` from `gemini.tsx` | Same — 5 agent calls + 1 per-block call |
| Type imports | `import type { ... } from './types/crm-pipeline'` | `import type { ... } from './types/strategy'` |
| Mount pattern | `app.route("/", pipeline)` in index.tsx | `app.route("/", strategy)` |

---

## Files Created / Modified Summary

| Action | File | What |
|--------|------|------|
| CREATE | `src/supabase/migrations/20260308120000_create_strategy_engine_tables.sql` | 12 tables + RLS + indexes |
| CREATE | `src/lib/types/strategy.ts` | All interfaces + types + constants |
| CREATE | `src/supabase/functions/server/strategy-routes.tsx` | 14 Hono routes (CRUD + AI) |
| CREATE | `src/lib/hooks/useStrategyData.ts` | Data hook with all state + actions |
| CREATE | `src/components/dashboard/strategy/StrategyEnginePage.tsx` | Main page orchestrator |
| CREATE | `src/components/dashboard/strategy/StrategyHeader.tsx` | Header with Run Analysis btn |
| CREATE | `src/components/dashboard/strategy/StrategyMetricsBar.tsx` | 5 metric cards |
| CREATE | `src/components/dashboard/strategy/LeanCanvasPanel.tsx` | 3×3 grid |
| CREATE | `src/components/dashboard/strategy/CanvasBlock.tsx` | Individual block |
| CREATE | `src/components/dashboard/strategy/CanvasBlockEditor.tsx` | Inline editor + AI suggestions |
| CREATE | `src/components/dashboard/strategy/IntelligencePanel.tsx` | Right column |
| CREATE | `src/components/dashboard/strategy/InsightCard.tsx` | Insight display |
| CREATE | `src/components/dashboard/strategy/OpportunityCard.tsx` | Opportunity with scores |
| CREATE | `src/components/dashboard/strategy/RecommendationCard.tsx` | Governed approval card |
| CREATE | `src/components/dashboard/strategy/PendingApprovalsSection.tsx` | Filtered pending list |
| CREATE | `src/components/dashboard/strategy/CanvasVersionHistory.tsx` | Version Sheet |
| CREATE | `src/components/dashboard/strategy/StrategyAnalysisSheet.tsx` | Progress overlay |
| CREATE | `src/components/dashboard/strategy/RoadmapExecutionPanel.tsx` | Phase cards |
| MODIFY | `src/lib/supabase.ts` | Add `strategyApi` object (~60 lines) |
| MODIFY | `src/supabase/functions/server/index.tsx` | Mount strategy routes (2 lines) |
| MODIFY | `src/components/dashboard/DashboardSidebar.tsx` | Add Strategy nav item |
| MODIFY | `src/components/dashboard/DashboardHeader.tsx` | Add route label |
