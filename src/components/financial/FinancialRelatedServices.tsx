import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';

const RELATED = [
  'AI Agent Systems',
  'AI Chatbots',
  'WhatsApp AI Automation',
  'AI Sales & Marketing CRM',
  'Custom AI Development',
  'AI-Powered Web Development',
];

export function FinancialRelatedServices() {
  return (
    <section style={{ background: '#FFFFFF' }}>
      <div className="max-w-[1200px] mx-auto px-6 pb-16">
        <h3
          className="mb-5"
          style={{ fontSize: '1rem', fontWeight: 600, color: '#1C1C1C' }}
        >
          Related Services
        </h3>
        <div className="flex flex-wrap gap-3">
          {RELATED.map((s) => (
            <Link
              key={s}
              to="/solutions"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all duration-300 hover:border-[#2E6F5E] hover:text-[#2E6F5E]"
              style={{
                borderColor: '#E5E5E5',
                fontSize: '0.8rem',
                fontWeight: 500,
                color: '#1C1C1C',
              }}
            >
              {s}
              <ArrowRight className="w-3 h-3" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
