import { FOOTER } from "@/constants/content";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm text-slate-500">{FOOTER.text}</p>
      </div>
    </footer>
  );
}
