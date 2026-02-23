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
    <section className="bg-[#1A1A1A] py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#F59E0B] mb-6">
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
                className="text-6xl md:text-7xl font-bold text-[#F59E0B]"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Not 8 Months.
              </div>
            </h1>

            <p
              className="text-lg md:text-xl text-neutral-300 mb-10 leading-relaxed"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              We move fast without cutting corners—AI acceleration + expert delivery
              for measurable results.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <button
                onClick={onStartClick}
                className="bg-[#F59E0B] text-[#1A1A1A] px-10 py-5 text-base font-semibold hover:bg-[#FCD34D] transition-colors"
              >
                Start Your AI Brief
              </button>
              <button
                onClick={onStoriesClick}
                className="border border-white text-white px-10 py-5 text-base font-semibold hover:bg-white hover:text-[#1A1A1A] transition-colors"
              >
                See Success Stories
              </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-white mb-1">20+</div>
                <div className="text-xs uppercase tracking-wider text-neutral-400">
                  Projects Delivered
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1">$2M+</div>
                <div className="text-xs uppercase tracking-wider text-neutral-400">
                  Monthly GMV
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1">300%</div>
                <div className="text-xs uppercase tracking-wider text-neutral-400">
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
