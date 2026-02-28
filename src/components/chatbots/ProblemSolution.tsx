import { XCircle, CheckCircle, Zap, Database, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ProblemSolution() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const problems = [
    { icon: XCircle, text: 'Only answer FAQs', color: 'text-red-500' },
    { icon: XCircle, text: "Don't connect to real systems", color: 'text-red-500' },
    { icon: XCircle, text: 'Create more work instead of saving time', color: 'text-red-500' },
  ];

  const solutions = [
    { icon: Zap, title: 'Qualify leads', description: 'Score and route high-intent prospects', color: '#84CC16' },
    { icon: CheckCircle, title: 'Book calls', description: 'Sync with calendars automatically', color: '#84CC16' },
    { icon: Database, title: 'Update your CRM', description: 'Every conversation logged', color: '#84CC16' },
    { icon: TrendingUp, title: 'Trigger automations', description: 'Connect workflows end-to-end', color: '#84CC16' },
    { icon: Shield, title: 'Escalate to humans', description: 'Only when complexity requires it', color: '#84CC16' },
  ];

  return (
    <section ref={containerRef} className="bg-white py-32 md:py-40 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <motion.div 
        className="absolute inset-0 opacity-[0.02]"
        style={{ y }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, rgba(132,204,22,0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </motion.div>

      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
              The Critical Difference
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
            What This Really Solves
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto font-['Lora']"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Most chatbots fail. Ours are business operators.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative">
          {/* Connection Line - Desktop Only */}
          <div className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="relative"
            >
              <ArrowRight className="w-16 h-16 text-[#84CC16]" />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold font-['Lora'] bg-white px-3 py-1">
                  Transform
                </span>
              </div>
            </motion.div>
          </div>

          {/* Problems Card */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-gray-50 border-2 border-gray-200 p-8 md:p-12 h-full relative overflow-hidden group hover:border-gray-300 transition-colors">
              {/* Decorative Corner */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-red-500 opacity-20" />
              
              <div className="relative">
                <h3 
                  className="text-3xl md:text-4xl text-gray-900 mb-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Most Chatbots Fail
                </h3>
                <p className="text-gray-500 mb-8 font-['Lora'] text-sm">Because they:</p>
                
                <div className="space-y-6">
                  {problems.map((problem, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start gap-4 bg-white p-4 border border-gray-200"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                      whileHover={{ x: -5 }}
                    >
                      <problem.icon className={`w-6 h-6 ${problem.color} flex-shrink-0 mt-1`} />
                      <span className="text-gray-700 text-lg font-['Lora']">{problem.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Solutions Card */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="border-2 border-[#84CC16] bg-gradient-to-br from-[#84CC16]/5 to-white p-8 md:p-12 h-full relative overflow-hidden group hover:border-[#73b512] transition-colors">
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#84CC16]" />
              
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#84CC16]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <h3 
                  className="text-3xl md:text-4xl text-gray-900 mb-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Our AI Chatbots
                </h3>
                <p className="text-gray-600 mb-8 font-['Lora']">
                  They don't just chat — they <span className="font-semibold text-[#84CC16]">take action</span>.
                </p>
                
                <div className="space-y-4">
                  {solutions.map((solution, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start gap-4 bg-white p-5 border border-[#84CC16]/20 hover:border-[#84CC16] transition-colors group/item"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                      whileHover={{ x: 5, scale: 1.02 }}
                    >
                      <div className="w-10 h-10 flex items-center justify-center border-2 border-[#84CC16] flex-shrink-0 bg-white group-hover/item:bg-[#84CC16] transition-colors">
                        <solution.icon className="w-5 h-5 text-[#84CC16] group-hover/item:text-white transition-colors" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1 font-['Lora']">{solution.title}</p>
                        <p className="text-sm text-gray-600 font-['Lora']">{solution.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Insight */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="inline-block bg-[#0F3D3E] text-white px-8 py-6 max-w-2xl">
            <p className="text-lg font-['Lora']">
              The difference: <span className="font-semibold text-[#84CC16]">execution</span>, not just conversation.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}