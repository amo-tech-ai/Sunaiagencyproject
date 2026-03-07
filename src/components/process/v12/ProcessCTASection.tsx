// C-P05 — Process CTA Section
// BCG design system dark variant: charcoal bg, white text, Georgia serif, green CTA, 4px radius

interface ProcessCTASectionProps {
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export default function ProcessCTASection({
  onPrimaryClick,
  onSecondaryClick,
}: ProcessCTASectionProps) {
  return (
    <section className="py-20 md:py-28" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="max-w-3xl">
          <h2
            className="text-3xl md:text-4xl text-white mb-7"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Ready to accelerate your AI project?
          </h2>
          <p className="text-lg md:text-xl mb-10 leading-relaxed" style={{ color: 'rgba(245,245,240,0.6)' }}>
            Get started with a free consultation and see how we can deliver your AI
            solution in 8 weeks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onPrimaryClick}
              className="px-8 py-4 text-sm transition-colors"
              style={{ backgroundColor: '#00875A', color: '#FFFFFF', borderRadius: '4px' }}
            >
              Start Your Project
            </button>
            <button
              onClick={onSecondaryClick}
              className="border px-8 py-4 text-sm transition-colors hover:bg-white hover:text-[#1A1A1A]"
              style={{ borderColor: '#FFFFFF', color: '#FFFFFF', borderRadius: '4px' }}
            >
              Schedule Call
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
