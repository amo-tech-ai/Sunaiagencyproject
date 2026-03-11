# Steps 1-7 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix security issues, migrate KV to Supabase tables, fix CRM contacts, enable realtime triggers, consolidate schema, and verify.

**Architecture:** All changes are in edge function server files (`src/supabase/functions/server/`). KV migration replaces `kv_store.tsx` calls with `adminClient().from()` queries. Realtime triggers are applied via MCP SQL execution.

**Tech Stack:** Hono (Deno), Supabase JS client, PostgreSQL triggers

---

### Group A — Security + Code Fixes (parallel)

**Task A1: CORS restriction** — `index.tsx` line 33: replace `origin: "*"` with env-aware function
**Task A2: Gemini retry** — `gemini.tsx`: add AbortController timeout + 3-retry backoff
**Task A3: CRM contacts** — `pipeline-routes.tsx` lines 190, 413, 574: fix column names to match `crm_contacts` schema (`first_name`, `last_name`, `job_title`)

### Group B — KV Migration (parallel)

**Task B1: workflow-routes.tsx** — Replace all `kv.*` calls with `adminClient().from("workflows")` / `.from("workflow_executions")`
**Task B2: financial-routes.tsx** — Replace all `kv.*` calls with `adminClient().from("dashboard_invoices")` / `.from("dashboard_payments")`
**Task B3: document-routes.tsx** — Replace all `kv.*` calls with `adminClient().from("documents")`

### Group C — Database Ops (sequential)

**Task C1: Realtime triggers** — Execute 4 SQL files via Supabase MCP
**Task C2: ensure-schema.tsx cleanup** — Remove DDL, keep read-only checks
**Task C3: RLS policy audit** — Query and fix overly permissive policies

### Group D — Deploy + Verify

**Task D1: Delete kv_store.tsx** — Remove after all imports gone
**Task D2: Deploy** — Copy files + supabase functions deploy
**Task D3: Verify** — curl all endpoints
