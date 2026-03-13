// C34 — Step 5: Launch Project & Dashboard Entry
// Single-column centered layout (breaks from three-panel)
// Celebration + confirmation screen with staggered animations
// NOW WIRED: Calls /generate-roadmap for live AI-generated implementation roadmap

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useWizard } from '../WizardContext';
import { AI_SYSTEMS, ROADMAP_PHASES, DASHBOARD_PREVIEW_CARDS, STEPS } from '../data/wizardData';
import { matchAgents, type AssignedAgent } from '../data/agentData';
import { WizardLayout } from '../WizardLayout';
import { motion } from 'motion/react';
import { Check, ArrowRight, Loader2, AlertCircle, RefreshCw, Users } from 'lucide-react';
import { Link } from 'react-router';
import { aiApi, onboardingApi, agentCatalogApi } from '../../../lib/supabase';
import type { OnboardingCompleteResponse } from '../../../lib/supabase';
import { AgentTeamCard, type AgentTeamCardAgent } from '../../shared/agents/AgentTeamCard';

interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  weekRange: string;
  systems: string[];
  deliverables: string[];
  milestones: string[];
  estimatedCost: string;
}

interface AIRoadmap {
  title: string;
  totalWeeks: number;
  totalInvestment: string;
  phases: RoadmapPhase[];
  quickWins: string[];
  riskFactors: { risk: string; mitigation: string }[];
  successMetrics: { metric: string; target: string; timeframe: string }[];
}

const CHECKLIST_BASE = [
  'Project created with all wizard data',
  'Strategy brief attached',
  'Dashboard ready for you',
];

