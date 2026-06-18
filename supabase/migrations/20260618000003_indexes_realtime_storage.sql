-- Sun AI Agency Supabase rebuild proposal
-- 000003: Performance indexes, realtime broadcast triggers, and storage bucket.

create index if not exists idx_wizard_sessions_user_updated on public.wizard_sessions (user_id, updated_at desc);
create index if not exists idx_wizard_sessions_status on public.wizard_sessions (status);
create index if not exists idx_wizard_answers_session_step on public.wizard_answers (session_id, step_number);
create index if not exists idx_ai_cache_expires_at on public.ai_cache (expires_at);
create index if not exists idx_ai_run_logs_created_at on public.ai_run_logs (created_at desc);
create index if not exists idx_ai_run_logs_session_id on public.ai_run_logs (session_id) where session_id is not null;
create index if not exists idx_ai_run_logs_prompt_type on public.ai_run_logs (prompt_type);

create index if not exists idx_clients_user_updated on public.clients (user_id, updated_at desc);
create index if not exists idx_clients_created_by on public.clients (created_by) where created_by is not null;
create index if not exists idx_clients_status on public.clients (status);
create index if not exists idx_crm_contacts_client_id on public.crm_contacts (client_id);
create index if not exists idx_crm_contacts_user_id on public.crm_contacts (user_id) where user_id is not null;
create index if not exists idx_crm_stages_pipeline_id on public.crm_stages (pipeline_id, position);
create index if not exists idx_crm_deals_user_id on public.crm_deals (user_id) where user_id is not null;
create index if not exists idx_crm_deals_pipeline_stage on public.crm_deals (pipeline_id, stage_id);
create index if not exists idx_crm_deals_client_id on public.crm_deals (client_id) where client_id is not null;
create index if not exists idx_crm_deals_contact_id on public.crm_deals (contact_id) where contact_id is not null;
create index if not exists idx_crm_deals_expected_close on public.crm_deals (expected_close_date) where expected_close_date is not null;
create index if not exists idx_crm_interactions_deal_id on public.crm_interactions (deal_id, created_at desc);
create index if not exists idx_crm_interactions_user_id on public.crm_interactions (user_id) where user_id is not null;

create index if not exists idx_workflows_user_updated on public.workflows (user_id, updated_at desc);
create index if not exists idx_workflow_executions_user_created on public.workflow_executions (user_id, created_at desc);
create index if not exists idx_workflow_executions_workflow_id on public.workflow_executions (workflow_id);
create index if not exists idx_dashboard_invoices_user_created on public.dashboard_invoices (user_id, created_at desc);
create index if not exists idx_dashboard_invoices_status on public.dashboard_invoices (status);
create index if not exists idx_dashboard_payments_user_created on public.dashboard_payments (user_id, created_at desc);
create index if not exists idx_dashboard_payments_invoice_id on public.dashboard_payments (invoice_id);

create index if not exists idx_projects_user_updated on public.projects (user_id, updated_at desc);
create index if not exists idx_projects_client_id on public.projects (client_id) where client_id is not null;
create index if not exists idx_projects_wizard_session on public.projects (wizard_session_id) where wizard_session_id is not null;
create index if not exists idx_roadmaps_project_id on public.roadmaps (project_id);
create index if not exists idx_roadmaps_user_id on public.roadmaps (user_id);
create index if not exists idx_roadmap_phases_roadmap_id on public.roadmap_phases (roadmap_id);
create index if not exists idx_roadmap_phases_user_id on public.roadmap_phases (user_id);
create index if not exists idx_activities_user_created on public.activities (user_id, created_at desc);
create index if not exists idx_activities_project_id on public.activities (project_id) where project_id is not null;

