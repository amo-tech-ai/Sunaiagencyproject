-- Wizard Sessions Realtime Broadcast Trigger
-- Run this in Supabase SQL Editor AFTER the wizard_sessions table exists.
--
-- Architecture:
--   wizard_sessions UPDATE
--     → wizard_sessions_broadcast_trigger (this trigger)
--       → realtime.broadcast_changes → private channel `wizard:session:{id}`
--         → useRealtimeWizardSync hook in WizardContext.tsx
--
-- Migrated from postgres_changes (v0.24.1) to broadcast (v0.24.4)
-- per supabase-realtime-guide.md — scalable, multi-threaded.
--
-- Topic is per-session (`wizard:session:{id}`) so only tabs watching
-- the same session receive updates — no fan-out to unrelated clients.
--
-- Only broadcasts on UPDATE (not INSERT/DELETE) because the hook
-- cares about step/status changes to an existing session.
--
-- Conditional: only fires when significant fields change (current_step,
-- status, form_data) to reduce broadcast volume.
--
-- Prerequisites:
--   1. wizard_sessions table exists (base migration)
--   2. Supabase Realtime is enabled for the project
--
-- ═══════════════════════════════════════════════════════════════════

-- Step 1: Create the trigger function
CREATE OR REPLACE FUNCTION wizard_sessions_broadcast_trigger()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only broadcast when significant fields change
  IF TG_OP = 'UPDATE' THEN
    IF OLD.current_step IS DISTINCT FROM NEW.current_step
       OR OLD.status IS DISTINCT FROM NEW.status
       OR OLD.form_data IS DISTINCT FROM NEW.form_data
    THEN
      PERFORM realtime.broadcast_changes(
        'wizard:session:' || NEW.id::text,  -- topic (per-session)
        TG_OP,                               -- event (UPDATE)
        TG_OP,                               -- operation
        TG_TABLE_NAME,                       -- table
        TG_TABLE_SCHEMA,                     -- schema
        NEW,                                 -- new record
        OLD                                  -- old record
      );
    END IF;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Step 2: Create the trigger on wizard_sessions (UPDATE only)
DROP TRIGGER IF EXISTS wizard_sessions_broadcast_trigger ON wizard_sessions;

CREATE TRIGGER wizard_sessions_broadcast_trigger
  AFTER UPDATE ON wizard_sessions
  FOR EACH ROW
  EXECUTE FUNCTION wizard_sessions_broadcast_trigger();


-- ═══════════════════════════════════════════════════════════════════
-- Step 3: RLS policy on realtime.messages
-- ═══════════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'messages'
      AND schemaname = 'realtime'
      AND policyname = 'wizard_sessions_read'
  ) THEN
    CREATE POLICY "wizard_sessions_read" ON realtime.messages
      FOR SELECT TO authenticated
      USING (
        topic LIKE 'wizard:session:%'
      );
  END IF;
END;
$$;


-- ═══════════════════════════════════════════════════════════════════
-- Verification queries
-- ═══════════════════════════════════════════════════════════════════

-- Check trigger exists:
-- SELECT tgname, tgtype FROM pg_trigger WHERE tgrelid = 'wizard_sessions'::regclass;

-- Check RLS policy:
-- SELECT policyname FROM pg_policies WHERE tablename = 'messages' AND schemaname = 'realtime' AND policyname = 'wizard_sessions_read';
