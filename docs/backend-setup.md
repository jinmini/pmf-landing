# Flow C Backend Setup

## 1) Environment variables

Copy `.env.example` to `.env.local` and fill the values:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `ESTIMATE_REQUEST_NOTIFICATION_TO` (comma-separated emails)
- `NEXT_PUBLIC_SITE_URL` (`https://carbonhero.kr`)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional, GA4 tracking)

## 2) Supabase tables

Run this SQL in Supabase SQL Editor:

- `docs/supabase/estimate_requests.sql`
- `docs/supabase/estimate_request_drafts.sql`

## 3) Request API

The form in `FlowCExperience` calls:

- `POST /api/estimate-draft` (save/update draft on result/detail step)
- `POST /api/estimate-request`

- `estimate-draft`: validates payload and upserts draft to Supabase
- `estimate-request`: validates payload, stores final request, marks draft as submitted when `draftId` is present, then attempts to send an internal notification email through Resend
