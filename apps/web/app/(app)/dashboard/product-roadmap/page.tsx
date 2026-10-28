import type { Metadata } from "next";

import ProductRoadmapPage from "@/components/product-roadmap/product-roadmap-page";

export const metadata: Metadata = {
  title: "Product Roadmap — Foundry",
  description:
    "Turn product priorities into a clear direction with planned initiatives, meaningful milestones, and an organized release timeline.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ProductRoadmapPage />;
}
