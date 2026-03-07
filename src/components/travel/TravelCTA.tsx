// C-T09 — Travel CTA Section
// BCG design system dark variant: charcoal bg, white text, Georgia serif, green CTA, 4px radius

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

interface TravelCTAProps {
  onNavigate?: (page: string) => void;
}

export default function TravelCTA({ onNavigate }: TravelCTAProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="border-t" style={{ backgroundColor: '#1A1A1A', borderColor: '#E8E8E4' }}>
      <div className="max-w-[900px] mx-auto px-6 py-20 lg:py-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-7"
        >
          <h2 className="text-3xl lg:text-4xl" style={{ fontFamily: 'Georgia, serif', color: '#F5F5F0', lineHeight: 1.15 }}>
            Ready to make your travel business AI-powered?
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>
            Get a personalized travel AI readiness assessment covering dynamic pricing, AI agents, personalization, and AEO strategy.
          </p>
          <button
            onClick={() => onNavigate?.('booking')}
            className="group inline-flex items-center gap-3 px-8 py-4 transition-colors"
            style={{ backgroundColor: '#00875A', color: '#FFFFFF', borderRadius: '4px' }}
          >
            Book Your Travel AI Assessment
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
