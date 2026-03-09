# Strategy Engine — Advanced Architecture Addendum

> Addresses 10 audit findings to bring architecture from 85% → 97% production ready
> Adds: event bus, agent memory, hypothesis modeling, conflict resolution,
> cost controls, expanded signals, security governance, recommendation limits

---

## 1. Event-Driven Architecture (Audit #1)

### Problem
Phase 1 is purely manual ("click Run Analysis"). Real strategy engines react to events.

### Solution: Strategy Event Bus

New table: `strategy_events`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | gen_random_uuid() |
| canvas_id | uuid null FK | → lean_canvases(id) SET NULL |
| event_type | text | Enum of event types |
| source_table | text | Which table triggered this |
| source_id | text | Record ID that changed |
| payload | jsonb default '{}' | Event data snapshot |
| processed | boolean default false | Has engine consumed this? |
| processed_at | timestamptz null | When processed |
| created_at | timestamptz | now() |

**Event Types:**
```
wizard_completed          — wizard session status → completed
deal_stage_changed        — crm_deals stage_id updated
deal_created              — new crm_deal inserted
deal_stale               — deal days_in_stage > 14
client_added              — new client inserted
client_health_changed     — client health_score changed >10pts
interaction_logged        — crm_interaction inserted
milestone_reached         — milestone completed
support_volume_spike      — interaction count > threshold
readiness_score_changed   — readiness delta > 10pts
analysis_completed        — strategy analysis finished
canvas_updated            — lean_canvas blocks changed
```

**Indexes:** (processed, created_at), (event_type, processed), (canvas_id)

### Event Trigger Configuration

New table: `strategy_event_triggers`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | gen_random_uuid() |
| event_type | text | Which event |
| agent_name | text | Which agent to trigger |
| enabled | boolean default true | On/off switch |
| cooldown_minutes | integer default 60 | Min time between runs |
| last_triggered_at | timestamptz null | Prevents flooding |
| created_at | timestamptz | now() |

**Unique:** (event_type, agent_name)

### Default Trigger Rules

| Event | Agents Triggered | Cooldown |
|-------|-----------------|----------|
| wizard_completed | strategy-synthesize | 0 (immediate) |
| deal_stage_changed | opportunity-detect, metrics-interpret | 60 min |
| deal_stale | opportunity-detect | 120 min |
| client_added | strategy-synthesize | 30 min |
| interaction_logged | metrics-interpret | 180 min |
| support_volume_spike | opportunity-detect, strategy-synthesize | 60 min |
| readiness_score_changed | all 5 agents | 0 (immediate) |

### Phase 1 Implementation
- **Tables created** but triggers disabled (enabled = false)
- Events are still **logged** when data changes (via edge function middleware)
- "Unprocessed events" count shown in metrics bar as "Pending Signals: 12"
- User can see events but must manually click Run Analysis
- Phase 2: enable triggers → agents auto-run

### Event Logging Middleware (edge functions)

Add to CRM routes, wizard routes:
```typescript
async function logStrategyEvent(
  canvasId: string | null,
  eventType: string,
  sourceTable: string,
  sourceId: string,
  payload: Record<string, unknown>
) {
  await adminClient().from('strategy_events').insert({
    canvas_id: canvasId,
    event_type: eventType,
    source_table: sourceTable,
    source_id: sourceId,
    payload,
  });
}
```

Called after CRM mutations:
```typescript
// In pipeline-routes.tsx, after deal stage update:
await logStrategyEvent(null, 'deal_stage_changed', 'crm_deals', dealId, {
  old_stage: previousStageId,
  new_stage: newStageId,
  deal_value: deal.value,
});
```

---

## 2. Strategy Context Memory (Audit #2 + #3)

### Problem
Agents are stateless. They don't remember prior recommendations, hypotheses, or decisions.

### Solution: Agent Memory + Hypothesis Tracking

New table: `strategy_agent_memory`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | gen_random_uuid() |
| canvas_id | uuid FK | → lean_canvases(id) CASCADE |
| agent_name | text | Which agent owns this memory |
| memory_type | text | prior_output / hypothesis / assumption / decision |
| content | jsonb | Structured memory content |
| relevance_score | numeric default 1.0 | Decay over time (0-1) |
| superseded_by | uuid null FK | → self (if updated) |
| created_at | timestamptz | now() |
| expires_at | timestamptz null | Auto-expire old memories |

