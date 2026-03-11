---
id: 053-workflow-project-task-automation
diagram_id: WORKFLOW-05
prd_section: Workflow Automation
title: Project task automation workflow — auto-generation and lifecycle management
skill: backend
phase: MEDIUM
priority: P2
status: Not Started
owner: Backend
dependencies:
  - 027-project-delivery-dashboard
estimated_effort: M
percent_complete: 0
area: client-dashboard
schema_tables: [tasks, milestones, deliverables, projects, roadmap_phases, activities, team_members]
figma_prompt: prompts/053-workflow-project-task-automation.md
---

# 053 — Project Task Automation Workflow

## Summary Table

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| Workflow ID        | WORKFLOW-05                                                  |
| Name               | Project Task Automation Workflow                             |
| Type               | Multi-trigger lifecycle automation                           |
| Triggers           | Phase starts, milestone approaches, task completed           |
| Scope              | Full project task lifecycle — generation through completion  |
| Tables Modified    | `tasks`, `milestones`, `roadmap_phases`, `activities`        |
| AI Dependency      | None (rule-based automation)                                 |
| Dashboard Impact   | Project delivery dashboard, task boards, notifications       |
| Priority           | P2 MEDIUM                                                    |

---

## Description

### 1. Purpose

The Project Task Automation Workflow manages the complete lifecycle of tasks within a project — from auto-generation when a phase starts, through assignment and progress tracking, to automatic milestone and phase completion when all constituent tasks are done. It also handles proactive alerts (approaching milestones), escalations (overdue tasks), and cascade effects (phase completion triggering next phase start). This workflow eliminates manual project management overhead and ensures consistent, timely delivery tracking.

### 2. User Context

Agency consultants see their task boards automatically populated when a new phase begins — no manual task creation needed. They receive alerts 3 days before a milestone deadline. If a task goes overdue, their project manager is automatically notified. Clients see their project timeline update in real-time: when the last task in a milestone is marked complete, the milestone automatically checks off, and when all milestones in a phase complete, the phase transitions to "completed" and the next phase begins. This creates a feeling of automatic progress and professional delivery management.

### 3. Technical Approach

The workflow consists of five automation chains, each triggered by different events. These are implemented as Supabase Database Webhooks calling edge functions, plus a cron job for time-based triggers (approaching milestones, overdue tasks). The automations are rule-based (no AI needed) and execute deterministic logic: check conditions, perform state transitions, create records, send notifications. Each chain is idempotent — re-triggering produces the same result.

### 4. Data Flow

```
CHAIN 1: Phase Start --> Task Generation
    roadmap_phases.status = 'in_progress'
        |
        +--> Load phase deliverables
        +--> Generate tasks from deliverable templates
        +--> Assign tasks to team members (round-robin within skills)
        +--> Notify assigned team members
        +--> Log activities

CHAIN 2: Task Completed --> Milestone Check
    tasks.status = 'completed'
        |
        +--> Check: all tasks for this milestone completed?
        |       +--> YES: milestone.status = 'completed'
        |       |       +--> Notify client
        |       |       +--> Log activities
        |       +--> NO: Update milestone progress percentage
        |
        +--> Check: all milestones for this phase completed?
                +--> YES: Trigger CHAIN 3
                +--> NO: Continue

CHAIN 3: Phase Completion --> Next Phase
    All milestones in phase completed
        |
        +--> roadmap_phases.status = 'completed'
        +--> roadmap_phases[next].status = 'in_progress'
        +--> Trigger CHAIN 1 for next phase
        +--> Notify client and consultant
        +--> Log activities

CHAIN 4: Milestone Approaching (cron, daily)
    milestones.due_date - 3 days
        |
        +--> Find milestones due within 3 days
        +--> Check completion status
        |       +--> All tasks done: No action
        |       +--> Tasks remaining: Alert assigned team
        +--> Log activities

CHAIN 5: Task Overdue (cron, daily)
    tasks.due_date < now() AND tasks.status != 'completed'
        |
        +--> Find overdue tasks
        +--> Escalate to project manager
        +--> Notify client of potential delay (if > 2 days overdue)
        +--> Tag tasks as 'overdue'
        +--> Log activities
```

### 5. Design Considerations

All chains must be idempotent — running twice with the same state produces no duplicates or errors. The task generation from deliverables uses a template mapping: each deliverable type (setup, integration, testing, launch, training) expands into a standard set of subtasks. Team assignment uses round-robin within skill groups to balance workload. The overdue escalation has a grace period: tasks are only escalated after 1 day overdue, and clients are only notified after 2 days overdue to avoid premature alarms. Phase transitions are logged in `activities` for full audit trail.

---

## Workflow Specification

### Chain 1: Phase Start — Task Generation

