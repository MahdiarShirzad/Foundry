import { Suspense } from "react";
import type { Metadata } from "next";

import { ProductRoadmapRoute } from "@/components/product-roadmap/product-roadmap-page";
import { ProductRoadmapSkeleton } from "@/components/product-roadmap/badges";

export const metadata: Metadata = {
  title: "Product Roadmap — Foundry",
  description:
    "Turn product priorities into a clear direction with planned initiatives, meaningful milestones, and an organized release timeline.",
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
          <ProductRoadmapSkeleton />
        </div>
      }
    >
      <ProductRoadmapRoute />
    </Suspense>
  );
}
