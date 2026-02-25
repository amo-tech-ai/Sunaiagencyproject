import { ImageWithFallback } from '../figma/ImageWithFallback';

const SERVICES = [
  {
    title: 'Smart Banking',
    desc: 'AI-powered retail and digital banking transformation',
    image: 'https://images.unsplash.com/photo-1768242079046-c9c633187db1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYmFua2luZyUyMHRlY2hub2xvZ3klMjBmaW50ZWNoJTIwaW50ZXJmYWNlfGVufDF8fHx8MTc3MjAyMDI5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    title: 'Insurance AI',
    desc: 'Claims automation, underwriting, and risk assessment',
    image: 'https://images.unsplash.com/photo-1771931322109-180bb1b35bf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnN1cmFuY2UlMjBpbmR1c3RyeSUyMHJpc2slMjBhc3Nlc3NtZW50JTIwZG9jdW1lbnR8ZW58MXx8fHwxNzcyMDIwMjk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    title: 'Wealth Management',
    desc: 'Personalized advisory and portfolio intelligence',
    image: 'https://images.unsplash.com/photo-1768055104895-e6185762f2a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWFsdGglMjBtYW5hZ2VtZW50JTIwaW52ZXN0bWVudCUyMHBvcnRmb2xpbyUyMGNoYXJ0c3xlbnwxfHx8fDE3NzIwMjAyOTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    title: 'Risk & Compliance',
    desc: 'Automated regulatory compliance and risk monitoring',
    image: 'https://images.unsplash.com/photo-1742252124908-85a4103c2df6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBjb21wbGlhbmNlJTIwcmVndWxhdGlvbiUyMGdvdmVybmFuY2V8ZW58MXx8fHwxNzcyMDIwMjk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    title: 'Data & Analytics',
    desc: 'Real-time dashboards and predictive financial models',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZmluYW5jaWFsJTIwZGFzaGJvYXJkJTIwc2NyZWVufGVufDF8fHx8MTc3MjAyMDI5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    title: 'Payments & Processing',
    desc: 'Digital payment orchestration and fraud detection',
    image: 'https://images.unsplash.com/photo-1726066012604-a309bd0575df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXltZW50cyUyMHByb2Nlc3NpbmclMjBkaWdpdGFsJTIwdHJhbnNhY3Rpb258ZW58MXx8fHwxNzcyMDIwMjk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];

export function FinancialServiceCards() {
  return (
    <section style={{ background: '#FFFFFF' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-20">
        <h2
          className="tracking-tight mb-10"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
            fontWeight: 600,
            lineHeight: 1.2,
            color: '#1C1C1C',
          }}
        >
          Our Financial Sector Services
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {SERVICES.map((s) => (
            <div key={s.title} className="group cursor-pointer">
              <div className="rounded-xl overflow-hidden mb-3" style={{ aspectRatio: '1' }}>
                <ImageWithFallback
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1C1C1C', marginBottom: '2px' }}>
                {s.title}
              </h3>
              <p style={{ fontSize: '0.75rem', lineHeight: 1.4, color: '#6B6B6B' }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
