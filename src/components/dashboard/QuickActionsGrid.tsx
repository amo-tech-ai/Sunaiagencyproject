// C87-ACTIONS — 4 quick action cards for common dashboard tasks
// Mobile-first: 1-col stacked on xs, 2-col on sm, 4-col on lg.
// 48px min touch target height. Focus-visible ring for keyboard nav.

import { Link } from 'react-router';
import { Map, Lightbulb, Calendar, FileText } from 'lucide-react';

const ACTIONS = [
  {
    to: '/app/roadmap',
    label: 'View Roadmap',
    description: 'Track implementation phases and milestones',
    icon: Map,
  },
  {
    to: '/app/insights',
    label: 'AI Insights',
    description: 'Radar chart, readiness scores, and AI recommendations',
    icon: Lightbulb,
  },
  {
    to: '/booking',
    label: 'Schedule Call',
    description: 'Book a strategy session with your consultant',
    icon: Calendar,
  },
  {
    to: '/app/documents',
    label: 'Documents',
    description: 'Access proposals, reports, and deliverables',
    icon: FileText,
  },
];

export default function QuickActionsGrid() {
  return (
    <div>
      <h3 className="font-[Georgia,serif] text-base font-semibold text-[#1A1A1A] mb-3">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {ACTIONS.map(({ to, label, description, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group bg-white rounded border border-[#E8E8E4] p-4 hover:border-[#00875A]/30 transition-all hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[#00875A] focus-visible:outline-offset-2 flex items-start gap-3 sm:block min-h-[56px]"
          >
            <Icon className="w-5 h-5 text-[#00875A] shrink-0 sm:mb-2" />
            <div>
              <p className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#00875A] transition-colors">
                {label}
              </p>
              <p className="text-xs text-[#9CA39B] mt-0.5 line-clamp-2">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}