"use client";

import { useState } from "react";

import type { Release, Milestone, Initiative } from "@/lib/product-roadmap/types";

import { ProductRoadmapEmptyState } from "../badges";
import { AddMilestoneDialog } from "../dialogs/roadmap-dialogs";

export function ReleaseMilestoneWorkspace({
  releases,
  milestones,
  initiatives,
}: {
  releases: Release[];
  milestones: Milestone[];
  initiatives: Initiative[];
}) {
  const [tab, setTab] = useState<"releases" | "milestones">("releases");
  const [milestoneOpen, setMilestoneOpen] = useState(false);

  return (
    <section className="border border-line bg-panel">
      <header className="border-b border-line px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">Releases &amp; Milestones</p>
          <p className="mt-1 text-[11px] text-muted">Organize planned deliveries and checkpoints</p>
        </div>
        <div className="flex items-center gap-2 border border-line px-1">
          <button type="button" onClick={() => setTab("releases")} className={`px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${tab === "releases" ? "text-accent" : "text-faint hover:text-fg"}`}>Releases</button>
          <button type="button" onClick={() => setTab("milestones")} className={`px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${tab === "milestones" ? "text-accent" : "text-faint hover:text-fg"}`}>Milestones</button>
          <button type="button" onClick={() => setMilestoneOpen(true)} className="border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-fg">Add Milestone</button>
        </div>
      </header>
      <div className="p-3 space-y-3">
        {tab === "releases" ? (
          <div>
            {releases.length === 0 ? <ProductRoadmapEmptyState title="No releases" description="Add a release to group planned initiatives." /> : (
              <div className="space-y-3">
                {releases.map((r) => {
                  const included = initiatives.filter((i) => r.initiativeIds.includes(i.id));
                  return (
                    <div key={r.id} className="border border-line p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[12px] text-fg">{r.name}</p>
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">{r.version}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted">{r.purpose}</p>
                      <div className="mt-2 text-[11px] text-faint">{r.plannedDate}</div>
                      <p className="mt-2 text-[11px] text-fg">{included.length} initiative{included.length !== 1 ? "s" : ""}</p>
                      <p className="mt-1 text-[11px] text-muted">{r.notesPreview}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div>
            {milestones.length === 0 ? <ProductRoadmapEmptyState title="No milestones" description="Add milestones to mark checkpoints." /> : (
              <div className="space-y-3">
                {milestones.map((m) => {
                  const related = initiatives.filter((i) => m.initiativeIds.includes(i.id));
                  return (
                    <div key={m.id} className="border border-line p-3">
                      <p className="text-[12px] text-fg">{m.name}</p>
                      <p className="mt-1 text-[11px] text-muted">{m.description}</p>
                      <div className="mt-2 text-[11px] text-faint">{m.targetDate}</div>
                      <p className="mt-2 text-[11px] text-fg">{related.length} initiative{related.length !== 1 ? "s" : ""}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
      <AddMilestoneDialog open={milestoneOpen} onClose={() => setMilestoneOpen(false)} />
    </section>
  );
}
