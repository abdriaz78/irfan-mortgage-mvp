-- Public (no-login) mortgage enquiries submitted from the marketing site's
-- "Get Started" flow. These are captured here so an admin can review them and
-- follow up / convert them into a proper case.
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).

create table public.public_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text,
  phone text,
  mortgage_type text,
  details jsonb not null,
  created_at timestamptz not null default now()
);
create index public_applications_created_at_idx on public.public_applications (created_at desc);

alter table public.public_applications enable row level security;

-- Anyone (including anonymous visitors) may submit an application.
create policy "public_applications_insert_anyone" on public.public_applications for insert
  with check (true);

-- Only admins can read the submissions.
create policy "public_applications_select_admin" on public.public_applications for select
  using (public.is_admin());
