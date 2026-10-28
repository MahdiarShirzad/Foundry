import type { Metadata } from "next";

import MarketIntelligencePage from "@/components/market-intelligence/market-intelligence-page";

export const metadata: Metadata = {
  title: "Market Intelligence",
  description:
    "Stage 02 of the Foundry cycle: organise competitor research, market segments, opportunities and research notes before committing to a product direction.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <MarketIntelligencePage />;
}