**Indexes:** (canvas_id, agent_name), (memory_type), (relevance_score DESC)

### Memory Types

**prior_output** — What the agent recommended last time:
```json
{
  "run_id": "action-uuid",
  "recommendations": ["added WhatsApp to channels", "suggested lead scoring"],
  "key_reasoning": "CRM data showed 60% WhatsApp interactions",
  "confidence": 0.88
}
```

**hypothesis** — Strategic hypotheses the engine is tracking:
```json
{
  "hypothesis": "WhatsApp will become primary support channel",
  "evidence_for": ["58% interaction share", "growing trend 3 weeks"],
  "evidence_against": ["email still preferred for complex issues"],
  "confidence": 0.82,
  "status": "active",
  "first_proposed": "2026-03-08",
  "last_validated": "2026-03-15"
}
```

**assumption** — Business assumptions being monitored:
```json
{
  "assumption": "AI chatbot can handle 70% of support queries",
  "basis": "Industry benchmark for fashion e-commerce",
  "risk_if_wrong": "Support team burnout if automation rate lower",
  "validation_metric": "automation_rate",
  "target_value": 0.70,
  "current_value": 0.45,
  "status": "unvalidated"
}
```

**decision** — Strategic decisions made and their rationale:
```json
{
  "decision": "Prioritize WhatsApp automation over email",
  "rationale": "Higher volume, higher customer satisfaction impact",
  "made_by": "user",
  "recommendation_id": "rec-uuid",
  "outcome_tracking": {
    "metric": "support_response_time",
    "baseline": "45 min",
    "target": "< 5 min",
    "current": null
  }
}
```

### How Agents Use Memory

Each agent's prompt now includes a **memory context section**:

```
## Prior Context (Agent Memory)

### Your Previous Recommendations (last 3 runs):
- [Mar 8] Suggested adding WhatsApp to Channels block (approved)
- [Mar 1] Suggested lead scoring system (rejected — too early)
- [Feb 22] Updated Problem block with data silos (approved)

### Active Hypotheses:
- WhatsApp becoming primary channel (confidence: 0.82, evidence: growing)
- Cart recovery automation will yield 500% ROI (confidence: 0.65, unvalidated)

### Tracked Assumptions:
- AI chatbot handles 70% of queries (current: 45%, gap exists)

### Decisions Made:
- Prioritized WhatsApp over email automation (Mar 8)

IMPORTANT: Do NOT repeat recommendations that were recently rejected.
Do NOT contradict active decisions unless new evidence is compelling (>0.85 confidence).
Validate or update hypotheses based on new data.
```

### Memory Lifecycle

```
Agent runs → generates output
  → Save output as prior_output memory
  → Extract hypotheses from reasoning → save as hypothesis
  → Check existing assumptions against new data → update confidence
  → On recommendation approval → save as decision memory

Decay: relevance_score *= 0.95 per week
Expire: memories older than 90 days with relevance < 0.3
Supersede: new hypothesis on same topic supersedes old one
```

---

## 3. Expanded Data Sources (Audit #4)

### Problem
Only wizard_answers, crm_deals, clients, ai_run_logs. Missing key business signals.

### Solution: Signal Aggregation Layer

New table: `strategy_signals`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | gen_random_uuid() |
| canvas_id | uuid null FK | → lean_canvases(id) SET NULL |
| signal_category | text | category of signal |
| signal_name | text | specific metric name |
| value | numeric | current value |
| previous_value | numeric null | for delta calculation |
| unit | text default '' | %, count, $, hours, etc. |
| trend | text default 'stable' | up / down / stable / spike |
| source | text | Where this signal comes from |
| collected_at | timestamptz | now() |

**Signal Categories:**
```
crm           — deal count, pipeline value, win rate, avg cycle time
support       — ticket volume, response time, resolution rate, channel mix
automation    — automation rate, AI call count, cache hit rate, error rate
financial     — revenue, costs, margins, outstanding invoices
engagement    — wizard completions, login frequency, feature usage
project       — task completion rate, milestone progress, phase duration
```

