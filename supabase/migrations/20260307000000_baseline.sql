-- =============================================================================
-- Migration 000: Baseline schema
-- Applied to production: 2026-03-07
-- Prompt ref: /tasks/prompts/020-migration-baseline-seed.md
--
-- Purpose: Codify the full production schema as the baseline migration.
-- Covers: extensions, helper functions, 19 core/project/AI/catalog tables,
--   foreign keys, unique constraints, check constraints, indexes, triggers,
--   views, RLS enable + all RLS policies.
--
-- Note: uses "if not exists" / "create or replace" throughout since
-- everything already exists in production.
-- =============================================================================

begin;

-- ============================================================
-- 1. extensions
-- ============================================================
create extension if not exists "pgcrypto" with schema "extensions";
create extension if not exists "uuid-ossp" with schema "extensions";
create extension if not exists "vector" with schema "extensions";

-- ============================================================
-- 2. helper functions
-- ============================================================

-- update_updated_at — generic trigger function
create or replace function public.update_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- get_user_org_ids — returns org IDs the current user belongs to
create or replace function public.get_user_org_ids()
returns setof uuid
language sql
stable
security definer
set search_path = 'public'
as $$
  select org_id from public.team_members where user_id = auth.uid()
$$;

-- user_is_org_owner — checks if current user is owner of given org
create or replace function public.user_is_org_owner(target_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = 'public'
as $$
  select exists (
    select 1 from public.team_members
    where user_id = auth.uid()
      and org_id = target_org_id
      and role = 'Owner'
  )
$$;

-- user_has_role_in_org — checks if current user has one of given roles in org
create or replace function public.user_has_role_in_org(target_org_id uuid, allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = 'public'
as $$
  select exists (
    select 1 from public.team_members
    where user_id = auth.uid()
      and org_id = target_org_id
      and role = any(allowed_roles)
  )
$$;

-- handle_wizard_completion — sets wizard_completed_at when step reaches 5
create or replace function public.handle_wizard_completion()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.current_step = 5 and (old.current_step is null or old.current_step < 5) and new.wizard_completed_at is null then
    new.wizard_completed_at = now();
  end if;
  if new.current_step < 5 and new.wizard_completed_at is not null then
    new.wizard_completed_at = null;
  end if;
  return new;
end;
$$;

-- handle_client_onboarding — sets onboarded_at when status changes to 'client'
create or replace function public.handle_client_onboarding()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'client' and (old.status is null or old.status != 'client') and new.onboarded_at is null then
    new.onboarded_at = now();
  end if;
  return new;
end;
$$;

-- handle_dashboard_activation — sets dashboard_activated_at on roadmap creation
create or replace function public.handle_dashboard_activation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.snapshot_id is not null then
    update public.projects p
    set dashboard_activated_at = now()
    where p.id in (
      select project_id
      from public.context_snapshots
      where id = new.snapshot_id
        and is_active = true
    )
    and p.dashboard_activated_at is null;
  end if;
  return new;
end;
$$;

-- handle_new_crm_interaction — updates client last_activity_at
create or replace function public.handle_new_crm_interaction()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.client_id is not null then
    update public.clients
    set last_activity_at = new.created_at
    where id = new.client_id;
  end if;
  return new;
end;
$$;

-- ============================================================
-- 3. tables — core
-- ============================================================

-- organizations
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- profiles (FK to auth.users)
create table if not exists public.profiles (
  id uuid primary key,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- team_members (org ↔ user junction — central to RLS)
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  user_id uuid not null,
  role text not null default 'Member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- wizard_sessions
create table if not exists public.wizard_sessions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  project_id uuid,
  current_step integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  wizard_completed_at timestamptz
);

-- wizard_answers
create table if not exists public.wizard_answers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null,
  screen_id text not null,
  data jsonb not null default '{}'::jsonb,
  step_number integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- context_snapshots
create table if not exists public.context_snapshots (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  project_id uuid not null,
  version integer not null default 1,
  is_active boolean not null default true,
  summary text,
  metrics jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 4. tables — catalog (AI systems & services)
-- ============================================================

-- systems (text PK, org-independent catalog)
create table if not exists public.systems (
  id text primary key,
  name text not null,
  description text not null,
  icon text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- services
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  org_id uuid,
  name text not null,
  slug text not null,
  category text not null,
  description text not null,
  benefits jsonb,
  features jsonb,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- system_services (junction)
create table if not exists public.system_services (
  id uuid primary key default gen_random_uuid(),
  system_id text not null,
  service_id uuid not null,
  is_primary boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 5. tables — project & delivery
-- ============================================================

-- projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  client_id uuid,
  name text not null,
  status text not null,
  start_date date,
  end_date date,
  value numeric,
  current_phase text,
  progress integer default 0,
  dashboard_activated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- briefs
create table if not exists public.briefs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  project_id uuid not null,
  content jsonb not null,
  status text not null default 'draft',
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- brief_versions
create table if not exists public.brief_versions (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid not null,
  version integer not null,
  content jsonb not null,
  diff jsonb,
  changed_by uuid,
  change_summary text,
  created_at timestamptz not null default now()
);

-- roadmaps
create table if not exists public.roadmaps (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  snapshot_id uuid not null,
  total_duration text not null,
  roi_projection text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- roadmap_phases
create table if not exists public.roadmap_phases (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  roadmap_id uuid not null,
  title text not null,
  order_index integer not null,
  outcomes jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- tasks
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  phase_id uuid not null,
  title text not null,
  owner text not null,
  status text not null default 'todo',
  assigned_to uuid,
  description text,
  effort text,
  due_date date,
  tags jsonb,
  priority text default 'medium',
  ai_generated boolean default false,
  ai_suggestion text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- project_systems
create table if not exists public.project_systems (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  project_id uuid not null,
  system_id text not null,
  is_recommended boolean not null default false,
  is_selected boolean not null default false,
  why_it_matters text,
  recommendation_metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- project_services
create table if not exists public.project_services (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  project_id uuid not null,
  service_id uuid not null,
  status text not null default 'planned',
  started_at timestamptz,
  completed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 6. tables — AI cache & logs
-- ============================================================

-- ai_cache (text PK = hash)
create table if not exists public.ai_cache (
  hash text primary key,
  org_id uuid,
  prompt_hash text not null,
  response jsonb not null,
  model text,
  tokens_used integer,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

-- ai_run_logs
create table if not exists public.ai_run_logs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  project_id uuid,
  agent_name text not null,
  model_name text not null,
  input_tokens integer default 0,
  output_tokens integer default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 7. unique constraints (beyond PKs)
-- ============================================================
do $$ begin
  alter table public.team_members add constraint team_members_org_id_user_id_key unique (org_id, user_id);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.briefs add constraint briefs_project_id_version_key unique (project_id, version);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.brief_versions add constraint brief_versions_brief_id_version_key unique (brief_id, version);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.roadmaps add constraint roadmaps_snapshot_id_key unique (snapshot_id);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.project_systems add constraint project_systems_project_id_system_id_key unique (project_id, system_id);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.project_services add constraint project_services_project_id_service_id_key unique (project_id, service_id);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.services add constraint services_slug_key unique (slug);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.system_services add constraint system_services_system_id_service_id_key unique (system_id, service_id);
exception when duplicate_object then null;
end $$;

-- ============================================================
-- 8. check constraints
-- ============================================================

-- team_members
do $$ begin
  alter table public.team_members add constraint chk_team_members_role
    check (role = any(array['Owner','Consultant','Client','Admin','Member']));
exception when duplicate_object then null;
end $$;

-- wizard_sessions
do $$ begin
  alter table public.wizard_sessions add constraint wizard_sessions_current_step_check
    check (current_step >= 1 and current_step <= 5);
exception when duplicate_object then null;
end $$;

-- wizard_answers
do $$ begin
  alter table public.wizard_answers add constraint wizard_answers_screen_id_check
    check (screen_id = any(array['step-1','step-2','step-3','step-4','step-5']));
exception when duplicate_object then null;
end $$;

-- projects
do $$ begin
  alter table public.projects add constraint chk_projects_status
    check (status = any(array['draft','planning','active','on_hold','completed','cancelled','Active','Discovery','discovery']));
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.projects add constraint projects_current_phase_check
    check (current_phase = any(array['phase_1','phase_2','phase_3']));
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.projects add constraint projects_progress_check
    check (progress >= 0 and progress <= 100);
exception when duplicate_object then null;
end $$;

-- briefs
do $$ begin
  alter table public.briefs add constraint chk_briefs_status
    check (status = any(array['draft','in_review','approved']));
exception when duplicate_object then null;
end $$;

-- tasks
do $$ begin
  alter table public.tasks add constraint chk_tasks_status
    check (status = any(array['todo','in_progress','review','done','blocked']));
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.tasks add constraint chk_tasks_priority
    check (priority = any(array['low','medium','high','urgent']));
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.tasks add constraint tasks_effort_check
    check (effort = any(array['S','M','L','XL']));
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.tasks add constraint tasks_owner_check
    check (owner = any(array['Client','Sun AI','Automated']));
exception when duplicate_object then null;
end $$;

-- project_services
do $$ begin
  alter table public.project_services add constraint project_services_status_check
    check (status = any(array['planned','active','completed','paused']));
exception when duplicate_object then null;
end $$;

-- services
do $$ begin
  alter table public.services add constraint services_category_check
    check (category = any(array['Core','Industry-Specific','Custom']));
exception when duplicate_object then null;
end $$;

-- ============================================================
-- 9. foreign keys
-- ============================================================

-- profiles → auth.users
do $$ begin
  alter table public.profiles add constraint profiles_id_fkey
    foreign key (id) references auth.users(id) on delete cascade;
exception when duplicate_object then null;
end $$;

-- team_members
do $$ begin
  alter table public.team_members add constraint team_members_org_id_fkey
    foreign key (org_id) references public.organizations(id) on delete cascade;
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.team_members add constraint team_members_user_id_fkey
    foreign key (user_id) references auth.users(id) on delete cascade;
exception when duplicate_object then null;
end $$;

-- wizard_sessions
do $$ begin
  alter table public.wizard_sessions add constraint wizard_sessions_org_id_fkey
    foreign key (org_id) references public.organizations(id) on delete cascade;
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.wizard_sessions add constraint wizard_sessions_project_id_fkey
    foreign key (project_id) references public.projects(id) on delete set null;
exception when duplicate_object then null;
end $$;

-- wizard_answers
do $$ begin
  alter table public.wizard_answers add constraint wizard_answers_org_id_fkey
    foreign key (org_id) references public.organizations(id) on delete cascade;
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.wizard_answers add constraint wizard_answers_session_id_fkey
    foreign key (session_id) references public.wizard_sessions(id) on delete cascade;
exception when duplicate_object then null;
end $$;

-- context_snapshots
do $$ begin
  alter table public.context_snapshots add constraint context_snapshots_org_id_fkey
    foreign key (org_id) references public.organizations(id) on delete cascade;
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.context_snapshots add constraint context_snapshots_project_id_fkey
    foreign key (project_id) references public.projects(id) on delete cascade;
exception when duplicate_object then null;
end $$;

-- services
do $$ begin
  alter table public.services add constraint services_org_id_fkey
    foreign key (org_id) references public.organizations(id) on delete cascade;
exception when duplicate_object then null;
end $$;

-- system_services
do $$ begin
  alter table public.system_services add constraint system_services_system_id_fkey
    foreign key (system_id) references public.systems(id) on delete cascade;
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.system_services add constraint system_services_service_id_fkey
    foreign key (service_id) references public.services(id) on delete cascade;
exception when duplicate_object then null;
end $$;

-- projects
do $$ begin
  alter table public.projects add constraint projects_org_id_fkey
    foreign key (org_id) references public.organizations(id) on delete cascade;
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.projects add constraint projects_client_id_fkey
    foreign key (client_id) references public.clients(id) on delete set null;
exception when duplicate_object then null;
end $$;

-- briefs
do $$ begin
  alter table public.briefs add constraint briefs_org_id_fkey
    foreign key (org_id) references public.organizations(id) on delete cascade;
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.briefs add constraint briefs_project_id_fkey
    foreign key (project_id) references public.projects(id) on delete cascade;
exception when duplicate_object then null;
end $$;

-- brief_versions
do $$ begin
  alter table public.brief_versions add constraint brief_versions_brief_id_fkey
    foreign key (brief_id) references public.briefs(id) on delete cascade;
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.brief_versions add constraint brief_versions_changed_by_fkey
    foreign key (changed_by) references public.profiles(id) on delete set null;
exception when duplicate_object then null;
end $$;

-- roadmaps
do $$ begin
  alter table public.roadmaps add constraint roadmaps_org_id_fkey
    foreign key (org_id) references public.organizations(id) on delete cascade;
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.roadmaps add constraint roadmaps_snapshot_id_fkey
    foreign key (snapshot_id) references public.context_snapshots(id) on delete cascade;
exception when duplicate_object then null;
end $$;

-- roadmap_phases
do $$ begin
  alter table public.roadmap_phases add constraint roadmap_phases_org_id_fkey
    foreign key (org_id) references public.organizations(id) on delete cascade;
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.roadmap_phases add constraint roadmap_phases_roadmap_id_fkey
    foreign key (roadmap_id) references public.roadmaps(id) on delete cascade;
exception when duplicate_object then null;
end $$;

-- tasks
do $$ begin
  alter table public.tasks add constraint tasks_org_id_fkey
    foreign key (org_id) references public.organizations(id) on delete cascade;
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.tasks add constraint tasks_phase_id_fkey
    foreign key (phase_id) references public.roadmap_phases(id) on delete cascade;
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.tasks add constraint tasks_assigned_to_fkey
    foreign key (assigned_to) references public.profiles(id) on delete set null;
exception when duplicate_object then null;
end $$;

-- project_systems
do $$ begin
  alter table public.project_systems add constraint project_systems_org_id_fkey
    foreign key (org_id) references public.organizations(id) on delete cascade;
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.project_systems add constraint project_systems_project_id_fkey
    foreign key (project_id) references public.projects(id) on delete cascade;
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.project_systems add constraint project_systems_system_id_fkey
    foreign key (system_id) references public.systems(id) on delete cascade;
exception when duplicate_object then null;
end $$;

-- project_services
do $$ begin
  alter table public.project_services add constraint project_services_org_id_fkey
    foreign key (org_id) references public.organizations(id) on delete cascade;
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.project_services add constraint project_services_project_id_fkey
    foreign key (project_id) references public.projects(id) on delete cascade;
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.project_services add constraint project_services_service_id_fkey
    foreign key (service_id) references public.services(id) on delete cascade;
exception when duplicate_object then null;
end $$;

-- ai_cache
do $$ begin
  alter table public.ai_cache add constraint ai_cache_org_id_fkey
    foreign key (org_id) references public.organizations(id) on delete cascade;
exception when duplicate_object then null;
end $$;

-- ai_run_logs
do $$ begin
  alter table public.ai_run_logs add constraint ai_run_logs_org_id_fkey
    foreign key (org_id) references public.organizations(id) on delete cascade;
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.ai_run_logs add constraint ai_run_logs_project_id_fkey
    foreign key (project_id) references public.projects(id) on delete set null;
exception when duplicate_object then null;
end $$;

-- ============================================================
-- 10. indexes (non-PK, non-unique-constraint)
-- ============================================================

-- organizations
create index if not exists idx_organizations_name on public.organizations (name);

-- profiles
create index if not exists idx_profiles_full_name on public.profiles (full_name);

-- team_members
create index if not exists idx_team_members_org_id on public.team_members (org_id);
create index if not exists idx_team_members_user_id on public.team_members (user_id);
create index if not exists idx_team_members_role on public.team_members (role);

-- wizard_sessions
create index if not exists idx_wizard_sessions_org_id on public.wizard_sessions (org_id);
create index if not exists idx_wizard_sessions_project_id on public.wizard_sessions (project_id);
create index if not exists idx_wizard_sessions_org_project on public.wizard_sessions (org_id, project_id);
create index if not exists idx_wizard_sessions_current_step on public.wizard_sessions (current_step) where (current_step = 5);
create index if not exists idx_wizard_sessions_completed_at on public.wizard_sessions (wizard_completed_at) where (wizard_completed_at is not null);

-- wizard_answers
create index if not exists idx_wizard_answers_org_id on public.wizard_answers (org_id);
create index if not exists idx_wizard_answers_session_id on public.wizard_answers (session_id);
create index if not exists idx_wizard_answers_screen_id on public.wizard_answers (screen_id);
create index if not exists idx_wizard_answers_org_session on public.wizard_answers (org_id, session_id);
create index if not exists idx_wizard_answers_data on public.wizard_answers using gin (data);

-- context_snapshots
create index if not exists idx_context_snapshots_org_id on public.context_snapshots (org_id);
create index if not exists idx_context_snapshots_project_id on public.context_snapshots (project_id);
create index if not exists idx_context_snapshots_version on public.context_snapshots (project_id, version);
create index if not exists idx_context_snapshots_active on public.context_snapshots (project_id, is_active) where (is_active = true);
create unique index if not exists idx_context_snapshots_one_active_per_project on public.context_snapshots (project_id) where (is_active = true);
create index if not exists idx_context_snapshots_metrics on public.context_snapshots using gin (metrics);

-- systems
create index if not exists idx_systems_active on public.systems (is_active, display_order);

-- services
create index if not exists idx_services_org_id on public.services (org_id);
create index if not exists idx_services_slug on public.services (slug);
create index if not exists idx_services_category on public.services (category);
create index if not exists idx_services_active on public.services (is_active, display_order);
create index if not exists idx_services_benefits on public.services using gin (benefits);
create index if not exists idx_services_features on public.services using gin (features);

-- system_services
create index if not exists idx_system_services_system_id on public.system_services (system_id);
create index if not exists idx_system_services_service_id on public.system_services (service_id);
create index if not exists idx_system_services_primary on public.system_services (system_id, is_primary);

-- projects
create index if not exists idx_projects_org_id on public.projects (org_id);
create index if not exists idx_projects_client_id on public.projects (client_id);
create index if not exists idx_projects_status on public.projects (status);
create index if not exists idx_projects_org_status on public.projects (org_id, status);
create index if not exists idx_projects_org_client on public.projects (org_id, client_id);
create index if not exists idx_projects_org_phase on public.projects (org_id, current_phase);
create index if not exists idx_projects_current_phase on public.projects (current_phase);
create index if not exists idx_projects_start_date on public.projects (start_date);
create index if not exists idx_projects_end_date on public.projects (end_date);
create index if not exists idx_projects_progress on public.projects (progress);
create index if not exists idx_projects_dashboard_activated_at on public.projects (dashboard_activated_at) where (dashboard_activated_at is not null);

-- briefs
create index if not exists idx_briefs_org_id on public.briefs (org_id);
create index if not exists idx_briefs_project_id on public.briefs (project_id);
create index if not exists idx_briefs_status on public.briefs (status);
create index if not exists idx_briefs_version on public.briefs (project_id, version);
create index if not exists idx_briefs_content on public.briefs using gin (content);

-- brief_versions
create index if not exists idx_brief_versions_brief_id on public.brief_versions (brief_id);
create index if not exists idx_brief_versions_changed_by on public.brief_versions (changed_by);
create index if not exists idx_brief_versions_version on public.brief_versions (brief_id, version);
create index if not exists idx_brief_versions_content on public.brief_versions using gin (content);
create index if not exists idx_brief_versions_diff on public.brief_versions using gin (diff);

-- roadmaps
create index if not exists idx_roadmaps_org_id on public.roadmaps (org_id);
create index if not exists idx_roadmaps_snapshot_id on public.roadmaps (snapshot_id);

-- roadmap_phases
create index if not exists idx_roadmap_phases_org_id on public.roadmap_phases (org_id);
create index if not exists idx_roadmap_phases_roadmap_id on public.roadmap_phases (roadmap_id);
create index if not exists idx_roadmap_phases_order on public.roadmap_phases (roadmap_id, order_index);
create index if not exists idx_roadmap_phases_outcomes on public.roadmap_phases using gin (outcomes);

-- tasks
create index if not exists idx_tasks_org_id on public.tasks (org_id);
create index if not exists idx_tasks_phase_id on public.tasks (phase_id);
create index if not exists idx_tasks_status on public.tasks (status);
create index if not exists idx_tasks_assigned_to on public.tasks (assigned_to);
create index if not exists idx_tasks_due_date on public.tasks (due_date);
create index if not exists idx_tasks_priority on public.tasks (priority);
create index if not exists idx_tasks_owner on public.tasks (owner);
create index if not exists idx_tasks_ai_generated on public.tasks (ai_generated);
create index if not exists idx_tasks_org_status on public.tasks (org_id, status);
create index if not exists idx_tasks_org_status_due on public.tasks (org_id, status, due_date);
create index if not exists idx_tasks_tags on public.tasks using gin (tags);

-- project_systems
create index if not exists idx_project_systems_org_id on public.project_systems (org_id);
create index if not exists idx_project_systems_project_id on public.project_systems (project_id);
create index if not exists idx_project_systems_system_id on public.project_systems (system_id);
create index if not exists idx_project_systems_selected on public.project_systems (project_id, is_selected);
create index if not exists idx_project_systems_metadata on public.project_systems using gin (recommendation_metadata);

-- project_services
create index if not exists idx_project_services_org_id on public.project_services (org_id);
create index if not exists idx_project_services_project_id on public.project_services (project_id);
create index if not exists idx_project_services_service_id on public.project_services (service_id);
create index if not exists idx_project_services_status on public.project_services (project_id, status);

-- ai_cache
create index if not exists idx_ai_cache_org_id on public.ai_cache (org_id);
create index if not exists idx_ai_cache_created_at on public.ai_cache (created_at desc);
create index if not exists idx_ai_cache_expires_at on public.ai_cache (expires_at) where (expires_at is not null);
create index if not exists idx_ai_cache_response on public.ai_cache using gin (response);

-- ai_run_logs
create index if not exists idx_ai_run_logs_org_id on public.ai_run_logs (org_id);
create index if not exists idx_ai_run_logs_project_id on public.ai_run_logs (project_id);
create index if not exists idx_ai_run_logs_created_at on public.ai_run_logs (created_at);
create index if not exists idx_ai_run_logs_org_created on public.ai_run_logs (org_id, created_at);

-- ============================================================
-- 11. triggers
-- ============================================================

-- updated_at triggers (all tables with updated_at column)
create or replace trigger update_organizations_updated_at
  before update on public.organizations
  for each row execute function update_updated_at();

create or replace trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function update_updated_at();

create or replace trigger update_team_members_updated_at
  before update on public.team_members
  for each row execute function update_updated_at();

create or replace trigger update_wizard_sessions_updated_at
  before update on public.wizard_sessions
  for each row execute function update_updated_at();

create or replace trigger update_wizard_answers_updated_at
  before update on public.wizard_answers
  for each row execute function update_updated_at();

create or replace trigger update_context_snapshots_updated_at
  before update on public.context_snapshots
  for each row execute function update_updated_at();

create or replace trigger update_systems_updated_at
  before update on public.systems
  for each row execute function update_updated_at();

create or replace trigger update_services_updated_at
  before update on public.services
  for each row execute function update_updated_at();

create or replace trigger update_projects_updated_at
  before update on public.projects
  for each row execute function update_updated_at();

create or replace trigger update_briefs_updated_at
  before update on public.briefs
  for each row execute function update_updated_at();

create or replace trigger update_roadmaps_updated_at
  before update on public.roadmaps
  for each row execute function update_updated_at();

create or replace trigger update_roadmap_phases_updated_at
  before update on public.roadmap_phases
  for each row execute function update_updated_at();

create or replace trigger update_tasks_updated_at
  before update on public.tasks
  for each row execute function update_updated_at();

create or replace trigger update_project_systems_updated_at
  before update on public.project_systems
  for each row execute function update_updated_at();

create or replace trigger update_project_services_updated_at
  before update on public.project_services
  for each row execute function update_updated_at();

-- business logic triggers
create or replace trigger on_wizard_step_update
  before update on public.wizard_sessions
  for each row
  when (new.current_step is distinct from old.current_step)
  execute function handle_wizard_completion();

create or replace trigger on_roadmap_created
  after insert on public.roadmaps
  for each row execute function handle_dashboard_activation();

-- ============================================================
-- 12. enable RLS on all tables
-- ============================================================
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.team_members enable row level security;
alter table public.wizard_sessions enable row level security;
alter table public.wizard_answers enable row level security;
alter table public.context_snapshots enable row level security;
alter table public.systems enable row level security;
alter table public.services enable row level security;
alter table public.system_services enable row level security;
alter table public.projects enable row level security;
alter table public.briefs enable row level security;
alter table public.brief_versions enable row level security;
alter table public.roadmaps enable row level security;
alter table public.roadmap_phases enable row level security;
alter table public.tasks enable row level security;
alter table public.project_systems enable row level security;
alter table public.project_services enable row level security;
alter table public.ai_cache enable row level security;
alter table public.ai_run_logs enable row level security;

-- ============================================================
-- 13. RLS policies — organizations
-- ============================================================
do $$ begin
  create policy "anon users cannot access organizations"
    on public.organizations for select to anon using (false);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "organizations_select_member"
    on public.organizations for select to authenticated
    using (id in (select get_user_org_ids()));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Anyone can create their own organization"
    on public.organizations for insert to authenticated
    with check (true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "organizations_update_owner"
    on public.organizations for update to authenticated
    using (user_is_org_owner(id))
    with check (user_is_org_owner(id));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "organizations_delete_owner"
    on public.organizations for delete to authenticated
    using (user_is_org_owner(id));
exception when duplicate_object then null;
end $$;

-- ============================================================
-- 14. RLS policies — profiles
-- ============================================================
do $$ begin
  create policy "anon users cannot access profiles"
    on public.profiles for select to anon using (false);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Users can see their own profile"
    on public.profiles for select to authenticated
    using (id = auth.uid());
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can select their own profile"
    on public.profiles for select to authenticated
    using ((select auth.uid()) = id);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can select profiles in their organizations"
    on public.profiles for select to authenticated
    using (id in (
      select team_members.user_id from team_members
      where team_members.org_id in (
        select team_members_1.org_id from team_members team_members_1
        where team_members_1.user_id = (select auth.uid())
      )
    ));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Users can create their own profile"
    on public.profiles for insert to authenticated
    with check (id = auth.uid());
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can insert their own profile"
    on public.profiles for insert to authenticated
    with check ((select auth.uid()) = id);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Users can update their own profile"
    on public.profiles for update to authenticated
    using (id = auth.uid());
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can update their own profile"
    on public.profiles for update to authenticated
    using ((select auth.uid()) = id)
    with check ((select auth.uid()) = id);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can delete their own profile"
    on public.profiles for delete to authenticated
    using ((select auth.uid()) = id);
exception when duplicate_object then null;
end $$;

-- ============================================================
-- 15. RLS policies — team_members
-- ============================================================
do $$ begin
  create policy "anon users cannot access team members"
    on public.team_members for select to anon using (false);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Users can see their team memberships"
    on public.team_members for select to authenticated
    using (user_id = auth.uid());
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "team_members_select_own_org"
    on public.team_members for select to authenticated
    using (org_id in (select get_user_org_ids()));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Users can add themselves to teams"
    on public.team_members for insert to authenticated
    with check (user_id = auth.uid());
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "team_members_insert_owner_consultant"
    on public.team_members for insert to authenticated
    with check (user_has_role_in_org(org_id, array['Owner','Consultant']));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "team_members_update_owner_consultant"
    on public.team_members for update to authenticated
    using (user_has_role_in_org(org_id, array['Owner','Consultant']))
    with check (user_has_role_in_org(org_id, array['Owner','Consultant']));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "team_members_delete_owner_consultant"
    on public.team_members for delete to authenticated
    using (user_has_role_in_org(org_id, array['Owner','Consultant']));
exception when duplicate_object then null;
end $$;

-- ============================================================
-- 16. RLS policies — wizard_sessions
-- ============================================================
do $$ begin
  create policy "Users can manage their own wizard sessions"
    on public.wizard_sessions for all to authenticated
    using (org_id in (select org_id from team_members where user_id = auth.uid()))
    with check (org_id in (select org_id from team_members where user_id = auth.uid()));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can select sessions in their organizations"
    on public.wizard_sessions for select to authenticated
    using (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can insert sessions"
    on public.wizard_sessions for insert to authenticated
    with check (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can update sessions in their organizations"
    on public.wizard_sessions for update to authenticated
    using (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())))
    with check (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can delete sessions in their organizations"
    on public.wizard_sessions for delete to authenticated
    using (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())));
exception when duplicate_object then null;
end $$;

-- ============================================================
-- 17. RLS policies — wizard_answers
-- ============================================================
do $$ begin
  create policy "Users can manage their own wizard answers"
    on public.wizard_answers for all to authenticated
    using (org_id in (select org_id from team_members where user_id = auth.uid()))
    with check (org_id in (select org_id from team_members where user_id = auth.uid()));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can select answers in their organizations"
    on public.wizard_answers for select to authenticated
    using (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can insert answers"
    on public.wizard_answers for insert to authenticated
    with check (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can update answers in their organizations"
    on public.wizard_answers for update to authenticated
    using (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())))
    with check (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can delete answers in their organizations"
    on public.wizard_answers for delete to authenticated
    using (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())));
exception when duplicate_object then null;
end $$;

-- ============================================================
-- 18. RLS policies — context_snapshots
-- ============================================================
do $$ begin
  create policy "anon users cannot access snapshots"
    on public.context_snapshots for select to anon using (false);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Users can manage their own context snapshots"
    on public.context_snapshots for all to authenticated
    using (org_id in (select org_id from team_members where user_id = auth.uid()))
    with check (org_id in (select org_id from team_members where user_id = auth.uid()));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can select snapshots in their organizations"
    on public.context_snapshots for select to authenticated
    using (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())));
exception when duplicate_object then null;
end $$;

-- ============================================================
-- 19. RLS policies — systems (catalog, public read)
-- ============================================================
do $$ begin
  create policy "anon users can select active systems"
    on public.systems for select to anon using (is_active = true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can select active systems"
    on public.systems for select to authenticated using (is_active = true);
exception when duplicate_object then null;
end $$;

-- ============================================================
-- 20. RLS policies — services
-- ============================================================
do $$ begin
  create policy "anon users can select active global services"
    on public.services for select to anon
    using (is_active = true and org_id is null);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can select active services"
    on public.services for select to authenticated
    using (is_active = true and (org_id is null or org_id in (
      select team_members.org_id from team_members where team_members.user_id = (select auth.uid())
    )));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "owners and consultants can insert services"
    on public.services for insert to authenticated
    with check (org_id is null or org_id in (
      select team_members.org_id from team_members
      where team_members.user_id = (select auth.uid()) and team_members.role = any(array['Owner','Consultant'])
    ));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "owners and consultants can update services"
    on public.services for update to authenticated
    using (org_id is null or org_id in (
      select team_members.org_id from team_members
      where team_members.user_id = (select auth.uid()) and team_members.role = any(array['Owner','Consultant'])
    ))
    with check (org_id is null or org_id in (
      select team_members.org_id from team_members
      where team_members.user_id = (select auth.uid()) and team_members.role = any(array['Owner','Consultant'])
    ));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "owners and consultants can delete services"
    on public.services for delete to authenticated
    using (org_id is null or org_id in (
      select team_members.org_id from team_members
      where team_members.user_id = (select auth.uid()) and team_members.role = any(array['Owner','Consultant'])
    ));
exception when duplicate_object then null;
end $$;

-- ============================================================
-- 21. RLS policies — system_services (public read)
-- ============================================================
do $$ begin
  create policy "anon users can select system-service mappings"
    on public.system_services for select to anon using (true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can select system-service mappings"
    on public.system_services for select to authenticated using (true);
exception when duplicate_object then null;
end $$;

-- ============================================================
-- 22. RLS policies — projects
-- ============================================================
do $$ begin
  create policy "anon users cannot access projects"
    on public.projects for select to anon using (false);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Users can manage their own projects"
    on public.projects for all to authenticated
    using (org_id in (select org_id from team_members where user_id = auth.uid()))
    with check (org_id in (select org_id from team_members where user_id = auth.uid()));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can select projects in their organizations"
    on public.projects for select to authenticated
    using (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "owners and consultants can insert projects"
    on public.projects for insert to authenticated
    with check (org_id in (
      select team_members.org_id from team_members
      where team_members.user_id = (select auth.uid()) and team_members.role = any(array['Owner','Consultant'])
    ));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "owners and consultants can update projects"
    on public.projects for update to authenticated
    using (org_id in (
      select team_members.org_id from team_members
      where team_members.user_id = (select auth.uid()) and team_members.role = any(array['Owner','Consultant'])
    ))
    with check (org_id in (
      select team_members.org_id from team_members
      where team_members.user_id = (select auth.uid()) and team_members.role = any(array['Owner','Consultant'])
    ));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "owners and consultants can delete projects"
    on public.projects for delete to authenticated
    using (org_id in (
      select team_members.org_id from team_members
      where team_members.user_id = (select auth.uid()) and team_members.role = any(array['Owner','Consultant'])
    ));
exception when duplicate_object then null;
end $$;

-- ============================================================
-- 23. RLS policies — briefs
-- ============================================================
do $$ begin
  create policy "anon users cannot access briefs"
    on public.briefs for select to anon using (false);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can select briefs in their organizations"
    on public.briefs for select to authenticated
    using (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can insert briefs"
    on public.briefs for insert to authenticated
    with check (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can update briefs in their organizations"
    on public.briefs for update to authenticated
    using (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())))
    with check (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can delete briefs in their organizations"
    on public.briefs for delete to authenticated
    using (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())));
exception when duplicate_object then null;
end $$;

-- ============================================================
-- 24. RLS policies — brief_versions
-- ============================================================
do $$ begin
  create policy "anon users cannot access brief versions"
    on public.brief_versions for select to anon using (false);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can select brief versions in their organiza"
    on public.brief_versions for select to authenticated
    using (brief_id in (
      select briefs.id from briefs
      where briefs.org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid()))
    ));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can insert brief versions"
    on public.brief_versions for insert to authenticated
    with check (brief_id in (
      select briefs.id from briefs
      where briefs.org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid()))
    ));
exception when duplicate_object then null;
end $$;

-- ============================================================
-- 25. RLS policies — roadmaps
-- ============================================================
do $$ begin
  create policy "anon users cannot access roadmaps"
    on public.roadmaps for select to anon using (false);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can select roadmaps in their organizations"
    on public.roadmaps for select to authenticated
    using (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())));
exception when duplicate_object then null;
end $$;

-- ============================================================
-- 26. RLS policies — roadmap_phases
-- ============================================================
do $$ begin
  create policy "anon users cannot access phases"
    on public.roadmap_phases for select to anon using (false);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can select phases in their organizations"
    on public.roadmap_phases for select to authenticated
    using (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())));
exception when duplicate_object then null;
end $$;

-- ============================================================
-- 27. RLS policies — tasks
-- ============================================================
do $$ begin
  create policy "anon users cannot access tasks"
    on public.tasks for select to anon using (false);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can select tasks in their organizations"
    on public.tasks for select to authenticated
    using (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "owners and consultants can insert tasks"
    on public.tasks for insert to authenticated
    with check (org_id in (
      select team_members.org_id from team_members
      where team_members.user_id = (select auth.uid()) and team_members.role = any(array['Owner','Consultant'])
    ));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can update tasks in their organizations"
    on public.tasks for update to authenticated
    using (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())))
    with check (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "owners and consultants can delete tasks"
    on public.tasks for delete to authenticated
    using (org_id in (
      select team_members.org_id from team_members
      where team_members.user_id = (select auth.uid()) and team_members.role = any(array['Owner','Consultant'])
    ));
exception when duplicate_object then null;
end $$;

-- ============================================================
-- 28. RLS policies — project_systems
-- ============================================================
do $$ begin
  create policy "anon users cannot access project systems"
    on public.project_systems for select to anon using (false);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can select project systems in their organiz"
    on public.project_systems for select to authenticated
    using (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can insert project systems"
    on public.project_systems for insert to authenticated
    with check (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can update project systems in their organiz"
    on public.project_systems for update to authenticated
    using (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())))
    with check (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can delete project systems in their organiz"
    on public.project_systems for delete to authenticated
    using (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())));
