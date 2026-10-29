"use client";

import { motion, useReducedMotion } from "motion/react";

import type { FeatureRequest, FeedbackItem, ProductArea } from "@/lib/feedback-hub/types";

import {
  FeedbackCategoryBadge,
  FeedbackHubEmptyState,
  FeedbackPriorityBadge,
  FeedbackRequestStatusBadge,
} from "../badges";
import { PanelLabel } from "../primitives";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function ProductAreasWorkspace({
  areas,
  feedback,
  requests,
  selectedId,
  onSelect,
  onOpenFeedback,
  onOpenRequest,
}: {
  areas: ProductArea[];
  feedback: FeedbackItem[];
  requests: FeatureRequest[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onOpenFeedback: (id: string) => void;
  onOpenRequest: (id: string) => void;
}) {
  const reduce = useReducedMotion();

  const selected = areas.find((a) => a.id === selectedId) ?? areas[0] ?? null;
  const relatedFeedback = selected
    ? feedback.filter((f) => f.productArea === selected.name)
    : [];
  const relatedRequests = selected
    ? requests.filter((r) => r.productArea === selected.name)
    : [];

  if (areas.length === 0) {
    return (
      <section className="border border-line bg-panel">
        <FeedbackHubEmptyState
          title="No product areas"
          description="Product areas group feedback by the part of the product it belongs to. None are defined for this product yet."
        />
      </section>
    );
  }

  return (
    <div className="grid gap-px border border-line bg-line lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
      {/* ------------------------------------------------------------ list --- */}
      <nav aria-label="Product areas" className="min-w-0 bg-panel">
        <header className="border-b border-line px-4 py-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
            Product Areas
          </p>
          <p className="mt-1 text-[11px] text-muted">
            {areas.length} area{areas.length !== 1 ? "s" : ""} · feedback grouped by area
          </p>
        </header>
        <ul className="max-h-[24rem] space-y-2 overflow-y-auto p-2 lg:max-h-[38rem]">
          {areas.map((a) => {
            const active = a.id === selected?.id;
            return (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => onSelect(a.id)}
                  aria-current={active ? "true" : undefined}
                  className={`w-full border px-3 py-2.5 text-left transition-colors ${
                    active
                      ? "border-accent/60 bg-mint-tint/30"
                      : "border-line hover:bg-mint-tint/15"
                  }`}
                >
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="text-[12.5px] font-medium text-fg">{a.name}</span>
                    <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                      {a.feedbackCount} fb
                    </span>
                  </span>
                  <span className="mt-1 block truncate text-[11px] text-muted">
                    {a.description}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* --------------------------------------------------------- detail --- */}
      <section className="min-w-0 bg-panel" aria-label="Selected product area">
        {selected ? (
          <motion.div
            key={selected.id}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
            className="space-y-5 px-5 py-5 sm:px-6"
          >
            <header>
              <p className="flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
                <span aria-hidden className="size-1.5 bg-mint" />
                Product area · {selected.id}
              </p>
              <h3 className="mt-2 text-[clamp(1.15rem,2vw,1.5rem)] font-medium tracking-[-0.03em] text-fg">
                {selected.name}
              </h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
                {selected.description}
              </p>
            </header>

            <div className="grid gap-px border border-line bg-line sm:grid-cols-3">
              {[
                { label: "Related feedback", value: selected.feedbackCount },
                { label: "Open issues", value: selected.openIssues },
                { label: "Feature requests", value: selected.featureRequests },
              ].map((stat) => (
                <article key={stat.label} className="bg-panel px-4 py-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
                    {stat.label}
                  </p>
                  <p className="mt-1.5 text-[1.35rem] font-medium tracking-[-0.03em] text-fg">
                    {stat.value}
                  </p>
                </article>
              ))}
            </div>

            <div>
              <PanelLabel>Manual summary</PanelLabel>
              <p className="mt-2 max-w-[75ch] text-[12.5px] leading-relaxed text-fg">
                {selected.summary}
              </p>
            </div>

            <div>
              <PanelLabel>Related feedback records · {relatedFeedback.length}</PanelLabel>
              {relatedFeedback.length === 0 ? (
                <div className="mt-2 border border-dashed border-line px-4 py-6 text-center">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">
                    Empty product area
                  </p>
                  <p className="mx-auto mt-2 max-w-[40ch] text-[12px] leading-relaxed text-muted">
                    No feedback has been filed against {selected.name} yet.
                  </p>
                </div>
              ) : (
                <ul className="mt-2 space-y-1.5">
                  {relatedFeedback.map((f) => (
                    <li key={f.id}>
                      <button
                        type="button"
                        onClick={() => onOpenFeedback(f.id)}
                        className="flex w-full flex-wrap items-center gap-2 border border-line px-3 py-2 text-left transition-colors hover:border-accent/70 hover:bg-mint-tint/20"
                      >
                        <span className="min-w-0 flex-1 truncate text-[12px] text-fg">
                          {f.title}
                        </span>
                        <FeedbackCategoryBadge category={f.category} />
                        <FeedbackPriorityBadge priority={f.priority} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <PanelLabel>Related feature requests · {relatedRequests.length}</PanelLabel>
              {relatedRequests.length === 0 ? (
                <p className="mt-2 text-[12px] text-muted">
                  No requests filed against this area.
                </p>
              ) : (
                <ul className="mt-2 space-y-1.5">
                  {relatedRequests.map((r) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => onOpenRequest(r.id)}
                        className="flex w-full flex-wrap items-center gap-2 border border-line px-3 py-2 text-left transition-colors hover:border-accent/70 hover:bg-mint-tint/20"
                      >
                        <span className="min-w-0 flex-1 truncate text-[12px] text-fg">
                          {r.title}
                        </span>
                        <FeedbackRequestStatusBadge status={r.status} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
              Counts are read from the mock records · no quality or health scoring
            </p>
          </motion.div>
        ) : (
          <FeedbackHubEmptyState
            title="Select a product area"
            description="Choose an area to see the feedback and requests attached to it."
          />
        )}
      </section>
    </div>
  );
}
