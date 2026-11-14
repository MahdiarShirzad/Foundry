"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Button, PlusIcon } from "./button";
import { cn } from "./cn";
import { StatusDot } from "./badge";
import type { Tone } from "./status";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* --------------------------------------------------------------- headings --- */

/**
 * Stage progress: the one tracked-uppercase moment a page is allowed.
 * "Stage 2 of 8" plus eight segments, current and past filled.
 */
export function StageProgress({
  stage,
  label,
  className = "",
}: {
  stage: string;
  label: string;
  className?: string;
}) {
  const current = Number.parseInt(stage, 10);
  const safe = Number.isFinite(current) ? Math.min(Math.max(current, 1), 8) : 1;

  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", className)}>
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
        Stage {String(safe).padStart(2, "0")} of 08
        <span className="ml-2 font-sans text-[12.5px] font-medium normal-case tracking-normal text-muted">
          {label}
        </span>
      </p>
      <span aria-hidden className="flex items-center gap-1">
        {Array.from({ length: 8 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "h-1 rounded-pill transition-colors",
              index + 1 < safe
                ? "w-3 bg-accent/45"
                : index + 1 === safe
                  ? "w-6 bg-accent"
                  : "w-3 bg-line",
            )}
          />
        ))}
      </span>
    </div>
  );
}

/** Back-compat eyebrow used by call sites that need the stage tag alone. */
export function StageEyebrow({
  stage,
  label,
  cycle = true,
  className = "",
}: {
  stage: string;
  label: string;
  cycle?: boolean;
  className?: string;
}) {
  // `cycle` is kept for call-site compatibility; stage progress replaces the
  // old "eight-stage cycle" caption so pages carry one tracked label only.
  void cycle;
  return <StageProgress stage={stage} label={label} className={className} />;
}

export function SectionLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-[12.5px] font-medium text-muted", className)}>{children}</p>
  );
}

export function MetaLine({
  items,
  className = "",
}: {
  items: Array<string | ReactNode>;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[13px] leading-relaxed text-muted",
        className,
      )}
    >
      {items.map((item, index) => (
        <span key={index} className="inline-flex min-w-0 items-center gap-3.5">
          {index > 0 ? (
            <span aria-hidden className="size-1 shrink-0 rounded-full bg-line-2" />
          ) : null}
          <span className="min-w-0">{item}</span>
        </span>
      ))}
    </p>
  );
}

/**
 * Compact page header. Left: stage progress, title, one-line description and a
 * quiet summary line. Right: secondary actions then a single primary action.
 * Workspace controls sit on a slim toolbar underneath — never in a hero card.
 */
export function ModuleHeader({
  stage,
  stageLabel,
  title,
  description,
  meta,
  actions,
  controls,
}: {
  stage: string;
  stageLabel: string;
  title: string;
  description: string;
  meta?: Array<string | ReactNode>;
  actions?: ReactNode;
  controls?: ReactNode;
}) {
  return (
    <header className="relative isolate">
      <span
        aria-hidden
        className="blueprint pointer-events-none absolute -inset-x-4 -top-5 -z-10 h-40 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_85%)] sm:-inset-x-6"
      />
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between xl:gap-10">
        <div className="min-w-0 max-w-[74ch]">
          <StageProgress stage={stage} label={stageLabel} />
          <h1 className="mt-3 text-[clamp(1.75rem,2.6vw,2rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-fg">
            {title}
          </h1>
          <p className="mt-2.5 max-w-[68ch] text-[14px] leading-relaxed text-muted">
            {description}
          </p>
          {meta && meta.length > 0 ? <MetaLine items={meta} className="mt-3.5" /> : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2 xl:pt-1">{actions}</div>
        ) : null}
      </div>
      {controls ? (
        <div className="mt-6 flex flex-wrap items-center gap-2 border-y border-line py-2.5">
          {controls}
        </div>
      ) : null}
    </header>
  );
}

/** Presentational alias used by redesigned pages. */
export const PageHeader = ModuleHeader;

/* ------------------------------------------------------------------ panel --- */

