// C15 — Service Card (Shared)
// BCG design system: charcoal/green variants, Georgia serif, 4px radius

import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';

export type CardVariant = 'black' | 'teal' | 'light';

interface ServiceCardProps {
  title: string;
  description: string;
  variant: CardVariant;
  visual: React.ComponentType<{ variant: CardVariant }>;
  href?: string;
  index: number;
}

export default function ServiceCard({
  title,
  description,
  variant,
  visual: Visual,
  href = '/booking',
  index,
}: ServiceCardProps) {
  const [hovered, setHovered] = useState(false);

  const variantStyles: Record<CardVariant, {
    bg: string;
    text: string;
    sub: string;
    cta: string;
    border: string;
    glowBorder: string;
  }> = {
    black: {
      bg: 'bg-[#1A1A1A]',
      text: 'text-white',
      sub: 'text-white/55',
      cta: 'text-[#00875A]',
      border: 'border-white/[0.06]',
      glowBorder: '0 0 0 1px rgba(0,135,90,0.4), 0 0 24px rgba(0,135,90,0.12)',
    },
    teal: {
      bg: 'bg-[#1A1A1A]',
      text: 'text-white',
      sub: 'text-white/60',
      cta: 'text-[#00875A]',
      border: 'border-white/[0.08]',
      glowBorder: '0 0 0 1px rgba(0,135,90,0.3), 0 0 24px rgba(0,135,90,0.15)',
    },
    light: {
      bg: 'bg-[#F5F5F0]',
      text: 'text-[#1A1A1A]',
      sub: 'text-[#1A1A1A]/55',
      cta: 'text-[#00875A]',
      border: 'border-[#E8E8E4]',
      glowBorder: '0 0 0 1px rgba(0,135,90,0.2), 0 0 24px rgba(0,135,90,0.06)',
    },
  };

  const s = variantStyles[variant];

  return (
    <Link
      to={href}
      className={`group relative block border ${s.border} ${s.bg} overflow-hidden transition-all duration-200`}
      style={{
        borderRadius: '4px',
        boxShadow: hovered
          ? s.glowBorder
          : variant === 'light'
          ? '0 1px 3px rgba(0,0,0,0.04)'
          : '0 1px 3px rgba(0,0,0,0.2)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Content */}
      <div className="relative p-8 sm:p-9 flex flex-col h-full">
        {/* Visual */}
        <div className="w-full h-28 mb-6 flex-shrink-0">
          <Visual variant={variant} />
        </div>

        {/* Title */}
        <h3
          className={`${s.text} tracking-tight mb-3`}
          style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', lineHeight: 1.25 }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className={`${s.sub} leading-relaxed mb-6 flex-grow`}
          style={{ fontSize: '0.925rem' }}
        >
          {description}
        </p>

        {/* CTA */}
        <div className={`${s.cta} flex items-center gap-1.5 mt-auto`} style={{ fontSize: '0.875rem' }}>
          <span>Learn More</span>
          <ArrowRight
            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}
