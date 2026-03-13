# Agency Agents Integration — Progress Tracker

> **Project**: Sun AI Agency — Agency Agents Feature
> **Last Updated**: 2026-03-12
> **Supabase Ref**: `necxcwhuzylsumlkkmlk` (56 tables live)
> **Edge Function**: `make-server-283466b6` (Hono server, 13 route modules)
> **Models**: `gemini-3-flash-preview` (primary), `gemini-3.1-pro-preview`, `gemini-3.1-flash-lite-preview`, `gemini-3.1-flash-image-preview`

---

## Build Phase Overview

| Phase | Prompts | Focus | Status |
|-------|---------|-------|--------|
| **CORE** (Database) | 01-05 | Schema, relationships, indexes, RLS, triggers | 100% |
| **MVP** (Backend) | 06-12 | Agent loader, routes, insights, CRM, scripts | 100% |
| **ADVANCED** (Frontend) | 13-18 | Wizard, dashboard, catalog, detail, runner, CRM UI | 80% |
| **DEPLOY** | 19 | Setup plan, deployment, verification | 100% |

---

## Implementation Prompts (19 total)

### CORE — Database Layer (Prompts 01-05)

| # | Prompt | Description | Status | Output File(s) | Deployed |
|---|--------|-------------|--------|-----------------|----------|
| 01 | Supabase Schema | Create 7 agent tables (agent_catalog, agent_assignments, agent_runs, insight_cards, agent_team_templates, agent_team_templates_agents, deal_scores) | Done | `supabase/migrations/20260312120000_create_agent_tables.sql` | Yes |
| 02 | Table Relationships | Foreign keys and constraints between agent tables | Done | Same migration file | Yes |
| 03 | Performance Indexes | B-tree indexes on agent_catalog(division), agent_runs(user_id), insight_cards(project_id, status), deal_scores(deal_id) | Done | Same migration file | Yes |
| 04 | RLS Policies | Public read on agent_catalog, user-scoped on agent_runs, project-owner scoped on agent_assignments and insight_cards | Done | Same migration file | Yes |
| 05 | Triggers | Realtime broadcast on insight_cards, auto-update `updated_at` timestamps | Done | Same migration file | Yes |

### MVP — Backend Layer (Prompts 06-12)

| # | Prompt | Description | Status | Output File(s) | Deployed |
|---|--------|-------------|--------|-----------------|----------|
| 06 | Agent Loader | 4-layer prompt compiler: `extractExcerpt`, `selectAgents`, `compilePrompt`, `buildRoutePrompt` | Done | `src/supabase/functions/server/agent-loader.tsx` (428 lines) | Yes |
| 07 | Agent Routes | 6 endpoints: catalog list, detail, run, team CRUD | Done | `src/supabase/functions/server/agent-routes.tsx` (361 lines) | Yes |
| 08 | Insight Routes | GET insights, PATCH status, POST generate (multi-agent parallel via Promise.allSettled) | Done | `src/supabase/functions/server/insight-routes.tsx` (274 lines) | Yes |
| 09 | AI Routes Wiring | Refactored 4 wizard routes to use `buildRoutePrompt` (industry-diagnostics, system-recommendations, readiness-score, generate-roadmap) | Done | `src/supabase/functions/server/ai-routes.tsx` (630 lines) | Yes |
| 10 | CRM Deal Scoring | POST `/crm/deals/:id/score` — Pipeline Analyst agent scores deals 0-100 with 5-factor breakdown | Done | `src/supabase/functions/server/crm-routes.tsx` (383 lines) | Yes |
| 11 | Parse Agents Script | Scans `agency/` dir, parses 131 .md files, upserts to agent_catalog, generates `agent-index.json` | Done | `scripts/parse-agents.ts` (318 lines) | N/A (build-time) |
| 12 | Team Templates Seed | Seeds 17 team templates with 73 agent roles across 7 industries | Done | `scripts/seed-team-templates.ts` (369 lines) | N/A (build-time) |

### ADVANCED — Frontend Layer (Prompts 13-18)

