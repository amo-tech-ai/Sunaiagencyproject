-- Trigger: broadcast wizard session updates to 'wizard-progress' channel.
-- Fires on UPDATE (step changes, completion status changes).

create or replace function public.broadcast_wizard_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform realtime.broadcast_changes(
    'wizard-progress',
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

create trigger on_wizard_session_update
  after update on public.wizard_sessions
  for each row
  execute function public.broadcast_wizard_update();
