-- Lean Canvases Realtime Broadcast Trigger
-- Run this in Supabase SQL Editor AFTER the lean_canvases and
-- lean_canvas_versions tables exist.
--
-- Architecture:
--   lean_canvases UPDATE
--     → lean_canvases_broadcast_trigger (this trigger)
--       → realtime.broadcast_changes → private channel `canvas:{id}:blocks`
--         → useRealtimeCanvasSync hook in StrategyEnginePage.tsx
--
--   lean_canvas_versions INSERT
--     → lean_canvas_versions_broadcast_trigger (this trigger)
--       → realtime.send → private channel `canvas:{canvas_id}:blocks`
--         → event: 'version_created' → useRealtimeCanvasSync
--
-- Two tables → one topic per canvas → one hook
--
-- Prerequisites:
--   1. lean_canvases table exists (strategy migration)
--   2. lean_canvas_versions table exists (strategy migration)
--   3. Supabase Realtime is enabled for the project
--
-- ═══════════════════════════════════════════════════════════════════

-- ┌──────────────────────────────────────────────────────────────────┐
-- │ Trigger 1: lean_canvases UPDATE → broadcast block edits         │
-- └──────────────────────────────────────────────────────────────────┘

CREATE OR REPLACE FUNCTION lean_canvases_broadcast_trigger()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only broadcast when canvas content actually changes
  -- (skip metadata-only updates like is_current flag)
  IF TG_OP = 'UPDATE' THEN
    IF OLD.problem IS DISTINCT FROM NEW.problem
       OR OLD.customer_segments IS DISTINCT FROM NEW.customer_segments
       OR OLD.value_proposition IS DISTINCT FROM NEW.value_proposition
       OR OLD.solution IS DISTINCT FROM NEW.solution
       OR OLD.channels IS DISTINCT FROM NEW.channels
       OR OLD.revenue_streams IS DISTINCT FROM NEW.revenue_streams
       OR OLD.cost_structure IS DISTINCT FROM NEW.cost_structure
       OR OLD.key_metrics IS DISTINCT FROM NEW.key_metrics
       OR OLD.unfair_advantage IS DISTINCT FROM NEW.unfair_advantage
       OR OLD.version IS DISTINCT FROM NEW.version
    THEN
      PERFORM realtime.broadcast_changes(
        'canvas:' || NEW.id::text || ':blocks',  -- topic (per-canvas)
        TG_OP,                                    -- event (UPDATE)
        TG_OP,                                    -- operation
        TG_TABLE_NAME,                            -- table
        TG_TABLE_SCHEMA,                          -- schema
        NEW,                                      -- new record
        OLD                                       -- old record
      );
    END IF;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS lean_canvases_broadcast_trigger ON lean_canvases;

CREATE TRIGGER lean_canvases_broadcast_trigger
  AFTER UPDATE ON lean_canvases
  FOR EACH ROW
  EXECUTE FUNCTION lean_canvases_broadcast_trigger();


-- ┌──────────────────────────────────────────────────────────────────┐
-- │ Trigger 2: lean_canvas_versions INSERT → notify version created │
-- └──────────────────────────────────────────────────────────────────┘
-- Uses realtime.send (custom event) instead of broadcast_changes
-- because we want a custom event name 'version_created' and a
-- lightweight payload (not the full row).

CREATE OR REPLACE FUNCTION lean_canvas_versions_broadcast_trigger()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM realtime.send(
    'canvas:' || NEW.canvas_id::text || ':blocks',  -- topic (same canvas topic)
    'version_created',                                -- custom event name
    jsonb_build_object(
      'version_id', NEW.id,
      'canvas_id', NEW.canvas_id,
      'version', NEW.version,
      'change_summary', NEW.change_summary,
      'changed_by', NEW.changed_by,
      'created_at', NEW.created_at
    ),
    true  -- private channel (requires RLS)
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS lean_canvas_versions_broadcast_trigger ON lean_canvas_versions;

CREATE TRIGGER lean_canvas_versions_broadcast_trigger
  AFTER INSERT ON lean_canvas_versions
  FOR EACH ROW
  EXECUTE FUNCTION lean_canvas_versions_broadcast_trigger();


-- ═══════════════════════════════════════════════════════════════════
-- Step 3: RLS policy on realtime.messages for canvas topics
-- ═══════════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'messages'
      AND schemaname = 'realtime'
      AND policyname = 'canvas_blocks_read'
  ) THEN
    CREATE POLICY "canvas_blocks_read" ON realtime.messages
      FOR SELECT TO authenticated
      USING (
        topic LIKE 'canvas:%:blocks'
      );
  END IF;
END;
$$;


-- ═══════════════════════════════════════════════════════════════════
-- Verification queries
-- ═══════════════════════════════════════════════════════════════════

-- Check triggers exist:
-- SELECT tgname, tgtype FROM pg_trigger WHERE tgrelid = 'lean_canvases'::regclass;
-- SELECT tgname, tgtype FROM pg_trigger WHERE tgrelid = 'lean_canvas_versions'::regclass;

-- Check RLS policy:
-- SELECT policyname FROM pg_policies WHERE tablename = 'messages' AND schemaname = 'realtime' AND policyname = 'canvas_blocks_read';

-- Test: Update a canvas block and watch the browser console for [Broadcast] logs:
-- UPDATE lean_canvases SET problem = problem || '[]'::jsonb WHERE id = 'your-canvas-uuid';
