import { motion } from 'motion/react';

/* ═══════════════════════════════════════════════════════════════
   Technology Stack Section — Light & Dark Combined Edition
   ═══════════════════════════════════════════════════════════════ 
   
   Design Philosophy:
   - Strategic mix of light and dark cards in the same grid
   - Creates dramatic contrast and visual sophistication
   - Dark cards for AI/core tech, light cards for infrastructure
   - Premium glassmorphism on both themes
   
   Pattern: Dark → Light → Dark → Light → Light
   This creates an intentional, editorial visual rhythm
   
   ═══════════════════════════════════════════════════════════════ */

interface Technology {
  name: string;
  description: string;
}

interface TechCategory {
  id: string;
  title: string;
  technologies: Technology[];
  theme: 'dark' | 'light'; // Each card has its own theme
}

const techStack: TechCategory[] = [
  {
    id: 'ai-intelligence',
    title: 'AI & Agent Intelligence',
    theme: 'dark',
    technologies: [
      {
        name: 'OpenAI GPT-4o',
        description: 'Advanced reasoning and language generation for agents and chatbots'
      },
      {
        name: 'Assistants API',
        description: 'Agent framework with tool calling, code execution, and persistent threads'
      },
      {
        name: 'Anthropic Claude',
        description: 'Long-context analysis and safety-conscious AI reasoning'
      },
      {
        name: 'LlamaIndex',
        description: 'RAG framework for connecting LLMs to private data sources'
      },
      {
        name: 'Mistral',
        description: 'Open-source models for privacy-first and cost-efficient AI'
      }
    ]
  },
  {
    id: 'data-infrastructure',
    title: 'Data & Vector Infrastructure',
    theme: 'light',
    technologies: [
      {
        name: 'Supabase + pgvector',
        description: 'Vector search, auth, real-time, and storage — all in PostgreSQL'
      },
      {
        name: 'Redis',
        description: 'In-memory caching and real-time response acceleration'
      },
      {
        name: 'Cloudinary',
        description: 'AI-powered media management and optimization'
      }
    ]
  },
  {
    id: 'automation-integration',
    title: 'Automation & Integration',
    theme: 'dark',
    technologies: [
      {
        name: 'n8n',
        description: 'Self-hosted workflow automation for AI agent pipelines'
      },
      {
        name: 'WhatsApp Business API',
        description: 'AI conversations on the world\'s #1 messaging platform'
      },
      {
        name: 'Twilio',
        description: 'Multi-channel SMS, voice, and messaging APIs'
      },
      {
        name: 'Tiptap',
        description: 'Rich text editing for AI-powered content interfaces'
      }
    ]
  },
  {
    id: 'frontend-application',
    title: 'Frontend & Application',
    theme: 'light',
    technologies: [
      {
        name: 'React',
        description: 'Interactive web applications and AI dashboards'
      },
      {
        name: 'Next.js',
        description: 'SSR, API routes, and production-grade React framework'
      },
      {
        name: 'TypeScript',
        description: 'Type-safe JavaScript for complex AI application logic'
      },
      {
        name: 'Tailwind CSS',
        description: 'Utility-first CSS for rapid custom UI development'
      },
      {
        name: 'Vite',
        description: 'Lightning-fast builds and hot module replacement'
      }
    ]
  },
  {
    id: 'deployment-infrastructure',
    title: 'Deployment & Infrastructure',
    theme: 'light',
    technologies: [
      {
        name: 'Vercel',
        description: 'Edge deployment with instant rollbacks and global CDN'
      },
      {
        name: 'Docker',
        description: 'Containerized AI workloads and reproducible environments'
      },
      {
        name: 'GitHub',
        description: 'Version control, CI/CD automation, and code review pipelines'
      }
    ]
  }
];

interface Metric {
  number: string;
  label: string;
  suffix?: string;
}

const metrics: Metric[] = [
  { number: '20', suffix: '+', label: 'Technologies in Our Production Stack' },
  { number: '99.9', suffix: '%', label: 'Uptime Across Deployed Systems' },
  { number: '24', suffix: '/7', label: 'Monitoring & Incident Response' }
];

