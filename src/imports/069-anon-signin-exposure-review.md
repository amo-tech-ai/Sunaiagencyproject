---
id: 069-anon-signin-exposure-review
diagram_id: SEC-03
prd_section: Security
title: Review and reduce anonymous sign-in attack surface
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
figma_prompt: prompts/069-anon-signin-exposure-review.md
---

# 069 — Anonymous Sign-In Exposure Review

## Summary Table

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| Problem            | Anonymous sign-ins enabled — 30+ tables have anon role policies |
| Current State      | Most anon policies use `USING (false)` but attack surface is broad |
| Risk               | MEDIUM — any misconfigured anon policy exposes data to unauthenticated users |
| Goal               | Audit all anon policies, confirm all are deny-by-default except wizard tables |

---

## Description

### 1. Context

Supabase has anonymous sign-ins enabled for this project. This means the `anon` role policies apply to unauthenticated API requests. While most tables correctly block anon with `USING (false)`, the sheer number of policies (30+) means any single misconfiguration exposes data.

### 2. Expected Anon Access

Only these tables should allow anon access:
- `wizard_sessions` — INSERT (create session), SELECT (load session)
- `wizard_answers` — INSERT (save answers), SELECT (load answers)

All other tables should have `USING (false)` for anon or no anon policy at all.

### 3. Audit Steps

```sql
-- List all anon policies that are NOT deny-by-default
SELECT tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE roles::text LIKE '%anon%'
  AND schemaname = 'public'
  AND qual::text != 'false'
ORDER BY tablename;
```

### 4. Decision: Disable Anonymous Sign-Ins?

If the only anon use case is the wizard, consider:
- **Option A**: Keep anon enabled, audit policies (current approach)
- **Option B**: Disable anon sign-ins, make wizard use a lightweight auth token
- **Option C**: Keep anon but add rate limiting on wizard endpoints

---

## Verification

```sql
-- After audit, this should return only wizard_sessions and wizard_answers
SELECT DISTINCT tablename FROM pg_policies
WHERE roles::text LIKE '%anon%'
  AND schemaname = 'public'
  AND qual::text != 'false';
```
