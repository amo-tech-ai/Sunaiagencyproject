import { ImageWithFallback } from '../figma/ImageWithFallback';

const STATS = [
  { value: '$1B+', label: 'In operational savings delivered to financial clients through AI-powered process automation' },
  { value: '10', label: 'Financial institutions actively using our AI agent and chatbot solutions' },
  { value: '$500M', label: 'In new revenue generated through AI-driven customer acquisition and cross-selling' },
  { value: '39', label: 'Regulatory compliance workflows automated with explainable AI systems' },
];

const IMG_1 = 'https://images.unsplash.com/photo-1760346546771-a81d986459ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW0lMjBtZWV0aW5nJTIwY29ycG9yYXRlJTIwc3RyYXRlZ3l8ZW58MXx8fHwxNzcyMDIwMjkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
const IMG_2 = 'https://images.unsplash.com/photo-1718066236074-13f8cf7ae93e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBtb2Rlcm4lMjBhcmNoaXRlY3R1cmUlMjBnbGFzcyUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3MjAyMDI5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

export function FinancialClientSuccess() {
  return (
    <section style={{ background: '#1E3D36' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-24">
        {/* Heading */}
        <h2
          className="text-white tracking-tight mb-14"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
            fontWeight: 600,
            lineHeight: 1.15,
          }}
        >
          Our Clients' Success in
          <br />
          Financial Services Strategy
        </h2>

        {/* Stats grid with images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Left: stats */}
          <div className="grid grid-cols-2 gap-8">
            {STATS.map((stat) => (
              <div key={stat.value}>
                <span
                  className="block text-white"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                    fontWeight: 700,
                    lineHeight: 1.1,
                    marginBottom: '8px',
                  }}
                >
                  {stat.value}
                </span>
                <p style={{ fontSize: '0.8rem', lineHeight: 1.55, color: 'rgba(255,255,255,0.55)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Right: image */}
          <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <ImageWithFallback
              src={IMG_1}
              alt="Corporate strategy meeting"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Bottom image row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <ImageWithFallback
              src={IMG_2}
              alt="Modern office"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <ImageWithFallback
              src='https://images.unsplash.com/photo-1744782211816-c5224434614f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9jayUyMG1hcmtldCUyMHRyYWRpbmclMjBmbG9vciUyMGZpbmFuY2lhbCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzcyMDIwMjk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
              alt="Financial technology"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
