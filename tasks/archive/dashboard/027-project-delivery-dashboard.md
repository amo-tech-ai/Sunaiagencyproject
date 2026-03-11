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

## Frontend Wiring

### Component Tree

```
DashboardLayout
├── DashboardSidebar (shared)
├── DashboardHeader (shared)
└── ProjectDelivery (page, route param :id)
    ├── ProjectHeader
    │   ├── BackLink "← All Projects"
    │   ├── ProjectName (Playfair Display h1)
    │   ├── ClientBadge (org name)
    │   ├── StatusBadge (active | completed | paused | draft)
    │   ├── ProgressBar (overall, thin horizontal)
    │   └── EditButton (opens ProjectSettingsDialog)
    ├── ViewToggle (Tabs)
    │   ├── Tab "Timeline"
    │   ├── Tab "Board"
    │   └── Tab "List"
    ├── PhaseTimeline (visible in all views as context bar)
    │   └── PhaseBlock[] (horizontal connected blocks)
    │       ├── PhaseName
    │       ├── PhaseDateRange
    │       ├── PhaseProgressBar
    │       └── PhaseStatusIndicator (color-coded)
    ├── [conditional: view === 'board']
    │   └── TaskKanban
    │       ├── KanbanColumn "To Do"
    │       │   ├── ColumnHeader (count + "Add Task" button)
    │       │   └── TaskCard[] (draggable)
    │       │       ├── TaskTitle
    │       │       ├── AssigneeAvatar
    │       │       ├── PriorityBadge (P0-P3)
    │       │       └── DueDateLabel
    │       ├── KanbanColumn "In Progress"
    │       │   └── TaskCard[] (draggable)
    │       ├── KanbanColumn "Review"
    │       │   └── TaskCard[] (draggable)
    │       └── KanbanColumn "Done"
    │           └── TaskCard[] (draggable)
    ├── [conditional: view === 'list']
    │   └── TaskListView
    │       ├── PhaseGroupHeader[] (collapsible)
    │       │   └── TaskRow[] (sortable table rows)
    │       │       ├── TaskName
    │       │       ├── AssigneeName
    │       │       ├── StatusSelect
    │       │       ├── PriorityBadge
    │       │       ├── DueDate
    │       │       └── PhaseLabel
    │       └── TableFooter (task count summary)
    ├── [conditional: view === 'timeline']
    │   └── PhaseDetailView
    │       └── PhaseDetailCard[] (vertical, expanded info per phase)
    │           ├── PhaseHeader (name, dates, progress, AI system name)
    │           ├── TaskMiniList (compact task list for this phase)
    │           ├── DeliverablesSummary (count done / total)
    │           └── BudgetSummary (estimated vs actual)
    ├── div.grid.grid-cols-[1fr_300px] (below main view)
    │   ├── MilestoneTracker
    │   │   └── MilestoneItem[] (vertical list)
    │   │       ├── MilestoneStatusIcon (upcoming | at-risk | completed)
    │   │       ├── MilestoneName
    │   │       ├── MilestoneDueDate (with countdown "in 5 days")
    │   │       └── DeliverableChecklist (expandable)
    │   │           └── DeliverableItem[] (checkbox + name + type badge)
    │   └── aside
    │       ├── TeamAvatarRow
    │       │   └── AvatarCircle[] (32px, tooltip with name + task count)
    │       └── BudgetGauge
    │           ├── GaugeLabel "Phase 1 Budget"
    │           ├── ProgressBar (estimated vs actual)
    │           └── Numbers "$12K / $15K spent"
    └── TaskDetailModal (Dialog, opened on TaskCard click)
        ├── TaskTitle (editable)
        ├── StatusSelect
        ├── PrioritySelect
        ├── AssigneeSelect (team members dropdown)
        ├── DueDatePicker
        ├── Description (textarea, editable)
        ├── CommentsSection
        │   ├── CommentItem[] (avatar + text + timestamp)
        │   └── CommentInput
        └── DialogFooter (Save, Cancel, Delete)
```

### TypeScript Interfaces

