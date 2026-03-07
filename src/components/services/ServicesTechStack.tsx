import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Brain,
  Database,
  Workflow,
  Layout,
  Cloud,
  BarChart3,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   Services Page — AI Technology Stack Section
   ═══════════════════════════════════════════════════════════════
   
   Design: BCG / McKinsey consulting capability page
   Dark charcoal background, light warm-white cards
   Six categories, 3-col desktop / 2-col tablet / 1-col mobile
   
   Color Palette:
   - Section BG:     #111111 → #0D1A14 (dark charcoal + emerald tint)
   - Card BG:        #FAFAF8 (warm off-white)
   - Card Border:    #EEEEE9
   - Card Shadow:    soft elevation on dark
   - Text Primary:   #1A1A1A (on cards)
   - Text Secondary: #777777 (descriptions)
   - Text on Dark:   #F5F5F0 / rgba(255,255,255,0.45)
   - Accent:         #00875A (BCG emerald)
   - Dividers:       #E8E8E3
   
   ═══════════════════════════════════════════════════════════════ */

interface TechItem {
  name: string;
  description: string;
}

interface TechCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  technologies: TechItem[];
}

const categories: TechCategory[] = [
  {
    id: 'ai-intelligence',
    title: 'AI & Agent Intelligence',
    icon: Brain,
    technologies: [
      {
        name: 'OpenAI ChatGPT',
        description:
          'Multimodal AI model used to power intelligent assistants, chatbots, and advanced AI agents.',
      },
      {
        name: 'Assistants API',
        description:
          'Framework for building AI agents with memory, tool usage, and multi-step task automation.',
      },
      {
        name: 'Anthropic Claude',
        description:
          'AI model widely used for building reliable AI applications, developer tools, and agent systems.',
      },
      {
        name: 'LlamaIndex',
        description:
          'Framework for connecting AI models to documents, databases, and internal knowledge systems.',
      },
      {
        name: 'Google Gemini',
        description:
          'Multimodal AI models from Google used for reasoning, code generation, and enterprise AI applications.',
      },
    ],
  },
  {
    id: 'data-infrastructure',
    title: 'Data & Vector Infrastructure',
    icon: Database,
    technologies: [
      {
        name: 'Supabase + pgvector',
        description:
          'Backend platform combining database, authentication, real-time APIs, and vector search.',
      },
      {
        name: 'Redis',
        description:
          'High-speed in-memory database used for caching and real-time AI response acceleration.',
      },
      {
        name: 'Cloudinary',
        description:
          'Media platform for managing, transforming, and delivering images and video at scale.',
      },
    ],
  },
  {
    id: 'automation-integration',
    title: 'Automation & Integration',
    icon: Workflow,
    technologies: [
      {
        name: 'n8n',
        description:
          'Workflow automation platform used to connect APIs and orchestrate AI processes.',
      },
      {
        name: 'WhatsApp Business API',
        description:
          'Messaging platform for building AI assistants and automated customer conversations.',
      },
      {
        name: 'Twilio',
        description:
          'Communication APIs that enable SMS, voice, and messaging integrations.',
      },
      {
        name: 'Tiptap',
        description:
          'Modern framework for building rich text editors and AI-powered content tools.',
      },
    ],
  },
  {
    id: 'frontend-application',
    title: 'Frontend & Application',
    icon: Layout,
    technologies: [
      {
        name: 'React',
        description:
          'Framework used to build modern web applications and interactive AI dashboards.',
      },
      {
        name: 'Next.js',
        description:
          'High-performance framework for scalable websites and AI platforms.',
      },
      {
        name: 'TypeScript',
        description:
          'Programming language that improves reliability and reduces errors in complex systems.',
      },
      {
        name: 'Tailwind CSS',
        description:
          'Design framework used to build clean, responsive user interfaces quickly.',
      },
      {
        name: 'Vite',
        description:
          'Fast development environment that accelerates modern web application builds.',
      },
    ],
  },
  {
    id: 'deployment-infrastructure',
    title: 'Deployment & Infrastructure',
    icon: Cloud,
    technologies: [
      {
        name: 'Vercel',
        description:
          'Cloud platform that deploys applications globally with high speed and reliability.',
      },
      {
        name: 'Docker',
        description:
          'Technology that ensures software runs consistently across environments.',
      },
      {
        name: 'GitHub',
        description:
          'Platform used to manage code, collaborate with teams, and safely deploy updates.',
      },
    ],
  },
  {
    id: 'analytics-monitoring',
    title: 'Analytics & Monitoring',
    icon: BarChart3,
    technologies: [
      {
        name: 'PostHog',
        description:
          'Open-source product analytics for tracking user behavior and AI feature adoption.',
      },
      {
        name: 'Sentry',
        description:
          'Error tracking and performance monitoring for production AI applications.',
      },
      {
        name: 'LangSmith',
        description:
          'LLM observability platform for debugging, testing, and monitoring AI agent performance.',
      },
    ],
  },
];

