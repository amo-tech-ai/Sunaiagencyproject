Context
The platform currently has a wizard → dashboard flow but no continuous strategy system. The Autonomous Strategy Engine adds a Lean Canvas + AI Intelligence layer that watches business signals (wizard data, CRM activity, AI usage) and generates actionable strategy updates, automation opportunities, and system recommendations — all governed by human-in-the-loop approval.
Full spec written to /home/sk/sunv2/tasks/lean/:

01-architecture-spec.md — Database, types, edge functions, API, agent prompts
02-wireframes.md — ASCII wireframes for all screens
03-agent-workflows.md — Agent data flows, trigger matrix, approval flows
04-user-journeys.md — 5 user journeys with state diagrams
05-content-data.md — Sample payloads, content data, color/icon reference

Implementation Steps
Step 1: Database Migration
Create src/supabase/migrations/20260308120000_create_strategy_engine_tables.sql

6 tables: lean_canvases, lean_canvas_versions, strategy_insights, automation_opportunities, strategy_recommendations, strategy_actions
RLS enabled with authenticated CRUD policies
Indexes on canvas_id, session_id, status, created_at
Apply via Supabase MCP apply_migration

Step 2: TypeScript Types
Create src/lib/types/strategy.ts

Interfaces: CanvasBlockItem, LeanCanvas, CanvasVersion, StrategyInsight, AutomationOpportunity, StrategyRecommendation, StrategyAction, StrategyMetrics, StrategyDashboardData
Union types for CanvasBlockKey, InsightType, InsightStatus, OpportunityStatus, ApprovalStatus, RecommendationType
CANVAS_BLOCK_LABELS constant
Pattern: follow src/lib/types/crm-pipeline.ts

Step 3: Frontend API
Add strategyApi object to src/lib/supabase.ts

14 methods matching 14 edge routes
Pattern: follow existing pipelineApi, financialApi objects
Token handling via 'use-fresh-token' pattern

Step 4: Edge Function Routes
Create src/supabase/functions/server/strategy-routes.tsx

Hono sub-router with 14 routes (see spec)
Mount in src/supabase/functions/server/index.tsx
Canvas CRUD with version tracking
Governance: approve/reject recommendations
AI: /strategy/analyze (5 agents), /strategy/synthesize-block (1 agent)
Pattern: follow pipeline-routes.tsx

Step 5: AI Agent Prompts (5 agents)
Implement in strategy-routes.tsx via callGemini():

strategy-synthesize — suggests canvas block updates
opportunity-detect — finds automation opportunities
roadmap-suggest — suggests roadmap changes
system-recommend-strategy — recommends new AI systems
metrics-interpret — interprets KPIs and generates alerts


All use gemini-2.0-flash, cache TTLs from 2h to 48h

Step 6: Canvas Seeding Logic
In POST /strategy/canvas handler:

Load wizard_answers steps 1-5
Map ai_results fields to canvas blocks (see 03-agent-workflows.md §4)
Create initial version snapshot

Step 7: Frontend Components
Create src/components/dashboard/strategy/:
ComponentPurposeStrategyEnginePage.tsxMain page — data fetching, state, 3-column layoutStrategyHeader.tsxTitle, Run Analysis button, last-run timeStrategyMetricsBar.tsx5 metric cards rowLeanCanvasPanel.tsx3×3 grid of canvas blocksCanvasBlock.tsxIndividual block with edit/AI-suggestCanvasBlockEditor.tsxInline item editorIntelligencePanel.tsxRight column — insights + opportunities + recommendationsInsightCard.tsxInsight display cardOpportunityCard.tsxOpportunity with impact/ROI scoresRecommendationCard.tsxGoverned recommendation with approve/rejectPendingApprovalsSection.tsxFiltered pending itemsCanvasVersionHistory.tsxVersion timeline in SheetStrategyAnalysisSheet.tsxAnalysis progress overlay
Step 8: Routing & Navigation

Add route to src/routes.tsx: { path: 'strategy', Component: StrategyEnginePage }
Add to DashboardSidebar.tsx NAV_ITEMS: { to: '/app/strategy', label: 'Strategy', icon: Brain } (after AI Insights)
Add to DashboardHeader.tsx ROUTE_LABELS: strategy: 'Strategy Engine'

Step 9: Center Column — Roadmap (Read-Only)
RoadmapExecutionPanel.tsx — shows wizard step 5 roadmap phases

Phase cards with progress bars
Task lists per phase
Read-only in Phase 1 (no roadmap mutation)

Key Files to Modify

src/lib/supabase.ts — add strategyApi object
src/supabase/functions/server/index.tsx — mount strategy routes
src/routes.tsx — add /app/strategy route
src/components/dashboard/DashboardSidebar.tsx — add nav item
src/components/dashboard/DashboardHeader.tsx — add route label

Reference Patterns (reuse, don't reinvent)

src/supabase/functions/server/pipeline-routes.tsx — Hono route pattern
src/components/dashboard/financial/FinancialDashboardPage.tsx — complex dashboard page
src/components/dashboard/crm/CRMPipelinePage.tsx — data fetching + optimistic updates
src/lib/types/crm-pipeline.ts — type file structure
src/supabase/migrations/20260307120300_create_crm_pipeline_tables.sql — migration pattern
src/supabase/functions/server/gemini.tsx — callGemini() API

Verification

npx tsc --noEmit — type check passes
npm run build — production build succeeds
Navigate to /app/strategy — empty state renders
Create canvas from wizard data — blocks populate
Run Analysis — 5 agents return results, insights/opportunities/recommendations appear
Approve a canvas_update recommendation — canvas updates, version increments
View version history — shows all changes
Mobile responsive — columns stack, tabs work