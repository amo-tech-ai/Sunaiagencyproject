---
id: 019-data-integrity-constraints
diagram_id: CORE-DATA-01
prd_section: Database Schema
title: CHECK constraints, missing triggers, and vector dimension enforcement
skill: backend
phase: CORE
priority: P1
status: Done
owner: Backend
dependencies:
  - 017-security-hotfix-rls
  - 018-database-schema-crm-financial
estimated_effort: M
percent_complete: 100
---

## Objective
Add CHECK constraints to all text status/role fields, add missing `updated_at` triggers on 2 tables, and enforce vector dimensions to prevent data integrity issues before production data entry.

## Context (from audit 2026-03-07)
The audit found 0 CHECK constraints across all 31 tables. Status fields are unconstrained text columns — any value can be inserted. Two tables with `updated_at` columns (organizations, profiles) lack the `update_updated_at` trigger. Vector columns accept any dimension, risking embedding mismatches.

## Scope

### 1. CHECK Constraints for Status Fields

```sql
-- clients
ALTER TABLE clients ADD CONSTRAINT chk_clients_status
  CHECK (status IN ('active','inactive','prospect','churned'));
ALTER TABLE clients ADD CONSTRAINT chk_clients_lifecycle_stage
  CHECK (lifecycle_stage IN ('lead','prospect','onboarding','active','at_risk','churned'));
ALTER TABLE clients ADD CONSTRAINT chk_clients_pipeline_stage
  CHECK (pipeline_stage IN ('new','qualified','proposal','negotiation','closed_won','closed_lost'));

-- projects
ALTER TABLE projects ADD CONSTRAINT chk_projects_status
  CHECK (status IN ('draft','planning','active','on_hold','completed','cancelled'));

-- tasks
ALTER TABLE tasks ADD CONSTRAINT chk_tasks_status
  CHECK (status IN ('todo','in_progress','review','done','blocked'));
ALTER TABLE tasks ADD CONSTRAINT chk_tasks_priority
  CHECK (priority IN ('low','medium','high','urgent'));

-- briefs
ALTER TABLE briefs ADD CONSTRAINT chk_briefs_status
  CHECK (status IN ('draft','in_review','approved','archived'));

-- invoices
ALTER TABLE invoices ADD CONSTRAINT chk_invoices_status
  CHECK (status IN ('draft','sent','paid','overdue','cancelled'));

-- payments
ALTER TABLE payments ADD CONSTRAINT chk_payments_status
  CHECK (status IN ('pending','completed','failed','refunded'));

-- milestones
ALTER TABLE milestones ADD CONSTRAINT chk_milestones_status
  CHECK (status IN ('pending','in_progress','completed','missed'));

-- deliverables
ALTER TABLE deliverables ADD CONSTRAINT chk_deliverables_status
  CHECK (status IN ('pending','in_progress','review','completed'));

-- wizard_sessions
ALTER TABLE wizard_sessions ADD CONSTRAINT chk_wizard_sessions_status
  CHECK (status IN ('in_progress','completed','abandoned'));

-- team_members
ALTER TABLE team_members ADD CONSTRAINT chk_team_members_role
  CHECK (role IN ('owner','admin','consultant','viewer'));

-- crm_deals
ALTER TABLE crm_deals ADD CONSTRAINT chk_crm_deals_status
  CHECK (status IN ('open','won','lost','stale'));
```

### 2. Missing updated_at Triggers

```sql
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 3. Vector Dimension Enforcement

```sql
-- Verify current dimension first:
-- SELECT vector_dims(embedding) FROM crm_interactions WHERE embedding IS NOT NULL LIMIT 1;
-- Then constrain (assuming 1536 for text-embedding-004):
ALTER TABLE crm_interactions
  ALTER COLUMN embedding TYPE vector(1536);
ALTER TABLE documents
  ALTER COLUMN embedding TYPE vector(1536);
```

**Note:** Verify the actual embedding model dimension before applying. If using Gemini text-embedding-004 (768 dims), adjust accordingly.

### 4. Validate Existing Data

Before adding constraints, verify no existing data violates them:

```sql
-- Check for invalid status values
SELECT 'clients' as t, status, COUNT(*) FROM clients GROUP BY status
UNION ALL SELECT 'projects', status, COUNT(*) FROM projects GROUP BY status
UNION ALL SELECT 'tasks', status, COUNT(*) FROM tasks GROUP BY status
UNION ALL SELECT 'briefs', status, COUNT(*) FROM briefs GROUP BY status;
```

If violations exist, fix data first, then add constraints.

## Acceptance Criteria
- All CHECK constraints added — inserting invalid status values returns constraint error
- `organizations.updated_at` auto-updates on row modification
- `profiles.updated_at` auto-updates on row modification
- Vector columns reject embeddings with wrong dimensions
- No existing data violates new constraints (validated before applying)
- Migration file exists in `supabase/migrations/`

## Failure Handling
- If existing data violates a constraint, fix data before adding constraint
- Use `ALTER TABLE ... ADD CONSTRAINT ... NOT VALID` then `VALIDATE CONSTRAINT` to avoid table locks on large tables
- Vector type change fails if existing data has different dimensions — migrate data first
