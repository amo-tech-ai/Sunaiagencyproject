// H01-DASHBOARD-DATA — Fetches and assembles dashboard data from wizard sessions
// Reads wizard_sessions + wizard_answers via wizardApi, parses ai_results from each step

import { useState, useEffect, useCallback } from 'react';
import { wizardApi } from '../supabase';

export interface DashboardOrg {
  name: string;
  industry: string;
  size: string;
  description: string;
}

export interface ReadinessDimension {
  name: string;
  score: number;
  label: string;
}

export interface ReadinessData {
  overall: number;
  dimensions: ReadinessDimension[];
  strengths: string[];
  gaps: string[];
}

export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  weekRange: string;
  systems: string[];
  deliverables: string[];
  milestones: string[];
  estimatedCost: string;
  status: 'completed' | 'active' | 'upcoming';
  progress: number;
}

export interface ProjectData {
  name: string;
  currentPhase: number;
  totalPhases: number;
  progress: number;
  systems: string[];
  totalInvestment: string;
  totalWeeks: number;
}

export interface ActivityItem {
  id: string;
  action: string;
  detail: string;
  timestamp: string;
  type: 'wizard' | 'project' | 'milestone' | 'ai';
}

export interface InsightItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action?: string;
  actionLabel?: string;
}

export interface DashboardData {
  org: DashboardOrg;
  readiness: ReadinessData;
  project: ProjectData;
  roadmapPhases: RoadmapPhase[];
  activities: ActivityItem[];
  insights: InsightItem[];
  sessionId: string;
  hasWizardData: boolean;
  // Extended roadmap data from step 5 (nested under roadmap key)
  quickWins: string[];
  riskFactors: { risk: string; mitigation: string }[];
  successMetrics: { metric: string; target: string; timeframe: string }[];
}

interface UseDashboardDataReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function parseOrg(step1: Record<string, unknown> | null): DashboardOrg {
  if (!step1) return { name: 'Your Organization', industry: 'Technology', size: 'Unknown', description: '' };
  const analysis = step1.analysis as Record<string, unknown> | undefined;
  const answers = step1 as Record<string, unknown>;
  return {
    name: (answers?.companyName as string) || (analysis?.companySummary as string)?.split(' ')?.[0] || 'Your Organization',
    industry: (answers?.industry as string) || (analysis?.detectedIndustry as string) || 'Technology',
    size: (analysis?.teamSizeEstimate as string) || (answers?.companySize as string) || 'Unknown',
    description: (analysis?.companySummary as string) || '',
  };
}

function parseReadiness(step4: Record<string, unknown> | null): ReadinessData {
  if (!step4) return { overall: 0, dimensions: [], strengths: [], gaps: [] };
  const r = step4 as Record<string, unknown>;
  const dims = (r.dimensions as Array<{ name: string; score: number; label?: string }>) || [];
  return {
    overall: (r.overallScore as number) || (r.overall_score as number) || 0,
    dimensions: dims.map(d => ({ name: d.name, score: d.score, label: d.label || '' })),
    strengths: (r.strengths as string[]) || [],
    gaps: ((r.gaps as Array<{ area?: string; description?: string }>) || []).map(g => g.area || g.description || String(g)),
  };
}

function parseProject(step3: Record<string, unknown> | null, step5: Record<string, unknown> | null): ProjectData {
  const roadmap = step5?.roadmap as Record<string, unknown> | undefined;
  const systems = (step3?.selectedSystems as string[]) ||
    ((step3?.recommendations as Array<{ name: string }>) || []).map(r => r.name).slice(0, 3);
  const phases = (roadmap?.phases as unknown[]) || [];
  return {
    name: (roadmap?.title as string) || 'AI Transformation',
    currentPhase: 1,
    totalPhases: phases.length || 3,
    progress: phases.length > 0 ? Math.round(100 / phases.length * 0.15) : 0,
    systems: systems.length > 0 ? systems : ['AI System'],
    totalInvestment: (roadmap?.totalInvestment as string) || '$0',
    totalWeeks: (roadmap?.totalWeeks as number) || 0,
  };
}

function parsePhases(step5: Record<string, unknown> | null): RoadmapPhase[] {
  const roadmap = step5?.roadmap as Record<string, unknown> | undefined;
  const phases = (roadmap?.phases as Array<Record<string, unknown>>) || [];
  return phases.map((p, i) => ({
    phaseNumber: (p.phaseNumber as number) || i + 1,
    title: (p.title as string) || `Phase ${i + 1}`,
    weekRange: (p.weekRange as string) || '',
    systems: (p.systems as string[]) || [],
    deliverables: (p.deliverables as string[]) || [],
    milestones: (p.milestones as string[]) || [],
    estimatedCost: (p.estimatedCost as string) || '',
    status: i === 0 ? 'active' as const : 'upcoming' as const,
    progress: i === 0 ? 15 : 0,
  }));
}

