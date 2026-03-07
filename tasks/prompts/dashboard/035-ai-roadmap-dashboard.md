---
id: 035-ai-roadmap-dashboard
diagram_id: DASH-11
prd_section: Dashboard
title: AI roadmap dashboard — implementation timeline, phase management, and progress visualization
skill: frontend
phase: HIGH
priority: P1
status: Not Started
owner: Frontend
dependencies:
  - 027-project-delivery-dashboard
estimated_effort: L
percent_complete: 0
area: client-dashboard
wizard_step: 5
schema_tables: [roadmaps, roadmap_phases, projects, tasks, milestones, systems, project_services]
figma_prompt: prompts/035-ai-roadmap-dashboard.md
---

# 035 — AI Roadmap Dashboard

## Summary Table

| Field            | Value                                                                         |
| ---------------- | ----------------------------------------------------------------------------- |
| **ID**           | 035-ai-roadmap-dashboard                                                      |
| **Diagram ID**   | DASH-11                                                                       |
| **Section**      | Dashboard                                                                     |
| **Phase**        | HIGH                                                                          |
| **Priority**     | P1                                                                            |
| **Effort**       | L (Large)                                                                     |
| **Owner**        | Frontend                                                                      |
| **Dependencies** | 027-project-delivery-dashboard                                                |
| **Schema**       | roadmaps, roadmap_phases, projects, tasks, milestones, systems, project_services |
| **Wizard Step**  | 5 (Launch Project / Roadmap)                                                  |

---

## Description

**Situation.** The wizard's Step 5 generates a comprehensive AI transformation roadmap — a phased implementation plan with timelines, system deployments, milestones, deliverables, cost estimates, and success metrics. This roadmap is the central promise made to the client: "Here is exactly how we will transform your business with AI, phase by phase, week by week." After the wizard completes, the roadmap data is stored in `wizard_answers(step-5).ai_results` and structured into `roadmaps` and `roadmap_phases` tables. But without a dedicated visualization, this roadmap lives as raw data — invisible to the client.

**Why it matters.** The roadmap is the client's primary touchpoint with their AI transformation. It answers their most urgent questions: What is happening now? What is next? Are we on track? When will this phase deliver results? A well-presented roadmap builds confidence, reduces "what is happening?" support requests, and gives the client a sense of control over a complex, multi-phase engagement. It is also the consultant's primary project management view — tracking which phases are complete, which are active, and which are at risk.

**What exists.** The `roadmaps` table stores the top-level plan (title, total_weeks, total_investment). `roadmap_phases` stores each phase (phase_number, title, week_range, systems to implement, deliverables, milestones, estimated_cost). `projects` links the roadmap to a project. `tasks` and `milestones` track granular progress within each phase. `systems` provides details about each AI system being deployed. The wizard Step 5 AI output includes quick wins, risk factors, and success metrics.

**The build.** A dedicated roadmap dashboard with an interactive horizontal Gantt-style timeline showing all phases across weeks. The current phase is highlighted with a progress percentage. Below the timeline, a detail area shows the selected phase's systems, deliverables, milestones, and cost. Supporting panels include: quick wins checklist, risk factors with mitigation status, and success metrics tracker. A "Regenerate Roadmap" button allows updating the plan with new constraints.

**Example.** Acme Retail's 12-week roadmap shows 3 phases. Phase 1 ("Support Engine", weeks 1-4) is highlighted in green at 90% complete — 4 of 5 tasks done, 2 of 2 milestones achieved. Phase 2 ("Cart Recovery + Growth Engine", weeks 5-8) starts Monday and is outlined in the timeline. Phase 3 ("Analytics Dashboard", weeks 9-12) is grayed out as future. The client clicks Phase 2 to see 5 deliverables and 3 milestones. The quick wins section shows 3 of 4 completed (checkmarks). The risk panel shows 1 medium risk ("Email integration delay") with mitigation in progress.

---

## User Stories

- As a **business owner**, I want to see my AI transformation roadmap as a visual timeline so I understand the full plan and where we stand today.
- As a **business owner**, I want to see the current phase highlighted with its progress percentage so I know exactly how far along we are.
- As a **business owner**, I want to click on a phase to see its deliverables, milestones, and systems so I understand what each phase entails.
- As a **consultant**, I want to update phase progress, check off milestones, and track task completion so the roadmap reflects real-time status.
- As a **business owner**, I want a quick wins checklist so I can see immediate value being delivered even before the full roadmap completes.
- As a **consultant**, I want to track risk factors and their mitigation status so I can proactively manage issues that could delay the roadmap.
- As a **business owner**, I want to see success metrics with targets vs actuals so I can measure whether the AI transformation is delivering promised results.
- As a **consultant**, I want to regenerate the roadmap with updated parameters when scope or timelines change.

---

## Goals & Acceptance Criteria