export default function TechStackSection() {
  return (
    <section 
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #F4F3EE 0%, #F9F8F6 50%, #F4F3EE 100%)',
        paddingTop: '120px',
        paddingBottom: '120px',
      }}
      aria-labelledby="tech-stack-heading"
    >
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top gradient orb */}
        <div 
          className="absolute -top-40 right-1/4 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(132, 204, 22, 0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Bottom gradient orb */}
        <div 
          className="absolute -bottom-40 left-1/4 w-96 h-96 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(46, 111, 94, 0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Subtle texture */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
          }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          {/* Eyebrow Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2.5 mb-8 px-6 py-2.5 rounded-full backdrop-blur-md"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 61, 54, 0.08), rgba(30, 61, 54, 0.04))',
              border: '1px solid rgba(30, 61, 54, 0.12)',
              boxShadow: '0 4px 16px rgba(30, 61, 54, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
            }}
          >
            <span 
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ 
                background: '#84CC16',
                boxShadow: '0 0 12px rgba(132, 204, 22, 0.6)',
              }}
            />
            <span 
              className="text-sm font-semibold tracking-[0.15em] uppercase"
              style={{ 
                color: '#2E6F5E',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              Technology Stack
            </span>
          </motion.div>
          
          {/* Main Headline */}
          <motion.h2 
            id="tech-stack-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-7"
            style={{ 
              color: '#1E3D36',
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
              fontWeight: 600,
              lineHeight: 1.12,
              letterSpacing: '-0.025em',
            }}
          >
            We Build With{' '}
            <span 
              className="relative inline-block"
              style={{ color: '#2E6F5E' }}
            >
              The Best
              {/* Decorative underline */}
              <svg 
                className="absolute left-0 -bottom-2 w-full h-3"
                viewBox="0 0 200 12" 
                preserveAspectRatio="none"
                style={{ opacity: 0.5 }}
              >
                <motion.path
                  d="M0,6 Q50,2 100,6 T200,6"
                  fill="none"
                  stroke="#84CC16"
                  strokeWidth="2.5"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 1.2, ease: "easeInOut" }}
                />
              </svg>
            </span>
          </motion.h2>
          
          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl max-w-2xl mx-auto"
            style={{ 
              color: 'rgba(30, 61, 54, 0.65)',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 400,
              lineHeight: 1.7,
              letterSpacing: '-0.01em',
            }}
          >
            Every tool is chosen for speed, reliability, and real-world AI performance — not hype.
          </motion.p>
        </div>

        {/* Mixed Light & Dark Cards Grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-20"
          role="list"
        >
          {techStack.map((category, categoryIndex) => {
            const isDark = category.theme === 'dark';
            
            return (
              <motion.article
                key={category.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ 
                  delay: categoryIndex * 0.08,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1]
                }}
                role="listitem"
                className={`tech-card-mixed group relative ${isDark ? 'is-dark' : 'is-light'}`}
                style={{
                  background: isDark 
                    ? 'linear-gradient(135deg, rgba(30, 61, 54, 0.95) 0%, rgba(26, 53, 48, 0.98) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
                  border: isDark
                    ? '1px solid rgba(132, 204, 22, 0.15)'
                    : '1px solid rgba(30, 61, 54, 0.08)',
                  borderRadius: '24px',
                  padding: '32px',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  boxShadow: isDark
                    ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(132, 204, 22, 0.1)'
                    : '0 4px 24px rgba(30, 61, 54, 0.06), 0 1px 2px rgba(30, 61, 54, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                  willChange: 'transform',
                }}
              >
                {/* Hover gradient overlay */}
                <div 
                  className="absolute inset-0 rounded-24 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: isDark
                      ? 'radial-gradient(circle at top, rgba(132, 204, 22, 0.15) 0%, transparent 60%)'
                      : 'linear-gradient(135deg, rgba(132, 204, 22, 0.04) 0%, transparent 100%)',
                    borderRadius: '24px',
                  }}
                />

                {/* Top accent line */}
                <div 
                  className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(90deg, transparent, #84CC16, transparent)',
                  }}
                />

                {/* Category Title */}
                <div className="relative mb-8">
                  <h3 
                    className="relative pb-3 flex items-center gap-2"
                    style={{
                      color: isDark ? '#84CC16' : '#2E6F5E',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                    }}
                  >
                    <span 
                      className="w-1 h-1 rounded-full"
                      style={{ 
                        background: isDark ? '#84CC16' : '#2E6F5E',
                        boxShadow: isDark ? '0 0 8px rgba(132, 204, 22, 0.5)' : 'none',
                      }}
                    />
                    {category.title}
                  </h3>
                  {/* Gradient underline */}
                  <div 
                    className="relative h-px w-full mt-3 overflow-hidden"
                    style={{ 
                      background: isDark 
                        ? 'rgba(132, 204, 22, 0.2)' 
                        : 'linear-gradient(90deg, rgba(46, 111, 94, 0.15), transparent)' 
                    }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      style={{ 
                        background: isDark 
                          ? 'linear-gradient(90deg, #84CC16, rgba(132, 204, 22, 0.3))'
                          : 'linear-gradient(90deg, #2E6F5E, #84CC16)' 
                      }}
                      initial={{ x: '-100%' }}
                      whileInView={{ x: '0%' }}
                      viewport={{ once: true }}
                      transition={{ delay: categoryIndex * 0.08 + 0.4, duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Technologies List */}
                <div className="space-y-6 relative z-10">
                  {category.technologies.map((tech, techIndex) => (
                    <motion.div 
                      key={techIndex}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        delay: categoryIndex * 0.08 + techIndex * 0.06 + 0.3,
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                    >
                      <h4 
                        className="mb-2 transition-all duration-300"
                        style={{
                          color: isDark ? 'rgba(255, 255, 255, 0.95)' : '#1E3D36',
                          fontFamily: 'Inter, system-ui, sans-serif',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          lineHeight: 1.4,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {tech.name}
                      </h4>
                      <p 
                        className="transition-colors duration-300"
                        style={{
                          color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(30, 61, 54, 0.6)',
                          fontFamily: 'Inter, system-ui, sans-serif',
                          fontSize: '0.8rem',
                          fontWeight: 400,
                          lineHeight: 1.65,
                          letterSpacing: '0.005em',
                        }}
                      >
                        {tech.description}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Corner accent (different for dark/light) */}
                <div 
                  className="absolute bottom-4 right-4 w-12 h-12 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700"
                  style={{
                    background: isDark
                      ? 'radial-gradient(circle, rgba(132, 204, 22, 0.2) 0%, transparent 70%)'
                      : 'radial-gradient(circle, rgba(132, 204, 22, 0.08) 0%, transparent 70%)',
                  }}
                />

                {/* Dark card glow effect */}
                {isDark && (
                  <div 
                    className="absolute inset-0 rounded-24 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{
                      boxShadow: '0 0 60px rgba(132, 204, 22, 0.2)',
                      borderRadius: '24px',
                    }}
                  />
                )}
              </motion.article>
            );
          })}
        </div>

        {/* Metrics Bar - Alternating Dark/Light */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Decorative divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="w-32 h-px mx-auto mb-16"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(46, 111, 94, 0.3), transparent)',
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {metrics.map((metric, index) => {
              const isDarkMetric = index % 2 === 0; // Alternate pattern
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: 0.2 + (index * 0.15),
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="relative group p-8 rounded-3xl"
                  style={{
                    background: isDarkMetric
                      ? 'linear-gradient(135deg, rgba(30, 61, 54, 0.4), rgba(26, 53, 48, 0.3))'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3))',
                    border: isDarkMetric
                      ? '1px solid rgba(132, 204, 22, 0.2)'
                      : '1px solid rgba(30, 61, 54, 0.1)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: isDarkMetric
                      ? '0 8px 32px rgba(0, 0, 0, 0.1)'
                      : '0 4px 16px rgba(30, 61, 54, 0.05)',
                  }}
                >
                  {/* Top decorative dots */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1">
                    <span 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ background: isDarkMetric ? 'rgba(132, 204, 22, 0.4)' : 'rgba(46, 111, 94, 0.3)' }} 
                    />
                    <span 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ background: isDarkMetric ? 'rgba(132, 204, 22, 0.7)' : 'rgba(46, 111, 94, 0.6)' }} 
                    />
                    <span 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ background: isDarkMetric ? '#84CC16' : '#2E6F5E' }} 
                    />
                  </div>
                  
                  {/* Number */}
                  <div className="relative inline-block mb-4">
                    <div 
                      className="flex items-start justify-center"
                      style={{
                        color: isDarkMetric ? '#84CC16' : '#1E3D36',
                        fontFamily: 'Playfair Display, serif',
                        fontSize: 'clamp(3rem, 5vw, 4rem)',
                        fontWeight: 600,
                        lineHeight: 1,
                        letterSpacing: '-0.03em',
                      }}
                    >
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ 
                          delay: 0.3 + (index * 0.15), 
                          duration: 0.6,
                          ease: [0.22, 1, 0.36, 1]
                        }}
                      >
                        {metric.number}
                      </motion.span>
                      {metric.suffix && (
                        <span 
                          style={{ 
                            fontSize: '0.45em',
                            opacity: 0.85,
                            marginTop: '0.5rem',
                          }}
                        >
                          {metric.suffix}
                        </span>
                      )}
                    </div>
                    {/* Glow effect for dark metrics */}
                    {isDarkMetric && (
                      <div 
                        className="absolute inset-0 blur-2xl opacity-20 transition-opacity duration-700 group-hover:opacity-40 pointer-events-none"
                        style={{ color: '#84CC16' }}
                      >
                        <div style={{ fontSize: 'clamp(3rem, 5vw, 4rem)' }}>
                          {metric.number}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Label */}
                  <p 
                    className="max-w-[200px] mx-auto"
                    style={{
                      color: isDarkMetric ? 'rgba(255, 255, 255, 0.7)' : 'rgba(30, 61, 54, 0.7)',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      lineHeight: 1.6,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {metric.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

      </div>
      
      {/* Premium Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Mixed card hover effects - Dark cards */
        .tech-card-mixed.is-dark:hover {
          transform: translateY(-12px) scale(1.02);
          border-color: rgba(132, 204, 22, 0.35) !important;
          box-shadow: 
            0 24px 64px rgba(0, 0, 0, 0.4),
            0 8px 32px rgba(132, 204, 22, 0.2),
            0 0 0 1px rgba(132, 204, 22, 0.2),
            inset 0 1px 0 rgba(132, 204, 22, 0.2) !important;
        }

        /* Mixed card hover effects - Light cards */
        .tech-card-mixed.is-light:hover {
          transform: translateY(-12px) scale(1.02);
          border-color: rgba(132, 204, 22, 0.2) !important;
          box-shadow: 
            0 24px 64px rgba(30, 61, 54, 0.15),
            0 8px 24px rgba(132, 204, 22, 0.08),
            0 0 0 1px rgba(132, 204, 22, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 1) !important;
        }

        /* Floating animation */
        @keyframes float-mixed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .tech-card-mixed {
          animation: float-mixed 8s ease-in-out infinite;
        }

        .tech-card-mixed:nth-child(2) { animation-delay: 0.8s; }
        .tech-card-mixed:nth-child(3) { animation-delay: 1.6s; }
        .tech-card-mixed:nth-child(4) { animation-delay: 2.4s; }
        .tech-card-mixed:nth-child(5) { animation-delay: 3.2s; }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .tech-card-mixed,
          .tech-card-mixed *,
          * {
            animation: none !important;
            transition: none !important;
          }
        }

        /* Tablet-specific grid adjustment */
        @media (min-width: 768px) and (max-width: 1279px) {
          .tech-card-mixed:nth-child(4),
          .tech-card-mixed:nth-child(5) {
            max-width: 480px;
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}} />
    </section>
  );
}
