---
id: 027-project-delivery-dashboard
diagram_id: DASH-03
prd_section: Dashboard
title: Project delivery dashboard — milestones, tasks, deliverables, and phase tracking
skill: frontend
phase: HIGH
priority: P1
status: Not Started
owner: Frontend
dependencies:
  - 025-dashboard-overview
estimated_effort: L
percent_complete: 0
area: client-dashboard
wizard_step: null
schema_tables: [projects, tasks, milestones, deliverables, roadmaps, roadmap_phases, project_services, team_members]
figma_prompt: prompts/027-project-delivery-dashboard.md
---

## Summary Table

| Aspect | Details |
|--------|---------|
| **Screens** | Project Delivery (`/app/projects/:id`) |
| **Features** | Phase timeline, task kanban, milestone tracker, deliverables checklist, team assignments, budget tracking |
| **Edge Functions** | task-generator (auto-create tasks from roadmap) |
| **Tables** | projects, tasks, milestones, deliverables, roadmaps, roadmap_phases, project_services, team_members |
| **Agents** | task-generator (gemini-3-flash-preview, medium thinking) |
| **Real-World** | "Acme Retail Phase 1 is 80% complete — consultant drags 'Configure chatbot responses' to Done, milestone auto-completes" |

---

## Description

**The situation:** When the wizard completes at Step 5, it generates a roadmap with phases, timelines, and investment estimates stored in `wizard_answers.ai_results`. A project record is created in the `projects` table and phases are inserted into `roadmap_phases`. However, there is no interface to view, manage, or track progress on these projects. The roadmap data sits in the database with no operational view for day-to-day delivery.

**Why it matters:** The wizard's value proposition is turning AI analysis into an actionable project plan. Without a delivery dashboard, the roadmap is aspirational, not operational. Consultants cannot track task completion, business owners cannot see progress, and milestones pass without visibility. The gap between "wizard completed" and "value delivered" remains invisible.

**What already exists:** The `projects` table stores project records with status and org_id. The `roadmaps` and `roadmap_phases` tables hold the phase structure from Step 5. The `tasks` table supports task records with status, priority, assignee, and project_id FK. The `milestones` table tracks date-bound checkpoints. The `deliverables` table links outputs to milestones. The `project_services` table maps which AI systems are being implemented in each project. The `team_members` table stores team assignments. shadcn/ui provides Tabs, Card, Badge, Progress, Avatar, and Dialog components. The design system supports kanban-style layouts with card-based items.

**The build:** Create a `ProjectDelivery` page at `/app/projects/:id` with a top tab bar toggling between Timeline, Board, and List views. The Timeline view shows roadmap phases as a horizontal timeline with the current phase highlighted. The Board view renders a kanban with columns (To Do, In Progress, Review, Done) for the active phase's tasks. The List view shows all tasks across phases in a sortable table. A milestone tracker sidebar shows upcoming milestones with deliverable checklists. Team member avatars show assignments and workload. Budget vs. actual gauges track phase-level spending.

**Example:** Acme Retail Group has a 3-phase project: Phase 1 (Customer Support Engine, weeks 1-4), Phase 2 (Cart Recovery, weeks 5-8), Phase 3 (Recommendation Engine, weeks 9-12). The consultant opens the project delivery dashboard. The Timeline view shows Phase 1 highlighted as "Active" at 80% progress. She switches to the Board view — 8 tasks are visible: 5 in "Done", 1 in "Review" ("Train FAQ model"), 2 in "To Do" ("Configure chatbot responses", "Set up escalation rules"). She drags "Configure chatbot responses" to "In Progress". The milestone tracker on the right shows "Support Engine Go-Live" due in 5 days with 3 of 4 deliverables checked. When the last task completes, the milestone auto-marks as complete and Phase 2 becomes "Active".

---

## Rationale

**Problem:** Wizard-generated roadmaps and projects have no operational interface. Phases, tasks, and milestones exist in the database but are invisible to users.

**Solution:** A multi-view project delivery dashboard (Timeline, Board, List) that renders roadmap_phases as visual phases and tasks as draggable kanban cards. Milestones and deliverables provide progress checkpoints.

**Impact:** Consultants manage delivery from a single screen. Business owners track progress visually. Phase transitions are visible and milestone completion is tracked.

