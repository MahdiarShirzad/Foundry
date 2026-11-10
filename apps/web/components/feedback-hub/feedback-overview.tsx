"use client";

import { StatStrip } from "@/components/ui/primitives";

import { feedbackStats } from "@/lib/feedback-hub/demo";
import type { FeedbackItem, FeedbackProduct } from "@/lib/feedback-hub/types";

export function FeedbackOverview({
  product,
  feedback,
}: {
  product: FeedbackProduct;
  feedback: FeedbackItem[];
}) {
  const stats = feedbackStats(feedback);

  return (
    <section
      className="border border-line bg-panel shadow-[var(--elevation-lift)]"
      aria-label="Feedback overview"
    >
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line/80 px-5 py-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
            Feedback overview
          </p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
            What the inbox looks like right now.
          </p>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
          {product.name} · counts read from records
        </p>
      </header>
      <StatStrip
        columns="sm:grid-cols-3 lg:grid-cols-5"
        items={[
          { label: "Total feedback", value: stats.total, hint: "Records on file" },
          { label: "Awaiting review", value: stats.awaiting, hint: "Status: new" },
          { label: "High priority", value: stats.highPriority, hint: "Critical or high" },
          { label: "Feature requests", value: stats.featureRequests, hint: "Categorised as requests" },
          { label: "Recently reviewed", value: stats.reviewed, hint: "Reviewed, still active" },
        ]}
      />
    </section>
  );
}
