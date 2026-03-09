// C14-CANVAS — Lean Canvas 3×3 grid layout
// Renders 9 canvas blocks in the standard Lean Canvas arrangement
// Mobile: single column. Tablet+: 3-column grid.
// BCG design system: warm off-white, charcoal text, green accents

import type { LeanCanvas, CanvasBlockKey, CanvasBlockItem } from '../../../lib/types/strategy';
import CanvasBlock from './CanvasBlock';

// Standard Lean Canvas block order (3×3 grid)
const BLOCK_KEYS: CanvasBlockKey[] = [
  'problem', 'solution', 'key_metrics',
  'value_proposition', 'unfair_advantage', 'channels',
  'customer_segments', 'cost_structure', 'revenue_streams',
];

interface LeanCanvasPanelProps {
  canvas: LeanCanvas;
  onAskAI: (block: CanvasBlockKey) => void;
  isSynthesizing: boolean;
  onBlockTap?: (block: CanvasBlockKey) => void;
}

export default function LeanCanvasPanel({
  canvas, onAskAI, isSynthesizing, onBlockTap,
}: LeanCanvasPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {BLOCK_KEYS.map((key) => (
        <CanvasBlock
          key={key}
          blockKey={key}
          items={(canvas?.[key] as CanvasBlockItem[]) || []}
          onAskAI={onAskAI}
          isSynthesizing={isSynthesizing}
          onBlockTap={onBlockTap}
        />
      ))}
    </div>
  );
}
