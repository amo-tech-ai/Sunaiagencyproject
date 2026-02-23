import HeroSection from './home/HeroSection';
import ProofSection from './home/ProofSection';
import ServicesGrid from './home/ServicesGrid';
import IndustriesList from './home/IndustriesList';
import ApproachSection from './home/ApproachSection';
import FeatureSection from './home/FeatureSection';
import CTASection from './home/CTASection';
import HowItWorksCarousel from './HowItWorksCarousel';
import { SERVICES, INDUSTRIES, METRICS } from '../lib/constants';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      
      <ProofSection metrics={METRICS} />
      
      <ServicesGrid services={SERVICES} />
      
      <IndustriesList industries={INDUSTRIES} />
      
      <ApproachSection />
      
      <HowItWorksCarousel />
      
      <FeatureSection
        eyebrow="AI Development"
        headline="Custom solutions built for your business"
        description="We don't believe in one-size-fits-all. Every project is tailored to your specific needs and goals."
        features={[
          'Dedicated team of AI engineers and strategists',
          'Regular updates and transparent communication',
          'Flexible development cycles that adapt to your feedback',
          'Post-launch support and continuous optimization',
        ]}
      />
      
      <FeatureSection
        eyebrow="Real Results"
        headline="Proven track record of success"
        description="Our clients see measurable improvements in efficiency, revenue, and customer satisfaction."
        features={[
          'Average 3x ROI within first year',
          'Systems deployed across 50+ industries',
          '98% client satisfaction rate',
          'Long-term partnerships, not one-off projects',
        ]}
        imageSide="left"
      />
      
      <CTASection darkMode={true} />
    </div>
  );
}
