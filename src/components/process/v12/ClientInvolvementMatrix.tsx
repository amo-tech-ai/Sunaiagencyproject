// C-P03 — Client Involvement Matrix
// BCG design system: white bg, charcoal text, Georgia serif, green accents, 4px radius

export default function ClientInvolvementMatrix() {
  const phases = [
    { phase: 'Discovery', traditional: '10+ hours/week', ourProcess: '2-3 hours/week', savings: '70%' },
    { phase: 'Strategy', traditional: '8+ hours/week', ourProcess: '1-2 hours/week', savings: '75%' },
    { phase: 'Design', traditional: '6+ hours/week', ourProcess: '1 hour/week', savings: '83%' },
    { phase: 'Development', traditional: '10+ hours/week', ourProcess: '2 hours/week', savings: '80%' },
    { phase: 'Testing', traditional: '8+ hours/week', ourProcess: '3 hours/week', savings: '62%' },
    { phase: 'Deployment', traditional: '5+ hours/week', ourProcess: '1 hour/week', savings: '80%' },
  ];

  return (
    <section className="border-t" style={{ borderColor: '#E8E8E4' }}>
      <div className="max-w-[1120px] mx-auto px-6 py-20 md:py-28">
        <div className="mb-14">
          <h2 className="text-3xl md:text-4xl mb-5" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
            Your Time Investment
          </h2>
          <p className="text-lg max-w-3xl" style={{ color: '#6B6B63' }}>
            We minimize your time commitment while maximizing results.
          </p>
        </div>

        <div className="overflow-x-auto" style={{ borderRadius: '4px' }}>
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: '#1A1A1A' }}>
                <th className="py-3.5 px-5 text-left text-xs tracking-widest uppercase text-white" style={{ letterSpacing: '0.06em' }}>Phase</th>
                <th className="py-3.5 px-5 text-left text-xs tracking-widest uppercase text-white" style={{ letterSpacing: '0.06em' }}>Traditional Agency</th>
                <th className="py-3.5 px-5 text-left text-xs tracking-widest uppercase" style={{ backgroundColor: 'rgba(0,135,90,0.1)', color: '#FFFFFF', letterSpacing: '0.06em' }}>Our Process</th>
                <th className="py-3.5 px-5 text-left text-xs tracking-widest uppercase text-white" style={{ letterSpacing: '0.06em' }}>Time Saved</th>
              </tr>
            </thead>
            <tbody>
              {phases.map((row, index) => (
                <tr
                  key={index}
                  className="border-b transition-colors hover:bg-[#FAFAF8]"
                  style={{ borderColor: '#E8E8E4' }}
                >
                  <td className="py-3.5 px-5" style={{ color: '#1A1A1A' }}>{row.phase}</td>
                  <td className="py-3.5 px-5" style={{ color: '#6B6B63' }}>{row.traditional}</td>
                  <td className="py-3.5 px-5" style={{ backgroundColor: 'rgba(0,135,90,0.05)', color: '#00875A' }}>{row.ourProcess}</td>
                  <td className="py-3.5 px-5" style={{ color: '#6B6B63' }}>{row.savings}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2" style={{ backgroundColor: '#F5F5F0', borderColor: '#00875A' }}>
                <td className="py-3.5 px-5" style={{ color: '#1A1A1A' }}>Total</td>
                <td className="py-3.5 px-5" style={{ color: '#6B6B63' }}>47+ hours/week</td>
                <td className="py-3.5 px-5" style={{ backgroundColor: 'rgba(0,135,90,0.05)', color: '#00875A' }}>10-12 hours/week</td>
                <td className="py-3.5 px-5" style={{ color: '#1A1A1A' }}>75%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
}
