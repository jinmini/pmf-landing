"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { EstimateRequestApiResponse, EstimateRequestPayload } from "@/types/estimateRequest";
import {
  FLOW_C_COMPANY_SIZE_KEY_BY_ID,
  FLOW_C_INDUSTRY_KEY_BY_ID,
  FLOW_C_LYNC_ONBOARDING_TABLE,
  FLOW_C_MATURITY_KEY_BY_ID,
  FLOW_C_PRICE_RANGE_OFFSET,
  FLOW_C_PRICE_TABLE,
  FLOW_C_SHORT_MESSAGES,
  FLOW_C_SERVICE_KEY_BY_ID
} from "@/constants/flowCPricing";

type IndustryOption = {
  id: keyof typeof FLOW_C_INDUSTRY_KEY_BY_ID;
  title: string;
};

type ScaleOption = {
  id: keyof typeof FLOW_C_COMPANY_SIZE_KEY_BY_ID;
  title: string;
};

type CurrentStateOption = {
  id: keyof typeof FLOW_C_MATURITY_KEY_BY_ID;
  title: string;
  description: string;
};

type ServiceOption = {
  id: keyof typeof FLOW_C_SERVICE_KEY_BY_ID;
  title: string;
  category: string;
  description: string;
};

type GoalOption = {
  id: "customer" | "risk" | "proactive" | "trust";
  title: string;
  description: string;
};

type DetailChecklistItem = {
  id: string;
  title: string;
};

type DetailBlueprint = {
  summary: string;
  checklist: DetailChecklistItem[];
  steps: string[];
};

type StepDefinition = {
  id: "company" | "current" | "services" | "goal";
  kicker: string;
  title: string;
};

type PricingRange = {
  min: number;
  max: number;
};

type DropdownOption = {
  id: string;
  title: string;
};

const INDUSTRIES: IndustryOption[] = [
  { id: "mobility", title: "자동차 부품, 모빌리티" },
  { id: "chemical", title: "화학 석유화학 소재" },
  { id: "electronics", title: "전자 전기 반도체" },
  { id: "metal", title: "철강 금속 비철" },
  { id: "consumer", title: "소비재(화장품, 의류, 생활용품)" },
  { id: "food", title: "식품 음료" },
  { id: "energy", title: "에너지, 이차전지, 환경" },
  { id: "other", title: "기타 제조(의약품, 조선, 건설자재 등)" }
];

const COMPANY_SCALES: ScaleOption[] = [
  { id: "listed-large", title: "상장사 (자산 2조 이상)" },
  { id: "listed-mid", title: "상장사 (자산 2조 미만)" },
  { id: "affiliate", title: "비상장 대기업 계열사" },
  { id: "mid-market", title: "비상장 중견기업" },
  { id: "sme", title: "비상장 중소기업" }
];

const CURRENT_STATES: CurrentStateOption[] = [
  {
    id: "manual",
    title: "대부분 수작업",
    description: "엑셀, 메일, 개별 자료 취합 중심으로 운영 중입니다."
  },
  {
    id: "partial",
    title: "부분 시스템은 있으나 연결이 약함",
    description: "일부 체계는 있으나 데이터 연결과 운영 일관성이 부족합니다."
  },
  {
    id: "ready",
    title: "기본 체계는 있고 고도화 필요",
    description: "기본 운영 체계는 있으나 범위 확장과 정합성 보완이 필요한 상태입니다."
  }
];

const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: "lca-pcf",
    title: "LCA · PCF",
    category: "Consulting",
    description: "제품 단위 탄소데이터 산정과 기본 산정 체계 정립"
  },
  {
    id: "ets",
    title: "배출권거래제",
    category: "Regulation",
    description: "사업장 단위 규제 대응과 제출 체계 정비"
  },
  {
    id: "cbam",
    title: "CBAM",
    category: "Regulation",
    description: "수출 규제 대응을 위한 초기 진단과 제출 준비"
  },
  {
    id: "scope123",
    title: "Scope 1/2/3",
    category: "Inventory",
    description: "배출량 인벤토리 구조화와 간접배출 범위 확장"
  },
  {
    id: "target-management",
    title: "목표관리제",
    category: "Regulation",
    description: "국내 규제 제출 대응과 운영 기준 정리"
  },
  {
    id: "sbti",
    title: "SBTi",
    category: "Disclosure",
    description: "감축 목표 수립과 승인 대응 방향 설정"
  },
  {
    id: "cdp",
    title: "CDP",
    category: "Disclosure",
    description: "공시 대응과 대외 신뢰 확보를 위한 구조화"
  },
  {
    id: "lca-platform",
    title: "LCA SW(전과정평가 시스템)",
    category: "Platform",
    description: "반복 운영을 위한 플랫폼 세팅과 온보딩 범위"
  }
];

const GOAL_OPTIONS: GoalOption[] = [
  {
    id: "customer",
    title: "고객사 요구 대응",
    description: "고객 요청에 맞춰 필요한 범위와 대응 속도를 우선적으로 검토합니다."
  },
  {
    id: "risk",
    title: "규제 및 리스크 관리",
    description: "규제 대응과 제출 리스크 완화를 우선합니다."
  },
  {
    id: "proactive",
    title: "선제적 대응체계 구축",
    description: "향후 확장 가능한 운영 구조와 내부 대응 체계 마련을 우선합니다."
  },
  {
    id: "trust",
    title: "대외 신뢰 강화",
    description: "공시 품질과 외부 커뮤니케이션 신뢰도를 높이는 방향을 우선합니다."
  }
];

const STEPS: StepDefinition[] = [
  {
    id: "company",
    kicker: "Step 1",
    title: "현재 조직 프로필을 선택해 주세요"
  },
  {
    id: "current",
    kicker: "Step 2",
    title: "현재 대응 수준은 어느 정도인가요?"
  },
  {
    id: "services",
    kicker: "Step 3",
    title: "검토 중인 범위를 선택해 주세요"
  },
  {
    id: "goal",
    kicker: "Step 4",
    title: "고려중인 프로젝트의 최우선 목표는 무엇인가요?"
  }
];

const REGULATORY_SERVICE_IDS: Array<ServiceOption["id"]> = ["ets", "cbam", "target-management", "cdp"];
const HERO_HEADLINE_LINES = ["탄소 규제 대응 비용,", "1분 만에 확인해보세요"];
const FLOW_C_SESSION_STORAGE_KEY = "flow-c-session-v1";
const INDUSTRY_ID_SET = new Set(INDUSTRIES.map((item) => item.id));
const SCALE_ID_SET = new Set(COMPANY_SCALES.map((item) => item.id));
const CURRENT_STATE_ID_SET = new Set(CURRENT_STATES.map((item) => item.id));
const SERVICE_ID_SET = new Set(SERVICE_OPTIONS.map((item) => item.id));
const GOAL_ID_SET = new Set(GOAL_OPTIONS.map((item) => item.id));

