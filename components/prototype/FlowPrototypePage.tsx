import Link from "next/link";
import { PROTOTYPE_FLOWS, type PrototypeFlow } from "@/constants/prototypeFlows";
import FlowPrototypeClient from "./FlowPrototypeClient";

type FlowPrototypePageProps = {
  flow: PrototypeFlow;
};

export default function FlowPrototypePage({ flow }: FlowPrototypePageProps) {
  if (flow.slug === "flow-a" || flow.slug === "flow-b") {
    return <FlowPrototypeClient flow={flow} />;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0%,#f8fafc_45%,#f1f5f9_100%)] px-4 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-[2rem] border border-slate-200 bg-white/90 px-4 py-4 shadow-soft backdrop-blur sm:px-6 sm:py-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-brand-700">LynC Prototype</p>
              <p className="mt-1 text-sm text-slate-600">세 가지 제품 흐름을 빠르게 체험해볼 수 있습니다.</p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-400 hover:text-brand-700"
            >
              다른 흐름 보기
            </Link>
          </div>

          <nav className="mt-4 grid gap-2 sm:grid-cols-3">
            {PROTOTYPE_FLOWS.map((item) => {
              const isCurrent = item.slug === flow.slug;
              return (
                <Link
                  key={item.slug}
                  href={item.route}
                  className={`rounded-[1.25rem] px-4 py-3 text-sm font-semibold transition-colors ${isCurrent
                      ? "bg-slate-900 text-white"
                      : "border border-slate-300 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
                    }`}
                >
                  <span className="block text-left">{item.shortLabel}</span>
                  <span className={`mt-1 block text-left text-xs font-medium ${isCurrent ? "text-white/75" : "text-slate-500"}`}>
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </nav>
        </header>

        <div className="mt-5 sm:mt-6">
          <FlowPrototypeClient flow={flow} />
        </div>
      </div>
    </main>
  );
}
