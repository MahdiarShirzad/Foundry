"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { motion, useReducedMotion } from "motion/react";

import { STAGES } from "./data";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Where the bus breaks — after stage 05, mid-cycle, so the fault reads as a
 *  gap in a working system rather than a missing tail. */
const BREAK_AFTER = 5;

const ELSEWHERE = [
  { label: "Eight stages", href: "/#stages" },
  { label: "API reference", href: "/api-reference" },
  { label: "Sign in", href: "/login" },
];

export default function NotFoundView() {
  const reduce = useReducedMotion();
  const pathname = usePathname() || "/";
  const shown = pathname.length > 46 ? `${pathname.slice(0, 45)}…` : pathname;

  const enter = reduce ? false : { opacity: 0, y: 8 };
  const settle = { opacity: 1, y: 0 };

  return (
    <section
      aria-labelledby="notfound-title"
      className="relative overflow-hidden px-6 py-16 sm:px-10 lg:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--line),transparent)]"
      />

      <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-16">
        {/* ---- Message ---------------------------------------------------- */}
        <motion.div
          initial={enter}
          animate={settle}
          transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
        >
          <p className="flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.26em] text-accent">
            <span aria-hidden className="size-1.5 shrink-0 bg-mint" />
            Error 404 — unresolved route
          </p>

          <h1
            id="notfound-title"
            className="mt-5 max-w-[16ch] text-[clamp(2.1rem,5vw,3.4rem)] font-medium leading-[1.04] tracking-[-0.035em] text-fg"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            This route isn&apos;t wired up.
          </h1>

          <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-muted">
            The address you followed doesn&apos;t match any page in Foundry — it may have moved,
            been renamed, or never existed. The eight modules are still there, each one a real
            destination.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="group inline-flex h-11 items-center gap-2.5 bg-mint px-5 text-[14.5px] font-medium text-ink transition duration-200 hover:brightness-95"
            >
              Back to Foundry
              <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <Link
              href="/docs"
              className="inline-flex h-11 items-center border border-line-2 px-5 text-[14.5px] text-fg transition-colors hover:border-accent hover:text-accent"
            >
              Read the documentation
            </Link>
          </div>

          <nav
            aria-label="Other destinations"
            className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-5 font-mono text-[10.5px] uppercase tracking-[0.18em]"
          >
            {ELSEWHERE.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-faint transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </motion.div>

        {/* ---- Broken module bus ------------------------------------------ */}
        <div className="relative">
          <div className="flex items-baseline justify-between gap-4">
            <h2
              id="bus-title"
              className="font-mono text-[10px] uppercase tracking-[0.26em] text-faint"
            >
              Module bus · 01–08
            </h2>
            <span className="font-mono text-[10px] tracking-[0.18em] text-faint">foundry</span>
          </div>

          <ol className="mt-4 border-l border-line">
            {STAGES.map((stage, index) => (
              <Fragment key={stage.id}>
                <motion.li
                  initial={enter}
                  animate={settle}
                  transition={{
                    duration: reduce ? 0 : 0.3,
                    delay: reduce ? 0 : 0.05 + index * 0.035,
                    ease: EASE,
                  }}
                  className="relative -ml-px flex items-baseline gap-3 border-l border-transparent py-[6px] pl-4"
                >
                  <span aria-hidden className="absolute -left-px top-1/2 h-px w-2.5 -translate-y-1/2 bg-line-2" />
                  <span className="font-mono text-[10px] tracking-[0.18em] text-faint">{stage.id}</span>
                  <span className="text-[12.5px] text-muted">{stage.name}</span>
                </motion.li>

                {index === BREAK_AFTER - 1 ? (
                  <motion.li
                    initial={reduce ? false : { opacity: 0, scale: 0.985 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.28, ease: EASE }}
                    className="relative -ml-px list-none pl-4 py-2"
                  >
                    {/* dashed spine through the gap */}
                    <span
                      aria-hidden
                      className="absolute left-0 top-0 h-full border-l border-dashed border-line-2"
                    />
                    <div className="relative border border-dashed border-line-2 bg-panel px-3.5 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[9.5px] uppercase tracking-[0.24em] text-accent">
                          404 · no module
                        </span>
                        <motion.span
                          aria-hidden
                          className="size-1.5 bg-accent"
                          initial={reduce ? false : { opacity: 0.3, scale: 0.8 }}
                          animate={reduce ? undefined : { opacity: [0.3, 1, 0.55], scale: [0.8, 1.25, 1] }}
                          transition={{ duration: 1.1, delay: 0.55, ease: "easeOut" }}
                        />
                      </div>

                      <p className="mt-1.5 font-mono text-[clamp(2rem,4.6vw,2.6rem)] leading-none tracking-[-0.04em] text-fg">
                        404
                      </p>

                      <p
                        className="mt-2 truncate font-mono text-[12px] text-muted"
                        title={pathname}
                      >
                        {shown}
                      </p>
                    </div>
                    <p className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.2em] text-faint">
                      Connection unresolved
                    </p>
                  </motion.li>
                ) : null}
              </Fragment>
            ))}
          </ol>

          <p className="mt-5 border-t border-line pt-4 text-[12.5px] leading-relaxed text-faint">
            Every other stage routes normally. Only this address has no handler.
          </p>
        </div>
      </div>
    </section>
  );
}
