import { ShoppingBag, Home, Calendar, Laptop } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function IndustryUseCases() {
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

  const industries = [
    {
      icon: ShoppingBag,
      name: 'Fashion / Ecommerce',
      useCases: [
        'Product questions & recommendations',
        'Order tracking & status updates',
        'Cart recovery & abandoned checkout',
        'Upsells & cross-sells at checkout',
      ],
      outcome: 'More conversions with the same traffic',
    },
    {
      icon: Home,
      name: 'Real Estate',
      useCases: [
        'WhatsApp lead handling (24/7)',
        'Property qualification questions',
        'Tour scheduling & reminders',
        'Instant property info & pricing',
      ],
      outcome: 'Win deals faster than competitors',
    },
    {
      icon: Calendar,
      name: 'Events & Tourism',
      useCases: [
        'Ticket questions & availability',
        'Itinerary information & planning',
        'Upsell experiences & packages',
        'Post-event feedback collection',
      ],
      outcome: 'Higher revenue per guest',
    },
    {
      icon: Laptop,
      name: 'SaaS & B2B',
      useCases: [
        'Demo booking & qualification',
        'Onboarding support & tutorials',
        'Churn prevention & engagement',
        'Feature requests & feedback',
      ],
      outcome: 'Better retention & pipeline health',
    },
  ];

  return (
    <section ref={sectionRef} className="bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-gray-900 mb-6">
            Industry Use Cases
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tailored solutions for your specific business model
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {industries.map((industry, index) => (
            <div
              key={index}
              className={`border border-gray-200 p-8 md:p-10 hover:border-[#F59E0B] transition-all duration-500 group ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Icon & Title */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 flex items-center justify-center border border-gray-200 group-hover:border-[#F59E0B] transition-colors">
                  <industry.icon className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="font-serif text-2xl text-gray-900">
                  {industry.name}
                </h3>
              </div>

              {/* Use Cases */}
              <div className="mb-8 space-y-3">
                {industry.useCases.map((useCase, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[#F59E0B] mt-2 flex-shrink-0" />
                    <p className="text-gray-700 leading-relaxed">{useCase}</p>
                  </div>
                ))}
              </div>

              {/* Outcome */}
              <div className="pt-6 border-t border-gray-100">
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                  Outcome
                </p>
                <p className="text-gray-900 font-medium text-lg">
                  {industry.outcome}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
