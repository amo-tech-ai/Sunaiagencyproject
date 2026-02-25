import { ImageWithFallback } from '../figma/ImageWithFallback';

const BANNER_IMG = 'https://images.unsplash.com/photo-1737982561070-e349fad5674b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMHRyYW5zZm9ybWF0aW9uJTIwZnV0dXJpc3RpYyUyMGdyZWVuJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzIwMjAyOTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

export function FinancialAIBanner() {
  return (
    <section style={{ background: '#FFFFFF' }}>
      <div className="max-w-[1200px] mx-auto px-6 pb-20">
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ aspectRatio: '16/5' }}
        >
          <ImageWithFallback
            src={BANNER_IMG}
            alt="AI Transformation"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(30,61,54,0.85) 0%, rgba(46,111,94,0.7) 100%)' }}
          />
          <div className="absolute inset-0 flex items-center px-8 sm:px-14">
            <h2
              className="text-white max-w-md"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              AI Transformation
              <br />
              for Future-Ready
              <br />
              Functions
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
