// C106-RUN-HISTORY — Paginated table of AI run log entries
// Reads from ai_run_logs via agentApi.getRunLogs(). Filter by prompt_type.
// Mobile-first: card list on xs, table layout on md+, 44px touch targets.

import type { RunLogEntry } from '../../../lib/supabase';
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useState } from 'react';

interface RunHistoryTableProps {
  logs: RunLogEntry[];
  total: number;
  loading: boolean;
  page: number;
  pageSize: number;
  filter: string | null;
  onPageChange: (page: number) => void;
  onFilterChange: (promptType: string | null) => void;
}

const PROMPT_LABELS: Record<string, string> = {
  'analyze-business': 'Business Analysis',
  'industry-diagnostics': 'Diagnostics',
  'system-recommendations': 'Recommendations',
  'readiness-score': 'Readiness Score',
  'generate-roadmap': 'Roadmap',
  'dashboard-insights': 'Insights',
};

const PROMPT_TYPES = [
  'analyze-business',
  'industry-diagnostics',
  'system-recommendations',
  'readiness-score',
  'generate-roadmap',
  'dashboard-insights',
];

export default function RunHistoryTable({
  logs, total, loading, page, pageSize, filter,
  onPageChange, onFilterChange,
}: RunHistoryTableProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="bg-white rounded border border-[#E8E8E4]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#E8E8E4]">
        <h3 className="font-[Georgia,serif] text-sm sm:text-base font-semibold text-[#1A1A1A]">
          Run History
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#9CA39B]">{total} total</span>
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded border min-h-[36px] transition-colors ${
                filter
                  ? 'border-[#00875A] text-[#00875A] bg-[#E6F4ED]/30'
                  : 'border-[#E8E8E4] text-[#6B6B63] hover:bg-[#F5F5F0]'
              }`}
            >
              <Filter className="w-3 h-3" />
              {filter ? PROMPT_LABELS[filter] || filter : 'Filter'}
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-[#E8E8E4] rounded py-1 z-20 w-48 shadow-sm">
                <button
                  onClick={() => { onFilterChange(null); setFilterOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-[#F5F5F0] ${!filter ? 'font-medium text-[#00875A]' : 'text-[#1A1A1A]'}`}
                >
                  All Types
                </button>
                {PROMPT_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => { onFilterChange(type); setFilterOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-[#F5F5F0] ${filter === type ? 'font-medium text-[#00875A]' : 'text-[#1A1A1A]'}`}
                  >
                    {PROMPT_LABELS[type] || type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="p-4 space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-10 bg-[#F5F5F0] rounded animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && logs.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-sm text-[#6B6B63]">No AI runs recorded yet.</p>
          <p className="text-xs text-[#9CA39B] mt-1">Runs are logged every time the AI agent processes a request.</p>
        </div>
      )}

      {/* Table — hidden on xs, shown on md+ */}
      {!loading && logs.length > 0 && (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#E8E8E4] text-left text-[#9CA39B]">
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">Agent Type</th>
                  <th className="px-4 py-2.5 font-medium">Model</th>
                  <th className="px-4 py-2.5 font-medium text-right">Tokens</th>
                  <th className="px-4 py-2.5 font-medium text-right">Latency</th>
                  <th className="px-4 py-2.5 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} className="border-b border-[#E8E8E4] last:border-0 hover:bg-[#F5F5F0]/50">
                    <td className="px-4 py-2.5">
                      {log.success
                        ? <CheckCircle className="w-4 h-4 text-[#00875A]" />
                        : <XCircle className="w-4 h-4 text-[#DC2626]" />
                      }
                    </td>
                    <td className="px-4 py-2.5 text-[#1A1A1A]">
                      {PROMPT_LABELS[log.prompt_type] || log.prompt_type || '—'}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[#6B6B63]">{log.model || '—'}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-[#6B6B63]">{(log.tokens_used ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-[#6B6B63]">{((log.duration_ms ?? 0) / 1000).toFixed(1)}s</td>
                    <td className="px-4 py-2.5 text-[#9CA39B]">
                      {log.created_at ? new Date(log.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card list — visible on xs/sm only */}
          <div className="md:hidden divide-y divide-[#E8E8E4]">
            {logs.map(log => (
              <div key={log.id} className="px-4 py-3 flex items-start gap-3">
                <div className="mt-0.5">
                  {log.success
                    ? <CheckCircle className="w-4 h-4 text-[#00875A]" />
                    : <XCircle className="w-4 h-4 text-[#DC2626]" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1A1A1A]">{PROMPT_LABELS[log.prompt_type] || log.prompt_type || '—'}</p>
                  <p className="text-xs text-[#6B6B63] mt-0.5">
                    {(log.tokens_used ?? 0).toLocaleString()} tokens &middot; {((log.duration_ms ?? 0) / 1000).toFixed(1)}s
                  </p>
                  {log.error_message && (
                    <p className="text-xs text-[#DC2626] mt-0.5 line-clamp-1">{log.error_message}</p>
                  )}
                </div>
                <span className="text-[10px] text-[#9CA39B] shrink-0">
                  {log.created_at ? new Date(log.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-[#E8E8E4]">
          <span className="text-xs text-[#9CA39B]">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => onPageChange(Math.max(0, page - 1))}
              disabled={page === 0}
              className="p-2 rounded border border-[#E8E8E4] text-[#6B6B63] hover:bg-[#F5F5F0] disabled:opacity-30 min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="p-2 rounded border border-[#E8E8E4] text-[#6B6B63] hover:bg-[#F5F5F0] disabled:opacity-30 min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}