create index if not exists idx_canvas_user on public.lean_canvases (user_id);
create index if not exists idx_canvas_session on public.lean_canvases (session_id);
create index if not exists idx_canvas_project on public.lean_canvases (project_id);
create index if not exists idx_canvas_current on public.lean_canvases (user_id, is_current) where is_current = true;
create index if not exists idx_canvas_versions_canvas_id on public.lean_canvas_versions (canvas_id);
create index if not exists idx_canvas_versions_user_id on public.lean_canvas_versions (user_id);
create index if not exists idx_strategy_insights_user_created on public.strategy_insights (user_id, created_at desc);
create index if not exists idx_strategy_insights_canvas on public.strategy_insights (canvas_id);
create index if not exists idx_automation_opportunities_user_status on public.automation_opportunities (user_id, status);
create index if not exists idx_strategy_recommendations_user_status on public.strategy_recommendations (user_id, approval_status);
create index if not exists idx_strategy_actions_user_created on public.strategy_actions (user_id, created_at desc);
create index if not exists idx_strategy_events_user_created on public.strategy_events (user_id, created_at desc);
create index if not exists idx_strategy_agent_memory_canvas_agent on public.strategy_agent_memory (canvas_id, agent_name);
create index if not exists idx_strategy_signals_user_canvas on public.strategy_signals (user_id, canvas_id);
create index if not exists idx_strategy_roles_user_canvas on public.strategy_roles (user_id, canvas_id);
create index if not exists idx_strategy_budgets_user_canvas on public.strategy_budgets (user_id, canvas_id);

create index if not exists idx_agent_catalog_slug on public.agent_catalog (slug);
create index if not exists idx_agent_catalog_active on public.agent_catalog (is_active) where is_active = true;
create index if not exists idx_agent_catalog_tags on public.agent_catalog using gin (tags);
create index if not exists idx_agent_assignments_project_id on public.agent_assignments (project_id);
create index if not exists idx_agent_runs_user_created on public.agent_runs (user_id, created_at desc);
create index if not exists idx_insight_cards_project_status on public.insight_cards (project_id, status);
create index if not exists idx_agent_team_templates_industry_goal on public.agent_team_templates (industry, goal);
create index if not exists idx_agent_team_templates_agents_template on public.agent_team_templates_agents (template_id, sort_order);
create index if not exists idx_deal_scores_deal_id on public.deal_scores (deal_id);
create index if not exists idx_dashboard_documents_user_created on public.dashboard_documents (user_id, created_at desc);
create index if not exists idx_dashboard_documents_project_id on public.dashboard_documents (project_id) where project_id is not null;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'ai_run_logs'
  ) then
    alter publication supabase_realtime add table public.ai_run_logs;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'wizard_sessions'
  ) then
    alter publication supabase_realtime add table public.wizard_sessions;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'crm_deals'
  ) then
    alter publication supabase_realtime add table public.crm_deals;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'lean_canvases'
  ) then
    alter publication supabase_realtime add table public.lean_canvases;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'lean_canvas_versions'
  ) then
    alter publication supabase_realtime add table public.lean_canvas_versions;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'agent_runs'
  ) then
    alter publication supabase_realtime add table public.agent_runs;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'insight_cards'
  ) then
    alter publication supabase_realtime add table public.insight_cards;
  end if;
end $$;

create or replace function public.ai_run_logs_broadcast_trigger()
returns trigger
language plpgsql
security definer
set search_path = public, realtime
as $$
begin
  perform realtime.broadcast_changes('ai-runs:global', tg_op, tg_op, tg_table_name, tg_table_schema, new, old);
  return coalesce(new, old);
end;
$$;
revoke all on function public.ai_run_logs_broadcast_trigger() from public, anon, authenticated;

create or replace function public.wizard_sessions_broadcast_trigger()
returns trigger
language plpgsql
security definer
set search_path = public, realtime
as $$
begin
  if old.current_step is distinct from new.current_step
     or old.status is distinct from new.status
     or old.form_data is distinct from new.form_data then
    perform realtime.broadcast_changes('wizard:session:' || new.id::text, tg_op, tg_op, tg_table_name, tg_table_schema, new, old);
  end if;
  return new;
end;
$$;
revoke all on function public.wizard_sessions_broadcast_trigger() from public, anon, authenticated;

create or replace function public.crm_deals_broadcast_trigger()
returns trigger
language plpgsql
security definer
set search_path = public, realtime
as $$
declare
  pipeline uuid;
