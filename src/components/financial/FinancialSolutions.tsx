import { Link } from 'react-router';
import { ArrowRight, Bot, Brain, Shield, Zap, BarChart3 } from 'lucide-react';

const SOLUTIONS = [
  { icon: Bot, title: 'CRM by AI CX', desc: 'AI-powered customer relationship management for financial advisors', to: '/solutions' },
  { icon: Brain, title: 'FinGenius', desc: 'Intelligent document processing and compliance automation', to: '/solutions' },
  { icon: Zap, title: 'FTR (Fintech)', desc: 'Fast-track regulatory submissions with AI document analysis', to: '/solutions' },
  { icon: Shield, title: 'Smart Banking AI', desc: 'Conversational banking with fraud detection and personalized advice', to: '/solutions' },
  { icon: BarChart3, title: 'FinTech Annual Report', desc: 'Automated annual report generation with data narratives', to: '/solutions' },
];

export function FinancialSolutions() {
  return (
    <section style={{ background: '#F4F3EE' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-20">
        <h2
          className="tracking-tight mb-3"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
            fontWeight: 600,
            lineHeight: 1.2,
            color: '#1C1C1C',
          }}
        >
          Our Solutions for the Financial Services Industry
        </h2>
        <p className="mb-10" style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#6B6B6B' }}>
          Purpose-built AI tools and platforms designed specifically for financial services workflows.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {SOLUTIONS.map((s) => (
            <Link
              key={s.title}
              to={s.to}
              className="group flex flex-col items-center text-center p-5 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(46,111,94,0.08)' }}
              >
                <s.icon className="w-5 h-5" style={{ color: '#2E6F5E' }} />
              </div>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1C1C1C', marginBottom: '4px' }}>
                {s.title}
              </h3>
              <p style={{ fontSize: '0.7rem', lineHeight: 1.4, color: '#6B6B6B' }}>
                {s.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
