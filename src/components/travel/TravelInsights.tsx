// C-T08 — Travel Insights Cards
// BCG design system: white bg, charcoal text, Georgia serif, green hover, 4px radius

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const insights = [
  { gradient: 'from-amber-600 to-orange-700', tag: 'TRAVEL', date: 'February 2026', headline: '86% of Travelers Use AI for Bookings — Is Your Property Visible?' },
  { gradient: 'from-blue-700 to-blue-900', tag: 'AGENTIC AI', date: 'January 2026', headline: 'McKinsey: Agentic AI Will Redefine Travel Within 3 Years' },
  { gradient: 'from-teal-600 to-teal-800', tag: 'PRICING', date: 'January 2026', headline: 'Dynamic Pricing Is Adding 10-20% Revenue for Travel Companies' },
  { gradient: 'from-purple-700 to-indigo-800', tag: 'DISRUPTION', date: 'December 2025', headline: 'How AI Predicts Flight Delays 2 Hours Before Airlines Announce' },
];

export default function TravelInsights() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="border-t" style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E8E4' }}>
      <div className="max-w-[1120px] mx-auto px-6 py-20 lg:py-28">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="mb-14">
          <h2 className="text-3xl lg:text-4xl" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
            Explore Our Insights on Travel AI
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group cursor-pointer border overflow-hidden transition-colors hover:border-[#00875A]"
              style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}
            >
              <div className={`h-48 bg-gradient-to-br ${insight.gradient} p-5 flex items-end`}>
                <span className="inline-block px-3 py-1 bg-white/90 text-xs tracking-widest uppercase" style={{ color: '#1A1A1A', borderRadius: '4px', letterSpacing: '0.06em' }}>
                  {insight.tag}
                </span>
              </div>
              <div className="p-5" style={{ backgroundColor: '#F5F5F0' }}>
                <p className="text-xs mb-2" style={{ color: '#6B6B63' }}>{insight.date}</p>
                <h3 className="text-base leading-snug" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>{insight.headline}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.5 }} className="mt-10 text-center">
          <button className="group inline-flex items-center gap-2 text-sm transition-colors" style={{ color: '#00875A' }}>
            See more insights
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
