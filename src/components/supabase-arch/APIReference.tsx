// C88-API-REF — Section 8: API Reference Table
import { SectionTitle, DiagramContainer } from './ArchDiagramBlock';

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  route: string;
  purpose: string;
  input: string;
  output: string;
  tables: string[];
  auth: boolean;
}

const ENDPOINTS: APIEndpoint[] = [
  {
    method: 'POST',
    route: '/analyze-business',
    purpose: 'Analyze company from URL & description',
    input: '{ url, description, industry }',
    output: '{ profile, signals, classification }',
    tables: ['wizard_sessions', 'wizard_answers', 'context_snapshots'],
    auth: true,
  },
  {
    method: 'POST',
    route: '/industry-diagnostics',
    purpose: 'Generate diagnostic questions',
    input: '{ industry_id, profile }',
    output: '{ questions[], pain_points[] }',
    tables: ['wizard_answers'],
    auth: true,
  },
  {
    method: 'POST',
    route: '/system-recommendations',
    purpose: 'AI system matching & scoring',
    input: '{ session_id, answers }',
    output: '{ systems[], scores, priorities }',
    tables: ['wizard_answers', 'ai_run_logs'],
    auth: true,
  },
  {
    method: 'POST',
    route: '/readiness-score',
    purpose: 'Calculate AI readiness assessment',
    input: '{ session_id }',
    output: '{ score, gaps[], maturity_level }',
    tables: ['context_snapshots', 'ai_run_logs'],
    auth: true,
  },
  {
    method: 'POST',
    route: '/generate-roadmap',
    purpose: 'Create phased implementation plan',
    input: '{ snapshot_id, systems[] }',
    output: '{ roadmap, phases[], timeline }',
    tables: ['roadmaps', 'roadmap_phases', 'ai_run_logs', 'ai_cache'],
    auth: true,
  },
  {
    method: 'GET',
    route: '/health',
    purpose: 'Server health check',
    input: '—',
    output: '{ status: "ok" }',
    tables: [],
    auth: false,
  },
  {
    method: 'POST',
    route: '/signup',
    purpose: 'Create new user account',
    input: '{ email, password, name }',
    output: '{ user, session }',
    tables: ['profiles', 'organizations', 'team_members'],
    auth: false,
  },
  {
    method: 'POST',
    route: '/wizard/save',
    purpose: 'Persist wizard step data',
    input: '{ session_id, step, data }',
    output: '{ success, updated_at }',
    tables: ['wizard_sessions', 'wizard_answers'],
    auth: true,
  },
  {
    method: 'GET',
    route: '/wizard/:session_id',
    purpose: 'Load wizard session',
    input: 'session_id (param)',
    output: '{ session, answers[], progress }',
    tables: ['wizard_sessions', 'wizard_answers'],
    auth: true,
  },
  {
    method: 'GET',
    route: '/roadmap/:id',
    purpose: 'Fetch generated roadmap',
    input: 'roadmap_id (param)',
    output: '{ roadmap, phases[], costs }',
    tables: ['roadmaps', 'roadmap_phases'],
    auth: true,
  },
];

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-[#00875A]/10 text-[#00875A]',
  POST: 'bg-blue-50 text-blue-700',
  PUT: 'bg-amber-50 text-amber-700',
  DELETE: 'bg-rose-50 text-rose-700',
};

export function APIReference() {
  return (
    <section>
      <SectionTitle
        number="08"
        title="API Reference"
        subtitle="Complete Edge Function endpoint reference for developers"
      />

      <DiagramContainer>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2 border-[#E8E8E4]">
                {['Method', 'Route', 'Purpose', 'Input', 'Output', 'Tables', 'Auth'].map(h => (
                  <th key={h} className="text-left py-2.5 pr-3 text-[10px] text-[#999] uppercase tracking-wider font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ENDPOINTS.map((ep, i) => (
                <tr key={i} className="border-b border-[#E8E8E4] last:border-b-0 hover:bg-[#FAFAF8] transition-colors">
                  <td className="py-2.5 pr-3">
                    <span className={`px-1.5 py-0.5 rounded-sm font-mono font-semibold text-[10px] ${METHOD_COLORS[ep.method]}`}>
                      {ep.method}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 font-mono text-[#1A1A1A] font-semibold whitespace-nowrap">{ep.route}</td>
                  <td className="py-2.5 pr-3 text-[#666]">{ep.purpose}</td>
                  <td className="py-2.5 pr-3 font-mono text-[#999] text-[10px]">{ep.input}</td>
                  <td className="py-2.5 pr-3 font-mono text-[#999] text-[10px]">{ep.output}</td>
                  <td className="py-2.5 pr-3">
                    <div className="flex flex-wrap gap-0.5">
                      {ep.tables.map(t => (
                        <span key={t} className="bg-amber-50 text-amber-800 px-1 py-0.5 rounded-sm font-mono text-[9px] border border-amber-200">{t}</span>
                      ))}
                      {ep.tables.length === 0 && <span className="text-[#999]">—</span>}
                    </div>
                  </td>
                  <td className="py-2.5">
                    {ep.auth ? (
                      <span className="text-[#00875A] text-[10px] font-semibold">✓ JWT</span>
                    ) : (
                      <span className="text-[#999] text-[10px]">Public</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DiagramContainer>

      {/* Base URL note */}
      <div className="mt-4 bg-[#FAFAF8] border border-[#E8E8E4] rounded-[4px] px-4 py-3 text-xs text-[#666]">
        <p><strong className="text-[#1A1A1A]">Base URL:</strong> <code className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#E8E8E4]">https://&#123;projectId&#125;.supabase.co/functions/v1/make-server-283466b6</code></p>
        <p className="mt-1"><strong className="text-[#1A1A1A]">Auth header:</strong> <code className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#E8E8E4]">Authorization: Bearer &#123;access_token&#125;</code></p>
      </div>
    </section>
  );
}
