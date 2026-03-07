// C89-EMPTY — Empty state when user has no wizard data
// Mobile-first: full-width sticky CTA on mobile, centered card on sm+
// Preview of dashboard metrics as ghost cards

import { Link } from 'react-router';
import { Wand2, Calendar, Activity, Layers, GitBranch, DollarSign } from 'lucide-react';

export default function EmptyDashboard() {
  return (
    <div className="space-y-8">
      {/* Main CTA card */}
      <div className="bg-white rounded border border-[#E8E8E4] p-6 sm:p-8 md:p-12 text-center max-w-xl mx-auto">
        <div className="w-14 h-14 bg-[#E6F4ED] rounded-full flex items-center justify-center mx-auto mb-5">
          <Wand2 className="w-6 h-6 text-[#00875A]" />
        </div>

        <h2 className="font-[Georgia,serif] text-xl sm:text-2xl font-semibold text-[#1A1A1A] mb-2">
          Start Your AI Transformation
        </h2>
        <p className="text-[#6B6B63] text-sm max-w-md mx-auto mb-6 leading-relaxed">
          Complete the 5-minute discovery wizard to get your personalized readiness score,
          system recommendations, and implementation roadmap.
        </p>

        {/* CTA buttons — full-width stacked on mobile, inline on sm+ */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <Link
            to="/wizard"
            className="px-6 py-3 sm:py-2.5 bg-[#00875A] text-white text-sm font-medium rounded hover:bg-[#006D48] transition-colors text-center min-h-[48px] flex items-center justify-center"
          >
            Start Discovery Wizard
          </Link>
          <Link
            to="/booking"
            className="px-6 py-3 sm:py-2.5 bg-white text-[#1A1A1A] text-sm border border-[#E8E8E4] rounded hover:bg-[#F5F5F0] transition-colors text-center min-h-[48px] flex items-center justify-center"
          >
            <Calendar className="w-4 h-4 mr-2 text-[#6B6B63]" />
            Book a Call Instead
          </Link>
        </div>
      </div>

      {/* Preview of what dashboard will show */}
      <div>
        <p className="text-xs text-[#9CA39B] text-center mb-4 uppercase tracking-wider">
          After completing the wizard, your dashboard will show
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 opacity-40 pointer-events-none" aria-hidden="true">
          {[
            { label: 'Readiness', value: '—', icon: Activity },
            { label: 'AI Systems', value: '—', icon: Layers },
            { label: 'Phase', value: '—', icon: GitBranch },
            { label: 'Investment', value: '—', icon: DollarSign },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white rounded border border-[#E8E8E4] p-3 sm:p-4">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6B6B63]" />
                <span className="text-[10px] sm:text-xs text-[#6B6B63] uppercase tracking-wider">{label}</span>
              </div>
              <span className="font-mono text-xl sm:text-2xl font-semibold text-[#1A1A1A]">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile sticky CTA bar — visible only on small screens when scrolled past main CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E8E4] p-3 sm:hidden z-40 safe-area-bottom">
        <Link
          to="/wizard"
          className="block w-full py-3 bg-[#00875A] text-white text-sm font-medium rounded text-center min-h-[48px] flex items-center justify-center"
        >
          Start Discovery Wizard
        </Link>
      </div>
      {/* Spacer for sticky bar on mobile */}
      <div className="h-16 sm:hidden" aria-hidden="true" />
    </div>
  );
}
