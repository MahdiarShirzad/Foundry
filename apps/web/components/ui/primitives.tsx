"use client";

import {
  useEffect,
  useId,
  useRef,
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
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 shrink-0 bg-mint" />
      <span>
        Stage {stage} · {label}
      </span>
      {cycle ? (
        <>
          <span aria-hidden className="hidden h-px w-8 bg-line sm:block" />
          <span className="hidden font-mono text-[9.5px] tracking-[0.16em] text-faint sm:inline">
            Eight-stage cycle
          </span>
        </>
      ) : null}
    </p>
  );
}

export function SectionLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-faint",
        className,
      )}
    >
      <span aria-hidden className="size-1 bg-line-2" />
      {children}
    </p>
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
        "flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-faint",
        className,
      )}
    >
      {items.map((item, index) => (
        <span key={index} className="inline-flex items-center gap-2.5">
          {index > 0 ? <span aria-hidden className="size-1 shrink-0 bg-line-2" /> : null}
          <span>{item}</span>
        </span>
      ))}
    </p>
  );
}

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
    <header className="flex flex-col gap-4 border-b border-line pb-5">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 max-w-[70ch]">
          <StageEyebrow stage={stage} label={stageLabel} />
          <h1 className="mt-2.5 text-[clamp(2rem,3.6vw,2.65rem)] font-medium leading-[1] tracking-[-0.04em] text-fg">
            {title}
          </h1>
          <p className="mt-2.5 max-w-[64ch] text-[13.5px] leading-relaxed text-muted">
            {description}
          </p>
          {meta && meta.length > 0 ? <MetaLine items={meta} className="mt-3" /> : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2 xl:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
      {controls ? <div className="flex flex-wrap items-center gap-2">{controls}</div> : null}
    </header>
  );
}

/* ------------------------------------------------------------------ panel --- */

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
    <section className={cn("border border-line bg-panel", className)}>
      {title || action ? (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-4 py-3">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-faint">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <p
                className={cn(
                  "flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-accent",
                  eyebrow ? "mt-1" : "",
                )}
              >
                <span aria-hidden className="size-1 bg-mint" />
                {title}
              </p>
            ) : null}
            {description ? (
              <p className="mt-1.5 max-w-[64ch] text-[11.5px] leading-relaxed text-muted">
                {description}
              </p>
            ) : null}
          </div>
          {action ? <div className="flex flex-wrap items-center gap-2">{action}</div> : null}
        </header>
      ) : null}
      <div className={bodyClassName}>{children}</div>
      {footer ? (
        <footer className="border-t border-line px-4 py-2.5 text-[11px] leading-relaxed text-faint">
          {footer}
        </footer>
      ) : null}
    </section>
  );
}

/* ------------------------------------------------------------- stat strip --- */

export type StatItem = {
  label: string;
  value: ReactNode;
  hint?: string;
  kind?: "number" | "text" | "status";
};

