---
id: 048-agent-reporting
diagram_id: AGENT-05
prd_section: AI Agents
title: Reporting agent — automated summary generation and client reports
skill: ai-agents
phase: MEDIUM
priority: P2
status: Not Started
owner: Backend
dependencies:
  - 047-agent-readiness-scoring
  - 025-dashboard-overview
estimated_effort: M
percent_complete: 0
area: ai-agents
wizard_step: null
schema_tables: [projects, tasks, milestones, activities, wizard_answers, ai_run_logs, documents, invoices]
edge_function: generate-report
figma_prompt: prompts/048-agent-reporting.md
---

# 048 — Reporting Agent

## Summary Table

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| Agent ID           | AGENT-05                                                     |
| Name               | Reporting Agent                                              |
| Edge Function      | `POST /generate-report`                                      |
| Model              | `gemini-3-flash-preview` (fast generation)                         |
| Wizard Step        | N/A — post-wizard, dashboard context                         |
| Trigger            | Scheduled (weekly cron), on-demand (button), event-based     |
| Input              | Report type, project/org ID, date range                      |
| Output             | Structured report with sections, metrics, recommendations    |
| Storage            | `documents` table                                            |
| Logging            | `ai_run_logs` — `agent_name='generate-report'`              |
| Downstream         | Client dashboard, email delivery, workflow 054               |
| Priority           | P2 MEDIUM                                                    |

---

## Description

### 1. Purpose

The Reporting Agent generates automated reports — weekly progress summaries, phase completion reports, quarterly business reviews, and executive briefings. It aggregates data from projects, tasks, milestones, activities, and wizard analysis to produce human-readable summaries with metrics, highlights, risk flags, and recommendations. This agent reduces the manual effort of preparing client-facing reports from hours to seconds while maintaining consistency and data accuracy.

### 2. User Context

Two audiences consume these reports. Agency consultants use them to prepare for client meetings and track multiple projects efficiently. Clients receive them as progress updates on their AI implementation journey. The reports must be professional, data-driven, and action-oriented. They should celebrate wins (completed milestones, improved scores), flag risks (overdue tasks, budget concerns), and recommend next steps. The tone should match the Sun AI brand — confident, clear, consultative.

### 3. Technical Approach

The edge function `generate-report` accepts a report type and scope (project or organization), then queries relevant tables to assemble raw data. This data is passed to `callGemini()` with a report-type-specific prompt template. The agent uses `gemini-3-flash-preview` because report generation is primarily summarization and formatting — it doesn't require deep reasoning. The generated report is stored in the `documents` table with metadata and optionally triggers email delivery.

### 4. Data Flow

```
Trigger (cron / button / event)
    |
    v
Edge Function: generate-report
    |
    +--> Determine report type and scope
    +--> Query data sources:
    |       projects   --> status, phases, budget
    |       tasks      --> completion rates, overdue count
    |       milestones --> on-time delivery rate
    |       activities --> recent engagement events
    |       invoices   --> financial summary
    |       wizard_answers --> original analysis context
    |       ai_run_logs    --> AI usage statistics
    |
    +--> Construct prompt with report template
    +--> Call callGemini() [gemini-3-flash-preview]
    +--> Parse structured report
    +--> Store in documents table
    +--> Log to ai_run_logs
    +--> Return report (or trigger email delivery)
```

### 5. Design Considerations

Reports are stored as structured JSON in `documents` to support both web rendering and future PDF generation. Each report type has a different template and data requirements: weekly summaries focus on task velocity and blockers, phase completions focus on deliverables and outcomes, quarterly reviews focus on ROI and strategic alignment, and executive briefs focus on high-level metrics and decisions needed. The agent includes a `confidenceScore` field indicating how much data was available — sparse data produces lower confidence and appropriate caveats.

---

## Agent Specification

### System Prompt Templates

**Weekly Summary:**
```
You are a project management AI for an AI consulting agency. Generate a professional weekly progress report.

PROJECT DATA:
{projectData}

TASK METRICS:
{taskMetrics}

ACTIVITY LOG:
{recentActivities}

Structure the report as:
1. Executive Summary (3-4 sentences)
2. Key Metrics (tasks completed, milestones hit, budget status)
3. Highlights (what went well)
4. Risks & Blockers (what needs attention)
5. Next Week Priorities (top 3-5 items)
6. Recommendations (strategic suggestions)

Tone: Professional, consultative, data-driven. Use specific numbers.
Output MUST be valid JSON matching the provided schema.
```

**Phase Completion:**
```
You are a project management AI. Generate a phase completion report summarizing deliverables, outcomes, and transition to the next phase.
...
```

**Quarterly Review:**
```
You are a business analytics AI. Generate a quarterly business review covering ROI, strategic progress, and forward-looking recommendations.
...
```

**Executive Brief:**
```
You are an executive communications AI. Generate a concise executive briefing highlighting decisions needed and key metrics.
...
```

### Model Configuration

| Parameter        | Value                |
| ---------------- | -------------------- |
| Model            | `gemini-3-flash-preview`   |
| Temperature      | 0.3                  |
| Max Tokens       | 4096                 |
| Response Format  | JSON                 |
| Thinking Mode    | Off (fast)           |

---

## Input Schema

```typescript
interface GenerateReportInput {
  reportType: 'weekly_summary' | 'phase_completion' | 'quarterly_review' | 'executive_brief';
  scope: {
    projectId?: string;        // Single project report
    orgId?: string;            // Organization-wide report
  };
  dateRange?: {
    start: string;             // ISO date
    end: string;               // ISO date
  };
  triggeredBy: 'cron' | 'manual' | 'event';
  eventContext?: {             // Only for event-triggered reports
    eventType: string;         // e.g., "phase_completed"
    eventData: Record<string, unknown>;
  };
}
```

