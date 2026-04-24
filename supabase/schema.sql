-- ============================================================
-- PlantAI Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'team')),
  scans_this_month integer not null default 0,
  onboarding_complete boolean not null default false,
  crop_types text[],
  region text,
  push_subscription jsonb,
  created_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Scans
create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  image_url text not null,
  disease_name text,
  confidence float check (confidence >= 0 and confidence <= 1),
  severity text check (severity in ('low', 'medium', 'high', 'critical')),
  treatment_steps jsonb,
  status text not null default 'pending' check (status in ('pending', 'complete', 'failed')),
  created_at timestamptz not null default now()
);

-- 3. Share Links
create table if not exists public.share_links (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid references public.scans(id) on delete cascade not null,
  token text unique not null,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- 4. Subscriptions (Phase 2 Stripe — schema ready now)
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  stripe_subscription_id text unique,
  plan text not null,
  status text not null,
  current_period_end timestamptz
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

alter table public.profiles enable row level security;
alter table public.scans enable row level security;
alter table public.share_links enable row level security;
alter table public.subscriptions enable row level security;

-- Profiles: users can only read/update their own row
create policy "profiles: own row only" on public.profiles
  for all using (auth.uid() = id);

-- Scans: users can only CRUD their own scans
create policy "scans: own scans only" on public.scans
  for all using (auth.uid() = user_id);

-- Share links: owner can insert; public can read by token
create policy "share_links: owner insert" on public.share_links
  for insert with check (
    auth.uid() = (select user_id from public.scans where id = scan_id)
  );

create policy "share_links: public read by token" on public.share_links
  for select using (true);

-- Subscriptions: own row only
create policy "subscriptions: own row only" on public.subscriptions
  for all using (auth.uid() = user_id);

-- ============================================================
-- Supabase Storage: 'scans' bucket
-- ============================================================
-- Run in Supabase Dashboard → Storage → New Bucket
-- Name: scans
-- Public: true (images are referenced by URL in the app)
-- File size limit: 10MB
-- Allowed MIME types: image/jpeg, image/png, image/webp

-- Storage RLS: users can only upload to their own folder
-- insert this in Dashboard → Storage → Policies → scans bucket:
--
-- Policy name: "Users upload to own folder"
-- Allowed operation: INSERT
-- WITH CHECK: (auth.uid()::text = (storage.foldername(name))[1])

-- ============================================================
-- Indexes for performance
-- ============================================================
create index if not exists scans_user_id_idx on public.scans(user_id);
create index if not exists scans_created_at_idx on public.scans(created_at desc);
create index if not exists share_links_token_idx on public.share_links(token);
