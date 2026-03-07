// C96-INSIGHTS-PAGE — Full AI Insights page at /app/insights
// Orchestrates: summary header (score ring + re-run), radar chart, dimension breakdown,
// AI insight cards (live + static), and snapshot history with comparison.
// Mobile-first: single column → two columns on lg+, responsive padding.
// BCG design: #F5F5F0 bg, Georgia headings, #00875A accent, flat white cards.

import { useAuth } from '../../AuthContext';
import { useDashboardData } from '../../../lib/hooks/useDashboardData';
import type { InsightItem } from '../../../lib/hooks/useDashboardData';
import { aiApi } from '../../../lib/supabase';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { motion } from 'motion/react';

import InsightsSummaryHeader from './InsightsSummaryHeader';
import ReadinessRadar from './ReadinessRadar';
import ReadinessBreakdown from './ReadinessBreakdown';
import InsightDetailCards from './InsightDetailCards';
import SnapshotHistory from './SnapshotHistory';

export default function InsightsPage() {
  const { user, accessToken } = useAuth();
  const { data, loading: dataLoading, error, refetch } = useDashboardData(user?.id || null, accessToken);

  // Live AI insights
  const [liveInsights, setLiveInsights] = useState<InsightItem[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [aiGreeting, setAiGreeting] = useState<string>('');
  const [aiSummary, setAiSummary] = useState<string>('');
  const fetchedRef = useRef(false);

  const fetchInsights = useCallback(async (force = false) => {
    if (!data || !data.hasWizardData || !accessToken) return;
    if (!force && fetchedRef.current) return;
    fetchedRef.current = true;

    setInsightsLoading(true);
    try {
      const res = await aiApi.dashboardInsights({
        sessionId: data.sessionId,
        orgData: {
          name: data.org.name,
          industry: data.org.industry,
          size: data.org.size,
          description: data.org.description,
        },
        readinessScore: data.readiness.overall,
        projectState: {
          name: data.project.name,
          currentPhase: data.project.currentPhase,
          totalPhases: data.project.totalPhases,
          progress: data.project.progress,
          systems: data.project.systems,
          totalInvestment: data.project.totalInvestment,
        },
        recentActivities: data.activities.slice(0, 10),
      }, accessToken);

      if (res.data?.insights) {
        const { insights: insightsData, greeting, summary } = res.data.insights;
        if (insightsData?.length) {
          const mapped: InsightItem[] = insightsData.map(i => ({
            id: i.id,
            title: i.title,
            description: i.description,
            priority: i.priority,
            actionLabel: i.actionLabel,
            action: i.actionRoute,
          }));
          setLiveInsights(mapped);
        }
        if (greeting) setAiGreeting(greeting);
        if (summary) setAiSummary(summary);
        console.log('[InsightsPage] Live AI insights loaded:', insightsData?.length || 0);
      }
    } catch (err) {
      console.error('[InsightsPage] Live insights fetch failed:', err);
    } finally {
      setInsightsLoading(false);
    }
  }, [data, accessToken]);

  // Auto-fetch on mount when data is ready
  useEffect(() => {
    if (data?.hasWizardData && !fetchedRef.current) {
      fetchInsights();
    }
  }, [data, fetchInsights]);

  const handleRerun = () => {
    fetchedRef.current = false;
    fetchInsights(true);
  };

  // Merge live + static insights (live first, dedup by title to handle id mismatches)
  const mergedInsights = (() => {
    if (!data) return liveInsights;
    const all = [...liveInsights, ...data.insights];
    const seen = new Set<string>();
    return all.filter(i => {
      const key = i.title.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  })();

  // Loading state
  if (dataLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="h-32 sm:h-36 bg-white rounded border border-[#E8E8E4] animate-pulse" />
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="h-80 bg-white rounded border border-[#E8E8E4] animate-pulse" />
          <div className="h-80 bg-white rounded border border-[#E8E8E4] animate-pulse" />
        </div>
        <div className="h-48 bg-white rounded border border-[#E8E8E4] animate-pulse" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded border border-[#E8E8E4] p-6 sm:p-8 text-center">
        <p className="text-[#DC2626] text-sm mb-3">Unable to load insights data</p>
        <p className="text-[#6B6B63] text-xs mb-4 max-w-md mx-auto break-words">{error}</p>
        <button
          onClick={refetch}
          className="px-5 py-2.5 bg-[#1A1A1A] text-[#F5F5F0] text-sm rounded hover:bg-[#333] transition-colors min-h-[44px]"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state — no wizard data
  if (!data || !data.hasWizardData) {
    return (
      <div className="max-w-md mx-auto text-center py-8 sm:py-16 px-4">
        <div className="w-12 h-12 bg-[#F5F5F0] border border-[#E8E8E4] rounded flex items-center justify-center mx-auto mb-4">
          <Wand2 className="w-5 h-5 text-[#6B6B63]" />
        </div>
        <h2 className="font-[Georgia,serif] text-lg sm:text-xl font-semibold text-[#1A1A1A] mb-2">
          No Assessment Data Yet
        </h2>
        <p className="text-sm text-[#6B6B63] mb-6">
          Complete the Project Brief Wizard to generate your AI readiness assessment and personalized insights.
        </p>
        <Link
          to="/wizard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-[#F5F5F0] text-sm rounded hover:bg-[#333] transition-colors min-h-[44px]"
        >
          <Wand2 className="w-4 h-4" />
          Start Wizard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Header — score ring, AI greeting, re-run button */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <InsightsSummaryHeader
          overall={data.readiness.overall}
          dimensionCount={data.readiness.dimensions.length}
          insightCount={mergedInsights.length}
          systemsCount={data.project.systems.length}
          aiGreeting={aiGreeting}
          aiSummary={aiSummary}
          onRerun={handleRerun}
          loading={insightsLoading}
        />
      </motion.div>

      {/* Two-column: Radar + Breakdown */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <ReadinessRadar
            dimensions={data.readiness.dimensions}
            overall={data.readiness.overall}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <ReadinessBreakdown readiness={data.readiness} />
        </motion.div>
      </div>

      {/* AI Insights — full detail cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-[Georgia,serif] text-sm sm:text-base font-semibold text-[#1A1A1A]">
            AI Recommendations
          </h3>
          <span className="text-xs text-[#9CA39B]">
            {mergedInsights.length} insight{mergedInsights.length !== 1 ? 's' : ''}
          </span>
        </div>
        <InsightDetailCards insights={mergedInsights} loading={insightsLoading && liveInsights.length === 0} />
      </motion.div>

      {/* Snapshot History */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
      >
        <SnapshotHistory
          currentOverall={data.readiness.overall}
          currentDimensions={data.readiness.dimensions}
          sessionId={data.sessionId}
        />
      </motion.div>

      {/* Back to dashboard */}
      <div className="pt-2">
        <Link
          to="/app/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-[#00875A] hover:underline min-h-[44px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