```typescript
// src/lib/types/project.ts

interface ProjectDetail {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'paused' | 'draft';
  orgId: string;
  clientName: string;
  progressPercent: number;
  createdAt: string;
  updatedAt: string;
}

interface RoadmapPhase {
  id: string;
  roadmapId: string;
  name: string;
  position: number;
  status: 'upcoming' | 'active' | 'completed';
  progressPercent: number;
  weekRange: string;             // "Weeks 1-4"
  startDate: string | null;
  endDate: string | null;
  estimatedHours: number;
  estimatedCost: number;
  actualCost: number;
  systemName: string | null;     // AI system being implemented
}

interface Task {
  id: string;
  projectId: string;
  phaseId: string | null;        // roadmap_phase reference
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string | null;
  assigneeName: string | null;
  assigneeAvatarUrl: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
type TaskPriority = 'P0' | 'P1' | 'P2' | 'P3';

interface Milestone {
  id: string;
  projectId: string;
  name: string;
  dueDate: string;
  status: 'upcoming' | 'at_risk' | 'completed';
  deliverables: Deliverable[];
}

interface Deliverable {
  id: string;
  milestoneId: string;
  name: string;
  type: 'document' | 'demo' | 'deployment' | 'approval';
  status: 'pending' | 'submitted' | 'approved';
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string | null;
  taskCount: number;             // current assigned tasks
}

interface ProjectDeliveryData {
  project: ProjectDetail;
  phases: RoadmapPhase[];
  tasks: Task[];
  milestones: Milestone[];
  team: TeamMember[];
  services: ProjectService[];
}

interface ProjectService {
  id: string;
  serviceName: string;
  systemName: string;
  phaseId: string | null;
}

interface TaskCreateInput {
  projectId: string;
  phaseId: string | null;
  title: string;
  assigneeId?: string;
  priority?: TaskPriority;
  dueDate?: string;
}

interface TaskUpdateInput {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
  title?: string;
  description?: string | null;
  dueDate?: string | null;
}

interface TaskComment {
  id: string;
  taskId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  content: string;
  createdAt: string;
}
```

### Custom Hooks

```typescript
// src/lib/hooks/useProject.ts
function useProject(projectId: string): {
  data: ProjectDeliveryData | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

// src/lib/hooks/useTasks.ts
function useTasks(projectId: string): {
  tasks: Task[];
  loading: boolean;
  createTask: (input: TaskCreateInput) => Promise<{ data: Task | null; error: string | null }>;
  updateTask: (taskId: string, input: TaskUpdateInput) => Promise<{ error: string | null }>;
  deleteTask: (taskId: string) => Promise<{ error: string | null }>;
  moveTask: (taskId: string, newStatus: TaskStatus) => Promise<{ error: string | null }>;
  isUpdating: boolean;
}

// src/lib/hooks/useMilestones.ts
function useMilestones(projectId: string): {
  milestones: Milestone[];
  loading: boolean;
  toggleDeliverable: (deliverableId: string, status: 'pending' | 'approved') => Promise<{ error: string | null }>;
}

// src/lib/hooks/useTaskComments.ts
function useTaskComments(taskId: string | null): {
  comments: TaskComment[];
  loading: boolean;
  addComment: (content: string) => Promise<{ error: string | null }>;
}
```

### State Management

| State | Location | Reason |
|-------|----------|--------|
| `projectId` | URL param (`:id` from React Router `useParams`) | Drives all data fetching |
| `activeView` | URL search param `?view=board` | Persisted across refreshes; default: `board` |
| `activePhaseId` | ProjectDelivery local useState | Filters kanban to one phase; null = all phases |
| `selectedTaskId` | ProjectDelivery local useState | Controls TaskDetailModal open/close |
| `dragState` | TaskKanban local useState (via dnd library) | Tracks drag source/destination during drag |
| `project/tasks/milestones` | useProject, useTasks, useMilestones hooks (useState) | Fetched on mount, mutated optimistically |
| `expandedMilestones` | MilestoneTracker local useState (Set of milestone IDs) | Tracks which milestones show deliverable checklists |
| `taskListSort` | TaskListView local useState | Column sort for list view only |

### Data Fetching Pattern

```
useProject(projectId)
  └── api<ProjectDeliveryData>('/dashboard/projects/:id', {
        method: 'POST', body: { projectId }
      })
      ↳ Aggregates: projects, roadmaps, roadmap_phases, tasks (all for project),
        milestones + deliverables, team_members, project_services

useTasks(projectId)
  └── Initial data from useProject (no separate fetch)
  └── Mutations:
      ├── moveTask → api('/dashboard/tasks/move', { method: 'PUT', body: { taskId, status } })
      ├── createTask → api('/dashboard/tasks', { method: 'POST', body: input })
      ├── updateTask → api('/dashboard/tasks/:id', { method: 'PUT', body: input })
      └── deleteTask → api('/dashboard/tasks/:id', { method: 'DELETE', body: { taskId } })

useMilestones(projectId)
  └── Initial data from useProject (no separate fetch)
  └── toggleDeliverable → api('/dashboard/deliverables/:id', {
        method: 'PUT', body: { status }
      })

useTaskComments(taskId)
  └── api<{ comments: TaskComment[] }>('/dashboard/tasks/:id/comments', {
        method: 'POST', body: { taskId }
      })
  └── addComment → api('/dashboard/tasks/:id/comments/add', {
        method: 'POST', body: { taskId, content }
      })
```

