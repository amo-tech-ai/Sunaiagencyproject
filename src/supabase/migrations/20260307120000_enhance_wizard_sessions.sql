-- ============================================================================
-- Migration: Enhance wizard_sessions table with designed but never-created columns
-- Purpose:   Add user_id, status, and context_snapshot to wizard_sessions so
--            the list endpoint can filter by user and the dashboard can read
--            session status directly instead of deriving it from current_step.
-- Affected:  wizard_sessions (ALTER — non-destructive, adds nullable columns)
-- Ref:       /supabase/functions/server/wizard-routes.tsx lines 4-5 (comment),
--            /docs/supabase/05-prompt-table-creation.md
-- Safety:    All additions use IF NOT EXISTS or are nullable with defaults,
--            so existing data is unaffected. No data loss possible.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Add user_id column (uuid, nullable)
--    Links wizard sessions to auth.users for per-user filtering.
--    null = anonymous/guest session (wizard supports unauthenticated use).
--    The wizard list endpoint currently returns ALL sessions because this
--    column didn't exist; once added, we can filter by user_id.
-- ---------------------------------------------------------------------------
alter table wizard_sessions
  add column if not exists user_id uuid null;

comment on column wizard_sessions.user_id is
  'Auth user who owns this session. NULL for anonymous/guest wizard sessions.';

-- ---------------------------------------------------------------------------
-- 2. Add status column (text, default in_progress)
--    Possible values: in_progress, completed, abandoned.
--    Currently derived in code as: current_step >= 5 → completed.
--    Having it as a real column enables direct queries and future triggers.
-- ---------------------------------------------------------------------------
alter table wizard_sessions
  add column if not exists status text not null default 'in_progress';

comment on column wizard_sessions.status is
  'Session lifecycle status: in_progress | completed | abandoned. Default in_progress.';

-- Add a check constraint for valid status values
-- Use DO block to avoid error if constraint already exists
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'wizard_sessions_status_check'
  ) then
    alter table wizard_sessions
      add constraint wizard_sessions_status_check
      check (status in ('in_progress', 'completed', 'abandoned'));
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 3. Add context_snapshot column (jsonb, nullable)
--    Stores full wizard state snapshot for resume capability.
--    Used by the frontend to restore form state on page reload.
-- ---------------------------------------------------------------------------
alter table wizard_sessions
  add column if not exists context_snapshot jsonb null;

comment on column wizard_sessions.context_snapshot is
  'Full wizard state snapshot (all steps + selections) for session resume.';

-- ---------------------------------------------------------------------------
-- 4. Indexes for query performance
-- ---------------------------------------------------------------------------

-- Index on user_id for the list-by-user query (GET /wizard/list/:userId)
-- Partial index excludes NULLs since we only filter on non-null user_id
create index if not exists idx_wizard_sessions_user_id
  on wizard_sessions (user_id)
  where user_id is not null;

-- Index on updated_at for ORDER BY in list queries
create index if not exists idx_wizard_sessions_updated_at
  on wizard_sessions (updated_at desc);

-- Index on status for filtering completed/in_progress sessions
create index if not exists idx_wizard_sessions_status
  on wizard_sessions (status);

-- ---------------------------------------------------------------------------
-- 5. Backfill status for existing sessions based on current_step
--    Step 5 is the final wizard step, so current_step >= 5 = completed.
--    This makes the status column immediately useful without code changes.
-- ---------------------------------------------------------------------------
update wizard_sessions
  set status = 'completed'
  where current_step >= 5
    and status = 'in_progress';
