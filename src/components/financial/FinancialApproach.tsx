import { Link } from 'react-router';
import { ArrowRight, ChevronRight } from 'lucide-react';

const TOPICS = [
  'A Holistic Approach to Financial Services Digitization',
  'Roadmap for Sustainability, Climate Impact, and Financial Services',
  'Building Competitive Advantage Through Risk and Compliance',
];

export function FinancialApproach() {
  return (
    <section style={{ background: '#FFFFFF' }}>
      <div className="max-w-[1200px] mx-auto px-6 pb-24">
        <h2
          className="tracking-tight mb-5"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            fontWeight: 600,
            lineHeight: 1.15,
            color: '#1C1C1C',
          }}
        >
          Our Approach to Reimagining
          <br />
          Finance
        </h2>

        <p
          className="max-w-3xl mb-6"
          style={{ fontSize: '0.9rem', lineHeight: 1.75, color: '#6B6B6B' }}
        >
          Financial institutions face unprecedented pressure to innovate while maintaining regulatory compliance and
          operational resilience. Our approach combines deep sector expertise with cutting-edge AI capabilities to
          deliver transformative outcomes across the value chain — from customer acquisition and servicing to risk
          management and back-office operations.
        </p>

        <p
          className="max-w-3xl mb-8"
          style={{ fontSize: '0.9rem', lineHeight: 1.75, color: '#6B6B6B' }}
        >
          We work with banks, insurers, asset managers, and fintech companies to design and deploy AI systems that
          are explainable, auditable, and production-ready — meeting the highest standards of financial regulation.
        </p>

        {/* Topics */}
        <div className="mb-3">
          <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6B6B6B', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '12px' }}>
            Featured Topics
          </p>
        </div>
        <div className="space-y-3">
          {TOPICS.map((topic) => (
            <Link
              key={topic}
              to="/solutions"
              className="flex items-center gap-2 group transition-colors duration-200 hover:text-[#2E6F5E]"
              style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1C1C1C' }}
            >
              <ChevronRight className="w-4 h-4 text-[#2E6F5E]" />
              {topic}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