| # | Prompt | Description | Status | Output File(s) | Notes |
|---|--------|-------------|--------|-----------------|-------|
| 13 | Wizard Agent Components | `AITeamSection`, `AgentTeamCard`, `AgentTeamGrid` for wizard Steps 4-5 | 70% | `StepExecutiveSummary.tsx`, `StepLaunchProject.tsx` | Logic exists inline; needs extraction into 3 reusable components |
| 14 | Dashboard Agent Widgets | `AgentTeamWidget`, `InsightsFeed`, enhanced `InsightCard` with agent badges | 60% | `AgentTeamWidget.tsx`, `InsightsPage.tsx` | Widget exists; InsightsFeed widget missing; agent attribution badges missing |
| 15 | Agent Catalog Page | `/app/agents/catalog` — Division tabs, search, pagination, agent cards | 100% | `src/components/dashboard/agents/AgentCatalogPage.tsx` | Fully implemented |
| 16 | Agent Detail Page | `/app/agents/:slug` — Profile, tabs (About, Capabilities, Use Cases, History) | 100% | `src/components/dashboard/agents/AgentDetailPage.tsx` | Fully implemented |
| 17 | Agent Runner Page | `/app/agents/:slug/run` — Split-pane input/output, format selector, run button | 100% | `src/components/dashboard/agents/AgentRunnerPage.tsx` | Fully implemented |
| 18 | CRM Deal Scoring UI | `DealHealthBar`, `DealScoreCard` modal with factor breakdown | 50% | `src/components/dashboard/crm/DealCard.tsx` | Health score inline in DealCard; DealScoreCard modal + Re-score button missing |

### DEPLOY — Setup & Verification (Prompt 19)

| # | Prompt | Description | Status | Output File(s) | Deployed |
|---|--------|-------------|--------|-----------------|----------|
| 19 | Setup Plan | Full deployment: migration, seed scripts, edge function deploy, health check verification | Done | `prompts/prompts/19-setup-plan.md` | Yes |

---

## Wireframes (17 documents)

| # | Document | Purpose | Implemented |
|---|----------|---------|-------------|
| 00 | Executive Summary | Hero stat card, 3-phase timeline, benefits grid | Reference only |
| 01 | Screen Inventory | All screens data grid with routes, status, priority | Reference only |
| 02 | Wizard Enhancements | 5-step wizard with team assembly UI | Yes (Steps 4-5 show agent team) |
| 03 | Dashboard Enhancements | SaaS dashboard with AI Team widget, insights feed | Partial (AgentTeamWidget done, InsightsFeed missing) |
| 04 | New Screens | Agent Catalog, Agent Detail, Agent Runner pages | Yes (all 3 pages built) |
| 05 | User Journey | 8-stage horizontal user journey map | Reference only |
| 06 | Agent System Mapping | Product areas mapped to agents by division | Reference only |
| 07 | Data Model | ER diagram for 7 database tables | Yes (all 7 tables live) |
| 08 | Frontend-Backend Wiring | Technical architecture: components -> API routes -> DB tables | Yes (all routes wired) |
| 09 | Implementation Plan | 3-phase Gantt timeline (CORE/MVP/ADVANCED) | Following this phased order |
| 10 | Risks & Guardrails | Risk matrix with 8 risk items | Reference only |
| 11 | Mermaid ER Diagram | Entity-relationship diagram for agent tables | Reference only |
| 12 | Mermaid Data Flow | Color-coded data flow through agent system | Reference only |
| 13 | Mermaid Prompt Compiler | 4-layer prompt assembly architecture | Yes (agent-loader.tsx implements this) |
| 14 | Mermaid User Journey | State machine: first visit -> active agent user | Reference only |
| 15 | Mermaid Agent Orchestration | UML sequence diagrams for multi-agent coordination | Yes (insight-routes.tsx, ai-routes.tsx) |
| 16 | Mermaid Additional | Component tree, deployment pipeline, workflow integration | Reference only |

---

## Plan Documents (5 documents)

