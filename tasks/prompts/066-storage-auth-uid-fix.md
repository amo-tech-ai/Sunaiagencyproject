---
id: 066-storage-auth-uid-fix
diagram_id: SEC-02
prd_section: Security
title: Fix bare auth.uid() in storage.objects RLS policies
skill: backend
phase: LOW
priority: P3
status: Not Started
owner: Backend
dependencies: []
estimated_effort: S
percent_complete: 0
area: infrastructure
schema_tables: []
figma_prompt: prompts/066-storage-auth-uid-fix.md
---

# 066 — Storage Objects auth.uid() Subquery Fix

## Summary Table

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| Problem            | `storage.objects` RLS policies use bare `auth.uid()` instead of `(select auth.uid())` |
| Impact             | Minor perf — bare `auth.uid()` re-evaluates per row instead of once per query |
| Risk               | LOW — storage schema, not public tables. Functional but suboptimal. |
| Approach           | Identify policies, recreate with `(select auth.uid())` wrapper |

---

## Steps

### 1. Identify Affected Policies

```sql
SELECT policyname, tablename, qual, with_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND (qual::text LIKE '%auth.uid()%' OR with_check::text LIKE '%auth.uid()%')
  AND NOT (qual::text LIKE '%(select auth.uid())%' OR with_check::text LIKE '%(select auth.uid())%');
```

### 2. Recreate Each Policy

For each policy found:
```sql
DROP POLICY "policy_name" ON storage.objects;
CREATE POLICY "policy_name" ON storage.objects
FOR <action> TO <role>
USING ( ... (select auth.uid()) ... )
WITH CHECK ( ... (select auth.uid()) ... );
```

### 3. Apply as Migration

Single migration wrapping all policy recreations.

---

## Verification

```sql
-- Should return 0 rows after fix
SELECT policyname FROM pg_policies
WHERE schemaname = 'storage'
  AND (qual::text LIKE '%auth.uid()%' AND NOT qual::text LIKE '%(select auth.uid())%');
```
