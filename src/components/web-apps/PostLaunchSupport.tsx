import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Shield, BarChart3, Users } from 'lucide-react';

export default function PostLaunchSupport() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const supportOptions = [
    {
      icon: Shield,
      title: '30 Days Included Support',
      description: 'Bug fixes, performance monitoring, and technical assistance included with every project.',
      highlighted: true
    },
    {
      icon: BarChart3,
      title: 'Analytics Review & Iteration',
      description: 'Post-launch data analysis and optimization recommendations to improve performance.',
      highlighted: false
    },
    {
      icon: Users,
      title: 'Optional Monthly Development Partner',
      description: 'Ongoing feature development, maintenance, and scaling support as your needs evolve.',
      highlighted: false
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
              AFTER LAUNCH
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl lg:text-6xl mb-6 text-[#0E3E1B]"
              style={{ fontFamily: 'Georgia, serif' }}>
            We Help You Grow
          </h2>
        </motion.div>

        {/* Support Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {supportOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              className={`relative bg-white/60 backdrop-blur-sm rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md ${
                option.highlighted 
                  ? 'border-2 border-[#7EF473]' 
                  : 'border border-[#0E3E1B]/10'
              }`}
            >
              {/* Highlighted Badge */}
              {option.highlighted && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#7EF473] text-[#0E3E1B] px-4 py-1 rounded-full text-xs font-bold"
                       style={{ fontFamily: 'system-ui, -apple-system' }}>
                    INCLUDED
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                option.highlighted 
                  ? 'bg-[#7EF473]' 
                  : 'bg-[#7EF473]/10'
              }`}>
                <option.icon className="w-7 h-7 text-[#0E3E1B]" strokeWidth={1.5} />
              </div>

              {/* Title */}
              <h3 className="text-2xl mb-4 text-[#0E3E1B]"
                  style={{ fontFamily: 'Georgia, serif' }}>
                {option.title}
              </h3>

              {/* Description */}
              <p className="text-[#0E3E1B]/70 leading-relaxed"
                 style={{ fontFamily: 'system-ui, -apple-system' }}>
                {option.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
