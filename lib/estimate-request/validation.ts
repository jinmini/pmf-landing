import type { EstimateRequestPayload } from "@/types/estimateRequest";

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

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function hasOnlyAllowedValues(values: string[], allowed: readonly string[]) {
  return values.every((item) => allowed.includes(item));
}

export function validateEstimateRequestPayload(payload: unknown):
  | { ok: true; value: EstimateRequestPayload }
  | { ok: false; error: string } {
  if (!isRecord(payload)) {
    return { ok: false, error: "요청 형식이 올바르지 않습니다." };
  }

  if (!isRecord(payload.selections) || !isRecord(payload.estimate) || !isRecord(payload.detailDiagnosis)) {
    return { ok: false, error: "필수 입력값이 누락되었습니다." };
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  if (!isEmail(email)) {
    return { ok: false, error: "유효한 이메일을 입력해 주세요." };
  }

  const source = payload.source;
  if (source !== "flow-c") {
    return { ok: false, error: "허용되지 않은 요청 소스입니다." };
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

  const submittedAt = payload.submittedAt;
  if (typeof submittedAt !== "string" || Number.isNaN(Date.parse(submittedAt))) {
    return { ok: false, error: "제출 시간이 올바르지 않습니다." };
  }

  return {
    ok: true,
    value: {
      email,
      source,
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
      submittedAt
    }
  };
}
