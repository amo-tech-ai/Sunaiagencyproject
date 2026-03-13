// C-AGENT-SYSTEM-MAP — Interactive system mapping diagram
// Shows product areas (left) connected to agent circles (right)
// Color-coded by division, legend for single vs multi-agent calls
// Clean information architecture diagram — pure SVG + React

import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ChevronRight, Info, ZoomIn, ZoomOut } from 'lucide-react';

/* ────────── DATA MODEL ────────── */

interface ProductArea {
  id: string;
  label: string;
  subLabel?: string;
  route: string;
}

interface AgentNode {
  id: string;
  name: string;
  emoji: string;
  division: DivisionKey;
}

type DivisionKey = 'Engineering' | 'Sales' | 'Marketing' | 'Design' | 'PM' | 'Testing' | 'Support';

interface Connection {
  productId: string;
  agentId: string;
  type: 'single' | 'multi' | 'none';
  label?: string;
}

const DIVISION_COLORS: Record<DivisionKey, string> = {
  Engineering: '#3B82F6',
  Sales: '#F59E0B',
  Marketing: '#8B5CF6',
  Design: '#EC4899',
  PM: '#6366F1',
  Testing: '#EF4444',
  Support: '#10B981',
};

const PRODUCT_AREAS: ProductArea[] = [
  { id: 'wizard-3', label: 'Wizard Step 3', subLabel: 'Recommendations', route: '/wizard' },
  { id: 'wizard-4', label: 'Wizard Step 4', subLabel: 'Proposal + Readiness', route: '/wizard' },
  { id: 'wizard-5', label: 'Wizard Step 5', subLabel: 'Roadmap', route: '/wizard' },
  { id: 'dashboard', label: 'Dashboard', subLabel: 'Agent Team Widget', route: '/app/dashboard' },
  { id: 'insights', label: 'Insights', subLabel: 'AI Recommendations', route: '/app/insights' },
  { id: 'crm', label: 'CRM Pipeline', subLabel: 'Deal Scoring', route: '/app/crm/pipelines' },
  { id: 'workflows', label: 'Workflows', subLabel: 'Agent Nodes', route: '/app/workflows' },
  { id: 'financial', label: 'Financial', subLabel: 'Projections', route: '/app/financial' },
  { id: 'strategy', label: 'Strategy', subLabel: 'Canvas Insights', route: '/app/strategy' },
];

const AGENTS: AgentNode[] = [
  { id: 'software-architect', name: 'Software Architect', emoji: '🏗️', division: 'Engineering' },
  { id: 'rapid-prototyper', name: 'Rapid Prototyper', emoji: '🚀', division: 'Engineering' },
  { id: 'project-shepherd', name: 'Project Shepherd', emoji: '🧭', division: 'PM' },
  { id: 'reality-checker', name: 'Reality Checker', emoji: '🔍', division: 'Testing' },
  { id: 'growth-hacker', name: 'Growth Hacker', emoji: '📈', division: 'Marketing' },
  { id: 'finance-tracker', name: 'Finance Tracker', emoji: '💰', division: 'Sales' },
  { id: 'pipeline-analyst', name: 'Pipeline Analyst', emoji: '📊', division: 'Sales' },
  { id: 'deal-strategist', name: 'Deal Strategist', emoji: '🤝', division: 'Sales' },
  { id: 'analytics-reporter', name: 'Analytics Reporter', emoji: '📋', division: 'Engineering' },
  { id: 'content-creator', name: 'Content Creator', emoji: '✍️', division: 'Marketing' },
  { id: 'support-responder', name: 'Support Responder', emoji: '🎧', division: 'Support' },
  { id: 'sprint-prioritizer', name: 'Sprint Prioritizer', emoji: '🎯', division: 'PM' },
  { id: 'trend-researcher', name: 'Trend Researcher', emoji: '🔬', division: 'Marketing' },
];

