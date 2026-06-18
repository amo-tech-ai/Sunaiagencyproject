-- =============================================================================
-- Migration: 20260310130000_verification_fixes.sql
-- Purpose:   Production-DB-only fixups for tables already deployed with old schema.
--            Original migration files (20260307–20260310) are now corrected for
--            fresh databases. This migration handles in-place corrections on the
--            live database where columns/policies were already created differently.
--
-- Fixes:     1. Drop old combined RLS policies (workflows, workflow_executions,
--               dashboard_invoices, dashboard_payments) — originals now have
--               per-role policies, but production DB may still have combined ones.
--            2. ALTER COLUMN type casts: text → uuid on workflows.user_id,
--               dashboard_invoices.(user_id, client_id, project_id),
--               dashboard_payments.recorded_by
--            3. Drop stale strategy engine policies that used old naming convention
--               (without _authenticated suffix)
--            4. Add updated_at triggers for wizard tables (handle_updated_at()
--               not available when wizard tables are created in 20260307120000)
--            5. Drop stale workflows_select_anon policy (dashboard-only)
--
-- Safety:    All changes guarded with IF EXISTS / information_schema checks.
--            Safe to run on both fresh and production databases.
-- =============================================================================

-- =============================================================================
-- 1. Drop old combined RLS policies — production DB may have these from the
--    original migrations. The corrected originals now create per-role policies
--    directly, so these combined ones are stale.
-- =============================================================================

-- workflows
do $$
begin
  drop policy if exists "workflows_select" on public.workflows;
  drop policy if exists "workflows_insert" on public.workflows;
  drop policy if exists "workflows_update" on public.workflows;
  drop policy if exists "workflows_delete" on public.workflows;
end $$;

-- workflow_executions
do $$
begin
  drop policy if exists "workflow_executions_select" on public.workflow_executions;
  drop policy if exists "workflow_executions_insert" on public.workflow_executions;
end $$;

-- dashboard_invoices
do $$
begin
  drop policy if exists "dashboard_invoices_select" on public.dashboard_invoices;
  drop policy if exists "dashboard_invoices_insert" on public.dashboard_invoices;
  drop policy if exists "dashboard_invoices_update" on public.dashboard_invoices;
  drop policy if exists "dashboard_invoices_delete" on public.dashboard_invoices;
end $$;

-- dashboard_payments
do $$
begin
  drop policy if exists "dashboard_payments_select" on public.dashboard_payments;
  drop policy if exists "dashboard_payments_insert" on public.dashboard_payments;
end $$;

-- =============================================================================
-- 2. ALTER COLUMN type casts — text → uuid on production DB
--    Guarded: only runs if column is still type text.
-- =============================================================================

-- workflows.user_id: text → uuid
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'workflows'
      and column_name = 'user_id' and data_type = 'text'
  ) then
    update public.workflows set user_id = null
    where user_id is not null
      and user_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

    alter table public.workflows
      alter column user_id type uuid using user_id::uuid;
  end if;
end $$;

-- dashboard_invoices.user_id: text → uuid
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'dashboard_invoices'
      and column_name = 'user_id' and data_type = 'text'
  ) then
    update public.dashboard_invoices set user_id = null
    where user_id is not null
      and user_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

    alter table public.dashboard_invoices
      alter column user_id type uuid using user_id::uuid;
  end if;
end $$;

-- dashboard_invoices.client_id and project_id: text → uuid
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'dashboard_invoices'
      and column_name = 'client_id' and data_type = 'text'
  ) then
    update public.dashboard_invoices set client_id = null
    where client_id is not null and client_id != ''
      and client_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
    update public.dashboard_invoices set client_id = null where client_id = '';

    alter table public.dashboard_invoices
      alter column client_id type uuid using client_id::uuid;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'dashboard_invoices'
      and column_name = 'project_id' and data_type = 'text'
  ) then
    update public.dashboard_invoices set project_id = null
    where project_id is not null and project_id != ''
      and project_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
    update public.dashboard_invoices set project_id = null where project_id = '';

    alter table public.dashboard_invoices
      alter column project_id type uuid using project_id::uuid;
  end if;
