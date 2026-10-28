"use client";

import { useState } from "react";

import type { Initiative } from "@/lib/product-roadmap/types";
import { ROADMAP_PRIORITIES } from "@/lib/product-roadmap/types";

import { RoadmapPriorityBadge, RoadmapStatusBadge, ProductRoadmapEmptyState } from "../badges";
import { AddInitiativeDialog } from "../dialogs/roadmap-dialogs";

export function PriorityWorkspace({
  initiatives,
}: {
  initiatives: Initiative[];
}) {
  const [open, setOpen] = useState(false);
  const groups = ROADMAP_PRIORITIES.map((p) => ({ priority: p, items: initiatives.filter((i) => i.priority === p) }));

  if (initiatives.length === 0) {
    return <ProductRoadmapEmptyState title="No priorities" description="Add initiatives to review their priorities." action={<button type="button" onClick={() => setOpen(true)} className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg">Add Initiative</button>} />;
  }

  return (
    <section className="border border-line bg-panel">
      <header className="border-b border-line px-4 py-3 flex items-center justify-between gap-2">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Priorities</p>
          <p className="mt-1 text-[11px] text-muted">Initiatives grouped by mock priority</p>
        </div>
        <button type="button" onClick={() => setOpen(true)} className="border border-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-fg">Add</button>
      </header>
      <div className="grid gap-px bg-line md:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <article key={g.priority} className="bg-panel px-4 py-4">
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-fg">{g.priority}</p>
              <p className="text-[11px] text-faint">{g.items.length}</p>
            </div>
            <div className="mt-3 space-y-2">
              {g.items.length === 0 ? <p className="text-[11px] text-faint">None</p> : g.items.map((i) => (
                <div key={i.id} className="border border-line px-3 py-2">
                  <p className="text-[12px] text-fg">{i.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">{i.period}</span>
                    <RoadmapStatusBadge status={i.status} />
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <AddInitiativeDialog open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
