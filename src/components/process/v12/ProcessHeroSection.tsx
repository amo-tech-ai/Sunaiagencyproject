import HeroCircularDiagram from './HeroCircularDiagram';

interface ProcessHeroSectionProps {
  onStartClick?: () => void;
  onStoriesClick?: () => void;
}

export default function ProcessHeroSection({
  onStartClick,
  onStoriesClick,
}: ProcessHeroSectionProps) {
  return (
    <section className="bg-[#0F3D3E] py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#84CC16] mb-6 font-['Lora']">
              Sun AI Process
            </p>

            <h1 className="mb-8">
              <div
                className="text-6xl md:text-7xl font-bold text-white mb-2"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                8 Weeks.
              </div>
              <div
                className="text-6xl md:text-7xl font-bold text-[#84CC16]"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Not 8 Months.
              </div>
            </h1>

            <p
              className="text-lg md:text-xl text-neutral-300 mb-10 leading-relaxed font-['Lora']"
            >
              We move fast without cutting corners—AI acceleration + expert delivery
              for measurable results.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <button
                onClick={onStartClick}
                className="bg-[#84CC16] text-gray-900 px-8 py-4 text-base font-semibold hover:bg-[#73b512] transition-colors font-['Lora']"
              >
                Start Your AI Brief
              </button>
              <button
                onClick={onStoriesClick}
                className="border border-white text-white px-8 py-4 text-base font-semibold hover:bg-white hover:text-[#0F3D3E] transition-colors font-['Lora']"
              >
                See Success Stories
              </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-white mb-1">40+</div>
                <div className="text-xs uppercase tracking-wider text-neutral-400 font-['Lora']">
                  Projects Delivered
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1">$5M+</div>
                <div className="text-xs uppercase tracking-wider text-neutral-400 font-['Lora']">
                  Client Revenue Impact
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1">4.2×</div>
                <div className="text-xs uppercase tracking-wider text-neutral-400 font-['Lora']">
                  Average ROI
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Circular Diagram */}
          <div className="lg:col-span-7">
            <HeroCircularDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}