- Optimistic updates: `moveTask` immediately moves the card in local state; reverts on error.
- Drag-and-drop: Uses `@dnd-kit/core` for kanban column drag. On `onDragEnd`, calls `moveTask(taskId, destinationColumn)`.
- Phase progress: Recomputed client-side after each task status change: `doneTasks / totalTasks * 100`.

### Component Communication

- **Props down**: `ProjectDelivery` passes `tasks` to `TaskKanban` (filtered by `activePhaseId`), `phases` to `PhaseTimeline`, `milestones` to `MilestoneTracker`.
- **Callbacks up**: `TaskKanban` calls `onTaskMove(taskId, newStatus)` → parent calls `useTasks.moveTask()`. `TaskCard` calls `onTaskClick(taskId)` → parent sets `selectedTaskId` → opens `TaskDetailModal`. `PhaseTimeline` calls `onPhaseClick(phaseId)` → parent sets `activePhaseId` to filter board/list.
- **Modal communication**: `TaskDetailModal` receives `task` object + `onSave(taskId, updates)` + `onClose`. Uses `useTaskComments(taskId)` internally.
- **ViewToggle**: Calls `onViewChange(view)` → parent updates URL search param via `useSearchParams`.

---

## Backend Wiring

### New Edge Function Routes

| Method | Route | Handler | Request Body | Response Shape |
|--------|-------|---------|-------------|----------------|
| POST | `/dashboard/projects/:id` | Full project detail with phases, tasks, milestones, team | `{ projectId: string }` | `ProjectDeliveryData` |
| POST | `/dashboard/tasks` | Create a new task | `TaskCreateInput` | `{ task: Task }` |
| PUT | `/dashboard/tasks/:id` | Update task fields | `{ taskId: string } & TaskUpdateInput` | `{ task: Task }` |
| PUT | `/dashboard/tasks/move` | Move task to new status (kanban drag) | `{ taskId: string, status: TaskStatus }` | `{ task: Task }` |
| DELETE | `/dashboard/tasks/:id` | Delete a task | `{ taskId: string }` | `{ deleted: true }` |
| POST | `/dashboard/tasks/:id/comments` | Get task comments | `{ taskId: string }` | `{ comments: TaskComment[] }` |
| POST | `/dashboard/tasks/:id/comments/add` | Add comment to task | `{ taskId: string, content: string }` | `{ comment: TaskComment }` |
| PUT | `/dashboard/deliverables/:id` | Toggle deliverable status | `{ deliverableId: string, status: string }` | `{ deliverable: Deliverable }` |
| POST | `/dashboard/projects/:id/phase-advance` | Check and advance phase | `{ projectId: string, phaseId: string }` | `{ advanced: boolean, newPhase?: RoadmapPhase }` |

### Supabase Client Queries

