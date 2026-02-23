export default function ClientInvolvementMatrix() {
  const phases = [
    {
      phase: 'Discovery',
      traditional: '10+ hours/week',
      ourProcess: '2-3 hours/week',
      savings: '70%',
    },
    {
      phase: 'Strategy',
      traditional: '8+ hours/week',
      ourProcess: '1-2 hours/week',
      savings: '75%',
    },
    {
      phase: 'Design',
      traditional: '6+ hours/week',
      ourProcess: '1 hour/week',
      savings: '83%',
    },
    {
      phase: 'Development',
      traditional: '10+ hours/week',
      ourProcess: '2 hours/week',
      savings: '80%',
    },
    {
      phase: 'Testing',
      traditional: '8+ hours/week',
      ourProcess: '3 hours/week',
      savings: '62%',
    },
    {
      phase: 'Deployment',
      traditional: '5+ hours/week',
      ourProcess: '1 hour/week',
      savings: '80%',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 border-t border-gray-200">
      <div className="mb-16">
        <h2
          className="text-5xl md:text-6xl font-bold text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Your Time Investment
        </h2>
        <p className="text-xl text-[#666666] max-w-3xl">
          We minimize your time commitment while maximizing results.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#1A1A1A] text-white">
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Phase
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Traditional Agency
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider bg-[#F59E0B]/10">
                Our Process
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Time Saved
              </th>
            </tr>
          </thead>
          <tbody>
            {phases.map((row, index) => (
              <tr
                key={index}
                className="border-b border-[#EFE9E4] hover:bg-[#FDFCFB] transition-colors"
              >
                <td className="py-4 px-6 font-semibold text-[#1A1A1A]">{row.phase}</td>
                <td className="py-4 px-6 text-[#666666]">{row.traditional}</td>
                <td className="py-4 px-6 bg-[#FFF7ED] text-[#F59E0B] font-semibold">
                  {row.ourProcess}
                </td>
                <td className="py-4 px-6 text-[#666666]">{row.savings}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#FAF8F6] border-t-2 border-[#F59E0B]">
              <td className="py-4 px-6 font-bold text-[#1A1A1A]">Total</td>
              <td className="py-4 px-6 text-[#666666] font-semibold">47+ hours/week</td>
              <td className="py-4 px-6 bg-[#FFF7ED] text-[#F59E0B] font-bold">
                10-12 hours/week
              </td>
              <td className="py-4 px-6 text-[#1A1A1A] font-bold">75%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
