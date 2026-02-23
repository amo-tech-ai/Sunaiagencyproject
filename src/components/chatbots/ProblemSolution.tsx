import { XCircle, CheckCircle, Zap, Database, TrendingUp, Shield } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function ProblemSolution() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const problems = [
    { icon: XCircle, text: 'Only answer FAQs' },
    { icon: XCircle, text: "Don't connect to real systems" },
    { icon: XCircle, text: 'Create more work instead of saving time' },
  ];

  const solutions = [
    { icon: Zap, title: 'Qualify leads', description: 'Score and route high-intent prospects' },
    { icon: CheckCircle, title: 'Book calls', description: 'Sync with calendars automatically' },
    { icon: Database, title: 'Update your CRM', description: 'Every conversation logged' },
    { icon: TrendingUp, title: 'Trigger automations', description: 'Connect workflows end-to-end' },
    { icon: Shield, title: 'Escalate to humans', description: 'Only when complexity requires it' },
  ];

  return (
    <section ref={sectionRef} className="bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-gray-900 mb-6">
            What This Really Solves
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Most chatbots fail. Ours are business operators.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Problems */}
          <div 
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <div className="bg-[#FDFCFB] border border-gray-200 p-8 md:p-12 h-full">
              <h3 className="font-serif text-3xl text-gray-900 mb-8">
                Most Chatbots Fail Because They:
              </h3>
              <div className="space-y-6">
                {problems.map((problem, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-4"
                    style={{
                      animation: isVisible ? `fadeIn 0.5s ease-out ${index * 0.1}s both` : 'none',
                    }}
                  >
                    <problem.icon className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">{problem.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Solutions */}
          <div 
            className={`transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="border border-[#F59E0B] bg-[#FFFBEB] p-8 md:p-12 h-full">
              <h3 className="font-serif text-3xl text-gray-900 mb-4">
                Our AI Chatbots Are Business Operators
              </h3>
              <p className="text-gray-600 mb-8">
                They don't just chat — they <span className="font-medium text-gray-900">take action</span>.
              </p>
              <div className="space-y-6">
                {solutions.map((solution, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-4"
                    style={{
                      animation: isVisible ? `fadeIn 0.5s ease-out ${(index + 3) * 0.1}s both` : 'none',
                    }}
                  >
                    <div className="w-10 h-10 flex items-center justify-center border border-[#F59E0B] flex-shrink-0">
                      <solution.icon className="w-5 h-5 text-[#F59E0B]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">{solution.title}</p>
                      <p className="text-sm text-gray-600">{solution.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
