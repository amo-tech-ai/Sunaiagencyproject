// C86-REALTIME — Section 6: Realtime System
import { SectionTitle, DiagramContainer } from './ArchDiagramBlock';
import { Radio, ArrowRight, RefreshCw } from 'lucide-react';

interface RealtimeChannel {
  channel: string;
  table: string;
  events: string[];
  uiEffect: string;
}

const CHANNELS: RealtimeChannel[] = [
  { channel: 'project-tasks', table: 'tasks', events: ['INSERT', 'UPDATE', 'DELETE'], uiEffect: 'Dashboard task board auto-refreshes' },
  { channel: 'wizard-progress', table: 'wizard_sessions', events: ['UPDATE'], uiEffect: 'Processing page shows live step progress' },
  { channel: 'team-activity', table: 'team_members', events: ['INSERT', 'DELETE'], uiEffect: 'Team list updates in real time' },
  { channel: 'milestones', table: 'milestones', events: ['UPDATE'], uiEffect: 'Project timeline markers update' },
  { channel: 'ai-runs', table: 'ai_run_logs', events: ['INSERT'], uiEffect: 'AI activity feed shows new completions' },
];

export function RealtimeSystem() {
  return (
    <section>
      <SectionTitle
        number="06"
        title="Realtime System"
        subtitle="WebSocket-based live updates via Supabase Realtime"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* How it works */}
        <DiagramContainer className="lg:col-span-1">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#999] mb-4">How It Works</h4>
          <div className="flex flex-col items-center gap-1">
            {[
              { label: 'Database Change', detail: 'INSERT / UPDATE / DELETE', color: 'bg-amber-50 text-amber-800 border border-amber-200' },
              { label: 'Postgres Trigger', detail: 'Fires on table change', color: 'bg-[#F0F0EC] text-[#1A1A1A] border border-[#E8E8E4]' },
              { label: 'Supabase Realtime', detail: 'Broadcasts via WebSocket', color: 'bg-purple-50 text-purple-800 border border-purple-200' },
              { label: 'Frontend Listener', detail: 'supabase.channel().on()', color: 'bg-[#1A1A1A] text-white' },
              { label: 'UI Re-render', detail: 'React state update', color: 'bg-[#00875A]/10 text-[#00875A] border border-[#00875A]/30' },
            ].map((step, i, arr) => (
              <div key={i} className="flex flex-col items-center w-full">
                <div className={`${step.color} rounded-[4px] px-3 py-2 text-xs w-full`}>
                  <div className="font-semibold">{step.label}</div>
                  <div className="opacity-70 text-[10px] mt-0.5">{step.detail}</div>
                </div>
                {i < arr.length - 1 && (
                  <div className="py-0.5">
                    <RefreshCw size={10} className="text-[#E8E8E4]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </DiagramContainer>

        {/* Channel reference */}
        <DiagramContainer className="lg:col-span-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#999] mb-4">Active Channels</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#E8E8E4]">
                  <th className="text-left py-2 pr-4 text-[10px] text-[#999] uppercase tracking-wider font-semibold">Channel</th>
                  <th className="text-left py-2 pr-4 text-[10px] text-[#999] uppercase tracking-wider font-semibold">Table</th>
                  <th className="text-left py-2 pr-4 text-[10px] text-[#999] uppercase tracking-wider font-semibold">Events</th>
                  <th className="text-left py-2 text-[10px] text-[#999] uppercase tracking-wider font-semibold">UI Effect</th>
                </tr>
              </thead>
              <tbody>
                {CHANNELS.map(ch => (
                  <tr key={ch.channel} className="border-b border-[#E8E8E4] last:border-b-0">
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-1.5">
                        <Radio size={10} className="text-purple-500" />
                        <span className="font-mono font-semibold text-[#1A1A1A]">{ch.channel}</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-[#666]">{ch.table}</td>
                    <td className="py-2.5 pr-4">
                      <div className="flex flex-wrap gap-1">
                        {ch.events.map(e => (
                          <span key={e} className="bg-[#F0F0EC] text-[#666] px-1.5 py-0.5 rounded-sm text-[10px] font-mono">{e}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 text-[#666]">{ch.uiEffect}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DiagramContainer>
      </div>
    </section>
  );
}
