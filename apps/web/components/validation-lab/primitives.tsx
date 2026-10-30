"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { IdeaSelect } from "@/components/idea-lab/idea-select";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* --------------------------------------------------------- form controls --- */

const CONTROL =
  "w-full border border-line bg-panel px-3 py-2 text-[16px] text-fg outline-none transition-colors focus:border-accent placeholder:text-faint/75 sm:text-[12.5px]";

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
      <label
        htmlFor={htmlFor}
        className="flex items-baseline justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-faint"
      >
        <span>{label}</span>
        {hint ? <span className="normal-case tracking-[0.08em] text-faint/80">{hint}</span> : null}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-[11px] leading-snug text-danger">
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
      className={`${CONTROL} ${invalid ? "border-danger" : ""} ${props.className ?? ""}`}
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
      className={`${CONTROL} resize-y leading-relaxed ${invalid ? "border-danger" : ""} ${props.className ?? ""}`}
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
      className={`${CONTROL} ${invalid ? "border-danger" : ""} ${props.className ?? ""}`}
      {...props}
    >
      {children}
    </select>
  );
}

/* ---------------------------------------------------------------- toolbar --- */

export function PanelHeader({
  title,
  meta,
  action,
}: {
  title: string;
  meta?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
      <div className="min-w-0">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">{title}</p>
        {meta ? <p className="mt-1 text-[11px] text-muted">{meta}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 border border-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent active:translate-y-px"
    >
      {label}
    </button>
  );
}

function SearchField({
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
      <label htmlFor={`vl-search-${label}`} className="sr-only">
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
        id={`vl-search-${label}`}
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
            Clear filters
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
  className = "w-[calc(50%-0.25rem)] sm:w-[9rem]",
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
    <div className="flex min-h-[18rem] flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <span aria-hidden className="font-mono text-[10px] tracking-[0.2em] text-line-2">
        00 / {noun}
      </span>
      <h3 className="mt-3 max-w-[28ch] text-[17px] font-medium leading-snug tracking-[-0.02em] text-fg">
        {query ? <>Nothing matches “{query}”.</> : <>Nothing matches these filters.</>}
      </h3>
      <p className="mt-2 max-w-[34ch] text-[12px] leading-relaxed text-muted">
        Try another term, widen the filters, or return to the full set.
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

/* ----------------------------------------------------------------- detail --- */

export function DetailBackBar({ context, onBack }: { context: string; onBack: () => void }) {
  return (
    <div className="sticky top-14 z-10 flex items-center gap-3 border-b border-line bg-panel/95 px-4 py-2.5 backdrop-blur lg:hidden">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex h-7 shrink-0 items-center gap-1.5 border border-line px-2 font-mono text-[8.5px] uppercase tracking-[0.14em] text-fg transition-colors hover:border-accent hover:text-accent"
      >
        <span aria-hidden>←</span>
        List
      </button>
      <span className="min-w-0 truncate font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
        {context}
      </span>
    </div>
  );
}

export function DetailSection({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">{label}</p>
        {hint ? (
          <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint/75">
            {hint}
          </span>
        ) : null}
      </div>
      <div className="mt-2">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ dialog --- */

export function PresentationalDialog({
  open,
  onClose,
  title,
  eyebrow,
  description,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    // Move focus inside so keyboard users start within the dialog.
    const raf = window.requestAnimationFrame(() => {
      const node = dialogRef.current;
      if (node && !node.contains(document.activeElement)) node.focus();
    });
    const onKeyDown = (event: KeyboardEvent) => {
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
          <button type="button" onClick={onClose} aria-label="Close dialog" className="absolute inset-0 bg-ink/55" />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="val-dialog-title"
            tabIndex={-1}
            initial={reduce ? false : { opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.995 }}
            transition={{ duration: reduce ? 0 : 0.22, ease: EASE }}
            className="relative flex h-full w-full flex-col border-line bg-bg outline-none shadow-[0_28px_80px_-32px_rgb(14_27_29/0.55)] sm:h-auto sm:max-h-[92dvh] sm:max-w-[48rem] sm:border"
          >
            <header className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
              <div className="min-w-0">
                {eyebrow ? (
                  <p className="flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
                    <span aria-hidden className="size-1.5 bg-mint" />
                    {eyebrow}
                  </p>
                ) : null}
                <h2 id="val-dialog-title" className="mt-2 text-[clamp(1.25rem,2vw,1.6rem)] font-medium leading-[1.08] tracking-[-0.03em] text-fg">
                  {title}
                </h2>
                {description ? <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted">{description}</p> : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex size-8 shrink-0 items-center justify-center border border-line text-faint transition-colors hover:border-accent hover:text-accent"
              >
                <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden className="fill-none stroke-current stroke-[1.4]">
                  <path d="m2 2 8 8M10 2l-8 8" strokeLinecap="square" />
                </svg>
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
            {footer ? <footer className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-line px-5 py-3 sm:px-6">{footer}</footer> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------- confirmation --- */

/** Local confirmation shown after a presentational form is submitted. */
export function ConfirmNotice({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.p
      role="status"
      initial={reduce ? false : { opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.18, ease: EASE }}
      className="flex items-start gap-2.5 border border-mint/70 bg-mint-tint/40 px-3 py-2.5 text-[12px] leading-relaxed text-fg"
    >
      <span aria-hidden className="mt-0.5 size-1.5 shrink-0 bg-mint" />
      <span>{children}</span>
    </motion.p>
  );
}
