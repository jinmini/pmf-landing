"use client";

import { useEffect, useState } from "react";
import { MARKETING_CASES } from "@/constants/content";
import SectionContainer from "./SectionContainer";

type MarketingCaseItem = (typeof MARKETING_CASES.items)[number];

export default function MarketingCasesSection() {
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<MarketingCaseItem | null>(null);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenuFor(null);
        setSelectedCase(null);
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  return (
    <SectionContainer id="marketing-cases">
      <div className="flex flex-col gap-5">
        <h2 className="section-title">{MARKETING_CASES.title}</h2>
        <p className="section-desc max-w-4xl">{MARKETING_CASES.description}</p>
      </div>

      <div className="mt-8 rounded-2xl border border-brand-100 bg-brand-50/70 p-5 md:p-6">
        <p className="text-sm font-semibold text-brand-700 md:text-base">{MARKETING_CASES.insight}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {MARKETING_CASES.lens.map((label) => (
            <span
              key={label}
              className="inline-flex rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-semibold text-brand-700"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MARKETING_CASES.items.map((item) => (
          <article
            key={item.number}
            className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition-colors hover:border-brand-200"
          >
            <button
              type="button"
              aria-label={`${item.title} URL 메뉴 열기`}
              className="absolute right-4 top-4 rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-600 transition-colors hover:border-brand-300 hover:text-brand-700"
              onClick={() => setOpenMenuFor((prev) => (prev === item.number ? null : item.number))}
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            {openMenuFor === item.number ? (
              <div className="absolute right-4 top-14 z-10 w-44 rounded-lg border border-slate-200 bg-white p-2 shadow-soft">
                <button
                  type="button"
                  className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                  onClick={() => {
                    setSelectedCase(item);
                    setOpenMenuFor(null);
                  }}
                >
                  URL 연결 보기
                </button>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 pr-10">
              <p className="text-xs font-semibold tracking-[0.14em] text-slate-400">사례 {item.number}</p>
              <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {item.classification}
              </span>
            </div>

            <h3 className="mt-4 text-base font-semibold leading-6 text-slate-900">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>

            <dl className="mt-5 space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <dt className="min-w-[78px] rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                  데이터 캡처
                </dt>
                <dd className="pt-0.5 text-slate-700">{item.captureTiming}</dd>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <dt className="min-w-[78px] rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                  전략 의도
                </dt>
                <dd className="pt-0.5 text-slate-700">{item.strategicIntent}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      {selectedCase ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-6"
          onClick={() => setSelectedCase(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-soft"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-slate-400">사례 {selectedCase.number}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{selectedCase.title}</h3>
              </div>
              <button
                type="button"
                className="rounded-md border border-slate-200 px-2 py-1 text-sm text-slate-500 hover:bg-slate-50"
                onClick={() => setSelectedCase(null)}
              >
                닫기
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">연결 URL</p>
              <p className="mt-2 break-all text-sm text-slate-700">{selectedCase.referenceUrl}</p>
            </div>

            <div className="mt-5 flex justify-end">
              <a
                href={selectedCase.referenceUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
              >
                URL 페이지 열기
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </SectionContainer>
  );
}
