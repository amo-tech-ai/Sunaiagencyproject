// C29 — Wizard Page: Shell + Step Router
// Provides WizardProvider context and renders the active child route
// Index route shows the 5-step wizard, children include /processing and /proposal
// Handles URL param pre-fill (?s=chatbot, ?i=e-commerce, ?ref=xxx)

import { useEffect } from 'react';
import { WizardProvider, useWizard } from './WizardContext';
import { StepBusinessContext } from './steps/StepBusinessContext';
import { StepIndustryDiagnostics } from './steps/StepIndustryDiagnostics';
import { StepSystemRecommendations } from './steps/StepSystemRecommendations';
import { StepExecutiveSummary } from './steps/StepExecutiveSummary';
import { StepLaunchProject } from './steps/StepLaunchProject';
import { AnimatePresence, motion } from 'motion/react';
import { Outlet, useLocation, useSearchParams } from 'react-router';
import { Toaster } from 'sonner@2.0.3';

function URLParamHandler() {
  const [searchParams] = useSearchParams();
  const { prefill } = useWizard();

  useEffect(() => {
    const service = searchParams.get('s') || undefined;
    const industry = searchParams.get('i') || undefined;
    if (service || industry) {
      prefill({ service, industry });
    }
  }, [searchParams, prefill]);

  return null;
}

function WizardStepRenderer() {
  const { state } = useWizard();

  const stepComponents: Record<number, React.ReactNode> = {
    1: <StepBusinessContext />,
    2: <StepIndustryDiagnostics />,
    3: <StepSystemRecommendations />,
    4: <StepExecutiveSummary />,
    5: <StepLaunchProject />,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state.currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
      >
        {stepComponents[state.currentStep] || stepComponents[1]}
      </motion.div>
    </AnimatePresence>
  );
}

// Shell component — wraps all wizard routes with provider
export default function WizardPage() {
  const location = useLocation();
  const isChildRoute = location.pathname !== '/wizard' && location.pathname !== '/wizard/';

  return (
    <WizardProvider>
      <URLParamHandler />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#FFFFFF',
            border: '1px solid #E8E8E4',
            color: '#1A1A1A',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
        }}
      />
      {isChildRoute ? <Outlet /> : <WizardStepRenderer />}
    </WizardProvider>
  );
}
