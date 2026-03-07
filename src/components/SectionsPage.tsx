import { useNavigate } from 'react-router';
import { pageToPath } from '../lib/navigation';
import V2PricingSection from './homev2/V2PricingSection';
import V2AIMaturityFramework from './homev2/V2AIMaturityFramework';

export default function SectionsPage() {
  const nav = useNavigate();
  const onNavigate = (page: string) => nav(pageToPath(page));

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
      <section className="border-b" style={{ backgroundColor: '#F5F5F0', borderColor: '#E8E8E4' }}>
        <div className="max-w-[1120px] mx-auto px-6 py-12">
          <h2 className="text-2xl mb-6" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
            Section Index
          </h2>
          <div className="space-y-3">
            <a 
              href="#exhibit-2" 
              className="block text-base transition-colors hover:text-[#00875A]"
              style={{ color: '#1A1A1A' }}
            >
              1. EXHIBIT 2 — The Future-Built Playbook for Climbing the AI Maturity Curve
            </a>
            <a 
              href="#investment-levels" 
              className="block text-base transition-colors hover:text-[#00875A]"
              style={{ color: '#1A1A1A' }}
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