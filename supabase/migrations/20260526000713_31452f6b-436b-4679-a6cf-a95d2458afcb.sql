-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  source text default 'kiwify',
  active boolean default true,
  onboarded boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);

-- Onboarding
create table public.onboarding (
  user_id uuid primary key references auth.users(id) on delete cascade,
  habit text not null,
  intensity int not null default 3,
  triggers text[],
  critical_hours text[],
  goal text,
  current_feeling text,
  biggest_obstacle text,
  time_lost text,
  vision_30_days text,
  ai_plan text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.onboarding enable row level security;
create policy "onb_select_own" on public.onboarding for select to authenticated using (auth.uid() = user_id);
create policy "onb_insert_own" on public.onboarding for insert to authenticated with check (auth.uid() = user_id);
create policy "onb_update_own" on public.onboarding for update to authenticated using (auth.uid() = user_id);

-- Daily tasks
create table public.daily_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_date date not null default current_date,
  title text not null,
  description text,
  category text,
  completed boolean default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_daily_tasks_user_date on public.daily_tasks(user_id, task_date);

alter table public.daily_tasks enable row level security;
create policy "tasks_select_own" on public.daily_tasks for select to authenticated using (auth.uid() = user_id);
create policy "tasks_insert_own" on public.daily_tasks for insert to authenticated with check (auth.uid() = user_id);
create policy "tasks_update_own" on public.daily_tasks for update to authenticated using (auth.uid() = user_id);
create policy "tasks_delete_own" on public.daily_tasks for delete to authenticated using (auth.uid() = user_id);

-- Journal entries
create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  ai_response text,
  mood int,
  created_at timestamptz not null default now()
);
create index idx_journal_user on public.journal_entries(user_id, created_at desc);

alter table public.journal_entries enable row level security;
create policy "journal_select_own" on public.journal_entries for select to authenticated using (auth.uid() = user_id);
create policy "journal_insert_own" on public.journal_entries for insert to authenticated with check (auth.uid() = user_id);
create policy "journal_update_own" on public.journal_entries for update to authenticated using (auth.uid() = user_id);
create policy "journal_delete_own" on public.journal_entries for delete to authenticated using (auth.uid() = user_id);

-- Mood check-ins
create table public.mood_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  checkin_date date not null default current_date,
  mood int not null,
  note text,
  created_at timestamptz not null default now(),
  unique (user_id, checkin_date)
);

alter table public.mood_checkins enable row level security;
create policy "mood_select_own" on public.mood_checkins for select to authenticated using (auth.uid() = user_id);
create policy "mood_insert_own" on public.mood_checkins for insert to authenticated with check (auth.uid() = user_id);
create policy "mood_update_own" on public.mood_checkins for update to authenticated using (auth.uid() = user_id);

-- Relapses
create table public.relapses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  context text,
  trigger text,
  created_at timestamptz not null default now()
);

alter table public.relapses enable row level security;
create policy "relapses_select_own" on public.relapses for select to authenticated using (auth.uid() = user_id);
create policy "relapses_insert_own" on public.relapses for insert to authenticated with check (auth.uid() = user_id);

-- Progress log (one row per user, denormalized)
create table public.progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak int default 0,
  best_streak int default 0,
  total_clean_days int default 0,
  level int default 1,
  xp int default 0,
  last_active_date date,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;
create policy "progress_select_own" on public.progress for select to authenticated using (auth.uid() = user_id);
create policy "progress_insert_own" on public.progress for insert to authenticated with check (auth.uid() = user_id);
create policy "progress_update_own" on public.progress for update to authenticated using (auth.uid() = user_id);

-- Kiwify orders (webhook log)
create table public.kiwify_orders (
  id uuid primary key default gen_random_uuid(),
  order_id text unique not null,
  email text not null,
  status text not null,
  product_id text,
  raw jsonb,
  created_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.kiwify_orders enable row level security;
-- No public policies; service role only.

-- Auto-create profile + progress row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email));
  insert into public.progress (user_id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();