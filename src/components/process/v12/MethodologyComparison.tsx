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
          className="text-5xl md:text-6xl font-bold text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          How We Compare
        </h2>
        <p className="text-xl text-[#666666] max-w-3xl">
          See why leading companies choose our AI-accelerated approach.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#1A1A1A] text-white">
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Feature
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Traditional Agency
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Freelancers
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider border-b-4 border-[#F59E0B]">
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
                <td className="py-4 px-6 font-semibold text-[#1A1A1A]">{row.feature}</td>
                <td className="py-4 px-6 text-[#666666]">{row.traditional}</td>
                <td className="py-4 px-6 text-[#666666]">{row.freelancer}</td>
                <td className="py-4 px-6 bg-[#FFF7ED] text-[#F59E0B] font-semibold">
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