**Validation Rules:**
- `reportType` must be one of the four allowed values.
- Either `projectId` or `orgId` must be provided in `scope`.
- `dateRange` defaults to last 7 days for weekly, last 90 days for quarterly.
- `triggeredBy` determines notification behavior.

---

## Output Schema

```typescript
interface ReportResult {
  reportId: string;              // UUID, stored as document ID
  reportType: string;
  generatedAt: string;           // ISO timestamp
  confidenceScore: number;       // 0-1, based on data completeness
  sections: Array<{
    title: string;
    content: string;             // Markdown-formatted content
    metrics?: Array<{
      label: string;
      value: string | number;
      trend?: 'up' | 'down' | 'flat';
      context?: string;
    }>;
  }>;
  highlights: string[];          // Top 3-5 highlights
  risks: Array<{
    description: string;
    severity: 'high' | 'medium' | 'low';
    suggestedAction: string;
  }>;
  recommendations: string[];    // 2-4 strategic recommendations
  metadata: {
    dataPointsAnalyzed: number;
    periodCovered: string;
    projectName?: string;
    orgName?: string;
  };
}
```

---

## Data Sources

| Source              | Table                   | Usage                                       |
| ------------------- | ----------------------- | ------------------------------------------- |
| Project status      | `projects`              | Phase, status, budget, timeline              |
| Task metrics        | `tasks`                 | Completion rates, overdue count, velocity    |
| Milestones          | `milestones`            | On-time delivery, upcoming deadlines         |
| Deliverables        | `deliverables`          | Completed deliverables this period           |
| Activities          | `activities`            | Engagement events, interaction history       |
| Invoices            | `invoices`              | Financial data for budget tracking           |
| Wizard analysis     | `wizard_answers`        | Original company context for recommendations |
| AI usage            | `ai_run_logs`           | AI agent usage statistics                    |
| Previous reports    | `documents`             | Comparison to previous period                |

---

## Trigger Events

| Trigger                     | Condition                                   | Action                             |
| --------------------------- | ------------------------------------------- | ---------------------------------- |
| Weekly cron                 | Every Sunday at 9:00 AM UTC                 | Generate weekly summary for all active projects |
| Phase completed             | `roadmap_phases.status` = 'completed'       | Generate phase completion report   |
| Quarterly cron              | First Monday of each quarter                | Generate quarterly review          |
| Manual button click         | User clicks "Generate Report" in dashboard  | Generate requested report type     |
| Executive brief request     | Agency owner requests via dashboard         | Generate executive brief           |

---

## Edge Cases

| Scenario                              | Handling                                                                   |
| ------------------------------------- | -------------------------------------------------------------------------- |
| No tasks completed this period        | Report acknowledges; focuses on planning and upcoming work                 |
| Project just started (< 1 week)       | Generate abbreviated report with setup milestones only                     |
| No financial data available           | Omit financial sections; note "Financial data pending"                     |
| Multiple projects for org report      | Aggregate across projects; include per-project breakdown                   |
| Gemini timeout                        | Return data-only report (metrics without narrative) as fallback            |
| Very large activity log (>500 items)  | Summarize top 50 most significant activities; note total count             |
| No previous report for comparison     | Skip trend analysis; note "Baseline report — trends available next period" |
| Conflicting data (task done but milestone pending) | Flag inconsistency in risks section                           |

---

## Database Operations

### Read: Project data

```sql
SELECT p.*,
  (SELECT count(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'completed' AND t.updated_at >= $startDate) as tasks_completed,
  (SELECT count(*) FROM tasks t WHERE t.project_id = p.id AND t.status != 'completed' AND t.due_date < now()) as tasks_overdue,
  (SELECT count(*) FROM milestones m WHERE m.project_id = p.id AND m.status = 'completed' AND m.updated_at >= $startDate) as milestones_hit
FROM projects p
WHERE p.id = $projectId;
```

### Read: Recent activities

```sql
SELECT * FROM activities
WHERE project_id = $projectId AND created_at >= $startDate
ORDER BY created_at DESC
LIMIT 50;
```

### Write: documents (store report)

```sql
INSERT INTO documents (id, project_id, org_id, title, document_type, content, metadata, created_at)
VALUES ($reportId, $projectId, $orgId, $title, $reportType, $reportJson, $metadata, now());
```

### Write: ai_run_logs

```sql
INSERT INTO ai_run_logs (agent_name, session_id, model, input_tokens, output_tokens, latency_ms, status, created_at)
VALUES ('generate-report', $projectId, 'gemini-3-flash-preview', $inputTokens, $outputTokens, $latencyMs, $status, now());
```

---

## Outcomes

| Outcome                          | Metric                                | Target                |
| -------------------------------- | ------------------------------------- | --------------------- |
| Report generation success        | Reports generated without error       | > 98%                 |
| Response latency                 | P95 latency                           | < 6 seconds           |
| Report quality                   | Consultant satisfaction (1-5 rating)  | > 4.0                 |
| Time saved                       | Manual report prep time eliminated    | > 2 hours per week    |
| Client engagement                | Reports opened by clients             | > 60%                 |
| Data accuracy                    | Metrics match raw data                | 100%                  |
| Report frequency                 | Weekly reports generated on schedule  | > 95%                 |
