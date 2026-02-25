import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const EXPLORE_ITEMS = [
  {
    title: 'Our Latest Thinking on Financial Institutions',
    desc: 'Deep-dive publications on AI adoption, digital transformation, and competitive strategy for financial services.',
    image: 'https://images.unsplash.com/photo-1708085342347-6d0dd245f90e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGJ1aWxkaW5nJTIwc3VzdGFpbmFibGUlMjBhcmNoaXRlY3R1cmUlMjBtb2Rlcm58ZW58MXx8fHwxNzcyMDIwMjk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    overlay: true,
    to: '/case-studies',
  },
  {
    title: 'Unlocking the Potential of Data in Financial Services',
    desc: 'How data-driven strategies and AI analytics are creating new competitive advantages.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZmluYW5jaWFsJTIwZGFzaGJvYXJkJTIwc2NyZWVufGVufDF8fHx8MTc3MjAyMDI5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    overlay: false,
    to: '/case-studies',
  },
];

export function FinancialExploreMore() {
  return (
    <section style={{ background: '#FFFFFF' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-20">
        <h2
          className="tracking-tight mb-10"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            fontWeight: 600,
            lineHeight: 1.15,
            color: '#1C1C1C',
          }}
        >
          Explore More
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First card: overlay style with text on image */}
          <Link
            to={EXPLORE_ITEMS[0].to}
            className="group relative rounded-2xl overflow-hidden"
            style={{ aspectRatio: '16/10' }}
          >
            <ImageWithFallback
              src={EXPLORE_ITEMS[0].image}
              alt={EXPLORE_ITEMS[0].title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, rgba(30,61,54,0.75) 0%, rgba(30,61,54,0.45) 100%)' }}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-7">
              <span
                className="inline-block px-2.5 py-1 rounded-full mb-3 self-start"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', fontSize: '0.65rem', fontWeight: 600, color: '#FFFFFF' }}
              >
                Featured
              </span>
              <h3 className="text-white mb-2" style={{ fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.3 }}>
                {EXPLORE_ITEMS[0].title}
              </h3>
              <p style={{ fontSize: '0.8rem', lineHeight: 1.5, color: 'rgba(255,255,255,0.7)' }}>
                {EXPLORE_ITEMS[0].desc}
              </p>
            </div>
          </Link>

          {/* Second card: standard card style */}
          <Link
            to={EXPLORE_ITEMS[1].to}
            className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
            style={{ background: '#F4F3EE', border: '1px solid rgba(0,0,0,0.06)' }}
          >
            <div className="overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <ImageWithFallback
                src={EXPLORE_ITEMS[1].image}
                alt={EXPLORE_ITEMS[1].title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1C1C1C', lineHeight: 1.3, marginBottom: '6px' }}>
                {EXPLORE_ITEMS[1].title}
              </h3>
              <p style={{ fontSize: '0.8rem', lineHeight: 1.55, color: '#6B6B6B' }}>
                {EXPLORE_ITEMS[1].desc}
              </p>
              <span
                className="inline-flex items-center gap-1.5 mt-4"
                style={{ fontSize: '0.8rem', fontWeight: 500, color: '#2E6F5E' }}
              >
                Read More <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
