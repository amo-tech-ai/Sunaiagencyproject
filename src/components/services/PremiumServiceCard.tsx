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

export default function PremiumServiceCard({
  title,
  description,
  image,
  href,
  variant,
}: PremiumServiceCardProps) {
  const [hovered, setHovered] = useState(false);

  /* Variant controls the gradient tint colour */
  const overlayGradient =
    variant === 'teal'
      ? 'linear-gradient(160deg, rgba(10,33,31,0.82) 0%, rgba(15,61,62,0.45) 45%, rgba(15,61,62,0.15) 100%)'
      : 'linear-gradient(160deg, rgba(10,33,31,0.78) 0%, rgba(15,61,62,0.35) 45%, rgba(15,61,62,0.08) 100%)';

  return (
    <Link
      to={href}
      className="group relative block overflow-hidden"
      style={{
        borderRadius: '16px',
        aspectRatio: '4 / 3.6',
        boxShadow: hovered
          ? '0 24px 48px -12px rgba(0,0,0,0.45), 0 0 0 1px rgba(241,238,234,0.08)'
          : '0 4px 16px -4px rgba(0,0,0,0.25)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 350ms cubic-bezier(0.19,1,0.22,1), box-shadow 350ms cubic-bezier(0.19,1,0.22,1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Full-bleed image */}
      <ImageWithFallback
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: overlayGradient,
          opacity: hovered ? 0.95 : 1,
        }}
      />

      {/* Content — pinned top & bottom */}
      <div className="relative z-10 flex flex-col justify-between h-full p-7 sm:p-8">
        {/* Top: title + description */}
        <div>
          <h3
            className="text-[#F1EEEA] tracking-tight mb-2"
            style={{
              fontSize: 'clamp(1.15rem, 1.8vw, 1.35rem)',
              fontWeight: 600,
              lineHeight: 1.25,
            }}
          >
            {title}
          </h3>
          <p
            className="text-[#F1EEEA]/65 leading-relaxed"
            style={{
              fontSize: '0.875rem',
              lineHeight: 1.55,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical' as const,
              overflow: 'hidden',
            }}
          >
            {description}
          </p>
        </div>

        {/* Bottom: CTA */}
        <span
          className="inline-flex items-center gap-1.5 text-[#F1EEEA]/60 group-hover:text-[#F1EEEA] transition-colors duration-300"
          style={{ fontSize: '0.8125rem', fontWeight: 500 }}
        >
          Learn more
          <ArrowRight
            className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}
