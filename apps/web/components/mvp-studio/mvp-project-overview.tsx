"use client";

import type { Feature, MVPProject } from "@/lib/mvp-studio/types";

/**
 * Compact project overview: what this MVP is, plus the handful of numbers that
 * describe its shape. Deliberately not a metrics wall.
 */
export function MVPProjectOverview({
  project,
  features,
}: {
  project: MVPProject;
  features: Feature[];
}) {
  const total = features.length;
  const inMvp = features.filter((f) => f.scope === "Must Have").length;
  const inProgress = features.filter((f) => f.status === "In Progress").length;
  const completed = features.filter((f) => f.status === "Completed").length;
  const ready = features.filter((f) => f.status === "Ready").length;

  const rows = [
    { label: "Proposed features", value: total, hint: "In the backlog", tone: "text-fg" },
    { label: "Included in MVP", value: inMvp, hint: "Must have", tone: "text-fg" },
    { label: "In progress", value: inProgress, hint: "Being built now", tone: "text-fg" },
    { label: "Completed", value: completed, hint: "Done", tone: "text-accent" },
  ];

  return (
    <section className="border border-line bg-panel shadow-[var(--elevation-lift)]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line/80 px-5 py-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
            MVP overview
          </p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
            Project scope and progress snapshot.
          </p>
        </div>
        <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
          <span className="text-fg">{project.ref}</span>
          <span aria-hidden className="size-0.5 bg-line-2" />
          <span className="border border-accent/25 bg-accent-tint px-2 py-1 text-accent">
            {project.status}
          </span>
        </p>
      </header>

      <div className="grid gap-px bg-line lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <article className="bg-panel px-5 py-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">Project</p>
          <h2 className="mt-2 text-[1.5rem] font-medium leading-tight tracking-[-0.035em] text-fg">
            {project.name}
          </h2>
          <p className="mt-2 max-w-[62ch] text-[12.5px] leading-relaxed text-muted">
            {project.concept}
          </p>

          <dl className="mt-5 grid gap-x-6 gap-y-4 border-t border-line/70 pt-4 sm:grid-cols-2">
            <div>
              <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                Target audience
              </dt>
              <dd className="mt-1.5 text-[12.5px] leading-snug text-fg">{project.targetAudience}</dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                Current MVP scope
              </dt>
              <dd className="mt-1.5 text-[12.5px] leading-snug text-fg">{project.currentScope}</dd>
            </div>
          </dl>
        </article>

        <article className="bg-panel px-5 py-5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
              Feature counts
            </p>
            <p className="border border-line bg-bg/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-accent">
              {ready} ready
            </p>
          </div>

          <dl className="mt-4 space-y-3.5">
            {rows.map((row) => (
              <div key={row.label}>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-[12px] text-muted">{row.label}</dt>
                  <dd className={`font-mono text-[13px] font-medium tabular-nums ${row.tone}`}>
                    {row.value}
                  </dd>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <div aria-hidden className="h-1 flex-1 bg-line" role="presentation">
                    <div
                      className={`h-full ${row.label === "Completed" ? "bg-mint" : "bg-accent/60"}`}
                      style={{
                        width: `${total === 0 ? 0 : Math.round((row.value / total) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="w-24 shrink-0 text-right font-mono text-[9px] uppercase tracking-[0.1em] text-faint">
                    {row.hint}
                  </span>
                </div>
              </div>
            ))}
          </dl>

          <p className="mt-4 border-t border-line/70 pt-3 font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-faint">
            {total === 0
              ? "No features proposed yet"
              : `${completed} of ${total} features complete · presentational counts`}
          </p>
        </article>
      </div>
    </section>
  );
}
