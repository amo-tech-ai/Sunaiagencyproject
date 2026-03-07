# Supabase Production Audit Report

**Project:** sunai (necxcwhuzylsumlkkmlk)
**Database:** PostgreSQL 17
**Audit Date:** 2026-03-07
**Auditor:** Claude Code (automated forensic audit via Supabase MCP)

---

## PRODUCTION READINESS SCORE: 66 / 100

| Category | Score | Weight | Weighted |
|---|---|---|---|
| Schema Correctness | 9/10 | 20% | 18.0 |
| Security | 6/10 | 25% | 15.0 |
| Performance | 9/10 | 15% | 13.5 |
| Data Integrity | 7/10 | 15% | 10.5 |
| Migration Readiness | 2/10 | 15% | 3.0 |
| Documentation | 6/10 | 10% | 6.0 |
| **Total** | | | **66.0** |

**Verdict:** NOT production-ready. Two critical blockers (temp_anon policies, no migrations) must be resolved before any real user data enters the system.

---

## 1. Tables Summary

**31 tables** in `public` schema. All have RLS enabled. All use UUID primary keys with `gen_random_uuid()` defaults.

| Table | Rows | FKs | Indexes | RLS Policies | Notes |
|---|---|---|---|---|---|
| activities | 3 | 4 | 9 | 5 | Full CRUD policies |
| ai_cache | 3 | 1 | 4 | 2 | SELECT-only (edge fn writes) |
| ai_run_logs | 3 | 2 | 5 | 2 | SELECT-only (edge fn writes) |
| brief_versions | 3 | 2 | 6 | 3 | SELECT + INSERT only |
| briefs | 3 | 2 | 7 | 5 | Full CRUD policies |
| clients | 3 | 2 | 16 | 6 | Most indexed table |
| context_snapshots | 3 | 2 | 6 | 3 | Unique active-per-project constraint |
| crm_contacts | 9 | 2 | 6 | 5 | Full CRUD policies |
| crm_deals | 5 | 4 | 8 | 5 | Full CRUD policies |
| crm_interactions | 8 | 5 | 11 | 5 | IVFFlat vector index |
| crm_pipelines | 3 | 1 | 3 | 5 | Full CRUD policies |
| crm_stages | 13 | 1 | 3 | 5 | Full CRUD policies |
| deliverables | 3 | 3 | 7 | 5 | Full CRUD policies |
| documents | 3 | 4 | 7 | 5 | IVFFlat vector index |
| invoices | 3 | 2 | 9 | 5 | Unique invoice_number |
| milestones | 3 | 3 | 7 | 5 | Full CRUD policies |
| organizations | 3 | 0 | 2 | 6 | Root entity, 2 INSERT policies |
| payments | 3 | 2 | 7 | 5 | Full CRUD policies |
| profiles | 8 | 0 | 2 | 9 | Linked to auth.users |
| project_services | 3 | 3 | 6 | 5 | Unique (project_id, service_id) |
| project_systems | 3 | 3 | 7 | 5 | Unique (project_id, system_id) |
| projects | 3 | 2 | 12 | 6 | Full CRUD + ALL policy |
| roadmap_phases | 3 | 2 | 5 | 2 | SELECT-only (edge fn writes) |
| roadmaps | 3 | 2 | 4 | 2 | SELECT-only (edge fn writes) |
| services | 3 | 1 | 8 | 5 | Anon can read active global |
| system_services | 3 | 2 | 5 | 2 | Catalog data, anon readable |
| systems | 3 | 0 | 2 | 2 | Catalog data, anon readable |
| tasks | 3 | 3 | 12 | 5 | Full CRUD policies |
| team_members | **0** | 1 | 5 | 7 | **EMPTY - data gap** |
| wizard_answers | 3 | 2 | 6 | 8 | **Has temp_anon policies** |
| wizard_sessions | 3 | 2 | 6 | 8 | **Has temp_anon policies** |

**Totals:** 107 rows, 65 FK constraints, ~194 indexes, ~137 RLS policies

---

## 2. Schema Correctness (9/10)

**PASS:** All 31 tables present with correct column types, nullability, and defaults.

### Foreign Key Map (65 constraints)

All FK relationships verified as correct:

- `organizations` is the root tenant entity (0 incoming FKs, referenced by 26 tables)
- `profiles` linked to `auth.users` (referenced by activities, brief_versions, clients, crm_deals, crm_interactions, deliverables, documents, tasks)
- `clients` -> `organizations` (referenced by activities, crm_contacts, crm_deals, crm_interactions, projects)
- `projects` -> `organizations`, `clients` (referenced by activities, ai_run_logs, briefs, context_snapshots, documents, invoices, milestones, project_services, project_systems, wizard_sessions)
- `wizard_sessions` -> `organizations`, `projects` (referenced by documents, wizard_answers)

