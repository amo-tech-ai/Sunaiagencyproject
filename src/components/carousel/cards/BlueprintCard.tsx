import { Check, FileText } from 'lucide-react';

interface BlueprintCardProps {
  deliverables?: string[];
}

const DEFAULT_DELIVERABLES = [
  'System architecture diagram',
  'Database schema & API design',
  'Week-by-week timeline',
  'Tech stack recommendations',
  'Risk analysis & mitigation',
];

export default function BlueprintCard({
  deliverables = DEFAULT_DELIVERABLES,
}: BlueprintCardProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 p-8 md:p-12 min-h-[320px]">
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-4">
            Deliverables
          </p>
          <div className="space-y-3">
            {deliverables.map((deliverable, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{deliverable}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-4 border-t border-blue-300">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
            Included
          </p>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-600" />
            <p className="text-gray-700">Technical documentation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
