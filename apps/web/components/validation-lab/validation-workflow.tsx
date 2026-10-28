"use client";

export function ValidationWorkflow() {
  const steps = [
    { label: "Assumption", detail: "Belief to challenge" },
    { label: "Hypothesis", detail: "Testable statement" },
    { label: "Experiment", detail: "Designed test" },
    { label: "Evidence", detail: "Observations & findings" },
    { label: "Assessment", detail: "Review state of evidence" },
  ];

  return (
    <section className="border border-line bg-panel">
      <header className="border-b border-line px-4 py-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Validation Workflow</p>
        <p className="mt-1 text-[11.5px] text-muted">Assumption → Hypothesis → Experiment → Evidence → Assessment</p>
      </header>
      <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((step, i) => (
          <article key={step.label} className="bg-panel px-4 py-3.5">
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Step {i + 1}</p>
              <span className="size-1.5 bg-accent" aria-hidden />
            </div>
            <p className="mt-2 text-[13px] font-medium text-fg">{step.label}</p>
            <p className="mt-1 text-[11px] text-muted">{step.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
