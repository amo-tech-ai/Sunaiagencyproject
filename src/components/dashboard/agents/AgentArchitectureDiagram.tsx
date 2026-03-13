// C-AGENT-ARCH — Full-stack architecture diagram: Frontend → API → Database
// Blueprint/technical drawing aesthetic: dark navy bg, white/cyan lines
// Three-column layout: components (left), edge routes (center), tables (right)
// Interactive: hover highlights connected data paths across all 3 columns

import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ChevronRight, ZoomIn, ZoomOut, Maximize2, Layers } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════
   DATA MODEL
   ════════════════════════════════════════════════════════════════════ */

interface FrontendNode {
  id: string;
  label: string;
  route?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  group: 'wizard' | 'dashboard' | 'agents' | 'crm' | 'content';
  children?: string[];
}

interface ApiRoute {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  file: string;
  x: number;
  y: number;
  group: 'wizard' | 'ai' | 'agents' | 'crm' | 'docs' | 'workflow' | 'financial' | 'strategy' | 'onboarding';
}

interface DbTable {
  id: string;
  name: string;
  x: number;
  y: number;
  columns: number;
  group: 'core' | 'ai' | 'crm' | 'strategy' | 'onboarding' | 'agents';
}

interface DataFlow {
  id: string;
  from: string;      // frontend node id
  api: string;       // api route id
  to: string;        // db table id
  label?: string;
}

/* ════════════════════════════════════════════════════════════════════
   LAYOUT CONSTANTS
   ════════════════════════════════════════════════════════════════════ */

const COL_FE = 30;        // Frontend column x start
const COL_API = 380;      // API column x start
const COL_DB = 720;       // Database column x start
const SVG_W = 960;
const SVG_H = 1240;
const ROUTE_W = 260;
const ROUTE_H = 20;
const TABLE_W = 170;
const TABLE_H = 32;

/* ════════════════════════════════════════════════════════════════════
   COLORS (Blueprint palette)
   ════════════════════════════════════════════════════════════════════ */

const COLORS = {
  bg: '#0B1628',
  bgLight: '#0F1D32',
  grid: '#162845',
  gridAccent: '#1E3A5F',
  line: '#4DA8DA',
  lineHover: '#7DD3FC',
  lineDim: '#1E3A5F',
  text: '#E2E8F0',
  textDim: '#64748B',
  textAccent: '#7DD3FC',
  border: '#2563EB',
  borderDim: '#1E3A5F',
  nodeFill: '#0F1D32',
  nodeHover: '#162845',
  get: '#22C55E',
  post: '#3B82F6',
  put: '#EAB308',
  delete: '#EF4444',
  patch: '#A855F7',
  groupWizard: '#8B5CF6',
  groupDashboard: '#3B82F6',
  groupAgents: '#06B6D4',
  groupCrm: '#F59E0B',
  groupDocs: '#10B981',
  groupWorkflow: '#EC4899',
  groupFinancial: '#EAB308',
  groupStrategy: '#6366F1',
  groupOnboarding: '#14B8A6',
  groupAi: '#F97316',
  tableCore: '#64748B',
  tableCrm: '#F59E0B',
  tableAi: '#F97316',
  tableStrategy: '#6366F1',
  tableOnboarding: '#14B8A6',
  tableAgents: '#06B6D4',
};

const METHOD_COLORS: Record<string, string> = {
  GET: COLORS.get,
  POST: COLORS.post,
  PUT: COLORS.put,
  DELETE: COLORS.delete,
  PATCH: COLORS.patch,
};

const GROUP_COLORS: Record<string, string> = {
  wizard: COLORS.groupWizard,
  ai: COLORS.groupAi,
  agents: COLORS.groupAgents,
  crm: COLORS.groupCrm,
  docs: COLORS.groupDocs,
  workflow: COLORS.groupWorkflow,
  financial: COLORS.groupFinancial,
  strategy: COLORS.groupStrategy,
  onboarding: COLORS.groupOnboarding,
  dashboard: COLORS.groupDashboard,
  content: COLORS.groupDocs,
};

const TABLE_GROUP_COLORS: Record<string, string> = {
  core: COLORS.tableCore,
  ai: COLORS.tableAi,
  crm: COLORS.tableCrm,
  strategy: COLORS.tableStrategy,
  onboarding: COLORS.tableOnboarding,
  agents: COLORS.tableAgents,
};

/* ════════════════════════════════════════════════════════════════════
   DATA — Frontend Component Tree
   ════════════════════════════════════════════════════════════════════ */

