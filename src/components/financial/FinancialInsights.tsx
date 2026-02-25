import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const INSIGHTS = [
  {
    tag: 'AI in Banking',
    title: 'How AI is Reshaping Retail Banking Customer Experience',
    desc: 'From personalized product recommendations to intelligent fraud detection, AI is transforming every touchpoint in the retail banking journey.',
    image: 'https://images.unsplash.com/photo-1768242079046-c9c633187db1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYmFua2luZyUyMHRlY2hub2xvZ3klMjBmaW50ZWNoJTIwaW50ZXJmYWNlfGVufDF8fHx8MTc3MjAyMDI5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    tag: 'Compliance',
    title: 'Building Explainable AI for Financial Regulation',
    desc: 'Financial regulators demand transparency. Learn how explainable AI systems meet compliance requirements while delivering business value.',
    image: 'https://images.unsplash.com/photo-1742252124908-85a4103c2df6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBjb21wbGlhbmNlJTIwcmVndWxhdGlvbiUyMGdvdmVybmFuY2V8ZW58MXx8fHwxNzcyMDIwMjk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    tag: 'InsurTech',
    title: 'The Future of Claims Processing: AI Agents in Insurance',
    desc: 'AI agents can reduce claims processing time by up to 80% while improving accuracy and customer satisfaction scores.',
    image: 'https://images.unsplash.com/photo-1771931322109-180bb1b35bf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnN1cmFuY2UlMjBpbmR1c3RyeSUyMHJpc2slMjBhc3Nlc3NtZW50JTIwZG9jdW1lbnR8ZW58MXx8fHwxNzcyMDIwMjk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];

export function FinancialInsights() {
  return (
    <section style={{ background: '#F4F3EE' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-20">
        <h2
          className="tracking-tight mb-12"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            fontWeight: 600,
            lineHeight: 1.15,
            color: '#1C1C1C',
          }}
        >
          Explore Our Insights on the
          <br />
          Financial Services Industry
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INSIGHTS.map((insight) => (
            <Link
              key={insight.title}
              to="/case-studies"
              className="group rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)' }}
            >
              <div className="overflow-hidden" style={{ aspectRatio: '16/10' }}>
                <ImageWithFallback
                  src={insight.image}
                  alt={insight.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <span
                  className="inline-block px-2.5 py-1 rounded-full mb-3"
                  style={{ background: 'rgba(46,111,94,0.08)', fontSize: '0.65rem', fontWeight: 600, color: '#2E6F5E' }}
                >
                  {insight.tag}
                </span>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1C1C1C', lineHeight: 1.3, marginBottom: '6px' }}>
                  {insight.title}
                </h3>
                <p style={{ fontSize: '0.8rem', lineHeight: 1.55, color: '#6B6B6B' }}>
                  {insight.desc}
                </p>
                <span
                  className="inline-flex items-center gap-1 mt-4"
                  style={{ fontSize: '0.78rem', fontWeight: 500, color: '#2E6F5E' }}
                >
                  Read More <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
