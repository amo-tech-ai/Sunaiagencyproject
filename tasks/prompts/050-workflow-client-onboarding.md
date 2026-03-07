---
id: 050-workflow-client-onboarding
diagram_id: WORKFLOW-02
prd_section: Workflow Automation
title: Client onboarding workflow — from wizard completion to active project
skill: backend
phase: HIGH
priority: P1
status: Not Started
owner: Backend
dependencies:
  - 040-journey-roadmap-creation
estimated_effort: L
percent_complete: 0
area: agency-dashboard
schema_tables: [wizard_sessions, projects, roadmaps, roadmap_phases, tasks, milestones, clients, crm_deals, team_members, activities]
figma_prompt: prompts/050-workflow-client-onboarding.md
---

# 050 — Client Onboarding Workflow

## Summary Table

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| Workflow ID        | WORKFLOW-02                                                  |
| Name               | Client Onboarding Workflow                                   |
| Type               | Event-driven automation (multi-step orchestration)           |
| Trigger            | `wizard_sessions.wizard_completed_at` IS NOT NULL            |
| Scope              | Wizard completion through active project with assigned team  |
| Tables Modified    | `projects`, `roadmaps`, `roadmap_phases`, `tasks`, `milestones`, `clients`, `crm_deals`, `team_members`, `activities` |
| AI Dependency      | Task descriptions generated from roadmap context             |
| Dashboard Impact   | New project on dashboard, consultant notified, client access |
| Priority           | P1 HIGH                                                      |

---

## Description

### 1. Purpose

The Client Onboarding Workflow is the bridge between the wizard and active project delivery. When a user completes the wizard (Step 5 "Launch" clicked), this workflow orchestrates the creation of all project infrastructure: the project record, implementation roadmap with phases, tasks from phase deliverables, milestones at phase boundaries, client record, CRM deal advancement to "Won", consultant assignment, welcome communication, and onboarding checklist. This is the most complex workflow in the system, touching 10 database tables in a coordinated transaction.

### 2. User Context

The client has just completed the wizard — they've analyzed their business, received diagnostics, selected AI systems, reviewed their readiness score, and confirmed their implementation roadmap. Clicking "Launch" should feel like a decisive moment. Behind the scenes, the platform must instantly stand up their entire project infrastructure so that when they next log in, they see a fully populated dashboard with their roadmap, assigned consultant, and first action items. The agency team simultaneously sees a new active project with pre-generated tasks ready for assignment.

### 3. Technical Approach

The workflow is implemented as a single edge function that orchestrates multiple database operations within a transaction. It reads all wizard data, extracts the roadmap from Step 5 AI results, and fans out into parallel insert operations. The consultant assignment uses a skill-matching algorithm that considers the selected AI systems and each team member's skill tags, with workload balancing as a tiebreaker. The onboarding checklist is a standard template that gets personalized with project-specific data.

### 4. Data Flow

```
wizard_sessions.wizard_completed_at SET
    |
    v
Edge Function: onboard-client (triggered)
    |
    +--> Load all wizard_answers (steps 1-5)
    |
    +--> [Transaction Start]
    |
    +--> 1. Create/update CLIENT record
    |       clients table <-- company info from step-1
    |
    +--> 2. Create PROJECT
    |       projects table <-- name, client_id, status='active'
    |
    +--> 3. Create ROADMAP
    |       roadmaps table <-- from step-5 ai_results
    |
    +--> 4. Create ROADMAP_PHASES (N phases)
    |       roadmap_phases table <-- phases from roadmap
    |
    +--> 5. Create MILESTONES (per phase boundary)
    |       milestones table <-- phase start/end markers
    |
    +--> 6. Create TASKS (from phase deliverables)
    |       tasks table <-- deliverables expanded to tasks
    |
    +--> 7. Assign CONSULTANT
    |       team_members <-- skill match + workload balance
    |       projects.consultant_id = matched_member
    |
    +--> 8. Update CRM DEAL to 'Won'
    |       crm_deals.stage_id = 'won'
    |
    +--> 9. Create ONBOARDING CHECKLIST tasks
    |       tasks table <-- standard template + project data
    |
    +--> [Transaction Commit]
    |
    +--> 10. Send welcome email to client
    +--> 11. Notify assigned consultant
    +--> 12. Log all events to activities
```

### 5. Design Considerations

