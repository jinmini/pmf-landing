"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FLOW_C_PAGE } from "@/constants/flowCContent";
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
  { id: "mid-market", title: "비상장 중견기업 (매출 1,000억 이상)" },
  { id: "sme", title: "비상장 중소기업 (매출 1,000억 미만)" }
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
    id: "lync-platform",
    title: "LynC(LCA Platform)",
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
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryOption["id"] | "">("");
  const [selectedScale, setSelectedScale] = useState<ScaleOption["id"] | "">("");
  const [selectedCurrent, setSelectedCurrent] = useState<CurrentStateOption["id"] | "">("");
  const [selectedServices, setSelectedServices] = useState<ServiceOption["id"][]>([]);
  const [selectedGoal, setSelectedGoal] = useState<GoalOption["id"] | "">("");
  const [openDropdown, setOpenDropdown] = useState<"industry" | "scale" | null>(null);
  const companyStepRef = useRef<HTMLDivElement | null>(null);

  const currentStep = STEPS[stepIndex];
  const isComplete = stepIndex >= STEPS.length;
  const progress = Math.round((Math.min(stepIndex, STEPS.length) / STEPS.length) * 100);

  useEffect(() => {
    setOpenDropdown(null);
  }, [stepIndex]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!companyStepRef.current?.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const isStepValid =
    currentStep?.id === "company"
      ? Boolean(selectedIndustry && selectedScale)
      : currentStep?.id === "current"
        ? Boolean(selectedCurrent)
        : currentStep?.id === "services"
          ? selectedServices.length > 0
          : Boolean(selectedGoal);

  const estimate = useMemo(() => {
    if (!selectedIndustry || !selectedScale || !selectedCurrent || !selectedGoal || selectedServices.length === 0) {
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

    const hasPlatform = selectedServices.includes("lync-platform");
    const solutionRange = mergeRanges(serviceRanges.map((service) => service.range));
    const onboardingRange = hasPlatform ? buildFixedRange(FLOW_C_LYNC_ONBOARDING_TABLE[companyKey]) : null;
    const total = onboardingRange ? mergeRanges([solutionRange, onboardingRange]) : solutionRange;

    const shortMessages: string[] = [FLOW_C_SHORT_MESSAGES.base, FLOW_C_SHORT_MESSAGES.variance];
    if (hasPlatform) {
      shortMessages.push(FLOW_C_SHORT_MESSAGES.onboarding);
    }

    const recommendation =
      selectedGoal === "customer"
        ? "고객사 대응형 제안"
        : selectedGoal === "risk" && selectedServices.some((serviceId) => REGULATORY_SERVICE_IDS.includes(serviceId))
          ? "규제 대응형 제안"
          : selectedGoal === "trust" && selectedServices.some((serviceId) => ["cdp", "sbti"].includes(serviceId))
            ? "대외 신뢰 강화형 제안"
            : selectedGoal === "proactive"
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
      shortMessages,
      serviceLabels: serviceRanges.map((service) => service.label)
    };
  }, [selectedCurrent, selectedGoal, selectedIndustry, selectedScale, selectedServices]);

  const handleNext = () => {
    if (!isStepValid) {
      return;
    }

    setStepIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleRestart = () => {
    setStarted(false);
    setStepIndex(0);
    setSelectedIndustry("");
    setSelectedScale("");
    setSelectedCurrent("");
    setSelectedServices([]);
    setSelectedGoal("");
  };

  const toggleService = (serviceId: ServiceOption["id"]) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((item) => item !== serviceId) : [...prev, serviceId]
    );
  };

  if (!started) {
    return (
      <main className="min-h-screen bg-white px-5 py-8 sm:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-between">
          <div className="w-full text-center">
            <div className="rounded-[2.25rem] border border-slate-200 bg-[radial-gradient(circle_at_top,#f8fbff_0%,#edf4ff_36%,#ffffff_76%)] px-6 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <p className="text-sm font-semibold tracking-[0.18em] text-brand-700">제조업 탄소중립 예산 가이드</p>
              <h1 className="mt-4 text-[1.5rem] font-semibold tracking-tight text-slate-950">
                우리 회사
                <br />
                탄소중립 예산 한 번에 알아보기
                <span className="text-brand-700"></span>
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                업종, 규모, 현재 대응 수준, 검토 범위를 차례대로 선택하면
                <br />
                예상 제안 범위와 검토 방향을 빠르게 확인할 수 있습니다.
              </p>
            </div>

            <div className="mt-10 rounded-[2rem] bg-[radial-gradient(circle_at_top,#eff6ff_0%,#dbeafe_38%,#ffffff_76%)] px-6 py-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
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
              className="w-full rounded-[1.4rem] bg-[#132750] px-5 py-4 text-base font-semibold text-white shadow-[0_16px_40px_rgba(19,39,80,0.24)] transition-transform hover:-translate-y-0.5"
            >
              예상 범위 확인하기
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (isComplete && estimate) {
    return (
      <main className="min-h-screen bg-[#f8fafc] px-4 py-5 sm:px-6">
        <div className="mx-auto max-w-md overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <div className="bg-[linear-gradient(135deg,#dbeafe_0%,#eff6ff_45%,#f8fafc_100%)] px-6 pb-8 pt-6">
            <p className="mt-8 text-sm font-semibold text-slate-600">예상 제안 범위</p>
            <h1 className="mt-2 text-[2.15rem] font-semibold tracking-tight text-slate-950">
              {formatRange(estimate.total)}
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-700">{estimate.recommendation}</p>
          </div>

          <div className="px-6 py-7">
            <div className="rounded-[1.5rem] bg-slate-50 px-5 py-4">
              <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">금액 구성</p>
              <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                <div className="flex items-center justify-between gap-3">
                  <span>선택 솔루션 범위</span>
                  <span className="font-semibold text-slate-900">{formatRange(estimate.breakdown.solution)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>LynC 온보딩</span>
                  <span className="font-semibold text-slate-900">
                    {estimate.breakdown.onboarding ? formatRange(estimate.breakdown.onboarding) : "미포함"}
                  </span>
                </div>
              </div>
            </div>

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

            <div className="mt-7 space-y-2">
              <a
                href={FLOW_C_PAGE.ctaPrimaryHref}
                target="_blank"
                rel="noreferrer"
                className="block w-full rounded-[1.2rem] bg-[#132750] px-4 py-3 text-center text-sm font-semibold text-white"
              >
                {FLOW_C_PAGE.ctaPrimary}
              </a>
              <button
                type="button"
                onClick={handleRestart}
                className="w-full rounded-[1.2rem] border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
              >
                다시 시뮬레이션하기
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
          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={stepIndex === 0}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-500 disabled:opacity-40"
            >
              ←
            </button>
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs font-medium text-slate-400">
                <span>{currentStep.kicker}</span>
                <span>{stepIndex + 1}/{STEPS.length}</span>
              </div>
              <div className="mt-1 h-3 rounded-full bg-slate-100">
                <div className="h-3 rounded-full bg-[#132750] transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>

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
            <div className="mt-10 space-y-4">
              {GOAL_OPTIONS.map((option) => {
                const isSelected = option.id === selectedGoal;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedGoal(option.id)}
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
        </div>

        <div className="pb-2">
          <button
            type="button"
            onClick={handleNext}
            disabled={!isStepValid}
            className="w-full rounded-[1.35rem] bg-[#132750] px-5 py-4 text-base font-semibold text-white shadow-[0_16px_40px_rgba(19,39,80,0.24)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {stepIndex === STEPS.length - 1 ? "예상 제안 보기" : "다음 단계로"}
          </button>
        </div>
      </div>
    </main>
  );
}
