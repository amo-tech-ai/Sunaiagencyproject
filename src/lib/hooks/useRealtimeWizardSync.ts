// useRealtimeWizardSync — Live subscription to wizard_sessions via broadcast
//
// MIGRATED from postgres_changes to broadcast (v0.24.4)
// Uses `broadcast` + database trigger (`realtime.broadcast_changes`)
// per supabase-realtime-guide.md — scalable, multi-threaded, supports
// private channels and conditional triggers.
//
// Use cases:
//   1. Multi-tab sync — detect if another tab saved newer data
//   2. Backend status changes — AI processing marks session as "completed"
//   3. Admin edits — another user modifies the session
//
// Prerequisites:
//   1. Database trigger `wizard_sessions_broadcast_trigger` on `wizard_sessions`
//      (see /imports/wizard-sessions-broadcast-trigger.sql)
//   2. RLS policy on `realtime.messages` for `wizard:session:*` topics
//   3. (Optional) Enable "Private-only channels" in Realtime Settings
//
// Graceful degradation:
//   - If trigger/Realtime not configured, status = 'error'
//   - WizardContext continues using localStorage + cloud save as before

import { useCallback, useRef } from 'react';
import {
  useSupabaseBroadcast,
  type BroadcastStatus,
  type BroadcastChangePayload,
} from './useSupabaseBroadcast';

export interface WizardSessionChange {
  /** The session ID that was updated */
  sessionId: string;
  /** The new current_step value (if present) */
  currentStep?: number;
  /** The new status value (if present) */
  status?: string;
  /** The updated_at timestamp */
  updatedAt?: string;
  /** The raw record from broadcast payload */
  raw: Record<string, unknown>;
}

export interface UseRealtimeWizardSyncOptions {
  /** The session ID to watch (null = don't subscribe) */
  sessionId: string | null;
  /** Callback fired when the session is updated externally */
  onExternalChange: (change: WizardSessionChange) => void;
  /** Whether the subscription is active (default: true when sessionId is set) */
  enabled?: boolean;
  /** Self-write suppression window in ms (default: 3000) */
  selfWriteWindowMs?: number;
}

export interface UseRealtimeWizardSyncReturn {
  /** Connection status */
  status: BroadcastStatus;
  /** Number of external change events received */
  changeCount: number;
  /** Whether we're receiving live sync */
  isSyncing: boolean;
  /** Call this BEFORE performing a local save so the resulting broadcast
   *  echo is ignored (avoids self-notification). */
  markLocalSave: () => void;
  /** Manually reconnect */
  reconnect: () => void;
}

export function useRealtimeWizardSync(
  options: UseRealtimeWizardSyncOptions
): UseRealtimeWizardSyncReturn {
  const { sessionId, onExternalChange, enabled, selfWriteWindowMs = 3000 } = options;

  const onChangeRef = useRef(onExternalChange);
  onChangeRef.current = onExternalChange;

  // Track which updates originated from this tab to avoid self-notification
  const lastLocalSaveRef = useRef(0);

  /** Mark a local save — call this from WizardContext when it saves */
  const markLocalSave = useCallback(() => {
    lastLocalSaveRef.current = Date.now();
  }, []);

  const handleEvent = useCallback(
    (_eventName: string, payload: BroadcastChangePayload) => {
      const record = payload.record as Record<string, unknown> | null;
      if (!record) return;

      // Skip events that arrive within the suppression window of our own save
      const timeSinceLocalSave = Date.now() - lastLocalSaveRef.current;
      if (timeSinceLocalSave < selfWriteWindowMs) {
        return;
      }

      const change: WizardSessionChange = {
        sessionId: (record.id as string) || '',
        currentStep: record.current_step as number | undefined,
        status: record.status as string | undefined,
        updatedAt: record.updated_at as string | undefined,
        raw: record,
      };

      console.log(
        `[Realtime] Wizard session updated externally: step=${change.currentStep}, status=${change.status}`
      );

      onChangeRef.current(change);
    },
    [selfWriteWindowMs]
  );

  // Only subscribe when we have a session ID
  const isEnabled = (enabled ?? true) && !!sessionId;

  // Topic per session — scoped so multi-tab sync only fires for the same session
  const { status, eventCount, reconnect } = useSupabaseBroadcast({
    topic: sessionId ? `wizard:session:${sessionId}` : 'wizard:session:none',
    events: ['UPDATE'],
    onEvent: handleEvent,
    enabled: isEnabled,
    isPrivate: true,
    selfBroadcast: false,
  });

  return {
    status,
    changeCount: eventCount,
    isSyncing: status === 'connected',
    markLocalSave,
    reconnect,
  };
}