---

## Screen Purpose

The operational hub for tracking AI system implementation. Displays project phases from the wizard-generated roadmap, with tasks, milestones, deliverables, and team assignments. This is where the wizard's roadmap (Step 5) becomes an actionable project plan that both the agency and client can track day-to-day.

---

## Target User

- Agency consultants delivering AI system implementations
- Business owners tracking their project progress
- Agency project managers coordinating team workload

---

## Core Features

1. Project phase timeline view (from roadmap_phases, horizontal)
2. Task board per phase with status columns: To Do, In Progress, Review, Done (kanban)
3. Task list view with sortable columns across all phases
4. Milestone tracker with dates and completion status
5. Deliverables checklist per milestone (checkbox items)
6. Team member assignments with avatar row and workload indicators
7. Phase-level progress percentages (computed from task completion)
8. Budget vs. actual per phase (from roadmap_phases estimates vs. logged hours)
9. Project header with name, client, status, overall progress bar
10. View toggle: Timeline | Board | List (tab bar)

---

## Data Displayed

- Project name, client name, project status, overall progress percentage
- Phase list with names, date ranges, status (upcoming, active, completed), progress percentage
- Tasks per phase: name, description, assignee (avatar), status, priority (P0-P3), due date
- Milestones: name, due date, status (upcoming, at-risk, completed), linked deliverables count
- Deliverables: name, type (document, demo, deployment), status (pending, submitted, approved)
- Team members assigned to project: name, avatar, role, task count (workload)
- AI systems being implemented (from project_services): system name, phase assignment
- Budget estimates from roadmap_phases: estimated hours, estimated cost, actual logged

---

## UI Components

- `ProjectHeader` — project name, client badge, status badge, overall progress bar, edit button
- `ViewToggle` — Tabs component with Timeline | Board | List options
- `PhaseTimeline` — horizontal connected blocks, each block = phase with name, dates, progress, status color
- `TaskKanban` — 4-column board (To Do | In Progress | Review | Done) with draggable TaskCards
- `TaskCard` — card with title, assignee avatar, priority badge, due date, drag handle
- `TaskListView` — sortable table of all tasks with phase grouping
- `MilestoneTracker` — vertical list of milestones with status icons, due dates, expandable deliverables
- `DeliverableChecklist` — checkbox list under each milestone
- `TeamAvatarRow` — horizontal avatar stack with tooltip showing name and task count
- `ProgressBar` — thin horizontal bar with percentage label
- `BudgetGauge` — circular or bar gauge showing estimated vs. actual spend
- `PhaseDetailCard` — expanded phase info with system name, duration, deliverables summary

---

## Layout Structure

```
+-----------------------------------------------------+
| Sidebar (240px)  |  Main Content (flex-1)            |
|                  |                                    |
| * Dashboard      |  Project: Acme AI Transformation   |
| * Projects  <--  |  Client: Acme Retail | Active      |
| * CRM            |  [=============-----] 72%          |
| * AI Insights    |                                    |
| * Documents      |  [Timeline] [Board] [List]         |
| * Financial      |  +-------------------------------+ |
| * Settings       |  |  Phase 1   | Phase 2 | Phase 3| |
|                  |  |  Active 80%| Next    | Future | |
|                  |  +-------------------------------+ |
|                  |                                    |
|                  |  +------- Board View ------------+ |
|                  |  | To Do  | In Prog | Review|Done| |
|                  |  | [task] | [task]  | [task]|[t] | |
|                  |  | [task] |         |       |[t] | |
|                  |  |        |         |       |[t] | |
|                  |  +-------------------------------+ |
|                  |                                    |
|                  |  +-- Milestones --+ +-- Team ----+ |
|                  |  | * Go-Live 3/15 | | [av][av]   | |
|                  |  |   [x] Deploy   | | [av][av]   | |
|                  |  |   [ ] Test     | | 4 members  | |
|                  |  +----------------+ +------------+ |
+-----------------------------------------------------+
```

- Phase timeline: full width, 64px height, color-coded (active=`#84CC16`, future=`#D4CFC8`, done=`#0A211F`)
- Kanban columns: equal width, min 200px, scrollable vertically
- Task cards: `#FFFFFF` background, `#D4CFC8` border, 8px radius, 8px padding
- Milestone tracker: right sidebar section or below board, 300px width
- Team row: below milestones, avatar circles 32px

