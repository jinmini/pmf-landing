import { HERO } from "@/constants/content";
import SectionContainer from "./SectionContainer";

export default function HeroSection() {
  return (
    <SectionContainer className="pt-14 md:pt-20">
      <div className="rounded-3xl border border-slate-200 bg-white px-7 py-12 shadow-soft md:px-12 md:py-16">
        <span className="inline-flex rounded-full bg-brand-50 px-4 py-1 text-sm font-semibold text-brand-700">
          {HERO.badge}
        </span>
        <h1 className="mt-6 max-w-4xl text-3xl font-bold leading-tight text-slate-900 md:text-5xl md:leading-tight">
          {HERO.title}
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
          {HERO.description}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href="#cta"
            className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            {HERO.primaryCta}
          </a>
          <a
            href="#vision"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-500 hover:text-brand-700"
          >
            {HERO.secondaryCta}
          </a>
        </div>
      </div>
    </SectionContainer>
  );
}
