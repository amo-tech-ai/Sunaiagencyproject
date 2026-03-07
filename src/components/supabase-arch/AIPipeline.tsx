// C87-AI-PIPE — Section 7: AI Data Pipeline
import { SectionTitle, DiagramContainer } from './ArchDiagramBlock';
import { ArrowDown, Brain, Database as DbIcon, BarChart3, Clock, Zap } from 'lucide-react';

export function AIPipeline() {
  return (
    <section>
      <SectionTitle
        number="07"
        title="AI Data Pipeline"
        subtitle="Gemini-powered analysis with caching and audit logging"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline diagram */}
        <DiagramContainer>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#999] mb-4">Request Pipeline</h4>
          <div className="flex flex-col items-center gap-1">
            {[
              { icon: <Zap size={14} />, label: 'User Input', detail: 'Business URL, industry, goals, answers', bg: 'bg-[#1A1A1A] text-white' },
              { icon: <Clock size={14} />, label: 'Cache Check', detail: 'ai_cache — lookup by input_hash', bg: 'bg-[#F0F0EC] text-[#1A1A1A] border border-[#E8E8E4]' },
              { icon: <Brain size={14} />, label: 'Gemini AI', detail: 'Structured prompt → JSON response', bg: 'bg-blue-50 text-blue-800 border border-blue-200' },
              { icon: <DbIcon size={14} />, label: 'Store Results', detail: 'Write to target tables + cache', bg: 'bg-amber-50 text-amber-800 border border-amber-200' },
              { icon: <DbIcon size={14} />, label: 'Log Run', detail: 'ai_run_logs — tokens, duration, model', bg: 'bg-rose-50 text-rose-800 border border-rose-200' },
              { icon: <BarChart3 size={14} />, label: 'Dashboard Insights', detail: 'Render structured AI output', bg: 'bg-[#00875A]/10 text-[#00875A] border border-[#00875A]/30' },
            ].map((step, i, arr) => (
              <div key={i} className="flex flex-col items-center w-full">
                <div className={`${step.bg} rounded-[4px] px-4 py-2.5 text-xs w-full`}>
                  <div className="flex items-center gap-2 font-semibold">
                    {step.icon}
                    {step.label}
                  </div>
                  <p className="mt-0.5 opacity-80 text-[10px]">{step.detail}</p>
                </div>
                {i < arr.length - 1 && <ArrowDown size={12} className="text-[#E8E8E4] my-0.5" />}
              </div>
            ))}
          </div>
        </DiagramContainer>

        {/* AI tables reference */}
        <div className="space-y-4">
          <DiagramContainer>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#999] mb-4">ai_run_logs Schema</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#E8E8E4]">
                    <th className="text-left py-2 pr-3 text-[10px] text-[#999] uppercase tracking-wider font-semibold">Column</th>
                    <th className="text-left py-2 pr-3 text-[10px] text-[#999] uppercase tracking-wider font-semibold">Type</th>
                    <th className="text-left py-2 text-[10px] text-[#999] uppercase tracking-wider font-semibold">Purpose</th>
                  </tr>
                </thead>
                <tbody className="text-[#666]">
                  {[
                    ['id', 'uuid', 'Primary key'],
                    ['org_id', 'uuid FK', 'Multi-tenant isolation'],
                    ['function_name', 'text', 'Edge function identifier'],
                    ['input_hash', 'text', 'SHA-256 of input for dedup'],
                    ['output', 'jsonb', 'Structured AI response'],
                    ['model', 'text', 'gemini-2.0-flash, etc.'],
                    ['tokens_used', 'int', 'Input + output tokens'],
                    ['duration_ms', 'int', 'Processing time'],
                    ['created_at', 'timestamptz', 'Run timestamp'],
                  ].map(([col, type, purpose]) => (
                    <tr key={col} className="border-b border-[#E8E8E4] last:border-b-0">
                      <td className="py-2 pr-3 font-mono font-semibold text-[#1A1A1A]">{col}</td>
                      <td className="py-2 pr-3 font-mono">{type}</td>
                      <td className="py-2">{purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DiagramContainer>

          <DiagramContainer>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#999] mb-4">ai_cache Schema</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#E8E8E4]">
                    <th className="text-left py-2 pr-3 text-[10px] text-[#999] uppercase tracking-wider font-semibold">Column</th>
                    <th className="text-left py-2 pr-3 text-[10px] text-[#999] uppercase tracking-wider font-semibold">Type</th>
                    <th className="text-left py-2 text-[10px] text-[#999] uppercase tracking-wider font-semibold">Purpose</th>
                  </tr>
                </thead>
                <tbody className="text-[#666]">
                  {[
                    ['id', 'uuid', 'Primary key'],
                    ['cache_key', 'text UNIQUE', 'Hash-based lookup key'],
                    ['result', 'jsonb', 'Cached AI response'],
                    ['expires_at', 'timestamptz', 'TTL — auto-purge after expiry'],
                    ['created_at', 'timestamptz', 'Cache entry timestamp'],
                  ].map(([col, type, purpose]) => (
                    <tr key={col} className="border-b border-[#E8E8E4] last:border-b-0">
                      <td className="py-2 pr-3 font-mono font-semibold text-[#1A1A1A]">{col}</td>
                      <td className="py-2 pr-3 font-mono">{type}</td>
                      <td className="py-2">{purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DiagramContainer>

          {/* Cache strategy */}
          <div className="bg-blue-50 border border-blue-200 rounded-[4px] p-4 text-xs text-blue-800">
            <p className="font-semibold mb-1">Cache Strategy</p>
            <ul className="space-y-1 text-[11px]">
              <li>• <strong>Input hashing:</strong> SHA-256 of normalized JSON input</li>
              <li>• <strong>TTL:</strong> 24h for business analysis, 7d for industry diagnostics</li>
              <li>• <strong>Cache hit:</strong> Skip Gemini call, return cached result</li>
              <li>• <strong>Cost savings:</strong> ~60% reduction in API calls</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
