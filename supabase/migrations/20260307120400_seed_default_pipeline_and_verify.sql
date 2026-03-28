-- ============================================================================
-- Migration: Seed default CRM pipeline with stages + verify wizard_answers
-- Purpose:   1. Create "New Business" default pipeline with 6 stages so the
--               kanban board works immediately without manual setup.
--            2. Create "Upsell" pipeline with 4 stages.
--            3. Verify wizard_answers has the unique constraint on
--               (session_id, step_number) needed for upsert operations.
-- Affected:  crm_pipelines (INSERT), crm_stages (INSERT), wizard_answers (constraint)
-- Ref:       /docs/dashboard/07-crm-pipeline.md lines 261-272 (stage definitions)
-- Safety:    Uses ON CONFLICT DO NOTHING — safe to run multiple times.
--            Only inserts seed data; never modifies or deletes existing rows.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Verify wizard_answers unique constraint exists
--    The upsert in wizard-routes.tsx and ai-routes.tsx both use:
--      onConflict: "session_id,step_number"
--    This requires a unique constraint/index on (session_id, step_number).
-- ---------------------------------------------------------------------------

-- Create unique index if it doesn't already exist
-- Using DO block with exception handling for idempotency
do $$
begin
  -- Try to create the unique index
  if not exists (
    select 1 from pg_indexes
    where tablename = 'wizard_answers'
      and indexname = 'idx_wizard_answers_session_step_unique'
  ) then
    -- Check if a constraint already provides this uniqueness
    if not exists (
      select 1 from pg_constraint c
      join pg_class t on c.conrelid = t.oid
      where t.relname = 'wizard_answers'
        and c.contype = 'u'
        and array_length(c.conkey, 1) = 2
    ) then
      create unique index idx_wizard_answers_session_step_unique
        on wizard_answers (session_id, step_number);
      raise notice 'Created unique index on wizard_answers(session_id, step_number)';
    else
      raise notice 'Unique constraint on wizard_answers(session_id, step_number) already exists';
    end if;
  else
    raise notice 'Index idx_wizard_answers_session_step_unique already exists';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 2. Seed "New Business" pipeline (default)
--    Stages from doc 07 line 263-270:
--    Lead (#9CA39B) → Qualified (#3B82F6) → Proposal Sent (#D97706) →
--    Negotiation (#00875A) → Closed Won (#1A1A1A) → Closed Lost (#DC2626)
-- ---------------------------------------------------------------------------

-- Insert default pipeline (idempotent — uses a deterministic UUID)
-- Using a fixed UUID so this migration can be re-run safely
insert into crm_pipelines (id, name, description, is_default, created_at, updated_at)
values (
  '00000000-0000-4000-a000-000000000001',
  'New Business',
  'Default pipeline for new client acquisitions. Deals auto-created from wizard completion.',
  true,
  now(),
  now()
)
on conflict (id) do nothing;

-- Insert stages for "New Business" pipeline
-- Each stage uses a deterministic UUID for idempotency
insert into crm_stages (id, pipeline_id, name, position, color, is_closed_won, is_closed_lost, created_at)
values
  -- Position 1: Lead — initial stage for inbound leads
  -- Auto-trigger: Wizard Steps 1-2 completed
  ('00000000-0000-4000-b001-000000000001',
   '00000000-0000-4000-a000-000000000001',
   'Lead', 1, '#9CA39B', false, false, now()),

  -- Position 2: Qualified — lead has been assessed and shows potential
  -- Auto-trigger: Wizard Steps 3-4 completed (readiness score generated)
  ('00000000-0000-4000-b001-000000000002',
   '00000000-0000-4000-a000-000000000001',
   'Qualified', 2, '#3B82F6', false, false, now()),

  -- Position 3: Proposal Sent — formal proposal delivered to prospect
  -- Trigger: Manual or proposal document uploaded
  ('00000000-0000-4000-b001-000000000003',
   '00000000-0000-4000-a000-000000000001',
   'Proposal Sent', 3, '#D97706', false, false, now()),

  -- Position 4: Negotiation — active deal discussion
  -- Trigger: Manual
  ('00000000-0000-4000-b001-000000000004',
   '00000000-0000-4000-a000-000000000001',
   'Negotiation', 4, '#00875A', false, false, now()),

  -- Position 5: Closed Won — deal signed, revenue recognized
  -- Terminal stage: excluded from active pipeline, included in won metrics
  ('00000000-0000-4000-b001-000000000005',
   '00000000-0000-4000-a000-000000000001',
   'Closed Won', 5, '#1A1A1A', true, false, now()),

  -- Position 6: Closed Lost — deal did not convert
  -- Terminal stage: excluded from active pipeline, included in lost metrics
  ('00000000-0000-4000-b001-000000000006',
   '00000000-0000-4000-a000-000000000001',
   'Closed Lost', 6, '#DC2626', false, true, now())

on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 3. Seed "Upsell" pipeline
--    From doc 07 line 272: Identified, Pitched, Approved, Delivered
-- ---------------------------------------------------------------------------

insert into crm_pipelines (id, name, description, is_default, created_at, updated_at)
values (
  '00000000-0000-4000-a000-000000000002',
  'Upsell',
  'Pipeline for expanding existing client engagements with additional AI services.',
  false,
  now(),
  now()
)
on conflict (id) do nothing;

insert into crm_stages (id, pipeline_id, name, position, color, is_closed_won, is_closed_lost, created_at)
values
  -- Upsell stages — simpler 4-stage process
  ('00000000-0000-4000-b002-000000000001',
   '00000000-0000-4000-a000-000000000002',
   'Identified', 1, '#9CA39B', false, false, now()),

  ('00000000-0000-4000-b002-000000000002',
   '00000000-0000-4000-a000-000000000002',
   'Pitched', 2, '#3B82F6', false, false, now()),

  ('00000000-0000-4000-b002-000000000003',
   '00000000-0000-4000-a000-000000000002',
   'Approved', 3, '#00875A', false, false, now()),

  ('00000000-0000-4000-b002-000000000004',
   '00000000-0000-4000-a000-000000000002',
   'Delivered', 4, '#1A1A1A', true, false, now())

on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 4. Verification queries (run manually after migration to confirm)
-- ---------------------------------------------------------------------------

-- Verify table counts:
-- select 'crm_pipelines' as tbl, count(*) from crm_pipelines
-- union all select 'crm_stages', count(*) from crm_stages
-- union all select 'crm_deals', count(*) from crm_deals
-- union all select 'crm_interactions', count(*) from crm_interactions
-- union all select 'clients', count(*) from clients
-- union all select 'crm_contacts', count(*) from crm_contacts
-- union all select 'ai_cache', count(*) from ai_cache
-- union all select 'ai_run_logs', count(*) from ai_run_logs
-- union all select 'wizard_sessions', count(*) from wizard_sessions
-- union all select 'wizard_answers', count(*) from wizard_answers;

-- Verify pipeline stages are ordered correctly:
-- select p.name as pipeline, s.position, s.name as stage, s.color
-- from crm_stages s join crm_pipelines p on s.pipeline_id = p.id
-- order by p.name, s.position;

-- Verify RLS is enabled on all tables:
-- select tablename, rowsecurity
-- from pg_tables
-- where schemaname = 'public'
--   and tablename in ('clients', 'crm_contacts', 'crm_pipelines',
--                     'crm_stages', 'crm_deals', 'crm_interactions',
--                     'ai_cache', 'ai_run_logs', 'wizard_sessions', 'wizard_answers')
-- order by tablename;
