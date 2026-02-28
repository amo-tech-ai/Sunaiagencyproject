import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export default function DeliveryProcess() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const steps = [
    {
      number: '01',
      title: 'Scope & Architecture',
      timeline: 'Week 1–2',
      description: 'Define requirements, design system architecture, plan AI integrations.'
    },
    {
      number: '02',
      title: 'Design & Prototype',
      timeline: 'Week 2–3',
      description: 'Create high-fidelity designs, validate flows, build interactive prototypes.'
    },
    {
      number: '03',
      title: 'Build & Integrate AI',
      timeline: 'Week 3–5',
      description: 'Develop core features, integrate AI capabilities, implement workflows.'
    },
    {
      number: '04',
      title: 'Launch & Optimize',
      timeline: 'Week 5–6',
      description: 'Deploy to production, monitor performance, optimize based on real data.'
    }
  ];

  return (
    <section ref={ref} className="py-24 lg:py-32" style={{ backgroundColor: '#FAF9F5' }}>
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
              PROCESS
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl lg:text-6xl mb-6 text-[#0E3E1B]"
              style={{ fontFamily: 'Georgia, serif' }}>
            From Concept to Production in Weeks
          </h2>
        </motion.div>

        {/* Desktop Timeline - Horizontal */}
        <div className="hidden lg:block">
          {/* Timeline Line */}
          <div className="relative mb-20">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="absolute top-8 left-0 right-0 h-px bg-[#7EF473]/30"
              style={{ transformOrigin: 'left' }}
            />

            {/* Steps */}
            <div className="relative grid grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.15 }}
                  className="relative"
                >
                  {/* Circle Marker */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-[#7EF473] rounded-full flex items-center justify-center shadow-lg relative z-10">
                      <span className="text-[#0E3E1B] text-xl font-bold" style={{ fontFamily: 'system-ui, -apple-system' }}>
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="bg-white/60 backdrop-blur-sm border border-[#0E3E1B]/10 rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 shadow-sm">
                    <div className="text-xs uppercase tracking-wider text-[#7EF473] mb-2 font-semibold"
                         style={{ fontFamily: 'system-ui, -apple-system' }}>
                      {step.timeline}
                    </div>
                    <h3 className="text-xl mb-3 text-[#0E3E1B]"
                        style={{ fontFamily: 'Georgia, serif' }}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#0E3E1B]/70 leading-relaxed"
                       style={{ fontFamily: 'system-ui, -apple-system' }}>
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Timeline - Vertical */}
        <div className="lg:hidden">
          <div className="relative">
            {/* Vertical Line */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="absolute left-8 top-0 bottom-0 w-px bg-[#7EF473]/30"
              style={{ transformOrigin: 'top' }}
            />

            {/* Steps */}
            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.15 }}
                  className="relative flex gap-6"
                >
                  {/* Circle Marker */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-[#7EF473] rounded-full flex items-center justify-center shadow-lg relative z-10">
                      <span className="text-[#0E3E1B] text-xl font-bold" style={{ fontFamily: 'system-ui, -apple-system' }}>
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 bg-white/60 backdrop-blur-sm border border-[#0E3E1B]/10 rounded-2xl p-6 shadow-sm">
                    <div className="text-xs uppercase tracking-wider text-[#7EF473] mb-2 font-semibold"
                         style={{ fontFamily: 'system-ui, -apple-system' }}>
                      {step.timeline}
                    </div>
                    <h3 className="text-xl mb-3 text-[#0E3E1B]"
                        style={{ fontFamily: 'Georgia, serif' }}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#0E3E1B]/70 leading-relaxed"
                       style={{ fontFamily: 'system-ui, -apple-system' }}>
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
