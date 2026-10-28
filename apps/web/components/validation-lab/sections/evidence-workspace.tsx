"use client";

import { useMemo, useState } from "react";

import type { EvidenceItem, Experiment, Hypothesis } from "@/lib/validation-lab/types";
import { EVIDENCE_TYPES } from "@/lib/validation-lab/types";

import { EvidenceTypeBadge, ValidationEmptyState } from "../badges";
import { AddFindingDialog } from "../dialogs/add-finding-dialog";

export function EvidenceWorkspace({
  findings,
  experiments,
  hypotheses,
}: {
  findings: EvidenceItem[];
  experiments: Experiment[];
  hypotheses: Hypothesis[];
}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("all");
  const [selectedId, setSelectedId] = useState(findings[0]?.id ?? null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    return findings.filter((f) => {
      const matchesQuery = query ? f.title.toLowerCase().includes(query.toLowerCase()) : true;
      const matchesType = type === "all" ? true : f.type === type;
      return matchesQuery && matchesType;
    });
  }, [findings, query, type]);

  const selected = findings.find((f) => f.id === selectedId) ?? filtered[0] ?? findings[0] ?? null;
  const exp = selected ? experiments.find((e) => e.id === selected.relatedExperimentId) : null;
  const hyp = selected ? hypotheses.find((h) => h.id === selected.relatedHypothesisId) : null;

  if (findings.length === 0) {
    return <ValidationEmptyState title="No findings yet" description="Document evidence from experiments." action={<button type="button" onClick={() => setOpen(true)} className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg">Add Finding</button>} />;
  }

  return (
    <div className="grid gap-px border border-line bg-line lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <section className="bg-panel">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Evidence &amp; Findings</p>
            <p className="mt-1 text-[11px] text-muted">{filtered.length} shown</p>
          </div>
          <button type="button" onClick={() => setOpen(true)} className="border border-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-fg">Add</button>
        </header>
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search findings" className="h-7 flex-1 border border-line bg-panel px-2 text-[12px] text-fg outline-none focus:border-accent" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="h-7 border border-line bg-panel px-2 text-[11px] text-fg">
            <option value="all">All types</option>
            {EVIDENCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="max-h-[520px] overflow-auto">
          {filtered.map((f) => {
            const active = f.id === selected?.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedId(f.id)}
                className={`w-full border-b border-line px-4 py-3 text-left transition-colors ${active ? "bg-mint-tint/30" : "hover:bg-mint-tint/20"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[12.5px] font-medium text-fg">{f.title}</p>
                  <EvidenceTypeBadge type={f.type} />
                </div>
                <p className="mt-1 text-[11px] text-faint">{f.sourceLabel}</p>
                <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">{f.date}</div>
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
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Evidence Detail</p>
                  <h3 className="mt-2 text-[1.3rem] font-medium tracking-[-0.03em] text-fg">{selected.title}</h3>
                  <p className="mt-1 text-[11.5px] text-muted">{selected.sourceLabel} · {selected.date}</p>
                </div>
                <EvidenceTypeBadge type={selected.type} />
              </div>
            </header>
            <div className="space-y-6 px-6 py-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Related experiment</p>
                  <p className="mt-2 text-[12px] text-fg">{exp?.title ?? selected.relatedExperimentId}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Related hypothesis</p>
                  <p className="mt-2 text-[12px] text-fg">{hyp?.title ?? selected.relatedHypothesisId}</p>
                </div>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Observation</p>
                <p className="mt-2 text-[12px] leading-relaxed text-fg">{selected.observation}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Interpretation</p>
                <p className="mt-2 text-[12px] leading-relaxed text-muted">{selected.interpretation}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Limitations / potential bias</p>
                <p className="mt-2 text-[12px] leading-relaxed text-muted">{selected.limitations}</p>
              </div>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">Observation / Interpretation / Conclusion clearly distinguished.</p>
            </div>
          </div>
        ) : (
          <ValidationEmptyState title="Select a finding" description="Choose an evidence item from the list to inspect details." />
        )}
      </section>
      <AddFindingDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
