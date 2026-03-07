// C92-ROADMAP-PAGE — Full-page roadmap view at /app/roadmap
// Reads from useDashboardData, renders RoadmapTimeline with all sections
// Mobile-first responsive. Empty state if no wizard data.

import { useAuth } from '../AuthContext';
import { useDashboardData } from '../../lib/hooks/useDashboardData';
import RoadmapTimeline from './RoadmapTimeline';
import { Link } from 'react-router';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function RoadmapPage() {
  const { user, accessToken } = useAuth();
  const { data, loading, error, refetch } = useDashboardData(user?.id || null, accessToken);

  // Loading
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-white rounded border border-[#E8E8E4] animate-pulse" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-white rounded border border-[#E8E8E4] animate-pulse" />
        ))}
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="bg-white rounded border border-[#E8E8E4] p-8 text-center">
        <p className="text-[#DC2626] text-sm mb-3">Unable to load roadmap data</p>
        <p className="text-[#6B6B63] text-xs mb-4">{error}</p>
        <button
          onClick={refetch}
          className="px-5 py-2.5 bg-[#1A1A1A] text-[#F5F5F0] text-sm rounded hover:bg-[#333] transition-colors min-h-[44px]"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (!data || !data.hasWizardData || data.roadmapPhases.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-8 sm:py-16">
        <div className="w-12 h-12 bg-[#E6F4ED] rounded-full flex items-center justify-center mx-auto mb-4">
          <Wand2 className="w-5 h-5 text-[#00875A]" />
        </div>
        <h2 className="font-[Georgia,serif] text-lg sm:text-xl font-semibold text-[#1A1A1A] mb-2">
          No Roadmap Yet
        </h2>
        <p className="text-sm text-[#6B6B63] mb-6 leading-relaxed">
          Complete the discovery wizard to generate your personalized implementation roadmap with phases, deliverables, and milestones.
        </p>
        <Link
          to="/wizard"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#00875A] text-white text-sm font-medium rounded hover:bg-[#006D48] transition-colors min-h-[44px]"
        >
          <Wand2 className="w-4 h-4" />
          Start Discovery Wizard
        </Link>
      </div>
    );
  }

  // Parse extended roadmap data from step 5 AI results
  const step5Data = data as any;
  const quickWins = step5Data?.quickWins || [];
  const riskFactors = step5Data?.riskFactors || [];
  const successMetrics = step5Data?.successMetrics || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back link */}
      <Link
        to="/app/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-[#6B6B63] hover:text-[#1A1A1A] transition-colors mb-4 min-h-[44px]"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Dashboard
      </Link>

      <RoadmapTimeline
        phases={data.roadmapPhases}
        sessionId={data.sessionId}
        projectName={data.project.name}
        totalWeeks={data.project.totalWeeks}
        totalInvestment={data.project.totalInvestment}
        quickWins={quickWins}
        riskFactors={riskFactors}
        successMetrics={successMetrics}
      />
    </motion.div>
  );
}