/**
 * SectionCard: one container level. Outer hairline + soft shadow, no nested
 * boxes. Header padding 20–24px, body padding to match.
 */
export function Panel({
  title,
  eyebrow,
  description,
  action,
  footer,
  children,
  className = "",
  bodyClassName = "",
}: {
  title?: string;
  eyebrow?: string;
  description?: string;
  action?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        "flex min-w-0 flex-col rounded-card border border-line bg-panel shadow-card",
        className,
      )}
    >
      {title || action || eyebrow ? (
        <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 px-5 pb-3 pt-5 sm:px-6">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="text-[12px] font-medium text-muted">{eyebrow}</p>
            ) : null}
            {title ? (
              <h2
                className={cn(
                  "text-[16px] font-semibold leading-snug tracking-[-0.015em] text-fg",
                  eyebrow ? "mt-1" : "",
                )}
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-1 max-w-[70ch] text-[13px] leading-relaxed text-muted">
                {description}
              </p>
            ) : null}
          </div>
          {action ? <div className="flex flex-wrap items-center gap-2">{action}</div> : null}
        </header>
      ) : null}
      <div className={cn("min-w-0 flex-1", bodyClassName || "px-5 pb-5 pt-2 sm:px-6 sm:pb-6")}>
        {children}
      </div>
      {footer ? (
        <footer className="border-t border-line/70 px-5 py-3 text-[12.5px] leading-relaxed text-muted sm:px-6">
          {footer}
        </footer>
      ) : null}
    </section>
  );
}

export const SectionCard = Panel;

/* ---------------------------------------------------------------- kpi --- */

export type StatItem = {
  label: string;
  value: ReactNode;
  hint?: string;
  kind?: "number" | "text" | "status";
};

export function StatCard({
  label,
  value,
  hint,
  kind = "number",
  className = "",
}: StatItem & { className?: string }) {
  return (
    <article
      className={cn(
        "min-w-0 rounded-card border border-line bg-panel px-5 py-4 shadow-card transition-colors duration-150 ease-out hover:border-line-2",
        className,
      )}
    >
      <p className="text-[13px] font-medium text-muted">{label}</p>
      <div
        className={cn(
          "mt-2 min-w-0 text-fg",
          kind === "text"
            ? "text-[15px] font-medium leading-snug tracking-[-0.01em]"
            : "font-sans text-[2rem] font-semibold leading-none tracking-[-0.035em] tabular-nums",
        )}
      >
        {value}
      </div>
      {hint ? <p className="mt-2 text-[12.5px] leading-snug text-faint">{hint}</p> : null}
    </article>
  );
}

