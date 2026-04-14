import { VISION } from "@/constants/content";
import SectionContainer from "./SectionContainer";

export default function VisionSection() {
  return (
    <SectionContainer id="vision" className="bg-slate-50/80">
      <h2 className="section-title">{VISION.title}</h2>
      <p className="section-desc max-w-4xl">{VISION.description}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {VISION.highlights.map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
          </article>
        ))}
      </div>
    </SectionContainer>
  );
}
