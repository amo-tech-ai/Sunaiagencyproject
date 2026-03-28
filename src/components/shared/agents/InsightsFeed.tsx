// InsightsFeed — Compact widget showing latest insights with agent attribution
// Used on dashboard home and other pages as a lightweight insights summary
// Shows maxItems (default 3) with priority icons and agent badges

import { Lightbulb, AlertTriangle, TrendingUp, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { AgentBadge } from './AgentBadge';

interface InsightFeedItem {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  agentSlug?: string;
  actionRoute?: string;
}

interface InsightsFeedProps {
  insights: InsightFeedItem[];
  loading?: boolean;
  maxItems?: number;
  showViewAll?: boolean;
  viewAllRoute?: string;
}

const PRIORITY_ICON = {
  high: { Icon: AlertTriangle, color: '#DC2626', bg: '#FEF2F2' },
  medium: { Icon: TrendingUp, color: '#D97706', bg: '#FEF9E7' },
  low: { Icon: Lightbulb, color: '#00875A', bg: '#E6F4ED' },
};

export function InsightsFeed({
  insights,
  loading = false,
  maxItems = 3,
  showViewAll = true,
  viewAllRoute = '/app/insights',
}: InsightsFeedProps) {
  const visibleInsights = insights.slice(0, maxItems);

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4" style={{ color: '#00875A' }} />
          <h3 className="font-[Georgia,serif] text-sm font-semibold text-[#1A1A1A]">
            Latest Insights
          </h3>
        </div>
        {loading && (
          <span className="flex items-center gap-1.5 text-xs text-[#9CA39B]">
            <Loader2 className="w-3 h-3 animate-spin" />
          </span>
        )}
      </div>

      {loading && visibleInsights.length === 0 ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded border border-[#E8E8E4] p-3 animate-pulse">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded bg-[#F5F5F0] shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-[#F5F5F0] rounded w-3/4" />
                  <div className="h-2.5 bg-[#F5F5F0] rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : visibleInsights.length === 0 ? (
        <p className="text-xs text-[#9CA39B] text-center py-4">No insights yet</p>
      ) : (
        <div className="space-y-1.5">
          {visibleInsights.map((insight) => {
            const pc = PRIORITY_ICON[insight.priority];
            const Icon = pc.Icon;

            return (
              <div
                key={insight.id}
                className="bg-white rounded border border-[#E8E8E4] px-3 py-2.5 hover:border-[#D4CFC8] transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: pc.bg }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: pc.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A1A1A] leading-snug truncate">
                      {insight.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {insight.agentSlug && <AgentBadge slug={insight.agentSlug} />}
                      {insight.actionRoute && (
                        <Link
                          to={insight.actionRoute}
                          className="text-[10px] text-[#00875A] hover:underline font-medium ml-auto shrink-0"
                        >
                          View
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showViewAll && insights.length > maxItems && (
        <Link
          to={viewAllRoute}
          className="flex items-center justify-center gap-1 text-xs text-[#00875A] hover:underline font-medium mt-3 py-1.5"
        >
          View all {insights.length} insights
          <ChevronRight className="w-3 h-3" />
        </Link>
      )}
    </section>
  );
}
