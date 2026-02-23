interface FeatureSectionProps {
  eyebrow?: string;
  headline: string;
  description: string;
  features: string[];
  imageSide?: 'left' | 'right';
  imageUrl?: string;
}

export default function FeatureSection({
  eyebrow,
  headline,
  description,
  features,
  imageSide = 'right',
  imageUrl,
}: FeatureSectionProps) {
  const contentOrder = imageSide === 'left' ? 'order-2' : 'order-1';
  const imageOrder = imageSide === 'left' ? 'order-1' : 'order-2';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 border-t border-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Content */}
        <div className={`${contentOrder}`}>
          {eyebrow && (
            <p className="text-sm uppercase tracking-wider text-gray-500 mb-6">
              {eyebrow}
            </p>
          )}
          <h2 className="text-4xl md:text-5xl tracking-tight mb-8">
            {headline}
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            {description}
          </p>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-3 flex-shrink-0" />
                <p className="text-lg text-gray-600">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Image/Placeholder */}
        <div className={`${imageOrder}`}>
          <div className="aspect-square bg-gray-100 rounded-sm" />
        </div>
      </div>
    </section>
  );
}
