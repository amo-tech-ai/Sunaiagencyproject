---
id: 042-journey-project-execution
diagram_id: JOURNEY-06
prd_section: User Journeys
title: Project execution journey — task completion, milestone delivery, and phase progression
skill: frontend
phase: HIGH
priority: P1
status: Not Started
owner: Frontend
dependencies:
  - 041-journey-implementation-planning
estimated_effort: M
percent_complete: 0
area: client-dashboard
wizard_step: null
schema_tables: [projects, tasks, milestones, deliverables, activities, documents]
figma_prompt: prompts/042-journey-project-execution.md
---

# JOURNEY-06: Project Execution Journey

## Summary Table

| Field              | Value                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------ |
| **Journey ID**     | JOURNEY-06                                                                                 |
| **Prompt ID**      | 042-journey-project-execution                                                              |
| **Title**          | Project execution journey — task completion, milestone delivery, and phase progression      |
| **Phase**          | HIGH                                                                                       |
| **Priority**       | P1                                                                                         |
| **Owner**          | Frontend                                                                                   |
| **Effort**         | M                                                                                          |
| **Area**           | client-dashboard                                                                           |
| **Schema Tables**  | projects, tasks, milestones, deliverables, activities, documents                           |
| **Dependencies**   | 041-journey-implementation-planning                                                        |
| **Status**         | Not Started                                                                                |

---

## Description

### Situation

Phase 1 of the project has kicked off (JOURNEY-05). Tasks have been refined, assigned, and the first ones moved to "In Progress." Now the project enters its operational phase — the day-to-day cycle of working on tasks, uploading deliverables, completing milestones, and progressing through roadmap phases. Both the consultant (who executes the work) and the client (who reviews and approves) interact with the dashboard daily. This journey covers the full execution lifecycle from Phase 1 kickoff through final phase completion. No execution workflow, deliverable management, approval flow, or phase transition logic exists yet.

### Why It Matters

This is where the platform delivers tangible value. The wizard promised a roadmap; implementation planning structured it; now execution makes it real. If the execution experience is clunky — if updating task status is slow, if deliverables cannot be easily shared, if the client cannot see progress, if phase transitions are confusing — then the platform becomes a liability rather than an asset. The consultant falls back to email and spreadsheets. The client loses visibility. The project drifts. A smooth execution journey keeps everyone aligned, accountable, and informed. It is also the longest-duration journey: weeks to months of daily interaction.

### What Exists

The database has tasks (with status, priority, assignee, milestone_id), milestones (with target_date, status), deliverables (with milestone_id, status), documents (for file storage references), and activities (for audit logging). JOURNEY-05 established the task board UI, task detail panel, and milestone view. The execution journey builds on these screens with new workflows: status progression, deliverable upload, client review/approval, and automated phase transition.

### The Build

**1. Task Status Progression**: Tasks follow a 4-stage lifecycle: `todo` -> `in_progress` -> `review` -> `done`. Consultants drag cards on the Kanban board or use the status dropdown in the task detail panel. Moving to "review" triggers a notification to the client (if the task has a deliverable requiring approval). Moving to "done" updates the milestone progress bar.

**2. Deliverable Management**: When a task is moved to "review," the consultant attaches deliverables — files (PDFs, images, code repositories, design files) or links (deployed URLs, demo videos). Deliverables are uploaded via the task detail panel's "Attachments" section. Files are stored in Supabase Storage, and a reference row is created in the `documents` table linked to the deliverable. Each deliverable has a status: `pending` -> `submitted` -> `approved` / `revision_requested`.

**3. Client Review and Approval Flow**: When a task enters "review" status, the client sees a notification badge on their dashboard. They open the task, review the deliverables (preview files inline where possible: images, PDFs), and choose one of two actions:
- **Approve**: Deliverable status -> `approved`, task auto-moves to `done`, activity logged
- **Request Changes**: Deliverable status -> `revision_requested`, task moves back to `in_progress`, client adds a comment explaining what needs to change, activity logged

