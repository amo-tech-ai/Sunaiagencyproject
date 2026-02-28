import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

const processSteps: ProcessStep[] = [
  {
    number: 1,
    title: 'Discovery & Strategy',
    description: 'Deep dive into your business goals, user needs, and competitive landscape. We define success metrics and create a data-driven strategy.'
  },
  {
    number: 2,
    title: 'AI-Powered Design System',
    description: 'Build scalable component libraries with intelligent design tokens. Every element is optimized for performance and accessibility from day one.'
  },
  {
    number: 3,
    title: 'Rapid Prototyping',
    description: 'Interactive prototypes with real content and AI-generated variations. Test user flows and validate concepts before development begins.'
  },
  {
    number: 4,
    title: 'Development & Testing',
    description: 'Clean, semantic code built for speed. Continuous testing across devices, browsers, and performance benchmarks to ensure 90+ Lighthouse scores.'
  },
  {
    number: 5,
    title: 'Launch & Optimization',
    description: 'Smooth deployment with zero downtime. Post-launch analytics and AI-driven optimization to continuously improve conversion rates.'
  }
];

export default function WebDesignProcess() {
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
            {/* Headline */}
            <h2 
              className="text-4xl lg:text-5xl xl:text-6xl mb-6 text-white leading-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Our process makes it easier to{' '}
              <span className="italic">launch fast</span>
            </h2>

            {/* Subheadline */}
            <p className="text-lg text-white/70 mb-16 font-['Lora'] leading-relaxed max-w-lg">
              Our AI-powered workflow is built for speed, precision, and seamless collaboration.
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
                    90+
                  </div>
                  <p className="text-sm text-white/60 font-['Lora'] leading-relaxed">
                    Lighthouse performance score on every page we build
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
                    &lt;4 weeks
                  </div>
                  <p className="text-sm text-white/60 font-['Lora'] leading-relaxed">
                    From kickoff to launch for landing pages and marketing sites
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
                    <h3 
                      className="text-xl lg:text-2xl mb-3 text-white font-medium"
                      style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 500 }}
                    >
                      {step.title}
                    </h3>
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
