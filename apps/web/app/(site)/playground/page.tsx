import type { Metadata } from "next";

import Scaffold from "@/components/site/scaffold";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "The Foundry playground — a sandbox for walking ideas through the eight modules before committing real work.",
};

export default function PlaygroundPage() {
  return (
    <Scaffold
      eyebrow="P"
      title="Playground"
      description="A sandbox for walking an idea through Foundry without touching a real project: draft market hypotheses, test validation criteria and watch how each module hands context to the next. It will run against the same REST API documented in the reference."
      primary={{ href: "/docs", label: "Read the documentation" }}
      secondary={{ href: "/examples", label: "See examples" }}
    />
  );
}
