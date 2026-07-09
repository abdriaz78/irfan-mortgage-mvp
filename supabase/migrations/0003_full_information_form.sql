-- Expand the information form to the full Fast Track intake questionnaire.
-- The questionnaire has repeating groups (two applicants, dependents, address
-- history, previous employment, several benefit types) that don't fit the flat
-- column model, so the full structured payload is stored in a single jsonb
-- column. The existing flat columns are kept and continue to be populated from
-- Applicant 1 so the admin summary and any other readers keep working.
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query).

alter table public.information_form_responses
  add column if not exists details jsonb;

comment on column public.information_form_responses.details is
  'Full Fast Track intake questionnaire payload. Flat columns mirror Applicant 1 core fields for back-compat.';
