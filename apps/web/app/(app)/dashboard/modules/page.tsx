import type { Metadata } from "next";

import ModulesOverview from "@/components/dashboard/modules-overview";

export const metadata: Metadata = {
  title: "Modules",
  description:
    "The eight Foundry modules — Idea Lab through Founder Analytics — with the products currently in the workspace.",
  robots: { index: false, follow: false },
};

export default function ModulesPage() {
  return <ModulesOverview />;
}
