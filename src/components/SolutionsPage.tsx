import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import PremiumServiceCardsGrid from './services/PremiumServiceCardsGrid';

export default function SolutionsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0F3D3E] pt-20 pb-10 sm:pt-28 sm:pb-14">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="max-w-3xl">
            <p
              className="text-[#F1EEEA]/50 uppercase tracking-[0.2em] mb-5"
              style={{ fontSize: '0.75rem', fontWeight: 500 }}
            >
              Sun AI Agency
            </p>
            <h1
              className="text-[#F1EEEA] tracking-tight mb-6"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(2.25rem, 5.5vw, 3.5rem)',
                fontWeight: 600,
                lineHeight: 1.08,
              }}
            >
              Premium AI services that
              <br />
              <span className="text-[#F1EEEA]/35">transform operations</span>
            </h1>
            <p
              className="text-[#F1EEEA]/45 leading-relaxed max-w-xl mb-10"
              style={{ fontSize: '1.1rem' }}
            >
              We build production-grade AI systems — agents, chatbots, CRM
              automation, and custom development — engineered to deliver
              enterprise-level results.
            </p>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 bg-[#F1EEEA] text-[#0A211F] px-7 py-3.5 rounded-full hover:bg-[#F1EEEA]/90 transition-colors duration-200"
              style={{ fontSize: '0.925rem', fontWeight: 500 }}
            >
              Start a project
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Premium Service Cards */}
      <PremiumServiceCardsGrid />

      {/* Bottom CTA */}
      <section className="bg-[#0F3D3E] py-20 sm:py-28">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <h2
            className="text-[#F1EEEA] tracking-tight mb-5"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
              fontWeight: 600,
              lineHeight: 1.15,
            }}
          >
            Ready to build with AI?
          </h2>
          <p
            className="text-[#F1EEEA]/40 mb-8 max-w-md mx-auto"
            style={{ fontSize: '1rem' }}
          >
            Tell us about your project and we'll scope a solution within 48
            hours.
          </p>
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 bg-[#F1EEEA] text-[#0A211F] px-8 py-3.5 rounded-full hover:bg-[#F1EEEA]/90 transition-colors duration-200"
            style={{ fontSize: '0.925rem', fontWeight: 500 }}
          >
            Book a Consultation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
