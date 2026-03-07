// C85-AUTH — Section 5: Authentication Flow
import { SectionTitle, DiagramContainer } from './ArchDiagramBlock';
import { ArrowDown, Shield, Lock, Users, Key, Database } from 'lucide-react';

export function AuthFlow() {
  const steps = [
    { icon: <Users size={16} />, label: 'User Login', detail: 'Email/password or OAuth (Google, GitHub)', color: 'bg-[#1A1A1A] text-white' },
    { icon: <Lock size={16} />, label: 'Supabase Auth', detail: 'Validates credentials, creates session', color: 'bg-[#00875A]/10 text-[#00875A] border border-[#00875A]/30' },
    { icon: <Key size={16} />, label: 'JWT Token', detail: 'Contains user_id, org_id, role claims', color: 'bg-amber-50 text-amber-800 border border-amber-200' },
    { icon: <Shield size={16} />, label: 'RLS Policies', detail: 'Row-Level Security enforces org_id isolation', color: 'bg-purple-50 text-purple-800 border border-purple-200' },
    { icon: <Database size={16} />, label: 'Database Access', detail: 'Only org-scoped rows returned', color: 'bg-blue-50 text-blue-800 border border-blue-200' },
  ];

  return (
    <section>
      <SectionTitle
        number="05"
        title="Authentication Flow"
        subtitle="JWT-based auth with Row-Level Security for multi-tenant isolation"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auth flow diagram */}
        <DiagramContainer>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#999] mb-4">Login → Database Access</h4>
          <div className="flex flex-col items-center">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center w-full">
                <div className={`${step.color} rounded-[4px] px-4 py-3 text-xs w-full max-w-xs`}>
                  <div className="flex items-center gap-2 font-semibold">
                    {step.icon}
                    {step.label}
                  </div>
                  <p className="mt-1 opacity-80 text-[11px]">{step.detail}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="py-1">
                    <ArrowDown size={14} className="text-[#E8E8E4]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </DiagramContainer>

        {/* RLS policy reference */}
        <DiagramContainer>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#999] mb-4">RLS Policy Reference</h4>
          <div className="space-y-3">
            <RLSPolicy
              table="organizations"
              policy="Users can only read their own organization"
              sql="auth.uid() IN (SELECT user_id FROM team_members WHERE org_id = id)"
            />
            <RLSPolicy
              table="projects"
              policy="Team members see only org projects"
              sql="org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid())"
            />
            <RLSPolicy
              table="wizard_sessions"
              policy="Org-scoped wizard access"
              sql="org_id = (SELECT org_id FROM profiles WHERE user_id = auth.uid())"
            />
            <RLSPolicy
              table="ai_run_logs"
              policy="Org-scoped AI log access"
              sql="org_id = (SELECT org_id FROM profiles WHERE user_id = auth.uid())"
            />

            {/* Multi-tenant security diagram */}
            <div className="mt-4 pt-4 border-t border-[#E8E8E4]">
              <h5 className="text-xs font-semibold text-[#1A1A1A] mb-3">Multi-Tenant Security Model</h5>
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <div className="bg-[#00875A]/5 border border-[#00875A]/20 rounded-[4px] p-2 text-center">
                  <p className="font-semibold text-[#00875A]">Org A</p>
                  <p className="text-[#666] mt-1">team_members ↔ org_id</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-[4px] p-2 text-center">
                  <p className="font-semibold text-blue-800">Org B</p>
                  <p className="text-[#666] mt-1">team_members ↔ org_id</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-[4px] p-2 text-center">
                  <p className="font-semibold text-amber-800">Org C</p>
                  <p className="text-[#666] mt-1">team_members ↔ org_id</p>
                </div>
              </div>
              <p className="text-[10px] text-[#999] mt-2 text-center">Each organization sees only its own data — enforced at the database level</p>
            </div>
          </div>
        </DiagramContainer>
      </div>
    </section>
  );
}

function RLSPolicy({ table, policy, sql }: { table: string; policy: string; sql: string }) {
  return (
    <div className="border border-[#E8E8E4] rounded-[4px] p-3">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-xs font-mono font-semibold text-[#1A1A1A]">{table}</span>
        <span className="text-[10px] text-[#00875A] font-semibold">RLS</span>
      </div>
      <p className="text-[11px] text-[#666] mb-1.5">{policy}</p>
      <code className="text-[10px] font-mono text-[#999] bg-[#FAFAF8] block p-1.5 rounded-sm break-all">{sql}</code>
    </div>
  );
}
