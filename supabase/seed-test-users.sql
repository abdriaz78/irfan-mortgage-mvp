-- Seeds a test admin + test client directly into auth.users, bypassing email
-- confirmation entirely (useful since Supabase's default email sending has a
-- low rate limit on new projects). The existing `on_auth_user_created` trigger
-- fires automatically and creates matching `profiles` + `cases` rows.
--
-- Prerequisite: supabase/migrations/0001_init.sql must already be run.
--
-- Credentials created by this script:
--   Admin  — admin@test.com  / Password123!
--   Client — client@test.com / Password123!

do $$
declare
  admin_id uuid := gen_random_uuid();
  client_id uuid := gen_random_uuid();
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, recovery_token,
    email_change, email_change_token_new
  ) values (
    '00000000-0000-0000-0000-000000000000', admin_id, 'authenticated', 'authenticated',
    'admin@test.com', crypt('Password123!', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}',
    '{"full_name":"Test Admin","phone":"07000000001"}',
    now(), now(), '', '', '', ''
  );

  insert into auth.identities (
    id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
  ) values (
    gen_random_uuid(), admin_id, admin_id::text,
    jsonb_build_object('sub', admin_id::text, 'email', 'admin@test.com'),
    'email', now(), now(), now()
  );

  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, recovery_token,
    email_change, email_change_token_new
  ) values (
    '00000000-0000-0000-0000-000000000000', client_id, 'authenticated', 'authenticated',
    'client@test.com', crypt('Password123!', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}',
    '{"full_name":"Test Client","phone":"07000000002"}',
    now(), now(), '', '', '', ''
  );

  insert into auth.identities (
    id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
  ) values (
    gen_random_uuid(), client_id, client_id::text,
    jsonb_build_object('sub', client_id::text, 'email', 'client@test.com'),
    'email', now(), now(), now()
  );
end $$;

-- Promote the admin account (the trigger creates everyone as 'client' by default).
update public.profiles set role = 'admin' where email = 'admin@test.com';

-- Sanity check — should show both users with roles and their case numbers.
select p.email, p.role, c.case_number, c.current_stage
from public.profiles p
left join public.cases c on c.client_id = p.id
order by p.email;
