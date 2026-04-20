import { NextResponse } from "next/server";
import type { EstimateDraftApiResponse } from "@/types/estimateRequest";
import { validateEstimateDraftPayload } from "@/lib/estimate-request/draftValidation";
import { upsertEstimateDraft } from "@/lib/server/estimateDraftStore";

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
    return NextResponse.json<EstimateDraftApiResponse>(
      { ok: false, error: "요청 본문(JSON)을 읽을 수 없습니다." },
      { status: 400 }
    );
  }

  const parsed = validateEstimateDraftPayload(jsonBody);
  if (!parsed.ok) {
    return NextResponse.json<EstimateDraftApiResponse>({ ok: false, error: parsed.error }, { status: 400 });
  }

  try {
    const { draftId } = await upsertEstimateDraft(parsed.value, {
      ipAddress: getClientIp(request),
      userAgent: request.headers.get("user-agent")
    });

    return NextResponse.json<EstimateDraftApiResponse>({ ok: true, draftId }, { status: 200 });
  } catch (error) {
    console.error("[estimate-draft] upsert failed", error);
    return NextResponse.json<EstimateDraftApiResponse>(
      { ok: false, error: "중간 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
