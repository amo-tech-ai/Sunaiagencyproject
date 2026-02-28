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
    {
      icon: Clock,
      metric: '10–40',
      suffix: 'hrs/week',
      title: 'Time Saved',
      description: 'Eliminate repetitive conversations and manual follow-ups',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: TrendingUp,
      metric: '2-3',
      suffix: 'x',
      title: 'Conversion Increase',
      description: 'Instant responses and intelligent qualification boost sales',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      icon: MessageSquare,
      metric: '60–80',
      suffix: '%',
      title: 'Automation Rate',
      description: 'Most conversations handled without human intervention',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Users,
      metric: 'Zero',
      suffix: '',
      title: 'Additional Hiring',
      description: 'Scale customer interactions without growing headcount',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: BarChart,
      metric: '100',
      suffix: '%',
      title: 'Visibility',
      description: 'Full analytics on every conversation and outcome',
      color: 'from-pink-500 to-pink-600',
    },
  ];

  return (
    <section ref={containerRef} className="bg-gradient-to-b from-white to-gray-50 py-32 md:py-40 relative overflow-hidden">
      {/* Parallax Background */}
      <motion.div 
        className="absolute inset-0 opacity-[0.02]"
        style={{ y }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `conic-gradient(from 45deg, rgba(132,204,22,0.3) 0deg, transparent 90deg, transparent 270deg, rgba(132,204,22,0.3) 360deg)`,
          backgroundSize: '100px 100px'
        }} />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          className="text-center mb-20"
          style={{ scale }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-6"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#84CC16]" />
              <span className="text-xs uppercase tracking-widest text-[#84CC16] font-semibold font-['Lora']">
                Executive View
              </span>
              <Sparkles className="w-5 h-5 text-[#84CC16]" />
            </div>
          </motion.div>
          
          <motion.h2 
            className="text-5xl md:text-6xl tracking-tight text-gray-900 mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Business Benefits
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto font-['Lora']"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Real, measurable impact on your bottom line
          </motion.p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, rotateY: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -12, scale: 1.05 }}
              className="group relative"
            >
              {/* Main Card */}
              <div className="border-2 border-gray-200 bg-white p-8 text-center h-full relative overflow-hidden group-hover:border-[#84CC16] transition-all duration-500">
                {/* Gradient Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Top Accent Line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${benefit.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

                {/* Icon Container */}
                <motion.div 
                  className="w-20 h-20 mx-auto mb-6 flex items-center justify-center border-2 border-gray-200 bg-white relative group-hover:border-[#84CC16] transition-colors"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <benefit.icon className="w-10 h-10 text-gray-700 group-hover:text-[#84CC16] transition-colors" />
                  
                  {/* Corner Accent */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#84CC16] opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white" />
                    </div>
                  </div>
                </motion.div>

                {/* Metric */}
                <div className="mb-4 relative">
                  <motion.div 
                    className="text-5xl md:text-6xl font-bold text-[#84CC16] mb-2"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                    initial={{ scale: 0.5 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + (index * 0.1), type: "spring" }}
                  >
                    {benefit.metric}
                    <span className="text-3xl">{benefit.suffix}</span>
                  </motion.div>
                  
                  <h3 
                    className="font-semibold text-gray-900 text-xl"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {benefit.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed font-['Lora'] relative">
                  {benefit.description}
                </p>

                {/* Number Badge */}
                <div className="absolute bottom-6 right-6 w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-400 text-xs font-bold group-hover:bg-[#84CC16] group-hover:text-white transition-colors">
                  {index + 1}
                </div>

                {/* Bottom Corner Accent */}
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-gray-200 opacity-0 group-hover:opacity-100 group-hover:border-[#84CC16] transition-all" />
              </div>

              {/* Shadow Layer */}
              <div className="absolute bottom-0 left-4 right-4 h-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-1 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {[
            { label: 'Average Time to ROI', value: '6–8', suffix: ' weeks' },
            { label: 'Client Satisfaction', value: '98', suffix: '%' },
            { label: 'Uptime Guarantee', value: '99.9', suffix: '%' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-[#0F3D3E] text-white p-8 text-center relative overflow-hidden group hover:bg-[#84CC16] transition-colors duration-500"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Pattern Background */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
                }} />
              </div>
              
              <div className="relative">
                <p className="text-4xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {stat.value}<span className="text-2xl">{stat.suffix}</span>
                </p>
                <p className="text-xs uppercase tracking-widest opacity-90 font-['Lora']">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Context Note */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-white border-2 border-[#84CC16] p-8 md:p-10 relative overflow-hidden">
            {/* Decorative Corner */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[#84CC16] opacity-20" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[#84CC16] opacity-20" />
            
            <div className="relative text-center">
              <p className="text-gray-600 leading-relaxed font-['Lora'] mb-4">
                These metrics are based on <span className="font-semibold text-gray-900">real client implementations</span> across multiple industries. 
                Results vary based on conversation volume, complexity, and integration depth.
              </p>
              <p className="text-lg font-semibold text-[#84CC16] font-['Lora']">
                We focus on practical value, not inflated promises.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Final Visual Element */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-[#84CC16]"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