```typescript
// /dashboard/projects/:id handler

// 1. Project with org info
const { data: project } = await adminClient()
  .from('projects')
  .select('id, name, status, org_id, created_at, updated_at, organizations(name)')
  .eq('id', projectId)
  .single();

// 2. Roadmap and phases
const { data: roadmap } = await adminClient()
  .from('roadmaps')
  .select('id')
  .eq('project_id', projectId)
  .single();

const { data: phases } = await adminClient()
  .from('roadmap_phases')
  .select('id, name, position, status, progress_percent, week_range, start_date, end_date, estimated_hours, estimated_cost, actual_cost')
  .eq('roadmap_id', roadmap.id)
  .order('position', { ascending: true });

// 3. All tasks for this project
const { data: tasks } = await adminClient()
  .from('tasks')
  .select('id, project_id, phase_id, title, description, status, priority, assignee_id, due_date, created_at, updated_at')
  .eq('project_id', projectId)
  .order('created_at', { ascending: true });

// 4. Resolve assignee names (batch)
const assigneeIds = [...new Set(tasks.map(t => t.assignee_id).filter(Boolean))];
const { data: assignees } = await adminClient()
  .from('team_members')
  .select('id, name, avatar_url, role')
  .in('id', assigneeIds);

// 5. Milestones with deliverables
const { data: milestones } = await adminClient()
  .from('milestones')
  .select(`
    id, name, due_date, status, project_id,
    deliverables(id, name, type, status)
  `)
  .eq('project_id', projectId)
  .order('due_date', { ascending: true });

// 6. Team members for project org
const { data: team } = await adminClient()
  .from('team_members')
  .select('id, name, role, avatar_url')
  .eq('org_id', project.org_id);

// 7. Project services (AI systems)
const { data: services } = await adminClient()
  .from('project_services')
  .select('id, service_name, system_name, phase_id')
  .eq('project_id', projectId);

// --- Task mutation handlers ---

// 8. Move task (kanban drag)
const { data: updated } = await adminClient()
  .from('tasks')
  .update({ status: newStatus, updated_at: new Date().toISOString() })
  .eq('id', taskId)
  .select()
  .single();

// 9. Log activity on task move
await adminClient()
  .from('activities')
  .insert({
    org_id: orgId,
    type: 'task_updated',
    description: `Task "${task.title}" moved to ${newStatus}`,
    entity_type: 'task',
    entity_id: taskId,
    actor_name: userName,
    project_id: projectId
  });

// 10. Create task
const { data: newTask } = await adminClient()
  .from('tasks')
  .insert({
    project_id: projectId,
    phase_id: phaseId,
    title,
    status: 'todo',
    priority: priority || 'P2',
    assignee_id: assigneeId || null,
    due_date: dueDate || null
  })
  .select()
  .single();

// 11. Toggle deliverable
const { data: deliverable } = await adminClient()
  .from('deliverables')
  .update({ status: newStatus })
  .eq('id', deliverableId)
  .select()
  .single();

// 12. Phase advance check
const { count: totalTasks } = await adminClient()
  .from('tasks')
  .select('id', { count: 'exact', head: true })
  .eq('phase_id', phaseId);

const { count: doneTasks } = await adminClient()
  .from('tasks')
  .select('id', { count: 'exact', head: true })
  .eq('phase_id', phaseId)
  .eq('status', 'done');

if (totalTasks > 0 && doneTasks === totalTasks) {
  // Mark current phase completed, activate next phase
  await adminClient()
    .from('roadmap_phases')
    .update({ status: 'completed', progress_percent: 100 })
    .eq('id', phaseId);

  const nextPhase = phases.find(p => p.position === currentPhase.position + 1);
  if (nextPhase) {
    await adminClient()
      .from('roadmap_phases')
      .update({ status: 'active' })
      .eq('id', nextPhase.id);
  }
}
```

### RLS Policies Needed

| Table | Policy | Rule |
|-------|--------|------|
| projects | SELECT own org | `org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())` |
| projects | UPDATE own org | Same as SELECT |
| roadmaps | SELECT via project | `project_id IN (SELECT id FROM projects WHERE org_id IN (...))` |
| roadmap_phases | SELECT via roadmap | `roadmap_id IN (SELECT id FROM roadmaps WHERE project_id IN (...))` |
| roadmap_phases | UPDATE via roadmap | Same as SELECT |
| tasks | SELECT own project | `project_id IN (SELECT id FROM projects WHERE org_id IN (...))` |
| tasks | INSERT own project | Same as SELECT |
| tasks | UPDATE own project | Same as SELECT |
| tasks | DELETE own project | Same as SELECT (restrict to owner/admin/consultant roles) |
| milestones | SELECT via project | `project_id IN (SELECT id FROM projects WHERE org_id IN (...))` |
| deliverables | SELECT via milestone | `milestone_id IN (SELECT id FROM milestones WHERE project_id IN (...))` |
| deliverables | UPDATE via milestone | Same as SELECT |
| team_members | SELECT own org | `org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())` |
| project_services | SELECT via project | `project_id IN (SELECT id FROM projects WHERE org_id IN (...))` |
| activities | INSERT any logged-in | `auth.uid() IS NOT NULL` (activity logging should always succeed) |

### API Response TypeScript Interfaces

