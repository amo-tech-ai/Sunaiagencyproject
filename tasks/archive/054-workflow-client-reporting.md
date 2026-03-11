---
id: 054-workflow-client-reporting
diagram_id: WORKFLOW-06
prd_section: Workflow Automation
title: Client reporting workflow — automated progress reports and business reviews
skill: backend
phase: LOW
priority: P3
status: Not Started
owner: Backend
dependencies:
  - 048-agent-reporting
  - 033-financial-dashboard
estimated_effort: M
percent_complete: 0
area: agency-dashboard
schema_tables: [projects, tasks, milestones, activities, invoices, ai_run_logs, wizard_answers, documents]
figma_prompt: prompts/054-workflow-client-reporting.md
---

# 054 — Client Reporting Workflow

## Summary Table

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| Workflow ID        | WORKFLOW-06                                                  |
| Name               | Client Reporting Workflow                                    |
| Type               | Scheduled + event-driven + on-demand                         |
| Triggers           | Weekly cron (Sunday 9 AM), phase completed, manual button    |
| Scope              | Data aggregation through report delivery                     |
| Tables Modified    | `documents`, `activities`                                    |
| AI Dependency      | Calls reporting agent (048) for narrative generation          |
| Dashboard Impact   | Reports section, notification bell, email delivery           |
| Priority           | P3 LOW                                                       |

---

## Description

### 1. Purpose

The Client Reporting Workflow orchestrates the complete report lifecycle — from data aggregation through AI-generated narrative to delivery. It coordinates the reporting agent (048) with data collection, document storage, optional PDF generation, email delivery, and activity logging. While the reporting agent handles the AI generation, this workflow handles the "when," "what data," and "how to deliver" aspects. It supports four report types: weekly summaries, phase completion reports, quarterly business reviews, and executive briefs.

### 2. User Context

Agency consultants no longer need to manually prepare client reports. Every Sunday morning, each active project's weekly summary is automatically generated and emailed to the client contact with a link to view the full report on the dashboard. When a phase completes, a detailed phase report is generated highlighting deliverables, outcomes, and the transition plan for the next phase. Quarterly business reviews aggregate 3 months of data into strategic insights. Executive briefs provide quick snapshots for leadership. Clients can also access all historical reports from their dashboard's reports section.

### 3. Technical Approach

The workflow is implemented as an orchestration layer that sits above the reporting agent. For scheduled reports, a Supabase cron job fires at the configured time and fans out across all active projects. For event-driven reports, a database webhook on `roadmap_phases.status = 'completed'` triggers phase reports. For on-demand reports, a dashboard API endpoint accepts report requests. In all cases, the workflow: (1) collects relevant data from multiple tables, (2) calls the reporting agent with structured input, (3) stores the result as a document, (4) optionally generates a PDF, (5) delivers via email, and (6) logs all events.

### 4. Data Flow

```
TRIGGER (cron / event / manual)
    |
    v
Orchestrator: report-workflow
    |
    +--> Determine report type and scope
    +--> Determine recipients (client contacts, consultants)
    |
    +--> AGGREGATE DATA:
    |       projects     --> status, phase, budget, timeline
    |       tasks        --> completed, overdue, velocity, by assignee
    |       milestones   --> hit/missed, upcoming
    |       activities   --> engagement, key events
    |       invoices     --> spend, outstanding, budget remaining
    |       ai_run_logs  --> AI usage stats, cost
    |       wizard_answers --> original context for strategic framing
    |       documents    --> previous report for comparison
    |
    +--> CALL REPORTING AGENT (POST /generate-report)
    |       Input: report type + aggregated data
    |       Output: structured report JSON
    |
    +--> STORE REPORT
    |       documents table: title, type, content (JSON), metadata
    |
    +--> GENERATE PDF (optional)
    |       Render report to HTML --> PDF
    |       Upload to Supabase Storage
    |       Link in documents.metadata.pdf_url
    |
    +--> DELIVER REPORT
    |       Email to client contacts
    |       In-app notification with link
    |
    +--> LOG EVENTS
            activities: 'report_generated', 'report_delivered'
```

### 5. Design Considerations

The workflow must handle multiple projects efficiently during scheduled runs — if there are 50 active projects, 50 weekly reports fire in sequence (not parallel, to avoid overwhelming the AI agent). Each report is independent; a failure for one project should not block others. The PDF generation is optional and async — the report is available in the dashboard immediately, with PDF following within minutes. Email delivery uses a queue to handle rate limits. Previous reports are loaded for comparison to enable "vs. last week" metrics. The cron schedule (Sunday 9 AM UTC) ensures reports are ready for Monday morning review.

---

## Workflow Specification

### Report Type Configuration

| Report Type          | Trigger            | Schedule               | Data Window | Recipients              |
| -------------------- | ------------------ | ---------------------- | ----------- | ----------------------- |
| Weekly Summary       | Cron               | Sunday 9:00 AM UTC     | Last 7 days | Client + consultant     |
| Phase Completion     | Event              | On phase complete      | Phase duration | Client + consultant + PM |
| Quarterly Review     | Cron               | 1st Monday of quarter  | Last 90 days | Client + agency owner   |
| Executive Brief      | Manual             | On request             | Custom range | Specified recipients    |

