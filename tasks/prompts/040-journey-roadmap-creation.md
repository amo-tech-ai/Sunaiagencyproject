---
id: 040-journey-roadmap-creation
diagram_id: JOURNEY-04
prd_section: User Journeys
title: Roadmap creation journey — from wizard completion to actionable project plan
skill: backend
phase: HIGH
priority: P1
status: Not Started
owner: Backend
dependencies:
  - 038-journey-wizard-discovery
estimated_effort: L
percent_complete: 0
area: wizard
wizard_step: 5
schema_tables: [wizard_answers, roadmaps, roadmap_phases, projects, tasks, milestones, deliverables, project_services]
figma_prompt: prompts/040-journey-roadmap-creation.md
---

# JOURNEY-04: Roadmap Creation Journey

## Summary Table

| Field              | Value                                                                          |
| ------------------ | ------------------------------------------------------------------------------ |
| **Journey ID**     | JOURNEY-04                                                                     |
| **Prompt ID**      | 040-journey-roadmap-creation                                                   |
| **Title**          | Roadmap creation journey — from wizard completion to actionable project plan   |
| **Phase**          | HIGH                                                                           |
| **Priority**       | P1                                                                             |
| **Owner**          | Backend                                                                        |
| **Effort**         | L                                                                              |
| **Area**           | wizard                                                                         |
| **Wizard Step**    | 5                                                                              |
| **Schema Tables**  | wizard_answers, roadmaps, roadmap_phases, projects, tasks, milestones, deliverables, project_services |
| **Dependencies**   | 038-journey-wizard-discovery                                                   |
| **Status**         | Not Started                                                                    |

---

## Description

### Situation

A user has completed all 5 wizard steps and is viewing their AI-generated implementation roadmap on Step 5 (JOURNEY-02). They click "Launch Project." At this moment, the AI output — an abstract JSON blob of phases, timelines, and deliverables — must be transformed into a concrete, operational project inside the platform. This is the bridge between the wizard (discovery) and the dashboard (execution). The project, roadmap, phases, tasks, milestones, deliverables, service associations, CRM deal, and activity records all need to be created in a single atomic transaction. Nothing in this pipeline exists yet.

### Why It Matters

This is the single most critical state transition in the entire platform. Before this moment, the user is exploring. After it, they are a paying client with an active project. If this transition fails — partially created records, orphaned tasks, missing milestones — the user's first dashboard experience is broken, and trust is destroyed. If it succeeds, the user immediately sees a well-organized project with clear phases, tasks, and milestones, reinforcing the platform's value. This is also where revenue is recognized: the CRM deal is created here.

### What Exists

The database schema defines all target tables: projects (name, org_id, status), roadmaps (project_id, title, total_weeks, total_investment), roadmap_phases (roadmap_id, phase_number, title, week_range, systems, deliverables, estimated_cost), tasks (project_id, title, status), milestones (project_id, title, target_date), deliverables (milestone_id, title), project_services (project_id, service/system reference), crm_deals (value, stage, contact), and activities (type, project_id). The AI output schema from the `generate-roadmap` agent (JOURNEY-03) provides the structured data that populates these tables.

### The Build

**1. Launch Trigger**: The frontend sends `POST /launch-project` with `{session_id, org_id}`. This is a new edge function separate from the AI agents.

**2. Data Assembly**: The edge function reads all wizard_answers for the session (steps 1-5). It extracts:
- From Step 1: company name, industry, goals
- From Step 3: selectedSystems (array of system IDs)
- From Step 4: overallScore, strategy brief
- From Step 5 ai_results: title, totalWeeks, totalInvestment, phases[], quickWins[], riskFactors[], successMetrics[]