const FRONTEND_NODES: FrontendNode[] = [
  // Wizard cluster
  { id: 'fe-wizard', label: 'WizardPage', route: '/wizard', x: COL_FE, y: 30, w: 300, h: 150, group: 'wizard' },
  { id: 'fe-step1', label: 'StepBusinessContext', x: COL_FE + 12, y: 58, w: 135, h: 22, group: 'wizard' },
  { id: 'fe-step2', label: 'StepIndustryDiag', x: COL_FE + 155, y: 58, w: 135, h: 22, group: 'wizard' },
  { id: 'fe-step3', label: 'StepSystemRecs', x: COL_FE + 12, y: 86, w: 135, h: 22, group: 'wizard' },
  { id: 'fe-step4', label: 'StepExecSummary', x: COL_FE + 155, y: 86, w: 135, h: 22, group: 'wizard' },
  { id: 'fe-step5', label: 'StepLaunchProject', x: COL_FE + 12, y: 114, w: 135, h: 22, group: 'wizard' },
  { id: 'fe-processing', label: 'ProcessingPage', x: COL_FE + 155, y: 114, w: 135, h: 22, group: 'wizard' },
  { id: 'fe-proposal', label: 'ProposalPage', x: COL_FE + 12, y: 142, w: 135, h: 22, group: 'wizard' },

  // Dashboard cluster
  { id: 'fe-dash', label: 'DashboardLayout', route: '/app', x: COL_FE, y: 210, w: 300, h: 38, group: 'dashboard' },
  { id: 'fe-dash-home', label: 'DashboardHome', route: '/app/dashboard', x: COL_FE, y: 258, w: 145, h: 24, group: 'dashboard' },
  { id: 'fe-projects', label: 'ProjectsList', route: '/app/projects', x: COL_FE + 155, y: 258, w: 145, h: 24, group: 'dashboard' },
  { id: 'fe-roadmap', label: 'RoadmapPage', route: '/app/roadmap', x: COL_FE, y: 290, w: 145, h: 24, group: 'dashboard' },
  { id: 'fe-settings', label: 'SettingsPage', route: '/app/settings', x: COL_FE + 155, y: 290, w: 145, h: 24, group: 'dashboard' },
  { id: 'fe-insights', label: 'InsightsPage', route: '/app/insights', x: COL_FE, y: 322, w: 145, h: 24, group: 'dashboard' },

  // CRM cluster
  { id: 'fe-clients', label: 'ClientsListPage', route: '/app/clients', x: COL_FE, y: 370, w: 145, h: 24, group: 'crm' },
  { id: 'fe-client-detail', label: 'ClientDetailPage', route: '/app/clients/:id', x: COL_FE + 155, y: 370, w: 145, h: 24, group: 'crm' },
  { id: 'fe-pipeline', label: 'CRMPipelinePage', route: '/app/crm/pipelines', x: COL_FE, y: 402, w: 300, h: 24, group: 'crm' },

  // Documents + Workflows + Financial
  { id: 'fe-docs', label: 'DocumentMgmtPage', route: '/app/documents', x: COL_FE, y: 450, w: 145, h: 24, group: 'content' },
  { id: 'fe-workflows', label: 'WorkflowAutoPage', route: '/app/workflows', x: COL_FE + 155, y: 450, w: 145, h: 24, group: 'content' },
  { id: 'fe-financial', label: 'FinancialDashPage', route: '/app/financial', x: COL_FE, y: 482, w: 145, h: 24, group: 'content' },
  { id: 'fe-strategy', label: 'StrategyEnginePg', route: '/app/strategy', x: COL_FE + 155, y: 482, w: 145, h: 24, group: 'content' },

  // Agents cluster
  { id: 'fe-agents', label: 'AgentsPage (Monitor)', route: '/app/agents', x: COL_FE, y: 530, w: 300, h: 140, group: 'agents' },
  { id: 'fe-catalog', label: 'AgentCatalogPage', route: '/app/agents/catalog', x: COL_FE + 12, y: 558, w: 135, h: 22, group: 'agents' },
  { id: 'fe-agent-detail', label: 'AgentDetailPage', route: '/app/agents/catalog/:slug', x: COL_FE + 155, y: 558, w: 135, h: 22, group: 'agents' },
  { id: 'fe-runner', label: 'AgentRunnerPage', route: '/app/agents/catalog/:slug/run', x: COL_FE + 12, y: 586, w: 135, h: 22, group: 'agents' },
  { id: 'fe-system-map', label: 'AgentSystemMap', route: '/app/agents/system-map', x: COL_FE + 155, y: 586, w: 135, h: 22, group: 'agents' },
  { id: 'fe-erd', label: 'AgentERDiagram', route: '/app/agents/er-diagram', x: COL_FE + 12, y: 614, w: 135, h: 22, group: 'agents' },
  { id: 'fe-summary-hdr', label: 'AgentSummaryHdr', x: COL_FE + 155, y: 614, w: 135, h: 22, group: 'agents' },
  { id: 'fe-run-hist-tbl', label: 'RunHistoryTable', x: COL_FE + 12, y: 642, w: 135, h: 22, group: 'agents' },

  // Auth
  { id: 'fe-auth', label: 'AuthPage', route: '/auth', x: COL_FE, y: 700, w: 145, h: 24, group: 'dashboard' },
  { id: 'fe-auth-cb', label: 'AuthCallbackPage', route: '/auth/callback', x: COL_FE + 155, y: 700, w: 145, h: 24, group: 'dashboard' },
];

/* ════════════════════════════════════════════════════════════════════
   DATA — API Routes (Edge Functions)
   ════════════════════════════════════════════════════════════════════ */

