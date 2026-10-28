"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

import { isAuthConfigured } from "@/lib/auth/client";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Page-level entrance. Short, one axis, cancelled under reduced motion. */
export function AuthEnter({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.38, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Mono step marker + title + supporting line, shared by every auth screen. */
export function AuthHeading({
  marker,
  title,
  description,
}: {
  marker: string;
  title: string;
  description: ReactNode;
}) {
  return (
    <header>
      <p className="flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.26em] text-accent">
        <span aria-hidden className="size-1.5 shrink-0 bg-mint" />
        {marker}
      </p>
      <h1 className="mt-4 text-[clamp(1.7rem,3.4vw,2.1rem)] font-medium leading-[1.12] tracking-[-0.03em] text-fg">
        {title}
      </h1>
      <p className="mt-3 text-[14px] leading-relaxed text-muted">{description}</p>
    </header>
  );
}

/** Footer row for the secondary path (switch form, go back, legal). */
export function AuthFoot({ children }: { children: ReactNode }) {
  return (
    <div className="mt-9 flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-line pt-5 text-[13px] text-muted">
      {children}
    </div>
  );
}

export function AuthLink({
  href,
  children,
  emphasis = false,
}: {
  href: string;
  children: ReactNode;
  emphasis?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`underline decoration-line underline-offset-4 transition-colors hover:decoration-accent ${
        emphasis ? "text-accent" : "text-muted hover:text-fg"
      }`}
    >
      {children}
    </Link>
  );
}

/**
 * Truthful status line. With no API configured the forms validate locally and
 * submit to nothing — saying so is better than implying a working account.
 */
export function AuthServiceNotice() {
  if (isAuthConfigured) return null;
  return (
    <p className="mt-8 flex items-start gap-2.5 border-t border-line pt-4 font-mono text-[10.5px] leading-relaxed tracking-[0.06em] text-faint">
      <span aria-hidden className="mt-[3px] size-1.5 shrink-0 bg-accent/60" />
      <span>
        Preview build — the auth API isn&apos;t connected, so nothing is sent or stored.{" "}
        <Link href="/docs/backend-api" className="underline decoration-line underline-offset-4 hover:text-accent">
          API status
        </Link>
      </span>
    </p>
  );
}
