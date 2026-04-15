import Link from "next/link";
import { PROTOTYPE_FLOWS, type PrototypeFlow } from "@/constants/prototypeFlows";
import FlowPrototypeClient from "./FlowPrototypeClient";

type FlowPrototypePageProps = {
  flow: PrototypeFlow;
};

export default function FlowPrototypePage({ flow }: FlowPrototypePageProps) {
  return (
    <main className="min-h-screen px-6 py-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-brand-700">LynC 프로토타입 워크스페이스</p>
              <p className="mt-1 text-sm text-slate-600">
                내부 검토용 UX 플로우 비교: ROI 중심(A/B) vs 문제 이해 중심(C)
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-400 hover:text-brand-700"
            >
              허브로 돌아가기
            </Link>
          </div>

          <nav className="mt-4 flex flex-wrap gap-2">
            {PROTOTYPE_FLOWS.map((item) => {
              const isCurrent = item.slug === flow.slug;
              return (
                <Link
                  key={item.slug}
                  href={item.route}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    isCurrent
                      ? "bg-brand-600 text-white"
                      : "border border-slate-300 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
                  }`}
                >
                  {item.shortLabel} · {item.title}
                </Link>
              );
            })}
          </nav>
        </header>

        <div className="mt-6">
          <FlowPrototypeClient flow={flow} />
        </div>
      </div>
    </main>
  );
}
