# Supabase Migrations — Single Source of Truth

**Canonical path:** `supabase/migrations/` (this directory)
**Status:** All 10 migrations applied to production (verified 2026-03-10)

Do NOT add new migrations under `src/supabase/migrations/` — that path is a synced copy for reference only.

## Migration Files

| Timestamp | Name | Description |
|-----------|------|-------------|
| 20260307120000 | enhance_wizard_sessions | wizard_sessions + wizard_answers tables |
| 20260307120100 | create_ai_tables | ai_cache + ai_run_logs |
| 20260307120200 | create_crm_core_tables | clients + crm_contacts |
| 20260307120300 | create_crm_pipeline_tables | crm_pipelines + crm_stages + crm_deals + crm_interactions |
| 20260307120400 | seed_default_pipeline_and_verify | Default pipelines + stages seed data |
| 20260309100000 | workflow_financial_tables | workflows + workflow_executions + dashboard_invoices + dashboard_payments |
| 20260310120000 | create_onboarding_tables | projects + roadmaps + roadmap_phases + activities |
| 20260310120000 | create_strategy_engine_tables | 11 strategy engine tables |
| 20260310130000 | verification_fixes | Column fixes + missing indexes |
| 20260310140000 | drop_unused_duplicate_indexes | Drop 27 redundant indexes |

## Applying Migrations

```bash
# Link project (one-time)
supabase link --project-ref necxcwhuzylsumlkkmlk

# Push all pending migrations
supabase db push
```

Or apply individually via [SQL Editor](https://supabase.com/dashboard/project/necxcwhuzylsumlkkmlk/sql/new).
