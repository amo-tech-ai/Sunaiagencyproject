// C29-SIDEBAR — Left panel: step indicator + context card

import { useWizard } from './WizardContext';
import { Check } from 'lucide-react';
import { STEPS } from './data/wizardData';
import { motion } from 'motion/react';

export function WizardSidebar() {
  const { state, setStep } = useWizard();

  return (
    <div className="p-5 space-y-6">
      {/* Step Indicator */}
      <div>
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
          Steps
        </p>
        <div className="space-y-1">
          {STEPS.map((step) => {
            const isCompleted = state.completedSteps.includes(step.number);
            const isActive = state.currentStep === step.number;
            const isFuture = step.number > state.currentStep && !isCompleted;

            return (
              <button
                key={step.number}
                onClick={() => {
                  if (isCompleted || isActive) setStep(step.number);
                }}
                disabled={isFuture}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-left transition-colors"
                style={{
                  backgroundColor: isActive ? '#F0FAF5' : 'transparent',
                  cursor: isFuture ? 'default' : 'pointer',
                  opacity: isFuture ? 0.4 : 1,
                }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0"
                  style={{
                    backgroundColor: isCompleted ? '#00875A' : isActive ? '#00875A' : '#F5F5F0',
                    color: isCompleted || isActive ? '#FFFFFF' : '#6B6B63',
                    border: !isCompleted && !isActive ? '1px solid #E8E8E4' : 'none',
                  }}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.number}
                </div>
                <span
                  className="text-sm"
                  style={{
                    color: isActive ? '#1A1A1A' : isCompleted ? '#1A1A1A' : '#6B6B63',
                    fontFamily: isActive ? 'Georgia, serif' : 'inherit',
                  }}
                >
                  {step.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Context Card */}
      <div className="border rounded p-4 space-y-3" style={{ borderColor: '#E8E8E4' }}>
        <p className="text-xs tracking-widest uppercase" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
          Your Brief
        </p>
        {state.step1.companyName ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <p className="text-sm" style={{ color: '#1A1A1A', fontFamily: 'Georgia, serif' }}>
              {state.step1.companyName}
            </p>
            {state.step1.industry && (
              <span className="inline-block text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#E6F4ED', color: '#00875A' }}>
                {state.step1.industry.replace(/-/g, ' ')}
              </span>
            )}
            {state.step1.companySize && (
              <p className="text-xs" style={{ color: '#6B6B63' }}>
                {state.step1.companySize.charAt(0).toUpperCase() + state.step1.companySize.slice(1)}
              </p>
            )}
            {state.step1.goal && (
              <p className="text-xs" style={{ color: '#6B6B63' }}>
                Goal: {state.step1.goal.replace(/-/g, ' ')}
              </p>
            )}
          </motion.div>
        ) : (
          <p className="text-xs" style={{ color: '#9CA39B' }}>
            Fill in the form to see your brief appear here.
          </p>
        )}

        {/* Signals */}
        {state.diagnosticSignals.length > 0 && (
          <div className="pt-2 border-t space-y-1.5" style={{ borderColor: '#F0F0EC' }}>
            <p className="text-xs tracking-widest uppercase" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
              Signals
            </p>
            {state.diagnosticSignals.map(sig => (
              <motion.div
                key={sig.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: sig.severity === 'high' ? '#DC2626' : sig.severity === 'medium' ? '#D97706' : '#00875A' }}
                />
                <span className="text-xs" style={{ color: '#1A1A1A' }}>{sig.label}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Selected Systems */}
        {state.step3.selectedSystems.length > 0 && (
          <div className="pt-2 border-t space-y-1.5" style={{ borderColor: '#F0F0EC' }}>
            <p className="text-xs tracking-widest uppercase" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
              Systems ({state.step3.selectedSystems.length})
            </p>
            {state.step3.selectedSystems.map(id => (
              <div key={id} className="flex items-center gap-1.5">
                <Check className="w-3 h-3" style={{ color: '#00875A' }} />
                <span className="text-xs" style={{ color: '#1A1A1A' }}>
                  {id.replace(/-/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
