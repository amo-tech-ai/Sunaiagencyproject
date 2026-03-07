'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const services = [
  {
    tag: 'CAPABILITY',
    title: 'Marketing and Sales AI',
    gradient: 'from-green-100 to-green-200',
  },
  {
    tag: 'CAPABILITY',
    title: 'Digital Marketing',
    gradient: 'from-blue-100 to-blue-200',
  },
  {
    tag: 'CAPABILITY',
    title: 'Digital Sales',
    gradient: 'from-yellow-100 to-yellow-200',
  },
];

export default function EcommerceRelatedServices() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 lg:py-32" style={{ backgroundColor: '#F5F5F0' }}>
      <div className="max-w-[1120px] mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          {/* Section Header */}
          <div className="mb-12">
            <h2 className="text-4xl lg:text-5xl mb-4" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
              Related Services
            </h2>
            <div className="w-12 h-[3px]" style={{ backgroundColor: '#00875A' }} />
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group cursor-pointer border hover:border-[#00875A] transition-all duration-300"
                style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}
              >
                <div className="flex items-stretch h-full">
                  {/* Text Side */}
                  <div className="flex-1 p-8 flex flex-col justify-center space-y-4">
                    <span
                      className="inline-block px-2 py-1 border text-xs tracking-wider uppercase self-start"
                      style={{ borderColor: '#00875A', color: '#00875A', borderRadius: '4px' }}
                    >
                      {service.tag}
                    </span>
                    <h3 className="text-2xl group-hover:text-[#00875A] transition-colors" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
                      {service.title}
                    </h3>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" style={{ color: '#00875A' }} />
                  </div>

                  {/* Gradient Side */}
                  <div
                    className={`w-32 bg-gradient-to-br ${service.gradient} group-hover:opacity-80 transition-opacity`}
                    style={{ borderRadius: '0 4px 4px 0' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
