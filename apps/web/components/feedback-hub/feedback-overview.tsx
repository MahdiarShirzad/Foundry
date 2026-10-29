"use client";

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

  const items = [
    { label: "Total feedback", value: stats.total, hint: "Mock records on file" },
    { label: "Awaiting review", value: stats.awaiting, hint: "Status: new" },
    { label: "High priority", value: stats.highPriority, hint: "Critical or high" },
    { label: "Feature requests", value: stats.featureRequests, hint: "Categorised as requests" },
    { label: "Recently reviewed", value: stats.reviewed, hint: "Reviewed, still active" },
  ];

  return (
    <section className="border border-line bg-panel" aria-label="Feedback overview">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-4 py-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
          Feedback Overview
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
          {product.name} · counts read from static mock records
        </p>
      </header>
      <div className="grid gap-px bg-line sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <article key={item.label} className="bg-panel px-4 py-3.5">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
              {item.label}
            </p>
            <p className="mt-2 text-[1.5rem] font-medium tracking-[-0.03em] text-fg">
              {item.value}
            </p>
            <p className="mt-1 text-[11px] text-muted">{item.hint}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
