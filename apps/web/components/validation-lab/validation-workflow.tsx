"use client";

import { Stepper, type StepperState } from "@/components/ui/primitives";

/**
 * Assumption → Hypothesis → Experiment → Evidence → Assessment.
 *
 * Step state is derived only from records the page already holds. With no
 * records the flow stays neutral rather than inventing progress.
 */
export function ValidationWorkflow({
  hypotheses = 0,
  experiments = 0,
  findings = 0,
}: {
  hypotheses?: number;
  experiments?: number;
  findings?: number;
}) {
  const hasHypothesis = hypotheses > 0;
  const hasExperiment = experiments > 0;
  const hasFinding = findings > 0;

  const steps: { label: string; detail: string; state: StepperState }[] = [
    {
      label: "Assumption",
      detail: "Belief to challenge",
      state: hasHypothesis ? "done" : "active",
    },
    {
      label: "Hypothesis",
      detail: "Testable statement",
      state: hasHypothesis ? (hasExperiment ? "done" : "active") : "upcoming",
    },
    {
      label: "Experiment",
      detail: "Designed test",
      state: hasExperiment ? (hasFinding ? "done" : "active") : "upcoming",
    },
    {
      label: "Evidence",
      detail: "Observations & findings",
      state: hasFinding ? "done" : hasExperiment ? "active" : "upcoming",
    },
    {
      label: "Assessment",
      detail: "Review state of evidence",
      state: hasFinding ? "active" : "upcoming",
    },
  ];

  return (
    <section
      aria-label="Validation workflow"
      className="rounded-card border border-line bg-panel px-5 py-4 shadow-card"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[14px] font-semibold tracking-[-0.01em] text-fg">
          Validation workflow
        </h2>
        <p className="text-[12.5px] text-muted">
          Assumption → Hypothesis → Experiment → Evidence → Assessment
        </p>
      </div>
      <Stepper items={steps} label="Validation workflow" className="mt-4 lg:gap-1" />
    </section>
  );
}
