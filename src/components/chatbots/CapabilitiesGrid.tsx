import { 
  Clock, 
  Brain, 
  Database, 
  Users, 
  MessageSquare, 
  Workflow, 
  BarChart,
  Target,
  Sparkles,
  TrendingUp 
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function CapabilitiesGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const coreCapabilities = [
    { icon: Clock, title: '24/7 Instant Responses', impact: 'No missed leads or slow replies' },
    { icon: Brain, title: 'Intent Detection', impact: 'Understands what users actually want' },
    { icon: Database, title: 'Knowledge Base Answers', impact: 'Accurate, consistent replies' },
    { icon: Users, title: 'Human Handoff', impact: 'Escalates only when needed' },
    { icon: MessageSquare, title: 'Multi-Channel', impact: 'Website, WhatsApp, Email' },
  ];

  const advancedCapabilities = [
    { icon: Workflow, title: 'Workflow Execution', impact: 'Refunds, bookings, updates handled automatically' },
    { icon: BarChart, title: 'CRM Sync', impact: 'Every conversation updates leads & contacts' },
    { icon: Target, title: 'Lead Qualification', impact: 'Sales talks only to high-intent prospects' },
    { icon: Sparkles, title: 'Personalization', impact: 'Tailored responses based on user data' },
    { icon: TrendingUp, title: 'Analytics & Insights', impact: 'See what customers ask and where deals drop' },
  ];

  return (
    <section ref={containerRef} className="bg-gray-50 py-32 md:py-40 relative overflow-hidden">
      {/* Parallax Background Pattern */}
      <motion.div 
        className="absolute inset-0 opacity-[0.03]"
        style={{ y }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, rgba(132,204,22,0.2) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(132,204,22,0.2) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block mb-6">
            <span className="text-xs uppercase tracking-widest text-[#84CC16] font-semibold font-['Lora']">
              Complete Platform
            </span>
          </div>
          
          <h2 
            className="text-5xl md:text-6xl tracking-tight text-gray-900 mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Core Capabilities
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['Lora']">
            Built for immediate value and long-term scale
          </p>
        </motion.div>

        {/* Core Capabilities Section */}
        <div className="mb-24">
          <motion.div 
            className="flex items-center gap-3 mb-12"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-1 h-12 bg-[#84CC16]" />
            <div>
              <h3 className="text-xs uppercase tracking-widest text-gray-500 font-semibold font-['Lora']">
                Immediate Value
              </h3>
              <p className="text-sm text-gray-600 font-['Lora']">Deploy these features on day one</p>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreCapabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className={`bg-gradient-to-br ${capability.gradient} border-2 border-gray-200 p-8 h-full relative overflow-hidden group-hover:border-[#84CC16] transition-all duration-300`}>
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#84CC16]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Icon with Animated Border */}
                  <div className="relative mb-6">
                    <motion.div
                      className="w-16 h-16 flex items-center justify-center border-2 border-gray-300 bg-white group-hover:border-[#84CC16] transition-colors relative"
                      whileHover={{ rotate: 5 }}
                    >
                      <capability.icon className="w-8 h-8 text-gray-700 group-hover:text-[#84CC16] transition-colors" />
                    </motion.div>
                    
                    {/* Corner Accent */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-[#84CC16] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <h4 
                    className="font-semibold text-gray-900 mb-3 text-xl"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {capability.title}
                  </h4>
                  
                  <p className="text-sm text-gray-600 leading-relaxed font-['Lora']">
                    {capability.impact}
                  </p>

                  {/* Number Badge */}
                  <div className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-white border border-gray-200 text-xs font-bold text-gray-400 group-hover:border-[#84CC16] group-hover:text-[#84CC16] transition-colors">
                    {index + 1}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Advanced Capabilities Section */}
        <div>
          <motion.div 
            className="flex items-center gap-3 mb-12"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-1 h-12 bg-gradient-to-b from-[#84CC16] to-[#73b512]" />
            <div>
              <h3 className="text-xs uppercase tracking-widest text-gray-500 font-semibold font-['Lora']">
                Scale & Revenue
              </h3>
              <p className="text-sm text-gray-600 font-['Lora']">Advanced features for growth</p>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advancedCapabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className={`bg-gradient-to-br ${capability.gradient} border-2 border-gray-200 p-8 h-full relative overflow-hidden group-hover:border-[#84CC16] transition-all duration-300`}>
                  {/* Premium Badge */}
                  <div className="absolute top-4 right-4 bg-[#84CC16] text-white text-[10px] uppercase tracking-widest px-2 py-1 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Pro
                  </div>
                  
                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#84CC16]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <motion.div
                      className="w-16 h-16 flex items-center justify-center border-2 border-[#84CC16]/30 bg-white group-hover:border-[#84CC16] group-hover:bg-[#84CC16] transition-all relative"
                      whileHover={{ rotate: -5 }}
                    >
                      <capability.icon className="w-8 h-8 text-gray-700 group-hover:text-white transition-colors" />
                    </motion.div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-[#84CC16] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <h4 
                    className="font-semibold text-gray-900 mb-3 text-xl"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {capability.title}
                  </h4>
                  
                  <p className="text-sm text-gray-600 leading-relaxed font-['Lora']">
                    {capability.impact}
                  </p>

                  {/* Sequence Badge */}
                  <div className="absolute top-6 left-6 w-8 h-8 flex items-center justify-center bg-[#84CC16] text-white text-xs font-bold">
                    {index + 6}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {[
            { number: '10', label: 'Core + Advanced Features', suffix: '' },
            { number: '24', label: 'Hours Daily Operation', suffix: '/7' },
            { number: '60', label: 'Conversations Automated', suffix: '%+' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-8 bg-white border-2 border-gray-200 hover:border-[#84CC16] transition-colors group"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-5xl font-bold text-[#84CC16] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                {stat.number}<span className="text-3xl">{stat.suffix}</span>
              </div>
              <div className="text-sm uppercase tracking-widest text-gray-600 font-['Lora']">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}