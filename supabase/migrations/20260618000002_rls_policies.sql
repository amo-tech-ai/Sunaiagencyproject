-- Sun AI Agency Supabase rebuild proposal
-- 000002: RLS policies for a fresh project.
--
-- Policy rules:
-- - RLS enabled on every public user-data table.
-- - No anon policies and no public write policies.
-- - User-owned rows use TO authenticated plus (select auth.uid()).
-- - UPDATE policies include both USING and WITH CHECK.

grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;

alter table public.wizard_sessions enable row level security;
alter table public.wizard_answers enable row level security;
alter table public.ai_cache enable row level security;
alter table public.ai_run_logs enable row level security;
alter table public.clients enable row level security;
alter table public.crm_contacts enable row level security;
alter table public.crm_pipelines enable row level security;
alter table public.crm_stages enable row level security;
alter table public.crm_deals enable row level security;
alter table public.crm_interactions enable row level security;
alter table public.workflows enable row level security;
alter table public.workflow_executions enable row level security;
alter table public.dashboard_invoices enable row level security;
alter table public.dashboard_payments enable row level security;
alter table public.projects enable row level security;
alter table public.roadmaps enable row level security;
alter table public.roadmap_phases enable row level security;
alter table public.activities enable row level security;
alter table public.lean_canvases enable row level security;
alter table public.lean_canvas_versions enable row level security;
alter table public.strategy_insights enable row level security;
alter table public.automation_opportunities enable row level security;
alter table public.strategy_recommendations enable row level security;
alter table public.strategy_actions enable row level security;
alter table public.strategy_events enable row level security;
alter table public.strategy_event_triggers enable row level security;
alter table public.strategy_agent_memory enable row level security;
alter table public.strategy_signals enable row level security;
alter table public.strategy_roles enable row level security;
alter table public.strategy_budgets enable row level security;
alter table public.agent_catalog enable row level security;
alter table public.agent_assignments enable row level security;
alter table public.agent_runs enable row level security;
alter table public.insight_cards enable row level security;
alter table public.agent_team_templates enable row level security;
alter table public.agent_team_templates_agents enable row level security;
alter table public.deal_scores enable row level security;
alter table public.dashboard_documents enable row level security;

create policy wizard_sessions_select_own on public.wizard_sessions
  for select to authenticated using (user_id = (select auth.uid()));
create policy wizard_sessions_insert_own on public.wizard_sessions
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy wizard_sessions_update_own on public.wizard_sessions
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy wizard_sessions_delete_own on public.wizard_sessions
  for delete to authenticated using (user_id = (select auth.uid()));

create policy wizard_answers_select_own on public.wizard_answers
  for select to authenticated using (exists (
    select 1 from public.wizard_sessions s
    where s.id = wizard_answers.session_id and s.user_id = (select auth.uid())
  ));
create policy wizard_answers_insert_own on public.wizard_answers
  for insert to authenticated with check (exists (
    select 1 from public.wizard_sessions s
    where s.id = wizard_answers.session_id and s.user_id = (select auth.uid())
  ));
create policy wizard_answers_update_own on public.wizard_answers
  for update to authenticated using (exists (
    select 1 from public.wizard_sessions s
    where s.id = wizard_answers.session_id and s.user_id = (select auth.uid())
  )) with check (exists (
    select 1 from public.wizard_sessions s
    where s.id = wizard_answers.session_id and s.user_id = (select auth.uid())
  ));
create policy wizard_answers_delete_own on public.wizard_answers
  for delete to authenticated using (exists (
    select 1 from public.wizard_sessions s
    where s.id = wizard_answers.session_id and s.user_id = (select auth.uid())
  ));

create policy ai_cache_no_client_access on public.ai_cache
  for select to authenticated using (false);
create policy ai_run_logs_select_authenticated on public.ai_run_logs
  for select to authenticated using (true);

create policy clients_select_own on public.clients
  for select to authenticated using (user_id = (select auth.uid()) or created_by = (select auth.uid()));
create policy clients_insert_own on public.clients
  for insert to authenticated with check (user_id = (select auth.uid()) or created_by = (select auth.uid()));
