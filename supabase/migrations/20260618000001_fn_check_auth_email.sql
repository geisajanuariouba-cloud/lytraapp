-- Returns true if an email exists in auth.users.
-- SECURITY DEFINER runs as the function owner (postgres) with access to auth schema.
-- Only callable by service_role — prevents client-side user enumeration.
create or replace function public.check_auth_email_exists(p_email text)
returns boolean
language sql
security definer
set search_path = auth, public
as $$
  select exists (select 1 from auth.users where lower(email) = lower(p_email))
$$;

-- Only service_role can call this (server-side only)
revoke execute on function public.check_auth_email_exists(text) from public, anon, authenticated;
grant execute on function public.check_auth_email_exists(text) to service_role;
