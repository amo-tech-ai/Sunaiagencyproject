---
id: 068-stale-deal-alerts
diagram_id: WORKFLOW-05
prd_section: Workflow Automation
title: Stale deal alerts — flag CRM deals inactive for 14+ days
skill: backend
phase: MEDIUM
priority: P2
status: Not Started
owner: Backend
dependencies:
  - 028-crm-pipeline-dashboard
  - 049-workflow-lead-qualification
estimated_effort: S
percent_complete: 0
area: agency-dashboard
schema_tables: [crm_deals, crm_stages, activities, team_members]
figma_prompt: prompts/068-stale-deal-alerts.md
---

# 068 — Stale Deal Alerts

## Summary Table

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| Workflow ID        | WORKFLOW-05                                                  |
| Name               | Stale Deal Alert System                                      |
| Type               | Scheduled CRON                                               |
| Schedule           | Daily 8:00 AM UTC                                            |
| Scope              | All open CRM deals (not won/lost/archived)                   |
| Tables Read        | `crm_deals`, `crm_stages`, `activities`                      |
| Tables Written     | `crm_deals.metadata`, `activities`                           |
| Dashboard Impact   | Pipeline board warning badges, notification bell             |

---

## Description

### 1. Purpose

Automatically detect CRM deals that have had no activity for 14+ days and flag them for follow-up. Prevents deals from silently going cold in the pipeline. Different thresholds apply based on deal stage.

### 2. Staleness Thresholds

| Stage | Days Without Activity | Action |
|-------|----------------------|--------|
| New Lead | 3 days | Flag as stale, notify owner |
| Qualified | 7 days | Flag as stale, notify owner |
| Proposal | 14 days | Flag as stale, notify owner + manager |
| Negotiation | 14 days | Flag as stale, escalate to manager |
| Any stage | 30 days | Auto-archive with reason "stale" |

### 3. Detection Query

```sql
SELECT d.id, d.title, s.name AS stage, d.owner_id,
  EXTRACT(EPOCH FROM now() - COALESCE(
    (SELECT max(a.created_at) FROM activities a
     WHERE a.entity_id = d.id::text AND a.entity_type = 'deal'),
    d.updated_at
  )) / 86400 AS days_inactive
FROM crm_deals d
JOIN crm_stages s ON s.id = d.stage_id
WHERE d.status NOT IN ('won', 'lost', 'archived')
  AND COALESCE(
    (SELECT max(a.created_at) FROM activities a
     WHERE a.entity_id = d.id::text AND a.entity_type = 'deal'),
    d.updated_at
  ) < now() - interval '3 days';
```

### 4. Actions

For each stale deal:
1. Update `crm_deals.metadata` with `stale_since`, `stale_notified_at`
2. Insert `activities` event: `deal_stale_flagged`
3. Send in-app notification to deal owner
4. If escalation needed, notify manager too
5. At 30 days: set `status = 'archived'`, log reason

---

## Implementation

**Option A: pg_cron + SQL function** (simplest)
```sql
SELECT cron.schedule('stale-deal-check', '0 8 * * *', $$
  SELECT check_stale_deals();
$$);
```

**Option B: Edge function** (if notifications need external delivery)

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Deal already flagged stale | Don't re-notify within 7 days |
| Deal owner left team | Notify org admin instead |
| Deal has future follow-up scheduled | Not stale — check activities for scheduled events |
| Bulk deal import | Skip staleness check for 7 days after import |

---

## Verification

- Create a test deal, wait 3+ days (or backdate `updated_at`)
- Run CRON manually
- Verify `activities` event logged
- Verify notification sent
- Verify deal with 30+ days inactivity gets archived
