import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export default function SalesProblem() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { value: '60%', label: 'of sales time spent on admin tasks' },
    { value: '10+', label: 'lead channels with no unified tracking' },
    { value: '$200K+', label: 'lost annually from slow follow-ups' }
  ];

  return (
    <section ref={ref} className="py-24 lg:py-32" style={{ backgroundColor: '#FAF9F5' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[60fr_40fr] gap-16 items-center">
          {/* Left Column - Copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            {/* Eyebrow */}
            <div className="mb-4">
              <span className="text-xs uppercase tracking-[0.2em] text-[#7EF473] font-semibold" style={{ fontFamily: 'system-ui, -apple-system' }}>
                THE PROBLEM
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl lg:text-6xl mb-8 text-[#0E3E1B]"
                style={{ fontFamily: 'Georgia, serif' }}>
              Your Pipeline Is Leaking and Nobody Knows Where
            </h2>

            {/* Body Copy */}
            <div className="space-y-6 text-lg text-[#0E3E1B]/70 leading-relaxed"
                 style={{ fontFamily: 'system-ui, -apple-system' }}>
              <p>
                Leads come from 10+ channels and land in different places. Follow-ups slip because nobody owns the workflow end-to-end. Sales reps spend most of their time doing admin instead of selling.
              </p>
              <p>
                The result: slow response time, inconsistent follow-up, stalled deals, and revenue leakage. Your best reps are drowning in spreadsheets while high-value opportunities sit untouched.
              </p>
              <p>
                Traditional CRMs just store the problem. They don't solve it. You need a system that <strong className="text-[#0E3E1B]">acts on every lead automatically</strong> — capturing, scoring, engaging, and moving deals forward without constant manual intervention.
              </p>
            </div>
          </motion.div>

          {/* Right Column - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
                className="bg-white/60 backdrop-blur-sm border border-[#0E3E1B]/10 rounded-2xl p-8 hover:-translate-y-1 hover:border-[#7EF473]/50 transition-all duration-300 shadow-sm"
              >
                {/* Large Number */}
                <div className="text-6xl lg:text-7xl text-[#7EF473] font-bold mb-3"
                     style={{ fontFamily: 'Georgia, serif' }}>
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-[#0E3E1B]/70 text-lg leading-snug"
                     style={{ fontFamily: 'system-ui, -apple-system' }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
