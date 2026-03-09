// useRealtimeWizardSync — Live subscription to wizard_sessions table
// Detects external updates to the current wizard session (other tabs,
// backend AI processing, admin edits) and notifies the caller.
//
// Use cases:
//   1. Multi-tab sync — detect if another tab saved newer data
//   2. Backend status changes — AI processing marks session as "completed"
//   3. Admin edits — another user modifies the session
//
// Prerequisites:
//   - wizard_sessions table exists (base migration)
//   - Realtime is enabled on wizard_sessions in Supabase Dashboard > Database > Replication
//
// Graceful degradation:
//   - If Realtime is not enabled, status will be 'error'
//   - WizardContext continues using localStorage + cloud save as before
//   - No user-facing errors — just misses live sync

import { useCallback, useRef } from 'react';
import { useSupabaseRealtime, type RealtimeStatus } from './useSupabaseRealtime';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export interface WizardSessionChange {
  /** The session ID that was updated */
  sessionId: string;
  /** The new current_step value (if present) */
  currentStep?: number;
  /** The new status value (if present) */
  status?: string;
  /** The updated_at timestamp */
  updatedAt?: string;
  /** The raw payload from Supabase */
  raw: Record<string, unknown>;
}

export interface UseRealtimeWizardSyncOptions {
  /** The session ID to watch (null = don't subscribe) */
  sessionId: string | null;
  /** Callback fired when the session is updated externally */
  onExternalChange: (change: WizardSessionChange) => void;
  /** Whether the subscription is active (default: true when sessionId is set) */
  enabled?: boolean;
}

export interface UseRealtimeWizardSyncReturn {
  /** Connection status */
  status: RealtimeStatus;
  /** Number of external change events received */
  changeCount: number;
  /** Whether we're receiving live sync */
  isSyncing: boolean;
  /** Manually reconnect */
  reconnect: () => void;
}

export function useRealtimeWizardSync(
  options: UseRealtimeWizardSyncOptions
): UseRealtimeWizardSyncReturn {
  const { sessionId, onExternalChange, enabled } = options;

  const onChangeRef = useRef(onExternalChange);
  onChangeRef.current = onExternalChange;

  // Track which updates originated from this tab to avoid self-notification
  const lastLocalSaveRef = useRef(0);

  /** Mark a local save — call this from WizardContext when it saves */
  // Exposed on the ref so WizardContext can access it
  const markLocalSave = useCallback(() => {
    lastLocalSaveRef.current = Date.now();
  }, []);

  const handleEvent = useCallback(
    (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
      const newRow = payload.new as Record<string, unknown> | undefined;
      if (!newRow) return;

      // Skip events that arrive within 3s of our own save — likely our own write
      const timeSinceLocalSave = Date.now() - lastLocalSaveRef.current;
      if (timeSinceLocalSave < 3000) {
        return;
      }

      const change: WizardSessionChange = {
        sessionId: (newRow.id as string) || '',
        currentStep: newRow.current_step as number | undefined,
        status: newRow.status as string | undefined,
        updatedAt: newRow.updated_at as string | undefined,
        raw: newRow,
      };

      console.log(
        `[Realtime] Wizard session updated externally: step=${change.currentStep}, status=${change.status}`
      );

      onChangeRef.current(change);
    },
    []
  );

  // Only subscribe when we have a session ID
  const isEnabled = (enabled ?? true) && !!sessionId;

  const { status, eventCount, reconnect } = useSupabaseRealtime({
    channelName: sessionId ? `wizard-progress-${sessionId}` : 'wizard-progress-none',
    table: 'wizard_sessions',
    event: 'UPDATE',
    filter: sessionId ? `id=eq.${sessionId}` : undefined,
    onEvent: handleEvent,
    enabled: isEnabled,
  });

  return {
    status,
    changeCount: eventCount,
    isSyncing: status === 'connected',
    reconnect,
  };
}
