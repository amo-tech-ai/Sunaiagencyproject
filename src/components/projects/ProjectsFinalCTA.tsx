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
    <section className="py-24 lg:py-32 bg-[#1A1A1A] text-white">
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

          <p className="text-xl text-white/70 font-light mb-12">
            From idea to production system in 8 weeks.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onStartProject}
              className="px-10 py-5 bg-[#F59E0B] text-[#1A1A1A] font-bold hover:bg-[#FCD34D] transition-all"
            >
              Start Your Project
            </button>
            <button
              onClick={onContactUs}
              className="px-10 py-5 border border-white/20 bg-white/5 text-white font-bold hover:bg-white/10 transition-all"
            >
              Contact Us
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
