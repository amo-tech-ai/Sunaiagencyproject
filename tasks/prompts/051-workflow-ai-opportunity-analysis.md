---
id: 051-workflow-ai-opportunity-analysis
diagram_id: WORKFLOW-03
prd_section: Workflow Automation
title: AI opportunity analysis workflow — continuous analysis and re-assessment
skill: backend
phase: MEDIUM
priority: P2
status: Not Started
owner: Backend
dependencies:
  - 029-ai-insights-dashboard
estimated_effort: M
percent_complete: 0
area: ai-agents
schema_tables: [wizard_answers, context_snapshots, ai_cache, ai_run_logs, projects]
figma_prompt: prompts/051-workflow-ai-opportunity-analysis.md
---

# 051 — AI Opportunity Analysis Workflow

## Summary Table

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| Workflow ID        | WORKFLOW-03                                                  |
| Name               | AI Opportunity Analysis Workflow                             |
| Type               | Event-driven + on-demand analysis                            |
| Trigger            | Milestone completed OR manual "Re-analyze" button            |
| Scope              | Post-onboarding continuous assessment                        |
| Tables Modified    | `context_snapshots`, `ai_cache`, `ai_run_logs`, `activities` |
| AI Dependency      | Re-runs readiness-score agent (047) with updated context     |
| Dashboard Impact   | AI insights dashboard — comparison view, trend charts        |
| Priority           | P2 MEDIUM                                                    |

---

## Description

### 1. Purpose

The AI Opportunity Analysis Workflow provides continuous re-assessment of a client's AI readiness as their project progresses. After the initial wizard assessment creates a baseline, this workflow periodically re-evaluates the client's position by incorporating project progress data — completed milestones, implemented systems, task completion rates — to produce updated readiness scores. It then generates a delta report comparing current state to the previous snapshot, revealing what improved, what regressed, and what new opportunities have emerged. This is the feedback loop that justifies ongoing engagement.

### 2. User Context

Clients see their AI readiness score on their dashboard. Over time, as AI systems are implemented and processes improve, they expect to see measurable progress. The AI insights dashboard shows a timeline of readiness snapshots with trend lines. When a milestone is completed (e.g., "Support Engine deployed"), the system automatically re-evaluates and shows the client their improved score. This creates a powerful "before and after" narrative that reinforces the value of the engagement and identifies the next highest-impact opportunity.

### 3. Technical Approach

The workflow is triggered by milestone completion events or manual re-analysis requests. It loads the latest `context_snapshot` for the project, collects current project state (completed tasks, active systems, milestone status), and re-runs the readiness-score agent (047) with this enriched context. The delta is computed by comparing the new scores to the previous snapshot. The comparison includes per-dimension deltas, overall score change, and newly identified opportunities. Results are stored as a new `context_snapshot` entry, maintaining the full history for trend visualization.

### 4. Data Flow

```
Trigger: milestone_completed OR manual re-analyze click
    |
    v
Edge Function: opportunity-analysis
    |
    +--> Load latest context_snapshot for project
    +--> Load current project state:
    |       projects     --> status, active phase
    |       tasks        --> completion metrics
    |       milestones   --> completed milestones
    |       systems      --> implemented vs. planned
    |
    +--> Construct enriched context (wizard data + project data)
    +--> Call readiness-score agent (POST /readiness-score)
    |       with flag: { mode: 're-assessment', previousScore: N }
    |
    +--> Receive new ReadinessScoreResult
    +--> Compute delta report:
    |       overall_change: new.overallScore - previous.overallScore
    |       dimension_deltas: per-dimension changes
    |       new_opportunities: opportunities not in previous snapshot
    |       regressions: dimensions that decreased
    |
    +--> Store new context_snapshot
    +--> Update AI insights dashboard cache
    +--> Notify client of new insights (if significant change)
    +--> Log to ai_run_logs and activities
```

### 5. Design Considerations

Re-assessments should not run too frequently — a minimum interval of 7 days between automated re-assessments prevents noise. Manual re-analysis is always allowed regardless of interval. The delta report must handle the case where scoring methodology changes between versions (the snapshot stores the agent version). Score changes of less than 3 points are labeled "stable" to avoid false improvement/regression signals. Significant improvements (>10 points overall) trigger a celebration notification and potential system upgrade suggestion.

---

## Workflow Specification

### Step-by-Step Logic

| Step | Action                              | Condition                    | Details                                          |
| ---- | ----------------------------------- | ---------------------------- | ------------------------------------------------ |
| 1    | Receive trigger event               | Milestone or manual          | Extract project_id                               |
| 2    | Load previous snapshot              | context_snapshots exists     | Most recent snapshot for project                 |
| 3    | Check re-assessment interval        | Last snapshot > 7 days ago   | Skip if too recent (automated only)              |
| 4    | Collect current project state       | Always                       | Tasks, milestones, implemented systems           |
| 5    | Construct enriched context          | Always                       | Merge wizard data + current project data         |
| 6    | Call readiness-score agent          | Always                       | With mode='re-assessment'                        |
| 7    | Compute delta report                | Previous snapshot exists     | Per-dimension comparison                         |
| 8    | Identify new opportunities          | Always                       | Systems not yet implemented that fit             |
| 9    | Store new context_snapshot          | Always                       | With delta data included                         |
| 10   | Generate notification               | Delta > 5 points             | Notify client of change                          |
| 11   | Suggest system upgrade              | Delta > 10 points            | Recommend next system from original ranking      |
| 12   | Log events                          | Always                       | ai_run_logs + activities                         |

