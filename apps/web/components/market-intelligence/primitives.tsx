"use client";

import { type ReactNode } from "react";

import { IdeaSelect } from "@/components/idea-lab/idea-select";
import {
  EVIDENCE_META,
  OPPORTUNITY_STATUS_META,
  RESEARCH_STATUS_META,
  type EvidenceType,
  type OpportunityStatus,
  type ResearchStatus,
} from "@/lib/market-intelligence/types";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ------------------------------------------------------------------ badges */

export function EvidenceBadge({
  type,
  className = "",
}: {
  type: EvidenceType;
  className?: string;
}) {
  const meta = EVIDENCE_META[type];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 border px-2 py-[3px] font-mono text-[8px] uppercase leading-none tracking-[0.13em] ${meta.chip} ${className}`}
    >
      <span aria-hidden className={`size-1 ${meta.marker}`} />
      {meta.label}
    </span>
  );
}

export function ResearchStatusBadge({
  status,
  className = "",
}: {
  status: ResearchStatus;
  className?: string;
}) {
  const meta = RESEARCH_STATUS_META[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 font-mono text-[8.5px] uppercase leading-none tracking-[0.13em] ${meta.text} ${className}`}
    >
      <span aria-hidden className={`size-1.5 ${meta.marker}`} />
      {meta.label}
    </span>
  );
}

