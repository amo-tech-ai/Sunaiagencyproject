// C-AGENT-RUNNER — Execute an agent on a task at /app/agents/catalog/:slug/run
// Split-pane: task input (left) + agent output (right)
// Design: white cards, blue accents (#2563EB), emoji avatar
// Mobile-first: stacked on mobile, side-by-side on lg+

import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight, Play, Loader2, Copy, Save, Share2,
  Check, Clock, Zap,
} from 'lucide-react';
import { getAgentBySlug } from '../../wizard/data/agentCatalog';
import { agentCatalogApi } from '../../../lib/supabase';
import { publicAnonKey } from '../../../utils/supabase/info';

type OutputFormat = 'structured' | 'freeform' | 'json';

interface RunResult {
  output: string;
  tokens: number;
  durationMs: number;
}

export default function AgentRunnerPage() {
  const { slug } = useParams<{ slug: string }>();
  const agent = getAgentBySlug(slug || '');

  const [context, setContext] = useState('');
  const [task, setTask] = useState('');
  const [format, setFormat] = useState<OutputFormat>('structured');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = useCallback(async () => {
    if (!task.trim() || !agent) return;
    setRunning(true);
    setResult(null);
    setError(null);

    try {
      // Call the real Gemini-backed edge function
      const { data, error: apiError } = await agentCatalogApi.run({
        slug: agent.slug,
        agentName: agent.name,
        task: task.trim(),
        context: context.trim() || undefined,
        format,
      }, publicAnonKey);

      if (apiError || !data) {
        console.error('[AgentRunner] API error, falling back to simulated:', apiError);
        // Fallback to simulated output if API fails
        const simulatedOutput = generateSimulatedOutput(agent.name, task, context, format);
        setResult({
          output: simulatedOutput,
          tokens: 800 + Math.floor(Math.random() * 1200),
          durationMs: 2200 + Math.floor(Math.random() * 1500),
        });
        setError('Using simulated output (API unavailable)');
      } else {
        setResult({
          output: data.output,
          tokens: data.tokens,
          durationMs: data.durationMs,
        });
      }
    } catch (err) {
      console.error('[AgentRunner] Exception:', err);
      // Fallback to simulated output
      const simulatedOutput = generateSimulatedOutput(agent.name, task, context, format);
      setResult({
        output: simulatedOutput,
        tokens: 800 + Math.floor(Math.random() * 1200),
        durationMs: 2200 + Math.floor(Math.random() * 1500),
      });
      setError('Using simulated output (connection error)');
    } finally {
      setRunning(false);
    }
  }, [agent, task, context, format]);

  const handleCopy = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

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

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-5">
        <Link to="/app/agents" className="hover:text-[#111827] transition-colors">Agents</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/app/agents/catalog/${agent.slug}`} className="hover:text-[#111827] transition-colors">{agent.name}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#111827] font-medium">Run</span>
      </div>

      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center shrink-0 text-xl">
          {agent.emoji}
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-[#111827] tracking-tight">
            Run: {agent.name}
          </h1>
          <p className="text-xs text-[#6B7280]">{agent.role}</p>
        </div>
      </div>

      {/* Split Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Task Input */}
        <motion.div
          className="bg-white rounded-xl border border-[#E5E7EB] p-5 sm:p-6 shadow-sm"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className="text-sm font-semibold text-[#111827] mb-5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#2563EB]" />
            Task Input
          </h2>

          {/* Context */}
          <div className="mb-4">
            <label className="block text-xs text-[#6B7280] font-medium uppercase tracking-wider mb-1.5">
              Context <span className="text-[#9CA3AF] normal-case tracking-normal font-normal">(optional)</span>
            </label>
            <textarea
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="E.g., Dr. Patel's Dental Clinic, 8 employees, Medellin Colombia. No online booking."
              className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-sm text-[#111827] placeholder:text-[#9CA3AF] resize-none focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all"
              rows={3}
            />
          </div>

          {/* Task */}
          <div className="mb-4">
            <label className="block text-xs text-[#6B7280] font-medium uppercase tracking-wider mb-1.5">
              Task <span className="text-[#EF4444]">*</span>
            </label>
            <textarea
              value={task}
              onChange={e => setTask(e.target.value)}
              placeholder="E.g., Scope an MVP for a WhatsApp booking bot. Budget: $5K. Timeline: 2 weeks."
              className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-sm text-[#111827] placeholder:text-[#9CA3AF] resize-none focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all"
              rows={5}
            />
          </div>

          {/* Output Format */}
          <div className="mb-6">
            <label className="block text-xs text-[#6B7280] font-medium uppercase tracking-wider mb-2.5">
              Output Format
            </label>
            <div className="space-y-2">
              {([
                { id: 'structured' as OutputFormat, label: 'Structured report' },
                { id: 'freeform' as OutputFormat, label: 'Free-form text' },
                { id: 'json' as OutputFormat, label: 'JSON' },
              ]).map(opt => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-3 text-sm cursor-pointer py-2 px-3 rounded-lg transition-colors ${
                    format === opt.id ? 'bg-[#EFF6FF] text-[#1E40AF]' : 'text-[#374151] hover:bg-[#F9FAFB]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      format === opt.id ? 'border-[#2563EB]' : 'border-[#D1D5DB]'
                    }`}
                  >
                    {format === opt.id && (
                      <div className="w-2 h-2 rounded-full bg-[#2563EB]" />
                    )}
                  </div>
                  <input
                    type="radio"
                    name="format"
                    value={opt.id}
                    checked={format === opt.id}
                    onChange={() => setFormat(opt.id)}
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Run Button */}
          <button
            onClick={handleRun}
            disabled={running || !task.trim()}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed bg-[#2563EB] hover:bg-[#1D4ED8]"
          >
            {running ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Agent
              </>
            )}
          </button>
        </motion.div>

        {/* Right: Agent Output */}
        <motion.div
          className="bg-white rounded-xl border border-[#E5E7EB] p-5 sm:p-6 min-h-[480px] flex flex-col shadow-sm"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
        >
          <h2 className="text-sm font-semibold text-[#111827] mb-5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#059669]" />
            Agent Output
          </h2>

          <div className="flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              {running && (
                <motion.div
                  key="loading"
                  className="flex-1 flex flex-col items-center justify-center text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mb-4 text-2xl">
                    {agent.emoji}
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <Loader2 className="w-4 h-4 animate-spin text-[#2563EB]" />
                    <p className="text-sm font-medium text-[#374151]">{agent.name} is working...</p>
                  </div>
                  <p className="text-xs text-[#9CA3AF]">This usually takes 2-5 seconds</p>
                </motion.div>
              )}

              {!running && !result && (
                <motion.div
                  key="empty"
                  className="flex-1 flex flex-col items-center justify-center text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mb-4 text-2xl opacity-40">
                    {agent.emoji}
                  </div>
                  <p className="text-sm text-[#9CA3AF]">Run the agent to see output here.</p>
                </motion.div>
              )}

              {!running && result && (
                <motion.div
                  key="result"
                  className="flex-1 flex flex-col"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {error && (
                    <div className="mb-2 px-3 py-1.5 bg-[#FFFBEB] border border-[#FCD34D] rounded-lg text-xs text-[#92400E]">
                      {error}
                    </div>
                  )}
                  <div
                    className="flex-1 bg-[#F9FAFB] rounded-lg p-4 text-sm text-[#111827] leading-relaxed whitespace-pre-wrap font-mono overflow-auto max-h-[520px] border border-[#F3F4F6]"
                    style={{ fontSize: '13px' }}
                  >
                    {result.output}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-[#F3F4F6]">
                    <div className="flex items-center gap-4 text-xs text-[#9CA3AF]">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {result.tokens.toLocaleString()} tokens
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {(result.durationMs / 1000).toFixed(1)}s
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleCopy}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs border border-[#E5E7EB] rounded-md text-[#6B7280] hover:bg-[#F9FAFB] transition-colors"
                      >
                        {copied ? <Check className="w-3 h-3 text-[#059669]" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                      <button className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs border border-[#E5E7EB] rounded-md text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">
                        <Save className="w-3 h-3" />
                        Save
                      </button>
                      <button className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs border border-[#E5E7EB] rounded-md text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">
                        <Share2 className="w-3 h-3" />
                        Share
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ---- Simulated Output Generator ---- */

function generateSimulatedOutput(
  agentName: string,
  task: string,
  context: string,
  format: OutputFormat,
): string {
  const taskLower = task.toLowerCase();

  if (format === 'json') {
    return JSON.stringify({
      agent: agentName,
      task,
      status: 'completed',
      result: {
        summary: `Analysis completed for: ${task.slice(0, 80)}`,
        recommendations: [
          'Start with core functionality only',
          'Use existing tools and frameworks',
          'Plan for user testing in week 2',
        ],
        timeline: '2-3 weeks',
        estimatedCost: '$3,000 - $8,000',
        confidence: 0.85,
      },
      metadata: { model: 'gemini-2.0-flash', cached: false },
    }, null, 2);
  }

  const lines = [
    `${'='.repeat(45)}`,
    `${agentName.toUpperCase()} - OUTPUT`,
    `${'='.repeat(45)}`,
    ``,
  ];

  if (taskLower.includes('booking') || taskLower.includes('whatsapp')) {
    lines.push(
      `MVP SCOPE: WhatsApp Booking Bot`,
      ``,
      `Timeline: 2 weeks`,
      `Budget: $5,000`,
      ``,
      `WEEK 1:`,
      `  - WhatsApp Business API setup`,
      `  - Booking flow (select service > date > time)`,
      `  - Calendar sync with Google Calendar`,
      `  - Bilingual support: Spanish + English`,
      ``,
      `WEEK 2:`,
      `  - Confirmation messages (WhatsApp template)`,
      `  - Reminder: 24hr before appointment`,
      `  - Cancellation/reschedule flow`,
      `  - Testing + go-live`,
      ``,
      `NOT IN MVP:`,
      `  - Payment collection`,
      `  - Multi-location support`,
      `  - AI conversational chat (just menu-driven)`,
      ``,
      `RECOMMENDED STACK:`,
      `  - Twilio for WhatsApp Business API`,
      `  - Supabase for data + auth`,
      `  - n8n for workflow automation`,
      `  - Google Calendar API for scheduling`,
    );
  } else if (taskLower.includes('seo') || taskLower.includes('keyword')) {
    lines.push(
      `KEYWORD GAP ANALYSIS`,
      ``,
      `Current state: Ranking for 0 target keywords`,
      `Competitor average: 180+ keyword rankings`,
      ``,
      `TOP OPPORTUNITIES:`,
      `  1. "custom birthstone necklace" - 8K monthly, Low competition`,
      `  2. "personalized jewelry gifts" - 5K monthly, Medium competition`,
      `  3. "handmade gold necklace" - 3K monthly, Low competition`,
      ``,
      `QUICK WINS (0-30 days):`,
      `  - Optimize product page titles with target keywords`,
      `  - Add alt text to all product images`,
      `  - Create 3 long-form blog posts (1500+ words)`,
      ``,
      `ESTIMATED IMPACT:`,
      `  Month 3: 500+ organic visitors/month`,
      `  Month 6: 2,000+ organic visitors/month`,
    );
  } else {
    lines.push(
      `ANALYSIS SUMMARY`,
      ``,
      `Context: ${context || 'Not provided'}`,
      ``,
      `RECOMMENDATIONS:`,
      `  1. Start with the core functionality only`,
      `  2. Use pre-built components and frameworks`,
      `  3. Plan for user testing within 2 weeks`,
      `  4. Iterate based on real usage data`,
      ``,
      `TIMELINE: 2-4 weeks for initial delivery`,
      ``,
      `RISK FACTORS:`,
      `  - Scope creep if requirements aren't locked`,
      `  - Integration complexity may add 3-5 days`,
      ``,
      `NEXT STEPS:`,
      `  1. Confirm requirements and priorities`,
      `  2. Set up development environment`,
      `  3. Begin Sprint 1 with core features`,
    );
  }

  return lines.join('\n');
}