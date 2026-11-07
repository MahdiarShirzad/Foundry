import Eyebrow from "./eyebrow";
import WorkflowDiagram from "./workflow-diagram";

/* Desktop: a serpentine transit-style line. Top row runs left → right through
   stages 01–04, wraps, and the bottom row runs right → left through 05–08,
   with the left edge closing the loop as the insights feedback arc. */

export default function Workflow() {
  return (
    <section
      id="workflow"
      aria-labelledby="workflow-title"
      className="relative isolate scroll-mt-16 overflow-hidden border-b border-line"
    >
      {/* A cool wash pools under the plate so the diagram's surface casts into
          the field instead of sitting flat on it. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[17rem] h-[30rem] w-[62rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--accent-tint),transparent_74%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--line),transparent)]" />
      </div>

      <div className="relative px-6 py-20 sm:px-10 sm:py-28">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow>Sec. 03 — The workflow</Eyebrow>
            <h2
              id="workflow-title"
              className="mt-8 text-[clamp(1.75rem,3.4vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.03em]"
            >
              A workflow, not a checklist.
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-3">
            <p className="max-w-[54ch] text-[16.5px] leading-[1.75] text-muted">
              Capture, investigate, validate, build, plan, launch, listen, learn — then do
              it again. The workflow is iterative, not strictly linear: a failed
              experiment sends a founder back to the Idea Lab, and fresh feedback rewrites
              the roadmap.
            </p>
          </div>
        </div>

        <WorkflowDiagram />

        <div className="relative z-10 mt-8 flex flex-wrap items-baseline justify-between gap-4 border-t border-line pt-5 font-mono text-[11px] uppercase tracking-[0.22em] lg:-mt-7 lg:mx-6 lg:border lg:bg-panel lg:px-5 lg:py-4 lg:shadow-lift">
          <span className="text-faint">→ Evidence flows forward</span>
          <span className="text-accent">↺ Insights flow back</span>
        </div>
      </div>
    </section>
  );
}
