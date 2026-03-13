// C-AGENT-CATALOG — Browse all AI agents organized by division
// Grid of agent cards with emoji avatars, division tab filter, search, View/Run buttons
// Design: white cards, blue accents (#2563EB), professional SaaS
// Mobile-first: 1 col -> 2 col on md+

import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Search as SearchIcon, Eye, Play, ChevronRight } from 'lucide-react';
import {
  CATALOG_AGENTS, DIVISIONS, searchAgents, filterByDivision,
  DIVISION_COLORS, ALL_CATALOG_AGENTS,
  type CatalogAgent, type Division,
} from '../../wizard/data/agentCatalog';

type DivisionFilter = Division | 'All';
const PAGE_SIZE = 20;

export default function AgentCatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDivision, setActiveDivision] = useState<DivisionFilter>('All');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showAll, setShowAll] = useState(true); // Show all 116 by default

  // Use ALL agents (116) or just curated (16) based on toggle
  const sourceAgents = showAll ? ALL_CATALOG_AGENTS : CATALOG_AGENTS;

  const filteredAgents = useMemo(() => {
    let result = filterByDivision(sourceAgents, activeDivision);
    result = searchAgents(result, searchQuery);
    return result;
  }, [searchQuery, activeDivision, sourceAgents]);

  const visibleAgents = filteredAgents.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAgents.length;

  // Compute curated counts per division
  const divisionCuratedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    sourceAgents.forEach(a => {
      counts[a.division] = (counts[a.division] || 0) + 1;
    });
    return counts;
  }, [sourceAgents]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-2">
            <Link to="/app/dashboard" className="hover:text-[#111827] transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/app/agents" className="hover:text-[#111827] transition-colors">Agents</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#111827] font-medium">Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#111827] tracking-tight">
            Agent Catalog
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Showing {filteredAgents.length} of {sourceAgents.length} agents
            {!showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="ml-2 text-[#2563EB] hover:underline font-medium"
              >
                Show all {ALL_CATALOG_AGENTS.length}
              </button>
            )}
            {showAll && sourceAgents.length > CATALOG_AGENTS.length && (
              <button
                onClick={() => setShowAll(false)}
                className="ml-2 text-[#9CA3AF] hover:text-[#6B7280] hover:underline"
              >
                Curated only ({CATALOG_AGENTS.length})
              </button>
            )}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setVisibleCount(PAGE_SIZE); }}
            placeholder="Search agents..."
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
          />
        </div>
      </div>

      {/* Division Tabs */}
      <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
        <DivisionTab
          label="All"
          count={sourceAgents.length}
          active={activeDivision === 'All'}
          onClick={() => { setActiveDivision('All'); setVisibleCount(PAGE_SIZE); }}
        />
        {DIVISIONS.map(div => (
          <DivisionTab
            key={div.id}
            label={div.label}
            count={divisionCuratedCounts[div.id] || 0}
            active={activeDivision === div.id}
            onClick={() => { setActiveDivision(div.id); setVisibleCount(PAGE_SIZE); }}
          />
        ))}
      </div>

      {/* Agent Grid */}
      {filteredAgents.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-[#F3F4F6] flex items-center justify-center mx-auto mb-3">
            <SearchIcon className="w-5 h-5 text-[#9CA3AF]" />
          </div>
          <p className="text-sm text-[#6B7280] mb-2">No agents match your search.</p>
          <button
            onClick={() => { setSearchQuery(''); setActiveDivision('All'); }}
            className="text-sm text-[#2563EB] hover:underline font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleAgents.map((agent, idx) => (
              <AgentCard key={agent.id} agent={agent} index={idx} />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                className="px-6 py-2.5 text-sm font-medium text-[#2563EB] bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all"
              >
                Load more agents...
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ---- Division Tab ---- */

function DivisionTab({ label, count, active, onClick }: {
  label: string; count: number; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
        active
          ? 'bg-[#2563EB] text-white shadow-sm'
          : 'bg-white text-[#374151] border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB]'
      }`}
    >
      {label}
      <span className={`text-[10px] ${active ? 'text-white/70' : 'text-[#9CA3AF]'}`}>{count}</span>
    </button>
  );
}

/* ---- Agent Card ---- */

function AgentCard({ agent, index }: { agent: CatalogAgent; index: number }) {
  const divColor = DIVISION_COLORS[agent.division] || '#6B7280';

  return (
    <motion.div
      className="bg-white rounded-xl border border-[#E5E7EB] p-5 transition-all hover:shadow-md hover:border-[#D1D5DB] group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, delay: Math.min(index * 0.03, 0.3) }}
    >
      <div className="flex items-start gap-3.5">
        {/* Emoji Avatar */}
        <div className="w-11 h-11 rounded-xl bg-[#F3F4F6] flex items-center justify-center shrink-0 text-xl group-hover:scale-105 transition-transform">
          {agent.emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-semibold text-[#111827] leading-tight">
            {agent.name}
          </h3>
          <p className="text-xs text-[#6B7280] mt-1 leading-relaxed line-clamp-2">
            {agent.role}
          </p>

          {/* Division badge + assigned */}
          <div className="flex items-center gap-2.5 mt-3 flex-wrap">
            <span
              className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{
                backgroundColor: divColor + '12',
                color: divColor,
              }}
            >
              {agent.division}
            </span>
            {agent.assignedTo.length > 0 && (
              <span className="text-[11px] text-[#9CA3AF]">
                Assigned to: {agent.assignedTo.length === 1
                  ? agent.assignedTo[0]
                  : `${agent.assignedTo.length} projects`}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3.5">
            <Link
              to={`/app/agents/catalog/${agent.slug}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium border border-[#E5E7EB] rounded-lg text-[#374151] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              View
            </Link>
            <Link
              to={`/app/agents/catalog/${agent.slug}/run`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-all shadow-sm"
            >
              <Play className="w-3.5 h-3.5" />
              Run
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}