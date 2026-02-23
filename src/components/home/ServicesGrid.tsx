interface ServicesGridProps {
  services: readonly string[];
  title?: string;
}

export default function ServicesGrid({
  services,
  title = 'Our Services',
}: ServicesGridProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-16">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
        {services.map((service, index) => (
          <div key={index} className="group">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl tracking-tight">{service}</h3>
              <span className="text-gray-400 text-sm mt-1">0{index + 1}</span>
            </div>
            <div className="w-full h-px bg-gray-200 group-hover:bg-orange-500 transition-colors" />
          </div>
        ))}
      </div>
    </section>
  );
}
