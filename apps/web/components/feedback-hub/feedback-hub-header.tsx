"use client";

import { useState } from "react";

import { DEMO_FEEDBACK_PRODUCTS } from "@/lib/feedback-hub/demo";
import type { FeedbackDraft, FeedbackProduct } from "@/lib/feedback-hub/types";

import { AddFeedbackDialog } from "./dialogs/add-feedback-dialog";

export function FeedbackHubHeader({
  product,
  onChangeProduct,
  products = DEMO_FEEDBACK_PRODUCTS,
  areaNames,
  total,
  awaiting,
  lastActivity,
  onAdd,
  onReviewInsights,
}: {
  product: FeedbackProduct;
  onChangeProduct: (id: string) => void;
  products?: FeedbackProduct[];
  areaNames: string[];
  total: number;
  awaiting: number;
  lastActivity?: string;
  onAdd: (draft: FeedbackDraft) => void;
  onReviewInsights: () => void;
}) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="min-w-0">
        <p className="flex items-center gap-2.5 font-mono text-[9.5px] uppercase tracking-[0.24em] text-accent">
          <span aria-hidden className="size-1.5 bg-mint" />
          Stage 07 / Listen
        </p>
        <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.8rem)] font-medium leading-[0.98] tracking-[-0.04em] text-fg">
          Feedback Hub
        </h1>
        <p className="mt-2 max-w-[68ch] text-[12.5px] leading-relaxed text-muted">
          Understand what users are saying, organize product feedback, and turn real customer
          experiences into informed product improvements.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 border border-line bg-panel px-2.5 py-1.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
              Product
            </span>
            <select
              value={product.id}
              onChange={(e) => onChangeProduct(e.target.value)}
              className="bg-transparent text-[12px] text-fg outline-none"
              aria-label="Select product for feedback"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.ref}
                </option>
              ))}
            </select>
          </label>
          <span className="border border-line bg-panel px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
            Feedback workspace · {product.name} · {total} records · {awaiting} awaiting
            {lastActivity ? ` · last ${lastActivity}` : ""}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFeedbackOpen(true)}
          className="border border-accent/70 bg-mint-tint/60 px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-accent transition-colors hover:bg-mint-tint"
        >
          Add Feedback
        </button>
        <button
          type="button"
          onClick={onReviewInsights}
          className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
        >
          Review Insights
        </button>
      </div>

      {feedbackOpen ? (
        <AddFeedbackDialog
          open
          onClose={() => setFeedbackOpen(false)}
          onAdd={onAdd}
          productAreas={areaNames}
          productName={product.name}
        />
      ) : null}
    </header>
  );
}
