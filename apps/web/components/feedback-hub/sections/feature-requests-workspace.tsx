"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import type {
  FeatureRequest,
  FeatureRequestStatus,
  FeedbackItem,
  FeedbackPriority,
} from "@/lib/feedback-hub/types";
import { FEATURE_REQUEST_STATUSES, FEEDBACK_PRIORITIES } from "@/lib/feedback-hub/types";

import {
  FeedbackHubEmptyState,
  FeedbackPriorityBadge,
  FeedbackRequestStatusBadge,
} from "../badges";
import { Field, PanelLabel, Select, TextInput, UserContentBlock } from "../primitives";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Filters = { query: string; status: string; priority: string };
const EMPTY_FILTERS: Filters = { query: "", status: "all", priority: "all" };

export function FeatureRequestsWorkspace({
  requests,
  feedback,
  selectedId,
  onSelect,
  onStatusChange,
  onPriorityChange,
  onOpenFeedback,
}: {
  requests: FeatureRequest[];
  feedback: FeedbackItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onStatusChange: (id: string, status: FeatureRequestStatus) => void;
  onPriorityChange: (id: string, priority: FeedbackPriority) => void;
  onOpenFeedback: (id: string) => void;
}) {
  const reduce = useReducedMotion();
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const filtersActive =
    filters.query !== "" || filters.status !== "all" || filters.priority !== "all";

  const filtered = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return requests.filter((r) => {
      const matchesQuery = query
        ? `${r.title} ${r.description}`.toLowerCase().includes(query)
        : true;
      const matchesStatus = filters.status === "all" || r.status === filters.status;
      const matchesPriority = filters.priority === "all" || r.priority === filters.priority;
      return matchesQuery && matchesStatus && matchesPriority;
    });
  }, [requests, filters]);

  const selected = filtered.find((r) => r.id === selectedId) ?? filtered[0] ?? null;
  const related = selected
    ? feedback.filter((f) => selected.relatedFeedbackIds.includes(f.id))
    : [];

  if (requests.length === 0) {
    return (
      <section className="border border-line bg-panel">
        <FeedbackHubEmptyState
          title="No feature requests"
          description="Product improvement requests are recorded by hand from feedback. Nothing has been filed for this product yet."
        />
      </section>
    );
  }

  return (
    <div className="grid gap-px border border-line bg-line lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      {/* ---------------------------------------------------------- list --- */}
      <section className="min-w-0 bg-panel" aria-label="Feature requests list">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
              Feature Requests
            </p>
            <p className="mt-1 text-[11px] text-muted">
              {filtered.length === requests.length
                ? `${requests.length} requests`
                : `${filtered.length} of ${requests.length} requests`}
            </p>
          </div>
        </header>

        <div className="space-y-2 border-b border-line px-4 py-3">
          <div>
            <label htmlFor="request-search" className="sr-only">
              Search feature requests
            </label>
            <TextInput
              id="request-search"
              type="search"
              value={filters.query}
              onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
              placeholder="Search requests…"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="request-status" className="sr-only">
                Filter requests by status
              </label>
              <Select
                id="request-status"
                value={filters.status}
                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="all">All statuses</option>
                {FEATURE_REQUEST_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label htmlFor="request-priority" className="sr-only">
                Filter requests by priority
              </label>
              <Select
                id="request-priority"
                value={filters.priority}
                onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
              >
                <option value="all">All priorities</option>
                {FEEDBACK_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
            </div>
            <button
              type="button"
              onClick={() => setFilters(EMPTY_FILTERS)}
              disabled={!filtersActive}
              className="col-span-2 border border-line px-2 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-faint transition-colors hover:border-accent hover:text-accent disabled:opacity-50 disabled:hover:border-line disabled:hover:text-faint"
            >
              Clear filters
            </button>
          </div>
        </div>

        <div className="max-h-[30rem] overflow-y-auto lg:max-h-[38rem]">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">
                No matching results
              </p>
              <p className="mx-auto mt-2 max-w-[32ch] text-[12px] leading-relaxed text-muted">
                No request matches the active search and filters.
              </p>
              <button
                type="button"
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="mt-3 border border-line px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <ul>
              {filtered.map((r) => {
                const active = r.id === selected?.id;
                return (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(r.id)}
                      aria-current={active ? "true" : undefined}
                      className={`w-full border-b border-line px-4 py-3 text-left transition-colors ${
                        active ? "bg-mint-tint/30" : "hover:bg-mint-tint/15"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="min-w-0 text-[12.5px] font-medium leading-snug text-fg">
                          {r.title}
                        </p>
                        <FeedbackPriorityBadge priority={r.priority} />
                      </div>
                      <p className="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-muted">
                        {r.description}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <FeedbackRequestStatusBadge status={r.status} />
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                          {r.relatedFeedbackIds.length} linked · {r.productArea}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* -------------------------------------------------------- detail --- */}
      <section className="min-w-0 bg-panel" aria-label="Selected feature request">
        {selected ? (
          <motion.div
            key={selected.id}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
            className="space-y-5 px-5 py-5 sm:px-6"
          >
            <header className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
                  <span aria-hidden className="size-1.5 bg-mint" />
                  Feature request · {selected.id}
                </p>
                <h3 className="mt-2 text-[clamp(1.15rem,2vw,1.5rem)] font-medium leading-tight tracking-[-0.03em] text-fg">
                  {selected.title}
                </h3>
                <p className="mt-1.5 text-[11.5px] text-muted">{selected.productArea}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <FeedbackPriorityBadge priority={selected.priority} />
                <FeedbackRequestStatusBadge status={selected.status} />
              </div>
            </header>

            <p className="max-w-[75ch] text-[12.5px] leading-relaxed text-fg">
              {selected.description}
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <UserContentBlock label="User problem">
                <p>{selected.userProblem}</p>
              </UserContentBlock>
              <div className="border border-line bg-mint-tint/20">
                <div className="flex items-center gap-2 border-b border-line px-3 py-2">
                  <span aria-hidden className="size-1.5 bg-accent" />
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
                    Requested capability
                  </p>
                </div>
                <div className="px-3 py-3 text-[12.5px] leading-relaxed text-fg">
                  {selected.requestedCapability}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Review status" htmlFor={`request-status-${selected.id}`}>
                <Select
                  id={`request-status-${selected.id}`}
                  value={selected.status}
                  onChange={(e) =>
                    onStatusChange(selected.id, e.target.value as FeatureRequestStatus)
                  }
                >
                  {FEATURE_REQUEST_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Priority" htmlFor={`request-priority-${selected.id}`}>
                <Select
                  id={`request-priority-${selected.id}`}
                  value={selected.priority}
                  onChange={(e) =>
                    onPriorityChange(selected.id, e.target.value as FeedbackPriority)
                  }
                >
                  {FEEDBACK_PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <PanelLabel>Related product area</PanelLabel>
                <p className="mt-2 text-[12.5px] text-fg">{selected.productArea}</p>
              </div>
              <div>
                <PanelLabel>Roadmap reference</PanelLabel>
                <p className="mt-2 text-[12.5px] text-fg">
                  {selected.roadmapReference ?? "Not referenced on the roadmap yet"}
                </p>
              </div>
            </div>

            <div>
              <PanelLabel>
                Related feedback · {related.length} of {selected.relatedFeedbackIds.length}{" "}
                linked records found
              </PanelLabel>
              {related.length === 0 ? (
                <p className="mt-2 text-[12px] text-muted">
                  No feedback records are linked to this request.
                </p>
              ) : (
                <ul className="mt-2 space-y-1.5">
                  {related.map((f) => (
                    <li key={f.id}>
                      <button
                        type="button"
                        onClick={() => onOpenFeedback(f.id)}
                        className="flex w-full items-baseline gap-2 border border-line px-3 py-2 text-left transition-colors hover:border-accent/70 hover:bg-mint-tint/20"
                      >
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                          {f.id}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[12px] text-fg">
                          {f.title}
                        </span>
                        <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                          {f.status}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
              Status and priority are set by hand · no demand scoring or automatic ranking
            </p>
          </motion.div>
        ) : (
          <FeedbackHubEmptyState
            title="No matching request"
            description="Adjust the filters to select a feature request."
          />
        )}
      </section>
    </div>
  );
}
