// C14-T20 — Analysis Progress Sheet
// Modal overlay showing simulated 5-agent progress during "Run Analysis"
// Phase A: 3 agents parallel → Phase B: 2 agents parallel
// Simulates progress on frontend since API returns single response

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, XCircle, Loader2, Circle, Sparkles } from 'lucide-react';
import type { StrategyAnalysisResponse } from '../../../lib/types/strategy';

interface AgentState {
  name: string;
  phase: 'A' | 'B';
  status: 'waiting' | 'running' | 'success' | 'error';
  description: string;
  elapsed: number;   // ms
  tokens: number;
  summary: string;
}

const INITIAL_AGENTS: AgentState[] = [
  { name: 'Strategy Synthesizer', phase: 'A', status: 'waiting', description: '', elapsed: 0, tokens: 0, summary: '' },
  { name: 'Opportunity Detector', phase: 'A', status: 'waiting', description: '', elapsed: 0, tokens: 0, summary: '' },
  { name: 'Metrics Interpreter', phase: 'A', status: 'waiting', description: '', elapsed: 0, tokens: 0, summary: '' },
  { name: 'Roadmap Planner', phase: 'B', status: 'waiting', description: '', elapsed: 0, tokens: 0, summary: '' },
  { name: 'System Recommender', phase: 'B', status: 'waiting', description: '', elapsed: 0, tokens: 0, summary: '' },
];

const RUNNING_DESCRIPTIONS = [
  ['Analyzing business model...', 'Mapping value propositions...', 'Evaluating strategic fit...'],
  ['Scanning for automation gaps...', 'Evaluating process areas...', 'Calculating ROI potential...'],
  ['Interpreting key metrics...', 'Analyzing performance data...', 'Generating metric insights...'],
  ['Reviewing execution phases...', 'Optimizing timeline...', 'Finalizing roadmap updates...'],
  ['Evaluating system options...', 'Matching capabilities...', 'Generating recommendations...'],
];

interface AnalysisProgressSheetProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
  result: StrategyAnalysisResponse | null;
  isRunning: boolean;
}

