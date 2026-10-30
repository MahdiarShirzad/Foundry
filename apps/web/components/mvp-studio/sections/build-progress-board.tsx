"use client";

import { motion, useReducedMotion } from "motion/react";

import type { Feature, FeatureStatus } from "@/lib/mvp-studio/types";
import { BUILD_COLUMNS } from "@/lib/mvp-studio/types";

import { FeaturePriorityBadge, MVPStudioEmptyState } from "../badges";
import { SectionPanel } from "../primitives";

/**
 * Build progress board: five presentational columns with accessible move
 * controls. It tracks status labels only — no git, CI, or deployment logic.
 */
export function BuildProgressBoard({
  features,
  onMoveStatus,
  onAddFeature,
}: {
  features: Feature[];
  onMoveStatus: (id: string, status: FeatureStatus) => void;
  onAddFeature: () => void;
}) {
  const reduce = useReducedMotion();
  const order = BUILD_COLUMNS.map((column) => column.status);

  if (features.length === 0) {
    return (
      <SectionPanel title="Build Progress" subtitle="Nothing to track yet">
        <MVPStudioEmptyState
          title="Empty build progress board"
          description="Once features are proposed they appear here and move across columns as their status changes."
          action={
            <button
              type="button"
              onClick={onAddFeature}
              className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
            >
              Add Feature
            </button>
          }
        />
      </SectionPanel>
    );
  }

  const completed = features.filter((f) => f.status === "Completed").length;

  return (
    <SectionPanel
      title="Build Progress"
      subtitle="Feature implementation status across the workspace"
      footer={
        <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
          Presentational feature tracking · no git, CI, deployment or task synchronization
        </p>
      }
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-line px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
        <span>
          <span className="text-fg">{features.length}</span> features
        </span>
        <span aria-hidden className="size-0.5 bg-line-2" />
        <span>
          <span className="text-fg">{completed}</span> completed
        </span>
        <span aria-hidden className="size-0.5 bg-line-2" />
        <span>
          <span className="text-fg">
            {Math.round((completed / features.length) * 100)}%
          </span>{" "}
          of the board done
        </span>
      </div>

      <div className="grid gap-px bg-line sm:grid-cols-2 xl:grid-cols-5">
        {BUILD_COLUMNS.map((column, columnIndex) => {
          const list = features.filter((f) => f.status === column.status);
          return (
            <article key={column.key} className="flex flex-col bg-panel">
              <header className="flex items-baseline justify-between gap-2 border-b border-line px-3 py-2">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                  {column.title}
                </p>
                <p className="font-mono text-[9px] tabular-nums text-fg">{list.length}</p>
              </header>

              <div className="flex-1 space-y-2 p-2">
                {list.length === 0 ? (
                  <p className="border border-dashed border-line px-2 py-4 text-center text-[11px] text-faint">
                    No features
                  </p>
                ) : null}

                {list.map((f) => {
                  const canPrev = columnIndex > 0;
                  const canNext = columnIndex < BUILD_COLUMNS.length - 1;
                  return (
                    <motion.div
                      key={f.id}
                      layoutId={reduce ? undefined : f.id}
                      layout={reduce ? false : "position"}
                      transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="border border-line px-3 py-2.5"
                    >
                      <p className="text-[12.5px] font-medium leading-snug text-fg">{f.name}</p>
                      <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted">
                        {f.description}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <FeaturePriorityBadge priority={f.priority} />
                        <span className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-faint">
                          {f.area}
                        </span>
                      </div>

                      <div className="mt-2.5 flex items-center gap-1.5 border-t border-line pt-2">
                        <button
                          type="button"
                          disabled={!canPrev}
                          onClick={() =>
                            onMoveStatus(f.id, order[Math.max(0, columnIndex - 1)])
                          }
                          aria-label={`Move ${f.name} to ${BUILD_COLUMNS[Math.max(0, columnIndex - 1)].title}`}
                          className="flex h-6 flex-1 items-center justify-center border border-line font-mono text-[9px] text-faint transition-colors enabled:hover:border-accent enabled:hover:text-accent disabled:opacity-35"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          disabled={!canNext}
                          onClick={() =>
                            onMoveStatus(
                              f.id,
                              order[Math.min(order.length - 1, columnIndex + 1)],
                            )
                          }
                          aria-label={`Move ${f.name} to ${BUILD_COLUMNS[Math.min(BUILD_COLUMNS.length - 1, columnIndex + 1)].title}`}
                          className="flex h-6 flex-1 items-center justify-center border border-line font-mono text-[9px] text-faint transition-colors enabled:hover:border-accent enabled:hover:text-accent disabled:opacity-35"
                        >
                          →
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </SectionPanel>
  );
}
