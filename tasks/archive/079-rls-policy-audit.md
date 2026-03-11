---
task_id: 079-SEC
title: RLS policy audit — verify CRUD isolation on all user-scoped tables
phase: MEDIUM
priority: P2
status: Not Started
estimated_effort: 3 hours
area: infrastructure
skill: [devops/security-hardening, data/supabase-postgres-best-practices]
subagents: [security-auditor]
schema_tables: [workflows, workflow_executions, dashboard_invoices, dashboard_payments, projects, roadmaps, roadmap_phases, activities]
depends_on: [070-migrate-kv-workflow-financial-to-supabase-tables]
---

# 079 — RLS Policy Audit

## Summary Table

| Aspect | Details |
|--------|---------|
| **Scope** | All tables with `user_id` column (~8 tables needing review) |
| **Current** | 148 RLS policies across 44 tables — some use broad `to authenticated using (true)` |
| **Target** | User-scoped tables enforce `user_id = (select auth.uid())` |
| **Append-only tables** | `workflow_executions`, `dashboard_payments` — no UPDATE/DELETE policies |
| **Real-World** | "User A can read User B's invoices because RLS policy is `using (true)` instead of `using (user_id = auth.uid())`" |

---

## Description

**The situation:** The project has 148 RLS policies across 44 tables. Some tables use `to authenticated using (true)` which allows any authenticated user to see all rows. For multi-tenant data (invoices, workflows, projects), this is a data isolation violation.

**Why it matters:** Without user-scoped RLS, any logged-in user can access any other user's workflows, invoices, projects, and financial data. This is a data breach waiting to happen.

**What already exists:** RLS is enabled on all tables. Many policies exist. The migration files define initial policies. The `(select auth.uid())` subquery pattern is already used in storage policies.

**The build:**
1. Query all tables with RLS enabled and list their policies
2. Identify tables where `user_id` column exists but policies use `using (true)` instead of `using (user_id = (select auth.uid()))`
3. Fix policies to enforce user isolation
4. Verify append-only tables (executions, payments) have no UPDATE/DELETE policies

---

## Audit Queries

```sql
-- List all tables with RLS and their policies
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;

-- Find tables with user_id column
SELECT table_name FROM information_schema.columns
WHERE table_schema = 'public' AND column_name = 'user_id';

-- Check for overly permissive policies (using true)
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
AND (qual = 'true' OR qual IS NULL);
```

---

## Tables to Audit

| Table | Has `user_id` | Expected Policy | Current Risk |
|-------|--------------|-----------------|-------------|
| `workflows` | Yes | `user_id = (select auth.uid())` | May be `using (true)` |
| `workflow_executions` | Via FK | Join to workflow owner | Append-only (no UPDATE/DELETE) |
| `dashboard_invoices` | Yes | `user_id = (select auth.uid())` | May be `using (true)` |
| `dashboard_payments` | Via FK | Join to invoice owner | Append-only (no UPDATE/DELETE) |
| `projects` | Yes (`created_by`) | `created_by = (select auth.uid())` | May be `using (true)` |
| `roadmaps` | Via FK | Join to project owner | Check |
| `roadmap_phases` | Via FK | Join to roadmap → project owner | Check |
| `activities` | Yes (`user_id`) | `user_id = (select auth.uid())` | Check |

---

## Acceptance Criteria

- [ ] All user-scoped tables enforce `user_id = (select auth.uid())` (not `using (true)`)
- [ ] Append-only tables have SELECT + INSERT policies only (no UPDATE/DELETE)
- [ ] All policies use `(select auth.uid())` subquery form (not bare `auth.uid()`)
- [ ] Service role access preserved for `adminClient()` operations
- [ ] No data visible across users after fix
- [ ] Document findings and fixes in audit report

---

## Outcomes

| Before | After |
|--------|-------|
| Some tables allow cross-user data access | All user data isolated by `auth.uid()` |
| Audit finding: "~8 tables need CRUD review" | All tables verified and documented |
| `using (true)` on user-scoped tables | `using (user_id = (select auth.uid()))` enforced |
