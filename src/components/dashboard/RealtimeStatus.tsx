// RealtimeStatus — small connection status indicator for Supabase Realtime
import type { ConnectionStatus } from '../../lib/hooks/useRealtimeChannel';

const STATUS_CONFIG: Record<ConnectionStatus, { color: string; label: string }> = {
  connected: { color: 'bg-green-500', label: 'Live' },
  connecting: { color: 'bg-yellow-500 animate-pulse', label: 'Connecting' },
  error: { color: 'bg-red-500', label: 'Error' },
  disconnected: { color: 'bg-gray-400', label: 'Offline' },
};

interface RealtimeStatusProps {
  status: ConnectionStatus;
  showLabel?: boolean;
}

export function RealtimeStatus({ status, showLabel = false }: RealtimeStatusProps) {
  const { color, label } = STATUS_CONFIG[status];

  return (
    <div
      className="flex items-center gap-1.5"
      title={`Realtime: ${label}`}
    >
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {showLabel && (
        <span className="text-xs text-[#6B6B63]">{label}</span>
      )}
    </div>
  );
}
