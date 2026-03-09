// C14-EDITOR — Canvas Block Editor
// Two modes: SuggestionsPanel (floating desktop) + BlockEditorBottomSheet (mobile)
// Handles AI suggestion review, accept/dismiss, and block item viewing
// BCG design system: warm off-white, charcoal text, green accents

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles, CheckCircle2, XCircle, Loader2,
} from 'lucide-react';
import type { CanvasBlockKey, CanvasBlockItem } from '../../../lib/types/strategy';
import { CANVAS_BLOCK_LABELS, CANVAS_BLOCK_DESCRIPTIONS } from '../../../lib/types/strategy';

// ── AI Suggestions Panel (desktop floating card) ──

interface SuggestionsPanelProps {
  suggestions: CanvasBlockItem[];
  rationale: string;
  blockKey: CanvasBlockKey;
  onAccept: (items: CanvasBlockItem[]) => void;
  onDismiss: () => void;
  onClose: () => void;
}

export function SuggestionsPanel({
  suggestions, rationale, blockKey, onAccept, onDismiss, onClose,
}: SuggestionsPanelProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(suggestions.map((s) => s.id))
  );

  const toggleItem = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-x-4 bottom-4 sm:inset-auto sm:right-4 sm:bottom-4 sm:w-96 bg-white rounded-xl shadow-xl border border-[#D4CFC8] p-4 z-50"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00875A]" />
          <h3 className="text-sm font-semibold text-[#1A1A1A]">
            AI Suggestions for {CANVAS_BLOCK_LABELS[blockKey]}
          </h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xs">
          Close
        </button>
      </div>

      {rationale && (
        <p className="text-[11px] text-gray-500 mb-3 leading-relaxed">{rationale}</p>
      )}

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {suggestions.map((item) => (
          <label key={item.id} className="flex items-start gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
            <input
              type="checkbox"
              checked={selected.has(item.id)}
              onChange={() => toggleItem(item.id)}
              className="mt-0.5 accent-[#00875A]"
            />
            <div className="flex-1 min-w-0">
              <span className="text-xs text-[#1A1A1A]">{item.text}</span>
              {item.confidence != null && (
                <span className="block text-[10px] text-gray-400 mt-0.5">
                  {Math.round(item.confidence * 100)}% confidence
                </span>
              )}
            </div>
          </label>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={() => onAccept(suggestions.filter((s) => selected.has(s.id)))}
          disabled={selected.size === 0}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs bg-[#00875A] text-white rounded-lg hover:bg-[#006644] disabled:opacity-50 transition-colors"
        >
          <CheckCircle2 className="w-3 h-3" /> Accept {selected.size} item{selected.size !== 1 ? 's' : ''}
        </button>
        <button
          onClick={onDismiss}
          className="px-3 py-2 text-xs border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </motion.div>
  );
}

// ── Block Editor Bottom Sheet (mobile) ──

interface BlockEditorBottomSheetProps {
  blockKey: CanvasBlockKey;
  items: CanvasBlockItem[];
  onAskAI: (block: CanvasBlockKey) => void;
  isSynthesizing: boolean;
  onClose: () => void;
}

export function BlockEditorBottomSheet({
  blockKey, items, onAskAI, isSynthesizing, onClose,
}: BlockEditorBottomSheetProps) {
  const label = CANVAS_BLOCK_LABELS[blockKey];
  const description = CANVAS_BLOCK_DESCRIPTIONS[blockKey];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-xl z-50 max-h-[80vh] flex flex-col"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2 pb-1 shrink-0">
          <div className="w-10 h-1 bg-[#E8E8E4] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-[#E8E8E4] shrink-0">
          <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wide">{label}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAskAI(blockKey)}
              disabled={isSynthesizing}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs bg-[#00875A] text-white rounded-lg hover:bg-[#006644] transition-colors disabled:opacity-50"
            >
              {isSynthesizing
                ? <Loader2 className="w-3 h-3 animate-spin" />
                : <Sparkles className="w-3 h-3" />
              }
              AI
            </button>
            <button onClick={onClose} className="text-[#9CA39B] hover:text-[#1A1A1A] p-1">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length > 0 ? (
            <div className="space-y-2.5">
              {items.map((item) => (
                <div key={item.id} className="flex items-start gap-2 p-2.5 bg-[#F5F5F0] rounded-lg">
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                    item.source === 'ai' ? 'bg-[#00875A]' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-[#3A3A3A] leading-relaxed">{item.text}</span>
                    {item.source === 'ai' && (
                      <span className="block text-[10px] text-[#00875A] mt-0.5">AI suggestion</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400">{description}</p>
              <p className="text-xs text-[#9CA39B] mt-2">Tap the AI button to generate suggestions.</p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
