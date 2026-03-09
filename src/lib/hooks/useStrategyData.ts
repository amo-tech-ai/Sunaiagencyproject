// H14-STRATEGY — Fetches and assembles Strategy Engine data
// Loads canvas, insights, opportunities, recommendations, metrics
// Pattern: follows useDashboardData.ts with 'use-fresh-token' auth pattern

import { useState, useEffect, useCallback } from 'react';
import { strategyApi } from '../supabase';
import type {
  LeanCanvas, StrategyInsight, AutomationOpportunity,
  StrategyRecommendation, StrategyAction, StrategyMetrics,
  StrategyDashboardData, StrategyAnalysisResponse, BlockSynthesisResponse,
  CanvasBlockKey, CanvasBlockItem,
} from '../types/strategy';

export type { StrategyDashboardData };

interface UseStrategyDataReturn {
  data: StrategyDashboardData | null;
  loading: boolean;
  error: string | null;
  hasCanvas: boolean;

  // Actions
  refetch: () => Promise<void>;
  createCanvas: (sessionId?: string, projectId?: string) => Promise<LeanCanvas | null>;
  updateBlocks: (blocks: Partial<Record<CanvasBlockKey, CanvasBlockItem[]>>, summary?: string) => Promise<boolean>;
  runAnalysis: () => Promise<StrategyAnalysisResponse | null>;
  synthesizeBlock: (block: CanvasBlockKey, context?: string) => Promise<BlockSynthesisResponse | null>;
  approveRecommendation: (id: string, approved: boolean, comment?: string) => Promise<boolean>;
  updateInsightStatus: (id: string, status: string, actionTaken?: string) => Promise<boolean>;
  updateOpportunityStatus: (id: string, status: string) => Promise<boolean>;

  // State flags
  isAnalyzing: boolean;
  isSynthesizing: boolean;
}

const AUTH_TOKEN = 'use-fresh-token';

const DEFAULT_METRICS: StrategyMetrics = {
  healthScore: 0,
  healthBreakdown: {
    strategyClarity: 0,
    aiReadiness: 0,
    pipelineHealth: 0,
    automationProgress: 0,
    revenueTrajectory: 0,
    operationalEfficiency: 0,
    engagementQuality: 0,
    strategyFreshness: 0,
  },
  automationCoverage: 0,
  insightCount: 0,
  pendingApprovals: 0,
  pendingSignals: 0,
  opportunitiesDetected: 0,
  totalROIEstimate: 'N/A',
  canvasCompleteness: 0,
  tokenBudgetUsed: 0,
  tokenBudgetRemaining: 500000,
};

