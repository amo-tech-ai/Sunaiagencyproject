// C31 — Step 2: Industry Diagnostics
// 4 universal + 4 industry-specific questions with signal detection
// ARIA: role="radiogroup", role="group", aria-checked, aria-live
// Mobile: collapsible "Why this matters" per question (right panel hidden on mobile)

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWizard } from '../WizardContext';
import { WizardLayout } from '../WizardLayout';
import {
  UNIVERSAL_QUESTIONS, getIndustryQuestions,
  UNIVERSAL_SIGNAL_RULES, getIndustrySignalRules,
  type DiagnosticQuestion, type Signal
} from '../data/wizardData';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { aiApi } from '../../../lib/supabase';

export function StepIndustryDiagnostics() {
  const { state, updateStep2, setSignals, attemptedAdvance, currentErrors, sessionId } = useWizard();
  const industryId = state.step1.industry || 'other';
  const industryLabel = industryId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const questions = useMemo(() => [
    ...UNIVERSAL_QUESTIONS,
    ...getIndustryQuestions(industryId),
  ], [industryId]);

  const answeredCount = Object.keys(state.step2.answers).length;
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSignals, setAiSignals] = useState<Signal[]>([]);
  const aiReady = answeredCount >= 6;

  useEffect(() => {
    if (!aiReady || aiSignals.length > 0) return; // Only call once

    let cancelled = false;
    setAiLoading(true);

    aiApi.industryDiagnostics({
      industryId,
      companyProfile: {
        name: state.step1.companyName,
        url: state.step1.websiteUrl,
        size: state.step1.companySize,
        goal: state.step1.goal,
      },
      sessionId: sessionId || undefined,
    }).then(({ data, error }) => {
      if (cancelled) return;
      if (data?.signals && !error) {
        setAiSignals(data.signals);
      }
    }).catch((e) => {
      console.warn('[StepIndustryDiagnostics] AI diagnostics failed, using local signals:', e);
    }).finally(() => {
      if (!cancelled) setAiLoading(false);
    });

    return () => { cancelled = true; };
  }, [aiReady, industryId, sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Signal detection
  const detectSignals = useCallback(() => {
    const industryRules = getIndustrySignalRules(industryId);
    const rules = [...UNIVERSAL_SIGNAL_RULES, ...industryRules];

    const detected: Signal[] = [];
    for (const rule of rules) {
      const answer = state.step2.answers[rule.question];
      if (answer && rule.condition(answer)) {
        if (!detected.find(s => s.id === rule.signal.id)) {
          detected.push(rule.signal);
        }
      }
    }
    return detected;
  }, [state.step2.answers, industryId]);

  useEffect(() => {
    const localSignals = detectSignals();
    // Merge: AI signals first (richer), then local signals not already covered
    const merged = [...aiSignals];
    for (const local of localSignals) {
      if (!merged.find(s => s.id === local.id)) {
        merged.push(local);
      }
    }
    setSignals(merged);
  }, [detectSignals, setSignals, aiSignals]);

  // Active question for right panel context
  const activeQ = questions.find(q => !state.step2.answers[q.id]) || questions[questions.length - 1];

  const rightPanel = (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
          Why this matters
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={activeQ.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm leading-relaxed"
            style={{ color: '#6B6B63' }}
          >
            {activeQ.whyItMatters}
          </motion.p>
        </AnimatePresence>
      </div>

      {aiLoading && (
        <div className="flex items-center gap-2 px-3 py-2 rounded" style={{ backgroundColor: '#F0FAF5', borderRadius: '4px' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
            <Sparkles className="w-3 h-3" style={{ color: '#00875A' }} />
          </motion.div>
          <span className="text-xs" style={{ color: '#00875A' }}>AI analyzing your responses...</span>
        </div>
      )}

      {/* Live signal feed */}
      {state.diagnosticSignals.length > 0 && (
        <div className="border-t pt-4" style={{ borderColor: '#F0F0EC' }}>
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
            Signals Detected
          </p>
          <div className="space-y-2" aria-live="polite" aria-atomic="false">
            {state.diagnosticSignals.map(sig => (
              <motion.div
                key={sig.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-2 border rounded text-xs"
                style={{ borderColor: '#E8E8E4', borderRadius: '4px', borderLeft: `3px solid ${sig.severity === 'high' ? '#DC2626' : '#D97706'}` }}
              >
                <span style={{ color: '#1A1A1A' }}>{sig.label}</span>
                <br />
                <span style={{ color: '#9CA39B' }}>{sig.recommendation}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <WizardLayout rightPanel={rightPanel}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
            Industry Diagnostics
          </p>
          <h1 className="text-2xl mb-2" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A', fontWeight: 400 }}>
            Let's diagnose your opportunities
          </h1>
          <p className="text-sm mb-4" style={{ color: '#6B6B63' }}>
            These questions are tailored to <strong style={{ color: '#1A1A1A' }}>{industryLabel}</strong>.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs" style={{ backgroundColor: '#E6F4ED', color: '#00875A', borderRadius: '4px' }}>
            {industryLabel}
          </div>
        </div>

        {/* Separator */}
        <div className="border-t" style={{ borderColor: '#F0F0EC' }} />

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={idx}
              answer={state.step2.answers[q.id]}
              onAnswer={(val) => updateStep2(q.id, val)}
              isIndustrySpecific={idx >= 4}
            />
          ))}
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs" style={{ color: '#6B6B63' }}>
            {answeredCount} of {questions.length} answered
          </span>
          <div className="h-1 flex-1 mx-4 rounded-full overflow-hidden" style={{ backgroundColor: '#E8E8E4' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: '#00875A' }}
              animate={{ width: `${(answeredCount / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Validation error message */}
        <AnimatePresence>
          {attemptedAdvance && currentErrors._global && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div
                className="flex items-center gap-2 px-4 py-3 rounded"
                style={{ backgroundColor: '#FEF2F2', borderRadius: '4px' }}
                role="alert"
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: '#DC2626' }} />
                <span className="text-sm" style={{ color: '#DC2626' }}>
                  {currentErrors._global}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </WizardLayout>
  );
}

/* ────── Question Card ────── */

function QuestionCard({ question, index, answer, onAnswer, isIndustrySpecific }: {
  question: DiagnosticQuestion;
  index: number;
  answer: string | string[] | undefined;
  onAnswer: (val: string | string[]) => void;
  isIndustrySpecific: boolean;
}) {
  const [showWhyMobile, setShowWhyMobile] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border rounded p-5 space-y-4"
      style={{ backgroundColor: '#FFFFFF', borderColor: answer ? '#00875A' : '#E8E8E4', borderRadius: '4px', borderWidth: answer ? '1.5px' : '1px' }}
    >
      {isIndustrySpecific && index === 4 && (
        <p className="text-xs tracking-widest uppercase" style={{ color: '#D97706', letterSpacing: '0.08em' }}>
          Industry-Specific
        </p>
      )}

      <div className="flex items-start gap-3">
        <span className="text-xs px-2 py-0.5 rounded shrink-0" style={{ backgroundColor: '#E6F4ED', color: '#00875A', borderRadius: '2px' }}>
          Q{index + 1}
        </span>
        <h3 className="text-sm" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
          {question.question}
        </h3>
      </div>

      {/* Answer inputs */}
      {question.type === 'multi-select' && (
        <MultiSelectPills
          options={question.options}
          selected={Array.isArray(answer) ? answer : []}
          onChange={onAnswer}
          questionId={question.id}
        />
      )}
      {question.type === 'single-select-cards' && (
        <SingleSelectCards
          options={question.options}
          selected={typeof answer === 'string' ? answer : ''}
          onChange={(v) => onAnswer(v)}
          questionId={question.id}
        />
      )}
      {question.type === 'single-select-radio' && (
        <SingleSelectRadio
          options={question.options}
          selected={typeof answer === 'string' ? answer : ''}
          onChange={(v) => onAnswer(v)}
          questionId={question.id}
        />
      )}
      {question.type === 'three-button' && (
        <ThreeButton
          options={question.options}
          selected={typeof answer === 'string' ? answer : ''}
          onChange={(v) => onAnswer(v)}
          questionId={question.id}
        />
      )}

      {/* Mobile "Why this matters" collapsible — only visible below xl (right panel hidden) */}
      <div className="xl:hidden">
        <button
          onClick={() => setShowWhyMobile(prev => !prev)}
          className="flex items-center gap-1.5 text-xs transition-colors"
          style={{ color: '#00875A' }}
          aria-expanded={showWhyMobile}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Why this matters</span>
          <motion.div
            animate={{ rotate: showWhyMobile ? 180 : 0 }}
            transition={{ duration: 0.15 }}
          >
            <ChevronDown className="w-3 h-3" />
          </motion.div>
        </button>
        <AnimatePresence>
          {showWhyMobile && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p
                className="text-xs leading-relaxed mt-2 px-3 py-2 rounded"
                style={{ color: '#6B6B63', backgroundColor: '#FAFAF8', borderRadius: '4px' }}
              >
                {question.whyItMatters}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ────── Input Components ────── */

function MultiSelectPills({ options, selected, onChange, questionId }: {
  options: { id: string; label: string }[]; selected: string[]; onChange: (v: string[]) => void; questionId: string;
}) {
  const toggle = (id: string) => {
    if (id === 'none') {
      onChange(['none']);
    } else {
      const without = selected.filter(s => s !== 'none');
      onChange(without.includes(id) ? without.filter(s => s !== id) : [...without, id]);
    }
  };
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={`Select options for question ${questionId}`}>
      {options.map(opt => {
        const active = selected.includes(opt.id);
        return (
          <button
            key={opt.id}
            onClick={() => toggle(opt.id)}
            role="checkbox"
            aria-checked={active}
            className="px-3 py-2 text-xs border rounded transition-all flex items-center gap-1.5"
            style={{
              borderColor: active ? '#00875A' : '#E8E8E4',
              backgroundColor: active ? '#E6F4ED' : '#FFFFFF',
              color: active ? '#00875A' : '#6B6B63',
              borderRadius: '4px',
            }}
          >
            {active && <Check className="w-3 h-3" />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function SingleSelectCards({ options, selected, onChange, questionId }: {
  options: { id: string; label: string; description?: string }[]; selected: string; onChange: (v: string) => void; questionId: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={`Select an option for question ${questionId}`}>
      {options.map(opt => {
        const active = selected === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            role="radio"
            aria-checked={active}
            className="px-3 py-3 border rounded text-left transition-all"
            style={{
              borderColor: active ? '#00875A' : '#E8E8E4',
              backgroundColor: active ? '#F0FAF5' : '#FFFFFF',
              borderRadius: '4px',
              borderWidth: active ? '2px' : '1px',
            }}
          >
            <span className="text-sm block" style={{ color: '#1A1A1A' }}>{opt.label}</span>
            {opt.description && <span className="text-xs" style={{ color: '#9CA39B' }}>{opt.description}</span>}
          </button>
        );
      })}
    </div>
  );
}

function SingleSelectRadio({ options, selected, onChange, questionId }: {
  options: { id: string; label: string; description?: string }[]; selected: string; onChange: (v: string) => void; questionId: string;
}) {
  return (
    <div className="space-y-2" role="radiogroup" aria-label={`Select an option for question ${questionId}`}>
      {options.map(opt => {
        const active = selected === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            role="radio"
            aria-checked={active}
            className="w-full flex items-center gap-3 px-4 py-3 border rounded text-left transition-all"
            style={{ borderColor: active ? '#00875A' : '#E8E8E4', borderRadius: '4px' }}
          >
            <div
              className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
              style={{ borderColor: active ? '#00875A' : '#E8E8E4' }}
            >
              {active && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00875A' }} />}
            </div>
            <div>
              <span className="text-sm" style={{ color: '#1A1A1A' }}>{opt.label}</span>
              {opt.description && <span className="text-xs block" style={{ color: '#9CA39B' }}>{opt.description}</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ThreeButton({ options, selected, onChange, questionId }: {
  options: { id: string; label: string }[]; selected: string; onChange: (v: string) => void; questionId: string;
}) {
  return (
    <div className="flex gap-2" role="radiogroup" aria-label={`Select an option for question ${questionId}`}>
      {options.map(opt => {
        const active = selected === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            role="radio"
            aria-checked={active}
            className="flex-1 px-4 py-3 border rounded text-sm text-center transition-all"
            style={{
              borderColor: active ? '#00875A' : '#E8E8E4',
              backgroundColor: active ? '#00875A' : '#FFFFFF',
              color: active ? '#FFFFFF' : '#1A1A1A',
              borderRadius: '4px',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
