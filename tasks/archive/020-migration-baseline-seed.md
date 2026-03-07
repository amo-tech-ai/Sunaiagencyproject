---
id: 020-migration-baseline-seed
diagram_id: CORE-DATA-01
prd_section: Database Schema
title: Create baseline migration from production schema and seed data
skill: backend
phase: CORE
priority: P1
status: Done
owner: Backend
dependencies:
  - 017-security-hotfix-rls
  - 018-database-schema-crm-financial
  - 019-data-integrity-constraints
estimated_effort: M
percent_complete: 100
---

## Objective
Create the migration infrastructure that's completely missing: a baseline migration from the production schema, a seed.sql with reference data, and team_members population to fix the broken RLS authorization chain.

## Context (from audit 2026-03-07)
The audit scored Migration Readiness at 2/10. There are no migration files, `config.toml` has `schema_paths = []`, and `seed.sql` is empty. The schema was created via direct SQL/MCP and is not reproducible. Additionally, `team_members` has 0 rows despite 8 profiles and 3 organizations — meaning all RLS policies that check org membership via `get_user_org_ids()` deny access to all users.

## Scope

### 1. Generate Baseline Migration

```bash
# Dump current production schema (DDL only, no data)
supabase db dump --project-ref necxcwhuzylsumlkkmlk \
  --schema public \
  --data-only false \
  > supabase/migrations/20260307000000_baseline.sql

# OR generate from local schema.sql:
cp supabase/dumps/schema.sql supabase/migrations/20260307000000_baseline.sql
```

The baseline migration should include (in order):
1. Extensions (`CREATE EXTENSION IF NOT EXISTS`)
2. Custom enum types (`crm_interaction_type`, `crm_sentiment`)
3. All 31 table definitions with constraints
4. All foreign key constraints
5. All indexes
6. Helper functions (`get_user_org_ids`, `user_is_org_owner`, `user_has_role_in_org`, etc.)
7. Business functions (`handle_wizard_completion`, `handle_client_onboarding`, etc.)
8. `update_updated_at` function
9. All triggers
10. RLS enable statements
11. All RLS policies (excluding the temp_anon ones removed in 017)

### 2. Update config.toml

```toml
# In supabase/config.toml, update:
[db]
major_version = 17

[db.migrations]
# Enable migration tracking
schema_paths = ["./migrations"]
```

### 3. Create Seed Data (supabase/seed.sql)

Extract and codify reference data that should exist in every environment:

```sql
-- Catalog data: systems (AI system catalog)
INSERT INTO systems (id, name, category, description, is_active, display_order)
VALUES
  -- Extract current production data
  ;

-- Catalog data: services
INSERT INTO services (id, name, slug, category, description, is_active, org_id, display_order)
VALUES
  -- Extract current production data
  ;

-- system_services junction
INSERT INTO system_services (id, system_id, service_id, is_primary)
VALUES
  -- Extract current production data
  ;

-- Default CRM pipeline
INSERT INTO crm_pipelines (id, org_id, name, is_default)
VALUES
  -- Per-org default pipeline
  ;

-- Default CRM stages
INSERT INTO crm_stages (id, pipeline_id, name, display_order, is_closed)
VALUES
  -- Standard pipeline stages
  ;
```

### 4. Populate team_members

```sql
-- Link existing profiles to organizations
-- First, identify the mapping (check auth.users and profiles)
INSERT INTO team_members (id, org_id, user_id, role, status, created_at, updated_at)
SELECT
  gen_random_uuid(),
  p.org_id,  -- if profiles has org_id, or derive from existing data
  p.id,
  'owner',
  'active',
  now(),
  now()
FROM profiles p
WHERE p.id NOT IN (SELECT user_id FROM team_members)
  AND EXISTS (SELECT 1 FROM organizations WHERE id = p.org_id);
```

**Note:** The actual mapping depends on the current profile-to-org relationship. Query production data to determine correct assignments.

### 5. Verify Migration Reproducibility

```bash
# Test: spin up fresh local Supabase
supabase start

# Apply baseline migration
supabase db push

# Apply seed
supabase db seed

# Verify: all 31 tables, correct schema
supabase db lint
```

## Acceptance Criteria
- Baseline migration file exists at `supabase/migrations/20260307000000_baseline.sql`
- `supabase/seed.sql` contains catalog data (systems, services, system_services, default pipeline/stages)
- `config.toml` has `schema_paths` pointing to migrations directory
- Running `supabase db push` on a fresh project creates identical schema to production
- `team_members` has at least 1 row per organization after seed
- `get_user_org_ids()` returns correct org IDs for authenticated users (no longer empty)
- `supabase db diff` shows no differences between migration and production

## Failure Handling
- If migration fails on fresh project, fix DDL ordering (extensions before types before tables before FKs)
- If seed data conflicts on re-run, use `INSERT ... ON CONFLICT DO NOTHING`
- team_members population should be idempotent (check NOT EXISTS before insert)