create policy clients_update_own on public.clients
  for update to authenticated using (user_id = (select auth.uid()) or created_by = (select auth.uid()))
  with check (user_id = (select auth.uid()) or created_by = (select auth.uid()));
create policy clients_delete_own on public.clients
  for delete to authenticated using (user_id = (select auth.uid()) or created_by = (select auth.uid()));

create policy crm_contacts_select_own on public.crm_contacts
  for select to authenticated using (user_id = (select auth.uid()) or exists (
    select 1 from public.clients c where c.id = crm_contacts.client_id and (c.user_id = (select auth.uid()) or c.created_by = (select auth.uid()))
  ));
create policy crm_contacts_insert_own on public.crm_contacts
  for insert to authenticated with check (user_id = (select auth.uid()) or exists (
    select 1 from public.clients c where c.id = crm_contacts.client_id and (c.user_id = (select auth.uid()) or c.created_by = (select auth.uid()))
  ));
create policy crm_contacts_update_own on public.crm_contacts
  for update to authenticated using (user_id = (select auth.uid()) or exists (
    select 1 from public.clients c where c.id = crm_contacts.client_id and (c.user_id = (select auth.uid()) or c.created_by = (select auth.uid()))
  )) with check (user_id = (select auth.uid()) or exists (
    select 1 from public.clients c where c.id = crm_contacts.client_id and (c.user_id = (select auth.uid()) or c.created_by = (select auth.uid()))
  ));
create policy crm_contacts_delete_own on public.crm_contacts
  for delete to authenticated using (user_id = (select auth.uid()) or exists (
    select 1 from public.clients c where c.id = crm_contacts.client_id and (c.user_id = (select auth.uid()) or c.created_by = (select auth.uid()))
  ));

create policy crm_pipelines_select_own_or_seeded on public.crm_pipelines
  for select to authenticated using (created_by = (select auth.uid()) or created_by is null);
create policy crm_pipelines_insert_own on public.crm_pipelines
  for insert to authenticated with check (created_by = (select auth.uid()));
create policy crm_pipelines_update_own on public.crm_pipelines
  for update to authenticated using (created_by = (select auth.uid())) with check (created_by = (select auth.uid()));
create policy crm_pipelines_delete_own on public.crm_pipelines
  for delete to authenticated using (created_by = (select auth.uid()));

create policy crm_stages_select_accessible on public.crm_stages
  for select to authenticated using (exists (
    select 1 from public.crm_pipelines p where p.id = crm_stages.pipeline_id and (p.created_by = (select auth.uid()) or p.created_by is null)
  ));
create policy crm_stages_insert_own_pipeline on public.crm_stages
  for insert to authenticated with check (exists (
    select 1 from public.crm_pipelines p where p.id = crm_stages.pipeline_id and p.created_by = (select auth.uid())
  ));
create policy crm_stages_update_own_pipeline on public.crm_stages
  for update to authenticated using (exists (
    select 1 from public.crm_pipelines p where p.id = crm_stages.pipeline_id and p.created_by = (select auth.uid())
  )) with check (exists (
    select 1 from public.crm_pipelines p where p.id = crm_stages.pipeline_id and p.created_by = (select auth.uid())
  ));
create policy crm_stages_delete_own_pipeline on public.crm_stages
  for delete to authenticated using (exists (
    select 1 from public.crm_pipelines p where p.id = crm_stages.pipeline_id and p.created_by = (select auth.uid())
  ));

create policy crm_deals_select_own on public.crm_deals
  for select to authenticated using (user_id = (select auth.uid()) or owner_id = (select auth.uid()));
create policy crm_deals_insert_own on public.crm_deals
  for insert to authenticated with check (user_id = (select auth.uid()) or owner_id = (select auth.uid()));
create policy crm_deals_update_own on public.crm_deals
  for update to authenticated using (user_id = (select auth.uid()) or owner_id = (select auth.uid()))
  with check (user_id = (select auth.uid()) or owner_id = (select auth.uid()));
create policy crm_deals_delete_own on public.crm_deals
  for delete to authenticated using (user_id = (select auth.uid()) or owner_id = (select auth.uid()));