/* ── Single Category Card ── */

function CategoryCard({
  category,
  index,
}: {
  category: TechCategory;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        delay: index * 0.1,
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-default"
      style={{
        borderRadius: '14px',
        background: '#FAFAF8',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: isHovered ? 'rgba(0,135,90,0.18)' : '#EEEEE9',
        boxShadow: isHovered
          ? '0 24px 64px rgba(0,0,0,0.22), 0 8px 28px rgba(0,0,0,0.14)'
          : '0 4px 20px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.05)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        overflow: 'hidden',
      }}
    >
      <div className="p-8 lg:p-9">
        {/* ── Icon ── */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-6 transition-all duration-500"
          style={{
            background: isHovered ? 'rgba(0,135,90,0.08)' : '#F0F0EB',
          }}
        >
          <IconComponent
            size={20}
            className="transition-colors duration-500"
            style={{ color: isHovered ? '#00875A' : '#999999' }}
            strokeWidth={1.5}
          />
        </div>

        {/* ── Category Title ── */}
        <h3
          style={{
            color: '#1A1A1A',
            fontSize: '1.1rem',
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
            marginBottom: '20px',
          }}
        >
          {category.title}
        </h3>

        {/* ── Divider ── */}
        <div
          className="h-px mb-6 transition-all duration-600"
          style={{
            background: isHovered
              ? 'linear-gradient(90deg, rgba(0,135,90,0.25), #E8E8E3)'
              : '#E8E8E3',
          }}
        />

        {/* ── Technology Items ── */}
        <div className="space-y-5">
          {category.technologies.map((tech, i) => (
            <div key={tech.name}>
              <h4
                style={{
                  color: '#1A1A1A',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  lineHeight: 1.4,
                  marginBottom: '4px',
                }}
              >
                {tech.name}
              </h4>
              <p
                style={{
                  color: '#888888',
                  fontSize: '0.8rem',
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                {tech.description}
              </p>
              {i < category.technologies.length - 1 && (
                <div
                  className="mt-5 h-px"
                  style={{ background: '#F0F0EB' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main Export ── */

export function ServicesTechStack() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          'linear-gradient(170deg, #111111 0%, #0D1A14 50%, #0F0F0F 100%)',
        paddingTop: '140px',
        paddingBottom: '140px',
      }}
      aria-labelledby="services-tech-heading"
    >
      {/* ── Subtle grid texture ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
        }}
      />

      {/* ── Ambient emerald glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 35% at 50% 0%, rgba(0,135,90,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[1120px] mx-auto px-6 lg:px-8 relative z-10">
        {/* ── Section Header ── */}
        <div className="mb-20 max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="uppercase tracking-[0.2em] mb-4"
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: '#00875A',
            }}
          >
            Technology Capabilities
          </motion.p>

          <motion.h2
            id="services-tech-heading"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="mb-5"
            style={{
              color: '#F5F5F0',
              fontFamily: "Georgia, 'Playfair Display', serif",
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
            }}
          >
            The Stack Behind Our Solutions
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="max-w-xl"
            style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: '1rem',
              lineHeight: 1.7,
            }}
          >
            Every technology is selected for production reliability, enterprise
            security, and measurable AI performance.
          </motion.p>
        </div>

        {/* ── Divider ── */}
        <div
          className="mb-14"
          style={{
            height: '1px',
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
          }}
        />

        {/* ── Six-card Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}