-- CRM Deals Realtime Broadcast Trigger
-- Run this in Supabase SQL Editor AFTER the CRM pipeline tables exist.
--
-- Architecture:
--   crm_deals INSERT/UPDATE/DELETE
--     → crm_deals_broadcast_trigger (this trigger)
--       → realtime.broadcast_changes → private channel `pipeline:{pipeline_id}:deals`
--         → useRealtimeDealUpdates hook in CRMPipelinePage.tsx
--
-- Per supabase-realtime-guide.md:
--   - Uses broadcast (NOT postgres_changes — that's deprecated and single-threaded)
--   - Private channel by default (requires RLS on realtime.messages)
--   - Topic follows `scope:entity:id` convention
--   - Event names = TG_OP (INSERT, UPDATE, DELETE)
--
-- Prerequisites:
--   1. crm_deals table exists (migration 20260307120300)
--   2. Supabase Realtime is enabled for the project
--
-- ═══════════════════════════════════════════════════════════════════

-- Step 1: Create the trigger function
-- Broadcasts to `pipeline:{pipeline_id}:deals` so each pipeline
-- gets its own topic (scoped, scalable, no unnecessary fan-out).
CREATE OR REPLACE FUNCTION crm_deals_broadcast_trigger()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  _pipeline_id uuid;
BEGIN
  -- Determine pipeline_id from the row being modified
  _pipeline_id := COALESCE(NEW.pipeline_id, OLD.pipeline_id);

  PERFORM realtime.broadcast_changes(
    'pipeline:' || _pipeline_id::text || ':deals',  -- topic
    TG_OP,                                           -- event (INSERT, UPDATE, DELETE)
    TG_OP,                                           -- operation
    TG_TABLE_NAME,                                   -- table
    TG_TABLE_SCHEMA,                                 -- schema
    NEW,                                             -- new record
    OLD                                              -- old record
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Step 2: Create the trigger on crm_deals
-- Fires after INSERT, UPDATE, or DELETE on every row.
DROP TRIGGER IF EXISTS crm_deals_broadcast_trigger ON crm_deals;

CREATE TRIGGER crm_deals_broadcast_trigger
  AFTER INSERT OR UPDATE OR DELETE ON crm_deals
  FOR EACH ROW
  EXECUTE FUNCTION crm_deals_broadcast_trigger();


-- ═══════════════════════════════════════════════════════════════════
-- Step 3: RLS policy on realtime.messages
-- Allows authenticated users to receive broadcasts on pipeline channels.
-- This is required for private channels.
-- ═══════════════════════════════════════════════════════════════════

-- Allow authenticated users to read pipeline deal broadcasts
DO $$
BEGIN
  -- Only create if it doesn't already exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'messages'
      AND schemaname = 'realtime'
      AND policyname = 'pipeline_deals_read'
  ) THEN
    CREATE POLICY "pipeline_deals_read" ON realtime.messages
      FOR SELECT TO authenticated
      USING (
        topic LIKE 'pipeline:%:deals'
      );
  END IF;
END;
$$;


-- ═══════════════════════════════════════════════════════════════════
-- Step 4: (Optional) Conditional broadcast — only on significant changes
-- Uncomment this version and DROP the simpler trigger above if you
-- want to reduce broadcast volume (e.g., ignore notes-only updates).
-- ═══════════════════════════════════════════════════════════════════
/*
CREATE OR REPLACE FUNCTION crm_deals_broadcast_trigger_conditional()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  _pipeline_id uuid;
BEGIN
  _pipeline_id := COALESCE(NEW.pipeline_id, OLD.pipeline_id);

  -- Only broadcast on INSERT, DELETE, or significant UPDATE fields
  IF TG_OP = 'INSERT' OR TG_OP = 'DELETE' THEN
    PERFORM realtime.broadcast_changes(
      'pipeline:' || _pipeline_id::text || ':deals',
      TG_OP, TG_OP, TG_TABLE_NAME, TG_TABLE_SCHEMA, NEW, OLD
    );
  ELSIF TG_OP = 'UPDATE' THEN
    -- Only broadcast if stage, value, probability, or title changed
    IF OLD.stage_id IS DISTINCT FROM NEW.stage_id
       OR OLD.value IS DISTINCT FROM NEW.value
       OR OLD.probability IS DISTINCT FROM NEW.probability
       OR OLD.title IS DISTINCT FROM NEW.title
    THEN
      PERFORM realtime.broadcast_changes(
        'pipeline:' || _pipeline_id::text || ':deals',
        TG_OP, TG_OP, TG_TABLE_NAME, TG_TABLE_SCHEMA, NEW, OLD
      );
    END IF;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;
*/


-- ═══════════════════════════════════════════════════════════════════
-- Verification queries (run after applying)
-- ═══════════════════════════════════════════════════════════════════

-- Check trigger exists:
-- SELECT tgname, tgtype FROM pg_trigger WHERE tgrelid = 'crm_deals'::regclass;

-- Check function exists:
-- SELECT proname FROM pg_proc WHERE proname = 'crm_deals_broadcast_trigger';

-- Check RLS policy exists:
-- SELECT policyname FROM pg_policies WHERE tablename = 'messages' AND schemaname = 'realtime';

-- Test: Insert a deal and watch the browser console for [Broadcast] logs:
-- INSERT INTO crm_deals (pipeline_id, stage_id, title, value, probability)
-- VALUES ('your-pipeline-uuid', 'your-stage-uuid', 'Test Deal', 10000, 50);
