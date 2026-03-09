# Supabase audit: `src/supabase` vs best practices

**Scope:** Edge functions (`src/supabase/functions/server/*`), migrations (`src/supabase/migrations/*`), and related config.  
**Rules reference:** `.cursor/rules/supabase/*` (edge functions, migrations, RLS).  
**Date:** 2026-03-07.

---

## Summary — status by function

🟢 **Ready** (≥85%) · 🟡 **Needs improvement** (60–84%) · 🔴 **Failure** (&lt;60%)

| Function | Purpose | % correct | Status |
|----------|---------|-----------|--------|
| index.tsx | Main entry: CORS, health, signup, mount all route modules | 75% | 🟡 |
| auth.tsx | Signup, JWT validation, getUserFromToken / requireAuth | 95% | 🟢 |
| db.tsx | Supabase client factory: adminClient, userClient (RLS) | 98% | 🟢 |
| gemini.tsx | Gemini API client, ai_cache, ai_run_logs | 70% | 🟡 |
| ensure-schema.tsx | Auto-migration for ai_run_logs / ai_cache (SUPABASE_DB_URL) | 60% | 🟡 |
| kv_store.tsx | Legacy KV; only document-routes (doc:) still use it | 50% | 🔴 |
| wizard-routes.tsx | Wizard session/answers persistence (sessions, list, steps) | 75% | 🟡 |
| ai-routes.tsx | AI analysis endpoints (wizard, business analysis, dashboard-insights) | 72% | 🟡 |
| crm-routes.tsx | CRM clients and contacts CRUD | 88% | 🟢 |
| pipeline-routes.tsx | CRM pipelines, stages, deals, forecast | 88% | 🟢 |
| document-routes.tsx | Document list, upload, get, delete, share links (uses kv for doc:) | 88% | 🟢 |
| workflow-routes.tsx | Workflow CRUD, execution, metrics (Supabase workflows/workflow_executions) | 88% | 🟢 |
| financial-routes.tsx | Invoices, payments, metrics (Supabase dashboard_invoices/dashboard_payments) | 88% | 🟢 |
| **Overall** | — | **~78%** | 🟡 |

---

## Executive summary

| Severity | Count | Summary |
|----------|-------|--------|
| **Blockers / Red** | 2 | Gemini API key in URL; no request timeout on Gemini calls |
| **Amber** | 4 | Migrations path vs CLI; CORS `*`; dual schema source; wizard list fallback |
| **Green** | — | Auth pattern, CORS setup, SQL style, RLS enabled on new tables |

**Immediate actions:** Move Gemini API key to `x-goog-api-key` header; add a hard timeout (e.g. 30s) around Gemini `generateContent` calls.

---

## Percent correct by function

Each file under `src/supabase/functions/server/` scored 0–100% against Supabase edge-function rules and this audit’s criteria (imports, auth, errors, no key in URL, timeout, CORS, no unsafe fallbacks, no runtime DDL, no deprecated patterns).

| Function | % | Notes |
|----------|---|--------|
| **index.tsx** | 75% | CORS `origin: "*"`; unversioned Hono imports; otherwise correct mounts and health/signup. |
| **auth.tsx** | 95% | Versioned Supabase; solid `getUserFromToken` and `requireAuth`. Minor: no explicit env validation for service client. |
| **db.tsx** | 98% | Versioned client; clear `adminClient` / `userClient` separation. |
| **gemini.tsx** | 70% | API key in query string (−); no fetch timeout (−); cache/log and versioned deps good. |
| **ensure-schema.tsx** | 60% | Runtime DDL and possible DROP; dual source of truth with migrations. Idempotent guard and safe ADD COLUMN. |
| **kv_store.tsx** | 50% | Legacy; only document-routes (doc:) still import it. Workflow + financial migrated to Supabase. |
| **wizard-routes.tsx** | 75% | Unfiltered list fallback removed (076); 503 when user_id missing. Good error handling. |
| **ai-routes.tsx** | 72% | Inherits Gemini key/timeout issues; uses adminClient and structured errors. |
| **crm-routes.tsx** | 88% | Auth required, 401 when no userId; adminClient; consistent error responses. |
| **pipeline-routes.tsx** | 88% | requireAuth / getUserFromToken; errorResponse pattern; adminClient. |
| **document-routes.tsx** | 88% | Auth where needed, 401 for protected ops; uses kv for doc: prefix (candidate for table migration). |
| **workflow-routes.tsx** | 88% | Supabase workflows + workflow_executions; adminClient; no KV (070). |
| **financial-routes.tsx** | 88% | Supabase dashboard_invoices + dashboard_payments; adminClient; no KV (070). |

**Overall (average):** ~78%. Workflow and financial now table-backed (070). kv_store only used by document-routes.

---

## 1. Blockers and red flags

### 1.1 Gemini API key in query string (security) — **FIXED**

**Where:** `src/supabase/functions/server/gemini.tsx`.

