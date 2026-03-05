import { motion } from 'motion/react';
import {
  Brain,
  Database,
  Workflow,
  Layout,
  Cloud,
  Sparkles,
  Server,
  Zap,
  Globe,
  Container,
  GitBranch,
  MessageSquare,
  FileCode,
  Palette,
  Cpu,
  Search,
  Send,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   C12 — Solutions Tech Stack Showcase
   ═══════════════════════════════════════════════════════════════
   
   Premium light-background tech stack for /solutions page.
   
   Palette:
   - Deep emerald:  #1f3f36
   - Soft ivory:    #f7f7f5
   - Light gray:    #f1f3f2
   - Muted sage:    #dbe6e2
   - Accent green:  #3d7a5f
   
   Typography:
   - Heading: Playfair Display
   - Body: Inter / Lora
   
   Card backgrounds cycle: sage → ivory → gray → sage → ivory
   
   ═══════════════════════════════════════════════════════════════ */

interface Technology {
  name: string;
  description: string;
  icon: React.ElementType;
}

interface TechCategory {
  id: string;
  title: string;
  categoryIcon: React.ElementType;
  technologies: Technology[];
  bg: string;
}

const techStack: TechCategory[] = [
  {
    id: 'ai-intelligence',
    title: 'AI & Agent Intelligence',
    categoryIcon: Brain,
    bg: '#FFFFFF',
    technologies: [
      { name: 'OpenAI GPT-4o', description: 'Advanced reasoning and language generation for AI agents', icon: Sparkles },
      { name: 'Anthropic Claude', description: 'Long-context AI reasoning for enterprise workflows', icon: Cpu },
      { name: 'LlamaIndex', description: 'RAG framework connecting AI models to private data', icon: Search },
      { name: 'Mistral', description: 'Open-source models for privacy-first AI', icon: Zap },
    ],
  },
  {
    id: 'data-infrastructure',
    title: 'Data & Vector Infrastructure',
    categoryIcon: Database,
    bg: '#FFFFFF',
    technologies: [
      { name: 'Supabase + pgvector', description: 'Vector search, auth, and real-time — all in PostgreSQL', icon: Database },
      { name: 'Redis', description: 'In-memory caching and real-time response acceleration', icon: Server },
      { name: 'Cloudinary', description: 'AI-powered media management and optimization', icon: Globe },
    ],
  },
  {
    id: 'automation-integration',
    title: 'Automation & Integration',
    categoryIcon: Workflow,
    bg: '#FFFFFF',
    technologies: [
      { name: 'n8n', description: 'Self-hosted workflow automation for AI pipelines', icon: Workflow },
      { name: 'WhatsApp Business API', description: 'AI conversations on the #1 messaging platform', icon: MessageSquare },
      { name: 'Twilio', description: 'Multi-channel SMS, voice, and messaging APIs', icon: Send },
      { name: 'Tiptap', description: 'Rich text editing for AI-powered interfaces', icon: FileCode },
    ],
  },
  {
    id: 'frontend-application',
    title: 'Frontend & Application',
    categoryIcon: Layout,
    bg: '#FFFFFF',
    technologies: [
      { name: 'React', description: 'Interactive web applications and AI dashboards', icon: Layout },
      { name: 'Next.js', description: 'SSR, API routes, and production-grade framework', icon: Globe },
      { name: 'TypeScript', description: 'Type-safe JavaScript for complex AI logic', icon: FileCode },
      { name: 'Tailwind CSS', description: 'Utility-first CSS for rapid custom UI', icon: Palette },
    ],
  },
  {
    id: 'deployment',
    title: 'Deployment & Infrastructure',
    categoryIcon: Cloud,
    bg: '#FFFFFF',
    technologies: [
      { name: 'Vercel', description: 'Edge deployment with instant rollbacks and CDN', icon: Cloud },
      { name: 'Docker', description: 'Containerized AI workloads and environments', icon: Container },
      { name: 'GitHub', description: 'CI/CD automation and code review pipelines', icon: GitBranch },
    ],
  },
];

export default function TechStackShowcase() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #f7f7f5 0%, #f1f3f2 50%, #f7f7f5 100%)',
        paddingTop: '140px',
        paddingBottom: '140px',
      }}
      aria-labelledby="solutions-tech-heading"
    >
      {/* ── Ambient background layers ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Faint data grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(31, 63, 54, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(31, 63, 54, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Top glow */}
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(61, 122, 95, 0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Bottom glow */}
        <div
          className="absolute -bottom-32 right-1/4 w-[500px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(219, 230, 226, 0.5) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <div className="max-w-[1320px] mx-auto px-6 lg:px-16 relative z-10">

        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-20 lg:mb-24">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2.5 mb-8 px-5 py-2 rounded-full"
            style={{
              background: 'rgba(31, 63, 54, 0.05)',
              border: '1px solid rgba(31, 63, 54, 0.08)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: '#3d7a5f',
                boxShadow: '0 0 10px rgba(61, 122, 95, 0.5)',
                animation: 'pulse 2s infinite',
              }}
            />
            <span
              className="text-xs tracking-[0.18em] uppercase"
              style={{
                color: '#1f3f36',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 600,
              }}
            >
              Technology Stack
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            id="solutions-tech-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6"
            style={{
              color: '#1f3f36',
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            We Build With{' '}
            <span className="relative inline-block">
              The Best
              <motion.span
                className="absolute left-0 -bottom-1.5 w-full h-[3px] rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #3d7a5f, rgba(61, 122, 95, 0.25))',
                }}
                initial={{ scaleX: 0, transformOrigin: 'left' }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl mx-auto"
            style={{
              color: 'rgba(31, 63, 54, 0.55)',
              fontFamily: "'Lora', Georgia, serif",
              fontSize: '1.125rem',
              lineHeight: 1.75,
              fontStyle: 'italic',
            }}
          >
            Every tool is chosen for speed, reliability, and real-world AI performance — not hype.
          </motion.p>
        </div>

        {/* ── Cards Grid ── */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5 lg:gap-6"
          role="list"
        >
          {techStack.map((category, i) => {
            const CategoryIcon = category.categoryIcon;

            return (
              <motion.article
                key={category.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                role="listitem"
                className="tech-showcase-card group relative"
                style={{
                  background: category.bg,
                  borderRadius: '16px',
                  border: '1px solid rgba(31, 63, 54, 0.06)',
                  padding: '28px 24px 32px',
                  boxShadow: '0 2px 8px rgba(31, 63, 54, 0.04), 0 1px 2px rgba(31, 63, 54, 0.02)',
                  transition: 'all 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: '0 0 40px rgba(61, 122, 95, 0.08), 0 8px 32px rgba(31, 63, 54, 0.06)',
                  }}
                />

                {/* ── Category Header ── */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="shrink-0 flex items-center justify-center"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'rgba(31, 63, 54, 0.07)',
                      border: '1px solid rgba(31, 63, 54, 0.06)',
                    }}
                  >
                    <CategoryIcon
                      size={17}
                      strokeWidth={1.5}
                      style={{ color: '#3d7a5f' }}
                    />
                  </div>
                  <h3
                    style={{
                      color: '#1f3f36',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      lineHeight: 1.3,
                    }}
                  >
                    {category.title}
                  </h3>
                </div>

                {/* Divider */}
                <div
                  className="mb-5"
                  style={{
                    height: '1px',
                    background: 'linear-gradient(90deg, rgba(31, 63, 54, 0.12), rgba(31, 63, 54, 0.03))',
                  }}
                />

                {/* ── Technologies ── */}
                <div className="space-y-0">
                  {category.technologies.map((tech, j) => {
                    const TechIcon = tech.icon;
                    return (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: i * 0.08 + j * 0.05 + 0.25,
                          duration: 0.45,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="py-3.5"
                        style={{
                          borderTop: j > 0 ? '1px solid rgba(31, 63, 54, 0.05)' : undefined,
                        }}
                      >
                        <div className="flex items-start gap-2.5">
                          <TechIcon
                            size={14}
                            strokeWidth={1.5}
                            className="mt-0.5 shrink-0"
                            style={{ color: '#3d7a5f', opacity: 0.7 }}
                          />
                          <div>
                            <h4
                              style={{
                                color: '#1f3f36',
                                fontFamily: 'Inter, system-ui, sans-serif',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                lineHeight: 1.4,
                                letterSpacing: '-0.01em',
                                transition: 'color 0.3s',
                              }}
                            >
                              {tech.name}
                            </h4>
                            <p
                              style={{
                                color: 'rgba(31, 63, 54, 0.45)',
                                fontFamily: 'Inter, system-ui, sans-serif',
                                fontSize: '0.75rem',
                                fontWeight: 400,
                                lineHeight: 1.6,
                                marginTop: '2px',
                              }}
                            >
                              {tech.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* ── Styles ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .tech-showcase-card:hover {
          transform: translateY(-6px);
          border-color: rgba(61, 122, 95, 0.12) !important;
          box-shadow:
            0 12px 40px rgba(31, 63, 54, 0.08),
            0 4px 16px rgba(31, 63, 54, 0.04),
            0 0 0 1px rgba(61, 122, 95, 0.06) !important;
        }
        .tech-showcase-card:hover h3 {
          color: #1a3a30 !important;
        }

        @media (max-width: 767px) {
          .tech-showcase-card {
            padding: 24px 20px 28px !important;
          }
          .tech-showcase-card h4 {
            font-size: 0.9rem !important;
          }
          .tech-showcase-card p {
            font-size: 0.8rem !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .tech-showcase-card {
            transition: none !important;
          }
        }
      `}} />
    </section>
  );
}