// C-AGENT-ERD — Entity-Relationship Diagram for Agent data model
// 5 tables as white cards with monospace columns, connected by 1:N arrows
// Clean technical documentation style, interactive hover highlights

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ChevronRight, ZoomIn, ZoomOut, Maximize2, Info, Database } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════
   DATA MODEL — Tables, Columns, Relationships
   ════════════════════════════════════════════════════════════════════ */

interface Column {
  name: string;
  type: string;
  pk?: boolean;
  fk?: boolean;
  nullable?: boolean;
}

interface Table {
  id: string;
  name: string;
  purpose: string;
  columns: Column[];
  /** Position on the SVG canvas (x, y of top-left corner) */
  x: number;
  y: number;
}

interface Relationship {
  id: string;
  from: { table: string; column: string };
  to: { table: string; column: string };
  type: '1:N' | '1:1';
  label?: string;
}

const TABLES: Table[] = [
  {
    id: 'agent_catalog',
    name: 'agent_catalog',
    purpose: 'Index of all available agents with parsed metadata',
    x: 40,
    y: 40,
    columns: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'slug', type: 'text UNIQUE' },
      { name: 'name', type: 'text' },
      { name: 'description', type: 'text' },
      { name: 'division', type: 'text' },
      { name: 'emoji', type: 'text' },
      { name: 'color', type: 'text' },
      { name: 'vibe', type: 'text', nullable: true },
      { name: 'file_path', type: 'text' },
      { name: 'line_count', type: 'int' },
      { name: 'tags', type: 'text[]' },
      { name: 'is_active', type: 'boolean' },
      { name: 'created_at', type: 'timestamptz' },
      { name: 'updated_at', type: 'timestamptz' },
    ],
  },
  {
    id: 'agent_assignments',
    name: 'agent_assignments',
    purpose: 'Which agents are assigned to which project',
    x: 380,
    y: 32,
    columns: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'project_id', type: 'uuid', fk: true },
      { name: 'agent_slug', type: 'text', fk: true },
      { name: 'role_description', type: 'text' },
      { name: 'assigned_by', type: 'text' },
      { name: 'status', type: 'text' },
      { name: 'first_task', type: 'text', nullable: true },
      { name: 'created_at', type: 'timestamptz' },
      { name: 'updated_at', type: 'timestamptz' },
    ],
  },
  {
    id: 'agent_runs',
    name: 'agent_runs',
    purpose: 'Audit log of all agent executions',
    x: 380,
    y: 330,
    columns: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'agent_slug', type: 'text', fk: true },
      { name: 'project_id', type: 'uuid', fk: true },
      { name: 'user_id', type: 'uuid', fk: true },
      { name: 'route', type: 'text' },
      { name: 'input_summary', type: 'text' },
      { name: 'tokens_input', type: 'int' },
      { name: 'tokens_output', type: 'int' },
      { name: 'duration_ms', type: 'int' },
      { name: 'model', type: 'text' },
      { name: 'success', type: 'boolean' },
      { name: 'error_message', type: 'text', nullable: true },
      { name: 'created_at', type: 'timestamptz' },
    ],
  },
  {
    id: 'agent_outputs',
    name: 'agent_outputs',
    purpose: 'Full output storage for agent runs (large payloads)',
    x: 760,
    y: 330,
    columns: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'run_id', type: 'uuid', fk: true },
      { name: 'agent_slug', type: 'text', fk: true },
      { name: 'output_type', type: 'text' },
      { name: 'output_text', type: 'text' },
      { name: 'output_json', type: 'jsonb', nullable: true },
      { name: 'format', type: 'text' },
      { name: 'word_count', type: 'int' },
      { name: 'created_at', type: 'timestamptz' },
    ],
  },
  {
    id: 'insight_cards',
    name: 'insight_cards',
    purpose: 'AI-generated business insights for dashboard',
    x: 760,
    y: 32,
    columns: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'project_id', type: 'uuid', fk: true },
      { name: 'agent_slug', type: 'text', fk: true },
      { name: 'priority', type: 'text' },
      { name: 'title', type: 'text' },
      { name: 'body', type: 'text' },
      { name: 'impact_label', type: 'text', nullable: true },
      { name: 'action_label', type: 'text', nullable: true },
      { name: 'status', type: 'text' },
      { name: 'expires_at', type: 'timestamptz' },
      { name: 'created_at', type: 'timestamptz' },
    ],
  },
];

