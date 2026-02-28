import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { User, Rocket, Building2 } from 'lucide-react';

export default function MVPv2WhoThisIsFor() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const profiles = [
    {
      icon: User,
      title: 'Solo Founders & Small Teams',
      description:
        'You have vision + domain expertise. We handle execution so you can focus on users, sales, and feedback.',
    },
    {
      icon: Rocket,
      title: 'Funded Startups Launching a New Line',
      description:
        'Your team is busy on the core roadmap. We ship a focused MVP without stealing bandwidth.',
    },
    {
      icon: Building2,
      title: 'Companies Building Internal AI Tools',
      description:
        "Off-the-shelf tools don't fit. We build the internal system that saves hours every week.",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative bg-[#0F3D3E] text-white py-32 lg:py-40 overflow-hidden"
    >
      {/* Dot pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="max-w-4xl mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-4">
            <span className="text-xs uppercase tracking-widest text-[#84CC16] font-semibold font-['Lora']">
              BEST FIT
            </span>
          </div>
          <h2
            className="text-5xl lg:text-6xl mb-8"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Founders With Ideas That Need to Ship
          </h2>
          <p className="text-lg text-white/90 leading-relaxed font-['Lora']">
            You've done enough thinking. You need a partner who can translate
            your concept into a working product—fast, without compromise, and
            without the overhead of hiring a full team.
          </p>
        </motion.div>

        {/* 3 Profile Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {profiles.map((profile, index) => {
            const Icon = profile.icon;
            return (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-[#84CC16]/30 transition-all duration-300"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#84CC16]/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-[#84CC16]" />
                  </div>
                </div>
                <h3
                  className="text-2xl mb-4"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {profile.title}
                </h3>
                <p className="text-white/80 font-['Lora'] leading-relaxed">
                  {profile.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Best For Row */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="text-sm text-white/50 font-['Lora']">
            Best for: Pre-seed → Series A, or SMB teams with a clear workflow
            problem to automate.
          </p>
        </motion.div>
      </div>
    </section>
  );
}