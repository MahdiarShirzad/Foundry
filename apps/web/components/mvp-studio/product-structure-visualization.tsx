"use client";

import type { Feature, MVPProject } from "@/lib/mvp-studio/types";

/**
 * One compact view of the product's shape: the core areas the MVP is built
 * from, how many features (and in-MVP features) sit in each, and the path from
 * entry point to primary value. Planning aid — not a system architecture.
 */
export function ProductStructureVisualization({
  project,
  features,
}: {
  project: MVPProject;
  features: Feature[];
}) {
  const areas = project.structure.areas;
  const journey = project.structure.journey;

  return (
    <section className="border border-line bg-panel">
      <header className="border-b border-line px-4 py-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
          Product Structure
        </p>
        <p className="mt-1 text-[11.5px] text-muted">
          Core areas of {project.name} and the path to its primary value
        </p>
      </header>

      <div className="grid gap-px bg-line lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <article className="bg-panel px-4 py-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
            Core product areas
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-3">
            {areas.map((area) => {
              const inArea = features.filter((f) => f.area === area.name);
              const inMvp = inArea.filter((f) => f.scope === "Must Have").length;
              return (
                <li
                  key={area.id}
                  className="flex flex-col gap-2 border border-line px-3 py-2.5"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-[12.5px] font-medium text-fg">{area.name}</p>
                    <p className="font-mono text-[9px] tabular-nums text-faint">
                      {inArea.length}
                    </p>
                  </div>
                  <p className="text-[11px] leading-snug text-muted">{area.blurb}</p>
                  <div className="mt-auto flex items-center gap-1.5 pt-1">
                    <span aria-hidden className="size-1.5 bg-mint" />
                    <span className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-faint">
                      {inMvp} in MVP
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="mt-3 border-t border-line pt-3 font-mono text-[8.5px] uppercase leading-relaxed tracking-[0.14em] text-faint">
            Areas group backlog features · counts update with scope changes
          </p>
        </article>

        <article className="bg-panel px-4 py-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
            User journey · entry point to primary value
          </p>
          <ol className="mt-3 space-y-1.5">
            {journey.map((step, index) => (
              <li key={step.step}>
                <div className="flex items-stretch gap-3">
                  <span
                    aria-hidden
                    className="flex w-6 shrink-0 items-center justify-center border border-line font-mono text-[9px] text-faint"
                  >
                    {index + 1}
                  </span>
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3 border border-line px-3 py-2">
                    <p className="truncate text-[12.5px] text-fg">{step.step}</p>
                    <p className="shrink-0 font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
                      {step.note}
                    </p>
                  </div>
                </div>
                {index < journey.length - 1 ? (
                  <div aria-hidden className="ml-3 flex h-3.5 items-center">
                    <span className="h-full w-px bg-line-2" />
                    <span className="ml-1 font-mono text-[9px] leading-none text-faint">
                      ↓
                    </span>
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
          <p className="mt-3 border-t border-line pt-3 font-mono text-[8.5px] uppercase leading-relaxed tracking-[0.14em] text-faint">
            Keep the first version focused on this path
          </p>
        </article>
      </div>
    </section>
  );
}
