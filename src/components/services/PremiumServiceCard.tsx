import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export type PremiumCardVariant = 'teal' | 'cream';

interface PremiumServiceCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
  variant: PremiumCardVariant;
}

const variantStyles: Record<
  PremiumCardVariant,
  {
    bg: string;
    title: string;
    desc: string;
    cta: string;
    gradientEnd: string;
    glowShadow: string;
  }
> = {
  teal: {
    bg: '#0F3D3E',
    title: 'text-[#F1EEEA]',
    desc: 'text-[#F1EEEA]/60',
    cta: 'text-[#F1EEEA]/70 hover:text-[#F1EEEA]',
    gradientEnd: 'rgba(15, 61, 62, 0.85)',
    glowShadow:
      '0 0 0 1px rgba(241,238,234,0.15), 0 20px 50px -12px rgba(0,0,0,0.4)',
  },
  cream: {
    bg: '#F1EEEA',
    title: 'text-[#000000]',
    desc: 'text-[#000000]/55',
    cta: 'text-[#0F3D3E]/80 hover:text-[#0F3D3E]',
    gradientEnd: 'rgba(241, 238, 234, 0.85)',
    glowShadow:
      '0 0 0 1px rgba(15,61,62,0.2), 0 20px 50px -12px rgba(15,61,62,0.18)',
  },
};

export default function PremiumServiceCard({
  title,
  description,
  image,
  href,
  variant,
}: PremiumServiceCardProps) {
  const [hovered, setHovered] = useState(false);
  const s = variantStyles[variant];

  return (
    <Link
      to={href}
      className="group relative block rounded-[20px] overflow-hidden transition-all duration-[250ms] ease-out"
      style={{
        backgroundColor: s.bg,
        boxShadow: hovered
          ? s.glowShadow
          : variant === 'cream'
          ? '0 1px 4px rgba(0,0,0,0.06)'
          : '0 1px 4px rgba(0,0,0,0.2)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image section — 4:5 ratio */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 5' }}>
        <ImageWithFallback
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
        />

        {/* Teal overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(180deg, rgba(15, 61, 62, 0.08) 0%, rgba(15, 61, 62, 0.25) 60%, ${s.gradientEnd} 100%)`,
          }}
        />
      </div>

      {/* Text block */}
      <div className="px-8 pt-7 pb-8 sm:px-9 sm:pt-8 sm:pb-9">
        <h3
          className={`${s.title} tracking-tight mb-2.5`}
          style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)', fontWeight: 600, lineHeight: 1.25 }}
        >
          {title}
        </h3>

        <p
          className={`${s.desc} leading-relaxed mb-5`}
          style={{ fontSize: '0.925rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {description}
        </p>

        {/* CTA */}
        <span
          className={`${s.cta} inline-flex items-center gap-1.5 transition-colors duration-200`}
          style={{ fontSize: '0.875rem', fontWeight: 500 }}
        >
          Learn More
          <ArrowRight className="w-4 h-4 transition-transform duration-[250ms] group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
