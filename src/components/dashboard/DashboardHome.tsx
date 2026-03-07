// C82-HOME — Dashboard main overview page
// Mobile-first: compact spacing (space-y-4 → space-y-6 on sm+).
// Assembles WelcomeBanner, MetricsRow, ProjectSummary, Activity, Insights, QuickActions.
// Skeleton loading matches live layout. Error state with retry.
// v0.13.1: Wires live aiApi.dashboardInsights() call with static fallback.

import { useAuth } from '../AuthContext';
import { useDashboardData } from '../../lib/hooks/useDashboardData';
import type { InsightItem } from '../../lib/hooks/useDashboardData';
import { aiApi } from '../../lib/supabase';
import WelcomeBanner from './WelcomeBanner';
import MetricsRow from './MetricsRow';
import ProjectSummaryCard from './ProjectSummaryCard';
import ActivityFeed from './ActivityFeed';
import QuickActionsGrid from './QuickActionsGrid';
import AIInsightsPanel from './AIInsightsPanel';
import EmptyDashboard from './EmptyDashboard';
import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';

export default function DashboardHome() {
  const { user, accessToken } = useAuth();
  const { data, loading, error, refetch } = useDashboardData(user?.id || null, accessToken);

  // Live AI insights state
  const [liveInsights, setLiveInsights] = useState<InsightItem[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const fetchedRef = useRef(false);

  // Fetch live AI insights once dashboard data is available
  // Uses isAuthenticated flag instead of accessToken to avoid refetching on token refresh
  const isAuthenticated = !!accessToken;
  useEffect(() => {
    if (!data || !data.hasWizardData || !isAuthenticated || fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchLiveInsights = async () => {
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
        }, 'use-fresh-token');

        if (res.data?.insights?.insights) {
          const mapped: InsightItem[] = res.data.insights.insights.map((i) => ({
            id: i.id,
            title: i.title,
            description: i.description,
            priority: i.priority,
            actionLabel: i.actionLabel,
            action: i.actionRoute,
          }));
          setLiveInsights(mapped);
          console.log('[DashboardHome] Live AI insights loaded:', mapped.length);
        }
      } catch (err) {
        console.error('[DashboardHome] Live insights fetch failed, using static fallback:', err);
      } finally {
        setInsightsLoading(false);
      }
    };

    fetchLiveInsights();
  }, [data, isAuthenticated]);

  // Merge live + static insights (live first, dedup by id)
  const mergedInsights = (() => {
    if (!data) return [];
    const all = [...liveInsights, ...data.insights];
    const seen = new Set<string>();
    return all.filter(i => {
      if (seen.has(i.id)) return false;
      seen.add(i.id);
      return true;
    });
  })();

  // Loading skeleton — matches live layout structure
  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Skeleton: Welcome Banner */}
        <div className="h-20 sm:h-24 bg-white rounded border border-[#E8E8E4] animate-pulse" />
        {/* Skeleton: Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 sm:h-24 bg-white rounded border border-[#E8E8E4] animate-pulse" />
          ))}
        </div>
        {/* Skeleton: Two columns → stacked on mobile */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="h-52 sm:h-64 bg-white rounded border border-[#E8E8E4] animate-pulse" />
          <div className="h-52 sm:h-64 bg-white rounded border border-[#E8E8E4] animate-pulse" />
        </div>
      </div>
    );
  }

  // Error state with retry
  if (error) {
    return (
      <div className="bg-white rounded border border-[#E8E8E4] p-6 sm:p-8 text-center">
        <p className="text-[#DC2626] text-sm mb-3">Unable to load dashboard data</p>
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
    return <EmptyDashboard />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <WelcomeBanner org={data.org} readiness={data.readiness} />
      </motion.div>

      {/* Metrics Row */}
      <MetricsRow
        readinessScore={data.readiness.overall}
        systemsCount={data.project.systems.length}
        currentPhase={data.project.currentPhase}
        totalPhases={data.project.totalPhases}
        totalInvestment={data.project.totalInvestment}
      />

      {/* Two-column grid: Project + Activity — stacked on mobile */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <ProjectSummaryCard project={data.project} phases={data.roadmapPhases} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <ActivityFeed activities={data.activities} />
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
      >
        <QuickActionsGrid />
      </motion.div>

      {/* AI Insights — live API + static fallback */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <AIInsightsPanel insights={mergedInsights} loading={insightsLoading} />
      </motion.div>
    </div>
  );
}