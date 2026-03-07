// C29-STATE — Wizard State Management
// React Context with localStorage persistence, draft resume toast,
// per-field validation errors, save status, keyboard nav support

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { toast } from 'sonner@2.0.3';
import type { Signal } from './data/wizardData';
import { wizardApi } from '../../lib/supabase';

/* ────────────────── TYPES ────────────────── */

export interface Step1Data {
  companyName: string;
  websiteUrl: string;
  industry: string;
  companySize: string;
  goal: string;
  goalOther: string;
  challenge: string;
}

export interface Step2Data {
  answers: Record<string, string | string[]>;
}

export interface Step3Data {
  selectedSystems: string[];
}

export interface Step4Data {
  briefApproved: boolean;
  briefStatus: 'draft' | 'in-review' | 'approved';
  briefEdits: Record<string, string>;
  briefVersion: number;
}

export interface WizardState {
  currentStep: number;
  completedSteps: number[];
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
  diagnosticSignals: Signal[];
  focusedField: string;
}

/** Per-field validation errors keyed by field name */
export type ValidationErrors = Record<string, string>;

/** Auto-save status for the header indicator */
export type SaveStatus = 'idle' | 'saving' | 'saved';

const INITIAL_STATE: WizardState = {
  currentStep: 1,
  completedSteps: [],
  step1: { companyName: '', websiteUrl: '', industry: '', companySize: '', goal: '', goalOther: '', challenge: '' },
  step2: { answers: {} },
  step3: { selectedSystems: [] },
  step4: { briefApproved: false, briefStatus: 'draft', briefEdits: {}, briefVersion: 1 },
  diagnosticSignals: [],
  focusedField: 'default',
};

const STORAGE_KEY = 'sun-ai-wizard-state';
const SESSION_ID_KEY = 'sun-ai-wizard-session-id';

/* ────────────────── VALIDATION ────────────────── */

function getStep1Errors(step1: Step1Data): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!step1.companyName.trim()) errors.companyName = 'Company name is required';
  if (!step1.industry) errors.industry = 'Please select an industry';
  if (!step1.companySize) errors.companySize = 'Please select a company size';
  if (!step1.goal) errors.goal = 'Please select a primary goal';
  if (step1.challenge.length < 20) {
    errors.challenge = step1.challenge.length === 0
      ? 'Please describe your biggest challenge'
      : `At least 20 characters needed (${step1.challenge.length}/20)`;
  }
  return errors;
}

function getStep2Errors(step2: Step2Data): ValidationErrors {
  const answeredCount = Object.keys(step2.answers).length;
  if (answeredCount < 8) {
    return { _global: `Please answer at least 8 questions to continue (${answeredCount}/8)` };
  }
  return {};
}

function getStep3Errors(step3: Step3Data): ValidationErrors {
  if (step3.selectedSystems.length === 0) {
    return { _global: 'Please select at least 1 system to continue' };
  }
  return {};
}

function getStep4Errors(step4: Step4Data): ValidationErrors {
  if (!step4.briefApproved) {
    return { _global: 'Please approve the strategy brief before continuing' };
  }
  return {};
}

export function getStepErrors(step: number, state: WizardState): ValidationErrors {
  switch (step) {
    case 1: return getStep1Errors(state.step1);
    case 2: return getStep2Errors(state.step2);
    case 3: return getStep3Errors(state.step3);
    case 4: return getStep4Errors(state.step4);
    default: return {};
  }
}

/* ────────────────── CONTEXT ────────────────── */

interface WizardContextType {
  state: WizardState;
  setStep: (step: number) => void;
  completeStep: (step: number) => void;
  updateStep1: (data: Partial<Step1Data>) => void;
  updateStep2: (questionId: string, answer: string | string[]) => void;
  updateStep3: (systems: string[]) => void;
  updateStep4: (data: Partial<Step4Data>) => void;
  setSignals: (signals: Signal[]) => void;
  setFocusedField: (field: string) => void;
  goNext: () => void;
  goBack: () => void;
  resetWizard: () => void;
  canProceed: (step: number) => boolean;
  prefill: (params: { service?: string; industry?: string }) => void;
  /** True after user clicked Continue on an invalid step — shows errors */
  attemptedAdvance: boolean;
  /** Current validation errors for the active step */
  currentErrors: ValidationErrors;
  /** Auto-save status: idle → saving → saved */
  saveStatus: SaveStatus;
  /** True when user has made any changes since load or last save checkpoint */
  isDirty: boolean;
  /** Supabase session ID for cloud persistence */
  sessionId: string | null;
}