---

## Interaction Patterns

- Toggle between Timeline/Board/List views via tab bar (persisted in URL query param)
- Drag tasks between kanban status columns (updates tasks.status via Supabase)
- Click task card -> expand to detail modal with description, comments, assignee select, priority, due date
- Click phase in timeline -> scroll to that phase's tasks in board/list, filter active
- Click milestone -> expand inline to show deliverables checklist
- Check/uncheck deliverable -> update deliverables.status
- Click team member avatar -> filter tasks to show only their assignments
- Click "Add Task" button in any column -> inline create form (title + assignee + priority)
- Phase auto-advances when all tasks in current phase are "Done" and all milestones completed

---

## Example User Workflows

**Workflow 1 — Daily standup review:** Consultant opens Acme Retail project, Board view. Phase 1 has 8 tasks: 5 Done, 1 Review, 2 To Do. She drags "Configure chatbot responses" from To Do to In Progress, assigns herself. The milestone tracker shows "Support Engine Go-Live" due in 5 days with 3/4 deliverables complete. She clicks the "Train FAQ model" task in Review, adds a comment "Accuracy at 94%, approving", and drags it to Done. Phase 1 progress updates from 80% to 87.5%.

**Workflow 2 — Business owner progress check:** The Acme Retail owner logs in and opens their project. The Timeline view shows Phase 1 (green, 87.5% complete), Phase 2 (gray, 0%, starting week 5), Phase 3 (gray, 0%). They click Phase 1 to see the task breakdown — 6 of 8 tasks done. They see the next milestone "Go-Live" is in 5 days. They check the deliverables: deployment script (done), user documentation (done), training data (done), UAT sign-off (pending — their action). They click the UAT deliverable and mark it approved.

**Workflow 3 — Phase transition:** All Phase 1 tasks are dragged to "Done". The last milestone deliverable is checked. The system auto-updates Phase 1 status to "Completed" and Phase 2 to "Active". The timeline animates the transition. An activity is logged: "Phase 1 completed. Phase 2: Cart Recovery Engine is now active." The task-generator agent auto-creates 6 new tasks for Phase 2 based on the roadmap_phases description and system requirements.

---

## AI Features

- AI-generated task descriptions from roadmap phase details (task-generator agent creates tasks with titles, descriptions, and suggested assignees when a phase activates)
- Auto-prioritization based on task dependencies and milestone deadlines
- "At risk" milestone prediction: flags milestones where current task velocity suggests the due date will be missed
- Suggested task assignments based on team member skills and current workload
- Phase completion summary: AI generates a brief report when a phase completes ("Phase 1 delivered Support Engine in 3.5 weeks. 8 tasks completed, 1 re-opened. Key outcome: automated ticket routing live.")

---

## Data Sources (tables)

| Data | Table | Column/Query |
|------|-------|-------------|
| Project details | projects | select by id, includes name, status, org_id, client_id |
| Roadmap | roadmaps | where project_id = :id |
| Phases | roadmap_phases | where roadmap_id, order by position |
| Tasks | tasks | where project_id = :id, includes status, priority, assignee_id, phase reference |
| Milestones | milestones | where project_id = :id, includes name, due_date, status |
| Deliverables | deliverables | where milestone_id, includes name, type, status |
| Team members | team_members | where org_id = project's org_id, includes name, role, avatar |
| AI systems | project_services | where project_id = :id, join services and systems for names |
| Phase budget | roadmap_phases | estimated_hours, estimated_cost columns |
| Task history | activities | where project_id = :id, type = 'task_update' |

---

## Automation Opportunities

- Auto-create tasks from roadmap phases when a phase activates (task-generator agent)
- Auto-update phase progress percentage when task status changes (computed: done_tasks / total_tasks * 100)
- Auto-advance project phase when all tasks complete and all milestones are marked done
- Notify team when milestone due date is within 3 days and deliverables are incomplete
- Auto-log activity entries for task status changes, milestone completions, phase transitions
- Auto-generate weekly progress report from task completion data
- Send email digest to business owner when milestone completes or phase transitions

---

