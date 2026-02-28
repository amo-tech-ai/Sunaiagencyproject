import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Check, X } from 'lucide-react';

export default function WhyMVPFirst() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const comparisonData = [
    { dimension: 'Time to first users', traditional: '6-12 months', mvp: '6 weeks', isBetter: true },
    { dimension: 'Budget before revenue', traditional: '$100K-500K', mvp: '$15K-40K', isBetter: true },
    { dimension: 'Risk level', traditional: 'Build the wrong thing', mvp: 'Validate before scaling', isBetter: true },
    { dimension: 'Investor conversation', traditional: 'Here is our plan', mvp: 'Here is our product', isBetter: true },
    { dimension: 'Iteration speed', traditional: 'Quarterly releases', mvp: 'Weekly deployments', isBetter: true },
    { dimension: 'Architecture', traditional: 'Often needs rebuild', mvp: 'Production-grade from day 1', isBetter: true },
  ];

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
            <span className="text-xs uppercase tracking-widest text-[#2E6F5E] font-semibold font-['Lora']">
              THE CASE FOR MVP
            </span>
          </div>
          <h2
            className="text-5xl lg:text-6xl mb-6 text-[#1E3D36]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Build the proof before you build the company
          </h2>
          <p className="text-lg text-[#1E3D36]/70 leading-relaxed font-['Lora']">
            Investors fund traction, not ideas. Users sign up for products, not roadmaps. The fastest path from concept to revenue is a working product generating real data.
          </p>
        </motion.div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Traditional Approach */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <X className="w-6 h-6 text-gray-500" />
              </div>
              <h3
                className="text-3xl text-gray-600"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Traditional Approach
              </h3>
            </div>

            <div className="space-y-6">
              {comparisonData.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-2 font-['Lora']">
                    {item.dimension}
                  </p>
                  <p className="text-base text-gray-700 font-['Lora']">
                    {item.traditional}
                  </p>
                </div>
              ))}
            </div>

            {/* Waterfall Visual */}
            <div className="mt-8 space-y-2">
              {['Requirements', 'Design', 'Development', 'Testing', 'Launch?'].map((phase, idx) => (
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                  className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-600 font-['Lora']"
                >
                  {phase}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* MVP Approach */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg border-2 border-[#84CC16]"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-[#84CC16] rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-gray-900" />
              </div>
              <h3
                className="text-3xl text-[#1E3D36]"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                MVP Approach
              </h3>
            </div>

            <div className="space-y-6">
              {comparisonData.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-2 font-['Lora']">
                    {item.dimension}
                  </p>
                  <p className="text-base text-[#1E3D36] font-semibold font-['Lora']">
                    {item.mvp}
                  </p>
                </div>
              ))}
            </div>

            {/* Iterative Visual */}
            <div className="mt-8 space-y-2">
              {['Scope', 'Design + Build', 'Launch', 'Learn', 'Iterate ↻'].map((phase, idx) => (
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                  className="bg-gradient-to-r from-[#84CC16]/20 to-[#84CC16]/10 rounded-lg px-4 py-2 text-sm text-[#1E3D36] font-semibold font-['Lora']"
                >
                  {phase}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
