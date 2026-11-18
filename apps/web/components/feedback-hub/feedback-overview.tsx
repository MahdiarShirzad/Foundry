"use client";

import { StatStrip } from "@/components/ui/primitives";

import { feedbackStats } from "@/lib/feedback/derive";
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
      className="rounded-card border border-line bg-panel shadow-card"
      aria-label="Feedback overview"
    >
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line/80 px-5 py-4">
        <div>
          <p className="text-[12px] text-accent">
            Feedback overview
          </p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
            What the inbox looks like right now.
          </p>
        </div>
        <p className="text-[12px] text-faint">
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