**3. Atomic Transaction**: All database writes happen inside a single Supabase database transaction (via an RPC function or a single edge function with sequential inserts that roll back on failure):

  a. **projects.insert**: `{name: aiTitle, org_id, status: 'active', description: strategyBrief, created_at: now()}`

  b. **roadmaps.insert**: `{project_id, title: aiTitle, total_weeks: aiTotalWeeks, total_investment: aiTotalInvestment, created_at: now()}`

  c. **For each phase in phases[]**:
     - **roadmap_phases.insert**: `{roadmap_id, phase_number, title, description, week_start, week_end, systems: [...], deliverables: [...], estimated_cost}`
     - **milestones.insert**: `{project_id, title: "Phase N Complete: {phaseTitle}", target_date: calculateDate(week_end), status: 'pending'}`
     - **For each deliverable in phase.deliverables[]**:
       - **tasks.insert**: `{project_id, title: deliverableName, description: deliverableDescription, status: 'todo', priority: phasePriority, milestone_id}`
       - **deliverables.insert**: `{milestone_id, title: deliverableName, status: 'pending'}`

  d. **For each system in selectedSystems[]**:
     - **project_services.insert**: `{project_id, service_id or system_id}`

  e. **crm_deals.insert**: `{org_id, value: totalInvestment, stage: 'won', title: projectName, contact_id: from profile, created_at: now()}`

  f. **activities.insert**: `{type: 'project_created', project_id, org_id, actor_id: profile_id, metadata: {source: 'wizard', session_id}}`

  g. **wizard_sessions.update**: `{wizard_completed_at: now(), status: 'completed', project_id: newProjectId}`

**4. Date Calculation**: Phase target dates calculated from project start date (today) + week offsets. Phase 1 starts week 1; Phase 2 starts after Phase 1's week_end; etc. Milestones set to Friday of the target week.

**5. Response**: Return `{project_id, redirect_url: '/dashboard/projects/{project_id}'}` to frontend. Frontend navigates to the dashboard.

**6. Post-Launch Side Effects** (async, non-blocking):
- Send welcome email to user with project summary
- Create initial project document (AI-generated project charter) in documents table
- Notify any assigned team members (if org has consultants)

### Example

James clicks "Launch Project" on his e-commerce fashion AI roadmap. The edge function reads his wizard data and begins the transaction. It creates project "AI-Powered Fashion E-Commerce Transformation" with 3 phases over 16 weeks. Phase 1 (weeks 1-6, "AI Sizing System") generates a milestone "Phase 1 Complete: AI Sizing System" due Friday of week 6, plus 4 tasks: "Deploy sizing model," "Integrate with product pages," "Train on historical return data," "Launch A/B test." Phase 2 and 3 follow the same pattern. Three project_services rows link the project to the AI Sizing, Visual Search, and Demand Forecasting systems. A CRM deal for $125,000 is created with stage "won." An activity log records the project creation. The wizard session is marked complete. The frontend redirects James to his new project dashboard where he sees the full plan laid out with tasks and milestones.

---

## User Stories

| ID       | Story                                                                                                              | Priority |
| -------- | ------------------------------------------------------------------------------------------------------------------ | -------- |
| US-040-1 | As a user clicking "Launch Project," I expect the project to be created within 3 seconds.                          | P0       |
| US-040-2 | As a user, I am redirected to my new project dashboard immediately after project creation.                         | P0       |
| US-040-3 | As a user, I see all roadmap phases reflected as milestones with realistic target dates.                           | P0       |
| US-040-4 | As a user, I see tasks auto-generated from each phase's deliverables in my project task board.                     | P0       |
| US-040-5 | As the system, all project records are created atomically — if any write fails, no partial data persists.          | P0       |
| US-040-6 | As the system, a CRM deal is created with the project's total investment value for revenue tracking.               | P1       |
| US-040-7 | As the system, an activity log entry records the project creation event with wizard session reference.             | P1       |
| US-040-8 | As a user, my wizard session is marked as completed and linked to the newly created project.                       | P1       |
| US-040-9 | As the system, project_services rows link the project to all systems the user selected in Step 3.                  | P1       |
| US-040-10 | As a guest user signing up at Step 5, my anonymous session data is migrated before project creation proceeds.     | P1       |

---

## Goals & Acceptance Criteria

