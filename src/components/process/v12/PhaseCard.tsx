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
      className={`border border-[#EFE9E4] bg-white hover:border-[#D1C7BD] transition-colors ${
        isExpanded ? 'border-l-4 border-l-[#84CC16]' : ''
      }`}
    >
      {/* Header - Always Visible */}
      <button
        onClick={onToggle}
        className="w-full p-8 flex items-start gap-6 text-left"
        aria-expanded={isExpanded}
      >
        {/* Icon */}
        <div className="w-14 h-14 bg-[#FAF8F6] border border-[#EFE9E4] flex items-center justify-center flex-shrink-0">
          <Icon className="w-7 h-7 text-[#1A1A1A]" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span
              className="text-3xl font-bold text-[#84CC16]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {number}
            </span>
            <span className="text-2xl font-semibold text-[#1A1A1A] font-['Lora']">{name}</span>
            <span className="ml-auto bg-[#FAF8F6] text-gray-600 px-4 py-1.5 text-sm font-['Lora']">
              {duration}
            </span>
          </div>
          <p className="text-gray-600 leading-relaxed font-['Lora']">{description}</p>
        </div>

        {/* Expand/Collapse Icon */}
        <div className="text-2xl text-[#999999] flex-shrink-0 w-8 text-center">
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
            <div className="bg-[#FDFCFB] border-t border-[#EFE9E4] p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Deliverables */}
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#999999] mb-4 font-['Lora']">
                    Deliverables
                  </h4>
                  <ul className="space-y-3">
                    {deliverables.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-[#84CC16] mt-2 flex-shrink-0" />
                        <span className="text-[#1A1A1A] font-['Lora']">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Client Actions */}
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#999999] mb-4 font-['Lora']">
                    Your Role
                  </h4>
                  <ul className="space-y-3">
                    {clientActions.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-[#84CC16] mt-2 flex-shrink-0" />
                        <span className="text-[#1A1A1A] font-['Lora']">{item}</span>
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