"use client";

import { useMemo, useState } from "react";

import type { Initiative, Milestone, Release, RoadmapProduct } from "@/lib/product-roadmap/types";

import { RoadmapPriorityBadge, RoadmapStatusBadge } from "./badges";

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
  const inProgress = initiatives.filter((i) => i.status === "In Progress").length;
  const upcoming = releases.slice().sort().length > 0 ? releases[0]?.name : "None planned";
  const items = [
    { label: "Product direction", value: product.direction, hint: "Current focus" },
    { label: "Planning horizon", value: product.horizon, hint: "Illustrative dates" },
    { label: "Total initiatives", value: initiatives.length, hint: "Planned work" },
    { label: "Planned milestones", value: milestones.length, hint: "Checkpoints" },
    { label: "Upcoming release", value: upcoming, hint: "Next delivery" },
    { label: "In progress", value: inProgress, hint: "Active work" },
  ];

  return (
    <section className="border border-line bg-panel">
      <header className="border-b border-line px-4 py-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Roadmap Overview</p>
        <p className="mt-1 text-[11.5px] text-muted">Compact snapshot of the current roadmap</p>
      </header>
      <div className="grid gap-px bg-line sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.label} className="bg-panel px-4 py-3.5">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">{item.label}</p>
            <p className="mt-2 text-[1.5rem] font-medium tracking-[-0.03em] text-fg">{item.value}</p>
            <p className="mt-1 text-[11px] text-muted">{item.hint}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
