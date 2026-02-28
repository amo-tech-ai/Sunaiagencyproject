import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export default function ArchitectureSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const layers = [
    { name: 'Frontend', color: '#FAF9F5', textColor: '#0E3E1B' },
    { name: 'API Layer', color: '#F1EEEA', textColor: '#0E3E1B' },
    { name: 'AI Layer', color: '#7EF473', textColor: '#0E3E1B' },
    { name: 'Data Layer', color: '#F1EEEA', textColor: '#0E3E1B' },
    { name: 'Infrastructure', color: '#FAF9F5', textColor: '#0E3E1B' }
  ];

  const technologies = [
    { name: 'React', category: 'frontend' },
    { name: 'Next.js', category: 'frontend' },
    { name: 'TypeScript', category: 'frontend' },
    { name: 'Node.js', category: 'backend' },
    { name: 'Python', category: 'backend' },
    { name: 'PostgreSQL', category: 'data' },
    { name: 'Supabase', category: 'data' },
    { name: 'OpenAI', category: 'ai' },
    { name: 'Anthropic', category: 'ai' },
    { name: 'Vercel', category: 'infra' },
    { name: 'AWS', category: 'infra' }
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
              ARCHITECTURE
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl lg:text-6xl mb-6 text-[#FAF9F5]"
              style={{ fontFamily: 'Georgia, serif' }}>
            Modern Stack. Future-Proof Foundation.
          </h2>
        </motion.div>

        {/* Architecture Layers Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6">
            {layers.map((layer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="relative"
              >
                {/* Layer Card */}
                <div 
                  className="rounded-2xl px-8 py-6 text-center shadow-lg min-w-[180px]"
                  style={{ 
                    backgroundColor: layer.color,
                    border: layer.name === 'AI Layer' ? '2px solid #7EF473' : '1px solid rgba(14, 62, 27, 0.1)'
                  }}
                >
                  <div className="text-xl font-semibold"
                       style={{ 
                         fontFamily: 'system-ui, -apple-system',
                         color: layer.textColor
                       }}>
                    {layer.name}
                  </div>
                </div>

                {/* Arrow */}
                {index < layers.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-5 transform -translate-y-1/2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="#7EF473" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technology Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.05 }}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold backdrop-blur-sm border transition-all duration-200 hover:scale-105 ${
                  tech.category === 'ai' 
                    ? 'bg-[#7EF473]/20 border-[#7EF473]/50 text-[#7EF473]' 
                    : 'bg-white/5 border-white/20 text-white/80 hover:border-white/40'
                }`}
                style={{ fontFamily: 'system-ui, -apple-system' }}
              >
                {tech.name}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <p className="text-lg text-[#FAF9F5]/70"
             style={{ fontFamily: 'system-ui, -apple-system' }}>
            We build systems your future engineering team can scale.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
