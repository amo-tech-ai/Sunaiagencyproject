// C89-FE-HOOKS — Section 9: Frontend Hook Examples
import { SectionTitle, DiagramContainer } from './ArchDiagramBlock';

interface HookExample {
  name: string;
  purpose: string;
  code: string;
}

const HOOKS: HookExample[] = [
  {
    name: 'useWizardSession',
    purpose: 'Fetch and manage wizard session state',
    code: `const useWizardSession = (sessionId: string) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch(
        \`\${BASE_URL}/wizard/\${sessionId}\`,
        { headers: { Authorization: \`Bearer \${token}\` } }
      );
      const data = await res.json();
      setSession(data);
      setLoading(false);
    };
    fetchSession();
  }, [sessionId]);

  return { session, loading };
};`,
  },
  {
    name: 'useCreateProject',
    purpose: 'Create a new project via Edge Function',
    code: `const useCreateProject = () => {
  const [creating, setCreating] = useState(false);

  const createProject = async (data: ProjectInput) => {
    setCreating(true);
    const res = await fetch(\`\${BASE_URL}/projects\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: \`Bearer \${token}\`,
      },
      body: JSON.stringify(data),
    });
    const project = await res.json();
    setCreating(false);
    return project;
  };

  return { createProject, creating };
};`,
  },
  {
    name: 'useRealtimeTasks',
    purpose: 'Subscribe to live task updates for a project',
    code: `const useRealtimeTasks = (projectId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Initial fetch
    supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .then(({ data }) => setTasks(data ?? []));

    // Realtime subscription
    const channel = supabase
      .channel(\`project-tasks-\${projectId}\`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: \`project_id=eq.\${projectId}\`,
      }, (payload) => {
        // Handle INSERT, UPDATE, DELETE
        handleTaskChange(payload, setTasks);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [projectId]);

  return tasks;
};`,
  },
  {
    name: 'useRoadmap',
    purpose: 'Fetch generated roadmap with phases',
    code: `const useRoadmap = (roadmapId: string) => {
  const [roadmap, setRoadmap] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await fetch(
        \`\${BASE_URL}/roadmap/\${roadmapId}\`,
        { headers: { Authorization: \`Bearer \${token}\` } }
      );
      setRoadmap(await res.json());
    };
    fetch();
  }, [roadmapId]);

  return roadmap;
};`,
  },
];

export function FrontendHooks() {
  return (
    <section>
      <SectionTitle
        number="09"
        title="Frontend Integration Hooks"
        subtitle="Example React hooks for Supabase data access patterns"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {HOOKS.map(hook => (
          <DiagramContainer key={hook.name}>
            <div className="mb-3">
              <h4 className="text-sm font-mono font-semibold text-[#00875A]">{hook.name}</h4>
              <p className="text-xs text-[#666] mt-0.5">{hook.purpose}</p>
            </div>
            <pre className="bg-[#1A1A1A] text-[#E8E8E4] rounded-[4px] p-3 overflow-x-auto text-[10px] leading-relaxed font-mono">
              <code>{hook.code}</code>
            </pre>
          </DiagramContainer>
        ))}
      </div>
    </section>
  );
}
