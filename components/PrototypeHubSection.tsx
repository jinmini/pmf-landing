import Link from "next/link";
import { PROTOTYPE_FLOWS, PROTOTYPE_HUB } from "@/constants/prototypeFlows";
import SectionContainer from "./SectionContainer";

export default function PrototypeHubSection() {
  return (
    <SectionContainer id="prototype-hub" className="pt-8 md:pt-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft md:p-10">
        <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          {PROTOTYPE_HUB.badge}
        </span>
        <h2 className="mt-4 text-2xl font-semibold leading-tight text-slate-900 md:text-3xl">
          {PROTOTYPE_HUB.title}
        </h2>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600 md:text-base">{PROTOTYPE_HUB.description}</p>
        <p className="mt-4 text-sm font-medium text-slate-700">{PROTOTYPE_HUB.note}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {PROTOTYPE_FLOWS.map((flow) => (
            <article
              key={flow.slug}
              className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 transition-colors hover:border-brand-300"
            >
              <p className="text-xs font-semibold tracking-[0.14em] text-slate-400">{flow.shortLabel}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{flow.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{flow.subtitle}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {flow.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-700">{flow.summary}</p>
              <p className="mt-3 text-xs font-medium text-brand-700">전략 초점: {flow.strategicFocus}</p>
              <Link
                href={flow.route}
                className="mt-5 inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
              >
                {flow.shortLabel} 검토하기
              </Link>
            </article>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
