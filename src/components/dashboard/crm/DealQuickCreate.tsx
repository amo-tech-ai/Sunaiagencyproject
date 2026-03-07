// C07-DEAL-CREATE — Dialog modal for creating a new deal
// Fields: title, value, probability, stage, expected close date, notes

import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Stage, DealCreateInput } from '../../../lib/types/crm-pipeline';

interface DealQuickCreateProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DealCreateInput) => Promise<void>;
  pipelineId: string;
  stages: Stage[];
}

export default function DealQuickCreate({
  open,
  onClose,
  onSubmit,
  pipelineId,
  stages,
}: DealQuickCreateProps) {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [probability, setProbability] = useState('30');
  const [stageId, setStageId] = useState(stages[0]?.id || '');
  const [expectedClose, setExpectedClose] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !stageId) return;

    setSubmitting(true);
    try {
      await onSubmit({
        pipeline_id: pipelineId,
        stage_id: stageId,
        title: title.trim(),
        value: parseFloat(value) || 0,
        probability: parseInt(probability) || 0,
        expected_close_date: expectedClose || undefined,
        notes: notes.trim() || undefined,
      });
      // Reset form
      setTitle('');
      setValue('');
      setProbability('30');
      setStageId(stages[0]?.id || '');
      setExpectedClose('');
      setNotes('');
      onClose();
    } catch (err) {
      console.error('[DealCreate] Error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Update stage default when stages change
  if (stages.length > 0 && !stages.find(s => s.id === stageId)) {
    setStageId(stages[0].id);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          >
            <div className="bg-white rounded-xl border border-[#E8E8E4] shadow-2xl w-full max-w-md">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#E8E8E4]">
                <h2 className="text-base font-semibold text-[#1A1A1A]">Add Deal</h2>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-[#F5F5F0] rounded transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-[#6B6B63]" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4 space-y-3">
                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-[#6B6B63] mb-1">Deal Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Acme Corp — AI Scheduling"
                    required
                    className="w-full text-sm border border-[#E8E8E4] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00875A] text-[#1A1A1A] placeholder:text-[#9CA39B]"
                  />
                </div>

                {/* Value + Probability */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#6B6B63] mb-1">Value ($)</label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="15000"
                      min="0"
                      step="100"
                      className="w-full text-sm border border-[#E8E8E4] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00875A] text-[#1A1A1A] placeholder:text-[#9CA39B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6B6B63] mb-1">Probability (%)</label>
                    <input
                      type="number"
                      value={probability}
                      onChange={(e) => setProbability(e.target.value)}
                      min="0"
                      max="100"
                      className="w-full text-sm border border-[#E8E8E4] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00875A] text-[#1A1A1A]"
                    />
                  </div>
                </div>

                {/* Stage */}
                <div>
                  <label className="block text-xs font-medium text-[#6B6B63] mb-1">Stage</label>
                  <select
                    value={stageId}
                    onChange={(e) => setStageId(e.target.value)}
                    className="w-full text-sm border border-[#E8E8E4] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00875A] text-[#1A1A1A] bg-white"
                  >
                    {stages.map(stage => (
                      <option key={stage.id} value={stage.id}>{stage.name}</option>
                    ))}
                  </select>
                </div>

                {/* Expected Close */}
                <div>
                  <label className="block text-xs font-medium text-[#6B6B63] mb-1">Expected Close</label>
                  <input
                    type="date"
                    value={expectedClose}
                    onChange={(e) => setExpectedClose(e.target.value)}
                    className="w-full text-sm border border-[#E8E8E4] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00875A] text-[#1A1A1A]"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-medium text-[#6B6B63] mb-1">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional context..."
                    rows={2}
                    className="w-full text-sm border border-[#E8E8E4] rounded px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-[#00875A] text-[#1A1A1A] placeholder:text-[#9CA39B]"
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 text-sm py-2 border border-[#E8E8E4] rounded text-[#6B6B63] hover:bg-[#F5F5F0] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!title.trim() || submitting}
                    className="flex-1 text-sm py-2 bg-[#00875A] text-white rounded font-medium hover:bg-[#006B48] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? 'Creating...' : 'Create Deal'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
