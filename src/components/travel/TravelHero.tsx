'use client';

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
    <section ref={ref} className="bg-[#F1EEEA] pt-32 pb-24 lg:pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 font-['Lora'] text-sm text-[#696969]">
            <button onClick={() => onNavigate?.('industries')} className="hover:text-[#212427]">
              Industries
            </button>
            <span>›</span>
            <span className="text-[#212427]">Travel & Tourism</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Industry Tag */}
              <div className="inline-block px-4 py-2 bg-[#7EF473] text-[#212427] font-['Lora'] text-sm tracking-wider uppercase mb-6">
                AI FOR TRAVEL
              </div>

              {/* Headline */}
              <h1 className="font-['Playfair_Display'] text-5xl lg:text-6xl text-[#212427] mb-6">
                Travel & Tourism
              </h1>

              {/* Subheadline */}
              <p className="font-['Lora'] text-lg lg:text-xl text-[#696969] leading-relaxed mb-8">
                AI agents are replacing the search-compare-book cycle with single-message trip planning. 86% of travelers have already used AI for accommodations. Dynamic pricing increases revenue 10–20%. And agentic AI is creating a new channel where trips are planned, booked, and managed without a single tab opened.
              </p>

              {/* CTA */}
              <button 
                onClick={() => onNavigate?.('booking')}
                className="group inline-flex items-center gap-3 bg-[#7EF473] text-[#212427] px-8 py-4 font-['Lora'] text-base hover:bg-[#6de362] transition-colors"
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
          >
            <img
              src={travelHeroImg}
              alt="AI-powered travel planning"
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
