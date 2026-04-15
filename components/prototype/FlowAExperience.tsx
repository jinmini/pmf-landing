"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { PrototypeFlow } from "@/constants/prototypeFlows";
import PrototypeCompareNav from "./PrototypeCompareNav";
import { usePrototypeFlow } from "./usePrototypeFlow";

type FlowAExperienceProps = {
  flow: PrototypeFlow;
};

const RECOMMENDATIONS = [
  {
    title: "탄소 인벤토리 진단",
    description: "배출원 정리와 데이터 수집 체계를 먼저 안정화하고 싶은 조직에 적합합니다.",
    cta: "진단 프로그램 보기"
  },
  {
    title: "실무자 전환 워크숍",
    description: "담당자 중심으로 빠르게 실행 계획과 내부 역할을 맞추고 싶을 때 추천합니다.",
    cta: "워크숍 문의하기"
  }
];

export default function FlowAExperience({ flow }: FlowAExperienceProps) {
  const {
    totalSteps,
    stepIndex,
    isResultStep,
    currentStep,
    selectedOptionIndex,
    progress,
    result,
    score,
    selectOption,
    moveNext,
    movePrev,
    resetFlow
  } = usePrototypeFlow(flow);
  const [started, setStarted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!isResultStep) {
      return;
    }

    setIsAnalyzing(true);
    const timeout = window.setTimeout(() => {
      setIsAnalyzing(false);
    }, 1300);

    return () => window.clearTimeout(timeout);
  }, [isResultStep]);

  if (!currentStep) {
    return null;
  }

  const handlePrimary = () => {
    if (stepIndex === totalSteps - 1) {
      setIsAnalyzing(true);
    }

    moveNext();
  };

  const handleRestart = () => {
    setStarted(false);
    setIsAnalyzing(false);
    resetFlow();
  };

  if (!started) {
    return (
      <main className="min-h-screen bg-white px-5 py-8 sm:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-between">
          <PrototypeCompareNav current="flow-a" />
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
            <p className="text-sm font-semibold tracking-[0.18em] text-brand-700">CARBON READINESS CHECK</p>
            <h1 className="mt-4 text-[2rem] font-semibold tracking-tight text-slate-950">
              우리 조직의
              <br />
              탄소중립 준비도 진단
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              몇 가지 질문만으로 현재 실행 우선순위와
              <br />
              적합한 지원 방향을 빠르게 확인해보세요.
            </p>

            <div className="mt-10 rounded-[2rem] bg-[radial-gradient(circle_at_top,#eff6ff_0%,#dbeafe_38%,#ffffff_76%)] px-6 py-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border border-white/70 bg-white/70 shadow-lg shadow-blue-100/70">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 text-center text-sm font-semibold leading-5 text-brand-800">
                  AI 기반
                  <br />
                  준비도 체크
                </div>
              </div>
              <p className="mt-6 text-lg font-semibold text-slate-900">빠르고 간단한 마이크로 진단</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">모바일에서도 부담 없이 끝까지 확인할 수 있도록 구성했습니다.</p>
            </div>
          </div>

          <div className="w-full pb-4">
            <button
              type="button"
              onClick={() => setStarted(true)}
              className="w-full rounded-[1.4rem] bg-[#132750] px-5 py-4 text-base font-semibold text-white shadow-[0_16px_40px_rgba(19,39,80,0.24)] transition-transform hover:-translate-y-0.5"
            >
              진단 시작하기
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (isResultStep && isAnalyzing) {
    return (
      <main className="min-h-screen bg-white px-5 py-8 sm:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-center">
          <PrototypeCompareNav current="flow-a" />
          <Image
            src="/brands/cnri_logo.png"
            alt="탄소중립연구원"
            width={420}
            height={122}
            className="h-auto w-[240px] sm:w-[280px]"
            priority
          />
          <div className="mt-12 h-10 w-10 animate-spin rounded-full border-[3px] border-slate-200 border-t-[#132750]" />
          <p className="mt-5 text-base font-semibold text-slate-900">결과 분석중</p>
          <p className="mt-2 text-sm text-slate-500">현재 응답을 바탕으로 추천 방향을 정리하고 있습니다.</p>
        </div>
      </main>
    );
  }

  if (isResultStep) {
    return (
      <main className="min-h-screen bg-[#f8fafc] px-4 py-5 sm:px-6">
        <PrototypeCompareNav current="flow-a" />
        <div className="mx-auto max-w-md overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <div className="bg-[linear-gradient(135deg,#dbeafe_0%,#eff6ff_45%,#f8fafc_100%)] px-6 pb-8 pt-6">
            <Image
              src="/brands/cnri_logo.png"
              alt="탄소중립연구원"
              width={420}
              height={122}
              className="h-auto w-[210px]"
            />
            <p className="mt-8 text-sm font-semibold text-slate-600">조직 진단 결과</p>
            <h1 className="mt-2 text-[2.25rem] font-semibold tracking-tight text-slate-950">{result.projectDirection}</h1>
            <p className="mt-3 text-base leading-7 text-slate-700">{result.headline}</p>
          </div>

          <div className="px-6 py-7">
            <div className="rounded-[1.5rem] bg-slate-50 px-5 py-4">
              <p className="text-sm font-semibold text-slate-900">추천 해석</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{result.recommendation}</p>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="rounded-[1.4rem] border border-slate-200 px-4 py-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">현재 포인트</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{result.rationale}</p>
              </div>
              <div className="rounded-[1.4rem] border border-slate-200 px-4 py-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">기대 효과</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{result.operationalBenefit}</p>
              </div>
              <div className="rounded-[1.4rem] border border-slate-200 px-4 py-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">바로 할 일</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{result.nextAction}</p>
              </div>
            </div>

            <div className="mt-7">
              <p className="text-sm font-semibold text-slate-900">추천 프로그램</p>
              <div className="mt-3 space-y-3">
                {RECOMMENDATIONS.map((item) => (
                  <article key={item.title} className="rounded-[1.5rem] bg-slate-50 px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-base font-semibold text-slate-900">{item.title}</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                      </div>
                      <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#132750]">{score}</div>
                    </div>
                    <button
                      type="button"
                      className="mt-4 w-full rounded-[1.2rem] bg-[#132750] px-4 py-3 text-sm font-semibold text-white"
                    >
                      {item.cta}
                    </button>
                  </article>
                ))}
              </div>
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
                다시 진단하기
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
        <PrototypeCompareNav current="flow-a" />
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
              onClick={movePrev}
              disabled={stepIndex === 0}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-500 disabled:opacity-40"
            >
              ‹
            </button>
            <div className="flex-1">
              <div className="flex items-center justify-end text-xs font-medium text-slate-400">
                {stepIndex + 1}/{totalSteps}
              </div>
              <div className="mt-1 h-3 rounded-full bg-slate-100">
                <div className="h-3 rounded-full bg-[#132750] transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center pb-8 pt-10">
          <p className="text-center text-[3rem] font-semibold tracking-tight text-[#132750]">Q{stepIndex + 1}.</p>
          <h1 className="mt-8 text-center text-[1.75rem] font-semibold tracking-tight text-slate-950">{currentStep.title}</h1>
          <p className="mt-4 text-center text-base leading-7 text-slate-600">{currentStep.description}</p>

          <div className="mt-10 space-y-4">
            {currentStep.options.map((option, optionIndex) => {
              const isSelected = optionIndex === selectedOptionIndex;

              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => selectOption(optionIndex)}
                  className={`w-full rounded-[1.35rem] px-5 py-5 text-base font-semibold transition-all ${
                    isSelected
                      ? "bg-[#132750] text-white shadow-[0_16px_40px_rgba(19,39,80,0.24)]"
                      : "border border-slate-200 bg-white text-slate-800 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pb-2">
          <button
            type="button"
            onClick={handlePrimary}
            disabled={typeof selectedOptionIndex !== "number"}
            className="w-full rounded-[1.35rem] bg-[#132750] px-5 py-4 text-base font-semibold text-white shadow-[0_16px_40px_rgba(19,39,80,0.24)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {stepIndex === totalSteps - 1 ? "결과 확인하기" : "다음으로"}
          </button>
        </div>
      </div>
    </main>
  );
}
