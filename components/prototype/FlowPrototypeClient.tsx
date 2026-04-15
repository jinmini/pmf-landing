"use client";

import { useMemo, useState } from "react";
import type { PrototypeFlow } from "@/constants/prototypeFlows";

type FlowPrototypeClientProps = {
  flow: PrototypeFlow;
};

export default function FlowPrototypeClient({ flow }: FlowPrototypeClientProps) {
  const totalSteps = flow.steps.length;
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const isResultStep = stepIndex >= totalSteps;
  const currentStep = flow.steps[Math.min(stepIndex, totalSteps - 1)];
  const selectedOptionIndex = answers[currentStep?.id];

  const score = useMemo(
    () =>
      flow.steps.reduce((sum, step) => {
        const optionIndex = answers[step.id];
        if (typeof optionIndex !== "number") {
          return sum;
        }

        return sum + step.options[optionIndex].score;
      }, 0),
    [answers, flow.steps]
  );

  const result = useMemo(
    () =>
      flow.resultBands.find((band) => score >= band.min && score <= band.max) ??
      flow.resultBands[flow.resultBands.length - 1],
    [flow.resultBands, score]
  );

  const progress = Math.round((Math.min(stepIndex, totalSteps) / totalSteps) * 100);

  const answerSummary = flow.steps
    .map((step) => {
      const selectedIndex = answers[step.id];
      if (typeof selectedIndex !== "number") {
        return null;
      }

      return {
        title: step.title,
        value: step.options[selectedIndex].label
      };
    })
    .filter((item): item is { title: string; value: string } => item !== null);

  const moveNext = () => {
    if (isResultStep) {
      return;
    }

    if (typeof selectedOptionIndex !== "number") {
      return;
    }

    setStepIndex((prev) => prev + 1);
  };

  const movePrev = () => {
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  const resetFlow = () => {
    setAnswers({});
    setStepIndex(0);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-slate-400">{flow.shortLabel}</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">{flow.title}</h2>
          <p className="mt-2 text-sm text-slate-600">{flow.subtitle}</p>
        </div>
        <div className="min-w-[160px]">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>진행도</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {!isResultStep ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr,1fr]">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-slate-400">
              단계 {stepIndex + 1} / {totalSteps}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">{currentStep.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{currentStep.description}</p>

            <div className="mt-5 space-y-3">
              {currentStep.options.map((option, optionIndex) => {
                const isSelected = optionIndex === selectedOptionIndex;
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, [currentStep.id]: optionIndex }))}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm leading-6 transition-colors ${
                      isSelected
                        ? "border-brand-500 bg-brand-50 text-slate-900"
                        : "border-slate-200 bg-white text-slate-700 hover:border-brand-300"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={movePrev}
                disabled={stepIndex === 0}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors enabled:hover:border-brand-400 enabled:hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-45"
              >
                이전
              </button>
              <button
                type="button"
                onClick={moveNext}
                disabled={typeof selectedOptionIndex !== "number"}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors enabled:hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {stepIndex === totalSteps - 1 ? "결과 보기" : "다음"}
              </button>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
            <p className="text-sm font-semibold text-slate-900">설득 구조 요약</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{flow.summary}</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="min-w-[74px] rounded bg-white px-2 py-1 text-xs font-semibold text-slate-700">톤</dt>
                <dd className="pt-1 text-slate-700">{flow.tone}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="min-w-[74px] rounded bg-white px-2 py-1 text-xs font-semibold text-slate-700">초점</dt>
                <dd className="pt-1 text-slate-700">{flow.strategicFocus}</dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              {flow.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">{flow.captureMessage}</p>
          </aside>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr,1fr]">
          <div className="rounded-2xl border border-brand-100 bg-brand-50/70 p-6">
            <p className="text-xs font-semibold tracking-[0.14em] text-brand-700">진단 결과</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">{result.headline}</h3>
            <p className="mt-4 text-sm leading-6 text-slate-700">{result.recommendation}</p>

            <dl className="mt-5 space-y-3 text-sm">
              <div>
                <dt className="font-semibold text-slate-800">추천 근거</dt>
                <dd className="mt-1 leading-6 text-slate-700">{result.rationale}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-800">기대 운영 효과</dt>
                <dd className="mt-1 leading-6 text-slate-700">{result.operationalBenefit}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-800">권장 프로젝트 방향</dt>
                <dd className="mt-1 leading-6 text-slate-700">{result.projectDirection}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-800">다음 액션</dt>
                <dd className="mt-1 leading-6 text-slate-700">{result.nextAction}</dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700">
                {flow.ctaPrimary}
              </button>
              <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-400 hover:text-brand-700">
                {flow.ctaSecondary}
              </button>
              <button
                type="button"
                onClick={resetFlow}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100"
              >
                다시 진단하기
              </button>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-900">선택 요약</p>
            <p className="mt-1 text-xs text-slate-500">총점 {score}점 기준으로 권고안을 산출했습니다.</p>
            <div className="mt-4 space-y-3">
              {answerSummary.map((answer) => (
                <div key={answer.title} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-500">{answer.title}</p>
                  <p className="mt-1 text-sm text-slate-700">{answer.value}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
