// C14-BLOCK — Individual Lean Canvas block with items + Ask AI button
// Leaf component used by LeanCanvasPanel
// Shows expand/collapse for blocks with >3 items
// BCG design system: warm off-white, charcoal text, green accents

import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import type { CanvasBlockKey, CanvasBlockItem } from '../../../lib/types/strategy';
import { CANVAS_BLOCK_LABELS, CANVAS_BLOCK_DESCRIPTIONS } from '../../../lib/types/strategy';

interface CanvasBlockProps {
  blockKey: CanvasBlockKey;
  items: CanvasBlockItem[];
  onAskAI: (block: CanvasBlockKey) => void;
  isSynthesizing: boolean;
  onBlockTap?: (block: CanvasBlockKey) => void;
}

export default function CanvasBlock({
  blockKey, items, onAskAI, isSynthesizing, onBlockTap,
}: CanvasBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const label = CANVAS_BLOCK_LABELS[blockKey];
  const description = CANVAS_BLOCK_DESCRIPTIONS[blockKey];
  const hasItems = items.length > 0;
  const displayItems = expanded ? items : items.slice(0, 3);

  return (
    <div
      className={`bg-white rounded-lg border border-[#D4CFC8] p-3 flex flex-col h-full min-h-[120px] ${
        onBlockTap ? 'cursor-pointer active:bg-gray-50 transition-colors' : ''
      }`}
      onClick={onBlockTap ? () => onBlockTap(blockKey) : undefined}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wide leading-tight">{label}</h3>
        <div className="flex items-center gap-1">
          {hasItems && (
            <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{items.length}</span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onAskAI(blockKey); }}
            disabled={isSynthesizing}
            className="p-1 text-[#00875A] hover:bg-[#00875A]/10 rounded transition-colors disabled:opacity-50"
            title="Ask AI for suggestions"
          >
            {isSynthesizing
              ? <Loader2 className="w-3 h-3 animate-spin" />
              : <Sparkles className="w-3 h-3" />
            }
          </button>
        </div>
      </div>

      {hasItems ? (
        <div className="flex-1 space-y-1.5">
          {displayItems.map((item) => (
            <div key={item.id} className="flex items-start gap-1.5 text-xs text-[#3A3A3A]">
              <span className={`mt-1 w-1 h-1 rounded-full shrink-0 ${
                item.source === 'ai' ? 'bg-[#00875A]' : 'bg-gray-400'
              }`} />
              <span className="leading-relaxed">{item.text}</span>
            </div>
          ))}
          {items.length > 3 && (
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              className="flex items-center gap-1 text-[10px] text-[#00875A] hover:underline mt-1"
            >
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {expanded ? 'Show less' : `+${items.length - 3} more`}
            </button>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[10px] text-gray-400 text-center">{description}</p>
        </div>
      )}
    </div>
  );
}
