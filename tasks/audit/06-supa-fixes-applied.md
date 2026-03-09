# Supabase Security & Performance Fixes — Applied 2026-03-07

> Project: sunai (`necxcwhuzylsumlkkmlk`) | 31 tables | 148 RLS policies | 21 migrations

## Migrations Applied (11 new)

| # | Migration | Description |
|---|-----------|-------------|
| 11 | `fix_client_crm_status_security_invoker` | View → SECURITY INVOKER (was DEFINER) |
| 12 | `add_ai_cache_rls_policies` | Added service_role + authenticated read policies |
| 13 | `drop_orphaned_kv_store` | Dropped empty Figma artifact table |
| 14 | `fix_organizations_insert_policy` | Split into service_role + authenticated |
| 15 | `move_vector_extension_to_extensions_schema` | vector → extensions schema |
| 16 | `create_kv_table_283466b6` | (auto-created, re-dropped via SQL) |
| 17 | `consolidate_duplicate_permissive_policies` | Removed 7 FOR ALL duplicates |
| 18 | `add_context_snapshots_write_policies` | Restored INSERT/UPDATE/DELETE after FOR ALL removal |
| 19 | `fix_auth_uid_subquery_caching` | Wrapped bare auth.uid() in (select ...) for roadmaps + roadmap_phases |
| 20 | `add_user_id_to_wizard_sessions` | Added user_id column + user-scoped policies |
| 21 | `consolidate_wizard_sessions_anon_insert` | Merged 2 anon INSERT policies into 1 |

## Edge Function Fixes

| Function | Change |
|----------|--------|
| `onboarding-agent` v3 | `verify_jwt: true`, stub 503 (wrong schema — needs rewrite for sunai) |

## File Fixes

| File | Change |
|------|--------|
| `.cursor/rules/supabase/supabase-auth.mdc` | Project ID → `necxcwhuzylsumlkkmlk`, client path → `src/lib/supabase.ts` |

## Verification Results (all PASS)

```
Fix 1:  SECURITY INVOKER view .................. PASS
Fix 2:  ai_cache policies >=2 .................. PASS
Fix 3:  kv_store dropped ....................... PASS
Fix 4:  organizations INSERT ................... PASS
Fix 5:  Leaked password protection ............. MANUAL (Dashboard setting)
Fix 6:  vector in extensions ................... PASS
Fix 7:  0 FOR ALL duplicates ................... PASS
Fix 7b: 0 bare auth.uid() ..................... PASS
Fix 7c: context_snapshots write policies ....... PASS
Fix 8:  onboarding-agent verify_jwt ............ PASS (v3 deployed)
Fix 9:  cursor rules project ID ................ PASS
Fix 10: wizard_sessions.user_id ................ PASS
Fix 10b: anon insert consolidated .............. PASS
```

## Remaining Manual Action

- **Enable leaked password protection**: Supabase Dashboard → Authentication → Settings → Security → Toggle ON

## Remaining Non-Critical Items (future work)

- **Rewrite onboarding-agent** for sunai schema (missing tables: ai_runs, startups, user_roles)
- **168 unused indexes** flagged by performance advisor — review and drop
- **1 duplicate index** — identify and drop
- **storage.objects policies** still use bare auth.uid() (storage schema, not public)
- **Wire frontend flows** to existing triggers: handle_client_onboarding, handle_dashboard_activation, handle_new_crm_interaction
- **Implement missing workflows**: lead qualification, health check CRON, report generation, stale deal alerts
