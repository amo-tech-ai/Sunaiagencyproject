// C100-SNAPSHOT-HISTORY — Historical snapshot comparison for AI insights
// Stores snapshots in localStorage. Shows before/after bars for readiness dimensions.
// Mobile-first: stacked layout, responsive padding, 44px touch targets.

import type { ReadinessDimension } from '../../../lib/hooks/useDashboardData';
import { useState, useEffect } from 'react';
import { Camera, Trash2, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Snapshot {
  id: string;
  timestamp: string;
  overall: number;
  dimensions: ReadinessDimension[];
}

interface SnapshotHistoryProps {
  currentOverall: number;
  currentDimensions: ReadinessDimension[];
  sessionId: string;
}

const STORAGE_KEY = 'sun-ai-insights-snapshots';

function loadSnapshots(sessionId: string): Snapshot[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}:${sessionId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSnapshots(sessionId: string, snapshots: Snapshot[]) {
  localStorage.setItem(`${STORAGE_KEY}:${sessionId}`, JSON.stringify(snapshots));
}

function DeltaIndicator({ current, previous }: { current: number; previous: number }) {
  const diff = current - previous;
  if (diff === 0) return <Minus className="w-3 h-3 text-[#9CA39B]" />;
  if (diff > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[#00875A] text-xs font-mono">
        <TrendingUp className="w-3 h-3" />+{diff}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-[#DC2626] text-xs font-mono">
      <TrendingDown className="w-3 h-3" />{diff}
    </span>
  );
}

export default function SnapshotHistory({ currentOverall, currentDimensions, sessionId }: SnapshotHistoryProps) {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [compareId, setCompareId] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    setSnapshots(loadSnapshots(sessionId));
  }, [sessionId]);

  const handleSave = () => {
    const newSnapshot: Snapshot = {
      id: `snap-${Date.now()}`,
      timestamp: new Date().toISOString(),
      overall: currentOverall,
      dimensions: [...currentDimensions],
    };
    const updated = [newSnapshot, ...snapshots].slice(0, 10); // max 10
    setSnapshots(updated);
    saveSnapshots(sessionId, updated);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const handleDelete = (id: string) => {
    const updated = snapshots.filter(s => s.id !== id);
    setSnapshots(updated);
    saveSnapshots(sessionId, updated);
    if (compareId === id) setCompareId(null);
  };

  const compareSnapshot = snapshots.find(s => s.id === compareId) || null;

  return (
    <div className="bg-white rounded border border-[#E8E8E4] p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="font-[Georgia,serif] text-sm sm:text-base font-semibold text-[#1A1A1A]">
          Snapshot History
        </h3>
        <button
          onClick={handleSave}
          disabled={currentDimensions.length === 0}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded border border-[#E8E8E4] text-[#1A1A1A] hover:bg-[#F5F5F0] transition-colors min-h-[36px] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Camera className="w-3.5 h-3.5" />
          {justSaved ? 'Saved!' : 'Save Snapshot'}
        </button>
      </div>

      {/* Snapshot list */}
      {snapshots.length === 0 ? (
        <div className="text-center py-4">
          <Clock className="w-6 h-6 text-[#E8E8E4] mx-auto mb-2" />
          <p className="text-xs text-[#9CA39B]">No snapshots yet. Save one to track progress over time.</p>
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          {snapshots.slice(0, 5).map(snap => {
            const isComparing = compareId === snap.id;
            const date = new Date(snap.timestamp);
            const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
              ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={snap.id}
                className={`flex items-center gap-3 p-2.5 rounded border text-sm transition-colors ${
                  isComparing
                    ? 'border-[#00875A] bg-[#E6F4ED]/30'
                    : 'border-[#E8E8E4] hover:bg-[#F5F5F0]'
                }`}
              >
                <button
                  onClick={() => setCompareId(isComparing ? null : snap.id)}
                  className="flex-1 text-left min-h-[36px] flex items-center gap-2"
                  title={isComparing ? 'Stop comparing' : 'Compare with current'}
                >
                  <span className="text-xs text-[#6B6B63]">{label}</span>
                  <span className="text-xs font-mono font-medium text-[#1A1A1A]">{snap.overall}/100</span>
                  <DeltaIndicator current={currentOverall} previous={snap.overall} />
                </button>
                <button
                  onClick={() => handleDelete(snap.id)}
                  className="text-[#9CA39B] hover:text-[#DC2626] p-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors"
                  title="Delete snapshot"
                  aria-label={`Delete snapshot from ${label}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Comparison view */}
      <AnimatePresence>
        {compareSnapshot && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#E8E8E4] pt-4 mt-2">
              <div className="flex items-center gap-2 mb-3">
                <h4 className="text-xs font-medium text-[#6B6B63] uppercase tracking-wider">
                  Comparison vs. Snapshot
                </h4>
                <span className="text-[10px] text-[#9CA39B]">
                  ({new Date(compareSnapshot.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
                </span>
              </div>

              <div className="space-y-3">
                {currentDimensions.map(dim => {
                  const prev = compareSnapshot.dimensions.find(d => d.name === dim.name);
                  const prevScore = prev?.score || 0;
                  const currColor = dim.score >= 70 ? '#00875A' : dim.score >= 40 ? '#D97706' : '#DC2626';

                  return (
                    <div key={dim.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#1A1A1A]">{dim.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[#9CA39B] font-mono">{prevScore}</span>
                          <span className="text-[#9CA39B]">&rarr;</span>
                          <span className="font-mono font-medium" style={{ color: currColor }}>{dim.score}</span>
                          <DeltaIndicator current={dim.score} previous={prevScore} />
                        </div>
                      </div>
                      <div className="relative h-1.5 rounded-full bg-[#F5F5F0]">
                        {/* Previous (ghost) */}
                        <div
                          className="absolute top-0 left-0 h-full rounded-full bg-[#E8E8E4]"
                          style={{ width: `${Math.min(prevScore, 100)}%` }}
                        />
                        {/* Current */}
                        <div
                          className="absolute top-0 left-0 h-full rounded-full"
                          style={{ width: `${Math.min(dim.score, 100)}%`, backgroundColor: currColor }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
