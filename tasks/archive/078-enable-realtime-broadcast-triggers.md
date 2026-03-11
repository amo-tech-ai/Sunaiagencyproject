---
task_id: 078-RT
title: Enable Realtime broadcast triggers on production database
phase: HIGH
priority: P1
status: Not Started
estimated_effort: 30 minutes
area: infrastructure
skill: [data/supabase-realtime, data/realtime-features]
subagents: []
schema_tables: [ai_run_logs, wizard_sessions, crm_deals, lean_canvases, lean_canvas_versions]
depends_on: [070-migrate-kv-workflow-financial-to-supabase-tables]
---

# 078 — Enable Realtime Broadcast Triggers

## Summary Table

| Aspect | Details |
|--------|---------|
| **SQL Files** | 4 trigger files in `/imports/` directory |
| **Tables** | `ai_run_logs`, `wizard_sessions`, `crm_deals`, `lean_canvases`, `lean_canvas_versions` |
| **Hooks (already built)** | `useRealtimeAIRuns`, `useRealtimeWizardSync`, `useRealtimeDealUpdates`, `useRealtimeCanvasSync` |
| **Status** | Frontend hooks implemented. SQL triggers NOT executed on production. |
| **Real-World** | "Two users open CRM pipeline → user A moves a deal → user B sees nothing until manual refresh" |

---

## Description

**The situation:** All 4 Realtime broadcast hooks are implemented in frontend code. But the corresponding database triggers that broadcast changes have NOT been executed on the production Supabase database. Without triggers, the hooks connect to channels but never receive events.

**Why it matters:** Realtime is a key differentiator — collaborative editing on canvas, live deal updates on pipeline, multi-tab wizard sync, and live AI run monitoring all depend on these triggers.

**What already exists:**
- 4 SQL trigger files in `/imports/` directory
- 4 frontend hooks in `src/lib/hooks/` wired to all relevant pages
- `useSupabaseBroadcast` base hook with self-write suppression

**The build:** Execute 4 SQL files on the production database. Verify triggers exist. Enable private-only channels in Supabase Realtime settings.

---

## Execution Order

Run via Supabase MCP `execute_sql` or SQL Editor:

1. `imports/ai-runs-broadcast-trigger.sql` — trigger on `ai_run_logs` INSERT
2. `imports/wizard-sessions-broadcast-trigger.sql` — conditional trigger on `wizard_sessions` UPDATE
3. `imports/crm-deals-realtime-trigger.sql` — trigger on `crm_deals` INSERT/UPDATE/DELETE
4. `imports/lean-canvases-broadcast-trigger.sql` — dual trigger on `lean_canvases` + `lean_canvas_versions`

## Post-Execution

5. Enable "Private-only channels" in Supabase Dashboard > Project Settings > Realtime Settings

---

## Acceptance Criteria

- [ ] All 4 SQL trigger files executed successfully
- [ ] Verify triggers exist: `SELECT tgname FROM pg_trigger WHERE tgrelid = 'ai_run_logs'::regclass;`
- [ ] Verify triggers exist: `SELECT tgname FROM pg_trigger WHERE tgrelid = 'crm_deals'::regclass;`
- [ ] Verify triggers exist: `SELECT tgname FROM pg_trigger WHERE tgrelid = 'lean_canvases'::regclass;`
- [ ] Verify triggers exist: `SELECT tgname FROM pg_trigger WHERE tgrelid = 'lean_canvas_versions'::regclass;`
- [ ] Verify RLS policies on `realtime.messages`: `SELECT policyname FROM pg_policies WHERE tablename = 'messages' AND schemaname = 'realtime';`
- [ ] Expected policies: `ai_runs_read`, `wizard_sessions_read`, `pipeline_deals_read`, `canvas_blocks_read`
- [ ] Private-only channels enabled in Supabase Dashboard

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Trigger already exists (re-run) | `CREATE OR REPLACE` — idempotent |
| Table doesn't exist yet | Trigger creation fails — run table migrations first |
| Private channels not enabled | Hooks still work but channels are public (security risk) |
