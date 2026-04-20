import type { EstimateDraftPayload } from "@/types/estimateRequest";

const INDUSTRY_IDS = [
  "mobility",
  "chemical",
  "electronics",
  "metal",
  "consumer",
  "food",
  "energy",
  "other"
] as const;

const SCALE_IDS = ["listed-large", "listed-mid", "affiliate", "mid-market", "sme"] as const;
const CURRENT_STATE_IDS = ["manual", "partial", "ready"] as const;
const SERVICE_IDS = ["lca-pcf", "ets", "cbam", "scope123", "target-management", "sbti", "cdp", "lca-platform"] as const;
const GOAL_IDS = ["customer", "risk", "proactive", "trust"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function hasOnlyAllowedValues(values: string[], allowed: readonly string[]) {
  return values.every((item) => allowed.includes(item));
}

export function validateEstimateDraftPayload(payload: unknown):
  | { ok: true; value: EstimateDraftPayload }
  | { ok: false; error: string } {
  if (!isRecord(payload)) {
    return { ok: false, error: "요청 형식이 올바르지 않습니다." };
  }

  if (!isRecord(payload.selections) || !isRecord(payload.estimate) || !isRecord(payload.detailDiagnosis)) {
    return { ok: false, error: "필수 입력값이 누락되었습니다." };
  }

  const source = payload.source;
  if (source !== "flow-c") {
    return { ok: false, error: "허용되지 않은 요청 소스입니다." };
  }

  const latestStep = payload.latestStep;
  if (latestStep !== "result" && latestStep !== "detail") {
    return { ok: false, error: "최신 단계 값이 올바르지 않습니다." };
  }

  const clientSessionId = typeof payload.clientSessionId === "string" ? payload.clientSessionId.trim() : "";
  if (!clientSessionId || clientSessionId.length > 120) {
    return { ok: false, error: "클라이언트 세션 값이 올바르지 않습니다." };
  }

  const draftId = typeof payload.draftId === "string" ? payload.draftId.trim() : undefined;
  if (draftId && !isUuid(draftId)) {
    return { ok: false, error: "드래프트 식별값이 올바르지 않습니다." };
  }

  const industryId = payload.selections.industryId;
  const scaleId = payload.selections.scaleId;
  const currentStateId = payload.selections.currentStateId;
  const serviceIds = payload.selections.serviceIds;
  const goalIds = payload.selections.goalIds;

  if (typeof industryId !== "string" || !INDUSTRY_IDS.includes(industryId as (typeof INDUSTRY_IDS)[number])) {
    return { ok: false, error: "업종 선택값이 올바르지 않습니다." };
  }
  if (typeof scaleId !== "string" || !SCALE_IDS.includes(scaleId as (typeof SCALE_IDS)[number])) {
    return { ok: false, error: "회사 규모 선택값이 올바르지 않습니다." };
  }
  if (
    typeof currentStateId !== "string" ||
    !CURRENT_STATE_IDS.includes(currentStateId as (typeof CURRENT_STATE_IDS)[number])
  ) {
    return { ok: false, error: "현재 대응 수준 선택값이 올바르지 않습니다." };
  }
  if (!isStringArray(serviceIds) || serviceIds.length === 0 || !hasOnlyAllowedValues(serviceIds, SERVICE_IDS)) {
    return { ok: false, error: "서비스 선택값이 올바르지 않습니다." };
  }
  if (!isStringArray(goalIds) || goalIds.length === 0 || !hasOnlyAllowedValues(goalIds, GOAL_IDS)) {
    return { ok: false, error: "목표 선택값이 올바르지 않습니다." };
  }

  const min = payload.estimate.min;
  const max = payload.estimate.max;
  const recommendation = payload.estimate.recommendation;
  const serviceBreakdown = payload.estimate.serviceBreakdown;

  if (
    typeof min !== "number" ||
    typeof max !== "number" ||
    !Number.isFinite(min) ||
    !Number.isFinite(max) ||
    min < 0 ||
    max < 0 ||
    min > max
  ) {
    return { ok: false, error: "예상 금액 범위가 올바르지 않습니다." };
  }

  if (typeof recommendation !== "string" || recommendation.trim().length === 0 || recommendation.length > 120) {
    return { ok: false, error: "추천 메시지 값이 올바르지 않습니다." };
  }

  if (!Array.isArray(serviceBreakdown) || serviceBreakdown.length === 0) {
    return { ok: false, error: "서비스 금액 상세값이 누락되었습니다." };
  }

  for (const item of serviceBreakdown) {
    if (!isRecord(item) || !isRecord(item.range)) {
      return { ok: false, error: "서비스 금액 상세값 형식이 올바르지 않습니다." };
    }
    if (typeof item.id !== "string" || !SERVICE_IDS.includes(item.id as (typeof SERVICE_IDS)[number])) {
      return { ok: false, error: "서비스 금액 상세값이 올바르지 않습니다." };
    }
    if (typeof item.label !== "string" || item.label.trim().length === 0) {
      return { ok: false, error: "서비스 라벨 값이 올바르지 않습니다." };
    }
    if (
      typeof item.range.min !== "number" ||
      typeof item.range.max !== "number" ||
      item.range.min < 0 ||
      item.range.max < 0 ||
      item.range.min > item.range.max
    ) {
      return { ok: false, error: "서비스 금액 범위 값이 올바르지 않습니다." };
    }
  }

  const checklistState = payload.detailDiagnosis.checklistState;
  const serviceProgress = payload.detailDiagnosis.serviceProgress;
  if (!isRecord(checklistState)) {
    return { ok: false, error: "체크리스트 값 형식이 올바르지 않습니다." };
  }
  if (!Array.isArray(serviceProgress)) {
    return { ok: false, error: "서비스 진행률 값 형식이 올바르지 않습니다." };
  }

  for (const entry of Object.values(checklistState)) {
    if (typeof entry !== "boolean") {
      return { ok: false, error: "체크리스트 값이 올바르지 않습니다." };
    }
  }

  for (const item of serviceProgress) {
    if (!isRecord(item)) {
      return { ok: false, error: "진행률 항목 형식이 올바르지 않습니다." };
    }
    if (typeof item.id !== "string" || !SERVICE_IDS.includes(item.id as (typeof SERVICE_IDS)[number])) {
      return { ok: false, error: "진행률 서비스 값이 올바르지 않습니다." };
    }
    if (typeof item.title !== "string" || item.title.trim().length === 0) {
      return { ok: false, error: "진행률 서비스 제목 값이 올바르지 않습니다." };
    }
    if (
      typeof item.checkedCount !== "number" ||
      typeof item.totalCount !== "number" ||
      item.checkedCount < 0 ||
      item.totalCount < 1 ||
      item.checkedCount > item.totalCount
    ) {
      return { ok: false, error: "진행률 수치 값이 올바르지 않습니다." };
    }
  }

  const capturedAt = payload.capturedAt;
  if (typeof capturedAt !== "string" || Number.isNaN(Date.parse(capturedAt))) {
    return { ok: false, error: "캡처 시간이 올바르지 않습니다." };
  }

  return {
    ok: true,
    value: {
      draftId,
      clientSessionId,
      source,
      latestStep,
      selections: {
        industryId,
        scaleId,
        currentStateId,
        serviceIds: Array.from(new Set(serviceIds)),
        goalIds: Array.from(new Set(goalIds))
      },
      estimate: {
        min: Math.round(min),
        max: Math.round(max),
        recommendation: recommendation.trim(),
        serviceBreakdown: serviceBreakdown.map((item) => ({
          id: item.id as string,
          label: item.label as string,
          range: {
            min: Math.round(item.range.min as number),
            max: Math.round(item.range.max as number)
          }
        }))
      },
      detailDiagnosis: {
        checklistState: Object.fromEntries(
          Object.entries(checklistState).map(([key, value]) => [key, Boolean(value)])
        ),
        serviceProgress: serviceProgress.map((item) => ({
          id: item.id as string,
          title: item.title as string,
          checkedCount: Math.round(item.checkedCount as number),
          totalCount: Math.round(item.totalCount as number)
        }))
      },
      capturedAt
    }
  };
}