**4. Comments and Communication**: Each task has a comment thread. Both consultant and client can post comments. Comments are stored in an activities-adjacent structure (or directly in activities with type='comment'). Comments support plain text and @mentions. No real-time chat — comments are asynchronous, similar to GitHub issue comments.

**5. Milestone Completion**: A milestone auto-completes when all of its linked tasks reach "done" status. On completion:
- milestones.status -> `completed`
- milestones.completed_at -> now()
- Activity logged: type='milestone_completed'
- Notification sent to client: "Phase 1 milestone achieved!"
- Dashboard overview updates to show the milestone as complete with a checkmark

**6. Phase Progression**: When a phase's milestone is completed, the phase transitions:
- roadmap_phases current phase status -> `completed`
- Next phase becomes the active phase
- Dashboard timeline highlights the new active phase
- Phase 2 tasks appear on the task board (they were created during JOURNEY-04 but were not visible until Phase 1 completed)
- Activity logged: type='phase_completed', followed by type='phase_started' for next phase

**7. Activity Feed**: A chronological feed on the project overview shows all significant events: task status changes, deliverable submissions, approvals, comments, milestone completions, phase transitions. Each entry shows: timestamp, actor name + avatar, action description, and a link to the relevant task/milestone.

### Example

Sarah (consultant) is working on Phase 1 of James's fashion e-commerce project. She completes the "Train on historical return data" task — she uploads a training report PDF and a model accuracy summary, then moves the task to "Review." James gets a notification. He opens the task, previews the PDF inline, sees 87% accuracy (above the 85% threshold in the acceptance criteria), and clicks "Approve." The task auto-moves to "Done." The milestone progress bar jumps from 50% to 75%. Sarah completes the remaining tasks over the next two weeks. When the last task ("Launch A/B test") is approved, the Phase 1 milestone auto-completes. James sees "Phase 1 Complete" on his dashboard with a celebratory indicator. Phase 2 ("Visual Search") becomes active, and its tasks appear on the board. Sarah begins Phase 2 work.

---

## User Stories

| ID       | Story                                                                                                                     | Priority |
| -------- | ------------------------------------------------------------------------------------------------------------------------- | -------- |
| US-042-1 | As a consultant, I can update task status by dragging cards on the Kanban board or using the status dropdown.              | P0       |
| US-042-2 | As a consultant, I can attach deliverables (files or links) to a task when moving it to "Review" status.                  | P0       |
| US-042-3 | As a client, I receive a notification when a task moves to "Review" and has deliverables for me to evaluate.              | P0       |
| US-042-4 | As a client, I can preview deliverable files inline (images, PDFs) and access links directly.                             | P1       |
| US-042-5 | As a client, I can approve a deliverable or request changes with a comment.                                               | P0       |
| US-042-6 | As a consultant, when a client requests changes, I see the task return to "In Progress" with the client's feedback.       | P0       |
| US-042-7 | As a user, I can post comments on any task and see a chronological comment thread.                                        | P1       |
| US-042-8 | As a user, I see the milestone progress bar update automatically as tasks complete.                                       | P0       |
| US-042-9 | As a user, I see the milestone auto-complete when all linked tasks reach "Done" status.                                   | P0       |
| US-042-10 | As a user, when a phase's milestone completes, the next phase becomes active and its tasks appear on the board.          | P0       |
| US-042-11 | As a user, I see an activity feed on the project overview showing all project events chronologically.                    | P1       |
| US-042-12 | As a client, I receive a notification when a milestone is completed.                                                     | P1       |

---

## Goals & Acceptance Criteria

