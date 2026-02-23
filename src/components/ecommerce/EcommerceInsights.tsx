'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const insights = [
  {
    tag: 'E-COMMERCE',
    tagColor: 'bg-blue-900',
    date: 'February 2026',
    headline: 'AI Agents Will Reshape E-Commerce: Every Player Must Prepare',
    gradient: 'from-blue-900 to-blue-700',
  },
  {
    tag: 'STRATEGY',
    tagColor: 'bg-teal-900',
    date: 'January 2026',
    headline: 'The Future of E-Commerce Is Already Here',
    gradient: 'from-teal-900 to-teal-700',
  },
  {
    tag: 'PERSONALIZATION',
    tagColor: 'bg-purple-900',
    date: 'January 2026',
    headline: 'Why E-Commerce Leaders Should Act Like Startups',
    gradient: 'from-purple-900 to-purple-700',
  },
  {
    tag: 'GROWTH',
    tagColor: 'bg-orange-900',
    date: 'December 2025',
    headline: 'Winning Formulas for E-Commerce Growth',
    gradient: 'from-orange-900 to-orange-700',
  },
];

export default function EcommerceInsights() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          {/* Section Header */}
          <div className="mb-12">
            <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-[#0F3D3E] mb-4">
              Latest Insights
            </h2>
            <div className="w-12 h-[3px] bg-[#84CC16]" />
          </div>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="space-y-4">
                  {/* Gradient Image Area */}
                  <div
                    className={`h-48 bg-gradient-to-br ${insight.gradient} group-hover:opacity-90 transition-opacity`}
                  />

                  {/* Content */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-block px-2 py-1 ${insight.tagColor} text-white text-xs tracking-wider uppercase font-['Lora']`}
                      >
                        {insight.tag}
                      </span>
                      <span className="text-xs text-gray-500 font-['Lora']">{insight.date}</span>
                    </div>
                    <h3 className="font-['Playfair_Display'] text-xl text-[#0F3D3E] group-hover:text-[#84CC16] transition-colors">
                      {insight.headline}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button className="inline-flex items-center gap-2 px-6 py-3 border border-[#84CC16] text-[#84CC16] font-['Lora'] hover:bg-[#84CC16] hover:text-white transition-all duration-300">
              <span>See more insights</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}