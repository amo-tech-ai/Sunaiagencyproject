import { Zap, Brain, FileText, Cog, Database, Lightbulb } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function GeminiTechnology() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Zap,
      feature: 'Gemini 3 Flash',
      benefit: 'Fast, real-time conversations with minimal latency',
    },
    {
      icon: Brain,
      feature: 'Gemini 3 Pro',
      benefit: 'Complex reasoning & advanced sales logic',
    },
    {
      icon: FileText,
      feature: 'Structured Outputs',
      benefit: 'Reliable system actions and data formatting',
    },
    {
      icon: Cog,
      feature: 'Tool / Function Calling',
      benefit: 'Real workflow execution across systems',
    },
    {
      icon: Database,
      feature: 'RAG (Retrieval)',
      benefit: 'No hallucinations — answers from your data',
    },
    {
      icon: Lightbulb,
      feature: 'Thinking Mode',
      benefit: 'Smart decisions, not scripted replies',
    },
  ];

  return (
    <section ref={sectionRef} className="bg-[#FDFCFB] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-xs uppercase tracking-widest text-gray-500 font-medium border border-gray-200 px-4 py-2">
              Powered By
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-gray-900 mb-6">
            Gemini 3 Technology
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enterprise-grade AI capabilities that power real business outcomes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className={`bg-white border border-gray-200 p-8 hover:border-[#F59E0B] transition-all duration-500 group ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="w-12 h-12 flex items-center justify-center border border-gray-200 group-hover:border-[#F59E0B] transition-colors mb-6">
                <item.icon className="w-6 h-6 text-gray-700" />
              </div>

              <h3 className="font-medium text-gray-900 mb-3 text-lg">
                {item.feature}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                {item.benefit}
              </p>
            </div>
          ))}
        </div>

        {/* Annotation */}
        <div className="mt-16 max-w-4xl mx-auto bg-white border border-gray-200 p-8">
          <p className="text-gray-600 leading-relaxed text-center">
            We use the latest Gemini models to ensure your chatbot is fast, accurate, and capable of 
            executing complex business logic. This isn't a simple Q&A bot — it's a <span className="font-medium text-gray-900">business automation system</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