const API_ROUTES: ApiRoute[] = [
  // Wizard routes
  { id: 'api-wiz-session', method: 'POST', path: '/wizard/session', file: 'wizard-routes', x: COL_API, y: 35, group: 'wizard' },
  { id: 'api-wiz-answers', method: 'POST', path: '/wizard/answers', file: 'wizard-routes', x: COL_API, y: 60, group: 'wizard' },
  { id: 'api-wiz-get', method: 'GET', path: '/wizard/session/:id', file: 'wizard-routes', x: COL_API, y: 85, group: 'wizard' },
  { id: 'api-wiz-status', method: 'PUT', path: '/wizard/session/:id/status', file: 'wizard-routes', x: COL_API, y: 110, group: 'wizard' },

  // AI routes
  { id: 'api-ai-gen', method: 'POST', path: '/ai/generate', file: 'ai-routes', x: COL_API, y: 150, group: 'ai' },
  { id: 'api-sys-rec', method: 'POST', path: '/system-recommendations', file: 'ai-routes', x: COL_API, y: 175, group: 'ai' },
  { id: 'api-readiness', method: 'POST', path: '/readiness-score', file: 'ai-routes', x: COL_API, y: 200, group: 'ai' },
  { id: 'api-roadmap', method: 'POST', path: '/generate-roadmap', file: 'ai-routes', x: COL_API, y: 225, group: 'ai' },
  { id: 'api-diagnostics', method: 'POST', path: '/industry-diagnostics', file: 'ai-routes', x: COL_API, y: 250, group: 'ai' },
  { id: 'api-dash-insights', method: 'POST', path: '/dashboard-insights', file: 'index (direct)', x: COL_API, y: 275, group: 'ai' },
  { id: 'api-ai-cache', method: 'GET', path: '/ai/cache', file: 'ai-routes', x: COL_API, y: 300, group: 'ai' },

  // Agent routes
  { id: 'api-agent-run', method: 'POST', path: '/agents/run', file: 'agent-routes', x: COL_API, y: 340, group: 'agents' },
  { id: 'api-agent-match', method: 'POST', path: '/agents/match', file: 'agent-routes', x: COL_API, y: 365, group: 'agents' },
  { id: 'api-agent-hist', method: 'GET', path: '/agents/history/:slug', file: 'agent-routes', x: COL_API, y: 390, group: 'agents' },

  // CRM routes
  { id: 'api-crm-clients', method: 'GET', path: '/crm/clients', file: 'crm-routes', x: COL_API, y: 430, group: 'crm' },
  { id: 'api-crm-client-c', method: 'POST', path: '/crm/clients', file: 'crm-routes', x: COL_API, y: 455, group: 'crm' },
  { id: 'api-crm-client-u', method: 'PUT', path: '/crm/clients/:id', file: 'crm-routes', x: COL_API, y: 480, group: 'crm' },
  { id: 'api-pipelines', method: 'GET', path: '/crm/pipelines', file: 'pipeline-routes', x: COL_API, y: 505, group: 'crm' },
  { id: 'api-deals', method: 'POST', path: '/crm/deals', file: 'pipeline-routes', x: COL_API, y: 530, group: 'crm' },
  { id: 'api-deal-move', method: 'PUT', path: '/crm/deals/:id/move', file: 'pipeline-routes', x: COL_API, y: 555, group: 'crm' },

  // Document routes
  { id: 'api-doc-upload', method: 'POST', path: '/documents/upload', file: 'document-routes', x: COL_API, y: 595, group: 'docs' },
  { id: 'api-doc-list', method: 'GET', path: '/documents/list', file: 'document-routes', x: COL_API, y: 620, group: 'docs' },
  { id: 'api-doc-del', method: 'DELETE', path: '/documents/:id', file: 'document-routes', x: COL_API, y: 645, group: 'docs' },

  // Workflow routes
  { id: 'api-wf-list', method: 'GET', path: '/workflows', file: 'workflow-routes', x: COL_API, y: 685, group: 'workflow' },
  { id: 'api-wf-create', method: 'POST', path: '/workflows', file: 'workflow-routes', x: COL_API, y: 710, group: 'workflow' },
  { id: 'api-wf-run', method: 'POST', path: '/workflows/:id/run', file: 'workflow-routes', x: COL_API, y: 735, group: 'workflow' },

  // Financial routes
  { id: 'api-fin-invoices', method: 'GET', path: '/financial/invoices', file: 'financial-routes', x: COL_API, y: 775, group: 'financial' },
  { id: 'api-fin-create', method: 'POST', path: '/financial/invoices', file: 'financial-routes', x: COL_API, y: 800, group: 'financial' },
  { id: 'api-fin-metrics', method: 'GET', path: '/financial/metrics', file: 'financial-routes', x: COL_API, y: 825, group: 'financial' },

  // Strategy routes
  { id: 'api-str-canvas', method: 'POST', path: '/strategy/canvas', file: 'strategy-routes', x: COL_API, y: 865, group: 'strategy' },
  { id: 'api-str-get', method: 'GET', path: '/strategy/canvas/:id', file: 'strategy-routes', x: COL_API, y: 890, group: 'strategy' },
  { id: 'api-str-analyze', method: 'POST', path: '/strategy/analyze', file: 'strategy-routes', x: COL_API, y: 915, group: 'strategy' },
  { id: 'api-str-synth', method: 'POST', path: '/strategy/synthesize-block', file: 'strategy-routes', x: COL_API, y: 940, group: 'strategy' },

  // Onboarding routes
  { id: 'api-onb-complete', method: 'POST', path: '/onboarding/complete', file: 'onboarding-routes', x: COL_API, y: 980, group: 'onboarding' },
  { id: 'api-onb-status', method: 'GET', path: '/onboarding/status/:id', file: 'onboarding-routes', x: COL_API, y: 1005, group: 'onboarding' },

  // Auth + health
  { id: 'api-signup', method: 'POST', path: '/signup', file: 'index', x: COL_API, y: 1045, group: 'wizard' },
  { id: 'api-health', method: 'GET', path: '/health', file: 'index', x: COL_API, y: 1070, group: 'wizard' },
];

/* ════════════════════════════════════════════════════════════════════
   DATA — Database Tables
   ════════════════════════════════════════════════════════════════════ */

