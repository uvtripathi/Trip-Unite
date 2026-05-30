-- TripUnite Supabase schema
-- Run this in Supabase SQL Editor (project: uxwkahohbuzddajwvmtt)

create extension if not exists pgcrypto;

-- USERS
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  password_hash text not null,
  role text not null default 'traveler' check (role in ('traveler', 'leader', 'admin')),
  access_token text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists users_email_unique_ci
  on public.users (lower(email));

create index if not exists users_role_idx
  on public.users (role);

-- TRIPS
create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  destination text not null,
  description text not null,
  start_date date not null,
  end_date date not null,
  estimated_budget numeric(12,2) not null,
  traveller_count integer,
  local_guide boolean not null default false,
  meetup_location text not null,
  gender text,
  min_age integer not null,
  max_age integer not null,
  remark text,
  created_by uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trips_age_valid check (min_age <= max_age),
  constraint trips_end_after_start check (end_date >= start_date)
);

create index if not exists trips_created_by_idx
  on public.trips (created_by);

create index if not exists trips_start_date_idx
  on public.trips (start_date desc);

create index if not exists trips_destination_idx
  on public.trips (destination);

-- TRIP MEMBERS / JOIN REQUESTS
create table if not exists public.trip_members (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  contact text not null,
  age integer not null,
  gender text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trip_members_unique_trip_user unique (trip_id, user_id)
);

create index if not exists trip_members_trip_idx
  on public.trip_members (trip_id);

create index if not exists trip_members_user_idx
  on public.trip_members (user_id);

create index if not exists trip_members_status_idx
  on public.trip_members (status);

-- FEEDBACK
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  rating text not null check (rating in ('0', '1', '2', '3', '4', '5')),
  created_at timestamptz not null default now()
);

create index if not exists feedback_created_at_idx
  on public.feedback (created_at desc);

-- UPDATED_AT trigger helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Attach update triggers safely

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'users_set_updated_at'
  ) then
    create trigger users_set_updated_at
      before update on public.users
      for each row execute function public.set_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger
    where tgname = 'trips_set_updated_at'
  ) then
    create trigger trips_set_updated_at
      before update on public.trips
      for each row execute function public.set_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger
    where tgname = 'trip_members_set_updated_at'
  ) then
    create trigger trip_members_set_updated_at
      before update on public.trip_members
      for each row execute function public.set_updated_at();
  end if;
end $$;

-- Security baseline: enable RLS (service_role bypasses this)
alter table public.users enable row level security;
alter table public.trips enable row level security;
alter table public.trip_members enable row level security;
alter table public.feedback enable row level security;

-- Optional view for admin dashboard monthly metrics
create or replace view public.monthly_trip_stats as
select
  date_trunc('month', t.created_at) as month,
  count(*)::int as total_trips,
  coalesce(sum(t.traveller_count), 0)::int as total_requested_seats,
  count(tm.id) filter (where tm.status = 'pending')::int as pending_join_requests,
  count(tm.id) filter (where tm.status = 'approved')::int as approved_join_requests,
  count(tm.id) filter (where tm.status = 'rejected')::int as rejected_join_requests
from public.trips t
left join public.trip_members tm on tm.trip_id = t.id
group by 1
order by 1 desc;
