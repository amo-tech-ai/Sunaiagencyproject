-- Sun AI Agency Supabase rebuild proposal
-- 000004: Canonical NEXUS execution engine migration.
--
-- Ported from src/supabase/migrations/20260328120000_nexus_execution_engine.sql
-- into the canonical supabase/migrations folder with the same table intent.

alter table public.roadmap_phases add column if not exists nexus_phase integer;
alter table public.roadmap_phases add column if not exists assigned_agents jsonb default '[]'::jsonb;
alter table public.roadmap_phases add column if not exists gate_status text default 'pending';
alter table public.roadmap_phases add column if not exists gate_keeper text default '';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'roadmap_phases_gate_status_check'
  ) then
    alter table public.roadmap_phases
      add constraint roadmap_phases_gate_status_check
      check (gate_status in ('pending', 'passed', 'failed', 'blocked'));
  end if;
end $$;

create table if not exists public.agent_jobs (
  id uuid primary key default gen_random_uuid(),
  phase_id uuid references public.roadmap_phases(id) on delete set null,
  project_id uuid references public.projects(id) on delete cascade,
  agent_slug text not null,
  action_type text not null
    check (action_type in ('db_write', 'webhook', 'notification', 'ai_generate', 'schedule', 'external_api')),
  payload jsonb not null default '{}'::jsonb,
  priority text not null default 'medium'
    check (priority in ('critical', 'high', 'medium', 'low')),
  requires_approval boolean not null default false,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'running', 'completed', 'failed', 'rejected', 'cancelled')),
  result jsonb default '{}'::jsonb,
  error text,
  attempts integer not null default 0,
  max_attempts integer not null default 3,
  next_job_id uuid references public.agent_jobs(id) on delete set null,
  trigger_condition text default 'on_complete'
    check (trigger_condition in ('on_complete', 'on_fail', 'always')),
  estimated_cost_cents integer default 0,
  token_count integer default 0,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz
);

create table if not exists public.phase_gates (
  id uuid primary key default gen_random_uuid(),
  phase_id uuid not null references public.roadmap_phases(id) on delete cascade,
  criterion text not null,
  description text default '',
  check_type text not null default 'system' check (check_type in ('system', 'ai')),
  check_query text default '',
  status text not null default 'pending' check (status in ('pending', 'passed', 'failed', 'blocked')),
  evidence text default '',
  evaluated_by text default '',
  evaluated_at timestamptz,
  sort_order integer not null default 0,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.agent_jobs enable row level security;
alter table public.phase_gates enable row level security;

grant select, insert, update, delete on public.agent_jobs to authenticated;
grant select, insert, update, delete on public.phase_gates to authenticated;

create policy agent_jobs_select_own on public.agent_jobs
  for select to authenticated using (user_id = (select auth.uid()));
create policy agent_jobs_insert_own on public.agent_jobs
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy agent_jobs_update_own on public.agent_jobs
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy agent_jobs_delete_own on public.agent_jobs
  for delete to authenticated using (user_id = (select auth.uid()));

create policy phase_gates_select_own on public.phase_gates
  for select to authenticated using (user_id = (select auth.uid()));
create policy phase_gates_insert_own on public.phase_gates
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy phase_gates_update_own on public.phase_gates
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy phase_gates_delete_own on public.phase_gates
  for delete to authenticated using (user_id = (select auth.uid()));

create index if not exists idx_roadmap_phases_nexus_phase
  on public.roadmap_phases (nexus_phase) where nexus_phase is not null;
create index if not exists idx_roadmap_phases_gate_status
  on public.roadmap_phases (gate_status);
create index if not exists idx_agent_jobs_phase_id on public.agent_jobs (phase_id);
create index if not exists idx_agent_jobs_project_id on public.agent_jobs (project_id);
create index if not exists idx_agent_jobs_user_id on public.agent_jobs (user_id);
create index if not exists idx_agent_jobs_status on public.agent_jobs (status);
create index if not exists idx_agent_jobs_agent_slug on public.agent_jobs (agent_slug);
create index if not exists idx_agent_jobs_priority_status on public.agent_jobs (priority, status);
create index if not exists idx_agent_jobs_created_at on public.agent_jobs (created_at desc);
create index if not exists idx_agent_jobs_next_job on public.agent_jobs (next_job_id) where next_job_id is not null;
create index if not exists idx_phase_gates_phase_id on public.phase_gates (phase_id);
create index if not exists idx_phase_gates_status on public.phase_gates (status);
create index if not exists idx_phase_gates_user_id on public.phase_gates (user_id);
