-- Grant missing SELECT/INSERT to authenticated on gamification tables.
-- daily_completions and user_achievements had RLS policies for authenticated
-- but no underlying GRANT, so authenticated users got 0 rows from SELECT.

grant select, insert on public.daily_completions to authenticated;
grant select, insert on public.user_achievements to authenticated;