| # | Document | Purpose | Status |
|---|----------|---------|--------|
| 00 | Validation Report | Analysis of what's correct, wrong, corrected plan | Completed — all findings addressed |
| 01 | Corrected Integration Plan | 4-layer prompt compiler architecture guide | Implemented in agent-loader.tsx |
| 02 | Reusable Assets Inventory | 95% structured .md content, 5% code | Used — 131 agents parsed from agency/ |
| 03 | Prompt Pack | Reusable prompt templates for AI pipeline | Implemented in ai-routes.tsx + agent-routes.tsx |
| 04 | Risks & Limitations | Honest capability assessment | Reviewed — mitigations in place |

---

## AI Models Configuration

| Model | Role | Used In | Status |
|-------|------|---------|--------|
| `gemini-3-flash-preview` | Primary generation | `gemini.tsx` (all AI routes) | Active |
| `gemini-3.1-pro-preview` | Complex reasoning (future) | Not yet wired | Planned |
| `gemini-3.1-flash-lite-preview` | Lightweight tasks (future) | Not yet wired | Planned |
| `gemini-3.1-flash-image-preview` | Image analysis (future) | Not yet wired | Planned |

> **Note**: Previous models `gemini-2.0-flash` and `gemini-2.5-flash` are deprecated and no longer in use.

---

## Database — Production Tables (Agent-Related)

| Table | Rows | RLS | Indexes | Status |
|-------|------|-----|---------|--------|
| `agent_catalog` | 131 agents, 13 divisions, 17 curated | Public read | division, slug (unique), is_active | Live |
| `agent_assignments` | Active | User-scoped | project_id + agent_slug (unique) | Live |
| `agent_runs` | Active | User-scoped | user_id, agent_slug | Live |
| `insight_cards` | Active | Project-owner | project_id + status, expires_at | Live |
| `agent_team_templates` | 17 templates | Public read | industry, goal | Live |
| `agent_team_templates_agents` | 73 roles | Public read | template_id | Live |
| `deal_scores` | Active | User-scoped | deal_id (unique) | Live |

---

## Edge Function Routes (Agent-Related)

| Method | Route | File | Status |
|--------|-------|------|--------|
| GET | `/agents/catalog` | agent-routes.tsx | Deployed |
| GET | `/agents/:slug` | agent-routes.tsx | Deployed |
| POST | `/agents/:slug/run` | agent-routes.tsx | Deployed |
| GET | `/agents/team/:projectId` | agent-routes.tsx | Deployed |
| POST | `/agents/team/:projectId` | agent-routes.tsx | Deployed |
| PATCH | `/agents/team/:projectId/:assignmentId` | agent-routes.tsx | Deployed |
| GET | `/insights/:projectId` | insight-routes.tsx | Deployed |
| PATCH | `/insights/:id/status` | insight-routes.tsx | Deployed |
| POST | `/insights/:projectId/generate` | insight-routes.tsx | Deployed |
| POST | `/crm/deals/:id/score` | crm-routes.tsx | Deployed |

---

## Frontend API Helpers

| API Object | Methods | File | Status |
|------------|---------|------|--------|
| `agentCatalogApi` | `list`, `getAgent`, `runAgent`, `getTeam`, `assignAgent`, `updateAssignment`, `match`, `history` | `src/lib/supabase.ts` | Implemented |
| `insightApi` | `list`, `updateStatus`, `generate` | `src/lib/supabase.ts` | Implemented |
| `dealScoringApi` | `scoreDeal` | `src/lib/supabase.ts` | Implemented |

---

## Frontend Components

