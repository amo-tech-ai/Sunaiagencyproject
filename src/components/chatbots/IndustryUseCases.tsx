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
    <section ref={containerRef} id="use-cases" className="bg-gradient-to-b from-gray-50 to-white py-32 md:py-40 relative overflow-hidden">
      {/* Parallax Background */}
      <motion.div 
        className="absolute inset-0 opacity-[0.03]"
        style={{ y }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, rgba(132,204,22,0.1) 0px, rgba(132,204,22,0.1) 2px, transparent 2px, transparent 10px)`,
        }} />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          className="text-center mb-20"
          style={{ opacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-6"
          >
            <span className="text-xs uppercase tracking-widest text-[#84CC16] font-semibold font-['Lora']">
              Illustrated Visual Cards
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-5xl md:text-6xl tracking-tight text-gray-900 mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Industry Use Cases
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto font-['Lora']"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Tailored solutions for your specific business model
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="group relative"
            >
              {/* Main Card */}
              <div className="border-2 border-gray-200 bg-white p-8 md:p-10 h-full relative overflow-hidden group-hover:border-[#84CC16] transition-all duration-500">
                {/* Gradient Background on Hover */}
                <div className="absolute inset-0 bg-[#84CC16]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon & Title */}
                <div className="flex items-center gap-4 mb-8 relative">
                  <motion.div 
                    className="w-20 h-20 flex items-center justify-center bg-[#84CC16] text-gray-900 relative"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                  >
                    <industry.icon className="w-10 h-10" />
                    {/* Corner Accent */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-white" />
                  </motion.div>
                  
                  <div>
                    <h3 
                      className="text-2xl md:text-3xl text-gray-900"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      {industry.name}
                    </h3>
                    <p className="text-xs uppercase tracking-widest text-gray-500 font-['Lora']">
                      Industry #{index + 1}
                    </p>
                  </div>
                </div>

                {/* Use Cases with Icons */}
                <div className="mb-8 space-y-4 relative">
                  {industry.useCases.map((useCase, i) => (
                    <motion.div 
                      key={i} 
                      className="flex items-start gap-4 bg-gray-50 p-4 border border-gray-100 group/item hover:border-[#84CC16] transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: (index * 0.15) + (i * 0.1) }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-8 h-8 flex items-center justify-center border border-gray-200 bg-white flex-shrink-0 group-hover/item:border-[#84CC16] group-hover/item:bg-[#84CC16] transition-colors">
                        <useCase.icon className="w-4 h-4 text-gray-600 group-hover/item:text-white transition-colors" />
                      </div>
                      <p className="text-gray-700 leading-relaxed font-['Lora'] text-sm">
                        {useCase.text}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Outcome Section */}
                <div className="pt-6 border-t-2 border-gray-200 relative grid grid-cols-2 gap-4">
                  {/* Outcome Text */}
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-['Lora']">
                      Outcome
                    </p>
                    <p className="text-gray-900 font-semibold text-base font-['Lora']">
                      {industry.outcome}
                    </p>
                  </div>
                  
                  {/* Metric Badge */}
                  <div className="bg-[#0F3D3E] text-white p-4 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                        backgroundSize: '10px 10px'
                      }} />
                    </div>
                    <div className="relative">
                      <p className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {industry.metric}
                      </p>
                      <p className="text-[10px] uppercase tracking-widest opacity-90">
                        {industry.metricLabel}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Number Badge - Top Right */}
                <div className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-[#84CC16] text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  {index + 1}
                </div>
              </div>

              {/* Bottom Shadow Effect */}
              <div className="absolute bottom-0 left-4 right-4 h-2 bg-gray-200 -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block bg-gradient-to-r from-[#84CC16] to-[#73b512] text-white px-10 py-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.2) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.2) 75%)`,
                backgroundSize: '20px 20px'
              }} />
            </div>
            <p className="text-xl font-['Lora'] relative">
              Don't see your industry? <span className="font-bold">We build custom solutions.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}