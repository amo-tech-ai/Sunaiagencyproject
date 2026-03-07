// C-T01 — Travel Industry Hero
// BCG design system: off-white bg, charcoal text, Georgia serif, green accents, 4px radius

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import travelHeroImg from 'figma:asset/7b4e2c3233a64b91b8250504a9f4200e8bd53ae6.png';

interface TravelHeroProps {
  onNavigate?: (page: string) => void;
}

export default function TravelHero({ onNavigate }: TravelHeroProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="pt-32 pb-24 lg:pb-32" style={{ backgroundColor: '#F5F5F0' }}>
      <div className="max-w-[1120px] mx-auto px-6">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-sm" style={{ color: '#6B6B63' }}>
            <button onClick={() => onNavigate?.('industries')} className="hover:text-[#1A1A1A] transition-colors">
              Industries
            </button>
            <span>&rsaquo;</span>
            <span style={{ color: '#1A1A1A' }}>Travel & Tourism</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Industry Tag */}
              <span
                className="inline-block px-4 py-2 text-xs tracking-widest uppercase mb-6"
                style={{ backgroundColor: '#00875A', color: '#FFFFFF', borderRadius: '4px', letterSpacing: '0.08em' }}
              >
                AI for Travel
              </span>

              {/* Headline */}
              <h1 className="text-4xl lg:text-5xl mb-6" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A', lineHeight: 1.08 }}>
                Travel & Tourism
              </h1>

              {/* Subheadline */}
              <p className="text-lg lg:text-xl leading-relaxed mb-8" style={{ color: '#6B6B63' }}>
                AI agents are replacing the search-compare-book cycle with single-message trip planning. 86% of travelers have already used AI for accommodations. Dynamic pricing increases revenue 10-20%. And agentic AI is creating a new channel where trips are planned, booked, and managed without a single tab opened.
              </p>

              {/* CTA */}
              <button
                onClick={() => onNavigate?.('booking')}
                className="group inline-flex items-center gap-3 px-8 py-4 transition-colors"
                style={{ backgroundColor: '#00875A', color: '#FFFFFF', borderRadius: '4px' }}
              >
                Explore Travel AI Solutions
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
            style={{ borderRadius: '4px', overflow: 'hidden' }}
          >
            <img src={travelHeroImg} alt="AI-powered travel planning" className="w-full h-auto" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
