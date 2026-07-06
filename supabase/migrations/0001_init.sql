-- Inquiry Management System schema: profiles/roles, cases, stage pipeline,
-- information form, documents, lender/admin requests, notifications.
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).

-- ============================================================================
-- Enums
-- ============================================================================
create type public.user_role as enum ('client', 'admin');
create type public.document_type as enum (
  'id_proof', 'proof_of_address', 'payslips', 'bank_statements',
  'credit_report', 'sa302_tax_return', 'mortgage_offer', 'other'
);
create type public.document_status as enum ('pending', 'verified', 'rejected');
create type public.request_type as enum ('document', 'information');
create type public.request_status as enum ('open', 'fulfilled');

-- ============================================================================
-- Tables
-- ============================================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  phone text,
  role public.user_role not null default 'client',
  created_at timestamptz not null default now()
);

create table public.cases (
  id uuid primary key default gen_random_uuid(),
  case_number text not null unique,
  client_id uuid not null references public.profiles(id) on delete cascade,
  assigned_admin_id uuid references public.profiles(id) on delete set null,
  current_stage smallint not null default 1 check (current_stage between 1 and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- One active case per client for this MVP.
create unique index cases_client_id_idx on public.cases(client_id);

create table public.case_stage_history (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  from_stage smallint,
  to_stage smallint not null,
  moved_by uuid not null references public.profiles(id),
  note text not null,
  created_at timestamptz not null default now()
);
create index case_stage_history_case_id_idx on public.case_stage_history(case_id);

create table public.information_form_responses (
  case_id uuid primary key references public.cases(id) on delete cascade,
  full_name text,
  date_of_birth date,
  phone text,
  address text,
  employment_status text,
  employer_name text,
  annual_income numeric,
  has_ccjs boolean,
  has_defaults boolean,
  has_bankruptcy_or_iva boolean,
  credit_notes text,
  property_value numeric,
  deposit_amount numeric,
  mortgage_type text,
  purchase_timeline text,
  submitted_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  uploaded_by uuid not null references public.profiles(id),
  document_type public.document_type not null,
  file_path text not null,
  status public.document_status not null default 'pending',
  reviewer_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);
create index documents_case_id_idx on public.documents(case_id);

create table public.case_requests (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  requested_by uuid not null references public.profiles(id),
  type public.request_type not null,
  description text not null,
  status public.request_status not null default 'open',
  created_at timestamptz not null default now(),
  fulfilled_at timestamptz
);
create index case_requests_case_id_idx on public.case_requests(case_id);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id),
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index notifications_recipient_id_idx on public.notifications(recipient_id);

-- ============================================================================
-- Helper functions
-- ============================================================================
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cases_set_updated_at before update on public.cases
  for each row execute function public.set_updated_at();

create trigger info_form_set_updated_at before update on public.information_form_responses
  for each row execute function public.set_updated_at();

-- New auth user -> profile + starter case (stage 1: Inquiry Received).
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  new_case_number text;
begin
  insert into public.profiles (id, full_name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    new.raw_user_meta_data->>'phone',
    'client'
  );

  new_case_number := 'MTG-' || to_char(now(), 'YY') || '-' || lpad((floor(random() * 100000))::text, 5, '0');

  insert into public.cases (case_number, client_id, current_stage)
  values (new_case_number, new.id, 1);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Atomic stage transitions: updates the case, logs history, notifies the client.
create or replace function public.move_case_stage(p_case_id uuid, p_new_stage smallint, p_note text)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  v_old_stage smallint;
  v_client_id uuid;
begin
  if not public.is_admin() then
    raise exception 'Only admins can move a case stage';
  end if;
  if p_new_stage < 1 or p_new_stage > 10 then
    raise exception 'Stage must be between 1 and 10';
  end if;

  select current_stage, client_id into v_old_stage, v_client_id
  from public.cases where id = p_case_id;

  if v_old_stage is null then
    raise exception 'Case not found';
  end if;

  update public.cases set current_stage = p_new_stage where id = p_case_id;

  insert into public.case_stage_history (case_id, from_stage, to_stage, moved_by, note)
  values (p_case_id, v_old_stage, p_new_stage, auth.uid(), p_note);

  insert into public.notifications (case_id, recipient_id, message)
  values (p_case_id, v_client_id, 'Your case moved to a new stage: ' || p_note);
end;
$$;
grant execute on function public.move_case_stage(uuid, smallint, text) to authenticated;

-- Document review: updates status + notifies the client.
create or replace function public.review_document(p_document_id uuid, p_status public.document_status, p_note text)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  v_case_id uuid;
  v_client_id uuid;
begin
  if not public.is_admin() then
    raise exception 'Only admins can review documents';
  end if;

  select case_id into v_case_id from public.documents where id = p_document_id;
  if v_case_id is null then
    raise exception 'Document not found';
  end if;

  update public.documents
  set status = p_status, reviewer_note = p_note, reviewed_at = now()
  where id = p_document_id;

  select client_id into v_client_id from public.cases where id = v_case_id;

  insert into public.notifications (case_id, recipient_id, message)
  values (v_case_id, v_client_id, 'A document was reviewed: ' || p_status || case when p_note is not null and p_note <> '' then ' — ' || p_note else '' end);
end;
$$;
grant execute on function public.review_document(uuid, public.document_status, text) to authenticated;

-- Admin/lender requests more info or documents from the client.
create or replace function public.create_case_request(p_case_id uuid, p_type public.request_type, p_description text)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare
  v_id uuid;
  v_client_id uuid;
begin
  if not public.is_admin() then
    raise exception 'Only admins can create requests';
  end if;

  insert into public.case_requests (case_id, requested_by, type, description)
  values (p_case_id, auth.uid(), p_type, p_description)
  returning id into v_id;

  select client_id into v_client_id from public.cases where id = p_case_id;
  insert into public.notifications (case_id, recipient_id, message)
  values (p_case_id, v_client_id, 'New request from your advisor: ' || p_description);

  return v_id;
end;
$$;
grant execute on function public.create_case_request(uuid, public.request_type, text) to authenticated;

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.cases enable row level security;
alter table public.case_stage_history enable row level security;
alter table public.information_form_responses enable row level security;
alter table public.documents enable row level security;
alter table public.case_requests enable row level security;
alter table public.notifications enable row level security;

create policy "profiles_select_own_or_admin" on public.profiles for select
  using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own" on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

create policy "cases_select_own_or_admin" on public.cases for select
  using (client_id = auth.uid() or public.is_admin());
create policy "cases_update_admin_only" on public.cases for update
  using (public.is_admin()) with check (public.is_admin());

create policy "history_select_related" on public.case_stage_history for select
  using (exists (select 1 from public.cases c where c.id = case_id and (c.client_id = auth.uid() or public.is_admin())));
create policy "history_insert_admin_only" on public.case_stage_history for insert
  with check (public.is_admin());

create policy "info_select_related" on public.information_form_responses for select
  using (exists (select 1 from public.cases c where c.id = case_id and (c.client_id = auth.uid() or public.is_admin())));
create policy "info_insert_own_case" on public.information_form_responses for insert
  with check (exists (select 1 from public.cases c where c.id = case_id and c.client_id = auth.uid()));
create policy "info_update_own_case_or_admin" on public.information_form_responses for update
  using (exists (select 1 from public.cases c where c.id = case_id and (c.client_id = auth.uid() or public.is_admin())));

create policy "documents_select_related" on public.documents for select
  using (exists (select 1 from public.cases c where c.id = case_id and (c.client_id = auth.uid() or public.is_admin())));
create policy "documents_insert_own_case" on public.documents for insert
  with check (uploaded_by = auth.uid() and exists (select 1 from public.cases c where c.id = case_id and c.client_id = auth.uid()));
create policy "documents_insert_admin" on public.documents for insert
  with check (public.is_admin());
create policy "documents_update_admin_only" on public.documents for update
  using (public.is_admin());

create policy "requests_select_related" on public.case_requests for select
  using (exists (select 1 from public.cases c where c.id = case_id and (c.client_id = auth.uid() or public.is_admin())));
create policy "requests_update_admin_only" on public.case_requests for update
  using (public.is_admin());

create policy "notifications_select_own" on public.notifications for select
  using (recipient_id = auth.uid());
create policy "notifications_update_own" on public.notifications for update
  using (recipient_id = auth.uid()) with check (recipient_id = auth.uid());

-- ============================================================================
-- Storage: case documents bucket
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('case-documents', 'case-documents', false)
on conflict (id) do nothing;

create policy "case_docs_select" on storage.objects for select
  using (
    bucket_id = 'case-documents' and (
      public.is_admin() or exists (
        select 1 from public.cases c
        where c.client_id = auth.uid() and (storage.foldername(name))[1] = c.id::text
      )
    )
  );

create policy "case_docs_insert" on storage.objects for insert
  with check (
    bucket_id = 'case-documents' and (
      public.is_admin() or exists (
        select 1 from public.cases c
        where c.client_id = auth.uid() and (storage.foldername(name))[1] = c.id::text
      )
    )
  );

-- ============================================================================
-- Provisioning your first admin (run manually after a client account exists):
--   update public.profiles set role = 'admin' where email = 'you@example.com';
-- ============================================================================