### Step-by-Step Logic

| Step | Action                              | Details                                              |
| ---- | ----------------------------------- | ---------------------------------------------------- |
| 1    | Receive trigger                     | Cron fires, event detected, or API called            |
| 2    | Resolve scope                       | Which projects, which date range                     |
| 3    | For each project:                   | Sequential processing                                |
| 3a   | Aggregate task metrics              | Completed, created, overdue, velocity this period    |
| 3b   | Aggregate milestone data            | Hit, missed, upcoming in next period                 |
| 3c   | Aggregate activity data             | Key events, engagement metrics                       |
| 3d   | Aggregate financial data            | Invoices paid, outstanding, budget utilization        |
| 3e   | Load previous report                | For comparison metrics                               |
| 3f   | Load wizard context                 | Original analysis for strategic framing              |
| 4    | Call reporting agent                | POST /generate-report with all aggregated data       |
| 5    | Validate report output              | All sections present, metrics accurate               |
| 6    | Store in documents table            | JSON content, metadata, report type                  |
| 7    | Queue PDF generation (if enabled)   | Async: render HTML, convert to PDF, upload           |
| 8    | Queue email delivery                | To all configured recipients                         |
| 9    | Create in-app notification          | Link to report on dashboard                          |
| 10   | Log activity                        | 'report_generated' with metadata                     |

### Data Aggregation Queries

**Task Metrics:**
```typescript
interface TaskMetrics {
  tasksCompletedThisPeriod: number;
  tasksCreatedThisPeriod: number;
  tasksCurrentlyOverdue: number;
  taskVelocity: number;            // tasks completed per week
  completionRate: number;           // completed / total (%)
  averageCompletionTime: number;    // days from created to completed
  tasksByStatus: Record<string, number>;
  tasksByAssignee: Array<{ name: string; completed: number; inProgress: number }>;
}
```

**Milestone Metrics:**
```typescript
interface MilestoneMetrics {
  milestonesHitThisPeriod: number;
  milestonesMissedThisPeriod: number;
  upcomingMilestones: Array<{ title: string; dueDate: string; progress: number }>;
  onTimeDeliveryRate: number;       // %
}
```

**Financial Metrics:**
```typescript
interface FinancialMetrics {
  totalBudget: number;
  spentToDate: number;
  budgetUtilization: number;        // %
  invoicesPaidThisPeriod: number;
  invoicesOutstanding: number;
  projectedBudgetAtCompletion: number;
}
```

---

## Input Schema

```typescript
interface ClientReportingInput {
  reportType: 'weekly_summary' | 'phase_completion' | 'quarterly_review' | 'executive_brief';
  scope: {
    projectId?: string;        // Single project
    orgId?: string;            // All org projects
  };
  dateRange?: {
    start: string;             // ISO date — defaults based on report type
    end: string;               // ISO date — defaults to now()
  };
  triggeredBy: 'cron' | 'event' | 'manual';
  options?: {
    generatePdf: boolean;      // Default: true for quarterly, false for weekly
    sendEmail: boolean;        // Default: true
    recipients?: string[];     // Override default recipients
    includeFinancials: boolean;// Default: true for quarterly/exec, false for weekly
  };
  eventContext?: {
    phaseId?: string;          // For phase completion reports
    eventType?: string;
  };
}
```

---

## Output Schema

```typescript
interface ClientReportingResult {
  reportId: string;              // Document ID
  projectId: string;
  reportType: string;
  status: 'generated' | 'delivered' | 'failed';
  documentUrl: string;           // Dashboard link to report
  pdfUrl?: string;               // Supabase Storage URL (if generated)
  delivery: {
    emailsSent: number;
    emailsFailed: number;
    notificationsSent: number;
    recipients: string[];
  };
  metrics: {
    dataPointsAnalyzed: number;
    generationTimeMs: number;
    reportSections: number;
  };
  errors?: string[];             // Any non-fatal errors during generation
}
```

---

## Data Sources

| Source               | Table                   | Usage                                         |
| -------------------- | ----------------------- | --------------------------------------------- |
| Project details      | `projects`              | Status, phase, budget, timeline               |
| Task metrics         | `tasks`                 | Completion rates, velocity, overdue            |
| Milestones           | `milestones`            | On-time delivery, upcoming deadlines          |
| Activities           | `activities`            | Engagement, key events this period            |
| Financial data       | `invoices`, `payments`  | Budget tracking, spend analysis               |
| AI usage             | `ai_run_logs`           | Agent calls, costs, performance               |
| Wizard context       | `wizard_answers`        | Original analysis for strategic framing       |
| Previous reports     | `documents`             | Comparison to last period                     |
| Client contacts      | `clients`, `crm_contacts` | Email recipients                           |
| Team assignments     | `team_members`          | Consultant and PM for notification            |

---

## Trigger Events

