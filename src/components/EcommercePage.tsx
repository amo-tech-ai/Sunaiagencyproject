import {
  EcommerceHero,
  EcommerceIntro,
  EcommerceStats,
  EcommerceApproach,
  EcommerceFramework,
  EcommerceServiceCards,
  EcommerceROIChart,
  EcommerceTools,
  EcommerceSuggestedServices,
  EcommerceInsights,
  EcommerceRelatedServices,
  EcommerceCTA,
} from './ecommerce';

interface EcommercePageProps {
  onNavigate?: (page: string) => void;
}

export default function EcommercePage({ onNavigate }: EcommercePageProps) {
  const handleCTAClick = () => {
    if (onNavigate) {
      onNavigate('booking');
    }
  };

  return (
    <div className="bg-white">
      {/* Section 1: Hero */}
      <EcommerceHero onCTAClick={handleCTAClick} />

      {/* Section 2: Introduction Copy */}
      <EcommerceIntro />

      {/* Section 3: Key Stats */}
      <EcommerceStats />

      {/* Section 4: Our Approach */}
      <EcommerceApproach />

      {/* Section 5: Framework (3 Tabs) */}
      <EcommerceFramework />

      {/* Section 6: Service Cards (6 Cards in 3×2 Grid) */}
      <EcommerceServiceCards />

      {/* Section 7: ROI Chart (Exhibit 1) */}
      <EcommerceROIChart />

      {/* Section 8: Tools & Resources */}
      <EcommerceTools />

      {/* Section 9: Suggested Additional Services */}
      <EcommerceSuggestedServices />

      {/* Section 10: Insights Cards */}
      <EcommerceInsights />

      {/* Section 11: Related Services */}
      <EcommerceRelatedServices />

      {/* Section 12: CTA Band */}
      <EcommerceCTA onCTAClick={handleCTAClick} />
    </div>
  );
}
