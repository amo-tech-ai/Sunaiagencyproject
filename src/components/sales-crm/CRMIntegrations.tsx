import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Mail, Calendar, MessageSquare, FileText, Zap } from 'lucide-react';

export default function CRMIntegrations() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const integrationGroups = [
    {
      icon: Mail,
      category: 'Email & Calendar',
      tools: ['Gmail', 'Outlook', 'Google Calendar', 'Cal.com']
    },
    {
      icon: MessageSquare,
      category: 'Messaging',
      tools: ['WhatsApp Business API', 'Slack', 'Twilio SMS']
    },
    {
      icon: FileText,
      category: 'Data & Docs',
      tools: ['Google Workspace', 'Notion', 'Airtable']
    },
    {
      icon: Zap,
      category: 'Systems',
      tools: ['Zapier', 'Make', 'Webhooks', 'REST API']
    }
  ];

  const logos = [
    'Gmail', 'Outlook', 'Slack', 'Notion', 'Zapier', 'Airtable', 'WhatsApp', 'Twilio'
  ];

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden" style={{ backgroundColor: '#0E3E1B' }}>
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]"
           style={{
             backgroundImage: `linear-gradient(#7EF473 1px, transparent 1px), linear-gradient(90deg, #7EF473 1px, transparent 1px)`,
             backgroundSize: '60px 60px'
           }} />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-8">
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
              INTEGRATIONS
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl lg:text-6xl mb-6 text-[#FAF9F5]"
              style={{ fontFamily: 'Georgia, serif' }}>
            Connects to the Tools Your Team Already Uses
          </h2>

          {/* Body */}
          <p className="text-lg text-[#FAF9F5]/70 leading-relaxed max-w-3xl mx-auto"
             style={{ fontFamily: 'system-ui, -apple-system' }}>
            Bi-directional sync across email, calendar, messaging, docs, and systems. One source of truth. Zero manual copy-paste.
          </p>
        </motion.div>

        {/* Integration Hub Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="relative max-w-4xl mx-auto">
            {/* Desktop - Radial Layout */}
            <div className="hidden lg:block">
              {/* Center Hub */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-[#7EF473] rounded-2xl p-8 shadow-2xl shadow-[#7EF473]/30"
                >
                  <div className="text-[#0E3E1B] text-2xl font-bold text-center"
                       style={{ fontFamily: 'Georgia, serif' }}>
                    CRM
                  </div>
                  <div className="text-[#0E3E1B]/70 text-xs text-center mt-1"
                       style={{ fontFamily: 'system-ui, -apple-system' }}>
                    Central Hub
                  </div>
                </motion.div>
              </div>

              {/* Orbiting Integration Groups */}
              <div className="relative" style={{ height: '500px' }}>
                {integrationGroups.map((group, index) => {
                  const angle = (index * 90 - 45) * (Math.PI / 180);
                  const radius = 200;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                      className="absolute"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                      }}
                    >
                      <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-48 hover:border-[#7EF473]/50 transition-all">
                        <div className="w-10 h-10 bg-[#7EF473]/20 rounded-lg flex items-center justify-center mb-4">
                          <group.icon className="w-5 h-5 text-[#7EF473]" strokeWidth={1.5} />
                        </div>
                        <h4 className="text-white text-sm font-semibold mb-3"
                            style={{ fontFamily: 'system-ui, -apple-system' }}>
                          {group.category}
                        </h4>
                        <div className="space-y-1">
                          {group.tools.map((tool, toolIndex) => (
                            <div key={toolIndex} className="text-white/60 text-xs"
                                 style={{ fontFamily: 'system-ui, -apple-system' }}>
                              • {tool}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Connection Line */}
                      <svg 
                        className="absolute top-1/2 left-1/2 pointer-events-none"
                        style={{
                          width: `${radius + 50}px`,
                          height: `${radius + 50}px`,
                          transform: `translate(-50%, -50%) rotate(${angle * 180 / Math.PI}deg)`
                        }}
                      >
                        <line 
                          x1="0" 
                          y1={radius + 25} 
                          x2={radius - 30} 
                          y2={radius + 25}
                          stroke="#7EF473" 
                          strokeWidth="1" 
                          strokeDasharray="4 4"
                          opacity="0.3"
                        />
                        <polygon 
                          points={`${radius - 30},${radius + 22} ${radius - 30},${radius + 28} ${radius - 25},${radius + 25}`}
                          fill="#7EF473"
                          opacity="0.5"
                        />
                      </svg>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Mobile - Stacked Cards */}
            <div className="lg:hidden space-y-4">
              {/* Center Hub */}
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-[#7EF473] rounded-2xl p-6 text-center shadow-xl mb-8"
              >
                <div className="text-[#0E3E1B] text-xl font-bold"
                     style={{ fontFamily: 'Georgia, serif' }}>
                  CRM Central Hub
                </div>
              </motion.div>

              {/* Integration Groups */}
              {integrationGroups.map((group, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#7EF473]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <group.icon className="w-5 h-5 text-[#7EF473]" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-semibold mb-2"
                          style={{ fontFamily: 'system-ui, -apple-system' }}>
                        {group.category}
                      </h4>
                      <div className="text-white/60 text-xs"
                           style={{ fontFamily: 'system-ui, -apple-system' }}>
                        {group.tools.join(', ')}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Logo Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <p className="text-white/40 text-xs uppercase tracking-wider mb-6"
             style={{ fontFamily: 'system-ui, -apple-system' }}>
            Supported Integrations
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {logos.map((logo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.05 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2 hover:border-[#7EF473]/50 hover:bg-white/10 transition-all cursor-pointer"
              >
                <span className="text-white/60 text-sm font-medium hover:text-white/90 transition-colors"
                      style={{ fontFamily: 'system-ui, -apple-system' }}>
                  {logo}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
