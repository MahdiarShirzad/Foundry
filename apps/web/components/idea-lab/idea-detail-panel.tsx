"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { DetailSection } from "@/components/ui/primitives";
import { formatIdeaDate, type Idea } from "@/lib/idea-lab/types";

import { IdeaStatus } from "./idea-status";

function MetaCell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[12px] text-faint">{label}</dt>
      <dd className="mt-1 min-w-0 text-[13px] font-medium leading-snug text-fg">{children}</dd>
    </div>
  );
}

/** Compact inline prompt for a section that has no content yet. */
function InlineEmpty({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-control border border-dashed border-line px-3.5 py-3 text-[13px] leading-relaxed text-faint">
      {children}
    </p>
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

  const hasSolution = Boolean(idea.solution?.trim());
  const hasAudience = Boolean(idea.audience?.trim());
  const hasContext = Boolean(idea.context?.trim());

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
            <div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-panel/95 px-4 py-2.5 backdrop-blur md:hidden">
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-accent"
              >
                <span aria-hidden>←</span>
                All ideas
              </button>
              <span className="font-mono text-[11px] tracking-[0.04em] text-faint">{idea.ref}</span>
            </div>

            <header className="border-b border-line px-5 pb-5 pt-5 sm:px-7 sm:pb-6 sm:pt-6">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[11.5px] tracking-[0.04em] text-muted">
                    {idea.ref}
                  </span>
                  <IdeaStatus status={idea.status} />
                </div>
                <span className="text-[12px] text-faint">
                  Updated {formatIdeaDate(idea.updatedAt)}
                </span>
              </div>

              <h2 className="mt-3 text-[clamp(1.5rem,2.4vw,1.85rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-fg">
                {idea.name}
              </h2>
              {idea.headline ? (
                <p className="mt-1.5 max-w-[54ch] text-[15px] leading-snug text-muted">
                  {idea.headline}
                </p>
              ) : null}
              {idea.summary ? (
                <p className="mt-3 max-w-[66ch] text-[13.5px] leading-relaxed text-muted">
                  {idea.summary}
                </p>
              ) : null}

              {idea.tags.length > 0 ? (
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  {idea.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-pill bg-surface-sunken/50 px-2 py-0.5 text-[11.5px] font-medium text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </header>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-b border-line px-5 py-4 sm:px-7 @lg:grid-cols-4">
              <MetaCell label="Status">
                <IdeaStatus status={idea.status} />
              </MetaCell>
              <MetaCell label="Category">{idea.category?.trim() || "Uncategorised"}</MetaCell>
              <MetaCell label="Captured">{formatIdeaDate(idea.capturedAt)}</MetaCell>
              <MetaCell label="Last touched">{formatIdeaDate(idea.updatedAt)}</MetaCell>
            </dl>

            <div className="px-5 py-2 sm:px-7">
              <DetailSection label="Problem">
                {idea.problem?.trim() ? (
                  <p className="max-w-[68ch] text-[14px] leading-[1.75] text-fg">{idea.problem}</p>
                ) : (
                  <InlineEmpty>No problem statement captured yet.</InlineEmpty>
                )}
              </DetailSection>

              <DetailSection label="Proposed solution">
                {hasSolution ? (
                  <p className="max-w-[68ch]">{idea.solution}</p>
                ) : (
                  <InlineEmpty>No proposed solution captured yet.</InlineEmpty>
                )}
              </DetailSection>

              <DetailSection label="Intended audience">
                {hasAudience ? (
                  <p className="max-w-[68ch]">{idea.audience}</p>
                ) : (
                  <InlineEmpty>No audience defined yet.</InlineEmpty>
                )}
              </DetailSection>

              <DetailSection label="Open questions">
                {idea.openQuestions.length > 0 ? (
                  <ol className="space-y-2">
                    {idea.openQuestions.map((question, index) => (
                      <li key={question} className="flex gap-2.5 text-[13.5px] leading-relaxed">
                        <span className="mt-0.5 shrink-0 font-mono text-[11px] text-faint">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-fg">{question}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <InlineEmpty>No open questions recorded yet.</InlineEmpty>
                )}
              </DetailSection>

              <DetailSection label="Notes & context">
                {hasContext ? <p className="max-w-[68ch]">{idea.context}</p> : null}
                <p className="mt-3 text-[12.5px] text-faint">Source · {idea.source}</p>

                {idea.notes.length > 0 ? (
                  <ul className="mt-5 space-y-4">
                    {idea.notes.map((note) => (
                      <li key={note.id} className="flex gap-3">
                        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-sunken/70 text-[10.5px] font-semibold text-muted">
                          {note.initials}
                        </span>
                        <div className="min-w-0">
                          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <span className="text-[13px] font-medium text-fg">{note.author}</span>
                            <span className="text-[12px] text-faint">
                              {formatIdeaDate(note.date)}
                            </span>
                          </p>
                          <p className="mt-1 text-[13px] leading-relaxed text-muted">
                            {note.body}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </DetailSection>
            </div>

            <div className="mt-auto border-t border-line px-5 py-5 sm:px-7">
              <div className="flex flex-col gap-4 rounded-card border border-line bg-mint-tint/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-accent">Next in the cycle</p>
                  <p className="mt-1 text-[15px] font-semibold tracking-[-0.01em] text-fg">
                    Market Intelligence
                  </p>
                  <p className="mt-1 max-w-[52ch] text-[13px] leading-relaxed text-muted">
                    Take the opportunity to the market before committing to the shape of the
                    product.
                  </p>
                </div>

                <Link
                  href="/dashboard/market-intelligence"
                  className="group inline-flex h-9 shrink-0 items-center gap-2 self-start rounded-control border border-line bg-panel px-3.5 text-[13px] font-medium text-fg transition-colors hover:border-accent hover:text-accent sm:self-auto"
                >
                  Explore market
                  <span
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
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
