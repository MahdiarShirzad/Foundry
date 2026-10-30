"use client";

import { useMemo, useState } from "react";

import type { Initiative, Milestone, Release } from "@/lib/product-roadmap/types";
import { PLANNING_PERIODS } from "@/lib/product-roadmap/types";

import { RoadmapPriorityBadge, RoadmapStatusBadge } from "../badges";
import { AddInitiativeDialog } from "../dialogs/roadmap-dialogs";

export function RoadmapTimeline({
  initiatives,
  milestones,
}: {
  initiatives: Initiative[];
  milestones: Milestone[];
  releases: Release[];
}) {
  const [view, setView] = useState<"timeline" | "list">("timeline");
  const [selectedId, setSelectedId] = useState(initiatives[0]?.id ?? null);
  const [moveOpen, setMoveOpen] = useState<string | null>(null);

  const byPeriod = useMemo(
    () =>
      PLANNING_PERIODS.map((period) => ({
        period,
        items: initiatives.filter((i) => i.period === period),
      })),
    [initiatives],
  );

  const selected = initiatives.find((i) => i.id === selectedId) ?? initiatives[0] ?? null;

  const filtered = initiatives;

  if (initiatives.length === 0) {
    return (
      <section className="border border-line bg-panel">
        <header className="border-b border-line px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">Roadmap</p>
          <p className="mt-1 text-[11.5px] text-muted">Timeline view</p>
        </header>
        <div className="flex items-center justify-center gap-2 border border-line bg-panel px-6 py-10">
          <p className="text-[12px] text-muted">Empty roadmap</p>
          <button
            type="button"
            onClick={() => setMoveOpen("new")}
            className="border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fg"
          >
            Add Initiative
          </button>
        </div>
        {moveOpen !== null ? <AddInitiativeDialog open onClose={() => setMoveOpen(null)} /> : null}
      </section>
    );
  }

  return (
    <section className="border border-line bg-panel">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">Roadmap</p>
          <p className="mt-1 text-[11px] text-muted">{initiatives.length} initiatives across Now / Next / Later</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={view} onChange={(e) => setView(e.target.value as "timeline" | "list")} className="border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-fg bg-panel">
            <option value="timeline">Timeline</option>
            <option value="list">List</option>
          </select>
        </div>
      </header>
      {view === "timeline" ? (
        <div className="grid gap-px bg-line lg:grid-cols-3 p-2">
          {byPeriod.map((col) => (
            <article key={col.period} className="bg-panel flex flex-col">
              <header className="border-b border-line px-3 py-2 flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg">{col.period}</p>
                <p className="text-[11px] text-faint">{col.items.length}</p>
              </header>
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {col.items.length === 0 ? (
                  <p className="px-2 text-center text-[11px] text-faint">None</p>
                ) : (
                  col.items.map((i) => {
                    const milestone = milestones.find((m) => m.id === i.associatedMilestoneId);
                    return (
                      <div
                        key={i.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedId(i.id)}
                        className={`border border-line p-3 rounded text-left transition-colors cursor-pointer ${selected?.id === i.id ? "ring-1 ring-accent bg-mint-tint/20" : "hover:bg-mint-tint/10"}`}
                      >
                        <p className="text-[12px] text-fg">{i.name}</p>
                        <p className="mt-1 text-[11px] text-muted">{i.description}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <RoadmapPriorityBadge priority={i.priority} />
                          <RoadmapStatusBadge status={i.status} />
                        </div>
                        {milestone ? (
                          <p className="mt-1 flex items-center gap-1 text-[10.5px] text-faint">
                            <span className="size-1 bg-accent rounded-full" /> Milestone: {milestone.name}
                          </p>
                        ) : null}
                      </div>
                    );
                  })
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="p-3 space-y-2">
          {filtered.map((i) => (
            <div
              key={i.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedId(i.id)}
              className={`border border-line p-3 text-left transition-colors ${selected?.id === i.id ? "ring-1 ring-accent bg-mint-tint/20" : "hover:bg-mint-tint/10"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[12.5px] text-fg">{i.name}</p>
                <RoadmapPriorityBadge priority={i.priority} />
              </div>
              <p className="mt-1 text-[11.5px] text-muted">{i.description}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">{i.period}</span>
                <RoadmapStatusBadge status={i.status} />
              </div>
            </div>
          ))}
        </div>
      )}
      <AddInitiativeDialog open={moveOpen !== null} onClose={() => setMoveOpen(null)} />
    </section>
  );
}
