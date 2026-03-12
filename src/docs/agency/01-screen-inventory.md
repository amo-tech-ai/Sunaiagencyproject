# Screen Inventory — All Screens

**Document:** 01 of Agency Agents series
**Version:** 1.0
**Created:** 2026-03-12
**Parent:** [00-executive-summary.md](./00-executive-summary.md)
**Status:** Planning

---

## Existing Screens to Enhance

| # | Screen | Route | Status | Purpose | Primary User | Priority | Main Actions | Key Data | Agents Involved |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Wizard Step 3 | `/wizard` (step 3) | Enhance | System recommendations | New visitor | P1 | Select recommended systems | Ranked systems, fit scores, ROI | Software Architect, Rapid Prototyper, Growth Hacker |
| 2 | Wizard Step 4 | `/wizard` (step 4) | Enhance | Executive summary / proposal | New visitor | P1 | Review proposal, approve brief | Proposal narrative, readiness score, AI team | Proposal Strategist, Reality Checker, Finance Tracker |
| 3 | Wizard Step 5 | `/wizard` (step 5) | Enhance | Launch project | New visitor | P1 | Confirm launch, view team | Agent team cards, roadmap preview, quick wins | Project Shepherd, Sprint Prioritizer |
| 4 | Dashboard Home | `/app/dashboard` | Enhance | Project overview | Client | P2 | View status, next steps | Readiness score, roadmap, activities, agent team | Analytics Reporter, assigned agents |
| 5 | Insights | `/app/insights` | Enhance | AI-generated business insights | Client | P2 | Read insights, take action | Insight cards with priority and status | Growth Hacker, Pipeline Analyst, Finance Tracker |
| 6 | CRM Pipeline | `/app/crm/pipelines` | Enhance | Manage deals | Agency | P2 | Move deals, view scores | Deal cards, stages, health scores | Pipeline Analyst, Deal Strategist |
| 7 | Workflows | `/app/workflows` | Enhance | Automate processes | Agency | P3 | Build workflows, add steps | Workflow canvas, execution logs | Any agent as workflow node |
| 8 | Financial | `/app/financial` | Enhance | Revenue and cost tracking | Agency | P3 | View projections, track costs | Revenue charts, cost breakdown, KPIs | Finance Tracker |
| 9 | Strategy | `/app/strategy` | Enhance | Lean Canvas and strategy | Client | P2 | Edit canvas, view insights | Canvas blocks, AI insights, opportunities | Growth Hacker, Trend Researcher |
| 10 | Agents (existing) | `/app/agents` | Enhance | AI run monitoring | Agency | P2 | View run logs, cache stats | Run history, token usage, performance | All (monitoring) |

---

## New Screens to Build

| # | Screen | Route | Status | Purpose | Primary User | Priority | Main Actions | Key Data | Agents Involved |
|---|---|---|---|---|---|---|---|---|---|
| 11 | Agent Catalog | `/app/agents/catalog` | New | Browse all agents | Client + Agency | P2 | Search, filter, view details | Agent cards by division, descriptions, tags | All 120+ agents |
| 12 | Agent Detail | `/app/agents/:slug` | New | View agent profile | Client + Agency | P2 | Read capabilities, run agent | Agent identity, mission, use cases, run history | Single agent |
| 13 | Agent Runner | `/app/agents/:slug/run` | New | Execute agent on a task | Agency | P3 | Input task, run agent, view output | Task input form, agent output, run metadata | Single agent |

---

## Priority Legend

| Badge | Meaning | Phase | Timeline |
|---|---|---|---|
| **P1** | Must-have for MVP launch | Phase 1 | Week 1-2 |
| **P2** | Core product upgrade | Phase 2 | Week 3-5 |
| **P3** | Full platform capability | Phase 3 | Week 6-8 |

---

## Screens Considered But NOT Building

| Screen | Why Not |
|---|---|
| Agent Team Builder (drag-and-drop) | Over-engineering — wizard auto-assigns teams, manual building adds complexity without value for MVP |
| Agent Marketplace (public) | Phase 4 — marketing page, not core product |
| Agent Workflow Builder (visual) | Existing workflow page handles this — just add agent-as-node |
| Strategy Report (separate page) | Strategy page already exists — add agent insights there |
| Opportunity Tracker (separate page) | Insights page covers this — add opportunity cards there |

---

## Screen-to-Component Mapping

Maps each screen to the existing (or new) React component file and its current implementation status.

### Existing Components (Enhance)

