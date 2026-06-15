-- ============================================================
-- Gamification: daily_completions + user_achievements
-- ============================================================

-- Tracks one row per user per day when they complete all daily tasks.
-- Used to: award +50 XP bonus once per day, update streak, prevent duplicates.
create table if not exists public.daily_completions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  completed_date date not null default current_date,
  xp_awarded int not null default 50,
  created_at timestamptz not null default now(),
  unique (user_id, completed_date)
);

create index if not exists idx_daily_completions_user
  on public.daily_completions(user_id, completed_date desc);

alter table public.daily_completions enable row level security;
create policy "dc_select_own" on public.daily_completions
  for select to authenticated using (auth.uid() = user_id);
create policy "dc_insert_own" on public.daily_completions
  for insert to authenticated with check (auth.uid() = user_id);

-- Service role gets full access for server functions
grant select, insert on public.daily_completions to service_role;


-- Tracks unlocked achievements per user (no duplicates via unique constraint).
create table if not exists public.user_achievements (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  achievement_key text not null,
  unlocked_at     timestamptz not null default now(),
  unique (user_id, achievement_key)
);

create index if not exists idx_user_achievements_user
  on public.user_achievements(user_id);

alter table public.user_achievements enable row level security;
create policy "ach_select_own" on public.user_achievements
  for select to authenticated using (auth.uid() = user_id);
create policy "ach_insert_own" on public.user_achievements
  for insert to authenticated with check (auth.uid() = user_id);

grant select, insert on public.user_achievements to service_role;


-- Add total_tasks_completed + total_days_completed to progress if not present
alter table public.progress
  add column if not exists total_tasks_completed int default 0,
  add column if not exists total_days_completed  int default 0;