const RELATIONSHIPS: Relationship[] = [
  {
    id: 'catalog-assignments',
    from: { table: 'agent_catalog', column: 'slug' },
    to: { table: 'agent_assignments', column: 'agent_slug' },
    type: '1:N',
    label: 'assigned to',
  },
  {
    id: 'catalog-runs',
    from: { table: 'agent_catalog', column: 'slug' },
    to: { table: 'agent_runs', column: 'agent_slug' },
    type: '1:N',
    label: 'executed as',
  },
  {
    id: 'catalog-insights',
    from: { table: 'agent_catalog', column: 'slug' },
    to: { table: 'insight_cards', column: 'agent_slug' },
    type: '1:N',
    label: 'generates',
  },
  {
    id: 'runs-outputs',
    from: { table: 'agent_runs', column: 'id' },
    to: { table: 'agent_outputs', column: 'run_id' },
    type: '1:N',
    label: 'produces',
  },
  {
    id: 'catalog-outputs',
    from: { table: 'agent_catalog', column: 'slug' },
    to: { table: 'agent_outputs', column: 'agent_slug' },
    type: '1:N',
  },
];

/* ════════════════════════════════════════════════════════════════════
   RENDERING CONSTANTS
   ════════════════════════════════════════════════════════════════════ */

const TABLE_W = 310;
const HEADER_H = 52;
const ROW_H = 22;
const SVG_W = 1140;
const SVG_H = 720;
const BADGE_COLORS = {
  pk: { bg: '#DBEAFE', text: '#1E40AF', label: 'PK' },
  fk: { bg: '#FEF3C7', text: '#92400E', label: 'FK' },
};

function tableHeight(t: Table): number {
  return HEADER_H + t.columns.length * ROW_H + 12;
}

/** Get the anchor point for a column on a table card */
function getAnchor(
  table: Table,
  columnName: string,
  side: 'left' | 'right'
): { x: number; y: number } {
  const colIdx = table.columns.findIndex(c => c.name === columnName);
  const y = table.y + HEADER_H + colIdx * ROW_H + ROW_H / 2;
  const x = side === 'left' ? table.x : table.x + TABLE_W;
  return { x, y };
}

/* ════════════════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════════════════ */

