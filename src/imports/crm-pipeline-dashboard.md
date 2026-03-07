---
id: 028-crm-pipeline-dashboard
diagram_id: DASH-04
prd_section: Dashboard
title: CRM pipeline dashboard — deals, stages, contacts, and sales funnel
skill: frontend
phase: MEDIUM
priority: P2
status: Not Started
owner: Frontend
dependencies:
  - 026-client-management-dashboard
estimated_effort: L
percent_complete: 0
area: agency-dashboard
wizard_step: null
schema_tables: [crm_pipelines, crm_stages, crm_deals, crm_contacts, crm_interactions, clients, organizations]
figma_prompt: prompts/028-crm-pipeline-dashboard.md
---

## Summary Table

| Aspect | Details |
|--------|---------|
| **Screens** | CRM Pipeline (`/app/crm/pipelines`) |
| **Features** | Pipeline kanban, deal cards, stage management, contact profiles, interaction timeline, forecast chart |
| **Edge Functions** | assistant (deal scoring, forecast) |
| **Tables** | crm_pipelines, crm_stages, crm_deals, crm_contacts, crm_interactions, clients, organizations |
| **Agents** | assistant (gemini-3-flash-preview, low thinking) |
| **Real-World** | "Lead completes wizard -> deal auto-created in Qualified stage -> agency rep reviews, moves to Proposal Sent" |

---

## Description

**The situation:** The agency acquires clients through the wizard funnel — prospects start the wizard, and some complete it. The `crm_pipelines`, `crm_stages`, and `crm_deals` tables exist in the schema, but there is no interface to manage the sales pipeline. Deals are not created when wizards complete. There is no visibility into which leads are progressing, stalling, or closing. The agency tracks sales informally through spreadsheets or memory.

**Why it matters:** The wizard generates high-intent leads — someone who completes a readiness assessment and system recommendations is a qualified prospect. Without a pipeline view, the agency cannot track deal progression, forecast revenue, or identify stale deals that need follow-up. The connection between wizard engagement and sales conversion is invisible.

**What already exists:** The `crm_pipelines` table supports multiple named pipelines. The `crm_stages` table has position-ordered stages per pipeline. The `crm_deals` table stores deals with value, probability, contact_id, and stage_id FKs. The `crm_contacts` table holds contact details. The `crm_interactions` table logs calls, emails, and meetings per deal or contact. The `wizard_sessions` table provides wizard completion data that can trigger deal creation. shadcn/ui provides Card, Badge, Dialog, Select, Popover, and Sheet components. The kanban pattern from the project task board (027) can be adapted for deal stages.

**The build:** Create a `CRMPipeline` page at `/app/crm/pipelines` with a horizontal kanban board as the primary view. Each column represents a stage from `crm_stages` (ordered by position). Deal cards show deal title, value, contact name, probability, and days in current stage. Deals are draggable between stages. A pipeline selector (tabs or dropdown) switches between pipelines. Clicking a deal opens a detail panel with the full interaction timeline, contact info, linked wizard data, and deal metadata. A forecast section shows weighted pipeline value by month using Recharts. A conversion funnel chart shows stage-to-stage drop-off rates.

**Example:** Apex Marketing Agency has two pipelines: "New Business" (stages: Lead, Qualified, Proposal Sent, Negotiation, Closed Won, Closed Lost) and "Upsell" (stages: Identified, Pitched, Approved, Delivered). The agency owner opens the CRM pipeline view. "New Business" is selected. The kanban shows: 4 deals in "Lead" ($32K total), 3 in "Qualified" ($28K), 2 in "Proposal Sent" ($18K), 1 in "Negotiation" ($15K). She drags "GreenLeaf Healthcare — AI Patient Scheduling" from "Qualified" to "Proposal Sent", logs an interaction "Sent proposal doc via email", and sets close probability to 60%. The forecast chart at the bottom shows $45K weighted pipeline this month.

---

## Rationale

**Problem:** No sales pipeline visibility. Wizard-generated leads are not tracked through a sales process. Revenue forecasting is impossible.

**Solution:** A kanban-based CRM pipeline with draggable deal cards, interaction logging, and revenue forecasting. Wizard completion auto-creates deals to connect the top of funnel to sales management.

**Impact:** Agency can manage the full sales cycle from wizard lead to closed deal. Revenue forecasting enables planning. Stale deal detection prevents lost opportunities.