const WizardContext = createContext<WizardContextType | null>(null);

/** Safe default context value to prevent crashes during HMR / re-renders */
const NOOP = () => {};
const DEFAULT_CONTEXT: WizardContextType = {
  state: INITIAL_STATE,
  setStep: NOOP,
  completeStep: NOOP,
  updateStep1: NOOP,
  updateStep2: NOOP,
  updateStep3: NOOP,
  updateStep4: NOOP,
  setSignals: NOOP,
  setFocusedField: NOOP,
  goNext: NOOP,
  goBack: NOOP,
  resetWizard: NOOP,
  canProceed: () => false,
  prefill: NOOP,
  attemptedAdvance: false,
  currentErrors: {},
  saveStatus: 'idle',
  isDirty: false,
  sessionId: null,
};

export function useWizard() {
  const ctx = useContext(WizardContext);
  // Return safe defaults if context is unavailable (e.g. during HMR reload)
  return ctx ?? DEFAULT_CONTEXT;
}

/* ────────────────── PROVIDER ────────────────── */

export function WizardProvider({ children }: { children: ReactNode }) {
  const hasRestoredRef = useRef(false);
  const [restoredFromDraft, setRestoredFromDraft] = useState(false);
  const [attemptedAdvance, setAttemptedAdvance] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const changeCountRef = useRef(0);
  const [isDirty, setIsDirty] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(() => {
    try { return localStorage.getItem(SESSION_ID_KEY); } catch { return null; }
  });

  const [state, setState] = useState<WizardState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed._timestamp && Date.now() - parsed._timestamp < 7 * 24 * 60 * 60 * 1000) {
          const { _timestamp, ...rest } = parsed;
          // Deep-merge step data to avoid missing fields from old localStorage shape
          const restored: WizardState = {
            ...INITIAL_STATE,
            ...rest,
            step1: { ...INITIAL_STATE.step1, ...(rest.step1 || {}) },
            step2: { ...INITIAL_STATE.step2, ...(rest.step2 || {}) },
            step3: { ...INITIAL_STATE.step3, ...(rest.step3 || {}) },
            step4: { ...INITIAL_STATE.step4, ...(rest.step4 || {}) },
          };
          if (restored.step1.companyName || restored.completedSteps.length > 0) {
            hasRestoredRef.current = true;
          }
          return restored;
        }
      }
    } catch { /* ignore */ }
    return INITIAL_STATE;
  });

  // Compute current step errors on every render (cheap + safe)
  let currentErrors: ValidationErrors = {};
  try {
    currentErrors = getStepErrors(state.currentStep, state);
  } catch { /* defensive — return empty errors if state shape is unexpected */ }

  // Show draft resume toast on mount
  useEffect(() => {
    if (hasRestoredRef.current && !restoredFromDraft) {
      setRestoredFromDraft(true);
      toast('Welcome back! Your project brief has been restored.', {
        description: `You left off at Step ${state.currentStep}${state.step1.companyName ? ` for ${state.step1.companyName}` : ''}.`,
        action: {
          label: 'Start Fresh',
          onClick: () => {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(SESSION_ID_KEY);
            setState(INITIAL_STATE);
            setAttemptedAdvance(false);
            toast.success('Started a new project brief.');
          },
        },
        duration: 8000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to localStorage on every change (debounced) with save status
  // Also persist to Supabase cloud storage
  const resetTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const cloudSaveRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      // Local save — immediate
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, _timestamp: Date.now() }));

      // Cloud save — debounced longer to reduce API calls
      if (cloudSaveRef.current) clearTimeout(cloudSaveRef.current);
      cloudSaveRef.current = setTimeout(async () => {
        try {
          const stateForCloud = {
            ...state,
            _timestamp: Date.now(),
            diagnosticSignals: state.diagnosticSignals.map(s => ({
              id: s.id, label: s.label, severity: s.severity, recommendation: s.recommendation,
            })),
          };
          const { data, error } = await wizardApi.save(
            sessionId || '',
            stateForCloud
          );
          if (data?.sessionId && !sessionId) {
            setSessionId(data.sessionId);
            localStorage.setItem(SESSION_ID_KEY, data.sessionId);
          }
          if (error) {
            console.warn('[Wizard] Cloud save failed (using local):', error);
          }
        } catch (e) {
          console.warn('[Wizard] Cloud save error (using local):', e);
        }
      }, 2000);

      setSaveStatus('saved');
      setIsDirty(false);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
    return () => clearTimeout(timer);
  }, [state, sessionId]);

  // Warn before leaving if there are unsaved changes
  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Modern browsers show a generic message; returnValue is required for legacy compat
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const setStep = useCallback((step: number) => {
    setState(s => ({ ...s, currentStep: step }));
    setAttemptedAdvance(false); // reset on step change
  }, []);

  const completeStep = useCallback((step: number) => {
    setState(s => ({
      ...s,
      completedSteps: s.completedSteps.includes(step) ? s.completedSteps : [...s.completedSteps, step],
    }));
  }, []);

  const updateStep1 = useCallback((data: Partial<Step1Data>) => {
    setState(s => ({ ...s, step1: { ...s.step1, ...data } }));
    changeCountRef.current += 1;
    setIsDirty(true);
  }, []);

  const updateStep2 = useCallback((questionId: string, answer: string | string[]) => {
    setState(s => ({
      ...s,
      step2: { ...s.step2, answers: { ...s.step2.answers, [questionId]: answer } },
    }));
    changeCountRef.current += 1;
    setIsDirty(true);
  }, []);

  const updateStep3 = useCallback((systems: string[]) => {
    setState(s => ({ ...s, step3: { selectedSystems: systems } }));
    changeCountRef.current += 1;
    setIsDirty(true);
  }, []);

  const updateStep4 = useCallback((data: Partial<Step4Data>) => {
    setState(s => ({ ...s, step4: { ...s.step4, ...data } }));
    changeCountRef.current += 1;
    setIsDirty(true);
  }, []);

  const setSignals = useCallback((signals: Signal[]) => {
    setState(s => ({ ...s, diagnosticSignals: signals }));
  }, []);

  const setFocusedField = useCallback((field: string) => {
    setState(s => ({ ...s, focusedField: field }));
  }, []);

  const canProceed = useCallback((step: number): boolean => {
    return Object.keys(getStepErrors(step, state)).length === 0;
  }, [state]);

  const goNext = useCallback(() => {
    const errors = getStepErrors(state.currentStep, state);
    if (Object.keys(errors).length > 0) {
      // Validation failed — flag attemptedAdvance to show errors
      setAttemptedAdvance(true);

      // Scroll to first error field
      const firstErrorKey = Object.keys(errors).find(k => k !== '_global') || '_global';
      if (firstErrorKey !== '_global') {
        const el = document.querySelector(`[data-field="${firstErrorKey}"]`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    // Valid — advance
    setAttemptedAdvance(false);
    setState(s => {
      const next = Math.min(s.currentStep + 1, 5);
      return {
        ...s,
        currentStep: next,
        completedSteps: s.completedSteps.includes(s.currentStep) ? s.completedSteps : [...s.completedSteps, s.currentStep],
      };
    });
  }, [state]);

  const goBack = useCallback(() => {
    setAttemptedAdvance(false);
    setState(s => ({ ...s, currentStep: Math.max(s.currentStep - 1, 1) }));
  }, []);

  const resetWizard = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SESSION_ID_KEY);
    setState(INITIAL_STATE);
    setAttemptedAdvance(false);
    changeCountRef.current = 0;
    setIsDirty(false);
    setSessionId(null);
  }, []);

  const prefill = useCallback((params: { service?: string; industry?: string }) => {
    if (params.industry) {
      setState(s => ({ ...s, step1: { ...s.step1, industry: params.industry! } }));
      changeCountRef.current += 1;
      setIsDirty(true);
    }
  }, []);

  return (
    <WizardContext.Provider value={{
      state, setStep, completeStep, updateStep1, updateStep2, updateStep3,
      updateStep4, setSignals, setFocusedField, goNext, goBack, resetWizard,
      canProceed, prefill, attemptedAdvance, currentErrors, saveStatus,
      isDirty, sessionId,
    }}>
      {children}
    </WizardContext.Provider>
  );
}