-- Sun AI Agency local/demo seed data.
-- Safe seed only: no real users, secrets, customer data, or auth rows.

insert into public.crm_pipelines (id, name, description, is_default, created_by)
select
  '00000000-0000-4000-8000-000000000101'::uuid,
  'New Business',
  'Default demo pipeline for local development.',
  true,
  null
where not exists (
  select 1 from public.crm_pipelines where id = '00000000-0000-4000-8000-000000000101'::uuid
);

insert into public.crm_stages (id, pipeline_id, name, position, color, is_closed_won, is_closed_lost)
values
  ('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000101', 'Lead', 1, '#9CA39B', false, false),
  ('00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000101', 'Qualified', 2, '#3B82F6', false, false),
  ('00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000101', 'Proposal Sent', 3, '#D97706', false, false),
  ('00000000-0000-4000-8000-000000000204', '00000000-0000-4000-8000-000000000101', 'Negotiation', 4, '#00875A', false, false),
  ('00000000-0000-4000-8000-000000000205', '00000000-0000-4000-8000-000000000101', 'Closed Won', 5, '#1A1A1A', true, false),
  ('00000000-0000-4000-8000-000000000206', '00000000-0000-4000-8000-000000000101', 'Closed Lost', 6, '#DC2626', false, true)
on conflict (pipeline_id, position) do update
set name = excluded.name,
    color = excluded.color,
    is_closed_won = excluded.is_closed_won,
    is_closed_lost = excluded.is_closed_lost;

insert into public.strategy_event_triggers (event_type, agent_name, enabled, cooldown_minutes)
values
  ('analysis_complete', 'strategy-synthesize', false, 60),
  ('recommendation_approved', 'project-shepherd', false, 60),
  ('canvas_updated', 'metrics-interpret', false, 60)
on conflict (event_type, agent_name) do update
set enabled = excluded.enabled,
    cooldown_minutes = excluded.cooldown_minutes;
