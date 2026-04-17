import type { EstimateRequestPayload } from "@/types/estimateRequest";

type RequestMeta = {
  ipAddress: string | null;
  userAgent: string | null;
};

type InsertResult = {
  requestId: string;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export async function insertEstimateRequest(payload: EstimateRequestPayload, meta: RequestMeta): Promise<InsertResult> {
  const supabaseUrl = getRequiredEnv("SUPABASE_URL");
  const supabaseServiceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

  const response = await fetch(`${supabaseUrl}/rest/v1/estimate_requests?select=id`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      Prefer: "return=representation"
    },
    body: JSON.stringify({
      email: payload.email,
      source: payload.source,
      industry_id: payload.selections.industryId,
      scale_id: payload.selections.scaleId,
      current_state_id: payload.selections.currentStateId,
      service_ids: payload.selections.serviceIds,
      goal_ids: payload.selections.goalIds,
      estimate_min: payload.estimate.min,
      estimate_max: payload.estimate.max,
      recommendation: payload.estimate.recommendation,
      service_breakdown: payload.estimate.serviceBreakdown,
      detail_checklist_state: payload.detailDiagnosis.checklistState,
      detail_service_progress: payload.detailDiagnosis.serviceProgress,
      submitted_at_client: payload.submittedAt,
      request_ip: meta.ipAddress,
      user_agent: meta.userAgent
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to insert estimate request: ${body}`);
  }

  const result = (await response.json()) as Array<{ id?: string }>;
  const requestId = result[0]?.id;

  if (!requestId) {
    throw new Error("Inserted estimate request but missing id.");
  }

  return { requestId };
}
