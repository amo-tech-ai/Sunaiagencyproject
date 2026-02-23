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
      bg: 'bg-[#000000]',
      text: 'text-white',
      sub: 'text-white/55',
      cta: 'text-[#5EEAD4]',
      border: 'border-white/[0.06]',
      glowBorder: '0 0 0 1px rgba(15,61,62,0.6), 0 0 24px rgba(15,61,62,0.25)',
    },
    teal: {
      bg: 'bg-gradient-to-br from-[#0F3D3E] to-[#082626]',
      text: 'text-white',
      sub: 'text-white/60',
      cta: 'text-[#5EEAD4]',
      border: 'border-white/[0.08]',
      glowBorder: '0 0 0 1px rgba(94,234,212,0.3), 0 0 24px rgba(15,61,62,0.35)',
    },
    light: {
      bg: 'bg-[#F1EEEA]',
      text: 'text-[#0A211F]',
      sub: 'text-[#0A211F]/55',
      cta: 'text-[#0F3D3E]',
      border: 'border-[#0A211F]/[0.08]',
      glowBorder: '0 0 0 1px rgba(15,61,62,0.35), 0 0 24px rgba(15,61,62,0.12)',
    },
  };

  const s = variantStyles[variant];

  return (
    <Link
      to={href}
      className={`group relative block rounded-[20px] border ${s.border} ${s.bg} overflow-hidden transition-all duration-[250ms] ease-out`}
      style={{
        boxShadow: hovered
          ? s.glowBorder
          : variant === 'light'
          ? '0 1px 3px rgba(0,0,0,0.04)'
          : '0 1px 3px rgba(0,0,0,0.2)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-[250ms]"
        style={{
          background:
            variant === 'light'
              ? 'radial-gradient(ellipse at 50% 0%, rgba(15,61,62,0.04) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at 50% 0%, rgba(94,234,212,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative p-8 sm:p-9 flex flex-col h-full">
        {/* Visual */}
        <div className="w-full h-28 mb-6 flex-shrink-0">
          <Visual variant={variant} />
        </div>

        {/* Title */}
        <h3
          className={`${s.text} tracking-tight mb-3`}
          style={{ fontSize: '1.35rem', fontWeight: 600, lineHeight: 1.25 }}
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
        <div className={`${s.cta} flex items-center gap-1.5 mt-auto`} style={{ fontSize: '0.875rem', fontWeight: 500 }}>
          <span>Learn More</span>
          <ArrowRight
            className="w-4 h-4 transition-transform duration-[250ms] group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}
