// C-F11 — Fashion Related Services
// BCG design system: off-white bg, charcoal text, Georgia serif, green hover border, 4px radius

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const relatedServices = [
  { tag: 'INDUSTRY', title: 'Luxury Goods', gradient: 'from-amber-600 to-yellow-700' },
  { tag: 'INDUSTRY', title: 'Retail Industry', gradient: 'from-green-600 to-emerald-700' },
  { tag: 'CAPABILITY', title: 'Customer Experience', gradient: 'from-blue-600 to-cyan-700' },
];

export default function FashionRelatedServices() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="border-t" style={{ backgroundColor: '#F5F5F0', borderColor: '#E8E8E4' }}>
      <div className="max-w-[1120px] mx-auto px-6 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="mb-14"
        >
          <h2 className="text-3xl lg:text-4xl" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
            Explore Related Services
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {relatedServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group cursor-pointer border overflow-hidden transition-colors hover:border-[#00875A]"
              style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}
            >
              {/* Gradient Image Area */}
              <div className={`h-64 bg-gradient-to-br ${service.gradient} p-6 flex flex-col justify-between`}>
                <span
                  className="inline-block w-fit px-3 py-1 bg-white/90 text-xs tracking-widest uppercase"
                  style={{ color: '#1A1A1A', borderRadius: '4px', letterSpacing: '0.06em' }}
                >
                  {service.tag}
                </span>
                <h3 className="text-2xl text-white" style={{ fontFamily: 'Georgia, serif' }}>
                  {service.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