| Step | Action                              | Details                                              |
| ---- | ----------------------------------- | ---------------------------------------------------- |
| 1    | Detect phase start                  | `roadmap_phases.status` changed to 'in_progress'     |
| 2    | Load phase deliverables             | From `roadmap_phases.deliverables` JSON               |
| 3    | Expand deliverables to tasks        | Each deliverable generates 2-4 tasks from template   |
| 4    | Calculate task due dates            | Based on phase duration and deliverable sequence     |
| 5    | Assign tasks to team members        | Round-robin within matching skill group              |
| 6    | Create task records                 | Bulk INSERT into `tasks`                             |
| 7    | Create milestone records            | One per deliverable + phase boundary milestone       |
| 8    | Notify team                         | In-app + email to assigned team members              |
| 9    | Log event                           | `activities` — 'phase_started'                       |

### Deliverable-to-Task Template

| Deliverable Type | Generated Tasks                                              |
| ---------------- | ------------------------------------------------------------ |
| `setup`          | Environment setup, Configuration, Access provisioning        |
| `integration`    | API integration, Data mapping, Connection testing            |
| `testing`        | Unit tests, Integration tests, UAT, Bug fixes                |
| `launch`         | Staging deployment, Production deployment, Monitoring setup  |
| `training`       | Documentation, Training session, Knowledge transfer          |

### Chain 2: Task Completed — Milestone Check

| Step | Action                              | Details                                              |
| ---- | ----------------------------------- | ---------------------------------------------------- |
| 1    | Detect task completion              | `tasks.status` changed to 'completed'                |
| 2    | Identify parent milestone           | From `tasks.milestone_id`                            |
| 3    | Count remaining tasks               | Tasks for milestone WHERE status != 'completed'      |
| 4a   | If all done: complete milestone     | `milestones.status = 'completed'`                    |
| 4b   | If not done: update progress        | `milestones.progress = completed / total`            |
| 5    | Check all phase milestones          | If milestone completed, check parent phase           |
| 6    | If all phase milestones done        | Trigger Chain 3                                      |
| 7    | Notify relevant parties             | Client (milestone), consultant (progress)            |
| 8    | Log event                           | `activities` — 'task_completed', 'milestone_completed'|

### Chain 3: Phase Completion — Next Phase

| Step | Action                              | Details                                              |
| ---- | ----------------------------------- | ---------------------------------------------------- |
| 1    | Mark phase completed                | `roadmap_phases.status = 'completed'`                |
| 2    | Find next phase                     | `roadmap_phases` WHERE `sequence = current + 1`      |
| 3    | Start next phase                    | `roadmap_phases.status = 'in_progress'`              |
| 4    | Trigger Chain 1                     | Generate tasks for new phase                         |
| 5    | Update project progress             | `projects.progress = completed_phases / total_phases`|
| 6    | Trigger workflow 054                | Phase completion report (optional)                   |
| 7    | Notify client and consultant        | "Phase X completed, Phase Y starting"                |
| 8    | Log events                          | `activities` — 'phase_completed', 'phase_started'    |

### Chain 4: Milestone Approaching (Cron)

| Step | Action                              | Details                                              |
| ---- | ----------------------------------- | ---------------------------------------------------- |
| 1    | Query approaching milestones        | `due_date BETWEEN now() AND now() + 3 days`         |
| 2    | Filter incomplete milestones        | `status != 'completed'`                              |
| 3    | For each: count remaining tasks     | Tasks WHERE status != 'completed'                    |
| 4    | If tasks remaining: alert team      | "Milestone X due in N days, M tasks remaining"       |
| 5    | Log alerts                          | `activities` — 'milestone_approaching'               |

### Chain 5: Task Overdue (Cron)

| Step | Action                              | Details                                              |
| ---- | ----------------------------------- | ---------------------------------------------------- |
| 1    | Query overdue tasks                 | `due_date < now() AND status != 'completed'`        |
| 2    | Calculate days overdue              | `now() - due_date`                                   |
| 3    | If 1+ days: escalate to PM          | Notify project manager                               |
| 4    | If 2+ days: notify client           | "Task X is delayed; revised ETA: Y"                  |
| 5    | Tag tasks as overdue                | `tasks.metadata.overdue = true`                      |
| 6    | Log escalations                     | `activities` — 'task_overdue', 'task_escalated'      |

---

## Input Schema

```typescript
// Chain 1
interface PhaseStartInput {
  phaseId: string;
  projectId: string;
}

// Chain 2
interface TaskCompletedInput {
  taskId: string;
  projectId: string;
  completedBy: string;   // team_member ID
}

// Chain 4 & 5 (cron)
interface CronCheckInput {
  checkType: 'milestone_approaching' | 'task_overdue';
  runDate: string;       // ISO date
}
```

---

## Output Schema