export function StatStrip({
  items,
  columns = "sm:grid-cols-2 xl:grid-cols-4",
  className = "",
}: {
  items: StatItem[];
  columns?: string;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-3", columns, className)}>
      {items.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ tabs --- */

export type WorkspaceTab = {
  value: string;
  label: string;
  count?: number;
  index?: string;
};

/**
 * Underline tabs. 14px labels, mint/teal active indicator, count only when
 * there is something to count. Scrolls horizontally on narrow screens.
 */
export function WorkspaceTabs({
  label,
  items,
  value,
  onChange,
  meta,
  note,
  idPrefix,
  className = "",
}: {
  label: string;
  items: readonly WorkspaceTab[];
  value: string;
  onChange: (value: string) => void;
  meta?: string;
  note?: string;
  idPrefix?: string;
  className?: string;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = items.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = index >= last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = index <= 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    onChange(items[next].value);
    refs.current[next]?.focus();
  }

  return (
    <div className={cn("border-b border-line", className)}>
      {meta || note ? (
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
          {meta ? <p className="text-[12px] text-muted">{meta}</p> : <span />}
          {note ? <p className="text-[12px] text-faint">{note}</p> : null}
        </div>
      ) : null}
      <div
        role="tablist"
        aria-label={label}
        className="flex [scrollbar-width:none] gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => {
          const active = item.value === value;
          return (
            <button
              key={item.value}
              ref={(node) => {
                refs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={idPrefix ? `${idPrefix}-tab-${item.value}` : undefined}
              aria-selected={active}
              aria-controls={idPrefix ? `${idPrefix}-panel-${item.value}` : undefined}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(item.value)}
              onKeyDown={(event) => move(event, index)}
              className={cn(
                "group relative -mb-px flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 pb-2.5 pt-2 text-[14px] font-medium transition-colors duration-150",
                active
                  ? "border-accent text-fg"
                  : "border-transparent text-muted hover:border-line-2 hover:text-fg",
              )}
            >
              {item.label}
              {typeof item.count === "number" && item.count > 0 ? (
                <span
                  className={cn(
                    "rounded-pill px-1.5 py-0.5 text-[11px] font-medium leading-none tabular-nums transition-colors",
                    active
                      ? "bg-mint-tint text-accent"
                      : "bg-surface-sunken/70 text-faint group-hover:text-muted",
                  )}
                >
                  {item.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- controls --- */

export function SearchField({
  value,
  onChange,
  placeholder,
  label,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={cn("relative w-full min-w-0", className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 fill-none stroke-faint stroke-[1.4]"
      >
        <circle cx="6" cy="6" r="4" />
        <path d="m9 9 3 3" strokeLinecap="round" />
      </svg>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-control border border-line bg-panel pl-9 pr-3 text-[16px] text-fg outline-none transition-all duration-150 placeholder:text-faint hover:border-line-2 focus:border-accent focus:ring-4 focus:ring-accent/10 sm:text-[13.5px] [&::-webkit-search-cancel-button]:hidden"
      />
    </div>
  );
}

/** Toolbar: search on the left, filters/sort on the right, quiet result count. */
export function WorkspaceToolbar({
  count,
  query,
  onQueryChange,
  searchLabel,
  searchPlaceholder,
  active,
  onReset,
  children,
  countLabel = "shown",
}: {
  count: number;
  query: string;
  onQueryChange: (value: string) => void;
  searchLabel: string;
  searchPlaceholder: string;
  active: boolean;
  onReset: () => void;
  children?: ReactNode;
  countLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-2.5 border-b border-line bg-surface-sunken/25 px-4 py-3">
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
        <SearchField
          value={query}
          onChange={onQueryChange}
          label={searchLabel}
          placeholder={searchPlaceholder}
          className="lg:max-w-[20rem]"
        />
        {children ? (
          <div className="flex flex-wrap items-center gap-2 lg:ml-auto">{children}</div>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[12px] text-faint">
          {count} {countLabel}
        </p>
        {active ? (
          <button
            type="button"
            onClick={onReset}
            className="rounded-control text-[12px] font-medium text-accent underline-offset-4 transition-colors hover:underline"
          >
            Reset filters
          </button>
        ) : null}
      </div>
    </div>
  );
}

/** Segmented control — used for view/state filters that are not page tabs. */
export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  label,
  className = "",
}: {
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-control border border-line bg-surface-sunken/40 p-0.5",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={cn(
              "rounded-[6px] px-2.5 py-1 text-[12px] font-medium transition-colors duration-150",
              active ? "bg-panel text-fg shadow-[var(--elevation-lift)]" : "text-muted hover:text-fg",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function HeaderSelect({
  label,
  value,
  onChange,
  children,
  ariaLabel,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "flex h-9 items-center gap-2 rounded-control border border-line bg-panel px-2.5 transition-all duration-150 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10",
        className,
      )}
    >
      <span className="shrink-0 text-[12px] font-medium text-faint">{label}</span>
      <span aria-hidden className="h-4 w-px shrink-0 bg-line" />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
        className="min-w-0 max-w-[16rem] bg-transparent text-[13px] font-medium text-fg outline-none"
      >
        {children}
      </select>
    </label>
  );
}

/* ------------------------------------------------------------ layout --- */

/** List + detail split pane. Stacked below md, side by side above it. */
export function SplitPane({
  list,
  detail,
  className = "",
}: {
  list: ReactNode;
  detail: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid overflow-hidden rounded-card border border-line bg-line shadow-card md:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] md:gap-px lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,25rem)_minmax(0,1fr)]",
        className,
      )}
    >
      {list}
      {detail}
    </div>
  );
}

export type StepperState = "done" | "active" | "upcoming";

/** Horizontal stepper with done / active / upcoming states. */
export function Stepper({
  items,
  className = "",
  label = "Workflow",
}: {
  items: readonly { label: string; detail?: string; state: StepperState }[];
  className?: string;
  label?: string;
}) {
  return (
    <ol aria-label={label} className={cn("grid gap-2 sm:grid-cols-2 lg:flex lg:items-stretch lg:gap-0", className)}>
      {items.map((item, index) => (
        <li key={item.label} className="flex min-w-0 flex-1 items-start gap-3 lg:flex-col lg:gap-2">
          <div className="flex items-center gap-2 lg:w-full">
            <span
              aria-hidden
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold tabular-nums",
                item.state === "done"
                  ? "border-accent bg-accent text-white"
                  : item.state === "active"
                    ? "border-mint bg-mint-tint text-accent ring-4 ring-mint-tint/60"
                    : "border-line bg-panel text-faint",
              )}
            >
              {item.state === "done" ? (
                <svg width="11" height="11" viewBox="0 0 16 16" aria-hidden className="fill-none stroke-current stroke-[2]">
                  <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                index + 1
              )}
            </span>
            <span
              aria-hidden
              className={cn(
                "hidden h-px flex-1 lg:block",
                item.state === "done" ? "bg-accent/45" : "bg-line",
              )}
            />
          </div>
          <div className="min-w-0 lg:pb-1 lg:pr-3">
            <p
              className={cn(
                "text-[13px] font-medium leading-snug",
                item.state === "upcoming" ? "text-muted" : "text-fg",
              )}
            >
              {item.label}
            </p>
            {item.detail ? (
              <p className="mt-0.5 text-[12px] leading-snug text-faint">{item.detail}</p>
            ) : null}
            <span className="sr-only">
              {item.state === "done" ? " — complete" : item.state === "active" ? " — current step" : " — upcoming"}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Layout-matched loading block. */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("block animate-pulse rounded-control bg-line/70", className)}
    />
  );
}

/* ------------------------------------------------------------ detail chrome --- */

export function DetailBackBar({
  context,
  onBack,
}: {
  context: string;
  onBack: () => void;
}) {
  return (
    <div className="sticky top-16 z-10 flex items-center gap-3 border-b border-line bg-panel/95 px-4 py-2.5 backdrop-blur xl:hidden">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-control border border-line px-2.5 text-[12.5px] font-medium text-fg transition-colors hover:border-accent hover:text-accent"
      >
        <span aria-hidden>←</span>
        Back
      </button>
      <span className="min-w-0 truncate text-[12.5px] text-faint">{context}</span>
    </div>
  );
}

/** Stacked detail section: 16px heading, then the content. Not a label/value row. */
export function DetailSection({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "border-t border-line py-6 first:border-t-0 first:pt-0 last:pb-0",
        className,
      )}
    >
      <h3 className="text-[16px] font-semibold leading-snug tracking-[-0.01em] text-fg">
        {label}
      </h3>
      {hint ? <p className="mt-1 text-[13px] leading-relaxed text-muted">{hint}</p> : null}
      <div className="mt-3 min-w-0 text-[14px] leading-relaxed text-muted">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------ state views --- */

const EMPTY_GLYPHS: Record<string, ReactNode> = {
  plus: <path d="M9 3v12M3 9h12" strokeLinecap="round" />,
  search: (
    <>
      <circle cx="8" cy="8" r="5" />
      <path d="m12 12 3 3" strokeLinecap="round" />
    </>
  ),
  note: (
    <>
      <path d="M4 2.5h7l3 3v10H4z" />
      <path d="M7 9h5M7 12h4" strokeLinecap="round" />
    </>
  ),
  users: (
    <>
      <circle cx="7" cy="7" r="2.5" />
      <path d="M2.5 15c.6-2.6 2.3-4 4.5-4s3.9 1.4 4.5 4" />
      <path d="M11 5.2a2.4 2.4 0 0 1 0 4.6M12.5 11.4c1.6.4 2.7 1.6 3.2 3.6" />
    </>
  ),
  calendar: (
    <>
      <rect x="2.5" y="4" width="13" height="11" />
      <path d="M2.5 7.5h13M6 2.5v3M12 2.5v3" strokeLinecap="round" />
    </>
  ),
  check: <path d="m3 9 4 4 8-9" strokeLinecap="round" />,
  flag: (
    <>
      <path d="M4 2.5v13" strokeLinecap="round" />
      <path d="M4 3.5h9l-2 3.5 2 3.5H4" />
    </>
  ),
};

export function EmptyState({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  action,
  icon = "plus",
  compact = false,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  description: string;
  primary?: { label: string; onClick: () => void };
  secondary?: { label: string; onClick: () => void };
  action?: ReactNode;
  icon?: keyof typeof EMPTY_GLYPHS;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center px-6 text-center",
        compact ? "py-10" : "min-h-[18rem] py-14",
        className,
      )}
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-mint-tint/70">
        <svg
          width="20"
          height="20"
          viewBox="0 0 18 18"
          aria-hidden
          className="fill-none stroke-accent stroke-[1.4]"
        >
          {EMPTY_GLYPHS[icon]}
        </svg>
      </span>

      {eyebrow ? (
        <p className="mt-5 text-[12px] font-medium text-muted">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 max-w-[32ch] text-[18px] font-semibold leading-snug tracking-[-0.02em] text-fg">
        {title}
      </h2>
      <p className="mt-1.5 max-w-[46ch] text-[13.5px] leading-relaxed text-muted">
        {description}
      </p>

      {primary || secondary ? (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {primary ? (
            <Button variant="primary" size="sm" onClick={primary.onClick}>
              {primary.label}
              <span aria-hidden>→</span>
            </Button>
          ) : null}
          {secondary ? (
            <Button variant="secondary" size="sm" onClick={secondary.onClick}>
              {secondary.label}
            </Button>
          ) : null}
        </div>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title,
  description,
  onRetry,
  retryLabel = "Try again",
  eyebrow = "Workspace unavailable",
  footnote,
  className = "",
}: {
  title: string;
  description: string;
  onRetry: () => void;
  retryLabel?: string;
  eyebrow?: string;
  footnote?: string;
  className?: string;
}) {
  return (
    <section
      role="alert"
      className={cn(
        "rounded-card border border-danger/30 bg-danger-tint/40 px-5 py-5 sm:px-6",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[12.5px] font-medium text-danger">
            <StatusDot tone="danger" />
            {eyebrow}
          </p>
          <h2 className="mt-1.5 text-[16px] font-semibold leading-snug tracking-[-0.015em] text-fg">
            {title}
          </h2>
          <p className="mt-1 max-w-[60ch] text-[13px] leading-relaxed text-muted">{description}</p>
          {footnote ? (
            <p className="mt-2 max-w-[56ch] text-[12px] leading-relaxed text-faint">{footnote}</p>
          ) : null}
        </div>
        <Button variant="secondary" size="sm" onClick={onRetry} className="self-start">
          {retryLabel}
        </Button>
      </div>
    </section>
  );
}

export function NoResults({
  query,
  noun,
  onClear,
  description,
}: {
  query: string;
  noun: string;
  onClear: () => void;
  description?: string;
}) {
  return (
    <div className="flex min-h-[16rem] flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-mint-tint/60">
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          aria-hidden
          className="fill-none stroke-accent stroke-[1.4]"
        >
          {EMPTY_GLYPHS.search}
        </svg>
      </span>
      <h2 className="mt-4 max-w-[30ch] text-[16px] font-semibold leading-snug tracking-[-0.015em] text-fg">
        {query ? <>Nothing matches “{query}”.</> : <>Nothing matches these filters.</>}
      </h2>
      <p className="mt-1.5 max-w-[40ch] text-[13px] leading-relaxed text-muted">
        {description ?? `Try another term, widen the filters, or return to all ${noun}.`}
      </p>
      <Button variant="secondary" size="sm" onClick={onClear} className="mt-4">
        Clear search &amp; filters
      </Button>
    </div>
  );
}

/**
 * Prototype/dev state switcher. Kept functional, restyled as a quiet inline
 * control so it can live inside the Dev tools popover.
 */
export function StatePreview<T extends string = string>({
  value,
  options,
  onChange,
  label = "UI state preview",
  note,
}: {
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
  label?: string;
  note?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <p className="text-[12px] text-muted">{note ?? "Local state only · changes are not persisted"}</p>
      <div className="ml-auto flex flex-wrap items-center gap-1.5">
        <span className="text-[12px] text-faint">{label}</span>
        <SegmentedControl
          label={label}
          value={value}
          onChange={onChange}
          options={options}
        />
      </div>
    </div>
  );
}

/** Small dev-tools popover pinned inside the toolbar or page corner. */
export function DevToolsPopover({
  label = "Dev tools",
  children,
  className = "",
}: {
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-control border border-line bg-panel px-2.5 text-[12px] font-medium text-muted transition-colors hover:border-accent/60 hover:text-accent",
          open ? "border-accent/60 text-accent" : "",
        )}
      >
        <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden className="fill-none stroke-current stroke-[1.4]">
          <path d="M6.5 2.5h3l.4 1.6 1.5.9 1.6-.5 1.5 2.6-1.2 1.2v1.7l1.2 1.2-1.5 2.6-1.6-.5-1.5.9-.4 1.6h-3l-.4-1.6-1.5-.9-1.6.5L2 10.5l1.2-1.2V7.6L2 6.4l1.5-2.6 1.6.5 1.5-.9z" />
          <circle cx="8" cy="8" r="1.8" />
        </svg>
        {label}
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            role="dialog"
            aria-label={label}
            initial={reduce ? false : { opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: reduce ? 0 : 0.16, ease: EASE }}
            className="absolute right-0 top-11 z-40 w-[min(92vw,22rem)] rounded-card border border-line bg-panel p-4 shadow-[var(--elevation-popover)]"
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function ModuleFooter({ children }: { children: ReactNode }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] leading-relaxed text-faint">
      <span aria-hidden className="size-1.5 rounded-full bg-accent/60" />
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ forms --- */

const CONTROL =
  "w-full rounded-control border border-line bg-panel px-3 py-2.5 text-[16px] text-fg outline-none transition-all duration-150 placeholder:text-faint hover:border-line-2 focus:border-accent focus:ring-4 focus:ring-accent/10 sm:text-[13.5px]";

export function FieldLabel({
  htmlFor,
  children,
  hint,
}: {
  htmlFor?: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <span className="flex flex-wrap items-baseline justify-between gap-2">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-fg">
        {children}
      </label>
      {hint ? <span className="text-[12px] text-faint">{hint}</span> : null}
    </span>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <FieldLabel htmlFor={htmlFor} hint={hint}>
        {label}
      </FieldLabel>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-[12px] leading-snug text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({
  id,
  invalid,
  ref,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}) {
  return (
    <input
      id={id}
      ref={ref}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid && id ? `${id}-error` : undefined}
      className={cn(CONTROL, invalid ? "border-danger bg-danger-tint/20" : "", props.className)}
      {...props}
    />
  );
}

export function TextArea({
  id,
  invalid,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid && id ? `${id}-error` : undefined}
      className={cn(
        CONTROL,
        "resize-y leading-relaxed",
        invalid ? "border-danger bg-danger-tint/20" : "",
        props.className,
      )}
      {...props}
    />
  );
}

export function Select({
  id,
  invalid,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <select
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid && id ? `${id}-error` : undefined}
      className={cn(CONTROL, invalid ? "border-danger bg-danger-tint/20" : "", props.className)}
      {...props}
    >
      {children}
    </select>
  );
}

/* ----------------------------------------------------------------- dialog --- */

export function Dialog({
  open,
  onClose,
  title,
  eyebrow,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const raf = window.requestAnimationFrame(() => {
      const node = dialogRef.current;
      if (node && !node.contains(document.activeElement)) node.focus();
    });
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!nodes?.length) return;
      const focusable = Array.from(nodes).filter((node) => node.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(raf);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, [onClose, open]);

  const maxWidth =
    size === "sm" ? "sm:max-w-[32rem]" : size === "lg" ? "sm:max-w-[56rem]" : "sm:max-w-[48rem]";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.16 }}
          className="fixed inset-0 z-50 flex items-stretch justify-center p-0 sm:items-center sm:p-4"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={reduce ? false : { opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.995 }}
            transition={{ duration: reduce ? 0 : 0.22, ease: EASE }}
            className={cn(
              "relative flex h-full w-full flex-col bg-bg shadow-[var(--elevation-overlay)] outline-none sm:h-auto sm:max-h-[90dvh] sm:rounded-card sm:border sm:border-line",
              maxWidth,
            )}
          >
            <header className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
              <div className="min-w-0">
                {eyebrow ? (
                  <p className="text-[12px] font-medium text-accent">{eyebrow}</p>
                ) : null}
                <h2
                  id={titleId}
                  className="mt-1 text-[20px] font-semibold leading-tight tracking-[-0.025em] text-fg"
                >
                  {title}
                </h2>
                {description ? (
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex size-8 shrink-0 items-center justify-center rounded-control text-faint transition-colors hover:bg-surface-sunken/60 hover:text-fg"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 12 12"
                  aria-hidden
                  className="fill-none stroke-current stroke-[1.5]"
                >
                  <path d="m2 2 8 8M10 2l-8 8" strokeLinecap="round" />
                </svg>
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
            {footer ? (
              <footer className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-line px-5 py-3 sm:px-6">
                {footer}
              </footer>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ toast --- */

const TOAST_TONE: Record<Tone, string> = {
  neutral: "border-line-2",
  muted: "border-line",
  info: "border-info/50",
  accent: "border-accent/50",
  success: "border-success/50",
  warning: "border-warning/50",
  danger: "border-danger/50",
};

export function Toast({
  message,
  tone = "success",
  onClose,
}: {
  message: string;
  tone?: Tone;
  onClose?: () => void;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-4 left-1/2 z-50 w-[min(92vw,26rem)] -translate-x-1/2 rounded-card border bg-panel px-4 py-3 shadow-[var(--elevation-toast)] sm:left-auto sm:right-6 sm:w-auto sm:max-w-[26rem] sm:translate-x-0",
        TOAST_TONE[tone],
      )}
    >
      <p className="flex items-start gap-2 text-[13px] leading-snug text-fg">
        <StatusDot tone={tone} className="mt-1.5" />
        <span className="min-w-0 flex-1">{message}</span>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss"
            className="shrink-0 text-[14px] leading-none text-faint hover:text-fg"
          >
            ×
          </button>
        ) : null}
      </p>
    </div>
  );
}

/** Inline success / notice band used inside panels. */
export function InlineNotice({
  tone = "info",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 rounded-control border px-3 py-2 text-[12.5px] leading-relaxed",
        TOAST_TONE[tone],
        tone === "danger"
          ? "bg-danger-tint/40 text-danger"
          : tone === "warning"
            ? "bg-warning-tint/40 text-warning"
            : tone === "success"
              ? "bg-success-tint/40 text-success"
              : "bg-info-tint/40 text-info",
      )}
    >
      <StatusDot tone={tone} className="mt-1.5" />
      <span className="min-w-0">{children}</span>
    </p>
  );
}

/** Empty-state action button with the shared plus glyph. */
export function AddAction({
  label,
  onClick,
  variant = "primary",
}: {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}) {
  return (
    <Button variant={variant} size="sm" onClick={onClick}>
      <PlusIcon />
      {label}
    </Button>
  );
}

export function useToastTimer(active: boolean, clear: () => void, delay = 3200) {
  useEffect(() => {
    if (!active) return;
    const timer = window.setTimeout(clear, delay);
    return () => window.clearTimeout(timer);
  }, [active, clear, delay]);
}
