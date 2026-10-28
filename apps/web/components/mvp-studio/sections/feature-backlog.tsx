"use client";

import { useMemo, useState } from "react";

import type { Feature } from "@/lib/mvp-studio/types";
import { FEATURE_PRIORITIES, FEATURE_SCOPE, FEATURE_STATUSES } from "@/lib/mvp-studio/types";

import { FeaturePriorityBadge, FeatureScopeBadge, FeatureStatusBadge, MVPStudioEmptyState } from "../badges";
import { AddFeatureDialog } from "../dialogs/add-feature-dialog";

export function FeatureBacklog({
  features,
}: {
  features: Feature[];
}) {
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [scope, setScope] = useState<string>("all");
  const [selectedId, setSelectedId] = useState(features[0]?.id ?? null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    return features.filter((f) => {
      const matchesQuery = query ? f.name.toLowerCase().includes(query.toLowerCase()) : true;
      const matchesPriority = priority === "all" ? true : f.priority === priority;
      const matchesStatus = status === "all" ? true : f.status === status;
      const matchesScope = scope === "all" ? true : f.scope === scope;
      return matchesQuery && matchesPriority && matchesStatus && matchesScope;
    });
  }, [features, query, priority, status, scope]);

  const selected = features.find((f) => f.id === selectedId) ?? filtered[0] ?? features[0] ?? null;

  if (features.length === 0) {
    return <MVPStudioEmptyState title="Empty feature backlog" description="Add features to start planning your MVP." action={<button type="button" onClick={() => setOpen(true)} className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg">Add Feature</button>} />;
  }

  return (
    <div className="grid gap-px border border-line bg-line lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <section className="bg-panel">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Feature Backlog</p>
            <p className="mt-1 text-[11px] text-muted">{filtered.length} shown</p>
          </div>
          <button type="button" onClick={() => setOpen(true)} className="border border-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-fg">Add</button>
        </header>
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search features" className="h-7 flex-1 border border-line bg-panel px-2 text-[12px] text-fg outline-none focus:border-accent" />
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="h-7 border border-line bg-panel px-2 text-[11px] text-fg">
            <option value="all">All priorities</option>
            {FEATURE_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-7 border border-line bg-panel px-2 text-[11px] text-fg">
            <option value="all">All statuses</option>
            {FEATURE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={scope} onChange={(e) => setScope(e.target.value)} className="h-7 border border-line bg-panel px-2 text-[11px] text-fg">
            <option value="all">All scope</option>
            {FEATURE_SCOPE.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="max-h-[520px] overflow-auto">
          {filtered.map((f) => {
            const active = f.id === selected?.id;
            return (
              <button key={f.id} type="button" onClick={() => setSelectedId(f.id)} className={`w-full border-b border-line px-4 py-3 text-left transition-colors ${active ? "bg-mint-tint/30" : "hover:bg-mint-tint/20"}`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[12.5px] font-medium text-fg">{f.name}</p>
                  <FeatureStatusBadge status={f.status} />
                </div>
                <p className="mt-1 line-clamp-2 text-[11.5px] text-muted">{f.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <FeaturePriorityBadge priority={f.priority} />
                  <FeatureScopeBadge scope={f.scope} />
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
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Feature Detail</p>
                  <h3 className="mt-2 text-[1.3rem] font-medium tracking-[-0.03em] text-fg">{selected.name}</h3>
                  <p className="mt-1 text-[11.5px] text-muted">{selected.targetUser}</p>
                </div>
                <div className="flex items-center gap-2">
                  <FeaturePriorityBadge priority={selected.priority} />
                  <FeatureScopeBadge scope={selected.scope} />
                  <FeatureStatusBadge status={selected.status} />
                </div>
              </div>
            </header>
            <div className="space-y-6 px-6 py-5">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Description</p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-fg">{selected.description}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">User problem</p>
                <p className="mt-2 text-[12px] leading-relaxed text-muted">{selected.userProblem}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">User story</p>
                <p className="mt-2 text-[12px] leading-relaxed text-fg">{selected.userStory}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Acceptance criteria</p>
                <ul className="mt-2 space-y-1 text-[12px] text-muted">
                  {selected.acceptanceCriteria.map((c) => <li key={c}>• {c}</li>)}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <MVPStudioEmptyState title="Select a feature" description="Choose a feature from the backlog to inspect details." />
        )}
      </section>
      <AddFeatureDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
