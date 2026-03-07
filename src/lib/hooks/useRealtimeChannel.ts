// useRealtimeChannel — Reusable hook that subscribes to a Supabase Realtime
// broadcast channel and exposes connection status. Automatically reconnects
// on channel errors and cleans up on unmount.

import { useEffect, useRef, useState } from 'react';
import { getSupabaseClient } from '../supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface UseRealtimeChannelOptions {
  channelName: string;
  event: string;
  onMessage: (payload: unknown) => void;
  enabled?: boolean;
}

export function useRealtimeChannel({
  channelName,
  event,
  onMessage,
  enabled = true,
}: UseRealtimeChannelOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const onMessageRef = useRef(onMessage);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');

  // Keep the callback ref in sync without triggering re-subscriptions
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!enabled) {
      setStatus('disconnected');
      return;
    }

    const supabase = getSupabaseClient();
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;

    setStatus('connecting');

    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event }, (payload) => {
        // broadcast_changes() nests record data in payload.payload
        onMessageRef.current(payload.payload ?? payload);
      })
      .subscribe((subscriptionStatus) => {
        if (subscriptionStatus === 'SUBSCRIBED') {
          setStatus('connected');
        } else if (subscriptionStatus === 'CHANNEL_ERROR') {
          setStatus('error');
          // Auto-reconnect after 3 seconds
          reconnectTimer = setTimeout(() => {
            channel.unsubscribe();
            channel.subscribe();
          }, 3000);
        } else if (subscriptionStatus === 'CLOSED') {
          setStatus('disconnected');
        }
      });

    channelRef.current = channel;

    return () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [channelName, event, enabled]);

  return { channelRef, status };
}
