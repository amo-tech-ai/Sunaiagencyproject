export default function AgentDefinition() {
  const cards = [
    {
      title: 'In Simple Terms',
      description: 'An AI agent is a digital worker that performs a specific business role.',
    },
    {
      title: 'In Business Terms',
      description: 'It replaces repetitive decision-making, coordination, or execution work.',
    },
    {
      title: 'In Practice',
      description: 'Agents follow rules, use data, and act only within defined boundaries.',
    },
  ];

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-gray-900 mb-16 text-center">
          What Is an AI Agent?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="border border-gray-200 p-8 hover:border-[#F59E0B] transition-colors duration-200"
            >
              <h3 className="font-serif text-2xl text-gray-900 mb-4">
                {card.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
