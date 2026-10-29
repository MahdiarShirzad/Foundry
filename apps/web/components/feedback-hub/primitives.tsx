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
        {hint ? <span className="normal-case tracking-[0.08em] text-faint/80">{hint}</span> : null}
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
      className={`${CONTROL} appearance-none ${invalid ? "border-danger" : ""} ${props.className ?? ""}`}
      {...props}
    >
      {children}
    </select>
  );
}

/** Small mono caption used above grouped content inside panels. */
export function PanelLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">{children}</p>
  );
}

/** User-submitted content — kept visually distinct from team notes. */
export function UserContentBlock({
  label = "What the user said",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="border border-line bg-bg">
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <span aria-hidden className="size-1.5 bg-mint" />
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">{label}</p>
      </div>
      <div className="px-3 py-3 text-[12.5px] leading-relaxed text-fg">{children}</div>
    </div>
  );
}

/** Internal team note — never presented as customer content. */
export function InternalNoteBlock({
  label = "Internal note · team only",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="border border-dashed border-accent/50 bg-mint-tint/30">
      <div className="flex items-center gap-2 border-b border-dashed border-accent/40 px-3 py-2">
        <span aria-hidden className="size-1.5 bg-accent" />
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">{label}</p>
      </div>
      <div className="px-3 py-3 text-[12.5px] leading-relaxed text-muted">{children}</div>
    </div>
  );
}

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
    // Move focus into the dialog so keyboard and screen-reader users start inside it.
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
            aria-labelledby="feedback-dialog-title"
            tabIndex={-1}
            initial={reduce ? false : { opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.995 }}
            transition={{ duration: reduce ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-full w-full flex-col border-line bg-bg shadow-[0_28px_80px_-32px_rgb(14_27_29/0.55)] outline-none sm:h-auto sm:max-h-[92dvh] sm:max-w-[48rem] sm:border"
          >
            <header className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
              <div className="min-w-0">
                {eyebrow ? (
                  <p className="flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
                    <span aria-hidden className="size-1.5 bg-mint" />
                    {eyebrow}
                  </p>
                ) : null}
                <h2 id="feedback-dialog-title" className="mt-2 text-[clamp(1.25rem,2vw,1.6rem)] font-medium leading-[1.08] tracking-[-0.03em] text-fg">
                  {title}
                </h2>
                {description ? <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted">{description}</p> : null}
              </div>
              <button type="button" onClick={onClose} aria-label="Close" className="flex size-8 shrink-0 items-center justify-center border border-line text-faint transition-colors hover:border-accent hover:text-accent">
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
