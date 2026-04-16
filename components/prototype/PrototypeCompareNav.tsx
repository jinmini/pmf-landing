import Link from "next/link";

type PrototypeCompareNavProps = {
  current: "home" | "flow-a" | "flow-b" | "flow-c";
};

const ITEMS = [
  { id: "home", label: "메인", href: "/" },
  { id: "flow-a", label: "A안", href: "/flow-a" },
  { id: "flow-b", label: "B안", href: "/flow-b" },
  { id: "flow-c", label: "C안", href: "/flow-c" }
] as const;

export default function PrototypeCompareNav({ current }: PrototypeCompareNavProps) {
  return (
    <nav className="mx-auto mb-6 flex w-full max-w-md items-center gap-2 rounded-full border border-slate-200 bg-white/90 p-2 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur">
      {ITEMS.map((item) => {
        const active = item.id === current;

        return (
          <Link
            key={item.id}
            href={item.href}
            className={`flex-1 rounded-full px-4 py-2 text-center text-sm font-semibold transition-colors ${
              active ? "bg-[#132750] text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
