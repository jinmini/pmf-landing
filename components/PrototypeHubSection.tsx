import Link from "next/link";
import { PROTOTYPE_FLOWS, PROTOTYPE_HUB } from "@/constants/prototypeFlows";
import SectionContainer from "./SectionContainer";

export default function PrototypeHubSection() {
  return (
    <SectionContainer id="prototype-hub" className="pt-8 md:pt-10">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft md:p-8">
        <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          {PROTOTYPE_HUB.badge}
        </span>
        <h2 className="mt-4 text-2xl font-semibold leading-tight text-slate-900 md:text-3xl">
          {PROTOTYPE_HUB.title}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">{PROTOTYPE_HUB.description}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {PROTOTYPE_FLOWS.map((flow) => (
            <article
              key={flow.slug}
              className="rounded-[1.75rem] border border-slate-200 bg-slate-50/70 p-5 transition-colors hover:border-brand-300 hover:bg-white"
            >
              <p className="text-xs font-semibold tracking-[0.14em] text-slate-400">{flow.shortLabel}</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{flow.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{flow.subtitle}</p>
              <p className="mt-4 text-sm leading-6 text-slate-700">{flow.summary}</p>
              <Link
                href={flow.route}
                className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                시작하기
              </Link>
            </article>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
