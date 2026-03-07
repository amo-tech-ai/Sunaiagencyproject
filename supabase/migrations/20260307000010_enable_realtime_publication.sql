-- Enable Supabase Realtime publication on tables that will use broadcast triggers.
alter publication supabase_realtime add table public.ai_run_logs;
alter publication supabase_realtime add table public.wizard_sessions;
alter publication supabase_realtime add table public.team_members;
