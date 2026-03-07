---
id: 041-journey-implementation-planning
diagram_id: JOURNEY-05
prd_section: User Journeys
title: Implementation planning journey — from roadmap to active project execution
skill: frontend
phase: HIGH
priority: P1
status: Not Started
owner: Frontend
dependencies:
  - 040-journey-roadmap-creation
  - 027-project-delivery-dashboard
estimated_effort: M
percent_complete: 0
area: client-dashboard
wizard_step: null
schema_tables: [projects, roadmap_phases, tasks, milestones, team_members]
figma_prompt: prompts/041-journey-implementation-planning.md
---

# JOURNEY-05: Implementation Planning Journey

## Summary Table

| Field              | Value                                                                             |
| ------------------ | --------------------------------------------------------------------------------- |
| **Journey ID**     | JOURNEY-05                                                                        |
| **Prompt ID**      | 041-journey-implementation-planning                                               |
| **Title**          | Implementation planning journey — from roadmap to active project execution        |
| **Phase**          | HIGH                                                                              |
| **Priority**       | P1                                                                                |
| **Owner**          | Frontend                                                                          |
| **Effort**         | M                                                                                 |
| **Area**           | client-dashboard                                                                  |
| **Schema Tables**  | projects, roadmap_phases, tasks, milestones, team_members                         |
| **Dependencies**   | 040-journey-roadmap-creation, 027-project-delivery-dashboard                      |
| **Status**         | Not Started                                                                       |

---

## Description

### Situation

A project has just been created from the wizard (JOURNEY-04). The user lands on their project dashboard for the first time. The auto-generated roadmap phases, milestones, and tasks are in place but are skeletal — task titles come from AI deliverables, but they lack detailed descriptions, assignees, due dates beyond milestones, and priority refinement. A Sun AI consultant needs to review the generated plan, refine tasks, assign team members, and communicate the plan to the client before Phase 1 work begins. The client, meanwhile, needs to understand what will happen, when, and what is expected of them. No planning workflow, task refinement UI, or consultant-client shared view exists yet.

### Why It Matters

The gap between "AI-generated plan" and "executable project plan" is where professional credibility lives. Auto-generated tasks like "Deploy sizing model" need to become "Deploy v1 sizing model to staging environment with 10K-product training set by March 21" — with an owner, dependencies, and acceptance criteria. If the consultant cannot quickly refine tasks and the client cannot clearly see the plan, the project starts in confusion. This journey turns the AI output into a collaborative plan that both parties trust. It is the first sustained interaction inside the dashboard and sets the tone for the entire client relationship.

### What Exists

The database has projects, roadmap_phases, tasks (with title, status, priority, assignee fields), milestones (with target_date), and team_members. Auto-generated data from JOURNEY-04 populates these tables with baseline values. The dashboard shell is planned (prompt 027) but not built. No task editing, assignment, or planning UI exists.

### The Build

**1. First-Time Project View**: When the user (client or consultant) first opens a newly created project, a brief welcome overlay explains the project structure: "Your AI implementation plan has been created. Here's what happens next." Three steps shown: (1) Consultant refines the plan, (2) You review and approve, (3) Phase 1 kicks off. Dismiss overlay to see the project.

**2. Project Overview Screen**: Displays the roadmap timeline at the top (horizontal bar chart showing phases with week ranges), key metrics (total weeks, total investment, number of tasks, completion percentage at 0%), and the current phase highlighted (Phase 1). Below the timeline: Phase 1 detail card with milestone, task summary, and "View Tasks" link.

