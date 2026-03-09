// C14-STRATEGY — Lean Strategy Engine Page (Phase 14)
// 3-column layout: Canvas (left), Roadmap (center), Intelligence (right)
// Mobile: tab navigation. Tablet: 2-col + roadmap below. Desktop: full layout.
// BCG design system: warm off-white, charcoal text, green accents

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { useStrategyData } from '../../../lib/hooks/useStrategyData';
import {
  Brain, Sparkles, Plus, RefreshCw, Lightbulb, Zap, CheckCircle2,
  XCircle, AlertTriangle, TrendingUp, Clock, ChevronDown, ChevronUp,
  Wand2, Target, Activity, Shield, History,
  BarChart3, Bot, FileText, ThumbsUp, ThumbsDown, Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type {
  CanvasBlockKey, CanvasBlockItem, StrategyInsight,
  AutomationOpportunity, StrategyRecommendation, StrategyAnalysisResponse,
} from '../../../lib/types/strategy';
import { CANVAS_BLOCK_LABELS, CANVAS_BLOCK_DESCRIPTIONS } from '../../../lib/types/strategy';
import AnalysisProgressSheet from './AnalysisProgressSheet';
import RoadmapExecutionPanel from './RoadmapExecutionPanel';
import CanvasVersionHistory from './CanvasVersionHistory';

// ── Mobile Tab Type ──
type MobileTab = 'canvas' | 'roadmap' | 'intelligence';

// ── Metrics Bar ──
function MetricsBar({ metrics }: { metrics: any }) {
  const cards = [
    { label: 'Health Score', value: `${metrics.healthScore}%`, icon: Activity, color: metrics.healthScore >= 60 ? 'text-green-600' : metrics.healthScore >= 30 ? 'text-amber-500' : 'text-red-500' },
    { label: 'Canvas Complete', value: `${metrics.canvasCompleteness}%`, icon: Target, color: 'text-[#00875A]' },
    { label: 'Insights', value: String(metrics.insightCount), icon: Lightbulb, color: 'text-blue-600' },
    { label: 'Pending Approvals', value: String(metrics.pendingApprovals), icon: Clock, color: metrics.pendingApprovals > 0 ? 'text-amber-500' : 'text-gray-400' },
    { label: 'Opportunities', value: String(metrics.opportunitiesDetected), icon: Zap, color: 'text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-white rounded-lg border border-[#D4CFC8] p-3 flex items-center gap-3">
          <div className={`p-2 rounded-md bg-gray-50 ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-gray-500 leading-tight">{label}</div>
            <div className="text-lg font-semibold text-[#1A1A1A] leading-tight">{value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Canvas Block Component ──
function CanvasBlock({
  blockKey, items, onAskAI, isSynthesizing,
}: {
  blockKey: CanvasBlockKey;
  items: CanvasBlockItem[];
  onAskAI: (block: CanvasBlockKey) => void;
  isSynthesizing: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const label = CANVAS_BLOCK_LABELS[blockKey];
  const description = CANVAS_BLOCK_DESCRIPTIONS[blockKey];
  const hasItems = items.length > 0;
  const displayItems = expanded ? items : items.slice(0, 3);

  return (
    <div className="bg-white rounded-lg border border-[#D4CFC8] p-3 flex flex-col h-full min-h-[120px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wide leading-tight">{label}</h3>
        <div className="flex items-center gap-1">
          {hasItems && (
            <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{items.length}</span>
          )}
          <button
            onClick={() => onAskAI(blockKey)}
            disabled={isSynthesizing}
            className="p-1 text-[#00875A] hover:bg-[#00875A]/10 rounded transition-colors disabled:opacity-50"
            title="Ask AI for suggestions"
          >
            {isSynthesizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          </button>
        </div>
      </div>
      {hasItems ? (
        <div className="flex-1 space-y-1.5">
          {displayItems.map((item) => (
            <div key={item.id} className="flex items-start gap-1.5 text-xs text-[#3A3A3A]">
              <span className={`mt-1 w-1 h-1 rounded-full shrink-0 ${item.source === 'ai' ? 'bg-[#00875A]' : 'bg-gray-400'}`} />
              <span className="leading-relaxed">{item.text}</span>
            </div>
          ))}
          {items.length > 3 && (
            <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-[10px] text-[#00875A] hover:underline mt-1">
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

// ── Lean Canvas Grid (3x3) ──
function LeanCanvasGrid({ canvas, onAskAI, isSynthesizing }: {
  canvas: any;
  onAskAI: (block: CanvasBlockKey) => void;
  isSynthesizing: boolean;
}) {
  const blockKeys: CanvasBlockKey[] = [
    'problem', 'solution', 'key_metrics',
    'value_proposition', 'unfair_advantage', 'channels',
    'customer_segments', 'cost_structure', 'revenue_streams',
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {blockKeys.map((key) => (
        <CanvasBlock
          key={key}
          blockKey={key}
          items={(canvas?.[key] as CanvasBlockItem[]) || []}
          onAskAI={onAskAI}
          isSynthesizing={isSynthesizing}
        />
      ))}
    </div>
  );
}

// ── Insight Card ──
function InsightCard({ insight, onDismiss }: { insight: StrategyInsight; onDismiss: (id: string) => void }) {
  const priorityColors = { high: 'border-l-red-500 bg-red-50/30', medium: 'border-l-amber-500 bg-amber-50/30', low: 'border-l-blue-500 bg-blue-50/30' };
  const typeIcons = { opportunity: TrendingUp, risk: AlertTriangle, recommendation: Lightbulb, trend: BarChart3 };
  const Icon = typeIcons[insight.insight_type] || Lightbulb;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
      className={`border-l-2 rounded-r-lg p-3 ${priorityColors[insight.priority]}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <Icon className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <div className="text-xs font-medium text-[#1A1A1A] leading-tight">{insight.title}</div>
            <p className="text-[11px] text-gray-600 mt-1 leading-relaxed line-clamp-2">{insight.description}</p>
            {insight.confidence != null && (
              <span className="inline-block text-[10px] text-gray-400 mt-1">{Math.round(insight.confidence * 100)}% confidence</span>
            )}
          </div>
        </div>
        <button onClick={() => onDismiss(insight.id)} className="p-1 text-gray-400 hover:text-gray-600 shrink-0" title="Dismiss">
          <XCircle className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

// ── Recommendation Card ──
function RecommendationCard({ rec, onApprove, onReject }: {
  rec: StrategyRecommendation;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border border-[#D4CFC8] rounded-lg p-3">
      <div className="flex items-start gap-2">
        <Bot className="w-4 h-4 text-[#00875A] mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-[#1A1A1A]">{rec.title}</div>
          <p className="text-[11px] text-gray-600 mt-1 leading-relaxed line-clamp-2">{rec.rationale}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{rec.recommendation_type.replace('_', ' ')}</span>
            <span className="text-[10px] text-gray-400">by {rec.agent_name}</span>
          </div>
        </div>
      </div>
      {rec.approval_status === 'pending' && (
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
          <button onClick={() => onApprove(rec.id)} className="flex items-center gap-1 px-2.5 py-1 text-xs bg-[#00875A] text-white rounded hover:bg-[#006644] transition-colors">
            <ThumbsUp className="w-3 h-3" /> Approve
          </button>
          <button onClick={() => onReject(rec.id)} className="flex items-center gap-1 px-2.5 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors">
            <ThumbsDown className="w-3 h-3" /> Reject
          </button>
        </div>
      )}
      {rec.approval_status !== 'pending' && (
        <div className={`flex items-center gap-1 mt-2 text-[10px] ${rec.approval_status === 'approved' ? 'text-green-600' : 'text-red-500'}`}>
          {rec.approval_status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          {rec.approval_status}
        </div>
      )}
    </motion.div>
  );
}

// ── Opportunity Card ──
function OpportunityCard({ opp }: { opp: AutomationOpportunity }) {
  const complexityColors = { low: 'text-green-600 bg-green-50', medium: 'text-amber-600 bg-amber-50', high: 'text-red-600 bg-red-50' };
  return (
    <div className="bg-white border border-[#D4CFC8] rounded-lg p-3">
      <div className="flex items-start gap-2">
        <Zap className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-[#1A1A1A]">{opp.title}</div>
          <p className="text-[11px] text-gray-600 mt-1 leading-relaxed line-clamp-2">{opp.description}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-[10px] font-medium text-[#00875A]">Impact: {opp.impact_score}/100</span>
            {opp.roi_estimate && <span className="text-[10px] text-gray-500">ROI: {opp.roi_estimate}</span>}
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${complexityColors[opp.complexity]}`}>{opp.complexity}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Intelligence Panel (reusable for desktop + mobile tab) ──
function IntelligencePanel({ insights, pendingRecs, resolvedRecs, opportunities, approveRecommendation, updateInsightStatus }: {
  insights: StrategyInsight[];
  pendingRecs: StrategyRecommendation[];
  resolvedRecs: StrategyRecommendation[];
  opportunities: AutomationOpportunity[];
  approveRecommendation: (id: string, approved: boolean) => Promise<boolean>;
  updateInsightStatus: (id: string, status: string) => Promise<boolean>;
}) {
  return (
    <div className="space-y-5">
      {pendingRecs.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-500" /> Pending Approvals ({pendingRecs.length})
          </h3>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {pendingRecs.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec}
                  onApprove={(id) => approveRecommendation(id, true)}
                  onReject={(id) => approveRecommendation(id, false)} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
      {insights.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-blue-600" /> Insights ({insights.length})
          </h3>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {insights.slice(0, 8).map((insight) => (
                <InsightCard key={insight.id} insight={insight} onDismiss={(id) => updateInsightStatus(id, 'dismissed')} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
      {opportunities.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-purple-600" /> Automation Opportunities ({opportunities.length})
          </h3>
          <div className="space-y-2">
            {opportunities.slice(0, 5).map((opp) => <OpportunityCard key={opp.id} opp={opp} />)}
          </div>
        </div>
      )}
      {resolvedRecs.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-gray-400" /> Recent Decisions ({resolvedRecs.length})
          </h3>
          <div className="space-y-2">
            {resolvedRecs.map((rec) => <RecommendationCard key={rec.id} rec={rec} onApprove={() => {}} onReject={() => {}} />)}
          </div>
        </div>
      )}
      {insights.length === 0 && pendingRecs.length === 0 && opportunities.length === 0 && (
        <div className="text-center py-10">
          <Sparkles className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 mb-1">No intelligence yet</p>
          <p className="text-xs text-gray-400">Click "Run Analysis" to generate insights and recommendations.</p>
        </div>
      )}
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

// ── AI Suggestions Panel ──
function SuggestionsPanel({ suggestions, rationale, blockKey, onAccept, onDismiss, onClose }: {
  suggestions: CanvasBlockItem[]; rationale: string; blockKey: CanvasBlockKey;
  onAccept: (items: CanvasBlockItem[]) => void; onDismiss: () => void; onClose: () => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(suggestions.map(s => s.id)));
  const toggleItem = (id: string) => setSelected(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
      className="fixed inset-x-4 bottom-4 sm:inset-auto sm:right-4 sm:bottom-4 sm:w-96 bg-white rounded-xl shadow-xl border border-[#D4CFC8] p-4 z-50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00875A]" />
          <h3 className="text-sm font-semibold text-[#1A1A1A]">AI Suggestions for {CANVAS_BLOCK_LABELS[blockKey]}</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xs">Close</button>
      </div>
      {rationale && <p className="text-[11px] text-gray-500 mb-3 leading-relaxed">{rationale}</p>}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {suggestions.map((item) => (
          <label key={item.id} className="flex items-start gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
            <input type="checkbox" checked={selected.has(item.id)} onChange={() => toggleItem(item.id)} className="mt-0.5 accent-[#00875A]" />
            <div className="flex-1 min-w-0">
              <span className="text-xs text-[#1A1A1A]">{item.text}</span>
              {item.confidence != null && <span className="block text-[10px] text-gray-400 mt-0.5">{Math.round(item.confidence * 100)}% confidence</span>}
            </div>
          </label>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        <button onClick={() => onAccept(suggestions.filter(s => selected.has(s.id)))} disabled={selected.size === 0}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs bg-[#00875A] text-white rounded-lg hover:bg-[#006644] disabled:opacity-50 transition-colors">
          <CheckCircle2 className="w-3 h-3" /> Accept {selected.size} item{selected.size !== 1 ? 's' : ''}
        </button>
        <button onClick={onDismiss} className="px-3 py-2 text-xs border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">Dismiss</button>
      </div>
    </motion.div>
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
          className={`flex-1 py-3 text-center text-sm font-medium relative transition-colors ${
            active === key ? 'text-[#00875A] border-b-2 border-[#00875A]' : 'text-[#9CA39B]'
          }`}
        >
          {label}
          {key === 'intelligence' && pendingCount > 0 && (
            <span className="absolute top-2 right-1/4 w-4 h-4 bg-amber-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
              {pendingCount}
            </span>
          )}
        </button>
      ))}
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

  // Task 20: Analysis progress sheet state
  const [showAnalysisSheet, setShowAnalysisSheet] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<StrategyAnalysisResponse | null>(null);

  // Task 22: Version history state
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  // Task 23: Mobile tab state
  const [mobileTab, setMobileTab] = useState<MobileTab>('canvas');

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

  // ── Run Analysis with progress sheet (Task 20) ──
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
    const currentItems = (data.canvas[suggestions.block] as CanvasBlockItem[]) || [];
    const merged = [...currentItems, ...items];
    await updateBlocks({ [suggestions.block]: merged } as any, `Added ${items.length} AI suggestions to ${suggestions.block}`);
    setSuggestions(null);
  }, [suggestions, data?.canvas, updateBlocks]);

  // ── Revert handler (Task 22) ──
  const handleRevert = useCallback(async (blocks: Record<string, unknown>, summary: string) => {
    return await updateBlocks(blocks as any, summary);
  }, [updateBlocks]);

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
          <button onClick={refetch} className="mt-3 px-3 py-1.5 bg-red-100 rounded text-xs hover:bg-red-200 transition-colors">Retry</button>
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
  const insights = data!.insights.filter(i => i.status !== 'dismissed');
  const pendingRecs = data!.recommendations.filter(r => r.approval_status === 'pending');
  const resolvedRecs = data!.recommendations.filter(r => r.approval_status !== 'pending').slice(0, 5);
  const opportunities = data!.opportunities;
  const roadmapPhases = (canvas.metadata as any)?.phases || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-[#00875A]" />
          <div>
            <h1 className="text-xl font-semibold text-[#1A1A1A]">Strategy Engine</h1>
            <p className="text-xs text-gray-500">v{canvas.version} &middot; Updated {new Date(canvas.updated_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowVersionHistory(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs border border-[#D4CFC8] rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
            <History className="w-3.5 h-3.5" /> <span className="hidden sm:inline">History</span>
          </button>
          <button onClick={refetch}
            className="flex items-center gap-1.5 px-3 py-2 text-xs border border-[#D4CFC8] rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
            <RefreshCw className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Refresh</span>
          </button>
          <button onClick={handleRunAnalysis} disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-4 py-2 text-xs bg-[#00875A] text-white rounded-lg hover:bg-[#006644] transition-colors disabled:opacity-50 font-medium">
            {isAnalyzing ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing...</> : <><Sparkles className="w-3.5 h-3.5" /> Run Analysis</>}
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">{error}</div>}

      {/* Metrics Bar */}
      <MetricsBar metrics={metrics} />

      {/* Mobile Tab Bar (Task 23) */}
      <MobileTabBar active={mobileTab} onChange={setMobileTab} pendingCount={pendingRecs.length} />

      {/* ═══ Desktop Layout (md+): Canvas + Roadmap + Intelligence ═══ */}
      <div className="hidden md:grid md:grid-cols-[1fr_300px] xl:grid-cols-[1fr_280px_340px] gap-6">
        {/* Left: Canvas Grid */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-[#1A1A1A]">Lean Canvas</h2>
            <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{metrics.canvasCompleteness}% complete</span>
          </div>
          <LeanCanvasGrid canvas={canvas} onAskAI={handleAskAI} isSynthesizing={isSynthesizing} />
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

      {/* ═══ Mobile Layout (<md): Tab content (Task 23) ═══ */}
      <div className="md:hidden">
        {mobileTab === 'canvas' && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-semibold text-[#1A1A1A]">Lean Canvas</h2>
              <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{metrics.canvasCompleteness}% complete</span>
            </div>
            <LeanCanvasGrid canvas={canvas} onAskAI={handleAskAI} isSynthesizing={isSynthesizing} />
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

      {/* Task 20: Analysis Progress Sheet */}
      <AnalysisProgressSheet
        open={showAnalysisSheet}
        onClose={() => setShowAnalysisSheet(false)}
        onComplete={refetch}
        result={analysisResult}
        isRunning={isAnalyzing}
      />

      {/* Task 22: Version History Side Sheet */}
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
    </div>
  );
}
