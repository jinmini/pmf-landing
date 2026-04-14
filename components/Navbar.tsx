import { NAV } from "@/constants/content";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="text-lg font-semibold tracking-tight text-slate-900">{NAV.brand}</div>
        <nav className="hidden items-center gap-6 md:flex">
          {NAV.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-600"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
