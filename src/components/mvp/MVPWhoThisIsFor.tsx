import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { User, Rocket, Building2 } from 'lucide-react';

const profiles = [
  {
    icon: User,
    title: 'Solo Founders & Small Teams',
    description:
      'You have domain expertise and a clear product vision. You do not have a CTO or a development team. You need a partner who can translate your concept into production-grade software without requiring you to become a technical project manager.',
    bestFor: 'Pre-seed and seed stage. Product ideas validated through customer discovery. Ready to build but no technical co-founder.',
    color: '#B8956B',
  },
  {
    icon: Rocket,
    title: 'Funded Startups',
    description:
      'You have raised capital and your engineering team is focused on the core product. You need to validate a new product line, a new market segment, or an AI-powered extension — without pulling your engineers off what they are building.',
    bestFor: 'Seed to Series A. Revenue-generating startups exploring adjacent opportunities. Technical teams that are capacity-constrained.',
    color: '#1A5063',
  },
  {
    icon: Building2,
    title: 'Internal AI Tools',
    description:
      'You see an opportunity to deploy AI within your operations — a custom tool for your sales team, an internal dashboard with intelligent recommendations, a workflow automation product for your ops team.',
    bestFor: 'SMBs and mid-size companies. Operations leaders with specific automation needs. Companies with 10-500 employees.',
    color: '#1A4642',
  },
];

export default function MVPWhoThisIsFor() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-white py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="mb-16 max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-4">
            <span className="text-xs uppercase tracking-widest text-[#2E6F5E] font-semibold font-['Lora']">
              WHO THIS IS FOR
            </span>
          </div>
          <h2
            className="text-5xl lg:text-6xl mb-6 text-[#1E3D36]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Founders with ideas that need to ship
          </h2>
          <p className="text-lg text-[#1E3D36]/70 leading-relaxed font-['Lora']">
            The MVP Builder is designed for people at the intersection of ambition and urgency. You have a product concept that keeps you up at night. You have validated the problem. What you need now is a technical partner who can turn that concept into a working product — fast.
          </p>
        </motion.div>

        {/* Profile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {profiles.map((profile, index) => {
            const Icon = profile.icon;
            return (
              <motion.div
                key={profile.title}
                className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg border-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl group"
                style={{
                  borderColor: profile.color,
                }}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
              >
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: profile.color }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3
                  className="text-2xl lg:text-3xl mb-4 text-[#1E3D36]"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: 400,
                  }}
                >
                  {profile.title}
                </h3>

                {/* Description */}
                <p
                  className="text-base leading-relaxed text-[#1E3D36]/70 mb-6"
                  style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    lineHeight: '1.7',
                  }}
                >
                  {profile.description}
                </p>

                {/* Divider */}
                <div className="h-px bg-gray-200 my-6" />

                {/* Best For */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-2 font-['Lora']">
                    Best for:
                  </p>
                  <p
                    className="text-sm text-[#1E3D36]/60 leading-relaxed"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    {profile.bestFor}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