export function useStrategyData(
  userId: string | null,
  accessToken: string | null
): UseStrategyDataReturn {
  const [data, setData] = useState<StrategyDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const isAuthenticated = !!accessToken;
  const token = isAuthenticated ? AUTH_TOKEN : undefined;

  // ── Fetch all strategy data ──
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Load canvas, insights, opps, recs, actions, metrics in parallel
      const [canvasRes, insightsRes, oppsRes, recsRes, actionsRes, metricsRes] = await Promise.all([
        strategyApi.getCanvas(undefined, token),
        strategyApi.listInsights({ limit: 50 }, token),
        strategyApi.listOpportunities(token),
        strategyApi.listRecommendations(undefined, token),
        strategyApi.getActions({ limit: 25 }, token),
        strategyApi.getMetrics(token),
      ]);

      if (canvasRes.error) {
        console.error('[useStrategyData] Canvas fetch error:', canvasRes.error);
      }

      const canvas = canvasRes.data?.canvas || null;
      const insights = insightsRes.data?.insights || [];
      const opportunities = oppsRes.data?.opportunities || [];
      const recommendations = recsRes.data?.recommendations || [];
      const recentActions = actionsRes.data?.actions || [];
      const metrics = (metricsRes.data as StrategyMetrics) || DEFAULT_METRICS;

      setData({
        canvas,
        insights,
        opportunities,
        recommendations,
        recentActions,
        metrics,
      });
    } catch (err) {
      console.error('[useStrategyData] Error:', err);
      setError(`Failed to load strategy data: ${err}`);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Create canvas ──
  const createCanvas = useCallback(async (sessionId?: string, projectId?: string): Promise<LeanCanvas | null> => {
    try {
      const res = await strategyApi.createCanvas(
        { session_id: sessionId, project_id: projectId },
        token
      );
      if (res.error || !res.data?.canvas) {
        console.error('[useStrategyData] Create canvas error:', res.error);
        setError(res.error || 'Failed to create canvas');
        return null;
      }
      // Refetch all data
      await fetchData();
      return res.data.canvas;
    } catch (err) {
      console.error('[useStrategyData] Create canvas error:', err);
      setError(`Failed to create canvas: ${err}`);
      return null;
    }
  }, [token, fetchData]);

  // ── Update blocks ──
  const updateBlocks = useCallback(async (
    blocks: Partial<Record<CanvasBlockKey, CanvasBlockItem[]>>,
    summary?: string
  ): Promise<boolean> => {
    if (!data?.canvas?.id) return false;
    try {
      const res = await strategyApi.updateCanvasBlocks(data.canvas.id, blocks, summary, token);
      if (res.error) {
        console.error('[useStrategyData] Update blocks error:', res.error);
        setError(res.error);
        return false;
      }
      // Optimistic update
      if (res.data?.canvas) {
        setData(prev => prev ? { ...prev, canvas: res.data!.canvas } : prev);
      }
      return true;
    } catch (err) {
      console.error('[useStrategyData] Update blocks error:', err);
      setError(`Failed to update blocks: ${err}`);
      return false;
    }
  }, [data?.canvas?.id, token]);

  // ── Run analysis ──
  const runAnalysis = useCallback(async (): Promise<StrategyAnalysisResponse | null> => {
    if (!data?.canvas?.id) return null;
    setIsAnalyzing(true);
    try {
      const res = await strategyApi.runAnalysis(
        data.canvas.id,
        data.canvas.session_id || undefined,
        token
      );
      if (res.error) {
        console.error('[useStrategyData] Analysis error:', res.error);
        setError(res.error);
        return null;
      }
      // Refetch all data to get fresh results
      await fetchData();
      return res.data as StrategyAnalysisResponse;
    } catch (err) {
      console.error('[useStrategyData] Analysis error:', err);
      setError(`Analysis failed: ${err}`);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [data?.canvas?.id, data?.canvas?.session_id, token, fetchData]);

  // ── Synthesize block ──
  const synthesizeBlock = useCallback(async (
    block: CanvasBlockKey,
    context?: string
  ): Promise<BlockSynthesisResponse | null> => {
    if (!data?.canvas?.id) return null;
    setIsSynthesizing(true);
    try {
      const res = await strategyApi.synthesizeBlock(data.canvas.id, block, context, token);
      if (res.error) {
        console.error('[useStrategyData] Synthesize block error:', res.error);
        setError(res.error);
        return null;
      }
      return res.data as BlockSynthesisResponse;
    } catch (err) {
      console.error('[useStrategyData] Synthesize block error:', err);
      setError(`Block synthesis failed: ${err}`);
      return null;
    } finally {
      setIsSynthesizing(false);
    }
  }, [data?.canvas?.id, token]);

  // ── Approve/reject recommendation ──
  const approveRecommendation = useCallback(async (
    id: string,
    approved: boolean,
    comment?: string
  ): Promise<boolean> => {
    try {
      const res = await strategyApi.approveRecommendation(id, approved, comment, token);
      if (res.error) {
        console.error('[useStrategyData] Approve rec error:', res.error);
        setError(res.error);
        return false;
      }
      // If canvas was updated, update local state
      if (res.data?.canvas) {
        setData(prev => prev ? { ...prev, canvas: res.data!.canvas! } : prev);
      }
      // Update recommendation in local state
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          recommendations: prev.recommendations.map(r =>
            r.id === id ? { ...r, approval_status: approved ? 'approved' : 'rejected' } : r
          ),
        };
      });
      return true;
    } catch (err) {
      console.error('[useStrategyData] Approve rec error:', err);
      return false;
    }
  }, [token]);

  // ── Update insight status ──
  const updateInsightStatus = useCallback(async (
    id: string,
    status: string,
    actionTaken?: string
  ): Promise<boolean> => {
    try {
      const res = await strategyApi.updateInsight(id, { status, action_taken: actionTaken }, token);
      if (res.error) {
        console.error('[useStrategyData] Update insight error:', res.error);
        return false;
      }
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          insights: prev.insights.map(i => i.id === id ? { ...i, status: status as any } : i),
        };
      });
      return true;
    } catch (err) {
      return false;
    }
  }, [token]);

  // ── Update opportunity status ──
  const updateOpportunityStatus = useCallback(async (
    id: string,
    status: string
  ): Promise<boolean> => {
    try {
      const res = await strategyApi.updateOpportunity(id, { status: status as any }, token);
      if (res.error) return false;
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          opportunities: prev.opportunities.map(o => o.id === id ? { ...o, status: status as any } : o),
        };
      });
      return true;
    } catch {
      return false;
    }
  }, [token]);

  return {
    data,
    loading,
    error,
    hasCanvas: !!data?.canvas,
    refetch: fetchData,
    createCanvas,
    updateBlocks,
    runAnalysis,
    synthesizeBlock,
    approveRecommendation,
    updateInsightStatus,
    updateOpportunityStatus,
    isAnalyzing,
    isSynthesizing,
  };
}
