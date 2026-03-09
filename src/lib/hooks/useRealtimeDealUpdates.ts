// useRealtimeDealUpdates — Live CRM pipeline deal updates via broadcast
//
// Subscribes to `pipeline:{pipelineId}:deals` topic for INSERT, UPDATE,
// DELETE events from the `crm_deals_broadcast_trigger` database trigger.
//
// Architecture (per supabase-realtime-guide.md):
//   Database trigger → realtime.broadcast_changes → private channel → this hook
//   NOT postgres_changes (deprecated, single-threaded, doesn't scale)
//
// Prerequisites:
//   1. Database trigger `crm_deals_broadcast_trigger` on `crm_deals` table
//      (see /imports/crm-deals-realtime-trigger.sql)
//   2. RLS policy on `realtime.messages` allowing SELECT for authenticated
//   3. (Optional) Enable "Private-only channels" in Supabase Realtime Settings
//
// Self-write filtering:
//   Database triggers broadcast to ALL subscribers including the writer.
//   We track a "local action" timestamp and skip events within 2s of it,
//   since the CRMPipelinePage already applies optimistic updates on its own writes.
//
// Graceful degradation:
//   If no trigger exists or Realtime isn't configured, status = 'error'.
//   CRMPipelinePage keeps its manual Refresh button as fallback.

import { useCallback, useRef } from 'react';
import {
  useSupabaseBroadcast,
  type BroadcastStatus,
  type BroadcastChangePayload,
} from './useSupabaseBroadcast';

/* ── Event names from realtime.broadcast_changes (= TG_OP values) ── */
const DEAL_EVENTS = ['INSERT', 'UPDATE', 'DELETE'] as const;

/** Shape of the deal record inside a broadcast payload */
export interface DealBroadcastRecord {
  id: string;
  pipeline_id: string;
  stage_id: string;
  title?: string;
  value?: number;
  probability?: number;
  contact_id?: string | null;
  client_id?: string | null;
  stage_changed_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface DealRealtimeEvent {
  /** INSERT, UPDATE, or DELETE */
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  /** New row data (INSERT, UPDATE) */
  record: DealBroadcastRecord | null;
  /** Previous row data (UPDATE, DELETE) */
  oldRecord: DealBroadcastRecord | null;
}

export interface UseRealtimeDealUpdatesOptions {
  /** Active pipeline ID to scope the subscription (null = don't subscribe) */
  pipelineId: string | null;
  /** Callback when a deal is created, updated, or deleted by another user */
  onDealEvent: (event: DealRealtimeEvent) => void;
  /** Whether the subscription is active (default: true when pipelineId is set) */
  enabled?: boolean;
  /** Self-write suppression window in ms (default: 2000) */
  selfWriteWindowMs?: number;
}

export interface UseRealtimeDealUpdatesReturn {
  /** Connection status */
  status: BroadcastStatus;
  /** Number of live events received since subscription */
  liveEventCount: number;
  /** Whether we're connected and receiving events */
  isLive: boolean;
  /** Call this BEFORE performing a local write (drag-drop, create, delete)
   *  so the resulting broadcast event is ignored (avoids double-update). */
  markLocalWrite: () => void;
  /** Manually reconnect */
  reconnect: () => void;
}

export function useRealtimeDealUpdates(
  options: UseRealtimeDealUpdatesOptions
): UseRealtimeDealUpdatesReturn {
  const {
    pipelineId,
    onDealEvent,
    enabled,
    selfWriteWindowMs = 2000,
  } = options;

  const onDealEventRef = useRef(onDealEvent);
  onDealEventRef.current = onDealEvent;

  // ── Self-write tracking ──
  // Database triggers broadcast to all subscribers, including the writer.
  // When CRMPipelinePage drags a deal it already does an optimistic update,
  // so we skip the echo from the trigger to avoid a stale re-render.
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

      const evt: DealRealtimeEvent = {
        type: (payload.type || eventName) as 'INSERT' | 'UPDATE' | 'DELETE',
        record: (payload.record as DealBroadcastRecord) || null,
        oldRecord: (payload.old_record as DealBroadcastRecord) || null,
      };

      console.log(
        `[Realtime] Deal ${evt.type}: ${evt.record?.title || evt.oldRecord?.id || 'unknown'}` +
          ` in pipeline ${pipelineId}`
      );

      onDealEventRef.current(evt);
    },
    [pipelineId, selfWriteWindowMs]
  );

  // Only subscribe when we have a pipeline ID
  const isEnabled = (enabled ?? true) && !!pipelineId;

  const { status, eventCount, reconnect } = useSupabaseBroadcast({
    topic: pipelineId ? `pipeline:${pipelineId}:deals` : 'pipeline:none:deals',
    events: [...DEAL_EVENTS],
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
