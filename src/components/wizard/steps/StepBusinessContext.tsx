// C30 — Step 1: Business Context
// Company info form: name, website, industry, size, goal, challenge
// Per-field validation errors shown after attemptedAdvance
// Document upload zone (optional)
// Website URL triggers simulated AI analysis (URL Context + Google Search)

import { useWizard } from '../WizardContext';
import { INDUSTRIES, COMPANY_SIZES, GOALS, STEP1_CONTEXT } from '../data/wizardData';
import { WizardLayout } from '../WizardLayout';
import { motion, AnimatePresence } from 'motion/react';
import { Check, AlertCircle, Upload, X, FileText, Globe, Search, Sparkles, Building2, Users, Cpu, Lightbulb, ArrowRight, AlertTriangle } from 'lucide-react';
import { useState, useRef, useCallback, useEffect } from 'react';

/* ────────────────── Website Analysis Types ────────────────── */

type AnalysisStatus = 'idle' | 'analyzing' | 'complete' | 'error';

interface AnalysisResult {
  companySummary: string;
  detectedIndustry: string;
  productsServices: string[];
  teamSizeEstimate: string;
  technologySignals: string[];
  aiOpportunities: string[];
}

/* ────────────────── Mock Analysis Simulation ────────────────── */

function simulateAnalysis(url: string): Promise<AnalysisResult> {
  return new Promise((resolve, reject) => {
    // Simulate occasional failure for demo
    const shouldFail = url.includes('fail');
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Analysis unavailable'));
        return;
      }
      // Extract company name hint from URL
      const domain = url.replace(/^(https?:\/\/)?(www\.)?/, '').split(/[./]/)[0] || 'Company';
      const name = domain.charAt(0).toUpperCase() + domain.slice(1);
      resolve({
        companySummary: `${name} appears to be a mid-market company focused on delivering technology-driven solutions. The website emphasizes customer experience and operational efficiency.`,
        detectedIndustry: 'Technology / SaaS',
        productsServices: ['SaaS Platform', 'Consulting Services', 'API Integrations', 'Customer Portal'],
        teamSizeEstimate: '50–200 employees',
        technologySignals: ['React / Next.js', 'Cloud Infrastructure', 'REST APIs', 'Analytics Suite'],
        aiOpportunities: ['Customer support automation', 'Predictive analytics', 'Content personalization', 'Workflow optimization'],
      });
    }, 3800);
  });
}

function isValidUrl(url: string): boolean {
  if (!url.trim()) return false;
  const pattern = /^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}/;
  return pattern.test(url.trim());
}

/* ────────────────── Right Panel: Analysis States ────────────────── */