const CONNECTIONS: Connection[] = [
  // Wizard Step 3
  { productId: 'wizard-3', agentId: 'software-architect', type: 'single', label: 'Primary' },
  { productId: 'wizard-3', agentId: 'rapid-prototyper', type: 'single', label: 'If MVP goal' },
  { productId: 'wizard-3', agentId: 'growth-hacker', type: 'single', label: 'If marketing goal' },
  { productId: 'wizard-3', agentId: 'pipeline-analyst', type: 'single', label: 'If sales goal' },
  // Wizard Step 4
  { productId: 'wizard-4', agentId: 'reality-checker', type: 'multi' },
  { productId: 'wizard-4', agentId: 'finance-tracker', type: 'multi' },
  { productId: 'wizard-4', agentId: 'content-creator', type: 'multi', label: 'Narrative' },
  // Wizard Step 5
  { productId: 'wizard-5', agentId: 'project-shepherd', type: 'single' },
  { productId: 'wizard-5', agentId: 'sprint-prioritizer', type: 'single', label: 'Phasing' },
  // Dashboard
  { productId: 'dashboard', agentId: 'analytics-reporter', type: 'none', label: 'Status only' },
  // Insights
  { productId: 'insights', agentId: 'growth-hacker', type: 'multi' },
  { productId: 'insights', agentId: 'reality-checker', type: 'multi' },
  { productId: 'insights', agentId: 'finance-tracker', type: 'multi' },
  // CRM
  { productId: 'crm', agentId: 'pipeline-analyst', type: 'single' },
  { productId: 'crm', agentId: 'deal-strategist', type: 'single' },
  // Workflows
  { productId: 'workflows', agentId: 'support-responder', type: 'single', label: 'Any agent' },
  // Financial
  { productId: 'financial', agentId: 'finance-tracker', type: 'single' },
  // Strategy
  { productId: 'strategy', agentId: 'growth-hacker', type: 'multi' },
  { productId: 'strategy', agentId: 'trend-researcher', type: 'multi' },
];

/* ────────── LAYOUT CONSTANTS ────────── */

const SVG_W = 960;
const SVG_H = 640;
const PRODUCT_X = 60;
const AGENT_X = 780;
const PRODUCT_W = 200;
const PRODUCT_H = 48;
const AGENT_R = 22;

function getProductY(idx: number, total: number): number {
  const spacing = Math.min(58, (SVG_H - 80) / total);
  const startY = (SVG_H - (total - 1) * spacing) / 2;
  return startY + idx * spacing;
}

function getAgentY(idx: number, total: number): number {
  const spacing = Math.min(44, (SVG_H - 80) / total);
  const startY = (SVG_H - (total - 1) * spacing) / 2;
  return startY + idx * spacing;
}

/* ────────── COMPONENT ────────── */

