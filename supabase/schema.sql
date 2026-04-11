-- Supabase schema for BrandAI backend migration.
-- Run with: supabase db push (or execute in SQL editor).

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.brand_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_by text not null,
  created_date timestamptz not null default now(),

  status text not null default 'pending' check (status in ('pending', 'analyzing', 'completed', 'failed')),

  instagram_url text,
  tiktok_url text,
  youtube_url text,
  twitter_url text,
  linkedin_url text,
  facebook_url text,

  industry text,
  goals jsonb not null default '[]'::jsonb,
  existing_content text,

  overall_grade text,
  content_quality_grade text,
  engagement_grade text,
  networking_grade text,
  alignment_grade text,

  brand_summary text,
  strengths jsonb not null default '[]'::jsonb,
  weaknesses jsonb not null default '[]'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  content_calendar jsonb not null default '[]'::jsonb,
  networking_opportunities jsonb not null default '[]'::jsonb,
  trend_predictions jsonb not null default '[]'::jsonb,
  influencer_suggestions jsonb not null default '[]'::jsonb
);

create index if not exists idx_brand_analyses_user_created_date
  on public.brand_analyses (user_id, created_date desc);

create index if not exists idx_brand_analyses_created_by_created_date
  on public.brand_analyses (created_by, created_date desc);

alter table public.profiles enable row level security;
alter table public.brand_analyses enable row level security;

create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can read own analyses"
  on public.brand_analyses
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own analyses"
  on public.brand_analyses
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own analyses"
  on public.brand_analyses
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
