interface ProcessCTASectionProps {
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export default function ProcessCTASection({
  onPrimaryClick,
  onSecondaryClick,
}: ProcessCTASectionProps) {
  return (
    <section className="bg-[#1A1A1A] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <h2
            className="text-5xl md:text-6xl font-semibold text-white mb-8"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Ready to accelerate your AI project?
          </h2>
          <p
            className="text-xl md:text-2xl text-[#E5E5E5] mb-12 leading-relaxed"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Get started with a free consultation and see how we can deliver your AI
            solution in 8 weeks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onPrimaryClick}
              className="bg-[#F59E0B] text-[#1A1A1A] px-10 py-5 text-base font-semibold hover:bg-[#FCD34D] transition-colors"
            >
              Start Your Project
            </button>
            <button
              onClick={onSecondaryClick}
              className="border border-white text-white px-10 py-5 text-base font-semibold hover:bg-white hover:text-[#1A1A1A] transition-colors"
            >
              Schedule Call
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
