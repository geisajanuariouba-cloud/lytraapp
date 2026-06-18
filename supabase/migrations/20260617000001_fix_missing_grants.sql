-- ============================================================
-- Fix: Grant table-level privileges for core tables
-- Without these, both 'authenticated' and 'service_role' get
-- error 42501 (permission denied) on SELECT/INSERT/UPDATE/DELETE
-- even when RLS policies are correctly defined.
-- ============================================================

-- daily_tasks
grant select, insert, update, delete on public.daily_tasks to authenticated;
grant all on public.daily_tasks to service_role;

-- journal_entries
grant select, insert, update, delete on public.journal_entries to authenticated;
grant all on public.journal_entries to service_role;

-- mood_checkins
grant select, insert, update, delete on public.mood_checkins to authenticated;
grant all on public.mood_checkins to service_role;

-- relapses
grant select, insert, update, delete on public.relapses to authenticated;
grant all on public.relapses to service_role;

-- progress
grant select, insert, update, delete on public.progress to authenticated;
grant all on public.progress to service_role;

-- profiles (already works but make explicit for consistency)
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;

-- onboarding (already works but make explicit for consistency)
grant select, insert, update, delete on public.onboarding to authenticated;
grant all on public.onboarding to service_role;

-- kiwify_orders
grant select on public.kiwify_orders to authenticated;
grant all on public.kiwify_orders to service_role;
