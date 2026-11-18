import { Suspense } from "react";
import type { Metadata } from "next";

import { FeedbackHubRoute } from "@/components/feedback-hub/feedback-hub-page";
import { FeedbackHubSkeleton } from "@/components/feedback-hub/badges";

export const metadata: Metadata = {
  title: "Feedback Hub — Foundry",
  description:
    "Understand what users are saying, organize product feedback, and turn real customer experiences into informed product improvements.",
  robots: { index: false, follow: false },
};

// The page reads `?product=` via `useSearchParams` and loads its data on the
// client, so the segment drops to its Suspense fallback during prerendering.
export const instant = false;

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-4">
          <FeedbackHubSkeleton />
        </div>
      }
    >
      <FeedbackHubRoute />
    </Suspense>
  );
}