exception when duplicate_object then null;
end $$;

-- ============================================================
-- 29. RLS policies — project_services
-- ============================================================
do $$ begin
  create policy "anon users cannot access project services"
    on public.project_services for select to anon using (false);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can select project services in their organi"
    on public.project_services for select to authenticated
    using (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "owners and consultants can insert project services"
    on public.project_services for insert to authenticated
    with check (org_id in (
      select team_members.org_id from team_members
      where team_members.user_id = (select auth.uid()) and team_members.role = any(array['Owner','Consultant'])
    ));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "owners and consultants can update project services"
    on public.project_services for update to authenticated
    using (org_id in (
      select team_members.org_id from team_members
      where team_members.user_id = (select auth.uid()) and team_members.role = any(array['Owner','Consultant'])
    ))
    with check (org_id in (
      select team_members.org_id from team_members
      where team_members.user_id = (select auth.uid()) and team_members.role = any(array['Owner','Consultant'])
    ));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "owners and consultants can delete project services"
    on public.project_services for delete to authenticated
    using (org_id in (
      select team_members.org_id from team_members
      where team_members.user_id = (select auth.uid()) and team_members.role = any(array['Owner','Consultant'])
    ));
exception when duplicate_object then null;
end $$;

-- ============================================================
-- 30. RLS policies — ai_cache
-- ============================================================
do $$ begin
  create policy "anon users cannot access cache"
    on public.ai_cache for select to anon using (false);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can select cache entries in their organizat"
    on public.ai_cache for select to authenticated
    using (org_id is null or org_id in (
      select team_members.org_id from team_members where team_members.user_id = (select auth.uid())
    ));
exception when duplicate_object then null;
end $$;

-- ============================================================
-- 31. RLS policies — ai_run_logs
-- ============================================================
do $$ begin
  create policy "anon users cannot access logs"
    on public.ai_run_logs for select to anon using (false);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated users can select logs in their organizations"
    on public.ai_run_logs for select to authenticated
    using (org_id in (select team_members.org_id from team_members where team_members.user_id = (select auth.uid())));
exception when duplicate_object then null;
end $$;

-- ============================================================
-- 32. view — client_crm_status
-- ============================================================
create or replace view public.client_crm_status as
select
  c.id,
  c.org_id,
  c.name,
  c.industry,
  c.status as client_status,
  c.lifecycle_stage,
  c.pipeline_stage,
  c.health_score,
  c.next_action_date,
  c.onboarded_at,
  c.created_at,
  c.updated_at,
  ws.id as wizard_session_id,
  ws.current_step,
  ws.wizard_completed_at,
  case
    when ws.current_step = 5 then true
    when ws.current_step is not null then false
    else null::boolean
  end as wizard_completed,
  case
    when ws.current_step = 5 then 'Completed'
    when ws.current_step is not null then 'In Progress'
    else 'Not Started'
  end as wizard_status,
  p.id as project_id,
  p.status as project_status,
  p.dashboard_activated_at,
  r.id as roadmap_id,
  case when r.id is not null then true else false end as has_dashboard_access,
  case
    when r.id is not null then 'Active Dashboard'
    when p.id is not null then 'Project Created (No Dashboard)'
    else 'No Project'
  end as dashboard_status,
  case
    when c.status = 'client' and ws.current_step = 5 and r.id is not null then 'Active Client'
    when c.status = 'client' and ws.current_step = 5 then 'Client (Wizard Complete)'
    when c.status = 'client' then 'Client (In Progress)'
    when c.status = 'prospect' and ws.current_step is not null then 'Prospect (Wizard Started)'
    when c.status = 'prospect' then 'Prospect (No Wizard)'
    when c.status = 'lead' then 'Lead'
    else 'Unknown'
  end as crm_classification,
  case when c.status = 'client' then true else false end as is_client,
  case when c.status = any(array['prospect','lead']) then true else false end as is_prospect,
  c.industry as industry_type,
  case
    when c.industry = any(array['fashion','saas','tourism','real_estate','events']) then c.industry
    else 'other'
  end as industry_category
from clients c
  left join projects p on p.client_id = c.id and p.status <> 'archived'
  left join wizard_sessions ws on ws.project_id = p.id
  left join roadmaps r on r.org_id = c.org_id
    and r.snapshot_id in (
      select context_snapshots.id from context_snapshots
      where context_snapshots.project_id = p.id and context_snapshots.is_active = true
    );

commit;