export function StepLaunchProject() {
  const { state, sessionId } = useWizard();
  const { step1, step3 } = state;
  const selectedSystems = AI_SYSTEMS.filter(s => step3.selectedSystems.includes(s.id));
  const projectName = `${step1.companyName || 'Your Company'} — AI Transformation`;

  // ── AI Roadmap State ──
  const [roadmap, setRoadmap] = useState<AIRoadmap | null>(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [roadmapError, setRoadmapError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  // ── Onboarding Agent State ──
  const [onboardingResult, setOnboardingResult] = useState<OnboardingCompleteResponse | null>(null);
  const [onboardingLoading, setOnboardingLoading] = useState(false);
  const [onboardingError, setOnboardingError] = useState<string | null>(null);
  const [onboardingStatus, setOnboardingStatus] = useState<'idle' | 'checking' | 'running' | 'done' | 'error'>('idle');
  const onboardingRef = useRef(false);

  // ── Run onboarding agent after roadmap loads ──
  const runOnboarding = useCallback(async () => {
    if (!sessionId || onboardingRef.current) return;
    onboardingRef.current = true;
    setOnboardingLoading(true);
    setOnboardingStatus('checking');
    setOnboardingError(null);

    try {
      // First check if already onboarded (idempotent)
      const { data: statusData } = await onboardingApi.status(sessionId);
      if (statusData?.onboarded) {
        console.log('[Step5] Session already onboarded, project:', statusData.project?.id);
        setOnboardingResult({
          success: true,
          idempotent: true,
          client: { id: '' },
          project: { id: statusData.project?.id || '', name: statusData.project?.name },
          roadmap: null,
          phases: [],
          activity: null,
          durationMs: 0,
          message: 'Project already exists',
        });
        setOnboardingStatus('done');
        setOnboardingLoading(false);
        return;
      }

      // Run the onboarding agent
      setOnboardingStatus('running');
      const { data, error } = await onboardingApi.complete(sessionId);

      if (error) {
        console.error('[Step5] Onboarding error:', error);
        setOnboardingError(error);
        setOnboardingStatus('error');
      } else if (data) {
        console.log('[Step5] Onboarding complete:', data);
        setOnboardingResult(data);
        setOnboardingStatus('done');
      }
    } catch (e) {
      console.error('[Step5] Onboarding exception:', e);
      setOnboardingError(String(e));
      setOnboardingStatus('error');
    } finally {
      setOnboardingLoading(false);
    }
  }, [sessionId]);

  // Fetch roadmap on mount
  useEffect(() => {
    if (fetchedRef.current) return;
    if (step3.selectedSystems.length === 0) return;
    fetchedRef.current = true;

    async function fetchRoadmap() {
      setRoadmapLoading(true);
      setRoadmapError(null);
      try {
        const { data, error } = await aiApi.generateRoadmap({
          sessionId: sessionId || undefined,
          selectedSystems: step3.selectedSystems,
          industry: step1.industry || undefined,
          companySize: step1.companySize || undefined,
        });
        if (error) {
          console.error('[Step5] Roadmap generation error:', error);
          setRoadmapError(error);
        } else if (data?.roadmap) {
          setRoadmap(data.roadmap as AIRoadmap);
        }
      } catch (e) {
        console.error('[Step5] Roadmap fetch exception:', e);
        setRoadmapError(String(e));
      } finally {
        setRoadmapLoading(false);
      }
    }
    fetchRoadmap();
  }, [sessionId, step1.industry, step1.companySize, step3.selectedSystems]);

  // Trigger onboarding after roadmap finishes (or after a short delay if no roadmap)
  useEffect(() => {
    if (onboardingRef.current) return;
    if (!sessionId) return;

    // Wait for roadmap to finish loading, then run onboarding
    if (!roadmapLoading) {
      // Small delay to ensure wizard_answers for step 5 are saved
      const timer = setTimeout(() => {
        runOnboarding();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [roadmapLoading, sessionId, runOnboarding]);

  const retryRoadmap = useCallback(async () => {
    fetchedRef.current = false;
    setRoadmapLoading(true);
    setRoadmapError(null);
    try {
      const { data, error } = await aiApi.generateRoadmap({
        sessionId: sessionId || undefined,
        selectedSystems: step3.selectedSystems,
        industry: step1.industry || undefined,
        companySize: step1.companySize || undefined,
      });
      if (error) {
        setRoadmapError(error);
      } else if (data?.roadmap) {
        setRoadmap(data.roadmap as AIRoadmap);
      }
    } catch (e) {
      setRoadmapError(String(e));
    } finally {
      setRoadmapLoading(false);
    }
  }, [sessionId, step1, step3.selectedSystems]);

  const retryOnboarding = useCallback(() => {
    onboardingRef.current = false;
    setOnboardingError(null);
    setOnboardingStatus('idle');
    runOnboarding();
  }, [runOnboarding]);

  // Use AI roadmap phases or fallback to static
  const displayPhases = roadmap?.phases?.length
    ? roadmap.phases.map(p => ({
        number: p.phaseNumber,
        title: p.title,
        weeks: p.weekRange,
        outcomes: p.deliverables.slice(0, 3),
      }))
    : ROADMAP_PHASES;

  const checklist = [
    ...CHECKLIST_BASE,
    `Roadmap with ${displayPhases.length} phases set`,
    roadmap ? `${roadmap.quickWins?.length || 0} quick wins identified` : '12 initial tasks generated',
  ];

  // Match agents to the project (local fallback)
  const agentTeam = useMemo(() => {
    if (step3.selectedSystems.length === 0) return [];
    return matchAgents(step3.selectedSystems, step1.industry || '', step1.companyName || '');
  }, [step3.selectedSystems, step1.industry, step1.companyName]);

  // ── AI-Powered Agent Matching (from POST /agents/match) ──
  const [aiTeam, setAiTeam] = useState<AgentTeamCardAgent[]>([]);
  const [aiTeamLoading, setAiTeamLoading] = useState(false);
  const aiTeamRef = useRef(false);

  useEffect(() => {
    if (aiTeamRef.current || step3.selectedSystems.length === 0) return;
    aiTeamRef.current = true;

    async function fetchAiTeam() {
      setAiTeamLoading(true);
      try {
        const { data, error } = await agentCatalogApi.match({
          industry: step1.industry || '',
          goals: step1.goal ? [step1.goal] : [],
          companySize: step1.companySize || '',
          systemIds: step3.selectedSystems,
        });
        if (!error && data?.matches) {
          setAiTeam(data.matches.map(m => ({
            slug: m.slug,
            name: m.name,
            emoji: m.emoji || '🤖',
            division: m.division || '',
            role: m.role || '',
            firstTask: m.firstTask || m.reason || '',
            fitScore: m.fitScore,
            reason: m.reason,
          })));
        }
      } catch (e) {
        console.warn('[Step5] AI team match failed (using local):', e);
      } finally {
        setAiTeamLoading(false);
      }
    }
    fetchAiTeam();
  }, [step1.industry, step1.goal, step1.companySize, step3.selectedSystems]);

  // Display team: AI-matched if available, else local
  const displayTeam: AgentTeamCardAgent[] = useMemo(() => {
    if (aiTeam.length > 0) return aiTeam;
    return agentTeam.map(a => ({
      slug: a.id, name: a.name, emoji: '🤖',
      division: a.division, role: a.role, firstTask: a.task,
    }));
  }, [aiTeam, agentTeam]);

  return (
    <WizardLayout>
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-10 sm:py-16">

        {/* ═══ COMPLETION HEADER ═══ */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Step indicators - all complete */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {STEPS.map((step, idx) => (
              <div key={step.number} className="flex items-center gap-2">
                <motion.div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#00875A' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 + idx * 0.08, type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
                {idx < STEPS.length - 1 && (
                  <div className="w-6 sm:w-10 h-px" style={{ backgroundColor: '#00875A' }} />
                )}
              </div>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl mb-3" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A', fontWeight: 400 }}>
            Your project is ready
          </h1>
          <p className="text-base sm:text-lg max-w-xl mx-auto" style={{ color: '#6B6B63' }}>
            Everything from your discovery session has been turned into an actionable project.
          </p>
          <div className="mx-auto mt-4 h-0.5 w-20" style={{ backgroundColor: '#00875A' }} />
        </motion.div>

        {/* ═══ PROJECT SUMMARY CARD ═══ */}
        <motion.div
          className="max-w-[800px] mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div
            className="border rounded p-6 sm:p-10 space-y-6"
            style={{
              backgroundColor: '#FFFFFF', borderColor: '#E8E8E4', borderRadius: '4px',
              borderLeft: '4px solid #00875A',
            }}
          >
            {/* Project header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#00875A', letterSpacing: '0.1em' }}>
                  Project
                </p>
                <h2 className="text-xl sm:text-2xl" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A', fontWeight: 400 }}>
                  {roadmap?.title || projectName}
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded self-start" style={{ backgroundColor: '#E6F4ED', color: '#00875A', borderRadius: '2px' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#00875A' }} />
                Active
              </span>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {[
                ['Client', step1.companyName || '—'],
                ['Industry', step1.industry?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || '—'],
                ['Phase', `Phase 1 — ${displayPhases[0]?.title || 'Foundation'}`],
                ['Timeline', roadmap ? `${roadmap.totalWeeks} weeks` : '12 weeks'],
                ['Systems', `${selectedSystems.length} selected`],
                ['Investment', roadmap?.totalInvestment || 'Contact for quote'],
                ['Brief', '✓ Approved'],
                ['Dashboard', '✓ Ready'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b text-sm" style={{ borderColor: '#F0F0EC' }}>
                  <span style={{ color: '#9CA39B' }}>{label}</span>
                  <span style={{ color: '#1A1A1A' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t" style={{ borderColor: '#F0F0EC' }} />

            {/* Roadmap Preview */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs tracking-widest uppercase" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
                  {roadmap ? 'AI-Generated Roadmap' : 'Roadmap Preview'}
                </p>
                {roadmapLoading && (
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: '#9CA39B' }}>
                    <Loader2 className="w-3 h-3 animate-spin" /> Generating…
                  </span>
                )}
              </div>

              {roadmapError && !roadmapLoading && (
                <div className="mb-4 flex items-start gap-2 px-3 py-2.5 border rounded" style={{ borderColor: '#E8E8E4', borderRadius: '4px', backgroundColor: '#FAFAF8' }}>
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#D97706' }} />
                  <div className="flex-1">
                    <p className="text-xs" style={{ color: '#6B6B63' }}>
                      AI roadmap unavailable — showing default phases.
                    </p>
                  </div>
                  <button
                    onClick={retryRoadmap}
                    className="flex items-center gap-1 text-xs px-2 py-1 border rounded transition-colors hover:bg-gray-50"
                    style={{ borderColor: '#E8E8E4', borderRadius: '4px', color: '#00875A' }}
                  >
                    <RefreshCw className="w-3 h-3" /> Retry
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                {displayPhases.slice(0, 3).map((phase, idx) => (
                  <div key={phase.number} className="flex-1 flex items-stretch">
                    <motion.div
                      className="flex-1 border rounded p-4"
                      style={{
                        borderColor: idx === 0 ? '#00875A' : '#E8E8E4',
                        borderWidth: idx === 0 ? '2px' : '1px',
                        borderRadius: '4px',
                      }}
                      animate={idx === 0 ? {
                        boxShadow: [
                          '0 0 0 0 rgba(0, 135, 90, 0)',
                          '0 0 12px 2px rgba(0, 135, 90, 0.12)',
                          '0 0 0 0 rgba(0, 135, 90, 0)',
                        ],
                      } : undefined}
                      transition={idx === 0 ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } : undefined}
                    >
                      <p className="text-xs tracking-widest uppercase" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
                        Phase {phase.number}
                      </p>
                      <p className="text-sm mt-1" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
                        {phase.title}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#9CA39B' }}>{phase.weeks}</p>
                      {phase.outcomes && phase.outcomes.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {phase.outcomes.slice(0, 3).map(o => (
                            <li key={o} className="text-xs flex items-center gap-1" style={{ color: '#6B6B63' }}>
                              <span style={{ color: '#00875A' }}>&#8226;</span> {o}
                            </li>
                          ))}
                        </ul>
                      )}
                      {idx === 0 && (
                        <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#E6F4ED', color: '#00875A', borderRadius: '2px' }}>
                          Current
                        </span>
                      )}
                    </motion.div>
                    {idx < Math.min(displayPhases.length, 3) - 1 && (
                      <div className="hidden sm:flex items-center px-1">
                        <ArrowRight className="w-4 h-4" style={{ color: '#E8E8E4' }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Wins (from AI) */}
            {roadmap?.quickWins && roadmap.quickWins.length > 0 && (
              <>
                <div className="border-t" style={{ borderColor: '#F0F0EC' }} />
                <div>
                  <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
                    Quick Wins
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {roadmap.quickWins.map((win, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm" style={{ color: '#1A1A1A' }}>
                        <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#00875A' }} />
                        <span>{win}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Success Metrics (from AI) */}
            {roadmap?.successMetrics && roadmap.successMetrics.length > 0 && (
              <>
                <div className="border-t" style={{ borderColor: '#F0F0EC' }} />
                <div>
                  <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
                    Success Metrics
                  </p>
                  <div className="space-y-2">
                    {roadmap.successMetrics.map((m, i) => (
                      <div key={i} className="flex justify-between items-center py-1.5 border-b text-sm" style={{ borderColor: '#F0F0EC' }}>
                        <span style={{ color: '#1A1A1A' }}>{m.metric}</span>
                        <div className="text-right">
                          <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#E6F4ED', color: '#00875A', borderRadius: '2px' }}>
                            {m.target}
                          </span>
                          <span className="text-xs ml-2" style={{ color: '#9CA39B' }}>{m.timeframe}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Divider */}
            <div className="border-t" style={{ borderColor: '#F0F0EC' }} />

            {/* Creation Checklist */}
            <div>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
                What's been created
              </p>
              <div className="space-y-2">
                {checklist.map((item, idx) => (
                  <motion.div
                    key={item}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + idx * 0.1, duration: 0.3, ease: 'easeOut' }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + idx * 0.1, type: 'spring', stiffness: 400, damping: 12 }}
                    >
                      <Check className="w-4 h-4" style={{ color: '#00875A' }} />
                    </motion.div>
                    <span className="text-sm" style={{ color: '#1A1A1A' }}>{item}</span>
                  </motion.div>
                ))}
              </div>

              {/* Onboarding Agent Status */}
              <motion.div
                className="mt-4 pt-4 border-t"
                style={{ borderColor: '#F0F0EC' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                {onboardingStatus === 'idle' && (
                  <div className="flex items-center gap-2 text-xs" style={{ color: '#9CA39B' }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#E8E8E4' }} />
                    Preparing to save project to database…
                  </div>
                )}
                {(onboardingStatus === 'checking' || onboardingStatus === 'running') && (
                  <div className="flex items-center gap-2 text-xs" style={{ color: '#00875A' }}>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {onboardingStatus === 'checking' ? 'Checking existing records…' : 'Creating project records…'}
                  </div>
                )}
                {onboardingStatus === 'done' && onboardingResult && (
                  <div className="flex items-center gap-2 text-xs" style={{ color: '#00875A' }}>
                    <Check className="w-3.5 h-3.5" />
                    <span>
                      {onboardingResult.idempotent
                        ? 'Project already saved to database'
                        : `Project saved — ${onboardingResult.summary?.phaseCount || 0} phases, client record created`}
                      {onboardingResult.durationMs > 0 && (
                        <span style={{ color: '#9CA39B' }}> ({onboardingResult.durationMs}ms)</span>
                      )}
                    </span>
                  </div>
                )}
                {onboardingStatus === 'error' && (
                  <div className="flex items-center gap-2 text-xs">
                    <AlertCircle className="w-3.5 h-3.5" style={{ color: '#D97706' }} />
                    <span style={{ color: '#6B6B63' }}>
                      Could not save to database — your data is safe locally.
                    </span>
                    <button
                      onClick={retryOnboarding}
                      className="flex items-center gap-1 text-xs px-2 py-0.5 border rounded transition-colors hover:bg-gray-50"
                      style={{ borderColor: '#E8E8E4', borderRadius: '4px', color: '#00875A' }}
                    >
                      <RefreshCw className="w-3 h-3" /> Retry
                    </button>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Assigned Agents */}
            {displayTeam.length > 0 && (
              <>
                <div className="border-t" style={{ borderColor: '#F0F0EC' }} />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4" style={{ color: '#00875A' }} />
                    <p className="text-xs tracking-widest uppercase" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
                      Your AI Team is Ready
                    </p>
                  </div>
                  {aiTeamLoading && (
                    <div className="flex items-center gap-2 px-4 py-3 mb-3 border rounded" style={{ borderColor: '#E8E8E4', borderRadius: '4px', backgroundColor: '#FAFAF8' }}>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: '#00875A' }} />
                      <span className="text-xs" style={{ color: '#6B6B63' }}>Matching agents to your project…</span>
                    </div>
                  )}
                  <div className="space-y-2.5">
                    {displayTeam.map((agent, idx) => (
                      <AgentTeamCard
                        key={agent.slug}
                        agent={agent}
                        status="active"
                        delay={1.0 + idx * 0.06}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* ═══ CTA ═══ */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm rounded transition-all"
            style={{
              backgroundColor: '#1A1A1A',
              color: '#FFFFFF',
              borderRadius: '4px',
              minWidth: '280px',
              justifyContent: 'center',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#00875A';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,135,90,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#1A1A1A';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Enter Your Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-sm mt-3" style={{ color: '#9CA39B' }}>
            You can return to this wizard anytime from your dashboard settings.
          </p>
        </motion.div>

        {/* ═══ DASHBOARD PREVIEW ═══ */}
        <motion.div
          className="max-w-[1000px] mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          <h3 className="text-xl text-center mb-6" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A', fontWeight: 400 }}>
            What you'll find in your dashboard
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {DASHBOARD_PREVIEW_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  className="border rounded p-5 text-center transition-all cursor-default"
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E8E4', borderRadius: '4px' }}
                  whileHover={{ y: -2, boxShadow: '0 2px 8px rgba(26,26,26,0.06)' }}
                >
                  <Icon className="w-8 h-8 mx-auto mb-3" style={{ color: '#00875A' }} />
                  <p className="text-sm mb-1" style={{ color: '#1A1A1A' }}>{card.title}</p>
                  <p className="text-xs" style={{ color: '#9CA39B' }}>{card.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </WizardLayout>
  );
}