# 070: Migrate workflow + financial off KV to Supabase tables

> Stop using `kv_store.tsx`; migrate workflow-routes and financial-routes to Supabase tables with RLS, then remove or stub the KV module.

---

## Goal

- **Treat `kv_store.tsx` as legacy.** The project is Supabase-first; workflow and financial are the only modules still using KV (`kv.get`, `kv.set`, `kv.getByPrefix`).
- **Migrate** workflow and financial data into proper Postgres tables with columns, FKs, and RLS.
- **Rewrite** `workflow-routes.tsx` and `financial-routes.tsx` to use `adminClient()` or `userClient(authHeader)` against those tables instead of KV.
- **Remove or stub** `kv_store.tsx` once no route module imports it, and update the Supabase audit so the KV row can be dropped.

---

## Current KV usage

| Module | KV keys | Shape (from code) |
|--------|---------|-------------------|
| **workflow-routes** | `workflow:{id}` | `id`, `name`, `description`, `trigger`, `conditions[]`, `actions[]`, `status`, `last_run_at`, `success_count`, `fail_count`, `created_at`, `updated_at`, `user_id` |
| **workflow-routes** | `wf_exec:{id}` | `id`, `workflow_id`, `workflow_name`, `status`, `duration_ms`, `trigger_data`, `action_results[]`, `error_message`, `is_dry_run`, `created_at` |
| **financial-routes** | `invoice:{id}` | `id`, `invoice_number`, `client_id`, `client_name`, `project_id`, `project_name`, `amount`, `status` (draft/sent/paid/overdue), `issue_date`, `due_date`, `payment_date`, `line_items[]`, `notes`, `created_at`, `updated_at`, `user_id` |
| **financial-routes** | `payment:{id}` | `id`, `invoice_id`, `amount`, `payment_date`, `method`, `notes`, `recorded_by`, `created_at` |

`kv_store.tsx` API used: `get(key)`, `set(key, value)`, `del(key)`, `getByPrefix(prefix)`. Values are JSON-serialized objects.

---

## Required changes

### 1. Add Supabase tables (migrations)

Create migrations under `src/supabase/migrations/` (or project-standard path):

- **`workflows`**  
  Columns: `id` (uuid, PK), `name`, `description`, `trigger` (jsonb), `conditions` (jsonb), `actions` (jsonb), `status` (text, e.g. enabled/disabled), `last_run_at` (timestamptz), `success_count`, `fail_count`, `created_at`, `updated_at`, `user_id` (uuid, nullable for anonymous).  
  RLS: enable; policies so users see only their own rows (e.g. `user_id = auth.uid()` or service-role for adminClient).

- **`workflow_executions`**  
  Columns: `id` (uuid, PK), `workflow_id` (uuid, FK → workflows), `workflow_name`, `status`, `duration_ms`, `trigger_data` (jsonb), `action_results` (jsonb), `error_message` (text), `is_dry_run` (boolean), `created_at`.  
  RLS: enable; e.g. allow read/insert when workflow is owned by user (via join or policy).

- **`invoices`** (if not already in 055/migrations)  
  Columns: `id` (uuid, PK), `invoice_number` (text, unique), `client_id`, `client_name`, `project_id`, `project_name`, `amount` (numeric), `status` (draft/sent/paid/overdue), `issue_date`, `due_date`, `payment_date`, `line_items` (jsonb), `notes`, `created_at`, `updated_at`, `user_id`.  
  RLS: enable; scope by `user_id = auth.uid()` (or org) for multi-tenant.

- **`payments`**  
  Columns: `id` (uuid, PK), `invoice_id` (uuid, FK → invoices), `amount`, `payment_date`, `method`, `notes`, `recorded_by` (user id), `created_at`.  
  RLS: enable; e.g. allow when invoice is visible to user.

Use lowercase identifiers, `IF NOT EXISTS` where appropriate, and follow `.cursor/rules/supabase` (migrations, RLS, SQL style). Add indexes for list/filter (e.g. `workflows(user_id, updated_at)`, `workflow_executions(workflow_id)`, `invoices(user_id, status)`, `payments(invoice_id)`).

### 2. Rewrite workflow-routes.tsx

