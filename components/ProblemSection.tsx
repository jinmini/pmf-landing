import { PROBLEM } from "@/constants/content";
import SectionContainer from "./SectionContainer";

export default function ProblemSection() {
  return (
    <SectionContainer id="problem">
      <h2 className="section-title">{PROBLEM.title}</h2>
      <p className="section-desc max-w-4xl">{PROBLEM.description}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {PROBLEM.points.map((point) => (
          <article
            key={point}
            className="rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-700 shadow-soft"
          >
            {point}
          </article>
        ))}
      </div>
    </SectionContainer>
  );
}
