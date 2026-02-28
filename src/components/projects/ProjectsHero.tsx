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
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-5xl mx-auto"
        >
          <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-4 font-['Lora']">
            Case Studies
          </p>

          <h1
            className="text-5xl lg:text-7xl text-gray-900 tracking-tight mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Real AI Products. Real Results.
          </h1>

          <h2 className="text-2xl lg:text-3xl text-gray-600 font-light mb-4 font-['Lora']">
            Production-ready AI platforms built and delivered in 8 weeks.
          </h2>

          <p className="text-lg text-gray-500 mb-10 font-['Lora']">
            No demos. No prototypes. Real systems in use.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onStartClick}
              className="bg-[#84CC16] text-gray-900 px-8 py-4 text-base font-semibold hover:bg-[#73b512] transition-colors font-['Lora']"
            >
              Start Your Project
            </button>
            <button
              onClick={onProcessClick}
              className="border border-[#0F3D3E] text-[#0F3D3E] px-8 py-4 text-base font-semibold hover:bg-[#0F3D3E] hover:text-white transition-colors font-['Lora']"
            >
              View How We Work
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}