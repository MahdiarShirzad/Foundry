"use client";

import type { EvidenceItem, Experiment, Hypothesis } from "@/lib/validation-lab/types";

export function ValidationOverview({
  hypotheses,
  experiments,
  findings,
}: {
  hypotheses: Hypothesis[];
  experiments: Experiment[];
  findings: EvidenceItem[];
}) {
  const awaiting = hypotheses.filter((h) => h.status === "Ready to Test" || h.status === "Unexamined").length;
  const testing = hypotheses.filter((h) => h.status === "Testing").length;
  const inProgress = experiments.filter((e) => e.status === "In Progress" || e.status === "Ready").length;
  const items = [
    { label: "Total hypotheses", value: hypotheses.length, hint: "Assumptions tracked" },
    { label: "Awaiting validation", value: awaiting, hint: "Ready or unexamined" },
    { label: "Experiments in progress", value: inProgress, hint: "Ready or in progress" },
    { label: "Findings documented", value: findings.length, hint: "Evidence collected" },
  ];

  const summary =
    hypotheses.length === 0
      ? "No hypotheses documented for this idea yet — the workspace starts empty."
      : `${hypotheses.length} hypotheses tracked, ${awaiting} still awaiting a test, ${testing} under test. ${experiments.length} experiments designed, ${inProgress} ready or running, ${findings.length} findings recorded.`;

  return (
    <section className="border border-line bg-panel shadow-[var(--elevation-lift)]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line/80 px-5 py-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
            Validation overview
          </p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
            State of validation work for the selected idea.
          </p>
        </div>
        <p className="border border-line bg-bg/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
          {testing > 0 ? `Actively testing · ${testing}` : "No test currently running"}
        </p>
      </header>
      <div className="grid gap-px bg-line sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <article
            key={item.label}
            className="group relative bg-panel px-5 py-4 transition-colors hover:bg-mint-tint/15"
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
            />
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
              {item.label}
            </p>
            <p className="mt-2.5 font-mono text-[1.75rem] font-medium leading-none tracking-[-0.035em] text-fg tabular-nums">
              {item.value}
            </p>
            <p className="mt-1.5 text-[11px] leading-snug text-muted">{item.hint}</p>
          </article>
        ))}
      </div>
      <p className="border-t border-line bg-bg/30 px-5 py-3 text-[11.5px] leading-relaxed text-muted">
        {summary}
      </p>
    </section>
  );
}
