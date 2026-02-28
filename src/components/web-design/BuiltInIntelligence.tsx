import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { MessageSquare, FileCheck, Database } from 'lucide-react';

export default function BuiltInIntelligence() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: MessageSquare,
      title: 'Embedded AI Chatbot',
      description: 'Qualifies visitors in real-time. Books meetings directly into your calendar. Answers product questions from your knowledge base. Escalates complex issues to your team with full context. Works on every page, every hour, every day.'
    },
    {
      icon: FileCheck,
      title: 'Smart Forms & Routing',
      description: 'Dynamic forms that adapt based on visitor behavior and responses. Conditional fields, progressive profiling, intelligent routing to the right team member. No more generic contact forms that go nowhere.'
    },
    {
      icon: Database,
      title: 'CRM Integration',
      description: 'Bi-directional sync with your CRM from day one. Every form submission, chatbot conversation, and page interaction creates or updates a contact record. Automated follow-up sequences trigger immediately.'
    }
  ];

  return (
    <section ref={ref} className="bg-[#0F3D3E] text-white py-32 lg:py-40 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Eyebrow */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs uppercase tracking-widest text-[#84CC16] font-semibold font-['Lora']">
            Intelligence
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="text-4xl lg:text-5xl mb-8"
          style={{ fontFamily: 'Playfair Display, serif' }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Your Website Does Not Sleep
        </motion.h2>

        {/* Body Copy */}
        <motion.div
          className="max-w-4xl mb-16 space-y-6 text-lg text-white/70 leading-relaxed font-['Lora']"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p>
            A traditional website is a digital brochure. It displays information and hopes someone fills out a contact form. Our websites are active systems that engage visitors, capture intent, qualify leads, and trigger workflows — automatically, around the clock. The intelligence layer we embed transforms your website from a static marketing asset into a dynamic lead generation and customer engagement machine.
          </p>
          <p>
            Every site ships with an AI chatbot that qualifies visitors and books meetings while your team sleeps. Smart forms that adapt questions based on previous answers and route submissions to the right person. Real-time CRM integration that creates contacts, logs interactions, and triggers follow-up sequences the moment a visitor engages.
          </p>
        </motion.div>

        {/* Intelligence Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="bg-white/5 border border-[#84CC16]/20 p-8 hover:border-[#84CC16] transition-all duration-500 group backdrop-blur-sm"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
                whileHover={{ 
                  y: -4,
                  boxShadow: '0 0 20px rgba(132,204,22,0.1)'
                }}
              >
                {/* Icon */}
                <div className="mb-6">
                  <Icon className="w-9 h-9 text-[#84CC16]" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 
                  className="text-2xl mb-4 group-hover:text-[#84CC16] transition-colors"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-white/70 leading-relaxed font-['Lora']">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
