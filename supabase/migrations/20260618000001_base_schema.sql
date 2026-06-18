-- Sun AI Agency Supabase rebuild proposal
-- 000001: Base schema for a fresh project.
--
-- Safety:
-- - Repo-only proposal. Do not push until reviewed.
-- - No destructive SQL.
-- - Creates the tables the current Vite app and Edge Functions expect.

create extension if not exists pgcrypto with schema extensions;

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.wizard_sessions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid,
  user_id uuid references auth.users(id) on delete set null,
  current_step integer not null default 1 check (current_step between 1 and 5),
  status text not null default 'in_progress'
    check (status in ('in_progress', 'completed', 'abandoned')),
  context_snapshot jsonb,
  form_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wizard_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.wizard_sessions(id) on delete cascade,
  step_number integer not null check (step_number between 1 and 5),
  screen_id text,
  answers jsonb not null default '{}'::jsonb,
  ai_results jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, step_number)
);

create table if not exists public.ai_cache (
  input_hash text primary key,
  response jsonb not null default '{}'::jsonb,
  model text not null default 'gemini-3-flash-preview',
  tokens_used integer not null default 0,
  expires_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.ai_run_logs (
  id uuid primary key default gen_random_uuid(),
  session_id text,
  org_id uuid,
  prompt_type text not null default 'unknown',
  model text not null default 'gemini-3-flash-preview',
  tokens_used integer not null default 0,
  duration_ms integer not null default 0,
  success boolean not null default true,
  error_message text,
  created_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text not null default '',
  status text not null default 'prospect'
    check (status in ('active', 'prospect', 'churned', 'onboarding')),
  health_score integer not null default 50 check (health_score between 0 and 100),
  contact_email text not null default '',
  contact_name text not null default '',
  revenue numeric not null default 0,
  notes text not null default '',
  created_by uuid references auth.users(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_contacts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null,
  email text not null default '',
  role text not null default '',
  phone text not null default '',
  is_primary boolean not null default false,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.crm_pipelines (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  is_default boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_stages (
  id uuid primary key default gen_random_uuid(),
  pipeline_id uuid not null references public.crm_pipelines(id) on delete cascade,
  name text not null,
  position integer not null,
  color text not null default '#9CA39B',
  is_closed_won boolean not null default false,
  is_closed_lost boolean not null default false,
  created_at timestamptz not null default now(),
  unique (pipeline_id, position)
);

create table if not exists public.crm_deals (
  id uuid primary key default gen_random_uuid(),
  pipeline_id uuid not null references public.crm_pipelines(id) on delete cascade,
  stage_id uuid not null references public.crm_stages(id) on delete restrict,
  title text not null,
  value numeric not null default 0,
  probability integer not null default 0 check (probability between 0 and 100),
  contact_id uuid references public.crm_contacts(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  session_id text,
  expected_close_date date,
  stage_changed_at timestamptz not null default now(),
  owner_id uuid references auth.users(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_interactions (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references public.crm_deals(id) on delete cascade,
  type text not null check (type in ('call', 'email', 'meeting', 'note')),
  summary text not null,
  created_by uuid references auth.users(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.workflows (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  description text not null default '',
  trigger jsonb,
  conditions jsonb not null default '[]'::jsonb,
  actions jsonb not null default '[]'::jsonb,
  status text not null default 'disabled' check (status in ('enabled', 'disabled')),
  last_run_at timestamptz,
  success_count integer not null default 0,
  fail_count integer not null default 0,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workflow_executions (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  workflow_name text,
  status text not null default 'success',
  duration_ms integer not null default 0,
  trigger_data jsonb,
  action_results jsonb,
  error_message text,
  is_dry_run boolean not null default false,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.dashboard_invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  client_id uuid references public.clients(id) on delete set null,
  client_name text not null default 'Unknown Client',
  project_id uuid,
  project_name text not null default 'General',
  amount numeric not null default 0,
  status text not null default 'draft' check (status in ('draft', 'sent', 'paid', 'overdue')),
  issue_date date not null default current_date,
  due_date date not null,
  payment_date date,
  line_items jsonb not null default '[]'::jsonb,
  notes text default '',
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dashboard_payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.dashboard_invoices(id) on delete cascade,
  amount numeric not null default 0,
  payment_date date not null default current_date,
  method text default 'bank_transfer',
  notes text,
  recorded_by uuid references auth.users(id) on delete set null,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  user_id uuid references auth.users(id) on delete cascade,
  wizard_session_id uuid references public.wizard_sessions(id) on delete set null,
  name text not null,
  description text not null default '',
  industry text not null default '',
  company_size text not null default '',
  selected_systems jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (status in ('draft', 'active', 'completed', 'archived')),
  current_phase integer not null default 1,
  total_weeks integer not null default 0,
  total_investment text not null default '',
  wizard_snapshot jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.roadmaps (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null default '',
  total_weeks integer not null default 0,
  total_investment text not null default '',
  quick_wins jsonb not null default '[]'::jsonb,
  risk_factors jsonb not null default '[]'::jsonb,
  success_metrics jsonb not null default '[]'::jsonb,
  ai_response jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.roadmap_phases (
  id uuid primary key default gen_random_uuid(),
  roadmap_id uuid not null references public.roadmaps(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  phase_number integer not null,
  title text not null default '',
  name text,
  description text,
  week_range text not null default '',
  duration_weeks integer,
  systems jsonb not null default '[]'::jsonb,
  deliverables jsonb not null default '[]'::jsonb,
  milestones jsonb not null default '[]'::jsonb,
  dependencies jsonb not null default '[]'::jsonb,
  estimated_cost text not null default '',
  status text not null default 'upcoming' check (status in ('upcoming', 'active', 'completed')),
  progress integer not null default 0 check (progress between 0 and 100),
  created_at timestamptz not null default now(),
  unique (roadmap_id, phase_number)
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  session_id text,
  type text not null default 'system',
  activity_type text,
  action text not null default '',
  title text,
  detail text not null default '',
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.lean_canvases (
  id uuid primary key default gen_random_uuid(),
  session_id text,
  project_id uuid references public.projects(id) on delete set null,
  user_id uuid references auth.users(id) on delete cascade,
  version integer not null default 1,
  is_current boolean not null default true,
  problem jsonb not null default '[]'::jsonb,
  customer_segments jsonb not null default '[]'::jsonb,
  value_proposition jsonb not null default '[]'::jsonb,
  solution jsonb not null default '[]'::jsonb,
  channels jsonb not null default '[]'::jsonb,
  revenue_streams jsonb not null default '[]'::jsonb,
  cost_structure jsonb not null default '[]'::jsonb,
  key_metrics jsonb not null default '[]'::jsonb,
  unfair_advantage jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lean_canvas_versions (
  id uuid primary key default gen_random_uuid(),
  canvas_id uuid not null references public.lean_canvases(id) on delete cascade,
  version integer not null,
  snapshot jsonb not null,
  change_summary text,
  changed_by text,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (canvas_id, version)
);

create table if not exists public.strategy_insights (
  id uuid primary key default gen_random_uuid(),
  canvas_id uuid references public.lean_canvases(id) on delete set null,
  session_id text,
  agent_name text not null,
  insight_type text not null,
  title text not null,
  description text not null,
  priority text not null default 'medium',
  impact_score numeric,
  confidence numeric,
  data_sources jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'approved', 'dismissed', 'acted_on')),
  action_taken text,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create table if not exists public.automation_opportunities (
  id uuid primary key default gen_random_uuid(),
  canvas_id uuid references public.lean_canvases(id) on delete set null,
  session_id text,
  title text not null,
  description text not null,
  process_area text,
  current_state text,
  proposed_state text,
  impact_score integer not null default 50,
  roi_estimate text,
  complexity text not null default 'medium',
  estimated_weeks integer,
  estimated_cost text,
  recommended_system text,
  status text not null default 'detected'
    check (status in ('detected', 'evaluating', 'approved', 'in_progress', 'completed', 'dismissed')),
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.strategy_recommendations (
  id uuid primary key default gen_random_uuid(),
  canvas_id uuid references public.lean_canvases(id) on delete set null,
  session_id text,
  agent_name text not null,
  recommendation_type text not null,
  title text not null,
  rationale text not null,
  proposed_changes jsonb not null default '{}'::jsonb,
  approval_status text not null default 'pending'
    check (approval_status in ('pending', 'approved', 'rejected', 'auto_approved', 'archived')),
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.strategy_actions (
  id uuid primary key default gen_random_uuid(),
  canvas_id uuid references public.lean_canvases(id) on delete set null,
  session_id text,
  agent_name text not null,
  action_type text not null,
  input_summary text,
  output_summary text,
  tokens_used integer not null default 0,
  duration_ms integer not null default 0,
  success boolean not null default true,
  error_message text,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.strategy_events (
  id uuid primary key default gen_random_uuid(),
  canvas_id uuid references public.lean_canvases(id) on delete set null,
  event_type text not null,
  source_table text not null,
  source_id text,
  payload jsonb not null default '{}'::jsonb,
  processed boolean not null default false,
  processed_at timestamptz,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.strategy_event_triggers (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  agent_name text not null,
  enabled boolean not null default false,
  cooldown_minutes integer not null default 60,
  last_triggered_at timestamptz,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_type, agent_name)
);

create table if not exists public.strategy_agent_memory (
  id uuid primary key default gen_random_uuid(),
  canvas_id uuid not null references public.lean_canvases(id) on delete cascade,
  agent_name text not null,
  memory_type text not null,
  content jsonb not null,
  relevance_score numeric not null default 1.0,
  superseded_by uuid references public.strategy_agent_memory(id),
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create table if not exists public.strategy_signals (
  id uuid primary key default gen_random_uuid(),
  canvas_id uuid references public.lean_canvases(id) on delete set null,
  signal_category text not null,
  signal_name text not null,
  value numeric not null,
  previous_value numeric,
  unit text not null default '',
  trend text not null default 'stable',
  source text,
  user_id uuid references auth.users(id) on delete cascade,
  collected_at timestamptz not null default now()
);

create table if not exists public.strategy_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  canvas_id uuid not null references public.lean_canvases(id) on delete cascade,
  role text not null check (role in ('admin', 'strategist', 'viewer')),
  created_at timestamptz not null default now(),
  unique (user_id, canvas_id)
);

create table if not exists public.strategy_budgets (
  id uuid primary key default gen_random_uuid(),
  canvas_id uuid not null references public.lean_canvases(id) on delete cascade,
  monthly_token_limit integer not null default 500000,
  tokens_used_this_month integer not null default 0,
  analysis_count_this_month integer not null default 0,
  max_analyses_per_day integer not null default 5,
  analyses_today integer not null default 0,
  last_analysis_at timestamptz,
  min_analysis_interval_minutes integer not null default 30,
  budget_month text,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agent_catalog (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  division text not null,
  emoji text,
  color text,
  vibe text,
  file_path text not null,
  line_count integer default 0,
  tags text[] default '{}',
  sections jsonb default '{}',
  is_curated boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agent_assignments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  agent_slug text not null references public.agent_catalog(slug) on delete restrict,
  role_description text,
  assigned_by text not null,
  status text not null default 'active' check (status in ('active', 'paused', 'completed')),
  first_task text,
  last_output_summary text,
  last_run_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, agent_slug)
);

create table if not exists public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  agent_slug text not null references public.agent_catalog(slug) on delete restrict,
  project_id uuid references public.projects(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  route text not null,
  input_summary text,
  output_summary text,
  full_output jsonb,
  tokens_input integer default 0,
  tokens_output integer default 0,
  duration_ms integer default 0,
  model text,
  success boolean not null default true,
  error_message text,
  created_at timestamptz not null default now()
);

create table if not exists public.insight_cards (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  agent_slug text not null references public.agent_catalog(slug) on delete restrict,
  priority text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  title text not null,
  body text not null,
  impact_label text,
  action_label text,
  action_url text,
  status text not null default 'new' check (status in ('new', 'viewed', 'acted', 'dismissed')),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.agent_team_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text not null,
  goal text not null,
  company_size text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.agent_team_templates_agents (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.agent_team_templates(id) on delete cascade,
  agent_slug text not null references public.agent_catalog(slug) on delete restrict,
  role text not null,
  first_task text,
  sort_order integer not null default 0,
  unique (template_id, agent_slug)
);

create table if not exists public.deal_scores (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references public.crm_deals(id) on delete cascade,
  agent_slug text not null references public.agent_catalog(slug) on delete restrict,
  health_score integer not null default 0 check (health_score between 0 and 100),
  risk_label text,
  recommendation text,
  scoring_breakdown jsonb default '{}',
  scored_at timestamptz not null default now(),
  expires_at timestamptz
);

create table if not exists public.dashboard_documents (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Untitled',
  category text not null default 'deliverables',
  file_type text not null default 'other',
  storage_path text not null,
  project_id uuid references public.projects(id) on delete set null,
  project_name text,
  uploaded_by uuid references auth.users(id) on delete set null,
  user_id uuid references auth.users(id) on delete cascade,
  uploaded_by_name text,
  version integer not null default 1,
  file_size bigint not null default 0,
  mime_type text not null default 'application/octet-stream',
  ai_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_clients_updated_at before update on public.clients
  for each row execute function public.handle_updated_at();
create trigger trg_crm_pipelines_updated_at before update on public.crm_pipelines
  for each row execute function public.handle_updated_at();
create trigger trg_crm_deals_updated_at before update on public.crm_deals
  for each row execute function public.handle_updated_at();
create trigger trg_workflows_updated_at before update on public.workflows
  for each row execute function public.handle_updated_at();
create trigger trg_dashboard_invoices_updated_at before update on public.dashboard_invoices
  for each row execute function public.handle_updated_at();
create trigger trg_projects_updated_at before update on public.projects
  for each row execute function public.handle_updated_at();
create trigger trg_roadmaps_updated_at before update on public.roadmaps
  for each row execute function public.handle_updated_at();
create trigger trg_lean_canvases_updated_at before update on public.lean_canvases
  for each row execute function public.handle_updated_at();
create trigger trg_automation_opportunities_updated_at before update on public.automation_opportunities
  for each row execute function public.handle_updated_at();
create trigger trg_strategy_budgets_updated_at before update on public.strategy_budgets
  for each row execute function public.handle_updated_at();
create trigger trg_agent_catalog_updated_at before update on public.agent_catalog
  for each row execute function public.handle_updated_at();
create trigger trg_agent_assignments_updated_at before update on public.agent_assignments
  for each row execute function public.handle_updated_at();
create trigger trg_dashboard_documents_updated_at before update on public.dashboard_documents
  for each row execute function public.handle_updated_at();