export function OpportunityStatusBadge({
  status,
  className = "",
}: {
  status: OpportunityStatus;
  className?: string;
}) {
  const meta = OPPORTUNITY_STATUS_META[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 border border-line px-2 py-[3px] font-mono text-[8px] uppercase leading-none tracking-[0.13em] text-fg ${className}`}
    >
      <span aria-hidden className={`size-1 ${meta.marker}`} />
      {meta.label}
    </span>
  );
}

/* ----------------------------------------------------------------- toolbar */

export function SearchField({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}) {
  return (
    <div className="relative w-full min-w-0">
      <label htmlFor={`mi-search-${label}`} className="sr-only">
        {label}
      </label>
      <svg
        width="12"
        height="12"
        viewBox="0 0 14 14"
        aria-hidden
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 fill-none stroke-faint stroke-[1.3]"
      >
        <circle cx="6" cy="6" r="4" />
        <path d="m9 9 3 3" strokeLinecap="square" />
      </svg>
      <input
        id={`mi-search-${label}`}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-8 w-full border border-line bg-panel pl-7 pr-2 text-[16px] text-fg outline-none transition-colors placeholder:text-faint/70 hover:border-line-2 focus:border-accent sm:text-[12px] [&::-webkit-search-cancel-button]:hidden"
      />
    </div>
  );
}

export function WorkspaceToolbar({
  count,
  query,
  onQueryChange,
  searchLabel,
  searchPlaceholder,
  active,
  onReset,
  children,
}: {
  count: number;
  query: string;
  onQueryChange: (value: string) => void;
  searchLabel: string;
  searchPlaceholder: string;
  active: boolean;
  onReset: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-line bg-bg/60 px-3 py-2.5 sm:px-4">
      <SearchField
        value={query}
        onChange={onQueryChange}
        label={searchLabel}
        placeholder={searchPlaceholder}
      />
      {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}

      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-faint">
          {String(count).padStart(2, "0")} shown
        </p>
        {active ? (
          <button
            type="button"
            onClick={onReset}
            className="font-mono text-[8px] uppercase tracking-[0.15em] text-accent underline-offset-4 transition-colors hover:underline"
          >
            Reset filters
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function FilterSelect({
  label,
  value,
  options,
  onChange,
  className = "w-[8.75rem]",
}: {
  label: string;
  value: string;
  options: readonly { value: string; label: string; shortLabel?: string }[];
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <IdeaSelect
      label={label}
      value={value}
      options={options}
      onChange={onChange}
      align="right"
      className={`shrink-0 ${className}`}
    />
  );
}

/* ------------------------------------------------------------------ panels */

export function DetailBackBar({
  context,
  onBack,
}: {
  context: string;
  onBack: () => void;
}) {
  return (
    <div className="sticky top-14 z-10 flex items-center gap-3 border-b border-line bg-panel/95 px-4 py-2.5 backdrop-blur xl:hidden">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex h-7 shrink-0 items-center gap-1.5 border border-line px-2 font-mono text-[8.5px] uppercase tracking-[0.14em] text-fg transition-colors hover:border-accent hover:text-accent"
      >
        <span aria-hidden>←</span>
        Back
      </button>
      <span className="min-w-0 truncate font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
        {context}
      </span>
    </div>
  );
}

export function PanelHeader({
  eyebrow,
  title,
  meta,
  action,
}: {
  eyebrow?: string;
  title: string;
  meta?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line bg-panel px-4 py-2.5">
      <div className="flex min-w-0 items-baseline gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
          {title}
        </span>
        {meta ? (
          <span className="truncate font-mono text-[8px] uppercase tracking-[0.12em] text-faint/75">
            {meta}
          </span>
        ) : null}
      </div>
      {action ?? (
        eyebrow ? (
          <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
            {eyebrow}
          </span>
        ) : null
      )}
    </div>
  );
}

/* ------------------------------------------------------------- empty states */

export function WorkspaceEmpty({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  icon = "plus",
}: {
  eyebrow: string;
  title: string;
  description: string;
  primary?: { label: string; onClick: () => void };
  secondary?: { label: string; onClick: () => void };
  icon?: "plus" | "search" | "note" | "users";
}) {
  const glyphs: Record<string, ReactNode> = {
    plus: <path d="M9 3v12M3 9h12" strokeLinecap="square" />,
    search: (
      <>
        <circle cx="8" cy="8" r="5" />
        <path d="m12 12 3 3" strokeLinecap="square" />
      </>
    ),
    note: (
      <>
        <path d="M4 2.5h7l3 3v10H4z" />
        <path d="M7 9h5M7 12h4" strokeLinecap="square" />
      </>
    ),
    users: (
      <>
        <circle cx="7" cy="7" r="2.5" />
        <path d="M2.5 15c.6-2.6 2.3-4 4.5-4s3.9 1.4 4.5 4" />
        <path d="M11 5.2a2.4 2.4 0 0 1 0 4.6M12.5 11.4c1.6.4 2.7 1.6 3.2 3.6" />
      </>
    ),
  };

  return (
    <div className="flex min-h-[21rem] flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <span className="relative flex size-12 items-center justify-center border border-line-2">
        <svg
          width="17"
          height="17"
          viewBox="0 0 18 18"
          aria-hidden
          className="fill-none stroke-accent stroke-[1.2]"
        >
          {glyphs[icon]}
        </svg>
        <span aria-hidden className="absolute -right-1 -top-1 size-2 bg-mint" />
      </span>

      <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
        {eyebrow}
      </p>
      <h2 className="mt-2 max-w-[26ch] text-[18px] font-medium leading-snug tracking-[-0.02em] text-fg">
        {title}
      </h2>
      <p className="mt-2 max-w-[38ch] text-[12px] leading-relaxed text-muted">
        {description}
      </p>

      {primary || secondary ? (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {primary ? (
            <button
              type="button"
              onClick={primary.onClick}
              className="inline-flex h-9 items-center gap-2 bg-mint px-3.5 text-[12.5px] font-medium text-ink transition duration-200 hover:brightness-95 active:translate-y-px"
            >
              {primary.label}
              <span aria-hidden>→</span>
            </button>
          ) : null}
          {secondary ? (
            <button
              type="button"
              onClick={secondary.onClick}
              className="h-9 border border-line px-3 font-mono text-[9px] uppercase tracking-[0.14em] text-faint transition-colors hover:border-accent hover:text-accent"
            >
              {secondary.label}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function NoResults({
  query,
  onClear,
  noun,
}: {
  query: string;
  onClear: () => void;
  noun: string;
}) {
  return (
    <div className="flex min-h-[21rem] flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <span aria-hidden className="font-mono text-[10px] tracking-[0.2em] text-line-2">
        00 / {noun}
      </span>
      <h2 className="mt-3 max-w-[28ch] text-[17px] font-medium leading-snug tracking-[-0.02em] text-fg">
        {query ? <>Nothing matches “{query}”.</> : <>Nothing matches these filters.</>}
      </h2>
      <p className="mt-2 max-w-[34ch] text-[12px] leading-relaxed text-muted">
        Try another term, widen the filters, or return to the full sample set.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-5 h-9 border border-line-2 px-3.5 font-mono text-[9px] uppercase tracking-[0.15em] text-fg transition-colors hover:border-accent hover:text-accent"
      >
        Clear search &amp; filters
      </button>
    </div>
  );
}

export function DetailPlaceholder({
  eyebrow,
  title,
  description,
  prompts,
}: {
  eyebrow: string;
  title: string;
  description: string;
  prompts: [string, string, string][];
}) {
  return (
    <div className="flex min-h-[24rem] items-center justify-center bg-panel px-6 py-12 sm:px-9">
      <div className="w-full max-w-[32rem]">
        <p className="flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
          <span aria-hidden className="size-1.5 bg-mint" />
          {eyebrow}
        </p>
        <h2 className="mt-3 text-[clamp(1.4rem,2.4vw,1.85rem)] font-medium leading-[1.1] tracking-[-0.03em] text-fg">
          {title}
        </h2>
        <p className="mt-2.5 max-w-[42ch] text-[12.5px] leading-relaxed text-muted">
          {description}
        </p>

        <ol className="mt-6 border-t border-line">
          {prompts.map(([number, label, body]) => (
            <li
              key={number}
              className="grid grid-cols-[1.6rem_minmax(0,1fr)] gap-3 border-b border-line py-3"
            >
              <span className="font-mono text-[9px] tracking-[0.14em] text-accent">
                {number}
              </span>
              <div>
                <p className="text-[11.5px] font-medium text-fg">{label}</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ pieces */

export function SectionLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`font-mono text-[8px] uppercase tracking-[0.18em] text-faint ${className}`}
    >
      {children}
    </p>
  );
}

export function DetailSection({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`grid gap-2.5 border-t border-line py-5 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-6 ${className}`}>
      <SectionLabel className="pt-0.5">{label}</SectionLabel>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export function BulletList({
  items,
  marker = "bg-line-2",
}: {
  items: string[];
  marker?: string;
}) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={`${index}-${item.slice(0, 12)}`}
          className="grid grid-cols-[0.55rem_minmax(0,1fr)] gap-2.5 text-[12px] leading-relaxed text-muted"
        >
          <span aria-hidden className={`mt-[0.5rem] size-1 ${marker}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function QuestionList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-2.5">
      {items.map((item, index) => (
        <li
          key={`${index}-${item.slice(0, 12)}`}
          className="grid grid-cols-[1.35rem_minmax(0,1fr)] gap-2 text-[12px] leading-relaxed text-muted"
        >
          <span className="font-mono text-[8.5px] leading-[1.7] tracking-[0.1em] text-accent">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

export function SampleNotice({ className = "" }: { className?: string }) {
  return (
    <p
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[8px] uppercase tracking-[0.13em] text-faint ${className}`}
    >
      <span aria-hidden className="size-1.5 shrink-0 bg-accent" />
      Sample research · illustrative content only
    </p>
  );
}

export function AddButton({
  label,
  onClick,
  tone = "primary",
  className = "",
}: {
  label: string;
  onClick: () => void;
  tone?: "primary" | "secondary" | "quiet";
  className?: string;
}) {
  if (tone === "primary") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`group inline-flex h-8 items-center gap-2 bg-mint px-3 text-[12px] font-medium text-ink transition duration-200 hover:brightness-95 active:translate-y-px ${className}`}
      >
        <span aria-hidden className="text-[13px] leading-none">+</span>
        {label}
      </button>
    );
  }

  if (tone === "secondary") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex h-8 items-center gap-2 border border-line-2 bg-panel px-3 font-mono text-[8.5px] uppercase tracking-[0.14em] text-fg transition-colors hover:border-accent hover:text-accent ${className}`}
      >
        <span aria-hidden className="text-[11px] leading-none">+</span>
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-7 items-center gap-1.5 border border-line px-2 font-mono text-[8px] uppercase tracking-[0.13em] text-faint transition-colors hover:border-accent hover:text-accent ${className}`}
    >
      <span aria-hidden>+</span>
      {label}
    </button>
  );
}
