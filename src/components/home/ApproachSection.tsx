interface ApproachItem {
  number: string;
  title: string;
  description: string;
}

const APPROACH_ITEMS: ApproachItem[] = [
  {
    number: '01',
    title: 'Discovery',
    description: 'We start by understanding your business goals and challenges',
  },
  {
    number: '02',
    title: 'Strategy',
    description: 'Design a custom AI solution tailored to your needs',
  },
  {
    number: '03',
    title: 'Development',
    description: 'Build and test your system with regular feedback cycles',
  },
  {
    number: '04',
    title: 'Deployment',
    description: 'Launch and support your AI system in production',
  },
];

export default function ApproachSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 border-t border-gray-200">
      <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-16">
        Our Approach
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
        {APPROACH_ITEMS.map((item, index) => (
          <div key={index} className="space-y-4">
            <div className="text-sm text-gray-400">{item.number}</div>
            <h3 className="text-3xl md:text-4xl tracking-tight">{item.title}</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
