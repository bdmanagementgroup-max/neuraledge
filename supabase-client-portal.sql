-- NeuralEdge Client Portal — run in Supabase SQL editor

-- ============================================================
-- CLIENT PROFILES
-- ============================================================
create table if not exists client_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  display_name text,
  company_name text,
  phone text,
  website text,
  industry text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table client_profiles enable row level security;
create policy "profiles select own" on client_profiles for select using (auth.uid() = user_id);
create policy "profiles insert own" on client_profiles for insert with check (auth.uid() = user_id);
create policy "profiles update own" on client_profiles for update using (auth.uid() = user_id);

-- ============================================================
-- CLIENT NOTIFICATIONS
-- ============================================================
create table if not exists client_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz default now()
);
alter table client_notifications enable row level security;
create policy "notifications select own" on client_notifications for select using (auth.uid() = user_id);
create policy "notifications update own" on client_notifications for update using (auth.uid() = user_id);

-- ============================================================
-- TOOLS (curated AI/automation tool links for clients)
-- ============================================================
create table if not exists tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  url text,
  category text,
  active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);
alter table tools enable row level security;
create policy "public read active tools" on tools for select using (active = true);

-- ============================================================
-- RESOURCES (guides, templates, free tools for clients)
-- ============================================================
create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  url text,
  resource_type text check (resource_type in ('article', 'guide', 'template', 'tool', 'video')) default 'article',
  active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);
alter table resources enable row level security;
create policy "public read active resources" on resources for select using (active = true);
