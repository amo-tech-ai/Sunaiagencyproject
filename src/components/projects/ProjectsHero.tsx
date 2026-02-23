import { motion } from 'motion/react';

interface ProjectsHeroProps {
  onStartClick?: () => void;
  onProcessClick?: () => void;
}

export default function ProjectsHero({
  onStartClick,
  onProcessClick,
}: ProjectsHeroProps) {
  return (
    <section className="bg-[#FDFCFB] py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-5xl mx-auto"
        >
          <p className="text-xs uppercase tracking-widest text-[#999999] font-bold mb-4">
            Case Studies
          </p>

          <h1
            className="text-5xl lg:text-7xl text-[#1A1A1A] tracking-tight mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Real AI Products. Real Results.
          </h1>

          <h2 className="text-2xl lg:text-3xl text-[#666666] font-light mb-4">
            Production-ready AI platforms built and delivered in 8 weeks.
          </h2>

          <p className="text-lg text-[#999999] mb-10">
            No demos. No prototypes. Real systems in use.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onStartClick}
              className="bg-[#1A1A1A] text-white px-10 py-5 text-base font-semibold hover:bg-[#333] transition-colors"
            >
              Start Your Project
            </button>
            <button
              onClick={onProcessClick}
              className="border border-[#1A1A1A] text-[#1A1A1A] px-10 py-5 text-base font-semibold hover:bg-[#1A1A1A] hover:text-white transition-colors"
            >
              View How We Work
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
