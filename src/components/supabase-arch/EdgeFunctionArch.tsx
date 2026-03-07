// C84-EDGE-FN — Section 4: Edge Function Architecture
import { SectionTitle, DiagramContainer } from './ArchDiagramBlock';
import { ArrowRight, Zap } from 'lucide-react';

interface EdgeFn {
  name: string;
  purpose: string;
  input: string;
  aiStep: string;
  dbWrites: string[];
  route: string;
}

const EDGE_FUNCTIONS: EdgeFn[] = [
  {
    name: 'analyze-business',
    purpose: 'Analyze company URL & description',
    input: 'URL, description, industry',
    aiStep: 'Gemini: industry classification, company profiling',
    dbWrites: ['wizard_sessions', 'wizard_answers', 'context_snapshots'],
    route: '/make-server-*/analyze-business',
  },
  {
    name: 'industry-diagnostics',
    purpose: 'Generate industry-specific diagnostic questions',
    input: 'Industry ID, company profile',
    aiStep: 'Gemini: pain-point analysis, opportunity mapping',
    dbWrites: ['wizard_answers'],
    route: '/make-server-*/industry-diagnostics',
  },
  {
    name: 'system-recommendations',
    purpose: 'AI system recommendations based on diagnostics',
    input: 'Wizard answers (steps 1–2)',
    aiStep: 'Gemini: system matching, priority scoring',
    dbWrites: ['wizard_answers', 'ai_run_logs'],
    route: '/make-server-*/system-recommendations',
  },
  {
    name: 'readiness-score',
    purpose: 'Calculate AI readiness score',
    input: 'All wizard data',
    aiStep: 'Gemini: maturity assessment, gap analysis',
    dbWrites: ['context_snapshots', 'ai_run_logs'],
    route: '/make-server-*/readiness-score',
  },
  {
    name: 'generate-roadmap',
    purpose: 'Create phased implementation roadmap',
    input: 'Context snapshot + selected systems',
    aiStep: 'Gemini: phase planning, timeline estimation, cost modeling',
    dbWrites: ['roadmaps', 'roadmap_phases', 'ai_run_logs', 'ai_cache'],
    route: '/make-server-*/generate-roadmap',
  },
];

export function EdgeFunctionArch() {
  return (
    <section>
      <SectionTitle
        number="04"
        title="Edge Function Architecture"
        subtitle="Deno-powered serverless functions with Hono routing"
      />

      {/* Architecture pattern */}
      <div className="bg-[#FAFAF8] border border-[#E8E8E4] rounded-[4px] px-4 py-3 mb-6">
        <p className="text-xs text-[#666] mb-2 font-semibold uppercase tracking-wider">Pattern</p>
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="bg-[#1A1A1A] text-white px-2 py-1 rounded-[4px]">HTTP Request</span>
          <ArrowRight size={12} className="text-[#E8E8E4]" />
          <span className="bg-[#00875A]/10 text-[#00875A] px-2 py-1 rounded-[4px] border border-[#00875A]/30">Auth Middleware</span>
          <ArrowRight size={12} className="text-[#E8E8E4]" />
          <span className="bg-[#00875A]/10 text-[#00875A] px-2 py-1 rounded-[4px] border border-[#00875A]/30">Validation</span>
          <ArrowRight size={12} className="text-[#E8E8E4]" />
          <span className="bg-blue-50 text-blue-800 px-2 py-1 rounded-[4px] border border-blue-200">Gemini AI</span>
          <ArrowRight size={12} className="text-[#E8E8E4]" />
          <span className="bg-amber-50 text-amber-800 px-2 py-1 rounded-[4px] border border-amber-200">DB Write</span>
          <ArrowRight size={12} className="text-[#E8E8E4]" />
          <span className="bg-[#1A1A1A] text-white px-2 py-1 rounded-[4px]">JSON Response</span>
        </div>
      </div>

      {/* Function cards */}
      <div className="space-y-3">
        {EDGE_FUNCTIONS.map(fn => (
          <DiagramContainer key={fn.name} className="!p-0">
            <div className="flex flex-col md:flex-row">
              {/* Function name */}
              <div className="md:w-56 flex-shrink-0 bg-[#FAFAF8] p-4 border-b md:border-b-0 md:border-r border-[#E8E8E4]">
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={14} className="text-[#00875A]" />
                  <h4 className="text-sm font-semibold font-mono text-[#1A1A1A]">{fn.name}</h4>
                </div>
                <p className="text-xs text-[#666]">{fn.purpose}</p>
                <p className="text-[10px] font-mono text-[#999] mt-2 break-all">{fn.route}</p>
              </div>

              {/* Flow */}
              <div className="flex-1 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="text-[10px] text-[#999] uppercase tracking-wider mb-1 font-semibold">Input</p>
                    <p className="text-[#666]">{fn.input}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#999] uppercase tracking-wider mb-1 font-semibold">AI Processing</p>
                    <p className="text-blue-700">{fn.aiStep}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#999] uppercase tracking-wider mb-1 font-semibold">DB Writes</p>
                    <div className="flex flex-wrap gap-1">
                      {fn.dbWrites.map(t => (
                        <span key={t} className="bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded-sm font-mono text-[10px] border border-amber-200">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DiagramContainer>
        ))}
      </div>
    </section>
  );
}
