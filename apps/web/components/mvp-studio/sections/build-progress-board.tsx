"use client";

import { useState } from "react";

import type { Feature } from "@/lib/mvp-studio/types";

import { FeaturePriorityBadge, MVPStudioEmptyState } from "../badges";

export function BuildProgressBoard({
  features,
}: {
  features: Feature[];
}) {
  const [items, setItems] = useState(features);
  const columns = [
    { key: "not-started", title: "Not yet started", filter: (f: Feature) => f.status === "Proposed" },
    { key: "ready", title: "Ready for development", filter: (f: Feature) => f.status === "Ready" },
    { key: "in-progress", title: "In progress", filter: (f: Feature) => f.status === "In Progress" },
    { key: "completed", title: "Completed", filter: (f: Feature) => f.status === "Completed" },
    { key: "blocked", title: "Blocked / Deferred", filter: (f: Feature) => f.status === "Deferred" },
  ];

  if (features.length === 0) {
    return <MVPStudioEmptyState title="Empty build progress board" description="Features will appear as they move through the workflow." />;
  }

  function move(id: string, dir: "up" | "down") {
    setItems((current) => {
      const order = ["Proposed", "Ready", "In Progress", "Completed", "Deferred"];
      return current.map((f) => {
        if (f.id !== id) return f;
        const idx = order.indexOf(f.status);
        const nextIdx = dir === "up" ? Math.max(0, idx - 1) : Math.min(order.length - 1, idx + 1);
        const nextStatus = order[nextIdx] as Feature["status"];
        return { ...f, status: nextStatus };
      });
    });
  }

  return (
    <section className="border border-line bg-panel">
      <header className="border-b border-line px-4 py-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Build Progress</p>
        <p className="mt-1 text-[11.5px] text-muted">Presentational tracking — not a real build system</p>
      </header>
      <div className="grid gap-px bg-line md:grid-cols-2 xl:grid-cols-5">
        {columns.map((col) => {
          const list = items.filter(col.filter);
          return (
            <article key={col.key} className="bg-panel">
              <header className="border-b border-line px-3 py-2">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">{col.title}</p>
                <p className="mt-1 text-[11px] text-muted">{list.length}</p>
              </header>
              <div className="space-y-2 p-2">
                {list.map((f) => (
                  <div key={f.id} className="border border-line px-3 py-2">
                    <p className="text-[12px] text-fg">{f.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <FeaturePriorityBadge priority={f.priority} />
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                      <button type="button" onClick={() => move(f.id, "up")} className="border border-line px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">←</button>
                      <button type="button" onClick={() => move(f.id, "down")} className="border border-line px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">→</button>
                    </div>
                  </div>
                ))}
                {list.length === 0 ? <p className="px-2 py-3 text-center text-[11px] text-faint">None</p> : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
