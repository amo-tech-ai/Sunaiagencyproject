import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Brain,
  Code2,
  Rocket,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   C07 — Technology Stack Section — Dark BG / Light Cards Edition
   ═══════════════════════════════════════════════════════════════
   
   Design: Dark surrounding background with light warm-white cards
   Three large cards, luxury consulting aesthetic (BCG / McKinsey)
   
   Color Palette:
   - Section BG:     #111111 → #0D1A14 (dark charcoal with emerald tint)
   - Card BG:        #FAFAF8 (warm off-white)
   - Card Border:    #EEEEE9 (light warm gray)
   - Card Shadow:    soft elevation
   - Text Primary:   #1A1A1A (charcoal on cards)
   - Text Secondary: #777777 (muted gray on cards)
   - Text on Dark:   #F5F5F0 (warm white on background)
   - Accent Green:   #00875A (BCG signature green)
   - Dividers:       #E8E8E3 (thin separators on cards)
   
   ═══════════════════════════════════════════════════════════════ */

interface TechCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  technologies: string[];
}

const techStack: TechCategory[] = [
  {
    id: 'ai-intelligence',
    title: 'AI & Intelligence',
    description:
      'Enterprise-grade language models, retrieval-augmented generation, and vector search infrastructure — purpose-built for production AI systems.',
    icon: Brain,
    technologies: [
      'OpenAI GPT-4o',
      'Assistants API',
      'Anthropic Claude',
      'LlamaIndex',
      'Mistral',
      'Supabase + pgvector',
      'Redis',
    ],
  },
  {
    id: 'development-design',
    title: 'Development & Design',
    description:
      'Modern frameworks and developer tools for building fast, type-safe AI applications with exceptional user interfaces.',
    icon: Code2,
    technologies: [
      'React',
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Vite',
      'Cloudinary',
      'Tiptap',
    ],
  },
  {
    id: 'automation-infrastructure',
    title: 'Automation & Infrastructure',
    description:
      'Workflow orchestration, multi-channel messaging APIs, and edge deployment for scalable, always-on AI agent systems.',
    icon: Rocket,
    technologies: [
      'n8n',
      'WhatsApp Business API',
      'Twilio',
      'Vercel',
      'Docker',
      'GitHub Actions',
    ],
  },
];

interface Metric {
  number: string;
  label: string;
  suffix?: string;
}

const metrics: Metric[] = [
  { number: '20', suffix: '+', label: 'Technologies in Our Production Stack' },
  { number: '99.9', suffix: '%', label: 'Uptime Across Deployed Systems' },
  { number: '24', suffix: '/7', label: 'Monitoring & Incident Response' },
];

/* ── Light Card on Dark Background ── */

function TechCard({
  category,
  index,
}: {
  category: TechCategory;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = category.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        delay: index * 0.12,
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group cursor-default"
      style={{
        borderRadius: '14px',
        background: '#FAFAF8',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: isHovered ? 'rgba(0,135,90,0.2)' : '#EEEEE9',
        boxShadow: isHovered
          ? '0 28px 72px rgba(0,0,0,0.25), 0 12px 32px rgba(0,0,0,0.15)'
          : '0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        overflow: 'hidden',
      }}
    >
      {/* ── Card Content ── */}
      <div className="relative z-10 p-10">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-7 transition-all duration-500"
          style={{
            background: isHovered ? 'rgba(0,135,90,0.08)' : '#F0F0EB',
            boxShadow: isHovered
              ? '0 0 0 1px rgba(0,135,90,0.12)'
              : 'none',
          }}
        >
          <IconComponent
            size={22}
            className="transition-colors duration-500"
            style={{
              color: isHovered ? '#00875A' : '#999999',
            }}
            strokeWidth={1.5}
          />
        </div>

        {/* Title */}
        <h3
          style={{
            color: '#1A1A1A',
            fontSize: '1.2rem',
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
            marginBottom: '12px',
          }}
        >
          {category.title}
        </h3>

        {/* Description */}
        <p
          style={{
            color: '#777777',
            fontSize: '0.88rem',
            fontWeight: 400,
            lineHeight: 1.7,
            marginBottom: '28px',
          }}
        >
          {category.description}
        </p>

        {/* Divider */}
        <div
          className="h-px mb-6 transition-all duration-700"
          style={{
            background: isHovered
              ? 'linear-gradient(90deg, rgba(0,135,90,0.25), #E8E8E3)'
              : '#E8E8E3',
          }}
        />

        {/* Technologies — inline with bullet separators */}
        <div
          className="flex flex-wrap items-center gap-y-2"
          style={{ lineHeight: 1.6 }}
        >
          {category.technologies.map((tech, i) => (
            <span key={tech} className="flex items-center">
              <span
                style={{
                  color: '#1A1A1A',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                }}
              >
                {tech}
              </span>
              {i < category.technologies.length - 1 && (
                <span
                  className="mx-2.5"
                  style={{
                    color: isHovered ? '#00875A' : '#CCCCCC',
                    fontSize: '0.5rem',
                    transition: 'color 0.5s',
                  }}
                >
                  ●
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

/* ── Main Section Export ── */

export default function TechStackSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(170deg, #111111 0%, #0D1A14 50%, #0F0F0F 100%)',
        paddingTop: '140px',
        paddingBottom: '140px',
      }}
      aria-labelledby="tech-stack-heading"
    >
      {/* ── Subtle grid texture ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
        }}
      />

      {/* ── Ambient emerald glow — top ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 35% at 50% 0%, rgba(0,135,90,0.06) 0%, transparent 70%)',
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
            Technology Stack
          </motion.p>

          <motion.h2
            id="tech-stack-heading"
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
            We Build With the Best
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
            Every tool is chosen for speed, reliability, and real-world AI
            performance — not hype.
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

        {/* ── Three-card Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 mb-28">
          {techStack.map((category, index) => (
            <TechCard key={category.id} category={category} index={index} />
          ))}
        </div>

        {/* ── Metrics Row ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div
            className="mb-14"
            style={{
              height: '1px',
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.1 + index * 0.1,
                  duration: 0.6,
                }}
                className="text-center relative"
              >
                {/* Vertical separator */}
                {index < metrics.length - 1 && (
                  <div
                    className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2"
                    style={{
                      width: '1px',
                      height: '60px',
                      background:
                        'linear-gradient(180deg, transparent, rgba(255,255,255,0.08), transparent)',
                    }}
                  />
                )}

                <div className="flex items-start justify-center gap-0.5">
                  <span
                    style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                      fontWeight: 400,
                      color: '#F5F5F0',
                      lineHeight: 1,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {metric.number}
                  </span>
                  {metric.suffix && (
                    <span
                      style={{
                        fontFamily: 'Georgia, serif',
                        fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                        fontWeight: 400,
                        color: '#00875A',
                        lineHeight: 1,
                        marginTop: '0.5rem',
                      }}
                    >
                      {metric.suffix}
                    </span>
                  )}
                </div>
                <p
                  className="mt-3 max-w-[200px] mx-auto"
                  style={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                  }}
                >
                  {metric.label}
                </p>
              </motion.div>
            ))}
          </div>

          <div
            style={{
              height: '1px',
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
