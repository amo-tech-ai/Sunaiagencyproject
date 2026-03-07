// C85-PROJECT — Project summary card with phase progress and system list
// Mobile-first: compact padding, touch-friendly phase blocks (min 36px),
// accessible progress bar with aria-valuenow

import type { ProjectData, RoadmapPhase } from '../../lib/hooks/useDashboardData';
import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';

interface ProjectSummaryCardProps {
  project: ProjectData;
  phases: RoadmapPhase[];
}

export default function ProjectSummaryCard({ project, phases }: ProjectSummaryCardProps) {
  return (
    <div className="bg-white rounded border border-[#E8E8E4] p-4 sm:p-5 h-full flex flex-col">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-[Georgia,serif] text-sm sm:text-base font-semibold text-[#1A1A1A] truncate">
            {project.name}
          </h3>
          <p className="text-xs text-[#6B6B63] mt-0.5">
            Phase {project.currentPhase} of {project.totalPhases}
            {project.totalWeeks > 0 ? ` · ${project.totalWeeks}wk` : ''}
          </p>
        </div>
        <Link
          to="/app/projects"
          className="text-xs text-[#00875A] hover:underline flex items-center gap-0.5 shrink-0 ml-2 min-h-[44px] min-w-[44px] justify-end focus-visible:outline-2 focus-visible:outline-[#00875A]"
          aria-label="View all projects"
        >
          <span className="hidden sm:inline">View</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Overall progress bar */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-[#6B6B63]">Overall Progress</span>
          <span className="text-xs font-mono text-[#1A1A1A]">{project.progress}%</span>
        </div>
        <div
          className="h-2 bg-[#F0F0EC] rounded-sm overflow-hidden"
          role="progressbar"
          aria-valuenow={project.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Project progress: ${project.progress}%`}
        >
          <div
            className="h-full bg-[#00875A] rounded-sm transition-all duration-600 ease-out"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Mini roadmap phases */}
      {phases.length > 0 && (
        <div className="space-y-2 flex-1">
          <p className="text-xs text-[#6B6B63] uppercase tracking-wider">Roadmap</p>
          <div className="flex gap-1 sm:gap-1.5">
            {phases.map(phase => (
              <div
                key={phase.phaseNumber}
                title={phase.title}
                className={`flex-1 rounded-sm min-h-[36px] flex items-center justify-center text-xs font-medium transition-colors ${
                  phase.status === 'active'
                    ? 'bg-[#00875A] text-white'
                    : phase.status === 'completed'
                    ? 'bg-[#E6F4ED] text-[#00875A]'
                    : 'bg-[#F0F0EC] text-[#9CA39B]'
                }`}
              >
                P{phase.phaseNumber}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Systems list */}
      <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5">
        {project.systems.map(system => (
          <span
            key={system}
            className="inline-block px-2 py-0.5 bg-[#F5F5F0] border border-[#E8E8E4] rounded text-xs text-[#6B6B63] truncate max-w-[140px]"
          >
            {system}
          </span>
        ))}
      </div>
    </div>
  );
}