const DB_TABLES: DbTable[] = [
  // Core
  { id: 'db-kv', name: 'kv_store_283466b6', x: COL_DB, y: 40, columns: 4, group: 'core' },

  // AI
  { id: 'db-ai-logs', name: 'ai_run_logs', x: COL_DB, y: 100, columns: 10, group: 'ai' },
  { id: 'db-ai-cache', name: 'ai_cache', x: COL_DB, y: 140, columns: 6, group: 'ai' },

  // Wizard
  { id: 'db-wiz-sessions', name: 'wizard_sessions', x: COL_DB, y: 200, columns: 8, group: 'core' },
  { id: 'db-wiz-answers', name: 'wizard_answers', x: COL_DB, y: 240, columns: 6, group: 'core' },

  // CRM
  { id: 'db-clients', name: 'clients', x: COL_DB, y: 310, columns: 12, group: 'crm' },
  { id: 'db-pipelines', name: 'crm_pipelines', x: COL_DB, y: 350, columns: 6, group: 'crm' },
  { id: 'db-stages', name: 'crm_stages', x: COL_DB, y: 390, columns: 8, group: 'crm' },
  { id: 'db-deals', name: 'crm_deals', x: COL_DB, y: 430, columns: 14, group: 'crm' },
  { id: 'db-interactions', name: 'crm_interactions', x: COL_DB, y: 470, columns: 8, group: 'crm' },

  // Strategy (12 tables — show key ones)
  { id: 'db-canvases', name: 'lean_canvases', x: COL_DB, y: 540, columns: 10, group: 'strategy' },
  { id: 'db-canvas-ver', name: 'lean_canvas_versions', x: COL_DB, y: 580, columns: 6, group: 'strategy' },
  { id: 'db-str-insights', name: 'strategy_insights', x: COL_DB, y: 620, columns: 8, group: 'strategy' },
  { id: 'db-str-recs', name: 'strategy_recommendations', x: COL_DB, y: 660, columns: 10, group: 'strategy' },
  { id: 'db-str-opps', name: 'automation_opportunities', x: COL_DB, y: 700, columns: 8, group: 'strategy' },
  { id: 'db-str-actions', name: 'strategy_actions', x: COL_DB, y: 740, columns: 6, group: 'strategy' },

  // Onboarding
  { id: 'db-projects', name: 'projects', x: COL_DB, y: 810, columns: 12, group: 'onboarding' },
  { id: 'db-roadmaps', name: 'roadmaps', x: COL_DB, y: 850, columns: 8, group: 'onboarding' },
  { id: 'db-phases', name: 'roadmap_phases', x: COL_DB, y: 890, columns: 10, group: 'onboarding' },
  { id: 'db-activities', name: 'activities', x: COL_DB, y: 930, columns: 6, group: 'onboarding' },

  // Future Agent tables (dashed)
  { id: 'db-agent-catalog', name: 'agent_catalog', x: COL_DB, y: 1000, columns: 14, group: 'agents' },
  { id: 'db-agent-assign', name: 'agent_assignments', x: COL_DB, y: 1040, columns: 9, group: 'agents' },
  { id: 'db-agent-runs', name: 'agent_runs', x: COL_DB, y: 1080, columns: 13, group: 'agents' },
  { id: 'db-agent-outputs', name: 'agent_outputs', x: COL_DB, y: 1120, columns: 9, group: 'agents' },
  { id: 'db-insight-cards', name: 'insight_cards', x: COL_DB, y: 1160, columns: 11, group: 'agents' },
];

/* ════════════════════════════════════════════════════════════════════
   DATA — Data Flow Connections
   ════════════════════════════════════════════════════════════════════ */

const DATA_FLOWS: DataFlow[] = [
  // Wizard → API → DB
  { id: 'f-wiz-session', from: 'fe-step1', api: 'api-wiz-session', to: 'db-wiz-sessions' },
  { id: 'f-wiz-answers', from: 'fe-step1', api: 'api-wiz-answers', to: 'db-wiz-answers' },
  { id: 'f-wiz-sysrec', from: 'fe-step3', api: 'api-sys-rec', to: 'db-ai-logs' },
  { id: 'f-wiz-readiness', from: 'fe-step4', api: 'api-readiness', to: 'db-ai-logs' },
  { id: 'f-wiz-roadmap', from: 'fe-step5', api: 'api-roadmap', to: 'db-ai-logs' },
  { id: 'f-wiz-diag', from: 'fe-step2', api: 'api-diagnostics', to: 'db-ai-logs' },
  { id: 'f-wiz-onboard', from: 'fe-step5', api: 'api-onb-complete', to: 'db-projects' },

  // Dashboard → API → DB
  { id: 'f-dash-insights', from: 'fe-insights', api: 'api-dash-insights', to: 'db-ai-logs' },

  // Agent catalog → API → DB
  { id: 'f-agent-run', from: 'fe-runner', api: 'api-agent-run', to: 'db-ai-logs' },
  { id: 'f-agent-match', from: 'fe-catalog', api: 'api-agent-match', to: 'db-ai-logs' },
  { id: 'f-agent-hist', from: 'fe-agent-detail', api: 'api-agent-hist', to: 'db-ai-logs' },

  // CRM → API → DB
  { id: 'f-crm-clients', from: 'fe-clients', api: 'api-crm-clients', to: 'db-clients' },
  { id: 'f-crm-pipeline', from: 'fe-pipeline', api: 'api-pipelines', to: 'db-pipelines' },
  { id: 'f-crm-deals', from: 'fe-pipeline', api: 'api-deals', to: 'db-deals' },

  // Documents → API → Storage
  { id: 'f-doc-upload', from: 'fe-docs', api: 'api-doc-upload', to: 'db-kv' },

  // Workflows → API → KV
  { id: 'f-wf-list', from: 'fe-workflows', api: 'api-wf-list', to: 'db-kv' },

  // Financial → API → KV
  { id: 'f-fin-invoices', from: 'fe-financial', api: 'api-fin-invoices', to: 'db-kv' },

  // Strategy → API → DB
  { id: 'f-str-canvas', from: 'fe-strategy', api: 'api-str-canvas', to: 'db-canvases' },
  { id: 'f-str-analyze', from: 'fe-strategy', api: 'api-str-analyze', to: 'db-str-insights' },

  // Auth
  { id: 'f-auth-signup', from: 'fe-auth', api: 'api-signup', to: 'db-kv' },
];

