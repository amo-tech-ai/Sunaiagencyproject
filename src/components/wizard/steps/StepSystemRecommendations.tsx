// C32 — Step 3: System Recommendations
// AI system cards ranked by fit, toggleable selection
// Sort controls: Recommended / Impact / Effort
// Expandable "See details & trade-offs" accordion per card
// Validation error shown when attemptedAdvance + no systems selected

import { useMemo, useState } from 'react';
import { useWizard } from '../WizardContext';
import { WizardLayout } from '../WizardLayout';
import { AI_SYSTEMS, type AISystem } from '../data/wizardData';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronDown, ExternalLink } from 'lucide-react';
import { Link } from 'react-router';

type SortMode = 'recommended' | 'impact' | 'effort';

const IMPACT_ORDER: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
const EFFORT_ORDER: Record<string, number> = { Small: 0, Medium: 1, Large: 2 };
const INITIAL_VISIBLE_COUNT = 3;

export function StepSystemRecommendations() {
  const { state, updateStep3, attemptedAdvance, currentErrors } = useWizard();
  const selected = state.step3.selectedSystems;
  const [sortMode, setSortMode] = useState<SortMode>('recommended');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  // Default recommended ranking: signal-matching ones first
  const recommendedOrder = useMemo(() => {
    const signalIds = state.diagnosticSignals.map(s => s.id);
    return [...AI_SYSTEMS].sort((a, b) => {
      const aMatch = a.triggerSignals.filter(s => signalIds.includes(s)).length;
      const bMatch = b.triggerSignals.filter(s => signalIds.includes(s)).length;
      return bMatch - aMatch;
    });
  }, [state.diagnosticSignals]);

  // Sort based on current mode
  const sortedSystems = useMemo(() => {
    switch (sortMode) {
      case 'impact':
        return [...AI_SYSTEMS].sort((a, b) => IMPACT_ORDER[a.impact] - IMPACT_ORDER[b.impact]);
      case 'effort':
        return [...AI_SYSTEMS].sort((a, b) => EFFORT_ORDER[a.effort] - EFFORT_ORDER[b.effort]);
      default:
        return recommendedOrder;
    }
  }, [sortMode, recommendedOrder]);

  // Visible systems — show first N or all
  const visibleSystems = showAll ? sortedSystems : sortedSystems.slice(0, INITIAL_VISIBLE_COUNT);
  const hiddenCount = sortedSystems.length - INITIAL_VISIBLE_COUNT;

  const toggleSystem = (id: string) => {
    updateStep3(
      selected.includes(id)
        ? selected.filter(s => s !== id)
        : [...selected, id]
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedSystems = AI_SYSTEMS.filter(s => selected.includes(s.id));

  // Get the recommended rank of a system (for badge display)
  const getRecommendedRank = (systemId: string) =>
    recommendedOrder.findIndex(s => s.id === systemId) + 1;

  const rightPanel = (
    <div className="space-y-6" aria-live="polite" aria-atomic="false">
      <div>
        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
          Your Selection
        </p>

        {selected.length === 0 ? (
          <p className="text-sm" style={{ color: '#9CA39B' }}>
            Select systems to see your summary.
          </p>
        ) : (
          <div className="space-y-3">
            {selectedSystems.map(sys => (
              <div key={sys.id} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 shrink-0" style={{ color: '#00875A' }} />
                <span className="text-sm" style={{ color: '#1A1A1A' }}>{sys.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="border-t pt-4" style={{ borderColor: '#F0F0EC' }}>
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
            Combined Impact
          </p>
          <div className="space-y-2 text-sm" style={{ color: '#6B6B63' }}>
            <div className="flex justify-between">
              <span>Deploy time:</span>
              <span style={{ color: '#1A1A1A' }}>
                {selected.length <= 2 ? '2-4 weeks' : selected.length <= 4 ? '6-10 weeks' : '10-16 weeks'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Effort:</span>
              <span style={{ color: '#1A1A1A' }}>
                {selected.length <= 2 ? 'Focused' : selected.length <= 4 ? 'Comprehensive' : 'Full Transformation'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Systems:</span>
              <span style={{ color: '#00875A' }}>{selected.length} selected</span>
            </div>
          </div>
        </div>
      )}

      {selected.length >= 5 && (
        <div className="border-t pt-4" style={{ borderColor: '#F0F0EC' }}>
          <div className="px-3 py-2 rounded text-xs" style={{ backgroundColor: '#FEF9E7', borderRadius: '4px', color: '#D97706' }}>
            We recommend starting with 2-3 priorities and expanding after initial results.
          </div>
        </div>
      )}
    </div>
  );

  return (
    <WizardLayout rightPanel={rightPanel}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
            System Recommendations
          </p>
          <h1 className="text-2xl mb-2" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A', fontWeight: 400 }}>
            Our recommendations for your business
          </h1>
          <p className="text-sm" style={{ color: '#6B6B63' }}>
            Based on your industry, goals, and diagnostic results. Select the ones you'd like to pursue.
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2" role="tablist" aria-label="Sort system recommendations">
          <span className="text-xs" style={{ color: '#9CA39B' }}>Sort:</span>
          {([
            { key: 'recommended' as SortMode, label: 'Recommended' },
            { key: 'impact' as SortMode, label: 'Impact' },
            { key: 'effort' as SortMode, label: 'Effort' },
          ]).map(btn => {
            const active = sortMode === btn.key;
            return (
              <button
                key={btn.key}
                onClick={() => setSortMode(btn.key)}
                role="tab"
                aria-selected={active}
                className="px-3 py-1.5 text-xs rounded transition-all"
                style={{
                  backgroundColor: active ? '#1A1A1A' : '#FFFFFF',
                  color: active ? '#FFFFFF' : '#6B6B63',
                  border: `1px solid ${active ? '#1A1A1A' : '#E8E8E4'}`,
                  borderRadius: '4px',
                }}
              >
                {btn.label}
              </button>
            );
          })}
        </div>

        {/* System Cards */}
        <div className="space-y-4">
          {visibleSystems.map((system, idx) => {
            const recRank = getRecommendedRank(system.id);
            return (
              <SystemCard
                key={system.id}
                system={system}
                rank={recRank}
                isSelected={selected.includes(system.id)}
                onToggle={() => toggleSystem(system.id)}
                isRecommended={recRank <= 3}
                isExpanded={expandedCards.has(system.id)}
                onToggleExpand={() => toggleExpand(system.id)}
                delay={idx * 0.06}
              />
            );
          })}
        </div>

        {/* Show more / Show less toggle */}
        {hiddenCount > 0 && (
          <div className="border-t pt-4" style={{ borderColor: '#F0F0EC' }}>
            <button
              onClick={() => setShowAll(prev => !prev)}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm border rounded transition-colors hover:bg-gray-50"
              style={{ borderColor: '#E8E8E4', borderRadius: '4px', color: '#6B6B63' }}
            >
              <motion.div
                animate={{ rotate: showAll ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
              {showAll ? 'Show fewer systems' : `Show ${hiddenCount} more system${hiddenCount !== 1 ? 's' : ''}`}
            </button>
          </div>
        )}

        {/* Validation error message */}
        <AnimatePresence>
          {attemptedAdvance && currentErrors._global && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div
                className="flex items-center gap-2 px-4 py-3 rounded"
                style={{ backgroundColor: '#FEF2F2', borderRadius: '4px' }}
                role="alert"
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: '#DC2626' }} />
                <span className="text-sm" style={{ color: '#DC2626' }}>
                  {currentErrors._global}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </WizardLayout>
  );
}

/* ────── System Card ────── */

function SystemCard({ system, rank, isSelected, onToggle, isRecommended, isExpanded, onToggleExpand, delay }: {
  system: AISystem; rank: number; isSelected: boolean; onToggle: () => void;
  isRecommended: boolean; isExpanded: boolean; onToggleExpand: () => void; delay: number;
}) {
  const Icon = system.icon;

  const impactColor = system.impact === 'High' ? '#00875A' : system.impact === 'Medium' ? '#D97706' : '#6B6B63';
  const effortColor = system.effort === 'Small' ? '#00875A' : system.effort === 'Medium' ? '#D97706' : '#DC2626';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="border rounded overflow-hidden transition-all"
      style={{
        borderColor: isSelected ? '#00875A' : '#E8E8E4',
        borderWidth: isSelected ? '2px' : '1px',
        backgroundColor: '#FFFFFF',
        borderRadius: '4px',
      }}
    >
      {/* Main clickable area */}
      <div className="px-5 py-4 cursor-pointer" onClick={onToggle}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {isRecommended && (
              <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#E6F4ED', color: '#00875A', borderRadius: '2px' }}>
                #{rank} Recommended
              </span>
            )}
          </div>
          {/* Toggle */}
          <button
            className="w-10 h-6 rounded-full relative transition-colors shrink-0"
            style={{ backgroundColor: isSelected ? '#00875A' : '#E8E8E4' }}
            onClick={e => { e.stopPropagation(); onToggle(); }}
            aria-label={`${isSelected ? 'Deselect' : 'Select'} ${system.name}`}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
              animate={{ left: isSelected ? 18 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <Icon className="w-5 h-5" style={{ color: '#00875A' }} />
          <h3 className="text-base" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
            {system.name}
          </h3>
        </div>
        <p className="text-sm mb-3" style={{ color: '#6B6B63' }}>
          {system.description}
        </p>

        {/* Why it fits */}
        <div className="mb-3 px-3 py-2 rounded" style={{ backgroundColor: '#FAFAF8', borderRadius: '4px' }}>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
            Why this fits your business
          </p>
          <p className="text-sm" style={{ color: '#1A1A1A' }}>{system.whyItFits}</p>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-3 text-xs">
          <span className="px-2 py-1 rounded" style={{ backgroundColor: '#F5F5F0', borderRadius: '2px' }}>
            Impact: <span style={{ color: impactColor }}>{system.impact}</span>
          </span>
          <span className="px-2 py-1 rounded" style={{ backgroundColor: '#F5F5F0', borderRadius: '2px' }}>
            Effort: <span style={{ color: effortColor }}>{system.effort}</span>
          </span>
          <span className="px-2 py-1 rounded" style={{ backgroundColor: '#F5F5F0', borderRadius: '2px' }}>
            {system.timeline}
          </span>
        </div>
      </div>

      {/* "See details & trade-offs" trigger */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
        className="w-full flex items-center justify-between px-5 py-3 text-xs transition-colors hover:bg-gray-50"
        style={{
          borderTop: '1px solid #F0F0EC',
          color: '#6B6B63',
        }}
        aria-expanded={isExpanded}
      >
        <span>See details & trade-offs</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </button>

      {/* Expandable details accordion */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4" style={{ borderTop: '1px solid #F0F0EC' }}>
              {/* Detail description */}
              <div className="pt-4">
                <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
                  What this system does
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#1A1A1A' }}>
                  {system.detailDescription}
                </p>
              </div>

              {/* Trade-offs */}
              {system.tradeoffs.length > 0 && (
                <div>
                  <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#D97706', letterSpacing: '0.08em' }}>
                    Trade-offs to consider
                  </p>
                  <ul className="space-y-1.5">
                    {system.tradeoffs.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#6B6B63' }}>
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: '#D97706' }} />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related services */}
              {system.relatedServices.length > 0 && (
                <div>
                  <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
                    Related services
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {system.relatedServices.map(svc => (
                      <Link
                        key={svc.path}
                        to={svc.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded transition-colors hover:bg-gray-50"
                        style={{
                          borderColor: '#E8E8E4',
                          color: '#00875A',
                          borderRadius: '4px',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {svc.label}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom border accent when selected */}
      {isSelected && (
        <div className="h-0.5" style={{ backgroundColor: '#00875A' }} />
      )}
    </motion.div>
  );
}