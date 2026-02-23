interface CTASectionProps {
  headline?: string;
  description?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  darkMode?: boolean;
}

export default function CTASection({
  headline = 'Ready to build your\nAI-powered future?',
  description = 'Join innovative teams transforming their operations with production-ready AI systems.',
  primaryCtaText = 'Start Your Project →',
  secondaryCtaText = 'Schedule a Call',
  onPrimaryClick,
  onSecondaryClick,
  darkMode = true,
}: CTASectionProps) {
  const metrics = [
    { value: '25+', label: 'PROJECTS DELIVERED' },
    { value: '6+', label: 'AGENT SYSTEMS' },
    { value: '$500M+', label: 'VALUE ENABLED' },
  ];

  return (
    <section className="relative bg-[#1A1A1A] py-32 md:py-40 overflow-hidden">
      {/* Subtle Grid Overlay */}
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Content */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Headline */}
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight tracking-tight whitespace-pre-line">
            {headline}
          </h2>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            {description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <button
              className="bg-[#F59E0B] hover:bg-[#FCD34D] text-[#1A1A1A] px-8 py-4 text-base font-medium transition-colors duration-200 min-w-[200px]"
              onClick={onPrimaryClick}
            >
              {primaryCtaText}
            </button>
            <button
              className="border border-gray-700 hover:bg-gray-800 text-white px-8 py-4 text-base font-medium transition-colors duration-200 min-w-[200px]"
              onClick={onSecondaryClick}
            >
              {secondaryCtaText}
            </button>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="font-serif text-4xl md:text-5xl text-white mb-2 tracking-tight">
                  {metric.value}
                </div>
                <div className="text-xs md:text-sm text-gray-500 tracking-widest uppercase">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}