"use client";

import type {
  Channel,
  LaunchAsset,
  LaunchProduct,
  LaunchTask,
} from "@/lib/launch-center/types";

export function LaunchOverview({
  product,
  tasks,
  assets,
  channels,
}: {
  product: LaunchProduct;
  tasks: LaunchTask[];
  assets: LaunchAsset[];
  channels: Channel[];
}) {
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const remaining = tasks.length - completed;
  const ready = assets.filter((a) => a.status === "Ready").length;

  const items = [
    { label: "Launch date", value: product.launchDate, hint: "Planned release" },
    { label: "Launch phase", value: product.phase, hint: "Current stage" },
    { label: "Launch tasks", value: tasks.length, hint: "Planned work" },
    { label: "Completed", value: completed, hint: "Finished tasks" },
    { label: "Remaining", value: remaining, hint: "Tasks left" },
    { label: "Assets ready", value: ready, hint: "Of prepared assets" },
    { label: "Planned channels", value: channels.length, hint: "Promotion channels" },
  ];

  return (
    <section className="border border-line bg-panel">
      <header className="border-b border-line px-4 py-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Launch Overview</p>
        <p className="mt-1 text-[11.5px] text-muted">Compact snapshot of launch readiness</p>
      </header>
      <div className="grid gap-px bg-line sm:grid-cols-3 lg:grid-cols-4">
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
