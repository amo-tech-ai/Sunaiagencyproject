                                                                                               
● Here's the complete review of /home/sk/sunv2/supabase/.                                                
                                                                                                         
  Supabase Directory Review                                                                              
                                                                                                         
  File Inventory                                                                                         
                                                                                                         
  ┌───────────────────────────┬───────────┬──────────────────────────────────────────────────────────┐   
  │           File            │   Size    │                         Purpose                          │
  ├───────────────────────────┼───────────┼──────────────────────────────────────────────────────────┤
  │ supabase.md               │ 475 lines │ Table column reference (31 tables)                       │
  ├───────────────────────────┼───────────┼──────────────────────────────────────────────────────────┤
  │ schema.sql                │ 5,895     │ Full schema dump (tables, indexes, policies, functions,  │
  │                           │ lines     │ triggers)                                                │
  ├───────────────────────────┼───────────┼──────────────────────────────────────────────────────────┤
  │ dumps/schema.sql          │ 1,188     │ Cleaner MCP-generated dump (same tables + functions +    │
  │                           │ lines     │ triggers + policies)                                     │
  ├───────────────────────────┼───────────┼──────────────────────────────────────────────────────────┤
  │ config.toml               │ 386 lines │ Local dev config (linked to necxcwhuzylsumlkkmlk)        │
  ├───────────────────────────┼───────────┼──────────────────────────────────────────────────────────┤
  │ seed.sql                  │ 2 lines   │ Empty — no seed data                                     │
  ├───────────────────────────┼───────────┼──────────────────────────────────────────────────────────┤
  │ test-cli.sh               │ 19 lines  │ CLI smoke test (version, link, migration check)          │
  ├───────────────────────────┼───────────┼──────────────────────────────────────────────────────────┤
  │ README-LOCAL.md           │ 84 lines  │ Port conflict docs, Docker socket fix                    │
  ├───────────────────────────┼───────────┼──────────────────────────────────────────────────────────┤
  │ .temp/project-ref         │ 1 line    │ necxcwhuzylsumlkkmlk                                     │
  ├───────────────────────────┼───────────┼──────────────────────────────────────────────────────────┤
  │ .branches/_current_branch │ —         │ Branch tracking                                          │
  └───────────────────────────┴───────────┴──────────────────────────────────────────────────────────┘

  What supabase.md Covers

  All 31 tables with column-level detail — accurate and matches both schema SQL files. Organized into 8
  sections:

  ┌───────────────────┬──────────────────────────────────────────────────────────────────────────────┐
  │      Section      │                                    Tables                                    │
  ├───────────────────┼──────────────────────────────────────────────────────────────────────────────┤
  │ Core /            │ organizations, profiles, team_members                                        │
  │ Multi-Tenant      │                                                                              │
  ├───────────────────┼──────────────────────────────────────────────────────────────────────────────┤
  │ Clients & CRM     │ clients, crm_contacts, crm_pipelines, crm_stages, crm_deals,                 │
  │                   │ crm_interactions, activities                                                 │
  ├───────────────────┼──────────────────────────────────────────────────────────────────────────────┤
  │ Projects &        │ projects, deliverables, milestones, tasks                                    │
  │ Delivery          │                                                                              │
  ├───────────────────┼──────────────────────────────────────────────────────────────────────────────┤
  │ Strategic         │ briefs, brief_versions, context_snapshots, roadmaps, roadmap_phases          │
  │ Planning          │                                                                              │
  ├───────────────────┼──────────────────────────────────────────────────────────────────────────────┤
  │ Discovery Wizard  │ wizard_sessions, wizard_answers                                              │
  ├───────────────────┼──────────────────────────────────────────────────────────────────────────────┤
  │ Services &        │ services, systems, system_services, project_services, project_systems        │
  │ Systems           │                                                                              │
  ├───────────────────┼──────────────────────────────────────────────────────────────────────────────┤
  │ Documents         │ documents                                                                    │
  ├───────────────────┼──────────────────────────────────────────────────────────────────────────────┤
  │ Financial         │ invoices, payments                                                           │
  ├───────────────────┼──────────────────────────────────────────────────────────────────────────────┤
  │ AI / Logging      │ ai_cache, ai_run_logs                                                        │
  └───────────────────┴──────────────────────────────────────────────────────────────────────────────┘

  What supabase.md is MISSING

  The file is a column reference only. It doesn't document these critical schema components that exist in
   schema.sql:

  10 Functions:

  ┌────────────────────────────────────┬─────────┬───────────────────────────────────────────────────┐
  │              Function              │  Type   │                      Purpose                      │
  ├────────────────────────────────────┼─────────┼───────────────────────────────────────────────────┤
  │ get_user_org_ids()                 │ SQL     │ Returns org_ids for current user — used in RLS    │
  │                                    │         │ policies                                          │
  ├────────────────────────────────────┼─────────┼───────────────────────────────────────────────────┤
  │ user_is_org_owner(org_id)          │ SQL     │ Owner check — used in RLS                         │
  ├────────────────────────────────────┼─────────┼───────────────────────────────────────────────────┤
  │ user_has_role_in_org(org_id,       │ SQL     │ Role check — used in RLS                          │
  │ roles)                             │         │                                                   │
  ├────────────────────────────────────┼─────────┼───────────────────────────────────────────────────┤
  │ handle_new_user()                  │ Trigger │ Auto-creates profile row on auth.users insert     │
  ├────────────────────────────────────┼─────────┼───────────────────────────────────────────────────┤
  │ update_updated_at()                │ Trigger │ Auto-updates updated_at on row modify             │
  ├────────────────────────────────────┼─────────┼───────────────────────────────────────────────────┤
  │ handle_wizard_completion()         │ Trigger │ Sets wizard_completed_at when step reaches 5      │
  ├────────────────────────────────────┼─────────┼───────────────────────────────────────────────────┤
  │ handle_client_onboarding()         │ Trigger │ Sets onboarded_at when status becomes 'client'    │
  ├────────────────────────────────────┼─────────┼───────────────────────────────────────────────────┤
  │ handle_dashboard_activation()      │ Trigger │ Sets dashboard_activated_at on first roadmap      │
  ├────────────────────────────────────┼─────────┼───────────────────────────────────────────────────┤
  │ handle_new_crm_interaction()       │ Trigger │ Updates clients.last_activity_at on new           │
  │                                    │         │ interaction                                       │
  ├────────────────────────────────────┼─────────┼───────────────────────────────────────────────────┤
  │ get_client_classification(id)      │ RPC     │ Returns client lifecycle classification as JSONB  │
  └────────────────────────────────────┴─────────┴───────────────────────────────────────────────────┘

  29 Triggers — update_*_updated_at on most tables, plus 4 business triggers:
  - on_client_status_update → handle_client_onboarding()
  - on_crm_interaction_insert → handle_new_crm_interaction()
  - on_roadmap_created → handle_dashboard_activation()
  - on_wizard_step_update → handle_wizard_completion()

  165 Indexes — comprehensive GIN indexes on JSONB columns, composite indexes for common queries

  2 Custom Enum Types:
  - crm_interaction_type (email, call, meeting, note, linkedin, system)
  - crm_sentiment (positive, neutral, negative, churn_risk)

  6 Extensions: pg_graphql, pg_stat_statements, pgcrypto, supabase_vault, uuid-ossp, vector (pgvector)

  ~100 RLS Policies — three-tier access model:
  - anon — blocked on all tables except read-only on services/systems/system_services
  - authenticated — org-scoped CRUD via team_members subquery
  - Owner/Consultant — elevated CRUD on CRM, financial, delivery tables

  Previous Audit Corrections

  The index-progress.md v2.0 I wrote earlier had some errors based on the live MCP queries. Comparing
  against the local schema files:

  ┌────────────────────────────────┬─────────────────────────────────────────────────────────────────┐
  │         Previous Claim         │                    Reality (from schema.sql)                    │
  ├────────────────────────────────┼─────────────────────────────────────────────────────────────────┤
  │ onboarding_sessions table      │ Not in schema.sql — may have been dropped or misidentified      │
  │ exists                         │                                                                 │
  ├────────────────────────────────┼─────────────────────────────────────────────────────────────────┤
  │ onboarding_responses table     │ Not in schema.sql                                               │
  │ exists                         │                                                                 │
  ├────────────────────────────────┼─────────────────────────────────────────────────────────────────┤
  │ payment_intents table exists   │ Not in schema.sql — payments exists instead                     │
  ├────────────────────────────────┼─────────────────────────────────────────────────────────────────┤
  │ contacts and deals as separate │ They are crm_contacts and crm_deals                             │
  │  tables                        │                                                                 │
  ├────────────────────────────────┼─────────────────────────────────────────────────────────────────┤
  │ "Duplicate RLS policies on     │ Actually correct design — self-access (id = auth.uid()) +       │
  │ profiles"                      │ org-member access policies serve different purposes             │
  ├────────────────────────────────┼─────────────────────────────────────────────────────────────────┤
  │ "roadmaps/roadmap_phases       │ Confirmed — no INSERT/UPDATE/DELETE for authenticated users. By │
  │ SELECT only"                   │  design: edge functions write these via service_role            │
  ├────────────────────────────────┼─────────────────────────────────────────────────────────────────┤
  │ "ai_cache/ai_run_logs SELECT   │ Confirmed — edge functions write, users only read. Correct      │
  │ only"                          │ pattern                                                         │
  └────────────────────────────────┴─────────────────────────────────────────────────────────────────┘

  RLS Policy Gaps (real issues)

  ┌─────────────────┬───────────────────────────────────────────────┬────────────────────────────────┐
  │      Table      │                     Issue                     │            Severity            │
  ├─────────────────┼───────────────────────────────────────────────┼────────────────────────────────┤
  │ wizard_sessions │ temp_anon_* policies allow anonymous          │ 🔴 High                        │
  │                 │ SELECT/INSERT/UPDATE                          │                                │
  ├─────────────────┼───────────────────────────────────────────────┼────────────────────────────────┤
  │ wizard_answers  │ temp_anon_* policies allow anonymous          │ 🔴 High                        │
  │                 │ SELECT/INSERT/UPDATE                          │                                │
  ├─────────────────┼───────────────────────────────────────────────┼────────────────────────────────┤
  │ brief_versions  │ No UPDATE policy (can insert versions but     │ 🟡 Low — append-only is        │
  │                 │ never update)                                 │ arguably correct               │
  └─────────────────┴───────────────────────────────────────────────┴────────────────────────────────┘

  Other Issues

  1. seed.sql is empty — no local dev seed data despite 3 orgs/8 users in production
  2. config.toml has schema_paths = [] — no schema file paths configured for migrations
  3. 0 migration files in supabase/migrations/ — all schema created via dashboard
  4. No supabase/functions/ directory — edge functions not in this local structure

  Recommendations

  1. Add functions/triggers/types/extensions section to supabase.md — the 10 functions and business
  triggers are critical knowledge
  2. Remove temp_anon_* policies before any wizard development
  3. Create a proper seed.sql from the existing test data for local dev
  4. Export a baseline migration (supabase db pull) to make schema reproducible

  Want me to update supabase.md to include the missing sections (functions, triggers, types, extensions,
  RLS summary)?

✻ Worked for 2m 32s  