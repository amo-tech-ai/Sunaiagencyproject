-- Migration: Prepare tables for edge function KV→tables refactor
-- Makes org_id/project_id nullable for anonymous wizard sessions,
-- adds ai_results column, adds unique constraint for upserts,
-- and makes ai_run_logs.org_id nullable for anonymous AI calls.

begin;

-- 1. wizard_sessions: allow anonymous sessions (no org/project yet)
alter table wizard_sessions
  alter column org_id drop not null,
  alter column project_id drop not null;

-- 2. wizard_answers: allow anonymous answers, add ai_results storage
alter table wizard_answers
  alter column org_id drop not null;

alter table wizard_answers
  add column if not exists ai_results jsonb;

comment on column wizard_answers.ai_results is
  'AI-generated results for this wizard step (analysis, diagnostics, recommendations, readiness, roadmap)';

-- 3. wizard_answers: unique constraint for upserts on (session_id, screen_id)
alter table wizard_answers
  add constraint wizard_answers_session_screen_unique
  unique (session_id, screen_id);

-- 4. ai_run_logs: allow anonymous AI calls (no org context)
alter table ai_run_logs
  alter column org_id drop not null;

-- 5. ai_run_logs: add duration_ms and status tracking
alter table ai_run_logs
  add column if not exists duration_ms integer,
  add column if not exists success boolean default true,
  add column if not exists error_message text;

-- 6. Add RLS policy for anonymous wizard session creation (service role bypasses,
--    but this future-proofs for when anon key access is needed)
create policy "anon_wizard_session_insert"
  on wizard_sessions for insert
  to anon
  with check (org_id is null);

create policy "anon_wizard_session_select"
  on wizard_sessions for select
  to anon
  using (org_id is null);

create policy "anon_wizard_answer_insert"
  on wizard_answers for insert
  to anon
  with check (org_id is null);

create policy "anon_wizard_answer_select"
  on wizard_answers for select
  to anon
  using (org_id is null);

commit;