---

## Screen Purpose

Sales pipeline management for the agency. Tracks leads from initial wizard engagement through to signed contracts. Deals flow through customizable pipeline stages. Integrates with wizard data — a completed wizard session can auto-create a deal with value estimated from selected systems and readiness score.

---

## Target User

- Agency sales team tracking leads through pipeline stages
- Business development reps managing outbound and inbound deals
- Agency owner monitoring revenue pipeline and forecasting

---

## Core Features

1. Pipeline board (kanban) with customizable stages from crm_stages, ordered by position
2. Deal cards showing title, value, contact name, probability percentage, days in stage
3. Multiple pipelines support (e.g., "New Business", "Upsell", "Renewal") via tabs or dropdown
4. Contact management with linked interaction history
5. Deal detail panel with full timeline of all interactions (calls, emails, meetings, notes)
6. Pipeline analytics: conversion rates per stage, average deal cycle time
7. Forecast view: weighted pipeline value by month (value * probability)
8. Deal quick-create form with title, value, contact, pipeline, stage
9. Interaction logging inline on deal cards or detail panel

---

## Data Displayed

- Pipeline names and deal counts per pipeline
- Stages per pipeline: name, position, color code, deal count, total stage value
- Deal cards: title, value (currency formatted), probability (%), contact name, days in current stage, created date
- Contact details: name, email, company, role, phone
- Interactions: type (call, email, meeting, note), content/notes, date, logged-by user
- Wizard context on deal: readiness score, selected systems, industry (from wizard_answers linked via client org)
- Forecast: monthly weighted value (sum of deal.value * deal.probability per month)
- Conversion funnel: stage-to-stage progression rates

---

## UI Components

- `PipelineBoard` — horizontal kanban layout with StageColumns, horizontally scrollable
- `StageColumn` — vertical column with stage header (name, count, total value), droppable zone
- `DealCard` — compact card with title, value badge, contact avatar, probability, days-in-stage indicator
- `DealDetailPanel` — Sheet (slide-out right) with tabs: Details, Interactions, Wizard Data, Activity
- `PipelineSelector` — Tabs or Select dropdown to switch between pipelines
- `ContactCard` — compact contact info (name, email, company) used in deal detail
- `InteractionTimeline` — vertical timeline of logged interactions with type icons
- `InteractionForm` — inline form to log call/email/meeting/note with text area
- `ForecastChart` — Recharts BarChart showing weighted monthly pipeline value
- `ConversionFunnel` — Recharts FunnelChart or stacked bars showing stage-to-stage rates
- `DealQuickCreate` — Dialog form with title, value, contact select, pipeline, stage

---

## Layout Structure

```
+-----------------------------------------------------+
| Sidebar (240px)  |  Main Content (flex-1)            |
|                  |                                    |
| * Dashboard      |  CRM Pipeline                     |
| * Projects       |  [New Business] [Upsell] [Renewal]|
| * CRM  <--       |                                   |
| * AI Insights    |  +-------------------------------+ |
| * Documents      |  | Lead   | Qualif | Propos | Ne| |
| * Financial      |  | 4 $32K | 3 $28K | 2 $18K | 1 | |
| * Settings       |  |--------|--------|--------|---| |
|                  |  | [deal] | [deal] | [deal] |[d]| |
|                  |  | [deal] | [deal] | [deal] |   | |
|                  |  | [deal] | [deal] |        |   | |
|                  |  | [deal] |        |        |   | |
|                  |  +-------------------------------+ |
|                  |                                    |
|                  |  +---- Forecast Chart -----------+ |
|                  |  | [Bar: Mar $45K | Apr $38K ... ]| |
|                  |  +-------------------------------+ |
|                  |                                    |
|                  |      +-- Deal Detail Panel (400px) |
|                  |      | GreenLeaf - AI Scheduling   |
|                  |      | $15K | 60% | Proposal Sent  |
|                  |      | [Details][Interactions][Wiz] |
|                  |      | ...                          |
+-----------------------------------------------------+
```

- Pipeline tabs: full width, below page header
- Kanban columns: min 220px each, horizontally scrollable on overflow
- Stage headers: name, deal count, total value in `#0A211F` text
- Deal cards: `#FFFFFF` background, `#D4CFC8` border, 8px radius, 12px padding
- Value badge: `#84CC16` background for high-value deals (>$10K), gray for others
- Forecast chart: 200px height, below kanban, Recharts with `#0A211F` bars, `#84CC16` accent
- Detail panel: 400px Sheet from right

