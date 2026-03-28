---
id: 067-health-check-cron
diagram_id: WORKFLOW-04
prd_section: Workflow Automation
title: Client health check CRON — weekly automated health scoring
skill: backend
phase: MEDIUM
priority: P2
status: Not Started
owner: Backend
dependencies:
  - 056-crm-system-architecture
  - 043-journey-performance-monitoring
estimated_effort: M
percent_complete: 0
area: agency-dashboard
schema_tables: [clients, projects, tasks, milestones, activities, crm_deals]
figma_prompt: prompts/067-health-check-cron.md
---

# 067 — Client Health Check CRON

## Summary Table

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| Workflow ID        | WORKFLOW-04                                                  |
| Name               | Weekly Client Health Scoring                                 |
| Type               | Scheduled CRON (pg_cron or Supabase cron)                    |
| Schedule           | Every Sunday 6:00 AM UTC                                     |
| Scope              | All active clients with at least 1 active project            |
| Tables Read        | `clients`, `projects`, `tasks`, `milestones`, `activities`, `crm_deals` |
| Tables Written     | `clients.health_score`, `activities`                         |
| Dashboard Impact   | Client health badges, risk alerts                            |

---

## Description

### 1. Purpose

Automatically calculate a health score (0-100) for each active client every week. The score aggregates task velocity, milestone adherence, engagement frequency, and financial standing. Low-scoring clients trigger alerts for consultant follow-up.

### 2. Health Score Algorithm

```typescript
function calculateClientHealth(metrics: ClientMetrics): number {
  let score = 0;

  // Task velocity (25%) — are tasks being completed on schedule?
  const velocityRatio = metrics.tasksCompletedThisWeek / Math.max(metrics.tasksPlannedThisWeek, 1);
  score += Math.min(velocityRatio * 25, 25);

  // Milestone adherence (25%) — are milestones being hit on time?
  const onTimeRate = metrics.milestonesOnTime / Math.max(metrics.totalMilestones, 1);
  score += onTimeRate * 25;

  // Engagement (25%) — is the client active?
  const daysSinceLastActivity = metrics.daysSinceLastClientActivity;
  if (daysSinceLastActivity <= 2) score += 25;
  else if (daysSinceLastActivity <= 7) score += 15;
  else if (daysSinceLastActivity <= 14) score += 5;
  // else 0

  // Financial (25%) — are invoices being paid?
  const paidRate = metrics.invoicesPaid / Math.max(metrics.totalInvoices, 1);
  score += paidRate * 25;

  return Math.round(score);
}
```

### 3. Alert Thresholds

| Score Range | Status | Action |
|-------------|--------|--------|
| 80-100 | Healthy | No action |
| 60-79 | At Risk | Notify consultant |
| 40-59 | Unhealthy | Notify consultant + manager |
| 0-39 | Critical | Notify consultant + manager + schedule call |

### 4. Implementation Options

**Option A: pg_cron (recommended)**
```sql
SELECT cron.schedule('weekly-health-check', '0 6 * * 0',
  $$SELECT net.http_post(
    'https://necxcwhuzylsumlkkmlk.supabase.co/functions/v1/health-check',
    '{}', '{}'::jsonb,
    headers := '{"Authorization": "Bearer <service_role_key>"}'::jsonb
  )$$
);
```

**Option B: Edge function with Supabase cron**
- Create `health-check` edge function
- Configure via Supabase Dashboard > Database > Cron Jobs

---

## Data Queries

### Aggregate per client

```sql
SELECT
  c.id AS client_id,
  count(t.*) FILTER (WHERE t.status = 'completed' AND t.updated_at >= now() - interval '7 days') AS tasks_completed_week,
  count(t.*) FILTER (WHERE t.due_date BETWEEN now() - interval '7 days' AND now()) AS tasks_planned_week,
  count(m.*) FILTER (WHERE m.status = 'completed' AND m.completed_at <= m.due_date) AS milestones_on_time,
  count(m.*) AS total_milestones,
  EXTRACT(EPOCH FROM now() - max(a.created_at)) / 86400 AS days_since_activity
FROM clients c
JOIN projects p ON p.client_id = c.id AND p.status = 'active'
LEFT JOIN tasks t ON t.project_id = p.id
LEFT JOIN milestones m ON m.project_id = p.id
LEFT JOIN activities a ON a.entity_id = c.id::text AND a.entity_type = 'client'
GROUP BY c.id;
```

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Client with no projects | Skip — not scored |
| Client with 0 tasks | Score based on available metrics only |
| CRON fires twice | Check last health_score timestamp; skip if < 12h ago |
| Health check edge function timeout | Process clients in batches of 20 |

---

## Verification

- Check `clients.health_score` updated for all active clients
- Check `activities` log entries for `health_check_completed`
- Verify alerts sent for scores < 60
- Confirm CRON schedule in `cron.job` table
