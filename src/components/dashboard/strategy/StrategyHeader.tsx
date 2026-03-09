// C14-HEADER — Strategy Engine page header
// Shows title, version info, live indicator, and action buttons
// (History, Refresh, Run Analysis)
// BCG design system: warm off-white, charcoal text, green accents

import { Brain, History, RefreshCw, Sparkles, Loader2 } from 'lucide-react';
import type { LeanCanvas, StrategyMetrics } from '../../../lib/types/strategy';

interface StrategyHeaderProps {
  canvas: LeanCanvas;
  metrics: StrategyMetrics;
  isAnalyzing: boolean;
  isCanvasLive: boolean;
  canvasRealtimeStatus: string;
  onRunAnalysis: () => void;
  onRefresh: () => void;
  onShowHistory: () => void;
  onReconnect: () => void;
}

export default function StrategyHeader({
  canvas, metrics, isAnalyzing, isCanvasLive, canvasRealtimeStatus,
  onRunAnalysis, onRefresh, onShowHistory, onReconnect,
}: StrategyHeaderProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <Brain className="w-6 h-6 text-[#00875A]" />
        <div>
          <h1 className="text-xl font-semibold text-[#1A1A1A]">Strategy Engine</h1>
          <p className="text-xs text-gray-500">
            v{canvas.version} &middot; Updated {new Date(canvas.updated_at).toLocaleDateString()}
            {isCanvasLive && (
              <span className="inline-flex items-center gap-1 ml-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00875A] opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00875A]" />
                </span>
                <span className="text-[10px] text-[#9CA39B]">Live</span>
              </span>
            )}
            {canvasRealtimeStatus === 'error' && (
              <span className="inline-flex items-center gap-1 ml-2">
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
                <button onClick={onReconnect} className="text-[10px] text-[#9CA39B] underline hover:text-[#6B6B63]">
                  retry live
                </button>
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onShowHistory}
          className="flex items-center gap-1.5 px-3 py-2 text-xs border border-[#D4CFC8] rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
        >
          <History className="w-3.5 h-3.5" /> <span className="hidden sm:inline">History</span>
        </button>
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-3 py-2 text-xs border border-[#D4CFC8] rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
        >
          <RefreshCw className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Refresh</span>
        </button>
        <button
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className="flex items-center gap-1.5 px-4 py-2 text-xs bg-[#00875A] text-white rounded-lg hover:bg-[#006644] transition-colors disabled:opacity-50 font-medium"
        >
          {isAnalyzing
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing...</>
            : <><Sparkles className="w-3.5 h-3.5" /> Run Analysis</>
          }
        </button>
      </div>
    </div>
  );
}
