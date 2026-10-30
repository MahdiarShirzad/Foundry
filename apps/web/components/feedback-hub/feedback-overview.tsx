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
    <section className="border border-line bg-panel" aria-label="Feedback overview">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
          Feedback overview
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
          {product.name} · counts read from static sample records
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