end $$;

-- dashboard_payments.recorded_by: text → uuid
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'dashboard_payments'
      and column_name = 'recorded_by' and data_type = 'text'
  ) then
    update public.dashboard_payments set recorded_by = null
    where recorded_by is not null
      and recorded_by !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

    alter table public.dashboard_payments
      alter column recorded_by type uuid using recorded_by::uuid;
  end if;
end $$;

-- =============================================================================
-- 3. Drop stale strategy engine policies — production DB may have policies
--    without _authenticated suffix from the original migration.
--    The corrected original now creates *_authenticated policies.
-- =============================================================================

do $$
declare
  _tables text[] := array[
    'lean_canvases', 'lean_canvas_versions', 'strategy_insights',
    'automation_opportunities', 'strategy_recommendations', 'strategy_actions',
    'strategy_events', 'strategy_event_triggers', 'strategy_agent_memory',
    'strategy_signals', 'strategy_roles', 'strategy_budgets'
  ];
  _t text;
  _ops text[] := array['select', 'insert', 'update', 'delete'];
  _op text;
  _old_name text;
begin
  foreach _t in array _tables loop
    foreach _op in array _ops loop
      _old_name := _t || '_' || _op;
      -- only drop the old-style policy if it exists AND a _authenticated version also exists
      if exists (
        select 1 from pg_policies where tablename = _t and policyname = _old_name
      ) and exists (
        select 1 from pg_policies where tablename = _t and policyname = _old_name || '_authenticated'
      ) then
        execute format('drop policy if exists %I on public.%I', _old_name, _t);
      end if;
    end loop;
  end loop;
end $$;

-- =============================================================================
-- 4. Add updated_at triggers for wizard tables — these are defined in
--    20260307120000 (before handle_updated_at() exists in 20260307120200),
--    so the triggers are added here where the function is guaranteed to exist.
-- =============================================================================

drop trigger if exists trg_wizard_sessions_updated_at on public.wizard_sessions;
create trigger trg_wizard_sessions_updated_at
  before update on public.wizard_sessions
  for each row execute function public.handle_updated_at();

drop trigger if exists trg_wizard_answers_updated_at on public.wizard_answers;
create trigger trg_wizard_answers_updated_at
  before update on public.wizard_answers
  for each row execute function public.handle_updated_at();

-- =============================================================================
-- 5. Drop stale anon policy on workflows — workflows are dashboard-only,
--    anon should not read workflow definitions.
-- =============================================================================

drop policy if exists "workflows_select_anon" on public.workflows;

-- =============================================================================
-- 6. Drop stale strategy engine policies — production DB may have policies
--    without _authenticated suffix from the original migration.
--    The corrected original now creates *_authenticated policies.
-- =============================================================================

do $$
declare
  _tables text[] := array[
    'lean_canvases', 'lean_canvas_versions', 'strategy_insights',
    'automation_opportunities', 'strategy_recommendations', 'strategy_actions',
    'strategy_events', 'strategy_event_triggers', 'strategy_agent_memory',
    'strategy_signals', 'strategy_roles', 'strategy_budgets'
  ];
  _t text;
  _ops text[] := array['select', 'insert', 'update', 'delete'];
  _op text;
  _old_name text;
begin
  foreach _t in array _tables loop
    foreach _op in array _ops loop
      _old_name := _t || '_' || _op;
      -- only drop the old-style policy if it exists AND a _authenticated version also exists
      if exists (
        select 1 from pg_policies where tablename = _t and policyname = _old_name
      ) and exists (
        select 1 from pg_policies where tablename = _t and policyname = _old_name || '_authenticated'
      ) then
        execute format('drop policy if exists %I on public.%I', _old_name, _t);
      end if;
    end loop;
  end loop;
end $$;

-- drop the now-unused strategy-specific trigger function if it exists
-- (replaced by shared handle_updated_at() from 20260307120200)
drop function if exists public.update_strategy_updated_at() cascade;
