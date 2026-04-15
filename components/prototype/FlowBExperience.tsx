"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { PrototypeFlow } from "@/constants/prototypeFlows";
import PrototypeCompareNav from "./PrototypeCompareNav";

type FlowBExperienceProps = {
  flow: PrototypeFlow;
};

type SelectedDecision = {
  stepId: DecisionStep["id"];
  title: string;
  value: string;
  score: number;
};

type DecisionStep = {
  id: "company" | "current" | "goal";
  kicker: string;
  title: string;
  description: string;
  options: {
    id: string;
    title: string;
    description: string;
    score: number;
  }[];
};

const STEPS: DecisionStep[] = [
  {
    id: "company",
    kicker: "Step 1",
    title: "현재 조직 규모를 알려주세요",
    description: "대략적인 회사 규모를 기준으로 투자 범위와 운영 복잡도를 가늠합니다.",
    options: [
      {
        id: "small",
        title: "직원 1~99명 · 매출 100억 미만",
        description: "초기 체계 정비와 빠른 실행이 중요한 단계",
        score: 1
      },
      {
        id: "mid",
        title: "직원 100~499명 · 매출 100억~1,000억",
        description: "조직 내 데이터 흐름 정렬이 필요한 성장 단계",
        score: 2
      },
      {
        id: "large",
        title: "직원 500명 이상 · 매출 1,000억 이상",
        description: "전사 단위 대응과 표준화가 필요한 확장 단계",
        score: 3
      }
    ]
  },
  {
    id: "current",
    kicker: "Step 2",
    title: "현재 대응 상황은 어떤가요?",
    description: "이미 구축된 프로세스가 있는지에 따라 접근 방식이 달라집니다.",
    options: [
      {
        id: "manual",
        title: "ESG 대응은 시작했지만 대부분 수작업입니다",
        description: "엑셀, 이메일, 수기 취합 중심",
        score: 3
      },
      {
        id: "partial",
        title: "부분 시스템은 있지만 연결이 약합니다",
        description: "부서별로 관리되어 전체 흐름 파악이 어려움",
        score: 2
      },
      {
        id: "ready",
        title: "기본 체계는 있고 고도화가 필요합니다",
        description: "정합성과 리포팅 속도를 더 높이고 싶은 상태",
        score: 1
      }
    ]
  },
  {
    id: "goal",
    kicker: "Step 3",
    title: "이번 프로젝트의 우선 목표는 무엇인가요?",
    description: "의사결정 목적에 따라 기대 가치와 적정 범위를 함께 제안합니다.",
    options: [
      {
        id: "cost",
        title: "운영 비용 절감",
        description: "반복 업무와 실무 리소스를 줄이고 싶음",
        score: 2
      },
      {
        id: "risk",
        title: "규제 및 리스크 관리",
        description: "감사 대응과 보고 신뢰성을 우선 확보하고 싶음",
        score: 3
      },
      {
        id: "funding",
        title: "투자 유치 및 대외 신뢰 강화",
        description: "외부 이해관계자에게 준비도를 명확히 보여주고 싶음",
        score: 4
      }
    ]
  }
];

const RANGE_BY_SCORE = [
  {
    min: 0,
    max: 4,
    range: "3천만 원 ~ 6천만 원",
    label: "Light Setup",
    recommendation: "핵심 데이터 흐름부터 빠르게 정리하는 경량 도입이 적합합니다.",
    impact: "짧은 기간 안에 기본 진단과 운영 체계를 함께 정리할 수 있습니다."
  },
  {
    min: 5,
    max: 7,
    range: "6천만 원 ~ 1.2억 원",
    label: "Core Build",
    recommendation: "주요 프로세스를 연결하는 표준 구축형 접근이 현실적입니다.",
    impact: "부서별 산재 데이터를 통합하고 보고 준비 리드타임을 줄이기 좋습니다."
  },
  {
    min: 8,
    max: 12,
    range: "1.2억 원 ~ 2.5억 원",
    label: "Scaled Rollout",
    recommendation: "전사 확장과 관리 체계 고도화를 함께 보는 전략이 유효합니다.",
    impact: "리스크 관리, 대외 신뢰, 장기 운영 효율을 동시에 확보하기 좋습니다."
  }
];

