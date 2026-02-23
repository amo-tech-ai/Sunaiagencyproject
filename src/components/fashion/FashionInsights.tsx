'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const insights = [
  {
    tag: 'FASHION',
    date: 'February 2026',
    headline: 'Virtual Try-On Is Fashion\'s Biggest Opportunity in 2026',
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
    <section ref={ref} className="bg-[#F1EEEA] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-[#212427]">
            Explore Our Insights on Fashion AI
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group cursor-pointer border border-[#D4D4D4] overflow-hidden hover:border-[#0A211F] transition-colors duration-300"
            >
              {/* Gradient Image Area */}
              <div className={`h-48 bg-gradient-to-br ${insight.gradient} p-6 flex items-end`}>
                <span className="inline-block px-3 py-1 bg-white/90 text-[#212427] text-xs tracking-wider uppercase font-['Lora']">
                  {insight.tag}
                </span>
              </div>

              {/* Content Area */}
              <div className="p-6 bg-white">
                <p className="font-['Lora'] text-sm text-[#696969] mb-3">{insight.date}</p>
                <h3 className="font-['Playfair_Display'] text-xl text-[#212427] leading-tight">
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
          className="mt-12 text-center"
        >
          <button className="group inline-flex items-center gap-2 font-['Lora'] text-base text-[#212427] hover:text-[#0A211F] transition-colors">
            See more insights
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
