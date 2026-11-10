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
    <section className="border border-line bg-panel shadow-[var(--elevation-lift)]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line/80 px-5 py-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
            Roadmap overview
          </p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
            Direction and shape of the current planning cycle.
          </p>
        </div>
        <span className="border border-line bg-bg/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
          {product.horizon}
        </span>
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