export default function AgentSystemMap() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const productPositions = useMemo(() =>
    PRODUCT_AREAS.map((p, i) => ({
      ...p,
      x: PRODUCT_X,
      y: getProductY(i, PRODUCT_AREAS.length),
    }))
  , []);

  const agentPositions = useMemo(() =>
    AGENTS.map((a, i) => ({
      ...a,
      cx: AGENT_X,
      cy: getAgentY(i, AGENTS.length),
    }))
  , []);

  const activeConnections = useMemo(() => {
    if (!hoveredProduct && !hoveredAgent) return CONNECTIONS;
    return CONNECTIONS.filter(c =>
      (hoveredProduct && c.productId === hoveredProduct) ||
      (hoveredAgent && c.agentId === hoveredAgent)
    );
  }, [hoveredProduct, hoveredAgent]);

  const dimmedConnections = useMemo(() => {
    if (!hoveredProduct && !hoveredAgent) return new Set<string>();
    const activeSet = new Set(activeConnections.map(c => `${c.productId}-${c.agentId}`));
    return new Set(
      CONNECTIONS.filter(c => !activeSet.has(`${c.productId}-${c.agentId}`))
        .map(c => `${c.productId}-${c.agentId}`)
    );
  }, [activeConnections, hoveredProduct, hoveredAgent]);

  const getConnectionPath = useCallback((conn: Connection) => {
    const product = productPositions.find(p => p.id === conn.productId);
    const agent = agentPositions.find(a => a.id === conn.agentId);
    if (!product || !agent) return '';

    const x1 = product.x + PRODUCT_W;
    const y1 = product.y;
    const x2 = agent.cx - AGENT_R;
    const y2 = agent.cy;
    const mx = (x1 + x2) / 2;

    return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  }, [productPositions, agentPositions]);

  // Count unique divisions used
  const divisionLegend = useMemo(() => {
    const used = new Set(AGENTS.map(a => a.division));
    return Object.entries(DIVISION_COLORS)
      .filter(([key]) => used.has(key as DivisionKey))
      .map(([key, color]) => ({ key, color }));
  }, []);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-5">
        <Link to="/app/dashboard" className="hover:text-[#111827] transition-colors">Dashboard</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/app/agents" className="hover:text-[#111827] transition-colors">Agents</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#111827] font-medium">System Map</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#111827] tracking-tight">
            Agent System Map
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Which agents power which product areas — hover to explore connections
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(z => Math.max(0.6, z - 0.1))}
            className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4 text-[#6B7280]" />
          </button>
          <span className="text-xs text-[#9CA3AF] w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(z => Math.min(1.4, z + 0.1))}
            className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>
      </div>

      {/* Diagram Card */}
      <motion.div
        className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Legend Bar */}
        <div className="flex items-center flex-wrap gap-4 px-5 py-3 border-b border-[#F3F4F6] bg-[#FAFAFA]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">Legend:</span>

          {/* Connection types */}
          <div className="flex items-center gap-1.5">
            <svg width="24" height="12"><line x1="0" y1="6" x2="24" y2="6" stroke="#2563EB" strokeWidth="2" /></svg>
            <span className="text-[11px] text-[#374151]">Single-agent call</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="24" height="12"><line x1="0" y1="6" x2="24" y2="6" stroke="#2563EB" strokeWidth="2" strokeDasharray="4 3" /></svg>
            <span className="text-[11px] text-[#374151]">Multi-agent call</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="24" height="12"><line x1="0" y1="6" x2="24" y2="6" stroke="#D1D5DB" strokeWidth="1.5" strokeDasharray="2 2" /></svg>
            <span className="text-[11px] text-[#374151]">No AI call (read only)</span>
          </div>

          <span className="text-[#E5E7EB]">|</span>

          {/* Division colors */}
          {divisionLegend.map(({ key, color }) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[11px] text-[#374151]">{key}</span>
            </div>
          ))}
        </div>

        {/* SVG Diagram */}
        <div className="overflow-x-auto" style={{ cursor: 'grab' }}>
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            width={SVG_W * zoom}
            height={SVG_H * zoom}
            className="block mx-auto"
            style={{ minWidth: SVG_W * 0.6 }}
          >
            {/* Column Headers */}
            <text x={PRODUCT_X + PRODUCT_W / 2} y={24} textAnchor="middle" fontSize="11" fontWeight="600" fill="#9CA3AF" letterSpacing="0.05em">
              PRODUCT AREAS
            </text>
            <text x={AGENT_X} y={24} textAnchor="middle" fontSize="11" fontWeight="600" fill="#9CA3AF" letterSpacing="0.05em">
              AI AGENTS
            </text>

            {/* Connections */}
            {CONNECTIONS.map(conn => {
              const key = `${conn.productId}-${conn.agentId}`;
              const isDimmed = dimmedConnections.has(key);
              const isActive = activeConnections.includes(conn);
              const strokeColor = conn.type === 'none' ? '#D1D5DB' : '#2563EB';
              const strokeWidth = isActive && (hoveredProduct || hoveredAgent) ? 2.5 : 1.5;
              const dashArray = conn.type === 'multi' ? '6 4' : conn.type === 'none' ? '3 3' : 'none';

              return (
                <path
                  key={key}
                  d={getConnectionPath(conn)}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dashArray}
                  opacity={isDimmed ? 0.08 : (isActive && (hoveredProduct || hoveredAgent)) ? 1 : 0.35}
                  style={{ transition: 'opacity 0.2s, stroke-width 0.2s' }}
                />
              );
            })}

            {/* Product Area Rectangles */}
            {productPositions.map(product => {
              const isHovered = hoveredProduct === product.id;
              const isConnected = hoveredAgent ? activeConnections.some(c => c.productId === product.id) : false;
              const highlight = isHovered || isConnected;

              return (
                <g
                  key={product.id}
                  onMouseEnter={() => { setHoveredProduct(product.id); setHoveredAgent(null); }}
                  onMouseLeave={() => setHoveredProduct(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <rect
                    x={product.x}
                    y={product.y - PRODUCT_H / 2}
                    width={PRODUCT_W}
                    height={PRODUCT_H}
                    rx={10}
                    fill={highlight ? '#EFF6FF' : '#FFFFFF'}
                    stroke={highlight ? '#2563EB' : '#E5E7EB'}
                    strokeWidth={highlight ? 2 : 1}
                    style={{ transition: 'all 0.15s' }}
                  />
                  <text
                    x={product.x + 14}
                    y={product.y - 5}
                    fontSize="12"
                    fontWeight="600"
                    fill={highlight ? '#1E40AF' : '#111827'}
                  >
                    {product.label}
                  </text>
                  {product.subLabel && (
                    <text
                      x={product.x + 14}
                      y={product.y + 10}
                      fontSize="10"
                      fill={highlight ? '#3B82F6' : '#9CA3AF'}
                    >
                      {product.subLabel}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Agent Circles */}
            {agentPositions.map(agent => {
              const isHovered = hoveredAgent === agent.id;
              const isConnected = hoveredProduct ? activeConnections.some(c => c.agentId === agent.id) : false;
              const highlight = isHovered || isConnected;
              const color = DIVISION_COLORS[agent.division] || '#6B7280';

              return (
                <g
                  key={agent.id}
                  onMouseEnter={() => { setHoveredAgent(agent.id); setHoveredProduct(null); }}
                  onMouseLeave={() => setHoveredAgent(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={agent.cx}
                    cy={agent.cy}
                    r={highlight ? AGENT_R + 3 : AGENT_R}
                    fill={highlight ? color + '18' : '#FFFFFF'}
                    stroke={color}
                    strokeWidth={highlight ? 2.5 : 1.5}
                    style={{ transition: 'all 0.15s' }}
                  />
                  <text
                    x={agent.cx}
                    y={agent.cy + 5}
                    textAnchor="middle"
                    fontSize="16"
                  >
                    {agent.emoji}
                  </text>
                  <text
                    x={agent.cx + AGENT_R + 8}
                    y={agent.cy - 3}
                    fontSize="11"
                    fontWeight={highlight ? '600' : '500'}
                    fill={highlight ? '#111827' : '#374151'}
                  >
                    {agent.name}
                  </text>
                  <text
                    x={agent.cx + AGENT_R + 8}
                    y={agent.cy + 10}
                    fontSize="9"
                    fill={color}
                    fontWeight="600"
                  >
                    {agent.division}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </motion.div>

      {/* Info Card */}
      <motion.div
        className="mt-5 bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-[#2563EB] mt-0.5 shrink-0" />
          <div className="text-sm text-[#6B7280] leading-relaxed space-y-2">
            <p>
              <strong className="text-[#111827]">Single-agent calls</strong> use one specialist with context-based augmentation.
              <strong className="text-[#111827]"> Multi-agent calls</strong> run 2-3 agents in parallel and merge outputs.
            </p>
            <p>
              All costs are Gemini Flash pricing. A full wizard session uses ~6 calls (~$0.002).
              Daily dashboard use adds ~4 calls (~$0.001). Negligible at any scale.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}