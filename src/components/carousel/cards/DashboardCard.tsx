import { Check, Clock } from 'lucide-react';

interface Activity {
  text: string;
  status: 'completed' | 'in-progress';
}

interface DashboardCardProps {
  currentWeek?: number;
  totalWeeks?: number;
  progress?: number;
  activities?: Activity[];
  nextMilestone?: string;
}

const DEFAULT_ACTIVITIES: Activity[] = [
  { text: 'Database schema approved', status: 'completed' },
  { text: 'API endpoints deployed', status: 'completed' },
  { text: 'Frontend in review', status: 'in-progress' },
];

export default function DashboardCard({
  currentWeek = 3,
  totalWeeks = 8,
  progress = 60,
  activities = DEFAULT_ACTIVITIES,
  nextMilestone = 'User testing - Due in 3 days',
}: DashboardCardProps) {
  return (
    <div className="bg-green-50 border border-green-200 p-8 md:p-12 min-h-[320px]">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <p className="text-xs uppercase tracking-wider text-green-600">
            Live Updates
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">
            Progress: Week {currentWeek} of {totalWeeks}
          </p>
          <div className="w-full bg-gray-200 h-2 mb-1">
            <div
              className="bg-green-600 h-2 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">{progress}%</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">
            Recent Activity
          </p>
          <div className="space-y-2">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center gap-2">
                {activity.status === 'completed' ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Clock className="w-4 h-4 text-orange-500" />
                )}
                <p className="text-sm text-gray-700">{activity.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-green-300">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
            Next Milestone
          </p>
          <p className="text-gray-700">{nextMilestone}</p>
        </div>
      </div>
    </div>
  );
}