---

## Interaction Patterns

- Drag deal cards between stage columns (updates crm_deals.stage_id via Supabase)
- Click deal card -> open detail panel (Sheet) from right
- Pipeline tabs switch the kanban to show that pipeline's stages and deals
- Hover stage header -> tooltip with conversion rate from previous stage
- Click "Add Deal" button (top right or in empty column) -> DealQuickCreate dialog
- In detail panel, click "Log Interaction" -> inline form expands with type select + notes textarea
- Click contact name in deal card -> navigate to contact profile or open popover
- Forecast chart bars are clickable -> filter kanban to deals with expected close in that month
- Stage column header "total value" updates live as deals are dragged in/out

---

## Example User Workflows

**Workflow 1 — Wizard-to-deal conversion:** A prospect completes the wizard. The system auto-creates a deal: title "TechNova Solutions — AI Transformation" in the "Qualified" stage (they completed all 5 steps) with estimated value $22K (derived from 3 selected systems at estimated pricing). The deal card shows readiness score 72 from wizard data. Agency rep opens the deal, reviews the wizard analysis in the "Wizard Data" tab, and prepares a proposal. She logs an interaction "Reviewed wizard analysis, preparing custom proposal based on 3 recommended systems." She drags the deal to "Proposal Sent."

**Workflow 2 — Revenue forecasting:** Agency owner opens the CRM pipeline and scrolls to the forecast chart. March shows $45K weighted pipeline (6 deals, weighted by probability). April shows $38K. She clicks the March bar — the kanban filters to 6 deals expected to close in March. She notices 2 deals in "Negotiation" have been there for 12 days (stale indicator turns amber at 7+ days). She opens each deal and adds follow-up interactions to push toward close.

**Workflow 3 — Stale deal management:** The agency owner notices 3 deals with amber "stale" indicators (7+ days in current stage). She clicks the first deal, "Fresh Bites Group — Cart Recovery" in "Proposal Sent" for 9 days. The interaction timeline shows no activity since the proposal was sent. She logs a note "Follow up: scheduled call for Thursday" and updates the probability from 40% to 30%. The weighted pipeline value adjusts automatically.

---

## AI Features

- Deal scoring based on wizard readiness score + engagement signals (wizard completion rate, login frequency, time spent in wizard) — higher wizard engagement correlates with higher close probability
- Predicted close date based on average deal cycle time per stage and current velocity
- "Stale deal" alerts: highlight deals that have exceeded the average time-in-stage for their current stage
- Next best action per deal: "Send case study for similar industry", "Schedule technical demo", "Offer Phase 1 discount"
- Auto-generate proposal outline from wizard data: business profile, recommended systems, projected ROI, phased timeline
- Win/loss pattern analysis: "Deals with readiness score > 70 close at 3x the rate of those below 50"

---

## Data Sources (tables)

| Data | Table | Column/Query |
|------|-------|-------------|
| Pipelines | crm_pipelines | select all where org_id = agency org |
| Stages | crm_stages | where pipeline_id, order by position |
| Deals | crm_deals | where stage_id in pipeline's stages, includes value, probability, contact_id |
| Contacts | crm_contacts | join on crm_deals.contact_id |
| Interactions | crm_interactions | where deal_id or contact_id, order by created_at desc |
| Wizard context | wizard_sessions | where org_id = deal's client org, join wizard_answers for ai_results |
| Client link | clients | linked via crm_contacts.client_id or deal metadata |
| Deal history | activities | where entity_type = 'deal' and entity_id = deal.id |
| Forecast data | crm_deals | group by expected_close_month, sum(value * probability) |

---

## Automation Opportunities

- Auto-create deal when wizard session completes (status = 'completed') with value estimated from selected systems
- Auto-set initial stage based on wizard completion depth (Step 1-2 = "Lead", Step 3-4 = "Qualified", Step 5 = "Proposal Ready")
- Auto-move deal to next stage when proposal document is uploaded (via documents table integration)
- Alert on deals stale > 7 days in any stage (no interactions logged)
- Weekly pipeline summary email to agency owner: new deals, stage changes, forecast delta
- Auto-calculate probability based on historical win rates per stage
- Auto-log activity when deal changes stage, value, or probability

