"use client";

import { useState } from "react";

import type { EvidenceItem, Experiment, Hypothesis, NextStep } from "@/lib/validation-lab/types";
import { DEMO_NEXT_STEPS } from "@/lib/validation-lab/demo";

import { ValidationStatusBadge } from "../badges";

export function ValidationSummary({
  hypotheses,
  experiments,
  findings,
}: {
  hypotheses: Hypothesis[];
  experiments: Experiment[];
  findings: EvidenceItem[];
}) {
  const [nextStep, setNextStep] = useState<NextStep>(DEMO_NEXT_STEPS[0]);

  const supported = hypotheses.filter((h) => h.status === "Supported");
  const rejected = hypotheses.filter((h) => h.status === "Rejected");
  const inconclusive = hypotheses.filter((h) => h.status === "Inconclusive");
  const testing = hypotheses.filter((h) => h.status === "Testing" || h.status === "Ready to Test");

  return (
    <section className="border border-line bg-panel">
      <header className="border-b border-line px-4 py-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Validation Summary</p>
        <p className="mt-1 text-[11.5px] text-muted">Presentation of mock information — no automated go/no-go verdict.</p>
      </header>
      <div className="grid gap-px bg-line lg:grid-cols-2">
        <article className="bg-panel px-4 py-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Hypotheses</p>
          <div className="mt-3 space-y-2">
            {hypotheses.map((h) => (
              <div key={h.id} className="flex items-center justify-between border border-line px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-[12px] text-fg">{h.title}</p>
                  <p className="text-[11px] text-faint">{h.category}</p>
                </div>
                <ValidationStatusBadge status={h.status} />
              </div>
            ))}
          </div>
        </article>
        <article className="bg-panel px-4 py-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Evidence review</p>
          <div className="mt-3 space-y-3">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">Supporting</p>
              <p className="mt-1 text-[11.5px] text-muted">{supported.length === 0 ? "None yet (mock)" : supported.map((h) => h.title).join(", ")}</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">Contradictory</p>
              <p className="mt-1 text-[11.5px] text-muted">{rejected.length === 0 ? "None observed in mock set" : rejected.map((h) => h.title).join(", ")}</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">Inconclusive</p>
              <p className="mt-1 text-[11.5px] text-muted">{inconclusive.length === 0 ? "None" : inconclusive.map((h) => h.title).join(", ")}</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">Still being tested</p>
              <p className="mt-1 text-[11.5px] text-muted">{testing.map((h) => h.title).join(", ") || "None"}</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">Remaining uncertainties</p>
              <ul className="mt-1 space-y-1 text-[11.5px] text-muted">
                {hypotheses.flatMap((h) => h.unresolvedQuestions).slice(0, 4).map((q) => <li key={q}>• {q}</li>)}
              </ul>
            </div>
            <div className="border-t border-line pt-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">Manually selected next step</p>
              <select value={nextStep} onChange={(e) => setNextStep(e.target.value as NextStep)} className="mt-2 border border-line bg-panel px-2 py-1 text-[12px] text-fg">
                {DEMO_NEXT_STEPS.map((s) => <option key={s} value={s}>{s.replace("-", " ")}</option>)}
              </select>
              <p className="mt-1 text-[11px] text-faint">Local state only · not an automated recommendation</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