function buildActivities(answers: Array<{ step_number: number; updated_at: string }>): ActivityItem[] {
  const items: ActivityItem[] = [];
  const stepLabels: Record<number, string> = {
    1: 'Business analysis completed',
    2: 'Industry diagnostics generated',
    3: 'System recommendations reviewed',
    4: 'Readiness assessment scored',
    5: 'Implementation roadmap generated',
  };
  answers.forEach((a) => {
    if (stepLabels[a.step_number]) {
      items.push({
        id: `step-${a.step_number}`,
        action: stepLabels[a.step_number],
        detail: `Wizard Step ${a.step_number}`,
        timestamp: a.updated_at,
        type: a.step_number <= 3 ? 'wizard' : a.step_number === 4 ? 'ai' : 'project',
      });
    }
  });
  return items.reverse();
}

function buildInsights(readiness: ReadinessData, org: DashboardOrg): InsightItem[] {
  const items: InsightItem[] = [];
  if (readiness.overall > 0 && readiness.overall < 60) {
    items.push({
      id: 'low-readiness',
      title: 'Readiness Score Below Threshold',
      description: `Your AI readiness score of ${readiness.overall}/100 suggests foundational work is needed before launching automation. Focus on data readiness and process documentation.`,
      priority: 'high',
      actionLabel: 'View Assessment',
      action: '/app/insights',
    });
  }
  if (readiness.gaps.length > 0) {
    items.push({
      id: 'gap-alert',
      title: `${readiness.gaps.length} Gap${readiness.gaps.length > 1 ? 's' : ''} Identified`,
      description: `Key area: ${readiness.gaps[0]}. Addressing these gaps will significantly improve implementation success rate.`,
      priority: 'medium',
      actionLabel: 'Review Gaps',
      action: '/app/insights',
    });
  }
  items.push({
    id: 'schedule-call',
    title: 'Schedule Your Kickoff Call',
    description: `Book a strategy session with our ${org.industry} AI consultants to review your roadmap and align on Phase 1 priorities.`,
    priority: readiness.overall > 0 ? 'medium' : 'high',
    actionLabel: 'Schedule Call',
    action: '/booking',
  });
  return items;
}

export function useDashboardData(userId: string | null, accessToken: string | null): UseDashboardDataReturn {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stabilize: only care whether user IS authenticated, not the specific token value.
  // The api() helper calls getFreshAccessToken() internally, so we don't need the
  // exact token — just a flag to tell wizardApi "use an authenticated request."
  const isAuthenticated = !!accessToken;

  const fetchData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Pass a sentinel token string — api() will replace it with a fresh token
      // via getFreshAccessToken(). We just need a non-anon-key value to trigger
      // the authenticated path.
      const authToken = isAuthenticated ? 'use-fresh-token' : undefined;

      // 1. List user's sessions
      const listRes = await wizardApi.list(userId, authToken);
      if (listRes.error || !listRes.data?.sessions?.length) {
        setData(null);
        setLoading(false);
        return;
      }

      // 2. Find most recent completed (or furthest along) session
      const sessions = listRes.data.sessions;
      const completed = sessions.find(s => s.status === 'completed') || sessions[0];

      // 3. Load full session data
      const loadRes = await wizardApi.load(completed.id, authToken);
      if (loadRes.error || !loadRes.data) {
        setError(loadRes.error || 'Failed to load session data');
        setLoading(false);
        return;
      }

      const { answers } = loadRes.data;
      const step1 = answers.find(a => a.step_number === 1);
      const step3 = answers.find(a => a.step_number === 3);
      const step4 = answers.find(a => a.step_number === 4);
      const step5 = answers.find(a => a.step_number === 5);

      const org = parseOrg(step1 ? { ...step1.answers, ...(step1.ai_results || {}) } : null);
      const readiness = parseReadiness(step4?.ai_results as Record<string, unknown> || null);
      const project = parseProject(
        step3 ? { ...step3.answers, ...(step3.ai_results || {}) } : null,
        step5?.ai_results as Record<string, unknown> || null
      );
      const roadmapPhases = parsePhases(step5?.ai_results as Record<string, unknown> || null);
      const activities = buildActivities(answers.map(a => ({ step_number: a.step_number, updated_at: a.updated_at })));
      const insights = buildInsights(readiness, org);

      setData({
        org,
        readiness,
        project,
        roadmapPhases,
        activities,
        insights,
        sessionId: completed.id,
        hasWizardData: answers.length > 0,
        // Extended roadmap data from step 5 (nested under roadmap key)
        quickWins: ((step5?.ai_results as Record<string, unknown> | undefined)?.roadmap as Record<string, unknown> | undefined)?.quickWins as string[] || [],
        riskFactors: ((step5?.ai_results as Record<string, unknown> | undefined)?.roadmap as Record<string, unknown> | undefined)?.riskFactors as { risk: string; mitigation: string }[] || [],
        successMetrics: ((step5?.ai_results as Record<string, unknown> | undefined)?.roadmap as Record<string, unknown> | undefined)?.successMetrics as { metric: string; target: string; timeframe: string }[] || [],
      });
    } catch (err) {
      console.error('[useDashboardData] Error:', err);
      setError(`Failed to load dashboard data: ${err}`);
    } finally {
      setLoading(false);
    }
  }, [userId, isAuthenticated]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}