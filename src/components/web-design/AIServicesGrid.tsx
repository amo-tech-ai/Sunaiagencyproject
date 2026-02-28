import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface AIServiceCardData {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  imageUrl: string;
  size: 'normal' | 'wide';
}

const aiServicesData: AIServiceCardData[] = [
  {
    id: 'ai-agent-systems',
    title: 'AI Agent Systems',
    description: 'Autonomous digital workers that handle leads, onboard clients, and automate operations.',
    backgroundColor: '#0A0A0A',
    textColor: '#FFFFFF',
    imageUrl: 'https://images.unsplash.com/photo-1695977722806-96e3fc746e9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    size: 'normal'
  },
  {
    id: 'ai-chatbots',
    title: 'AI Chatbots',
    description: 'Production-grade chatbots with RAG, CRM sync, and workflow execution.',
    backgroundColor: '#E8DCC8',
    textColor: '#2A2A2A',
    imageUrl: 'https://images.unsplash.com/photo-1672988961672-b485b5f6be72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    size: 'normal'
  },
  {
    id: 'whatsapp-ai',
    title: 'WhatsApp AI Automation',
    description: 'Turn WhatsApp into a sales and support channel with AI agents and CRM sync.',
    backgroundColor: '#1A1A1A',
    textColor: '#FFFFFF',
    imageUrl: 'https://images.unsplash.com/photo-1674857567490-290dd93aaa62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    size: 'normal'
  },
  {
    id: 'ai-sales-crm',
    title: 'AI Sales & Marketing CRM',
    description: 'AI-powered lead capture, scoring, automated outreach, and proposal generation.',
    backgroundColor: '#2A3B4A',
    textColor: '#FFFFFF',
    imageUrl: 'https://images.unsplash.com/photo-1701144382650-2db7502d67bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    size: 'normal'
  },
  {
    id: 'ai-mvp',
    title: 'AI MVP Development',
    description: 'Turn your AI idea into a working product in 4–6 weeks.',
    backgroundColor: '#D8E8E8',
    textColor: '#2A2A2A',
    imageUrl: 'https://images.unsplash.com/photo-1758685734156-3c5d35bae1d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    size: 'normal'
  },
  {
    id: 'custom-ai',
    title: 'Custom AI Development',
    description: 'RAG systems, personalization engines, predictive analytics, decision dashboards.',
    backgroundColor: '#0A1520',
    textColor: '#FFFFFF',
    imageUrl: 'https://images.unsplash.com/photo-1720756871114-bee03cd286ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    size: 'normal'
  },
  {
    id: 'ai-web-scraping',
    title: 'AI Web Scraping & Data Extraction',
    description: 'Automated data collection, enrichment, and integration pipelines.',
    backgroundColor: '#0D2818',
    textColor: '#FFFFFF',
    imageUrl: 'https://images.unsplash.com/photo-1768330187168-8acee7753983?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    size: 'normal'
  },
  {
    id: 'voice-ai',
    title: 'Voice AI & Speech Recognition',
    description: 'Voice-enabled interfaces, transcription, and conversational AI systems.',
    backgroundColor: '#C8B8A8',
    textColor: '#2A2A2A',
    imageUrl: 'https://images.unsplash.com/photo-1665760670979-708eb9626d73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    size: 'normal'
  },
  {
    id: 'ai-analytics',
    title: 'AI Analytics & Business Intelligence',
    description: 'Predictive models, automated reporting, and intelligent dashboards.',
    backgroundColor: '#1A2A1A',
    textColor: '#FFFFFF',
    imageUrl: 'https://images.unsplash.com/photo-1770323084788-1c0e6bc1b8b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    size: 'normal'
  }
];

export default function AIServicesGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-white py-32 lg:py-40">
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
              Our Services
            </span>
          </div>
          <h2
            className="text-5xl lg:text-6xl mb-6 text-[#1E3D36]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Digital, Technology, and Data
          </h2>
          <p className="text-lg text-[#1E3D36]/70 leading-relaxed font-['Lora']">
            AI-powered solutions that transform operations, automate workflows, and deliver measurable business outcomes.
          </p>
        </motion.div>

        {/* Services Grid - 3x3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiServicesData.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ServiceCardProps {
  service: AIServiceCardData;
  index: number;
  isInView: boolean;
}

function ServiceCard({ service, index, isInView }: ServiceCardProps) {
  return (
    <motion.div
      className="relative overflow-hidden transition-all duration-500 group cursor-pointer h-full"
      style={{
        background: service.backgroundColor,
        borderRadius: '20px',
        minHeight: '420px',
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={{
        y: -4,
        transition: { duration: 0.3 }
      }}
    >
      {/* Image - Full Card Background */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={service.imageUrl}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Dark Overlay */}
        <div 
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `linear-gradient(to bottom, ${service.backgroundColor}00 0%, ${service.backgroundColor} 100%)`,
            opacity: 0.9
          }}
        />
      </div>

      {/* Content - Default State (Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
        <h3
          className="text-2xl lg:text-[28px] mb-3 font-normal leading-tight"
          style={{ 
            color: service.textColor,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 400,
            letterSpacing: '-0.01em'
          }}
        >
          {service.title}
        </h3>
      </div>

      {/* Hover Content - Slides Up */}
      <div 
        className="absolute inset-0 p-8 flex flex-col justify-end z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"
        style={{
          background: service.backgroundColor
        }}
      >
        <h3
          className="text-2xl lg:text-[28px] mb-4 font-normal leading-tight"
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
          className="text-sm lg:text-[15px] leading-relaxed mb-6"
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

        {/* Learn More Link */}
        <button
          className="inline-flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all"
          style={{ color: service.textColor === '#FFFFFF' ? '#84CC16' : '#0F3D3E' }}
        >
          Learn More
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}