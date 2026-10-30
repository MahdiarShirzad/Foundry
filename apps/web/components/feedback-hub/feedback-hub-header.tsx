"use client";

import { useState } from "react";

import { Button, PlusIcon } from "@/components/ui/button";
import { HeaderSelect, ModuleHeader } from "@/components/ui/primitives";

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
    <>
      <ModuleHeader
        stage="07"
        stageLabel="Listen"
        title="Feedback Hub"
        description="Understand what users are saying, organize product feedback, and turn real customer experiences into informed product improvements."
        meta={[
          <span key="product" className="text-fg">
            {product.name}
          </span>,
          `${total} records`,
          `${awaiting} awaiting`,
          lastActivity ? `last ${lastActivity}` : null,
        ].filter(Boolean)}
        controls={
          <HeaderSelect
            label="Product"
            value={product.id}
            onChange={onChangeProduct}
            ariaLabel="Select product for feedback"
          >
            {products.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.name} · {entry.ref}
              </option>
            ))}
          </HeaderSelect>
        }
        actions={
          <>
            <Button variant="secondary" size="md" onClick={onReviewInsights}>
              Review Insights
            </Button>
            <Button variant="primary" size="md" onClick={() => setFeedbackOpen(true)}>
              <PlusIcon />
              Add Feedback
            </Button>
          </>
        }
      />

      {feedbackOpen ? (
        <AddFeedbackDialog
          open
          onClose={() => setFeedbackOpen(false)}
          onAdd={onAdd}
          productAreas={areaNames}
          productName={product.name}
        />
      ) : null}
    </>
  );
}
