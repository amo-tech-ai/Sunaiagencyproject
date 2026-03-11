---
id: 017-security-hotfix-rls
diagram_id: CORE-DATA-01
prd_section: Database Schema
title: Security hotfix — remove temp_anon policies and duplicate org INSERT
skill: backend
phase: CORE
priority: P0
status: Done
owner: Backend
dependencies: []
estimated_effort: S
percent_complete: 100
---

## Objective
Remove 6 dangerous `temp_anon_*` RLS policies from wizard tables and 1 duplicate INSERT policy on organizations. These policies were added during development and grant unrestricted anonymous access to wizard data across all organizations.

## Context (from audit 2026-03-07)
The production readiness audit found 6 policies on `wizard_sessions` and `wizard_answers` that use `qual = true` / `with_check = true` for the `anon` role. This means any unauthenticated API call using the publicly-exposed anon key can read, insert, and update ALL wizard data for ALL orgs. Additionally, `organizations` has two identical INSERT policies.

## Scope

### 1. Remove temp_anon policies (CRITICAL)

```sql
-- Remove all 6 temp_anon policies
DROP POLICY IF EXISTS temp_anon_select_wizard_sessions ON wizard_sessions;
DROP POLICY IF EXISTS temp_anon_insert_wizard_sessions ON wizard_sessions;
DROP POLICY IF EXISTS temp_anon_update_wizard_sessions ON wizard_sessions;
DROP POLICY IF EXISTS temp_anon_select_wizard_answers ON wizard_answers;
DROP POLICY IF EXISTS temp_anon_insert_wizard_answers ON wizard_answers;
DROP POLICY IF EXISTS temp_anon_update_wizard_answers ON wizard_answers;
```

### 2. Remove duplicate organization INSERT policy

```sql
-- Keep "Anyone can create their own organization", remove the duplicate
DROP POLICY IF EXISTS "authenticated users can insert organizations" ON organizations;
```

### 3. Verify remaining policies are sufficient

After removal, verify these authenticated policies still exist and work:
- `wizard_sessions`: authenticated SELECT (org-scoped), INSERT (org-scoped), UPDATE (org-scoped), DELETE (org-scoped)
- `wizard_answers`: authenticated SELECT (org-scoped), INSERT (org-scoped), UPDATE (org-scoped), DELETE (org-scoped)
- `organizations`: "Anyone can create their own organization" INSERT (authenticated, with_check=true)

### 4. Apply as migration

```bash
# Create migration file
supabase migration new remove_temp_anon_policies

# Apply to production
supabase db push --project-ref necxcwhuzylsumlkkmlk
```

## Acceptance Criteria
- All 6 `temp_anon_*` policies removed from production
- Anonymous users cannot SELECT, INSERT, or UPDATE wizard_sessions or wizard_answers
- Authenticated users can still CRUD wizard data scoped to their org
- Only one INSERT policy remains on organizations
- Migration file exists in `supabase/migrations/`
- Verify with: `SELECT policyname FROM pg_policies WHERE schemaname='public' AND policyname LIKE 'temp_%'` returns 0 rows

## Failure Handling
- If any policy doesn't exist, `DROP POLICY IF EXISTS` prevents error
- Test with anon key after removal: should get empty result or permission denied
- If authenticated access breaks, check that org-scoped policies were not accidentally dropped
