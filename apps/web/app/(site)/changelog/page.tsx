import type { Metadata } from "next";

import Scaffold from "@/components/site/scaffold";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Release notes for Foundry — what shipped in each version of the eight-module product-building platform.",
};

export default function ChangelogPage() {
  return (
    <Scaffold
      eyebrow="C"
      title="Changelog"
      description="Release notes for Foundry: what shipped in each version of the platform, what changed across the eight modules, and anything worth knowing before you upgrade. The repository is at 0.1.0 with no tagged releases yet — notes will appear here as versions land."
      primary={{ href: "/docs", label: "Read the documentation" }}
      secondary={{ href: "/about", label: "About the project" }}
    />
  );
}
