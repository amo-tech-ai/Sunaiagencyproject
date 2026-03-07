// C34 — Step 5: Launch Project & Dashboard Entry
// Single-column centered layout (breaks from three-panel)
// Celebration + confirmation screen with staggered animations

import { useState, useEffect } from 'react';
import { useWizard } from '../WizardContext';
import { AI_SYSTEMS, ROADMAP_PHASES, DASHBOARD_PREVIEW_CARDS, STEPS } from '../data/wizardData';
import { WizardLayout } from '../WizardLayout';
import { motion } from 'motion/react';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { aiApi } from '../../../lib/supabase';

const CHECKLIST = [
  'Project created with all wizard data',
  'Roadmap with 3 phases set',
  '12 initial tasks generated',
  'Strategy brief attached',
  'Dashboard ready for you',
];

export function StepLaunchProject() {
  const { state, sessionId } = useWizard();
  const { step1, step3 } = state;
  const selectedSystems = AI_SYSTEMS.filter(s => step3.selectedSystems.includes(s.id));
  const projectName = `${step1.companyName || 'Your Company'} — AI Transformation`;

  // AI-generated roadmap
  const [aiRoadmap, setAiRoadmap] = useState<{
    phases?: { number: number; title: string; weeks: string }[];
    totalWeeks?: number;
    quickWins?: string[];
  } | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;

    aiApi.generateRoadmap({
      sessionId,
      selectedSystems: step3.selectedSystems,
      industry: step1.industry || undefined,
      companySize: step1.companySize || undefined,
    }).then(({ data, error }) => {
      if (cancelled) return;
      if (data?.roadmap && !error) {
        setAiRoadmap(data.roadmap);
      }
    }).catch((e) => {
      console.warn('[StepLaunchProject] AI roadmap failed, using static:', e);
    });

    return () => { cancelled = true; };
  }, [sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const displayPhases = aiRoadmap?.phases || ROADMAP_PHASES;
  const displayTimeline = aiRoadmap?.totalWeeks ? `${aiRoadmap.totalWeeks} weeks` : '12 weeks';

  // This renders inside WizardLayout which handles the single-column for step 5
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
                  {projectName}
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
                ['Phase', 'Phase 1 — Foundation'],
                ['Timeline', displayTimeline],
                ['Systems', `${selectedSystems.length} selected`],
                ['Tasks', '12 initial tasks generated'],
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
              <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
                Roadmap Preview
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                {displayPhases.map((phase, idx) => (
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
                      {idx === 0 && (
                        <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#E6F4ED', color: '#00875A', borderRadius: '2px' }}>
                          Current
                        </span>
                      )}
                    </motion.div>
                    {idx < displayPhases.length - 1 && (
                      <div className="hidden sm:flex items-center px-1">
                        <ArrowRight className="w-4 h-4" style={{ color: '#E8E8E4' }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t" style={{ borderColor: '#F0F0EC' }} />

            {/* Creation Checklist */}
            <div>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
                What's been created
              </p>
              <div className="space-y-2">
                {CHECKLIST.map((item, idx) => (
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
              {aiRoadmap?.quickWins && aiRoadmap.quickWins.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
                    Quick Wins
                  </p>
                  <div className="space-y-1.5">
                    {aiRoadmap.quickWins.map((win, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm" style={{ color: '#1A1A1A' }}>
                        <span style={{ color: '#00875A' }}>&#8226;</span> {win}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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