"use client";

import { useMemo, useState } from "react";

import type { Feature, FeatureScope, FeatureStatus } from "@/lib/mvp-studio/types";
import { FEATURE_PRIORITIES, FEATURE_SCOPE, FEATURE_STATUSES } from "@/lib/mvp-studio/types";

import {
  FeaturePriorityBadge,
  FeatureScopeBadge,
  FeatureStatusBadge,
  MVPStudioEmptyState,
} from "../badges";
import { SectionPanel } from "../primitives";

type Filters = { query: string; priority: string; status: string; scope: string };

const CLEAR: Filters = { query: "", priority: "all", status: "all", scope: "all" };

function filterActive(filters: Filters) {
  return (
    filters.query.trim() !== "" ||
    filters.priority !== "all" ||
    filters.status !== "all" ||
    filters.scope !== "all"
  );
}

/**
 * Feature backlog: filterable list on the left, selected-feature detail on the
 * right. Filtering and status/scope changes are local UI state only.
 */
export function FeatureBacklog({
  features,
  onPatch,
  onAddFeature,
}: {
  features: Feature[];
  onPatch: (id: string, patch: Partial<Feature>) => void;
  onAddFeature: () => void;
}) {
  const [filters, setFilters] = useState<Filters>(CLEAR);
  const [selectedId, setSelectedId] = useState<string | null>(features[0]?.id ?? null);

  const filtered = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return features.filter((f) => {
      const matchesQuery =
        query === ""
          ? true
          : `${f.name} ${f.description} ${f.area}`.toLowerCase().includes(query);
      const matchesPriority =
        filters.priority === "all" ? true : f.priority === filters.priority;
      const matchesStatus = filters.status === "all" ? true : f.status === filters.status;
      const matchesScope = filters.scope === "all" ? true : f.scope === filters.scope;
      return matchesQuery && matchesPriority && matchesStatus && matchesScope;
    });
  }, [features, filters]);

  const selected =
    filtered.find((f) => f.id === selectedId) ?? filtered[0] ?? features.find((f) => f.id === selectedId) ?? null;

  if (features.length === 0) {
    return (
      <SectionPanel title="Feature Backlog" subtitle="No proposed features yet">
        <MVPStudioEmptyState
          title="Empty feature backlog"
          description="Nothing has been proposed for this MVP yet. Add the first feature to start defining what the first version will do."
          action={
            <button
              type="button"
              onClick={onAddFeature}
              className="border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
            >
              Add Feature
            </button>
          }
        />
      </SectionPanel>
    );
  }

  return (
    <SectionPanel
      title="Feature Backlog"
      subtitle={
        filtered.length === features.length
          ? `${features.length} proposed features`
          : `${filtered.length} of ${features.length} features match`
      }
      action={
        <button
          type="button"
          onClick={onAddFeature}
          className="border border-accent/70 bg-mint-tint/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent transition-colors hover:bg-mint-tint"
        >
          + Add Feature
        </button>
      }
    >
      <div className="grid gap-px bg-line lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)]">
        {/* ------------------------------------------------------------ list */}
        <div className="bg-panel">
          <div className="space-y-2 border-b border-line px-4 py-3">
            <div className="relative">
              <label htmlFor="mvp-feature-search" className="sr-only">
                Search features
              </label>
              <input
                id="mvp-feature-search"
                type="search"
                value={filters.query}
                onChange={(event) => setFilters({ ...filters, query: event.target.value })}
                placeholder="Search features, areas…"
                className="h-8 w-full border border-line bg-panel px-2.5 pr-8 text-[12px] text-fg outline-none transition-colors placeholder:text-faint focus:border-accent"
              />
              {filters.query ? (
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, query: "" })}
                  aria-label="Clear search"
                  className="absolute right-1 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center text-faint transition-colors hover:text-accent"
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden className="fill-none stroke-current stroke-[1.4]">
                    <path d="m2 2 8 8M10 2l-8 8" strokeLinecap="square" />
                  </svg>
                </button>
              ) : null}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <label className="sr-only" htmlFor="mvp-filter-priority">
                Priority filter
              </label>
              <select
                id="mvp-filter-priority"
                value={filters.priority}
                onChange={(event) => setFilters({ ...filters, priority: event.target.value })}
                className={`h-8 min-w-0 border bg-panel px-1.5 font-mono text-[10px] uppercase tracking-[0.1em] outline-none transition-colors focus:border-accent ${
                  filters.priority === "all" ? "border-line text-faint" : "border-accent/60 text-accent"
                }`}
              >
                <option value="all">Priority</option>
                {FEATURE_PRIORITIES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>

              <label className="sr-only" htmlFor="mvp-filter-status">
                Status filter
              </label>
              <select
                id="mvp-filter-status"
                value={filters.status}
                onChange={(event) => setFilters({ ...filters, status: event.target.value })}
                className={`h-8 min-w-0 border bg-panel px-1.5 font-mono text-[10px] uppercase tracking-[0.1em] outline-none transition-colors focus:border-accent ${
                  filters.status === "all" ? "border-line text-faint" : "border-accent/60 text-accent"
                }`}
              >
                <option value="all">Status</option>
                {FEATURE_STATUSES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>

              <label className="sr-only" htmlFor="mvp-filter-scope">
                Scope filter
              </label>
              <select
                id="mvp-filter-scope"
                value={filters.scope}
                onChange={(event) => setFilters({ ...filters, scope: event.target.value })}
                className={`h-8 min-w-0 border bg-panel px-1.5 font-mono text-[10px] uppercase tracking-[0.1em] outline-none transition-colors focus:border-accent ${
                  filters.scope === "all" ? "border-line text-faint" : "border-accent/60 text-accent"
                }`}
              >
                <option value="all">Scope</option>
                {FEATURE_SCOPE.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            {filterActive(filters) ? (
              <button
                type="button"
                onClick={() => setFilters(CLEAR)}
                className="flex w-full items-center justify-center gap-2 border border-line px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-faint transition-colors hover:border-accent hover:text-accent"
              >
                Clear filters
              </button>
            ) : null}
          </div>

          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                No matching results
              </p>
              <p className="mx-auto mt-2 max-w-[34ch] text-[12px] leading-relaxed text-muted">
                No feature matches the current search and filters.
              </p>
              <button
                type="button"
                onClick={() => setFilters(CLEAR)}
                className="mt-3 border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <ul className="max-h-[34rem] overflow-y-auto">
              {filtered.map((f) => {
                const active = f.id === selected?.id;
                return (
                  <li key={f.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(f.id)}
                      aria-current={active ? "true" : undefined}
                      className={`w-full border-b border-line px-4 py-3 text-left transition-colors ${
                        active ? "bg-mint-tint/40" : "hover:bg-mint-tint/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[12.5px] font-medium text-fg">{f.name}</p>
                        <FeatureStatusBadge status={f.status} />
                      </div>
                      <p className="mt-1 line-clamp-2 text-[11.5px] leading-snug text-muted">
                        {f.description}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <FeaturePriorityBadge priority={f.priority} />
                        <FeatureScopeBadge scope={f.scope} />
                        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                          {f.area}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* --------------------------------------------------------- detail */}
        <div className="bg-panel">
          {selected ? (
            <article className="flex h-full flex-col">
              <header className="border-b border-line px-4 py-4 sm:px-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                      Feature detail
                    </p>
                    <h3 className="mt-2 text-[clamp(1.15rem,2vw,1.45rem)] font-medium tracking-[-0.03em] text-fg">
                      {selected.name}
                    </h3>
                    <p className="mt-1 text-[11.5px] text-muted">
                      {selected.targetUser} · {selected.area}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <FeaturePriorityBadge priority={selected.priority} />
                    <FeatureScopeBadge scope={selected.scope} />
                    <FeatureStatusBadge status={selected.status} />
                  </div>
                </div>
              </header>

              <div className="flex-1 space-y-5 px-4 py-4 sm:px-6 sm:py-5">
                <div className="grid gap-3 border border-line px-3 py-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                      Status
                    </span>
                    <select
                      value={selected.status}
                      onChange={(event) =>
                        onPatch(selected.id, {
                          status: event.target.value as FeatureStatus,
                        })
                      }
                      className="mt-1.5 h-8 w-full border border-line bg-panel px-2 text-[12px] text-fg outline-none transition-colors focus:border-accent"
                    >
                      {FEATURE_STATUSES.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                      Scope classification
                    </span>
                    <select
                      value={selected.scope}
                      onChange={(event) =>
                        onPatch(selected.id, { scope: event.target.value as FeatureScope })
                      }
                      className="mt-1.5 h-8 w-full border border-line bg-panel px-2 text-[12px] text-fg outline-none transition-colors focus:border-accent"
                    >
                      {FEATURE_SCOPE.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                    Description
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-fg">
                    {selected.description}
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                    User problem
                  </p>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
                    {selected.userProblem}
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                    User story
                  </p>
                  <p className="mt-1.5 border-l-2 border-accent/50 pl-3 text-[12.5px] italic leading-relaxed text-fg">
                    {selected.userStory}
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                    Acceptance criteria · {selected.acceptanceCriteria.length}
                  </p>
                  <ul className="mt-1.5 space-y-1.5">
                    {selected.acceptanceCriteria.map((criterion) => (
                      <li key={criterion} className="flex gap-2.5 text-[12.5px] text-muted">
                        <span aria-hidden className="mt-[6px] size-1.5 shrink-0 bg-mint" />
                        <span className="leading-relaxed">{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="border-t border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-faint sm:px-6">
                Status and scope changes are local UI state · nothing is persisted
              </p>
            </article>
          ) : (
            <MVPStudioEmptyState
              title="No feature selected"
              description="Choose a feature from the backlog to inspect its problem, story and acceptance criteria."
            />
          )}
        </div>
      </div>
    </SectionPanel>
  );
}