Atomicity is critical — if any step fails, the entire onboarding must roll back to prevent orphaned records. The transaction spans all database writes; email and notification delivery happen after commit (eventual consistency acceptable for communications). The consultant assignment algorithm is deterministic: given the same inputs, it always selects the same consultant, which aids debugging. The onboarding checklist template includes 8-10 standard items (welcome call scheduling, data access provisioning, tool setup, kickoff meeting, etc.) that are personalized with dates calculated from the project start date.

---

## Workflow Specification

### Step-by-Step Logic

| Step | Action                          | Table(s)              | Details                                          |
| ---- | ------------------------------- | --------------------- | ------------------------------------------------ |
| 1    | Load wizard data                | `wizard_answers`      | All 5 steps' data and ai_results                |
| 2    | Create/update client            | `clients`             | UPSERT on email; set company info from step-1   |
| 3    | Create project                  | `projects`            | Name from company; status='active'; link client  |
| 4    | Create roadmap                  | `roadmaps`            | From step-5 ai_results; link to project          |
| 5    | Create phases                   | `roadmap_phases`      | N phases from roadmap; ordered by sequence        |
| 6    | Create milestones               | `milestones`          | Phase boundaries + key deliverable checkpoints   |
| 7    | Create tasks from deliverables  | `tasks`               | Expand each phase deliverable into tasks          |
| 8    | Assign consultant               | `projects`, `team_members` | Skill match + workload algorithm             |
| 9    | Update CRM deal                 | `crm_deals`           | Move to 'Won' stage; update value                |
| 10   | Create onboarding checklist     | `tasks`               | Standard template personalized with project data |
| 11   | Send welcome email              | External (email)      | Client dashboard link + first steps              |
| 12   | Notify consultant               | `activities`          | In-app notification + email to assigned consultant|
| 13   | Log activities                  | `activities`          | All events logged for audit trail                |

### Consultant Assignment Algorithm

```typescript
function assignConsultant(
  selectedSystems: string[],
  teamMembers: TeamMember[]
): TeamMember {
  // 1. Filter to available consultants (not on leave, active status)
  const available = teamMembers.filter(m => m.status === 'active' && !m.on_leave);

  // 2. Score each by skill match
  const scored = available.map(member => {
    const skillMatch = selectedSystems.filter(sys =>
      member.skills.includes(sys)
    ).length / selectedSystems.length;

    const workloadPenalty = member.active_projects / 10; // 0-1 range

    return {
      member,
      score: (skillMatch * 0.7) - (workloadPenalty * 0.3)
    };
  });

  // 3. Sort by score descending, return top
  scored.sort((a, b) => b.score - a.score);
  return scored[0].member;
}
```

### Onboarding Checklist Template

| Task                          | Due (relative)      | Assignee      |
| ----------------------------- | ------------------- | ------------- |
| Schedule welcome call         | Day 1               | Consultant    |
| Provision client dashboard    | Day 1               | System        |
| Collect data access credentials | Day 2             | Client        |
| Setup development environment | Day 3               | Consultant    |
| Conduct kickoff meeting       | Day 5               | Consultant    |
| Review and approve roadmap    | Day 5               | Client        |
| Setup monitoring and alerts   | Day 7               | Consultant    |
| First sprint planning         | Day 7               | Consultant    |
| Week 1 check-in call          | Day 7               | Consultant    |
| Confirm Phase 1 scope         | Day 10              | Client        |

---

## Input Schema

```typescript
interface ClientOnboardingInput {
  sessionId: string;           // wizard_sessions.id
  wizardData: {
    step1: { data: object; aiResults: BusinessAnalysisResult };
    step2: { data: object; aiResults: IndustryDiagnosticsResult };
    step3: { data: { selectedSystems: string[] }; aiResults: SystemRecommendationsResult };
    step4: { aiResults: ReadinessScoreResult };
    step5: { aiResults: RoadmapResult };
  };
  userId: string;              // Authenticated user ID
  email: string;               // Client email
}
```

---

## Output Schema

```typescript
interface ClientOnboardingResult {
  success: boolean;
  clientId: string;
  projectId: string;
  roadmapId: string;
  phasesCreated: number;
  tasksCreated: number;
  milestonesCreated: number;
  assignedConsultant: {
    id: string;
    name: string;
    email: string;
  };
  dealId: string;
  dealStage: string;             // 'won'
  onboardingTasksCreated: number;
  notifications: Array<{
    type: string;
    recipient: string;
    status: 'sent' | 'queued' | 'failed';
  }>;
}
```

---

## Data Sources

