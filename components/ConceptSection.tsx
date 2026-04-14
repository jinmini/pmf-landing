import { CONCEPT } from "@/constants/content";
import SectionContainer from "./SectionContainer";

export default function ConceptSection() {
  return (
    <SectionContainer id="concept">
      <h2 className="section-title">{CONCEPT.title}</h2>
      <p className="section-desc max-w-4xl">{CONCEPT.description}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {CONCEPT.blocks.map((block) => (
          <article
            key={block.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 transition-transform duration-200 hover:-translate-y-0.5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">{block.title}</p>
            <p className="mt-3 text-sm leading-6 text-slate-700">{block.text}</p>
          </article>
        ))}
      </div>
    </SectionContainer>
  );
}
