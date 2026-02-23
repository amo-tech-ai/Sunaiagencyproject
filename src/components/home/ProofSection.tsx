interface Metric {
  value: string;
  label: string;
}

interface ProofSectionProps {
  metrics: readonly Metric[];
  title?: string;
}

export default function ProofSection({
  metrics,
  title = 'By the numbers',
}: ProofSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 border-t border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
        {metrics.map((metric, index) => (
          <div key={index}>
            <p className="text-sm uppercase tracking-wider text-gray-500 mb-4">
              {metric.label}
            </p>
            <p className="text-6xl md:text-7xl tracking-tight">{metric.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
