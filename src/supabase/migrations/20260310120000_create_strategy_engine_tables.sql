-- =============================================================================
-- Migration: 20260310120000_create_strategy_engine_tables.sql
-- Purpose:   Create 12 tables for the Lean Strategy Engine
--            6 core (lean_canvases, versions, insights, opportunities, recs, actions)
--            6 advanced (events, triggers, agent_memory, signals, roles, budgets)
-- Depends:   handle_updated_at() from 20260307120200
-- Ref:       tasks/lean/16-supabase-database-plan.md
-- Safety:    create table if not exists — idempotent, no destructive operations
-- =============================================================================

-- =============================================================================
-- CORE TABLES (6)
-- =============================================================================

-- 1. lean_canvases — central hub with 9 jsonb block columns
create table if not exists public.lean_canvases (
  id                 uuid        primary key default gen_random_uuid(),
  session_id         text,
  project_id         uuid,
  user_id            uuid,
  version            integer     not null default 1,
  is_current         boolean     not null default true,
  problem            jsonb       not null default '[]'::jsonb,
  customer_segments  jsonb       not null default '[]'::jsonb,
  value_proposition  jsonb       not null default '[]'::jsonb,
  solution           jsonb       not null default '[]'::jsonb,
  channels           jsonb       not null default '[]'::jsonb,
  revenue_streams    jsonb       not null default '[]'::jsonb,
  cost_structure     jsonb       not null default '[]'::jsonb,
  key_metrics        jsonb       not null default '[]'::jsonb,
  unfair_advantage   jsonb       not null default '[]'::jsonb,
  metadata           jsonb       not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

comment on table public.lean_canvases is 'Central Lean Canvas table — one row per canvas, 9 jsonb block columns for the lean model.';

create index if not exists idx_canvas_user    on public.lean_canvases (user_id);
create index if not exists idx_canvas_session on public.lean_canvases (session_id);
create index if not exists idx_canvas_project on public.lean_canvases (project_id);
create index if not exists idx_canvas_current on public.lean_canvases (is_current) where is_current = true;

-- 2. lean_canvas_versions — immutable snapshots for version history
create table if not exists public.lean_canvas_versions (
  id              uuid        primary key default gen_random_uuid(),
  canvas_id       uuid        not null references public.lean_canvases (id) on delete cascade,
  version         integer     not null,
  snapshot        jsonb       not null,
  change_summary  text,
  changed_by      text,
  created_at      timestamptz not null default now(),
  unique (canvas_id, version)
);

comment on table public.lean_canvas_versions is 'Immutable canvas snapshots — one row per version, enables revert and history view.';

create index if not exists idx_canvas_versions_canvas_id
  on public.lean_canvas_versions (canvas_id);

-- 3. strategy_insights — ai-generated observations (auto-approved, dismissable)
create table if not exists public.strategy_insights (
  id              uuid        primary key default gen_random_uuid(),
  canvas_id       uuid        references public.lean_canvases (id) on delete set null,
  session_id      text,
  agent_name      text        not null,
  insight_type    text        not null,
  title           text        not null,
  description     text        not null,
  priority        text        not null default 'medium',
  impact_score    numeric,
  confidence      numeric,
  data_sources    jsonb       not null default '[]'::jsonb,
  status          text        not null default 'draft'
                  check (status in ('draft', 'approved', 'dismissed', 'acted_on')),
  action_taken    text,
  created_at      timestamptz not null default now(),
  expires_at      timestamptz
);

comment on table public.strategy_insights is 'AI-generated business observations — trends, risks, opportunities. Dismissable by user.';

create index if not exists idx_insight_canvas on public.strategy_insights (canvas_id);
create index if not exists idx_insight_status on public.strategy_insights (status);

-- 4. automation_opportunities — scored automation candidates
create table if not exists public.automation_opportunities (
  id                  uuid        primary key default gen_random_uuid(),
  canvas_id           uuid        references public.lean_canvases (id) on delete set null,
  session_id          text,
  title               text        not null,
  description         text        not null,
  process_area        text,
  current_state       text,
  proposed_state      text,
  impact_score        integer     not null default 50,
  roi_estimate        text,
  complexity          text        not null default 'medium',
  estimated_weeks     integer,
  estimated_cost      text,
  recommended_system  text,
  status              text        not null default 'detected'
                      check (status in ('detected', 'evaluating', 'approved', 'in_progress', 'completed', 'dismissed')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table public.automation_opportunities is 'Detected automation opportunities — scored by impact, roi, and complexity.';

create index if not exists idx_opp_canvas on public.automation_opportunities (canvas_id);
create index if not exists idx_opp_status on public.automation_opportunities (status);

-- 5. strategy_recommendations — ai recs requiring human approval (governance layer)
create table if not exists public.strategy_recommendations (
  id                   uuid        primary key default gen_random_uuid(),
  canvas_id            uuid        references public.lean_canvases (id) on delete set null,
  session_id           text,
  agent_name           text        not null,
  recommendation_type  text        not null,
  title                text        not null,
  rationale            text        not null,
  proposed_changes     jsonb       not null default '{}'::jsonb,
  approval_status      text        not null default 'pending'
                       check (approval_status in ('pending', 'approved', 'rejected', 'auto_approved', 'archived')),
  approved_by          uuid,
  approved_at          timestamptz,
  created_at           timestamptz not null default now()
);

comment on table public.strategy_recommendations is 'AI recommendations that require human approval before taking effect.';

create index if not exists idx_rec_canvas on public.strategy_recommendations (canvas_id);
create index if not exists idx_rec_status on public.strategy_recommendations (approval_status);

-- 6. strategy_actions — audit log for every ai agent action (append-only)
create table if not exists public.strategy_actions (
  id              uuid        primary key default gen_random_uuid(),
  canvas_id       uuid        references public.lean_canvases (id) on delete set null,
  session_id      text,
  agent_name      text        not null,
  action_type     text        not null,
  input_summary   text,
  output_summary  text,
  tokens_used     integer     not null default 0,
  duration_ms     integer     not null default 0,
  success         boolean     not null default true,
  error_message   text,
  created_at      timestamptz not null default now()
);

comment on table public.strategy_actions is 'Audit log — one row per ai agent action with tokens, timing, and success/failure.';

create index if not exists idx_action_canvas on public.strategy_actions (canvas_id);
create index if not exists idx_action_agent  on public.strategy_actions (agent_name);

-- =============================================================================
-- ADVANCED TABLES (6) — phase 2 infrastructure, created now for schema parity
-- =============================================================================

-- 7. strategy_events — event bus (log only in phase 1)
create table if not exists public.strategy_events (
  id              uuid        primary key default gen_random_uuid(),
  canvas_id       uuid        references public.lean_canvases (id) on delete set null,
  event_type      text        not null,
  source_table    text        not null,
  source_id       text,
  payload         jsonb       not null default '{}'::jsonb,
  processed       boolean     not null default false,
  processed_at    timestamptz,
  created_at      timestamptz not null default now()
);

comment on table public.strategy_events is 'Event bus for reactive triggers — log only in phase 1.';

create index if not exists idx_event_unprocessed
  on public.strategy_events (processed, created_at) where processed = false;
create index if not exists idx_event_canvas
  on public.strategy_events (canvas_id);

-- 8. strategy_event_triggers — agent-event subscriptions (all disabled in phase 1)
create table if not exists public.strategy_event_triggers (
  id                  uuid        primary key default gen_random_uuid(),
  event_type          text        not null,
  agent_name          text        not null,
  enabled             boolean     not null default false,
  cooldown_minutes    integer     not null default 60,
  last_triggered_at   timestamptz,
  created_at          timestamptz not null default now(),
  unique (event_type, agent_name)
);

comment on table public.strategy_event_triggers is 'Maps event types to agent handlers — all disabled in phase 1.';

-- 9. strategy_agent_memory — per-agent context continuity
create table if not exists public.strategy_agent_memory (
  id              uuid        primary key default gen_random_uuid(),
  canvas_id       uuid        not null references public.lean_canvases (id) on delete cascade,
  agent_name      text        not null,
  memory_type     text        not null,
  content         jsonb       not null,
  relevance_score numeric     not null default 1.0,
  superseded_by   uuid        references public.strategy_agent_memory (id),
  created_at      timestamptz not null default now(),
  expires_at      timestamptz
);

comment on table public.strategy_agent_memory is 'Per-agent memory — loaded before each analysis for context continuity.';

create index if not exists idx_memory_canvas_agent
  on public.strategy_agent_memory (canvas_id, agent_name);
create index if not exists idx_memory_superseded_by
  on public.strategy_agent_memory (superseded_by) where superseded_by is not null;

-- 10. strategy_signals — business metric tracking
create table if not exists public.strategy_signals (
  id               uuid        primary key default gen_random_uuid(),
  canvas_id        uuid        references public.lean_canvases (id) on delete set null,
  signal_category  text        not null,
  signal_name      text        not null,
  value            numeric     not null,
  previous_value   numeric,
  unit             text        not null default '',
  trend            text        not null default 'stable',
  source           text,
  collected_at     timestamptz not null default now()
);

comment on table public.strategy_signals is 'Business metric signals — populated during each analysis run.';

create index if not exists idx_signal_canvas on public.strategy_signals (canvas_id);

-- 11. strategy_roles — multi-user canvas access control
create table if not exists public.strategy_roles (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null,
  canvas_id       uuid        not null references public.lean_canvases (id) on delete cascade,
  role            text        not null check (role in ('admin', 'strategist', 'viewer')),
  created_at      timestamptz not null default now(),
  unique (user_id, canvas_id)
);

comment on table public.strategy_roles is 'RBAC for canvas access — auto-assigned admin on canvas creation.';

create index if not exists idx_roles_canvas
  on public.strategy_roles (canvas_id);

-- 12. strategy_budgets — token budget + rate limiting (one per canvas)
create table if not exists public.strategy_budgets (
  id                            uuid        primary key default gen_random_uuid(),
  canvas_id                     uuid        not null references public.lean_canvases (id) on delete cascade,
  monthly_token_limit           integer     not null default 500000,
  tokens_used_this_month        integer     not null default 0,
  analysis_count_this_month     integer     not null default 0,
  max_analyses_per_day          integer     not null default 5,
  analyses_today                integer     not null default 0,
  last_analysis_at              timestamptz,
  min_analysis_interval_minutes integer     not null default 30,
  budget_month                  text,
  created_at                    timestamptz not null default now(),
  updated_at                    timestamptz not null default now()
);

comment on table public.strategy_budgets is 'Token budget and rate-limit config — one row per canvas.';

create index if not exists idx_budgets_canvas
  on public.strategy_budgets (canvas_id);

-- =============================================================================
-- RLS POLICIES — enable on all 12 tables with authenticated CRUD
-- Edge functions use adminClient() (service_role) which bypasses RLS.
-- Naming: {table}_{op}_authenticated for consistency with other migrations.
-- =============================================================================

-- lean_canvases
alter table public.lean_canvases enable row level security;
create policy "lean_canvases_select_authenticated" on public.lean_canvases for select to authenticated using (true);
create policy "lean_canvases_insert_authenticated" on public.lean_canvases for insert to authenticated with check (true);
create policy "lean_canvases_update_authenticated" on public.lean_canvases for update to authenticated using (true) with check (true);
create policy "lean_canvases_delete_authenticated" on public.lean_canvases for delete to authenticated using (true);

-- lean_canvas_versions (immutable snapshots — no update/delete in normal use, but CRUD for admin)
alter table public.lean_canvas_versions enable row level security;
create policy "lean_canvas_versions_select_authenticated" on public.lean_canvas_versions for select to authenticated using (true);
create policy "lean_canvas_versions_insert_authenticated" on public.lean_canvas_versions for insert to authenticated with check (true);
create policy "lean_canvas_versions_update_authenticated" on public.lean_canvas_versions for update to authenticated using (true) with check (true);
create policy "lean_canvas_versions_delete_authenticated" on public.lean_canvas_versions for delete to authenticated using (true);

-- strategy_insights
alter table public.strategy_insights enable row level security;
create policy "strategy_insights_select_authenticated" on public.strategy_insights for select to authenticated using (true);
create policy "strategy_insights_insert_authenticated" on public.strategy_insights for insert to authenticated with check (true);
create policy "strategy_insights_update_authenticated" on public.strategy_insights for update to authenticated using (true) with check (true);
create policy "strategy_insights_delete_authenticated" on public.strategy_insights for delete to authenticated using (true);

-- automation_opportunities
alter table public.automation_opportunities enable row level security;
create policy "automation_opportunities_select_authenticated" on public.automation_opportunities for select to authenticated using (true);
create policy "automation_opportunities_insert_authenticated" on public.automation_opportunities for insert to authenticated with check (true);
create policy "automation_opportunities_update_authenticated" on public.automation_opportunities for update to authenticated using (true) with check (true);
create policy "automation_opportunities_delete_authenticated" on public.automation_opportunities for delete to authenticated using (true);

-- strategy_recommendations
alter table public.strategy_recommendations enable row level security;
create policy "strategy_recommendations_select_authenticated" on public.strategy_recommendations for select to authenticated using (true);
create policy "strategy_recommendations_insert_authenticated" on public.strategy_recommendations for insert to authenticated with check (true);
create policy "strategy_recommendations_update_authenticated" on public.strategy_recommendations for update to authenticated using (true) with check (true);
create policy "strategy_recommendations_delete_authenticated" on public.strategy_recommendations for delete to authenticated using (true);

-- strategy_actions (append-only audit log — select + insert only for normal use, full CRUD via service_role)
alter table public.strategy_actions enable row level security;
create policy "strategy_actions_select_authenticated" on public.strategy_actions for select to authenticated using (true);
create policy "strategy_actions_insert_authenticated" on public.strategy_actions for insert to authenticated with check (true);

-- strategy_events
alter table public.strategy_events enable row level security;
create policy "strategy_events_select_authenticated" on public.strategy_events for select to authenticated using (true);
create policy "strategy_events_insert_authenticated" on public.strategy_events for insert to authenticated with check (true);
create policy "strategy_events_update_authenticated" on public.strategy_events for update to authenticated using (true) with check (true);
create policy "strategy_events_delete_authenticated" on public.strategy_events for delete to authenticated using (true);

-- strategy_event_triggers
alter table public.strategy_event_triggers enable row level security;
create policy "strategy_event_triggers_select_authenticated" on public.strategy_event_triggers for select to authenticated using (true);
create policy "strategy_event_triggers_insert_authenticated" on public.strategy_event_triggers for insert to authenticated with check (true);
create policy "strategy_event_triggers_update_authenticated" on public.strategy_event_triggers for update to authenticated using (true) with check (true);
create policy "strategy_event_triggers_delete_authenticated" on public.strategy_event_triggers for delete to authenticated using (true);

-- strategy_agent_memory
alter table public.strategy_agent_memory enable row level security;
create policy "strategy_agent_memory_select_authenticated" on public.strategy_agent_memory for select to authenticated using (true);
create policy "strategy_agent_memory_insert_authenticated" on public.strategy_agent_memory for insert to authenticated with check (true);
create policy "strategy_agent_memory_update_authenticated" on public.strategy_agent_memory for update to authenticated using (true) with check (true);
create policy "strategy_agent_memory_delete_authenticated" on public.strategy_agent_memory for delete to authenticated using (true);

-- strategy_signals (append-only metrics — select + insert only)
alter table public.strategy_signals enable row level security;
create policy "strategy_signals_select_authenticated" on public.strategy_signals for select to authenticated using (true);
create policy "strategy_signals_insert_authenticated" on public.strategy_signals for insert to authenticated with check (true);

-- strategy_roles
alter table public.strategy_roles enable row level security;
create policy "strategy_roles_select_authenticated" on public.strategy_roles for select to authenticated using (true);
create policy "strategy_roles_insert_authenticated" on public.strategy_roles for insert to authenticated with check (true);
create policy "strategy_roles_update_authenticated" on public.strategy_roles for update to authenticated using (true) with check (true);
create policy "strategy_roles_delete_authenticated" on public.strategy_roles for delete to authenticated using (true);

-- strategy_budgets
alter table public.strategy_budgets enable row level security;
create policy "strategy_budgets_select_authenticated" on public.strategy_budgets for select to authenticated using (true);
create policy "strategy_budgets_insert_authenticated" on public.strategy_budgets for insert to authenticated with check (true);
create policy "strategy_budgets_update_authenticated" on public.strategy_budgets for update to authenticated using (true) with check (true);
create policy "strategy_budgets_delete_authenticated" on public.strategy_budgets for delete to authenticated using (true);

-- =============================================================================
-- TRIGGERS — auto-update updated_at using shared handle_updated_at()
-- from migration 20260307120200
-- =============================================================================

drop trigger if exists trg_lean_canvases_updated_at on public.lean_canvases;
create trigger trg_lean_canvases_updated_at
  before update on public.lean_canvases
  for each row execute function public.handle_updated_at();

drop trigger if exists trg_automation_opportunities_updated_at on public.automation_opportunities;
create trigger trg_automation_opportunities_updated_at
  before update on public.automation_opportunities
  for each row execute function public.handle_updated_at();

drop trigger if exists trg_strategy_budgets_updated_at on public.strategy_budgets;
create trigger trg_strategy_budgets_updated_at
  before update on public.strategy_budgets
  for each row execute function public.handle_updated_at();