### Custom Enum Types (2)

| Type | Values |
|---|---|
| `crm_interaction_type` | email, call, meeting, note, linkedin, system |
| `crm_sentiment` | positive, neutral, negative, churn_risk |

### Extensions (7)

| Extension | Version | Purpose |
|---|---|---|
| pg_graphql | 1.5.11 | GraphQL API |
| pg_stat_statements | 1.11 | Query performance stats |
| pgcrypto | 1.3 | Cryptographic functions |
| plpgsql | 1.0 | PL/pgSQL language |
| supabase_vault | 0.3.1 | Secret management |
| uuid-ossp | 1.1 | UUID generation |
| vector | 0.8.0 | pgvector for embeddings |

### Unique Constraints (8 composite)

| Table | Columns |
|---|---|
| brief_versions | (brief_id, version) |
| briefs | (project_id, version) |
| invoices | (invoice_number) |
| project_services | (project_id, service_id) |
| project_systems | (project_id, system_id) |
| roadmaps | (snapshot_id) |
| services | (slug) |
| system_services | (system_id, service_id) |
| team_members | (org_id, user_id) |

**Issue:** No CHECK constraints on any text status/stage fields. Status values (e.g., `clients.status`, `projects.status`, `tasks.status`) are unconstrained text columns.

---

## 3. Security Analysis (6/10)

### CRITICAL: 6 Temporary Anonymous Policies

These policies grant **unrestricted anon access** to wizard tables. Any unauthenticated API call can read, insert, and update all wizard data for all organizations.

| Table | Policy | Command | Qualifier |
|---|---|---|---|
| wizard_sessions | temp_anon_insert_wizard_sessions | INSERT | with_check = `true` |
| wizard_sessions | temp_anon_select_wizard_sessions | SELECT | qual = `true` |
| wizard_sessions | temp_anon_update_wizard_sessions | UPDATE | qual = `true`, with_check = `true` |
| wizard_answers | temp_anon_insert_wizard_answers | INSERT | with_check = `true` |
| wizard_answers | temp_anon_select_wizard_answers | SELECT | qual = `true` |
| wizard_answers | temp_anon_update_wizard_answers | UPDATE | qual = `true`, with_check = `true` |

**Impact:** An attacker with only the anon key (publicly exposed in client JS) can:
- Read ALL wizard sessions and answers across ALL organizations
- Insert fake wizard sessions/answers
- Update ANY existing wizard session/answer

### WARNING: Permissive Organization INSERT

Two duplicate INSERT policies on `organizations` both use `with_check = true`:
- "Anyone can create their own organization"
- "authenticated users can insert organizations"

Any authenticated user can create unlimited organizations with arbitrary data.

### Anon Access Model (Correct)

- 25 tables: anon SELECT blocked (`qual = false`) — correct
- `services`: anon can SELECT active global services (`is_active = true AND org_id IS NULL`) — correct (catalog)
- `systems`: anon can SELECT active systems (`is_active = true`) — correct (catalog)
- `system_services`: anon SELECT with `qual = true` — acceptable (catalog join table)

### SECURITY DEFINER Functions (7)

All helper functions correctly use SECURITY DEFINER:

| Function | Type | Purpose |
|---|---|---|
| `get_user_org_ids()` | SQL, stable | Returns org UUIDs for current auth.uid |
| `user_is_org_owner(uuid)` | SQL, stable | Checks owner role in org |
| `user_has_role_in_org(uuid, text[])` | SQL, stable | Checks role membership |
| `get_client_classification(uuid)` | PL/pgSQL, volatile | Returns client status JSONB |
| `handle_client_onboarding()` | PL/pgSQL, trigger | Auto-onboarding on status change |
| `handle_dashboard_activation()` | PL/pgSQL, trigger | Activates dashboard on roadmap create |
| `handle_new_crm_interaction()` | PL/pgSQL, trigger | Updates client stats on interaction |
| `handle_new_user()` | PL/pgSQL, trigger | Creates profile on auth signup |
| `handle_wizard_completion()` | PL/pgSQL, trigger | Creates project on wizard step 5 |

### RLS Policy Coverage

Tables with write gaps (SELECT-only for authenticated users):

