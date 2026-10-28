"use client";

import { useMemo, useState } from "react";

import type { EvidenceItem, Experiment, Hypothesis } from "@/lib/validation-lab/types";
import { EXPERIMENT_METHODS, EXPERIMENT_STATUSES } from "@/lib/validation-lab/types";

import { ValidationEmptyState, ValidationStatusBadge } from "../badges";
import { CreateExperimentDialog } from "../dialogs/create-experiment-dialog";

export function ExperimentWorkspace({
  experiments,
  hypotheses,
}: {
  experiments: Experiment[];
  hypotheses: Hypothesis[];
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [method, setMethod] = useState<string>("all");
  const [selectedId, setSelectedId] = useState(experiments[0]?.id ?? null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    return experiments.filter((e) => {
      const matchesQuery = query ? e.title.toLowerCase().includes(query.toLowerCase()) : true;
      const matchesStatus = status === "all" ? true : e.status === status;
      const matchesMethod = method === "all" ? true : e.method === method;
      return matchesQuery && matchesStatus && matchesMethod;
    });
  }, [experiments, query, status, method]);

  const selected = experiments.find((e) => e.id === selectedId) ?? filtered[0] ?? experiments[0] ?? null;
  const linkedHyp = selected ? hypotheses.find((h) => h.id === selected.relatedHypothesisId) : null;

  if (experiments.length === 0) {
    return <ValidationEmptyState title="No experiments yet" description="Create an experiment to test a hypothesis." action={<button type="button" onClick={() => setOpen(true)} className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg">Create Experiment</button>} />;
  }

  return (
    <div className="grid gap-px border border-line bg-line lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <section className="bg-panel">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Experiments</p>
            <p className="mt-1 text-[11px] text-muted">{filtered.length} shown</p>
          </div>
          <button type="button" onClick={() => setOpen(true)} className="border border-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-fg">Create</button>
        </header>
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search experiments" className="h-7 flex-1 border border-line bg-panel px-2 text-[12px] text-fg outline-none focus:border-accent" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-7 border border-line bg-panel px-2 text-[11px] text-fg">
            <option value="all">All statuses</option>
            {EXPERIMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="h-7 border border-line bg-panel px-2 text-[11px] text-fg">
            <option value="all">All methods</option>
            {EXPERIMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="max-h-[520px] overflow-auto">
          {filtered.map((e) => {
            const active = e.id === selected?.id;
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => setSelectedId(e.id)}
                className={`w-full border-b border-line px-4 py-3 text-left transition-colors ${active ? "bg-mint-tint/30" : "hover:bg-mint-tint/20"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[12.5px] font-medium text-fg">{e.title}</p>
                  <ValidationStatusBadge status={e.status} />
                </div>
                <p className="mt-1 text-[11.5px] text-muted">{e.method}</p>
                <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">{e.startDate}{e.endDate ? ` — ${e.endDate}` : ""}</div>
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
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Experiment Detail</p>
                  <h3 className="mt-2 text-[1.3rem] font-medium tracking-[-0.03em] text-fg">{selected.title}</h3>
                  <p className="mt-1 text-[11.5px] text-muted">{selected.method} · {selected.targetAudience}</p>
                </div>
                <ValidationStatusBadge status={selected.status} />
              </div>
            </header>
            <div className="space-y-6 px-6 py-5">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Related hypothesis</p>
                <p className="mt-2 text-[12px] text-fg">{linkedHyp?.title ?? selected.relatedHypothesisId}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Objective</p>
                <p className="mt-2 text-[12px] leading-relaxed text-muted">{selected.objective}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Success criteria</p>
                <p className="mt-2 text-[12px] leading-relaxed text-muted">{selected.successCriteria}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Expected evidence</p>
                <p className="mt-2 text-[12px] leading-relaxed text-muted">{selected.expectedEvidence}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Start date</p>
                  <p className="mt-2 text-[12px] text-fg">{selected.startDate}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">End date</p>
                  <p className="mt-2 text-[12px] text-fg">{selected.endDate ?? "—"}</p>
                </div>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Observations & notes</p>
                <ul className="mt-2 space-y-1 text-[12px] text-muted">
                  {selected.observations.length === 0 ? <li>None yet</li> : selected.observations.map((o) => <li key={o}>• {o}</li>)}
                </ul>
                {selected.notes ? <p className="mt-2 text-[12px] text-muted">{selected.notes}</p> : null}
              </div>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">Interface does not imply this test has run just because it was created.</p>
            </div>
          </div>
        ) : (
          <ValidationEmptyState title="Select an experiment" description="Choose an experiment from the list to inspect details." />
        )}
      </section>
      <CreateExperimentDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
