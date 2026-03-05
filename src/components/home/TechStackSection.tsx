import { motion } from 'motion/react';
import {
  Brain,
  Database,
  Workflow,
  Layout,
  Cloud,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   C07 — Technology Stack Section — Layered Depth Edition
   ═══════════════════════════════════════════════════════════════
   
   Improvements over v1:
   - Layered depth with stacked card shadows + offset borders
   - Lucide tech icons for each category
   - Alternating light (#FAF9F5) / dark (#0E3E1B) cards
   - Generous spacing (gap-8, py-32)
   - Subtle streaming data background (binary/hex pattern)
   
   Color palette:
   - Dark forest:  #0E3E1B
   - Off-white:    #FAF9F5
   - Warm beige:   #F1EEEA
   - Lime accent:  #7EF473
   - Orange CTA:   #FF6B4A
   
   ═══════════════════════════════════════════════════════════════ */

interface Technology {
  name: string;
  description: string;
}

interface TechCategory {
  id: string;
  title: string;
  technologies: Technology[];
  theme: 'dark' | 'light';
  icon: React.ElementType;
}

const techStack: TechCategory[] = [
  {
    id: 'ai-intelligence',
    title: 'AI & Agent Intelligence',
    theme: 'dark',
    icon: Brain,
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
    icon: Database,
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
    icon: Workflow,
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
    icon: Layout,
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
    theme: 'dark',
    icon: Cloud,
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

/* Streaming data strings for background effect */
const dataStreams = [
  '01001 10110 01001 11010 00101 11001 01010 10011 00111 01100',
  'A3F2 9B1C E7D4 5A08 C6F3 2D9E 8B4A 1F07 D5C2 6E3B',
  '11010 00111 10100 01011 11001 00110 10101 01000 11110 00101',
  '7E2D B4A1 F893 6C5E 0D7F A2B6 3E8C 1D4A 9F05 C7E2',
  '00110 11001 10010 01101 10110 01011 00100 11011 01110 10001',
];

export default function TechStackSection() {
  return (
    <section 
      className="relative overflow-hidden"
      style={{
        background: '#F1EEEA',
        paddingTop: '140px',
        paddingBottom: '140px',
      }}
      aria-labelledby="tech-stack-heading"
    >
      {/* ── Subtle streaming data background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        {dataStreams.map((stream, i) => (
          <motion.div
            key={i}
            className="absolute whitespace-nowrap"
            style={{
              top: `${12 + i * 20}%`,
              left: '-10%',
              fontFamily: 'monospace',
              fontSize: '11px',
              letterSpacing: '0.25em',
              color: i % 2 === 0 ? 'rgba(14, 62, 27, 0.04)' : 'rgba(126, 244, 115, 0.045)',
              lineHeight: 1,
            }}
            initial={{ x: '-10%' }}
            animate={{ x: '110%' }}
            transition={{
              duration: 50 + i * 8,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 3,
            }}
          >
            {stream} {stream} {stream}
          </motion.div>
        ))}

        {/* Ambient gradient orbs */}
        <div 
          className="absolute -top-32 right-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(126, 244, 115, 0.08) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        <div 
          className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(14, 62, 27, 0.06) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        
        {/* ── Header ── */}
        <div className="text-center max-w-4xl mx-auto mb-24">
          {/* Eyebrow Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2.5 mb-8 px-6 py-2.5 rounded-full"
            style={{
              background: 'rgba(14, 62, 27, 0.06)',
              border: '1px solid rgba(14, 62, 27, 0.1)',
              boxShadow: '0 2px 12px rgba(14, 62, 27, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <span 
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ 
                background: '#7EF473',
                boxShadow: '0 0 12px rgba(126, 244, 115, 0.6)',
              }}
            />
            <span 
              className="text-sm tracking-[0.15em] uppercase"
              style={{ 
                color: '#0E3E1B',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 600,
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
              color: '#0E3E1B',
              fontFamily: 'Georgia, Playfair Display, serif',
              fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
              fontWeight: 600,
              lineHeight: 1.12,
              letterSpacing: '-0.025em',
            }}
          >
            We Build With{' '}
            <span className="relative inline-block" style={{ color: '#0E3E1B' }}>
              The Best
              <svg 
                className="absolute left-0 -bottom-2 w-full h-3"
                viewBox="0 0 200 12" 
                preserveAspectRatio="none"
                style={{ opacity: 0.7 }}
              >
                <motion.path
                  d="M0,6 Q50,2 100,6 T200,6"
                  fill="none"
                  stroke="#7EF473"
                  strokeWidth="3"
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
              color: 'rgba(14, 62, 27, 0.6)',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 400,
              lineHeight: 1.7,
            }}
          >
            Every tool is chosen for speed, reliability, and real-world AI performance — not hype.
          </motion.p>
        </div>

        {/* ── Layered Tech Cards Grid ── */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-24"
          role="list"
        >
          {techStack.map((category, categoryIndex) => {
            const isDark = category.theme === 'dark';
            const IconComponent = category.icon;
            
            return (
              <motion.article
                key={category.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ 
                  delay: categoryIndex * 0.1,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1]
                }}
                role="listitem"
                className="tech-card-v2 group relative"
                style={{
                  borderRadius: '28px',
                }}
              >
                {/* ── Layered depth: background offset card ── */}
                {isDark && (
                  <>
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        borderRadius: '28px',
                        background: 'rgba(30, 60, 38, 0.25)',
                        transform: 'translate(6px, 6px)',
                      }}
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        borderRadius: '28px',
                        background: 'rgba(30, 60, 38, 0.4)',
                        transform: 'translate(3px, 3px)',
                        border: '1px solid rgba(126, 244, 115, 0.06)',
                      }}
                    />
                  </>
                )}
                
                {/* ── Main card surface ── */}
                <div
                  className="relative overflow-hidden transition-all duration-500"
                  style={{
                    background: isDark 
                      ? 'linear-gradient(155deg, #2B4A33 0%, #243F2B 40%, #1E3824 80%, #2B4A33 100%)'
                      : '#FFFFFF',
                    border: isDark
                      ? '1px solid rgba(126, 244, 115, 0.1)'
                      : '1px solid rgba(14, 62, 27, 0.06)',
                    borderRadius: isDark ? '28px' : '20px',
                    padding: isDark ? '40px' : '32px 28px',
                    backdropFilter: isDark ? 'blur(20px)' : undefined,
                    boxShadow: isDark
                      ? '0 12px 40px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                      : '0 1px 3px rgba(14, 62, 27, 0.04)',
                  }}
                >
                  {/* Hover glow overlay */}
                  {isDark && (
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse at top left, rgba(126, 244, 115, 0.1) 0%, transparent 60%)',
                        borderRadius: '28px',
                      }}
                    />
                  )}

                  {/* Subtle grid pattern inside dark cards */}
                  {isDark && (
                    <div
                      className="absolute inset-0 opacity-[0.03] pointer-events-none"
                      style={{
                        backgroundImage: `
                          linear-gradient(rgba(126, 244, 115, 0.3) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(126, 244, 115, 0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                        borderRadius: '28px',
                      }}
                    />
                  )}

                  {/* ── Icon + Category Header ── */}
                  <div className={`relative ${isDark ? 'mb-8 flex items-start gap-4' : 'mb-6 flex items-center gap-3.5'}`}>
                    {/* Icon container */}
                    <div
                      className={`shrink-0 flex items-center justify-center ${isDark ? 'transition-transform duration-500 group-hover:scale-110' : ''}`}
                      style={{
                        width: isDark ? '52px' : '44px',
                        height: isDark ? '52px' : '44px',
                        borderRadius: isDark ? '16px' : '12px',
                        background: isDark
                          ? 'linear-gradient(135deg, rgba(126, 244, 115, 0.15) 0%, rgba(126, 244, 115, 0.05) 100%)'
                          : '#F3F2EE',
                        border: isDark
                          ? '1px solid rgba(126, 244, 115, 0.2)'
                          : 'none',
                        boxShadow: isDark
                          ? '0 4px 16px rgba(126, 244, 115, 0.1)'
                          : 'none',
                      }}
                    >
                      <IconComponent
                        size={isDark ? 24 : 20}
                        style={{
                          color: isDark ? '#7EF473' : '#5C7A6B',
                        }}
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 
                        style={{
                          color: isDark ? '#7EF473' : '#0E3E1B',
                          fontFamily: 'Inter, system-ui, sans-serif',
                          fontSize: isDark ? '0.75rem' : '0.7rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.15em',
                          lineHeight: isDark ? undefined : 1.3,
                        }}
                      >
                        {category.title}
                      </h3>
                      {/* Gradient underline — only on dark cards */}
                      {isDark && (
                        <div className="relative h-px w-full mt-3 overflow-hidden">
                          <div style={{ 
                            background: 'rgba(126, 244, 115, 0.12)',
                            height: '1px',
                            width: '100%',
                          }} />
                          <motion.div
                            className="absolute top-0 left-0 h-full"
                            style={{ 
                              background: 'linear-gradient(90deg, #7EF473, rgba(126, 244, 115, 0.2))',
                              width: '100%',
                            }}
                            initial={{ x: '-100%' }}
                            whileInView={{ x: '0%' }}
                            viewport={{ once: true }}
                            transition={{ delay: categoryIndex * 0.1 + 0.4, duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Separator line for light cards (below header) */}
                  {!isDark && (
                    <div style={{ 
                      height: '1px', 
                      background: 'rgba(14, 62, 27, 0.08)', 
                      marginBottom: '20px',
                    }} />
                  )}

                  {/* ── Technologies List ── */}
                  <div className={isDark ? 'space-y-5 relative z-10' : 'relative z-10'}>
                    {category.technologies.map((tech, techIndex) => (
                      <motion.div 
                        key={techIndex}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                          delay: categoryIndex * 0.1 + techIndex * 0.06 + 0.3,
                          duration: 0.5,
                          ease: [0.22, 1, 0.36, 1]
                        }}
                        className={isDark ? 'group/tech pl-4 transition-all duration-300' : 'transition-all duration-300'}
                        style={{
                          borderLeft: isDark
                            ? '2px solid rgba(126, 244, 115, 0.12)'
                            : undefined,
                          borderTop: !isDark && techIndex > 0
                            ? '1px solid rgba(14, 62, 27, 0.06)'
                            : undefined,
                          paddingTop: !isDark && techIndex > 0 ? '16px' : undefined,
                          paddingBottom: !isDark ? '16px' : undefined,
                        }}
                      >
                        <h4 
                          className="mb-1.5"
                          style={{
                            color: isDark ? 'rgba(255, 255, 255, 0.95)' : '#0E3E1B',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontSize: isDark ? '0.95rem' : '0.9rem',
                            fontWeight: 600,
                            lineHeight: 1.4,
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {tech.name}
                        </h4>
                        <p 
                          style={{
                            color: isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(14, 62, 27, 0.5)',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontSize: isDark ? '0.8rem' : '0.8rem',
                            fontWeight: 400,
                            lineHeight: 1.65,
                          }}
                        >
                          {tech.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Top accent line on hover — dark only */}
                  {isDark && (
                    <div 
                      className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: 'linear-gradient(90deg, transparent, #7EF473, transparent)',
                      }}
                    />
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* ── Metrics Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Decorative divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="w-40 h-px mx-auto mb-20"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(14, 62, 27, 0.2), transparent)',
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {metrics.map((metric, index) => {
              const isDarkMetric = index % 2 === 0;
              
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
                  className="relative group text-center"
                  style={{
                    padding: '40px 32px',
                    borderRadius: '24px',
                    background: isDarkMetric
                      ? 'linear-gradient(145deg, #2B4A33 0%, #243F2B 100%)'
                      : 'linear-gradient(145deg, rgba(250, 249, 245, 0.8), rgba(255, 255, 255, 0.6))',
                    border: isDarkMetric
                      ? '1px solid rgba(126, 244, 115, 0.15)'
                      : '1px solid rgba(14, 62, 27, 0.08)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: isDarkMetric
                      ? '0 12px 40px rgba(0, 0, 0, 0.25), 6px 6px 0 rgba(14, 62, 27, 0.15)'
                      : '0 8px 24px rgba(14, 62, 27, 0.05), 4px 4px 0 rgba(14, 62, 27, 0.03)',
                  }}
                >
                  {/* Top decorative dots */}
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
                    <span 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ background: isDarkMetric ? 'rgba(126, 244, 115, 0.3)' : 'rgba(14, 62, 27, 0.15)' }} 
                    />
                    <span 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ background: isDarkMetric ? 'rgba(126, 244, 115, 0.6)' : 'rgba(14, 62, 27, 0.35)' }} 
                    />
                    <span 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ background: isDarkMetric ? '#7EF473' : '#0E3E1B' }} 
                    />
                  </div>
                  
                  {/* Number */}
                  <div className="relative inline-block mb-4">
                    <div 
                      className="flex items-start justify-center"
                      style={{
                        color: isDarkMetric ? '#7EF473' : '#0E3E1B',
                        fontFamily: 'Georgia, Playfair Display, serif',
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
                        <span style={{ fontSize: '0.45em', opacity: 0.85, marginTop: '0.5rem' }}>
                          {metric.suffix}
                        </span>
                      )}
                    </div>
                    {isDarkMetric && (
                      <div 
                        className="absolute inset-0 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
                        style={{ 
                          background: 'radial-gradient(circle, rgba(126, 244, 115, 0.4) 0%, transparent 70%)',
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Label */}
                  <p 
                    className="max-w-[200px] mx-auto"
                    style={{
                      color: isDarkMetric ? 'rgba(255, 255, 255, 0.6)' : 'rgba(14, 62, 27, 0.6)',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      lineHeight: 1.6,
                      letterSpacing: '0.01em',
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
      
      {/* ── Styles ── */}
      <style dangerouslySetInnerHTML={{__html: `
        .tech-card-v2 {
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .tech-card-v2:hover {
          transform: translateY(-8px);
        }
        .tech-card-v2:hover > div:last-of-type {
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.15),
            0 8px 24px rgba(14, 62, 27, 0.1) !important;
        }
        .tech-card-v2 .group\\/tech:hover {
          border-left-color: #7EF473 !important;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .tech-card-v2,
          .tech-card-v2 * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}} />
    </section>
  );
}