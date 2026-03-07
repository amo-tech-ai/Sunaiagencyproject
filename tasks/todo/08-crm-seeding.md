# P7: CRM Data Seeding

> **Priority:** LOW -- CRM tables exist with proper schema/RLS but have 0 rows
> **Depends on:** P0 (auth), P3 (dashboard pages)
> **Est:** ~1 hour

---

## Status

| Table | Schema | RLS | Rows | Status |
|-------|--------|-----|------|--------|
| `crm_pipelines` | Full | Full CRUD | 0 | Needs seed |
| `crm_stages` | Full | Full CRUD | 0 | Needs seed |
| `crm_deals` | Full | Full CRUD | 0 | Needs seed |
| `crm_contacts` | Full | Full CRUD | 0 | Needs seed |
| `crm_interactions` | Full | Full CRUD | 0 | Needs seed |

---

## Implementation

### Step 1: Create seed migration

**Create:** `supabase/migrations/YYYYMMDD_seed_crm.sql`

```sql
-- Default CRM pipeline with standard stages
INSERT INTO crm_pipelines (id, name, description, org_id) VALUES
  (gen_random_uuid(), 'Sales Pipeline', 'Default sales pipeline', (SELECT org_id FROM team_members LIMIT 1));

-- Standard stages (reference the pipeline above)
WITH pipeline AS (SELECT id FROM crm_pipelines WHERE name = 'Sales Pipeline' LIMIT 1)
INSERT INTO crm_stages (id, pipeline_id, name, position, color) VALUES
  (gen_random_uuid(), (SELECT id FROM pipeline), 'Lead', 0, '#94a3b8'),
  (gen_random_uuid(), (SELECT id FROM pipeline), 'Qualified', 1, '#60a5fa'),
  (gen_random_uuid(), (SELECT id FROM pipeline), 'Proposal', 2, '#fbbf24'),
  (gen_random_uuid(), (SELECT id FROM pipeline), 'Negotiation', 3, '#f97316'),
  (gen_random_uuid(), (SELECT id FROM pipeline), 'Won', 4, '#22c55e'),
  (gen_random_uuid(), (SELECT id FROM pipeline), 'Lost', 5, '#ef4444');
```

### Step 2: Verify PipelinePage renders stages

After seeding, the CRM Pipeline dashboard page (P3 Task 1) should display the Kanban columns.

---

## Notes

- Seed data should use the existing org from `team_members` (8 rows exist)
- No demo deals/contacts needed -- users create their own
- The default pipeline + stages are enough to make the UI functional
