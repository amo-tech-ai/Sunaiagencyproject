// C-P02 — Process Phase Card (Expandable)
// BCG design system: white card, charcoal text, Georgia serif, green accent border, 4px radius

import { motion, AnimatePresence } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface PhaseCardProps {
  number: string;
  name: string;
  duration: string;
  icon: LucideIcon;
  description: string;
  deliverables: string[];
  clientActions: string[];
  isExpanded: boolean;
  onToggle: () => void;
}

export default function PhaseCard({
  number,
  name,
  duration,
  icon: Icon,
  description,
  deliverables,
  clientActions,
  isExpanded,
  onToggle,
}: PhaseCardProps) {
  return (
    <div
      className="border transition-colors"
      style={{
        borderColor: '#E8E8E4',
        backgroundColor: '#FFFFFF',
        borderRadius: '4px',
        borderLeftWidth: isExpanded ? '3px' : '1px',
        borderLeftColor: isExpanded ? '#00875A' : '#E8E8E4',
      }}
    >
      {/* Header - Always Visible */}
      <button
        onClick={onToggle}
        className="w-full p-8 flex items-start gap-6 text-left"
        aria-expanded={isExpanded}
      >
        {/* Icon */}
        <div
          className="w-14 h-14 border flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#F5F5F0', borderColor: '#E8E8E4', borderRadius: '4px' }}
        >
          <Icon className="w-7 h-7" style={{ color: '#1A1A1A' }} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl" style={{ fontFamily: 'Georgia, serif', color: '#00875A' }}>
              {number}
            </span>
            <span className="text-xl" style={{ color: '#1A1A1A' }}>{name}</span>
            <span
              className="ml-auto px-4 py-1.5 text-xs"
              style={{ backgroundColor: '#F5F5F0', color: '#6B6B63', borderRadius: '4px' }}
            >
              {duration}
            </span>
          </div>
          <p className="leading-relaxed" style={{ color: '#6B6B63' }}>{description}</p>
        </div>

        {/* Expand/Collapse Icon */}
        <div className="text-2xl flex-shrink-0 w-8 text-center" style={{ color: '#6B6B63' }}>
          {isExpanded ? '−' : '+'}
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="border-t p-8" style={{ backgroundColor: '#F5F5F0', borderColor: '#E8E8E4' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Deliverables */}
                <div>
                  <h4 className="text-xs tracking-widest uppercase mb-4" style={{ color: '#6B6B63', letterSpacing: '0.06em' }}>
                    Deliverables
                  </h4>
                  <ul className="space-y-3">
                    {deliverables.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 mt-2 flex-shrink-0" style={{ backgroundColor: '#00875A', borderRadius: '1px' }} />
                        <span style={{ color: '#1A1A1A' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Client Actions */}
                <div>
                  <h4 className="text-xs tracking-widest uppercase mb-4" style={{ color: '#6B6B63', letterSpacing: '0.06em' }}>
                    Your Role
                  </h4>
                  <ul className="space-y-3">
                    {clientActions.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 mt-2 flex-shrink-0" style={{ backgroundColor: '#00875A', borderRadius: '1px' }} />
                        <span style={{ color: '#1A1A1A' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
