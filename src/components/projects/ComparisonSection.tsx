import { motion } from 'motion/react';
import { X, Check } from 'lucide-react';

const TRADITIONAL_FEATURES = [
  '12-16 weeks typical timeline',
  'Manual workflows and processes',
  'Static deliverables and mockups',
  'Limited post-launch support',
  'High client time investment',
  'Costly change requests',
];

const SUN_AI_FEATURES = [
  '6-8 weeks from start to launch',
  'AI-powered automation',
  'Live, production-ready systems',
  'Built to scale from day one',
  'Minimal client time required',
  'Flexible, iterative development',
];

export default function ComparisonSection() {
  return (
    <section className="py-24 lg:py-32 bg-[#FDFCFB]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl lg:text-5xl text-[#1A1A1A]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Why Our Projects Ship Faster
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Traditional Agency */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-8 border border-[#EFE9E4] bg-white"
          >
            <h3
              className="text-2xl mb-6 text-[#666666]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Traditional Agency
            </h3>
            <ul className="space-y-4">
              {TRADITIONAL_FEATURES.map((feature, index) => (
                <li key={index} className="flex gap-3 text-[#999999]">
                  <X className="w-5 h-5 text-[#999999] flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Sun AI Agency */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="p-8 border-2 border-[#F59E0B] bg-[#F59E0B]/5"
          >
            <h3
              className="text-2xl mb-6 text-[#1A1A1A]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Sun AI Agency
            </h3>
            <ul className="space-y-4">
              {SUN_AI_FEATURES.map((feature, index) => (
                <li key={index} className="flex gap-3 text-[#666666]">
                  <Check className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
