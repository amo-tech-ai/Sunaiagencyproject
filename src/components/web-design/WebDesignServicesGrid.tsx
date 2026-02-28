import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import laptopImg from 'figma:asset/a829908149034de5e0e368df7d1ce1f428518e1b.png';
import webflowImg from 'figma:asset/8e5dce7c277cf292bb3a31216325db3622e51363.png';

interface ServiceCardData {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  imageUrl?: string;
  imagePosition: 'bottom' | 'center' | 'right';
  cta?: {
    text: string;
    link: string;
  };
  size: 'normal' | 'wide';
  gradient?: string;
}

const servicesData: ServiceCardData[] = [
  {
    id: 'website-design',
    title: 'Website design',
    description: 'Website UX research, wireframes, responsive design, and high-fidelity UI, tailored to your goals.',
    backgroundColor: '#B8956B',
    textColor: '#FFFFFF',
    imageUrl: laptopImg,
    imagePosition: 'bottom',
    size: 'normal'
  },
  {
    id: 'webflow-development',
    title: 'Webflow development',
    description: 'Certified Webflow partner offering flexible, scalable builds with CMS integration.',
    backgroundColor: '#E8D4D8',
    textColor: '#2A2A2A',
    imageUrl: webflowImg,
    imagePosition: 'bottom',
    size: 'normal'
  },
  {
    id: 'landing-pages',
    title: 'Landing pages',
    description: 'Funnel-stage pages that launch fast—fully optimized, mobile first, and on brand. Ideal for product launches, paid media, lifecycle marketing, and SEO.',
    backgroundColor: '#1A5063',
    textColor: '#FFFFFF',
    imageUrl: 'https://images.unsplash.com/photo-1612247905736-c283f684cd55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    imagePosition: 'right',
    size: 'wide',
    gradient: 'linear-gradient(135deg, #1A5063 0%, #2B6A8A 100%)',
    cta: {
      text: 'Learn more',
      link: '/booking'
    }
  },
  {
    id: 'design-systems',
    title: 'Design systems and UI kits',
    description: 'Reusable component libraries built following the Atomic design methodology to scale with consistency.',
    backgroundColor: '#1A4642',
    textColor: '#FFFFFF',
    imageUrl: 'https://images.unsplash.com/photo-1672689956124-18666b4cdae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    imagePosition: 'bottom',
    size: 'wide'
  },
  {
    id: 'ux-ui-audits',
    title: 'UX/UI audits',
    description: 'Deep research into conversion leaks and usability gaps, plus expert recs to boost performance.',
    backgroundColor: '#E6E3D0',
    textColor: '#2A2A2A',
    imageUrl: 'https://images.unsplash.com/photo-1649442279006-8bccb4cc63e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    imagePosition: 'bottom',
    size: 'normal'
  },
  {
    id: 'copy-motion',
    title: 'Copy & motion support',
    description: 'Full-stack creative including headlines, content hierarchy, microcopy, and animation.',
    backgroundColor: '#A8CED8',
    textColor: '#2A2A2A',
    imageUrl: 'https://images.unsplash.com/photo-1643208589891-ba2ed985fb5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    imagePosition: 'bottom',
    size: 'normal',
    gradient: 'linear-gradient(135deg, #B8DAE8 0%, #98BECF 100%)'
  }
];

export default function WebDesignServicesGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-[#F4F3EE] py-32 lg:py-40">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="mb-16 max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-4">
            <span className="text-xs uppercase tracking-widest text-[#2E6F5E] font-semibold font-['Lora']">
              Our Services
            </span>
          </div>
          <h2
            className="text-5xl lg:text-6xl mb-6 text-[#1E3D36]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Premium Web Design Services
          </h2>
          <p className="text-lg text-[#1E3D36]/70 leading-relaxed font-['Lora']">
            Custom digital experiences designed to convert, built to scale, and optimized for performance.
          </p>
        </motion.div>

        {/* Top Row - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 mb-6">
          {/* Card 1 - Website Design */}
          <div className="lg:col-span-4">
            <ServiceCard
              service={servicesData[0]}
              index={0}
              isInView={isInView}
            />
          </div>

          {/* Card 2 - Webflow Development */}
          <div className="lg:col-span-3">
            <ServiceCard
              service={servicesData[1]}
              index={1}
              isInView={isInView}
            />
          </div>

          {/* Card 3 - Landing Pages (Wide) */}
          <div className="lg:col-span-5">
            <ServiceCard
              service={servicesData[2]}
              index={2}
              isInView={isInView}
            />
          </div>
        </div>

        {/* Bottom Row - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Card 4 - Design Systems (Wide) */}
          <div className="lg:col-span-5">
            <ServiceCard
              service={servicesData[3]}
              index={3}
              isInView={isInView}
            />
          </div>

          {/* Card 5 - UX/UI Audits */}
          <div className="lg:col-span-3">
            <ServiceCard
              service={servicesData[4]}
              index={4}
              isInView={isInView}
            />
          </div>

          {/* Card 6 - Copy & Motion */}
          <div className="lg:col-span-4">
            <ServiceCard
              service={servicesData[5]}
              index={5}
              isInView={isInView}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface ServiceCardProps {
  service: ServiceCardData;
  index: number;
  isInView: boolean;
}

function ServiceCard({ service, index, isInView }: ServiceCardProps) {
  const isLandingPages = service.id === 'landing-pages';
  
  return (
    <motion.div
      className="relative overflow-hidden transition-all duration-500 group cursor-pointer h-full flex flex-col"
      style={{
        background: service.gradient || service.backgroundColor,
        borderRadius: '20px',
        minHeight: '340px',
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{
        y: -4,
        transition: { duration: 0.3 }
      }}
    >
      {/* Content */}
      <div className="relative z-10 p-8 lg:p-10">
        <h3
          className="text-2xl lg:text-3xl mb-3 font-normal"
          style={{ 
            color: service.textColor,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 400,
            letterSpacing: '-0.01em'
          }}
        >
          {service.title}
        </h3>

        <p
          className="text-sm lg:text-[15px] leading-relaxed max-w-[300px]"
          style={{ 
            color: service.textColor,
            opacity: service.textColor === '#FFFFFF' ? 0.85 : 0.75,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 400,
            lineHeight: '1.6'
          }}
        >
          {service.description}
        </p>

        {service.cta && (
          <button
            className="inline-flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all mt-6"
            style={{ color: service.textColor }}
          >
            {service.cta.text}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Image */}
      {service.imageUrl && (
        <div className={`relative mt-auto ${
          isLandingPages 
            ? 'absolute right-0 top-0 bottom-0 w-[55%]' 
            : 'w-full px-8 pb-8'
        }`}>
          {isLandingPages ? (
            <div className="relative h-full w-full group-hover:scale-105 transition-transform duration-500">
              <ImageWithFallback
                src={service.imageUrl}
                alt={service.title}
                className="w-full h-full object-cover object-center"
                style={{
                  transform: 'perspective(1200px) rotateY(-8deg) scale(1.1)',
                  transformOrigin: 'left center'
                }}
              />
            </div>
          ) : (
            <div className="relative w-full aspect-[4/3] group-hover:scale-105 transition-transform duration-500">
              <ImageWithFallback
                src={service.imageUrl}
                alt={service.title}
                className="w-full h-full object-cover rounded-lg"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
                }}
              />
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
