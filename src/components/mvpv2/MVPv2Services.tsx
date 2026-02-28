import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

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
    id: 'scope-workshop',
    title: 'Scope Workshop',
    description: 'Week 1: Define v1 with ruthless focus. We prioritize features around one measurable hypothesis.',
    backgroundColor: '#B8956B',
    textColor: '#FFFFFF',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    imagePosition: 'bottom',
    size: 'normal'
  },
  {
    id: 'architecture',
    title: 'Architecture & Data Design',
    description: 'Week 1–2: Database schema, AI capability map, APIs, integrations, deployment plan.',
    backgroundColor: '#E8D4D8',
    textColor: '#2A2A2A',
    imageUrl: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80',
    imagePosition: 'bottom',
    size: 'normal'
  },
  {
    id: 'core-build',
    title: 'Core Build (2 Sprints)',
    description: 'Week 2–4: Daily visibility, staging environment, weekly releases, tight feedback loop.',
    backgroundColor: '#1A5063',
    textColor: '#FFFFFF',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    imagePosition: 'right',
    size: 'wide',
    gradient: 'linear-gradient(135deg, #1A5063 0%, #2B6A8A 100%)',
    cta: {
      text: 'View process',
      link: '/process'
    }
  },
  {
    id: 'ai-integration',
    title: 'AI Integration + Polish',
    description: 'Week 4–5: AI features wired in (search, recommendations, automation), UI refinement, performance pass.',
    backgroundColor: '#1A4642',
    textColor: '#FFFFFF',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    imagePosition: 'bottom',
    size: 'wide'
  },
  {
    id: 'launch',
    title: 'Launch & Onboarding',
    description: 'Week 5–6: Production deploy, monitoring, analytics, admin training, handoff docs.',
    backgroundColor: '#E6E3D0',
    textColor: '#2A2A2A',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    imagePosition: 'bottom',
    size: 'normal'
  },
  {
    id: 'support',
    title: '30 Days Support',
    description: 'Post-Launch: Bug fixes + weekly review of usage data → v2 priorities.',
    backgroundColor: '#A8CED8',
    textColor: '#2A2A2A',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80',
    imagePosition: 'bottom',
    size: 'normal',
    gradient: 'linear-gradient(135deg, #B8DAE8 0%, #98BECF 100%)'
  }
];

export default function MVPv2Services() {
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
            <span className="text-xs uppercase tracking-widest text-[#84CC16] font-semibold font-['Lora']">
              DELIVERABLES
            </span>
          </div>
          <h2
            className="text-5xl lg:text-6xl mb-6 text-[#1E3D36]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            From Concept to Deployed Product
          </h2>
          <p className="text-lg text-[#1E3D36]/70 leading-relaxed font-['Lora']">
            You get a complete MVP engagement: scope, architecture, design, build, AI integration, deployment, and launch support. This is not a clickable prototype. It's a real product you can onboard users into.
          </p>
        </motion.div>

        {/* Top Row - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 mb-6">
          {/* Card 1 - Scope Workshop */}
          <div className="lg:col-span-4">
            <ServiceCard
              service={servicesData[0]}
              index={0}
              isInView={isInView}
            />
          </div>

          {/* Card 2 - Architecture */}
          <div className="lg:col-span-3">
            <ServiceCard
              service={servicesData[1]}
              index={1}
              isInView={isInView}
            />
          </div>

          {/* Card 3 - Core Build (Wide) */}
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
          {/* Card 4 - AI Integration (Wide) */}
          <div className="lg:col-span-5">
            <ServiceCard
              service={servicesData[3]}
              index={3}
              isInView={isInView}
            />
          </div>

          {/* Card 5 - Launch */}
          <div className="lg:col-span-3">
            <ServiceCard
              service={servicesData[4]}
              index={4}
              isInView={isInView}
            />
          </div>

          {/* Card 6 - Support */}
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
  const isCoreBuild = service.id === 'core-build';
  
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
          isCoreBuild 
            ? 'absolute right-0 top-0 bottom-0 w-[55%]' 
            : 'w-full px-8 pb-8'
        }`}>
          {isCoreBuild ? (
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
