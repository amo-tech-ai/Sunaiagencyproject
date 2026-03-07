// C07-CRM-PIPELINE — Main CRM Pipeline page at /app/crm/pipelines
// Kanban board with pipeline tabs, drag-and-drop deals, forecast chart.
// Reads from crm_pipelines, crm_stages, crm_deals via Edge Functions.
// Mobile: stacked columns. Desktop: horizontal scroll kanban.

import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, RefreshCw, GitBranch } from 'lucide-react';
import { motion } from 'motion/react';
import { pipelineApi } from '../../../lib/supabase';
import { useAuth } from '../../AuthContext';
import type { Pipeline, Stage, Deal, PipelineData, DealCreateInput } from '../../../lib/types/crm-pipeline';
import StageColumn from './StageColumn';
import DealDetailPanel from './DealDetailPanel';
import DealQuickCreate from './DealQuickCreate';
import ForecastChart from './ForecastChart';

function formatCurrency(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
  return `$${value.toLocaleString()}`;
}

export default function CRMPipelinePage() {
  const { accessToken } = useAuth();
  const token = accessToken ? 'use-fresh-token' : undefined;

  // Pipeline state
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [activePipelineId, setActivePipelineId] = useState<string | null>(null);
  const [pipelineData, setPipelineData] = useState<PipelineData | null>(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [loadingPipeline, setLoadingPipeline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Drag state
  const draggedDealRef = useRef<Deal | null>(null);

  // ── Fetch pipelines list ──
  const fetchPipelines = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await pipelineApi.listPipelines(token);
      if (res.data?.pipelines) {
        setPipelines(res.data.pipelines);
        // Select default pipeline or first
        if (res.data.pipelines.length > 0) {
          const defaultPipeline = res.data.pipelines.find((p: any) => p.is_default) || res.data.pipelines[0];
          setActivePipelineId(defaultPipeline.id);
        }
      }
      if (res.error) {
        setError(res.error);
        console.error('[CRMPipeline] Fetch pipelines error:', res.error);
      }
    } catch (err) {
      setError(String(err));
      console.error('[CRMPipeline] Fetch pipelines exception:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ── Fetch pipeline detail (stages + deals) ──
  const fetchPipelineData = useCallback(async (pipelineId: string) => {
    setLoadingPipeline(true);
    try {
      const res = await pipelineApi.getPipeline(pipelineId, token);
      if (res.data) {
        setPipelineData(res.data);
      }
      if (res.error) {
        console.error('[CRMPipeline] Fetch pipeline data error:', res.error);
        setError(res.error);
      }
    } catch (err) {
      console.error('[CRMPipeline] Fetch pipeline data exception:', err);
    } finally {
      setLoadingPipeline(false);
    }
  }, [token]);

  // Initial load
  useEffect(() => { fetchPipelines(); }, [fetchPipelines]);

  // Load pipeline data when active pipeline changes
  useEffect(() => {
    if (activePipelineId) {
      fetchPipelineData(activePipelineId);
    }
  }, [activePipelineId, fetchPipelineData]);

  // ── Handlers ──
  const handleDealDragStart = (e: React.DragEvent, deal: Deal) => {
    draggedDealRef.current = deal;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', deal.id);
  };

  const handleDealDrop = async (targetStageId: string) => {
    const deal = draggedDealRef.current;
    if (!deal || deal.stage_id === targetStageId) {
      draggedDealRef.current = null;
      return;
    }

    // Optimistic update
    setPipelineData(prev => {
      if (!prev) return prev;
      const updatedDeals = prev.deals.map(d =>
        d.id === deal.id
          ? { ...d, stage_id: targetStageId, daysInStage: 0, isStale: false, isVeryStale: false, stage_changed_at: new Date().toISOString() }
          : d
      );
      const updatedStages = prev.stages.map(s => {
        const stageDeals = updatedDeals.filter(d => d.stage_id === s.id);
        return { ...s, dealCount: stageDeals.length, totalValue: stageDeals.reduce((sum, d) => sum + d.value, 0) };
      });
      return { ...prev, deals: updatedDeals, stages: updatedStages };
    });

    draggedDealRef.current = null;

    // Persist
    try {
      const res = await pipelineApi.updateDeal(deal.id, { stage_id: targetStageId } as any, token);
      if (res.error) {
        console.error('[CRMPipeline] Move deal error:', res.error);
        // Revert on error
        if (activePipelineId) fetchPipelineData(activePipelineId);
      }
    } catch (err) {
      console.error('[CRMPipeline] Move deal exception:', err);
      if (activePipelineId) fetchPipelineData(activePipelineId);
    }
  };

  const handleMoveDealFromPanel = async (dealId: string, newStageId: string) => {
    // Optimistic
    setPipelineData(prev => {
      if (!prev) return prev;
      const updatedDeals = prev.deals.map(d =>
        d.id === dealId
          ? { ...d, stage_id: newStageId, daysInStage: 0, isStale: false, isVeryStale: false, stage_changed_at: new Date().toISOString() }
          : d
      );
      const updatedStages = prev.stages.map(s => {
        const stageDeals = updatedDeals.filter(d => d.stage_id === s.id);
        return { ...s, dealCount: stageDeals.length, totalValue: stageDeals.reduce((sum, d) => sum + d.value, 0) };
      });
      return { ...prev, deals: updatedDeals, stages: updatedStages };
    });

    // Update selected deal
    setSelectedDeal(prev => prev && prev.id === dealId ? { ...prev, stage_id: newStageId, daysInStage: 0, isStale: false, isVeryStale: false } : prev);

    try {
      const res = await pipelineApi.updateDeal(dealId, { stage_id: newStageId } as any, token);
      if (res.error) {
        console.error('[CRMPipeline] Move deal error:', res.error);
        if (activePipelineId) fetchPipelineData(activePipelineId);
      }
    } catch (err) {
      console.error('[CRMPipeline] Move deal exception:', err);
      if (activePipelineId) fetchPipelineData(activePipelineId);
    }
  };

  const handleCreateDeal = async (data: DealCreateInput) => {
    const res = await pipelineApi.createDeal(data, token);
    if (res.data?.deal) {
      // Refresh pipeline to get updated state
      if (activePipelineId) fetchPipelineData(activePipelineId);
    }
    if (res.error) {
      console.error('[CRMPipeline] Create deal error:', res.error);
      throw new Error(res.error);
    }
  };

  const handleDeleteDeal = async (dealId: string) => {
    // Optimistic remove
    setPipelineData(prev => {
      if (!prev) return prev;
      const updatedDeals = prev.deals.filter(d => d.id !== dealId);
      const updatedStages = prev.stages.map(s => {
        const stageDeals = updatedDeals.filter(d => d.stage_id === s.id);
        return { ...s, dealCount: stageDeals.length, totalValue: stageDeals.reduce((sum, d) => sum + d.value, 0) };
      });
      return { ...prev, deals: updatedDeals, stages: updatedStages };
    });
    setSelectedDeal(null);

    try {
      await pipelineApi.deleteDeal(dealId, token);
    } catch (err) {
      console.error('[CRMPipeline] Delete deal exception:', err);
      if (activePipelineId) fetchPipelineData(activePipelineId);
    }
  };

  // ── Computed values ──
  const stages = pipelineData?.stages || [];
  const deals = pipelineData?.deals || [];
  const forecast = pipelineData?.forecast || [];

  // Active deals (not in terminal stages)
  const activeStageIds = stages.filter(s => !s.is_closed_won && !s.is_closed_lost).map(s => s.id);
  const activeDeals = deals.filter(d => activeStageIds.includes(d.stage_id));
  const totalWeightedPipeline = activeDeals.reduce((sum, d) => sum + (d.value * d.probability / 100), 0);

  // ── Loading state ──
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-[#E8E8E4] rounded w-48 mb-4" />
          <div className="h-10 bg-[#E8E8E4] rounded w-64 mb-6" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map(i => (
              <div key={`skel-col-${i}`} className="w-[260px] shrink-0">
                <div className="h-14 bg-[#E8E8E4] rounded-t-lg mb-2" />
                {[1, 2].map(j => (
                  <div key={`skel-card-${i}-${j}`} className="h-24 bg-[#E8E8E4] rounded mb-2" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error && pipelines.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <GitBranch className="w-10 h-10 text-[#9CA39B] mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-2">Unable to load pipelines</h2>
        <p className="text-sm text-[#6B6B63] mb-4">{error}</p>
        <button
          onClick={fetchPipelines}
          className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-[#00875A] text-white rounded hover:bg-[#006B48] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  // ── Empty state (no pipelines) ──
  if (pipelines.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="w-14 h-14 bg-[#F5F5F0] border border-[#E8E8E4] rounded-xl flex items-center justify-center mx-auto mb-4">
          <GitBranch className="w-6 h-6 text-[#00875A]" />
        </div>
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-2">No pipelines yet</h2>
        <p className="text-sm text-[#6B6B63] mb-4 leading-relaxed">
          Pipelines are created from the seed migration. Run the migration files to create the default "New Business" and "Upsell" pipelines.
        </p>
        <button
          onClick={fetchPipelines}
          className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-[#00875A] text-white rounded hover:bg-[#006B48] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-[Georgia,serif] font-semibold text-[#1A1A1A]">
            CRM Pipeline
          </h1>
          {totalWeightedPipeline > 0 && (
            <p className="text-sm text-[#6B6B63] mt-0.5">
              Weighted pipeline: <span className="font-semibold text-[#00875A]">{formatCurrency(Math.round(totalWeightedPipeline))}</span>
              {' '}&middot; {activeDeals.length} active {activeDeals.length === 1 ? 'deal' : 'deals'}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => activePipelineId && fetchPipelineData(activePipelineId)}
            className="p-2 border border-[#E8E8E4] rounded hover:bg-[#F5F5F0] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Refresh pipeline"
          >
            <RefreshCw className={`w-4 h-4 text-[#6B6B63] ${loadingPipeline ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setCreateDialogOpen(true)}
            className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 bg-[#00875A] text-white rounded hover:bg-[#006B48] transition-colors min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            Add Deal
          </button>
        </div>
      </div>

      {/* Pipeline Tabs */}
      <div className="flex gap-1 mb-4 border-b border-[#E8E8E4] overflow-x-auto">
        {pipelines.map(p => (
          <button
            key={p.id}
            onClick={() => setActivePipelineId(p.id)}
            className={`text-sm px-4 py-2.5 font-medium whitespace-nowrap transition-colors border-b-2 ${
              activePipelineId === p.id
                ? 'text-[#00875A] border-[#00875A]'
                : 'text-[#6B6B63] border-transparent hover:text-[#1A1A1A] hover:border-[#D4CFC8]'
            }`}
          >
            {p.name}
            {(p as any).dealCount > 0 && (
              <span className="ml-1.5 text-xs bg-[#F5F5F0] text-[#6B6B63] px-1.5 py-0.5 rounded-full">
                {(p as any).dealCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Kanban Board */}
      {loadingPipeline && !pipelineData ? (
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map(i => (
            <div key={`load-col-${i}`} className="w-[260px] shrink-0 animate-pulse">
              <div className="h-14 bg-[#E8E8E4] rounded-t-lg mb-2" />
              {[1, 2].map(j => (
                <div key={`load-card-${i}-${j}`} className="h-24 bg-[#E8E8E4] rounded mb-2" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Desktop: horizontal scroll */}
          <div className="hidden md:block">
            <motion.div
              className="flex gap-3 overflow-x-auto pb-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {stages.map(stage => {
                const stageDeals = deals.filter(d => d.stage_id === stage.id);
                return (
                  <StageColumn
                    key={stage.id}
                    stage={stage}
                    deals={stageDeals}
                    onDealClick={setSelectedDeal}
                    onDealDragStart={handleDealDragStart}
                    onDealDrop={handleDealDrop}
                  />
                );
              })}
            </motion.div>
          </div>

          {/* Mobile: stacked columns */}
          <div className="md:hidden space-y-3">
            {stages.map(stage => {
              const stageDeals = deals.filter(d => d.stage_id === stage.id);
              return (
                <MobileStageSection
                  key={stage.id}
                  stage={stage}
                  deals={stageDeals}
                  onDealClick={setSelectedDeal}
                />
              );
            })}
          </div>

          {/* Forecast Chart */}
          <ForecastChart
            data={forecast}
            totalWeightedPipeline={Math.round(totalWeightedPipeline)}
            totalActiveDeals={activeDeals.length}
          />
        </>
      )}

      {/* Deal Detail Panel (Sheet) */}
      <DealDetailPanel
        deal={selectedDeal}
        onClose={() => setSelectedDeal(null)}
        onMoveDeal={handleMoveDealFromPanel}
        onDeleteDeal={handleDeleteDeal}
        stages={stages}
      />

      {/* Create Deal Dialog */}
      <DealQuickCreate
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateDeal}
        pipelineId={activePipelineId || ''}
        stages={stages.filter(s => !s.is_closed_won && !s.is_closed_lost)}
      />
    </div>
  );
}

// ── Mobile Stage Section (collapsible) ──
function MobileStageSection({
  stage,
  deals,
  onDealClick,
}: {
  stage: Stage;
  deals: Deal[];
  onDealClick: (deal: Deal) => void;
}) {
  const [expanded, setExpanded] = useState(deals.length > 0);

  return (
    <div className="border border-[#E8E8E4] rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 bg-[#FAFAF8] hover:bg-[#F5F5F0] transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
          <span className="text-sm font-semibold text-[#1A1A1A]">{stage.name}</span>
          <span className="text-xs text-[#6B6B63] bg-[#E8E8E4] px-1.5 py-0.5 rounded-full">
            {stage.dealCount}
          </span>
        </div>
        {stage.totalValue > 0 && (
          <span className="text-xs font-medium text-[#1A1A1A]">
            ${(stage.totalValue / 1000).toFixed(stage.totalValue % 1000 === 0 ? 0 : 1)}K
          </span>
        )}
      </button>
      {expanded && (
        <div className="p-2 space-y-2">
          {deals.length === 0 ? (
            <p className="text-xs text-[#9CA39B] text-center py-3">No deals</p>
          ) : (
            deals.map(deal => (
              <div
                key={deal.id}
                onClick={() => onDealClick(deal)}
                className="p-3 bg-white border border-[#E8E8E4] rounded-lg cursor-pointer hover:shadow-sm transition-shadow"
              >
                <p className="text-sm font-medium text-[#1A1A1A] truncate">{deal.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-semibold text-[#00875A]">
                    ${(deal.value / 1000).toFixed(deal.value % 1000 === 0 ? 0 : 1)}K
                  </span>
                  <span className="text-xs text-[#6B6B63]">{deal.probability}%</span>
                  {deal.contact_name && <span className="text-xs text-[#9CA39B] truncate">{deal.contact_name}</span>}
                  <span className={`text-xs ml-auto ${deal.isStale ? 'text-amber-600' : 'text-[#9CA39B]'}`}>
                    {deal.daysInStage}d {deal.isStale && '\u26A0\uFE0F'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}