| Component | File | Prompt | Status |
|-----------|------|--------|--------|
| `AgentCatalogPage` | `src/components/dashboard/agents/AgentCatalogPage.tsx` | 15 | Done |
| `AgentDetailPage` | `src/components/dashboard/agents/AgentDetailPage.tsx` | 16 | Done |
| `AgentRunnerPage` | `src/components/dashboard/agents/AgentRunnerPage.tsx` | 17 | Done |
| `AgentTeamWidget` | `src/components/dashboard/AgentTeamWidget.tsx` | 14 | Done |
| `InsightsPage` | `src/components/dashboard/insights/InsightsPage.tsx` | 14 | Done |
| `InsightDetailCards` | `src/components/dashboard/insights/InsightDetailCards.tsx` | 14 | Done |
| `DealCard` (health score) | `src/components/dashboard/crm/DealCard.tsx` | 18 | Partial |
| `AgentSystemMap` | `src/components/dashboard/agents/AgentSystemMap.tsx` | — | Bonus |
| `AgentERDiagram` | `src/components/dashboard/agents/AgentERDiagram.tsx` | — | Bonus |
| `AgentSummaryHeader` | `src/components/dashboard/agents/AgentSummaryHeader.tsx` | — | Bonus |
| Wizard inline agents | `StepExecutiveSummary.tsx`, `StepLaunchProject.tsx` | 13 | Partial (not extracted) |

---

## Skills

| Skill | File | Used For |
|-------|------|----------|
| `supabase-edge-functions` | `.claude/skills/supabase-edge-functions/SKILL.md` v3.0 | Sun AI single-server architecture conventions |
| `supabase-postgres-best-practices` | `.claude/skills/supabase-postgres-best-practices/SKILL.md` v2.0 | Sun AI database conventions |
| `gemini-api-dev` | Installed skill | Gemini 3.x model configuration and API calls |

---

## Scripts

| Script | File | Purpose | Last Run |
|--------|------|---------|----------|
| `parse-agents.ts` | `scripts/parse-agents.ts` | Parse 131 agents from `agency/` -> `agent_catalog` + `agent-index.json` | 2026-03-12 |
| `seed-team-templates.ts` | `scripts/seed-team-templates.ts` | Seed 17 team templates with 73 agent roles | 2026-03-12 |

---

## Remaining Work

### High Priority
1. **Prompt 13** — Extract wizard agent display into 3 reusable components: `AgentTeamCard.tsx`, `AITeamSection.tsx`, `AgentTeamGrid.tsx`
2. **Prompt 14** — Build `InsightsFeed` dashboard widget (compact, shows latest 3 insights) + add agent attribution badges to InsightCard
3. **Prompt 18** — Build `DealScoreCard` modal with 5-factor breakdown + "Re-score" button + extract `DealHealthBar` component

### Medium Priority
4. Wire `gemini-3.1-pro-preview` for complex reasoning tasks (agent matching, deep analysis)
5. Wire `gemini-3.1-flash-lite-preview` for lightweight tasks (status checks, simple queries)
6. Wire `gemini-3.1-flash-image-preview` for image analysis features

### Low Priority
7. Onboarding routes — `ensureOnboardingSchema()` fails on `project_id` column mismatch
8. Add test runner and lint configuration
9. Configure git worktrees for feature branches

### KV Store Migration — COMPLETE (2026-03-13)
> All 3 route modules migrated from `kv_store.tsx` to proper Supabase tables:
> - `workflow-routes.tsx` → `workflows`, `workflow_executions` (8 endpoints)
> - `financial-routes.tsx` → `dashboard_invoices`, `dashboard_payments` (10 endpoints)
> - `document-routes.tsx` → `dashboard_documents` (7 endpoints, new table created)
>
> KV store is empty. `kv_store.tsx` deprecated (kept for Figma Make compatibility).
> Plan: `docs/superpowers/plans/2026-03-13-kv-to-supabase-migration.md`

---

## Figma Make Integration

Recent Figma Make commits have auto-updated files in the repository. The wireframe documents (00-16) in `/prompts/wireframes/` were all generated via Figma Make and serve as design reference for implementation.

---

## Overall Progress

```
CORE (Database)     ████████████████████ 100%  (5/5 prompts)
MVP (Backend)       ████████████████████ 100%  (7/7 prompts)
ADVANCED (Frontend) ████████████████░░░░  80%  (3/6 complete, 3 partial)
DEPLOY              ████████████████████ 100%  (1/1 prompt)

Total: 16/19 prompts complete, 3 partial = ~89% overall
```
