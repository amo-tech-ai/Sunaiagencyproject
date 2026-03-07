// C29-FOOTER — Bottom navigation bar
// Keyboard: Enter to advance, Escape to go back
// Shows inline error hint when Continue is blocked + attemptedAdvance

import { useEffect, useCallback } from 'react';
import { useWizard } from './WizardContext';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function WizardFooter() {
  const { state, goBack, goNext, canProceed, attemptedAdvance, currentErrors } = useWizard();
  const isFirst = state.currentStep === 1;
  const isValid = canProceed(state.currentStep);

  // Global error message (for steps 2-4 that use _global key)
  const globalError = currentErrors._global;
  // Count of field-level errors (for step 1)
  const fieldErrorCount = Object.keys(currentErrors).filter(k => k !== '_global').length;
  const showError = attemptedAdvance && !isValid;

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't intercept if user is typing in an input or textarea
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
      // Only allow Enter in non-textarea fields
      if (tag === 'TEXTAREA') return;
      if (e.key === 'Enter') {
        e.preventDefault();
        goNext();
      }
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      goNext();
    } else if (e.key === 'Escape' && !isFirst) {
      e.preventDefault();
      goBack();
    }
  }, [goNext, goBack, isFirst]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <footer
      className="border-t shrink-0"
      style={{ borderColor: '#E8E8E4', backgroundColor: '#FFFFFF' }}
    >
      {/* Error bar — slides in above the footer controls */}
      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className="max-w-[1440px] mx-auto px-6 py-2.5 flex items-center gap-2"
              style={{ backgroundColor: '#FEF2F2' }}
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" style={{ color: '#DC2626' }} />
              <span className="text-xs" style={{ color: '#DC2626' }}>
                {globalError || `Please fix ${fieldErrorCount} required field${fieldErrorCount !== 1 ? 's' : ''} above to continue`}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Back */}
        {!isFirst ? (
          <button
            onClick={goBack}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded transition-colors hover:bg-gray-50"
            style={{ color: '#6B6B63' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
            <span className="text-xs hidden sm:inline ml-1" style={{ color: '#C4C4BC' }}>Esc</span>
          </button>
        ) : (
          <div />
        )}

        {/* Center status */}
        <span className="text-xs hidden md:block" style={{ color: '#9CA39B' }}>
          Step {state.currentStep} of 5
        </span>

        {/* Continue */}
        <button
          onClick={goNext}
          className="flex items-center gap-2 px-6 py-2.5 text-sm rounded transition-all"
          style={{
            backgroundColor: isValid ? '#00875A' : showError ? '#F87171' : '#E8E8E4',
            color: isValid ? '#FFFFFF' : showError ? '#FFFFFF' : '#9CA39B',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          Continue
          <ArrowRight className="w-4 h-4" />
          <span className="text-xs hidden sm:inline ml-0.5" style={{ color: isValid || showError ? 'rgba(255,255,255,0.6)' : '#C4C4BC' }}>↵</span>
        </button>
      </div>
    </footer>
  );
}