### Signal Collection (Computed on /strategy/analyze)

Before running agents, the analyze endpoint computes signals from existing tables:

```typescript
async function collectSignals(canvasId: string, userId: string) {
  const db = adminClient();
  const signals: Signal[] = [];

  // CRM signals
  const { data: deals } = await db.from('crm_deals').select('*').eq('owner_id', userId);
  signals.push(
    { category: 'crm', name: 'total_pipeline_value', value: sumValues(deals), unit: '$' },
    { category: 'crm', name: 'deal_count', value: deals.length, unit: 'count' },
    { category: 'crm', name: 'stale_deal_count', value: deals.filter(d => d.isStale).length, unit: 'count' },
    { category: 'crm', name: 'avg_deal_cycle_days', value: avgCycleDays(deals), unit: 'days' },
  );

  // Support signals (from crm_interactions)
  const { data: interactions } = await db.from('crm_interactions').select('*')
    .gte('created_at', thirtyDaysAgo());
  signals.push(
    { category: 'support', name: 'interaction_volume', value: interactions.length, unit: 'count' },
    { category: 'support', name: 'channel_mix_whatsapp', value: pctByType(interactions, 'whatsapp'), unit: '%' },
    { category: 'support', name: 'channel_mix_email', value: pctByType(interactions, 'email'), unit: '%' },
  );

  // Automation signals (from ai_run_logs)
  const { data: aiLogs } = await db.from('ai_run_logs').select('*')
    .gte('created_at', thirtyDaysAgo());
  signals.push(
    { category: 'automation', name: 'ai_call_count', value: aiLogs.length, unit: 'count' },
    { category: 'automation', name: 'ai_success_rate', value: successRate(aiLogs), unit: '%' },
    { category: 'automation', name: 'avg_response_ms', value: avgDuration(aiLogs), unit: 'ms' },
  );

  // Financial signals (from financial tables if available)
  // Project signals (from wizard roadmap data)
  // Engagement signals (from wizard_sessions, login activity)

  // Upsert signals with previous_value tracking
  for (const s of signals) {
    const prev = await db.from('strategy_signals')
      .select('value').eq('canvas_id', canvasId)
      .eq('signal_name', s.name).order('collected_at', { ascending: false }).limit(1);

    await db.from('strategy_signals').insert({
      canvas_id: canvasId,
      signal_category: s.category,
      signal_name: s.name,
      value: s.value,
      previous_value: prev?.data?.[0]?.value ?? null,
      unit: s.unit,
      trend: computeTrend(s.value, prev?.data?.[0]?.value),
      source: 'computed',
    });
  }

  return signals;
}
```

### Agents Receive Signals

Each agent prompt includes a **Signals** section:
```
## Current Business Signals (collected just now)

CRM:
- Pipeline value: $142,000 (▲ +12% vs last analysis)
- Deal count: 8 (stable)
- Stale deals: 2 (▲ new)
- Avg cycle: 18 days (▲ +4 days slower)

Support:
- Volume: 156 interactions/month (▲ +35%)
- WhatsApp: 58% (▲ was 25%)
- Email: 22% (▼ was 45%)

Automation:
- AI calls: 342/month (▲ +20%)
- Success rate: 94% (stable)
- Cache hit: 67% (▲ improving)
```

---

## 4. Robust Health Score (Audit #5)

### Problem
Formula based only on canvas/readiness/pipeline/automation/freshness. Doesn't reflect actual business performance.

### Solution: Multi-Dimensional Health Score

```
Health Score = weighted average of 8 dimensions

Dimension                Weight  Source                    Formula
─────────────────────────────────────────────────────────────────────
Strategy Clarity          15%   Canvas completeness       blocks_filled / 9 * 100
AI Readiness              15%   Wizard step 4             readiness.overallScore
Pipeline Health           15%   CRM deals                 (non_stale / total) * win_rate_factor
Automation Progress       15%   Systems implemented       implemented / recommended * 100
Revenue Trajectory        10%   Financial signals         revenue_trend_direction * score
Operational Efficiency    10%   Support + automation      (automation_rate * response_time_score)
Engagement Quality        10%   Login + wizard + usage    composite of activity signals
Strategy Freshness        10%   Last analysis date        max(0, 100 - days_since * 10)
```