- [ ] Tasks can be moved through 4 statuses: todo -> in_progress -> review -> done (via drag-and-drop or dropdown)
- [ ] Moving a task to "review" prompts the consultant to attach at least one deliverable (file or link)
- [ ] Files uploaded via Supabase Storage; reference saved in documents table linked to deliverable
- [ ] Supported file previews: images (jpg, png, gif, webp), PDFs (embedded viewer), all others show download link
- [ ] Client sees notification badge (number) on dashboard when tasks are in "review" status
- [ ] Client can click "Approve" on a deliverable: deliverable.status='approved', task.status='done', activity logged
- [ ] Client can click "Request Changes" on a deliverable: deliverable.status='revision_requested', task.status='in_progress', comment required
- [ ] Comment thread on each task: chronological, supports plain text, shows author name + avatar + timestamp
- [ ] Milestone progress bar shows (tasks completed / total tasks) as percentage, updates in real time
- [ ] Milestone auto-completes when all linked tasks have status='done': milestones.status='completed', completed_at set
- [ ] Phase transition: when milestone completes, next phase tasks become visible on task board
- [ ] Phase transition logged as two activities: 'phase_completed' and 'phase_started'
- [ ] Activity feed on project overview shows last 50 events with infinite scroll for older events
- [ ] Each activity entry: timestamp, actor avatar + name, action text, link to related entity
- [ ] All status changes, approvals, rejections, comments, and phase transitions create activity rows
- [ ] Notification system: in-app notification bell with unread count; notification list with mark-as-read

---

## Screen Flow

### Screen 1: Task Board — Active Execution

- **Route**: `/dashboard/projects/{project_id}/tasks`
- **Layout**: Kanban board (same as JOURNEY-05 Screen 3, now with active tasks)
- **State**: Phase 1 active; some tasks in "In Progress" and "Review" columns
- **New Elements** (vs. planning phase):
  - Review column tasks have an orange border indicating client action needed
  - Done column tasks show a lime checkmark
  - Notification badge on "Review" column header showing count of items awaiting client
- **Action**: Consultant drags "Train on historical return data" from "In Progress" to "Review"
- **Transition**: Deliverable attachment prompt appears

### Screen 2: Deliverable Attachment Prompt

