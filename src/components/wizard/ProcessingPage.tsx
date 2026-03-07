// C35 — Processing Page: AI Analysis Animation
// Dark #1A1A1A screen with animated agent network diagram,
// 5 thinking states cycling over ~15s, auto-redirect to /wizard/proposal

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useWizard } from './WizardContext';
import { AI_SYSTEMS } from './data/wizardData';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, FileSearch, Scaling, Clock, DollarSign, FileText, Check } from 'lucide-react';

/* ────────── PROCESSING STATES ────────── */

interface ProcessingState {
  id: string;
  agentName: string;
  label: string;
  description: string;
  duration: number;
  progressEnd: number;
  contextMessage: string;
  activeNodes: string[];
}

const PROCESSING_STATES: ProcessingState[] = [
  {
    id: 'requirements',
    agentName: 'Requirements Analyst',
    label: 'Understanding requirements',
    description: 'Parsing your goals and constraints',
    duration: 2500,
    progressEnd: 20,
    contextMessage: 'Analyzing your business context and diagnostic signals...',
    activeNodes: ['orchestrator', 'requirements'],
  },
  {
    id: 'matching',
    agentName: 'Scope Estimator',
    label: 'Matching solution architecture',
    description: 'Comparing with 847 past projects',
    duration: 3000,
    progressEnd: 40,
    contextMessage: 'Finding the best architecture for your systems...',
    activeNodes: ['scope'],
  },
  {
    id: 'calculating',
    agentName: 'Timeline Planner + Pricing Engine',
    label: 'Calculating timeline & costs',
    description: 'Factoring scope, integrations, and complexity',
    duration: 3500,
    progressEnd: 65,
    contextMessage: 'Building phased timeline across 6-10 weeks...',
    activeNodes: ['timeline', 'pricing'],
  },
  {
    id: 'generating',
    agentName: 'Proposal Writer',
    label: 'Generating proposal',
    description: 'Building your custom project plan',
    duration: 3000,
    progressEnd: 85,
    contextMessage: 'Writing deliverables, milestones, and pricing breakdown...',
    activeNodes: ['proposal'],
  },
  {
    id: 'finalizing',
    agentName: 'All Agents',
    label: 'Finalizing recommendations',
    description: 'Adding optimization suggestions',
    duration: 2000,
    progressEnd: 100,
    contextMessage: 'Cross-checking recommendations and adding final touches...',
    activeNodes: ['orchestrator', 'requirements', 'scope', 'timeline', 'pricing', 'proposal'],
  },
];

/* ────────── AGENT NODE DATA ────────── */

interface AgentNode {
  id: string;
  name: string;
  role: string;
  icon: typeof Brain;
  row: number;
  col: number;
}

const AGENT_NODES: AgentNode[] = [
  { id: 'orchestrator', name: 'Orchestrator', role: 'Coordinates', icon: Brain, row: 0, col: 1 },
  { id: 'requirements', name: 'Req. Analyst', role: 'Parsing', icon: FileSearch, row: 1, col: 0 },
  { id: 'scope', name: 'Scope Est.', role: 'Comparing', icon: Scaling, row: 1, col: 1 },
  { id: 'timeline', name: 'Timeline', role: 'Scheduling', icon: Clock, row: 1, col: 2 },
  { id: 'pricing', name: 'Pricing', role: 'Calculating', icon: DollarSign, row: 2, col: 1 },
  { id: 'proposal', name: 'Proposal', role: 'Writing', icon: FileText, row: 3, col: 1 },
];

/* ────────── CONNECTIONS ────────── */

const CONNECTIONS: [string, string][] = [
  ['orchestrator', 'requirements'],
  ['orchestrator', 'scope'],
  ['orchestrator', 'timeline'],
  ['requirements', 'pricing'],
  ['scope', 'pricing'],
  ['timeline', 'pricing'],
  ['pricing', 'proposal'],
];

/* ────────── COMPONENT ────────── */

