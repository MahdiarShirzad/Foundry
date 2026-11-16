import { Suspense } from "react";
import type { Metadata } from "next";

import { MarketIntelligenceRoute } from "@/components/market-intelligence/market-intelligence-page";
import { MarketIntelligenceSkeleton } from "@/components/market-intelligence/market-intelligence-skeleton";

export const metadata: Metadata = {
  title: "Market Intelligence",
  description:
    "Stage 02 of the Foundry cycle: organise competitor research, market segments, opportunities and research notes before committing to a product direction.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-4">
          <MarketIntelligenceSkeleton />
        </div>
      }
    >
      <MarketIntelligenceRoute />
    </Suspense>
  );
}
