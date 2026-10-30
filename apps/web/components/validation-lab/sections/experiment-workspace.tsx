"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import type { Experiment, ExperimentDraft, Hypothesis } from "@/lib/validation-lab/types";
import { EXPERIMENT_METHODS, EXPERIMENT_SORT_OPTIONS, EXPERIMENT_STATUSES } from "@/lib/validation-lab/types";

import { ValidationEmptyState, ValidationStatusBadge } from "../badges";
import { CreateExperimentDialog } from "../dialogs/create-experiment-dialog";
import {
  AddButton,
  DetailBackBar,
  DetailSection,
  EASE,
  FilterSelect,
  NoResults,
  PanelHeader,
  WorkspaceToolbar,
} from "../primitives";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  ...EXPERIMENT_STATUSES.map((s) => ({ value: s, label: s })),
];

const METHOD_OPTIONS = [
  { value: "all", label: "All methods" },
  ...EXPERIMENT_METHODS.map((m) => ({ value: m, label: m })),
];

/** Lifecycle of a designed experiment — a position, not a completion percentage. */
const LIFECYCLE: Experiment["status"][] = ["Draft", "Ready", "In Progress", "Completed"];

function LifecycleRail({ status }: { status: Experiment["status"] }) {
  const currentIndex = LIFECYCLE.indexOf(status);
  const archived = status === "Archived";

  return (
    <div>
      <div className="grid gap-px border border-line bg-line sm:grid-cols-4">
        {LIFECYCLE.map((stage, index) => {
          const reached = !archived && currentIndex >= index;
          const current = !archived && currentIndex === index;
          return (
            <div
              key={stage}
              className={`bg-panel px-3 py-2 ${current ? "bg-mint-tint/40" : ""}`}
              aria-current={current ? "step" : undefined}
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={`size-1.5 ${
                    current ? "bg-accent" : reached ? "bg-mint" : "bg-line-2"
                  }`}
                />
                <span
                  className={`font-mono text-[8.5px] uppercase tracking-[0.14em] ${
                    current ? "text-accent" : reached ? "text-fg" : "text-faint"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")} {stage}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-2 font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
        {archived
          ? "Archived · kept for reference, not part of the active lifecycle"
          : `Position set manually · “${status}”`}
      </p>
    </div>
  );
}

export function ExperimentWorkspace({
  experiments,
  hypotheses,
  onAdd,
}: {
  experiments: Experiment[];
  hypotheses: Hypothesis[];
  onAdd: (draft: ExperimentDraft) => void;
}) {
  const reduce = useReducedMotion();
  const workspaceRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [method, setMethod] = useState("all");
  const [sort, setSort] = useState("recent");
  const [selectedId, setSelectedId] = useState<string | null>(experiments[0]?.id ?? null);
  const [mobileDetail, setMobileDetail] = useState(false);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return experiments
      .filter((e) => {
        const matchesQuery =
          !needle ||
          [e.title, e.objective, e.method, e.targetAudience].join(" ").toLowerCase().includes(needle);
        const matchesStatus = status === "all" ? true : e.status === status;
        const matchesMethod = method === "all" ? true : e.method === method;
        return matchesQuery && matchesStatus && matchesMethod;
      })
      .sort((a, b) => {
        if (sort === "oldest") return a.startDate.localeCompare(b.startDate);
        if (sort === "title") return a.title.localeCompare(b.title);
        return b.startDate.localeCompare(a.startDate) || a.title.localeCompare(b.title);
      });
  }, [experiments, method, query, sort, status]);

  const selected =
    experiments.find((e) => e.id === selectedId) ?? filtered[0] ?? experiments[0] ?? null;
  const linkedHypothesis = selected
    ? hypotheses.find((h) => h.id === selected.relatedHypothesisId)
    : null;
  const filtersActive = query !== "" || status !== "all" || method !== "all" || sort !== "recent";

  function select(id: string) {
    setSelectedId(id);
    setMobileDetail(true);

    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      requestAnimationFrame(() => {
        workspaceRef.current?.scrollIntoView({
          block: "start",
          behavior: reduce ? "auto" : "smooth",
        });
      });
    }
  }

  function resetFilters() {
    setQuery("");
    setStatus("all");
    setMethod("all");
    setSort("recent");
  }

  if (experiments.length === 0) {
    return (
      <>
        <div className="border border-line bg-panel">
          <PanelHeader title="Experiments" meta="0 designed" action={<AddButton label="Create" onClick={() => setOpen(true)} />} />
          <ValidationEmptyState
            title="No experiments yet"
            description="An experiment is a designed test with success criteria agreed in advance. Create one for the hypothesis you most need to challenge."
            action={
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
              >
                Create Experiment
              </button>
            }
          />
        </div>
        <CreateExperimentDialog open={open} onClose={() => setOpen(false)} hypotheses={hypotheses} onSubmit={onAdd} />
      </>
    );
  }

  return (
    <div
      ref={workspaceRef}
      className="grid scroll-mt-14 gap-px border border-line bg-line lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)]"
    >
      <section
        aria-label="Experiment list"
        className={`min-w-0 bg-panel ${mobileDetail ? "hidden lg:block" : "block"}`}
      >
        <PanelHeader
          title="Experiments"
          meta={`${experiments.length} designed`}
          action={<AddButton label="Create" onClick={() => setOpen(true)} />}
        />
        <WorkspaceToolbar
          count={filtered.length}
          query={query}
          onQueryChange={setQuery}
          searchLabel="experiments"
          searchPlaceholder="Search experiments…"
          active={filtersActive}
          onReset={resetFilters}
        >
          <FilterSelect label="Status" value={status} options={STATUS_OPTIONS} onChange={setStatus} />
          <FilterSelect label="Method" value={method} options={METHOD_OPTIONS} onChange={setMethod} />
          <FilterSelect
            label="Sort"
            value={sort}
            options={EXPERIMENT_SORT_OPTIONS}
            onChange={setSort}
            className="w-[calc(50%-0.25rem)] sm:w-[8rem]"
          />
        </WorkspaceToolbar>

        {filtered.length === 0 ? (
          <NoResults query={query} onClear={resetFilters} noun={`${experiments.length} experiments`} />
        ) : (
          <ul className="max-h-[32rem] overflow-y-auto lg:max-h-[calc(100dvh-27rem)]">
            {filtered.map((e, index) => {
              const active = e.id === selected?.id;
              return (
                <li key={e.id} className="border-b border-line last:border-b-0">
                  <button
                    type="button"
                    onClick={() => select(e.id)}
                    aria-current={active ? "true" : undefined}
                    className={`grid w-full grid-cols-[1.5rem_minmax(0,1fr)] gap-2 px-4 py-3.5 text-left transition-colors ${
                      active ? "bg-mint-tint/30" : "bg-panel hover:bg-bg/60"
                    }`}
                  >
                    <span
                      className={`pt-0.5 font-mono text-[8px] tracking-[0.08em] ${
                        active ? "text-accent" : "text-line-2"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
                        <span className="text-[13px] font-medium leading-snug tracking-[-0.01em] text-fg">
                          {e.title}
                        </span>
                        <ValidationStatusBadge status={e.status} />
                      </span>
                      <span className="mt-1 block text-[11.5px] leading-relaxed text-muted">
                        {e.objective}
                      </span>
                      <span className="mt-2 flex flex-wrap items-center gap-2 font-mono text-[8.5px] uppercase tracking-[0.12em] text-faint">
                        <span>{e.method}</span>
                        <span aria-hidden className="size-0.5 bg-line-2" />
                        <span>
                          {e.startDate}
                          {e.endDate ? ` — ${e.endDate}` : ""}
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section
        aria-label="Selected experiment"
        className={`min-w-0 bg-panel ${mobileDetail ? "block" : "hidden lg:block"}`}
      >
        {mobileDetail && selected ? (
          <DetailBackBar context={`Experiments / ${selected.title}`} onBack={() => setMobileDetail(false)} />
        ) : null}

        {selected ? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={selected.id}
              initial={reduce ? false : { opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.16, ease: EASE }}
            >
              <header className="border-b border-line px-5 py-4 sm:px-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
                      Experiment detail
                    </p>
                    <h3 className="mt-2 text-[1.35rem] font-medium leading-tight tracking-[-0.03em] text-fg">
                      {selected.title}
                    </h3>
                    <p className="mt-1 text-[11.5px] text-muted">
                      {selected.method} · {selected.targetAudience}
                    </p>
                  </div>
                  <ValidationStatusBadge status={selected.status} />
                </div>
                <div className="mt-4">
                  <LifecycleRail status={selected.status} />
                </div>
              </header>

              <div className="space-y-6 px-5 py-5 sm:px-6">
                <DetailSection label="Investigates">
                  {linkedHypothesis ? (
                    <div className="border border-line px-3 py-2.5">
                      <p className="text-[12.5px] font-medium text-fg">{linkedHypothesis.title}</p>
                      <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
                        {linkedHypothesis.statement}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[12px] text-faint">
                      No linked hypothesis · this experiment investigates nothing yet.
                    </p>
                  )}
                </DetailSection>

                <DetailSection label="Objective">
                  <p className="text-[12.5px] leading-relaxed text-muted">{selected.objective}</p>
                </DetailSection>

                <div className="grid gap-6 sm:grid-cols-2">
                  <DetailSection label="Success criteria" hint="Agreed before running">
                    <p className="text-[12.5px] leading-relaxed text-muted">
                      {selected.successCriteria || "Not stated yet."}
                    </p>
                  </DetailSection>
                  <DetailSection label="Expected evidence">
                    <p className="text-[12.5px] leading-relaxed text-muted">
                      {selected.expectedEvidence || "Not specified yet."}
                    </p>
                  </DetailSection>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <DetailSection label="Schedule">
                    <p className="text-[12.5px] text-fg">
                      {selected.startDate}
                      {selected.endDate ? ` — ${selected.endDate}` : " — no end date yet"}
                    </p>
                  </DetailSection>
                  <DetailSection label="Target participants">
                    <p className="text-[12.5px] text-fg">{selected.targetAudience}</p>
                  </DetailSection>
                </div>

                <DetailSection label="Observations" hint="Filled in while running">
                  {selected.observations.length === 0 ? (
                    <p className="text-[12px] text-faint">
                      Nothing recorded · the experiment has not produced observations.
                    </p>
                  ) : (
                    <ul className="space-y-1.5 text-[12.5px] text-muted">
                      {selected.observations.map((observation) => (
                        <li key={observation} className="flex gap-2">
                          <span aria-hidden className="mt-[7px] size-1 shrink-0 bg-mint" />
                          <span>{observation}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </DetailSection>

                <DetailSection label="Notes">
                  <p className="text-[12.5px] leading-relaxed text-muted">
                    {selected.notes || "No notes yet."}
                  </p>
                </DetailSection>

                <p className="border-t border-line pt-3 font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
                  Designed, not run · creating this experiment contacted no one and collected no data
                </p>
              </div>
            </motion.article>
          </AnimatePresence>
        ) : (
          <ValidationEmptyState
            title="Select an experiment"
            description="Choose an experiment from the list to read its objective, criteria, schedule, and observations."
          />
        )}
      </section>

      <CreateExperimentDialog open={open} onClose={() => setOpen(false)} hypotheses={hypotheses} onSubmit={onAdd} />
    </div>
  );
}
