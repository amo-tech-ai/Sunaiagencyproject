import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Database, Target, Send, CheckCircle, ChevronRight } from 'lucide-react';

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const pipelineFlow = [
    'Channels',
    'Enrichment',
    'ICP Match',
    'Score',
    'Outreach',
    'Meeting',
    'Proposal',
    'Contract',
    'Win/Loss'
  ];

  const steps = [
    {
      icon: Database,
      title: 'Capture',
      description: 'Unify every channel into one source of truth'
    },
    {
      icon: Target,
      title: 'Score',
      description: 'Confidence-weighted ICP scoring'
    },
    {
      icon: Send,
      title: 'Engage',
      description: 'Personalized outreach + follow-ups + booking'
    },
    {
      icon: CheckCircle,
      title: 'Close',
      description: 'Proposal + contract tracking + analytics'
    }
  ];

  return (
    <section ref={ref} className="py-24 lg:py-32" style={{ backgroundColor: '#F1EEEA' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          {/* Eyebrow */}
          <div className="mb-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#7EF473] font-semibold" style={{ fontFamily: 'system-ui, -apple-system' }}>
              THE SYSTEM
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl lg:text-6xl mb-6 text-[#0E3E1B]"
              style={{ fontFamily: 'Georgia, serif' }}>
            Capture. Score. Engage. Close.
          </h2>

          {/* Body */}
          <p className="text-lg text-[#0E3E1B]/70 leading-relaxed max-w-3xl mx-auto"
             style={{ fontFamily: 'system-ui, -apple-system' }}>
            Our CRM is a four-stage intelligent pipeline. Every lead is captured, enriched, scored, engaged, and moved to close — automatically. Your team only touches deals that require human judgment.
          </p>
        </motion.div>

        {/* Pipeline Flow Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-white/60 backdrop-blur-sm border border-[#0E3E1B]/10 rounded-2xl p-8 shadow-lg">
            {/* Desktop - Horizontal Flow */}
            <div className="hidden lg:flex items-center justify-between gap-2">
              {pipelineFlow.map((stage, index) => (
                <div key={index} className="flex items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                      stage === 'Score' 
                        ? 'bg-[#7EF473] text-[#0E3E1B] shadow-lg shadow-[#7EF473]/30' 
                        : 'bg-white/80 text-[#0E3E1B]/70'
                    }`}
                    style={{ fontFamily: 'system-ui, -apple-system' }}
                  >
                    {stage}
                  </motion.div>
                  
                  {index < pipelineFlow.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-[#0E3E1B]/30 mx-1 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Mobile - Vertical Flow */}
            <div className="lg:hidden space-y-3">
              {pipelineFlow.map((stage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="text-[#0E3E1B]/40 text-xs font-bold w-6" style={{ fontFamily: 'system-ui, -apple-system' }}>
                    {(index + 1).toString().padStart(2, '0')}
                  </div>
                  <div
                    className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold ${
                      stage === 'Score' 
                        ? 'bg-[#7EF473] text-[#0E3E1B]' 
                        : 'bg-white/80 text-[#0E3E1B]/70'
                    }`}
                    style={{ fontFamily: 'system-ui, -apple-system' }}
                  >
                    {stage}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Caption */}
            <div className="mt-6 pt-6 border-t border-[#0E3E1B]/10 text-center">
              <p className="text-xs text-[#0E3E1B]/60 uppercase tracking-wider font-semibold"
                 style={{ fontFamily: 'system-ui, -apple-system' }}>
                <span className="text-[#7EF473]">Score</span> stage highlighted — the AI differentiator
              </p>
            </div>
          </div>
        </motion.div>

        {/* 4 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
              className="bg-white border border-[#0E3E1B]/10 rounded-2xl p-6 hover:-translate-y-1 hover:border-[#7EF473]/50 transition-all duration-300 shadow-sm"
            >
              {/* Step Number */}
              <div className="text-[#7EF473] text-sm font-bold mb-4" style={{ fontFamily: 'system-ui, -apple-system' }}>
                {(index + 1).toString().padStart(2, '0')}
              </div>

              {/* Icon */}
              <div className="w-12 h-12 bg-[#7EF473]/10 rounded-xl flex items-center justify-center mb-4">
                <step.icon className="w-6 h-6 text-[#0E3E1B]" strokeWidth={1.5} />
              </div>

              {/* Title */}
              <h3 className="text-2xl text-[#0E3E1B] mb-3"
                  style={{ fontFamily: 'Georgia, serif' }}>
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-[#0E3E1B]/70 text-sm leading-relaxed"
                 style={{ fontFamily: 'system-ui, -apple-system' }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