- [ ] Horizontal Gantt-style timeline renders all roadmap phases as bars spanning their week ranges, with the full roadmap width representing total_weeks
- [ ] Current phase is visually highlighted (bold border, #84CC16 accent, "CURRENT" badge) with a progress bar showing completion percentage
- [ ] Completed phases show green fill (#84CC16), current phase shows partial fill based on progress, future phases show gray (#D4CFC8) fill
- [ ] Phase bars are labeled with phase title and week range (e.g., "Phase 1: Support Engine — Weeks 1-4")
- [ ] "Today" marker on the timeline shows the current position in the roadmap with a vertical dashed line
- [ ] Click a phase bar -> detail panel below shows: phase title, description, systems list with icons, deliverables list with status, milestones with completion checkmarks, estimated cost
- [ ] Hover a phase bar -> tooltip shows: phase title, week range, progress %, system count, deliverable count
- [ ] Phase dependencies are shown as arrows connecting dependent phases (if dependencies exist in the data)
- [ ] Quick wins checklist displays items from the wizard Step 5 AI output with checkbox toggle (consultant can mark complete)
- [ ] Risk factors panel shows each risk with severity (low/medium/high), description, mitigation plan, and mitigation status (not started/in progress/resolved)
- [ ] Success metrics table shows metric name, target value, current value, status indicator (on track/at risk/behind), and trend sparkline
- [ ] "Regenerate Roadmap" button opens a modal where the consultant can adjust parameters (timeline, budget, priority systems) and trigger AI regeneration
- [ ] Consultant-only actions (drag phase dates, check off items, update risks) are gated by role — clients see read-only view
- [ ] Roadmap data is sourced from `roadmaps` and `roadmap_phases` tables, which are populated from `wizard_answers(step-5).ai_results`
- [ ] Page follows design system: #F1EEEA background, #0A211F text, #84CC16 accents, Playfair Display headings, Lora body, 1200px max-width, card-based, no shadows, no gradients

---

## Wiring Plan

| Data need                         | Source table(s)                    | Query / logic                                                                                    |
| --------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| Roadmap overview                  | `roadmaps`                         | `SELECT * FROM roadmaps WHERE project_id = ?` — title, total_weeks, total_investment             |
| Roadmap phases                    | `roadmap_phases`                   | `SELECT * FROM roadmap_phases WHERE roadmap_id = ? ORDER BY phase_number`                        |
| Phase systems                     | `roadmap_phases`, `systems`        | Parse systems array from roadmap_phases, join with systems table for full details                 |
| Phase deliverables                | `deliverables`                     | `SELECT * FROM deliverables WHERE project_id = ? AND phase_id = ?`                               |
| Phase milestones                  | `milestones`                       | `SELECT * FROM milestones WHERE project_id = ? AND phase_id = ? ORDER BY due_date`               |
| Phase tasks and progress          | `tasks`                            | `SELECT * FROM tasks WHERE project_id = ? AND phase_id = ?` — count completed vs total for progress % |
| Quick wins                        | `wizard_answers`                   | Parse `ai_results.quick_wins` from Step 5 wizard answer                                          |
| Risk factors                      | `wizard_answers`                   | Parse `ai_results.risk_factors` from Step 5 wizard answer, with locally stored mitigation status  |
| Success metrics                   | `wizard_answers`                   | Parse `ai_results.success_metrics` from Step 5 wizard answer, with tracked actual values          |
| Current phase determination       | `roadmap_phases`, date math        | Compare current date against each phase's week_range relative to project start_date                |
| Project services                  | `project_services`, `services`     | `SELECT s.* FROM project_services ps JOIN services s ON ps.service_id = s.id WHERE ps.project_id = ?` |
| Roadmap regeneration              | `wizard_answers`, AI edge function | Send updated parameters + existing wizard data to AI, receive new roadmap, update tables           |

---

## Screen Purpose

Dedicated view for the AI transformation roadmap generated in wizard Step 5. This is the client's primary view of their implementation plan — showing phases, timelines, system deployments, and progress. The roadmap data comes directly from the wizard's generate-roadmap AI output stored in `wizard_answers(step-5).ai_results`. It translates complex project plans into an intuitive, interactive timeline that both clients and consultants reference daily.

---

## Target User

Business owners tracking their AI transformation timeline — this is their most-visited dashboard view. Consultants managing implementation, updating phase progress, and monitoring risks. Agency owners reviewing roadmap health across all client engagements.

---

## Core Features

1. **Interactive roadmap timeline** — Horizontal Gantt-style chart rendering all phases as bars across a week-numbered axis. Each bar spans the phase's week_range. The x-axis shows week numbers (Week 1 through total_weeks). A "Today" vertical marker shows current position. The timeline is horizontally scrollable for roadmaps longer than the viewport. Zoom controls allow viewing the full roadmap or focusing on a 4-week window.

2. **Phase detail cards** — When a phase is selected (clicked), a detail panel expands below the timeline showing:
   - Phase title and description
   - Systems being implemented (with system icons and names from the `systems` table)
   - Deliverables list with completion status (checkbox per deliverable)
   - Milestones with due dates and completion status
   - Estimated cost for the phase (from `roadmap_phases.estimated_cost`)
   - Task count: X of Y complete

3. **Current phase highlight** — The phase whose week_range encompasses the current date (relative to project start) is visually prominent: bold #84CC16 border, "CURRENT" badge, and a progress bar within the phase bar showing task completion percentage. Completed phases have a solid #84CC16 fill. Future phases have a #D4CFC8 gray fill.

4. **Phase dependencies visualization** — Where phases have dependencies (Phase 2 cannot start until Phase 1 milestone X is complete), arrow connectors show the relationship. Unmet dependencies are shown with a red dashed arrow.

5. **Quick wins checklist** — A card showing quick-win items from the wizard Step 5 AI output. Each item has a checkbox that consultants can toggle to mark as completed. Quick wins are ordered by impact and show a brief description. Progress fraction displayed (e.g., "3 of 4 completed").

6. **Risk factors panel** — Lists risk items identified by the wizard Step 5 AI with severity badge (Low = gray, Medium = amber, High = red), description, mitigation plan text, and mitigation status selector (Not Started / In Progress / Resolved). Consultants update the status; clients see the current state.

7. **Success metrics tracker** — Table showing each success metric from the wizard AI output with: metric name, target value (from AI), current actual value (manually entered or from data), status indicator (On Track = green, At Risk = amber, Behind = red), and a sparkline showing the trend over the past 4 data points.

8. **Regenerate roadmap** — Button that opens a modal where the consultant can adjust: total timeline (weeks), budget constraints, priority systems (reorder or remove), and add new constraints. Submitting triggers the AI to regenerate the roadmap, updating `roadmaps` and `roadmap_phases` while preserving completed phase data.

---

## Data Displayed

- **Timeline**: Phase bars with titles, week ranges, progress fill, "Today" marker, dependency arrows
- **Phase detail**: Title, description, system icons and names, deliverable list with statuses, milestone list with dates and checkmarks, estimated cost, task progress fraction
- **Quick wins**: Item description, completion checkbox, progress count (X of Y)
- **Risk factors**: Severity badge, risk description, mitigation plan, mitigation status, last updated date
- **Success metrics**: Metric name, target value (with unit), current value, status badge, trend sparkline
- **Roadmap header**: Roadmap title, total weeks, total investment, project name, client name, start date

---

## UI Components

| Component              | Description                                                                  |
| ---------------------- | ---------------------------------------------------------------------------- |
| `RoadmapGantt`         | Horizontal Gantt timeline with phase bars, week axis, and "Today" marker      |
| `PhaseBar`             | Individual phase bar with title, progress fill, and click interaction          |
| `PhaseDetailCard`      | Expanded panel showing systems, deliverables, milestones, and cost            |
| `TodayMarker`          | Vertical dashed line indicating current position in the timeline              |
| `DependencyArrow`      | SVG arrow connecting dependent phases                                         |
| `QuickWinChecklist`    | Card with checkbox items, progress count, and completion percentage            |
| `RiskFactorsPanel`     | Card listing risks with severity badges, mitigation text, and status selectors |
| `SuccessMetricsTable`  | Table with target vs actual values, status indicators, and sparklines          |
| `RegenerateButton`     | Button opening the regeneration modal with parameter adjustment form           |
| `PhaseProgressBar`     | Horizontal progress bar within a phase bar showing task completion %           |
| `SystemBadge`          | Pill-shaped badge showing system icon and name                                |
| `TimelineMarker`       | Markers for milestones positioned on the timeline at their due-date week      |
| `MilestoneDot`         | Dot indicator on the timeline for each milestone (filled = complete, outline = pending) |
| `ZoomControls`         | +/- buttons for timeline zoom level                                           |

---

## Layout Structure

```
+---------------------------------------------------------------+
| Sidebar (240px) | Main Content                                 |
|                 | +-------------------------------------------+ |
| [Navigation]    | | Roadmap Header                            | |
|                 | | Title | Weeks: 12 | Investment: $25,500   | |
|                 | +-------------------------------------------+ |
|                 | +-------------------------------------------+ |
|                 | | Roadmap Gantt Timeline (full width)       | |
|                 | | [Zoom Controls]                           | |
|                 | |                                           | |
|                 | | Wk1  Wk2  Wk3  Wk4 | Wk5  Wk6  Wk7  Wk8| |
|                 | | [===Phase 1: Support=] [==Phase 2: Cart==]| |
|                 | |         ^TODAY                            | |
|                 | |                                           | |
|                 | | (40% of viewport height)                  | |
|                 | +-------------------------------------------+ |
|                 | +-------------------------------------------+ |
|                 | | Phase Detail (selected phase)            | |
|                 | | +----------+----------+------------------+ | |
|                 | | | Systems  | Delivers | Milestones       | | |
|                 | | | [icons]  | [list]   | [list + checks]  | | |
|                 | | +----------+----------+------------------+ | |
|                 | +-------------------------------------------+ |
|                 | +------------------+------------------------+ |
|                 | | Quick Wins       | Risk Factors            | |
|                 | | [checklist]      | [risk list + status]    | |
|                 | +------------------+------------------------+ |
|                 | +-------------------------------------------+ |
|                 | | Success Metrics Table (full width)        | |
|                 | | Metric | Target | Actual | Status | Trend | |
|                 | +-------------------------------------------+ |
|                 | | [Regenerate Roadmap] button               | |
|                 | +-------------------------------------------+ |
+---------------------------------------------------------------+
```

- **Sidebar**: 240px, standard dashboard navigation
- **Main content**: Fills remaining width, max-width 1200px, centered
- **Timeline**: Full width, approximately 40% of viewport height, horizontally scrollable
- **Phase detail**: Full width below timeline, shows on phase selection
- **Quick wins + Risks**: Two-column (50/50) below phase detail
- **Success metrics**: Full-width table at the bottom
- **Background**: #F1EEEA, cards #FFFFFF, borders #D4CFC8

---

## Interaction Patterns

- **Click phase bar**: Phase detail panel expands below the timeline with a smooth animation, showing that phase's systems, deliverables, milestones, and cost. Previously selected phase collapses.
- **Hover phase bar**: Tooltip appears showing phase title, week range, progress percentage, system count, and deliverable count.
- **Drag phase dates (consultant only)**: Consultants can drag the start/end of a phase bar to adjust the week range. Shows a confirmation dialog before saving. Client users see the timeline as read-only.
- **Check off quick wins**: Consultant clicks a checkbox -> item toggles to complete -> progress count updates -> activity logged.
- **Update risk mitigation**: Consultant selects a new mitigation status from the dropdown -> status badge updates -> change logged with timestamp.
- **Update success metric**: Consultant clicks the "actual" value cell -> inline edit -> enters new value -> status indicator recalculates (on track if actual >= 80% of target, at risk if 50-80%, behind if < 50%).
- **Regenerate roadmap**: Click "Regenerate Roadmap" -> modal opens with current parameters pre-filled -> adjust timeline, budget, or system priorities -> click "Regenerate" -> loading state -> AI produces new roadmap -> timeline updates with new phases.
- **Zoom timeline**: Click +/- controls -> timeline zooms in (4-week window) or out (full roadmap view).
- **Timeline scroll**: Drag or swipe horizontally on the timeline to navigate across weeks.

---

## Example User Workflows

**Workflow 1: Client reviews their roadmap**
1. Acme Retail owner logs into the dashboard, navigates to "My Roadmap"
2. Sees a 12-week timeline with 3 phases: Support Engine (Weeks 1-4), Cart Recovery + Growth Engine (Weeks 5-8), Analytics Dashboard (Weeks 9-12)
3. Phase 1 is highlighted with "CURRENT" badge at 90% progress
4. "Today" marker sits at Week 3.5
5. Clicks Phase 1 -> detail panel shows: Support Engine system, 5 deliverables (4 complete, 1 in progress), 2 milestones (both achieved), $8,500 estimated cost
6. Scrolls to quick wins -> 3 of 4 completed (auto-reply templates, FAQ bot, ticket routing)
7. Checks success metrics -> "Average response time" target 30 seconds, actual 28 seconds (On Track, green)
8. Feels confident about the engagement and shares the roadmap link with their business partner

**Workflow 2: Consultant updates progress**
1. Consultant opens the Acme Retail roadmap
2. Checks off the final Phase 1 deliverable ("Support Engine Training Materials")
3. Phase 1 progress updates to 100%, bar fills completely with #84CC16
4. Clicks Phase 2 -> starts assigning tasks for next week
5. Updates a risk factor: "Email integration delay" mitigation status from "In Progress" to "Resolved"
6. Updates the success metric "Cart recovery rate" actual value to 12% (target 15%, showing "At Risk")
7. All changes are logged to activities table

**Workflow 3: Regenerating the roadmap**
1. Consultant learns that Acme Retail wants to add a chatbot system not in the original plan
2. Clicks "Regenerate Roadmap"
3. Modal shows current parameters: 12 weeks, $25,500, 3 systems
4. Adds "AI Chatbot" to the system list, adjusts timeline to 16 weeks
5. Clicks "Regenerate" -> AI produces a new 4-phase plan
6. Reviews the updated timeline: Phase 4 (AI Chatbot, Weeks 13-16) appears
7. Confirms and saves -> roadmap updates, client sees the new plan on their next visit

---

## AI Features

1. **Roadmap generation** — The initial roadmap is generated by AI in wizard Step 5 based on the client's business context (Step 1), industry diagnostics (Step 2), selected systems (Step 3), and readiness assessment (Step 4). The AI determines optimal phase ordering, duration, and dependencies.
2. **Roadmap regeneration** — When parameters change, AI regenerates the roadmap while preserving completed phases. It considers new constraints (longer timeline, additional systems, budget changes) and optimizes the remaining phases.
3. **Phase duration optimization** — AI suggests optimal phase durations based on historical data from similar projects. "Projects implementing Support Engine typically complete Phase 1 in 3.5 weeks, not 4."
4. **Risk assessment updates** — AI periodically reassesses risks based on current project progress. If tasks are running behind, it may elevate the severity of timeline-related risks.
5. **"What if" scenario modeling** — Consultant can ask "What if we add a chatbot system?" or "What if we compress to 8 weeks?" and AI shows the impact on the roadmap without committing changes.
6. **Progress-based recommendations** — When a phase completes ahead of schedule, AI suggests pulling the next phase forward or adding scope from the backlog.

---

## Data Sources

| Source Table         | Data Used                                                                      |
| -------------------- | ------------------------------------------------------------------------------ |
| `roadmaps`           | Top-level plan: title, total_weeks, total_investment, project_id               |
| `roadmap_phases`     | Phase details: phase_number, title, week_range, systems, deliverables, milestones, estimated_cost |
| `projects`           | Project context: name, client_id, start_date, status                           |
| `tasks`              | Per-phase task completion for progress calculation                              |
| `milestones`         | Per-phase milestone tracking with due dates and completion                      |
| `systems`            | System details: name, description, icon, capabilities                          |
| `project_services`   | Which services are active for this project                                     |
| `wizard_answers`     | Step 5 ai_results: quick_wins, risk_factors, success_metrics, full roadmap data |
| `deliverables`       | Per-phase deliverable tracking with status                                     |

---

## Automation Opportunities

- **Auto-advance current phase**: When all tasks and milestones in the current phase are complete, automatically mark the phase as complete and highlight the next phase as current.
- **Milestone notification**: When a milestone due date is within 3 days, send a notification to both the client and consultant.
- **Progress email**: Weekly email to the client showing roadmap progress: phases completed, current phase progress percentage, upcoming milestones.
- **Risk escalation**: When a risk's severity is high and mitigation is "Not Started" for more than 7 days, escalate to the agency owner.
- **Metric data pull**: For success metrics that can be measured automatically (e.g., response time from the support engine), pull actual values from the system APIs on a daily schedule.

---

## Visual Hierarchy

1. **Primary focus**: Gantt timeline occupying the top 40% of the viewport — the roadmap is the centerpiece and the first thing the user sees
2. **Secondary focus**: Phase detail panel — rich context about the selected phase, expanding on demand
3. **Tertiary focus**: Quick wins and risk factors side by side — operational status indicators
4. **Supporting focus**: Success metrics table at the bottom — outcome tracking that builds over time
5. **Typography**: Playfair Display for "AI Roadmap" page heading, roadmap title, and phase titles. Lora for all descriptions, deliverable names, milestone labels, metric names, and body text.
6. **Color system**:
   - Completed phases: Solid #84CC16 fill
   - Current phase: #84CC16 border with partial fill based on progress
   - Future phases: #D4CFC8 fill
   - "Today" marker: #0A211F dashed vertical line
   - Dependency arrows: #0A211F (met) or #DC2626 dashed (unmet)
   - Risk severity: Gray (low), amber (#F59E0B, medium), red (#DC2626, high)
   - Metric status: #84CC16 (on track), amber (at risk), red (behind)
7. **Phase bar labels**: White text on filled bars (completed/current), #0A211F text on gray bars (future)
8. **Information density**: Medium — the timeline is visually clean with detail accessible via interaction (click to expand). Detail panels are information-rich but organized into clear columns.

---

## Frontend Wiring

### Component Tree

```
AIRoadmapDashboardPage
├── RoadmapHeader
│   ├── h1 (roadmap title)                         # Playfair Display
│   ├── MetaBadges (total weeks, total investment, project name, client name)
│   └── RegenerateButton                           # consultant-only
├── RoadmapGantt
│   ├── ZoomControls (+/-)
│   ├── WeekAxis (Week 1 ... Week N)
│   ├── TodayMarker                                # vertical dashed line
│   ├── PhaseBar[] (one per roadmap_phase)
│   │   ├── PhaseProgressBar (fill %)
│   │   ├── MilestoneDot[] (positioned on timeline)
│   │   └── DependencyArrow[] (SVG connector)
│   └── PhaseTooltip                               # hover state
├── PhaseDetailCard                                 # shown when a phase is selected
│   ├── div.grid.grid-cols-3
│   │   ├── SystemBadge[]                          # systems in this phase
│   │   ├── DeliverablesList
│   │   │   └── DeliverableRow[] (checkbox + name + status)
│   │   └── MilestonesList
│   │       └── MilestoneRow[] (dot + name + due date + check)
│   └── PhaseCostBadge
├── div.grid.grid-cols-2
│   ├── QuickWinChecklist
│   │   └── QuickWinItem[] (checkbox + description)
│   └── RiskFactorsPanel
│       └── RiskRow[] (severity badge + description + mitigation + status dropdown)
├── SuccessMetricsTable
│   └── MetricRow[] (name, target, actual, status indicator, TrendSparkline)
└── RegenerateRoadmapModal                          # consultant-only
    ├── TimelineAdjuster (total weeks slider)
    ├── BudgetInput
    ├── SystemPriorityList (drag to reorder / remove)
    └── ConstraintsTextarea
```

### TypeScript Interfaces

```typescript
interface Roadmap {
  id: string;
  project_id: string;
  title: string;
  total_weeks: number;
  total_investment: number;
  created_at: string;
  updated_at: string;
}

interface RoadmapPhase {
  id: string;
  roadmap_id: string;
  phase_number: number;
  title: string;
  description: string;
  week_start: number;
  week_end: number;
  systems: string[];              // system IDs or names
  deliverables: PhaseDeliverable[];
  milestones: PhaseMilestone[];
  estimated_cost: number;
  status: 'completed' | 'current' | 'future';
  progress_pct: number;           // 0-100, derived from tasks
}

interface PhaseDeliverable {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface PhaseMilestone {
  id: string;
  name: string;
  due_date: string;
  completed: boolean;
  week_number: number;            // for positioning on timeline
}

interface SystemInfo {
  id: string;
  name: string;
  icon_url: string | null;
  description: string;
}

interface QuickWin {
  id: string;                     // client-generated or from wizard data
  description: string;
  completed: boolean;
  impact: 'high' | 'medium' | 'low';
}

interface RiskFactor {
  id: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  mitigation_plan: string;
  mitigation_status: 'not_started' | 'in_progress' | 'resolved';
  updated_at: string;
}

interface SuccessMetric {
  id: string;
  metric_name: string;
  target_value: string;
  current_value: string | null;
  status: 'on_track' | 'at_risk' | 'behind';
  trend: number[];                // last 4 data points for sparkline
  timeframe: string;
}

interface RoadmapViewData {
  roadmap: Roadmap;
  phases: RoadmapPhase[];
  quickWins: QuickWin[];
  riskFactors: RiskFactor[];
  successMetrics: SuccessMetric[];
  project: { id: string; name: string; start_date: string; client_name: string };
  currentWeek: number;            // derived from project start_date vs today
  userRole: 'owner' | 'consultant' | 'client';
}

interface RegenerateParams {
  total_weeks: number;
  budget: number;
  priority_systems: string[];
  constraints: string;
}
```

### Custom Hooks

```typescript
// Fetches full roadmap data for a project
function useRoadmap(projectId: string): {
  data: RoadmapViewData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

// Manages phase interactions (consultant-only mutations)
function usePhaseActions(roadmapId: string): {
  toggleDeliverable: (phaseId: string, deliverableId: string) => Promise<void>;
  toggleMilestone: (phaseId: string, milestoneId: string) => Promise<void>;
  updatePhaseWeeks: (phaseId: string, weekStart: number, weekEnd: number) => Promise<void>;
};

// Manages quick wins checklist
function useQuickWins(projectId: string): {
  quickWins: QuickWin[];
  toggleQuickWin: (id: string) => Promise<void>;
};

// Manages risk factors
function useRiskFactors(projectId: string): {
  risks: RiskFactor[];
  updateMitigationStatus: (id: string, status: RiskFactor['mitigation_status']) => Promise<void>;
};

// Manages success metrics
function useSuccessMetrics(projectId: string): {
  metrics: SuccessMetric[];
  updateActualValue: (id: string, value: string) => Promise<void>;
};

// Handles roadmap regeneration
function useRegenerateRoadmap(projectId: string): {
  regenerate: (params: RegenerateParams) => Promise<void>;
  loading: boolean;
  error: string | null;
};
```

### State Management

| State                 | Location          | Notes                                                              |
| --------------------- | ----------------- | ------------------------------------------------------------------ |
| `projectId`           | URL route params  | `/dashboard/roadmap/:projectId`                                    |
| `selectedPhaseId`     | `useState`        | Which phase bar is clicked — controls `PhaseDetailCard` visibility  |
| `zoomLevel`           | `useState`        | Timeline zoom: `'full'` (all weeks) or `'focused'` (4-week window) |
| `scrollOffset`        | `useRef`          | Horizontal scroll position of the Gantt timeline                    |
| `regenerateModalOpen` | `useState`        | Controls `RegenerateRoadmapModal` visibility (consultant-only)      |
| `userRole`            | Context           | From auth context — gates consultant-only actions                   |

### Data Fetching Pattern

All hooks call the `api<T>()` helper from `src/lib/supabase.ts`:

```typescript
// useRoadmap — initial full data load
api<RoadmapViewData>(`/dashboard/roadmap/${projectId}`);

// usePhaseActions — mutations
api<void>(`/dashboard/roadmap/${roadmapId}/phases/${phaseId}/deliverables/${deliverableId}/toggle`, {
  method: 'PUT',
});

api<void>(`/dashboard/roadmap/${roadmapId}/phases/${phaseId}/milestones/${milestoneId}/toggle`, {
  method: 'PUT',
});

api<void>(`/dashboard/roadmap/${roadmapId}/phases/${phaseId}/weeks`, {
  method: 'PUT',
  body: { week_start: newStart, week_end: newEnd },
});

// useQuickWins
api<void>(`/dashboard/roadmap/${projectId}/quick-wins/${id}/toggle`, { method: 'PUT' });

// useRiskFactors
api<void>(`/dashboard/roadmap/${projectId}/risks/${id}`, {
  method: 'PUT',
  body: { mitigation_status: newStatus },
});

// useSuccessMetrics
api<void>(`/dashboard/roadmap/${projectId}/metrics/${id}`, {
  method: 'PUT',
  body: { current_value: newValue },
});

// useRegenerateRoadmap
api<RoadmapViewData>(`/dashboard/roadmap/${projectId}/regenerate`, {
  method: 'POST',
  body: { total_weeks, budget, priority_systems, constraints },
});
```

`useRoadmap` fetches once on mount and after any mutation via `refetch()`. Mutations are optimistic — the UI updates immediately and rolls back on error.

### Component Communication

- `PhaseBar` fires `onClick(phaseId)` — sets `selectedPhaseId` in the page; `PhaseDetailCard` renders the selected phase.
- `ZoomControls` updates `zoomLevel` state, which re-renders `RoadmapGantt` with new scale.
- `DeliverableRow` and `MilestoneRow` fire toggle callbacks that call `usePhaseActions` methods; on success, `useRoadmap.refetch()` re-fetches to update progress percentages.
- `QuickWinChecklist` items fire `toggleQuickWin` from `useQuickWins`; optimistic toggle with rollback.
- `RiskRow` dropdown fires `updateMitigationStatus` from `useRiskFactors`.
- `SuccessMetricsTable` inline edit fires `updateActualValue` from `useSuccessMetrics`; status recalculates on the server.
- `RegenerateRoadmapModal` on submit calls `useRegenerateRoadmap.regenerate()`, which returns a new `RoadmapViewData` that replaces the entire page state.
- Role-gating: consultant-only components (`RegenerateButton`, editable fields, drag handles) check `userRole` from auth context and render as read-only or hidden for `client` role.

---

## Backend Wiring

### New Edge Function Routes

| Method | Route                                                          | Description                                       | Request Body                                              | Response Shape         |
| ------ | -------------------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------------- | ---------------------- |
| GET    | `/dashboard/roadmap/:projectId`                                | Full roadmap data for a project                   | -                                                         | `RoadmapViewData`      |
| PUT    | `/dashboard/roadmap/:roadmapId/phases/:phaseId/deliverables/:id/toggle` | Toggle deliverable completion                | -                                                         | `{ success: boolean }` |
| PUT    | `/dashboard/roadmap/:roadmapId/phases/:phaseId/milestones/:id/toggle`   | Toggle milestone completion                  | -                                                         | `{ success: boolean }` |
| PUT    | `/dashboard/roadmap/:roadmapId/phases/:phaseId/weeks`          | Update phase week range (consultant drag)         | `{ week_start: number, week_end: number }`                | `{ success: boolean }` |
| PUT    | `/dashboard/roadmap/:projectId/quick-wins/:id/toggle`          | Toggle quick win completion                       | -                                                         | `{ success: boolean }` |
| PUT    | `/dashboard/roadmap/:projectId/risks/:id`                      | Update risk mitigation status                     | `{ mitigation_status: string }`                           | `{ success: boolean }` |
| PUT    | `/dashboard/roadmap/:projectId/metrics/:id`                    | Update success metric actual value                | `{ current_value: string }`                               | `{ metric: SuccessMetric }` |
| POST   | `/dashboard/roadmap/:projectId/regenerate`                     | AI-regenerate roadmap with new params             | `{ total_weeks, budget, priority_systems, constraints }`  | `RoadmapViewData`      |

### Supabase Client Queries

```typescript
// ── Full roadmap load ──
const { data: roadmap } = await adminClient()
  .from('roadmaps')
  .select('*')
  .eq('project_id', projectId)
  .single();

const { data: phases } = await adminClient()
  .from('roadmap_phases')
  .select('*')
  .eq('roadmap_id', roadmap.id)
  .order('phase_number');

// ── Phase systems (resolve names from IDs) ──
const systemIds = phases.flatMap(p => p.systems);
const { data: systems } = await adminClient()
  .from('systems')
  .select('id, name, description')
  .in('id', systemIds);

// ── Phase tasks for progress calculation ──
const { data: tasks } = await adminClient()
  .from('tasks')
  .select('id, phase_id, status')
  .eq('project_id', projectId);
// Group by phase_id, calculate completed/total per phase

// ── Phase milestones ──
const { data: milestones } = await adminClient()
  .from('milestones')
  .select('id, name, due_date, status, phase_id')
  .eq('project_id', projectId)
  .order('due_date');

// ── Phase deliverables ──
const { data: deliverables } = await adminClient()
  .from('deliverables')
  .select('id, name, status, phase_id')
  .eq('project_id', projectId);

// ── Quick wins, risk factors, success metrics from wizard Step 5 ──
const { data: wizardAnswer } = await adminClient()
  .from('wizard_answers')
  .select('ai_results')
  .eq('wizard_session_id', project.wizard_session_id)
  .eq('step', 5)
  .single();
// Parse wizardAnswer.ai_results.quick_wins, risk_factors, success_metrics
// Merge with locally stored completion/status data from a roadmap_extras table or JSONB column

// ── Project context ──
const { data: project } = await adminClient()
  .from('projects')
  .select('id, name, start_date, status, clients(name)')
  .eq('id', projectId)
  .single();

// ── Current week calculation ──
// currentWeek = Math.ceil((Date.now() - project.start_date) / (7 * 24 * 60 * 60 * 1000))

// ── Toggle deliverable ──
const { data } = await adminClient()
  .from('deliverables')
  .update({ status: newStatus })
  .eq('id', deliverableId)
  .select()
  .single();

// ── Toggle milestone ──
const { data } = await adminClient()
  .from('milestones')
  .update({ status: completed ? 'completed' : 'pending' })
  .eq('id', milestoneId)
  .select()
  .single();

// ── Update phase weeks (drag) ──
const { data } = await adminClient()
  .from('roadmap_phases')
  .update({ week_start, week_end })
  .eq('id', phaseId)
  .select()
  .single();

// ── Regenerate roadmap ──
// 1. Call AI edge function with params + existing wizard data
// 2. On success, update roadmaps and roadmap_phases tables
// 3. Preserve completed phase data (do not overwrite)
// 4. Return full RoadmapViewData
```

### RLS Policies Needed

| Table              | Policy Name               | Rule                                                                                |
| ------------------ | ------------------------- | ----------------------------------------------------------------------------------- |
| `roadmaps`         | `project_member_read`     | Allow SELECT where `project_id IN (SELECT id FROM projects WHERE client_id = ... OR assigned_to = auth.uid())` |
| `roadmaps`         | `consultant_write`        | Allow UPDATE where `auth.jwt()->>'role' IN ('owner', 'consultant')`                  |
| `roadmap_phases`   | `project_member_read`     | Allow SELECT via roadmap -> project membership check                                 |
| `roadmap_phases`   | `consultant_write`        | Allow UPDATE where `auth.jwt()->>'role' IN ('owner', 'consultant')`                  |
| `deliverables`     | `project_member_read`     | Allow SELECT where project membership matches                                        |
| `deliverables`     | `consultant_write`        | Allow UPDATE where `auth.jwt()->>'role' IN ('owner', 'consultant')`                  |
| `milestones`       | `project_member_read`     | Allow SELECT where project membership matches                                        |
| `milestones`       | `consultant_write`        | Allow UPDATE where `auth.jwt()->>'role' IN ('owner', 'consultant')`                  |
| `tasks`            | `project_member_read`     | Allow SELECT where project membership matches                                        |

Note: Clients get read-only access to their own project's roadmap. Consultants and owners get read-write. Edge functions use `adminClient()` after JWT verification.

### API Response TypeScript Interfaces

```typescript
interface RoadmapViewResponse {
  roadmap: Roadmap;
  phases: RoadmapPhase[];
  quickWins: QuickWin[];
  riskFactors: RiskFactor[];
  successMetrics: SuccessMetric[];
  project: {
    id: string;
    name: string;
    start_date: string;
    client_name: string;
  };
  currentWeek: number;
  userRole: 'owner' | 'consultant' | 'client';
}

interface RegenerateResponse {
  roadmap: Roadmap;
  phases: RoadmapPhase[];
  quickWins: QuickWin[];
  riskFactors: RiskFactor[];
  successMetrics: SuccessMetric[];
  project: {
    id: string;
    name: string;
    start_date: string;
    client_name: string;
  };
  currentWeek: number;
  userRole: 'owner' | 'consultant' | 'client';
  regeneration_note: string;  // AI explanation of what changed
}

interface ToggleResponse {
  success: boolean;
}

interface MetricUpdateResponse {
  metric: SuccessMetric;  // recalculated status
}
```

### Edge Cases

| Scenario                               | Handling                                                                                          |
| -------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Project has no roadmap yet             | Show empty state: "No roadmap generated. Complete wizard Step 5 to create one." with link to wizard |
| Roadmap with 0 phases                  | Show roadmap header with "No phases defined" message and "Regenerate" button                       |
| Current week exceeds total_weeks       | All phases shown as completed or overdue; "Today" marker at the right edge with "Past due" label   |
| Client tries to toggle a deliverable   | UI does not render checkboxes for `client` role — read-only view                                   |
| Consultant drags phase to overlap      | Validate on server — reject if week ranges overlap; return error "Phase dates cannot overlap"       |
| Regeneration fails (AI error)          | Show error toast "Roadmap regeneration failed. Your existing roadmap is unchanged." — no data lost  |
| wizard_answers Step 5 missing          | Quick wins, risk factors, success metrics sections show "Data not available" with muted text        |
| Milestone due date in the past + incomplete | Milestone dot on timeline is red; tooltip shows "Overdue by X days"                            |
| Deliverable status out of sync with tasks | Phase progress is derived from tasks table, not deliverable statuses — progress bar is authoritative |

---

## Detailed ASCII Wireframes

### Desktop Layout (1200px max-width)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER BAR (sticky, 56px)                                                                       │
│  Sun AI Agency          Dashboard  Projects  Clients  ...                         [Avatar ▾]    │
├────────────┬────────────────────────────────────────────────────────────────────────────────────┤
│            │                                                                                    │
│  SIDEBAR   │  ┌──────────────────────────────────────────────────────────────────────────────┐  │
│  (240px)   │  │  AI Transformation Roadmap — Acme Retail                                     │  │
│            │  │  12 weeks  ·  $25,500 total  ·  Started Jan 13, 2026                         │  │
│ ┌────────┐ │  └──────────────────────────────────────────────────────────────────────────────┘  │
│ │Overview│ │                                                                                    │
│ ├────────┤ │  ┌──────────────────────────────────────────────────────────────────────────────┐  │
│ │Pipeline│ │  │  Roadmap Timeline                                         [−] [+] Zoom      │  │
│ ├────────┤ │  │                                                                              │  │
│ │Projects│ │  │  Wk1   Wk2   Wk3   Wk4 │ Wk5   Wk6   Wk7   Wk8 │ Wk9  Wk10  Wk11  Wk12  │  │
│ ├────────┤ │  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │  │
│ │CRM     │ │  │                                                                              │  │
│ ├────────┤ │  │  ┌═══════════════════════════════════╗                                       │  │
│ │Finance │ │  │  ║ Phase 1: Support Engine  90% ████║░░  CURRENT                             │  │
│ ├────────┤ │  │  ║ Weeks 1-4                    ◆ ◆ ║    ◆ = milestone                       │  │
│ │Analytics│ │  │  ╚═══════════════════════════════════╝                                       │  │
│ ├────────┤ │  │                    ┆                                                          │  │
│ │▸Roadmap│ │  │                    ┆ TODAY (Wk 3.5)                                          │  │
│ ├────────┤ │  │                    ┆                                                          │  │
│ │Systems │ │  │                          ┌─────────────────────────────────┐                  │  │
│ └────────┘ │  │                          │ Phase 2: Cart + Growth    0%   │                  │  │
│            │  │                          │ Weeks 5-8              ○ ○ ○   │  ○ = pending ms  │  │
│            │  │                          └─────────────────────────────────┘                  │  │
│            │  │                                                                              │  │
│            │  │                                                  ┌──────────────────────────┐ │  │
│            │  │                                                  │ Phase 3: Analytics   0%  │ │  │
│            │  │                                                  │ Weeks 9-12         ○ ○   │ │  │
│            │  │                                                  └──────────────────────────┘ │  │
│            │  │                                                                              │  │
│            │  │  ── #84CC16 filled = complete  ░░ partial = current  ── gray = future ──     │  │
│            │  └──────────────────────────────────────────────────────────────────────────────┘  │
│            │                                                                                    │
│            │  ┌──────────────────────────────────────────────────────────────────────────────┐  │
│            │  │  Phase 1: Support Engine — Detail                              $8,500 est.   │  │
│            │  │  ─────────────────────────────────────────────────────────────────────────── │  │
│            │  │  ┌─────────────────┐ ┌─────────────────────┐ ┌────────────────────────────┐ │  │
│            │  │  │ Systems         │ │ Deliverables        │ │ Milestones                 │ │  │
│            │  │  │                 │ │                     │ │                            │ │  │
│            │  │  │ ┌─────────────┐│ │ ☑ Ticket routing    │ │ ◆ Bot live        Feb 3  ✓│ │  │
│            │  │  │ │🤖 Support  ││ │ ☑ Auto-reply setup  │ │ ◆ Training done   Feb 10 ✓│ │  │
│            │  │  │ │   Engine   ││ │ ☑ FAQ bot trained    │ │                            │ │  │
│            │  │  │ └─────────────┘│ │ ☑ Escalation rules  │ │                            │ │  │
│            │  │  │                 │ │ ☐ Training materials│ │                            │ │  │
│            │  │  │                 │ │                     │ │                            │ │  │
│            │  │  │                 │ │ 4 of 5 complete     │ │ 2 of 2 complete            │ │  │
│            │  │  └─────────────────┘ └─────────────────────┘ └────────────────────────────┘ │  │
│            │  └──────────────────────────────────────────────────────────────────────────────┘  │
│            │                                                                                    │
│            │  ┌────────────────────────────────┬─────────────────────────────────┐              │
│            │  │ Quick Wins            3/4      │ Risk Factors                    │              │
│            │  │ ──────────────────────────     │ ───────────────────────────     │              │
│            │  │ ☑ Auto-reply templates  HIGH   │ 🟡 MEDIUM                       │              │
│            │  │ ☑ FAQ bot on website    HIGH   │ Email integration delay          │              │
│            │  │ ☑ Ticket routing live   MED    │ Mitigation: Use temp SMTP        │              │
│            │  │ ☐ Team training video   MED    │ Status: [In Progress ▾]          │              │
│            │  │                                │                                  │              │
│            │  │                                │ 🟢 LOW                            │              │
│            │  │                                │ Staff adoption resistance          │              │
│            │  │                                │ Mitigation: Training sessions      │              │
│            │  │                                │ Status: [Resolved ▾]              │              │
│            │  └────────────────────────────────┴─────────────────────────────────┘              │
│            │                                                                                    │
│            │  ┌──────────────────────────────────────────────────────────────────────────────┐  │
│            │  │ Success Metrics                                                              │  │
│            │  │ ┌──────────────────────┬──────────┬──────────┬──────────┬───────────────────┐│  │
│            │  │ │ Metric               │ Target   │ Actual   │ Status   │ Trend             ││  │
│            │  │ ├──────────────────────┼──────────┼──────────┼──────────┼───────────────────┤│  │
│            │  │ │ Avg response time    │ 30s      │ 28s      │ ● On Trk │ ╱╲╱╲╱╲ ↓        ││  │
│            │  │ │ Ticket resolution    │ 85%      │ 72%      │ ● At Risk│ ╱╲╱╲╱╲ ↑        ││  │
│            │  │ │ Customer satisfaction│ 4.5/5    │ 4.2/5    │ ● On Trk │ ╱╲╱╲╱╲ →        ││  │
│            │  │ │ Cart recovery rate   │ 15%      │ 8%       │ ● Behind │ ╱╲╱╲╱╲ ↑        ││  │
│            │  │ └──────────────────────┴──────────┴──────────┴──────────┴───────────────────┘│  │
│            │  └──────────────────────────────────────────────────────────────────────────────┘  │
│            │                                                                                    │
│            │  ┌──────────────────────────────────────────────────────────────────────────────┐  │
│            │  │                                                    [Regenerate Roadmap]       │  │
│            │  └──────────────────────────────────────────────────────────────────────────────┘  │
│            │                                                                                    │
├────────────┴────────────────────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Tablet Layout (768px)

```
┌─────────────────────────────────────────────────────┐
│ HEADER (56px)               [☰ Menu]    [Avatar ▾]  │
├─────────────────────────────────────────────────────┤
│ AI Transformation Roadmap — Acme Retail             │
│ 12 weeks · $25,500 · Started Jan 13                 │
├─────────────────────────────────────────────────────┤
│ Roadmap Timeline (horizontal scroll)     [−][+]     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Wk1  Wk2  Wk3  Wk4 │ Wk5  Wk6  Wk7  Wk8      │ │
│ │ ╔══════════════════╗                             │ │
│ │ ║ Phase 1: Support ║  90% CURRENT               │ │
│ │ ╚══════════════════╝                             │ │
│ │            ┆TODAY            ┌────────────────┐  │ │
│ │                              │ Phase 2: Cart  │  │ │
│ │                              └────────────────┘  │ │
│ │                   ← scroll for Wk9-12 →          │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ Phase 1: Support Engine Detail          $8,500 est. │
│ ┌────────────────┐ ┌───────────────────────────┐    │
│ │ Systems        │ │ Deliverables     4/5      │    │
│ │ 🤖 Support Eng │ │ ☑ Ticket routing          │    │
│ └────────────────┘ │ ☑ Auto-reply              │    │
│                    │ ☑ FAQ bot                  │    │
│ ┌────────────────┐ │ ☑ Escalation              │    │
│ │ Milestones 2/2 │ │ ☐ Training materials      │    │
│ │ ◆ Bot live   ✓│ └───────────────────────────┘    │
│ │ ◆ Training   ✓│                                  │
│ └────────────────┘                                  │
├──────────────────────┬──────────────────────────────┤
│ Quick Wins    3/4    │ Risk Factors                  │
│ ☑ Auto-reply  HIGH   │ 🟡 Email delay               │
│ ☑ FAQ bot     HIGH   │   [In Progress ▾]            │
│ ☑ Routing     MED    │ 🟢 Staff adoption             │
│ ☐ Training    MED    │   [Resolved ▾]               │
├──────────────────────┴──────────────────────────────┤
│ Success Metrics (full width)                        │
│ Metric          │ Target │ Actual │ Status │ Trend  │
│ Avg response    │ 30s    │ 28s    │ ●OnTrk │ ╱╲╱╲  │
│ Resolution      │ 85%    │ 72%    │ ●AtRsk │ ╱╲╱╲  │
├─────────────────────────────────────────────────────┤
│                              [Regenerate Roadmap]   │
└─────────────────────────────────────────────────────┘
```

### Mobile Layout (375px)

```
┌───────────────────────────────────┐
│ HEADER             [☰]  [Avatar] │
├───────────────────────────────────┤
│ AI Roadmap — Acme Retail          │
│ 12 wk · $25.5K · Jan 13          │
├───────────────────────────────────┤
│ Timeline (horizontal scroll)      │
│ ┌───────────────────────────────┐ │
│ │ ╔═══════════════╗            │ │
│ │ ║ Phase 1  90% ║ CURRENT    │ │
│ │ ║ Wk 1-4      ║            │ │
│ │ ╚═══════════════╝            │ │
│ │       ┆TODAY                 │ │
│ │          ┌───────────────┐   │ │
│ │          │ Phase 2  0%   │   │ │
│ │          │ Wk 5-8        │   │ │
│ │          └───────────────┘   │ │
│ │ ← scroll for more phases →  │ │
│ └───────────────────────────────┘ │
├───────────────────────────────────┤
│ Phase 1: Support Engine           │
│ $8,500 estimated                  │
│ ┌───────────────────────────────┐ │
│ │ Systems: 🤖 Support Engine    │ │
│ ├───────────────────────────────┤ │
│ │ Deliverables           4/5   │ │
│ │ ☑ Ticket routing             │ │
│ │ ☑ Auto-reply setup           │ │
│ │ ☑ FAQ bot trained            │ │
│ │ ☑ Escalation rules           │ │
│ │ ☐ Training materials         │ │
│ ├───────────────────────────────┤ │
│ │ Milestones             2/2   │ │
│ │ ◆ Bot live       Feb 3  ✓   │ │
│ │ ◆ Training done  Feb 10 ✓   │ │
│ └───────────────────────────────┘ │
├───────────────────────────────────┤
│ Quick Wins                  3/4  │
│ ┌───────────────────────────────┐ │
│ │ ☑ Auto-reply templates HIGH  │ │
│ │ ☑ FAQ bot on website   HIGH  │ │
│ │ ☑ Ticket routing       MED   │ │
│ │ ☐ Team training video  MED   │ │
│ └───────────────────────────────┘ │
├───────────────────────────────────┤
│ Risk Factors                      │
│ ┌───────────────────────────────┐ │
│ │ 🟡 Email integration delay    │ │
│ │   Mitigation: temp SMTP       │ │
│ │   [In Progress ▾]            │ │
│ ├───────────────────────────────┤ │
│ │ 🟢 Staff adoption resistance  │ │
│ │   [Resolved ▾]               │ │
│ └───────────────────────────────┘ │
├───────────────────────────────────┤
│ Success Metrics (scroll horiz)    │
│ Metric     │Target│Actual│Status │
│ Avg resp   │ 30s  │ 28s  │●OnTrk │
│ Resolution │ 85%  │ 72%  │●AtRsk │
│ Satisfact. │ 4.5  │ 4.2  │●OnTrk │
│ Cart recov │ 15%  │ 8%   │●Behind│
├───────────────────────────────────┤
│       [Regenerate Roadmap]        │
└───────────────────────────────────┘
```

### Key Component Detail: Phase Bar

```
  Completed phase:
  ╔═══════════════════════════════════════════╗
  ║████████████████████████████████████ 100%  ║
  ║ Phase 1: Support Engine — Weeks 1-4      ║
  ║ ◆ ◆                                      ║   ◆ filled = milestone complete
  ╚═══════════════════════════════════════════╝
    fill: #84CC16, border: 2px #84CC16, text: #FFFFFF

  Current phase:
  ╔═══════════════════════════════════════════╗
  ║████████████████████████░░░░░░░░░░░░ 65%  ║   CURRENT badge
  ║ Phase 2: Cart + Growth — Weeks 5-8       ║
  ║ ◆ ○ ○                                    ║   ○ outline = milestone pending
  ╚═══════════════════════════════════════════╝
    fill: partial #84CC16, border: 2px #84CC16 bold, remaining: #E5E7EB

  Future phase:
  ┌───────────────────────────────────────────┐
  │                                           │
  │ Phase 3: Analytics Dashboard — Weeks 9-12 │
  │ ○ ○                                       │
  └───────────────────────────────────────────┘
    fill: #D4CFC8, border: 1px #D4CFC8, text: #0A211F
```

### Key Component Detail: Regenerate Roadmap Modal

```
┌─────────────────────────────────────────────────┐
│  Regenerate Roadmap                        [✕]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  Timeline (weeks)                               │
│  ┌─────────────────────────────────────────┐    │
│  │  4   8   12   ●16   20   24            │    │
│  └─────────────────────────────────────────┘    │
│                   Current: 12 → New: 16         │
│                                                 │
│  Budget                                         │
│  ┌──────────────────────────────────┐           │
│  │ $ 32,000                        │           │
│  └──────────────────────────────────┘           │
│                                                 │
│  Priority Systems (drag to reorder)             │
│  ┌──────────────────────────────────┐           │
│  │ ≡ 1. Support Engine             │           │
│  │ ≡ 2. Cart Recovery              │           │
│  │ ≡ 3. Growth Engine              │           │
│  │ ≡ 4. AI Chatbot  ← NEW         │           │
│  └──────────────────────────────────┘           │
│  [+ Add System]                                 │
│                                                 │
│  Additional Constraints                         │
│  ┌──────────────────────────────────┐           │
│  │ Need chatbot live by Week 16.   │           │
│  │ Phase 1 already complete, keep  │           │
│  │ as-is.                          │           │
│  └──────────────────────────────────┘           │
│                                                 │
│  ┌──────────────────┐ ┌──────────────────────┐  │
│  │     Cancel       │ │  Regenerate    ⟳     │  │
│  └──────────────────┘ └──────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## Outcomes

| Outcome                                 | Metric                                                | Target            |
| --------------------------------------- | ----------------------------------------------------- | ----------------- |
| Client roadmap engagement               | Client views of roadmap dashboard per week              | 3+ per client     |
| Phase completion tracking               | Phases with up-to-date progress data                    | 100%              |
| Quick win delivery                      | Quick wins completed within first 2 weeks               | > 75%             |
| Risk visibility                         | Risks with documented mitigation plans                  | 100%              |
| Success metric tracking                 | Metrics with current actual values updated monthly       | > 80%             |
| Roadmap accuracy                        | Phases completed within original week range estimate     | > 70%             |
| Client confidence                       | Reduction in "what is happening?" support requests       | > 50% reduction   |