| Table | SELECT | INSERT | UPDATE | DELETE | Reason |
|---|---|---|---|---|---|
| ai_cache | 2 | 0 | 0 | 0 | Edge functions write via service_role |
| ai_run_logs | 2 | 0 | 0 | 0 | Edge functions write via service_role |
| roadmaps | 2 | 0 | 0 | 0 | Edge functions write via service_role |
| roadmap_phases | 2 | 0 | 0 | 0 | Edge functions write via service_role |
| systems | 2 | 0 | 0 | 0 | Catalog data, admin-only writes |
| system_services | 2 | 0 | 0 | 0 | Catalog data, admin-only writes |
| brief_versions | 2 | 1 | 0 | 0 | Append-only by design |

This is by design — not a security gap.

---

## 4. Performance Analysis (9/10)

### Index Coverage: Excellent

**194 indexes** across 31 tables. Key patterns:

- **Every org_id column** has a btree index — multi-tenant queries are fast
- **Composite indexes** for common query patterns:
  - `(org_id, client_id, created_at DESC)` on activities
  - `(org_id, status)` on clients, deliverables, invoices, milestones, payments, projects, tasks, crm_deals
  - `(org_id, project_id, due_date)` on milestones
  - `(org_id, session_id)` on wizard_answers
- **GIN indexes** on JSONB columns: metadata (activities), content (briefs, brief_versions), tags (crm_contacts, tasks), features/benefits (services), line_items (invoices), metrics (context_snapshots), response (ai_cache), outcomes (roadmap_phases), recommendation_metadata (project_systems)
- **Partial indexes** for conditional queries: `WHERE is_active = true`, `WHERE IS NOT NULL`, `WHERE current_step = 5`
- **Unique partial index**: `context_snapshots (project_id) WHERE is_active = true` — enforces one active snapshot per project

### Vector Indexes

| Table | Column | Type | Config |
|---|---|---|---|
| crm_interactions | embedding | IVFFlat | vector_cosine_ops, lists=100 |
| documents | embedding | IVFFlat | vector_cosine_ops, lists=100 |

**WARNING:** IVFFlat with lists=100 on tables with <100 rows will produce poor recall. These indexes must be rebuilt with appropriate `lists` values after data reaches at least 1,000 rows. Rule of thumb: `lists = sqrt(rows)`.

### Missing Indexes

None identified. The schema is over-indexed if anything — some redundant single-column indexes exist alongside composite indexes that cover the same column. This is acceptable for a multi-tenant SaaS where query patterns vary.

---

## 5. Data Integrity Analysis (7/10)

### Foreign Key Integrity: PASS

65 FK constraints verified. All reference existing tables and columns. No orphan FK targets.

### Trigger Coverage: PASS

**29 triggers** (all enabled):

| Type | Count | Details |
|---|---|---|
| `update_updated_at` | 24 | On all major tables (not on organizations, profiles, systems, system_services) |
| Business triggers | 4 | on_client_status_update, on_crm_interaction_insert, on_roadmap_created, on_wizard_step_update |
| Auth trigger | 1 | handle_new_user (on auth.users) |

**Issue: Missing `update_updated_at` triggers on:**
- `organizations` — has `updated_at` column but no trigger
- `profiles` — has `updated_at` column but no trigger

### Data Gaps

| Issue | Severity | Detail |
|---|---|---|
| `team_members` has 0 rows | HIGH | 8 profiles and 3 orgs exist but no team memberships. RLS policies that check org membership via `get_user_org_ids()` will deny all access. |
| All tables have only seed data (3 rows avg) | INFO | Expected for pre-launch |

### Missing CHECK Constraints

No CHECK constraints exist on any table. The following text columns should be constrained:

| Table | Column | Suggested Values |
|---|---|---|
| clients | status | active, inactive, prospect, churned |
| clients | lifecycle_stage | lead, prospect, onboarding, active, at_risk, churned |
| clients | pipeline_stage | new, qualified, proposal, negotiation, closed_won, closed_lost |
| projects | status | planning, active, on_hold, completed, cancelled |
| tasks | status | todo, in_progress, review, done |
| tasks | priority | low, medium, high, urgent |
| briefs | status | draft, review, approved, archived |
| deliverables | status | pending, in_progress, review, completed |
| invoices | status | draft, sent, paid, overdue, cancelled |
| payments | status | pending, completed, failed, refunded |
| milestones | status | pending, in_progress, completed, missed |
| wizard_sessions | status | in_progress, completed, abandoned |
| team_members | role | owner, admin, consultant, viewer |

---

## 6. AI Infrastructure Audit

