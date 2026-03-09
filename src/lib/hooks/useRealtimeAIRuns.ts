// useRealtimeAIRuns — Live subscription to ai_run_logs table
// Fires a refresh callback when new AI runs are inserted.
// Shows event count and connection status for the live indicator.
//
// Prerequisites:
//   - ai_run_logs table exists (migration 20260307120100)
//   - Realtime is enabled on ai_run_logs in Supabase Dashboard > Database > Replication
//
// Graceful degradation:
//   - If Realtime is not enabled on the table, status will be 'error'
//   - The AgentsPage already has manual Refresh — this just adds auto-refresh
//   - Falls back silently; no user-facing errors

import { useCallback, useRef } from 'react';
import { useSupabaseRealtime, type RealtimeStatus } from './useSupabaseRealtime';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export interface UseRealtimeAIRunsOptions {
  /** Callback fired when a new AI run is inserted — typically triggers data refetch */
  onNewRun: () => void;
  /** Whether the subscription is active (default: true) */
  enabled?: boolean;
  /** Throttle interval in ms to avoid rapid-fire refreshes (default: 3000) */
  throttleMs?: number;
}

export interface UseRealtimeAIRunsReturn {
  /** Connection status */
  status: RealtimeStatus;
  /** Number of live events received since page load */
  liveEventCount: number;
  /** Whether we're receiving live updates */
  isLive: boolean;
  /** Manually reconnect */
  reconnect: () => void;
}

export function useRealtimeAIRuns(options: UseRealtimeAIRunsOptions): UseRealtimeAIRunsReturn {
  const { onNewRun, enabled = true, throttleMs = 3000 } = options;

  // Throttle: don't fire onNewRun more than once per throttleMs
  const lastRefreshRef = useRef(0);
  const onNewRunRef = useRef(onNewRun);
  onNewRunRef.current = onNewRun;

  const handleEvent = useCallback(
    (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
      const now = Date.now();
      if (now - lastRefreshRef.current < throttleMs) {
        return; // Skip — too soon after last refresh
      }
      lastRefreshRef.current = now;

      console.log(
        `[Realtime] New AI run detected: ${payload.new && typeof payload.new === 'object' ? (payload.new as any).prompt_type || 'unknown' : 'unknown'}`
      );

      onNewRunRef.current();
    },
    [throttleMs]
  );

  const { status, eventCount, reconnect } = useSupabaseRealtime({
    channelName: 'ai-runs',
    table: 'ai_run_logs',
    event: 'INSERT',
    onEvent: handleEvent,
    enabled,
  });

  return {
    status,
    liveEventCount: eventCount,
    isLive: status === 'connected',
    reconnect,
  };
}
