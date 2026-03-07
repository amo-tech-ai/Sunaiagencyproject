// C83-FE-FLOW — Section 3: Frontend Data Flow Diagrams
import { SectionTitle, DiagramContainer } from './ArchDiagramBlock';
import { ArrowRight, ArrowDown } from 'lucide-react';

interface FlowStep {
  label: string;
  detail: string;
  type: 'ui' | 'edge' | 'ai' | 'db' | 'realtime';
}

const TYPE_STYLES: Record<string, string> = {
  ui: 'bg-[#1A1A1A] text-white',
  edge: 'bg-[#00875A]/10 text-[#00875A] border border-[#00875A]/30',
  ai: 'bg-blue-50 text-blue-800 border border-blue-200',
  db: 'bg-amber-50 text-amber-800 border border-amber-200',
  realtime: 'bg-purple-50 text-purple-800 border border-purple-200',
};

function FlowDiagram({ title, description, steps }: { title: string; description: string; steps: FlowStep[] }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-[#1A1A1A]">{title}</h4>
        <p className="text-xs text-[#666] mt-0.5">{description}</p>
      </div>

      {/* Horizontal flow on md+, vertical on mobile */}
      <div className="hidden md:flex items-center gap-2 flex-wrap">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`rounded-[4px] px-3 py-2 text-xs ${TYPE_STYLES[step.type]}`}>
              <div className="font-semibold">{step.label}</div>
              <div className="opacity-70 text-[10px] mt-0.5">{step.detail}</div>
            </div>
            {i < steps.length - 1 && <ArrowRight size={14} className="text-[#E8E8E4] flex-shrink-0" />}
          </div>
        ))}
      </div>

      <div className="md:hidden flex flex-col items-center gap-1">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className={`rounded-[4px] px-3 py-2 text-xs w-full max-w-xs text-center ${TYPE_STYLES[step.type]}`}>
              <div className="font-semibold">{step.label}</div>
              <div className="opacity-70 text-[10px] mt-0.5">{step.detail}</div>
            </div>
            {i < steps.length - 1 && <ArrowDown size={14} className="text-[#E8E8E4] my-1" />}
          </div>
        ))}
      </div>
    </div>
  );
}

const WIZARD_FLOW: FlowStep[] = [
  { label: 'Wizard UI', detail: 'User completes 5 steps', type: 'ui' },
  { label: 'Edge Function', detail: 'analyze-business', type: 'edge' },
  { label: 'Gemini AI', detail: 'Structured analysis', type: 'ai' },
  { label: 'Database', detail: 'wizard_sessions + answers', type: 'db' },
  { label: 'Dashboard', detail: 'Render results', type: 'ui' },
];

const DASHBOARD_FLOW: FlowStep[] = [
  { label: 'Dashboard UI', detail: 'Component mount', type: 'ui' },
  { label: 'Supabase Query', detail: 'SELECT with RLS', type: 'db' },
  { label: 'Realtime', detail: 'Subscribe to changes', type: 'realtime' },
  { label: 'UI Update', detail: 'Reactive re-render', type: 'ui' },
];

const PROJECT_FLOW: FlowStep[] = [
  { label: 'Project Form', detail: 'Create / edit project', type: 'ui' },
  { label: 'Edge Function', detail: 'Validate + authorize', type: 'edge' },
  { label: 'Database', detail: 'INSERT projects', type: 'db' },
  { label: 'Realtime', detail: 'Broadcast update', type: 'realtime' },
  { label: 'Team Dashboards', detail: 'Live sync', type: 'ui' },
];

const ROADMAP_FLOW: FlowStep[] = [
  { label: 'Wizard Complete', detail: 'All 5 steps done', type: 'ui' },
  { label: 'Edge Function', detail: 'generate-roadmap', type: 'edge' },
  { label: 'Gemini AI', detail: 'Phase generation', type: 'ai' },
  { label: 'Database', detail: 'roadmaps + phases', type: 'db' },
  { label: 'Proposal Page', detail: 'Interactive roadmap', type: 'ui' },
];

export function FrontendDataFlow() {
  return (
    <section>
      <SectionTitle
        number="03"
        title="Frontend Data Flows"
        subtitle="How React components interact with Supabase services"
      />

      <div className="space-y-4">
        <DiagramContainer>
          <FlowDiagram
            title="Wizard Flow"
            description="5-step Project Brief Wizard → AI analysis → stored results → dashboard"
            steps={WIZARD_FLOW}
          />
        </DiagramContainer>

        <DiagramContainer>
          <FlowDiagram
            title="Dashboard Flow"
            description="Initial data fetch with realtime subscription for live updates"
            steps={DASHBOARD_FLOW}
          />
        </DiagramContainer>

        <DiagramContainer>
          <FlowDiagram
            title="Project Management Flow"
            description="CRUD operations with realtime sync across team members"
            steps={PROJECT_FLOW}
          />
        </DiagramContainer>

        <DiagramContainer>
          <FlowDiagram
            title="Roadmap Generation Flow"
            description="AI-powered roadmap creation from wizard session data"
            steps={ROADMAP_FLOW}
          />
        </DiagramContainer>
      </div>

      {/* Flow type legend */}
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-[#999]">
        {Object.entries({ 'UI Layer': 'ui', 'Edge Function': 'edge', 'AI Service': 'ai', 'Database': 'db', 'Realtime': 'realtime' }).map(([label, type]) => (
          <span key={type} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm ${TYPE_STYLES[type]}`} />
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
