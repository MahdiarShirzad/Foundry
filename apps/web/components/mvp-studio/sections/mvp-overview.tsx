"use client";

import type { Feature, MVPProject } from "@/lib/mvp-studio/types";
import { FEATURE_STATUSES } from "@/lib/mvp-studio/types";

import { FeatureScopeBadge, FeatureStatusBadge } from "../badges";
import { SectionPanel } from "../primitives";
import { ProductStructureVisualization } from "../product-structure-visualization";

const STATUS_BAR: Record<Feature["status"], string> = {
  Proposed: "bg-line-2",
  Ready: "bg-accent/45",
  "In Progress": "bg-accent",
  Completed: "bg-mint",
  Deferred: "bg-line",
};

/**
 * Overview tab: the MVP's essential context in one reading column, with the
 * critical features, open decisions and a compact build-progress read beside it.
 */
export function MVPOverview({
  project,
  features,
  onJump,
}: {
  project: MVPProject;
  features: Feature[];
  onJump: (section: "Feature Backlog" | "Build Progress" | "MVP Scope") => void;
}) {
  const total = features.length;
  const critical = features
    .filter((f) => f.priority === "Critical" || f.scope === "Must Have")
    .slice(0, 4);
  const statusCounts = FEATURE_STATUSES.map((status) => ({
    status,
    count: features.filter((f) => f.status === status).length,
  })).filter((row) => row.count > 0);

  const context: { term: string; detail: string }[] = [
    { term: "Product concept", detail: project.concept },
    { term: "Core user problem", detail: project.problem },
    { term: "Target audience", detail: project.targetAudience },
    { term: "Primary value proposition", detail: project.valueProp },
    { term: "MVP objective", detail: project.mvpObjective },
    { term: "Current scope summary", detail: project.currentScope },
  ];

  return (
    <div className="space-y-4">
      <SectionPanel
        title="Overview"
        subtitle={`Essential context for ${project.name} · ${project.ref}`}
        action={
          <button
            type="button"
            onClick={() => onJump("MVP Scope")}
            className="border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
          >
            Review scope
          </button>
        }
      >
        <div className="grid gap-px bg-line lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <article className="bg-panel">
            <dl>
              {context.map((row) => (
                <div
                  key={row.term}
                  className="border-b border-line px-4 py-3.5 last:border-b-0"
                >
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                    {row.term}
                  </dt>
                  <dd
                    className={`mt-1.5 leading-relaxed ${
                      row.term === "Product concept"
                        ? "text-[14.5px] tracking-[-0.01em] text-fg"
                        : "text-[12.5px] text-muted"
                    }`}
                  >
                    {row.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </article>

          <div className="grid gap-px bg-line">
            {/* Critical features */}
            <article className="bg-panel px-4 py-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                  Critical features
                </p>
                <button
                  type="button"
                  onClick={() => onJump("Feature Backlog")}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent transition-colors hover:text-fg"
                >
                  Backlog →
                </button>
              </div>
              {critical.length === 0 ? (
                <p className="mt-2 text-[12px] text-faint">
                  No critical features proposed yet.
                </p>
              ) : (
                <ul className="mt-2.5 divide-y divide-line border-y border-line">
                  {critical.map((f) => (
                    <li key={f.id} className="flex items-start justify-between gap-3 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-[12.5px] text-fg">{f.name}</p>
                        <p className="mt-0.5 truncate text-[11px] text-muted">{f.area}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <FeatureScopeBadge scope={f.scope} />
                        <FeatureStatusBadge status={f.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </article>

            {/* Open decisions */}
            <article className="bg-panel px-4 py-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                  Unresolved product decisions
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-danger">
                  {project.openDecisions.length} open
                </p>
              </div>
              <ol className="mt-2.5 space-y-2">
                {project.openDecisions.map((decision, index) => (
                  <li key={decision} className="flex gap-2.5">
                    <span className="mt-[3px] font-mono text-[10px] tabular-nums text-faint">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[12px] leading-snug text-muted">{decision}</p>
                  </li>
                ))}
              </ol>
            </article>

            {/* Compact build progress */}
            <article className="bg-panel px-4 py-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                  Current build progress
                </p>
                <button
                  type="button"
                  onClick={() => onJump("Build Progress")}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent transition-colors hover:text-fg"
                >
                  Board →
                </button>
              </div>

              {total === 0 ? (
                <p className="mt-2 text-[12px] text-faint">
                  No features to track yet.
                </p>
              ) : (
                <>
                  <div
                    className="mt-3 flex h-2 w-full overflow-hidden bg-line"
                    role="img"
                    aria-label={statusCounts
                      .map((row) => `${row.count} ${row.status}`)
                      .join(", ")}
                  >
                    {statusCounts.map((row) => (
                      <span
                        key={row.status}
                        className={STATUS_BAR[row.status]}
                        style={{ width: `${(row.count / total) * 100}%` }}
                      />
                    ))}
                  </div>
                  <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {statusCounts.map((row) => (
                      <li
                        key={row.status}
                        className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-faint"
                      >
                        <span
                          aria-hidden
                          className={`size-1.5 shrink-0 ${STATUS_BAR[row.status]}`}
                        />
                        <span className="truncate text-muted">{row.status}</span>
                        <span className="ml-auto tabular-nums text-fg">{row.count}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <p className="mt-3 border-t border-line pt-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-faint">
                {total === 0
                  ? "Empty backlog"
                  : `${features.filter((f) => f.status === "Completed").length} of ${total} complete · local preview counts`}
              </p>
            </article>
          </div>
        </div>
      </SectionPanel>

      <ProductStructureVisualization project={project} features={features} />
    </div>
  );
}