export function StatStrip({
  items,
  columns = "sm:grid-cols-2 lg:grid-cols-4",
  className = "",
}: {
  items: StatItem[];
  columns?: string;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-px bg-line", columns, className)}>
      {items.map((item) => (
        <article key={item.label} className="min-w-0 bg-panel px-4 py-3.5">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.15em] text-faint">
            {item.label}
          </p>
          <div
            className={cn(
              "mt-2 min-w-0 text-fg",
              item.kind === "text"
                ? "text-[13px] font-medium leading-snug tracking-[-0.01em]"
                : "text-[1.55rem] font-medium leading-none tracking-[-0.03em] tabular-nums",
            )}
          >
            {item.value}
          </div>
          {item.hint ? (
            <p className="mt-1.5 text-[11px] leading-snug text-muted">{item.hint}</p>
          ) : null}
        </article>
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
    <nav aria-label={label} className={cn("border border-line bg-panel", className)}>
      {meta || note ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-3.5 py-2">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.15em] text-faint">{meta}</p>
          {note ? (
            <p className="hidden font-mono text-[9px] uppercase tracking-[0.12em] text-faint/80 sm:block">
              {note}
            </p>
          ) : null}
        </div>
      ) : null}
      <div
        role="tablist"
        aria-label={label}
        className="flex [scrollbar-width:none] overflow-x-auto [&::-webkit-scrollbar]:hidden"
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
                "relative flex min-w-[9.5rem] flex-1 shrink-0 items-center gap-2 border-r border-line px-3 py-2.5 text-left transition-colors last:border-r-0",
                active
                  ? "bg-mint-tint/35 text-accent"
                  : "text-faint hover:bg-bg/60 hover:text-fg",
              )}
            >
              {active ? (
                <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] bg-accent" />
              ) : null}
              <span
                aria-hidden
                className={cn(
                  "font-mono text-[9.5px] leading-none tracking-[0.08em]",
                  active ? "text-accent" : "text-line-2",
                )}
              >
                {item.index ?? String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1 whitespace-nowrap text-[12px] font-medium tracking-[-0.005em]">
                {item.label}
              </span>
              {typeof item.count === "number" ? (
                <span
                  className={cn(
                    "shrink-0 border px-1.5 py-0.5 font-mono text-[9.5px] leading-none tracking-[0.06em] tabular-nums",
                    active
                      ? "border-accent/35 bg-panel text-accent"
                      : "border-line text-faint",
                  )}
                >
                  {String(item.count).padStart(2, "0")}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
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
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-9 w-full border border-line bg-panel pl-7 pr-2 text-[16px] text-fg outline-none transition-colors placeholder:text-faint/80 hover:border-line-2 focus:border-accent sm:text-[12.5px] [&::-webkit-search-cancel-button]:hidden"
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
    <div className="flex flex-col gap-2 border-b border-line bg-bg/60 px-3 py-2.5 sm:px-4">
      <SearchField
        value={query}
        onChange={onQueryChange}
        label={searchLabel}
        placeholder={searchPlaceholder}
      />
      {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-faint">
          {String(count).padStart(2, "0")} {countLabel}
        </p>
        {active ? (
          <button
            type="button"
            onClick={onReset}
            className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-accent underline-offset-4 transition-colors hover:underline"
          >
            Reset filters
          </button>
        ) : null}
      </div>
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
        "flex h-9 items-center gap-2 border border-line bg-panel px-2.5 transition-colors focus-within:border-accent",
        className,
      )}
    >
      <span className="shrink-0 font-mono text-[9.5px] uppercase tracking-[0.14em] text-faint">
        {label}
      </span>
      <span aria-hidden className="h-3 w-px shrink-0 bg-line" />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
        className="min-w-0 max-w-[14rem] bg-transparent text-[12px] text-fg outline-none"
      >
        {children}
      </select>
    </label>
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
    <div className="sticky top-14 z-10 flex items-center gap-3 border-b border-line bg-panel/95 px-4 py-2.5 backdrop-blur xl:hidden">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 border border-line px-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-fg transition-colors hover:border-accent hover:text-accent"
      >
        <span aria-hidden>←</span>
        Back
      </button>
      <span className="min-w-0 truncate font-mono text-[9.5px] uppercase tracking-[0.12em] text-faint">
        {context}
      </span>
    </div>
  );
}

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
        "grid gap-2.5 border-t border-line py-5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6",
        className,
      )}
    >
      <div className="pt-0.5">
        <SectionLabel>{label}</SectionLabel>
        {hint ? (
          <p className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.1em] text-faint/80">
            {hint}
          </p>
        ) : null}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------ state views --- */

const EMPTY_GLYPHS: Record<string, ReactNode> = {
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
  calendar: (
    <>
      <rect x="2.5" y="4" width="13" height="11" />
      <path d="M2.5 7.5h13M6 2.5v3M12 2.5v3" strokeLinecap="square" />
    </>
  ),
  check: <path d="m3 9 4 4 8-9" strokeLinecap="square" />,
  flag: (
    <>
      <path d="M4 2.5v13" strokeLinecap="square" />
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
        compact ? "py-8" : "min-h-[20rem] py-12",
        className,
      )}
    >
      <span className="relative flex size-12 items-center justify-center border border-line-2">
        <svg
          width="17"
          height="17"
          viewBox="0 0 18 18"
          aria-hidden
          className="fill-none stroke-accent stroke-[1.2]"
        >
          {EMPTY_GLYPHS[icon]}
        </svg>
        <span aria-hidden className="absolute -right-1 -top-1 size-2 bg-mint" />
      </span>

      {eyebrow ? (
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 max-w-[30ch] text-[18px] font-medium leading-snug tracking-[-0.02em] text-fg">
        {title}
      </h2>
      <p className="mt-2 max-w-[42ch] text-[12.5px] leading-relaxed text-muted">{description}</p>

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
      className={cn("border border-line bg-panel", className)}
    >
      <header className="flex items-center gap-2 border-b border-danger/25 bg-danger-tint/40 px-4 py-2.5">
        <span aria-hidden className="size-1.5 bg-danger" />
        <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-danger">{eyebrow}</p>
      </header>
      <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
        <h2 className="max-w-[34ch] text-[18px] font-medium leading-snug tracking-[-0.02em] text-fg">
          {title}
        </h2>
        <p className="mt-2 max-w-[46ch] text-[12.5px] leading-relaxed text-muted">{description}</p>
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-5">
          {retryLabel}
        </Button>
        {footnote ? (
          <p className="mt-4 max-w-[44ch] border-t border-line pt-3 font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.1em] text-faint">
            {footnote}
          </p>
        ) : null}
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
    <div className="flex min-h-[18rem] flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <span aria-hidden className="font-mono text-[10px] uppercase tracking-[0.18em] text-line-2">
        00 / {noun}
      </span>
      <h2 className="mt-3 max-w-[30ch] text-[17px] font-medium leading-snug tracking-[-0.02em] text-fg">
        {query ? <>Nothing matches “{query}”.</> : <>Nothing matches these filters.</>}
      </h2>
      <p className="mt-2 max-w-[38ch] text-[12.5px] leading-relaxed text-muted">
        {description ?? "Try another term, widen the filters, or return to the full set."}
      </p>
      <Button variant="secondary" size="sm" onClick={onClear} className="mt-5">
        Clear search &amp; filters
      </Button>
    </div>
  );
}