```typescript
interface ProjectDeliveryResponse {
  project: {
    id: string;
    name: string;
    status: string;
    orgId: string;
    clientName: string;
    progressPercent: number;
    createdAt: string;
    updatedAt: string;
  };
  phases: {
    id: string;
    roadmapId: string;
    name: string;
    position: number;
    status: string;
    progressPercent: number;
    weekRange: string;
    startDate: string | null;
    endDate: string | null;
    estimatedHours: number;
    estimatedCost: number;
    actualCost: number;
    systemName: string | null;
  }[];
  tasks: {
    id: string;
    projectId: string;
    phaseId: string | null;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    assigneeId: string | null;
    assigneeName: string | null;
    assigneeAvatarUrl: string | null;
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
  }[];
  milestones: {
    id: string;
    name: string;
    dueDate: string;
    status: string;
    deliverables: {
      id: string;
      name: string;
      type: string;
      status: string;
    }[];
  }[];
  team: {
    id: string;
    name: string;
    role: string;
    avatarUrl: string | null;
    taskCount: number;
  }[];
  services: {
    id: string;
    serviceName: string;
    systemName: string;
    phaseId: string | null;
  }[];
}

interface TaskMoveResponse {
  task: {
    id: string;
    status: TaskStatus;
    updatedAt: string;
  };
  phaseProgress: {
    phaseId: string;
    progressPercent: number;
  } | null;
}

interface PhaseAdvanceResponse {
  advanced: boolean;
  completedPhaseId: string | null;
  newActivePhaseId: string | null;
  activityLogged: boolean;
}
```

### Edge Cases

| Scenario | Handling |
|----------|----------|
| Project not found (invalid ID in URL) | 404 response. Frontend shows "Project not found" with link back to `/app/projects` |
| Project exists but no roadmap yet (project created manually, not from wizard) | `phases: []`. PhaseTimeline shows "No roadmap — generate one from wizard data" CTA |
| No tasks for active phase | Board columns render empty with "Add Task" button. Show "Generating tasks from your roadmap..." if phase just activated |
| Drag-and-drop fails (network error) | Optimistic update reverts. Toast: "Failed to update task status. Please try again." |
| Task assigned to removed team member | `assigneeName: "Removed User"`, `assigneeAvatarUrl: null`. Show gray placeholder avatar |
| Milestone past due with incomplete deliverables | `status: 'at_risk'` (computed: due_date < now AND any deliverable pending). Show red indicator |
| Deliverable toggled but milestone auto-complete fails | Deliverable status updates. Milestone status recomputed on next page load. No partial state |
| All tasks done but milestones incomplete | Phase does NOT auto-advance. Show warning: "All tasks done but milestone deliverables are pending" |
| 50+ tasks in one phase | Kanban columns scroll vertically. No virtualization needed at this scale |
| Concurrent edits (two users move same task) | Last write wins. UI refreshes on next poll (60s) or manual refresh |
| No team members assigned to project | `team: []`. TeamAvatarRow shows "No team assigned" placeholder |

---

## Detailed ASCII Wireframes

