-- NeuralEdge Supabase Migration
-- Run this in the Supabase SQL editor

-- ============================================================
-- LEADS
-- ============================================================
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  created_at timestamptz default now()
);

-- ============================================================
-- ENQUIRIES
-- ============================================================
create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  message text,
  automation_type text,
  created_at timestamptz default now()
);

-- ============================================================
-- ARTICLES
-- ============================================================
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  content text,
  excerpt text,
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now()
);

-- ============================================================
-- AUTOMATIONS (public catalogue)
-- ============================================================
create table if not exists automations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  category text,
  price_from integer,          -- cents (USD); null = custom quote
  active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- CLIENTS
-- ============================================================
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  email text not null,
  company text,
  plan text check (plan in ('Launchpad', 'Transform', 'Enterprise')),
  status text default 'active' check (status in ('active', 'paused', 'completed')),
  created_at timestamptz default now()
);

-- ============================================================
-- PROJECTS
-- ============================================================
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  status text default 'discovery' check (status in ('discovery', 'build', 'review', 'live', 'paused')),
  automation_id uuid references automations(id) on delete set null,
  start_date date,
  target_date date,
  created_at timestamptz default now()
);

-- ============================================================
-- PROJECT MILESTONES
-- ============================================================
create table if not exists project_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  title text not null,
  status text default 'pending' check (status in ('pending', 'in_progress', 'completed')),
  completed_at timestamptz,
  sort_order integer default 0
);

-- ============================================================
-- AUTOMATION METRICS
-- ============================================================
create table if not exists automation_metrics (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  runs_total integer default 0,
  runs_this_month integer default 0,
  hours_saved_total numeric(10,2) default 0,
  hours_saved_this_month numeric(10,2) default 0,
  error_rate numeric(5,2) default 0,
  last_run_at timestamptz,
  updated_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on client-facing tables
alter table clients enable row level security;
alter table projects enable row level security;
alter table project_milestones enable row level security;
alter table automation_metrics enable row level security;

-- leads: anyone can insert (public form), no one can select (admin only via service role)
alter table leads enable row level security;
create policy "anon insert leads" on leads for insert with check (true);

-- enquiries: anyone can insert (public form), no one can select (admin only via service role)
alter table enquiries enable row level security;
create policy "anon insert enquiries" on enquiries for insert with check (true);

-- articles: public can read published articles
alter table articles enable row level security;
create policy "public read published articles" on articles for select using (published = true);

-- automations: public can read active automations
alter table automations enable row level security;
create policy "public read active automations" on automations for select using (active = true);

-- clients: users can only see their own row
create policy "clients select own" on clients for select using (auth.uid() = user_id);

-- projects: users can only see their own projects
create policy "projects select own" on projects for select using (auth.uid() = user_id);

-- project_milestones: users can see milestones for their own projects
create policy "milestones select own" on project_milestones for select
  using (
    exists (
      select 1 from projects p
      where p.id = project_milestones.project_id
        and p.user_id = auth.uid()
    )
  );

-- automation_metrics: users can see metrics for their own projects
create policy "metrics select own" on automation_metrics for select using (auth.uid() = user_id);