- [ ] `POST /launch-project` edge function accepts `{session_id, org_id}` and returns `{project_id, redirect_url}`
- [ ] All wizard_answers (steps 1-5) are read and validated before project creation begins
- [ ] Project created with name from AI-generated title, org_id, status='active'
- [ ] Roadmap created with project_id, title, total_weeks, total_investment from Step 5 AI output
- [ ] One roadmap_phase row per phase with phase_number, title, week_start, week_end, estimated_cost
- [ ] One milestone row per phase with target_date calculated as Friday of the phase's end week
- [ ] One task row per deliverable within each phase, linked to the phase's milestone, status='todo'
- [ ] One deliverable row per deliverable within each phase, linked to the phase's milestone
- [ ] One project_services row per selected system from Step 3
- [ ] One crm_deals row with value=totalInvestment, stage='won', contact linked to user profile
- [ ] One activities row with type='project_created', project_id, metadata including session_id
- [ ] wizard_sessions row updated with wizard_completed_at=now(), status='completed', project_id
- [ ] All inserts happen within a single database transaction; on any failure, full rollback occurs
- [ ] On rollback, frontend receives error response with retry option
- [ ] Total creation time from request to response < 3 seconds
- [ ] Guest users are prompted to sign up (JOURNEY-01 migration) before launch-project is called
- [ ] Duplicate launch protection: if session already has project_id, return existing project instead of creating duplicate

---

## Screen Flow

### Screen 1: Wizard Step 5 — Pre-Launch

