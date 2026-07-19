-- Client referrals submitted from the public "Refer a Client" page.
-- Captured here so an admin can review and follow up with both the referred
-- client and the person who referred them.
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).

create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_phone text,
  client_email text,
  referrer_name text not null,
  referrer_phone text,
  created_at timestamptz not null default now()
);
create index referrals_created_at_idx on public.referrals (created_at desc);

alter table public.referrals enable row level security;

-- Anyone (including anonymous visitors) may submit a referral.
create policy "referrals_insert_anyone" on public.referrals for insert
  with check (true);

-- Only admins can read referrals.
create policy "referrals_select_admin" on public.referrals for select
  using (public.is_admin());