export default function FlowBExperience({ flow }: FlowBExperienceProps) {
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentStep = STEPS[stepIndex];
  const selectedId = answers[currentStep?.id];
  const isComplete = stepIndex >= STEPS.length;
  const progress = Math.round((Math.min(stepIndex, STEPS.length) / STEPS.length) * 100);

  const selectedOptions = useMemo(
    () =>
      STEPS.map((step) => {
        const optionId = answers[step.id];
        const option = step.options.find((item) => item.id === optionId);

        if (!option) {
          return null;
        }

        return {
          stepId: step.id,
          title: step.title,
          value: option.title,
          score: option.score
        };
      }).filter((item): item is SelectedDecision => item !== null),
    [answers]
  );

  const totalScore = selectedOptions.reduce((sum, item) => sum + item.score, 0);
  const range = RANGE_BY_SCORE.find((item) => totalScore >= item.min && totalScore <= item.max) ?? RANGE_BY_SCORE[1];

  const handleSelect = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentStep.id]: optionId }));
  };

  const handleNext = () => {
    if (!selectedId) {
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
    setAnswers({});
  };

  if (!started) {
    return (
      <main className="min-h-screen bg-white px-5 py-8 sm:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-between">
          <PrototypeCompareNav current="flow-b" />
          <div className="w-full pt-4 text-center">
            <Image
              src="/brands/cnri_logo.png"
              alt="탄소중립연구원"
              width={420}
              height={122}
              className="mx-auto h-auto w-[240px] sm:w-[280px]"
              priority
            />
          </div>

          <div className="w-full text-center">
            <p className="text-sm font-semibold tracking-[0.18em] text-brand-700">INTERACTIVE ROI TOOL</p>
            <h1 className="mt-4 text-[2rem] font-semibold tracking-tight text-slate-950">
              탄소중립
              <br />
              도입 의사결정 지원 도구
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              회사 규모, 현재 대응 상태, 우선 목표를 순서대로 선택하면
              <br />
              예상 비용 범위와 적합한 도입 방향을 제안합니다.
            </p>

            <div className="mt-10 rounded-[2rem] bg-[radial-gradient(circle_at_top,#eff6ff_0%,#dbeafe_38%,#ffffff_76%)] px-6 py-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="grid gap-3 text-left">
                <div className="rounded-[1.3rem] bg-white/80 px-4 py-4 shadow-sm">
                  <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">STEP 1</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">회사 규모 선택</p>
                </div>
                <div className="rounded-[1.3rem] bg-white/80 px-4 py-4 shadow-sm">
                  <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">STEP 2</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">현재 상황 선택</p>
                </div>
                <div className="rounded-[1.3rem] bg-white/80 px-4 py-4 shadow-sm">
                  <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">STEP 3</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">우선 목표 선택</p>
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
              ROI 시뮬레이션 시작하기
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (isComplete) {
    return (
      <main className="min-h-screen bg-[#f8fafc] px-4 py-5 sm:px-6">
        <PrototypeCompareNav current="flow-b" />
        <div className="mx-auto max-w-md overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <div className="bg-[linear-gradient(135deg,#dbeafe_0%,#eff6ff_45%,#f8fafc_100%)] px-6 pb-8 pt-6">
            <Image
              src="/brands/cnri_logo.png"
              alt="탄소중립연구원"
              width={420}
              height={122}
              className="h-auto w-[210px]"
            />
            <p className="mt-8 text-sm font-semibold text-slate-600">예상 도입 범위</p>
            <h1 className="mt-2 text-[2.2rem] font-semibold tracking-tight text-slate-950">{range.range}</h1>
            <p className="mt-3 text-base leading-7 text-slate-700">{range.recommendation}</p>
          </div>

          <div className="px-6 py-7">
            <div className="rounded-[1.5rem] bg-slate-50 px-5 py-4">
              <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">{range.label}</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{range.impact}</p>
            </div>

            <div className="mt-6 grid gap-3">
              {selectedOptions.map((item) => (
                <div key={item.stepId} className="rounded-[1.4rem] border border-slate-200 px-4 py-4">
                  <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">{item.title}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-[1.5rem] bg-[#132750] px-5 py-5 text-white">
              <p className="text-xs font-semibold tracking-[0.16em] text-white/65">DECISION SUPPORT</p>
              <p className="mt-2 text-lg font-semibold">현재 선택 기준으로는 {range.label} 접근이 적합합니다.</p>
              <p className="mt-3 text-sm leading-7 text-white/80">
                세부 범위는 데이터 소스 수, 조직 구조, 보고 요구 수준에 따라 달라질 수 있습니다.
              </p>
            </div>

            <div className="mt-7 space-y-2">
              <button
                type="button"
                className="w-full rounded-[1.2rem] bg-[#132750] px-4 py-3 text-sm font-semibold text-white"
              >
                {flow.ctaPrimary}
              </button>
              <button
                type="button"
                onClick={handleRestart}
                className="w-full rounded-[1.2rem] border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
              >
                다시 시뮬레이션하기
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-5 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col">
        <PrototypeCompareNav current="flow-b" />
        <div>
          <Image
            src="/brands/cnri_logo.png"
            alt="탄소중립연구원"
            width={420}
            height={122}
            className="mx-auto h-auto w-[220px] sm:w-[260px]"
            priority
          />

          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={stepIndex === 0}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-500 disabled:opacity-40"
            >
              ‹
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

        <div className="mt-8 flex flex-wrap gap-2">
          {selectedOptions.map((item) => (
            <div key={item.stepId} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              {item.value}
            </div>
          ))}
        </div>

        <div className="flex flex-1 flex-col justify-center pb-8 pt-10">
          <p className="text-center text-sm font-semibold tracking-[0.18em] text-brand-700">{currentStep.kicker}</p>
          <h1 className="mt-4 text-center text-[1.9rem] font-semibold tracking-tight text-slate-950">{currentStep.title}</h1>
          <p className="mt-4 text-center text-base leading-7 text-slate-600">{currentStep.description}</p>

          <div className="mt-10 space-y-4">
            {currentStep.options.map((option) => {
              const isSelected = option.id === selectedId;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  className={`w-full rounded-[1.35rem] px-5 py-5 text-left transition-all ${
                    isSelected
                      ? "bg-[#132750] text-white shadow-[0_16px_40px_rgba(19,39,80,0.24)]"
                      : "border border-slate-200 bg-white text-slate-800 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
                  }`}
                >
                  <p className="text-base font-semibold">{option.title}</p>
                  <p className={`mt-2 text-sm leading-6 ${isSelected ? "text-white/80" : "text-slate-500"}`}>{option.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pb-2">
          <button
            type="button"
            onClick={handleNext}
            disabled={!selectedId}
            className="w-full rounded-[1.35rem] bg-[#132750] px-5 py-4 text-base font-semibold text-white shadow-[0_16px_40px_rgba(19,39,80,0.24)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {stepIndex === STEPS.length - 1 ? "예상 범위 확인하기" : "다음 단계로"}
          </button>
        </div>
      </div>
    </main>
  );
}
