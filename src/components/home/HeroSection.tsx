interface HeroSectionProps {
  headline?: string;
  description?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export default function HeroSection({
  headline = 'Build intelligent AI systems for your business',
  description = 'We create custom AI solutions that solve real problems. From strategy to deployment, we partner with you to build systems that work.',
  ctaText = 'Start Project',
  onCtaClick,
}: HeroSectionProps) {
  return (
    <section className="relative bg-[#1A1A1A] overflow-hidden">
      {/* Subtle Grid Pattern - Same as rest of site */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Subtle Radial Vignette for Readability */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(26,26,26,0) 0%, rgba(26,26,26,0.4) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="max-w-4xl">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl tracking-tight mb-8 leading-tight text-white">
            {headline}
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 leading-relaxed max-w-3xl">
            {description}
          </p>
          <button
            className="bg-[#F59E0B] hover:bg-[#FCD34D] text-[#1A1A1A] px-10 py-5 text-base font-medium transition-colors duration-200"
            onClick={onCtaClick}
          >
            {ctaText}
          </button>
        </div>
      </div>
    </section>
  );
}