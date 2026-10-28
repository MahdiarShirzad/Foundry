"use client";

import type { EvidenceItem, Experiment, Hypothesis } from "@/lib/validation-lab/types";

import { ValidationStatusBadge } from "./badges";

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
  const inProgress = experiments.filter((e) => e.status === "In Progress" || e.status === "Ready").length;
  const items = [
    { label: "Total hypotheses", value: hypotheses.length, hint: "Assumptions tracked" },
    { label: "Awaiting validation", value: awaiting, hint: "Ready or unexamined" },
    { label: "Experiments in progress", value: inProgress, hint: "Ready or in progress" },
    { label: "Findings documented", value: findings.length, hint: "Evidence collected" },
  ];

  return (
    <section className="border border-line bg-panel">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Validation Overview</p>
          <p className="mt-1 text-[11.5px] text-muted">State of validation work for the selected idea</p>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
          {hypotheses.some((h) => h.status === "Testing") ? "Actively testing" : "In review"}
        </p>
      </header>
      <div className="grid gap-px bg-line sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <article key={item.label} className="bg-panel px-4 py-3.5">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">{item.label}</p>
            <p className="mt-2 text-[1.6rem] font-medium tracking-[-0.03em] text-fg">{item.value}</p>
            <p className="mt-1 text-[11px] text-muted">{item.hint}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