| Trigger                          | Source                              | Timing                           |
| -------------------------------- | ----------------------------------- | -------------------------------- |
| Weekly cron                      | Supabase cron job                   | Sunday 9:00 AM UTC               |
| Phase completed                  | `roadmap_phases.status` = completed | Immediate (via Chain 3 of 053)   |
| Quarterly cron                   | Supabase cron job                   | First Monday of Q1/Q2/Q3/Q4      |
| Manual request                   | Dashboard "Generate Report" button  | On-demand                        |
| Project completed                | `projects.status` = 'completed'     | Final summary report             |

---

## Edge Cases

| Scenario                              | Handling                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------- |
| No tasks completed this period        | Report states "Planning phase — no deliverables this period"             |
| Project started < 7 days ago          | Abbreviated weekly: onboarding status only                               |
| No financial data (invoices empty)    | Omit financial section; note "Financial tracking pending"                |
| 50+ projects on cron run              | Sequential processing with 2s delay between; total run < 5 min          |
| Reporting agent fails for 1 project   | Log error; continue to next project; retry failed projects at end        |
| Email delivery fails                  | Queue for retry (3 attempts, exponential backoff); report still in docs  |
| PDF generation fails                  | Report available in dashboard; PDF queued for retry; notify admin        |
| No previous report for comparison     | Skip "vs. last period" metrics; note "Baseline report"                   |
| Client has no email on file           | Skip email; create in-app notification only; flag for admin              |
| Report content exceeds email size     | Send summary excerpt via email with "View full report" link              |
| Duplicate cron trigger                | Check documents for existing report with same date + type; skip if found |
| Project on hold (paused)              | Skip weekly reports; include in quarterly with pause explanation          |

---

## Database Operations

### Read: Aggregate task metrics

```sql
SELECT
  count(*) FILTER (WHERE status = 'completed' AND updated_at >= $startDate) as completed,
  count(*) FILTER (WHERE created_at >= $startDate) as created,
  count(*) FILTER (WHERE status != 'completed' AND due_date < now()) as overdue,
  count(*) as total,
  count(*) FILTER (WHERE status = 'completed')::float / NULLIF(count(*), 0) as completion_rate,
  avg(EXTRACT(EPOCH FROM (updated_at - created_at)) / 86400) FILTER (WHERE status = 'completed') as avg_days
FROM tasks
WHERE project_id = $projectId;
```

### Read: Milestone metrics

```sql
SELECT
  count(*) FILTER (WHERE status = 'completed' AND completed_at >= $startDate) as hit,
  count(*) FILTER (WHERE status != 'completed' AND due_date < now()) as missed,
  json_agg(json_build_object('title', title, 'due_date', due_date, 'progress', progress))
    FILTER (WHERE status != 'completed' AND due_date >= now()) as upcoming
FROM milestones
WHERE project_id = $projectId;
```

### Read: Financial data

```sql
SELECT
  COALESCE(sum(amount) FILTER (WHERE status = 'paid'), 0) as total_paid,
  COALESCE(sum(amount) FILTER (WHERE status = 'pending'), 0) as outstanding,
  COALESCE(sum(amount) FILTER (WHERE status = 'paid' AND paid_at >= $startDate), 0) as paid_this_period
FROM invoices
WHERE project_id = $projectId;
```

### Read: Previous report

```sql
SELECT * FROM documents
WHERE project_id = $projectId AND document_type = $reportType
ORDER BY created_at DESC
LIMIT 1;
```

### Write: Store report

```sql
INSERT INTO documents (id, project_id, org_id, title, document_type, content, metadata, created_at)
VALUES (
  $reportId,
  $projectId,
  $orgId,
  $title,
  $reportType,
  $reportContent,
  jsonb_build_object(
    'generated_by', 'report-workflow',
    'triggered_by', $triggeredBy,
    'date_range', jsonb_build_object('start', $startDate, 'end', $endDate),
    'pdf_url', $pdfUrl,
    'recipients', $recipients
  ),
  now()
);
```

### Write: Log activity

```sql
INSERT INTO activities (entity_type, entity_id, action, data, created_at)
VALUES ('project', $projectId, 'report_generated', jsonb_build_object(
  'report_id', $reportId,
  'report_type', $reportType,
  'recipients_count', $recipientCount
), now());
```

---

## Outcomes

| Outcome                          | Metric                                | Target                 |
| -------------------------------- | ------------------------------------- | ---------------------- |
| Weekly report generation         | Reports generated on schedule         | > 98%                  |
| Report delivery success          | Emails delivered successfully         | > 95%                  |
| Time savings                     | Manual report prep time eliminated    | > 2 hrs/week/project   |
| Client report open rate          | Reports opened within 48h             | > 60%                  |
| Report accuracy                  | Metrics match source data             | 100%                   |
| PDF generation success           | PDFs generated without error          | > 95%                  |
| Phase report timeliness          | Generated within 1h of phase complete | > 95%                  |
| Cron execution time              | Total batch run time                  | < 5 minutes            |
| Report satisfaction              | Client/consultant rating              | > 4.0 / 5.0            |
| Historical report retention      | Reports available for 12+ months      | 100%                   |
