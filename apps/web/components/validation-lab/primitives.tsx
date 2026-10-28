"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const LABEL = "font-mono text-[9px] uppercase tracking-[0.2em] text-faint";
const INPUT =
  "mt-2 w-full border border-line bg-panel px-3 py-2 text-[16px] text-fg outline-none transition-colors placeholder:text-faint/65 hover:border-line-2 focus:border-accent sm:text-[12.5px]";
const TEXTAREA = `${INPUT} resize-none leading-relaxed`;

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className={LABEL}>{label}</span>
        {hint ? <span className="text-[10.5px] text-faint">{hint}</span> : null}
      </div>
      {children}
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
            initial={reduce ? false : { opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.995 }}
            transition={{ duration: reduce ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-full w-full flex-col border-line bg-bg shadow-[0_28px_80px_-32px_rgb(14_27_29/0.55)] sm:h-auto sm:max-h-[92dvh] sm:max-w-[48rem] sm:border"
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

export { Field, INPUT, LABEL, TEXTAREA };
