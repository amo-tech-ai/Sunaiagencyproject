import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import SolutionsHero from './solutions/SolutionsHero';
import HowItWorksSection from './solutions/HowItWorksSection';
import PremiumServiceCardsGrid from './services/PremiumServiceCardsGrid';
import ROIMetricsSection from './solutions/ROIMetricsSection';
import V2CapabilityFramework from './homev2/V2CapabilityFramework';

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

      {/* 6 — Bottom CTA */}
      <section className="bg-[#0A211F] py-24 sm:py-32 relative overflow-hidden">
        {/* Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(132,204,22,0.04) 0%, transparent 60%)',
          }}
        />

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 text-center">
          <p
            className="text-[#84CC16]/50 uppercase tracking-[0.25em] mb-4"
            style={{ fontSize: '0.65rem', fontWeight: 600 }}
          >
            Get Started
          </p>
          <h2
            className="text-[#F1EEEA] tracking-tight mb-5"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
              fontWeight: 600,
              lineHeight: 1.15,
            }}
          >
            Ready to build with{' '}
            <span style={{ fontStyle: 'italic' }}>AI</span>?
          </h2>
          <p
            className="text-[#F1EEEA]/35 mb-10 max-w-md mx-auto"
            style={{ fontSize: '1rem', lineHeight: 1.6 }}
          >
            Tell us about your project and we'll scope a solution within 48
            hours.
          </p>
          <Link
            to="/booking"
            className="group inline-flex items-center gap-2.5 bg-[#84CC16] text-[#0A211F] px-8 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_40px_8px_rgba(132,204,22,0.2)]"
            style={{ fontSize: '0.9rem', fontWeight: 600 }}
          >
            Book a Consultation
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
