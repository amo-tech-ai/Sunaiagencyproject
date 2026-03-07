// C91-ROADMAP-TIMELINE — Interactive phase timeline with expandable deliverables
// Mobile-first: vertical stacked phases. Desktop: horizontal connected blocks.
// Click phase to expand/collapse. Task status toggle (not-started → in-progress → completed).
// Phase progress computed from task statuses. Current phase expanded by default.

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { RoadmapPhase } from '../../lib/hooks/useDashboardData';
import {
  ChevronDown, Check, Circle, Loader2, Lock, Target,
  AlertTriangle, Clock,
} from 'lucide-react';

// ── Task Status Types ──
type TaskStatus = 'not-started' | 'in-progress' | 'completed';

interface TaskState {
  [phaseIndex: number]: { [taskIndex: number]: TaskStatus };
}

// ── LocalStorage persistence for task status ──
function loadTaskStates(sessionId: string): TaskState {
  try {
    const raw = localStorage.getItem(`roadmap-tasks-${sessionId}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveTaskStates(sessionId: string, state: TaskState): void {
  try {
    localStorage.setItem(`roadmap-tasks-${sessionId}`, JSON.stringify(state));
  } catch {
    // Silently fail on localStorage errors
  }
}

// ── Status cycling: not-started → in-progress → completed → not-started ──
function nextStatus(current: TaskStatus): TaskStatus {
  if (current === 'not-started') return 'in-progress';
  if (current === 'in-progress') return 'completed';
  return 'not-started';
}

// ── Task status icon ──
function TaskStatusIcon({ status }: { status: TaskStatus }) {
  if (status === 'completed') {
    return (
      <div className="w-5 h-5 rounded bg-[#00875A] flex items-center justify-center shrink-0">
        <Check className="w-3 h-3 text-white" />
      </div>
    );
  }
  if (status === 'in-progress') {
    return (
      <div className="w-5 h-5 rounded border-2 border-[#00875A] flex items-center justify-center shrink-0">
        <Loader2 className="w-3 h-3 text-[#00875A]" />
      </div>
    );
  }
  return (
    <div className="w-5 h-5 rounded border-2 border-[#E8E8E4] shrink-0" />
  );
}

// ── Status label ──
function statusLabel(status: TaskStatus): string {
  if (status === 'completed') return 'Done';
  if (status === 'in-progress') return 'In Progress';
  return 'Not Started';
}

function statusColor(status: TaskStatus): string {
  if (status === 'completed') return 'text-[#00875A]';
  if (status === 'in-progress') return 'text-[#D97706]';
  return 'text-[#9CA39B]';
}

// ── Phase status indicator ──
function PhaseStatusBadge({ status }: { status: RoadmapPhase['status'] }) {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#00875A] bg-[#E6F4ED] px-2 py-0.5 rounded">
        <Check className="w-3 h-3" /> Completed
      </span>
    );
  }
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-white bg-[#00875A] px-2 py-0.5 rounded">
        <Circle className="w-3 h-3 fill-current" /> Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#9CA39B] bg-[#F0F0EC] px-2 py-0.5 rounded">
      <Lock className="w-3 h-3" /> Upcoming
    </span>
  );
}

// ── Single Phase Block ──
interface PhaseBlockProps {
  phase: RoadmapPhase;
  phaseIndex: number;
  expanded: boolean;
  onToggle: () => void;
  taskStates: { [taskIndex: number]: TaskStatus };
  onTaskToggle: (taskIndex: number) => void;
  isLocked: boolean;
  computedProgress: number;
}

function PhaseBlock({
  phase, phaseIndex, expanded, onToggle, taskStates, onTaskToggle, isLocked, computedProgress,
}: PhaseBlockProps) {
  const deliverableCount = phase.deliverables.length;
  const completedCount = Object.values(taskStates).filter(s => s === 'completed').length;

  return (
    <div
      className={`bg-white rounded border transition-colors ${
        phase.status === 'active'
          ? 'border-[#00875A]/30'
          : 'border-[#E8E8E4]'
      } ${isLocked ? 'opacity-60' : ''}`}
    >
      {/* Phase header — always visible */}
      <button
        onClick={onToggle}
        disabled={isLocked}
        className="w-full text-left p-4 sm:p-5 flex items-start gap-3 hover:bg-[#F5F5F0]/50 transition-colors min-h-[56px] focus-visible:outline-2 focus-visible:outline-[#00875A] focus-visible:outline-offset-[-2px] disabled:cursor-not-allowed"
        aria-expanded={expanded}
      >
        {/* Phase number circle */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold ${
            phase.status === 'active'
              ? 'bg-[#00875A] text-white'
              : phase.status === 'completed'
              ? 'bg-[#E6F4ED] text-[#00875A]'
              : 'bg-[#F0F0EC] text-[#9CA39B]'
          }`}
        >
          {phase.status === 'completed' ? <Check className="w-4 h-4" /> : phase.phaseNumber}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-[Georgia,serif] text-sm sm:text-base font-semibold text-[#1A1A1A]">
              {phase.title}
            </h3>
            <PhaseStatusBadge status={phase.status} />
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-[#6B6B63] flex-wrap">
            {phase.weekRange && <span>{phase.weekRange}</span>}
            {phase.systems.length > 0 && (
              <>
                <span className="text-[#E8E8E4]">·</span>
                <span>{phase.systems.length} system{phase.systems.length !== 1 ? 's' : ''}</span>
              </>
            )}
            {phase.estimatedCost && (
              <>
                <span className="text-[#E8E8E4]">·</span>
                <span>{phase.estimatedCost}</span>
              </>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[#9CA39B]">
                {completedCount}/{deliverableCount} tasks
              </span>
              <span className="text-[10px] font-mono text-[#6B6B63]">{computedProgress}%</span>
            </div>
            <div
              className="h-1.5 bg-[#F0F0EC] rounded-sm overflow-hidden"
              role="progressbar"
              aria-valuenow={computedProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-[#00875A] rounded-sm transition-all duration-500 ease-out"
                style={{ width: `${computedProgress}%` }}
              />
            </div>
          </div>
        </div>

        {!isLocked && (
          <ChevronDown
            className={`w-4 h-4 text-[#9CA39B] shrink-0 mt-1 transition-transform duration-200 ${
              expanded ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        )}
        {isLocked && <Lock className="w-4 h-4 text-[#9CA39B] shrink-0 mt-1" />}
      </button>

      {/* Expanded content: deliverables + milestones */}
      <AnimatePresence>
        {expanded && !isLocked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3">
              {/* Divider */}
              <div className="border-t border-[#E8E8E4]" />

              {/* Systems */}
              {phase.systems.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {phase.systems.map(sys => (
                    <span
                      key={sys}
                      className="inline-block px-2 py-0.5 bg-[#F5F5F0] border border-[#E8E8E4] rounded text-xs text-[#6B6B63]"
                    >
                      {sys}
                    </span>
                  ))}
                </div>
              )}

              {/* Deliverables as tasks */}
              {phase.deliverables.length > 0 && (
                <div>
                  <p className="text-xs text-[#6B6B63] uppercase tracking-wider mb-2">Deliverables</p>
                  <ul className="space-y-1">
                    {phase.deliverables.map((task, taskIdx) => {
                      const status = taskStates[taskIdx] || 'not-started';
                      return (
                        <li key={taskIdx}>
                          <button
                            onClick={(e) => { e.stopPropagation(); onTaskToggle(taskIdx); }}
                            className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded hover:bg-[#F5F5F0] transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-[#00875A] ${
                              status === 'completed' ? 'opacity-60' : ''
                            }`}
                            aria-label={`${task} — ${statusLabel(status)}. Click to change status.`}
                          >
                            <TaskStatusIcon status={status} />
                            <span
                              className={`text-sm flex-1 ${
                                status === 'completed'
                                  ? 'line-through text-[#9CA39B]'
                                  : 'text-[#1A1A1A]'
                              }`}
                            >
                              {task}
                            </span>
                            <span className={`text-[10px] sm:text-xs shrink-0 ${statusColor(status)}`}>
                              {statusLabel(status)}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Milestones */}
              {phase.milestones.length > 0 && (
                <div>
                  <p className="text-xs text-[#6B6B63] uppercase tracking-wider mb-2">Milestones</p>
                  <ul className="space-y-1.5">
                    {phase.milestones.map((milestone, mIdx) => (
                      <li
                        key={mIdx}
                        className="flex items-center gap-2.5 px-3 py-2 rounded bg-[#F5F5F0]/50"
                      >
                        <Target className="w-4 h-4 text-[#D97706] shrink-0" />
                        <span className="text-sm text-[#1A1A1A]">{milestone}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main RoadmapTimeline ──
interface RoadmapTimelineProps {
  phases: RoadmapPhase[];
  sessionId: string;
  projectName?: string;
  totalWeeks?: number;
  totalInvestment?: string;
  quickWins?: string[];
  riskFactors?: { risk: string; mitigation: string }[];
  successMetrics?: { metric: string; target: string; timeframe: string }[];
  compact?: boolean; // For embedding in dashboard home
}

export default function RoadmapTimeline({
  phases, sessionId, projectName, totalWeeks, totalInvestment,
  quickWins, riskFactors, successMetrics, compact = false,
}: RoadmapTimelineProps) {
  // Task states persisted in localStorage
  const [taskStates, setTaskStates] = useState<TaskState>(() => loadTaskStates(sessionId));

  // Expanded phases — active phase expanded by default
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(() => {
    const initial = new Set<number>();
    phases.forEach((p, i) => {
      if (p.status === 'active') initial.add(i);
    });
    if (initial.size === 0 && phases.length > 0) initial.add(0);
    return initial;
  });

  const togglePhase = useCallback((index: number) => {
    setExpandedPhases(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const toggleTask = useCallback((phaseIndex: number, taskIndex: number) => {
    setTaskStates(prev => {
      const phaseTasks = prev[phaseIndex] || {};
      const current = phaseTasks[taskIndex] || 'not-started';
      const updated = {
        ...prev,
        [phaseIndex]: {
          ...phaseTasks,
          [taskIndex]: nextStatus(current),
        },
      };
      saveTaskStates(sessionId, updated);
      return updated;
    });
  }, [sessionId]);

  // Compute progress per phase from task states
  const computeProgress = useCallback((phaseIndex: number, deliverableCount: number): number => {
    if (deliverableCount === 0) return 0;
    const phaseTasks = taskStates[phaseIndex] || {};
    const completed = Object.values(phaseTasks).filter(s => s === 'completed').length;
    return Math.round((completed / deliverableCount) * 100);
  }, [taskStates]);

  // Determine if a phase is locked (all previous phases must be completed or active)
  const isLocked = useCallback((phaseIndex: number): boolean => {
    if (phaseIndex === 0) return false;
    // For MVP, only lock if the phase is "upcoming" per AI data
    return phases[phaseIndex]?.status === 'upcoming';
  }, [phases]);

  if (phases.length === 0) {
    return (
      <div className="bg-white rounded border border-[#E8E8E4] p-8 text-center">
        <Clock className="w-8 h-8 text-[#9CA39B] mx-auto mb-3" />
        <p className="text-sm text-[#6B6B63]">No roadmap phases generated yet.</p>
        <p className="text-xs text-[#9CA39B] mt-1">Complete the wizard to generate your implementation roadmap.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header — hidden in compact mode */}
      {!compact && projectName && (
        <div>
          <h2 className="font-[Georgia,serif] text-lg sm:text-xl font-semibold text-[#1A1A1A]">
            {projectName}
          </h2>
          <p className="text-sm text-[#6B6B63] mt-0.5">
            {phases.length} phase{phases.length !== 1 ? 's' : ''}
            {totalWeeks ? ` · ${totalWeeks} weeks` : ''}
            {totalInvestment ? ` · ${totalInvestment}` : ''}
          </p>
        </div>
      )}

      {/* Phase blocks */}
      <div className="space-y-3">
        {phases.map((phase, i) => {
          const locked = isLocked(i);
          const progress = computeProgress(i, phase.deliverables.length);
          return (
            <motion.div
              key={phase.phaseNumber}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: i * 0.05 }}
            >
              <PhaseBlock
                phase={phase}
                phaseIndex={i}
                expanded={expandedPhases.has(i)}
                onToggle={() => togglePhase(i)}
                taskStates={taskStates[i] || {}}
                onTaskToggle={(taskIdx) => toggleTask(i, taskIdx)}
                isLocked={locked}
                computedProgress={progress}
              />
              {/* Connector arrow between phases */}
              {i < phases.length - 1 && (
                <div className="flex justify-center py-1">
                  <div className="w-0.5 h-4 bg-[#E8E8E4]" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Quick Wins */}
      {!compact && quickWins && quickWins.length > 0 && (
        <div className="bg-white rounded border border-[#E8E8E4] p-4 sm:p-5">
          <h3 className="font-[Georgia,serif] text-sm sm:text-base font-semibold text-[#1A1A1A] mb-3">
            Quick Wins
          </h3>
          <ul className="space-y-2">
            {quickWins.map((win, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[#6B6B63]">
                <Check className="w-4 h-4 text-[#00875A] shrink-0 mt-0.5" />
                {win}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Risk Factors */}
      {!compact && riskFactors && riskFactors.length > 0 && (
        <div className="bg-white rounded border border-[#E8E8E4] p-4 sm:p-5">
          <h3 className="font-[Georgia,serif] text-sm sm:text-base font-semibold text-[#1A1A1A] mb-3">
            Risk Factors
          </h3>
          <ul className="space-y-2.5">
            {riskFactors.map((rf, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[#1A1A1A]">{rf.risk}</p>
                  <p className="text-xs text-[#6B6B63] mt-0.5">Mitigation: {rf.mitigation}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Success Metrics */}
      {!compact && successMetrics && successMetrics.length > 0 && (
        <div>
          <h3 className="font-[Georgia,serif] text-sm sm:text-base font-semibold text-[#1A1A1A] mb-3">
            Success Metrics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {successMetrics.map((sm, i) => (
              <div key={i} className="bg-white rounded border border-[#E8E8E4] p-4">
                <p className="text-xs text-[#6B6B63] uppercase tracking-wider">{sm.metric}</p>
                <p className="font-mono text-lg font-semibold text-[#00875A] mt-1">{sm.target}</p>
                <p className="text-xs text-[#9CA39B] mt-0.5">{sm.timeframe}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
