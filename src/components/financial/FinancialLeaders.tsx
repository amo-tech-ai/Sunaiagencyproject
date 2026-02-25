import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Linkedin } from 'lucide-react';

const LEADERS = [
  {
    name: 'James Crawford',
    role: 'Managing Director & Senior Partner',
    focus: 'Financial Services AI Strategy',
    image: 'https://images.unsplash.com/photo-1758599543154-76ec1c4257df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBleGVjdXRpdmUlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjAyMDI5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    name: 'Elena Ruiz',
    role: 'Partner & Director',
    focus: 'Banking & Capital Markets',
    image: 'https://images.unsplash.com/photo-1758518729459-235dcaadc611?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGV4ZWN1dGl2ZSUyMGhlYWRzaG90JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxOTkzMjkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    name: 'David Chen',
    role: 'Senior AI Architect',
    focus: 'Risk & Compliance Automation',
    image: 'https://images.unsplash.com/photo-1769628027250-d2a7a5a4eb64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBidXNpbmVzcyUyMHN1aXQlMjBwb3J0cmFpdCUyMGRpdmVyc2V8ZW58MXx8fHwxNzcyMDIwMzAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    name: 'Sarah Nguyen',
    role: 'Partner',
    focus: 'Insurance & Wealth Management',
    image: 'https://images.unsplash.com/photo-1758518727888-ffa196002e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGJ1c2luZXNzJTIwcG9ydHJhaXQlMjBjb25maWRlbnR8ZW58MXx8fHwxNzcyMDIwMzAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];

export function FinancialLeaders() {
  return (
    <section style={{ background: '#FFFFFF' }}>
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
          Meet Our Financial Services
          <br />
          Consulting Leaders
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {LEADERS.map((l) => (
            <div key={l.name} className="group">
              <div className="rounded-xl overflow-hidden mb-4" style={{ aspectRatio: '3/4' }}>
                <ImageWithFallback
                  src={l.image}
                  alt={l.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1C1C1C', marginBottom: '2px' }}>
                {l.name}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#6B6B6B', marginBottom: '2px' }}>
                {l.role}
              </p>
              <p style={{ fontSize: '0.7rem', color: '#2E6F5E', fontWeight: 500 }}>
                {l.focus}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
