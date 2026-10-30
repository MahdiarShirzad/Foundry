"use client";

import { StatStrip } from "@/components/ui/primitives";

import type { Initiative, Milestone, Release, RoadmapProduct } from "@/lib/product-roadmap/types";

export function RoadmapOverview({
  product,
  initiatives,
  releases,
  milestones,
}: {
  product: RoadmapProduct;
  initiatives: Initiative[];
  releases: Release[];
  milestones: Milestone[];
}) {
  const inProgress = initiatives.filter((initiative) => initiative.status === "In Progress").length;
  const upcomingRelease = releases[0]?.name ?? "None planned";

  return (
    <section className="border border-line bg-panel">
      <header className="border-b border-line px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
          Roadmap overview
        </p>
        <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
          Direction and shape of the current planning cycle
        </p>
      </header>
      <StatStrip
        columns="sm:grid-cols-2 xl:grid-cols-3"
        items={[
          { label: "Product direction", value: product.direction, hint: "Current focus", kind: "text" },
          { label: "Planning horizon", value: product.horizon, hint: "Illustrative dates", kind: "text" },
          { label: "Upcoming release", value: upcomingRelease, hint: "Next delivery", kind: "text" },
          { label: "Initiatives", value: initiatives.length, hint: "Planned work" },
          { label: "Milestones", value: milestones.length, hint: "Checkpoints" },
          { label: "In progress", value: inProgress, hint: "Active work" },
        ]}
      />
    </section>
  );
}
