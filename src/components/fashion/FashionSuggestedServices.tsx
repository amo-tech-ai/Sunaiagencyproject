// C-F09 — Fashion Suggested Services
// BCG design system: white bg, charcoal text, Georgia serif, green icon boxes, 4px radius

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { BarChart3, RefreshCw, Camera, Factory } from 'lucide-react';

const services = [
  {
    icon: BarChart3,
    title: 'Catalog Intelligence',
    description: 'Clean, enrich, structure product data for AI agent shopping readiness. Tag attributes automatically.',
  },
  {
    icon: RefreshCw,
    title: 'Circular Fashion AI',
    description: 'Computer vision for garment condition assessment, resale pricing, and authentication for recommerce.',
  },
  {
    icon: Camera,
    title: 'AI Campaign Content',
    description: 'Virtual model photography, social content variants, campaign A/B testing. Save $5–20K per photoshoot.',
  },
  {
    icon: Factory,
    title: 'Supply Chain Optimization',
    description: 'LVMH-style allocation intelligence, markdown management, waste reduction across SKUs and seasons.',
  },
];

export default function FashionSuggestedServices() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="border-t" style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E8E4' }}>
      <div className="max-w-[1120px] mx-auto px-6 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="mb-14"
        >
          <h2 className="text-3xl lg:text-4xl" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
            Suggested Additional Services
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="border p-7 transition-colors hover:bg-[#FAFAF8]"
                style={{ backgroundColor: '#F5F5F0', borderColor: '#E8E8E4', borderRadius: '4px' }}
              >
                <div
                  className="w-11 h-11 flex items-center justify-center mb-5"
                  style={{ backgroundColor: '#1A1A1A', borderRadius: '4px' }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <h3 className="text-xl mb-3" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
                  {service.title}
                </h3>

                <p className="text-sm leading-relaxed" style={{ color: '#6B6B63' }}>
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
