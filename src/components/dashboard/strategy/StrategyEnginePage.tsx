// C14-STRATEGY — Lean Strategy Engine Page (Phase 14)
// 3-column layout: Canvas (left), Roadmap (center), Intelligence (right)
// Mobile: tab navigation. Tablet: 2-col + roadmap below. Desktop: full layout.
// BCG design system: warm off-white, charcoal text, green accents

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { useStrategyData } from '../../../lib/hooks/useStrategyData';
import { useRealtimeCanvasSync } from '../../../lib/hooks/useRealtimeCanvasSync';
import {
  Brain, Sparkles, Plus, Wand2, Loader2,
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import type {
  CanvasBlockKey, CanvasBlockItem, StrategyAnalysisResponse,
} from '../../../lib/types/strategy';

// ── Extracted components ──
import StrategyHeader from './StrategyHeader';
import StrategyMetricsBar from './StrategyMetricsBar';
import LeanCanvasPanel from './LeanCanvasPanel';
import IntelligencePanel from './IntelligencePanel';
import { SuggestionsPanel, BlockEditorBottomSheet } from './CanvasBlockEditor';
import AnalysisProgressSheet from './AnalysisProgressSheet';
import RoadmapExecutionPanel from './RoadmapExecutionPanel';
import CanvasVersionHistory from './CanvasVersionHistory';

// ── Mobile Tab Type ──
type MobileTab = 'canvas' | 'roadmap' | 'intelligence';

// ── Mobile Tab Bar ──
function MobileTabBar({ active, onChange, pendingCount }: {
  active: MobileTab; onChange: (tab: MobileTab) => void; pendingCount: number;
}) {
  const tabs: { key: MobileTab; label: string }[] = [
    { key: 'canvas', label: 'Canvas' },
    { key: 'roadmap', label: 'Roadmap' },
    { key: 'intelligence', label: 'Intel' },
  ];
  return (
    <div className="flex md:hidden bg-white border-b border-[#E8E8E4] sticky top-0 z-10 -mx-4 px-4 sm:-mx-6 sm:px-6">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
            active === key ? 'text-[#00875A] border-b-2 border-[#00875A]' : 'text-[#9CA39B]'
          }`}
        >
          <span className="inline-flex items-center justify-center gap-1">
            {label}
            {key === 'intelligence' && pendingCount > 0 && (
              <span className="w-5 h-5 bg-[#D97706] text-white text-xs rounded-full inline-flex items-center justify-center ml-1">
                {pendingCount}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}

// ── Empty State ──
function StrategyEmptyState({ onCreateFresh, onCreateFromWizard, hasWizardSession, isCreating }: {
  onCreateFresh: () => void; onCreateFromWizard: () => void; hasWizardSession: boolean; isCreating: boolean;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-lg text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-[#00875A]/10 flex items-center justify-center mx-auto mb-6">
          <Brain className="w-8 h-8 text-[#00875A]" />
        </div>
        <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-3">Lean Strategy Engine</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Map your business model on a Lean Canvas, then let AI analyze your strategy,
          detect automation opportunities, and generate actionable recommendations.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {hasWizardSession && (
            <button onClick={onCreateFromWizard} disabled={isCreating}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#00875A] text-white rounded-lg hover:bg-[#006644] transition-colors disabled:opacity-50 font-medium">
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />} Create from Wizard
            </button>
          )}
          <button onClick={onCreateFresh} disabled={isCreating}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-[#D4CFC8] text-[#1A1A1A] rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium">
            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Start Fresh Canvas
          </button>
        </div>
        {!hasWizardSession && (
          <p className="text-xs text-gray-400 mt-4">
            Tip: Complete the <a href="/wizard" className="text-[#00875A] underline">Project Brief Wizard</a> first for AI-seeded canvas blocks.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Loading Skeleton ──
function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => <div key={i} className="bg-white rounded-lg border border-[#D4CFC8] p-3 h-16" />)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[...Array(9)].map((_, i) => <div key={i} className="bg-white rounded-lg border border-[#D4CFC8] p-3 h-32" />)}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function StrategyEnginePage() {
  const { user, accessToken } = useAuth();
  const {
    data, loading, error, hasCanvas,
    createCanvas, updateBlocks, runAnalysis, synthesizeBlock,
    approveRecommendation, updateInsightStatus,
    isAnalyzing, isSynthesizing,
    refetch,
  } = useStrategyData(user?.id || null, accessToken);

  const [isCreating, setIsCreating] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    items: CanvasBlockItem[]; rationale: string; block: CanvasBlockKey;
  } | null>(null);
  const [wizardSessionId, setWizardSessionId] = useState<string | null>(null);
  const hasWizardSession = !!wizardSessionId;

  // Analysis progress sheet state
  const [showAnalysisSheet, setShowAnalysisSheet] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<StrategyAnalysisResponse | null>(null);

  // Version history state
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  // Mobile tab state
  const [mobileTab, setMobileTab] = useState<MobileTab>('canvas');

  // Mobile block editor bottom sheet state
  const [mobileBlockOpen, setMobileBlockOpen] = useState<CanvasBlockKey | null>(null);

  // ── Realtime: live collaborative canvas sync ──
  const canvasId = hasCanvas && data?.canvas ? data.canvas.id : null;
  const {
    isLive: isCanvasLive,
    markLocalWrite: markCanvasWrite,
    reconnect: reconnectCanvas,
    status: canvasRealtimeStatus,
  } = useRealtimeCanvasSync({
    canvasId,
    onCanvasEvent: useCallback(() => {
      refetch();
    }, [refetch]),
  });

  // Detect wizard session on mount
  useEffect(() => {
    if (!user?.id || !accessToken) return;
    (async () => {
      try {
        const { wizardApi } = await import('../../../lib/supabase');
        const res = await wizardApi.list(user.id, 'use-fresh-token');
        if (res.data?.sessions?.length) {
          const completed = res.data.sessions.find((s: any) => s.status === 'completed') || res.data.sessions[0];
          setWizardSessionId(completed.id);
        }
      } catch { /* ignore */ }
    })();
  }, [user?.id, accessToken]);

  // ── Create canvas handlers ──
  const handleCreateFresh = useCallback(async () => {
    setIsCreating(true);
    await createCanvas();
    setIsCreating(false);
  }, [createCanvas]);

  const handleCreateFromWizard = useCallback(async () => {
    if (!wizardSessionId) return;
    setIsCreating(true);
    await createCanvas(wizardSessionId);
    setIsCreating(false);
  }, [createCanvas, wizardSessionId]);

  // ── Run Analysis with progress sheet ──
  const handleRunAnalysis = useCallback(async () => {
    setAnalysisResult(null);
    setShowAnalysisSheet(true);
    const result = await runAnalysis();
    setAnalysisResult(result);
  }, [runAnalysis]);

  // ── Ask AI handler ──
  const handleAskAI = useCallback(async (block: CanvasBlockKey) => {
    const result = await synthesizeBlock(block);
    if (result?.suggestions?.length) {
      setSuggestions({ items: result.suggestions, rationale: result.rationale, block });
    }
  }, [synthesizeBlock]);

  // ── Accept AI suggestions ──
  const handleAcceptSuggestions = useCallback(async (items: CanvasBlockItem[]) => {
    if (!suggestions || !data?.canvas) return;
    markCanvasWrite();
    const currentItems = (data.canvas[suggestions.block] as CanvasBlockItem[]) || [];
    const merged = [...currentItems, ...items];
    await updateBlocks(
      { [suggestions.block]: merged } as any,
      `Added ${items.length} AI suggestions to ${suggestions.block}`
    );
    setSuggestions(null);
  }, [suggestions, data?.canvas, updateBlocks, markCanvasWrite]);

  // ── Revert handler ──
  const handleRevert = useCallback(async (blocks: Record<string, unknown>, summary: string) => {
    markCanvasWrite();
    return await updateBlocks(blocks as any, summary);
  }, [updateBlocks, markCanvasWrite]);

  // ── Loading state ──
  if (loading) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-6 h-6 text-[#00875A]" />
          <h1 className="text-xl font-semibold text-[#1A1A1A]">Strategy Engine</h1>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  // ── Error state ──
  if (error && !data) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-6 h-6 text-[#00875A]" />
          <h1 className="text-xl font-semibold text-[#1A1A1A]">Strategy Engine</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          <p className="font-medium">Error loading strategy data</p>
          <p className="mt-1 text-xs">{error}</p>
          <button onClick={refetch} className="mt-3 px-3 py-1.5 bg-red-100 rounded text-xs hover:bg-red-200 transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Empty state ──
  if (!hasCanvas) {
    return (
      <StrategyEmptyState
        onCreateFresh={handleCreateFresh}
        onCreateFromWizard={handleCreateFromWizard}
        hasWizardSession={hasWizardSession}
        isCreating={isCreating}
      />
    );
  }

  // ── Full dashboard ──
  const canvas = data!.canvas!;
  const metrics = data!.metrics;
  const insights = data!.insights.filter((i) => i.status !== 'dismissed');
  const pendingRecs = data!.recommendations.filter((r) => r.approval_status === 'pending');
  const resolvedRecs = data!.recommendations.filter((r) => r.approval_status !== 'pending').slice(0, 5);
  const opportunities = data!.opportunities;
  const roadmapPhases = (canvas.metadata as any)?.phases || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <StrategyHeader
        canvas={canvas}
        metrics={metrics}
        isAnalyzing={isAnalyzing}
        isCanvasLive={isCanvasLive}
        canvasRealtimeStatus={canvasRealtimeStatus}
        onRunAnalysis={handleRunAnalysis}
        onRefresh={refetch}
        onShowHistory={() => setShowVersionHistory(true)}
        onReconnect={reconnectCanvas}
      />

      {/* Error banner */}
      {error && <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">{error}</div>}

      {/* Metrics Bar */}
      <StrategyMetricsBar metrics={metrics} />

      {/* Mobile Tab Bar */}
      <MobileTabBar active={mobileTab} onChange={setMobileTab} pendingCount={pendingRecs.length} />

      {/* ═══ Desktop Layout (md+): Canvas + Roadmap + Intelligence ═══ */}
      <div className="hidden md:grid md:grid-cols-[3fr_2fr] xl:grid-cols-[1fr_280px_340px] gap-6">
        {/* Left: Canvas Grid */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-[#1A1A1A]">Lean Canvas</h2>
            <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
              {metrics.canvasCompleteness}% complete
            </span>
          </div>
          <LeanCanvasPanel canvas={canvas} onAskAI={handleAskAI} isSynthesizing={isSynthesizing} />
        </div>

        {/* Center: Roadmap (xl only) */}
        <div className="hidden xl:block">
          <RoadmapExecutionPanel phases={roadmapPhases} />
        </div>

        {/* Right: Intelligence Panel */}
        <IntelligencePanel
          insights={insights}
          pendingRecs={pendingRecs}
          resolvedRecs={resolvedRecs}
          opportunities={opportunities}
          approveRecommendation={approveRecommendation}
          updateInsightStatus={updateInsightStatus}
        />
      </div>

      {/* Tablet: Roadmap below (md-xl only, when not 3-col) */}
      <div className="hidden md:block xl:hidden">
        <RoadmapExecutionPanel phases={roadmapPhases} className="mt-2" />
      </div>

      {/* ═══ Mobile Layout (<md): Tab content ═══ */}
      <div className="md:hidden">
        {mobileTab === 'canvas' && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-semibold text-[#1A1A1A]">Lean Canvas</h2>
              <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                {metrics.canvasCompleteness}% complete
              </span>
            </div>
            <LeanCanvasPanel
              canvas={canvas}
              onAskAI={handleAskAI}
              isSynthesizing={isSynthesizing}
              onBlockTap={setMobileBlockOpen}
            />
          </div>
        )}
        {mobileTab === 'roadmap' && (
          <RoadmapExecutionPanel phases={roadmapPhases} />
        )}
        {mobileTab === 'intelligence' && (
          <IntelligencePanel
            insights={insights}
            pendingRecs={pendingRecs}
            resolvedRecs={resolvedRecs}
            opportunities={opportunities}
            approveRecommendation={approveRecommendation}
            updateInsightStatus={updateInsightStatus}
          />
        )}
      </div>

      {/* ═══ Overlays ═══ */}

      {/* Analysis Progress Sheet */}
      <AnalysisProgressSheet
        open={showAnalysisSheet}
        onClose={() => setShowAnalysisSheet(false)}
        onComplete={refetch}
        result={analysisResult}
        isRunning={isAnalyzing}
      />

      {/* Version History Side Sheet */}
      <CanvasVersionHistory
        open={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        canvasId={canvas.id}
        currentVersion={canvas.version}
        accessToken={accessToken}
        onRevert={handleRevert}
      />

      {/* AI Suggestions Panel (floating) */}
      <AnimatePresence>
        {suggestions && (
          <SuggestionsPanel
            suggestions={suggestions.items}
            rationale={suggestions.rationale}
            blockKey={suggestions.block}
            onAccept={handleAcceptSuggestions}
            onDismiss={() => setSuggestions(null)}
            onClose={() => setSuggestions(null)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Block Editor Bottom Sheet */}
      <AnimatePresence>
        {mobileBlockOpen && (
          <BlockEditorBottomSheet
            blockKey={mobileBlockOpen}
            items={(canvas[mobileBlockOpen] as CanvasBlockItem[]) || []}
            onAskAI={handleAskAI}
            isSynthesizing={isSynthesizing}
            onClose={() => setMobileBlockOpen(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
