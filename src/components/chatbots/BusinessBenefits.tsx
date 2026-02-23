import { Clock, TrendingUp, MessageSquare, Users, BarChart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function BusinessBenefits() {
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

  const benefits = [
    {
      icon: Clock,
      metric: '10–40 hours/week',
      title: 'Time Saved',
      description: 'Eliminate repetitive conversations and manual follow-ups',
    },
    {
      icon: TrendingUp,
      metric: '2-3x',
      title: 'Conversion Increase',
      description: 'Instant responses and intelligent qualification boost sales',
    },
    {
      icon: MessageSquare,
      metric: '60–80%',
      title: 'Automation Rate',
      description: 'Most conversations handled without human intervention',
    },
    {
      icon: Users,
      metric: 'Zero',
      title: 'Additional Hiring',
      description: 'Scale customer interactions without growing headcount',
    },
    {
      icon: BarChart,
      metric: '100%',
      title: 'Visibility',
      description: 'Full analytics on every conversation and outcome',
    },
  ];

  return (
    <section ref={sectionRef} className="bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-xs uppercase tracking-widest text-gray-500 font-medium border border-gray-200 px-4 py-2">
              Executive View
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-gray-900 mb-6">
            Business Benefits
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real, measurable impact on your bottom line
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`border border-gray-200 p-8 text-center hover:border-[#F59E0B] transition-all duration-500 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-gray-200">
                <benefit.icon className="w-8 h-8 text-gray-700" />
              </div>

              <div className="mb-4">
                <div className="text-4xl font-serif text-[#F59E0B] mb-2">
                  {benefit.metric}
                </div>
                <h3 className="font-medium text-gray-900 text-lg">
                  {benefit.title}
                </h3>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Context Note */}
        <div className="mt-16 max-w-4xl mx-auto text-center bg-[#FDFCFB] border border-gray-200 p-8">
          <p className="text-gray-600 leading-relaxed">
            These metrics are based on real client implementations across multiple industries. 
            Results vary based on conversation volume, complexity, and integration depth. 
            We focus on <span className="font-medium text-gray-900">practical value</span>, not inflated promises.
          </p>
        </div>
      </div>
    </section>
  );
}