export default function ProcessingPage() {
  const navigate = useNavigate();
  const { state } = useWizard();
  const { step1, step3 } = state;
  const selectedSystems = AI_SYSTEMS.filter(s => step3.selectedSystems.includes(s.id));

  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);

  // Phase progression timer
  useEffect(() => {
    if (currentPhase >= PROCESSING_STATES.length) return;

    const phase = PROCESSING_STATES[currentPhase];

    // Animate progress
    const startProgress = currentPhase === 0 ? 0 : PROCESSING_STATES[currentPhase - 1].progressEnd;
    const endProgress = phase.progressEnd;
    const steps = 20;
    const stepDuration = phase.duration / steps;
    let step = 0;

    const progressInterval = setInterval(() => {
      step++;
      const t = step / steps;
      setProgress(Math.round(startProgress + (endProgress - startProgress) * t));
      if (step >= steps) clearInterval(progressInterval);
    }, stepDuration);

    // Move to next phase
    const timer = setTimeout(() => {
      setCompletedPhases(prev => [...prev, currentPhase]);
      setCurrentPhase(prev => prev + 1);
    }, phase.duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [currentPhase]);

  // Auto-redirect when complete
  useEffect(() => {
    if (currentPhase >= PROCESSING_STATES.length) {
      const redirectTimer = setTimeout(() => {
        navigate('/wizard/proposal');
      }, 1200);
      return () => clearTimeout(redirectTimer);
    }
  }, [currentPhase, navigate]);

  const activePhase = currentPhase < PROCESSING_STATES.length ? PROCESSING_STATES[currentPhase] : null;
  const activeNodeIds = activePhase?.activeNodes || [];
  const isComplete = currentPhase >= PROCESSING_STATES.length;

  const getNodePosition = useCallback((node: AgentNode) => {
    // Desktop grid layout positions
    const colPositions = [25, 50, 75]; // percentage
    const rowPositions = [15, 40, 62, 82]; // percentage
    return {
      x: colPositions[node.col] ?? 50,
      y: rowPositions[node.row] ?? 50,
    };
  }, []);

  const isNodeActive = (nodeId: string) => activeNodeIds.includes(nodeId);
  const isNodeCompleted = (nodeId: string) => {
    for (let i = 0; i < completedPhases.length; i++) {
      if (PROCESSING_STATES[completedPhases[i]].activeNodes.includes(nodeId)) return true;
    }
    return false;
  };

  // Summary text
  const companyName = step1.companyName || 'Your Company';
  const industryLabel = step1.industry?.replace(/-/g, ' ') || 'your industry';
  const systemCount = selectedSystems.length || 3;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: '#1A1A1A' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <p className="text-xs tracking-[0.25em] uppercase mb-3" style={{ color: '#00875A' }}>
          {isComplete ? 'Analysis Complete' : 'Analyzing Your Project'}
        </p>
        <div className="w-12 h-0.5 mx-auto" style={{ backgroundColor: '#00875A' }} />
      </motion.div>

      {/* Agent Network Diagram */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative w-full max-w-md mx-auto mb-10"
        style={{ height: 280 }}
      >
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
          {CONNECTIONS.map(([fromId, toId]) => {
            const fromNode = AGENT_NODES.find(n => n.id === fromId)!;
            const toNode = AGENT_NODES.find(n => n.id === toId)!;
            const from = getNodePosition(fromNode);
            const to = getNodePosition(toNode);
            const bothActive = (isNodeActive(fromId) || isNodeCompleted(fromId)) &&
                               (isNodeActive(toId) || isNodeCompleted(toId));
            return (
              <line
                key={`${fromId}-${toId}`}
                x1={`${from.x}%`} y1={`${from.y}%`}
                x2={`${to.x}%`} y2={`${to.y}%`}
                stroke={bothActive ? '#00875A' : '#333333'}
                strokeWidth={bothActive ? 2 : 1}
                strokeDasharray={bothActive ? 'none' : '4 4'}
                style={{ transition: 'all 0.5s ease' }}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {AGENT_NODES.map((node) => {
          const pos = getNodePosition(node);
          const active = isNodeActive(node.id);
          const completed = isNodeCompleted(node.id);
          const NodeIcon = node.icon;
          const isOrch = node.id === 'orchestrator';

          return (
            <motion.div
              key={node.id}
              className="absolute flex flex-col items-center"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                scale: active ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Node circle */}
              <div
                className="flex items-center justify-center rounded-full transition-all duration-500"
                style={{
                  width: isOrch ? 52 : 44,
                  height: isOrch ? 52 : 44,
                  backgroundColor: active ? 'rgba(0,135,90,0.15)' : completed ? 'rgba(0,135,90,0.08)' : 'rgba(255,255,255,0.04)',
                  border: `2px solid ${active ? '#00875A' : completed ? '#00875A' : '#333'}`,
                  boxShadow: active ? '0 0 20px rgba(0,135,90,0.3)' : 'none',
                }}
              >
                {completed && !active ? (
                  <Check className="w-5 h-5" style={{ color: '#00875A' }} />
                ) : (
                  <NodeIcon
                    className="w-5 h-5"
                    style={{ color: active ? '#00875A' : completed ? '#00875A' : '#555' }}
                  />
                )}
              </div>
              {/* Label */}
              <span
                className="text-[10px] mt-1.5 text-center whitespace-nowrap transition-colors duration-500"
                style={{ color: active ? '#FFFFFF' : completed ? '#999' : '#555' }}
              >
                {node.name}
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Thinking States */}
      <div className="w-full max-w-sm mx-auto mb-8 space-y-2.5">
        {PROCESSING_STATES.map((ps, i) => {
          const isDone = completedPhases.includes(i);
          const isActive = currentPhase === i;
          const isPending = !isDone && !isActive;

          return (
            <motion.div
              key={ps.id}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              {/* Status indicator */}
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                {isDone ? (
                  <Check className="w-4 h-4" style={{ color: '#00875A' }} />
                ) : isActive ? (
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: '#00875A' }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                ) : (
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#444' }} />
                )}
              </div>

              {/* Label */}
              <span
                className="text-sm transition-colors duration-300"
                style={{
                  color: isDone ? '#00875A' : isActive ? '#FFFFFF' : '#555',
                }}
              >
                {ps.label}{isActive ? '...' : ''}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-sm mx-auto mb-6">
        <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: '#333' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: '#00875A' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-end mt-1.5">
          <span className="text-xs" style={{ color: '#666' }}>{progress}%</span>
        </div>
      </div>

      {/* Context message */}
      <div className="w-full max-w-sm mx-auto mb-10 text-center min-h-[40px]">
        <AnimatePresence mode="wait">
          {activePhase && (
            <motion.p
              key={activePhase.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-sm italic"
              style={{ color: '#888' }}
            >
              "{activePhase.contextMessage}"
            </motion.p>
          )}
          {isComplete && (
            <motion.p
              key="complete"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm"
              style={{ color: '#00875A' }}
            >
              Analysis complete — preparing your proposal...
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Project summary pill */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="px-5 py-2.5 rounded-full border"
        style={{ borderColor: '#333', backgroundColor: 'rgba(255,255,255,0.03)' }}
      >
        <span className="text-xs" style={{ color: '#888' }}>
          {companyName} · {industryLabel} · {systemCount} system{systemCount !== 1 ? 's' : ''}
        </span>
      </motion.div>
    </div>
  );
}
