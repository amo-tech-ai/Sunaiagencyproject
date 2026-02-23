interface ScopeCardProps {
  projectType?: string;
  timeline?: string;
  budgetRange?: string;
}

export default function ScopeCard({
  projectType = 'AI Platform Development',
  timeline = '8-12 Weeks',
  budgetRange = '$30,000 - $50,000',
}: ScopeCardProps) {
  return (
    <div className="bg-orange-50 border border-orange-200 p-8 md:p-12 min-h-[320px]">
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
            Project Type
          </p>
          <p className="text-xl">{projectType}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
            Timeline
          </p>
          <p className="text-lg">{timeline}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
            Budget Range
          </p>
          <p className="text-lg">{budgetRange}</p>
        </div>
      </div>
    </div>
  );
}
