import { Suspense } from "react";
import type { Metadata } from "next";

import { FounderAnalyticsRoute } from "@/components/founder-analytics/founder-analytics-page";

export const metadata: Metadata = {
  title: "Founder Analytics — Foundry",
  description:
    "Understand product performance, explore user behavior, and turn metrics into better product decisions.",
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
          <div className="h-[7rem] animate-pulse border border-line bg-panel" />
          <div className="h-12 animate-pulse border border-line bg-panel" />
          <div className="h-72 animate-pulse border border-line bg-panel" />
        </div>
      }
    >
      <FounderAnalyticsRoute />
    </Suspense>
  );
}
