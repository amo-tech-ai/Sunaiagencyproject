import { useNavigate } from 'react-router';
import { pageToPath } from '../../../lib/navigation';
import ProcessHeroSection from './ProcessHeroSection';
import PhaseCardsSection from './PhaseCardsSection';
import ClientInvolvementMatrix from './ClientInvolvementMatrix';
import MethodologyComparison from './MethodologyComparison';
import ProcessCTASection from './ProcessCTASection';

export default function ProcessPageV12() {
  const nav = useNavigate();

  const handleStartClick = () => {
    nav(pageToPath('booking'));
  };

  const handleStoriesClick = () => {
    nav(pageToPath('case-studies'));
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
