-- RLS policies on realtime.messages for channel-level access control.
-- RLS is already enabled on realtime.messages; just add policies.

-- Allow authenticated users to receive broadcast messages
create policy "Authenticated users can receive broadcasts"
  on realtime.messages
  for select
  to authenticated
  using (true);

-- Allow service role to insert broadcast messages (used by trigger functions)
create policy "Service role can insert broadcasts"
  on realtime.messages
  for insert
  to service_role
  with check (true);
