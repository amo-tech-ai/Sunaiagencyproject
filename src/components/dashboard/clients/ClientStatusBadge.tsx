// C109-CLIENT-STATUS — Client status badge
// BCG design: flat badges with thin borders.

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: 'text-[#00875A]', bg: 'bg-[#E6F4ED]' },
  prospect: { label: 'Prospect', color: 'text-[#0284C7]', bg: 'bg-[#E0F2FE]' },
  onboarding: { label: 'Onboarding', color: 'text-[#D97706]', bg: 'bg-[#FEF3CD]' },
  churned: { label: 'Churned', color: 'text-[#9CA39B]', bg: 'bg-[#F5F5F0]' },
};

export default function ClientStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.prospect;
  return (
    <span className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
      {config.label}
    </span>
  );
}
