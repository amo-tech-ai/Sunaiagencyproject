import ProcessHeroSection from './ProcessHeroSection';
import PhaseCardsSection from './PhaseCardsSection';
import ClientInvolvementMatrix from './ClientInvolvementMatrix';
import MethodologyComparison from './MethodologyComparison';
import ProcessCTASection from './ProcessCTASection';

interface ProcessPageV12Props {
  onNavigate?: (page: string) => void;
}

export default function ProcessPageV12({ onNavigate }: ProcessPageV12Props) {
  const handleStartClick = () => {
    onNavigate?.('booking');
  };

  const handleStoriesClick = () => {
    onNavigate?.('case-studies');
  };

  return (
    <div className="bg-white">
      <ProcessHeroSection
        onStartClick={handleStartClick}
        onStoriesClick={handleStoriesClick}
      />

      <PhaseCardsSection />

      <ClientInvolvementMatrix />

      <MethodologyComparison />

      <ProcessCTASection
        onPrimaryClick={handleStartClick}
        onSecondaryClick={handleStartClick}
      />
    </div>
  );
}
