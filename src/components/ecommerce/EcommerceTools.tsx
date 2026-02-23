'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';

const assessments = [
  {
    title: 'Experience Assessment',
    description:
      'Using a suite of analytics tools covering areas such as site latency, standards achievement, website functionality, and online support, our e-commerce consultants evaluate the online experience. By comparing results to our benchmark database, we can identify strengths, weaknesses, and areas for immediate improvement.',
  },
  {
    title: 'Design Assessment',
    description:
      'We examine digital experiences from the perspective of the customer — and with their input in mind. Ethnographic research on how shoppers engage with major channels and understand how well — or poorly — those channels anticipate customer needs, provide effective navigation, and help users prevent and recover from errors.',
  },
  {
    title: 'Technical Assessment',
    description:
      'This diagnostic helps us analyze current platforms, performance, and integrations, and understand how they mesh with accelerators and models in an e-commerce strategy. It lets us identify the technical gaps as well as the strengths that can be leveraged.',
  },
  {
    title: 'Capability Assessment',
    description:
      'We use a comprehensive assessment covering more than 100 dimensions and benchmarked against your industry to gauge e-commerce capabilities across the maturity curve. This lets us see which capabilities the company should be best in class from an internal capability perspective — and where they need to step up their game.',
  },
];

export default function EcommerceTools() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-white py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          {/* Header */}
          <div className="space-y-6">
            <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-[#0F3D3E]">
              Our E-Commerce Tools and Resources
            </h2>
            <div className="w-12 h-[3px] bg-[#84CC16]" />
            <p className="font-['Lora'] text-lg leading-relaxed text-gray-700 max-w-4xl">
              We bring an operator's perspective to e-commerce — because we've been there. Our 
              consulting draws on an extensive network of industry, functional, and technical experts 
              alongside agile ways of working, analytics, and AI capabilities. We also use proprietary 
              assessment tools which help us gauge where your company stands — and how best to shape 
              its e-commerce strategy.
            </p>
          </div>

          {/* Assessment Tools Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {assessments.map((assessment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#84CC16] flex-shrink-0 mt-1" />
                  <div className="space-y-2">
                    <h3 className="font-['Playfair_Display'] text-xl text-[#0F3D3E]">
                      {assessment.title}
                    </h3>
                    <p className="font-['Lora'] text-base leading-relaxed text-gray-600">
                      {assessment.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}