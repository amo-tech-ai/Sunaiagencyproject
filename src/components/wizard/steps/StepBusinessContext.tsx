// C30 — Step 1: Business Context
// Company info form: name, website, industry, size, goal, challenge
// Per-field validation errors shown after attemptedAdvance
// Document upload zone (optional)

import { useWizard } from '../WizardContext';
import { INDUSTRIES, COMPANY_SIZES, GOALS, STEP1_CONTEXT } from '../data/wizardData';
import { WizardLayout } from '../WizardLayout';
import { motion, AnimatePresence } from 'motion/react';
import { Check, AlertCircle, Upload, X, FileText } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';

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

  const rightPanel = (
    <div className="space-y-6">
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

        {/* Website URL */}
        <FieldGroup label="Website URL" optional fieldId="websiteUrl">
          <div className="flex">
            <span className="px-3 py-3 text-sm border border-r-0 rounded-l flex items-center" style={{ borderColor: '#E8E8E4', color: '#9CA39B', backgroundColor: '#FAFAF8', borderRadius: '4px 0 0 4px' }}>
              https://
            </span>
            <input
              type="text"
              value={s.websiteUrl}
              onChange={e => updateStep1({ websiteUrl: e.target.value })}
              onFocus={() => setFocusedField('websiteUrl')}
              placeholder="www.yourcompany.com"
              className="flex-1 px-4 py-3 text-sm border rounded-r outline-none"
              style={{ borderColor: '#E8E8E4', borderRadius: '0 4px 4px 0', color: '#1A1A1A' }}
            />
          </div>
          <p className="text-xs mt-1" style={{ color: '#9CA39B' }}>Optional — helps our AI understand your business faster</p>
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