- **Route**: `/dashboard/projects/{project_id}/tasks` (modal or expanded task detail)
- **Trigger**: Task moved to "Review" status
- **Layout**: Task detail panel with expanded "Attachments" section
- **Elements**:
  - Heading: "Attach Deliverables for Review"
  - File upload dropzone (drag-and-drop area with "Drop files here or click to browse")
  - Supported formats note: "PDF, images, documents, archives (max 50MB per file)"
  - Link input: "Or add a link" with URL text field + "Add Link" button
  - Attached items list: file name/link URL with preview thumbnail and remove button
  - "Submit for Review" button (sends notification to client)
  - "Skip" link (moves task to review without attachments — for tasks that don't produce files)
- **Action**: Upload file(s) or add link(s), click "Submit for Review"
- **Transition**: Task confirmed in "Review" column; client notified

### Screen 3: Client Review View

- **Route**: `/dashboard/projects/{project_id}/tasks` (task detail panel, client perspective)
- **Trigger**: Client clicks on a task in "Review" status (or clicks notification)
- **Layout**: Task detail panel (read-only fields except review actions)
- **Elements**:
  - Task title and description (read-only)
  - Acceptance criteria checklist (read-only, showing which are met)
  - **Deliverables Section**:
    - Each deliverable: file name/link, preview (inline for images/PDFs), download button
    - For each deliverable: "Approve" button (lime) and "Request Changes" button (amber)
  - **Comment Box**: Text area for adding a comment (especially required for "Request Changes")
  - Overall task actions: "Approve All" (if multiple deliverables) or individual approval
- **Action A**: Client clicks "Approve" -> deliverable approved, task moves to Done
- **Action B**: Client clicks "Request Changes" -> comment required, task returns to In Progress

### Screen 4: Milestone Completion

- **Route**: `/dashboard/projects/{project_id}/milestones` (or overlay on project overview)
- **Trigger**: Last task in a milestone reaches "Done" status
- **Layout**: Celebration moment — brief animated overlay
- **Elements**:
  - Heading: "Phase 1 Complete!"
  - Subtext: "AI Sizing System milestone achieved"
  - Metrics: "4 of 4 tasks completed" + "Delivered on [date]" + "X days [ahead of / behind] schedule"
  - Deliverables summary: list of all approved deliverables from this phase
  - "Continue to Phase 2" button
  - "View Summary" link (opens detailed milestone summary)
- **Duration**: Shown until user dismisses or clicks Continue
- **Transition**: Phase 2 becomes active; task board refreshes with Phase 2 tasks

### Screen 5: Phase Transition — New Phase Active

- **Route**: `/dashboard/projects/{project_id}/tasks`
- **Layout**: Task board with Phase 2 tasks now populating the "To Do" column
- **Elements**:
  - Phase selector tabs at top of task board (Phase 1 = completed indicator, Phase 2 = active, Phase 3 = upcoming)
  - Phase 2 tasks in "To Do" column, ready for consultant to begin work
  - Phase 1 tasks visible via "Phase 1" tab (all in "Done" column)
- **Note**: Consultant may need to refine Phase 2 tasks (revisit JOURNEY-05 refinement flow) before starting execution

### Screen 6: Activity Feed

- **Route**: `/dashboard/projects/{project_id}` (project overview, scrollable section)
- **Layout**: Vertical timeline feed on the right side of project overview
- **Elements**:
  - Each entry: avatar (24px circle) + actor name + action text + timestamp (relative: "2 hours ago")
  - Action examples:
    - "Sarah moved 'Deploy sizing model' to In Progress"
    - "Sarah submitted 'Training Report.pdf' for review"
    - "James approved deliverable on 'Train on historical return data'"
    - "James commented on 'Launch A/B test': 'Can we extend the test to 2 weeks?'"
    - "Phase 1 milestone 'AI Sizing System' completed"
    - "Phase 2 'Visual Search' started"
  - Clickable: each entry links to the related task or milestone
  - "View All" link at bottom expands to full activity log page
- **Infinite scroll**: Loads 50 entries initially, loads more on scroll

---

## Data Flow

| Step                            | Action                          | Table(s) Written                                  | Table(s) Read                    | Notes                                                        |
| ------------------------------- | ------------------------------- | ------------------------------------------------- | -------------------------------- | ------------------------------------------------------------ |
| Task status change              | Update task status              | tasks (status), activities                        | —                                | Optimistic UI; activity logged with from/to status           |
| Attach deliverable file         | Upload + link                   | documents, deliverables (update)                  | —                                | File to Supabase Storage; documents row stores URL + metadata |
| Attach deliverable link         | Save URL                        | deliverables (update url field)                   | —                                | URL stored directly on deliverable row                       |
| Submit for review               | Notify client                   | activities (type='submitted_for_review')          | tasks, team_members              | Notification created for client user                         |
| Client approves deliverable     | Update statuses                 | deliverables (status='approved'), tasks (status='done'), activities | —              | Single action updates both deliverable and task              |
| Client requests changes         | Update + comment                | deliverables (status='revision_requested'), tasks (status='in_progress'), activities | — | Comment saved as activity with type='change_requested'  |
| Post comment                    | Insert comment                  | activities (type='comment')                       | —                                | metadata: {task_id, content, mentions[]}                     |
| Milestone auto-complete         | Check + update                  | milestones (status='completed', completed_at)     | tasks (WHERE milestone_id)       | Triggered by task status change; checks all tasks done       |
| Phase transition                | Update phase + activate next    | roadmap_phases, activities                        | milestones, roadmap_phases       | Two activities: phase_completed + phase_started              |
| Load activity feed              | Read activities                 | —                                                 | activities (WHERE project_id)    | ORDER BY created_at DESC, LIMIT 50, with pagination          |
| Notification creation           | Insert notification             | activities (type includes notification flag)      | profiles                         | In-app notification for relevant user                        |

### Deliverable Lifecycle

```
pending -> submitted (consultant attaches + submits for review)
        -> approved (client approves) -> task auto-moves to done
        -> revision_requested (client requests changes) -> task returns to in_progress
           -> submitted (consultant resubmits) -> approved / revision_requested (cycle)
```

---

## AI Touchpoints

This journey does not invoke primary AI agents. Two optional AI-assisted features can enhance execution:

| Feature                      | Trigger                                      | AI Agent              | Input                                | Output                                    |
| ---------------------------- | -------------------------------------------- | --------------------- | ------------------------------------ | ----------------------------------------- |
| Smart task summary           | Consultant clicks "Generate summary" on task | task-summary-agent    | Task comments + status history       | Brief summary paragraph of task progress  |
| Delay risk detection         | Automated daily check                        | risk-detection-agent  | Task due dates + status + velocity   | Risk flags on tasks likely to miss dates  |

These are P2 enhancements and not required for the core execution journey.

---

## Edge Cases

| #  | Scenario                                                  | Handling                                                                                        |
| -- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 1  | Client approves deliverable then changes mind             | No "un-approve" — client must add comment requesting reversal; consultant moves task back manually |
| 2  | Task has no deliverables but is moved to "Review"         | Allow; "Submit for Review" step shows "This task has no attachments. Proceed anyway?"           |
| 3  | File upload exceeds 50MB limit                            | Client-side validation prevents upload; error: "File exceeds 50MB limit"                        |
| 4  | Supabase Storage upload fails                             | Retry once; on failure, show error: "Upload failed. Please try again." File not saved           |
| 5  | All tasks done but milestone not auto-completing          | Background check on each task update; if stuck, manual "Complete Milestone" button for consultant |
| 6  | Phase 2 tasks need refinement before execution            | Phase 2 tasks appear as "To Do" — consultant can edit before starting; same flow as JOURNEY-05  |
| 7  | Client never reviews deliverable (task stuck in Review)   | After 72 hours, send reminder notification; after 7 days, escalation flag on project overview   |
| 8  | Consultant deletes a task that was in "Review"            | Confirmation dialog; deliverable notifications cleared; activity logged as 'task_deleted'       |
| 9  | Multiple deliverables on one task: some approved, some not | Task stays in "Review" until ALL deliverables are approved or changes requested                 |
| 10 | Phase transition when next phase has 0 tasks              | Skip to following phase; log warning; show "Phase X has no tasks — add tasks or skip to Phase Y" |
| 11 | Project has only 1 phase                                  | Milestone completion triggers project completion instead of phase transition                    |
| 12 | Comment contains only whitespace                          | Client-side validation: "Comment cannot be empty"; prevent submission                          |
| 13 | Concurrent task status change by two users                | Last-write-wins with realtime sync; both UIs update via Supabase realtime subscription         |

---

## Outcomes

| Outcome                          | Metric                                                   | Target              |
| -------------------------------- | -------------------------------------------------------- | ------------------- |
| Task throughput                  | Average tasks completed per week per project              | > 3                 |
| Review turnaround time           | Median hours from "Review" to "Approved" or "Changes"    | < 24 hours          |
| First-pass approval rate         | % of deliverables approved without revision request       | > 70%               |
| Milestone on-time rate           | % of milestones completed within 1 week of target date   | > 75%               |
| Phase completion rate            | % of started phases that reach completion                 | > 95%               |
| Activity feed engagement         | % of sessions where user scrolls activity feed           | > 50%               |
| Comment frequency                | Average comments per task                                 | 2-5                 |
| Client engagement                | % of review tasks where client takes action within 48h   | > 80%               |
| Deliverable upload rate          | % of "Review" tasks with at least one deliverable        | > 85%               |
| Overall project completion rate  | % of launched projects completing all phases              | > 85%               |
