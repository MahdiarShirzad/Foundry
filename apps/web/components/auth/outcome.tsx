"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

import { EASE } from "./auth-frame";

/**
 * Terminal state for a flow — verified, sent, reset. Same frame as the forms so
 * the transition reads as one screen changing purpose, not a new page.
 */
export function AuthOutcome({
  marker,
  title,
  children,
  primary,
  secondary,
}: {
  marker: string;
  title: string;
  children: ReactNode;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.32, ease: EASE }}
    >
      <div className="flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.26em] text-accent">
        <motion.span
          aria-hidden
          className="size-2 bg-mint"
          initial={reduce ? false : { scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
        />
        {marker}
      </div>

      <h1 className="mt-4 text-[clamp(1.7rem,3.4vw,2.1rem)] font-medium leading-[1.12] tracking-[-0.03em] text-fg">
        {title}
      </h1>

      <div className="mt-3 space-y-3 text-[14px] leading-relaxed text-muted">{children}</div>

      {primary || secondary ? (
        <div className="mt-7 flex flex-col gap-3">
          {primary ? (
            <Link
              href={primary.href}
              className="inline-flex h-11 items-center justify-center gap-2 bg-mint px-5 text-[14.5px] font-medium text-ink transition duration-200 hover:brightness-95"
            >
              {primary.label}
              <span aria-hidden>→</span>
            </Link>
          ) : null}
          {secondary ? (
            <Link
              href={secondary.href}
              className="inline-flex h-11 items-center justify-center border border-line px-5 text-[14px] text-fg transition-colors hover:border-accent hover:text-accent"
            >
              {secondary.label}
            </Link>
          ) : null}
        </div>
      ) : null}
    </motion.div>
  );
}
