// C-P04 — Methodology Comparison Table
// BCG design system: white bg, charcoal text, Georgia serif, green accents, 4px radius

export default function MethodologyComparison() {
  const rows = [
    { feature: 'Timeline', traditional: '6-12 months', freelancer: '3-6 months', ourProcess: '8 weeks' },
    { feature: 'Client Time Investment', traditional: '40+ hours/week', freelancer: '20+ hours/week', ourProcess: '10-12 hours/week' },
    { feature: 'AI Acceleration', traditional: 'Minimal', freelancer: 'Limited', ourProcess: 'Fully Integrated' },
    { feature: 'Dedicated Team', traditional: '✓', freelancer: '✗', ourProcess: '✓' },
    { feature: 'Fixed Pricing', traditional: '✗', freelancer: '✗', ourProcess: '✓' },
    { feature: 'Post-Launch Support', traditional: 'Extra Cost', freelancer: 'Rarely', ourProcess: '30 Days Included' },
    { feature: 'Quality Guarantee', traditional: 'Limited', freelancer: 'None', ourProcess: '100% Satisfaction' },
  ];

  return (
    <section className="border-t" style={{ borderColor: '#E8E8E4' }}>
      <div className="max-w-[1120px] mx-auto px-6 py-20 md:py-28">
        <div className="mb-14">
          <h2 className="text-3xl md:text-4xl mb-5" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
            How We Compare
          </h2>
          <p className="text-lg max-w-3xl" style={{ color: '#6B6B63' }}>
            See why leading companies choose our AI-accelerated approach.
          </p>
        </div>

        <div className="overflow-x-auto" style={{ borderRadius: '4px' }}>
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: '#1A1A1A' }}>
                <th className="py-3.5 px-5 text-left text-xs tracking-widest uppercase text-white" style={{ letterSpacing: '0.06em' }}>Feature</th>
                <th className="py-3.5 px-5 text-left text-xs tracking-widest uppercase text-white" style={{ letterSpacing: '0.06em' }}>Traditional Agency</th>
                <th className="py-3.5 px-5 text-left text-xs tracking-widest uppercase text-white" style={{ letterSpacing: '0.06em' }}>Freelancers</th>
                <th className="py-3.5 px-5 text-left text-xs tracking-widest uppercase text-white border-b-2" style={{ borderColor: '#00875A', letterSpacing: '0.06em' }}>Our Process</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={index}
                  className="border-b transition-colors hover:bg-[#FAFAF8]"
                  style={{ borderColor: '#E8E8E4' }}
                >
                  <td className="py-3.5 px-5" style={{ color: '#1A1A1A' }}>{row.feature}</td>
                  <td className="py-3.5 px-5" style={{ color: '#6B6B63' }}>{row.traditional}</td>
                  <td className="py-3.5 px-5" style={{ color: '#6B6B63' }}>{row.freelancer}</td>
                  <td className="py-3.5 px-5" style={{ backgroundColor: 'rgba(0,135,90,0.05)', color: '#00875A' }}>{row.ourProcess}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
