# Flow C Backend Setup

## 1) Environment variables

Copy `.env.example` to `.env.local` and fill the values:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `ESTIMATE_REQUEST_NOTIFICATION_TO` (comma-separated emails)

## 2) Supabase table

Run this SQL in Supabase SQL Editor:

- `docs/supabase/estimate_requests.sql`

## 3) Request API

The form in `FlowCExperience` posts to:

- `POST /api/estimate-request`

The API validates payload, stores it in Supabase, and then attempts to send an internal notification email through Resend.