**Fix applied:** URL has no query params; API key sent only in `x-goog-api-key` header. See prompt 071; verified 2026-03-07.

---

### 1.2 No timeout on Gemini `generateContent` (reliability) — **FIXED**

**Where:** `src/supabase/functions/server/gemini.tsx`.

**Fix applied:** AbortController with 30s timeout; one retry on 5xx or timeout (1s delay). See prompt 072; verified 2026-03-07.

---

## 2. Amber / improvement items

### 2.1 Migrations path vs Supabase CLI — **ADDRESSED**

**Fix applied:** All migrations consolidated under `supabase/migrations/` at repo root; `supabase/migrations/README.md` documents `supabase db push` from repo root. Copies of `src/supabase/migrations/*` added so one path for CLI/CI. See 073; verified 2026-03-07.

---

### 2.2 CORS origin `*` — **ADDRESSED**

**Fix applied:** CORS uses `ENVIRONMENT` and `ALLOWED_ORIGINS`; in production only allowlisted origins get `Access-Control-Allow-Origin`; dev keeps `*`. See 074; verified 2026-03-07.

---

### 2.3 Dual source of truth for AI schema — **ADDRESSED**

**Fix applied:** `ensure-schema.tsx` is read-only (no CREATE/ALTER/DROP); only checks that `ai_cache` and `ai_run_logs` exist via Supabase client. Migrations are the single source of truth. See 075; verified 2026-03-07.

---

### 2.4 Wizard list when `user_id` is missing — **ADDRESSED**

**Fix applied:** List endpoint no longer falls back to unfiltered sessions. When the query fails with a column-related error, returns 503 with message "Database schema outdated; please apply migrations (wizard_sessions.user_id)." See 076; verified 2026-03-07.

---

## 3. Failure points and operational risks

| Area | Failure point | Mitigation |
|------|----------------|------------|
| **ensure-schema** | `SUPABASE_DB_URL` unset or wrong | Env check on deploy; prefer migrations over runtime DDL. |
| **Gemini** | Missing `GEMINI_API_KEY` | Already throws; add same for optional cache (fail gracefully if cache env missing). |
| **Auth** | JWT invalid/expired | `getUserFromToken` / `requireAuth` return 401; CRM and pipeline correctly reject anon. |
| **DB** | All server routes use `adminClient()` | RLS is bypassed; acceptable for single-tenant or admin-only. For multi-tenant, introduce `userClient(authHeader)` and RLS on tenant columns. |
| **Hono 404** | Sub-routers (e.g. `/ai/*`) | dashboard-insights fixed by registering on main app; verify all other routes under sub-routers resolve in production (Hono 0.22.2). |

---

## 4. Checklist vs `.cursor/rules/supabase`

- **Edge functions**
  - Imports: `npm:` / `jsr:` used; Hono unversioned (consider pinning).
  - CORS: Present (Hono cors); production origin tightening recommended.
  - Auth: `getUserFromToken` + `requireAuth` used; CRM/pipeline require auth and return 401 when missing.
  - Errors: JSON error responses and status codes used; no generic 500 swallowing.
  - **Gemini:** Key in header (missing — use header). Timeout (missing — add 30s + AbortController).
- **Migrations**
  - Naming: `YYYYMMDDHHmmss_description.sql` — OK.
  - SQL style: Lowercase, `IF NOT EXISTS`, comments — OK.
  - RLS: Enabled on new tables (e.g. ai_cache, ai_run_logs) — OK.
- **RLS (policy rules)**
  - Not audited in depth; policy authoring follows `auth.uid()` and separate SELECT/INSERT/UPDATE/DELETE where applicable (see migration and RLS rule file).

---

## 5. Recommended next actions (priority order)

1. **Security:** Move Gemini API key from query string to `x-goog-api-key` header in `gemini.tsx`.
2. **Reliability:** Add 30s timeout (and optional retry) for Gemini `generateContent` in `gemini.tsx`.
3. **Config:** Confirm migrations path for production and restrict CORS origin for prod.
4. **Maintainability:** Prefer migrations for AI tables; reduce or remove runtime DDL in `ensure-schema.tsx`.
5. **Safety:** Ensure wizard list never returns unfiltered sessions when `user_id` exists; avoid fallback to “all sessions” when column is missing.

---

## 6. Files and rules reviewed

- **Code:** `server/index.tsx`, `auth.tsx`, `db.tsx`, `gemini.tsx`, `wizard-routes.tsx`, `ai-routes.tsx`, `crm-routes.tsx`, `pipeline-routes.tsx`, `ensure-schema.tsx`; references to `document-routes`, `workflow-routes`, `financial-routes`, `kv_store`.
- **Migrations:** `20260307120000_enhance_wizard_sessions.sql`, `20260307120100_create_ai_tables.sql`, `20260307120400_seed_default_pipeline_and_verify.sql`.
- **Rules:** `.cursor/rules/supabase/writing-supabase-edge-functions.mdc`, `supabase-create-migration.mdc`, `supabase-create-rls-policies.mdc`.
