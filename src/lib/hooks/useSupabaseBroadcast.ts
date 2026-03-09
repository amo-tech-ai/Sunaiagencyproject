// useSupabaseBroadcast — Supabase Realtime Broadcast hook (recommended pattern)
//
// Uses `broadcast` + database triggers via `realtime.broadcast_changes`
// instead of the deprecated `postgres_changes` listener.
//
// Why broadcast over postgres_changes:
//   - postgres_changes is single-threaded and doesn't scale
//   - broadcast supports custom payloads, conditional triggers, and sharding
//   - Private channels enforce RLS authorization
//
// Prerequisites:
//   1. Database trigger calling realtime.broadcast_changes on the target table
//   2. RLS policy on realtime.messages allowing SELECT for authenticated users
//   3. (Optional) Enable "Private-only channels" in Dashboard > Project Settings > Realtime
//
// Usage:
//   const { status, eventCount } = useSupabaseBroadcast({
//     topic: 'pipeline:abc123:deals',
//     events: ['deal_created', 'deal_updated', 'deal_moved'],
//     onEvent: (event, payload) => { ... },
//   });

import { useEffect, useRef, useState, useCallback } from 'react';
import { getSupabaseClient } from '../supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export type BroadcastStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

/** Payload shape from realtime.broadcast_changes (matches Supabase convention) */
export interface BroadcastChangePayload {
  /** The database operation: INSERT, UPDATE, DELETE */
  type: string;
  /** Table name */
  table: string;
  /** Schema name */
  schema: string;
  /** The new row (INSERT, UPDATE) */
  record: Record<string, unknown> | null;
  /** The old row (UPDATE, DELETE) */
  old_record: Record<string, unknown> | null;
}

export interface UseSupabaseBroadcastOptions {
  /** Channel topic — use `scope:entity:id` pattern (e.g., 'pipeline:abc:deals') */
  topic: string;
  /** Event names to listen for (e.g., ['deal_created', 'deal_updated']) */
  events: string[];
  /** Callback fired for each matching broadcast event */
  onEvent: (eventName: string, payload: BroadcastChangePayload) => void;
  /** Whether the subscription is enabled (default: true) */
  enabled?: boolean;
  /** Use private channel with RLS (default: true per guide best practices) */
  isPrivate?: boolean;
  /** Receive your own broadcasts (default: false) */
  selfBroadcast?: boolean;
}

export interface UseSupabaseBroadcastReturn {
  status: BroadcastStatus;
  eventCount: number;
  reconnect: () => void;
  disconnect: () => void;
}

export function useSupabaseBroadcast(
  options: UseSupabaseBroadcastOptions
): UseSupabaseBroadcastReturn {
  const {
    topic,
    events,
    onEvent,
    enabled = true,
    isPrivate = true,
    selfBroadcast = false,
  } = options;

  const [status, setStatus] = useState<BroadcastStatus>('connecting');
  const [eventCount, setEventCount] = useState(0);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const onEventRef = useRef(onEvent);
  const mountedRef = useRef(true);

  // Stable event list reference to avoid re-subscriptions on every render
  const eventsKey = events.join(',');

  // Keep callback ref fresh
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

  const subscribe = useCallback(async () => {
    if (!enabled) return;

    cleanup();

    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[Broadcast] Supabase client unavailable');
      setStatus('error');
      return;
    }

    setStatus('connecting');

    // Set auth before subscribing (required for private channels)
    if (isPrivate) {
      try {
        await supabase.realtime.setAuth();
      } catch (err) {
        console.warn(`[Broadcast] setAuth failed (may work with anon):`, err);
      }
    }

    // Build channel with config
    const channel = supabase.channel(topic, {
      config: {
        broadcast: { self: selfBroadcast, ack: false },
        private: isPrivate,
      },
    });

    // Check if already subscribed to prevent duplicate subscriptions
    if (channelRef.current?.state === 'subscribed') {
      return;
    }

    // Register broadcast listeners for each event
    const eventList = eventsKey.split(',');
    for (const eventName of eventList) {
      channel.on('broadcast', { event: eventName.trim() }, (payload: any) => {
        if (!mountedRef.current) return;
        setEventCount((c) => c + 1);
        try {
          onEventRef.current(eventName.trim(), payload.payload || payload);
        } catch (err) {
          console.error(`[Broadcast] Handler error on ${topic}/${eventName}:`, err);
        }
      });
    }

    // Subscribe
    channel.subscribe((subscriptionStatus: string, err?: Error) => {
      if (!mountedRef.current) return;

      if (subscriptionStatus === 'SUBSCRIBED') {
        setStatus('connected');
        console.log(`[Broadcast] Channel "${topic}" subscribed [${eventsKey}]`);
      } else if (subscriptionStatus === 'CHANNEL_ERROR' || subscriptionStatus === 'TIMED_OUT') {
        setStatus('error');
        console.warn(
          `[Broadcast] Channel "${topic}" failed: ${subscriptionStatus}`,
          err?.message || ''
        );
      } else if (subscriptionStatus === 'CLOSED') {
        setStatus('disconnected');
      }
    });

    channelRef.current = channel;
  }, [topic, eventsKey, enabled, isPrivate, selfBroadcast, cleanup]);

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
