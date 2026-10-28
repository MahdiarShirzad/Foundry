import type { Metadata } from "next";

import ValidationLabPage from "@/components/validation-lab/validation-lab-page";

export const metadata: Metadata = {
  title: "Validation Lab — Foundry",
  description:
    "Challenge your assumptions, design meaningful experiments, and gather evidence before committing to a product direction.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ValidationLabPage />;
}
