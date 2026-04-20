-- Run in Supabase SQL Editor
-- Purpose: expand only checked checklist items (true) from estimate_requests

create or replace view public.estimate_request_checked_items as
select
  r.id as request_id,
  r.created_at,
  split_part(kv.key, ':', 1) as service_id,
  split_part(kv.key, ':', 2) as item_id
from public.estimate_requests r
cross join lateral jsonb_each(r.detail_checklist_state) as kv(key, value)
where kv.value = 'true'::jsonb;
