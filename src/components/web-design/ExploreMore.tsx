import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export default function ExploreMore() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="font-['Lora'] text-4xl lg:text-5xl text-gray-900 mb-12"
        >
          Explore More
        </motion.h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Feature Card - 60% width (3 columns) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="relative bg-[#0F3D3E] rounded-[32px] p-10 lg:p-14 h-full flex flex-col justify-between min-h-[280px] lg:min-h-[320px]">
              {/* Label */}
              <div>
                <span className="text-xs font-['Lora'] font-semibold uppercase tracking-[0.15em] text-white/80">
                  NEXT SECTION
                </span>
                
                {/* Headline */}
                <h3 className="font-['Lora'] text-2xl lg:text-3xl xl:text-4xl text-white mt-4 leading-tight max-w-lg">
                  Our Latest Thinking on Financial Institutions
                </h3>
              </div>

              {/* Button - Bottom Right */}
              <div className="flex justify-end mt-8">
                <button className="flex items-center gap-2 bg-[#84CC16] text-gray-900 px-6 py-3 rounded-full font-['Lora'] font-semibold text-sm hover:bg-[#73b512] transition-colors">
                  LEARN MORE
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Column - 40% width (2 columns) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Industry Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1"
            >
              <div className="relative bg-[#F5F5F0] rounded-[32px] overflow-hidden h-full group cursor-pointer">
                <div className="grid grid-cols-5 h-full min-h-[148px] lg:min-h-[148px]">
                  {/* Text Content - Left 60% */}
                  <div className="col-span-3 p-6 lg:p-8 flex flex-col justify-center">
                    <span className="text-[10px] font-['Lora'] font-semibold uppercase tracking-[0.12em] text-gray-900 mb-3">
                      INDUSTRY
                    </span>
                    <h4 className="font-['Lora'] text-lg lg:text-xl text-gray-900 leading-snug">
                      Asset Management
                    </h4>
                  </div>

                  {/* Image - Right 40% (cropped right edge) */}
                  <div className="col-span-2 relative overflow-hidden">
                    <div className="absolute inset-0 -right-8">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                        alt="Asset Management"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Capability Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex-1"
            >
              <div className="relative bg-[#F5F5F0] rounded-[32px] overflow-hidden h-full group cursor-pointer">
                <div className="grid grid-cols-5 h-full min-h-[148px] lg:min-h-[148px]">
                  {/* Text Content - Left 60% */}
                  <div className="col-span-3 p-6 lg:p-8 flex flex-col justify-center">
                    <span className="text-[10px] font-['Lora'] font-semibold uppercase tracking-[0.12em] text-gray-900 mb-3">
                      CAPABILITY
                    </span>
                    <h4 className="font-['Lora'] text-lg lg:text-xl text-gray-900 leading-snug">
                      Risk Management and Compliance
                    </h4>
                  </div>

                  {/* Image - Right 40% (cropped right edge) */}
                  <div className="col-span-2 relative overflow-hidden">
                    <div className="absolute inset-0 -right-8">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                        alt="Risk Management"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}