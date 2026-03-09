// useRealtimeCanvasSync — Live collaborative strategy canvas editing via broadcast
//
// Subscribes to `canvas:{canvasId}:blocks` topic for real-time updates
// when another user edits canvas blocks, creates a version, or when AI
// analysis completes.
//
// Architecture (per supabase-realtime-guide.md):
//   Database triggers → realtime.broadcast_changes → private channel → this hook
//   Two tables trigger into the same topic:
//     - lean_canvases UPDATE  → event: UPDATE (block edits)
//     - lean_canvas_versions INSERT → event: version_created (snapshot saved)
//
// Prerequisites:
//   1. Database triggers on `lean_canvases` and `lean_canvas_versions`
//      (see /imports/lean-canvases-broadcast-trigger.sql)
//   2. RLS policy on `realtime.messages` for `canvas:*:blocks` topics
//   3. (Optional) Enable "Private-only channels" in Realtime Settings
//
// Self-write filtering:
//   Database triggers broadcast to ALL subscribers including the writer.
//   The `markLocalWrite()` function sets a suppression timestamp so the
//   echo from our own edits doesn't cause a stale re-render.
//
// Graceful degradation:
//   If triggers aren't installed, status = 'error'. StrategyEnginePage
//   keeps its manual refetch as fallback.

import { useCallback, useRef } from 'react';
import {
  useSupabaseBroadcast,
  type BroadcastStatus,
  type BroadcastChangePayload,
} from './useSupabaseBroadcast';

/* ── Event names from the two triggers ── */
// lean_canvases UPDATE → 'UPDATE' (from TG_OP via broadcast_changes)
// lean_canvas_versions INSERT → 'version_created' (from custom realtime.send)
const CANVAS_EVENTS = ['UPDATE', 'version_created'] as const;

/** Shape of a canvas record inside a broadcast payload */
export interface CanvasBroadcastRecord {
  id: string;
  session_id?: string | null;
  project_id?: string | null;
  user_id?: string | null;
  version?: number;
  is_current?: boolean;
  updated_at?: string;
  [key: string]: unknown;
}

export interface CanvasRealtimeEvent {
  /** 'UPDATE' for block edits, 'version_created' for new version snapshots */
  type: string;
  /** New row data (for UPDATE events on lean_canvases) */
  record: CanvasBroadcastRecord | null;
  /** Previous row data (for UPDATE events) */
  oldRecord: CanvasBroadcastRecord | null;
}

export interface UseRealtimeCanvasSyncOptions {
  /** Active canvas ID to scope the subscription (null = don't subscribe) */
  canvasId: string | null;
  /** Callback when the canvas is updated by another user or AI */
  onCanvasEvent: (event: CanvasRealtimeEvent) => void;
  /** Whether the subscription is active (default: true when canvasId is set) */
  enabled?: boolean;
  /** Self-write suppression window in ms (default: 2000) */
  selfWriteWindowMs?: number;
}

export interface UseRealtimeCanvasSyncReturn {
  /** Connection status */
  status: BroadcastStatus;
  /** Number of live events received since subscription */
  liveEventCount: number;
  /** Whether we're connected and receiving events */
  isLive: boolean;
  /** Call this BEFORE performing a local canvas save so the resulting
   *  broadcast echo is ignored (avoids double-update). */
  markLocalWrite: () => void;
  /** Manually reconnect */
  reconnect: () => void;
}

export function useRealtimeCanvasSync(
  options: UseRealtimeCanvasSyncOptions
): UseRealtimeCanvasSyncReturn {
  const {
    canvasId,
    onCanvasEvent,
    enabled,
    selfWriteWindowMs = 2000,
  } = options;

  const onCanvasEventRef = useRef(onCanvasEvent);
  onCanvasEventRef.current = onCanvasEvent;

  // ── Self-write tracking ──
  const lastLocalWriteRef = useRef(0);

  const markLocalWrite = useCallback(() => {
    lastLocalWriteRef.current = Date.now();
  }, []);

  // ── Broadcast event handler ──
  const handleBroadcastEvent = useCallback(
    (eventName: string, payload: BroadcastChangePayload) => {
      // Self-write suppression
      if (Date.now() - lastLocalWriteRef.current < selfWriteWindowMs) {
        return;
      }

      const evt: CanvasRealtimeEvent = {
        type: eventName,
        record: (payload.record as CanvasBroadcastRecord) || null,
        oldRecord: (payload.old_record as CanvasBroadcastRecord) || null,
      };

      console.log(
        `[Realtime] Canvas ${evt.type}: canvas=${canvasId}` +
          (evt.record?.version ? ` v${evt.record.version}` : '')
      );

      onCanvasEventRef.current(evt);
    },
    [canvasId, selfWriteWindowMs]
  );

  // Only subscribe when we have a canvas ID
  const isEnabled = (enabled ?? true) && !!canvasId;

  const { status, eventCount, reconnect } = useSupabaseBroadcast({
    topic: canvasId ? `canvas:${canvasId}:blocks` : 'canvas:none:blocks',
    events: [...CANVAS_EVENTS],
    onEvent: handleBroadcastEvent,
    enabled: isEnabled,
    isPrivate: true,
    selfBroadcast: false,
  });

  return {
    status,
    liveEventCount: eventCount,
    isLive: status === 'connected',
    markLocalWrite,
    reconnect,
  };
}
