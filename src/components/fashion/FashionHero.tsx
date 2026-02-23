'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface FashionHeroProps {
  onCTAClick?: () => void;
}

export default function FashionHero({ onCTAClick }: FashionHeroProps) {
  return (
    <section className="bg-[#F1EEEA] text-[#212427] pt-32 pb-24 lg:pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="text-sm tracking-wider text-[#696969] font-['Lora']">
            Industries › Fashion
          </p>
        </motion.div>

        {/* Industry Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <span className="inline-block px-4 py-2 bg-[#0A211F] text-white text-xs tracking-[0.2em] uppercase font-['Lora']">
            FASHION INDUSTRY
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-['Playfair_Display'] text-5xl lg:text-6xl mb-8 leading-[1.05]"
            >
              Fashion Industry
            </motion.h1>

            {/* Subheadline */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-12"
            >
              <p className="font-['Lora'] text-lg lg:text-xl leading-relaxed text-[#696969]">
                Amidst the rising opportunity of AI in e-commerce, production, and supply chains, 
                fashion industry leaders are rethinking customer experience, sustainability, and 
                creative processes — bringing AI into decisions that shape every collection, every 
                season, every customer interaction.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              onClick={onCTAClick}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#0A211F] text-white font-['Lora'] hover:bg-[#0d2926] transition-all duration-300"
            >
              <span className="font-medium">Explore Fashion AI Solutions</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative h-[400px] lg:h-[500px]"
          >
            <img
              src="https://images.unsplash.com/photo-1747171300760-fbc27b7afad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcnVud2F5JTIwbW9kZWwlMjBhaSUyMG92ZXJsYXl8ZW58MXx8fHwxNzcwNzYxOTEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Fashion runway with AI technology overlay"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
