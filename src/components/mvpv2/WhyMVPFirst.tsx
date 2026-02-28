import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export default function WhyMVPFirst() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-[#F4F3EE] py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="max-w-4xl mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-4">
            <span className="text-xs uppercase tracking-widest text-[#84CC16] font-semibold font-['Lora']">
              THE CASE FOR MVP
            </span>
          </div>
          <h2
            className="text-5xl lg:text-6xl mb-8 text-[#1E3D36]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Build the Proof Before You Build the Company
          </h2>

          <div className="space-y-6 text-lg text-[#1E3D36]/70 leading-relaxed font-['Lora']">
            <p>
              Investors don't fund ideas—they fund evidence. Users don't buy
              roadmaps—they buy products. The fastest path to revenue (and
              funding) is a working product in real hands generating real usage
              data.
            </p>
            <p>
              Traditional builds delay learning until the end. Our approach flips
              it: ship the core value first, measure what happens, then expand
              based on proof—not opinions.
            </p>
          </div>
        </motion.div>

        {/* What You Gain Bullets */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {[
            'You learn what users actually do (not what they say)',
            'You de-risk the build before you scale the team',
            "You get a credible story: \"Here's the product. Here's the data.\"",
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-3xl p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <p className="text-base text-[#1E3D36] font-['Lora'] leading-relaxed">
                {item}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Comparison Table Intro */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="text-lg text-[#1E3D36]/70 font-['Lora'] max-w-3xl">
            Same ambition—different sequence: learn early, scale later.
          </p>
        </motion.div>

        {/* Comparison Cards */}
        <motion.div
          className="grid lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Traditional Approach */}
          <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg">
            <h3
              className="text-2xl mb-6 text-[#1E3D36]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Traditional Approach
            </h3>
            <ul className="space-y-4">
              {[
                'Build everything before showing anyone',
                '6-12 month development cycle',
                'Large upfront investment required',
                'High risk: "Will users actually want this?"',
                'Late discovery of market fit issues',
                'Difficult to pivot with sunk costs',
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-[#1E3D36]/70 font-['Lora']"
                >
                  <span className="text-red-500 flex-shrink-0 mt-1">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Our MVP Approach */}
          <div className="bg-[#1E3D36] rounded-3xl p-8 lg:p-10 shadow-lg">
            <h3
              className="text-2xl mb-6 text-white"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Our MVP Approach
            </h3>
            <ul className="space-y-4">
              {[
                'Ship core value in 6 weeks',
                'Real users, real data from week 7',
                'Fraction of traditional build cost',
                'Low risk: validate before scaling',
                'Early feedback shapes v2 priorities',
                'Pivot or scale based on evidence',
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-white/90 font-['Lora']"
                >
                  <span className="text-[#84CC16] flex-shrink-0 mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}