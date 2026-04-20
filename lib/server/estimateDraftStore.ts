import type { EstimateDraftPayload } from "@/types/estimateRequest";

type RequestMeta = {
  ipAddress: string | null;
  userAgent: string | null;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function buildHeaders(serviceRoleKey: string) {
  return {
    "Content-Type": "application/json",
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    Prefer: "return=representation"
  };
}

type UpsertDraftResult = {
  draftId: string;
};

export async function upsertEstimateDraft(payload: EstimateDraftPayload, meta: RequestMeta): Promise<UpsertDraftResult> {
  const supabaseUrl = getRequiredEnv("SUPABASE_URL");
  const supabaseServiceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

  const draftBody = {
    source: payload.source,
    status: "draft",
    client_session_id: payload.clientSessionId,
    latest_step: payload.latestStep,
    selections: payload.selections,
    estimate: payload.estimate,
    detail_diagnosis: payload.detailDiagnosis,
    captured_at_client: payload.capturedAt,
    request_ip: meta.ipAddress,
    user_agent: meta.userAgent,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  };

  if (payload.draftId) {
    const patchResponse = await fetch(
      `${supabaseUrl}/rest/v1/estimate_request_drafts?id=eq.${encodeURIComponent(payload.draftId)}&select=id`,
      {
        method: "PATCH",
        headers: buildHeaders(supabaseServiceRoleKey),
        body: JSON.stringify(draftBody)
      }
    );

    if (patchResponse.ok) {
      const updated = (await patchResponse.json()) as Array<{ id?: string }>;
      if (updated[0]?.id) {
        return { draftId: updated[0].id };
      }
    }
  }

  const insertResponse = await fetch(`${supabaseUrl}/rest/v1/estimate_request_drafts?select=id`, {
    method: "POST",
    headers: buildHeaders(supabaseServiceRoleKey),
    body: JSON.stringify({
      ...draftBody,
      created_at: new Date().toISOString()
    })
  });

  if (!insertResponse.ok) {
    const body = await insertResponse.text();
    throw new Error(`Failed to upsert estimate draft: ${body}`);
  }

  const inserted = (await insertResponse.json()) as Array<{ id?: string }>;
  const draftId = inserted[0]?.id;
  if (!draftId) {
    throw new Error("Upserted estimate draft but missing id.");
  }

  return { draftId };
}

export async function markEstimateDraftSubmitted(draftId: string, submittedRequestId: string) {
  const supabaseUrl = getRequiredEnv("SUPABASE_URL");
  const supabaseServiceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

  const response = await fetch(
    `${supabaseUrl}/rest/v1/estimate_request_drafts?id=eq.${encodeURIComponent(draftId)}&select=id`,
    {
      method: "PATCH",
      headers: buildHeaders(supabaseServiceRoleKey),
      body: JSON.stringify({
        status: "submitted",
        submitted_request_id: submittedRequestId,
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to mark estimate draft submitted: ${body}`);
  }
}