### ai_cache Table

- PK: `hash` (text) — content-addressable cache
- FK: `org_id` -> organizations
- Columns: hash, org_id, operation, input_hash, response (jsonb), model, tokens_used, created_at, expires_at
- Indexes: org_id, created_at DESC, expires_at (partial WHERE NOT NULL), GIN on response
- **No TTL cleanup mechanism** — expired rows accumulate. Needs a pg_cron job or edge function.

### ai_run_logs Table

- PK: `id` (uuid)
- FKs: org_id -> organizations, project_id -> projects
- Columns: id, org_id, project_id, function_name, model, input_tokens, output_tokens, latency_ms, status, error, metadata, created_at
- Indexes: org_id, project_id, created_at, (org_id + created_at)
- **Good:** Captures cost-relevant metrics (tokens, latency, model)

### Vector Infrastructure

- **Extension:** pgvector 0.8.0
- **Embedding columns:** `crm_interactions.embedding` (vector), `documents.embedding` (vector)
- **Index type:** IVFFlat with cosine distance
- **Dimension:** Not constrained in schema (allows variable-length vectors)
- **Recommendation:** Add dimension constraint (e.g., `vector(1536)`) to prevent mismatched embeddings

---

## 7. Migration Readiness (2/10)

| Check | Status | Detail |
|---|---|---|
| Migration files exist | FAIL | No `supabase/migrations/` directory |
| config.toml schema_paths | FAIL | `schema_paths = []` (empty) |
| seed.sql populated | FAIL | Contains only a comment |
| Schema reproducible from migrations | FAIL | Schema was created via direct SQL |
| Schema dump available | PASS | `supabase/schema.sql` and `supabase/dumps/schema.sql` exist |
| Schema documentation | PARTIAL | `supabase/supabase.md` covers columns only |

**This is the biggest gap.** Without migrations, the schema cannot be:
- Reproduced on a new project
- Tested in CI/CD
- Rolled back on failure
- Reviewed in version control

---

## 8. Dangerous Policies (Action Required)

### P0 — CRITICAL (fix before any user data)

```sql
-- Remove all 6 temp_anon policies
DROP POLICY temp_anon_select_wizard_sessions ON wizard_sessions;
DROP POLICY temp_anon_insert_wizard_sessions ON wizard_sessions;
DROP POLICY temp_anon_update_wizard_sessions ON wizard_sessions;
DROP POLICY temp_anon_select_wizard_answers ON wizard_answers;
DROP POLICY temp_anon_insert_wizard_answers ON wizard_answers;
DROP POLICY temp_anon_update_wizard_answers ON wizard_answers;
```

### P0 — Remove duplicate organization INSERT policy

```sql
-- Remove the duplicate (keep the named one)
DROP POLICY "authenticated users can insert organizations" ON organizations;
```

---

## 9. Fix Plan

### P0 — Security Fixes (do immediately)

**1. Remove temp_anon policies (6 policies)**

```sql
-- Migration: 001_remove_temp_anon_policies.sql
DROP POLICY IF EXISTS temp_anon_select_wizard_sessions ON wizard_sessions;
DROP POLICY IF EXISTS temp_anon_insert_wizard_sessions ON wizard_sessions;
DROP POLICY IF EXISTS temp_anon_update_wizard_sessions ON wizard_sessions;
DROP POLICY IF EXISTS temp_anon_select_wizard_answers ON wizard_answers;
DROP POLICY IF EXISTS temp_anon_insert_wizard_answers ON wizard_answers;
DROP POLICY IF EXISTS temp_anon_update_wizard_answers ON wizard_answers;
```

**2. Remove duplicate org INSERT policy**

```sql
-- Migration: 002_fix_org_insert_policy.sql
DROP POLICY IF EXISTS "authenticated users can insert organizations" ON organizations;
```

### P1 — Data Integrity (do before launch)

**3. Add CHECK constraints for status fields**

