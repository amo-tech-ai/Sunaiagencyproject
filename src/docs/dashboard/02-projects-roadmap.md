# 02 — PROJECTS & ROADMAP
# Project Detail + Interactive Roadmap Timeline

**Components:** `ProjectsList`, `ProjectDetail`, `RoadmapPage`
**Routes:** `/app/projects`, `/app/projects/:id`, `/app/roadmap`
**Status:** NOT STARTED
**Parent Doc:** `00-dashboard-master.md`

---

## SCREEN PURPOSE

### Projects List
Shows all projects for the org. For MVP, most users have one project (from their wizard session). Agency consultants may see multiple (one per client engagement). Each project card shows name, phase, progress, and status.

### Project Detail
Deep dive into a single project: all phases, every deliverable as a toggleable task, milestones with due dates, the selected AI systems, and the strategy brief. This is where work gets tracked.

### Roadmap Page
Full-screen interactive roadmap timeline. Shows all phases horizontally (or vertically on mobile) with deliverables, milestones, and progress per phase. The primary "work" view for tracking implementation.

---

## ASCII WIREFRAME — Projects List (Desktop)

```
┌─────────────┬──────────────────────────────────────────────────────────────┐
│  SIDEBAR    │  HEADER                                                      │
│             │  Projects                                    🔔    JD ▾      │
│             ├──────────────────────────────────────────────────────────────┤
│             │                                                              │
│             │  YOUR PROJECTS                                               │
│             │                                                              │
│             │  ┌────────────────────────────────────────────────────────┐  │
│             │  │                                                        │  │
│             │  │  AI Transformation — Acme Retail Group      ● Active  │  │
│             │  │                                                        │  │
│             │  │  Phase 1: Foundation           ████████░░░░░░ 35%     │  │
│             │  │  3 systems · 12 weeks · Started Mar 6                 │  │
│             │  │                                                        │  │
│             │  │  Next: Deploy customer support chatbot                 │  │
│             │  │                                                        │  │
│             │  │  [View Project →]                [View Roadmap →]      │  │
│             │  └────────────────────────────────────────────────────────┘  │
│             │                                                              │
│             │  ┌────────────────────────────────────────────────────────┐  │
│             │  │  (Future: additional projects appear here)             │  │
│             │  │  Each card: same layout as above                       │  │
│             │  └────────────────────────────────────────────────────────┘  │
│             │                                                              │
└─────────────┴──────────────────────────────────────────────────────────────┘
```

---

## ASCII WIREFRAME — Project Detail (Desktop)

```
┌─────────────┬──────────────────────────────────────────────────────────────┐
│  SIDEBAR    │  Projects / AI Transformation                🔔    JD ▾     │
│             ├──────────────────────────────────────────────────────────────┤
│             │                                                              │
│             │  ┌──────────────────────────────────────────────────────┐    │
│             │  │  PROJECT HEADER                                      │    │
│             │  │                                                      │    │
│             │  │  AI Transformation — Acme Retail Group    ● Active   │    │
│             │  │  12 weeks · 3 systems · Est. $35K-$55K              │    │
│             │  │  ─── ─── ─── ── (green accent bar)                  │    │
│             │  └──────────────────────────────────────────────────────┘    │
│             │                                                              │
│             │  ┌─────────────────────┐ ┌──────────────────────────────┐   │
│             │  │ SYSTEMS SELECTED    │ │ KEY MILESTONES               │   │
│             │  │                     │ │                              │   │
│             │  │ ① Support Engine   │ │ ☐ Chatbot deployed   Wk 2  │   │
│             │  │ ② Cart Recovery    │ │ ☑ Data audit done    Wk 1  │   │
│             │  │ ③ Recommendation   │ │ ☐ Phase 1 review     Wk 4  │   │
│             │  │                     │ │ ☐ Phase 2 kickoff    Wk 5  │   │
│             │  └─────────────────────┘ └──────────────────────────────┘   │
│             │                                                              │
│             │  PHASE 1: FOUNDATION                          Weeks 1-4     │
│             │  ┌──────────────────────────────────────────────────────┐    │
│             │  │ ████████████░░░░░░░░░░░░░░░░░░░░░░░░  35%           │    │
│             │  └──────────────────────────────────────────────────────┘    │
│             │                                                              │
│             │  ┌──────────────────────────────────────────────────────┐    │
│             │  │ ☑  Requirements gathering              ✓ Done       │    │
│             │  ├──────────────────────────────────────────────────────┤    │
│             │  │ ☑  Data audit and mapping               ✓ Done       │    │
│             │  ├──────────────────────────────────────────────────────┤    │
│             │  │ ☐  Configure support engine             ◉ In Progress│    │
│             │  ├──────────────────────────────────────────────────────┤    │
│             │  │ ☐  Deploy customer support chatbot      ○ Not Started│    │
│             │  ├──────────────────────────────────────────────────────┤    │
│             │  │ ☐  Integration testing                  ○ Not Started│    │
│             │  ├──────────────────────────────────────────────────────┤    │
│             │  │ ☐  Staff training                       ○ Not Started│    │
│             │  └──────────────────────────────────────────────────────┘    │
│             │                                                              │
│             │  PHASE 2: GROWTH (locked — starts after Phase 1)            │
│             │  ┌──────────────────────────────────────────────────────┐    │
│             │  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0%            │    │
│             │  │ (collapsed — click to preview deliverables)           │    │
│             │  └──────────────────────────────────────────────────────┘    │
│             │                                                              │
└─────────────┴──────────────────────────────────────────────────────────────┘
```

