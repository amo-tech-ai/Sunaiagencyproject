// C14-T22 — Canvas Version History Side Sheet
// Shows chronological version list with view snapshots and revert
// Right-side sheet on desktop, full-screen on mobile
// Data from strategyApi.getCanvasVersions()

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, RotateCcw, Clock, AlertTriangle } from 'lucide-react';
import { strategyApi } from '../../../lib/supabase';
import type { CanvasVersion, CanvasBlockKey, CanvasBlockItem } from '../../../lib/types/strategy';
import { CANVAS_BLOCK_LABELS } from '../../../lib/types/strategy';

interface CanvasVersionHistoryProps {
  open: boolean;
  onClose: () => void;
  canvasId: string;
  currentVersion: number;
  accessToken: string | null;
  onRevert: (snapshot: Record<string, unknown>, summary: string) => Promise<boolean>;
}

// ── Version Snapshot Viewer ──
function SnapshotViewer({
  version,
  onClose,
}: {
  version: CanvasVersion;
  onClose: () => void;
}) {
  const snapshot = version.snapshot || {};
  const blockKeys: CanvasBlockKey[] = [
    'problem', 'solution', 'key_metrics',
    'value_proposition', 'unfair_advantage', 'channels',
    'customer_segments', 'cost_structure', 'revenue_streams',
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#F5F5F0] rounded-xl shadow-xl max-w-[900px] w-full max-h-[85vh] overflow-y-auto p-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#1A1A1A]">
            Version {version.version} — {new Date(version.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
          </h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {blockKeys.map(key => {
            const items = (snapshot[key] as CanvasBlockItem[]) || [];
            return (
              <div key={key} className="bg-white rounded-lg border border-[#D4CFC8] p-3 min-h-[80px]">
                <h4 className="text-[10px] font-semibold text-[#9CA39B] uppercase tracking-wide mb-2">
                  {CANVAS_BLOCK_LABELS[key]}
                </h4>
                {items.length > 0 ? (
                  <div className="space-y-1">
                    {items.map((item: CanvasBlockItem, i: number) => (
                      <div key={item.id || i} className="flex items-start gap-1.5 text-xs text-[#3A3A3A]">
                        <span className={`mt-1 w-1 h-1 rounded-full shrink-0 ${item.source === 'ai' ? 'bg-[#00875A]' : 'bg-gray-400'}`} />
                        <span className="leading-relaxed">{item.text}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-gray-300 italic">Empty</p>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Revert Confirmation Dialog ──
function RevertDialog({
  version,
  onConfirm,
  onCancel,
  isReverting,
}: {
  version: CanvasVersion;
  onConfirm: () => void;
  onCancel: () => void;
  isReverting: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-[400px] w-full p-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="text-base font-semibold text-[#1A1A1A]">Revert to Version {version.version}?</h3>
        </div>
        <p className="text-sm text-[#4A4A4A] mb-4 leading-relaxed">
          This will create a new version with the contents from v{version.version}.
          Your current canvas won't be lost — it stays in the history.
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={onConfirm}
            disabled={isReverting}
            className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {isReverting ? 'Reverting...' : 'Revert'}
          </button>
          <button
            onClick={onCancel}
            disabled={isReverting}
            className="flex-1 py-2 border border-[#E8E8E4] text-[#4A4A4A] rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Component ──
export default function CanvasVersionHistory({
  open,
  onClose,
  canvasId,
  currentVersion,
  accessToken,
  onRevert,
}: CanvasVersionHistoryProps) {
  const [versions, setVersions] = useState<CanvasVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewingVersion, setViewingVersion] = useState<CanvasVersion | null>(null);
  const [revertingVersion, setRevertingVersion] = useState<CanvasVersion | null>(null);
  const [isReverting, setIsReverting] = useState(false);

  const token = accessToken ? 'use-fresh-token' : undefined;

  // Load versions when opened
  useEffect(() => {
    if (!open || !canvasId) return;
    setLoading(true);
    strategyApi.getCanvasVersions(canvasId, token)
      .then(res => {
        setVersions(res.data?.versions || []);
      })
      .catch(err => console.error('[VersionHistory] Load error:', err))
      .finally(() => setLoading(false));
  }, [open, canvasId, token]);

  const handleRevert = useCallback(async () => {
    if (!revertingVersion) return;
    setIsReverting(true);
    const snapshot = revertingVersion.snapshot || {};

    // Extract block data from snapshot
    const blockKeys = [
      'problem', 'customer_segments', 'value_proposition', 'solution',
      'channels', 'revenue_streams', 'cost_structure', 'key_metrics', 'unfair_advantage',
    ];
    const blocks: Record<string, unknown> = {};
    for (const key of blockKeys) {
      if (snapshot[key]) blocks[key] = snapshot[key];
    }

    const success = await onRevert(blocks, `Reverted to version ${revertingVersion.version}`);
    setIsReverting(false);
    setRevertingVersion(null);
    if (success) {
      // Reload versions
      const res = await strategyApi.getCanvasVersions(canvasId, token);
      setVersions(res.data?.versions || []);
    }
  }, [revertingVersion, onRevert, canvasId, token]);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={onClose}
          />

          {/* Side sheet — full screen on mobile, right side-sheet on sm+ */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 sm:inset-auto sm:top-0 sm:right-0 sm:h-full sm:w-[400px] bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#E8E8E4] shrink-0">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#9CA39B]" />
                <h3 className="text-sm font-semibold text-[#1A1A1A]">Version History</h3>
              </div>
              <button onClick={onClose} className="p-1 text-[#9CA39B] hover:text-[#1A1A1A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4 h-24 animate-pulse" />
                  ))}
                </div>
              ) : versions.length === 0 ? (
                <div className="text-center py-10">
                  <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-[#9CA39B]">No version history yet</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-[7px] top-3 bottom-3 border-l-2 border-[#E8E8E4]" />

                  <div className="space-y-3">
                    {versions.map((version, idx) => {
                      const isCurrent = version.version === currentVersion;
                      return (
                        <div key={version.id} className="relative pl-7">
                          {/* Timeline dot */}
                          <div className={`absolute left-0 top-4 w-3.5 h-3.5 rounded-full border-2 ${
                            isCurrent ? 'bg-[#00875A] border-[#00875A]' : 'bg-white border-[#E8E8E4]'
                          }`} />

                          <div className={`bg-white border rounded-lg p-3 ${
                            isCurrent ? 'border-l-4 border-l-[#00875A] border-[#E8E8E4]' : 'border-[#E8E8E4]'
                          }`}>
                            {/* Version header */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-[#1A1A1A]">
                                  v{version.version}
                                </span>
                                {isCurrent && (
                                  <span className="text-[10px] bg-[#00875A]/10 text-[#00875A] rounded-full px-2 py-0.5">
                                    current
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-[#9CA39B]">
                                {new Date(version.created_at).toLocaleDateString('en-US', {
                                  month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                                })}
                              </span>
                            </div>

                            {/* Changed by */}
                            <p className="text-[10px] text-[#9CA39B] mt-1">
                              Changed by: {version.changed_by === 'system' ? 'System (wizard seed)' :
                                version.changed_by === 'user' ? 'User' : version.changed_by || 'Unknown'}
                            </p>

                            {/* Change summary */}
                            {version.change_summary && (
                              <p className="text-xs text-[#4A4A4A] mt-1.5 leading-relaxed">
                                {version.change_summary}
                              </p>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-3 mt-2.5">
                              <button
                                onClick={() => setViewingVersion(version)}
                                className="flex items-center gap-1 text-xs text-blue-500 hover:underline"
                              >
                                <Eye className="w-3 h-3" /> View
                              </button>
                              {!isCurrent && (
                                <button
                                  onClick={() => setRevertingVersion(version)}
                                  className="flex items-center gap-1 text-xs text-red-600 hover:underline"
                                >
                                  <RotateCcw className="w-3 h-3" /> Revert
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Snapshot viewer */}
          <AnimatePresence>
            {viewingVersion && (
              <SnapshotViewer
                version={viewingVersion}
                onClose={() => setViewingVersion(null)}
              />
            )}
          </AnimatePresence>

          {/* Revert confirmation */}
          <AnimatePresence>
            {revertingVersion && (
              <RevertDialog
                version={revertingVersion}
                onConfirm={handleRevert}
                onCancel={() => setRevertingVersion(null)}
                isReverting={isReverting}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}