-- AI Run Logs Realtime Broadcast Trigger
-- Run this in Supabase SQL Editor AFTER the ai_run_logs table exists.
--
-- Architecture:
--   ai_run_logs INSERT
--     → ai_run_logs_broadcast_trigger (this trigger)
--       → realtime.broadcast_changes → private channel `ai-runs:global`
--         → useRealtimeAIRuns hook in AgentsPage.tsx
--
-- Migrated from postgres_changes (v0.24.1) to broadcast (v0.24.4)
-- per supabase-realtime-guide.md — scalable, multi-threaded.
--
-- Topic is global (`ai-runs:global`) because any new AI run should
-- notify all connected AgentsPage viewers, not scoped to a user.
--
-- Prerequisites:
--   1. ai_run_logs table exists (migration 20260307120100)
--   2. Supabase Realtime is enabled for the project
--
-- ═══════════════════════════════════════════════════════════════════

-- Step 1: Create the trigger function
CREATE OR REPLACE FUNCTION ai_run_logs_broadcast_trigger()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only broadcast INSERTs (new AI runs) — global topic for all viewers
  PERFORM realtime.broadcast_changes(
    'ai-runs:global',                -- topic (global — all AgentsPage viewers)
    TG_OP,                           -- event (INSERT)
    TG_OP,                           -- operation
    TG_TABLE_NAME,                   -- table
    TG_TABLE_SCHEMA,                 -- schema
    NEW,                             -- new record
    OLD                              -- old record (null for INSERT)
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Step 2: Create the trigger on ai_run_logs (INSERT only)
DROP TRIGGER IF EXISTS ai_run_logs_broadcast_trigger ON ai_run_logs;

CREATE TRIGGER ai_run_logs_broadcast_trigger
  AFTER INSERT ON ai_run_logs
  FOR EACH ROW
  EXECUTE FUNCTION ai_run_logs_broadcast_trigger();


-- ═══════════════════════════════════════════════════════════════════
-- Step 3: RLS policy on realtime.messages
-- ═══════════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'messages'
      AND schemaname = 'realtime'
      AND policyname = 'ai_runs_read'
  ) THEN
    CREATE POLICY "ai_runs_read" ON realtime.messages
      FOR SELECT TO authenticated
      USING (
        topic = 'ai-runs:global'
      );
  END IF;
END;
$$;


-- ═══════════════════════════════════════════════════════════════════
-- Verification queries
-- ═══════════════════════════════════════════════════════════════════

-- Check trigger exists:
-- SELECT tgname, tgtype FROM pg_trigger WHERE tgrelid = 'ai_run_logs'::regclass;

-- Check RLS policy:
-- SELECT policyname FROM pg_policies WHERE tablename = 'messages' AND schemaname = 'realtime' AND policyname = 'ai_runs_read';