export default function AnalysisProgressSheet({
  open,
  onClose,
  onComplete,
  result,
  isRunning,
}: AnalysisProgressSheetProps) {
  const [agents, setAgents] = useState<AgentState[]>(INITIAL_AGENTS.map(a => ({ ...a })));
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(Date.now());

  // Reset on open
  useEffect(() => {
    if (open && isRunning) {
      setAgents(INITIAL_AGENTS.map(a => ({ ...a })));
      setProgress(0);
      startTimeRef.current = Date.now();
    }
  }, [open, isRunning]);

  // Simulate progress while API is running
  useEffect(() => {
    if (!open || !isRunning || result) return;

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;

      setAgents(prev => prev.map((agent, idx) => {
        const copy = { ...agent };

        if (agent.phase === 'A') {
          // Phase A: start immediately, complete at staggered times
          const completionTime = 2000 + idx * 800; // 2s, 2.8s, 3.6s
          if (elapsed < 200) {
            // waiting briefly
          } else if (elapsed < completionTime) {
            copy.status = 'running';
            const descIdx = Math.floor((elapsed / 1500) % RUNNING_DESCRIPTIONS[idx].length);
            copy.description = RUNNING_DESCRIPTIONS[idx][descIdx];
            copy.elapsed = elapsed;
          } else {
            copy.status = 'success';
            copy.elapsed = completionTime;
          }
        } else {
          // Phase B: start after all Phase A complete (~4s), complete at staggered times
          const phaseADone = 4000;
          const completionTime = phaseADone + 1500 + (idx - 3) * 1000;
          if (elapsed < phaseADone) {
            copy.status = 'waiting';
          } else if (elapsed < completionTime) {
            copy.status = 'running';
            const descIdx = Math.floor(((elapsed - phaseADone) / 1200) % RUNNING_DESCRIPTIONS[idx].length);
            copy.description = RUNNING_DESCRIPTIONS[idx][descIdx];
            copy.elapsed = elapsed - phaseADone;
          } else {
            copy.status = 'success';
            copy.elapsed = completionTime - phaseADone;
          }
        }
        return copy;
      }));

      // Progress = completed agents / total
      setProgress(prev => {
        const completedCount = elapsed < 2000 ? 0 : elapsed < 2800 ? 1 : elapsed < 3600 ? 2 : elapsed < 4000 ? 3 : elapsed < 5500 ? 3 : elapsed < 6500 ? 4 : 5;
        return Math.min(95, (completedCount / 5) * 100);
      });
    }, 200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [open, isRunning, result]);

  // When result arrives, snap to final state
  useEffect(() => {
    if (!result) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const agentResults = result.agentResults || [];

    setAgents(prev => prev.map((agent, idx) => {
      const ar = agentResults[idx] || agentResults.find(r => r.agent.includes(agent.name.toLowerCase().split(' ')[0]));
      return {
        ...agent,
        status: ar?.success !== false ? 'success' : 'error',
        elapsed: ar?.duration_ms || agent.elapsed,
        tokens: ar?.tokens_used || 0,
        summary: ar?.summary || (ar?.success !== false
          ? `Completed successfully`
          : ar?.error || 'Failed'),
        description: '',
      };
    }));

    setProgress(100);
  }, [result]);

  const isComplete = !!result;
  const hasErrors = result?.agentResults?.some(r => !r.success) || false;
  const errorCount = result?.agentResults?.filter(r => !r.success).length || 0;

  const resultSummary = result ? {
    insights: result.insights?.length || 0,
    opportunities: result.opportunities?.length || 0,
    recommendations: result.recommendations?.length || 0,
    healthScore: result.metrics?.healthScore || 0,
  } : null;

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={isComplete ? onClose : undefined}
          >
            {/* Sheet */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-xl max-w-[500px] w-full p-6 relative max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Close button — only when complete */}
              {isComplete && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Header */}
              <div className="mb-5">
                {isComplete ? (
                  <h2 className={`text-lg font-semibold flex items-center gap-2 ${hasErrors ? 'text-amber-600' : 'text-[#00875A]'}`}>
                    <CheckCircle2 className="w-5 h-5" />
                    Analysis Complete {hasErrors ? `(${errorCount} error${errorCount > 1 ? 's' : ''})` : ''}
                  </h2>
                ) : (
                  <h2 className="text-lg font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <Loader2 className="w-5 h-5 text-[#00875A] animate-spin" />
                    Running Strategy Analysis
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-gray-400"
                    >...</motion.span>
                  </h2>
                )}
              </div>

              {/* Agent Rows */}
              <div className="space-y-2 mb-4">
                {agents.map((agent, idx) => (
                  <AgentRow key={agent.name} agent={agent} />
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full h-3 bg-[#E8E8E4] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#00875A] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-sm font-medium text-[#1A1A1A] mt-2 text-center">
                  {Math.round(progress)}%
                </p>
              </div>

              {/* Completion Summary */}
              {isComplete && resultSummary && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-[#F5F5F0] rounded-lg"
                >
                  <p className="text-sm text-[#1A1A1A] mb-3">
                    <span className="font-medium">Results:</span>{' '}
                    {resultSummary.recommendations} recommendation{resultSummary.recommendations !== 1 ? 's' : ''} · {' '}
                    {resultSummary.insights} insight{resultSummary.insights !== 1 ? 's' : ''} · {' '}
                    {resultSummary.opportunities} opportunit{resultSummary.opportunities !== 1 ? 'ies' : 'y'} · {' '}
                    Health: {resultSummary.healthScore}
                  </p>
                  <button
                    onClick={() => { onClose(); onComplete(); }}
                    className="w-full py-2.5 bg-[#00875A] text-white rounded-lg text-sm font-medium hover:bg-[#006644] transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    View Results
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Agent Row ──
function AgentRow({ agent }: { agent: AgentState }) {
  const formatTime = (ms: number) => ms > 0 ? `${(ms / 1000).toFixed(1)}s` : '';

  const statusConfig = {
    waiting: {
      icon: <Circle className="w-4 h-4 text-[#9CA39B]" />,
      bg: 'bg-[#F5F5F0]',
      border: '',
      nameColor: 'text-[#9CA39B]',
      statusLabel: 'waiting',
      statusColor: 'text-[#9CA39B]',
    },
    running: {
      icon: <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />,
      bg: 'bg-blue-500/5',
      border: 'border-l-4 border-l-blue-500',
      nameColor: 'text-[#1A1A1A] font-medium',
      statusLabel: '',
      statusColor: 'text-blue-500',
    },
    success: {
      icon: <CheckCircle2 className="w-4 h-4 text-[#00875A]" />,
      bg: 'bg-[#00875A]/5',
      border: 'border-l-4 border-l-[#00875A]',
      nameColor: 'text-[#1A1A1A] font-medium',
      statusLabel: '',
      statusColor: 'text-[#9CA39B]',
    },
    error: {
      icon: <XCircle className="w-4 h-4 text-red-600" />,
      bg: 'bg-red-600/5',
      border: 'border-l-4 border-l-red-600',
      nameColor: 'text-[#1A1A1A] font-medium',
      statusLabel: 'error',
      statusColor: 'text-red-600',
    },
  };

  const config = statusConfig[agent.status];

  return (
    <motion.div
      layout
      className={`rounded-lg p-3 ${config.bg} ${config.border} transition-colors duration-300`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {config.icon}
          <span className={`text-sm ${config.nameColor}`}>{agent.name}</span>
        </div>
        <div className={`text-xs ${config.statusColor}`}>
          {agent.status === 'waiting' && 'waiting'}
          {agent.status === 'running' && (formatTime(agent.elapsed) || '...')}
          {agent.status === 'success' && (
            <span>{formatTime(agent.elapsed)} {agent.tokens > 0 && `${agent.tokens}tk`}</span>
          )}
          {agent.status === 'error' && 'error'}
        </div>
      </div>
      {(agent.description || agent.summary) && (
        <p className={`text-xs mt-1 ml-6 ${
          agent.status === 'success' ? 'text-[#00875A]' :
          agent.status === 'error' ? 'text-red-600' :
          'text-[#4A4A4A]'
        }`}>
          {agent.summary || agent.description}
        </p>
      )}
    </motion.div>
  );
}