### Desktop Layout (1200px)

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ BROWSER VIEWPORT (1440px)                                                            │
│                                                                                      │
│ ┌─────────────┬──────────────────────────────────────────────────────────────────────┐│
│ │ SIDEBAR     │  MAIN CONTENT (max-w-[1200px] mx-auto px-6)                        ││
│ │ 240px       │                                                                      ││
│ │ #0A211F bg  │  ┌──────────────────────────────────────────────────────────────┐    ││
│ │             │  │ PROJECT HEADER                                    h: 96px   │    ││
│ │ ○ Dashboard │  │                                                              │    ││
│ │ ● Projects◄─│  │  ← All Projects                                             │    ││
│ │ ○ CRM       │  │                                                              │    ││
│ │ ○ AI Insight│  │  Acme AI Transformation            ● Active                  │    ││
│ │ ○ Documents │  │  Client: Acme Retail Group                                   │    ││
│ │ ○ Financial │  │  ████████████████████░░░░░░░░  72%                           │    ││
│ │ ○ Settings  │  └──────────────────────────────────────────────────────────────┘    ││
│ │             │                                                                      ││
│ │             │  ┌──────────────────────────────────────────────────────────────┐    ││
│ │             │  │ VIEW TOGGLE             [Timeline] [Board ●] [List]         │    ││
│ │             │  └──────────────────────────────────────────────────────────────┘    ││
│ │             │                                                                      ││
│ │             │  ┌──────────────────────────────────────────────────────────────┐    ││
│ │             │  │ PHASE TIMELINE BAR                                h: 64px   │    ││
│ │             │  │                                                              │    ││
│ │             │  │  ┌──────────────┬──────────────┬──────────────┐              │    ││
│ │             │  │  │   Phase 1    │   Phase 2    │   Phase 3    │              │    ││
│ │             │  │  │  Support Eng │  Cart Recov  │  Reco Engine │              │    ││
│ │             │  │  │  Wk 1-4     │  Wk 5-8      │  Wk 9-12    │              │    ││
│ │             │  │  │  ████░ 80%  │  ░░░░░ 0%    │  ░░░░░ 0%   │              │    ││
│ │             │  │  │  #84CC16    │  #D4CFC8     │  #D4CFC8    │              │    ││
│ │             │  │  │  ▲ ACTIVE   │              │              │              │    ││
│ │             │  │  └──────────────┴──────────────┴──────────────┘              │    ││
│ │             │  └──────────────────────────────────────────────────────────────┘    ││
│ │             │                                                                      ││
│ │             │  ┌──────────────────────────────────────────────────────────────┐    ││
│ │             │  │ TASK KANBAN BOARD (Board View)                               │    ││
│ │             │  │                                                              │    ││
│ │             │  │ ┌────────────┬────────────┬────────────┬────────────┐        │    ││
│ │             │  │ │  TO DO     │ IN PROGRESS│  REVIEW    │   DONE     │        │    ││
│ │             │  │ │  2 tasks   │  1 task    │  1 task    │  5 tasks   │        │    ││
│ │             │  │ │  [+Add]    │            │            │            │        │    ││
│ │             │  │ │────────────│────────────│────────────│────────────│        │    ││
│ │             │  │ │┌──────────┐│┌──────────┐│┌──────────┐│┌──────────┐│        │    ││
│ │             │  │ ││Config    ││││Integrate │││Train FAQ ││││Deploy    ││        │    ││
│ │             │  │ ││chatbot   ││││knowledge │││model     ││││chatbot   ││        │    ││
│ │             │  │ ││responses ││││base API  │││          ││││widget    ││        │    ││
│ │             │  │ ││          ││││          │││[av] P1   ││││          ││        │    ││
│ │             │  │ ││[av] P1   ││││[av] P0   │││Mar 12    ││││[av] done ││        │    ││
│ │             │  │ ││Mar 14    ││││Mar 10    ││└──────────┘│└──────────┘│        │    ││
│ │             │  │ │└──────────┘│└──────────┘│            │┌──────────┐│        │    ││
│ │             │  │ │┌──────────┐│            │            ││Set up    ││        │    ││
│ │             │  │ ││Set up    ││            │            ││routing   ││        │    ││
│ │             │  │ ││escalation││            │            ││rules     ││        │    ││
│ │             │  │ ││rules     ││            │            ││          ││        │    ││
│ │             │  │ ││[av] P2   ││            │            ││[av] done ││        │    ││
│ │             │  │ ││Mar 15    ││            │            │└──────────┘│        │    ││
│ │             │  │ │└──────────┘│            │            │  ... +3    │        │    ││
│ │             │  │ └────────────┴────────────┴────────────┴────────────┘        │    ││
│ │             │  └──────────────────────────────────────────────────────────────┘    ││
│ │             │                                                                      ││
│ │             │  ┌───────────────────────────────┬──────────────────────────────┐    ││
│ │             │  │ MILESTONE TRACKER             │ TEAM + BUDGET               │    ││
│ │             │  │ w: 60%            h: 220px    │ w: 40%       h: 220px      │    ││
│ │             │  │                               │                             │    ││
│ │             │  │ ● Support Engine Go-Live      │ Team Members                │    ││
│ │             │  │   Due: Mar 15 (in 5 days)     │ [av][av][av][av]            │    ││
│ │             │  │   ▼ Deliverables (3/4)        │  Maria  John  Lisa  Dev    │    ││
│ │             │  │   [✓] Deployment script       │  3 tasks 2    1     2      │    ││
│ │             │  │   [✓] User documentation      │                             │    ││
│ │             │  │   [✓] Training data uploaded   │ ─────────────────────────── │    ││
│ │             │  │   [ ] UAT sign-off (pending)  │                             │    ││
│ │             │  │                               │ Phase 1 Budget              │    ││
│ │             │  │ ○ Phase 2 Kickoff             │ ████████████████░░░  $12K   │    ││
│ │             │  │   Due: Mar 22 (upcoming)      │ of $15K estimated           │    ││
│ │             │  │   Deliverables: 0/3           │ 80% utilized                │    ││
│ │             │  └───────────────────────────────┴──────────────────────────────┘    ││
│ └─────────────┴──────────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### Task Card Detail (individual component)

