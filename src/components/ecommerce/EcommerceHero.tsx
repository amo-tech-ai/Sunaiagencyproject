'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface EcommerceHeroProps {
  onCTAClick?: () => void;
}

export default function EcommerceHero({ onCTAClick }: EcommerceHeroProps) {
  return (
    <section className="relative bg-[#0F3D3E] text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1569484221992-2a453658fff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBzaG9wcGluZyUyMG1vYmlsZSUyMHBob25lJTIwYWklMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3MDc2MTMxM3ww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="AI Shopping Experience"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0F3D3E]/85" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32 lg:py-40">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="text-sm tracking-wider text-white/70 font-['Lora']">
            Industries › E-Commerce
          </p>
        </motion.div>

        {/* Industry Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <span className="inline-block px-4 py-2 border border-[#84CC16] text-[#84CC16] text-xs tracking-[0.2em] uppercase font-['Lora']">
            AI FOR E-COMMERCE
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-['Playfair_Display'] text-6xl lg:text-7xl mb-8 leading-[1.05]"
        >
          E-Commerce
        </motion.h1>

        {/* Subheadline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mb-12"
        >
          <p className="font-['Lora'] text-xl lg:text-2xl leading-relaxed text-white/90">
            Many companies have seen gains from e-commerce AI — but fewer have achieved the 
            transformational results they seek. By combining AI agents, hyper-personalization, 
            and conversational commerce, we help businesses set and enable a bold vision for 
            their online channels.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onClick={onCTAClick}
          className="group inline-flex items-center gap-3 px-8 py-4 bg-[#84CC16] text-[#0F3D3E] font-['Lora'] hover:bg-[#65A30D] transition-all duration-300"
        >
          <span className="font-medium">Book a Strategy Call</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </section>
  );
}
