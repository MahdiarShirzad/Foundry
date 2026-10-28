"use client";

import type { Feature } from "@/lib/mvp-studio/types";

export function MVPProjectOverview({
  project,
  features,
}: {
  project: any;
  features: Feature[];
}) {
  const included = features.filter((f) => f.scope === "Must Have").length;
  const inProgress = features.filter((f) => f.status === "In Progress").length;
  const completed = features.filter((f) => f.status === "Completed").length;

  const items = [
    { label: "Proposed features", value: features.length, hint: "In backlog" },
    { label: "Included in MVP", value: included, hint: "Must have" },
    { label: "In progress", value: inProgress, hint: "Being worked" },
    { label: "Completed", value: completed, hint: "Done" },
  ];

  return (
    <section className="border border-line bg-panel">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">MVP Overview</p>
          <p className="mt-1 text-[11.5px] text-muted">Project scope and progress snapshot</p>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">{project.ref}</p>
      </header>
      <div className="grid gap-px bg-line sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <article key={item.label} className="bg-panel px-4 py-3.5">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">{item.label}</p>
            <p className="mt-2 text-[1.6rem] font-medium tracking-[-0.03em] text-fg">{item.value}</p>
            <p className="mt-1 text-[11px] text-muted">{item.hint}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