begin
  pipeline := coalesce(new.pipeline_id, old.pipeline_id);
  perform realtime.broadcast_changes('pipeline:' || pipeline::text || ':deals', tg_op, tg_op, tg_table_name, tg_table_schema, new, old);
  return coalesce(new, old);
end;
$$;
revoke all on function public.crm_deals_broadcast_trigger() from public, anon, authenticated;

create or replace function public.lean_canvases_broadcast_trigger()
returns trigger
language plpgsql
security definer
set search_path = public, realtime
as $$
begin
  if old.problem is distinct from new.problem
     or old.customer_segments is distinct from new.customer_segments
     or old.value_proposition is distinct from new.value_proposition
     or old.solution is distinct from new.solution
     or old.channels is distinct from new.channels
     or old.revenue_streams is distinct from new.revenue_streams
     or old.cost_structure is distinct from new.cost_structure
     or old.key_metrics is distinct from new.key_metrics
     or old.unfair_advantage is distinct from new.unfair_advantage
     or old.version is distinct from new.version then
    perform realtime.broadcast_changes('canvas:' || new.id::text || ':blocks', tg_op, tg_op, tg_table_name, tg_table_schema, new, old);
  end if;
  return new;
end;
$$;
revoke all on function public.lean_canvases_broadcast_trigger() from public, anon, authenticated;

create or replace function public.lean_canvas_versions_broadcast_trigger()
returns trigger
language plpgsql
security definer
set search_path = public, realtime
as $$
begin
  perform realtime.send(
    'canvas:' || new.canvas_id::text || ':blocks',
    'version_created',
    jsonb_build_object(
      'version_id', new.id,
      'canvas_id', new.canvas_id,
      'version', new.version,
      'change_summary', new.change_summary,
      'changed_by', new.changed_by,
      'created_at', new.created_at
    ),
    true
  );
  return new;
end;
$$;
revoke all on function public.lean_canvas_versions_broadcast_trigger() from public, anon, authenticated;

create trigger ai_run_logs_broadcast_trigger
  after insert on public.ai_run_logs
  for each row execute function public.ai_run_logs_broadcast_trigger();

create trigger wizard_sessions_broadcast_trigger
  after update on public.wizard_sessions
  for each row execute function public.wizard_sessions_broadcast_trigger();

create trigger crm_deals_broadcast_trigger
  after insert or update or delete on public.crm_deals
  for each row execute function public.crm_deals_broadcast_trigger();

create trigger lean_canvases_broadcast_trigger
  after update on public.lean_canvases
  for each row execute function public.lean_canvases_broadcast_trigger();

create trigger lean_canvas_versions_broadcast_trigger
  after insert on public.lean_canvas_versions
  for each row execute function public.lean_canvas_versions_broadcast_trigger();

alter table realtime.messages enable row level security;

create policy ai_runs_read on realtime.messages
  for select to authenticated using (topic = 'ai-runs:global');

create policy wizard_sessions_read on realtime.messages
  for select to authenticated using (
    topic like 'wizard:session:%'
    and exists (
      select 1 from public.wizard_sessions s
      where s.id::text = replace(topic, 'wizard:session:', '')
        and s.user_id = (select auth.uid())
    )
  );

create policy pipeline_deals_read on realtime.messages
  for select to authenticated using (topic like 'pipeline:%:deals');

create policy canvas_blocks_read on realtime.messages
  for select to authenticated using (
    topic like 'canvas:%:blocks'
    and exists (
      select 1 from public.lean_canvases c
      where c.id::text = split_part(topic, ':', 2)
        and c.user_id = (select auth.uid())
    )
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'make-283466b6-documents',
  'make-283466b6-documents',
  false,
  52428800,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'image/png',
    'image/jpeg'
  ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy documents_storage_select_own on storage.objects
  for select to authenticated
  using (
    bucket_id = 'make-283466b6-documents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy documents_storage_insert_own on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'make-283466b6-documents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy documents_storage_update_own on storage.objects
  for update to authenticated
  using (
    bucket_id = 'make-283466b6-documents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'make-283466b6-documents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy documents_storage_delete_own on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'make-283466b6-documents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
