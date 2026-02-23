import { useNavigate } from 'react-router';
import { pageToPath } from '../lib/navigation';
import {
  FashionHero,
  FashionIntro,
  FashionStats,
  FashionApproach,
  FashionFramework,
  FashionServiceCards,
  FashionROIChart,
  FashionValueChain,
  FashionSuggestedServices,
  FashionInsights,
  FashionRelatedServices,
  FashionCTA,
} from './fashion';

export default function FashionPage() {
  const nav = useNavigate();

  const handleCTAClick = () => {
    nav(pageToPath('booking'));
  };

  return (
    <div className="bg-white">
      {/* Section 1: Hero */}
      <FashionHero onCTAClick={handleCTAClick} />

      {/* Section 2: Introduction Copy */}
      <FashionIntro />

      {/* Section 3: Industry Analysis - Key Stats */}
      <FashionStats />

      {/* Section 4: Our Approach */}
      <FashionApproach />

      {/* Section 5: Framework (3 Tabs) */}
      <FashionFramework />

      {/* Section 6: Service Cards (6 Cards in 3x2 Grid) */}
      <FashionServiceCards />

      {/* Section 7: ROI Chart (Exhibit 3) */}
      <FashionROIChart />

      {/* Section 8: Fashion AI Value Chain */}
      <FashionValueChain />

      {/* Section 9: Suggested Additional Services */}
      <FashionSuggestedServices />

      {/* Section 10: Insights Cards */}
      <FashionInsights />

      {/* Section 11: Related Services */}
      <FashionRelatedServices />

      {/* Section 12: CTA Band */}
      <FashionCTA onCTAClick={handleCTAClick} />
    </div>
  );
}