```
┌──────────────────────────────────┐
│ TASK CARD               #FFF bg  │
│ p-3  rounded-lg  w-full          │
│ border border-[#D4CFC8]          │
│ cursor-grab  hover:shadow-md     │
│                                  │
│  Configure chatbot responses     │
│  Lora 14px #0A211F               │
│                                  │
│  ┌────┐   P1        Mar 14      │
│  │ 👤 │   #EAB308   Lora 12px   │
│  │24px│   badge      #9B9590    │
│  └────┘                          │
│  assignee  priority   due date   │
└──────────────────────────────────┘

Priority badge colors:
  P0: bg-red-100 text-red-700
  P1: bg-yellow-100 text-yellow-700
  P2: bg-blue-100 text-blue-700
  P3: bg-gray-100 text-gray-600
```

### Task Detail Modal

```
┌──────────────────────────────────────────────────┐
│ TASK DETAIL MODAL (Dialog, 600px wide)           │
│ #FFFFFF bg, rounded-xl, shadow-2xl               │
│                                                  │
│  Configure chatbot responses              [X]    │
│  ─────────────────────────────────────────────   │
│                                                  │
│  Status: [In Progress ▾]   Priority: [P1 ▾]     │
│  Assignee: [Maria Santos ▾]                      │
│  Due Date: [Mar 14, 2026  📅]                    │
│                                                  │
│  Description                                     │
│  ┌──────────────────────────────────────────┐    │
│  │ Set up predefined chatbot response       │    │
│  │ templates for top 20 FAQ categories.     │    │
│  │ Include escalation triggers for complex  │    │
│  │ queries.                                 │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  Comments (2)                                    │
│  ┌──────────────────────────────────────────┐    │
│  │ [av] Maria — 2 hours ago                 │    │
│  │ Started on the FAQ mapping. 12 of 20     │    │
│  │ categories done.                         │    │
│  ├──────────────────────────────────────────┤    │
│  │ [av] John — yesterday                    │    │
│  │ CX team provided the FAQ list. See doc.  │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  [Add a comment...                        ] [→]  │
│                                                  │
│  ───────────────────────────────────────────     │
│  [Delete]                    [Cancel] [Save]     │
└──────────────────────────────────────────────────┘
```

### Tablet Layout (768px)

