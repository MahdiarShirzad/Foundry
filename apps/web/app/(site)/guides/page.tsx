import type { Metadata } from "next";

import Scaffold from "@/components/site/scaffold";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Step-by-step Foundry guides — long-form walkthroughs of the idea-to-launch workflow, from concept validation to launch preparation.",
};

export default function GuidesPage() {
  return (
    <Scaffold
      eyebrow="G"
      title="Guides"
      description="Long-form, step-by-step walkthroughs of the Foundry workflow: taking one idea from concept through validation criteria, MVP scope, roadmap and launch. The shorter, reference-oriented versions live in the documentation — start there today."
      primary={{ href: "/docs", label: "Read the documentation" }}
      secondary={{ href: "/docs/backend-api", label: "API documentation" }}
    />
  );
}
