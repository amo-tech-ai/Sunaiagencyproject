interface StepIndicatorProps {
  number: string;
  title: string;
  description: string;
  isActive: boolean;
}

export default function StepIndicator({
  number,
  title,
  description,
  isActive,
}: StepIndicatorProps) {
  return (
    <div
      className={`transition-opacity duration-300 ${
        isActive ? 'opacity-100' : 'opacity-40'
      }`}
    >
      <div className="flex items-start gap-4 mb-3">
        <div
          className={`w-2 h-2 mt-2 ${
            isActive ? 'bg-orange-500' : 'bg-gray-400'
          }`}
        />
        <div className="flex items-baseline gap-3">
          <span className="text-sm text-gray-500">{number}</span>
          <h3 className="text-2xl">{title}</h3>
        </div>
      </div>
      <p className="text-gray-600 ml-6 pl-3">{description}</p>
    </div>
  );
}
