import type { Metadata } from "next";
import Link from "next/link";

import Eyebrow from "@/components/site/eyebrow";
import Reveal from "@/components/site/reveal";
import { AUDIENCES, STAGES } from "@/components/site/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Foundry is a structured product-building ecosystem — eight connected modules that take a founder from idea to launch, and what this repository contains today.",
};

const PRINCIPLES: [string, string, string][] = [
  [
    "01",
    "Evidence over opinion",
    "Market signals, customer conversations and validation criteria feed the decisions that come after them — validation is a gate, not a checkbox.",
  ],
  [
    "02",
    "One connected workflow",
    "Each module hands structured output to the next. Research becomes validation criteria; validation becomes scope; scope becomes roadmap, launch and metrics.",
  ],
  [
    "03",
    "Open by design",
    "A NestJS backend, documented from its source, with the auth and domain modules the README plans for it — built to be inspected, extended and self-hosted.",
  ],
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden px-6 pb-20 pt-40 sm:px-10 lg:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--line),transparent)]"
        />

        <div className="mx-auto max-w-4xl">
          <Eyebrow>Sec. A — About Foundry</Eyebrow>

          <h1
            className="mt-7 max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-[-0.025em] text-foreground sm:text-5xl"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            One workspace for the whole journey from idea to launch.
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Foundry is a structured product-building ecosystem: eight connected modules that take a
            founder from a raw idea, through market research and validation, into an MVP, a roadmap
            and a launch — then keep reading customer feedback and founder metrics. It is an open
            monorepo with a NestJS backend and a Next.js product surface, documented directly from
            the source.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/docs"
              className="inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Read the documentation
            </Link>
            <Link
              href="/#workflow"
              className="inline-flex h-11 items-center rounded-md border border-line px-6 text-sm font-medium text-foreground transition-colors hover:border-foreground/35 hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              See how Foundry works
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-line px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Sec. 01 — The problem</Eyebrow>
            <p
              className="mt-6 max-w-3xl font-display text-2xl font-medium leading-snug tracking-[-0.015em] text-foreground sm:text-3xl"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Building a product usually means holding the whole process together across scattered
              tools — notes here, spreadsheets there, feedback somewhere else.
            </p>
          </Reveal>
          <Reveal delay={0.12} className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Foundry replaces that fragmentation with one connected workflow. Each stage of the
            journey maps to a module, and each module carries structured context into the next — so
            early work compounds instead of being retyped, re-explained or quietly lost.
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Sec. 02 — Who it&apos;s for</Eyebrow>
          </Reveal>

          <ul className="mt-10 divide-y divide-line border-y border-line">
            {AUDIENCES.map(([index, name, detail], i) => (
              <Reveal key={name} delay={i * 0.06}>
                <li className="grid grid-cols-1 gap-1 py-5 sm:grid-cols-12 sm:items-baseline sm:gap-6">
                  <span className="font-mono text-[11px] tracking-[0.18em] text-accent sm:col-span-1">
                    {index}
                  </span>
                  <span className="font-display text-lg font-medium tracking-[-0.01em] text-foreground sm:col-span-4">
                    {name}
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground sm:col-span-7">
                    {detail}
                  </span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Sec. 03 — Principles</Eyebrow>
          </Reveal>

          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
            {PRINCIPLES.map(([index, title, body], i) => (
              <Reveal key={title} delay={i * 0.1} className="bg-card p-7">
                <span className="font-mono text-[11px] tracking-[0.18em] text-accent">{index}</span>
                <h3 className="mt-4 font-display text-lg font-medium tracking-[-0.01em] text-foreground">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Sec. 04 — The eight modules</Eyebrow>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              One database, eight modules in sequence — from the first captured idea to live
              founder metrics, and back to the Idea Lab with what was learned.
            </p>
          </Reveal>

          <div className="mt-10 border-t border-line">
            {STAGES.map((stage, i) => (
              <Reveal key={stage.id} delay={i * 0.05}>
                <div className="grid grid-cols-1 gap-2 border-b border-line py-6 sm:grid-cols-12 sm:items-baseline sm:gap-6">
                  <span className="font-mono text-[11px] tracking-[0.18em] text-accent sm:col-span-1">
                    {stage.id}
                  </span>
                  <span className="font-display text-lg font-medium tracking-[-0.01em] text-foreground sm:col-span-4">
                    {stage.name}
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground sm:col-span-7">
                    {stage.detail}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Sec. 05 — Go deeper</Eyebrow>
            <p
              className="mt-6 max-w-2xl font-display text-2xl font-medium leading-snug tracking-[-0.015em] text-foreground sm:text-3xl"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Everything on this page is documented from the source — setup, architecture, and
              every endpoint the eight modules expose.
            </p>
          </Reveal>

          <Reveal delay={0.12} className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/docs"
              className="inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Documentation
            </Link>
            <Link
              href="/api-reference"
              className="inline-flex h-11 items-center rounded-md border border-line px-6 text-sm font-medium text-foreground transition-colors hover:border-foreground/35 hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              API reference
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
