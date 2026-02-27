import { motion } from 'motion/react';

/* ═══════════════════════════════════════════════════════════════
   Technology Stack Section
   ═══════════════════════════════════════════════════════════════ 
   
   Design: Dark green with lime accents + glassmorphism
   Purpose: Technical credibility and enterprise trust
   
   Color Mapping:
   - Background: #1E3D36 (deep green)
   - Accent: #84CC16 (lime green)
   - Cards: rgba(220,229,221,0.06) with blur
   - Text: #FFFFFF with rgba(255,255,255,0.5) for descriptions
   
   Layout:
   - Desktop: 5 columns
   - Tablet: 3 + 2 grid
   - Mobile: 1 column stack
   
   ═══════════════════════════════════════════════════════════════ */

interface Technology {
  name: string;
  description: string;
}

interface TechCategory {
  id: string;
  title: string;
  technologies: Technology[];
}

const techStack: TechCategory[] = [
  {
    id: 'ai-intelligence',
    title: 'AI & Agent Intelligence',
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
}

const metrics: Metric[] = [
  { number: '20+', label: 'Technologies in Our Production Stack' },
  { number: '99.9%', label: 'Uptime Across Deployed Systems' },
  { number: '24/7', label: 'Monitoring & Incident Response' }
];

export default function TechStackSection() {
  return (
    <section 
      className="py-24 lg:py-32 relative overflow-hidden"
      style={{
        background: '#1E3D36',
      }}
      aria-labelledby="tech-stack-heading"
    >
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* 1. Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full backdrop-blur-sm"
            style={{
              background: 'rgba(220, 229, 221, 0.12)',
              border: '1px solid rgba(220, 229, 221, 0.15)'
            }}
          >
            <span 
              className="text-sm font-medium tracking-wide uppercase"
              style={{ 
                color: '#84CC16',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}
            >
              Technology Stack
            </span>
          </motion.div>
          
          <motion.h2 
            id="tech-stack-heading"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl mb-6 tracking-tight leading-tight"
            style={{ 
              color: '#FFFFFF',
              fontFamily: 'Playfair Display, serif',
              fontWeight: 600
            }}
          >
            We Build With{' '}
            <span style={{ color: '#84CC16' }}>
              The Best
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg max-w-2xl mx-auto"
            style={{ 
              color: 'rgba(255, 255, 255, 0.55)',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 400,
              lineHeight: 1.7
            }}
          >
            Every tool is chosen for speed, reliability, and real-world AI performance — not hype.
          </motion.p>
        </div>

        {/* 2. Technology Grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16 lg:mb-20"
          role="list"
        >
          {techStack.map((category, categoryIndex) => (
            <motion.article
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: categoryIndex * 0.1,
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="tech-card group"
              role="listitem"
              style={{
                background: 'rgba(220, 229, 221, 0.06)',
                border: '1px solid rgba(220, 229, 221, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {/* Category Title with Underline */}
              <h3 
                className="relative pb-2 mb-6"
                style={{
                  color: '#84CC16',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}
              >
                {category.title}
                <span 
                  className="absolute left-0 bottom-0"
                  style={{
                    width: '40px',
                    height: '2px',
                    background: '#84CC16',
                    display: 'block'
                  }}
                />
              </h3>

              {/* Technologies List */}
              <div className="space-y-5">
                {category.technologies.map((tech, techIndex) => (
                  <div key={techIndex}>
                    <h4 
                      style={{
                        color: '#FFFFFF',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontSize: '1rem',
                        fontWeight: 600,
                        marginBottom: '0.375rem',
                        lineHeight: 1.5
                      }}
                    >
                      {tech.name}
                    </h4>
                    <p 
                      style={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontSize: '0.8rem',
                        fontWeight: 300,
                        lineHeight: 1.6
                      }}
                    >
                      {tech.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Hover effect styles */}
              <style jsx>{`
                .tech-card:hover {
                  border-color: rgba(132, 204, 22, 0.3) !important;
                  transform: translateY(-4px);
                  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
                }
              `}</style>
            </motion.article>
          ))}
        </div>

        {/* 3. Metrics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="border-t pt-12 lg:pt-16"
          style={{
            borderColor: 'rgba(220, 229, 221, 0.15)'
          }}
          aria-label="Technology metrics"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + (index * 0.1) }}
                className="metric"
              >
                <div 
                  className="mb-2"
                  style={{
                    color: '#84CC16',
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '3rem',
                    fontWeight: 600,
                    lineHeight: 1.2
                  }}
                  aria-label={metric.number.replace('+', ' plus')}
                >
                  {metric.number}
                </div>
                <div 
                  style={{
                    color: 'rgba(255, 255, 255, 0.55)',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '0.9rem',
                    fontWeight: 400,
                    lineHeight: 1.5
                  }}
                >
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
      
      {/* Reduced Motion Support */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }

        /* Tablet-specific grid adjustment for 3+2 layout */
        @media (min-width: 768px) and (max-width: 1279px) {
          .tech-card:nth-child(4),
          .tech-card:nth-child(5) {
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}</style>
    </section>
  );
}
