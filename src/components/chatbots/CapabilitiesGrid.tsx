// C-CB03 — Capabilities Grid
// BCG design system: off-white bg, charcoal text, Georgia serif, green accents, 4px radius

import {
  Clock, Brain, Database, Users, MessageSquare,
  Workflow, BarChart, Target, Sparkles, TrendingUp
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export default function CapabilitiesGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const coreCapabilities = [
    { icon: Clock, title: '24/7 Instant Responses', impact: 'No missed leads or slow replies' },
    { icon: Brain, title: 'Intent Detection', impact: 'Understands what users actually want' },
    { icon: Database, title: 'Knowledge Base Answers', impact: 'Accurate, consistent replies' },
    { icon: Users, title: 'Human Handoff', impact: 'Escalates only when needed' },
    { icon: MessageSquare, title: 'Multi-Channel', impact: 'Website, WhatsApp, Email' },
  ];

  const advancedCapabilities = [
    { icon: Workflow, title: 'Workflow Execution', impact: 'Refunds, bookings, updates handled automatically' },
    { icon: BarChart, title: 'CRM Sync', impact: 'Every conversation updates leads & contacts' },
    { icon: Target, title: 'Lead Qualification', impact: 'Sales talks only to high-intent prospects' },
    { icon: Sparkles, title: 'Personalization', impact: 'Tailored responses based on user data' },
    { icon: TrendingUp, title: 'Analytics & Insights', impact: 'See what customers ask and where deals drop' },
  ];

  return (
    <section ref={containerRef} className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: '#F5F5F0' }}>
      {/* Parallax Background Pattern */}
      <motion.div className="absolute inset-0 opacity-[0.03]" style={{ y }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, rgba(0,135,90,0.2) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(0,135,90,0.2) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
      </motion.div>

      <div className="max-w-[1120px] mx-auto px-6 relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block mb-5">
            <span className="text-xs tracking-widest uppercase" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
              Complete Platform
            </span>
          </div>

          <h2
            className="text-3xl md:text-4xl tracking-tight mb-5"
            style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}
          >
            Core Capabilities
          </h2>

          <p className="text-lg max-w-3xl mx-auto" style={{ color: '#6B6B63' }}>
            Built for immediate value and long-term scale
          </p>
        </motion.div>

        {/* Core Capabilities Section */}
        <div className="mb-20">
          <motion.div
            className="flex items-center gap-3 mb-10"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-1 h-10" style={{ backgroundColor: '#00875A' }} />
            <div>
              <h3 className="text-xs tracking-widest uppercase" style={{ color: '#6B6B63', letterSpacing: '0.06em' }}>
                Immediate Value
              </h3>
              <p className="text-sm" style={{ color: '#6B6B63' }}>Deploy these features on day one</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {coreCapabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="border bg-white p-7 h-full relative overflow-hidden group-hover:border-[#00875A] transition-all duration-300" style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}>
                  {/* Icon */}
                  <div className="relative mb-5">
                    <div className="w-14 h-14 flex items-center justify-center border bg-white group-hover:border-[#00875A] transition-colors" style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}>
                      <capability.icon className="w-7 h-7 group-hover:text-[#00875A] transition-colors" style={{ color: '#1A1A1A' }} />
                    </div>
                  </div>

                  <h4 className="text-lg mb-2" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
                    {capability.title}
                  </h4>

                  <p className="text-sm leading-relaxed" style={{ color: '#6B6B63' }}>
                    {capability.impact}
                  </p>

                  {/* Number Badge */}
                  <div className="absolute top-5 right-5 w-7 h-7 flex items-center justify-center border text-xs group-hover:border-[#00875A] group-hover:text-[#00875A] transition-colors" style={{ borderColor: '#E8E8E4', color: '#6B6B63', borderRadius: '4px' }}>
                    {index + 1}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Advanced Capabilities Section */}
        <div>
          <motion.div
            className="flex items-center gap-3 mb-10"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-1 h-10" style={{ backgroundColor: '#00875A' }} />
            <div>
              <h3 className="text-xs tracking-widest uppercase" style={{ color: '#6B6B63', letterSpacing: '0.06em' }}>
                Scale & Revenue
              </h3>
              <p className="text-sm" style={{ color: '#6B6B63' }}>Advanced features for growth</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {advancedCapabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="border bg-white p-7 h-full relative overflow-hidden group-hover:border-[#00875A] transition-all duration-300" style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}>
                  {/* Premium Badge */}
                  <div className="absolute top-3 right-3 text-white text-[10px] tracking-widest uppercase px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: '#00875A', borderRadius: '2px', letterSpacing: '0.06em' }}>
                    Pro
                  </div>

                  {/* Icon */}
                  <div className="relative mb-5">
                    <div className="w-14 h-14 flex items-center justify-center border bg-white group-hover:border-[#00875A] group-hover:bg-[#00875A] transition-all" style={{ borderColor: 'rgba(0,135,90,0.25)', borderRadius: '4px' }}>
                      <capability.icon className="w-7 h-7 group-hover:text-white transition-colors" style={{ color: '#1A1A1A' }} />
                    </div>
                  </div>

                  <h4 className="text-lg mb-2" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
                    {capability.title}
                  </h4>

                  <p className="text-sm leading-relaxed" style={{ color: '#6B6B63' }}>
                    {capability.impact}
                  </p>

                  {/* Sequence Badge */}
                  <div className="absolute top-5 left-5 w-7 h-7 flex items-center justify-center text-white text-xs" style={{ backgroundColor: '#00875A', borderRadius: '4px' }}>
                    {index + 6}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {[
            { number: '10', label: 'Core + Advanced Features', suffix: '' },
            { number: '24', label: 'Hours Daily Operation', suffix: '/7' },
            { number: '60', label: 'Conversations Automated', suffix: '%+' }
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-7 border bg-white hover:border-[#00875A] transition-colors"
              style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}
            >
              <div className="text-4xl mb-2" style={{ fontFamily: 'Georgia, serif', color: '#00875A' }}>
                {stat.number}<span className="text-2xl">{stat.suffix}</span>
              </div>
              <div className="text-xs tracking-widest uppercase" style={{ color: '#6B6B63', letterSpacing: '0.06em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