export function StatePreview({
  value,
  options,
  onChange,
  label = "UI state preview",
  note,
}: {
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
  label?: string;
  note?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line pt-3">
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-faint">
        <span aria-hidden className="size-1.5 bg-accent" />
        {note ?? "Frontend UI only · Static sample data · Local state only"}
      </p>
      <div className="ml-auto flex flex-wrap items-center gap-1.5">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-faint">
          {label}
        </span>
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={active}
              className={cn(
                "border px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.1em] transition-colors",
                active
                  ? "border-accent/60 bg-mint-tint/50 text-accent"
                  : "border-line text-faint hover:border-accent/60 hover:text-accent",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ModuleFooter({ children }: { children: ReactNode }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-faint">
      <span aria-hidden className="size-1.5 bg-accent" />
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ forms --- */

const CONTROL =
  "w-full border border-line bg-panel px-3 py-2 text-[16px] text-fg outline-none transition-colors placeholder:text-faint/80 hover:border-line-2 focus:border-accent sm:text-[13px]";

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
      <label
        htmlFor={htmlFor}
        className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint"
      >
        {children}
      </label>
      {hint ? (
        <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-faint/80">
          {hint}
        </span>
      ) : null}
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
        <p id={`${htmlFor}-error`} className="mt-1.5 text-[11.5px] leading-snug text-danger">
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
            className="absolute inset-0 bg-ink/55"
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
              "relative flex h-full w-full flex-col border-line bg-bg shadow-[var(--elevation-overlay)] outline-none sm:h-auto sm:max-h-[92dvh] sm:border",
              maxWidth,
            )}
          >
            <header className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
              <div className="min-w-0">
                {eyebrow ? (
                  <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                    <span aria-hidden className="size-1.5 bg-mint" />
                    {eyebrow}
                  </p>
                ) : null}
                <h2
                  id={titleId}
                  className="mt-2 text-[clamp(1.25rem,2vw,1.6rem)] font-medium leading-[1.08] tracking-[-0.03em] text-fg"
                >
                  {title}
                </h2>
                {description ? (
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted">{description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex size-8 shrink-0 items-center justify-center border border-line text-faint transition-colors hover:border-accent hover:text-accent"
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 12 12"
                  aria-hidden
                  className="fill-none stroke-current stroke-[1.4]"
                >
                  <path d="m2 2 8 8M10 2l-8 8" strokeLinecap="square" />
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
        "fixed bottom-4 left-1/2 z-50 w-[min(92vw,26rem)] -translate-x-1/2 border bg-bg px-4 py-3 text-center shadow-[var(--elevation-toast)] sm:left-auto sm:right-6 sm:w-auto sm:max-w-[26rem] sm:translate-x-0 sm:text-left",
        TOAST_TONE[tone],
      )}
    >
      <p className="flex items-start gap-2 text-[12px] leading-snug text-fg">
        <StatusDot tone={tone} className="mt-1.5" />
        <span className="min-w-0 flex-1">{message}</span>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss"
            className="shrink-0 font-mono text-[11px] leading-none text-faint hover:text-fg"
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
        "flex items-start gap-2 border px-3 py-2 text-[11.5px] leading-relaxed",
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
