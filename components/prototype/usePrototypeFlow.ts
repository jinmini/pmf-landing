"use client";

import { useMemo, useState } from "react";
import type { PrototypeFlow } from "@/constants/prototypeFlows";

export function usePrototypeFlow(flow: PrototypeFlow) {
  const totalSteps = flow.steps.length;
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const isResultStep = stepIndex >= totalSteps;
  const currentStep = flow.steps[Math.min(stepIndex, totalSteps - 1)];
  const selectedOptionIndex = currentStep ? answers[currentStep.id] : undefined;

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
        id: step.id,
        title: step.title,
        value: step.options[selectedIndex].label
      };
    })
    .filter((item): item is { id: string; title: string; value: string } => item !== null);

  const selectOption = (optionIndex: number) => {
    if (!currentStep) {
      return;
    }

    setAnswers((prev) => ({ ...prev, [currentStep.id]: optionIndex }));
  };

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

  return {
    totalSteps,
    stepIndex,
    isResultStep,
    currentStep,
    selectedOptionIndex,
    score,
    result,
    progress,
    answerSummary,
    selectOption,
    moveNext,
    movePrev,
    resetFlow
  };
}
