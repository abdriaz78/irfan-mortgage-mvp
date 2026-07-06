-- Lets an uploaded document be tied to the specific case_request it fulfils
-- (e.g. an ad-hoc "Age of Service" request that isn't one of the 4 standard
-- required document types).
alter table public.documents
  add column request_id uuid references public.case_requests(id) on delete set null;

create index documents_request_id_idx on public.documents(request_id);
