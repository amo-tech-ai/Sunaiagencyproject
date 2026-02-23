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
    <section ref={ref} className="bg-[#FAF8F6] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          {/* Section Header */}
          <div className="mb-12">
            <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-[#0F3D3E] mb-4">
              Related Services
            </h2>
            <div className="w-12 h-[3px] bg-[#84CC16]" />
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group cursor-pointer border border-gray-300 hover:border-[#84CC16] transition-all duration-300"
              >
                <div className="flex items-stretch h-full">
                  {/* Text Side */}
                  <div className="flex-1 p-8 flex flex-col justify-center space-y-4">
                    <span className="inline-block px-2 py-1 border border-[#84CC16] text-[#84CC16] text-xs tracking-wider uppercase font-['Lora'] self-start">
                      {service.tag}
                    </span>
                    <h3 className="font-['Playfair_Display'] text-2xl text-[#0F3D3E] group-hover:text-[#84CC16] transition-colors">
                      {service.title}
                    </h3>
                    <ArrowRight className="w-5 h-5 text-[#84CC16] group-hover:translate-x-2 transition-transform" />
                  </div>

                  {/* Gradient Side */}
                  <div
                    className={`w-32 bg-gradient-to-br ${service.gradient} group-hover:opacity-80 transition-opacity`}
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