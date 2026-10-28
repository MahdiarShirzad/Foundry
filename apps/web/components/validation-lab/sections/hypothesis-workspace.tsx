"use client";

import { useMemo, useState } from "react";

import type { EvidenceItem, Experiment, Hypothesis, ValidationIdea } from "@/lib/validation-lab/types";
import { HYPOTHESIS_CATEGORIES, HYPOTHESIS_STATUSES } from "@/lib/validation-lab/types";

import { EvidenceTypeBadge, ValidationEmptyState, ValidationStatusBadge } from "../badges";
import { NewHypothesisDialog } from "../dialogs/new-hypothesis-dialog";

export function HypothesisWorkspace({
  hypotheses,
  experiments,
  findings,
}: {
  hypotheses: Hypothesis[];
  experiments: Experiment[];
  findings: EvidenceItem[];
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [selectedId, setSelectedId] = useState(hypotheses[0]?.id ?? null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    return hypotheses.filter((h) => {
      const matchesQuery = query ? h.title.toLowerCase().includes(query.toLowerCase()) : true;
      const matchesStatus = status === "all" ? true : h.status === status;
      const matchesCat = category === "all" ? true : h.category === category;
      return matchesQuery && matchesStatus && matchesCat;
    });
  }, [hypotheses, query, status, category]);

  const selected = hypotheses.find((h) => h.id === selectedId) ?? filtered[0] ?? hypotheses[0] ?? null;
  const relatedExp = selected ? experiments.filter((e) => selected.relatedExperimentIds.includes(e.id)) : [];
  const relatedFind = selected ? findings.filter((f) => selected.linkedFindings.includes(f.id)) : [];

  if (hypotheses.length === 0) {
    return <ValidationEmptyState title="No hypotheses yet" description="Document assumptions that need to be tested." action={<button type="button" onClick={() => setOpen(true)} className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg">New Hypothesis</button>} />;
  }

  return (
    <div className="grid gap-px border border-line bg-line lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <section className="bg-panel">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Hypotheses</p>
            <p className="mt-1 text-[11px] text-muted">{filtered.length} shown</p>
          </div>
          <button type="button" onClick={() => setOpen(true)} className="border border-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-fg">New</button>
        </header>
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search hypotheses" className="h-7 flex-1 border border-line bg-panel px-2 text-[12px] text-fg outline-none focus:border-accent" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-7 border border-line bg-panel px-2 text-[11px] text-fg">
            <option value="all">All statuses</option>
            {HYPOTHESIS_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-7 border border-line bg-panel px-2 text-[11px] text-fg">
            <option value="all">All categories</option>
            {HYPOTHESIS_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="max-h-[520px] overflow-auto">
          {filtered.map((h) => {
            const active = h.id === selected?.id;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => setSelectedId(h.id)}
                className={`w-full border-b border-line px-4 py-3 text-left transition-colors ${active ? "bg-mint-tint/30" : "hover:bg-mint-tint/20"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[12.5px] font-medium text-fg">{h.title}</p>
                  <ValidationStatusBadge status={h.status} />
                </div>
                <p className="mt-1 line-clamp-2 text-[11.5px] text-muted">{h.statement}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                  <span>{h.category}</span>
                  <span>·</span>
                  <span>{h.importance}</span>
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
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Hypothesis Detail</p>
                  <h3 className="mt-2 text-[1.3rem] font-medium tracking-[-0.03em] text-fg">{selected.title}</h3>
                  <p className="mt-1 text-[11.5px] text-muted">{selected.customerSegment}</p>
                </div>
                <ValidationStatusBadge status={selected.status} />
              </div>
            </header>
            <div className="space-y-6 px-6 py-5">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Statement</p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-fg">{selected.statement}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Category</p>
                  <p className="mt-2 text-[12px] text-fg">{selected.category}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Importance</p>
                  <p className="mt-2 text-[12px] text-fg">{selected.importance}</p>
                </div>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Why it matters</p>
                <p className="mt-2 text-[12px] leading-relaxed text-muted">{selected.rationale}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Related experiments</p>
                <div className="mt-2 space-y-2">
                  {relatedExp.length === 0 ? <p className="text-[11.5px] text-faint">None linked</p> : relatedExp.map((e) => <div key={e.id} className="border border-line px-3 py-2 text-[12px] text-fg">{e.title}</div>)}
                </div>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Linked findings</p>
                <div className="mt-2 space-y-2">
                  {relatedFind.length === 0 ? <p className="text-[11.5px] text-faint">None linked</p> : relatedFind.map((f) => <div key={f.id} className="border border-line px-3 py-2 text-[12px] text-fg">{f.title}</div>)}
                </div>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Unresolved questions</p>
                <ul className="mt-2 space-y-1 text-[12px] text-muted">
                  {selected.unresolvedQuestions.map((q) => <li key={q}>• {q}</li>)}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <ValidationEmptyState title="Select a hypothesis" description="Choose a hypothesis from the list to inspect details." />
        )}
      </section>
      <NewHypothesisDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
