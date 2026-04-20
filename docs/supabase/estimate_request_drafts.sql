-- Run in Supabase SQL Editor
create extension if not exists pgcrypto;

create table if not exists public.estimate_request_drafts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days'),
  captured_at_client timestamptz not null,
  source text not null default 'flow-c',
  status text not null default 'draft' check (status in ('draft', 'submitted', 'expired')),
  latest_step text not null default 'result' check (latest_step in ('result', 'detail')),
  client_session_id text not null,
  email text,
  selections jsonb not null default '{}'::jsonb,
  estimate jsonb not null default '{}'::jsonb,
  detail_diagnosis jsonb not null default '{}'::jsonb,
  submitted_request_id uuid references public.estimate_requests(id),
  submitted_at timestamptz,
  request_ip text,
  user_agent text
);

create index if not exists idx_estimate_request_drafts_status on public.estimate_request_drafts (status);
create index if not exists idx_estimate_request_drafts_expires_at on public.estimate_request_drafts (expires_at);
create index if not exists idx_estimate_request_drafts_client_session_id on public.estimate_request_drafts (client_session_id);