### Score Components in StrategyMetrics

```typescript
export interface StrategyMetrics {
  healthScore: number;                // Composite 0-100
  healthBreakdown: {
    strategyClarity: number;          // Canvas completeness
    aiReadiness: number;              // From wizard step 4
    pipelineHealth: number;           // Deal velocity + win rate
    automationProgress: number;       // Systems coverage
    revenueTrajectory: number;        // Financial trend
    operationalEfficiency: number;    // Support + automation rates
    engagementQuality: number;        // Platform usage
    strategyFreshness: number;        // Analysis recency
  };
  automationCoverage: number;
  insightCount: number;
  pendingApprovals: number;
  pendingSignals: number;             // Unprocessed events
  opportunitiesDetected: number;
  totalROIEstimate: string;
  canvasCompleteness: number;
  tokenBudgetUsed: number;           // Cost control
  tokenBudgetRemaining: number;      // Cost control
}
```

---

## 5. Parallel Agent Execution (Audit #6)

### Problem
5 agents run sequentially → 10-25s total latency.

### Solution: Parallel with Dependency Ordering

```
Phase A (parallel — no dependencies):
  ┌─────────────────────────┐
  │  Promise.all([          │
  │    strategySynthesizer, │  ← needs canvas + wizard + CRM
  │    opportunityDetector, │  ← needs canvas + wizard + CRM
  │    metricsInterpreter,  │  ← needs signals + pipeline
  │  ])                     │
  └───────────┬─────────────┘
              │ ~3-5s
              ▼
Phase B (parallel — depends on Phase A results):
  ┌─────────────────────────┐
  │  Promise.all([          │
  │    roadmapPlanner,      │  ← needs Phase A opps + canvas
  │    systemRecommender,   │  ← needs Phase A opps + canvas
  │  ])                     │
  └───────────┬─────────────┘
              │ ~2-4s
              ▼
Phase C (sequential — ranking):
  conflictResolver()          ← resolves conflicts from all outputs
              │ ~0.5s
              ▼
  persistResults()            ← batch insert all results
```

**Total: 5-10s** (down from 10-25s sequential)

### Implementation Pattern

```typescript
// Phase A: Independent agents in parallel
const [synthResult, oppResult, metricsResult] = await Promise.all([
  callGemini('strategy-synthesize', synthPrompt, synthData, synthInput, sessionId),
  callGemini('opportunity-detect', oppPrompt, oppData, oppInput, sessionId),
  callGemini('metrics-interpret', metPrompt, metData, metInput, sessionId),
]);

// Phase B: Agents that need Phase A outputs
const enrichedContext = {
  ...baseContext,
  detectedOpportunities: oppResult.opportunities,
  synthesisResults: synthResult.blockUpdates,
  currentMetrics: metricsResult,
};

const [roadmapResult, systemResult] = await Promise.all([
  callGemini('roadmap-suggest', roadPrompt, roadData, { ...roadInput, opps: oppResult }, sessionId),
  callGemini('system-recommend-strategy', sysPrompt, sysData, { ...sysInput, opps: oppResult }, sessionId),
]);

// Phase C: Conflict resolution + ranking
const rankedResults = resolveConflicts(synthResult, oppResult, roadmapResult, systemResult);

// Persist all
await persistStrategyResults(canvasId, rankedResults, metricsResult);
```

---

## 6. Conflict Resolution & Ranking (Audit #7)

### Problem
Two agents may produce contradicting recommendations.

### Solution: Strategy Arbitration Layer

After all agents complete, a lightweight ranking step:

```typescript
function resolveConflicts(
  synthesis: SynthResult,
  opportunities: OppResult,
  roadmap: RoadmapResult,
  systems: SystemResult
): RankedResults {
  const allRecommendations = [
    ...synthesis.blockUpdates.map(r => ({ ...r, source: 'synthesizer', type: 'canvas_update' })),
    ...roadmap.suggestions.map(r => ({ ...r, source: 'roadmap-planner', type: 'roadmap_change' })),
    ...systems.systemSuggestions.map(r => ({ ...r, source: 'system-recommender', type: 'new_system' })),
  ];

  // 1. Detect conflicts (same block, opposite actions)
  const conflicts = detectConflicts(allRecommendations);

  // 2. For each conflict, keep higher-confidence recommendation
  const resolved = conflicts.map(({ a, b }) => {
    const winner = (a.confidence ?? 0) > (b.confidence ?? 0) ? a : b;
    const loser = winner === a ? b : a;
    return {
      kept: { ...winner, conflict_note: `Preferred over: ${loser.title}` },
      dropped: { ...loser, conflict_resolved: true, dropped_reason: 'lower confidence' },
    };
  });

  // 3. Sort all by: impact_score DESC, confidence DESC
  const ranked = allRecommendations
    .filter(r => !resolved.some(c => c.dropped.id === r.id))
    .sort((a, b) => (b.impact_score ?? 50) - (a.impact_score ?? 50));

  // 4. Cap at MAX_RECOMMENDATIONS (see §8)
  return {
    recommendations: ranked.slice(0, MAX_RECOMMENDATIONS_PER_CYCLE),
    conflicts: resolved,
    dropped: ranked.slice(MAX_RECOMMENDATIONS_PER_CYCLE),
  };
}

function detectConflicts(recs: Recommendation[]): Conflict[] {
  const conflicts: Conflict[] = [];
  // Same canvas block with opposite actions (add vs remove)
  // Same roadmap phase with conflicting changes
  // Same system recommended and not-recommended
  for (let i = 0; i < recs.length; i++) {
    for (let j = i + 1; j < recs.length; j++) {
      if (isConflicting(recs[i], recs[j])) {
        conflicts.push({ a: recs[i], b: recs[j] });
      }
    }
  }
  return conflicts;
}
```

### Conflict Types Detected

| Conflict | Example | Resolution |
|----------|---------|------------|
| Block conflict | Agent A adds to Problem, Agent B removes from Problem | Higher confidence wins |
| Priority conflict | Agent A: "prioritize WhatsApp", Agent B: "prioritize CRM" | Higher impact score wins |
| System conflict | Agent A: "add chatbot", Agent B: "replace chatbot" | User decides (both shown with conflict flag) |
| Roadmap conflict | Agent A: "add Phase 2.5", Agent B: "extend Phase 2" | Higher confidence wins, other archived |

---

## 7. Recommendation Limits (Audit #8)

### Constants

```typescript
const MAX_RECOMMENDATIONS_PER_CYCLE = 7;    // Total across all agents
const MAX_OPPORTUNITIES_PER_CYCLE = 5;       // Top 5 by impact
const MAX_INSIGHTS_PER_CYCLE = 5;            // Top 5 by priority
const MAX_BLOCK_SUGGESTIONS = 4;             // Per synthesize-block call
```

### Agent Prompts Include Limits

Each agent system prompt ends with:
```
CONSTRAINTS:
- Return at most 3 recommendations (highest impact only)
- Each recommendation must have impact_score > 40
- Do not suggest changes with confidence < 0.6
- If no strong recommendations exist, return empty array
```

### Overflow Handling

Recommendations beyond the limit are stored in `strategy_recommendations` with `approval_status: 'archived'`. They can be viewed in a "More suggestions" expandable section.

---

## 8. Security Governance (Audit #9)

### Role-Based Access

New table: `strategy_roles`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | gen_random_uuid() |
| user_id | uuid | auth.uid() |
| canvas_id | uuid FK | → lean_canvases(id) CASCADE |
| role | text | admin / strategist / viewer |
| created_at | timestamptz | now() |

**Unique:** (user_id, canvas_id)

### Permission Matrix