```sql
-- Migration: 003_add_check_constraints.sql
ALTER TABLE clients ADD CONSTRAINT chk_clients_status
  CHECK (status IN ('active','inactive','prospect','churned'));
ALTER TABLE clients ADD CONSTRAINT chk_clients_lifecycle
  CHECK (lifecycle_stage IN ('lead','prospect','onboarding','active','at_risk','churned'));
ALTER TABLE projects ADD CONSTRAINT chk_projects_status
  CHECK (status IN ('planning','active','on_hold','completed','cancelled'));
ALTER TABLE tasks ADD CONSTRAINT chk_tasks_status
  CHECK (status IN ('todo','in_progress','review','done'));
ALTER TABLE tasks ADD CONSTRAINT chk_tasks_priority
  CHECK (priority IN ('low','medium','high','urgent'));
ALTER TABLE briefs ADD CONSTRAINT chk_briefs_status
  CHECK (status IN ('draft','review','approved','archived'));
ALTER TABLE invoices ADD CONSTRAINT chk_invoices_status
  CHECK (status IN ('draft','sent','paid','overdue','cancelled'));
ALTER TABLE payments ADD CONSTRAINT chk_payments_status
  CHECK (status IN ('pending','completed','failed','refunded'));
ALTER TABLE milestones ADD CONSTRAINT chk_milestones_status
  CHECK (status IN ('pending','in_progress','completed','missed'));
ALTER TABLE deliverables ADD CONSTRAINT chk_deliverables_status
  CHECK (status IN ('pending','in_progress','review','completed'));
ALTER TABLE wizard_sessions ADD CONSTRAINT chk_wizard_status
  CHECK (status IN ('in_progress','completed','abandoned'));
ALTER TABLE team_members ADD CONSTRAINT chk_team_role
  CHECK (role IN ('owner','admin','consultant','viewer'));
```

**4. Add missing updated_at triggers**

```sql
-- Migration: 004_add_missing_triggers.sql
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

**5. Add vector dimension constraints**

```sql
-- Migration: 005_constrain_vector_dimensions.sql
-- Check current dimensions first, then:
ALTER TABLE crm_interactions
  ALTER COLUMN embedding TYPE vector(1536);
ALTER TABLE documents
  ALTER COLUMN embedding TYPE vector(1536);
```

### P2 — Migration Infrastructure (do before team onboarding)

**6. Create baseline migration from current schema**

```bash
# Generate initial migration from live schema
supabase db dump --project-ref necxcwhuzylsumlkkmlk > supabase/migrations/000_baseline.sql

# Update config.toml
# schema_paths = ["./migrations"]
```

**7. Create seed data file**

```sql
-- supabase/seed.sql
-- Seed organizations, profiles, team_members, services, systems
-- Extract from current live data
```

**8. Populate team_members**

```sql
-- Migration: 006_seed_team_members.sql
-- Link existing profiles to organizations
INSERT INTO team_members (org_id, user_id, role)
SELECT o.id, p.id, 'owner'
FROM organizations o
CROSS JOIN profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM team_members tm
  WHERE tm.org_id = o.id AND tm.user_id = p.id
)
LIMIT 3; -- Adjust based on actual user-org mapping
```

### P3 — Performance (do after data reaches >1000 rows)

**9. Rebuild IVFFlat indexes**

```sql
-- Run after sufficient data exists
REINDEX INDEX idx_crm_interactions_embedding;
REINDEX INDEX idx_documents_embedding;
-- Consider switching lists parameter: lists = sqrt(row_count)
```

**10. Add ai_cache TTL cleanup**

```sql
-- pg_cron job or edge function
DELETE FROM ai_cache WHERE expires_at < now();
```

---

## 10. Summary

### What's Working Well
- Comprehensive 31-table schema covering all business domains
- Excellent multi-tenant isolation via org_id + RLS helper functions
- Strong indexing strategy (194 indexes including composite, partial, GIN, IVFFlat)
- Business trigger automation (onboarding, dashboard activation, CRM stats, wizard completion)
- pgvector infrastructure ready for AI features
- All tables have RLS enabled with proper anon blocking

### What Must Be Fixed
1. **CRITICAL:** Remove 6 temp_anon policies on wizard tables (open to public internet)
2. **CRITICAL:** Create migration infrastructure (currently unreproducible)
3. **HIGH:** Add CHECK constraints to prevent invalid data in status fields
4. **HIGH:** Populate team_members (currently empty, breaks RLS authorization)
5. **MEDIUM:** Add missing updated_at triggers on organizations and profiles
6. **MEDIUM:** Constrain vector dimensions to prevent embedding mismatches

### Execution Order
```
P0 Security  → Remove temp_anon (5 min)
P0 Security  → Fix org INSERT duplicate (1 min)
P1 Integrity → CHECK constraints (15 min)
P1 Integrity → Missing triggers (5 min)
P2 Migration → Baseline migration from dump (30 min)
P2 Migration → Seed data extraction (30 min)
P2 Migration → team_members population (10 min)
P3 Perf      → Vector index rebuild (after data load)
P3 Perf      → ai_cache TTL cleanup (after launch)
```
