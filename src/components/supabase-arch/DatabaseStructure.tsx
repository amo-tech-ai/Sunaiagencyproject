// C82-DB-STRUCT — Section 2: Database Structure & Entity Relationships
import { SectionTitle, DiagramContainer } from './ArchDiagramBlock';

interface TableDef {
  name: string;
  group: string;
  columns: string[];
  pk: string;
  fk?: string[];
}

const TABLES: TableDef[] = [
  // Identity & Access
  { name: 'organizations', group: 'Identity', columns: ['id', 'name', 'slug', 'plan', 'created_at'], pk: 'id' },
  { name: 'profiles', group: 'Identity', columns: ['id', 'user_id', 'org_id', 'display_name', 'avatar_url', 'role'], pk: 'id', fk: ['org_id → organizations'] },
  { name: 'team_members', group: 'Identity', columns: ['id', 'org_id', 'user_id', 'role', 'invited_at'], pk: 'id', fk: ['org_id → organizations'] },

  // Projects
  { name: 'clients', group: 'Projects', columns: ['id', 'org_id', 'name', 'industry', 'contact_email'], pk: 'id', fk: ['org_id → organizations'] },
  { name: 'projects', group: 'Projects', columns: ['id', 'org_id', 'client_id', 'name', 'status', 'start_date'], pk: 'id', fk: ['org_id → organizations', 'client_id → clients'] },
  { name: 'tasks', group: 'Projects', columns: ['id', 'project_id', 'title', 'status', 'assigned_to', 'due_date'], pk: 'id', fk: ['project_id → projects'] },
  { name: 'milestones', group: 'Projects', columns: ['id', 'project_id', 'title', 'target_date', 'completed'], pk: 'id', fk: ['project_id → projects'] },
  { name: 'deliverables', group: 'Projects', columns: ['id', 'milestone_id', 'name', 'file_url', 'status'], pk: 'id', fk: ['milestone_id → milestones'] },

  // Wizard
  { name: 'wizard_sessions', group: 'Wizard', columns: ['id', 'org_id', 'current_step', 'status', 'created_at'], pk: 'id', fk: ['org_id → organizations'] },
  { name: 'wizard_answers', group: 'Wizard', columns: ['id', 'session_id', 'step_key', 'answer_data', 'updated_at'], pk: 'id', fk: ['session_id → wizard_sessions'] },

  // Roadmap
  { name: 'context_snapshots', group: 'Roadmap', columns: ['id', 'org_id', 'snapshot_data', 'version', 'created_at'], pk: 'id', fk: ['org_id → organizations'] },
  { name: 'roadmaps', group: 'Roadmap', columns: ['id', 'org_id', 'title', 'status', 'generated_at'], pk: 'id', fk: ['org_id → organizations'] },
  { name: 'roadmap_phases', group: 'Roadmap', columns: ['id', 'roadmap_id', 'phase_number', 'title', 'duration_weeks'], pk: 'id', fk: ['roadmap_id → roadmaps'] },

  // Services
  { name: 'services', group: 'Services', columns: ['id', 'name', 'category', 'description', 'base_price'], pk: 'id' },
  { name: 'systems', group: 'Services', columns: ['id', 'name', 'type', 'complexity', 'monthly_cost'], pk: 'id' },
  { name: 'system_services', group: 'Services', columns: ['system_id', 'service_id'], pk: 'composite', fk: ['system_id → systems', 'service_id → services'] },
  { name: 'project_services', group: 'Services', columns: ['project_id', 'service_id', 'status'], pk: 'composite', fk: ['project_id → projects', 'service_id → services'] },

  // AI
  { name: 'ai_run_logs', group: 'AI', columns: ['id', 'org_id', 'function_name', 'input_hash', 'output', 'tokens_used', 'duration_ms'], pk: 'id', fk: ['org_id → organizations'] },
  { name: 'ai_cache', group: 'AI', columns: ['id', 'cache_key', 'result', 'expires_at'], pk: 'id' },

  // Billing
  { name: 'invoices', group: 'Billing', columns: ['id', 'org_id', 'amount', 'status', 'due_date'], pk: 'id', fk: ['org_id → organizations'] },
  { name: 'payments', group: 'Billing', columns: ['id', 'invoice_id', 'amount', 'stripe_id', 'paid_at'], pk: 'id', fk: ['invoice_id → invoices'] },
];

const GROUP_COLORS: Record<string, string> = {
  Identity: 'border-l-[#00875A]',
  Projects: 'border-l-blue-400',
  Wizard: 'border-l-amber-400',
  Roadmap: 'border-l-purple-400',
  Services: 'border-l-cyan-400',
  AI: 'border-l-rose-400',
  Billing: 'border-l-orange-400',
};

const GROUP_BG: Record<string, string> = {
  Identity: 'bg-[#00875A]',
  Projects: 'bg-blue-400',
  Wizard: 'bg-amber-400',
  Roadmap: 'bg-purple-400',
  Services: 'bg-cyan-400',
  AI: 'bg-rose-400',
  Billing: 'bg-orange-400',
};

export function DatabaseStructure() {
  const groups = [...new Set(TABLES.map(t => t.group))];

  return (
    <section>
      <SectionTitle
        number="02"
        title="Database Structure"
        subtitle="Core schema with multi-tenant isolation via org_id"
      />

      {/* Multi-tenant callout */}
      <div className="bg-[#00875A]/5 border border-[#00875A]/20 rounded-[4px] px-4 py-3 mb-6">
        <p className="text-sm text-[#1A1A1A]">
          <strong className="text-[#00875A]">Multi-tenant pattern:</strong>{' '}
          All organization-scoped tables include an <code className="bg-[#F0F0EC] px-1.5 py-0.5 rounded text-xs font-mono">org_id</code> column with Row-Level Security (RLS) policies ensuring complete data isolation between organizations.
        </p>
      </div>

      {/* Group legend */}
      <div className="flex flex-wrap gap-3 mb-5">
        {groups.map(g => (
          <span key={g} className="flex items-center gap-1.5 text-xs text-[#666]">
            <span className={`w-2.5 h-2.5 rounded-sm ${GROUP_BG[g]}`} />
            {g}
          </span>
        ))}
      </div>

      {/* Table cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {TABLES.map(table => (
          <DiagramContainer key={table.name} className={`!p-4 border-l-[3px] ${GROUP_COLORS[table.group]}`}>
            <div className="flex items-baseline justify-between mb-2">
              <h4 className="text-sm font-semibold font-mono text-[#1A1A1A]">{table.name}</h4>
              <span className="text-[10px] text-[#999] uppercase tracking-wider">{table.group}</span>
            </div>
            <div className="space-y-0.5">
              {table.columns.map(col => (
                <div key={col} className="flex items-center gap-2 text-xs">
                  {col === table.pk && <span className="w-1 h-1 rounded-full bg-[#00875A] flex-shrink-0" />}
                  {col !== table.pk && <span className="w-1 h-1 flex-shrink-0" />}
                  <span className={`font-mono ${col === table.pk ? 'text-[#00875A] font-semibold' : 'text-[#666]'}`}>{col}</span>
                </div>
              ))}
            </div>
            {table.fk && table.fk.length > 0 && (
              <div className="mt-2 pt-2 border-t border-[#E8E8E4]">
                {table.fk.map(fk => (
                  <p key={fk} className="text-[10px] font-mono text-[#999]">FK: {fk}</p>
                ))}
              </div>
            )}
          </DiagramContainer>
        ))}
      </div>
    </section>
  );
}