type FlowCSessionSnapshot = {
  version: 1;
  started: boolean;
  stepIndex: number;
  selectedIndustry: IndustryOption["id"] | "";
  selectedScale: ScaleOption["id"] | "";
  selectedCurrent: CurrentStateOption["id"] | "";
  selectedServices: ServiceOption["id"][];
  selectedGoals: GoalOption["id"][];
  showDetailDiagnosis: boolean;
  expandedServiceId: ServiceOption["id"] | null;
  detailChecklistState: Record<string, boolean>;
  savedAt: string;
};

const DETAIL_BLUEPRINT_BY_SERVICE: Record<ServiceOption["id"], DetailBlueprint> = {
  "lca-pcf": {
    summary: "제품별 탄소데이터 산정 기준과 산정 근거 문서화 수준을 확인합니다.",
    checklist: [
      { id: "boundary", title: "제품 경계 정의가 합의되어 있습니다." },
      { id: "factor", title: "활동데이터와 배출계수 기준이 정리되어 있습니다." },
      { id: "proof", title: "산정 근거 파일과 검토 이력이 보관되고 있습니다." }
    ],
    steps: ["범위 정의", "데이터 매핑", "산정 및 검증", "보고서 패키징"]
  },
  ets: {
    summary: "사업장 단위 배출권거래제 대응 자료와 제출 준비도를 확인합니다.",
    checklist: [
      { id: "inventory", title: "사업장 배출원 인벤토리가 최신 상태입니다." },
      { id: "evidence", title: "활동자료 및 증빙 파일이 월 단위로 정리됩니다." },
      { id: "submission", title: "대응 일정과 제출 책임자가 지정되어 있습니다." }
    ],
    steps: ["배출원 재정의", "자료 수집", "산정/검토", "제출 대응"]
  },
  cbam: {
    summary: "수출 품목 기준으로 CBAM 보고에 필요한 데이터 흐름을 점검합니다.",
    checklist: [
      { id: "sku", title: "CBAM 대상 품목이 SKU 단위로 식별됩니다." },
      { id: "supplier", title: "협력사 데이터 요청 템플릿이 준비되어 있습니다." },
      { id: "qa", title: "제출 전 품질검토 체크포인트가 정의되어 있습니다." }
    ],
    steps: ["대상품목 식별", "공급망 데이터 수집", "보고 포맷 정렬", "검토/제출"]
  },
  scope123: {
    summary: "Scope 1/2/3 범위별 데이터 수집과 연결 수준을 확인합니다.",
    checklist: [
      { id: "scope-map", title: "Scope 1/2/3 카테고리 맵이 정의되어 있습니다." },
      { id: "owner", title: "카테고리별 데이터 오너가 지정되어 있습니다." },
      { id: "cycle", title: "월/분기 운영 주기로 업데이트가 되고 있습니다." }
    ],
    steps: ["카테고리 설계", "오너 지정", "수집 자동화", "정합성 검토"]
  },
  "target-management": {
    summary: "목표관리제 대응을 위한 기준연도/지표/제출 체계 준비도를 확인합니다.",
    checklist: [
      { id: "baseline", title: "기준연도와 산정 기준이 명확합니다." },
      { id: "tracking", title: "감축 실적 추적 방식이 정리되어 있습니다." },
      { id: "review", title: "내부 리뷰/승인 루틴이 운영되고 있습니다." }
    ],
    steps: ["기준 정렬", "지표 설계", "운영 룰 수립", "정기 제출 대응"]
  },
  sbti: {
    summary: "감축 목표 수립과 승인 대응을 위한 준비 수준을 점검합니다.",
    checklist: [
      { id: "scenario", title: "감축 시나리오가 복수안으로 준비되어 있습니다." },
      { id: "boundary", title: "목표 대상 조직/배출경계가 합의되었습니다." },
      { id: "governance", title: "승인 대응을 위한 의사결정 체계가 정리되어 있습니다." }
    ],
    steps: ["기준선 확정", "목표안 설계", "내부 검토", "승인 대응"]
  },
  cdp: {
    summary: "CDP 문항 대응 품질과 증빙 체계의 일관성을 확인합니다.",
    checklist: [
      { id: "question-map", title: "문항별 담당자와 데이터 소스가 연결되어 있습니다." },
      { id: "evidence", title: "핵심 문항 증빙 자료가 최신 상태입니다." },
      { id: "consistency", title: "공시 문구와 내부 데이터 간 불일치가 관리됩니다." }
    ],
    steps: ["문항 매핑", "증빙 보강", "내부 리뷰", "최종 제출"]
  },
  "lca-platform": {
    summary: "LCA SW 도입 시 초기 온보딩과 운영 정착 범위를 진단합니다.",
    checklist: [
      { id: "workflow", title: "현재 업무 흐름이 플랫폼 구조로 정의되어 있습니다." },
      { id: "migration", title: "기존 데이터 이관 우선순위가 정리되어 있습니다." },
      { id: "training", title: "실무자 온보딩/교육 계획이 준비되어 있습니다." }
    ],
    steps: ["요구사항 정의", "환경 세팅", "파일럿 운영", "정식 확산"]
  }
};

function formatAmount(amount: number) {
  const eok = Math.floor(amount / 10000);
  const remainder = amount % 10000;

  if (eok === 0) {
    return `${amount.toLocaleString("ko-KR")}만 원`;
  }

  if (remainder === 0) {
    return `${eok}억 원`;
  }

  return `${eok}억 ${remainder.toLocaleString("ko-KR")}만 원`;
}

function formatRange(range: PricingRange) {
  return `${formatAmount(range.min)} ~ ${formatAmount(range.max)}`;
}