```typescript
interface TaskAutomationResult {
  chain: string;           // Which chain executed
  projectId: string;
  actions: Array<{
    type: 'task_created' | 'task_assigned' | 'milestone_completed' | 'phase_completed' | 'phase_started' | 'alert_sent' | 'escalation_sent';
    entityId: string;
    details: string;
  }>;
  notifications: Array<{
    recipient: string;
    type: 'in_app' | 'email';
    message: string;
    status: 'sent' | 'queued' | 'failed';
  }>;
}
```

---

## Data Sources

| Source               | Table                   | Usage                                         |
| -------------------- | ----------------------- | --------------------------------------------- |
| Phase definitions    | `roadmap_phases`        | Deliverables, duration, sequence              |
| Tasks                | `tasks`                 | Current status, assignments, due dates         |
| Milestones           | `milestones`            | Progress tracking, due dates                  |
| Team members         | `team_members`          | Skill-based assignment, workload              |
| Project              | `projects`              | Consultant ID, status, progress               |

---

## Trigger Events

| Trigger                          | Source                              | Timing                       |
| -------------------------------- | ----------------------------------- | ---------------------------- |
| Phase status = 'in_progress'     | `roadmap_phases` UPDATE             | Immediate — Chain 1          |
| Task status = 'completed'        | `tasks` UPDATE                      | Immediate — Chain 2          |
| All phase milestones completed   | Chain 2 output                      | Immediate — Chain 3          |
| Daily cron (8:00 AM UTC)         | Cron scheduler                      | Daily — Chains 4 & 5         |

---

## Edge Cases

| Scenario                              | Handling                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------- |
| Phase has no deliverables             | Create a single "Phase Review" task; log warning                         |
| Task completed but milestone missing  | Skip milestone check; log orphaned task warning                          |
| Last phase completed (no next phase)  | Mark project as 'completed'; trigger final report (054)                  |
| Team member on leave                  | Reassign tasks to next available team member in skill group              |
| No team members with matching skills  | Assign to project consultant; flag for manual review                     |
| Duplicate task completion event       | Idempotent — re-check milestone; no duplicate state transitions          |
| Milestone due date already passed     | Skip approaching alert; immediately check for overdue tasks             |
| Phase started with ongoing prev phase | Allow overlap; log warning about parallel phases                         |
| Cron job finds 100+ overdue tasks     | Batch notifications; single summary to PM instead of per-task            |
| Task reassigned while in progress     | Update assignment; notify both old and new assignee                      |

---

## Database Operations

### Chain 1: Bulk INSERT tasks

```sql
INSERT INTO tasks (project_id, phase_id, milestone_id, title, description, status, assignee_id, due_date, metadata, created_at)
SELECT $projectId, $phaseId, $milestoneId, t.title, t.description, 'todo', t.assignee_id, t.due_date, '{}', now()
FROM unnest($taskArray::task_input[]) t;
```

### Chain 2: Update milestone

```sql
UPDATE milestones SET
  status = CASE WHEN $remaining = 0 THEN 'completed' ELSE status END,
  progress = ($completed::float / $total::float),
  updated_at = now()
WHERE id = $milestoneId;
```

### Chain 3: Phase transition

```sql
UPDATE roadmap_phases SET status = 'completed', completed_at = now(), updated_at = now()
WHERE id = $currentPhaseId;

UPDATE roadmap_phases SET status = 'in_progress', started_at = now(), updated_at = now()
WHERE roadmap_id = $roadmapId AND sequence = $nextSequence;
```

### Chain 5: Tag overdue

```sql
UPDATE tasks SET
  metadata = metadata || '{"overdue": true, "days_overdue": ' || extract(day from now() - due_date) || '}',
  updated_at = now()
WHERE due_date < now() AND status NOT IN ('completed', 'cancelled')
AND (metadata->>'overdue')::boolean IS NOT TRUE;
```

### All chains: Log activity

```sql
INSERT INTO activities (entity_type, entity_id, action, data, actor_id, created_at)
VALUES ($entityType, $entityId, $action, $eventData, $actorId, now());
```

---

## Outcomes

| Outcome                          | Metric                                | Target                 |
| -------------------------------- | ------------------------------------- | ---------------------- |
| Task auto-generation             | Tasks created per phase start         | 100% automated         |
| Milestone auto-completion        | Milestones completed automatically    | > 95%                  |
| Phase transition success         | Phases transitioned without error     | > 99%                  |
| Approaching milestone alerts     | Alerts sent on time (3 days before)   | > 98%                  |
| Overdue escalation timeliness    | Escalations within 24h of overdue     | > 95%                  |
| Client notification accuracy     | Clients notified of milestone events  | 100%                   |
| Task assignment balance          | Std dev of tasks per team member      | < 2 across team        |
| Idempotency                      | No duplicate records from re-triggers | 0 duplicates           |
