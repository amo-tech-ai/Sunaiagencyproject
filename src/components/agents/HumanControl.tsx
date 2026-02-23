import { Shield, Eye, FileText, Lock } from 'lucide-react';

export default function HumanControl() {
  const controls = [
    {
      icon: Shield,
      title: 'Approval Gates',
      description: 'Critical decisions require human approval before execution',
    },
    {
      icon: Lock,
      title: 'Override Rules',
      description: 'Set boundaries and limits for autonomous agent actions',
    },
    {
      icon: FileText,
      title: 'Audit Logs',
      description: 'Complete history of every agent action and decision',
    },
    {
      icon: Eye,
      title: 'Manual Checkpoints',
      description: 'Review and approve workflows at custom intervals',
    },
  ];

  return (
    <section className="bg-[#FDFCFB] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-gray-900 mb-6">
            Humans Stay in Control
          </h2>
          <blockquote className="text-xl text-gray-600 italic max-w-2xl mx-auto border-l-2 border-[#F59E0B] pl-6">
            AI executes fast. Humans decide when it matters.
          </blockquote>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {controls.map((control, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 p-8 text-center hover:border-[#F59E0B] transition-colors duration-200"
            >
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-gray-200">
                <control.icon className="w-8 h-8 text-[#F59E0B]" />
              </div>
              <h3 className="font-medium text-gray-900 mb-3 text-lg">
                {control.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {control.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto bg-white border border-[#F59E0B] p-8">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-[#F59E0B] flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-medium text-gray-900 mb-2 text-lg">
                Enterprise-Grade Safety
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Every agent system includes approval workflows, audit trails, and human oversight. 
                You define the boundaries. AI operates within them. No black-box automation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
