import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import SolutionsHero from './solutions/SolutionsHero';
import HowItWorksSection from './solutions/HowItWorksSection';
import PremiumServiceCardsGrid from './services/PremiumServiceCardsGrid';
import ROIMetricsSection from './solutions/ROIMetricsSection';
import V2CapabilityFramework from './homev2/V2CapabilityFramework';
import TechStackShowcase from './solutions/TechStackShowcase';

export default function SolutionsPage() {
  return (
    <div>
      {/* 1 — Hero */}
      <SolutionsHero />

      {/* 2 — How It Works */}
      <HowItWorksSection />

      {/* 3 — AI Systems We Build (Premium Cards) */}
      <PremiumServiceCardsGrid />

      {/* 4 — ROI Metrics */}
      <ROIMetricsSection />

      {/* 5 — Capability Framework */}
      <V2CapabilityFramework />

      {/* 6 — Technology Stack Showcase */}
      <TechStackShowcase />

      {/* 7 — Bottom CTA */}
      <section className="border-t" style={{ backgroundColor: '#1A1A1A', borderColor: '#E8E8E4' }}>
        <div className="max-w-[1120px] mx-auto px-6 py-20 md:py-28 text-center">
          <p
            className="text-xs tracking-widest uppercase mb-4"
            style={{ color: '#00875A', letterSpacing: '0.08em' }}
          >
            Get Started
          </p>
          <h2
            className="text-2xl md:text-3xl mb-4"
            style={{
              fontFamily: 'Georgia, serif',
              fontWeight: 400,
              color: '#F5F5F0',
              lineHeight: 1.2,
            }}
          >
            Ready to build with AI?
          </h2>
          <p
            className="text-sm mb-8 max-w-md mx-auto"
            style={{ color: 'rgba(245, 245, 240, 0.55)', lineHeight: 1.6 }}
          >
            Tell us about your project and we'll scope a solution within 48 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/wizard"
              className="inline-flex items-center gap-2 px-8 py-3 text-sm transition-colors"
              style={{ backgroundColor: '#00875A', color: '#FFFFFF', borderRadius: '4px' }}
            >
              Start Your Project
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 px-8 py-3 text-sm border transition-colors"
              style={{ borderColor: 'rgba(245, 245, 240, 0.2)', color: '#F5F5F0', borderRadius: '4px' }}
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}