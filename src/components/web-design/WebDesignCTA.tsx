import { useNavigate } from 'react-router';
import { ArrowRight } from 'lucide-react';

export default function WebDesignCTA() {
  const navigate = useNavigate();

  return (
    <section className="bg-[#0F3D3E] text-white py-32 lg:py-40 text-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Divider Line */}
        <div
          className="w-full max-w-md mx-auto h-px bg-white/10 mb-12"
        />

        {/* Headline */}
        <h2
          className="text-4xl lg:text-5xl mb-8"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Need a Website That Works as Hard as You Do?
        </h2>

        {/* Body Copy */}
        <p
          className="text-lg text-white/70 mb-10 leading-relaxed font-['Lora'] max-w-2xl mx-auto"
        >
          Stop waiting months for a website that loads slowly and converts poorly. Book a web strategy session. We will review your current site, identify the biggest performance and conversion gaps, and outline a build plan that gets you live in weeks — with intelligence built in from day one.
        </p>

        {/* CTA Button */}
        <div
        >
          <button
            onClick={() => navigate('/booking')}
            className="bg-[#84CC16] text-gray-900 px-10 py-4 font-['Lora'] text-lg font-semibold hover:bg-[#73b512] transition-colors inline-flex items-center gap-2"
          >
            Start Your Website Project
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}