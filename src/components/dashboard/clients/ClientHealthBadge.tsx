// C108-CLIENT-HEALTH — Health score badge with color coding
// BCG design: green/amber/red based on score thresholds.

interface ClientHealthBadgeProps {
  score: number;
  size?: 'sm' | 'md';
}

export default function ClientHealthBadge({ score, size = 'sm' }: ClientHealthBadgeProps) {
  const color = score >= 70 ? '#00875A' : score >= 40 ? '#D97706' : '#DC2626';
  const bg = score >= 70 ? 'bg-[#E6F4ED]' : score >= 40 ? 'bg-[#FEF3CD]' : 'bg-[#FEF2F2]';
  const label = score >= 70 ? 'Healthy' : score >= 40 ? 'At Risk' : 'Critical';

  const sizeClasses = size === 'md' ? 'text-sm px-3 py-1' : 'text-[10px] px-2 py-0.5';

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full ${bg} ${sizeClasses}`}
      style={{ color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label} ({score})
    </span>
  );
}