| Action | admin | strategist | viewer |
|--------|-------|-----------|--------|
| View canvas | ✅ | ✅ | ✅ |
| Edit canvas blocks | ✅ | ✅ | ❌ |
| Run analysis | ✅ | ✅ | ❌ |
| Ask AI on block | ✅ | ✅ | ❌ |
| Approve recommendations | ✅ | ❌ | ❌ |
| Reject recommendations | ✅ | ❌ | ❌ |
| Revert canvas version | ✅ | ❌ | ❌ |
| View insights | ✅ | ✅ | ✅ |
| Dismiss insights | ✅ | ✅ | ❌ |
| Configure triggers | ✅ | ❌ | ❌ |

### RLS Policy Enhancement

```sql
-- Canvas: only users with a role can access
create policy "strategy_role_select" on lean_canvases
  for select using (
    exists (
      select 1 from strategy_roles
      where strategy_roles.canvas_id = lean_canvases.id
      and strategy_roles.user_id = (select auth.uid())
    )
    or lean_canvases.user_id = (select auth.uid())
  );

-- Recommendations: only admin can approve
-- Enforced at edge function level via requireAuth + role check
```

### Phase 1 Implementation
- Canvas creator is auto-assigned `admin` role
- Single-user mode: creator has full access
- Phase 2: invite team members with strategist/viewer roles

---

## 9. Cost Control (Audit #10)

### Token Budget System

New table: `strategy_budgets`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | gen_random_uuid() |
| canvas_id | uuid FK | → lean_canvases(id) CASCADE |
| monthly_token_limit | integer default 500000 | Max tokens/month |
| tokens_used_this_month | integer default 0 | Running total |
| analysis_count_this_month | integer default 0 | Run count |
| max_analyses_per_day | integer default 5 | Rate limit |
| analyses_today | integer default 0 | Daily counter |
| last_analysis_at | timestamptz null | Cooldown tracking |
| min_analysis_interval_minutes | integer default 30 | Minimum gap |
| budget_month | text | '2026-03' format for reset |
| created_at | timestamptz | now() |
| updated_at | timestamptz | now() |

### Budget Enforcement

```typescript
async function checkBudget(canvasId: string): Promise<{ allowed: boolean; reason?: string }> {
  const db = adminClient();
  const { data: budget } = await db.from('strategy_budgets')
    .select('*').eq('canvas_id', canvasId).single();

  if (!budget) return { allowed: true }; // No budget = unlimited

  // Reset monthly counters if new month
  const currentMonth = new Date().toISOString().slice(0, 7);
  if (budget.budget_month !== currentMonth) {
    await db.from('strategy_budgets').update({
      tokens_used_this_month: 0,
      analysis_count_this_month: 0,
      budget_month: currentMonth,
    }).eq('id', budget.id);
    return { allowed: true };
  }

  // Check token budget
  if (budget.tokens_used_this_month >= budget.monthly_token_limit) {
    return { allowed: false, reason: `Monthly token budget exhausted (${budget.monthly_token_limit} tokens)` };
  }

  // Check daily rate limit
  if (budget.analyses_today >= budget.max_analyses_per_day) {
    return { allowed: false, reason: `Daily analysis limit reached (${budget.max_analyses_per_day}/day)` };
  }

  // Check cooldown
  if (budget.last_analysis_at) {
    const minutesSince = (Date.now() - new Date(budget.last_analysis_at).getTime()) / 60000;
    if (minutesSince < budget.min_analysis_interval_minutes) {
      const wait = Math.ceil(budget.min_analysis_interval_minutes - minutesSince);
      return { allowed: false, reason: `Cooldown: wait ${wait} minutes` };
    }
  }

  return { allowed: true };
}
```

### Budget Display in UI

Metrics bar shows token usage:
```
Tokens: 124K / 500K (25% used)
Analyses: 3/5 today
```

When budget exhausted, Run Analysis button disabled with tooltip explaining why.

---

## 10. Scalability Considerations

### For 100+ Clients

| Concern | Solution |
|---------|----------|
| Agent calls per week | Budget system caps at 5/day per canvas |
| Database growth | strategy_signals auto-expire after 90 days |
| Memory table growth | Relevance decay + 90-day expiry |
| Event log growth | processed events archived after 30 days |
| Cache effectiveness | callGemini cache prevents duplicate calls |
| Concurrent analyses | Postgres advisory locks per canvas_id |