**3. Task Refinement (Consultant View)**: The consultant opens the task board for Phase 1. Tasks are shown in a Kanban board (columns: To Do, In Progress, Review, Done). Each task card shows title, priority badge, and assignee avatar. Clicking a task opens a detail panel where the consultant can:
- Edit the title and add a detailed description (rich text)
- Set priority (Critical, High, Medium, Low)
- Assign a team member (dropdown from team_members for this org)
- Set a specific due date (constrained within the phase's week range)
- Add acceptance criteria (checklist)
- Add estimated hours
- Add tags/labels

**4. Milestone Review**: A milestone view shows each phase's milestone with its target date, linked tasks (with completion status), and linked deliverables. The consultant can adjust the milestone target date if needed (with cascading date adjustment warning).

**5. Client Review**: The client sees a read-only version of the refined plan. They see the roadmap timeline, Phase 1 tasks with descriptions and due dates, milestones, and assigned team members. A "Looks Good" acknowledgment button marks Phase 1 as client-approved (optional, creates an activity log entry).

**6. Phase 1 Kickoff**: Once the consultant has refined tasks and (optionally) the client has acknowledged the plan, the first tasks are moved to "In Progress." An activity log entry records "Phase 1 kicked off." The project transitions from planning to execution (JOURNEY-06).

### Example

After James launches his e-commerce fashion project, his Sun AI consultant Sarah opens the project dashboard. She sees 3 phases on the timeline. She clicks into Phase 1 ("AI Sizing System") and sees 4 tasks: "Deploy sizing model," "Integrate with product pages," "Train on historical return data," "Launch A/B test." She clicks "Deploy sizing model" and edits it: adds description "Deploy v1 Levi sizing model to staging using the Shopify product feed. Minimum 10K products in training set. Must pass accuracy threshold of 85% on holdout set." She sets priority to Critical, assigns herself, sets due date to March 15, and adds 3 acceptance criteria items. She repeats for all Phase 1 tasks. She then shares the plan with James, who reviews it in his client dashboard and clicks "Looks Good." Sarah moves "Deploy sizing model" to In Progress. Phase 1 has begun.

---

## User Stories

| ID       | Story                                                                                                                     | Priority |
| -------- | ------------------------------------------------------------------------------------------------------------------------- | -------- |
| US-041-1 | As a user first entering my project dashboard, I see a welcome overlay explaining the project structure and next steps.    | P1       |
| US-041-2 | As a user, I see a project overview with roadmap timeline, current phase, key metrics, and phase details.                 | P0       |
| US-041-3 | As a consultant, I can click into Phase 1 tasks and see them on a Kanban board.                                           | P0       |
| US-041-4 | As a consultant, I can edit a task's title, description, priority, assignee, due date, and acceptance criteria.           | P0       |
| US-041-5 | As a consultant, I can assign tasks to team members from a dropdown of org team members.                                  | P0       |
| US-041-6 | As a consultant, I can adjust milestone target dates with awareness of cascading impacts.                                 | P1       |
| US-041-7 | As a client, I see a read-only view of the refined project plan with tasks, dates, and assignees.                         | P0       |
| US-041-8 | As a client, I can acknowledge the plan with a "Looks Good" button that logs an activity.                                 | P2       |
| US-041-9 | As a consultant, I can move the first tasks to "In Progress" to kick off Phase 1 execution.                               | P0       |
| US-041-10 | As a user, I see task completion percentage update in real time as tasks change status.                                   | P1       |

---

## Goals & Acceptance Criteria

- [ ] First-time project view shows welcome overlay with 3-step explanation; dismissible and not shown again
- [ ] Project overview displays horizontal roadmap timeline with phases, week ranges, and current phase highlighted
- [ ] Project overview shows key metrics: total weeks, total investment, task count, completion percentage
- [ ] Phase detail card shows phase title, milestone date, task count, deliverable list
- [ ] Task board renders Phase 1 tasks in Kanban layout with 4 columns: To Do, In Progress, Review, Done
- [ ] Task cards show title, priority badge (color-coded), assignee avatar, and due date
- [ ] Clicking a task opens a detail panel (slide-in from right or modal)
- [ ] Task detail panel allows editing: title (text), description (textarea/rich text), priority (dropdown), assignee (dropdown from team_members), due date (date picker constrained to phase range), acceptance criteria (add/remove checklist items), estimated hours (number), tags (multi-select)
- [ ] Assignee dropdown populated from team_members WHERE org_id matches project org
- [ ] Milestone view shows each milestone with target date, linked tasks, and completion progress bar
- [ ] Milestone date can be edited by consultant; if moved earlier, warning shown about task date conflicts
- [ ] Client view is read-only: no edit buttons, no drag-and-drop, no status changes
- [ ] Client "Looks Good" button creates activities row with type='plan_acknowledged'
- [ ] Tasks can be dragged between Kanban columns (consultant only) to update status
- [ ] Activity log records every task status change, assignment change, and milestone adjustment
- [ ] All changes persist to database in real time (optimistic UI with background save)

---

## Screen Flow

### Screen 1: Project Dashboard — First Visit

- **Route**: `/dashboard/projects/{project_id}`
- **Layout**: Dashboard shell with sidebar nav (Projects, Tasks, Milestones, Documents, Settings) + main content area
- **Overlay** (first visit only):
  - Semi-transparent backdrop
  - Centered card with heading "Your AI Implementation Plan is Ready"
  - Three steps with icons: (1) "Consultant refines the plan" (2) "You review and approve" (3) "Phase 1 kicks off"
  - "Got It" dismiss button (lime bg)
  - Stores dismissal in localStorage to not show again

### Screen 2: Project Overview

- **Route**: `/dashboard/projects/{project_id}`
- **Layout**: Full-width main content
- **Sections**:
  - **Roadmap Timeline** (top): Horizontal bar chart (one bar per phase, proportional to week range). Current phase (Phase 1) highlighted with lime border. Each bar labeled with phase title and "Weeks X-Y."
  - **Key Metrics Row**: 4 cards — Total Weeks (number), Investment (formatted currency), Tasks (count with completion %), Milestones (count with completion %)
  - **Current Phase Detail**: Card showing Phase 1 title, description, milestone date, task list (abbreviated), "View Task Board" button
  - **Upcoming Phases**: Collapsed accordion for Phase 2, 3, etc. with summary info
- **Action**: Click "View Task Board"
- **Transition**: Navigate to task board view

### Screen 3: Task Board (Kanban)

- **Route**: `/dashboard/projects/{project_id}/tasks`
- **Layout**: Full-width Kanban board
- **Columns**: To Do | In Progress | Review | Done
- **Task Cards**: Each card (min-height 80px) shows:
  - Task title (truncated to 2 lines)
  - Priority badge: Critical (red), High (orange), Medium (yellow), Low (gray)
  - Assignee avatar (circle, 24px) or "Unassigned" placeholder
  - Due date (if set) in muted text
- **Interactions**:
  - **Drag and drop** between columns (consultant role only)
  - **Click** to open task detail panel
  - **Filter bar** at top: filter by phase, assignee, priority
  - **"Add Task" button** in each column header (for manually adding tasks)
- **Client view**: Cards are not draggable; no "Add Task" button; clicking shows read-only detail

### Screen 4: Task Detail Panel

- **Route**: `/dashboard/projects/{project_id}/tasks` (panel slides in from right, 480px wide)
- **Layout**: Side panel overlaying right portion of Kanban board
- **Sections**:
  - **Header**: Task title (editable inline), close (X) button, status dropdown
  - **Body**:
    - Description: Textarea or rich text editor (markdown support)
    - Priority: Dropdown (Critical, High, Medium, Low) with color indicators
    - Assignee: Dropdown with team member names + avatars; search/filter enabled
    - Due Date: Date picker; warning if date is outside phase week range
    - Milestone: Read-only link to the parent milestone
    - Estimated Hours: Number input
    - Tags: Multi-select pill input (e.g., "Backend", "Integration", "ML")
    - Acceptance Criteria: Checklist with add/remove/reorder; each item has a checkbox
  - **Footer**: "Delete Task" link (red text, confirmation dialog), last modified timestamp
- **Client view**: All fields are read-only; no edit interactions

### Screen 5: Milestone View

- **Route**: `/dashboard/projects/{project_id}/milestones`
- **Layout**: Vertical list of milestone cards
- **Each Milestone Card**:
  - Milestone title (e.g., "Phase 1 Complete: AI Sizing System")
  - Target date (editable by consultant; date picker)
  - Status badge: Pending (gray), In Progress (blue), Complete (lime)
  - Progress bar: X of Y tasks complete
  - Linked tasks list (compact: title + status badge)
  - Linked deliverables list (compact: title + status badge)
- **Consultant**: Can edit target date; if moved, cascading warning dialog
- **Client**: Read-only; sees the same data without edit controls

---

## Data Flow

| Step                          | Action                          | Table(s) Written              | Table(s) Read                            | Notes                                                   |
| ----------------------------- | ------------------------------- | ----------------------------- | ---------------------------------------- | ------------------------------------------------------- |
| Load project overview         | Fetch project + roadmap         | —                             | projects, roadmaps, roadmap_phases       | Single query with joins for overview rendering           |
| Load task board               | Fetch Phase 1 tasks             | —                             | tasks (WHERE project_id AND milestone)   | Filter by current phase's milestone_id                   |
| Load team members             | Fetch assignee options          | —                             | team_members (WHERE org_id)              | Populate assignee dropdown                               |
| Edit task                     | Update task fields              | tasks                         | —                                        | Optimistic UI; debounced save (500ms after last edit)    |
| Assign team member            | Update task assignee            | tasks (assignee_id)           | team_members                             | Dropdown selection persists immediately                  |
| Drag task between columns     | Update task status              | tasks (status)                | —                                        | Status maps: To Do='todo', In Progress='in_progress', Review='review', Done='done' |
| Log status change             | Insert activity                 | activities                    | —                                        | type='task_status_changed', metadata={from, to, task_id} |
| Edit milestone date           | Update milestone target_date    | milestones                    | tasks (check date conflicts)             | Warn if tasks have due dates after new milestone date    |
| Client acknowledges plan      | Insert activity                 | activities                    | —                                        | type='plan_acknowledged', actor_id=client profile_id     |
| Add new task (manual)         | Insert task                     | tasks                         | milestones (for linking)                 | project_id, milestone_id from current phase, status from column |
| Add acceptance criteria       | Update task metadata            | tasks (metadata JSONB)        | —                                        | Stored in task's metadata or dedicated column            |
| Phase 1 kickoff               | Update first task status        | tasks, activities             | —                                        | First task moved to 'in_progress'; activity logged       |

---

## AI Touchpoints

This journey does not invoke AI agents for the planning workflow itself. However, two optional AI-assisted features enhance the planning experience:

| Feature                     | Trigger                                  | AI Agent              | Input                               | Output                                         |
| --------------------------- | ---------------------------------------- | --------------------- | ----------------------------------- | ---------------------------------------------- |
| Task description suggestion | Consultant clicks "Suggest description"  | task-detail-agent     | Task title + project context        | 2-3 paragraph description with acceptance criteria |
| Time estimate suggestion    | Consultant clicks "Suggest estimate"     | time-estimate-agent   | Task title + description + complexity | Estimated hours with confidence range          |

These are optional enhancements (P2) and not required for the core planning journey.

---

## Edge Cases

| #  | Scenario                                               | Handling                                                                                      |
| -- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| 1  | Project has 0 tasks (AI generated no deliverables)     | Show empty state on task board: "No tasks yet. Add your first task." with prominent add button |
| 2  | Consultant and client view project simultaneously      | Real-time updates via Supabase realtime subscriptions; both see changes immediately           |
| 3  | Consultant deletes a task linked to a deliverable      | Confirmation dialog: "This task is linked to deliverable X. Delete anyway?"; deletes both     |
| 4  | Due date set outside phase week range                  | Show warning: "This date is outside Phase 1 (Mar 1 - Apr 12). Continue anyway?" Allow override |
| 5  | Team member removed from org while assigned to tasks   | Tasks show "Former member" badge; reassignment required; filter highlights unassigned tasks   |
| 6  | Milestone date moved earlier than existing task dates   | Warning dialog lists affected tasks; option to auto-adjust task dates proportionally          |
| 7  | Client tries to drag task (read-only violation)        | Drag not initiated; cursor shows not-allowed icon; no error message needed                    |
| 8  | Browser refresh during task edit                       | Unsaved changes lost (debounced save should have caught most); no explicit "unsaved" warning  |
| 9  | Project with 50+ tasks (performance)                   | Paginate task board by phase; lazy-load completed tasks; virtualize long lists                |
| 10 | Multiple consultants editing same task simultaneously  | Last-write-wins with optimistic UI; realtime subscription shows latest state                  |

---

## Outcomes

| Outcome                           | Metric                                                    | Target              |
| --------------------------------- | --------------------------------------------------------- | ------------------- |
| Planning completion time          | Median hours from project creation to Phase 1 kickoff     | < 48 hours          |
| Task refinement rate              | % of auto-generated tasks edited by consultant            | > 80%               |
| Task assignment rate              | % of Phase 1 tasks with an assignee before kickoff        | > 90%               |
| Client acknowledgment rate        | % of projects where client clicks "Looks Good"            | > 60%               |
| Dashboard engagement              | Avg. time spent on project dashboard in first session     | > 5 minutes         |
| Task board interaction rate       | % of sessions with at least one task status change         | > 70%               |
| Milestone date accuracy           | % of Phase 1 milestones hit within 1 week of target       | > 75%               |
