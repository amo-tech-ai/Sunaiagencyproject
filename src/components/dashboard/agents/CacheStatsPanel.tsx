// C105-CACHE-STATS — Cache hit rate and entry list
// Shows active vs expired, total tokens cached, recent entries.
// Mobile-first: responsive table → card list on xs.

import type { CacheStats } from '../../../lib/supabase';
import { Database, CheckCircle, XCircle } from 'lucide-react';

interface CacheStatsPanelProps {
  cacheStats: CacheStats | null;
  loading: boolean;
}

export default function CacheStatsPanel({ cacheStats, loading }: CacheStatsPanelProps) {
  if (loading) {
    return (
      <div className="bg-white rounded border border-[#E8E8E4] p-4 sm:p-6">
        <div className="h-4 bg-[#F5F5F0] rounded w-32 mb-4" />
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-8 bg-[#F5F5F0] rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!cacheStats) {
    return (
      <div className="bg-white rounded border border-[#E8E8E4] p-6 text-center">
        <Database className="w-6 h-6 text-[#E8E8E4] mx-auto mb-2" />
        <p className="text-sm text-[#6B6B63]">No cache data available.</p>
      </div>
    );
  }

  const hitRate = cacheStats.totalEntries > 0
    ? Math.round((cacheStats.activeEntries / cacheStats.totalEntries) * 100)
    : 0;

  return (
    <div className="bg-white rounded border border-[#E8E8E4] p-4 sm:p-6">
      <h3 className="font-[Georgia,serif] text-sm sm:text-base font-semibold text-[#1A1A1A] mb-4">
        Cache Status
      </h3>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <p className="text-lg font-semibold font-mono text-[#00875A]">{cacheStats.activeEntries}</p>
          <p className="text-[10px] text-[#9CA39B]">Active</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold font-mono text-[#9CA39B]">{cacheStats.expiredEntries}</p>
          <p className="text-[10px] text-[#9CA39B]">Expired</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold font-mono text-[#1A1A1A]">{hitRate}%</p>
          <p className="text-[10px] text-[#9CA39B]">Active Rate</p>
        </div>
      </div>

      <p className="text-xs text-[#6B6B63] mb-3">
        {cacheStats.totalTokensCached.toLocaleString()} tokens saved by active cache entries
      </p>

      {/* Recent entries */}
      {cacheStats.entries.length > 0 && (
        <div className="border-t border-[#E8E8E4] pt-3">
          <h4 className="text-xs font-medium text-[#6B6B63] uppercase tracking-wider mb-2">
            Recent Entries
          </h4>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {cacheStats.entries.slice(0, 10).map((entry, i) => {
              const isActive = entry.expires_at > new Date().toISOString();
              const created = new Date(entry.created_at);
              return (
                <div key={i} className="flex items-center gap-2 text-xs py-1">
                  {isActive
                    ? <CheckCircle className="w-3 h-3 text-[#00875A] shrink-0" />
                    : <XCircle className="w-3 h-3 text-[#9CA39B] shrink-0" />
                  }
                  <span className="font-mono text-[#6B6B63] truncate">
                    {entry.input_hash.slice(0, 12)}...
                  </span>
                  <span className="text-[#9CA39B] ml-auto shrink-0">
                    {entry.tokens_used.toLocaleString()} tok
                  </span>
                  <span className="text-[#9CA39B] shrink-0">
                    {created.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
