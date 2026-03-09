// C14-T21 — Roadmap Execution Panel
// Shows implementation phases from wizard step 5 data (canvas.metadata.phases)
// Phase cards with progress bars, task status, duration, cost
// Read-only in Phase 1

import { CheckCircle2, Loader2, Circle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

interface PhaseTask {
  name: string;
  status: 'completed' | 'in_progress' | 'pending';
}

interface RoadmapPhase {
  phaseNumber?: number;
  title?: string;
  name?: string;
  weekRange?: string;
  systems?: string[];
  deliverables?: string[];
  milestones?: string[];
  estimatedCost?: string;
  tasks?: PhaseTask[];
  status?: 'completed' | 'active' | 'upcoming';
  progress?: number;
}

interface RoadmapExecutionPanelProps {
  phases: RoadmapPhase[];
  className?: string;
}

function inferTasks(phase: RoadmapPhase): PhaseTask[] {
  // If explicit tasks exist, use them
  if (phase.tasks && phase.tasks.length > 0) return phase.tasks;

  // Otherwise, derive tasks from deliverables/systems/milestones
  const items: PhaseTask[] = [];
  const allItems = [
    ...(phase.systems || []),
    ...(phase.deliverables || []),
    ...(phase.milestones || []),
  ];

  // Determine phase status
  const isActive = phase.status === 'active';
  const isCompleted = phase.status === 'completed';

  for (let i = 0; i < allItems.length && i < 5; i++) {
    const item = allItems[i];
    let status: PhaseTask['status'] = 'pending';
    if (isCompleted) {
      status = 'completed';
    } else if (isActive) {
      // First ~40% completed, next ~20% in progress, rest pending
      if (i < Math.ceil(allItems.length * 0.4)) status = 'completed';
      else if (i < Math.ceil(allItems.length * 0.6)) status = 'in_progress';
    }
    items.push({ name: item, status });
  }

  return items;
}

function computeProgress(tasks: PhaseTask[]): number {
  if (tasks.length === 0) return 0;
  const score = tasks.reduce((sum, t) => {
    if (t.status === 'completed') return sum + 1;
    if (t.status === 'in_progress') return sum + 0.5;
    return sum;
  }, 0);
  return Math.round((score / tasks.length) * 100 / 5) * 5; // Round to nearest 5%
}

const statusIcons = {
  completed: <CheckCircle2 className="w-3.5 h-3.5 text-[#00875A]" />,
  in_progress: <Loader2 className="w-3.5 h-3.5 text-blue-500" />,
  pending: <Circle className="w-3.5 h-3.5 text-[#9CA39B]" />,
};

const statusLabels = {
  completed: 'done',
  in_progress: 'in progress',
  pending: 'pending',
};

function PhaseCard({ phase, index }: { phase: RoadmapPhase; index: number }) {
  const tasks = inferTasks(phase);
  const progress = phase.progress ?? computeProgress(tasks);
  const title = phase.title || phase.name || `Phase ${phase.phaseNumber || index + 1}`;

  return (
    <div className="bg-white border border-[#E8E8E4] rounded-lg p-4">
      {/* Phase header */}
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-[#1A1A1A]">
          Phase {phase.phaseNumber || index + 1} — {title}
        </h4>
        <span className="text-sm font-bold text-[#00875A]">{progress}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-[#E8E8E4] rounded-full mt-1 mb-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${progress > 0 ? 'bg-[#00875A]' : 'bg-[#F5F5F0]'}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Task list */}
      {tasks.length > 0 && (
        <div className="space-y-1.5 mt-3">
          {tasks.map((task, i) => {
            const isLast = i === tasks.length - 1;
            return (
              <div key={i} className="flex items-center justify-between text-xs text-[#4A4A4A]">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-[#9CA39B] font-mono text-[10px] shrink-0 w-3">
                    {isLast ? '└' : '├'}
                  </span>
                  <span className="truncate">{task.name}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <span className={`text-[10px] ${
                    task.status === 'completed' ? 'text-[#00875A]' :
                    task.status === 'in_progress' ? 'text-blue-500' : 'text-[#9CA39B]'
                  }`}>
                    {statusLabels[task.status]}
                  </span>
                  {statusIcons[task.status]}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Phase meta */}
      {(phase.weekRange || phase.estimatedCost) && (
        <div className="text-xs text-[#9CA39B] mt-3 pt-2 border-t border-[#E8E8E4] flex items-center gap-2">
          {phase.weekRange && <span>{phase.weekRange}</span>}
          {phase.weekRange && phase.estimatedCost && <span>·</span>}
          {phase.estimatedCost && <span>{phase.estimatedCost} est.</span>}
        </div>
      )}
    </div>
  );
}

export default function RoadmapExecutionPanel({ phases, className = '' }: RoadmapExecutionPanelProps) {
  if (!phases || phases.length === 0) {
    return (
      <div className={`${className}`}>
        <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">Execution Roadmap</h3>
        <div className="bg-white border border-[#E8E8E4] rounded-lg p-6 text-center">
          <p className="text-sm text-[#9CA39B] mb-1">No roadmap data yet.</p>
          <p className="text-xs text-[#9CA39B] mb-3">
            Complete the wizard to generate your implementation roadmap.
          </p>
          <Link
            to="/wizard"
            className="inline-flex items-center gap-1 text-xs text-[#00875A] hover:underline font-medium"
          >
            Go to Wizard <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">Execution Roadmap</h3>
      <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)]">
        {phases.map((phase, i) => (
          <PhaseCard key={phase.phaseNumber || i} phase={phase} index={i} />
        ))}
      </div>
    </div>
  );
}
