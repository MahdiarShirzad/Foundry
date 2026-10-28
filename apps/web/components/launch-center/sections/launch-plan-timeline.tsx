"use client";

import { useMemo, useState } from "react";

import type { LaunchTask } from "@/lib/launch-center/types";
import { LAUNCH_PHASES, LAUNCH_TASK_STATUSES } from "@/lib/launch-center/types";

import { LaunchStatusBadge, LaunchPhaseBadge, LaunchCenterEmptyState } from "../badges";
import { AddLaunchTaskDialog } from "../dialogs/add-launch-task-dialog";

export function LaunchPlanTimeline({
  tasks,
}: {
  tasks: LaunchTask[];
}) {
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [selectedId, setSelectedId] = useState(tasks[0]?.id ?? null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchesQuery = query ? t.title.toLowerCase().includes(query.toLowerCase()) : true;
      const matchesPhase = phase === "all" ? true : t.phase === phase;
      const matchesStatus = status === "all" ? true : t.status === status;
      return matchesQuery && matchesPhase && matchesStatus;
    });
  }, [tasks, query, phase, status]);

  const selected = tasks.find((t) => t.id === selectedId) ?? filtered[0] ?? tasks[0] ?? null;

  if (tasks.length === 0) {
    return <LaunchCenterEmptyState title="Empty launch plan" description="Add launch tasks to start planning." action={<button type="button" onClick={() => setOpen(true)} className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg">Add Launch Task</button>} />;
  }

  const groups = LAUNCH_PHASES.map((p) => ({ phase: p, items: filtered.filter((t) => t.phase === p) }));

  return (
    <section className="border border-line bg-panel">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Launch Plan</p>
          <p className="mt-1 text-[11px] text-muted">{filtered.length} task{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <button type="button" onClick={() => setOpen(true)} className="border border-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-fg">Add task</button>
      </header>
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-2">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks" className="h-7 flex-1 border border-line bg-panel px-2 text-[12px] text-fg outline-none focus:border-accent" />
        <select value={phase} onChange={(e) => setPhase(e.target.value)} className="h-7 border border-line bg-panel px-2 text-[11px] text-fg">
          <option value="all">All phases</option>
          {LAUNCH_PHASES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-7 border border-line bg-panel px-2 text-[11px] text-fg">
          <option value="all">All statuses</option>
          {LAUNCH_TASK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="grid gap-px bg-line md:grid-cols-2 lg:grid-cols-4 p-2">
        {groups.map((g) => (
          <article key={g.phase} className="bg-panel">
            <header className="border-b border-line px-3 py-2 flex items-center justify-between">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-fg">{g.phase}</p>
              <p className="text-[11px] text-faint">{g.items.length}</p>
            </header>
            <div className="space-y-2 p-2">
              {g.items.length === 0 ? (
                <p className="px-2 text-center text-[11px] text-faint">None</p>
              ) : (
                g.items.map((t) => {
                  const active = t.id === selected?.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedId(t.id)}
                      className={`border border-line px-3 py-2 text-left transition-colors ${active ? "bg-mint-tint/30 ring-1 ring-accent" : "hover:bg-mint-tint/10"}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[12px] text-fg">{t.title}</p>
                        <LaunchStatusBadge status={t.status} />
                      </div>
                      <p className="mt-1 text-[11px] text-muted">{t.date}</p>
                      <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                        {t.owner ? <span>{t.owner}</span> : null}
                        {t.owner && t.relatedChannelId ? <span>·</span> : null}
                        {t.relatedChannelId ? <span>Channel</span> : null}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </article>
        ))}
      </div>
      {selected && (
        <div className="bg-panel p-4 border-t border-line">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">Selected task</p>
          <h3 className="mt-1 text-[13px] font-medium text-fg">{selected.title}</h3>
          <p className="mt-1 text-[11.5px] text-muted">{selected.description}</p>
          <div className="mt-2 flex items-center gap-2">
            <LaunchStatusBadge status={selected.status} />
            <LaunchPhaseBadge phase={selected.phase} />
          </div>
        </div>
      )}
      <AddLaunchTaskDialog open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
