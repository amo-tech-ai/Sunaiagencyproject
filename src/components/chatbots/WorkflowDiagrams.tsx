import { ArrowRight, CheckCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function WorkflowDiagrams() {
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

  const workflows = [
    {
      title: 'Ecommerce Support',
      userQuery: '"Where is my order?"',
      steps: [
        'Looks up order in database',
        'Confirms current status',
        'Sends tracking link via SMS',
        'Updates CRM support ticket',
      ],
      result: 'Support tickets reduced by ~70%',
    },
    {
      title: 'Sales Qualification',
      userQuery: '"I\'m interested in your product"',
      steps: [
        'Asks qualifying questions',
        'Scores lead quality (1-10)',
        'Books calendar slot automatically',
        'Notifies sales rep via Slack',
      ],
      result: 'Faster speed-to-lead, higher close rate',
    },
    {
      title: 'WhatsApp Concierge',
      userQuery: 'Messages business on WhatsApp',
      steps: [
        'Instant reply (24/7 availability)',
        'Answers common questions from KB',
        'Routes hot leads to human agent',
        'Logs full conversation in CRM',
      ],
      result: 'More conversations → more deals',
    },
  ];

  return (
    <section ref={sectionRef} className="bg-[#FDFCFB] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-gray-900 mb-6">
            Real-World Workflows
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Not theoretical — these are actual business processes automated end-to-end
          </p>
        </div>

        <div className="space-y-16">
          {workflows.map((workflow, workflowIndex) => (
            <div
              key={workflowIndex}
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${workflowIndex * 150}ms` }}
            >
              {/* Workflow Title & User Query */}
              <div className="mb-8">
                <h3 className="font-serif text-3xl text-gray-900 mb-3">
                  {workflow.title}
                </h3>
                <div className="inline-block bg-white border border-gray-200 px-6 py-3">
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-900">User:</span> {workflow.userQuery}
                  </p>
                </div>
              </div>

              {/* Flowchart */}
              <div className="relative">
                {/* Desktop: Horizontal Flow */}
                <div className="hidden md:block">
                  <div className="flex items-center gap-4">
                    {workflow.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center flex-1">
                        {/* Step Card */}
                        <div className="bg-white border border-gray-200 p-6 flex-1 hover:border-[#F59E0B] transition-colors duration-300">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-[#F59E0B] text-white flex items-center justify-center text-sm font-medium">
                              {stepIndex + 1}
                            </div>
                            <div className="text-xs uppercase tracking-widest text-gray-500">
                              Step {stepIndex + 1}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
                        </div>

                        {/* Arrow */}
                        {stepIndex < workflow.steps.length - 1 && (
                          <ArrowRight className="w-6 h-6 text-[#F59E0B] mx-2 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile: Vertical Flow */}
                <div className="md:hidden space-y-4">
                  {workflow.steps.map((step, stepIndex) => (
                    <div key={stepIndex}>
                      <div className="bg-white border border-gray-200 p-6 hover:border-[#F59E0B] transition-colors duration-300">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-[#F59E0B] text-white flex items-center justify-center text-sm font-medium">
                            {stepIndex + 1}
                          </div>
                          <div className="text-xs uppercase tracking-widest text-gray-500">
                            Step {stepIndex + 1}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
                      </div>
                      {stepIndex < workflow.steps.length - 1 && (
                        <div className="flex justify-center py-2">
                          <ArrowRight className="w-6 h-6 text-[#F59E0B] rotate-90" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Result */}
              <div className="mt-8 flex items-start gap-3 bg-[#FFFBEB] border border-[#F59E0B] p-6">
                <CheckCircle className="w-6 h-6 text-[#F59E0B] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Result</p>
                  <p className="text-gray-900 font-medium text-lg">{workflow.result}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
