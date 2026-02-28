import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface PhaseCard {
  number: string;
  title: string;
  description: string;
  backgroundColor: string;
  textColor: string;
}

const phases: PhaseCard[] = [
  {
    number: '01',
    title: 'Scope Workshop',
    description:
      'A 2-hour intensive session where we map your product vision into a buildable scope. Feature prioritization using the MoSCoW method. You leave with a crystal-clear build document.',
    backgroundColor: '#B8956B',
    textColor: '#FFFFFF',
  },
  {
    number: '02',
    title: 'AI Architecture',
    description:
      'Technical architecture tailored to your product. Database schema, API design, AI capability mapping, and deployment strategy designed for where you are going.',
    backgroundColor: '#1A5063',
    textColor: '#FFFFFF',
  },
  {
    number: '03',
    title: 'Core Development',
    description:
      'Sprint-based development with daily standups and continuous deployment. You see working software from day one — not a demo at the end.',
    backgroundColor: '#E6E3D0',
    textColor: '#2A2A2A',
  },
  {
    number: '04',
    title: 'AI Integration',
    description:
      'AI capabilities wired into the product — recommendations, NLP features, automated workflows. The intelligent layer is integrated from the architecture phase.',
    backgroundColor: '#1A4642',
    textColor: '#FFFFFF',
  },
  {
    number: '05',
    title: 'Launch & Deploy',
    description:
      'Production deployment to scalable cloud infrastructure. Domain, SSL, monitoring, error tracking, and analytics. You launch confident the infrastructure will scale.',
    backgroundColor: '#E8D4D8',
    textColor: '#2A2A2A',
  },
  {
    number: '06',
    title: 'Post-Launch Support',
    description:
      'Bug fixes, performance monitoring, and iterative improvements. Weekly analytics review to identify friction points and prioritize version-two features.',
    backgroundColor: '#A8CED8',
    textColor: '#2A2A2A',
  },
];

export default function MVPDeliverables() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-white py-32 lg:py-40">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="mb-16 max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-4">
            <span className="text-xs uppercase tracking-widest text-[#2E6F5E] font-semibold font-['Lora']">
              WHAT YOU GET
            </span>
          </div>
          <h2
            className="text-5xl lg:text-6xl mb-6 text-[#1E3D36]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            From concept to deployed product
          </h2>
          <p className="text-lg text-[#1E3D36]/70 leading-relaxed font-['Lora']">
            Every MVP engagement follows the same proven structure — a focused scope workshop, AI-accelerated architecture design, rapid development with daily visibility, and production deployment with 30 days of post-launch support.
          </p>
        </motion.div>

        {/* Phase Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.number}
              className="relative overflow-hidden transition-all duration-500 group cursor-pointer h-full flex flex-col"
              style={{
                backgroundColor: phase.backgroundColor,
                borderRadius: '20px',
                minHeight: '340px',
              }}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{
                y: -4,
                transition: { duration: 0.3 },
              }}
            >
              {/* Content */}
              <div className="relative z-10 p-8 lg:p-10 flex flex-col h-full">
                {/* Number Badge */}
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-6 font-bold text-lg"
                  style={{
                    backgroundColor: phase.textColor === '#FFFFFF' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                    color: phase.textColor,
                    fontFamily: 'Playfair Display, serif',
                  }}
                >
                  {phase.number}
                </div>

                <h3
                  className="text-2xl lg:text-3xl mb-3 font-normal"
                  style={{
                    color: phase.textColor,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontWeight: 400,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {phase.title}
                </h3>

                <p
                  className="text-sm lg:text-[15px] leading-relaxed"
                  style={{
                    color: phase.textColor,
                    opacity: phase.textColor === '#FFFFFF' ? 0.85 : 0.75,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontWeight: 400,
                    lineHeight: '1.6',
                  }}
                >
                  {phase.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gantt Chart Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 bg-white rounded-3xl p-8 lg:p-12 shadow-lg border border-gray-100"
        >
          <h3
            className="text-3xl lg:text-4xl mb-8 text-[#1E3D36]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            6-Week Timeline Overview
          </h3>

          {/* Week Labels */}
          <div className="flex items-center mb-6 overflow-x-auto">
            {[1, 2, 3, 4, 5, 6].map((week) => (
              <div
                key={week}
                className="flex-1 text-center min-w-[80px]"
                style={{
                  fontFamily: 'Lora',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#6B7280',
                }}
              >
                Week {week}
              </div>
            ))}
          </div>

          {/* Gantt Bars */}
          <div className="space-y-3">
            {/* Scope */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="h-12 rounded-full flex items-center px-4"
              style={{
                backgroundColor: '#B8956B',
                width: '16.66%',
                transformOrigin: 'left',
              }}
            >
              <span className="text-white text-sm font-semibold font-['Lora']">
                Scope
              </span>
            </motion.div>

            {/* Architecture */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="h-12 rounded-full flex items-center px-4"
              style={{
                backgroundColor: '#1A5063',
                width: '33.33%',
                transformOrigin: 'left',
              }}
            >
              <span className="text-white text-sm font-semibold font-['Lora']">
                Architecture
              </span>
            </motion.div>

            {/* Build */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="h-12 rounded-full flex items-center px-4"
              style={{
                backgroundColor: '#1A4642',
                width: '50%',
                marginLeft: '16.66%',
                transformOrigin: 'left',
              }}
            >
              <span className="text-white text-sm font-semibold font-['Lora']">
                Core Development
              </span>
            </motion.div>

            {/* AI + Polish */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="h-12 rounded-full flex items-center px-4"
              style={{
                backgroundColor: '#84CC16',
                width: '33.33%',
                marginLeft: '50%',
                transformOrigin: 'left',
              }}
            >
              <span className="text-gray-900 text-sm font-semibold font-['Lora']">
                AI Integration
              </span>
            </motion.div>

            {/* Deploy */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="h-12 rounded-full flex items-center px-4"
              style={{
                backgroundColor: '#FF6B4A',
                width: '25%',
                marginLeft: '66.66%',
                transformOrigin: 'left',
              }}
            >
              <span className="text-white text-sm font-semibold font-['Lora']">
                Launch 🚀
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
