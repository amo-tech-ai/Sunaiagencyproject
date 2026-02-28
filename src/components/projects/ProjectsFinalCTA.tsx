import { motion } from 'motion/react';

interface ProjectsFinalCTAProps {
  onStartProject?: () => void;
  onContactUs?: () => void;
}

export default function ProjectsFinalCTA({
  onStartProject,
  onContactUs,
}: ProjectsFinalCTAProps) {
  return (
    <section className="py-24 lg:py-32 bg-[#0F3D3E] text-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-5xl lg:text-6xl mb-8 leading-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Ready to Build a Real AI Product?
          </h2>

          <p className="text-xl text-white/70 font-light mb-12 font-['Lora']">
            From idea to production system in 8 weeks.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onStartProject}
              className="px-8 py-4 bg-[#84CC16] text-gray-900 font-semibold hover:bg-[#73b512] transition-colors font-['Lora']"
            >
              Start Your Project
            </button>
            <button
              onClick={onContactUs}
              className="px-8 py-4 border border-white/20 bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors font-['Lora']"
            >
              Contact Us
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}