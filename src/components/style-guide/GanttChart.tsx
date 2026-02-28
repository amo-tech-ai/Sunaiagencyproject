import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export default function GanttChart() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-[#F4F3EE] py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="mb-16 max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-4">
            <span className="text-xs uppercase tracking-widest text-[#84CC16] font-semibold font-['Lora']">
              DELIVERABLES
            </span>
          </div>
          <h2
            className="text-5xl lg:text-6xl mb-6 text-[#1E3D36]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            From Concept to Deployed Product
          </h2>
          <p className="text-lg text-[#1E3D36]/70 leading-relaxed font-['Lora']">
            Every MVP engagement follows the same proven structure — a focused scope workshop to define the right features, AI-accelerated architecture design, rapid development with daily visibility, and production deployment with monitoring, onboarding, and 30 days of post-launch support.
          </p>
        </motion.div>

        {/* Gantt Chart */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg"
        >
          {/* Week Labels */}
          <div className="flex items-center mb-8 overflow-x-auto">
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
              transition={{ duration: 0.8, delay: 0.5 }}
              className="h-14 rounded-xl flex items-center px-4"
              style={{
                backgroundColor: '#84CC16',
                width: '16.66%',
                transformOrigin: 'left',
              }}
            >
              <span className="text-gray-900 text-sm font-semibold font-['Lora']">
                Scope
              </span>
            </motion.div>

            {/* Architecture */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="h-14 rounded-xl flex items-center px-4"
              style={{
                backgroundColor: '#9DD679',
                width: '33.33%',
                transformOrigin: 'left',
              }}
            >
              <span className="text-gray-900 text-sm font-semibold font-['Lora']">
                Architecture
              </span>
            </motion.div>

            {/* Core Feature Dev */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="h-14 rounded-xl flex items-center px-4"
              style={{
                backgroundColor: '#0F3D3E',
                width: '50%',
                marginLeft: '16.66%',
                transformOrigin: 'left',
              }}
            >
              <span className="text-white text-sm font-semibold font-['Lora']">
                Core Feature Dev
              </span>
            </motion.div>

            {/* AI + Polish */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="h-14 rounded-xl flex items-center px-4"
              style={{
                backgroundColor: '#84CC16',
                width: '33.33%',
                marginLeft: '50%',
                transformOrigin: 'left',
              }}
            >
              <span className="text-gray-900 text-sm font-semibold font-['Lora']">
                AI + Polish
              </span>
            </motion.div>

            {/* Deploy */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="h-14 rounded-xl flex items-center px-4"
              style={{
                backgroundColor: '#0F3D3E',
                width: '25%',
                marginLeft: '66.66%',
                transformOrigin: 'left',
              }}
            >
              <span className="text-white text-sm font-semibold font-['Lora']">
                Deploy
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
