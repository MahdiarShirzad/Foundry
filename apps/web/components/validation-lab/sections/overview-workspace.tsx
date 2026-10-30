"use client";

import type { EvidenceItem, Experiment, Hypothesis, ValidationIdea } from "@/lib/validation-lab/types";

import { ValidationStatusBadge } from "../badges";

function PanelLabel({ children, tone = "faint" }: { children: React.ReactNode; tone?: "faint" | "belief" | "evidence" }) {
  const toneClass =
    tone === "belief"
      ? "text-accent"
      : tone === "evidence"
        ? "text-mint"
        : "text-faint";
  const marker =
    tone === "belief"
      ? "border border-dashed border-accent/70"
      : tone === "evidence"
        ? "bg-mint"
        : "bg-line-2";
  return (
    <p className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] ${toneClass}`}>
      <span aria-hidden className={`size-1.5 ${marker}`} />
      {children}
    </p>
  );
}

function EmptyLine({ children }: { children: React.ReactNode }) {
  return <p className="text-[11.5px] italic text-faint">{children}</p>;
}

/**
 * Section A of the workspace: what the founder believes, kept visually apart
 * from what the recorded evidence actually shows. Nothing here is derived into
 * a recommendation.
 */
export function OverviewWorkspace({
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
  const unresolved = hypotheses.filter(
    (h) => h.importance === "High" && h.status !== "Supported" && h.status !== "Rejected",
  );
  const openQuestions = hypotheses.flatMap((h) => h.unresolvedQuestions);
  const supported = hypotheses.filter((h) => h.status === "Supported");
  const rejected = hypotheses.filter((h) => h.status === "Rejected");

  return (
    <section className="border border-line bg-panel" aria-label="Validation overview">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">Overview</p>
          <p className="mt-1 text-[11.5px] text-muted">
            {idea.name} · current validation effort at a glance
          </p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
          {hypotheses.some((h) => h.status === "Testing") ? "Actively testing" : "Awaiting tests"}
        </p>
      </header>

      <div className="grid gap-px bg-line lg:grid-cols-2">
        <article className="bg-panel px-4 py-4">
          <PanelLabel tone="belief">Belief · assumption under investigation</PanelLabel>
          <p className="mt-2 border-l-2 border-accent/60 pl-3 text-[12.5px] leading-relaxed text-fg">
            {idea.assumption}
          </p>
          <p className="mt-3 text-[11.5px] leading-relaxed text-muted">
            This is what the founder currently believes. It is written down so evidence can be
            compared against it — the interface does not score or confirm it.
          </p>
        </article>

        <article className="bg-panel px-4 py-4">
          <PanelLabel tone="evidence">Evidence · what has actually been recorded</PanelLabel>
          {findings.length === 0 ? (
            <div className="mt-2">
              <EmptyLine>No findings recorded yet for this idea.</EmptyLine>
            </div>
          ) : (
            <div className="mt-2 space-y-2">
              <p className="text-[12.5px] leading-relaxed text-fg">
                {findings.length} finding{findings.length === 1 ? "" : "s"} documented · {supported.length} hypotheses marked supported · {rejected.length} marked rejected.
              </p>
              <ul className="space-y-1.5">
                {findings.slice(0, 3).map((f) => (
                  <li key={f.id} className="flex items-baseline gap-2 text-[11.5px] text-muted">
                    <span aria-hidden className="size-1 shrink-0 translate-y-[-1px] bg-mint" />
                    <span className="min-w-0">
                      {f.title} <span className="text-faint">· {f.date}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>

        <article className="bg-panel px-4 py-4">
          <PanelLabel>Most important unresolved hypotheses</PanelLabel>
          <div className="mt-2 space-y-2">
            {unresolved.length === 0 ? (
              <EmptyLine>Nothing high-risk is waiting for a test right now.</EmptyLine>
            ) : (
              unresolved.slice(0, 4).map((h) => (
                <div key={h.id} className="border border-line px-3 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[12px] font-medium text-fg">{h.title}</p>
                    <ValidationStatusBadge status={h.status} />
                  </div>
                  <p className="mt-1 text-[11px] text-muted">{h.category}</p>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="bg-panel px-4 py-4">
          <PanelLabel>Recent experiment activity</PanelLabel>
          <div className="mt-2 space-y-2">
            {experiments.length === 0 ? (
              <EmptyLine>No experiments designed for this idea yet.</EmptyLine>
            ) : (
              experiments.slice(0, 4).map((e) => (
                <div key={e.id} className="border border-line px-3 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[12px] font-medium text-fg">{e.title}</p>
                    <ValidationStatusBadge status={e.status} />
                  </div>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                    {e.method} · starts {e.startDate}
                  </p>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="bg-panel px-4 py-4 lg:col-span-2">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <PanelLabel>Open questions</PanelLabel>
              <ul className="mt-2 space-y-1.5 text-[12px] text-muted">
                {openQuestions.length === 0 ? (
                  <li>
                    <EmptyLine>No open questions recorded yet.</EmptyLine>
                  </li>
                ) : (
                  openQuestions.slice(0, 5).map((q) => (
                    <li key={q} className="flex gap-2">
                      <span aria-hidden className="mt-[7px] size-1 shrink-0 bg-line-2" />
                      <span>{q}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div>
              <PanelLabel>Next validation tasks</PanelLabel>
              <ul className="mt-2 space-y-1.5 text-[12px] text-muted">
                {idea.nextTasks.map((task) => (
                  <li key={task} className="flex gap-2">
                    <span aria-hidden className="mt-[7px] size-1 shrink-0 bg-accent" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                Written down by the founder · not generated by the interface
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
