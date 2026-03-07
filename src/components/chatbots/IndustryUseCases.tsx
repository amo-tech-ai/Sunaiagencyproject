// C-CB05 — Industry Use Cases
// BCG design system: off-white bg, charcoal text, Georgia serif, green accents, 4px radius

import { ShoppingBag, Home, Calendar, Laptop, TrendingUp, Users, Zap, Shield } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export default function IndustryUseCases() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const industries = [
    {
      icon: ShoppingBag,
      name: 'Fashion / Ecommerce',
      useCases: [
        { text: 'Product questions & recommendations', icon: Users },
        { text: 'Order tracking & status updates', icon: TrendingUp },
        { text: 'Cart recovery & abandoned checkout', icon: Zap },
        { text: 'Upsells & cross-sells at checkout', icon: Shield },
      ],
      outcome: 'More conversions with the same traffic',
      metric: '+32%',
      metricLabel: 'Conv. Rate'
    },
    {
      icon: Home,
      name: 'Real Estate',
      useCases: [
        { text: 'WhatsApp lead handling (24/7)', icon: Zap },
        { text: 'Property qualification questions', icon: Users },
        { text: 'Tour scheduling & reminders', icon: Calendar },
        { text: 'Instant property info & pricing', icon: TrendingUp },
      ],
      outcome: 'Win deals faster than competitors',
      metric: '3x',
      metricLabel: 'Response Speed'
    },
    {
      icon: Calendar,
      name: 'Events & Tourism',
      useCases: [
        { text: 'Ticket questions & availability', icon: Users },
        { text: 'Itinerary information & planning', icon: Calendar },
        { text: 'Upsell experiences & packages', icon: TrendingUp },
        { text: 'Post-event feedback collection', icon: Shield },
      ],
      outcome: 'Higher revenue per guest',
      metric: '+45%',
      metricLabel: 'Revenue/Guest'
    },
    {
      icon: Laptop,
      name: 'SaaS & B2B',
      useCases: [
        { text: 'Demo booking & qualification', icon: Calendar },
        { text: 'Onboarding support & tutorials', icon: Users },
        { text: 'Churn prevention & engagement', icon: Shield },
        { text: 'Feature requests & feedback', icon: TrendingUp },
      ],
      outcome: 'Better retention & pipeline health',
      metric: '92%',
      metricLabel: 'Retention Rate'
    },
  ];

  return (
    <section ref={containerRef} id="use-cases" className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: '#F5F5F0' }}>
      {/* Parallax Background */}
      <motion.div className="absolute inset-0 opacity-[0.03]" style={{ y }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, rgba(0,135,90,0.1) 0px, rgba(0,135,90,0.1) 2px, transparent 2px, transparent 10px)`,
        }} />
      </motion.div>

      <div className="max-w-[1120px] mx-auto px-6 relative">
        <motion.div className="text-center mb-16" style={{ opacity }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-5"
          >
            <span className="text-xs tracking-widest uppercase" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
              Illustrated Visual Cards
            </span>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl tracking-tight mb-5"
            style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Industry Use Cases
          </motion.h2>

          <motion.p
            className="text-lg max-w-3xl mx-auto"
            style={{ color: '#6B6B63' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Tailored solutions for your specific business model
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="group relative"
            >
              <div className="border bg-white p-7 md:p-8 h-full relative overflow-hidden group-hover:border-[#00875A] transition-all duration-500" style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}>
                {/* Icon & Title */}
                <div className="flex items-center gap-4 mb-7 relative">
                  <div className="w-16 h-16 flex items-center justify-center text-white" style={{ backgroundColor: '#00875A', borderRadius: '4px' }}>
                    <industry.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
                      {industry.name}
                    </h3>
                    <p className="text-xs tracking-widest uppercase" style={{ color: '#6B6B63', letterSpacing: '0.06em' }}>
                      Industry #{index + 1}
                    </p>
                  </div>
                </div>

                {/* Use Cases */}
                <div className="mb-7 space-y-3 relative">
                  {industry.useCases.map((useCase, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3 p-3 border group/item hover:border-[#00875A] transition-colors"
                      style={{ backgroundColor: '#F5F5F0', borderColor: '#E8E8E4', borderRadius: '4px' }}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: (index * 0.15) + (i * 0.1) }}
                    >
                      <div className="w-7 h-7 flex items-center justify-center border bg-white flex-shrink-0 group-hover/item:border-[#00875A] group-hover/item:bg-[#00875A] transition-colors" style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}>
                        <useCase.icon className="w-3.5 h-3.5 group-hover/item:text-white transition-colors" style={{ color: '#6B6B63' }} />
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: '#1A1A1A' }}>
                        {useCase.text}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Outcome Section */}
                <div className="pt-5 border-t grid grid-cols-2 gap-4 relative" style={{ borderColor: '#E8E8E4' }}>
                  <div>
                    <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#6B6B63', letterSpacing: '0.06em' }}>Outcome</p>
                    <p style={{ color: '#1A1A1A' }}>{industry.outcome}</p>
                  </div>
                  <div className="text-white p-4 text-center" style={{ backgroundColor: '#1A1A1A', borderRadius: '4px' }}>
                    <p className="text-2xl" style={{ fontFamily: 'Georgia, serif' }}>
                      {industry.metric}
                    </p>
                    <p className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(245,245,240,0.6)', letterSpacing: '0.06em' }}>
                      {industry.metricLabel}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block text-white px-8 py-5" style={{ backgroundColor: '#00875A', borderRadius: '4px' }}>
            <p className="text-base">
              Don't see your industry? <span className="font-semibold">We build custom solutions.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
