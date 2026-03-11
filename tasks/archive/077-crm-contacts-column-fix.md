---
task_id: 077-CRM
title: Fix CRM contacts endpoint to use correct column names
phase: HIGH
priority: P1
status: Not Started
estimated_effort: 2 hours
area: agency-dashboard
skill: [data/supabase-edge-functions, data/database-migration]
subagents: [code-reviewer]
edge_function: make-server-283466b6
schema_tables: [crm_contacts]
depends_on: []
---

# 077 — CRM Contacts Column Fix

## Summary Table

| Aspect | Details |
|--------|---------|
| **File** | `src/supabase/functions/server/pipeline-routes.tsx` |
| **Endpoints** | `GET /crm/contacts` (line ~574), contact enrichment (lines ~190, ~413) |
| **Current** | Selects `name`, `role` — may not match actual DB schema |
| **Target** | Use actual column names from `crm_contacts` table (likely `first_name`, `last_name`, `job_title`) |
| **Real-World** | "Agency views contact list → sees 'null' for names because column names don't match schema" |

---

## Description

**The situation:** The `GET /crm/contacts` endpoint in `pipeline-routes.tsx` selects `.select("id, name, email, client_id, role")`. If the `crm_contacts` table was created with `first_name`/`last_name` (per migration `20260307120200`), these selects will fail or return null.

**Why it matters:** Contact data is displayed in the CRM pipeline deal detail panel and contact lists. Wrong column names cause silent data loss — contacts appear with blank names.

**What already exists:** `crm-routes.tsx` and `pipeline-routes.tsx` both query contacts. The migration `20260307120200_create_crm_core_tables.sql` defines the actual schema.

**The build:**
1. Check the actual `crm_contacts` table schema in the migration file
2. Update all contact SELECT queries in `pipeline-routes.tsx` to match
3. Update any contact SELECT queries in `crm-routes.tsx`
4. If the table uses `first_name`/`last_name`, concatenate for display or return both

---

## Steps

1. Read `src/supabase/migrations/20260307120200_create_crm_core_tables.sql` — confirm actual column names
2. Search `pipeline-routes.tsx` for all `.select(` that reference contacts — fix column names
3. Search `crm-routes.tsx` for same
4. If frontend expects `name`, either add a computed column or return `first_name || ' ' || last_name as name` in the select
5. Verify with curl: `GET /crm/contacts` returns populated name fields

---

## Acceptance Criteria

- [ ] All contact queries use column names matching the actual `crm_contacts` table schema
- [ ] `GET /crm/contacts` returns contacts with populated name fields
- [ ] Contact enrichment in deal detail panel works (line ~190)
- [ ] Contact queries in interaction endpoints work (line ~413)
- [ ] Frontend contact display is not broken (verify response shape compatibility)
- [ ] `npm run build` passes

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Pipeline routes | `src/supabase/functions/server/pipeline-routes.tsx` | Fix contact SELECT queries |
| CRM routes | `src/supabase/functions/server/crm-routes.tsx` | Fix contact SELECT queries |
| Migration check | `src/supabase/migrations/20260307120200_create_crm_core_tables.sql` | Read to confirm schema |

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Table has `name` (not `first_name`/`last_name`) | No change needed — current code is correct |
| Table has both `name` AND `first_name` | Use whichever is populated, prefer `first_name`+`last_name` |
| Frontend expects single `name` field | Return concatenated `first_name || ' ' || last_name` |
