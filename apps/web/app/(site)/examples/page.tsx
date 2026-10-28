import type { Metadata } from "next";

import Scaffold from "@/components/site/scaffold";

export const metadata: Metadata = {
  title: "Examples",
  description:
    "Example scenarios for Foundry — walkthroughs showing the eight modules applied to a real product idea.",
};

export default function ExamplesPage() {
  return (
    <Scaffold
      eyebrow="E"
      title="Examples"
      description="Worked, end-to-end scenarios showing the eight modules applied to a real product idea — the research inputs, the validation criteria, the scope and the metrics that follow. A condensed version of this walkthrough already ships in the documentation."
      primary={{ href: "/docs/workflow", label: "The workflow walkthrough" }}
      secondary={{ href: "/docs", label: "Read the documentation" }}
    />
  );
}
