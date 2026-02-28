import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Sparkles, MessageSquare, Workflow, TrendingUp } from 'lucide-react';

export default function AIFeaturesBuiltIn() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: Sparkles,
      title: 'Smart Recommendations',
      description: 'Behavior-based personalization.'
    },
    {
      icon: MessageSquare,
      title: 'Natural Language Interfaces',
      description: 'Search and command using human language.'
    },
    {
      icon: Workflow,
      title: 'Automated Workflows',
      description: 'Event-driven backend intelligence.'
    },
    {
      icon: TrendingUp,
      title: 'Predictive Insights',
      description: 'Forecast trends and identify risks.'
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
              AI CAPABILITIES
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl lg:text-6xl mb-6 text-[#0E3E1B]"
              style={{ fontFamily: 'Georgia, serif' }}>
            Intelligence Embedded from Day One
          </h2>
        </motion.div>

        {/* Features Grid - 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              className="relative bg-white/60 backdrop-blur-sm border border-[#0E3E1B]/10 rounded-2xl p-10 hover:-translate-y-1 hover:border-[#7EF473]/50 hover:shadow-[0_0_30px_rgba(126,244,115,0.15)] transition-all duration-300 shadow-sm group"
            >
              {/* Subtle Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#7EF473]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-14 h-14 bg-[#7EF473]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#7EF473]/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-[#0E3E1B]" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="text-2xl lg:text-3xl mb-4 text-[#0E3E1B]"
                    style={{ fontFamily: 'Georgia, serif' }}>
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-[#0E3E1B]/70 text-lg leading-relaxed"
                   style={{ fontFamily: 'system-ui, -apple-system' }}>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
