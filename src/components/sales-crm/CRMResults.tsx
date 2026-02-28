import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { TrendingUp, Target, Clock, Quote } from 'lucide-react';

export default function CRMResults() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    {
      icon: TrendingUp,
      value: '3x',
      label: 'pipeline velocity increase'
    },
    {
      icon: Target,
      value: '40%',
      label: 'close rate improvement'
    },
    {
      icon: Clock,
      value: '15 hrs/week',
      label: 'saved per rep'
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
              RESULTS
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl lg:text-6xl mb-6 text-[#0E3E1B]"
              style={{ fontFamily: 'Georgia, serif' }}>
            What Sales Teams See in 90 Days
          </h2>

          {/* Body */}
          <p className="text-lg text-[#0E3E1B]/70 leading-relaxed max-w-2xl mx-auto"
             style={{ fontFamily: 'system-ui, -apple-system' }}>
            These are measured outcomes at the 90-day mark after adoption.
          </p>
        </motion.div>

        {/* Big Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.15 }}
              className="bg-white/60 backdrop-blur-sm border border-[#0E3E1B]/10 rounded-2xl p-10 text-center hover:-translate-y-1 hover:border-[#7EF473]/50 transition-all duration-300 shadow-sm"
            >
              {/* Icon */}
              <div className="w-14 h-14 bg-[#7EF473]/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <stat.icon className="w-7 h-7 text-[#7EF473]" strokeWidth={1.5} />
              </div>

              {/* Value */}
              <div className="text-6xl lg:text-7xl text-[#0E3E1B] font-bold mb-4"
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
        </div>

        {/* Testimonial Block */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative bg-white/60 backdrop-blur-sm border-l-4 border-l-[#7EF473] border-t border-r border-b border-[#0E3E1B]/10 rounded-2xl p-10 lg:p-12 shadow-lg max-w-4xl mx-auto"
        >
          {/* Quote Icon */}
          <div className="absolute top-8 right-8 opacity-10">
            <Quote className="w-20 h-20 text-[#0E3E1B]" />
          </div>

          {/* Quote */}
          <blockquote className="relative z-10 text-2xl lg:text-3xl text-[#0E3E1B] leading-relaxed mb-8"
                      style={{ fontFamily: 'Georgia, serif' }}>
            "We went from 4-hour response times to under 10 minutes… The CRM doesn't just store our data — it drives our pipeline forward."
          </blockquote>

          {/* Attribution */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#7EF473] rounded-full flex items-center justify-center">
              <span className="text-[#0E3E1B] text-xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
                JD
              </span>
            </div>
            <div>
              <div className="text-[#0E3E1B] font-semibold"
                   style={{ fontFamily: 'system-ui, -apple-system' }}>
                Head of Sales
              </div>
              <div className="text-[#0E3E1B]/60 text-sm"
                   style={{ fontFamily: 'system-ui, -apple-system' }}>
                B2B SaaS Company
              </div>
            </div>
          </div>

          {/* Decorative Element */}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#7EF473]/5 to-transparent rounded-tl-full" />
        </motion.div>
      </div>
    </section>
  );
}
