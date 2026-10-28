"use client";

import { useMemo, useState } from "react";

import type { Initiative, Milestone, Release } from "@/lib/product-roadmap/types";
import { PLANNING_PERIODS, ROADMAP_PRIORITIES, ROADMAP_STATUSES } from "@/lib/product-roadmap/types";

import { RoadmapPriorityBadge, RoadmapStatusBadge, ProductRoadmapEmptyState } from "../badges";
import { AddInitiativeDialog } from "../dialogs/roadmap-dialogs";

export function InitiativeWorkspace({
  initiatives,
  milestones,
  releases,
}: {
  initiatives: Initiative[];
  milestones: Milestone[];
  releases: Release[];
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [priority, setPriority] = useState<string>("all");
  const [period, setPeriod] = useState<string>("all");
  const [selectedId, setSelectedId] = useState(initiatives[0]?.id ?? null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    return initiatives.filter((i) => {
      const matchesQuery = query ? i.name.toLowerCase().includes(query.toLowerCase()) : true;
      const matchesStatus = status === "all" ? true : i.status === status;
      const matchesPriority = priority === "all" ? true : i.priority === priority;
      const matchesPeriod = period === "all" ? true : i.period === period;
      return matchesQuery && matchesStatus && matchesPriority && matchesPeriod;
    });
  }, [initiatives, query, status, priority, period]);

  const selected = initiatives.find((i) => i.id === selectedId) ?? filtered[0] ?? initiatives[0] ?? null;
  const milestone = selected ? milestones.find((m) => m.id === selected.associatedMilestoneId) : null;

  if (initiatives.length === 0) {
    return <ProductRoadmapEmptyState title="No initiatives" description="Add initiatives to start planning your roadmap." action={<button type="button" onClick={() => setOpen(true)} className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg">Add Initiative</button>} />;
  }

  return (
    <div className="grid gap-px border border-line bg-line lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <section className="bg-panel">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Initiatives</p>
            <p className="mt-1 text-[11px] text-muted">{filtered.length} shown</p>
          </div>
          <button type="button" onClick={() => setOpen(true)} className="border border-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-fg">Add</button>
        </header>
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search initiatives" className="h-7 flex-1 border border-line bg-panel px-2 text-[12px] text-fg outline-none focus:border-accent" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-7 border border-line bg-panel px-2 text-[11px] text-fg">
            <option value="all">All statuses</option>
            {ROADMAP_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="h-7 border border-line bg-panel px-2 text-[11px] text-fg">
            <option value="all">All priorities</option>
            {ROADMAP_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="h-7 border border-line bg-panel px-2 text-[11px] text-fg">
            <option value="all">All periods</option>
            {PLANNING_PERIODS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="max-h-[520px] overflow-auto">
          {filtered.map((i) => {
            const active = i.id === selected?.id;
            return (
              <button key={i.id} type="button" onClick={() => setSelectedId(i.id)} className={`w-full border-b border-line px-4 py-3 text-left transition-colors ${active ? "bg-mint-tint/30" : "hover:bg-mint-tint/20"}`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[12.5px] font-medium text-fg">{i.name}</p>
                  <RoadmapPriorityBadge priority={i.priority} />
                </div>
                <p className="mt-1 line-clamp-2 text-[11.5px] text-muted">{i.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">{i.period}</span>
                  <RoadmapStatusBadge status={i.status} />
                </div>
              </button>
            );
          })}
        </div>
      </section>
      <section className="bg-panel">
        {selected ? (
          <div className="flex h-full flex-col">
            <header className="border-b border-line px-6 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Initiative Detail</p>
                  <h3 className="mt-2 text-[1.3rem] font-medium tracking-[-0.03em] text-fg">{selected.name}</h3>
                  <p className="mt-1 text-[11.5px] text-muted">{selected.period}</p>
                </div>
                <div className="flex items-center gap-2">
                  <RoadmapPriorityBadge priority={selected.priority} />
                  <RoadmapStatusBadge status={selected.status} />
                </div>
              </div>
            </header>
            <div className="space-y-6 px-6 py-5">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Description</p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-fg">{selected.description}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Product objective</p>
                <p className="mt-2 text-[12px] leading-relaxed text-muted">{selected.objective}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">User problem</p>
                <p className="mt-2 text-[12px] leading-relaxed text-muted">{selected.userProblem}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Rationale</p>
                <p className="mt-2 text-[12px] leading-relaxed text-muted">{selected.rationale}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Related features</p>
                  <ul className="mt-2 space-y-1 text-[12px] text-muted">
                    {selected.relatedFeatures.length === 0 ? <li>None noted</li> : selected.relatedFeatures.map((f) => <li key={f}>• {f}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Dependencies</p>
                  <ul className="mt-2 space-y-1 text-[12px] text-muted">
                    {selected.dependencies.length === 0 ? <li>None</li> : selected.dependencies.map((d) => <li key={d}>• {d}</li>)}
                  </ul>
                </div>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Associated milestone</p>
                <p className="mt-2 text-[12px] text-fg">{milestone?.name ?? selected.associatedMilestoneId ?? "None"}</p>
              </div>
            </div>
          </div>
        ) : (
          <ProductRoadmapEmptyState title="Select an initiative" description="Choose an initiative from the list to inspect details." />
        )}
      </section>
      <AddInitiativeDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
