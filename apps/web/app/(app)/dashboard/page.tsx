import type { Metadata } from "next";

import DashboardOverview from "@/components/dashboard/overview";

export const metadata: Metadata = {
  title: "Cycle overview",
  description:
    "Operational overview of a Foundry workspace: cycle throughput, evidence mix, stage load and the initiatives that need a decision.",
  robots: { index: false, follow: false },
};

export const instant = false;

export default function DashboardPage() {
  return <DashboardOverview />;
}