---

## ASCII WIREFRAME — Roadmap Page (Desktop)

```
┌─────────────┬──────────────────────────────────────────────────────────────┐
│  SIDEBAR    │  Roadmap                                     🔔    JD ▾     │
│             ├──────────────────────────────────────────────────────────────┤
│             │                                                              │
│             │  AI TRANSFORMATION ROADMAP                                   │
│             │  12 weeks · 3 phases · Acme Retail Group                    │
│             │                                                              │
│             │  ┌──────────────────────────────────────────────────────┐    │
│             │  │                                                      │    │
│             │  │   Wk1  Wk2  Wk3  Wk4  Wk5  Wk6  Wk7  Wk8  Wk9-12│    │
│             │  │   ┌─────────────────┐                                │    │
│             │  │   │  PHASE 1        │                                │    │
│             │  │   │  Foundation     │                                │    │
│             │  │   │  ████████░░░░   │                                │    │
│             │  │   │  35% · 2/6 done │                                │    │
│             │  │   │  ● Current      │                                │    │
│             │  │   └────────┬────────┘                                │    │
│             │  │            │                                          │    │
│             │  │            ▼                                          │    │
│             │  │            ┌─────────────────┐                       │    │
│             │  │            │  PHASE 2        │                       │    │
│             │  │            │  Growth         │                       │    │
│             │  │            │  ░░░░░░░░░░░░   │                       │    │
│             │  │            │  0% · 0/4 done  │                       │    │
│             │  │            │  ○ Upcoming      │                       │    │
│             │  │            └────────┬────────┘                       │    │
│             │  │                     │                                 │    │
│             │  │                     ▼                                 │    │
│             │  │                     ┌─────────────────┐              │    │
│             │  │                     │  PHASE 3        │              │    │
│             │  │                     │  Scale          │              │    │
│             │  │                     │  ░░░░░░░░░░░░   │              │    │
│             │  │                     │  0% · 0/3 done  │              │    │
│             │  │                     │  ○ Future        │              │    │
│             │  │                     └─────────────────┘              │    │
│             │  │                                                      │    │
│             │  └──────────────────────────────────────────────────────┘    │
│             │                                                              │
│             │  RISK FACTORS                                                │
│             │  ┌──────────────────────────────────────────────────────┐    │
│             │  │ ⚠ Data quality — Mitigation: audit in Phase 1       │    │
│             │  │ ⚠ Team capacity — Mitigation: phased rollout        │    │
│             │  └──────────────────────────────────────────────────────┘    │
│             │                                                              │
│             │  SUCCESS METRICS                                             │
│             │  ┌────────────┐ ┌────────────┐ ┌────────────┐              │
│             │  │ Response   │ │ Cart       │ │ Order      │              │
│             │  │ Time       │ │ Recovery   │ │ Value      │              │
│             │  │ -80%       │ │ +15%       │ │ +20%       │              │
│             │  │ by Wk 4    │ │ by Wk 8    │ │ by Wk 12   │              │
│             │  └────────────┘ └────────────┘ └────────────┘              │
│             │                                                              │
└─────────────┴──────────────────────────────────────────────────────────────┘
```

---

## CONTENT DATA — Projects