create policy crm_interactions_select_own on public.crm_interactions
  for select to authenticated using (user_id = (select auth.uid()) or created_by = (select auth.uid()));
create policy crm_interactions_insert_own on public.crm_interactions
  for insert to authenticated with check (user_id = (select auth.uid()) or created_by = (select auth.uid()));
create policy crm_interactions_update_own on public.crm_interactions
  for update to authenticated using (user_id = (select auth.uid()) or created_by = (select auth.uid()))
  with check (user_id = (select auth.uid()) or created_by = (select auth.uid()));
create policy crm_interactions_delete_own on public.crm_interactions
  for delete to authenticated using (user_id = (select auth.uid()) or created_by = (select auth.uid()));

create policy workflows_select_own on public.workflows for select to authenticated using (user_id = (select auth.uid()));
create policy workflows_insert_own on public.workflows for insert to authenticated with check (user_id = (select auth.uid()));
create policy workflows_update_own on public.workflows for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy workflows_delete_own on public.workflows for delete to authenticated using (user_id = (select auth.uid()));

create policy workflow_executions_select_own on public.workflow_executions for select to authenticated using (user_id = (select auth.uid()));
create policy workflow_executions_insert_own on public.workflow_executions for insert to authenticated with check (user_id = (select auth.uid()));

create policy dashboard_invoices_select_own on public.dashboard_invoices for select to authenticated using (user_id = (select auth.uid()));
create policy dashboard_invoices_insert_own on public.dashboard_invoices for insert to authenticated with check (user_id = (select auth.uid()));
create policy dashboard_invoices_update_own on public.dashboard_invoices for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy dashboard_invoices_delete_own on public.dashboard_invoices for delete to authenticated using (user_id = (select auth.uid()));

create policy dashboard_payments_select_own on public.dashboard_payments for select to authenticated using (user_id = (select auth.uid()));
create policy dashboard_payments_insert_own on public.dashboard_payments for insert to authenticated with check (user_id = (select auth.uid()));

create policy projects_select_own on public.projects for select to authenticated using (user_id = (select auth.uid()));
create policy projects_insert_own on public.projects for insert to authenticated with check (user_id = (select auth.uid()));
create policy projects_update_own on public.projects for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy projects_delete_own on public.projects for delete to authenticated using (user_id = (select auth.uid()));

create policy roadmaps_select_own on public.roadmaps for select to authenticated using (user_id = (select auth.uid()) or exists (
  select 1 from public.projects p where p.id = roadmaps.project_id and p.user_id = (select auth.uid())
));
create policy roadmaps_insert_own on public.roadmaps for insert to authenticated with check (user_id = (select auth.uid()) or exists (
  select 1 from public.projects p where p.id = roadmaps.project_id and p.user_id = (select auth.uid())
));
create policy roadmaps_update_own on public.roadmaps for update to authenticated using (user_id = (select auth.uid()) or exists (
  select 1 from public.projects p where p.id = roadmaps.project_id and p.user_id = (select auth.uid())
)) with check (user_id = (select auth.uid()) or exists (
  select 1 from public.projects p where p.id = roadmaps.project_id and p.user_id = (select auth.uid())
));

create policy roadmap_phases_select_own on public.roadmap_phases for select to authenticated using (user_id = (select auth.uid()) or exists (
  select 1 from public.roadmaps r join public.projects p on p.id = r.project_id
  where r.id = roadmap_phases.roadmap_id and p.user_id = (select auth.uid())
));
create policy roadmap_phases_insert_own on public.roadmap_phases for insert to authenticated with check (user_id = (select auth.uid()) or exists (
  select 1 from public.roadmaps r join public.projects p on p.id = r.project_id
  where r.id = roadmap_phases.roadmap_id and p.user_id = (select auth.uid())
));
create policy roadmap_phases_update_own on public.roadmap_phases for update to authenticated using (user_id = (select auth.uid()) or exists (
  select 1 from public.roadmaps r join public.projects p on p.id = r.project_id
  where r.id = roadmap_phases.roadmap_id and p.user_id = (select auth.uid())
)) with check (user_id = (select auth.uid()) or exists (
  select 1 from public.roadmaps r join public.projects p on p.id = r.project_id
  where r.id = roadmap_phases.roadmap_id and p.user_id = (select auth.uid())
));