- **Remove** `import * as kv from "./kv_store.tsx"`. Use `adminClient()` from `./db.tsx` (or `userClient(c.req.header("Authorization"))` if you want RLS-enforced tenant isolation).
- **List workflows:** Replace `kv.getByPrefix("workflow:")` with `.from("workflows").select(...).order("updated_at", { ascending: false })`. Optionally filter by `user_id` when using userClient.
- **Get one workflow:** `.from("workflows").select().eq("id", id).single()`.
- **Create/update workflow:** `.from("workflows").upsert({ ... })` with proper column names (snake_case).
- **Delete:** `.from("workflows").delete().eq("id", id)`.
- **Toggle status:** `.update({ status, updated_at }).eq("id", id)`.
- **Metrics:** Aggregate from `workflows` and `workflow_executions` (e.g. count by status, filter by `created_at` for “today”).
- **List executions:** `.from("workflow_executions").select().eq("workflow_id", workflowId).order("created_at", { ascending: false })`.
- **Run workflow:** Insert row into `workflow_executions`; update `workflows` set `last_run_at`, `success_count`, `updated_at`.
- **Install template:** Same as create workflow; insert into `workflows`.
- Keep existing route paths and response shapes so the frontend does not break. Keep `getUser(c)` for `user_id`; optionally require auth (return 401 when no userId) for write operations.

### 3. Rewrite financial-routes.tsx

- **Remove** `import * as kv from "./kv_store.tsx"`. Use `adminClient()` or `userClient(authHeader)` from `./db.tsx`.
- **Invoice number:** Replace `nextInvoiceNumber()` (current: count KV keys) with a DB-based approach, e.g. `select count(*) + 1 from invoices` or a small sequence/function.
- **Metrics:** Query `invoices` and `payments` (filter by status, sum amounts, group by month/client/service) instead of `getByPrefix("invoice:")` / `getByPrefix("payment:")`.
- **List invoices:** `.from("invoices").select().order("created_at", { ascending: false })` with optional `.eq("status", status)` and client/project/invoice_number filter in app or via `.ilike()`.
- **CRUD invoices:** `.from("invoices").insert()`, `.update().eq("id", id)`, `.delete().eq("id", id)`, `.select().eq("id", id).single()`.
- **Record payment:** Insert into `payments`; update `invoices` set `status = 'paid'`, `payment_date`, `updated_at`.
- **List payments:** `.from("payments").select()` with optional `.eq("invoice_id", invoiceId)`.
- **Charts / profitability / reminders:** Same tables; no KV. Keep response shapes for the frontend.
- Keep `getUser(c)` for `user_id` / `recorded_by`; optionally require auth for writes and scope reads by `user_id`.

### 4. Remove or stub kv_store.tsx

- After workflow-routes and financial-routes no longer import `kv_store.tsx`, delete the file or replace its body with a stub that throws ("kv_store is deprecated; use Supabase tables").
- Ensure no other code imports it (search for `kv_store` / `from "./kv_store"`).
- Update `tasks/audit/07-supa-audit.md`: remove the `kv_store.tsx` row from the summary and "Percent correct by function" tables, and note that workflow/financial now use tables (bump their % and status as appropriate).

---

## Acceptance criteria

- [ ] New migrations: `workflows`, `workflow_executions`, `invoices` (if new), `payments` with RLS and FKs.
- [ ] `workflow-routes.tsx` uses only Supabase client (no `kv_store`); all existing endpoints behave the same.
- [ ] `financial-routes.tsx` uses only Supabase client (no `kv_store`); all existing endpoints behave the same.
- [ ] `kv_store.tsx` is removed or stubbed and no longer imported.
- [ ] Audit doc updated: KV row dropped; workflow/financial rows reflect table-backed implementation.

---

## References

- `src/supabase/functions/server/workflow-routes.tsx` — current KV usage and route list.
- `src/supabase/functions/server/financial-routes.tsx` — current KV usage and route list.
- `src/supabase/functions/server/kv_store.tsx` — API to replace.
- `tasks/audit/07-supa-audit.md` — summary table and percent-correct by function.
- `.cursor/rules/supabase/supabase-create-migration.mdc`, `supabase-create-rls-policies.mdc` — migration and RLS rules.
- `tasks/prompts/055-complete-data-model.md` — existing table inventory (invoices, payments listed; align schema if those tables already exist).