- **Route**: `/wizard` (step=5)
- **State**: Roadmap AI results displayed; user has reviewed phases, quick wins, risks
- **Key Element**: "Launch Project" button (large, lime #84CC16 bg, dark teal text)
- **Action**: User clicks "Launch Project"
- **Transition**: Button shows loading spinner, text changes to "Creating your project..."

### Screen 2: Project Creation Loading

- **Route**: `/wizard` (step=5, modal overlay)
- **Layout**: Semi-transparent overlay with centered card
- **Elements**:
  - Animated progress indicator (checkmarks appearing sequentially)
  - Step messages: "Creating project..." -> "Building roadmap..." -> "Generating tasks..." -> "Setting milestones..." -> "Almost ready..."
  - Each step shows a checkmark as it completes (visual, not actual backend steps — timed animation)
- **Duration**: 1-3 seconds
- **Transition**: On success, brief "Project created!" message with lime checkmark, then redirect

### Screen 3: Dashboard Redirect

- **Route**: `/dashboard/projects/{project_id}`
- **State**: New project loaded with all generated data
- **Elements**: Project overview with roadmap timeline, task board, milestones — defined in JOURNEY-05
- **Note**: First-time project view may show a welcome tour tooltip overlay

### Screen 4: Error Recovery (if transaction fails)

- **Route**: `/wizard` (step=5, error state)
- **Elements**:
  - Error card: "We couldn't create your project. Your wizard data is safe."
  - "Try Again" button (retries the launch-project call)
  - "Contact Support" link
  - Technical details collapsible (for debugging)
- **Note**: Wizard data is intact in wizard_answers; only the project creation failed

---

## Data Flow

| Step                      | Action                          | Table(s) Written                                      | Table(s) Read                       | Notes                                                          |
| ------------------------- | ------------------------------- | ----------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------- |
| Request received          | Validate session                | —                                                     | wizard_sessions                     | Confirm session exists, not already completed                  |
| Load wizard data          | Read all steps                  | —                                                     | wizard_answers (steps 1-5)          | Extract structured data from all 5 steps                       |
| Duplicate check           | Check existing project          | —                                                     | wizard_sessions (project_id)        | If project_id already set, return existing project             |
| Create project            | Insert project                  | projects                                              | organizations                       | name, org_id, status='active', description from strategy brief |
| Create roadmap            | Insert roadmap                  | roadmaps                                              | —                                   | project_id, title, total_weeks, total_investment               |
| Create phases             | Insert N phases                 | roadmap_phases                                        | —                                   | One per AI-generated phase; includes week range and cost       |
| Create milestones         | Insert N milestones             | milestones                                            | —                                   | One per phase; target_date = project_start + week_end offset   |
| Create tasks              | Insert M tasks                  | tasks                                                 | —                                   | One per deliverable; linked to milestone; status='todo'        |
| Create deliverables       | Insert M deliverables           | deliverables                                          | —                                   | One per deliverable; linked to milestone; status='pending'     |
| Link services             | Insert K service links          | project_services                                      | wizard_answers (step-3)             | One per selected system from Step 3                            |
| Create CRM deal           | Insert deal                     | crm_deals                                             | profiles, crm_contacts              | value, stage='won', contact from user profile                  |
| Log activity              | Insert activity                 | activities                                            | —                                   | type='project_created', project_id, session_id in metadata     |
| Complete session          | Update session                  | wizard_sessions                                       | —                                   | wizard_completed_at, status='completed', project_id            |
| Return response           | Send project_id                 | —                                                     | —                                   | {project_id, redirect_url}                                     |

### Record Count Estimates

For a typical 3-phase roadmap with 4 deliverables per phase:
- 1 project + 1 roadmap + 3 roadmap_phases + 3 milestones + 12 tasks + 12 deliverables + 3 project_services + 1 crm_deal + 1 activity + 1 session update = **38 database operations** in one transaction.

---

## AI Touchpoints

This journey does not directly invoke AI agents. The AI work was completed in JOURNEY-03 (the `generate-roadmap` agent in Step 5). This journey consumes the AI output stored in `wizard_answers.ai_results` for step-5.

However, two post-launch AI tasks run asynchronously after the transaction completes:

| Task                          | Agent                  | Input                                | Output                         | Trigger         |
| ----------------------------- | ---------------------- | ------------------------------------ | ------------------------------ | --------------- |
| Generate project charter      | project-charter-agent  | Project + roadmap + wizard context   | Markdown project charter doc   | Async post-launch |
| Welcome email personalization | email-content-agent    | User name + project summary          | Personalized welcome email body | Async post-launch |

These are non-blocking and do not affect the project creation transaction.

---

## Edge Cases

| #  | Scenario                                                   | Handling                                                                                          |
| -- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 1  | Transaction partially fails (e.g., tasks insert fails)     | Full rollback; no project, roadmap, or partial records persist; return error to frontend          |
| 2  | User double-clicks "Launch Project"                        | Frontend disables button on first click; backend checks wizard_sessions.project_id for idempotency |
| 3  | wizard_answers missing for one or more steps               | Return 400: "Wizard incomplete. Please complete all steps."; redirect to earliest incomplete step |
| 4  | AI-generated roadmap has 0 phases                          | Return 400: "Roadmap generation incomplete. Please retry Step 5."; do not create project         |
| 5  | AI-generated phase has 0 deliverables                      | Create phase and milestone but no tasks; log warning; consultant adds tasks manually later        |
| 6  | org_id is null (guest user attempting launch)              | Return 401: "Please sign up to launch your project"; frontend shows sign-up modal                |
| 7  | Organization already has a project from a previous wizard   | Allow multiple projects per org; each wizard session creates a separate project                   |
| 8  | totalInvestment from AI is unreasonably high/low           | Clamp to org-size-appropriate range; log anomaly; human review flagged                           |
| 9  | CRM contact doesn't exist for user                         | Create crm_contacts row from profile data before creating deal; include in transaction           |
| 10 | Database connection drops during transaction               | Transaction auto-rolls back; return 503; frontend shows retry option                             |
| 11 | Phase week ranges overlap or have gaps                     | Normalize: sort by phase_number, assign sequential non-overlapping week ranges                    |
| 12 | System IDs from Step 3 no longer exist in systems table    | Skip invalid IDs; log warning; create project_services only for valid systems                    |

---

## Outcomes

| Outcome                          | Metric                                              | Target              |
| -------------------------------- | --------------------------------------------------- | ------------------- |
| Launch success rate              | % of "Launch Project" clicks that succeed            | > 99%               |
| Transaction duration             | Median time from request to response                 | < 2 seconds         |
| Records created per launch       | Average number of DB rows created                    | 30-50               |
| Dashboard redirect time          | Time from launch success to dashboard render         | < 1 second          |
| Duplicate prevention rate        | % of duplicate clicks correctly deduplicated         | 100%                |
| Rollback rate                    | % of launches that trigger full rollback             | < 0.5%              |
| CRM deal creation rate           | % of launched projects with corresponding CRM deal   | 100%                |
| Task accuracy                    | % of AI deliverables correctly mapped to tasks        | 100%               |
| Milestone date accuracy          | % of milestones with correctly calculated dates       | 100%               |
