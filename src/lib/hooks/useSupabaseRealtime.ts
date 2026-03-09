// useSupabaseRealtime — Generic Supabase Realtime subscription hook
// Manages channel lifecycle: subscribe, listen, reconnect, cleanup.
// Graceful degradation: tracks connection status so callers can fall
// back to polling when Realtime is unavailable (table not enabled, etc.)
//
// Usage:
//   const { status, eventCount } = useSupabaseRealtime({
//     channelName: 'ai-runs',
//     table: 'ai_run_logs',
//     event: 'INSERT',
//     onEvent: (payload) => { /* handle new row */ },
//   });

import { useEffect, useRef, useState, useCallback } from 'react';
import { getSupabaseClient } from '../supabase';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

export type RealtimeStatus =
  | 'connecting'   // Initial subscription in progress
  | 'connected'    // SUBSCRIBED and receiving events
  | 'disconnected' // Unsubscribed or channel closed
  | 'error';       // Subscription failed (table not enabled, RLS, etc.)

export interface UseSupabaseRealtimeOptions<T extends Record<string, unknown> = Record<string, unknown>> {
  /** Unique channel name (e.g., 'ai-runs', 'wizard-progress-{id}') */
  channelName: string;
  /** Supabase table to subscribe to */
  table: string;
  /** Schema (default: 'public') */
  schema?: string;
  /** Event type to listen for */
  event: RealtimeEvent;
  /** Optional filter (e.g., 'session_id=eq.abc123') */
  filter?: string;
  /** Callback fired for each matching event */
  onEvent: (payload: RealtimePostgresChangesPayload<T>) => void;
  /** Whether the subscription is enabled (default: true). Set to false to skip. */
  enabled?: boolean;
}

export interface UseSupabaseRealtimeReturn {
  /** Current connection status */
  status: RealtimeStatus;
  /** Number of events received since subscription */
  eventCount: number;
  /** Manually reconnect (e.g., after error) */
  reconnect: () => void;
  /** Manually disconnect */
  disconnect: () => void;
}

export function useSupabaseRealtime<T extends Record<string, unknown> = Record<string, unknown>>(
  options: UseSupabaseRealtimeOptions<T>
): UseSupabaseRealtimeReturn {
  const {
    channelName,
    table,
    schema = 'public',
    event,
    filter,
    onEvent,
    enabled = true,
  } = options;

  const [status, setStatus] = useState<RealtimeStatus>('connecting');
  const [eventCount, setEventCount] = useState(0);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const onEventRef = useRef(onEvent);
  const mountedRef = useRef(true);

  // Keep callback ref fresh without re-subscribing
  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      const supabase = getSupabaseClient();
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (mountedRef.current) {
      setStatus('disconnected');
    }
  }, []);

  const subscribe = useCallback(() => {
    if (!enabled) return;

    // Clean up any existing channel first
    cleanup();

    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[Realtime] Supabase client unavailable');
      setStatus('error');
      return;
    }

    setStatus('connecting');

    // Build the postgres_changes config
    const changesConfig: {
      event: string;
      schema: string;
      table: string;
      filter?: string;
    } = {
      event,
      schema,
      table,
    };

    if (filter) {
      changesConfig.filter = filter;
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes' as any,
        changesConfig,
        (payload: RealtimePostgresChangesPayload<T>) => {
          if (!mountedRef.current) return;
          setEventCount((c) => c + 1);
          try {
            onEventRef.current(payload);
          } catch (err) {
            console.error(`[Realtime] Event handler error on ${channelName}:`, err);
          }
        }
      )
      .subscribe((subscriptionStatus: string, err?: Error) => {
        if (!mountedRef.current) return;

        if (subscriptionStatus === 'SUBSCRIBED') {
          setStatus('connected');
          console.log(`[Realtime] Channel "${channelName}" subscribed to ${table}.${event}`);
        } else if (subscriptionStatus === 'CHANNEL_ERROR' || subscriptionStatus === 'TIMED_OUT') {
          setStatus('error');
          console.warn(
            `[Realtime] Channel "${channelName}" failed: ${subscriptionStatus}`,
            err?.message || ''
          );
        } else if (subscriptionStatus === 'CLOSED') {
          setStatus('disconnected');
          console.log(`[Realtime] Channel "${channelName}" closed`);
        }
      });

    channelRef.current = channel;
  }, [channelName, table, schema, event, filter, enabled, cleanup]);

  // Subscribe on mount / when deps change
  useEffect(() => {
    mountedRef.current = true;
    subscribe();

    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, [subscribe, cleanup]);

  const reconnect = useCallback(() => {
    setEventCount(0);
    subscribe();
  }, [subscribe]);

  const disconnect = useCallback(() => {
    cleanup();
  }, [cleanup]);

  return { status, eventCount, reconnect, disconnect };
}
