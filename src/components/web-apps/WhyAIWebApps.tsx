import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Zap, BarChart3, Users } from 'lucide-react';

export default function WhyAIWebApps() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const benefits = [
    {
      icon: Zap,
      title: 'Intelligent Automation',
      description: 'Reduce repetitive work with AI-driven logic.'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Insights',
      description: 'Turn raw data into decisions instantly.'
    },
    {
      icon: Users,
      title: 'Adaptive UX',
      description: 'Applications that personalize based on behavior.'
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
          className="mb-16"
        >
          {/* Eyebrow */}
          <div className="mb-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#7EF473] font-semibold" style={{ fontFamily: 'system-ui, -apple-system' }}>
              WHY AI WEB APPS
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl lg:text-6xl mb-8 text-[#0E3E1B]"
              style={{ fontFamily: 'Georgia, serif' }}>
            Smarter Software Wins Markets
          </h2>

          {/* Body Copy */}
          <div className="max-w-[720px] space-y-6 text-lg text-[#0E3E1B]/70 leading-relaxed"
               style={{ fontFamily: 'system-ui, -apple-system' }}>
            <p>
              AI-native web apps adapt, automate, and improve over time. They reduce manual workflows and increase decision quality.
            </p>
            <p>
              Traditional software requires constant human intervention. Intelligent applications handle routine decisions, surface insights, and scale operations without adding headcount.
            </p>
          </div>
        </motion.div>

        {/* Benefit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              className="bg-white/60 backdrop-blur-sm border border-[#0E3E1B]/10 rounded-2xl p-8 hover:-translate-y-1 hover:border-[#7EF473]/50 transition-all duration-300 shadow-sm hover:shadow-md group"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-[#7EF473]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#7EF473]/20 transition-colors">
                <benefit.icon className="w-6 h-6 text-[#0E3E1B]" strokeWidth={1.5} />
              </div>

              {/* Title */}
              <h3 className="text-2xl mb-3 text-[#0E3E1B]"
                  style={{ fontFamily: 'Georgia, serif' }}>
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-[#0E3E1B]/70 leading-relaxed"
                 style={{ fontFamily: 'system-ui, -apple-system' }}>
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
