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
  const [selectedGoal, setSelectedGoal] = useState<GoalOption["id"] | "">("");
  const [openDropdown, setOpenDropdown] = useState<"industry" | "scale" | null>(null);
  const [resultAnimated, setResultAnimated] = useState(false);
  const companyStepRef = useRef<HTMLDivElement | null>(null);
  const stepExitTimerRef = useRef<number | null>(null);
  const stepEnterTimerRef = useRef<number | null>(null);

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
    };
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

    const hasPlatform = selectedServices.includes("lca-platform");
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
      serviceLabels: serviceRanges.map((service) => service.label),
      serviceBreakdown: serviceRanges.map((service) => ({
        id: service.serviceId,
        label: service.label,
        range: service.range
      }))
    };
  }, [selectedCurrent, selectedGoal, selectedIndustry, selectedScale, selectedServices]);

  useEffect(() => {
    const shouldAnimate = isComplete && Boolean(estimate);
    setResultAnimated(shouldAnimate);

    if (!shouldAnimate) {
      return;
    }

    const timeoutId = window.setTimeout(() => setResultAnimated(false), 340);
    return () => window.clearTimeout(timeoutId);
  }, [estimate, isComplete]);

  const animatedMin = useCountUp(estimate?.total.min ?? 0, resultAnimated);
  const animatedMax = useCountUp(estimate?.total.max ?? 0, resultAnimated, 1750);

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

  const handleNext = () => {
    if (!isStepValid || isStepTransitioning) {
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
    setStarted(false);
    setStepIndex(0);
    setDisplayStepIndex(0);
    setStepTransitionPhase("idle");
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

  if (isComplete && estimate) {
    const shouldShowBreakdown = estimate.serviceBreakdown.length > 1;

    return (
      <main className="min-h-screen bg-[#f8fafc] px-4 py-5 sm:px-6">
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
