# Todo — Sun AI Agency

**Last verified:** 2026-03-10 | **Version:** v0.26.0 | **Completion:** ~97%

---

## ~~Step 1 — Run Migrations~~ DONE

All 28 migrations applied. 46 tables with RLS enabled. Verified via Supabase MCP on 2026-03-10.

---

## ~~Step 2 — Security Fixes~~ DONE

- [x] CORS restricted to `ALLOWED_ORIGINS` env var in `index.tsx` (prompt 074)
- [x] Gemini 30s timeout + 3-retry exponential backoff in `gemini.tsx` (prompt 072)

---

## ~~Step 3 — KV Store Migration~~ DONE

- [x] `workflow-routes.tsx` → `adminClient().from("workflows")` / `from("workflow_executions")`
- [x] `financial-routes.tsx` → `adminClient().from("dashboard_invoices")` / `from("dashboard_payments")`
- [x] `document-routes.tsx` → `adminClient().from("documents")`
- [x] `kv_store.tsx` deleted — no remaining imports
- [x] Edge function deployed (v24, 1.013MB) and all endpoints verified

---

## ~~Step 4 — CRM Contacts Column Fix~~ DONE

- [x] `pipeline-routes.tsx` — 3 queries updated to `first_name`, `last_name`, `job_title` (prompt 077)

---

## ~~Step 5 — Realtime Broadcast Triggers~~ DONE

- [x] 5 triggers installed: `ai_run_logs`, `wizard_sessions`, `crm_deals`, `lean_canvases`, `lean_canvas_versions`
- [x] 4 topic-specific RLS policies on `realtime.messages`
- [x] Overly permissive generic broadcast policy removed

---

## ~~Step 6 — Schema Consolidation~~ DONE

- [x] `ensure-schema.tsx` stripped of all DDL — read-only verification only (prompt 075)
- [x] Migrations consolidated: `supabase/migrations/` is canonical (10 SQL files)
- [x] `src/supabase/migrations/` synced as reference copy
- [x] README updated with migration inventory

---

## ~~Step 7 — RLS Policy Audit~~ DONE

- [x] 4 tables fixed: `workflows`, `dashboard_invoices`, `lean_canvases`, `strategy_roles` → `user_id = auth.uid()`
- [x] Append-only tables verified: `workflow_executions` (INSERT+SELECT), `dashboard_payments` (INSERT+SELECT)
- [x] Migration file created: `20260310150000_rls_audit_and_realtime_triggers.sql`

---

## ~~Step 8 — Smoke Test~~ DONE

- [x] 23/23 API endpoints verified (health, workflows, financial, documents, CRM, strategy, wizard, onboarding)
- [x] All unauthenticated endpoints return 200 with correct data shapes
- [x] All authenticated endpoints return 401 when no token provided
- [x] Frontend builds successfully (3008 modules, 0 errors, 2.4MB JS bundle)
- [x] Frontend deployed to Vercel: https://sunv2.vercel.app — all 8 routes return 200
- [x] Package.json cleaned: removed 5 server-side-only deps (next, hono, postgres, etc.)

---

## Step 9 — Production Infrastructure

- [x] Frontend deployed to Vercel: https://sunv2.vercel.app
- [ ] Configure Google OAuth (Cloud Console + Supabase Dashboard) (prompt 081)
- [ ] Configure LinkedIn OIDC (Developer Dashboard + Supabase Dashboard) (prompt 081)
- [ ] CI/CD pipeline for automatic deploys (prompt 082)
- [ ] Error monitoring — Sentry or structured logging (prompt 083)
- [ ] Set up database backups schedule

---

## Step 10 — Enhancement Features (Lower Priority)

- [ ] Health check cron — weekly client health scoring (prompt 067)
- [ ] Stale deal alerts — flag deals inactive 14+ days (prompt 068)
- [ ] Workflow execution engine (actually create projects, send notifications)
- [ ] Invoice PDF generation and download
- [ ] Canvas presence tracking (who's editing what)
- [ ] Remove legacy `useSupabaseRealtime` hook (postgres_changes pattern)
- [ ] Add `user_id`/`org_id` to 10 strategy/automation tables + tighten RLS

---

## Completed

- [x] All 14 dashboard phases (58+ components, 11K+ LOC)
- [x] 5-step wizard with AI wiring on all 5 steps
- [x] Auth (email + OAuth buttons + guest)
- [x] Strategy engine (14 routes + full UI + 5-agent analysis)
- [x] Onboarding agent (2 endpoints, frontend wired, idempotent)
- [x] 5 Realtime broadcast triggers installed + 4 topic-specific RLS policies
- [x] Database: 46 tables, RLS on all, 27 redundant indexes dropped
- [x] KV migration: 3 route modules rewritten, kv_store.tsx deleted
- [x] CORS production restriction via `ALLOWED_ORIGINS` env var
- [x] Gemini 30s timeout + 3-retry exponential backoff
- [x] CRM contacts column fix (`first_name`, `last_name`, `job_title`)
- [x] ensure-schema.tsx: DDL removed, read-only verification only
- [x] RLS audit: 4 user-scoped tables fixed, append-only verified
- [x] Migrations consolidated: canonical path `supabase/migrations/` (10 files)
- [x] Smoke test: 23/23 API endpoints pass, frontend builds clean
- [x] Wizard list safety: returns 503 if user_id column missing
- [x] Storage auth.uid() verified: all 4 policies use subquery pattern
- [x] Anon exposure audit: only wizard + public catalog have anon access
- [x] All 28 migrations applied — 46 tables with RLS confirmed
- [x] Edge function v24 deployed and all endpoints verified
- [x] Frontend deployed to Vercel (https://sunv2.vercel.app) — all routes serve 200
- [x] Package.json: removed 5 spurious server-side deps, added vercel.json