function getChecklistDefaultChecked(maturity: CurrentStateOption["id"] | "", itemIndex: number) {
  if (maturity === "ready") {
    return itemIndex < 2;
  }

  if (maturity === "partial") {
    return itemIndex === 0;
  }

  return false;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function useCountUp(target: number, isActive: boolean, duration = 1600) {
  const [value, setValue] = useState(isActive ? 0 : target);

  useEffect(() => {
    if (!isActive) {
      setValue(target);
      return;
    }

    let frameId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(Math.round(target * eased));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    setValue(0);
    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, [duration, isActive, target]);

  return value;
}

function roundRange(range: PricingRange): PricingRange {
  return {
    min: Math.max(0, Math.round(range.min)),
    max: Math.max(0, Math.round(range.max))
  };
}

function buildFixedRange(baseAmount: number) {
  return roundRange({
    min: baseAmount - FLOW_C_PRICE_RANGE_OFFSET,
    max: baseAmount + FLOW_C_PRICE_RANGE_OFFSET
  });
}

function mergeRanges(ranges: PricingRange[]) {
  return roundRange({
    min: ranges.reduce((sum, range) => sum + range.min, 0),
    max: ranges.reduce((sum, range) => sum + range.max, 0)
  });
}

type StepDropdownProps = {
  label: string;
  placeholder: string;
  options: DropdownOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
};

function StepDropdown({
  label,
  placeholder,
  options,
  selectedValue,
  onSelect,
  isOpen,
  onToggle
}: StepDropdownProps) {
  const selectedLabel = options.find((option) => option.id === selectedValue)?.title;

  return (
    <div
      className={`rounded-[1.35rem] border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all ${isOpen
        ? "border-[#5c7cff] shadow-[0_0_0_4px_rgba(92,124,255,0.14),0_12px_30px_rgba(15,23,42,0.06)]"
        : "border-slate-200"
        }`}
    >
      <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">{label}</p>

      <div className="relative mt-3">
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={onToggle}
          className={`flex w-full items-center justify-between rounded-[1rem] border px-4 py-3 text-left text-sm font-medium transition-all ${isOpen
            ? "border-[#5c7cff] bg-white text-slate-900"
            : "border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300"
            }`}
        >
          <span className={selectedLabel ? "text-slate-900" : "text-slate-500"}>{selectedLabel ?? placeholder}</span>
          <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className={`h-5 w-5 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          >
            <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {isOpen ? (
          <div className="absolute left-0 right-0 top-[calc(100%+0.65rem)] z-20 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.12)]">
            <div className="max-h-64 overflow-y-auto px-2 py-2 sm:max-h-72">
              {options.map((option) => {
                const isSelected = option.id === selectedValue;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onSelect(option.id)}
                    className={`flex w-full items-center justify-between rounded-[1rem] px-4 py-3 text-left text-sm transition-colors ${isSelected ? "bg-[#eef2ff] font-semibold text-[#3157df]" : "text-slate-700 hover:bg-slate-50"
                      }`}
                  >
                    <span>{option.title}</span>
                    <span className={`text-base ${isSelected ? "text-[#3157df]" : "text-transparent"}`}>✓</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function FlowCExperience() {
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [displayStepIndex, setDisplayStepIndex] = useState(0);
  const [stepTransitionPhase, setStepTransitionPhase] = useState<"idle" | "exit" | "enter">("idle");
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryOption["id"] | "">("");
  const [selectedScale, setSelectedScale] = useState<ScaleOption["id"] | "">("");
  const [selectedCurrent, setSelectedCurrent] = useState<CurrentStateOption["id"] | "">("");
  const [selectedServices, setSelectedServices] = useState<ServiceOption["id"][]>([]);
  const [selectedGoals, setSelectedGoals] = useState<GoalOption["id"][]>([]);
  const [openDropdown, setOpenDropdown] = useState<"industry" | "scale" | null>(null);
  const [resultFlowPhase, setResultFlowPhase] = useState<"idle" | "analyzing" | "complete" | "result">("idle");
  const [resultAnimated, setResultAnimated] = useState(false);
  const [resultViewReady, setResultViewReady] = useState(true);
  const [showDetailDiagnosis, setShowDetailDiagnosis] = useState(false);
  const [expandedServiceId, setExpandedServiceId] = useState<ServiceOption["id"] | null>(null);
  const [detailChecklistState, setDetailChecklistState] = useState<Record<string, boolean>>({});
  const [requestEmail, setRequestEmail] = useState("");
  const [requestEmailTouched, setRequestEmailTouched] = useState(false);
  const [requestSubmitState, setRequestSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [requestSubmitError, setRequestSubmitError] = useState("");
  const companyStepRef = useRef<HTMLDivElement | null>(null);
  const stepExitTimerRef = useRef<number | null>(null);
  const stepEnterTimerRef = useRef<number | null>(null);
  const resultAnalyzeTimerRef = useRef<number | null>(null);
  const resultCompleteTimerRef = useRef<number | null>(null);
  const resultRevealFrameRef = useRef<number | null>(null);
  const sessionHydratedRef = useRef(false);

  const currentStep = STEPS[displayStepIndex];
  const isComplete = stepIndex >= STEPS.length;
  const progress = Math.round((Math.min(displayStepIndex, STEPS.length) / STEPS.length) * 100);
  const isStepTransitioning = stepTransitionPhase !== "idle";
  const stepTransitionClass =
    stepTransitionPhase === "exit"
      ? "translate-y-4 opacity-0"
      : stepTransitionPhase === "enter"
        ? "-translate-y-4 opacity-0"
        : "translate-y-0 opacity-100";

  useEffect(() => {
    setOpenDropdown(null);
  }, [displayStepIndex]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!companyStepRef.current?.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    return () => {
      if (stepExitTimerRef.current !== null) {
        window.clearTimeout(stepExitTimerRef.current);
      }
      if (stepEnterTimerRef.current !== null) {
        window.clearTimeout(stepEnterTimerRef.current);
      }
      if (resultAnalyzeTimerRef.current !== null) {
        window.clearTimeout(resultAnalyzeTimerRef.current);
      }
      if (resultCompleteTimerRef.current !== null) {
        window.clearTimeout(resultCompleteTimerRef.current);
      }
      if (resultRevealFrameRef.current !== null) {
        window.cancelAnimationFrame(resultRevealFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(FLOW_C_SESSION_STORAGE_KEY);
      if (!raw) {
        sessionHydratedRef.current = true;
        return;
      }

      const parsed = JSON.parse(raw) as Partial<FlowCSessionSnapshot>;
      if (parsed.version !== 1 || !parsed.started) {
        sessionHydratedRef.current = true;
        return;
      }

      const restoredServices = Array.isArray(parsed.selectedServices)
        ? Array.from(
          new Set(
            parsed.selectedServices.filter(
              (item): item is ServiceOption["id"] => typeof item === "string" && SERVICE_ID_SET.has(item as ServiceOption["id"])
            )
          )
        )
        : [];

      const restoredGoals = Array.isArray(parsed.selectedGoals)
        ? Array.from(
          new Set(
            parsed.selectedGoals.filter(
              (item): item is GoalOption["id"] => typeof item === "string" && GOAL_ID_SET.has(item as GoalOption["id"])
            )
          )
        )
        : [];

      const restoredStepIndex = Number.isInteger(parsed.stepIndex) && Number(parsed.stepIndex) >= 0
        ? Number(parsed.stepIndex)
        : 0;

      const normalizedStepIndex = Math.min(restoredStepIndex, STEPS.length);

      setStarted(true);
      setStepIndex(normalizedStepIndex);
      setDisplayStepIndex(Math.min(normalizedStepIndex, STEPS.length - 1));
      setStepTransitionPhase("idle");
      setResultFlowPhase("idle");
      setSelectedIndustry(
        typeof parsed.selectedIndustry === "string" && INDUSTRY_ID_SET.has(parsed.selectedIndustry as IndustryOption["id"])
          ? (parsed.selectedIndustry as IndustryOption["id"])
          : ""
      );
      setSelectedScale(
        typeof parsed.selectedScale === "string" && SCALE_ID_SET.has(parsed.selectedScale as ScaleOption["id"])
          ? (parsed.selectedScale as ScaleOption["id"])
          : ""
      );
      setSelectedCurrent(
        typeof parsed.selectedCurrent === "string" && CURRENT_STATE_ID_SET.has(parsed.selectedCurrent as CurrentStateOption["id"])
          ? (parsed.selectedCurrent as CurrentStateOption["id"])
          : ""
      );
      setSelectedServices(restoredServices);
      setSelectedGoals(restoredGoals);
      setShowDetailDiagnosis(Boolean(parsed.showDetailDiagnosis) && normalizedStepIndex >= STEPS.length);
      setExpandedServiceId(
        typeof parsed.expandedServiceId === "string" && restoredServices.includes(parsed.expandedServiceId as ServiceOption["id"])
          ? (parsed.expandedServiceId as ServiceOption["id"])
          : null
      );

      const restoredChecklistState =
        parsed.detailChecklistState && typeof parsed.detailChecklistState === "object"
          ? Object.fromEntries(
            Object.entries(parsed.detailChecklistState).filter(
              ([key, value]) => typeof key === "string" && typeof value === "boolean"
            )
          )
          : {};
      setDetailChecklistState(restoredChecklistState);
    } catch {
      window.sessionStorage.removeItem(FLOW_C_SESSION_STORAGE_KEY);
    } finally {
      sessionHydratedRef.current = true;
    }
  }, []);

  const isStepValid =
    currentStep?.id === "company"
      ? Boolean(selectedIndustry && selectedScale)
      : currentStep?.id === "current"
        ? Boolean(selectedCurrent)
        : currentStep?.id === "services"
          ? selectedServices.length > 0
          : selectedGoals.length > 0;

  const estimate = useMemo(() => {
    if (!selectedIndustry || !selectedScale || !selectedCurrent || selectedGoals.length === 0 || selectedServices.length === 0) {
      return null;
    }

    const companyKey = FLOW_C_COMPANY_SIZE_KEY_BY_ID[selectedScale];
    const serviceRanges = selectedServices.map((serviceId) => {
      const serviceKey = FLOW_C_SERVICE_KEY_BY_ID[serviceId];
      const basePrice = FLOW_C_PRICE_TABLE[companyKey][serviceKey];

      return {
        serviceId,
        label: SERVICE_OPTIONS.find((option) => option.id === serviceId)?.title ?? serviceId,
        basePrice,
        range: buildFixedRange(basePrice)
      };
    });

    const hasPlatform = selectedServices.includes("lca-platform");
    const solutionRange = mergeRanges(serviceRanges.map((service) => service.range));
    const onboardingRange = hasPlatform ? buildFixedRange(FLOW_C_LYNC_ONBOARDING_TABLE[companyKey]) : null;
    const total = onboardingRange ? mergeRanges([solutionRange, onboardingRange]) : solutionRange;

    const shortMessages: string[] = [FLOW_C_SHORT_MESSAGES.base, FLOW_C_SHORT_MESSAGES.variance];
    if (hasPlatform) {
      shortMessages.push(FLOW_C_SHORT_MESSAGES.onboarding);
    }

    const hasRiskGoal = selectedGoals.includes("risk");
    const hasTrustGoal = selectedGoals.includes("trust");
    const hasCustomerGoal = selectedGoals.includes("customer");
    const hasProactiveGoal = selectedGoals.includes("proactive");

    const recommendation =
      hasRiskGoal && selectedServices.some((serviceId) => REGULATORY_SERVICE_IDS.includes(serviceId))
        ? "규제 대응형 우선 제안"
        : hasTrustGoal && selectedServices.some((serviceId) => ["cdp", "sbti"].includes(serviceId))
          ? "대외 신뢰 강화형 제안"
          : hasCustomerGoal
            ? "고객사 대응형 제안"
            : hasProactiveGoal
              ? "선제 대응 체계형 제안"
              : hasPlatform && selectedServices.length >= 3
                ? "컨설팅 + 플랫폼 결합형 제안"
                : hasPlatform
                  ? "플랫폼 포함형 제안"
                  : "컨설팅 우선형 제안";

    return {
      total,
      breakdown: {
        solution: solutionRange,
        onboarding: onboardingRange
      },
      recommendation,
      selectedGoalLabels: GOAL_OPTIONS.filter((goal) => selectedGoals.includes(goal.id)).map((goal) => goal.title),
      shortMessages,
      serviceLabels: serviceRanges.map((service) => service.label),
      serviceBreakdown: serviceRanges.map((service) => ({
        id: service.serviceId,
        label: service.label,
        range: service.range
      }))
    };
  }, [selectedCurrent, selectedGoals, selectedIndustry, selectedScale, selectedServices]);

  useEffect(() => {
    if (resultFlowPhase === "result") {
      setResultViewReady(false);
      resultRevealFrameRef.current = window.requestAnimationFrame(() => {
        setResultViewReady(true);
      });
      return;
    }

    if (resultFlowPhase === "idle") {
      setResultViewReady(true);
    }
  }, [resultFlowPhase]);

  useEffect(() => {
    const shouldAnimate = isComplete && Boolean(estimate) && (resultFlowPhase === "result" || resultFlowPhase === "idle");
    setResultAnimated(shouldAnimate);

    if (!shouldAnimate) {
      return;
    }

    const timeoutId = window.setTimeout(() => setResultAnimated(false), 340);
    return () => window.clearTimeout(timeoutId);
  }, [estimate, isComplete, resultFlowPhase]);

  const animatedMin = useCountUp(estimate?.total.min ?? 0, resultAnimated);
  const animatedMax = useCountUp(estimate?.total.max ?? 0, resultAnimated, 1750);

  const detailServices = useMemo(
    () =>
      selectedServices
        .map((serviceId) => {
          const service = SERVICE_OPTIONS.find((option) => option.id === serviceId);
          if (!service) {
            return null;
          }

          return {
            id: serviceId,
            title: service.title,
            category: service.category,
            summary: DETAIL_BLUEPRINT_BY_SERVICE[serviceId].summary,
            checklist: DETAIL_BLUEPRINT_BY_SERVICE[serviceId].checklist,
            steps: DETAIL_BLUEPRINT_BY_SERVICE[serviceId].steps
          };
        })
        .filter((service): service is NonNullable<typeof service> => Boolean(service)),
    [selectedServices]
  );
  const isRequestEmailValid = isValidEmail(requestEmail.trim());

  useEffect(() => {
    if (detailServices.length === 0) {
      setDetailChecklistState({});
      return;
    }

    setDetailChecklistState((prev) => {
      const next: Record<string, boolean> = {};

      detailServices.forEach((service) => {
        service.checklist.forEach((item, index) => {
          const key = `${service.id}:${item.id}`;
          next[key] = key in prev ? prev[key] : getChecklistDefaultChecked(selectedCurrent, index);
        });
      });

      return next;
    });
  }, [detailServices, selectedCurrent]);

  const transitionToStep = (nextIndex: number) => {
    if (isStepTransitioning) {
      return;
    }

    if (stepExitTimerRef.current !== null) {
      window.clearTimeout(stepExitTimerRef.current);
    }
    if (stepEnterTimerRef.current !== null) {
      window.clearTimeout(stepEnterTimerRef.current);
    }

    setStepTransitionPhase("exit");
    stepExitTimerRef.current = window.setTimeout(() => {
      if (nextIndex >= STEPS.length) {
        setStepIndex(nextIndex);
        setStepTransitionPhase("idle");
        return;
      }

      setStepIndex(nextIndex);
      setDisplayStepIndex(nextIndex);
      setStepTransitionPhase("enter");

      stepEnterTimerRef.current = window.setTimeout(() => {
        setStepTransitionPhase("idle");
      }, 190);
    }, 180);
  };

  const startResultFlow = () => {
    if (isStepTransitioning || resultFlowPhase !== "idle") {
      return;
    }

    if (stepExitTimerRef.current !== null) {
      window.clearTimeout(stepExitTimerRef.current);
    }
    if (resultAnalyzeTimerRef.current !== null) {
      window.clearTimeout(resultAnalyzeTimerRef.current);
    }
    if (resultCompleteTimerRef.current !== null) {
      window.clearTimeout(resultCompleteTimerRef.current);
    }

    setStepTransitionPhase("exit");
    stepExitTimerRef.current = window.setTimeout(() => {
      setStepIndex(STEPS.length);
      setStepTransitionPhase("idle");
      setResultFlowPhase("analyzing");

      resultAnalyzeTimerRef.current = window.setTimeout(() => {
        setResultFlowPhase("complete");
        resultCompleteTimerRef.current = window.setTimeout(() => {
          setResultFlowPhase("result");
        }, 650);
      }, 3000);
    }, 180);
  };

  const handleNext = () => {
    if (!isStepValid || isStepTransitioning) {
      return;
    }

    if (displayStepIndex === STEPS.length - 1) {
      startResultFlow();
      return;
    }

    transitionToStep(displayStepIndex + 1);
  };

  const handlePrev = () => {
    if (displayStepIndex === 0 || isStepTransitioning) {
      return;
    }

    transitionToStep(Math.max(0, displayStepIndex - 1));
  };

  const handleRestart = () => {
    if (stepExitTimerRef.current !== null) {
      window.clearTimeout(stepExitTimerRef.current);
    }
    if (stepEnterTimerRef.current !== null) {
      window.clearTimeout(stepEnterTimerRef.current);
    }
    if (resultAnalyzeTimerRef.current !== null) {
      window.clearTimeout(resultAnalyzeTimerRef.current);
    }
    if (resultCompleteTimerRef.current !== null) {
      window.clearTimeout(resultCompleteTimerRef.current);
    }
    setStarted(false);
    setStepIndex(0);
    setDisplayStepIndex(0);
    setStepTransitionPhase("idle");
    setResultFlowPhase("idle");
    setSelectedIndustry("");
    setSelectedScale("");
    setSelectedCurrent("");
    setSelectedServices([]);
    setSelectedGoals([]);
    setShowDetailDiagnosis(false);
    setExpandedServiceId(null);
    setDetailChecklistState({});
    setRequestEmail("");
    setRequestEmailTouched(false);
    setRequestSubmitState("idle");
    setRequestSubmitError("");
    window.sessionStorage.removeItem(FLOW_C_SESSION_STORAGE_KEY);
  };

  useEffect(() => {
    if (!sessionHydratedRef.current) {
      return;
    }

    if (!started) {
      window.sessionStorage.removeItem(FLOW_C_SESSION_STORAGE_KEY);
      return;
    }

    const snapshot: FlowCSessionSnapshot = {
      version: 1,
      started,
      stepIndex,
      selectedIndustry,
      selectedScale,
      selectedCurrent,
      selectedServices,
      selectedGoals,
      showDetailDiagnosis,
      expandedServiceId,
      detailChecklistState,
      savedAt: new Date().toISOString()
    };

    window.sessionStorage.setItem(FLOW_C_SESSION_STORAGE_KEY, JSON.stringify(snapshot));
  }, [
    started,
    stepIndex,
    selectedIndustry,
    selectedScale,
    selectedCurrent,
    selectedServices,
    selectedGoals,
    showDetailDiagnosis,
    expandedServiceId,
    detailChecklistState
  ]);

  const toggleService = (serviceId: ServiceOption["id"]) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((item) => item !== serviceId) : [...prev, serviceId]
    );
  };

  const toggleGoal = (goalId: GoalOption["id"]) => {
    setSelectedGoals((prev) => (prev.includes(goalId) ? prev.filter((item) => item !== goalId) : [...prev, goalId]));
  };

  const toggleChecklistItem = (serviceId: ServiceOption["id"], itemId: string) => {
    const key = `${serviceId}:${itemId}`;
    setDetailChecklistState((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmitRequestEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRequestEmailTouched(true);

    if (!isRequestEmailValid || requestSubmitState === "submitting") {
      return;
    }

    if (!estimate || !selectedIndustry || !selectedScale || !selectedCurrent) {
      setRequestSubmitState("error");
      setRequestSubmitError("선택값이 완성되지 않아 요청을 보낼 수 없습니다. 다시 시도해 주세요.");
      return;
    }

    const normalizedEmail = requestEmail.trim().toLowerCase();
    const serviceProgress = detailServices.map((service) => {
      const checkedCount = service.checklist.filter((item) => detailChecklistState[`${service.id}:${item.id}`]).length;

      return {
        id: service.id,
        title: service.title,
        checkedCount,
        totalCount: service.checklist.length
      };
    });

    const payload: EstimateRequestPayload = {
      email: normalizedEmail,
      source: "flow-c",
      selections: {
        industryId: selectedIndustry,
        scaleId: selectedScale,
        currentStateId: selectedCurrent,
        serviceIds: selectedServices,
        goalIds: selectedGoals
      },
      estimate: {
        min: estimate.total.min,
        max: estimate.total.max,
        recommendation: estimate.recommendation,
        serviceBreakdown: estimate.serviceBreakdown
      },
      detailDiagnosis: {
        checklistState: detailChecklistState,
        serviceProgress
      },
      submittedAt: new Date().toISOString()
    };

    setRequestSubmitState("submitting");
    setRequestSubmitError("");

    try {
      const response = await fetch("/api/estimate-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = (await response.json()) as EstimateRequestApiResponse;
      if (!response.ok || !result.ok) {
        throw new Error(result.ok ? "요청 처리 중 오류가 발생했습니다." : result.error);
      }

      setRequestEmail(normalizedEmail);
      setRequestSubmitState("success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "요청 전송 중 오류가 발생했습니다.";
      setRequestSubmitState("error");
      setRequestSubmitError(message);
    }
  };

  if (!started) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,#eef4ff_0%,#f8fbff_38%,#ffffff_78%)] px-5 py-8 sm:px-6">
        <div className="mx-auto flex max-w-md flex-col gap-7">
          <div>
            <div className="rounded-[2rem] border border-white/60 bg-white/70 px-6 py-7 shadow-[0_18px_45px_rgba(15,23,42,0.07)] backdrop-blur">
              <p className="text-sm font-semibold text-[#2d6df6]">제조업 탄소 규제 비용 진단</p>
              <h1
                aria-label={HERO_HEADLINE_LINES.join(" ")}
                className="mt-4 text-[2.06rem] font-[800] leading-[1.24] tracking-[-0.02em] text-slate-950 sm:text-[2.2rem]"
              >
                {HERO_HEADLINE_LINES.map((line, lineIndex) => (
                  <span key={line} aria-hidden="true" className="block">
                    {line.split("").map((char, charIndex) => {
                      const delay = (lineIndex * 10 + charIndex) * 36;

                      return (
                        <span
                          key={`${lineIndex}-${charIndex}-${char}`}
                          className="flow-c-hero-char inline-block"
                          style={{ animationDelay: `${delay}ms` }}
                        >
                          {char === " " ? "\u00A0" : char}
                        </span>
                      );
                    })}
                  </span>
                ))}
              </h1>
            </div>

            <div className="mt-8 rounded-[2rem] bg-[radial-gradient(circle_at_top,#eff6ff_0%,#dbeafe_38%,#ffffff_76%)] px-6 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-[#e8f0ff] px-3 py-1 text-xs font-semibold text-[#3268e6]">결과까지 약 1분</span>
                <span className="text-xs font-semibold tracking-[0.1em] text-slate-400">4 STEP</span>
              </div>
              <div className="grid gap-3 text-left">
                <div className="rounded-[1.3rem] bg-white/80 px-4 py-4 shadow-sm">
                  <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">STEP 1</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">업종 및 회사 규모 선택</p>
                </div>
                <div className="rounded-[1.3rem] bg-white/80 px-4 py-4 shadow-sm">
                  <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">STEP 2</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">현재 대응 수준 진단</p>
                </div>
                <div className="rounded-[1.3rem] bg-white/80 px-4 py-4 shadow-sm">
                  <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">STEP 3</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">컨설팅 및 플랫폼 범위 선택</p>
                </div>
                <div className="rounded-[1.3rem] bg-white/80 px-4 py-4 shadow-sm">
                  <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">STEP 4</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">의사결정 목표 확인</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full pb-4">
            <button
              type="button"
              onClick={() => setStarted(true)}
              className="w-full rounded-[1.25rem] bg-[linear-gradient(135deg,#2f6de9_0%,#1f5edc_45%,#1a4fbe_100%)] px-5 py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(47,109,233,0.34)] transition-transform hover:-translate-y-0.5"
            >
              진단 시작하기
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (isComplete && estimate && showDetailDiagnosis) {
    return (
      <main className="min-h-screen bg-[#f5f8ff] px-4 py-5 sm:px-6">
        <div className="mx-auto max-w-md space-y-4">
          <div className="mb-1 flex items-center">
            <button
              type="button"
              onClick={() => setShowDetailDiagnosis(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#132750] text-base text-white shadow-[0_10px_24px_rgba(19,39,80,0.24)]"
              aria-label="예상 도입금액 화면으로 돌아가기"
            >
              ←
            </button>
          </div>

          <div className="rounded-[2rem] border border-[#d9e6ff] bg-white px-6 pb-6 pt-7 shadow-[0_20px_55px_rgba(31,94,220,0.12)]">
            <div className="inline-flex items-center rounded-full bg-[#e8f0ff] px-3 py-1 text-xs font-semibold text-[#2f63dd]">
              상세진단
            </div>
            <h2 className="mt-4 text-[1.6rem] font-[800] leading-tight tracking-[-0.02em] text-slate-950">
              선택하신 항목의 진행 범위를
              <br />
              한눈에 점검해보세요
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              체크박스를 눌러 현재 준비 상태를 확인하고, 각 항목의 세부 업무 단계를 펼쳐서 범위를 빠르게 볼 수 있습니다.
            </p>
          </div>

          <div className="space-y-3">
            {detailServices.map((service) => {
              const checkedCount = service.checklist.filter((item) => detailChecklistState[`${service.id}:${item.id}`]).length;
              const progress = Math.round((checkedCount / service.checklist.length) * 100);
              const isExpanded = expandedServiceId === service.id;

              return (
                <section
                  key={service.id}
                  className="rounded-[1.6rem] border border-slate-200 bg-white px-5 py-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.16em] text-[#4e7aea]">{service.category}</p>
                      <h3 className="mt-1 text-base font-semibold text-slate-900">{service.title}</h3>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{progress}%</span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-600">{service.summary}</p>

                  <div className="mt-4 space-y-2">
                    {service.checklist.map((item) => {
                      const checked = Boolean(detailChecklistState[`${service.id}:${item.id}`]);

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleChecklistItem(service.id, item.id)}
                          className={`flex w-full items-center gap-3 rounded-[0.95rem] border px-3 py-2.5 text-left text-sm transition-colors ${checked
                            ? "border-[#cfe0ff] bg-[#f3f7ff] text-[#234dc5]"
                            : "border-slate-200 bg-slate-50 text-slate-700"
                            }`}
                        >
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${checked ? "bg-[#2f63dd] text-white" : "bg-white text-slate-300"
                              }`}
                          >
                            ✓
                          </span>
                          <span>{item.title}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpandedServiceId((prev) => (prev === service.id ? null : service.id))}
                    className="mt-4 w-full rounded-[1rem] border border-[#d9e6ff] bg-[#f5f8ff] px-4 py-2.5 text-sm font-semibold text-[#2f63dd]"
                  >
                    {isExpanded ? "세부 업무 단계 닫기" : "세부 업무 단계 보기"}
                  </button>

                  {isExpanded ? (
                    <div className="mt-3 rounded-[1rem] bg-slate-50 px-4 py-3">
                      <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">세부 업무 단계</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {service.steps.map((step, index) => (
                          <span
                            key={step}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600"
                          >
                            {index + 1}. {step}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </section>
              );
            })}
          </div>

          <div className="space-y-2 pb-2">
            <form
              onSubmit={handleSubmitRequestEmail}
              className="rounded-[1.5rem] border border-[#d9e6ff] bg-white px-4 py-4 shadow-[0_12px_30px_rgba(47,99,221,0.1)]"
            >
              <p className="text-sm font-semibold text-slate-900">정확한 견적 요청 받기</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">담당자 메일을 남겨주시면 상세 범위를 기준으로 안내할 수 있습니다.</p>
              <input
                type="email"
                inputMode="email"
                value={requestEmail}
                onChange={(event) => {
                  setRequestEmail(event.target.value);
                  if (requestSubmitState !== "idle") {
                    setRequestSubmitState("idle");
                    setRequestSubmitError("");
                  }
                }}
                onBlur={() => setRequestEmailTouched(true)}
                placeholder="you@company.com"
                className={`mt-3 w-full rounded-[0.95rem] border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors ${requestEmailTouched && !isRequestEmailValid
                  ? "border-red-300 focus:border-red-400"
                  : "border-slate-200 focus:border-[#7ea3ff]"
                  }`}
              />
              {requestEmailTouched && !isRequestEmailValid ? (
                <p className="mt-2 text-xs text-red-500">유효한 이메일 형식으로 입력해 주세요.</p>
              ) : null}
              {requestSubmitState === "success" ? (
                <p className="mt-2 text-xs text-[#2f63dd]">요청이 접수되었습니다. 담당자가 상세 견적 안내를 드릴 예정입니다.</p>
              ) : null}
              {requestSubmitState === "error" ? (
                <p className="mt-2 text-xs text-red-500">{requestSubmitError || "요청 전송 중 오류가 발생했습니다."}</p>
              ) : null}
              <button
                type="submit"
                className="mt-3 w-full rounded-[0.95rem] bg-[#132750] px-3 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!isRequestEmailValid || requestSubmitState === "submitting" || requestSubmitState === "success"}
              >
                {requestSubmitState === "submitting" ? "등록 중..." : requestSubmitState === "success" ? "요청 접수 완료" : "상세 견적 요청 등록"}
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  if (isComplete && estimate && (resultFlowPhase === "analyzing" || resultFlowPhase === "complete")) {
    const isAnalyzing = resultFlowPhase === "analyzing";

    return (
      <main className="min-h-screen bg-[#f8fafc] px-4 py-5 sm:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-md items-center justify-center">
          <div className="w-full py-12 text-center">
            {isAnalyzing ? (
              <div className="mx-auto h-11 w-11 rounded-full border-[4px] border-[#d4e2ff] border-t-[#1f5edc] animate-spin" />
            ) : (
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#e8f0ff]">
                <svg viewBox="0 0 20 20" fill="none" className="h-6 w-6 text-[#1f5edc]" aria-hidden="true">
                  <path d="M4.5 10.5l3.5 3.5 7-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
            <p className="mt-5 text-[1.15rem] font-semibold text-[#1f5edc]">
              {isAnalyzing ? "결과 분석중" : "완료"}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (isComplete && estimate) {
    const shouldShowBreakdown = estimate.serviceBreakdown.length > 1;

    return (
      <main className={`min-h-screen bg-[#f8fafc] px-4 py-5 transition-opacity duration-500 ease-out sm:px-6 ${resultViewReady ? "opacity-100" : "opacity-0"}`}>
        <div className="mx-auto max-w-md overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <div className="bg-[linear-gradient(180deg,#f8fbff_0%,#f8fafc_100%)] px-6 pb-8 pt-6">
            <p className="mt-8 text-sm font-semibold text-slate-500">예상 도입 금액 범위</p>
            <div className="mt-4 px-1">
              <p
                className={`inline-flex items-end gap-2 whitespace-nowrap text-[clamp(1.18rem,6.9vw,1.95rem)] font-[800] leading-none tracking-[-0.04em] text-slate-950 tabular-nums transition-[filter,opacity,transform] duration-300 ease-out ${resultAnimated ? "translate-y-[2px] blur-[3px] opacity-70" : "translate-y-0 blur-0 opacity-100"}`}
              >
                <span>{formatAmount(animatedMin)}</span>
                <span className="pb-[0.08rem] text-[0.95em] font-semibold text-slate-300">~</span>
                <span>{formatAmount(animatedMax)}</span>
              </p>
            </div>
            <p className="mt-3 text-base leading-7 text-slate-700">{estimate.recommendation}</p>
          </div>

          <div className="px-6 py-7">
            {shouldShowBreakdown ? (
              <div className="rounded-[1.5rem] bg-slate-50 px-5 py-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">금액 구성</p>
                <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                  {estimate.serviceBreakdown.map((service) => (
                    <div key={service.id} className="flex items-center justify-between gap-3">
                      <span>{service.label}</span>
                      <span className="font-semibold text-slate-900">{formatRange(service.range)}</span>
                    </div>
                  ))}
                  {estimate.breakdown.onboarding ? (
                    <div className="flex items-center justify-between gap-3">
                      <span>LCA SW 온보딩 컨설팅</span>
                      <span className="font-semibold text-slate-900">{formatRange(estimate.breakdown.onboarding)}</span>
                    </div>
                  ) : null}
                  <div className="mt-2 h-px bg-slate-200" />
                  <div className="flex items-center justify-between gap-3">
                    <span>합계 범위</span>
                    <span className="font-semibold text-slate-900">{formatRange(estimate.total)}</span>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-6 rounded-[1.4rem] border border-slate-200 px-4 py-4">
              <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">산정 기준</p>
              <div className="mt-2 space-y-2">
                {estimate.shortMessages.map((message) => (
                  <p key={message} className="text-sm leading-7 text-slate-700">
                    {message}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {estimate.serviceLabels.map((label) => (
                <span key={label} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  {label}
                </span>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {estimate.selectedGoalLabels.map((label) => (
                <span key={label} className="rounded-full bg-[#e8f0ff] px-3 py-1.5 text-xs font-semibold text-[#2f63dd]">
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-7 space-y-2">
              <button
                type="button"
                onClick={() => setShowDetailDiagnosis(true)}
                className="w-full rounded-[1.2rem] bg-[#132750] px-4 py-3 text-sm font-semibold text-white"
              >
                상세진단 보기
              </button>
              <button
                type="button"
                onClick={handleRestart}
                className="w-full rounded-[1.2rem] border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
              >
                다시 진단하기
              </button>
            </div>

            <p className="mt-8 text-center text-xs text-slate-400">Copyright © 2026 by 탄소중립연구원</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-5 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col">
        <div>
          <div className="mt-8">
            <div className="mb-1 flex justify-end text-xs font-medium text-slate-400">
              <span>{displayStepIndex + 1}/{STEPS.length}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrev}
                disabled={displayStepIndex === 0 || isStepTransitioning}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#132750] text-sm text-white shadow-[0_10px_20px_rgba(19,39,80,0.24)] disabled:cursor-not-allowed disabled:opacity-45"
              >
                ←
              </button>
              <div className="h-3 flex-1 rounded-full bg-slate-100">
                <div className="h-3 rounded-full bg-[#132750] transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className={`flex flex-1 flex-col transition-all duration-200 ease-out ${stepTransitionClass} ${isStepTransitioning ? "pointer-events-none" : ""}`}>
          <div className="flex flex-1 flex-col justify-center pb-8 pt-10">
            <p className="text-center text-sm font-semibold tracking-[0.18em] text-brand-700">{currentStep.kicker}</p>
            <h1 className="mt-4 text-center text-[1.9rem] font-semibold tracking-tight text-slate-950">{currentStep.title}</h1>

            {currentStep.id === "company" ? (
              <div ref={companyStepRef} className="mt-10 space-y-4">
                <StepDropdown
                  label="업종 그룹"
                  placeholder="업종 그룹을 선택해 주세요"
                  options={INDUSTRIES}
                  selectedValue={selectedIndustry}
                  isOpen={openDropdown === "industry"}
                  onToggle={() => setOpenDropdown((prev) => (prev === "industry" ? null : "industry"))}
                  onSelect={(value) => {
                    setSelectedIndustry(value as IndustryOption["id"]);
                    setOpenDropdown(null);
                  }}
                />

                <StepDropdown
                  label="회사 규모"
                  placeholder="회사 규모를 선택해 주세요"
                  options={COMPANY_SCALES}
                  selectedValue={selectedScale}
                  isOpen={openDropdown === "scale"}
                  onToggle={() => setOpenDropdown((prev) => (prev === "scale" ? null : "scale"))}
                  onSelect={(value) => {
                    setSelectedScale(value as ScaleOption["id"]);
                    setOpenDropdown(null);
                  }}
                />
              </div>
            ) : null}

            {currentStep.id === "current" ? (
              <div className="mt-10 space-y-4">
                {CURRENT_STATES.map((option) => {
                  const isSelected = option.id === selectedCurrent;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedCurrent(option.id)}
                      className={`w-full rounded-[1.35rem] px-5 py-5 text-left transition-all ${isSelected
                        ? "bg-[#132750] text-white shadow-[0_16px_40px_rgba(19,39,80,0.24)]"
                        : "border border-slate-200 bg-white text-slate-800 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
                        }`}
                    >
                      <p className="text-base font-semibold">{option.title}</p>
                      <p className={`mt-2 text-sm leading-6 ${isSelected ? "text-white/80" : "text-slate-500"}`}>
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {currentStep.id === "services" ? (
              <div className="mt-10">
                <div className="mb-4 rounded-full bg-slate-100 px-4 py-2 text-center text-xs font-semibold text-slate-600">
                  복수 선택 가능
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {SERVICE_OPTIONS.map((option) => {
                    const isSelected = selectedServices.includes(option.id);

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => toggleService(option.id)}
                        className={`rounded-[1.2rem] px-4 py-4 text-left transition-all ${isSelected
                          ? "bg-[#132750] text-white shadow-[0_16px_40px_rgba(19,39,80,0.24)]"
                          : "border border-slate-200 bg-white text-slate-800 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
                          }`}
                      >
                        <p className={`text-[11px] font-semibold tracking-[0.16em] ${isSelected ? "text-white/65" : "text-slate-400"}`}>
                          {option.category}
                        </p>
                        <p className="mt-2 text-sm font-semibold leading-5">{option.title}</p>
                        <p className={`mt-2 text-xs leading-5 ${isSelected ? "text-white/75" : "text-slate-500"}`}>
                          {option.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {currentStep.id === "goal" ? (
              <div className="mt-10">
                <div className="mb-4 rounded-full bg-slate-100 px-4 py-2 text-center text-xs font-semibold text-slate-600">
                  복수 선택 가능
                </div>
                {GOAL_OPTIONS.map((option) => {
                  const isSelected = selectedGoals.includes(option.id);

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleGoal(option.id)}
                      className={`mb-3 w-full rounded-[1.35rem] px-5 py-5 text-left transition-all ${isSelected
                        ? "bg-[#132750] text-white shadow-[0_16px_40px_rgba(19,39,80,0.24)]"
                        : "border border-slate-200 bg-white text-slate-800 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
                        }`}
                    >
                      <p className="text-base font-semibold">{option.title}</p>
                      <p className={`mt-2 text-sm leading-6 ${isSelected ? "text-white/80" : "text-slate-500"}`}>
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="pb-2">
            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid || isStepTransitioning}
              className="w-full rounded-[1.35rem] bg-[#132750] px-5 py-4 text-base font-semibold text-white shadow-[0_16px_40px_rgba(19,39,80,0.24)] disabled:cursor-not-allowed disabled:opacity-45"
            >
              {displayStepIndex === STEPS.length - 1 ? "예상 도입금액 보기" : "다음 단계로"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
