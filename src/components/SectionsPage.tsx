import V2PricingSection from './homev2/V2PricingSection';
import V2AIMaturityFramework from './homev2/V2AIMaturityFramework';

interface SectionsPageProps {
  onNavigate?: (page: string) => void;
}

export default function SectionsPage({ onNavigate }: SectionsPageProps) {
  return (
    <div className="bg-[#FDFCFB]">
      {/* Page Header */}
      <section className="bg-white py-16 lg:py-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <h1 className="font-['Playfair_Display'] text-5xl lg:text-7xl font-bold text-[#1A1A1A] leading-[1.05] mb-6">
              Archived Sections
            </h1>
            <p className="font-['Lora'] text-xl text-[#666666] leading-relaxed">
              Temporarily stored page sections for future reference.
            </p>
          </div>
        </div>
      </section>

      {/* Index Navigation */}
      <section className="bg-[#F1EEEA] py-12 border-b border-[#D4D4D4]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#212427] mb-6">
            Section Index
          </h2>
          <div className="space-y-3">
            <a 
              href="#exhibit-2" 
              className="block font-['Lora'] text-base text-[#212427] hover:text-[#84CC16] transition-colors"
            >
              1. EXHIBIT 2 — The Future-Built Playbook for Climbing the AI Maturity Curve
            </a>
            <a 
              href="#investment-levels" 
              className="block font-['Lora'] text-base text-[#212427] hover:text-[#84CC16] transition-colors"
            >
              2. INVESTMENT LEVELS — Flexible engagement models
            </a>
          </div>
        </div>
      </section>

      {/* EXHIBIT 2 - AI Maturity Framework */}
      <div id="exhibit-2">
        <V2AIMaturityFramework onNavigate={onNavigate} />
      </div>

      {/* Investment Levels / Pricing Section */}
      <div id="investment-levels">
        <V2PricingSection onNavigate={onNavigate} />
      </div>
    </div>
  );
}