import type { Metadata } from "next";

import FounderAnalyticsPage from "@/components/founder-analytics/founder-analytics-page";

export const metadata: Metadata = {
  title: "Founder Analytics — Foundry",
  description:
    "Understand product performance, explore user behavior, and turn metrics into better product decisions.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <FounderAnalyticsPage />;
}