| Source               | Table                   | Usage                                         |
| -------------------- | ----------------------- | --------------------------------------------- |
| Wizard answers       | `wizard_answers`        | All 5 steps — full client and roadmap data    |
| Wizard session       | `wizard_sessions`       | Session metadata, completion timestamp         |
| CRM deal             | `crm_deals`             | Existing deal to advance to 'Won'              |
| CRM stages           | `crm_stages`            | Stage ID for 'Won'                            |
| Team members         | `team_members`          | Available consultants for assignment           |
| Systems catalog      | `systems`               | System details for task generation             |

---

## Trigger Events

| Trigger                          | Source                              | Timing                       |
| -------------------------------- | ----------------------------------- | ---------------------------- |
| Wizard completed                 | `wizard_sessions.wizard_completed_at` SET | Immediate (primary)      |
| Manual onboarding                | Agency dashboard "Onboard" button   | On-demand (edge case)        |
| Re-onboarding                    | Admin re-triggers after fix         | Manual (recovery scenario)   |

---

## Edge Cases

| Scenario                              | Handling                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------- |
| Client already exists                 | UPSERT client; link new project to existing client                       |
| No consultants available              | Create project without assignment; flag for manual assignment; alert admin |
| Wizard data incomplete (step missing) | Abort onboarding; return error specifying which step is missing          |
| Transaction fails mid-way             | Full rollback; log error; return failure with retry instructions         |
| Duplicate onboarding (double-click)   | Check if project already exists for session; return existing if found     |
| CRM deal doesn't exist                | Create deal retroactively; move directly to 'Won'                        |
| Email delivery fails                  | Log failure; project still created; retry email via separate job         |
| Very large roadmap (>10 phases)       | Cap at 10 phases; collapse remaining into final "Extended" phase         |
| User unauthenticated                  | Require auth before onboarding trigger; redirect to login                |
| Roadmap AI results malformed          | Fall back to standard template roadmap for the selected systems          |

---

## Database Operations

### INSERT: clients

```sql
INSERT INTO clients (user_id, email, company_name, industry, metadata, created_at)
VALUES ($userId, $email, $companyName, $industry, $metadata, now())
ON CONFLICT (user_id) DO UPDATE SET
  company_name = COALESCE($companyName, clients.company_name),
  metadata = clients.metadata || $metadata,
  updated_at = now()
RETURNING id;
```

### INSERT: projects

```sql
INSERT INTO projects (client_id, name, status, consultant_id, metadata, created_at)
VALUES ($clientId, $projectName, 'active', $consultantId, $metadata, now())
RETURNING id;
```

### INSERT: roadmaps

```sql
INSERT INTO roadmaps (project_id, title, total_phases, estimated_weeks, data, created_at)
VALUES ($projectId, $title, $totalPhases, $estimatedWeeks, $roadmapData, now())
RETURNING id;
```

### INSERT: roadmap_phases (bulk)

```sql
INSERT INTO roadmap_phases (roadmap_id, sequence, title, description, duration_weeks, status, deliverables, created_at)
VALUES ($roadmapId, $seq, $title, $desc, $weeks, 'pending', $deliverables, now());
```

### INSERT: tasks (bulk)

```sql
INSERT INTO tasks (project_id, phase_id, title, description, status, assignee_id, due_date, created_at)
VALUES ($projectId, $phaseId, $title, $desc, 'todo', $assigneeId, $dueDate, now());
```

### INSERT: milestones (bulk)

```sql
INSERT INTO milestones (project_id, phase_id, title, due_date, status, created_at)
VALUES ($projectId, $phaseId, $title, $dueDate, 'pending', now());
```

### UPDATE: crm_deals

```sql
UPDATE crm_deals
SET stage_id = $wonStageId, value = $dealValue, metadata = metadata || '{"onboarded": true}', updated_at = now()
WHERE id = $dealId;
```

---

## Outcomes

| Outcome                          | Metric                                | Target                 |
| -------------------------------- | ------------------------------------- | ---------------------- |
| Onboarding success rate          | Completed onboardings / attempts      | > 99%                  |
| Time to active project           | Wizard complete → project visible     | < 5 seconds            |
| Data completeness                | Projects with all required fields     | 100%                   |
| Consultant assignment accuracy   | Skill match score of assigned consultant | > 0.6                |
| Onboarding checklist completion  | Checklist items done within timeline  | > 80% within 10 days  |
| Client first login               | Clients who log in within 24h        | > 70%                  |
| Transaction rollback rate        | Failed onboardings                    | < 1%                   |
| Welcome email delivery           | Emails delivered successfully         | > 98%                  |
