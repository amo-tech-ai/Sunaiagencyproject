interface IndustriesListProps {
  industries: readonly string[];
  title?: string;
}

export default function IndustriesList({
  industries,
  title = 'Industries we serve',
}: IndustriesListProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 border-t border-gray-200">
      <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-16">
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-12">
        {industries.map((industry, index) => (
          <div key={index} className="group cursor-pointer">
            <p className="text-base text-gray-600 group-hover:text-gray-900 transition-colors">
              {industry}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
