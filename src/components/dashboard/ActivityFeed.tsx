// C86-ACTIVITY — Chronological event list with type icons and relative timestamps
// Mobile-first: compact items, accessible time elements, equal-height card

import type { ActivityItem } from '../../lib/hooks/useDashboardData';
import { Wand2, FolderKanban, Target, Bot } from 'lucide-react';
import { motion } from 'motion/react';

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  wizard: <Wand2 className="w-3.5 h-3.5" />,
  project: <FolderKanban className="w-3.5 h-3.5" />,
  milestone: <Target className="w-3.5 h-3.5" />,
  ai: <Bot className="w-3.5 h-3.5" />,
};

const TYPE_COLORS: Record<string, string> = {
  wizard: 'bg-[#E6F4ED] text-[#00875A]',
  project: 'bg-[#F5F5F0] text-[#1A1A1A]',
  milestone: 'bg-[#FEF3CD] text-[#D97706]',
  ai: 'bg-[#EDE9FE] text-[#7C3AED]',
};

function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 7) return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return 'Just now';
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="bg-white rounded border border-[#E8E8E4] p-4 sm:p-5 h-full flex flex-col">
      <h3 className="font-[Georgia,serif] text-sm sm:text-base font-semibold text-[#1A1A1A] mb-3 sm:mb-4">
        Recent Activity
      </h3>

      {activities.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-[#9CA39B] text-center py-6">No activity yet</p>
        </div>
      ) : (
        <ol className="space-y-2.5 sm:space-y-3 flex-1">
          {activities.map((activity, i) => (
            <motion.li
              key={activity.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1, delay: i * 0.05 }}
              className="flex items-start gap-2.5 sm:gap-3"
            >
              <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 mt-0.5 ${TYPE_COLORS[activity.type] || TYPE_COLORS.project}`}>
                {TYPE_ICONS[activity.type] || TYPE_ICONS.project}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#1A1A1A] leading-snug">{activity.action}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-xs text-[#9CA39B] truncate">{activity.detail}</p>
                  <span className="text-[#E8E8E4] text-xs hidden sm:inline">·</span>
                  <time
                    dateTime={activity.timestamp}
                    className="text-xs text-[#9CA39B] shrink-0 hidden sm:inline"
                  >
                    {formatRelativeTime(activity.timestamp)}
                  </time>
                </div>
                {/* Mobile: timestamp on its own line */}
                <time
                  dateTime={activity.timestamp}
                  className="text-[10px] text-[#9CA39B] sm:hidden mt-0.5 block"
                >
                  {formatRelativeTime(activity.timestamp)}
                </time>
              </div>
            </motion.li>
          ))}
        </ol>
      )}
    </div>
  );
}