/* ════════════════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════════════════ */

export default function AgentArchitectureDiagram() {
  const [hoveredFlow, setHoveredFlow] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0.85);
  const [selectedApi, setSelectedApi] = useState<string | null>(null);

  // Determine which flows are active based on hover
  const activeFlows = useMemo(() => {
    if (hoveredFlow) return new Set([hoveredFlow]);
    if (hoveredNode) {
      return new Set(
        DATA_FLOWS
          .filter(f => f.from === hoveredNode || f.api === hoveredNode || f.to === hoveredNode)
          .map(f => f.id)
      );
    }
    return new Set<string>();
  }, [hoveredFlow, hoveredNode]);

  const activeNodes = useMemo(() => {
    const set = new Set<string>();
    if (hoveredNode) set.add(hoveredNode);
    DATA_FLOWS.forEach(f => {
      if (activeFlows.has(f.id)) {
        set.add(f.from);
        set.add(f.api);
        set.add(f.to);
      }
    });
    return set;
  }, [activeFlows, hoveredNode]);

  const anyHighlight = hoveredFlow !== null || hoveredNode !== null;

  // Build arrow paths from frontend → API → DB
  const getFlowPaths = useCallback((flow: DataFlow) => {
    const feNode = FRONTEND_NODES.find(n => n.id === flow.from);
    const apiRoute = API_ROUTES.find(r => r.id === flow.api);
    const dbTable = DB_TABLES.find(t => t.id === flow.to);
    if (!feNode || !apiRoute || !dbTable) return { path1: '', path2: '' };

    // Frontend right edge → API left edge
    const fe_x = feNode.x + feNode.w;
    const fe_y = feNode.y + feNode.h / 2;
    const api_lx = apiRoute.x;
    const api_y = apiRoute.y + ROUTE_H / 2;
    const cp1 = (fe_x + api_lx) / 2;
    const path1 = `M ${fe_x} ${fe_y} C ${cp1} ${fe_y}, ${cp1} ${api_y}, ${api_lx} ${api_y}`;

    // API right edge → DB left edge
    const api_rx = apiRoute.x + ROUTE_W;
    const db_x = dbTable.x;
    const db_y = dbTable.y + TABLE_H / 2;
    const cp2 = (api_rx + db_x) / 2;
    const path2 = `M ${api_rx} ${api_y} C ${cp2} ${api_y}, ${cp2} ${db_y}, ${db_x} ${db_y}`;

    return { path1, path2 };
  }, []);

  const selectedApiData = selectedApi ? API_ROUTES.find(r => r.id === selectedApi) : null;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-5">
        <Link to="/app/dashboard" className="hover:text-[#111827] transition-colors">Dashboard</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/app/agents" className="hover:text-[#111827] transition-colors">Agents</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#111827] font-medium">Architecture</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#111827] tracking-tight flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-[#2563EB]" />
            System Architecture
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Full-stack data flow: {FRONTEND_NODES.length} components &rarr; {API_ROUTES.length} API routes &rarr; {DB_TABLES.length} database tables
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom(z => Math.max(0.4, z - 0.1))} className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors" aria-label="Zoom out">
            <ZoomOut className="w-4 h-4 text-[#6B7280]" />
          </button>
          <span className="text-xs text-[#9CA3AF] w-10 text-center font-mono">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors" aria-label="Zoom in">
            <ZoomIn className="w-4 h-4 text-[#6B7280]" />
          </button>
          <button onClick={() => setZoom(0.85)} className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors" aria-label="Reset">
            <Maximize2 className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <motion.div
        className="flex items-center flex-wrap gap-4 mb-5 px-4 py-2.5 bg-[#0B1628] rounded-xl border border-[#1E3A5F] shadow-sm"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#64748B]">Legend</span>
        {['GET', 'POST', 'PUT', 'DELETE'].map(m => (
          <div key={m} className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-2 rounded-sm" style={{ background: METHOD_COLORS[m] }} />
            <span className="text-[10px] font-mono text-[#94A3B8]">{m}</span>
          </div>
        ))}
        <div className="h-3 w-px bg-[#1E3A5F]" />
        {[
          { label: 'Wizard', color: COLORS.groupWizard },
          { label: 'AI', color: COLORS.groupAi },
          { label: 'Agents', color: COLORS.groupAgents },
          { label: 'CRM', color: COLORS.groupCrm },
          { label: 'Strategy', color: COLORS.groupStrategy },
          { label: 'Onboarding', color: COLORS.groupOnboarding },
        ].map(g => (
          <div key={g.label} className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: g.color }} />
            <span className="text-[10px] text-[#94A3B8]">{g.label}</span>
          </div>
        ))}
        <div className="h-3 w-px bg-[#1E3A5F]" />
        <span className="text-[10px] text-[#64748B] italic">Hover any element to trace its data path</span>
      </motion.div>

      {/* Main Diagram */}
      <motion.div
        className="rounded-xl border border-[#1E3A5F] overflow-hidden shadow-lg"
        style={{ background: COLORS.bg }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="overflow-auto">
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            width={SVG_W * zoom}
            height={SVG_H * zoom}
            className="block mx-auto"
            style={{ minWidth: 600 }}
          >
            <defs>
              {/* Blueprint grid */}
              <pattern id="arch-grid-sm" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke={COLORS.grid} strokeWidth="0.3" />
              </pattern>
              <pattern id="arch-grid-lg" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#arch-grid-sm)" />
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke={COLORS.gridAccent} strokeWidth="0.5" />
              </pattern>
              {/* Arrow markers */}
              <marker id="arch-arrow" viewBox="0 0 8 6" refX="7" refY="3" markerWidth="7" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 8 3 L 0 6 z" fill={COLORS.line} />
              </marker>
              <marker id="arch-arrow-dim" viewBox="0 0 8 6" refX="7" refY="3" markerWidth="7" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 8 3 L 0 6 z" fill={COLORS.lineDim} />
              </marker>
              <marker id="arch-arrow-bright" viewBox="0 0 8 6" refX="7" refY="3" markerWidth="7" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 8 3 L 0 6 z" fill={COLORS.lineHover} />
              </marker>
            </defs>

            {/* Background */}
            <rect width={SVG_W} height={SVG_H} fill="url(#arch-grid-lg)" />

            {/* Column headers */}
            <text x={COL_FE + 150} y={18} textAnchor="middle" fontSize="11" fontWeight="700" fill={COLORS.textAccent} fontFamily="monospace" letterSpacing="2">
              FRONTEND COMPONENTS
            </text>
            <text x={COL_API + ROUTE_W / 2} y={18} textAnchor="middle" fontSize="11" fontWeight="700" fill={COLORS.textAccent} fontFamily="monospace" letterSpacing="2">
              API ROUTES ({API_ROUTES.length})
            </text>
            <text x={COL_DB + TABLE_W / 2} y={18} textAnchor="middle" fontSize="11" fontWeight="700" fill={COLORS.textAccent} fontFamily="monospace" letterSpacing="2">
              DATABASE ({DB_TABLES.length})
            </text>

            {/* Column separator lines */}
            <line x1={COL_API - 15} y1={24} x2={COL_API - 15} y2={SVG_H - 10} stroke={COLORS.gridAccent} strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1={COL_DB - 15} y1={24} x2={COL_DB - 15} y2={SVG_H - 10} stroke={COLORS.gridAccent} strokeWidth="0.5" strokeDasharray="4 4" />

            {/* ── DATA FLOW ARROWS ── */}
            {DATA_FLOWS.map(flow => {
              const { path1, path2 } = getFlowPaths(flow);
              const isActive = activeFlows.has(flow.id);
              const dimmed = anyHighlight && !isActive;

              return (
                <g key={flow.id}>
                  {/* Frontend → API */}
                  <path
                    d={path1}
                    fill="none"
                    stroke={isActive ? COLORS.lineHover : dimmed ? COLORS.lineDim : COLORS.line}
                    strokeWidth={isActive ? 1.8 : 0.7}
                    markerEnd={isActive ? 'url(#arch-arrow-bright)' : dimmed ? 'url(#arch-arrow-dim)' : 'url(#arch-arrow)'}
                    opacity={dimmed ? 0.15 : isActive ? 1 : 0.3}
                    style={{ transition: 'opacity 0.2s, stroke-width 0.2s' }}
                  />
                  {/* API → DB */}
                  <path
                    d={path2}
                    fill="none"
                    stroke={isActive ? COLORS.lineHover : dimmed ? COLORS.lineDim : COLORS.line}
                    strokeWidth={isActive ? 1.8 : 0.7}
                    markerEnd={isActive ? 'url(#arch-arrow-bright)' : dimmed ? 'url(#arch-arrow-dim)' : 'url(#arch-arrow)'}
                    opacity={dimmed ? 0.15 : isActive ? 1 : 0.3}
                    style={{ transition: 'opacity 0.2s, stroke-width 0.2s' }}
                  />
                </g>
              );
            })}

            {/* ── FRONTEND NODES ── */}
            {FRONTEND_NODES.map(node => {
              const isParent = ['fe-wizard', 'fe-dash', 'fe-agents'].includes(node.id);
              const dimmed = anyHighlight && !activeNodes.has(node.id);
              const isActive = activeNodes.has(node.id) && anyHighlight;
              const color = GROUP_COLORS[node.group] || COLORS.line;

              return (
                <g
                  key={node.id}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ cursor: 'pointer' }}
                  opacity={dimmed ? 0.2 : 1}
                >
                  <rect
                    x={node.x}
                    y={node.y}
                    width={node.w}
                    height={node.h}
                    rx={isParent ? 6 : 3}
                    fill={isActive ? `${color}15` : isParent ? `${color}08` : 'transparent'}
                    stroke={isActive ? color : dimmed ? COLORS.borderDim : `${color}60`}
                    strokeWidth={isActive ? 1.5 : isParent ? 1 : 0.6}
                    strokeDasharray={isParent ? 'none' : 'none'}
                    style={{ transition: 'stroke 0.15s, fill 0.15s' }}
                  />
                  <text
                    x={isParent ? node.x + 10 : node.x + node.w / 2}
                    y={isParent ? node.y + 17 : node.y + node.h / 2 + 4}
                    textAnchor={isParent ? 'start' : 'middle'}
                    fontSize={isParent ? 11 : 8.5}
                    fontWeight={isParent ? '700' : '400'}
                    fill={isActive ? COLORS.lineHover : dimmed ? COLORS.textDim : COLORS.text}
                    fontFamily="'JetBrains Mono', monospace"
                  >
                    {node.label}
                  </text>
                  {/* Route badge for parents */}
                  {isParent && node.route && (
                    <text
                      x={node.x + node.w - 8}
                      y={node.y + 17}
                      textAnchor="end"
                      fontSize="8"
                      fill={`${color}90`}
                      fontFamily="monospace"
                    >
                      {node.route}
                    </text>
                  )}
                </g>
              );
            })}

            {/* ── API ROUTE BARS ── */}
            {API_ROUTES.map(route => {
              const dimmed = anyHighlight && !activeNodes.has(route.id);
              const isActive = activeNodes.has(route.id) && anyHighlight;
              const methodColor = METHOD_COLORS[route.method] || COLORS.line;
              const groupColor = GROUP_COLORS[route.group] || COLORS.line;

              return (
                <g
                  key={route.id}
                  onMouseEnter={() => setHoveredNode(route.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setSelectedApi(s => s === route.id ? null : route.id)}
                  style={{ cursor: 'pointer' }}
                  opacity={dimmed ? 0.2 : 1}
                >
                  {/* Bar background */}
                  <rect
                    x={route.x}
                    y={route.y}
                    width={ROUTE_W}
                    height={ROUTE_H}
                    rx={3}
                    fill={isActive ? `${groupColor}20` : COLORS.nodeFill}
                    stroke={isActive ? groupColor : dimmed ? COLORS.borderDim : `${groupColor}40`}
                    strokeWidth={isActive ? 1.2 : 0.5}
                    style={{ transition: 'stroke 0.15s, fill 0.15s' }}
                  />
                  {/* Method badge */}
                  <rect
                    x={route.x + 3}
                    y={route.y + 3}
                    width={route.method.length * 6 + 6}
                    height={14}
                    rx={2}
                    fill={`${methodColor}25`}
                  />
                  <text
                    x={route.x + 6}
                    y={route.y + 14}
                    fontSize="7.5"
                    fontWeight="700"
                    fill={methodColor}
                    fontFamily="monospace"
                  >
                    {route.method}
                  </text>
                  {/* Path */}
                  <text
                    x={route.x + route.method.length * 6 + 14}
                    y={route.y + 14}
                    fontSize="8"
                    fill={isActive ? COLORS.lineHover : COLORS.text}
                    fontFamily="monospace"
                    opacity={dimmed ? 0.4 : 0.9}
                  >
                    {route.path}
                  </text>
                </g>
              );
            })}

            {/* ── DATABASE TABLES ── */}
            {DB_TABLES.map(table => {
              const dimmed = anyHighlight && !activeNodes.has(table.id);
              const isActive = activeNodes.has(table.id) && anyHighlight;
              const color = TABLE_GROUP_COLORS[table.group] || COLORS.tableCore;
              const isFuture = table.group === 'agents';

              return (
                <g
                  key={table.id}
                  onMouseEnter={() => setHoveredNode(table.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ cursor: 'pointer' }}
                  opacity={dimmed ? 0.2 : 1}
                >
                  <rect
                    x={table.x}
                    y={table.y}
                    width={TABLE_W}
                    height={TABLE_H}
                    rx={4}
                    fill={isActive ? `${color}15` : COLORS.nodeFill}
                    stroke={isActive ? color : dimmed ? COLORS.borderDim : `${color}50`}
                    strokeWidth={isActive ? 1.3 : 0.6}
                    strokeDasharray={isFuture ? '4 2' : 'none'}
                    style={{ transition: 'stroke 0.15s, fill 0.15s' }}
                  />
                  {/* Table icon */}
                  <rect x={table.x + 6} y={table.y + 6} width={12} height={9} rx={1.5} fill="none" stroke={color} strokeWidth="0.8" />
                  <line x1={table.x + 6} y1={table.y + 10} x2={table.x + 18} y2={table.y + 10} stroke={color} strokeWidth="0.5" />
                  <line x1={table.x + 12} y1={table.y + 6} x2={table.x + 12} y2={table.y + 15} stroke={color} strokeWidth="0.5" />
                  {/* Table name */}
                  <text
                    x={table.x + 24}
                    y={table.y + 14}
                    fontSize="8.5"
                    fontWeight="600"
                    fill={isActive ? COLORS.lineHover : COLORS.text}
                    fontFamily="monospace"
                  >
                    {table.name}
                  </text>
                  {/* Column count */}
                  <text
                    x={table.x + TABLE_W - 8}
                    y={table.y + 26}
                    textAnchor="end"
                    fontSize="7"
                    fill={COLORS.textDim}
                    fontFamily="monospace"
                  >
                    {table.columns} cols
                  </text>
                  {/* Future badge */}
                  {isFuture && (
                    <text
                      x={table.x + 24}
                      y={table.y + 26}
                      fontSize="6.5"
                      fill={`${color}80`}
                      fontFamily="monospace"
                      fontStyle="italic"
                    >
                      planned
                    </text>
                  )}
                </g>
              );
            })}

            {/* Group labels in DB column */}
            {[
              { label: 'CORE', y: 32, color: COLORS.tableCore },
              { label: 'AI / GEMINI', y: 92, color: COLORS.tableAi },
              { label: 'WIZARD', y: 192, color: COLORS.tableCore },
              { label: 'CRM', y: 302, color: COLORS.tableCrm },
              { label: 'STRATEGY ENGINE (12 tables)', y: 532, color: COLORS.tableStrategy },
              { label: 'ONBOARDING', y: 802, color: COLORS.tableOnboarding },
              { label: 'AGENT SYSTEM (planned)', y: 992, color: COLORS.tableAgents },
            ].map(g => (
              <text
                key={g.label}
                x={COL_DB + TABLE_W + 4}
                y={g.y + 10}
                fontSize="6"
                fontWeight="700"
                fill={g.color}
                fontFamily="monospace"
                letterSpacing="1.5"
                opacity={0.6}
                transform={`rotate(90 ${COL_DB + TABLE_W + 4} ${g.y + 10})`}
              >
                {g.label}
              </text>
            ))}

            {/* API group labels */}
            {[
              { label: 'wizard-routes.tsx', y: 30, color: COLORS.groupWizard },
              { label: 'ai-routes.tsx', y: 145, color: COLORS.groupAi },
              { label: 'agent-routes.tsx', y: 335, color: COLORS.groupAgents },
              { label: 'crm + pipeline-routes.tsx', y: 425, color: COLORS.groupCrm },
              { label: 'document-routes.tsx', y: 590, color: COLORS.groupDocs },
              { label: 'workflow-routes.tsx', y: 680, color: COLORS.groupWorkflow },
              { label: 'financial-routes.tsx', y: 770, color: COLORS.groupFinancial },
              { label: 'strategy-routes.tsx', y: 860, color: COLORS.groupStrategy },
              { label: 'onboarding-routes.tsx', y: 975, color: COLORS.groupOnboarding },
              { label: 'index.tsx (direct)', y: 1040, color: COLORS.textDim },
            ].map(g => (
              <text
                key={g.label}
                x={COL_API + ROUTE_W + 4}
                y={g.y + 2}
                fontSize="6"
                fill={g.color}
                fontFamily="monospace"
                opacity={0.5}
              >
                {g.label}
              </text>
            ))}

            {/* Stats footer */}
            <rect x={10} y={SVG_H - 50} width={SVG_W - 20} height={40} rx={6} fill={COLORS.bgLight} stroke={COLORS.gridAccent} strokeWidth="0.5" />
            <text x={30} y={SVG_H - 26} fontSize="9" fill={COLORS.textAccent} fontFamily="monospace" fontWeight="700">
              SYSTEM TOTALS
            </text>
            {[
              { label: 'Components', value: FRONTEND_NODES.length.toString(), x: 200 },
              { label: 'Edge Routes', value: API_ROUTES.length.toString(), x: 340 },
              { label: 'DB Tables', value: DB_TABLES.length.toString(), x: 480 },
              { label: 'Data Flows', value: DATA_FLOWS.length.toString(), x: 620 },
              { label: 'Server Files', value: '13', x: 760 },
            ].map(s => (
              <g key={s.label}>
                <text x={s.x} y={SVG_H - 32} fontSize="7" fill={COLORS.textDim} fontFamily="monospace" textAnchor="middle">{s.label}</text>
                <text x={s.x} y={SVG_H - 20} fontSize="13" fill={COLORS.text} fontFamily="monospace" fontWeight="700" textAnchor="middle">{s.value}</text>
              </g>
            ))}
          </svg>
        </div>
      </motion.div>

      {/* Selected API detail panel */}
      {selectedApiData && (
        <motion.div
          className="mt-4 rounded-xl border border-[#1E3A5F] overflow-hidden shadow-sm"
          style={{ background: COLORS.bg }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="px-5 py-3 border-b border-[#1E3A5F] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded font-mono"
                style={{ background: `${METHOD_COLORS[selectedApiData.method]}25`, color: METHOD_COLORS[selectedApiData.method] }}
              >
                {selectedApiData.method}
              </span>
              <code className="text-sm text-[#E2E8F0] font-mono">{selectedApiData.path}</code>
            </div>
            <button onClick={() => setSelectedApi(null)} className="text-xs text-[#64748B] hover:text-[#E2E8F0] transition-colors font-mono">
              Close
            </button>
          </div>
          <div className="px-5 py-3 grid grid-cols-3 gap-6 text-xs">
            <div>
              <span className="text-[10px] text-[#64748B] font-mono uppercase tracking-wider">Source File</span>
              <p className="text-[#E2E8F0] font-mono mt-1">{selectedApiData.file}.tsx</p>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] font-mono uppercase tracking-wider">Group</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full" style={{ background: GROUP_COLORS[selectedApiData.group] || COLORS.line }} />
                <span className="text-[#E2E8F0] font-mono capitalize">{selectedApiData.group}</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] font-mono uppercase tracking-wider">Connected To</span>
              <div className="mt-1 space-y-0.5">
                {DATA_FLOWS.filter(f => f.api === selectedApiData.id).map(f => {
                  const feNode = FRONTEND_NODES.find(n => n.id === f.from);
                  const dbTable = DB_TABLES.find(t => t.id === f.to);
                  return (
                    <p key={f.id} className="text-[#94A3B8] font-mono text-[11px]">
                      {feNode?.label} &rarr; {dbTable?.name}
                    </p>
                  );
                })}
                {DATA_FLOWS.filter(f => f.api === selectedApiData.id).length === 0 && (
                  <p className="text-[#64748B] font-mono italic">No mapped flows</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats summary */}
      <motion.div
        className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {[
          { label: 'Frontend Components', value: FRONTEND_NODES.length, color: '#3B82F6' },
          { label: 'API Routes', value: API_ROUTES.length, color: '#22C55E' },
          { label: 'Database Tables', value: DB_TABLES.length, color: '#F59E0B' },
          { label: 'Data Flow Paths', value: DATA_FLOWS.length, color: '#8B5CF6' },
          { label: 'Server Files', value: 13, color: '#06B6D4' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-[#E5E7EB] p-4 text-center shadow-sm">
            <p className="text-2xl font-semibold text-[#111827]">{s.value}</p>
            <p className="text-[11px] text-[#6B7280] mt-0.5">{s.label}</p>
            <div className="mt-2 h-0.5 rounded-full mx-auto w-8" style={{ background: s.color }} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