create policy activities_select_own on public.activities for select to authenticated using (user_id = (select auth.uid()));
create policy activities_insert_own on public.activities for insert to authenticated with check (user_id = (select auth.uid()));

create policy lean_canvases_select_own on public.lean_canvases for select to authenticated using (user_id = (select auth.uid()));
create policy lean_canvases_insert_own on public.lean_canvases for insert to authenticated with check (user_id = (select auth.uid()));
create policy lean_canvases_update_own on public.lean_canvases for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy lean_canvases_delete_own on public.lean_canvases for delete to authenticated using (user_id = (select auth.uid()));

create policy lean_canvas_versions_select_own on public.lean_canvas_versions for select to authenticated using (user_id = (select auth.uid()));
create policy lean_canvas_versions_insert_own on public.lean_canvas_versions for insert to authenticated with check (user_id = (select auth.uid()));

create policy strategy_insights_select_own on public.strategy_insights for select to authenticated using (user_id = (select auth.uid()));
create policy strategy_insights_insert_own on public.strategy_insights for insert to authenticated with check (user_id = (select auth.uid()));
create policy strategy_insights_update_own on public.strategy_insights for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy strategy_insights_delete_own on public.strategy_insights for delete to authenticated using (user_id = (select auth.uid()));

create policy automation_opportunities_select_own on public.automation_opportunities for select to authenticated using (user_id = (select auth.uid()));
create policy automation_opportunities_insert_own on public.automation_opportunities for insert to authenticated with check (user_id = (select auth.uid()));
create policy automation_opportunities_update_own on public.automation_opportunities for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy automation_opportunities_delete_own on public.automation_opportunities for delete to authenticated using (user_id = (select auth.uid()));

create policy strategy_recommendations_select_own on public.strategy_recommendations for select to authenticated using (user_id = (select auth.uid()));
create policy strategy_recommendations_insert_own on public.strategy_recommendations for insert to authenticated with check (user_id = (select auth.uid()));
create policy strategy_recommendations_update_own on public.strategy_recommendations for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy strategy_recommendations_delete_own on public.strategy_recommendations for delete to authenticated using (user_id = (select auth.uid()));

create policy strategy_actions_select_own on public.strategy_actions for select to authenticated using (user_id = (select auth.uid()));
create policy strategy_actions_insert_own on public.strategy_actions for insert to authenticated with check (user_id = (select auth.uid()));

create policy strategy_events_select_own on public.strategy_events for select to authenticated using (user_id = (select auth.uid()));
create policy strategy_events_insert_own on public.strategy_events for insert to authenticated with check (user_id = (select auth.uid()));
create policy strategy_events_update_own on public.strategy_events for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy strategy_events_delete_own on public.strategy_events for delete to authenticated using (user_id = (select auth.uid()));

create policy strategy_event_triggers_select_own on public.strategy_event_triggers for select to authenticated using (user_id = (select auth.uid()));
create policy strategy_event_triggers_insert_own on public.strategy_event_triggers for insert to authenticated with check (user_id = (select auth.uid()));
create policy strategy_event_triggers_update_own on public.strategy_event_triggers for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy strategy_event_triggers_delete_own on public.strategy_event_triggers for delete to authenticated using (user_id = (select auth.uid()));

create policy strategy_agent_memory_select_own on public.strategy_agent_memory for select to authenticated using (user_id = (select auth.uid()));
create policy strategy_agent_memory_insert_own on public.strategy_agent_memory for insert to authenticated with check (user_id = (select auth.uid()));
create policy strategy_agent_memory_update_own on public.strategy_agent_memory for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy strategy_agent_memory_delete_own on public.strategy_agent_memory for delete to authenticated using (user_id = (select auth.uid()));

create policy strategy_signals_select_own on public.strategy_signals for select to authenticated using (user_id = (select auth.uid()));
create policy strategy_signals_insert_own on public.strategy_signals for insert to authenticated with check (user_id = (select auth.uid()));