---

## Visual Hierarchy

1. **Primary focus**: Pipeline kanban board (center, full width, main interaction surface)
2. **Secondary**: Deal cards within columns (scannable, data-dense, draggable)
3. **Tertiary**: Stage headers with deal count and total value (column context)
4. **Supporting**: Forecast chart (below, analytical), Detail panel (right overlay, contextual)

---

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Agency sales rep | drag deals between pipeline stages | I can update deal progress in seconds |
| Agency owner | see total weighted pipeline value by month | I can forecast revenue and plan resources |
| Agency sales rep | log interactions (calls, emails) on a deal | I have a complete history for follow-ups |
| Agency owner | identify stale deals that haven't progressed | I can intervene before opportunities go cold |
| Agency sales rep | see wizard analysis data on a deal | I can tailor proposals to the client's specific needs |
| Business dev | create a deal from a wizard completion | the lead enters the sales pipeline automatically |

---

## Goals & Acceptance Criteria

### Goals
1. **Primary:** Agency can manage the full sales pipeline from wizard lead to closed deal with visual kanban
2. **Quality:** Kanban renders 50+ deals across 6 stages without performance issues, drag-and-drop persists in < 500ms

### Acceptance Criteria
- [ ] Pipeline page renders at `/app/crm/pipelines` with kanban board layout
- [ ] Pipeline selector (tabs) switches between multiple pipelines (at least "New Business" seeded)
- [ ] Stage columns render in position order from `crm_stages` with name, deal count, and total value
- [ ] Deal cards show title, formatted value, contact name, probability %, and days-in-stage
- [ ] Deal cards are draggable between stage columns, stage_id updates persist to `crm_deals`
- [ ] Deal card click opens Sheet detail panel with Details, Interactions, Wizard Data, and Activity tabs
- [ ] Interaction form logs new interactions (type + notes) to `crm_interactions` table
- [ ] Interaction timeline shows all logged interactions in reverse chronological order
- [ ] Wizard Data tab on deal detail shows readiness score, selected systems, and business profile from linked wizard_answers
- [ ] "Add Deal" dialog creates new deal with title, value, contact, stage selection
- [ ] Forecast chart (Recharts) shows weighted monthly pipeline value below the kanban
- [ ] Stale deal indicator (amber border or badge) appears on deals in same stage > 7 days
- [ ] Empty pipeline state shows "No deals yet" with "Add Deal" CTA
- [ ] Loading state shows skeleton columns and cards
- [ ] RLS enforces that only agency org members see pipeline data

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Page | `src/components/dashboard/CRMPipeline.tsx` | Create |
| Component | `src/components/dashboard/PipelineBoard.tsx` | Create |
| Component | `src/components/dashboard/StageColumn.tsx` | Create |
| Component | `src/components/dashboard/DealCard.tsx` | Create |
| Component | `src/components/dashboard/DealDetailPanel.tsx` | Create |
| Component | `src/components/dashboard/PipelineSelector.tsx` | Create |
| Component | `src/components/dashboard/InteractionTimeline.tsx` | Create |
| Component | `src/components/dashboard/InteractionForm.tsx` | Create |
| Component | `src/components/dashboard/ForecastChart.tsx` | Create |
| Component | `src/components/dashboard/ConversionFunnel.tsx` | Create |
| Component | `src/components/dashboard/DealQuickCreate.tsx` | Create |
| Hook | `src/lib/hooks/usePipeline.ts` | Create |
| Hook | `src/lib/hooks/useDeals.ts` | Create |
| Hook | `src/lib/hooks/useInteractions.ts` | Create |
| Types | `src/lib/types/crm.ts` | Create |
| Route | `src/routes.tsx` | Modify — add `/app/crm/pipelines` route |

---

## Outcomes

| Before | After |
|--------|-------|
| Wizard completions don't create sales pipeline entries | Auto-created deals with wizard context flow into the kanban |
| No visibility into sales pipeline — managed via spreadsheet | Full kanban board with drag-and-drop stage management |
| No interaction history with prospects | Chronological timeline of calls, emails, meetings per deal |
| Revenue forecasting is guesswork | Weighted pipeline forecast chart by month using deal value * probability |
| Stale deals go unnoticed for weeks | Amber indicators flag deals in same stage > 7 days |
