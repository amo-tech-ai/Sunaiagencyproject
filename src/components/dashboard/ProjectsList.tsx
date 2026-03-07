// C93-PROJECTS-LIST — Projects list page at /app/projects
// Shows project cards derived from wizard data. Each card has name, phase, progress,
// systems, and links to detail/roadmap views. Empty state with wizard CTA.
// Mobile-first responsive.

import { useAuth } from '../AuthContext';
import { useDashboardData } from '../../lib/hooks/useDashboardData';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { FolderKanban, ChevronRight, Map, Wand2, Clock } from 'lucide-react';

export default function ProjectsList() {
  const { user, accessToken } = useAuth();
  const { data, loading, error, refetch } = useDashboardData(user?.id || null, accessToken);

  // Loading
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-white rounded border border-[#E8E8E4] animate-pulse" />
        <div className="h-48 bg-white rounded border border-[#E8E8E4] animate-pulse" />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="bg-white rounded border border-[#E8E8E4] p-8 text-center">
        <p className="text-[#DC2626] text-sm mb-3">Unable to load projects</p>
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
  if (!data || !data.hasWizardData) {
    return (
      <div className="max-w-md mx-auto text-center py-8 sm:py-16">
        <div className="w-12 h-12 bg-[#E6F4ED] rounded-full flex items-center justify-center mx-auto mb-4">
          <Wand2 className="w-5 h-5 text-[#00875A]" />
        </div>
        <h2 className="font-[Georgia,serif] text-lg sm:text-xl font-semibold text-[#1A1A1A] mb-2">
          No Projects Yet
        </h2>
        <p className="text-sm text-[#6B6B63] mb-6 leading-relaxed">
          Complete the discovery wizard to create your first AI transformation project with phases, deliverables, and milestones.
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

  const { project, roadmapPhases, org } = data;
  const activePhase = roadmapPhases.find(p => p.status === 'active');

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="font-[Georgia,serif] text-lg sm:text-xl font-semibold text-[#1A1A1A]">
          Your Projects
        </h2>
        <p className="text-sm text-[#6B6B63] mt-0.5">
          AI transformation projects derived from your discovery wizard
        </p>
      </div>

      {/* Project card — MVP shows one project */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white rounded border border-[#E8E8E4] overflow-hidden hover:border-[#00875A]/20 transition-colors">
          {/* Top accent bar */}
          <div className="h-1 bg-[#00875A]" />

          <div className="p-4 sm:p-6">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FolderKanban className="w-4 h-4 text-[#00875A] shrink-0" />
                  <h3 className="font-[Georgia,serif] text-base sm:text-lg font-semibold text-[#1A1A1A] truncate">
                    {project.name}
                  </h3>
                </div>
                <p className="text-sm text-[#6B6B63]">
                  {org.name} · {org.industry}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-white bg-[#00875A] px-2 py-1 rounded shrink-0">
                Active
              </span>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-[#6B6B63]">
                  Phase {project.currentPhase} of {project.totalPhases}
                  {activePhase ? `: ${activePhase.title}` : ''}
                </span>
                <span className="text-xs font-mono text-[#1A1A1A]">{project.progress}%</span>
              </div>
              <div
                className="h-2 bg-[#F0F0EC] rounded-sm overflow-hidden"
                role="progressbar"
                aria-valuenow={project.progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full bg-[#00875A] rounded-sm transition-all duration-600"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm text-[#6B6B63]">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {project.totalWeeks > 0 ? `${project.totalWeeks} weeks` : 'Timeline TBD'}
              </span>
              <span>{project.systems.length} system{project.systems.length !== 1 ? 's' : ''}</span>
              {project.totalInvestment && project.totalInvestment !== '$0' && (
                <span>{project.totalInvestment}</span>
              )}
            </div>

            {/* Systems tags */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {project.systems.map(sys => (
                <span
                  key={sys}
                  className="inline-block px-2 py-0.5 bg-[#F5F5F0] border border-[#E8E8E4] rounded text-xs text-[#6B6B63]"
                >
                  {sys}
                </span>
              ))}
            </div>

            {/* Next milestone hint */}
            {activePhase && activePhase.milestones.length > 0 && (
              <div className="text-xs text-[#9CA39B] mb-4">
                Next milestone: {activePhase.milestones[0]}
              </div>
            )}

            {/* Action links */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <Link
                to={`/app/projects/${data.sessionId}`}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#1A1A1A] text-[#F5F5F0] text-sm font-medium rounded hover:bg-[#333] transition-colors min-h-[44px]"
              >
                View Project
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/app/roadmap"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white text-[#1A1A1A] text-sm border border-[#E8E8E4] rounded hover:bg-[#F5F5F0] transition-colors min-h-[44px]"
              >
                <Map className="w-3.5 h-3.5" />
                View Roadmap
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
