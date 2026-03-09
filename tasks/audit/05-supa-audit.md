                                                                                                               
  SUPABASE AUDIT REPORT — sunai (necxcwhuzylsumlkkmlk)                                                                     
                                                                                                                           
  Database Overview                                                                                                      

  ┌──────────────────┬───────────────────────────────────────────────────────────────┐
  │      Metric      │                             Value                             │
  ├──────────────────┼───────────────────────────────────────────────────────────────┤
  │ Tables           │ 32 (all RLS enabled)                                          │
  ├──────────────────┼───────────────────────────────────────────────────────────────┤
  │ Edge Functions   │ 20 deployed                                                   │
  ├──────────────────┼───────────────────────────────────────────────────────────────┤
  │ Custom Functions │ 12 (+ pgvector functions)                                     │
  ├──────────────────┼───────────────────────────────────────────────────────────────┤
  │ Triggers         │ 31                                                            │
  ├──────────────────┼───────────────────────────────────────────────────────────────┤
  │ FK Indexes       │ All FKs have indexes                                          │
  ├──────────────────┼───────────────────────────────────────────────────────────────┤
  │ Rows             │ profiles: 2, team_members: 8, wizard_sessions: 5 (rest empty) │
  └──────────────────┴───────────────────────────────────────────────────────────────┘

  ---
  CRITICAL ISSUES (fix before production)

  1. ai_cache and kv_store_283466b6 — RLS enabled, ZERO policies

  These tables are completely inaccessible via PostgREST. kv_store_283466b6 is a Figma Make artifact (drop it). ai_cache
  needs SELECT/INSERT/UPDATE policies for the edge functions to work through the client.

  2. client_crm_status view — SECURITY DEFINER (ERROR level)

  This view runs with the creator's permissions, bypassing RLS for any caller. Should be SECURITY INVOKER so the querying
  user's RLS policies apply.

  3. organizations INSERT policy — always true WITH CHECK

  Policy Anyone can create their own organization uses WITH CHECK (true) — any authenticated user can create unlimited
  organizations. Should check auth.uid() matches a field.

  4. Leaked Password Protection DISABLED

  Supabase can check passwords against HaveIBeenPwned. Currently disabled.

  5. vector extension in public schema

  Should be moved to a dedicated extensions schema to prevent potential privilege escalation.

  6. Anonymous sign-ins enabled — 30+ tables exposed

  Supabase has anonymous sign-ins enabled, meaning anon role policies on 30 tables apply to unauthenticated users. Most
  tables correctly block anon with false policies, but this is a broad attack surface.

  ---
  WARNING ISSUES

  7. Multiple permissive policies (20 instances)

  Tables clients, projects, wizard_sessions, wizard_answers, team_members, profiles, context_snapshots have overlapping
  permissive policies for the same role+action. Permissive policies OR together — this can inadvertently widen access.

  Affected tables:
  - clients — 4 actions with duplicate policies
  - projects — 4 actions with duplicate policies
  - wizard_sessions — 4 actions with duplicate policies
  - wizard_answers — 4 actions with duplicate policies
  - team_members — 2 actions
  - profiles — SELECT has duplicates
  - context_snapshots — SELECT has duplicates

  8. RLS auth.uid() re-evaluation (13 instances)

  Policies on team_members, wizard_sessions, wizard_answers, clients, projects, context_snapshots, roadmaps, roadmap_phases
   use (SELECT auth.uid()) patterns that force re-evaluation. Use a subquery wrapper (SELECT auth.uid()) to cache the value
   (some already do, but inconsistently).

  9. 168 unused indexes

  Performance advisor flags 168 indexes that have never been used. These consume storage and slow writes. Review and drop
  unused ones.

  10. 1 duplicate index

  One index is redundant — duplicates another.

  ---
  EDGE FUNCTION AUDIT

  ┌────────────────────┬─────────────────────────────────────────────────────────────────────────────────┬────────────┐
  │      Category      │                                    Functions                                    │    JWT     │
  │                    │                                                                                 │  Required  │
  ├────────────────────┼─────────────────────────────────────────────────────────────────────────────────┼────────────┤
  │ Wizard (5)         │ analyze-business, generate-diagnostics, recommend-systems, assess-readiness,    │ No         │
  │                    │ generate-roadmap                                                                │            │
  ├────────────────────┼─────────────────────────────────────────────────────────────────────────────────┼────────────┤
  │ AI Agents (10)     │ analyst, extractor, optimizer, summary, scorer, planner, orchestrator,          │ Yes        │
  │                    │ analytics, monitor, assistant                                                   │            │
  ├────────────────────┼─────────────────────────────────────────────────────────────────────────────────┼────────────┤
  │ CRM/Intelligence   │ crm-intelligence, intelligence-stream, task-generator                           │ Yes        │
  │ (3)                │                                                                                 │            │
  ├────────────────────┼─────────────────────────────────────────────────────────────────────────────────┼────────────┤
  │ Onboarding (1)     │ onboarding-agent                                                                │ No         │
  ├────────────────────┼─────────────────────────────────────────────────────────────────────────────────┼────────────┤
  │ Infrastructure (1) │ make-server-283466b6                                                            │ Yes        │
  └────────────────────┴─────────────────────────────────────────────────────────────────────────────────┴────────────┘

  Red flags:
  - Wizard functions have verify_jwt: false — intentional for pre-auth wizard flow, but they should validate input to
  prevent abuse
  - onboarding-agent has verify_jwt: false — should require JWT since it handles post-auth onboarding
  - All 20 functions reference /home/sk/sunaiv18/ entrypoint paths — stale local paths, no impact on deployed code but
  indicates old deploy source

  ---
  CURSOR RULES vs ACTUAL STATE

  ┌────────────────────────────────────────────────────┬────────────┬──────────────────────────────────────────────────┐
  │                        Rule                        │ Compliance │                      Issue                       │
  ├────────────────────────────────────────────────────┼────────────┼──────────────────────────────────────────────────┤
  │ Auth rule references yvyesmiczbjqwbqtlidy          │ WRONG      │ Should reference necxcwhuzylsumlkkmlk (sunai)    │
  │ (startupai project)                                │            │                                                  │
  ├────────────────────────────────────────────────────┼────────────┼──────────────────────────────────────────────────┤
  │ Auth rule uses VITE_SUPABASE_ANON_KEY env var      │ MISMATCH   │ Code uses projectId + publicAnonKey from         │
  │                                                    │            │ utils/supabase/info                              │
  ├────────────────────────────────────────────────────┼────────────┼──────────────────────────────────────────────────┤
  │ RLS rule says use auth.uid() subquery              │ PARTIAL    │ 13 policies don't wrap in subquery               │
  ├────────────────────────────────────────────────────┼────────────┼──────────────────────────────────────────────────┤
  │ Migration rule says use supabase migration new     │ OK         │ Migrations exist in supabase/migrations/         │
  ├────────────────────────────────────────────────────┼────────────┼──────────────────────────────────────────────────┤
  │ Edge function rule says use Deno/Hono pattern      │ OK         │ Functions follow JSR Hono pattern                │
  ├────────────────────────────────────────────────────┼────────────┼──────────────────────────────────────────────────┤
  │ Schema rule says use snake_case                    │ OK         │ All tables/columns use snake_case                │
  ├────────────────────────────────────────────────────┼────────────┼──────────────────────────────────────────────────┤
  │ DB functions rule says SECURITY DEFINER sparingly  │ VIOLATED   │ client_crm_status view is SECURITY DEFINER       │
  └────────────────────────────────────────────────────┴────────────┴──────────────────────────────────────────────────┘

  ---
  WORKFLOW & USER JOURNEY GAPS

  ┌───────────────────────┬──────────────┬────────────────────────────────────────────────────────────────────────────┐
  │       Workflow        │    Status    │                                    Gap                                     │
  ├───────────────────────┼──────────────┼────────────────────────────────────────────────────────────────────────────┤
  │ Wizard -> Auth ->     │ Partially    │ handle_wizard_completion trigger exists but wizard sessions have no        │
  │ Dashboard             │ wired        │ user_id column — can't link wizard to user after signup                    │
  ├───────────────────────┼──────────────┼────────────────────────────────────────────────────────────────────────────┤
  │ New user -> org ->    │ Working      │ handle_new_user trigger creates profile + org + team_member                │
  │ team_member           │              │                                                                            │
  ├───────────────────────┼──────────────┼────────────────────────────────────────────────────────────────────────────┤
  │ Client onboarding     │ Trigger      │ handle_client_onboarding fires on client UPDATE but no frontend calls it   │
  │                       │ exists       │                                                                            │
  ├───────────────────────┼──────────────┼────────────────────────────────────────────────────────────────────────────┤
  │ Dashboard activation  │ Trigger      │ handle_dashboard_activation fires on roadmap INSERT — no frontend flow     │
  │                       │ exists       │ triggers this                                                              │
  ├───────────────────────┼──────────────┼────────────────────────────────────────────────────────────────────────────┤
  │ CRM interaction       │ Trigger      │ handle_new_crm_interaction fires on INSERT — no CRM UI to create           │
  │ logging               │ exists       │ interactions                                                               │
  ├───────────────────────┼──────────────┼────────────────────────────────────────────────────────────────────────────┤
  │ Realtime: AI runs     │ Working      │ broadcast_ai_run_insert trigger -> realtime channel                        │
  ├───────────────────────┼──────────────┼────────────────────────────────────────────────────────────────────────────┤
  │ Realtime: Wizard      │ Working      │ broadcast_wizard_update trigger -> realtime channel                        │
  │ progress              │              │                                                                            │
  ├───────────────────────┼──────────────┼────────────────────────────────────────────────────────────────────────────┤
  │ Lead qualification    │ NOT          │ No edge function or trigger                                                │
  │ workflow              │ IMPLEMENTED  │                                                                            │
  ├───────────────────────┼──────────────┼────────────────────────────────────────────────────────────────────────────┤
  │ Health check          │ NOT          │ No CRON or scheduled function                                              │
  │ automation            │ IMPLEMENTED  │                                                                            │
  ├───────────────────────┼──────────────┼────────────────────────────────────────────────────────────────────────────┤
  │ Report generation     │ NOT          │ No edge function                                                           │
  │                       │ IMPLEMENTED  │                                                                            │
  └───────────────────────┴──────────────┴────────────────────────────────────────────────────────────────────────────┘

  ---
  AUTOMATION GAPS

  ┌─────────────────────────┬──────────────────────────────────────┬───────────────────────────────────────────────────┐
  │       Automation        │               Expected               │                      Actual                       │
  ├─────────────────────────┼──────────────────────────────────────┼───────────────────────────────────────────────────┤
  │ Wizard completion ->    │ handle_wizard_completion creates     │ Trigger exists, but wizard current_step must      │
  │ client creation         │ client + project                     │ reach 5 to fire — untested path                   │
  ├─────────────────────────┼──────────────────────────────────────┼───────────────────────────────────────────────────┤
  │ Deal won -> client      │ Should auto-update lifecycle_stage   │ handle_client_onboarding only fires on client     │
  │ onboarding              │                                      │ UPDATE, not deal status change                    │
  ├─────────────────────────┼──────────────────────────────────────┼───────────────────────────────────────────────────┤
  │ CRON health checks      │ Weekly client health scoring         │ No pg_cron or scheduled edge function exists      │
  ├─────────────────────────┼──────────────────────────────────────┼───────────────────────────────────────────────────┤
  │ Auto-qualify leads      │ Score > 70 -> advance to 'prospect'  │ No implementation                                 │
  ├─────────────────────────┼──────────────────────────────────────┼───────────────────────────────────────────────────┤
  │ Stale deal alerts       │ Flag deals inactive > 14 days        │ No implementation                                 │
  └─────────────────────────┴──────────────────────────────────────┴───────────────────────────────────────────────────┘

  ---
  RECOMMENDED FIXES (priority order)

  1. Fix client_crm_status view — Change to SECURITY INVOKER
  2. Add ai_cache RLS policies — Allow authenticated users to read/write cached AI results
  3. Drop kv_store_283466b6 — Unused Figma artifact
  4. Fix organizations INSERT policy — Add proper WITH CHECK
  5. Enable leaked password protection — One-click in Supabase dashboard
  6. Move vector extension to extensions schema
  7. Consolidate duplicate permissive policies on clients, projects, wizard tables
  8. Fix onboarding-agent — Enable JWT verification
  9. Fix cursor rules — Update project ID reference from startupai to sunai
  10. Add user_id to wizard_sessions — Enable wizard-to-user linking after auth

  Want me to apply the critical fixes (items 1-6) as migrations now?

✻ Cooked for 2m 7s                                       

● Agent "Read all Supabase rules files" completed           