create policy strategy_roles_select_own on public.strategy_roles for select to authenticated using (user_id = (select auth.uid()));
create policy strategy_roles_insert_own on public.strategy_roles for insert to authenticated with check (user_id = (select auth.uid()));
create policy strategy_roles_update_own on public.strategy_roles for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy strategy_roles_delete_own on public.strategy_roles for delete to authenticated using (user_id = (select auth.uid()));

create policy strategy_budgets_select_own on public.strategy_budgets for select to authenticated using (user_id = (select auth.uid()));
create policy strategy_budgets_insert_own on public.strategy_budgets for insert to authenticated with check (user_id = (select auth.uid()));
create policy strategy_budgets_update_own on public.strategy_budgets for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy strategy_budgets_delete_own on public.strategy_budgets for delete to authenticated using (user_id = (select auth.uid()));

create policy agent_catalog_select_active on public.agent_catalog
  for select to authenticated using (is_active = true);
create policy agent_team_templates_select_active on public.agent_team_templates
  for select to authenticated using (is_active = true);
create policy agent_team_templates_agents_select_active on public.agent_team_templates_agents
  for select to authenticated using (exists (
    select 1 from public.agent_team_templates t
    where t.id = agent_team_templates_agents.template_id and t.is_active = true
  ));

create policy agent_assignments_select_project_owner on public.agent_assignments
  for select to authenticated using (exists (
    select 1 from public.projects p where p.id = agent_assignments.project_id and p.user_id = (select auth.uid())
  ));
create policy agent_assignments_insert_project_owner on public.agent_assignments
  for insert to authenticated with check (exists (
    select 1 from public.projects p where p.id = agent_assignments.project_id and p.user_id = (select auth.uid())
  ));
create policy agent_assignments_update_project_owner on public.agent_assignments
  for update to authenticated using (exists (
    select 1 from public.projects p where p.id = agent_assignments.project_id and p.user_id = (select auth.uid())
  )) with check (exists (
    select 1 from public.projects p where p.id = agent_assignments.project_id and p.user_id = (select auth.uid())
  ));
create policy agent_assignments_delete_project_owner on public.agent_assignments
  for delete to authenticated using (exists (
    select 1 from public.projects p where p.id = agent_assignments.project_id and p.user_id = (select auth.uid())
  ));

create policy agent_runs_select_own on public.agent_runs for select to authenticated using (user_id = (select auth.uid()));
create policy agent_runs_insert_own on public.agent_runs for insert to authenticated with check (user_id = (select auth.uid()));

create policy insight_cards_select_project_owner on public.insight_cards
  for select to authenticated using (exists (
    select 1 from public.projects p where p.id = insight_cards.project_id and p.user_id = (select auth.uid())
  ));
create policy insight_cards_update_project_owner on public.insight_cards
  for update to authenticated using (exists (
    select 1 from public.projects p where p.id = insight_cards.project_id and p.user_id = (select auth.uid())
  )) with check (exists (
    select 1 from public.projects p where p.id = insight_cards.project_id and p.user_id = (select auth.uid())
  ));

create policy deal_scores_select_own_deal on public.deal_scores
  for select to authenticated using (exists (
    select 1 from public.crm_deals d where d.id = deal_scores.deal_id and d.user_id = (select auth.uid())
  ));

create policy dashboard_documents_select_own on public.dashboard_documents for select to authenticated using (user_id = (select auth.uid()) or uploaded_by = (select auth.uid()));
create policy dashboard_documents_insert_own on public.dashboard_documents for insert to authenticated with check (user_id = (select auth.uid()) or uploaded_by = (select auth.uid()));
create policy dashboard_documents_update_own on public.dashboard_documents for update to authenticated using (user_id = (select auth.uid()) or uploaded_by = (select auth.uid()))
  with check (user_id = (select auth.uid()) or uploaded_by = (select auth.uid()));
create policy dashboard_documents_delete_own on public.dashboard_documents for delete to authenticated using (user_id = (select auth.uid()) or uploaded_by = (select auth.uid()));
