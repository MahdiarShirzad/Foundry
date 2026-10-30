"use client";

import { useState } from "react";

import type {
  EvidenceItem,
  Experiment,
  Hypothesis,
  HypothesisStatus,
  NextStep,
  ValidationIdea,
} from "@/lib/validation-lab/types";
import { DEMO_NEXT_STEPS } from "@/lib/validation-lab/demo";

import { ValidationStatusBadge } from "../badges";

const STATUS_TONE: Record<string, string> = {
  Supported: "border-mint/70",
  Rejected: "border-danger/60",
  Inconclusive: "border-line-2",
  Testing: "border-accent/60",
  "Ready to Test": "border-accent/40",
  Unexamined: "border-line",
};

function Group({
  label,
  tone,
  items,
  empty,
}: {
  label: string;
  tone: string;
  items: { id: string; title: string; meta?: string }[];
  empty: string;
}) {
  return (
    <div className={`border-l-2 ${tone} pl-3`}>
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">{label}</p>
      {items.length === 0 ? (
        <p className="mt-2 text-[11.5px] italic text-faint">{empty}</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="border border-line px-3 py-2">
              <p className="text-[12.5px] text-fg">{item.title}</p>
              {item.meta ? (
                <p className="mt-0.5 text-[11px] text-muted">{item.meta}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ValidationSummary({
  idea,
  hypotheses,
  experiments,
  findings,
}: {
  idea: ValidationIdea;
  hypotheses: Hypothesis[];
  experiments: Experiment[];
  findings: EvidenceItem[];
}) {
  const [nextStep, setNextStep] = useState<NextStep>(DEMO_NEXT_STEPS[0]);

  function hypothesisOf(id: string) {
    return hypotheses.find((h) => h.id === id) ?? null;
  }

  function findingsWithStatus(statuses: HypothesisStatus[]) {
    return findings
      .filter((f) => {
        const hypothesis = hypothesisOf(f.relatedHypothesisId);
        return hypothesis ? statuses.includes(hypothesis.status) : false;
      })
      .map((f) => ({
        id: f.id,
        title: f.title,
        meta: `${f.type} · ${f.date} · ${hypothesisOf(f.relatedHypothesisId)?.title ?? "unlinked"}`,
      }));
  }

  const supported = hypotheses.filter((h) => h.status === "Supported");
  const rejected = hypotheses.filter((h) => h.status === "Rejected");
  const inconclusive = hypotheses.filter((h) => h.status === "Inconclusive");
  const open = hypotheses.filter(
    (h) => h.status === "Unexamined" || h.status === "Ready to Test" || h.status === "Testing",
  );

  const questions = hypotheses.flatMap((h) =>
    h.unresolvedQuestions.map((q) => ({ id: `${h.id}-${q}`, title: q, meta: h.title })),
  );
  const unlinkedFindings = findings.filter(
    (f) => !hypotheses.some((h) => h.id === f.relatedHypothesisId),
  );

  const groups = [
    {
      label: "Supporting evidence",
      tone: STATUS_TONE.Supported,
      items: findingsWithStatus(["Supported"]),
      empty: "No findings linked to a supported hypothesis yet.",
    },
    {
      label: "Contradictory evidence",
      tone: STATUS_TONE.Rejected,
      items: findingsWithStatus(["Rejected"]),
      empty: "No findings recorded against a rejected hypothesis.",
    },
    {
      label: "Inconclusive findings",
      tone: STATUS_TONE.Inconclusive,
      items: findingsWithStatus(["Inconclusive"]),
      empty: "Nothing recorded as inconclusive.",
    },
    {
      label: "Evidence on open hypotheses",
      tone: STATUS_TONE.Testing,
      items: findingsWithStatus(["Testing", "Ready to Test", "Unexamined"]),
      empty: "No findings attached to hypotheses still open.",
    },
  ];

  return (
    <section className="border border-line bg-panel" aria-label="Validation summary">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
            Validation Summary
          </p>
          <p className="mt-1 text-[11.5px] text-muted">
            {idea.name} · a written review of the current state, not an automatic verdict
          </p>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
          {hypotheses.length} hypotheses · {findings.length} findings · {experiments.length}{" "}
          experiments
        </p>
      </header>

      <div className="grid gap-px bg-line lg:grid-cols-2">
        <article className="bg-panel px-4 py-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
            Hypotheses and current statuses
          </p>
          <div className="mt-3 space-y-2">
            {hypotheses.length === 0 ? (
              <p className="text-[11.5px] italic text-faint">No hypotheses documented yet.</p>
            ) : (
              hypotheses.map((h) => (
                <div
                  key={h.id}
                  className={`border border-line border-l-2 ${STATUS_TONE[h.status] ?? "border-line"} px-3 py-2`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-medium text-fg">{h.title}</p>
                      <p className="mt-0.5 text-[11px] text-muted">
                        {h.category} · {h.importance} importance
                      </p>
                    </div>
                    <ValidationStatusBadge status={h.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="bg-panel px-4 py-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
            Evidence review by assessment
          </p>
          <div className="mt-3 space-y-4">
            {groups.map((group) => (
              <Group key={group.label} {...group} />
            ))}
            {unlinkedFindings.length > 0 ? (
              <Group
                label="Findings without a hypothesis"
                tone="border-line"
                items={unlinkedFindings.map((f) => ({
                  id: f.id,
                  title: f.title,
                  meta: `${f.type} · ${f.date}`,
                }))}
                empty=""
              />
            ) : null}
          </div>
        </article>

        <article className="bg-panel px-4 py-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
            Remaining uncertainties
          </p>
          <div className="mt-3 space-y-3">
            <div>
              <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
                Hypotheses still open
              </p>
              <p className="mt-1 text-[12px] text-muted">
                {open.length === 0
                  ? "Every hypothesis has been assessed."
                  : open.map((h) => h.title).join(" · ")}
              </p>
            </div>
            <div>
              <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
                Assessments on record
              </p>
              <p className="mt-1 flex flex-wrap gap-2">
                <span className="border border-mint/70 px-2 py-[3px] font-mono text-[8.5px] uppercase tracking-[0.13em] text-fg">
                  {supported.length} supported
                </span>
                <span className="border border-danger/60 px-2 py-[3px] font-mono text-[8.5px] uppercase tracking-[0.13em] text-fg">
                  {rejected.length} rejected
                </span>
                <span className="border border-line-2 px-2 py-[3px] font-mono text-[8.5px] uppercase tracking-[0.13em] text-fg">
                  {inconclusive.length} inconclusive
                </span>
              </p>
            </div>
            <div className="border-t border-line pt-3">
              <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
                Manually selected next step
              </p>
              <label htmlFor="vl-next-step" className="sr-only">
                Next validation step
              </label>
              <select
                id="vl-next-step"
                value={nextStep}
                onChange={(event) => setNextStep(event.target.value as NextStep)}
                className="mt-2 w-full border border-line bg-panel px-2 py-2 text-[16px] text-fg outline-none transition-colors hover:border-line-2 focus:border-accent sm:w-auto sm:text-[12.5px]"
              >
                {DEMO_NEXT_STEPS.map((step) => (
                  <option key={step} value={step}>
                    {step}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
                Chosen by you · never recommended by the interface
              </p>
            </div>
          </div>
        </article>

        <article className="bg-panel px-4 py-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
            Questions that still need investigation
          </p>
          <ul className="mt-3 space-y-2">
            {questions.length === 0 ? (
              <li className="text-[11.5px] italic text-faint">
                No open questions recorded against these hypotheses.
              </li>
            ) : (
              questions.slice(0, 8).map((question) => (
                <li key={question.id} className="flex gap-2 border border-line px-3 py-2">
                  <span aria-hidden className="mt-[7px] size-1 shrink-0 bg-accent" />
                  <span className="min-w-0">
                    <span className="block text-[12.5px] text-fg">{question.title}</span>
                    <span className="mt-0.5 block font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
                      {question.meta}
                    </span>
                  </span>
                </li>
              ))
            )}
          </ul>
        </article>
      </div>

      <footer className="border-t border-line px-4 py-3">
        <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
          Statuses are labels recorded by the founder · no go/no-go decision, confidence score, or
          viability verdict is generated here
        </p>
      </footer>
    </section>
  );
}