function AnalysisLoadingCard() {
  const steps = [
    { label: 'Website content', delay: 0 },
    { label: 'Market signals', delay: 0.8 },
    { label: 'Business profile', delay: 1.6 },
    { label: 'AI opportunities', delay: 2.4 },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="border rounded p-5 space-y-5"
      style={{ borderColor: '#E8E8E4', backgroundColor: '#FAFAF8', borderRadius: '4px' }}
    >
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-4 h-4" style={{ color: '#00875A' }} />
          </motion.div>
          <p className="text-sm" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
            Analyzing your website
          </p>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: '#6B6B63' }}>
          We're reviewing your site content and public web signals to build a more accurate business profile.
        </p>
      </div>
      <div className="space-y-3">
        {steps.map((step) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: step.delay, duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: step.delay + 0.2, duration: 1.8, ease: 'easeInOut' }}
              className="flex-1 relative"
            >
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F0F0EC' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: '#00875A' }}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ delay: step.delay + 0.3, duration: 2, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
            <span className="text-xs shrink-0 w-28 text-right" style={{ color: '#9CA39B' }}>
              {step.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function AnalysisCompleteCard({
  result,
  onUseIndustry,
  onUseTeamSize,
}: {
  result: AnalysisResult;
  onUseIndustry: () => void;
  onUseTeamSize: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
      className="border rounded space-y-0 overflow-hidden"
      style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b" style={{ backgroundColor: '#FAFAF8', borderColor: '#F0F0EC' }}>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4" style={{ color: '#00875A' }} />
          <p className="text-sm" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
            Company Analysis
          </p>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4" style={{ backgroundColor: '#FFFFFF' }}>
        {/* Company Summary */}
        <div>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#9CA39B', letterSpacing: '0.06em' }}>Summary</p>
          <p className="text-xs leading-relaxed" style={{ color: '#6B6B63' }}>{result.companySummary}</p>
        </div>

        {/* Detected Industry */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#9CA39B', letterSpacing: '0.06em' }}>Industry</p>
            <p className="text-sm" style={{ color: '#1A1A1A' }}>{result.detectedIndustry}</p>
          </div>
          <button
            onClick={onUseIndustry}
            className="text-xs px-2.5 py-1 rounded border transition-colors hover:border-[#00875A]"
            style={{ color: '#00875A', borderColor: '#E8E8E4', borderRadius: '4px' }}
          >
            Use this
          </button>
        </div>

        {/* Products / Services */}
        <div>
          <p className="text-xs tracking-widest uppercase mb-1.5" style={{ color: '#9CA39B', letterSpacing: '0.06em' }}>Products & Services</p>
          <div className="flex flex-wrap gap-1.5">
            {result.productsServices.map((item) => (
              <span key={item} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#F5F5F0', color: '#6B6B63', borderRadius: '3px' }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Team Size */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#9CA39B', letterSpacing: '0.06em' }}>Team Size</p>
            <p className="text-sm" style={{ color: '#1A1A1A' }}>{result.teamSizeEstimate}</p>
          </div>
          <button
            onClick={onUseTeamSize}
            className="text-xs px-2.5 py-1 rounded border transition-colors hover:border-[#00875A]"
            style={{ color: '#00875A', borderColor: '#E8E8E4', borderRadius: '4px' }}
          >
            Use this
          </button>
        </div>

        {/* Technology Signals */}
        <div>
          <p className="text-xs tracking-widest uppercase mb-1.5" style={{ color: '#9CA39B', letterSpacing: '0.06em' }}>Technology</p>
          <div className="flex flex-wrap gap-1.5">
            {result.technologySignals.map((item) => (
              <span key={item} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#F5F5F0', color: '#6B6B63', borderRadius: '3px' }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* AI Opportunities */}
        <div>
          <p className="text-xs tracking-widest uppercase mb-1.5" style={{ color: '#9CA39B', letterSpacing: '0.06em' }}>AI Opportunities</p>
          <div className="space-y-1.5">
            {result.aiOpportunities.map((item) => (
              <div key={item} className="flex items-start gap-2">
                <Lightbulb className="w-3 h-3 mt-0.5 shrink-0" style={{ color: '#00875A' }} />
                <span className="text-xs" style={{ color: '#6B6B63' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Source footer */}
      <div className="px-5 py-3 border-t" style={{ backgroundColor: '#FAFAF8', borderColor: '#F0F0EC' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3 h-3" style={{ color: '#9CA39B' }} />
            <span className="text-xs" style={{ color: '#9CA39B' }}>Website</span>
          </div>
          <span className="text-xs" style={{ color: '#E8E8E4' }}>+</span>
          <div className="flex items-center gap-1.5">
            <Search className="w-3 h-3" style={{ color: '#9CA39B' }} />
            <span className="text-xs" style={{ color: '#9CA39B' }}>Google Search</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AnalysisErrorCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="border rounded p-5 space-y-3"
      style={{ borderColor: '#E8E8E4', backgroundColor: '#FAFAF8', borderRadius: '4px' }}
    >
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" style={{ color: '#9CA39B' }} />
        <p className="text-sm" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
          Analysis unavailable
        </p>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: '#6B6B63' }}>
        We couldn't extract website insights right now, but you can continue normally.
      </p>
      <p className="text-xs" style={{ color: '#9CA39B' }}>
        Your answers will still guide the analysis.
      </p>
    </motion.div>
  );
}

function HowAnalysisWorks() {
  return (
    <div className="border rounded p-4 space-y-3" style={{ borderColor: '#F0F0EC', backgroundColor: '#FAFAF8', borderRadius: '4px' }}>
      <p className="text-xs tracking-widest uppercase" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
        How this helps
      </p>
      <div className="space-y-2.5">
        <div className="flex items-start gap-2.5">
          <Globe className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#6B6B63' }} />
          <div>
            <p className="text-xs" style={{ color: '#1A1A1A' }}>URL Context</p>
            <p className="text-xs" style={{ color: '#9CA39B' }}>Reads your website content</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Search className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#6B6B63' }} />
          <div>
            <p className="text-xs" style={{ color: '#1A1A1A' }}>Google Search</p>
            <p className="text-xs" style={{ color: '#9CA39B' }}>Adds market and public company context</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#6B6B63' }} />
          <div>
            <p className="text-xs" style={{ color: '#1A1A1A' }}>Result</p>
            <p className="text-xs" style={{ color: '#9CA39B' }}>Better industry detection and more relevant recommendations</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────── Main Component ────────────────── */

export function StepBusinessContext() {
  const { state, updateStep1, setFocusedField, attemptedAdvance, currentErrors } = useWizard();
  const s = state.step1;
  const ctx = STEP1_CONTEXT[state.focusedField] || STEP1_CONTEXT.default;

  // Only show errors if user has attempted to advance
  const showErrors = attemptedAdvance;
  const err = (field: string) => showErrors ? currentErrors[field] : undefined;

  // Document upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Website analysis state
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const analysisAbortRef = useRef(false);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/csv', 'image/png', 'image/jpeg'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const valid = Array.from(files).filter(f => allowed.includes(f.type) && f.size <= maxSize);
    setUploadedFiles(prev => [...prev, ...valid].slice(0, 5));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeFile = useCallback((idx: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
  }, []);

  // Trigger analysis on blur when URL is valid
  const handleWebsiteBlur = useCallback(() => {
    const url = s.websiteUrl.trim();
    if (!isValidUrl(url) || analysisStatus === 'analyzing') return;

    // Reset if URL changed after previous analysis
    analysisAbortRef.current = false;
    setAnalysisStatus('analyzing');
    setAnalysisResult(null);

    simulateAnalysis(url)
      .then((result) => {
        if (!analysisAbortRef.current) {
          setAnalysisResult(result);
          setAnalysisStatus('complete');
        }
      })
      .catch(() => {
        if (!analysisAbortRef.current) {
          setAnalysisStatus('error');
        }
      });
  }, [s.websiteUrl, analysisStatus]);

  // Reset analysis when URL is cleared
  useEffect(() => {
    if (!s.websiteUrl.trim()) {
      analysisAbortRef.current = true;
      setAnalysisStatus('idle');
      setAnalysisResult(null);
    }
  }, [s.websiteUrl]);

  // "Use this" suggestion handlers
  const handleUseIndustry = useCallback(() => {
    if (!analysisResult) return;
    // Map detected industry to closest match
    const detected = analysisResult.detectedIndustry.toLowerCase();
    const match = ['e-commerce', 'real-estate', 'healthcare', 'financial', 'travel', 'fashion', 'food', 'professional', 'education', 'saas', 'manufacturing']
      .find(id => detected.includes(id.replace('-', '')) || detected.includes(id));
    if (match) updateStep1({ industry: match });
    else updateStep1({ industry: 'saas' }); // fallback for "Technology / SaaS"
  }, [analysisResult, updateStep1]);

  const handleUseTeamSize = useCallback(() => {
    if (!analysisResult) return;
    const est = analysisResult.teamSizeEstimate;
    if (est.includes('1–10') || est.includes('1-10')) updateStep1({ companySize: 'small' });
    else if (est.includes('11–50') || est.includes('11-50')) updateStep1({ companySize: 'medium' });
    else if (est.includes('51–200') || est.includes('50–200') || est.includes('50-200')) updateStep1({ companySize: 'large' });
    else updateStep1({ companySize: 'large' }); // "50–200 employees" fallback
  }, [analysisResult, updateStep1]);

  /* ────────────── Right Panel ────────────── */

  const rightPanel = (
    <div className="space-y-6">
      {/* Dynamic context blurb */}
      <motion.div key={state.focusedField} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
          Why we ask
        </p>
        <h3 className="text-base mb-2" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
          {ctx.heading}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: '#6B6B63' }}>
          {ctx.body}
        </p>
      </motion.div>

      {/* Analysis state cards */}
      <AnimatePresence mode="wait">
        {analysisStatus === 'analyzing' && (
          <AnalysisLoadingCard key="loading" />
        )}
        {analysisStatus === 'complete' && analysisResult && (
          <AnalysisCompleteCard
            key="complete"
            result={analysisResult}
            onUseIndustry={handleUseIndustry}
            onUseTeamSize={handleUseTeamSize}
          />
        )}
        {analysisStatus === 'error' && (
          <AnalysisErrorCard key="error" />
        )}
      </AnimatePresence>

      {/* How analysis works — shown when idle or focused on website */}
      {analysisStatus === 'idle' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <HowAnalysisWorks />
        </motion.div>
      )}

      {/* What happens next */}
      <div className="border-t pt-4" style={{ borderColor: '#F0F0EC' }}>
        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
          What happens next
        </p>
        <p className="text-sm" style={{ color: '#6B6B63' }}>
          Next, we'll ask 8 questions specific to your industry to identify where AI can make the biggest impact.
        </p>
      </div>
    </div>
  );

  return (
    <WizardLayout rightPanel={rightPanel}>
      <div className="space-y-8">
        {/* Eyebrow + Title */}
        <div>
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
            Business Context
          </p>
          <h1 className="text-2xl mb-2" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A', fontWeight: 400 }}>
            Tell us about your business
          </h1>
          <p className="text-sm" style={{ color: '#6B6B63' }}>
            We'll use this to tailor our analysis to your industry and goals.
          </p>
        </div>

        {/* Company Name */}
        <FieldGroup label="Company Name" required error={err('companyName')} fieldId="companyName">
          <input
            type="text"
            value={s.companyName}
            onChange={e => updateStep1({ companyName: e.target.value })}
            onFocus={() => setFocusedField('companyName')}
            placeholder="e.g., Acme Retail Group"
            className="w-full px-4 py-3 text-sm border rounded outline-none transition-all"
            style={{
              borderColor: err('companyName') ? '#DC2626' : '#E8E8E4',
              borderRadius: '4px',
              backgroundColor: '#FFFFFF',
              color: '#1A1A1A',
            }}
          />
        </FieldGroup>

        {/* Website URL — Enhanced */}
        <FieldGroup label="Website URL" optional fieldId="websiteUrl">
          <div className="flex">
            <span
              className="px-3 py-3 text-sm border border-r-0 flex items-center"
              style={{ borderColor: analysisStatus === 'analyzing' ? '#00875A' : '#E8E8E4', color: '#9CA39B', backgroundColor: '#FAFAF8', borderRadius: '4px 0 0 4px', transition: 'border-color 0.2s' }}
            >
              https://
            </span>
            <input
              type="text"
              value={s.websiteUrl}
              onChange={e => updateStep1({ websiteUrl: e.target.value })}
              onFocus={() => setFocusedField('websiteUrl')}
              onBlur={handleWebsiteBlur}
              placeholder="www.yourcompany.com"
              className="flex-1 px-4 py-3 text-sm border outline-none transition-all"
              style={{
                borderColor: analysisStatus === 'analyzing' ? '#00875A' : '#E8E8E4',
                borderRadius: '0 4px 4px 0',
                color: '#1A1A1A',
                transition: 'border-color 0.2s',
              }}
            />
          </div>

          {/* Helper text */}
          <p className="text-xs mt-2 leading-relaxed" style={{ color: '#6B6B63' }}>
            Optional — we analyze your website and public web context to tailor recommendations faster.
          </p>

          {/* Trust badges: URL Context + Google Search */}
          <div className="flex items-center gap-2 mt-2">
            <span
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border"
              style={{ color: '#6B6B63', borderColor: '#F0F0EC', backgroundColor: '#FAFAF8', borderRadius: '3px' }}
            >
              <Globe className="w-3 h-3" style={{ color: '#9CA39B' }} />
              URL Context
            </span>
            <span
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border"
              style={{ color: '#6B6B63', borderColor: '#F0F0EC', backgroundColor: '#FAFAF8', borderRadius: '3px' }}
            >
              <Search className="w-3 h-3" style={{ color: '#9CA39B' }} />
              Google Search
            </span>
          </div>

          {/* Micro explanation */}
          <p className="text-xs mt-1.5" style={{ color: '#9CA39B' }}>
            Used to understand your business, positioning, and likely opportunities.
          </p>

          {/* Status line */}
          <AnimatePresence mode="wait">
            {analysisStatus === 'idle' && s.websiteUrl.trim() === '' && (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs mt-2 flex items-center gap-1.5"
                style={{ color: '#9CA39B' }}
              >
                <Sparkles className="w-3 h-3" />
                AI analysis available when website is provided
              </motion.p>
            )}
            {analysisStatus === 'idle' && isValidUrl(s.websiteUrl) && (
              <motion.p
                key="ready"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs mt-2 flex items-center gap-1.5"
                style={{ color: '#00875A' }}
              >
                <ArrowRight className="w-3 h-3" />
                Click away from the field to start analysis
              </motion.p>
            )}
            {analysisStatus === 'analyzing' && (
              <motion.p
                key="running"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs mt-2 flex items-center gap-1.5"
                style={{ color: '#00875A' }}
              >
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} className="inline-flex">
                  <Sparkles className="w-3 h-3" />
                </motion.span>
                Analyzing — results will appear in the side panel
              </motion.p>
            )}
            {analysisStatus === 'complete' && (
              <motion.p
                key="done"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs mt-2 flex items-center gap-1.5"
                style={{ color: '#00875A' }}
              >
                <Check className="w-3 h-3" />
                Analysis complete — see results in the side panel
              </motion.p>
            )}
          </AnimatePresence>
        </FieldGroup>

        {/* Industry */}
        <FieldGroup label="Industry" required error={err('industry')} fieldId="industry">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Select your industry" onFocus={() => setFocusedField('industry')}>
            {INDUSTRIES.map(ind => {
              const selected = s.industry === ind.id;
              const Icon = ind.icon;
              return (
                <button
                  key={ind.id}
                  onClick={() => { updateStep1({ industry: ind.id }); setFocusedField('industry'); }}
                  role="radio"
                  aria-checked={selected}
                  className="flex items-center gap-2.5 px-3 py-3 border rounded text-left text-sm transition-all"
                  style={{
                    borderColor: selected ? '#00875A' : err('industry') ? '#FECACA' : '#E8E8E4',
                    borderWidth: selected ? '2px' : '1px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '4px',
                    color: selected ? '#1A1A1A' : '#6B6B63',
                  }}
                >
                  <Icon className="w-4 h-4 shrink-0" style={{ color: selected ? '#00875A' : '#9CA39B' }} />
                  <span className="truncate">{ind.label}</span>
                  {selected && <Check className="w-3.5 h-3.5 ml-auto shrink-0" style={{ color: '#00875A' }} />}
                </button>
              );
            })}
          </div>
        </FieldGroup>

        {/* Company Size */}
        <FieldGroup label="Company Size" required error={err('companySize')} fieldId="companySize">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="Select your company size" onFocus={() => setFocusedField('companySize')}>
            {COMPANY_SIZES.map(size => {
              const selected = s.companySize === size.id;
              return (
                <button
                  key={size.id}
                  onClick={() => { updateStep1({ companySize: size.id }); setFocusedField('companySize'); }}
                  role="radio"
                  aria-checked={selected}
                  className="px-3 py-3 border rounded text-center text-sm transition-all"
                  style={{
                    borderColor: selected ? '#00875A' : err('companySize') ? '#FECACA' : '#E8E8E4',
                    backgroundColor: selected ? '#1A1A1A' : '#FFFFFF',
                    color: selected ? '#FFFFFF' : '#1A1A1A',
                    borderRadius: '4px',
                    borderWidth: selected ? '2px' : '1px',
                  }}
                >
                  <span className="block">{size.label}</span>
                  <span className="block text-xs mt-0.5" style={{ color: selected ? 'rgba(255,255,255,0.7)' : '#9CA39B' }}>
                    {size.range}
                  </span>
                </button>
              );
            })}
          </div>
        </FieldGroup>

        {/* Primary Goal */}
        <FieldGroup label="Primary Business Goal" required error={err('goal')} fieldId="goal">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup" aria-label="Select your primary business goal" onFocus={() => setFocusedField('goal')}>
            {GOALS.map(goal => {
              const selected = s.goal === goal.id;
              const Icon = goal.icon;
              return (
                <button
                  key={goal.id}
                  onClick={() => { updateStep1({ goal: goal.id }); setFocusedField('goal'); }}
                  role="radio"
                  aria-checked={selected}
                  className="flex items-start gap-3 px-4 py-3.5 border rounded text-left transition-all"
                  style={{
                    borderColor: selected ? '#00875A' : err('goal') ? '#FECACA' : '#E8E8E4',
                    borderWidth: selected ? '2px' : '1px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '4px',
                  }}
                >
                  <Icon className="w-5 h-5 mt-0.5 shrink-0" style={{ color: selected ? '#00875A' : '#9CA39B' }} />
                  <div>
                    <span className="text-sm block" style={{ color: '#1A1A1A' }}>{goal.label}</span>
                    <span className="text-xs" style={{ color: '#6B6B63' }}>{goal.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
          {/* "Other" goal free-text input — appears when "other" is selected */}
          <AnimatePresence>
            {s.goal === 'other' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <textarea
                  value={s.goalOther}
                  onChange={e => updateStep1({ goalOther: e.target.value })}
                  onFocus={() => setFocusedField('goal')}
                  placeholder="Describe your primary goal in a few sentences..."
                  rows={3}
                  maxLength={300}
                  className="w-full px-4 py-3 mt-3 text-sm border rounded outline-none resize-none"
                  style={{
                    borderColor: '#E8E8E4',
                    borderRadius: '4px',
                    color: '#1A1A1A',
                  }}
                />
                <p className="text-xs mt-1 text-right" style={{ color: '#9CA39B' }}>
                  {s.goalOther.length} / 300
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </FieldGroup>

        {/* Biggest Challenge */}
        <FieldGroup label="Biggest Challenge" required error={err('challenge')} fieldId="challenge">
          <textarea
            value={s.challenge}
            onChange={e => updateStep1({ challenge: e.target.value })}
            onFocus={() => setFocusedField('challenge')}
            placeholder="Describe in 2-3 sentences. Be specific — this shapes our recommendations."
            rows={4}
            maxLength={500}
            className="w-full px-4 py-3 text-sm border rounded outline-none resize-none"
            style={{
              borderColor: err('challenge') ? '#DC2626' : '#E8E8E4',
              borderRadius: '4px',
              color: '#1A1A1A',
            }}
          />
          <div className="flex items-center justify-between mt-1">
            {err('challenge') ? (
              <span /> // error shown by FieldGroup
            ) : (
              <span />
            )}
            <p className="text-xs" style={{ color: s.challenge.length >= 20 ? '#9CA39B' : err('challenge') ? '#DC2626' : '#9CA39B' }}>
              {s.challenge.length} / 500
              {s.challenge.length > 0 && s.challenge.length < 20 && (
                <span style={{ color: '#DC2626' }}> (min 20)</span>
              )}
            </p>
          </div>
        </FieldGroup>

        {/* Document Upload Zone */}
        <FieldGroup label="Supporting Documents" optional fieldId="documents">
          <div
            className="border-2 border-dashed rounded p-6 text-center transition-all cursor-pointer"
            style={{
              borderColor: isDragOver ? '#00875A' : '#E8E8E4',
              backgroundColor: isDragOver ? '#F0FAF5' : '#FAFAF8',
              borderRadius: '4px',
            }}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept=".pdf,.doc,.docx,.txt,.csv,.png,.jpg,.jpeg"
              onChange={e => { handleFiles(e.target.files); e.target.value = ''; }}
              className="hidden"
            />
            <Upload className="w-6 h-6 mx-auto mb-3" style={{ color: isDragOver ? '#00875A' : '#9CA39B' }} />
            <p className="text-sm mb-1" style={{ color: '#1A1A1A' }}>
              Drop files here or <span style={{ color: '#00875A' }}>browse</span>
            </p>
            <p className="text-xs" style={{ color: '#9CA39B' }}>
              PDF, DOC, TXT, CSV, or images. Max 10MB each, up to 5 files.
            </p>
          </div>

          {/* Uploaded files list */}
          <AnimatePresence>
            {uploadedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 space-y-2 overflow-hidden"
              >
                {uploadedFiles.map((file, idx) => (
                  <motion.div
                    key={`${file.name}-${idx}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="flex items-center gap-2.5 px-3 py-2 border rounded"
                    style={{ borderColor: '#E8E8E4', borderRadius: '4px', backgroundColor: '#FFFFFF' }}
                  >
                    <FileText className="w-4 h-4 shrink-0" style={{ color: '#00875A' }} />
                    <span className="text-sm flex-1 truncate" style={{ color: '#1A1A1A' }}>{file.name}</span>
                    <span className="text-xs shrink-0" style={{ color: '#9CA39B' }}>
                      {(file.size / 1024).toFixed(0)}KB
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                      className="p-0.5 rounded hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" style={{ color: '#DC2626' }} />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <p className="text-xs mt-1" style={{ color: '#9CA39B' }}>
            Optional — existing briefs, brand guidelines, or process docs help our AI analyze faster
          </p>
        </FieldGroup>
      </div>
    </WizardLayout>
  );
}

/* ────── Shared Field Group with error support ────── */

function FieldGroup({ label, required, optional, error, fieldId, children }: {
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  fieldId?: string;
  children: React.ReactNode;
}) {
  return (
    <div data-field={fieldId}>
      <label className="block text-sm mb-2" style={{ color: '#1A1A1A' }}>
        {label}
        {required && <span style={{ color: '#DC2626' }}> *</span>}
        {optional && <span className="text-xs ml-1" style={{ color: '#9CA39B' }}>(optional)</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-1.5 mt-2" role="alert">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" style={{ color: '#DC2626' }} />
              <span className="text-xs" style={{ color: '#DC2626' }}>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
