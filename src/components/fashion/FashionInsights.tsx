// C-F10 — Fashion Insights Cards
// BCG design system: off-white bg, charcoal text, Georgia serif, green accents, 4px radius

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const insights = [
  {
    tag: 'FASHION',
    date: 'February 2026',
    headline: "Virtual Try-On Is Fashion's Biggest Opportunity in 2026",
    gradient: 'from-rose-700 to-red-800',
  },
  {
    tag: 'SUSTAINABILITY',
    date: 'January 2026',
    headline: 'AI Is Finally Making Sustainable Fashion Profitable',
    gradient: 'from-green-700 to-emerald-800',
  },
  {
    tag: 'AI AGENTS',
    date: 'January 2026',
    headline: 'AI Shopping Agents Will Change How Fashion Is Sold',
    gradient: 'from-purple-700 to-violet-800',
  },
  {
    tag: 'STRATEGY',
    date: 'December 2025',
    headline: 'Increasing Market Share by Revamping Operations',
    gradient: 'from-orange-700 to-amber-800',
  },
];

export default function FashionInsights() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="border-t" style={{ backgroundColor: '#F5F5F0', borderColor: '#E8E8E4' }}>
      <div className="max-w-[1120px] mx-auto px-6 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="mb-14"
        >
          <h2 className="text-3xl lg:text-4xl" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
            Explore Our Insights on Fashion AI
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group cursor-pointer border overflow-hidden transition-colors hover:border-[#00875A]"
              style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}
            >
              {/* Gradient Image Area */}
              <div className={`h-48 bg-gradient-to-br ${insight.gradient} p-5 flex items-end`}>
                <span
                  className="inline-block px-3 py-1 bg-white/90 text-xs tracking-widest uppercase"
                  style={{ color: '#1A1A1A', borderRadius: '4px', letterSpacing: '0.06em' }}
                >
                  {insight.tag}
                </span>
              </div>

              {/* Content Area */}
              <div className="p-5" style={{ backgroundColor: '#FFFFFF' }}>
                <p className="text-xs mb-2" style={{ color: '#6B6B63' }}>{insight.date}</p>
                <h3 className="text-base leading-snug" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
                  {insight.headline}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Link */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 text-center"
        >
          <button className="group inline-flex items-center gap-2 text-sm transition-colors" style={{ color: '#00875A' }}>
            See more insights
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
