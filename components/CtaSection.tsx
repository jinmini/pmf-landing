import { CTA } from "@/constants/content";
import SectionContainer from "./SectionContainer";

export default function CtaSection() {
  return (
    <SectionContainer id="cta">
      <div className="rounded-3xl bg-brand-700 px-7 py-10 text-white md:px-10 md:py-12">
        <h2 className="text-2xl font-semibold leading-tight md:text-3xl">{CTA.title}</h2>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-brand-100 md:text-base">{CTA.description}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-slate-100">
            {CTA.primary}
          </button>
          <button className="rounded-lg border border-brand-100 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600">
            {CTA.secondary}
          </button>
        </div>
      </div>
    </SectionContainer>
  );
}
