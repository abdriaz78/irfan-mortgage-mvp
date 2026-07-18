-- Configurable key/value app settings, editable by admins.
-- Currently used for the client "review request" message shown on case completion.
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).

create table public.app_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

alter table public.app_settings enable row level security;

-- Any signed-in user can read settings (clients need the review message).
create policy "app_settings_select_authenticated" on public.app_settings for select
  using (auth.uid() is not null);

-- Only admins can create or change settings.
create policy "app_settings_insert_admin" on public.app_settings for insert
  with check (public.is_admin());
create policy "app_settings_update_admin" on public.app_settings for update
  using (public.is_admin()) with check (public.is_admin());

create trigger app_settings_set_updated_at before update on public.app_settings
  for each row execute function public.set_updated_at();

-- Seed the default review-request message.
insert into public.app_settings (key, value) values (
  'review_request_message',
  'Recommend Fasttrack Mortgages to friends and family and leave us a review on Google — as a thank-you, we''ll give you 50% off our advice fee on your next mortgage. It only takes a minute, and it means the world to us.'
)
on conflict (key) do nothing;
