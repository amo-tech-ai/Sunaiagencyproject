// C94-PROJECT-DETAIL — Individual project view at /app/projects/:id
// Shows project header, systems selected, key milestones, and collapsible
// phase accordions with toggleable deliverable tasks.
// Task states persisted to localStorage (MVP), migrates to tasks table later.
// Mobile-first responsive.

import { useAuth } from '../AuthContext';
import { useDashboardData } from '../../lib/hooks/useDashboardData';
import RoadmapTimeline from './RoadmapTimeline';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, FolderKanban, Clock, DollarSign, Layers, Target, Wand2,
} from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, accessToken } = useAuth();
  const { data, loading, error, refetch } = useDashboardData(user?.id || null, accessToken);

  // Loading
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-32 bg-white rounded border border-[#E8E8E4] animate-pulse" />
        <div className="h-32 bg-white rounded border border-[#E8E8E4] animate-pulse" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="h-40 bg-white rounded border border-[#E8E8E4] animate-pulse" />
          <div className="h-40 bg-white rounded border border-[#E8E8E4] animate-pulse" />
        </div>
        {[1, 2].map(i => (
          <div key={i} className="h-28 bg-white rounded border border-[#E8E8E4] animate-pulse" />
        ))}
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="bg-white rounded border border-[#E8E8E4] p-8 text-center">
        <p className="text-[#DC2626] text-sm mb-3">Unable to load project</p>
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

  // Empty / not found
  if (!data || !data.hasWizardData) {
    return (
      <div className="max-w-md mx-auto text-center py-8 sm:py-16">
        <div className="w-12 h-12 bg-[#E6F4ED] rounded-full flex items-center justify-center mx-auto mb-4">
          <Wand2 className="w-5 h-5 text-[#00875A]" />
        </div>
        <h2 className="font-[Georgia,serif] text-lg font-semibold text-[#1A1A1A] mb-2">
          Project Not Found
        </h2>
        <p className="text-sm text-[#6B6B63] mb-6">
          This project doesn't exist or you don't have access to it.
        </p>
        <Link
          to="/app/projects"
          className="inline-flex items-center gap-1.5 text-sm text-[#00875A] hover:underline min-h-[44px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Projects
        </Link>
      </div>
    );
  }

  const { project, roadmapPhases, org, readiness, quickWins, riskFactors, successMetrics } = data;

  // Collect all milestones across phases
  const allMilestones = roadmapPhases.flatMap((p, pIdx) =>
    p.milestones.map((m, mIdx) => ({
      text: m,
      phase: p.phaseNumber,
      phaseTitle: p.title,
      weekRange: p.weekRange,
      key: `${pIdx}-${mIdx}`,
    }))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Breadcrumb */}
      <Link
        to="/app/projects"
        className="inline-flex items-center gap-1.5 text-sm text-[#6B6B63] hover:text-[#1A1A1A] transition-colors min-h-[44px]"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Projects
      </Link>

      {/* Project header card */}
      <div className="bg-white rounded border border-[#E8E8E4] overflow-hidden">
        <div className="h-1 bg-[#00875A]" />
        <div className="p-4 sm:p-6">
          <div className="flex items-start gap-3 mb-3">
            <FolderKanban className="w-5 h-5 text-[#00875A] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h2 className="font-[Georgia,serif] text-lg sm:text-xl font-semibold text-[#1A1A1A]">
                {project.name}
              </h2>
              <p className="text-sm text-[#6B6B63] mt-0.5">
                {org.name} · {org.industry}
              </p>
            </div>
            <span className="inline-flex items-center text-xs font-medium text-white bg-[#00875A] px-2 py-1 rounded shrink-0">
              Active
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#6B6B63]" />
              <div>
                <p className="text-xs text-[#9CA39B]">Duration</p>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  {project.totalWeeks > 0 ? `${project.totalWeeks} weeks` : 'TBD'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#6B6B63]" />
              <div>
                <p className="text-xs text-[#9CA39B]">Systems</p>
                <p className="text-sm font-medium text-[#1A1A1A]">{project.systems.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#6B6B63]" />
              <div>
                <p className="text-xs text-[#9CA39B]">Investment</p>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  {project.totalInvestment || 'TBD'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#6B6B63]" />
              <div>
                <p className="text-xs text-[#9CA39B]">Readiness</p>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  {readiness.overall > 0 ? `${readiness.overall}/100` : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column: Systems + Milestones */}
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Systems Selected */}
        <div className="bg-white rounded border border-[#E8E8E4] p-4 sm:p-5">
          <h3 className="font-[Georgia,serif] text-sm sm:text-base font-semibold text-[#1A1A1A] mb-3">
            Systems Selected
          </h3>
          <div className="space-y-2">
            {project.systems.map((sys, i) => (
              <div key={sys} className="flex items-center gap-3 px-3 py-2.5 bg-[#F5F5F0] rounded">
                <span className="w-6 h-6 rounded-full bg-[#E6F4ED] text-[#00875A] flex items-center justify-center text-xs font-semibold shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm text-[#1A1A1A]">{sys}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Milestones */}
        <div className="bg-white rounded border border-[#E8E8E4] p-4 sm:p-5">
          <h3 className="font-[Georgia,serif] text-sm sm:text-base font-semibold text-[#1A1A1A] mb-3">
            Key Milestones
          </h3>
          {allMilestones.length === 0 ? (
            <p className="text-sm text-[#9CA39B]">No milestones defined yet.</p>
          ) : (
            <div className="space-y-2">
              {allMilestones.slice(0, 6).map((m) => (
                <div key={m.key} className="flex items-start gap-3 px-3 py-2 rounded hover:bg-[#F5F5F0] transition-colors">
                  <Target className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm text-[#1A1A1A]">{m.text}</p>
                    <p className="text-xs text-[#9CA39B]">
                      Phase {m.phase}: {m.phaseTitle}
                      {m.weekRange ? ` · ${m.weekRange}` : ''}
                    </p>
                  </div>
                </div>
              ))}
              {allMilestones.length > 6 && (
                <p className="text-xs text-[#9CA39B] px-3">
                  +{allMilestones.length - 6} more milestone{allMilestones.length - 6 !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Phase Timeline with task toggling */}
      <div>
        <h3 className="font-[Georgia,serif] text-base sm:text-lg font-semibold text-[#1A1A1A] mb-4">
          Implementation Phases
        </h3>
        <RoadmapTimeline
          phases={roadmapPhases}
          sessionId={data.sessionId}
          quickWins={quickWins}
          riskFactors={riskFactors}
          successMetrics={successMetrics}
        />
      </div>
    </motion.div>
  );
}