| Screen | Component File | Current Version | Enhancement Scope |
|---|---|---|---|
| Wizard Step 3 | `/components/wizard/steps/StepSystemRecommendations.tsx` | v0.25.0 | Add agent-powered "why this fits" reasoning per card, agent attribution |
| Wizard Step 4 | `/components/wizard/steps/StepExecutiveSummary.tsx` | v0.25.0 | Add "Your AI Team" section with agent cards below proposal |
| Wizard Step 5 | `/components/wizard/steps/StepLaunchProject.tsx` | v0.25.0 | Add agent team grid with first-task assignments, team reveal animation |
| Dashboard Home | `/components/dashboard/DashboardHomePage.tsx` | v0.25.0 | Add Agent Team widget card to dashboard grid |
| Insights | `/components/dashboard/insights/InsightsPage.tsx` | v0.25.0 | Add agent attribution badges to insight cards |
| CRM Pipeline | `/components/dashboard/crm/CRMPipelinePage.tsx` | v0.25.0 | Add agent deal scoring badge to deal cards |
| Workflows | `/components/dashboard/workflows/WorkflowAutomationPage.tsx` | v0.25.0 | Add "Agent" as workflow action node type |
| Financial | `/components/dashboard/financial/FinancialDashboardPage.tsx` | v0.25.0 | Add Finance Tracker agent attribution to projections |
| Strategy | `/components/dashboard/strategy/StrategyEnginePage.tsx` | v0.25.0 | Add agent-sourced insight cards in intelligence panel |
| Agents | `/components/dashboard/agents/AgentsPage.tsx` | v0.25.0 | Add link to catalog, enhance with agent identity info |

### New Components (Build)

| Screen | Component File | Route Registration | Parent Layout |
|---|---|---|---|
| Agent Catalog | `/components/dashboard/agents/AgentCatalogPage.tsx` | `/app/agents/catalog` in `routes.tsx` | DashboardLayout |
| Agent Detail | `/components/dashboard/agents/AgentDetailPage.tsx` | `/app/agents/:slug` in `routes.tsx` | DashboardLayout |
| Agent Runner | `/components/dashboard/agents/AgentRunnerPage.tsx` | `/app/agents/:slug/run` in `routes.tsx` | DashboardLayout |

---

## Route Changes Summary

```
EXISTING ROUTES (no change):
  /wizard                          — WizardPage (Steps 1-5 enhanced in-place)
  /app/dashboard                   — DashboardHomePage (add widget)
  /app/insights                    — InsightsPage (add badges)
  /app/crm/pipelines               — CRMPipelinePage (add scoring)
  /app/workflows                   — WorkflowAutomationPage (add node type)
  /app/financial                   — FinancialDashboardPage (add attribution)
  /app/strategy                    — StrategyEnginePage (add agent insights)
  /app/agents                      — AgentsPage (enhance)

NEW ROUTES:
  /app/agents/catalog              — AgentCatalogPage
  /app/agents/:slug                — AgentDetailPage
  /app/agents/:slug/run            — AgentRunnerPage
```

**Total new routes:** 3
**Total enhanced screens:** 10
**Total screens affected:** 13

---

## Edge Function Routes (New)

| Method | Route | Purpose | Auth |
|---|---|---|---|
| `POST` | `/agents/match` | Match agents to wizard data | Optional |
| `POST` | `/agents/run` | Execute an agent on a task | Required |
| `GET` | `/agents/catalog` | List all agents with filters | Optional |
| `GET` | `/agents/:slug` | Get single agent profile | Optional |
| `GET` | `/agents/:slug/runs` | Get run history for an agent | Required |
| `GET` | `/dashboard/agent-team` | Get assigned agents for a project | Required |
| `GET` | `/crm/deals/:id/score` | Get agent-generated deal score | Required |

**Total new routes:** 7

---

## Wizard Enhancement Detail

Reference: [Wizard Wireframes](/imports/pasted_text/wizard-wireframes.md)

### Step 3 — System Recommendations (Enhanced)

**What changes:** Recommendations include "why this fits YOUR business" reasoning powered by specialist agents. Each recommendation card shows:
- Fit score percentage
- Agent-generated reasoning (2-3 sentences, specific to the business)
- ROI estimate
- Quick Win indicator

**No new UI components** — existing `StepSystemRecommendations.tsx` card layout is extended with richer content.

### Step 4 — Executive Summary (Enhanced)

**What changes:** Adds "Your AI Team" section below the proposal. Shows 3-5 specialist agents with:
- Agent avatar (icon-based)
- Agent name and role
- One-line task description specific to this project

**New UI section** within existing `StepExecutiveSummary.tsx`.

### Step 5 — Launch Project (Enhanced)

**What changes:** Shows full agent team with first tasks and roadmap preview:
- Agent team grid (name, first task)
- Roadmap preview (3 phases with deliverables)
- Quick wins checklist

**New UI section** within existing `StepLaunchProject.tsx`.

---

## Data Flow

```
User fills wizard (Steps 1-2)
         |
         v
POST /agents/match  <-- sends industry, size, goal, challenge, diagnostics
         |
         v
Agent matching algorithm selects 3-8 agents
         |
         v
Step 3: Agent-enhanced recommendations rendered
Step 4: "Your AI Team" section rendered
Step 5: Team reveal with first tasks
         |
         v
POST /onboarding/complete  <-- saves project + agent assignments
         |
         v
Dashboard: Agent Team widget shows assigned agents
Insights: Agent-attributed insight cards
CRM: Agent-scored deal badges
```

---

## Mobile Behavior

All wizard steps stack vertically on mobile:
- Progress sidebar collapses to a top step indicator (Step 3 of 5)
- Recommendation cards stack single-column
- AI Team cards become a horizontal scrollable row
- Roadmap phases stack vertically as a timeline

Agent Catalog on mobile:
- Division tabs become a horizontal scrollable pill bar
- Agent cards stack single-column
- Search bar is sticky at top

Agent Detail on mobile:
- Full-width layout, no sidebar
- Run button fixed at bottom of screen