---

## Input Schema

```typescript
interface OpportunityAnalysisInput {
  projectId: string;
  triggeredBy: 'milestone_completed' | 'manual' | 'scheduled';
  milestoneId?: string;           // If triggered by milestone
  forceRerun?: boolean;           // Override interval check
}
```

---

## Output Schema

```typescript
interface OpportunityAnalysisResult {
  snapshotId: string;              // New context_snapshot ID
  currentScore: number;            // New overall readiness score
  previousScore: number;           // Previous snapshot score
  overallDelta: number;            // Change in overall score
  dimensionDeltas: Array<{
    dimension: string;
    previousScore: number;
    currentScore: number;
    delta: number;
    trend: 'improved' | 'regressed' | 'stable';  // stable = |delta| < 3
  }>;
  newOpportunities: Array<{
    systemId: string;
    reason: string;                // Why this is now relevant
    fitScoreDelta: number;         // How fit score changed
  }>;
  regressions: Array<{
    area: string;
    description: string;
    suggestedAction: string;
  }>;
  systemUpgradeSuggestion?: {
    systemId: string;
    rationale: string;
  };
  narrative: string;               // 3-5 sentence summary of changes
}
```

---

## Data Sources

| Source               | Table                   | Usage                                         |
| -------------------- | ----------------------- | --------------------------------------------- |
| Previous snapshots   | `context_snapshots`     | Baseline for comparison                        |
| Wizard data          | `wizard_answers`        | Original analysis context                      |
| Project state        | `projects`              | Current phase, status                          |
| Task metrics         | `tasks`                 | Completion rates, velocity                     |
| Milestones           | `milestones`            | Completed vs. planned                          |
| Implemented systems  | `project_services`      | Which systems are active                       |
| System catalog       | `systems`               | For upgrade suggestions                        |

---

## Trigger Events

| Trigger                          | Source                              | Timing                       |
| -------------------------------- | ----------------------------------- | ---------------------------- |
| Milestone completed              | `milestones.status` = 'completed'   | Immediate (if interval met)  |
| Manual re-analyze                | Dashboard button click              | Immediate (always)           |
| Quarterly scheduled              | Cron (first of quarter)             | Scheduled                    |

---

## Edge Cases

| Scenario                              | Handling                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------- |
| No previous snapshot exists           | Treat wizard baseline as previous; still compute current score           |
| Re-assessment within 7-day interval   | Skip automated; allow manual with `forceRerun=true`                      |
| Project has no completed milestones   | Run assessment with current data; delta will be minimal                  |
| Readiness agent fails                 | Return error; keep previous snapshot as current                          |
| Score decreased significantly (>15)   | Flag for consultant review; do not auto-notify client                    |
| All systems already implemented       | Focus on optimization opportunities rather than new systems              |
| Wizard data no longer available       | Use most recent snapshot as context instead                              |
| Multiple milestones complete at once  | Single re-assessment run; batch milestones in trigger                    |
| Agent version changed since last snap | Note version mismatch in snapshot metadata; qualify delta accordingly    |

---

## Database Operations

### Read: Latest context snapshot

```sql
SELECT * FROM context_snapshots
WHERE project_id = $projectId AND snapshot_type = 'readiness-assessment'
ORDER BY created_at DESC
LIMIT 1;
```

### Read: Current project state

```sql
SELECT
  p.*,
  (SELECT count(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'completed') as completed_tasks,
  (SELECT count(*) FROM tasks t WHERE t.project_id = p.id) as total_tasks,
  (SELECT count(*) FROM milestones m WHERE m.project_id = p.id AND m.status = 'completed') as completed_milestones,
  (SELECT json_agg(ps.service_id) FROM project_services ps WHERE ps.project_id = p.id) as active_services
FROM projects p
WHERE p.id = $projectId;
```

### Write: context_snapshots

```sql
INSERT INTO context_snapshots (project_id, snapshot_type, data, metadata, created_at)
VALUES ($projectId, 'readiness-assessment', $scoreResult, $deltaMetadata, now())
RETURNING id;
```

### Write: activities

```sql
INSERT INTO activities (entity_type, entity_id, action, data, created_at)
VALUES ('project', $projectId, 'readiness_reassessed', $deltaData, now());
```

---

## Outcomes

| Outcome                          | Metric                                | Target                 |
| -------------------------------- | ------------------------------------- | ---------------------- |
| Re-assessment frequency          | Assessments per project per quarter   | >= 2                   |
| Score improvement tracking       | Projects showing score improvement    | > 70% after 3 months  |
| Delta accuracy                   | Delta correlates with actual progress | r > 0.5               |
| Client engagement with insights  | Insights dashboard views after notify | > 50% open rate        |
| System upgrade conversion        | Upgrade suggestions accepted          | > 20%                  |
| Snapshot history completeness    | Projects with >= 3 snapshots          | > 60% after 6 months  |
| Re-assessment latency            | P95 end-to-end                        | < 15 seconds           |
