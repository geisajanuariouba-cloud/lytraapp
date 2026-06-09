-- =====================================================================
-- LYTRA — Setup do banco para PROJETO SUPABASE NOVO
-- =====================================================================
-- Contém migrations 1 a 7 (núcleo + roles + policies + grants).
-- NÃO inclui a migration 8 (usuário demo / backdoor) — proposital.
-- Seguro para rodar em um banco NOVO/VAZIO. Rodar duas vezes vai dar erro
-- de objeto duplicado (esperado) — use apenas uma vez em DB limpo.
--
-- COMO RODAR:
--   PARTE A (SETUP): selecione de "PARTE A" até o fim da Migration 7 e execute
--                    de UMA vez. (As migrations são idempotentes entre si na ordem.)
--   PARTE B (VERIFICAÇÃO): rode CADA query separadamente para ver o resultado
--                          (o SQL Editor mostra só o resultado da última query).
-- =====================================================================


-- #####################################################################
-- PARTE A — SETUP (rodar tudo de uma vez)
-- #####################################################################

-- ---------------------------------------------------------------------
-- Migration 1 — 20260526000713 — Núcleo do schema
-- ---------------------------------------------------------------------

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


-- ---------------------------------------------------------------------
-- Migration 2 — 20260526000731 — Hardening inicial
-- ---------------------------------------------------------------------

revoke execute on function public.handle_new_user() from anon, authenticated, public;

create policy "kiwify_orders_no_access" on public.kiwify_orders
  for all to authenticated using (false) with check (false);


-- ---------------------------------------------------------------------
-- Migration 3 — 20260530004539 — Roles, assinaturas e suporte
-- ---------------------------------------------------------------------

-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "users_view_own_roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins_view_all_roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ SUBSCRIPTIONS ============
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'inactive', -- active | canceled | refunded | chargeback | inactive
  plan text,
  order_id text,
  product_id text,
  started_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX subscriptions_user_id_key ON public.subscriptions(user_id);
CREATE INDEX subscriptions_email_idx ON public.subscriptions(email);

GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subs_select_own" ON public.subscriptions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "subs_admin_all" ON public.subscriptions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ SUPPORT TICKETS ============
CREATE TABLE public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subject text NOT NULL,
  status text NOT NULL DEFAULT 'open', -- open | answered | closed
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.support_tickets TO authenticated;
GRANT ALL ON public.support_tickets TO service_role;

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tickets_select_own" ON public.support_tickets
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "tickets_insert_own" ON public.support_tickets
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tickets_admin_all" ON public.support_tickets
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  is_admin boolean NOT NULL DEFAULT false,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX support_messages_ticket_idx ON public.support_messages(ticket_id);

GRANT SELECT, INSERT ON public.support_messages TO authenticated;
GRANT ALL ON public.support_messages TO service_role;

ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "msg_select_own_ticket" ON public.support_messages
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.support_tickets t
    WHERE t.id = ticket_id AND t.user_id = auth.uid()
  ));
CREATE POLICY "msg_insert_own_ticket" ON public.support_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid() AND is_admin = false AND
    EXISTS (SELECT 1 FROM public.support_tickets t WHERE t.id = ticket_id AND t.user_id = auth.uid())
  );
CREATE POLICY "msg_admin_all" ON public.support_messages
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));


-- ---------------------------------------------------------------------
-- Migration 4 — 20260530004558 — Grants de has_role
-- ---------------------------------------------------------------------

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;


-- ---------------------------------------------------------------------
-- Migration 5 — 20260602192627 — Policies adicionais + ajuste de grants
-- ---------------------------------------------------------------------

-- 1. user_roles: deny self-assignment; only admins (or service_role) can write
CREATE POLICY "Only admins can insert roles"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles"
ON public.user_roles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 2. relapses: allow owner update/delete
CREATE POLICY "relapses_update_own"
ON public.relapses FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "relapses_delete_own"
ON public.relapses FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- 3. support_tickets: allow owner update/delete
CREATE POLICY "tickets_update_own"
ON public.support_tickets FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tickets_delete_own"
ON public.support_tickets FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- 4. Restrict EXECUTE on has_role to server roles only
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;


-- ---------------------------------------------------------------------
-- Migration 6 — 20260602192649 — Grant has_role
-- ---------------------------------------------------------------------

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon;


-- ---------------------------------------------------------------------
-- Migration 7 — 20260602192708 — Revoga has_role de anon
-- ---------------------------------------------------------------------

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, PUBLIC;

-- ===== FIM DA PARTE A (SETUP) =====
-- Estado final de has_role: executável por authenticated + service_role.



-- #####################################################################
-- PARTE B — VERIFICAÇÃO (rode CADA query separadamente)
-- #####################################################################

-- B1) As 12 tabelas esperadas + contagem (esperado: 12)
select table_name
from information_schema.tables
where table_schema = 'public' and table_type = 'BASE TABLE'
order by table_name;
-- Esperado: daily_tasks, journal_entries, kiwify_orders, mood_checkins,
--           onboarding, profiles, progress, relapses, subscriptions,
--           support_messages, support_tickets, user_roles

select count(*) as total_tabelas
from information_schema.tables
where table_schema = 'public' and table_type = 'BASE TABLE';
-- Esperado: 12

-- B2) RLS ativo em todas as tabelas (rowsecurity deve ser true em todas)
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;

-- B3) Funções has_role e handle_new_user (esperado: 2 linhas)
select p.proname
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname in ('has_role', 'handle_new_user')
order by p.proname;

-- B4) Trigger on_auth_user_created em auth.users (esperado: 1 linha)
select tgname, tgrelid::regclass as tabela
from pg_trigger
where tgname = 'on_auth_user_created';

-- B5) Índices principais (esperado: 5 linhas)
select indexname, tablename
from pg_indexes
where schemaname = 'public'
  and indexname in (
    'idx_daily_tasks_user_date',
    'idx_journal_user',
    'subscriptions_user_id_key',
    'subscriptions_email_idx',
    'support_messages_ticket_idx'
  )
order by indexname;

-- B6) Garantir que o usuário demo NÃO existe (esperado: 0)
select count(*) as demo_user_count
from auth.users
where email = 'teste@lytra.app';
-- Esperado: 0
