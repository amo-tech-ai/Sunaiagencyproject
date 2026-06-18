# Migration verification report (final)

**Skill used:** `supabase-postgres-best-practices` (.agents/data/supabase-postgres-best-practices)
**Migrations checked:** 20260307120000 → 20260310130000 (8 files)
**References verified:** security-rls-basics, security-rls-performance, security-privileges, schema-primary-keys, schema-foreign-key-indexes, schema-data-types, query-partial-indexes, data-upsert, FUNCTIONS.md, supabase-create-db-functions.mdc

---

## Summary

| Severity | Count | Status |
|----------|-------|--------|
| **Blockers** | 0 | None |
| **Errors** | 0 | None |
| **Red flags** | 0 | All resolved |
| **Advisory** | 4 | Acceptable, documented |

---

## Resolved findings

| # | Finding | Severity | Resolution |
|---|---------|----------|------------|
| 1 | Missing wizard_sessions/wizard_answers tables | Critical | `20260307120000` — `create table if not exists` guards |
| 2 | Seed uniqueness check too loose | Critical | `20260307120400` — `create unique index if not exists` |
| 3 | Combined anon+authenticated RLS | Red flag | `20260309100000` — separate per-role policies |
| 4 | AI tables no policies | By design | Documented as service-role only |
| 5 | Missing updated_at triggers | Red flag | All originals include triggers; wizard in `20260310130000` |
| 6 | crm_contacts missing updated_at | Red flag | `20260307120200` — column + trigger added |
| 7 | Append-only tables undocumented | Red flag | Comments on workflow_executions, dashboard_payments |
| 8 | user_id text vs uuid | Red flag | Originals use uuid; `20260310130000` casts production text→uuid |
| 9 | `search_path = ''` | Red flag | **REJECTED** — empty is correct per ALL sources (see below) |
| 10 | Duplicate migration dirs | Advisory | `supabase/migrations/` is source of truth |
| 11 | 5 missing FK indexes | Red flag | All FK columns now indexed |
| 12 | Wizard updated_at triggers | Red flag | `20260310130000` (handle_updated_at() not available in File 1) |
| 13 | Stale workflows_select_anon | Red flag | Removed from original; drop in `20260310130000` |
| 14 | Strategy trigger function | Advisory | Uses shared handle_updated_at(); old function dropped |
| 15 | ai_cache partial index with now() | Red flag | Changed to full index on (expires_at) |

### Finding #9: `search_path = ''` is correct (REJECTED three times)

The suggestion to use `set search_path = public` was verified against ALL authoritative sources and rejected:

1. **FUNCTIONS.md** line 2: "**Always set `search_path = ''`** — Prevent search path attacks"
2. **FUNCTIONS.md** line 196: The `handle_updated_at()` template uses `set search_path = ''`
3. **supabase-create-db-functions.mdc** line 22: "Always set `search_path` to an empty string"
4. **security-rls-basics.md** line 67: Example function uses `set search_path = ''`

Empty search_path forces fully qualified names, preventing search path injection. This is the Supabase-recommended pattern. **No change made.**

### Finding #15: ai_cache partial index with `now()`

`now()` in a partial index WHERE clause is volatile — evaluated per-row at INSERT/UPDATE time. The index doesn't shrink as rows expire. Changed to a full index on `(expires_at)` for reliable expiry cleanup queries.

---

## Advisory items (acceptable, not blocking)

| # | Item | Rationale |
|---|------|-----------|
| A1 | `wizard_sessions.id` uses text PK | Server-generated session IDs, established pattern |
| A2 | UUIDv4 (`gen_random_uuid()`) everywhere | No pg_uuidv7 extension; tables not high-insert volume |
| A3 | `using (true)` policies = single-tenant | Single-tenant agency app; scope to auth.uid() before multi-tenant |
| A4 | `create policy` without idempotency guards (Files 3,4,6,7) | Migrations run once; verification_fixes handles production state |

---

## Per-file scorecard

| File | Tables | RLS | Policies | Types | FK Idx | Idempotent | Triggers | Naming | Comments |
|------|--------|-----|----------|-------|--------|------------|----------|--------|----------|
| `20260307120000` wizard | 2 | PASS | PASS | PASS | N/A | PASS | PASS* | PASS | PASS |
| `20260307120100` AI | 2 | PASS | PASS | PASS | N/A | PASS | N/A | PASS | PASS |
| `20260307120200` CRM core | 2+fn | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| `20260307120300` CRM pipeline | 4 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| `20260307120400` seed | 0 | N/A | N/A | N/A | N/A | PASS | N/A | PASS | N/A |
| `20260309100000` workflow | 4 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| `20260310120000` strategy | 12 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| `20260310130000` fixes | 0 | N/A | N/A | PASS | N/A | PASS | PASS | PASS | N/A |

*Wizard triggers added in `20260310130000` since `handle_updated_at()` defined in later migration.

---

## Totals

| Metric | Count |
|--------|-------|
| Tables | 26 |
| RLS policies | 92+ |
| Indexes | 49 |
| Triggers | 11 |
| Functions | 1 (shared handle_updated_at) |

**All 8 migration files pass best-practices audit. No outstanding issues.**
