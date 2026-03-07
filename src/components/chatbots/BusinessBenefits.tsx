// C-CB07 — Business Benefits
// BCG design system: off-white bg, charcoal text, Georgia serif, green accents, 4px radius

import { Clock, TrendingUp, MessageSquare, Users, BarChart, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export default function BusinessBenefits() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  const benefits = [
    { icon: Clock, metric: '10–40', suffix: 'hrs/week', title: 'Time Saved', description: 'Eliminate repetitive conversations and manual follow-ups' },
    { icon: TrendingUp, metric: '2-3', suffix: 'x', title: 'Conversion Increase', description: 'Instant responses and intelligent qualification boost sales' },
    { icon: MessageSquare, metric: '60–80', suffix: '%', title: 'Automation Rate', description: 'Most conversations handled without human intervention' },
    { icon: Users, metric: 'Zero', suffix: '', title: 'Additional Hiring', description: 'Scale customer interactions without growing headcount' },
    { icon: BarChart, metric: '100', suffix: '%', title: 'Visibility', description: 'Full analytics on every conversation and outcome' },
  ];

  return (
    <section ref={containerRef} className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: '#F5F5F0' }}>
      {/* Parallax Background */}
      <motion.div className="absolute inset-0 opacity-[0.02]" style={{ y }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `conic-gradient(from 45deg, rgba(0,135,90,0.3) 0deg, transparent 90deg, transparent 270deg, rgba(0,135,90,0.3) 360deg)`,
          backgroundSize: '100px 100px'
        }} />
      </motion.div>

      <div className="max-w-[1120px] mx-auto px-6 relative">
        <motion.div className="text-center mb-16" style={{ scale }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-5"
          >
            <span className="text-xs tracking-widest uppercase" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
              Executive View
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
            Business Benefits
          </motion.h2>

          <motion.p
            className="text-lg max-w-3xl mx-auto"
            style={{ color: '#6B6B63' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Real, measurable impact on your bottom line
          </motion.p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="border bg-white p-7 text-center h-full relative overflow-hidden group-hover:border-[#00875A] transition-all duration-500" style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}>
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center border bg-white group-hover:border-[#00875A] transition-colors" style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}>
                  <benefit.icon className="w-8 h-8 group-hover:text-[#00875A] transition-colors" style={{ color: '#1A1A1A' }} />
                </div>

                {/* Metric */}
                <div className="mb-3 relative">
                  <motion.div
                    className="text-4xl mb-2"
                    style={{ fontFamily: 'Georgia, serif', color: '#00875A' }}
                    initial={{ scale: 0.5 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + (index * 0.1), type: "spring" }}
                  >
                    {benefit.metric}<span className="text-2xl">{benefit.suffix}</span>
                  </motion.div>
                  <h3 className="text-lg" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
                    {benefit.title}
                  </h3>
                </div>

                <p className="text-sm leading-relaxed relative" style={{ color: '#6B6B63' }}>
                  {benefit.description}
                </p>

                {/* Number Badge */}
                <div className="absolute bottom-5 right-5 w-8 h-8 flex items-center justify-center text-xs group-hover:bg-[#00875A] group-hover:text-white transition-colors" style={{ backgroundColor: '#F5F5F0', color: '#6B6B63', borderRadius: '4px' }}>
                  {index + 1}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          className="mb-14 grid grid-cols-1 md:grid-cols-3 gap-1 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ borderRadius: '4px' }}
        >
          {[
            { label: 'Average Time to ROI', value: '6–8', suffix: ' weeks' },
            { label: 'Client Satisfaction', value: '98', suffix: '%' },
            { label: 'Uptime Guarantee', value: '99.9', suffix: '%' }
          ].map((stat, index) => (
            <div
              key={index}
              className="text-white p-7 text-center relative"
              style={{ backgroundColor: '#1A1A1A' }}
            >
              <p className="text-3xl mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                {stat.value}<span className="text-xl">{stat.suffix}</span>
              </p>
              <p className="text-xs tracking-widest uppercase" style={{ color: 'rgba(245,245,240,0.6)', letterSpacing: '0.06em' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Context Note */}
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-white border-2 p-7 md:p-8 relative" style={{ borderColor: '#00875A', borderRadius: '4px' }}>
            <div className="relative text-center">
              <p className="leading-relaxed mb-3" style={{ color: '#6B6B63' }}>
                These metrics are based on <span style={{ color: '#1A1A1A' }}>real client implementations</span> across multiple industries.
                Results vary based on conversation volume, complexity, and integration depth.
              </p>
              <p className="text-base" style={{ color: '#00875A' }}>
                We focus on practical value, not inflated promises.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
