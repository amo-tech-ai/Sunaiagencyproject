import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Palette, Code, Pen, MessageSquare, Search, BarChart3 } from 'lucide-react';

export default function WhatsIncluded() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const deliverables = [
    {
      icon: Palette,
      title: 'Custom Design',
      description: 'Original visual design aligned to your brand identity. Every page, every component, every interaction designed from scratch — not pulled from a library. Mobile-first responsive design that works beautifully on every device.'
    },
    {
      icon: Code,
      title: 'Responsive Development',
      description: 'Clean, semantic HTML and CSS. Next.js or equivalent framework for speed and SEO. Server-side rendering where it matters. Static generation where it is faster. The best of both worlds.'
    },
    {
      icon: Pen,
      title: 'AI-Generated Copy',
      description: 'First drafts of every page written by AI, trained on your brand voice, value propositions, and target audience. You review and refine. We iterate until it converts. No more staring at blank pages for weeks.'
    },
    {
      icon: MessageSquare,
      title: 'Embedded AI Chatbot',
      description: 'Every website ships with an intelligent chatbot — handling lead qualification, appointment booking, and support from day one. Not a bolted-on widget. A native part of the experience.'
    },
    {
      icon: Search,
      title: 'SEO Foundation',
      description: 'Technical SEO built into the architecture — structured data, meta tags, sitemap, Open Graph, canonical URLs, performance optimization. You launch ranking-ready, not playing catch-up.'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Tracking',
      description: 'Google Analytics, conversion tracking, and custom event monitoring configured at launch. Know exactly where visitors come from, what they do, and where they convert — from day one.'
    }
  ];

  return (
    <section ref={ref} className="bg-white py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs uppercase tracking-widest text-[#84CC16] font-semibold font-['Lora']">
            Deliverables
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="text-4xl lg:text-5xl mb-8 text-gray-900"
          style={{ fontFamily: 'Playfair Display, serif' }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          A Complete Digital Presence, Not Just a Template
        </motion.h2>

        {/* Body Copy */}
        <motion.p
          className="max-w-4xl mb-16 text-lg text-gray-600 leading-relaxed font-['Lora']"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Every website we build is custom-designed for your brand, your audience, and your conversion goals. We do not use templates. We do not use page builders. We deliver production-grade code that performs at the highest level, looks premium, and includes the intelligence layer that turns visitors into leads and leads into customers.
        </motion.p>

        {/* Deliverable Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliverables.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                className="bg-[#F3F4F6] border-2 border-gray-300 p-8 hover:border-[#84CC16] transition-all duration-300 group"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -4 }}
              >
                {/* Icon */}
                <div className="mb-6">
                  <Icon className="w-9 h-9 text-[#84CC16]" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 
                  className="text-2xl mb-4 text-gray-900 group-hover:text-[#84CC16] transition-colors"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed font-['Lora']">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
