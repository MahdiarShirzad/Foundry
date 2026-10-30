"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/* --------------------------------------------------------- form controls --- */

const CONTROL =
  "w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none transition-colors focus:border-accent placeholder:text-faint";

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
        {hint ? <span className="tracking-[0.08em] text-faint/80">{hint}</span> : null}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-[11px] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({
  id,
  invalid,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      id={id}
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
      className={`${CONTROL} appearance-none ${invalid ? "border-danger" : ""} ${props.className ?? ""}`}
      {...props}
    >
      {children}
    </select>
  );
}

/* ------------------------------------------------------- segmented control --- */

/** Small label switch used for metric, segment and view choices. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  size = "md",
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  size?: "sm" | "md";
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-wrap items-center border border-line bg-panel p-px"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={`font-mono uppercase tracking-[0.14em] transition-colors ${
              size === "sm" ? "px-2 py-1 text-[9.5px]" : "px-2.5 py-1 text-[10px]"
            } ${active ? "bg-mint-tint text-accent" : "text-faint hover:text-fg"}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------ empty state --- */

export function AnalyticsEmptyState({
  title,
  description,
  action,
  compact = false,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 px-6 text-center ${
        compact ? "py-8" : "py-12"
      }`}
    >
      <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-faint">
        <span aria-hidden className="size-1.5 bg-line-2" />
        No sample data
      </div>
      <h3 className="text-[clamp(1.05rem,2vw,1.3rem)] font-medium tracking-[-0.03em] text-fg">
        {title}
      </h3>
      <p className="max-w-[46ch] text-[12px] leading-relaxed text-muted">{description}</p>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}

/* ----------------------------------------------------------------- dialog --- */

/** Presentational dialog: escape to close, focus trapped, focus restored. */
export function AnalyticsDialog({
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
            aria-labelledby="analytics-dialog-title"
            tabIndex={-1}
            initial={reduce ? false : { opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.995 }}
            transition={{ duration: reduce ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-full w-full flex-col border-line bg-bg shadow-[0_28px_80px_-32px_rgb(14_27_29/0.55)] outline-none sm:h-auto sm:max-h-[92dvh] sm:max-w-[42rem] sm:border"
          >
            <header className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
              <div className="min-w-0">
                {eyebrow ? (
                  <p className="flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
                    <span aria-hidden className="size-1.5 bg-mint" />
                    {eyebrow}
                  </p>
                ) : null}
                <h2
                  id="analytics-dialog-title"
                  className="mt-2 text-[clamp(1.2rem,2vw,1.5rem)] font-medium leading-[1.08] tracking-[-0.03em] text-fg"
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
