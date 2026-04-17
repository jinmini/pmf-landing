-- Run in Supabase SQL Editor
create extension if not exists pgcrypto;

create table if not exists public.estimate_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  submitted_at_client timestamptz not null,
  source text not null default 'flow-c',
  email text not null,
  industry_id text not null,
  scale_id text not null,
  current_state_id text not null,
  service_ids text[] not null,
  goal_ids text[] not null,
  estimate_min integer not null check (estimate_min >= 0),
  estimate_max integer not null check (estimate_max >= estimate_min),
  recommendation text not null,
  service_breakdown jsonb not null default '[]'::jsonb,
  detail_checklist_state jsonb not null default '{}'::jsonb,
  detail_service_progress jsonb not null default '[]'::jsonb,
  request_ip text,
  user_agent text
);

create index if not exists idx_estimate_requests_created_at on public.estimate_requests (created_at desc);
create index if not exists idx_estimate_requests_email on public.estimate_requests (email);
