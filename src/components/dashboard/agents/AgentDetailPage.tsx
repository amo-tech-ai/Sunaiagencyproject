// C-AGENT-DETAIL — Single agent profile page at /app/agents/catalog/:slug
// Tabs: About, Capabilities, Use Cases, Run History
// Design: white cards on #F8F9FA, blue accents (#2563EB), emoji avatar
// Professional SaaS feel, not playful

import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import {
  ChevronRight, Play, Plus, Check, Target, Shield,
  BarChart3 as ChartIcon, Briefcase, Zap, Clock, Hash,
} from 'lucide-react';
import { getAgentBySlug, DIVISION_COLORS } from '../../wizard/data/agentCatalog';
import type { CatalogAgent } from '../../wizard/data/agentCatalog';

type TabId = 'about' | 'capabilities' | 'use-cases' | 'run-history';

const TABS: { id: TabId; label: string }[] = [
  { id: 'about', label: 'About' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'use-cases', label: 'Use Cases' },
  { id: 'run-history', label: 'Run History' },
];

export default function AgentDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const agent = getAgentBySlug(slug || '');
  const [activeTab, setActiveTab] = useState<TabId>('about');

  if (!agent) {
    return (
      <div className="text-center py-10">
        <p className="text-sm text-[#6B7280] mb-4">Agent not found.</p>
        <Link to="/app/agents/catalog" className="text-sm text-[#2563EB] hover:underline font-medium">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const divColor = DIVISION_COLORS[agent.division] || '#6B7280';

  return (
    <div className="max-w-[960px]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-6">
        <Link to="/app/agents" className="hover:text-[#111827] transition-colors">Agents</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/app/agents/catalog" className="hover:text-[#111827] transition-colors">Catalog</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#111827] font-medium">{agent.name}</span>
      </div>

      {/* Hero Card */}
      <motion.div
        className="bg-white rounded-xl border border-[#E5E7EB] p-6 sm:p-8 mb-6 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          {/* Emoji Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-[#F3F4F6] flex items-center justify-center shrink-0 text-3xl">
            {agent.emoji}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-semibold text-[#111827] tracking-tight">
                {agent.name}
              </h1>
              <span
                className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
                style={{ backgroundColor: divColor + '12', color: divColor }}
              >
                {agent.division}
              </span>
            </div>
            <p className="text-sm text-[#6B7280] mt-1">
              {agent.division} Division
            </p>
            <p className="text-sm text-[#374151] mt-3 leading-relaxed italic">
              &ldquo;{agent.tagline}&rdquo;
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 sm:shrink-0">
            <Link
              to={`/app/agents/catalog/${agent.slug}/run`}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-all shadow-sm"
            >
              <Play className="w-4 h-4" />
              Run This Agent
            </Link>
            <button
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-[#E5E7EB] rounded-lg text-[#374151] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all"
            >
              <Plus className="w-4 h-4" />
              Assign to Project
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-0.5 mb-6 border-b border-[#E5E7EB]">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'about' && <AboutTab agent={agent} divColor={divColor} />}
      {activeTab === 'capabilities' && <CapabilitiesTab agent={agent} />}
      {activeTab === 'use-cases' && <UseCasesTab agent={agent} />}
      {activeTab === 'run-history' && <RunHistoryTab agent={agent} />}
    </div>
  );
}

/* ────── About Tab ────── */

function AboutTab({ agent, divColor }: { agent: CatalogAgent; divColor: string }) {
  return (
    <div className="space-y-5">
      {/* Description */}
      <motion.div
        className="bg-white rounded-xl border border-[#E5E7EB] p-5 sm:p-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <h3 className="text-sm font-semibold text-[#111827] mb-3">About</h3>
        <p className="text-sm text-[#6B7280] leading-relaxed">
          {agent.description}
        </p>
      </motion.div>

      {/* Mission / Rules / Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          className="bg-white rounded-xl border border-[#E5E7EB] p-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-[#2563EB]" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">Core Mission</h4>
          </div>
          <ul className="space-y-2">
            {agent.mission.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#374151]">
                <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#2563EB]" />
                {m}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl border border-[#E5E7EB] p-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-[#D97706]" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D97706]">Critical Rules</h4>
          </div>
          <ul className="space-y-2">
            {agent.rules.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#374151]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] mt-1.5 shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl border border-[#E5E7EB] p-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <ChartIcon className="w-4 h-4 text-[#059669]" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#059669]">Success Metrics</h4>
          </div>
          <ul className="space-y-2">
            {agent.successMetrics.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#374151]">
                <Zap className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#059669]" />
                {m}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Best For */}
      <motion.div
        className="bg-white rounded-xl border border-[#E5E7EB] p-5 sm:p-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.2 }}
      >
        <h3 className="text-sm font-semibold text-[#111827] mb-4">Best For</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider font-medium mb-2">Industries</p>
            <div className="flex flex-wrap gap-1.5">
              {agent.industries.map(ind => (
                <span key={ind} className="text-xs px-2.5 py-1 bg-[#F3F4F6] text-[#374151] rounded-md">
                  {ind}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider font-medium mb-2">Goals</p>
            <div className="flex flex-wrap gap-1.5">
              {agent.goals.map(g => (
                <span key={g} className="text-xs px-2.5 py-1 bg-[#EFF6FF] text-[#2563EB] rounded-md">
                  {g}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider font-medium mb-2">Pairs With</p>
            <div className="flex flex-wrap gap-1.5">
              {agent.pairsWith.map(p => (
                <span key={p} className="text-xs px-2.5 py-1 bg-[#F3F4F6] text-[#374151] rounded-md">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Currently Assigned */}
      {agent.assignedTo.length > 0 && (
        <motion.div
          className="bg-white rounded-xl border border-[#E5E7EB] p-5 sm:p-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.25 }}
        >
          <h3 className="text-sm font-semibold text-[#111827] mb-3">Currently Assigned To</h3>
          <div className="space-y-2">
            {agent.assignedTo.map(project => (
              <div key={project} className="flex items-center gap-2.5 text-sm text-[#6B7280]">
                <Briefcase className="w-3.5 h-3.5 text-[#9CA3AF]" />
                {project}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ────── Capabilities Tab ────── */

function CapabilitiesTab({ agent }: { agent: CatalogAgent }) {
  return (
    <motion.div
      className="bg-white rounded-xl border border-[#E5E7EB] p-5 sm:p-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="text-sm font-semibold text-[#111827] mb-4">Capabilities</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {agent.capabilities.map((cap, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 bg-[#F9FAFB] rounded-lg"
          >
            <div className="w-6 h-6 rounded-md bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 text-xs font-semibold">
              {idx + 1}
            </div>
            <p className="text-sm text-[#374151] leading-relaxed">{cap}</p>
          </div>
        ))}
      </div>

      {/* Methodology */}
      <div className="mt-6 pt-5 border-t border-[#F3F4F6]">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-3">Methodology</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-[#F9FAFB] rounded-lg">
            <p className="text-xs font-medium text-[#2563EB] mb-1">Approach</p>
            <p className="text-xs text-[#6B7280]">Data-driven analysis with structured output formats and iterative refinement loops.</p>
          </div>
          <div className="p-3 bg-[#F9FAFB] rounded-lg">
            <p className="text-xs font-medium text-[#D97706] mb-1">Quality Gates</p>
            <p className="text-xs text-[#6B7280]">Every output passes through Reality Checker validation before client delivery.</p>
          </div>
          <div className="p-3 bg-[#F9FAFB] rounded-lg">
            <p className="text-xs font-medium text-[#059669] mb-1">Learning</p>
            <p className="text-xs text-[#6B7280]">Improves from every engagement through run history analysis and feedback loops.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ────── Use Cases Tab ────── */

function UseCasesTab({ agent }: { agent: CatalogAgent }) {
  return (
    <div className="space-y-4">
      {agent.useCases.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-8 text-center">
          <p className="text-sm text-[#6B7280]">No documented use cases yet.</p>
        </div>
      ) : (
        agent.useCases.map((uc, idx) => (
          <motion.div
            key={idx}
            className="bg-white rounded-xl border border-[#E5E7EB] p-5 sm:p-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
          >
            <h4 className="text-sm font-semibold text-[#111827] mb-4">{uc.title}</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#9CA3AF] font-medium mb-1.5">Input</p>
                <div className="bg-[#F9FAFB] rounded-lg p-3.5 text-sm text-[#6B7280] leading-relaxed border border-[#F3F4F6]">
                  {uc.input}
                </div>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#2563EB] font-medium mb-1.5">Output</p>
                <div className="bg-[#EFF6FF] rounded-lg p-3.5 text-sm text-[#1E40AF] leading-relaxed border border-[#DBEAFE]">
                  {uc.output}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-[#F3F4F6]">
              <Link
                to={`/app/agents/catalog/${agent.slug}/run`}
                className="inline-flex items-center gap-1.5 text-xs text-[#2563EB] hover:underline font-medium"
              >
                <Play className="w-3 h-3" />
                Try this use case
              </Link>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}

/* ────── Run History Tab ────── */

const MOCK_RUNS = [
  { id: '1', task: 'Scope WhatsApp booking bot MVP', tokens: 1847, duration: 3.2, date: '2026-03-11', format: 'Structured' },
  { id: '2', task: 'Design order flow for meal delivery', tokens: 2104, duration: 4.1, date: '2026-03-10', format: 'Structured' },
  { id: '3', task: 'Evaluate Supabase vs Firebase for auth', tokens: 1523, duration: 2.8, date: '2026-03-08', format: 'JSON' },
];

function RunHistoryTab({ agent }: { agent: CatalogAgent }) {
  return (
    <motion.div
      className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Desktop Table */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-[1fr_80px_80px_100px_80px] gap-3 px-5 py-3 bg-[#F9FAFB] border-b border-[#E5E7EB] text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
          <span>Task</span>
          <span>Tokens</span>
          <span>Duration</span>
          <span>Date</span>
          <span>Format</span>
        </div>
        {MOCK_RUNS.map(run => (
          <div
            key={run.id}
            className="grid grid-cols-[1fr_80px_80px_100px_80px] gap-3 px-5 py-3.5 border-b border-[#F3F4F6] last:border-0 hover:bg-[#F9FAFB] transition-colors"
          >
            <span className="text-sm text-[#374151] truncate">{run.task}</span>
            <span className="text-sm text-[#6B7280] flex items-center gap-1">
              <Hash className="w-3 h-3 text-[#9CA3AF]" />
              {run.tokens.toLocaleString()}
            </span>
            <span className="text-sm text-[#6B7280] flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#9CA3AF]" />
              {run.duration}s
            </span>
            <span className="text-sm text-[#9CA3AF]">{run.date}</span>
            <span className="text-xs text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded self-center text-center">{run.format}</span>
          </div>
        ))}
      </div>

      {/* Mobile Card List */}
      <div className="sm:hidden divide-y divide-[#F3F4F6]">
        {MOCK_RUNS.map(run => (
          <div key={run.id} className="px-4 py-3.5">
            <p className="text-sm text-[#374151] font-medium mb-2">{run.task}</p>
            <div className="flex items-center gap-4 text-xs text-[#9CA3AF]">
              <span className="flex items-center gap-1"><Hash className="w-3 h-3" />{run.tokens.toLocaleString()}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{run.duration}s</span>
              <span>{run.date}</span>
              <span className="bg-[#F3F4F6] text-[#6B7280] px-1.5 py-0.5 rounded">{run.format}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 bg-[#F9FAFB] text-xs text-[#9CA3AF]">
        Showing {MOCK_RUNS.length} most recent runs &middot; Full history available via API
      </div>
    </motion.div>
  );
}