import { NextResponse } from "next/server";
import { validateEstimateRequestPayload } from "@/lib/estimate-request/validation";
import { insertEstimateRequest } from "@/lib/server/estimateRequestStore";
import { sendEstimateRequestNotification } from "@/lib/server/estimateRequestEmail";
import { markEstimateDraftSubmitted } from "@/lib/server/estimateDraftStore";
import type { EstimateRequestApiResponse } from "@/types/estimateRequest";

export const runtime = "nodejs";

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (!forwarded) {
    return null;
  }

  return forwarded.split(",")[0]?.trim() ?? null;
}

export async function POST(request: Request) {
  let jsonBody: unknown;

  try {
    jsonBody = await request.json();
  } catch {
    return NextResponse.json<EstimateRequestApiResponse>(
      { ok: false, error: "요청 본문(JSON)을 읽을 수 없습니다." },
      { status: 400 }
    );
  }

  const parsed = validateEstimateRequestPayload(jsonBody);
  if (!parsed.ok) {
    return NextResponse.json<EstimateRequestApiResponse>({ ok: false, error: parsed.error }, { status: 400 });
  }

  try {
    const { requestId } = await insertEstimateRequest(parsed.value, {
      ipAddress: getClientIp(request),
      userAgent: request.headers.get("user-agent")
    });

    if (parsed.value.draftId) {
      try {
        await markEstimateDraftSubmitted(parsed.value.draftId, requestId);
      } catch (error) {
        console.error("[estimate-request] draft submit mark failed", error);
      }
    }

    let mailStatus: "sent" | "skipped" | "failed" = "skipped";
    try {
      const mailResult = await sendEstimateRequestNotification(parsed.value);
      mailStatus = mailResult.status;
    } catch (error) {
      console.error("[estimate-request] email send failed", error);
      mailStatus = "failed";
    }

    return NextResponse.json<EstimateRequestApiResponse>(
      {
        ok: true,
        requestId,
        mailStatus
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[estimate-request] insert failed", error);

    return NextResponse.json<EstimateRequestApiResponse>(
      { ok: false, error: "요청 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
