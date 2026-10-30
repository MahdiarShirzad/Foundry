"use client";

import type { MVPProject, ScopeCategory, ScopeItem } from "@/lib/mvp-studio/types";
import { SCOPE_CATEGORIES } from "@/lib/mvp-studio/types";

import { MVPStudioEmptyState } from "../badges";
import { SectionPanel } from "../primitives";

/**
 * Scope workspace: what the first release includes, what is planned for later,
 * and what is explicitly excluded — plus the written scope definition.
 */
export function MVPScopeWorkspace({
  project,
  items,
  onMove,
  onOpenDefinition,
}: {
  project: MVPProject;
  items: ScopeItem[];
  onMove: (item: ScopeItem, category: ScopeCategory) => void;
  onOpenDefinition: () => void;
}) {
  const columns = SCOPE_CATEGORIES.map((category) => ({
    ...category,
    list: items.filter((item) => item.category === category.value),
  }));

  const definition = [
    {
      term: "MVP objective",
      detail: project.mvpObjective,
      list: null as string[] | null,
    },
    {
      term: "Essential capabilities",
      detail: "",
      list: project.essentialCapabilities as readonly string[],
    },
    {
      term: "Success criteria",
      detail: "",
      list: project.successCriteria as readonly string[],
    },
  ];

  return (
    <SectionPanel
      title="MVP Scope"
      subtitle={`What ${project.name} will and will not include in the first release`}
      action={
        <button
          type="button"
          onClick={onOpenDefinition}
          className="border border-accent/70 bg-mint-tint/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent transition-colors hover:bg-mint-tint"
        >
          Define MVP Scope
        </button>
      }
      footer={
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
          Moving an item changes this preview only · no scope rule or validation runs against it
        </p>
      }
    >
      {/* ------------------------------------------------- written definition */}
      <div className="grid gap-px border-b border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
        {definition.map((block) => (
          <article key={block.term} className="bg-panel px-4 py-3.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
              {block.term}
            </p>
            {block.detail ? (
              <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{block.detail}</p>
            ) : null}
            {block.list ? (
              <ul className="mt-1.5 space-y-1">
                {block.list.map((entry) => (
                  <li key={entry} className="flex gap-2 text-[12px] leading-snug text-muted">
                    <span aria-hidden className="mt-[6px] size-1 shrink-0 bg-mint" />
                    <span>{entry}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
        <article className="bg-panel px-4 py-3.5">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-danger">
            Explicit exclusions
          </p>
          <ul className="mt-1.5 space-y-1">
            {project.explicitExclusions.map((entry) => (
              <li key={entry} className="flex gap-2 text-[12px] leading-snug text-muted">
                <span aria-hidden className="mt-[6px] size-1 shrink-0 bg-danger" />
                <span>{entry}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>

      {/* ---------------------------------------------------------- columns */}
      {items.length === 0 ? (
        <MVPStudioEmptyState
          title="Empty MVP scope"
          description="Nothing has been classified for this release yet. Define the scope to decide what belongs in the first version."
          action={
            <button
              type="button"
              onClick={onOpenDefinition}
              className="border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
            >
              Define MVP Scope
            </button>
          }
        />
      ) : (
        <div className="grid gap-px bg-line lg:grid-cols-3">
          {columns.map((column) => (
            <article key={column.value} className="bg-panel px-4 py-4">
              <header className="flex items-baseline justify-between gap-3">
                <p
                  className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
                    column.value === "included" ? "text-fg" : "text-faint"
                  }`}
                >
                  {column.label}
                </p>
                <p className="font-mono text-[10px] tabular-nums text-faint">
                  {column.list.length}
                </p>
              </header>

              {column.list.length === 0 ? (
                <p className="mt-3 border border-dashed border-line px-3 py-4 text-center text-[11.5px] text-faint">
                  Nothing here yet
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {column.list.map((item) => (
                    <li key={item.id} className="border border-line px-3 py-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="min-w-0 text-[12.5px] font-medium text-fg">{item.name}</p>
                        {item.featureId ? (
                          <span
                            title="Backlog feature"
                            className="shrink-0 border border-line px-1.5 py-[2px] font-mono text-[10px] uppercase tracking-[0.12em] text-faint"
                          >
                            feature
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-[11.5px] leading-snug text-muted">
                        {item.explanation}
                      </p>

                      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                          <span
                            aria-hidden
                            className={`size-1.5 ${
                              item.status === "confirmed"
                                ? "bg-mint"
                                : item.status === "under review"
                                  ? "bg-danger"
                                  : "bg-line-2"
                            }`}
                          />
                          {item.status}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <label
                            htmlFor={`mvp-move-${item.id}`}
                            className="sr-only"
                          >
                            Move {item.name} to another scope category
                          </label>
                          <select
                            id={`mvp-move-${item.id}`}
                            value={item.category}
                            onChange={(event) =>
                              onMove(item, event.target.value as ScopeCategory)
                            }
                            className="h-7 min-w-0 border border-line bg-panel px-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-faint outline-none transition-colors hover:border-accent hover:text-accent focus:border-accent"
                          >
                            {SCOPE_CATEGORIES.map((option) => (
                              <option key={option.value} value={option.value}>
                                Move → {option.shortLabel}
                              </option>
                            ))}
                          </select>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      )}
    </SectionPanel>
  );
}
