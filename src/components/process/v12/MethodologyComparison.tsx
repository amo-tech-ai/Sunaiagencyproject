export default function MethodologyComparison() {
  const rows = [
    {
      feature: 'Timeline',
      traditional: '6-12 months',
      freelancer: '3-6 months',
      ourProcess: '8 weeks',
    },
    {
      feature: 'Client Time Investment',
      traditional: '40+ hours/week',
      freelancer: '20+ hours/week',
      ourProcess: '10-12 hours/week',
    },
    {
      feature: 'AI Acceleration',
      traditional: 'Minimal',
      freelancer: 'Limited',
      ourProcess: 'Fully Integrated',
    },
    {
      feature: 'Dedicated Team',
      traditional: '✓',
      freelancer: '✗',
      ourProcess: '✓',
    },
    {
      feature: 'Fixed Pricing',
      traditional: '✗',
      freelancer: '✗',
      ourProcess: '✓',
    },
    {
      feature: 'Post-Launch Support',
      traditional: 'Extra Cost',
      freelancer: 'Rarely',
      ourProcess: '30 Days Included',
    },
    {
      feature: 'Quality Guarantee',
      traditional: 'Limited',
      freelancer: 'None',
      ourProcess: '100% Satisfaction',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 border-t border-gray-200">
      <div className="mb-16">
        <h2
          className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          How We Compare
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl font-['Lora']">
          See why leading companies choose our AI-accelerated approach.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0F3D3E] text-white">
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider font-['Lora']">
                Feature
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider font-['Lora']">
                Traditional Agency
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider font-['Lora']">
                Freelancers
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider border-b-4 border-[#84CC16] font-['Lora']">
                Our Process
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={index}
                className="border-b border-[#EFE9E4] hover:bg-neutral-50 transition-colors"
              >
                <td className="py-4 px-6 font-semibold text-gray-900 font-['Lora']">{row.feature}</td>
                <td className="py-4 px-6 text-gray-600 font-['Lora']">{row.traditional}</td>
                <td className="py-4 px-6 text-gray-600 font-['Lora']">{row.freelancer}</td>
                <td className="py-4 px-6 bg-[#F7FEE7] text-[#84CC16] font-semibold font-['Lora']">
                  {row.ourProcess}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}