export default function AgentERDiagram() {
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  const [hoveredRel, setHoveredRel] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Determine which relationships are highlighted
  const activeRels = useMemo(() => {
    if (hoveredRel) return new Set([hoveredRel]);
    if (hoveredTable) {
      return new Set(
        RELATIONSHIPS
          .filter(r => r.from.table === hoveredTable || r.to.table === hoveredTable)
          .map(r => r.id)
      );
    }
    return new Set<string>();
  }, [hoveredTable, hoveredRel]);

  const anyHighlight = hoveredTable !== null || hoveredRel !== null;

  // Build relationship paths
  const getRelPath = useCallback((rel: Relationship) => {
    const fromTable = TABLES.find(t => t.id === rel.from.table)!;
    const toTable = TABLES.find(t => t.id === rel.to.table)!;

    // Determine which sides to connect from
    const fromCenter = fromTable.x + TABLE_W / 2;
    const toCenter = toTable.x + TABLE_W / 2;
    const fromSide: 'left' | 'right' = fromCenter < toCenter ? 'right' : 'left';
    const toSide: 'left' | 'right' = fromCenter < toCenter ? 'left' : 'right';

    const from = getAnchor(fromTable, rel.from.column, fromSide);
    const to = getAnchor(toTable, rel.to.column, toSide);

    // Bezier curve
    const dx = Math.abs(to.x - from.x);
    const cpOffset = Math.max(40, dx * 0.4);
    const cp1x = fromSide === 'right' ? from.x + cpOffset : from.x - cpOffset;
    const cp2x = toSide === 'left' ? to.x - cpOffset : to.x + cpOffset;

    return `M ${from.x} ${from.y} C ${cp1x} ${from.y}, ${cp2x} ${to.y}, ${to.x} ${to.y}`;
  }, []);

  // Reset zoom
  const resetZoom = useCallback(() => setZoom(1), []);

  // Selected table detail panel
  const selectedTableData = selectedTable ? TABLES.find(t => t.id === selectedTable) : null;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-5">
        <Link to="/app/dashboard" className="hover:text-[#111827] transition-colors">Dashboard</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/app/agents" className="hover:text-[#111827] transition-colors">Agents</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#111827] font-medium">Data Model</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#111827] tracking-tight flex items-center gap-2.5">
            <Database className="w-7 h-7 text-[#2563EB]" />
            Agent Data Model
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Entity-relationship diagram — 5 Supabase tables powering the agent system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
            className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4 text-[#6B7280]" />
          </button>
          <span className="text-xs text-[#9CA3AF] w-10 text-center font-mono">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
            className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4 text-[#6B7280]" />
          </button>
          <button
            onClick={resetZoom}
            className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
            aria-label="Reset zoom"
          >
            <Maximize2 className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <motion.div
        className="flex items-center flex-wrap gap-5 mb-5 px-4 py-2.5 bg-white rounded-xl border border-[#E5E7EB] shadow-sm"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">Legend</span>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-5 h-3 rounded-sm bg-[#DBEAFE] border border-[#93C5FD]" />
          <span className="text-[11px] text-[#374151] font-mono">PK</span>
          <span className="text-[11px] text-[#6B7280]">Primary Key</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-5 h-3 rounded-sm bg-[#FEF3C7] border border-[#FCD34D]" />
          <span className="text-[11px] text-[#374151] font-mono">FK</span>
          <span className="text-[11px] text-[#6B7280]">Foreign Key</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="28" height="12">
            <line x1="0" y1="6" x2="20" y2="6" stroke="#2563EB" strokeWidth="2" />
            <polygon points="20,2 28,6 20,10" fill="#2563EB" />
          </svg>
          <span className="text-[11px] text-[#6B7280]">One-to-Many</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[#6B7280] italic">Hover a table to highlight its relationships</span>
        </div>
      </motion.div>

      {/* ER Diagram */}
      <motion.div
        className="bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="overflow-x-auto">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            width={SVG_W * zoom}
            height={SVG_H * zoom}
            className="block mx-auto"
            style={{ minWidth: 700 }}
          >
            {/* Background grid dots */}
            <defs>
              <pattern id="erd-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="0.7" fill="#D1D5DB" opacity="0.4" />
              </pattern>
              {/* Arrow marker */}
              <marker
                id="arrow-blue"
                viewBox="0 0 10 8"
                refX="9"
                refY="4"
                markerWidth="8"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 4 L 0 8 z" fill="#2563EB" />
              </marker>
              <marker
                id="arrow-dim"
                viewBox="0 0 10 8"
                refX="9"
                refY="4"
                markerWidth="8"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 4 L 0 8 z" fill="#CBD5E1" />
              </marker>
              {/* One circle marker (for "1" side) */}
              <marker
                id="one-blue"
                viewBox="0 0 8 8"
                refX="4"
                refY="4"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <circle cx="4" cy="4" r="3" fill="none" stroke="#2563EB" strokeWidth="1.5" />
              </marker>
              <marker
                id="one-dim"
                viewBox="0 0 8 8"
                refX="4"
                refY="4"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <circle cx="4" cy="4" r="3" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
              </marker>
            </defs>
            <rect width={SVG_W} height={SVG_H} fill="url(#erd-grid)" />

            {/* Relationship lines */}
            {RELATIONSHIPS.map(rel => {
              const isActive = activeRels.has(rel.id);
              const dimmed = anyHighlight && !isActive;

              return (
                <g
                  key={rel.id}
                  onMouseEnter={() => setHoveredRel(rel.id)}
                  onMouseLeave={() => setHoveredRel(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <path
                    d={getRelPath(rel)}
                    fill="none"
                    stroke={dimmed ? '#CBD5E1' : '#2563EB'}
                    strokeWidth={isActive && anyHighlight ? 2.5 : 1.5}
                    strokeDasharray={rel.type === '1:1' ? '4 3' : 'none'}
                    markerEnd={dimmed ? 'url(#arrow-dim)' : 'url(#arrow-blue)'}
                    markerStart={dimmed ? 'url(#one-dim)' : 'url(#one-blue)'}
                    opacity={dimmed ? 0.25 : isActive && anyHighlight ? 1 : 0.6}
                    style={{ transition: 'opacity 0.2s, stroke-width 0.2s, stroke 0.2s' }}
                  />
                  {/* Relationship label */}
                  {rel.label && isActive && anyHighlight && (
                    (() => {
                      const fromTable = TABLES.find(t => t.id === rel.from.table)!;
                      const toTable = TABLES.find(t => t.id === rel.to.table)!;
                      const fromCenter = fromTable.x + TABLE_W / 2;
                      const toCenter = toTable.x + TABLE_W / 2;
                      const fromSide: 'left' | 'right' = fromCenter < toCenter ? 'right' : 'left';
                      const toSide: 'left' | 'right' = fromCenter < toCenter ? 'left' : 'right';
                      const from = getAnchor(fromTable, rel.from.column, fromSide);
                      const to = getAnchor(toTable, rel.to.column, toSide);
                      const mx = (from.x + to.x) / 2;
                      const my = (from.y + to.y) / 2;
                      return (
                        <g>
                          <rect x={mx - 30} y={my - 9} width={60} height={18} rx={4} fill="#EFF6FF" stroke="#BFDBFE" strokeWidth={1} />
                          <text x={mx} y={my + 4} textAnchor="middle" fontSize="9" fontWeight="500" fill="#1E40AF" fontFamily="monospace">
                            {rel.label}
                          </text>
                        </g>
                      );
                    })()
                  )}
                </g>
              );
            })}

            {/* Table cards */}
            {TABLES.map(table => {
              const h = tableHeight(table);
              const isHovered = hoveredTable === table.id;
              const isSelected = selectedTable === table.id;
              const isRelated = anyHighlight && RELATIONSHIPS.some(
                r => (r.from.table === table.id || r.to.table === table.id) &&
                     activeRels.has(r.id)
              );
              const dimmed = anyHighlight && !isHovered && !isRelated;

              return (
                <g
                  key={table.id}
                  onMouseEnter={() => { setHoveredTable(table.id); setHoveredRel(null); }}
                  onMouseLeave={() => setHoveredTable(null)}
                  onClick={() => setSelectedTable(s => s === table.id ? null : table.id)}
                  style={{ cursor: 'pointer' }}
                  opacity={dimmed ? 0.3 : 1}
                >
                  {/* Shadow */}
                  <rect
                    x={table.x + 2}
                    y={table.y + 2}
                    width={TABLE_W}
                    height={h}
                    rx={10}
                    fill="#000"
                    opacity={isHovered ? 0.06 : 0.03}
                  />
                  {/* Card body */}
                  <rect
                    x={table.x}
                    y={table.y}
                    width={TABLE_W}
                    height={h}
                    rx={10}
                    fill="#FFFFFF"
                    stroke={isHovered || isSelected ? '#2563EB' : isRelated ? '#93C5FD' : '#E5E7EB'}
                    strokeWidth={isHovered || isSelected ? 2 : 1}
                    style={{ transition: 'stroke 0.15s, stroke-width 0.15s' }}
                  />
                  {/* Header background */}
                  <rect
                    x={table.x}
                    y={table.y}
                    width={TABLE_W}
                    height={HEADER_H}
                    rx={10}
                    fill={isHovered || isSelected ? '#EFF6FF' : '#F9FAFB'}
                  />
                  {/* Clip the bottom corners of header (overlap card body) */}
                  <rect
                    x={table.x}
                    y={table.y + HEADER_H - 10}
                    width={TABLE_W}
                    height={10}
                    fill={isHovered || isSelected ? '#EFF6FF' : '#F9FAFB'}
                  />
                  {/* Header border bottom */}
                  <line
                    x1={table.x}
                    y1={table.y + HEADER_H}
                    x2={table.x + TABLE_W}
                    y2={table.y + HEADER_H}
                    stroke="#E5E7EB"
                    strokeWidth={1}
                  />
                  {/* Table icon */}
                  <text
                    x={table.x + 14}
                    y={table.y + 22}
                    fontSize="13"
                  >
                    {"🗄️"}
                  </text>
                  {/* Table name */}
                  <text
                    x={table.x + 34}
                    y={table.y + 23}
                    fontSize="13"
                    fontWeight="700"
                    fill={isHovered || isSelected ? '#1E40AF' : '#111827'}
                    fontFamily="'JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', monospace"
                  >
                    {table.name}
                  </text>
                  {/* Purpose */}
                  <text
                    x={table.x + 14}
                    y={table.y + 42}
                    fontSize="9"
                    fill="#9CA3AF"
                    fontFamily="system-ui, sans-serif"
                  >
                    {table.purpose.length > 48 ? table.purpose.slice(0, 48) + '...' : table.purpose}
                  </text>

                  {/* Columns */}
                  {table.columns.map((col, idx) => {
                    const cy = table.y + HEADER_H + idx * ROW_H + ROW_H / 2 + 4;
                    const isEven = idx % 2 === 0;

                    return (
                      <g key={col.name}>
                        {/* Alternating row background */}
                        {isEven && (
                          <rect
                            x={table.x + 1}
                            y={table.y + HEADER_H + idx * ROW_H}
                            width={TABLE_W - 2}
                            height={ROW_H}
                            fill="#FAFBFC"
                            rx={idx === 0 ? 0 : 0}
                          />
                        )}
                        {/* PK/FK badge */}
                        {(col.pk || col.fk) && (
                          <g>
                            <rect
                              x={table.x + 10}
                              y={cy - 7}
                              width={18}
                              height={14}
                              rx={3}
                              fill={col.pk ? BADGE_COLORS.pk.bg : BADGE_COLORS.fk.bg}
                            />
                            <text
                              x={table.x + 19}
                              y={cy + 3}
                              textAnchor="middle"
                              fontSize="7"
                              fontWeight="700"
                              fill={col.pk ? BADGE_COLORS.pk.text : BADGE_COLORS.fk.text}
                              fontFamily="monospace"
                            >
                              {col.pk ? 'PK' : 'FK'}
                            </text>
                          </g>
                        )}
                        {/* Column name */}
                        <text
                          x={table.x + (col.pk || col.fk ? 34 : 14)}
                          y={cy + 3}
                          fontSize="11"
                          fontWeight={col.pk ? '600' : '400'}
                          fill={col.pk ? '#111827' : col.fk ? '#92400E' : '#374151'}
                          fontFamily="'JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', monospace"
                        >
                          {col.name}
                        </text>
                        {/* Column type */}
                        <text
                          x={table.x + TABLE_W - 14}
                          y={cy + 3}
                          textAnchor="end"
                          fontSize="9.5"
                          fill="#9CA3AF"
                          fontFamily="'JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', monospace"
                        >
                          {col.type}{col.nullable ? '?' : ''}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>
      </motion.div>

      {/* Selected Table Detail Panel */}
      {selectedTableData && (
        <motion.div
          className="mt-5 bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-5 py-3 bg-[#F9FAFB] border-b border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">{"🗄️"}</span>
              <code className="text-sm font-semibold text-[#111827]">{selectedTableData.name}</code>
              <span className="text-xs text-[#9CA3AF]">&middot; {selectedTableData.columns.length} columns</span>
            </div>
            <button
              onClick={() => setSelectedTable(null)}
              className="text-xs text-[#6B7280] hover:text-[#111827] transition-colors"
            >
              Close
            </button>
          </div>
          <div className="px-5 py-2 text-xs text-[#6B7280] bg-[#FAFBFC] border-b border-[#F3F4F6]">
            {selectedTableData.purpose}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF] border-b border-[#F3F4F6]">
                  <th className="text-left px-5 py-2.5">Column</th>
                  <th className="text-left px-3 py-2.5">Type</th>
                  <th className="text-left px-3 py-2.5">Key</th>
                  <th className="text-left px-3 py-2.5">Nullable</th>
                </tr>
              </thead>
              <tbody>
                {selectedTableData.columns.map((col, idx) => (
                  <tr key={col.name} className={`border-b border-[#F3F4F6] last:border-0 ${idx % 2 === 0 ? 'bg-[#FAFBFC]' : ''}`}>
                    <td className="px-5 py-2 font-mono text-[13px] text-[#111827] font-medium">{col.name}</td>
                    <td className="px-3 py-2 font-mono text-[12px] text-[#6B7280]">{col.type}</td>
                    <td className="px-3 py-2">
                      {col.pk && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#DBEAFE] text-[#1E40AF]">PK</span>}
                      {col.fk && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FEF3C7] text-[#92400E]">FK</span>}
                    </td>
                    <td className="px-3 py-2 text-[12px] text-[#9CA3AF]">{col.nullable ? 'Yes' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Related tables */}
          <div className="px-5 py-3 bg-[#F9FAFB] border-t border-[#E5E7EB]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF] mr-3">Relationships:</span>
            {RELATIONSHIPS
              .filter(r => r.from.table === selectedTableData.id || r.to.table === selectedTableData.id)
              .map(r => {
                const other = r.from.table === selectedTableData.id ? r.to.table : r.from.table;
                const direction = r.from.table === selectedTableData.id ? '1:N' : 'N:1';
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedTable(other)}
                    className="inline-flex items-center gap-1.5 mr-3 text-xs text-[#2563EB] hover:underline font-mono"
                  >
                    <span className="text-[10px] text-[#9CA3AF]">{direction}</span>
                    {other}
                    {r.label && <span className="text-[#9CA3AF] font-sans">({r.label})</span>}
                  </button>
                );
              })}
          </div>
        </motion.div>
      )}

      {/* Info */}
      <motion.div
        className="mt-5 bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-[#2563EB] mt-0.5 shrink-0" />
          <div className="text-sm text-[#6B7280] leading-relaxed space-y-1.5">
            <p>
              <strong className="text-[#111827]">agent_catalog</strong> is the source of truth for all agents.{' '}
              <strong className="text-[#111827]">agent_assignments</strong> links agents to projects (created by wizard or manually).{' '}
              <strong className="text-[#111827]">agent_runs</strong> logs every execution with token counts and timing.
            </p>
            <p>
              <strong className="text-[#111827]">agent_outputs</strong> stores full response payloads (separated from runs for query performance).{' '}
              <strong className="text-[#111827]">insight_cards</strong> holds AI-generated recommendations shown on the dashboard.
            </p>
            <p className="text-xs text-[#9CA3AF]">
              Note: These tables are documented for reference. The current implementation uses the{' '}
              <code className="bg-[#F3F4F6] px-1 py-0.5 rounded text-[11px]">kv_store</code> table + <code className="bg-[#F3F4F6] px-1 py-0.5 rounded text-[11px]">ai_run_logs</code> for prototyping.
              Migration to dedicated tables is planned for production.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
