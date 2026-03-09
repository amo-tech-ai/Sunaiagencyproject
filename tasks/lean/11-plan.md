Context
The platform currently has a wizard → dashboard flow but no continuous strategy system. The Autonomous Strategy Engine adds a Lean Canvas + AI Intelligence layer that watches business signals (wizard data, CRM activity, AI usage) and generates actionable strategy updates, automation opportunities, and system recommendations — all governed by human-in-the-loop approval.
Audit status: All 10 critical findings addressed (event bus, agent memory, hypothesis tracking, expanded signals, robust health score, parallel execution, conflict resolution, recommendation limits, RBAC, cost controls).
Full Spec Location
/home/sk/sunv2/tasks/lean/:

01-architecture-spec.md — Core database (6 tables), types, 14 edge routes, 5 AI agents, governance
02-wireframes.md — 10 ASCII wireframes for all screens
03-agent-workflows.md — Agent data flows, trigger matrix, approval flows
04-user-journeys.md — 5 user journeys with state diagrams
05-content-data.md — Sample payloads, content data, color/icon reference
06-advanced-architecture.md — 6 additional tables, event bus, agent memory, parallel execution, conflict resolution, RBAC, cost controls

Database: 12 Tables
Core (6 tables)

lean_canvases — Interactive 9-block strategy model per project
lean_canvas_versions — Version history with snapshots
strategy_insights — AI-generated insights (auto-approved drafts)
automation_opportunities — Detected automation ideas with impact/ROI
strategy_recommendations — Governed recommendations (pending → approved)
strategy_actions — Engine execution audit log

Advanced (6 tables — from audit)

strategy_events — Event bus (logs CRM/wizard/milestone changes)
strategy_event_triggers — Configurable auto-trigger rules (disabled Phase 1)
strategy_agent_memory — Agent context persistence (hypotheses, prior outputs, decisions)
strategy_signals — Computed business signal snapshots per analysis
strategy_roles — RBAC (admin/strategist/viewer per canvas)
strategy_budgets — Token limits + rate limits + cooldowns

Implementation Steps
Step 1: Database Migration
Create src/supabase/migrations/20260308120000_create_strategy_engine_tables.sql

All 12 tables with RLS, indexes, constraints
Apply via Supabase MCP apply_migration

Step 2: TypeScript Types
Create src/lib/types/strategy.ts

All interfaces including StrategyMetrics with healthBreakdown (8 dimensions)
Agent memory types (hypothesis, assumption, decision, prior_output)
Budget types, signal types, event types
Pattern: follow src/lib/types/crm-pipeline.ts

Step 3: Frontend API
Add strategyApi object to src/lib/supabase.ts

14 methods matching 14 edge routes
Pattern: follow existing pipelineApi, financialApi

Step 4: Edge Function Routes
Create src/supabase/functions/server/strategy-routes.tsx

Hono sub-router with 14 routes
Mount in src/supabase/functions/server/index.tsx
Budget check middleware before AI routes
Event logging middleware for CRM/wizard mutations
Conflict resolution + ranking in /strategy/analyze
Pattern: follow pipeline-routes.tsx

Step 5: AI Agent Prompts (5 agents, parallel)

strategy-synthesize — canvas block updates
opportunity-detect — automation opportunities (max 5)
roadmap-suggest — roadmap changes
system-recommend-strategy — new AI systems
metrics-interpret — KPI interpretation + alerts
All receive agent memory context (prior outputs, hypotheses)
Phase A: 3 agents parallel → Phase B: 2 agents parallel → Phase C: conflict resolve
Total max recommendations: 7 per cycle

Step 6: Canvas Seeding Logic
POST /strategy/canvas with session_id:

Load wizard_answers steps 1-5
Map ai_results to 9 canvas blocks
Auto-assign creator as admin role
Create initial budget (500K tokens/month, 5 analyses/day)

Step 7: Frontend Components (13 files)
Create src/components/dashboard/strategy/:

StrategyEnginePage.tsx — Main page, data fetching, 3-column layout
StrategyHeader.tsx — Title, Run Analysis btn, budget display
StrategyMetricsBar.tsx — 5 metric cards + health breakdown
LeanCanvasPanel.tsx — 3×3 grid
CanvasBlock.tsx — Individual block with edit/AI-suggest
CanvasBlockEditor.tsx — Inline item editor
IntelligencePanel.tsx — Right column
InsightCard.tsx, OpportunityCard.tsx, RecommendationCard.tsx
PendingApprovalsSection.tsx — Filtered pending items
CanvasVersionHistory.tsx — Version timeline Sheet
StrategyAnalysisSheet.tsx — Analysis progress overlay

Step 8: Routing & Navigation

Route: { path: 'strategy', Component: StrategyEnginePage } in routes.tsx
Sidebar: { to: '/app/strategy', label: 'Strategy', icon: Brain } after AI Insights
Header: strategy: 'Strategy Engine' in ROUTE_LABELS

Step 9: Center Column — Roadmap (Read-Only)

RoadmapExecutionPanel.tsx — phases from wizard step 5
Read-only in Phase 1

Key Files to Modify

src/lib/supabase.ts — add strategyApi
src/supabase/functions/server/index.tsx — mount strategy routes
src/routes.tsx — add /app/strategy
src/components/dashboard/DashboardSidebar.tsx — add nav item
src/components/dashboard/DashboardHeader.tsx — add route label

Reference Patterns

src/supabase/functions/server/pipeline-routes.tsx — Hono route pattern
src/components/dashboard/financial/FinancialDashboardPage.tsx — complex dashboard
src/lib/types/crm-pipeline.ts — type file structure
src/supabase/migrations/20260307120300_create_crm_pipeline_tables.sql — migration
src/supabase/functions/server/gemini.tsx — callGemini() API

Verification

npx tsc --noEmit — type check
npm run build — production build
Navigate to /app/strategy — empty state
Create canvas from wizard → blocks populate
Run Analysis → parallel agents, results in <10s
Approve canvas_update → canvas updates, version increments
Budget check → rate limit enforced
View version history + agent memory
Mobile responsive — stacked columns with tabs