## Visual Hierarchy

1. **Primary focus**: Project header + phase timeline (top, full width, orientation)
2. **Secondary**: Active phase task board (center, largest area, daily interaction)
3. **Tertiary**: Milestone tracker (right or below, checkpoint reference)
4. **Supporting**: Team assignments + budget gauges (bottom, context)

---

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Agency consultant | drag tasks between status columns | I can update progress during standups in seconds |
| Business owner | see my project timeline with phase progress | I understand how far along my AI transformation is |
| Agency consultant | see milestone due dates with deliverable checklists | I can ensure nothing is missed before deadlines |
| Agency PM | view team workload across tasks | I can balance assignments and avoid overloading anyone |
| Business owner | approve deliverables directly in the dashboard | I don't need to go to a separate system |
| Agency consultant | switch between timeline, board, and list views | I can use the view that fits my current workflow |

---

## Goals & Acceptance Criteria

### Goals
1. **Primary:** Users can view and manage project delivery with phase tracking, task management, and milestone visibility
2. **Quality:** Task drag-and-drop updates persist in < 500ms, board renders 50+ tasks without jank

### Acceptance Criteria
- [ ] Project delivery page renders at `/app/projects/:id` with project header showing name, client, status, progress
- [ ] Tab bar toggles between Timeline, Board, and List views (view state persisted in URL)
- [ ] Timeline view shows roadmap_phases as horizontal connected blocks with status colors and progress
- [ ] Board view renders 4 kanban columns (To Do, In Progress, Review, Done) with task cards
- [ ] Task cards are draggable between columns and persist status change to `tasks` table
- [ ] Task card click opens detail modal with description, assignee, priority, due date, and comments
- [ ] List view shows all tasks in a sortable table grouped by phase
- [ ] Milestone tracker shows milestones with due dates, status icons, and expandable deliverable checklists
- [ ] Deliverable checkboxes update `deliverables.status` on toggle
- [ ] Team avatar row shows assigned members with tooltip (name, task count)
- [ ] Phase progress auto-calculates from task completion ratio
- [ ] "Add Task" inline form creates task with title, assignee, priority in the correct phase
- [ ] Loading state shows skeleton cards in board columns
- [ ] Empty state for new project shows "Generating tasks from your roadmap..." with loading animation
- [ ] Responsive: board scrolls horizontally on tablet, stacks vertically on mobile

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Page | `src/components/dashboard/ProjectDelivery.tsx` | Create |
| Component | `src/components/dashboard/ProjectHeader.tsx` | Create |
| Component | `src/components/dashboard/ViewToggle.tsx` | Create |
| Component | `src/components/dashboard/PhaseTimeline.tsx` | Create |
| Component | `src/components/dashboard/TaskKanban.tsx` | Create |
| Component | `src/components/dashboard/TaskCard.tsx` | Create |
| Component | `src/components/dashboard/TaskDetailModal.tsx` | Create |
| Component | `src/components/dashboard/TaskListView.tsx` | Create |
| Component | `src/components/dashboard/MilestoneTracker.tsx` | Create |
| Component | `src/components/dashboard/DeliverableChecklist.tsx` | Create |
| Component | `src/components/dashboard/TeamAvatarRow.tsx` | Create |
| Component | `src/components/dashboard/BudgetGauge.tsx` | Create |
| Hook | `src/lib/hooks/useProject.ts` | Create |
| Hook | `src/lib/hooks/useTasks.ts` | Create |
| Hook | `src/lib/hooks/useMilestones.ts` | Create |
| Types | `src/lib/types/project.ts` | Create/Modify |
| Route | `src/routes.tsx` | Modify — add `/app/projects/:id` route |

---

## Outcomes

| Before | After |
|--------|-------|
| Wizard-generated roadmap is a static JSON blob in wizard_answers | Roadmap rendered as interactive phase timeline with progress tracking |
| No task management — tasks exist in database but are invisible | Kanban board with drag-and-drop task status updates |
| Milestone due dates pass without visibility | Milestone tracker with countdown, deliverable checklists, and at-risk alerts |
| Team assignments stored but not visible | Avatar row with workload indicators and task filtering per member |
| Phase transitions happen manually or not at all | Auto-advance phases when tasks and milestones complete |
