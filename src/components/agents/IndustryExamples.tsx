export default function IndustryExamples() {
  const industries = [
    {
      name: 'Fashion / Ecommerce',
      bottleneck: 'Customer questions slow down sales',
      agents: 'Support Agent + Sales Agent + Analytics',
      outcome: 'Higher conversion, less support load',
    },
    {
      name: 'Real Estate',
      bottleneck: 'Leads go cold overnight',
      agents: 'Sales Agent + WhatsApp Agent + Scheduler',
      outcome: 'Instant response, more booked showings',
    },
    {
      name: 'SaaS',
      bottleneck: 'Demo no-shows hurt pipeline',
      agents: 'Reminder Agent + CRM Agent + Analyst',
      outcome: '78% show-up rate (vs. 45%)',
    },
    {
      name: 'Events',
      bottleneck: 'Manual booking coordination',
      agents: 'Ops Agent + Calendar Agent + Comms',
      outcome: 'Hours saved weekly, zero double-bookings',
    },
    {
      name: 'Agencies',
      bottleneck: 'Client reporting takes days',
      agents: 'Analytics Agent + Content Agent + Extractor',
      outcome: 'Instant reports, more client retention',
    },
  ];

  return (
    <section className="bg-[#FDFCFB] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-gray-900 mb-6">
            Adapted to Your Industry
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every industry has unique bottlenecks. Agents adapt to yours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 p-8 hover:border-[#F59E0B] transition-colors duration-200"
            >
              <h3 className="font-serif text-2xl text-gray-900 mb-6">
                {industry.name}
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Typical Bottleneck
                  </p>
                  <p className="text-gray-700">{industry.bottleneck}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Agents Involved
                  </p>
                  <p className="text-sm text-gray-600">{industry.agents}</p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Outcome Achieved
                  </p>
                  <p className="text-gray-900 font-medium">{industry.outcome}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
