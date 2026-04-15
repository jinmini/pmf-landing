import type { ReactNode } from "react";

type ExperienceShellProps = {
  accentClassName: string;
  progressAccentClassName: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  progress: number;
  progressLabel: string;
  children: ReactNode;
};

export function ExperienceShell({
  accentClassName,
  progressAccentClassName,
  eyebrow,
  title,
  subtitle,
  progress,
  progressLabel,
  children
}: ExperienceShellProps) {
  return (
    <section className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white/95 p-4 shadow-soft backdrop-blur sm:p-6">
      <div className="rounded-[1.75rem] border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${accentClassName}`}>{eyebrow}</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-[2rem]">{title}</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-[15px]">{subtitle}</p>
          </div>
          <div className="rounded-full border border-white bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
            {progressLabel}
          </div>
        </div>
        <div className="mt-4 h-2 rounded-full bg-white">
          <div className={`h-2 rounded-full transition-all ${progressAccentClassName}`} style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="mt-4 sm:mt-5">{children}</div>
    </section>
  );
}

type StepCounterProps = {
  current: number;
  total: number;
  label: string;
};

export function StepCounter({ current, total, label }: StepCounterProps) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">{label}</span>
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
        {current}/{total}
      </span>
    </div>
  );
}

type OptionButtonProps = {
  title: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  accent: "brand" | "emerald" | "amber";
};

const optionAccentClass: Record<OptionButtonProps["accent"], string> = {
  brand: "border-brand-500 bg-brand-50 shadow-[0_0_0_1px_rgba(37,99,235,0.08)]",
  emerald: "border-emerald-500 bg-emerald-50 shadow-[0_0_0_1px_rgba(16,185,129,0.08)]",
  amber: "border-amber-500 bg-amber-50 shadow-[0_0_0_1px_rgba(245,158,11,0.08)]"
};

export function OptionButton({ title, description, selected, onClick, accent }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[1.4rem] border px-4 py-4 text-left transition-all sm:px-5 sm:py-5 ${
        selected
          ? optionAccentClass[accent]
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <p className="text-[15px] font-semibold leading-6 text-slate-900">{title}</p>
      {description ? <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p> : null}
    </button>
  );
}

type ActionBarProps = {
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  secondaryLabel?: string;
  onSecondary?: () => void;
  secondaryDisabled?: boolean;
};

export function ActionBar({
  primaryLabel,
  onPrimary,
  primaryDisabled,
  secondaryLabel,
  onSecondary,
  secondaryDisabled
}: ActionBarProps) {
  return (
    <div className="sticky bottom-3 mt-6 rounded-[1.5rem] border border-slate-200 bg-white/95 p-3 shadow-lg shadow-slate-200/60 backdrop-blur sm:bottom-4">
      <div className="flex flex-col-reverse gap-2 sm:flex-row">
        {secondaryLabel && onSecondary ? (
          <button
            type="button"
            onClick={onSecondary}
            disabled={secondaryDisabled}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto sm:min-w-[120px]"
          >
            {secondaryLabel}
          </button>
        ) : null}
        <button
          type="button"
          onClick={onPrimary}
          disabled={primaryDisabled}
          className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {primaryLabel}
        </button>
      </div>
    </div>
  );
}

type ResultCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  accentClassName: string;
};

export function ResultCard({ eyebrow, title, description, accentClassName }: ResultCardProps) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
      <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${accentClassName}`}>{eyebrow}</p>
      <h3 className="mt-2 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}

type SummaryPillProps = {
  label: string;
  value: string;
};

export function SummaryPill({ label, value }: SummaryPillProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm leading-6 text-slate-700">{value}</p>
    </div>
  );
}