| Field | Source | Path |
|-------|--------|------|
| Project name | step 5 ai_results | roadmap.title or "[companyName] — AI Transformation" |
| Total weeks | step 5 ai_results | roadmap.totalWeeks |
| Total investment | step 5 ai_results | roadmap.totalInvestment |
| Phases array | step 5 ai_results | roadmap.phases |
| Phase title | Each phase | phases[n].title |
| Phase week range | Each phase | phases[n].weekRange |
| Phase deliverables | Each phase | phases[n].deliverables (array of strings) |
| Phase milestones | Each phase | phases[n].milestones |
| Phase estimated cost | Each phase | phases[n].estimatedCost |
| Quick wins | step 5 ai_results | roadmap.quickWins |
| Risk factors | step 5 ai_results | roadmap.riskFactors |
| Success metrics | step 5 ai_results | roadmap.successMetrics |
| Selected systems | step 3 context_snapshot | step3.selectedSystems (array of IDs) |
| System details | Static data | AI_SYSTEMS from wizardData.ts, filtered by selected IDs |

---

## TASK STATUS MODEL

Each deliverable from a roadmap phase becomes a task. Tasks have three statuses:

| Status | Visual | Interaction |
|--------|--------|-------------|
| Not Started | Empty checkbox ☐, gray text | Click to move to In Progress |
| In Progress | Half-filled indicator ◉, normal text, green left border | Click to complete |
| Completed | Filled checkbox ☑, strikethrough text, muted color | Click to revert |

Task status is stored locally in dashboard state for MVP. When the tasks table exists, status changes persist to the database. Each status change logs an activity.

Phase progress = completed tasks / total tasks per phase. Phase status: Active (has at least one in-progress or not-started task and is the current phase), Completed (all tasks done), Locked (previous phase not yet completed).

---

## MILESTONE MODEL

Milestones are key checkpoints within phases. Each milestone has: title, due date (derived from phase week range), status (pending, completed, overdue). A milestone is overdue if the current date is past its due date and it is not completed.

Milestone completion triggers: a celebration micro-animation (green checkmark scales in), an activity log entry, a progress recalculation, and if all milestones in a phase are done, a phase completion check.

---

## INTERACTION PATTERNS — Roadmap

- Click a phase block to expand/collapse its deliverables and milestones inline
- The current phase is always expanded by default
- Future phases show a "locked" state with muted colors and a lock icon
- Hovering a phase block shows a subtle elevation (translateY -1px)
- Clicking a deliverable toggles its task status
- The week scale at the top highlights the current week
- A vertical "today" marker line shows where the project stands on the timeline

---

## INTERACTION PATTERNS — Project Detail

- Breadcrumb navigation: Projects > [Project Name]
- Systems selected section shows AI system cards from wizardData.ts static data, filtered to the selected IDs
- Each system card is read-only (no toggling, that happened in the wizard)
- Milestones section shows all milestones across all phases with status and due date
- Overdue milestones are highlighted with red border and "Overdue" badge
- The phase sections are collapsible accordions, current phase expanded by default
- Each deliverable row is a clickable task with status toggle

---

## EMPTY STATE — No Projects

If no completed wizard session exists, the projects page shows: "No projects yet. Complete the discovery wizard to create your first AI transformation project." with a "Start Wizard" CTA.

---

## MOBILE ADAPTATIONS

Projects list: full-width cards stacked vertically, no horizontal scroll.
Project detail: systems and milestones stack vertically instead of side-by-side. Phase sections use full width. Task rows use full width with status indicator on the right.
Roadmap: phases stack vertically with connecting arrows pointing down. Week scale hidden on mobile, replaced by week range labels on each phase block.

---

## BACKEND WIRING

All data comes from wizardApi.load(sessionId) parsing ai_results from step 5. No new endpoints needed for MVP.

Task status changes for MVP are stored in localStorage keyed by sessionId + phase + task index. When the tasks table exists, status changes call a new PATCH /tasks/:id endpoint.

When the projects, roadmaps, roadmap_phases, tasks, and milestones tables exist, the data hooks swap from parsing ai_results to querying proper tables with RLS.

---

## ACCEPTANCE CRITERIA

- Projects list shows all projects derived from completed wizard sessions
- Project detail shows phases, deliverables as tasks, milestones, and selected systems
- Task status can be toggled between not-started, in-progress, and completed
- Phase progress bar updates when tasks are toggled
- Roadmap page shows full timeline with all phases and current phase highlighted
- Risk factors and success metrics display from step 5 ai_results
- Empty state shown when no completed sessions exist
- Responsive: phases stack vertically on mobile
- Overdue milestones highlighted with red visual treatment