```
┌────────────────────────────────────────────────────┐
│ TABLET VIEWPORT (768px)                            │
│                                                    │
│ ┌────────────────────────────────────────────────┐ │
│ │ [☰]  ← Projects   Acme AI Transform   [⚙]    │ │
│ │ ████████████████░░░░  72%     ● Active         │ │
│ └────────────────────────────────────────────────┘ │
│                                                    │
│ ┌────────────────────────────────────────────────┐ │
│ │ [Timeline] [Board ●] [List]                    │ │
│ └────────────────────────────────────────────────┘ │
│                                                    │
│ ┌────────────────────────────────────────────────┐ │
│ │ Phase 1 ████ 80% │ Phase 2 ░░ 0% │ Phase 3 ░ │ │
│ └────────────────────────────────────────────────┘ │
│                                                    │
│ ┌────────────────────────────────────────────────┐ │
│ │ KANBAN (horizontal scroll)                     │ │
│ │ ← ┌─────────┬─────────┬─────────┬────────┐ → │ │
│ │   │ TO DO   │ IN PROG │ REVIEW  │ DONE   │   │ │
│ │   │ [card]  │ [card]  │ [card]  │ [card] │   │ │
│ │   │ [card]  │         │         │ [card] │   │ │
│ │   │         │         │         │ [card] │   │ │
│ │   └─────────┴─────────┴─────────┴────────┘   │ │
│ └────────────────────────────────────────────────┘ │
│                                                    │
│ ┌────────────────────────────────────────────────┐ │
│ │ MILESTONES                                     │ │
│ │ ● Go-Live Mar 15 (5d) — 3/4 deliverables     │ │
│ │ ○ Phase 2 Kickoff — 0/3 deliverables          │ │
│ └────────────────────────────────────────────────┘ │
│                                                    │
│ ┌──────────────────────┬─────────────────────────┐ │
│ │ Team: [av][av][av]   │ Budget: $12K / $15K     │ │
│ └──────────────────────┴─────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

### Mobile Layout (375px)

```
┌───────────────────────────────────┐
│ MOBILE VIEWPORT (375px)           │
│                                   │
│ ┌───────────────────────────────┐ │
│ │ [☰]  ← Projects        [⚙]  │ │
│ └───────────────────────────────┘ │
│                                   │
│ ┌───────────────────────────────┐ │
│ │ Acme AI Transformation        │ │
│ │ Acme Retail  │  ● Active      │ │
│ │ ████████████████░░░░  72%     │ │
│ └───────────────────────────────┘ │
│                                   │
│ ┌───────────────────────────────┐ │
│ │ [Timeline] [Board ●] [List]   │ │
│ └───────────────────────────────┘ │
│                                   │
│ ┌───────────────────────────────┐ │
│ │ Phase 1: Support Engine  80%  │ │
│ │ ████████████████░░░░          │ │
│ └───────────────────────────────┘ │
│                                   │
│ Board view → stacked columns:     │
│                                   │
│ ┌───────────────────────────────┐ │
│ │ TO DO (2)              [+Add] │ │
│ │ ┌───────────────────────────┐ │ │
│ │ │ Config chatbot responses  │ │ │
│ │ │ [av] P1       Mar 14     │ │ │
│ │ └───────────────────────────┘ │ │
│ │ ┌───────────────────────────┐ │ │
│ │ │ Set up escalation rules   │ │ │
│ │ │ [av] P2       Mar 15     │ │ │
│ │ └───────────────────────────┘ │ │
│ └───────────────────────────────┘ │
│                                   │
│ ┌───────────────────────────────┐ │
│ │ IN PROGRESS (1)               │ │
│ │ ┌───────────────────────────┐ │ │
│ │ │ Integrate knowledge base  │ │ │
│ │ │ [av] P0       Mar 10     │ │ │
│ │ └───────────────────────────┘ │ │
│ └───────────────────────────────┘ │
│                                   │
│ ┌───────────────────────────────┐ │
│ │ REVIEW (1)                    │ │
│ │ ┌───────────────────────────┐ │ │
│ │ │ Train FAQ model           │ │ │
│ │ │ [av] P1       Mar 12     │ │ │
│ │ └───────────────────────────┘ │ │
│ └───────────────────────────────┘ │
│                                   │
│ ┌───────────────────────────────┐ │
│ │ DONE (5)               [+5]  │ │
│ │ (collapsed, tap to expand)    │ │
│ └───────────────────────────────┘ │
│                                   │
│ ┌───────────────────────────────┐ │
│ │ MILESTONES                    │ │
│ │ ● Go-Live Mar 15 — 3/4 done  │ │
│ │   [✓] Deploy  [✓] Docs       │ │
│ │   [✓] Data   [ ] UAT         │ │
│ └───────────────────────────────┘ │
└───────────────────────────────────┘
```

### Milestone Tracker Detail

```
┌──────────────────────────────────────────────────────┐
│ MILESTONE TRACKER                     w: 60%, #FFF  │
│ p-4  rounded-lg  border border-[#D4CFC8]            │
│                                                      │
│  Milestones                                          │
│                                                      │
│  ● Support Engine Go-Live         ┌──────────────┐  │
│  │ Due: Mar 15, 2026              │ in 5 days    │  │
│  │ Status: On Track               └──────────────┘  │
│  │                                                   │
│  │ ▼ Deliverables (3/4 complete)                    │
│  │  ┌──────────────────────────────────────────┐    │
│  │  │ [✓] Deployment script       deployment   │    │
│  │  │ [✓] User documentation      document     │    │
│  │  │ [✓] Training data uploaded   document     │    │
│  │  │ [ ] UAT sign-off            approval     │    │
│  │  └──────────────────────────────────────────┘    │
│  │                                                   │
│  ├─── (vertical line connector) ───                  │
│  │                                                   │
│  ○ Phase 2 Kickoff                ┌──────────────┐  │
│  │ Due: Mar 22, 2026              │ in 12 days   │  │
│  │ Status: Upcoming               └──────────────┘  │
│  │                                                   │
│  │ ▶ Deliverables (0/3 complete)    (collapsed)     │
│  │                                                   │
│  ├───                                                │
│  │                                                   │
│  ○ Phase 3 Kickoff                                   │
│    Due: Apr 12, 2026                                 │
│    Status: Upcoming                                  │
│                                                      │
│  ● = on track (#84CC16)                              │
│  ⚠ = at risk (#EAB308)                               │
│  ○ = upcoming (#D4CFC8)                              │
│  ✓ = completed (#0A211F)                             │
└──────────────────────────────────────────────────────┘
```

---

## Outcomes

| Before | After |
|--------|-------|
| Wizard-generated roadmap is a static JSON blob in wizard_answers | Roadmap rendered as interactive phase timeline with progress tracking |
| No task management — tasks exist in database but are invisible | Kanban board with drag-and-drop task status updates |
| Milestone due dates pass without visibility | Milestone tracker with countdown, deliverable checklists, and at-risk alerts |
| Team assignments stored but not visible | Avatar row with workload indicators and task filtering per member |
| Phase transitions happen manually or not at all | Auto-advance phases when tasks and milestones complete |
