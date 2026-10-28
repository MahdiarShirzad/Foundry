"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { EASE } from "./auth-frame";

export type AlertTone = "error" | "success" | "info";

const TONE: Record<AlertTone, { label: string; border: string; bg: string; mark: string }> = {
  error: { label: "Error", border: "border-danger", bg: "bg-danger-tint", mark: "bg-danger" },
  success: { label: "Done", border: "border-accent", bg: "bg-mint-tint", mark: "bg-accent" },
  info: { label: "Note", border: "border-line-2", bg: "bg-panel", mark: "bg-line-2" },
};

/**
 * Inline feedback for form-level outcomes. Tone is carried by a label, a mark
 * and a border as well as colour, so it never depends on hue alone.
 */
export function Alert({
  tone,
  children,
}: {
  tone: AlertTone;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const style = TONE[tone];

  return (
    <motion.div
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "assertive" : "polite"}
      initial={reduce ? false : { opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
      transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
      className={`mt-5 border-l-2 ${style.border} ${style.bg} px-3.5 py-3`}
    >
      <p className="flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.24em] text-faint">
        <span aria-hidden className={`size-1.5 ${style.mark}`} />
        {style.label}
      </p>
      <div className="mt-1 text-[13px] leading-relaxed text-fg">{children}</div>
    </motion.div>
  );
}

/** Submit button with an in-button pending state. */
export function SubmitButton({
  pending,
  pendingLabel,
  children,
  disabled,
}: {
  pending: boolean;
  pendingLabel: string;
  children: ReactNode;
  disabled?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending}
      className="group inline-flex h-11 w-full items-center justify-center gap-2.5 bg-mint px-5 text-[14.5px] font-medium text-ink transition duration-200 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:brightness-100"
    >
      {pending ? (
        <>
          <motion.span
            aria-hidden
            className="block size-3.5 border-[1.5px] border-ink/30 border-t-ink"
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
          />
          {pendingLabel}
        </>
      ) : (
        <>
          {children}
          <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">
            →
          </span>
        </>
      )}
    </button>
  );
}
