"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  formatIdeaDate,
  type Idea,
} from "@/lib/idea-lab/types";

import { IdeaStatus } from "./idea-status";

function MetaCell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0 bg-panel px-4 py-3">
      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">{label}</dt>
      <dd className="mt-1 min-w-0 text-[11.5px] leading-snug text-fg">{children}</dd>
    </div>
  );
}

function DetailSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-2 border-b border-line px-5 py-5 sm:px-7 sm:py-6 @xl:grid-cols-[8rem_minmax(0,1fr)] @xl:gap-6">
      <h3 className="flex items-baseline gap-2">
        <span className="font-mono text-[10px] tracking-[0.16em] text-accent">{number}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">{title}</span>
      </h3>
      <div className="min-w-0 max-w-[68ch]">{children}</div>
    </section>
  );
}

export function IdeaDetailPanel({
  idea,
  onBack,
}: {
  idea: Idea;
  onBack: () => void;
}) {
  const reduce = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [idea.id]);

  return (
    <article className="flex min-h-0 w-full min-w-0 flex-col bg-panel md:h-full">
      <div
        ref={scrollRef}
        className="@container min-h-0 flex-1 [scrollbar-color:var(--line-2)_transparent] [scrollbar-width:thin] md:overflow-y-auto md:overscroll-contain"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={idea.id}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-full flex-col"
          >
            <div className="sticky top-14 z-20 flex items-center justify-between gap-3 border-b border-line bg-panel px-4 py-2.5 md:hidden">
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-faint transition-colors hover:text-accent"
              >
                <span aria-hidden className="text-[12px] leading-none">
                  ←
                </span>
                All ideas
              </button>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                {idea.ref}
              </span>
            </div>

            <header className="border-b border-line px-5 pb-5 pt-4 sm:px-7 sm:pb-6 sm:pt-5">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <div className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                  <span className="text-accent">{idea.ref}</span>
                  <span aria-hidden className="text-line-2">
                    /
                  </span>
                  <IdeaStatus status={idea.status} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                  Updated {formatIdeaDate(idea.updatedAt)}
                </span>
              </div>

              <h2 className="mt-4 text-[clamp(2rem,3.4vw,2.75rem)] font-medium leading-[0.98] tracking-[-0.045em] text-fg">
                {idea.name}
              </h2>
              <p className="mt-2 max-w-[54ch] text-[15.5px] font-medium leading-snug tracking-[-0.01em] text-muted sm:text-[17px]">
                {idea.headline}
              </p>
              <p className="mt-3.5 max-w-[68ch] text-[13px] leading-[1.72] text-muted">
                {idea.summary}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {idea.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint"
                  >
                    #{tag.replace(/\s+/g, "-")}
                  </span>
                ))}
              </div>
            </header>

            <dl className="grid grid-cols-2 gap-px border-b border-line bg-line @lg:grid-cols-4">
              <MetaCell label="Status">
                <IdeaStatus status={idea.status} className="text-[10px]" />
              </MetaCell>
              <MetaCell label="Category">{idea.category}</MetaCell>
              <MetaCell label="Captured">{formatIdeaDate(idea.capturedAt)}</MetaCell>
              <MetaCell label="Last touched">{formatIdeaDate(idea.updatedAt)}</MetaCell>
            </dl>

            <DetailSection number="01" title="The problem">
              <p className="text-[14.5px] leading-[1.8] text-fg sm:text-[15px]">{idea.problem}</p>
            </DetailSection>

            <DetailSection number="02" title="Proposed solution">
              <p className="text-[13.5px] leading-[1.8] text-muted">{idea.solution}</p>
            </DetailSection>

            <DetailSection number="03" title="Intended audience">
              <p className="text-[13.5px] leading-[1.8] text-muted">{idea.audience}</p>
            </DetailSection>

            <DetailSection number="04" title="Open questions">
              <ol>
                {idea.openQuestions.map((question, index) => (
                  <li
                    key={question}
                    className="flex gap-3 border-t border-line/60 py-2.5 first:border-t-0 first:pt-0 last:pb-0"
                  >
                    <span className="mt-[2px] shrink-0 font-mono text-[10px] tracking-[0.1em] text-faint">
                      Q{index + 1}
                    </span>
                    <span className="text-[12.5px] leading-relaxed text-fg">{question}</span>
                  </li>
                ))}
              </ol>
            </DetailSection>

            <DetailSection number="05" title="Notes & context">
              <p className="text-[13px] leading-[1.75] text-muted">{idea.context}</p>
              <p className="mt-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-faint">
                Source · {idea.source}
              </p>

              <div className="mt-4 border-t border-line">
                {idea.notes.map((note) => (
                  <div
                    key={note.id}
                    className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 border-b border-line/60 py-3 last:border-b-0 last:pb-0"
                  >
                    <span className="flex size-7 items-center justify-center border border-line-2 font-mono text-[10px] tracking-[0.04em] text-fg">
                      {note.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="text-[11.5px] font-medium text-fg">{note.author}</span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                          {formatIdeaDate(note.date)}
                        </span>
                      </p>
                      <p className="mt-1 text-[12px] leading-relaxed text-muted">{note.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </DetailSection>

            <div className="mt-auto border-t border-line bg-mint-tint/25 px-5 py-5 sm:px-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                    <span aria-hidden className="size-1.5 bg-mint" />
                    Next in the cycle
                  </p>
                  <p className="mt-1.5 text-[15px] font-medium tracking-[-0.01em] text-fg">
                    02 · Market Intelligence
                  </p>
                  <p className="mt-1 max-w-[52ch] text-[11.5px] leading-relaxed text-muted">
                    Take the opportunity to the market before committing to the shape of the
                    product.
                  </p>
                </div>

                <Link
                  href="/dashboard/market-intelligence"
                  className="group inline-flex h-9 shrink-0 items-center gap-2 border border-line-2 bg-panel px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
                >
                  Explore market
                  <span
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </article>
  );
}