### Postgres Advisory Lock

```typescript
// Prevent concurrent analysis on same canvas
const lockKey = hashToInt(canvasId);
const { data: locked } = await db.rpc('pg_try_advisory_lock', { key: lockKey });
if (!locked) {
  return c.json({ error: 'Analysis already running for this canvas' }, 409);
}
try {
  // ... run analysis
} finally {
  await db.rpc('pg_advisory_unlock', { key: lockKey });
}
```

---

## Summary: New Tables (4 additional)

| Table | Purpose | Phase |
|-------|---------|-------|
| strategy_events | Event bus for business signals | 1 (log only) |
| strategy_event_triggers | Configurable auto-trigger rules | 1 (disabled) |
| strategy_agent_memory | Agent context persistence | 1 |
| strategy_signals | Computed business signal snapshots | 1 |
| strategy_roles | RBAC for canvas access | 1 (single-user) |
| strategy_budgets | Token + rate limit budgets | 1 |

**Total tables: 12** (6 original + 6 new)

---

## Updated Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA MONITORING LAYER                         │
│                                                                  │
│  wizard_answers  │  clients   │  crm_deals    │  ai_run_logs    │
│  wizard_sessions │  contacts  │  interactions  │  ai_cache       │
│  projects        │  tasks     │  milestones    │  activities     │
│                                                                  │
│  → strategy_signals (computed snapshots)                        │
│  → strategy_events (event bus — logged for Phase 2 triggers)    │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │  Budget Check       │
                    │  (strategy_budgets) │
                    └──────────┬──────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│              STRATEGY INTERPRETATION LAYER                       │
│                                                                  │
│  strategy_agent_memory (loaded per agent for continuity)        │
│                                                                  │
│  Phase A (parallel):                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Strategy     │  │ Opportunity  │  │  Metrics     │          │
│  │  Synthesizer  │  │ Detector     │  │  Interpreter │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│  Phase B (parallel, depends on A):                              │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │  Roadmap     │  │  System      │                             │
│  │  Planner     │  │  Recommender │                             │
│  └──────┬───────┘  └──────┬───────┘                             │
│         │                 │                                      │
│  Phase C:                                                        │
│  ┌──────────────────────────────────┐                            │
│  │  Conflict Resolver + Ranker     │                            │
│  │  (max 7 recs, max 5 opps)      │                            │
│  └──────────────┬──────────────────┘                            │
│                 │                                                │
│  Save memories → strategy_agent_memory                          │
└─────────────────┼────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DECISION LAYER                              │
│                                                                  │
│  ┌─ Auto-Approved ────────────┐ ┌─ Needs Approval (RBAC) ────┐│
│  │                             │ │                             ││
│  │  strategy_insights (draft)  │ │  strategy_recommendations  ││
│  │  automation_opps (detected) │ │  (canvas_update)           ││
│  │  metric alerts              │ │  (roadmap_change)          ││
│  │  hypothesis updates         │ │  (new_system)             ││
│  │  signal snapshots           │ │  (task_creation)          ││
│  │                             │ │                             ││
│  │  strategy_roles: any role   │ │  strategy_roles: admin only││
│  └─────────────────────────────┘ └─────────────────────────────┘│
└──────────────────────────────────────────────────────────────────┘
```

---

## Updated Phase 1 Scope (with audit fixes)

| Day | Deliverable | Includes Audit Fix |
|-----|------------|-------------------|
| 1 | Migration: 12 tables (6 core + 6 advanced) | #1 events, #2 memory, #4 signals, #9 roles, #10 budgets |
| 2 | Types + API: strategy.ts + strategyApi | #5 health breakdown, #8 limits |
| 3 | Edge routes: CRUD + governance + events middleware | #9 RBAC, #10 budget check |
| 4 | AI agents: 5 prompts with memory context | #2 hypothesis, #3 memory, #8 limits |
| 5 | Analysis orchestration: parallel + conflict resolution | #6 parallel, #7 conflicts |
| 6 | Frontend: StrategyEnginePage + 13 components | #5 health breakdown, pending signals |
| 7 | Integration: routes, sidebar, polish | End-to-end verification |
