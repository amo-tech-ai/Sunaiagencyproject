-- Trigger: broadcast new AI run log entries to the 'ai-runs' channel.
-- Uses realtime.broadcast_changes() (broadcast pattern, not postgres_changes).

create or replace function public.broadcast_ai_run_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform realtime.broadcast_changes(
    'ai-runs',
    TG_OP,
    TG_OP,
    TG_TABLE_NAME,
    TG_TABLE_SCHEMA,
    NEW,
    OLD
  );
  return NEW;
end;
$$;

create trigger on_ai_run_log_insert
  after insert on public.ai_run_logs
  for each row
  execute function public.broadcast_ai_run_insert();
