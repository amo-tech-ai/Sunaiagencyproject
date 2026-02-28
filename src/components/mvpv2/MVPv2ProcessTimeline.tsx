import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

interface ProcessStep {
  number: number;
  title: string;
  week: string;
  description: string;
}

const processSteps: ProcessStep[] = [
  {
    number: 1,
    title: 'Scope Workshop',
    week: 'Week 1',
    description: 'We define v1 with ruthless focus. Core hypothesis, key metrics, must-have features only. You leave with a clear product brief and wireframes.'
  },
  {
    number: 2,
    title: 'Architecture & Data Design',
    week: 'Week 1-2',
    description: 'Database schema, API structure, AI capability map, third-party integrations, deployment architecture. Everything documented in technical specs.'
  },
  {
    number: 3,
    title: 'Core Build (Sprint 1)',
    week: 'Week 2-3',
    description: 'First sprint: authentication, data models, core UI, primary user flows. You get staging access and weekly demos.'
  },
  {
    number: 4,
    title: 'Core Build (Sprint 2)',
    week: 'Week 3-4',
    description: 'Second sprint: remaining features, integrations, edge cases, responsive polish. Daily progress updates via Slack.'
  },
  {
    number: 5,
    title: 'AI Integration + Polish',
    week: 'Week 4-5',
    description: 'Wire in AI features (search, recommendations, automation), performance optimization, final UI refinement, admin tooling.'
  },
  {
    number: 6,
    title: 'Launch & Handoff',
    week: 'Week 5-6',
    description: 'Production deploy, monitoring setup, analytics integration, admin training, documentation handoff. You are live with real users.'
  }
];

export default function MVPv2ProcessTimeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section 
      ref={ref}
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0D2F2A 0%, #08342E 100%)'
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - Headline & Metrics */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8 }}
          >
            {/* Eyebrow */}
            <div className="mb-6">
              <span className="text-xs uppercase tracking-[0.2em] text-[#84CC16] font-semibold font-['Lora']">
                PROCESS TIMELINE
              </span>
            </div>

            {/* Headline */}
            <h2 
              className="text-4xl lg:text-5xl xl:text-6xl mb-6 text-white leading-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              6 weeks, 6 phases,{' '}
              <span className="italic">zero ambiguity</span>
            </h2>

            {/* Subheadline */}
            <p className="text-lg text-white/70 mb-16 font-['Lora'] leading-relaxed max-w-lg">
              Every engagement follows a clear, milestone-driven timeline. You know what's being built, when it ships, and what's included.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-12">
              {/* Metric 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative pb-6">
                  <div 
                    className="text-5xl lg:text-6xl xl:text-7xl mb-3 text-white"
                    style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400 }}
                  >
                    6 weeks
                  </div>
                  <p className="text-sm text-white/60 font-['Lora'] leading-relaxed">
                    Average timeline from kickoff to production deployment
                  </p>
                  {/* Divider */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-px"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                  />
                </div>
              </motion.div>

              {/* Metric 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="relative pb-6">
                  <div 
                    className="text-5xl lg:text-6xl xl:text-7xl mb-3 text-white"
                    style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400 }}
                  >
                    2 sprints
                  </div>
                  <p className="text-sm text-white/60 font-['Lora'] leading-relaxed">
                    Core build split into weekly releases with staging access
                  </p>
                  {/* Divider */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-px"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Timeline */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Vertical Line */}
            <div 
              className="absolute left-[17px] top-0 bottom-0 w-px"
              style={{ background: 'rgba(132, 204, 22, 0.2)' }}
            />

            {/* Steps */}
            <div className="space-y-12 lg:space-y-16">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.number}
                  className="relative pl-16 group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  {/* Number Circle */}
                  <div 
                    className="absolute left-0 top-0 w-[36px] h-[36px] rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:shadow-lg"
                    style={{
                      borderColor: '#84CC16',
                      backgroundColor: 'rgba(13, 47, 42, 1)',
                      boxShadow: '0 0 0 0 rgba(132, 204, 22, 0)'
                    }}
                  >
                    <span 
                      className="text-sm font-semibold"
                      style={{ color: '#84CC16', fontFamily: 'Playfair Display, serif' }}
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div>
                    <div className="flex items-baseline gap-3 mb-2">
                      <h3 
                        className="text-xl lg:text-2xl text-white font-medium"
                        style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 500 }}
                      >
                        {step.title}
                      </h3>
                      <span 
                        className="text-sm text-[#84CC16] font-['Lora'] font-semibold"
                      >
                        {step.week}
                      </span>
                    </div>
                    <p 
                      className="text-base text-white/70 leading-relaxed font-['Lora']"
                      style={{ fontWeight: 300 }}
                    >
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Hover effect CSS */}
      <style>{`
        .group:hover .absolute.left-0.top-0 {
          box-shadow: 0 0 20px rgba(132, 204, 22, 0.4) !important;
        }
      `}</style>
    </section>
  );
}