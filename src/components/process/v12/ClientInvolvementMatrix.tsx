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
          className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Your Time Investment
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl font-['Lora']">
          We minimize your time commitment while maximizing results.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0F3D3E] text-white">
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider font-['Lora']">
                Phase
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider font-['Lora']">
                Traditional Agency
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider bg-[#84CC16]/10 font-['Lora']">
                Our Process
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider font-['Lora']">
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
                <td className="py-4 px-6 font-semibold text-gray-900 font-['Lora']">{row.phase}</td>
                <td className="py-4 px-6 text-gray-600 font-['Lora']">{row.traditional}</td>
                <td className="py-4 px-6 bg-[#F7FEE7] text-[#84CC16] font-semibold font-['Lora']">
                  {row.ourProcess}
                </td>
                <td className="py-4 px-6 text-gray-600 font-['Lora']">{row.savings}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#FAF8F6] border-t-2 border-[#84CC16]">
              <td className="py-4 px-6 font-bold text-gray-900 font-['Lora']">Total</td>
              <td className="py-4 px-6 text-gray-600 font-semibold font-['Lora']">47+ hours/week</td>
              <td className="py-4 px-6 bg-[#F7FEE7] text-[#84CC16] font-bold font-['Lora']">
                10-12 hours/week
              </td>
              <td className="py-4 px-6 text-gray-900 font-bold font-['Lora']">75%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}