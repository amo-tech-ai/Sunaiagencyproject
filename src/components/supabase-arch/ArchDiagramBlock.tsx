// C80-ARCH-BLOCK — Reusable Architecture Diagram Block
import { type ReactNode } from 'react';

interface BlockProps {
  label: string;
  sublabel?: string;
  color?: 'green' | 'charcoal' | 'muted' | 'white' | 'amber' | 'blue';
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  small?: boolean;
}

const colorMap = {
  green: 'bg-[#00875A]/8 border-[#00875A]/30 text-[#00875A]',
  charcoal: 'bg-[#1A1A1A] border-[#1A1A1A] text-white',
  muted: 'bg-[#F0F0EC] border-[#E8E8E4] text-[#1A1A1A]',
  white: 'bg-white border-[#E8E8E4] text-[#1A1A1A]',
  amber: 'bg-amber-50 border-amber-200 text-amber-800',
  blue: 'bg-blue-50 border-blue-200 text-blue-800',
};

export function ArchBlock({ label, sublabel, color = 'white', icon, children, className = '', small }: BlockProps) {
  return (
    <div className={`border rounded-[4px] px-4 py-3 ${colorMap[color]} ${small ? 'text-xs' : 'text-sm'} ${className}`}>
      <div className="flex items-center gap-2 font-semibold">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{label}</span>
      </div>
      {sublabel && <p className="text-xs mt-1 opacity-70">{sublabel}</p>}
      {children}
    </div>
  );
}

interface ConnectorProps {
  direction?: 'down' | 'right' | 'both';
  label?: string;
}

export function Connector({ direction = 'down', label }: ConnectorProps) {
  if (direction === 'right') {
    return (
      <div className="flex items-center gap-1 px-2">
        <div className="w-8 h-px bg-[#E8E8E4]" />
        {label && <span className="text-[10px] text-[#999] whitespace-nowrap">{label}</span>}
        <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-[#E8E8E4]" />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center py-1">
      <div className="w-px h-6 bg-[#E8E8E4]" />
      {label && <span className="text-[10px] text-[#999] my-0.5">{label}</span>}
      <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-[#E8E8E4]" />
    </div>
  );
}

export function SectionTitle({ number, title, subtitle }: { number: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline gap-3 mb-1">
        <span className="text-xs font-mono text-[#00875A] tracking-wider uppercase">Section {number}</span>
      </div>
      <h2 className="text-2xl font-semibold text-[#1A1A1A]" style={{ fontFamily: 'Georgia, serif' }}>{title}</h2>
      {subtitle && <p className="text-sm text-[#666] mt-1">{subtitle}</p>}
    </div>
  );
}

export function DiagramContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-[#E8E8E4] rounded-[4px] p-6 overflow-x-auto ${className}`}>
      {children}
    </div>
  );
}
