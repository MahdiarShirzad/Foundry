"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import type { EvidenceDraft, EvidenceItem, Experiment, Hypothesis } from "@/lib/validation-lab/types";
import { EVIDENCE_SORT_OPTIONS, EVIDENCE_TYPES } from "@/lib/validation-lab/types";

import { EvidenceTypeBadge, ValidationEmptyState } from "../badges";
import { AddFindingDialog } from "../dialogs/add-finding-dialog";
import {
  AddButton,
  DetailBackBar,
  EASE,
  FilterSelect,
  NoResults,
  PanelHeader,
  WorkspaceToolbar,
} from "../primitives";

const TYPE_OPTIONS = [
  { value: "all", label: "All types" },
  ...EVIDENCE_TYPES.map((t) => ({ value: t, label: t })),
];

/** Observation → interpretation → conclusion, kept visibly separate. */
function EvidenceStep({
  index,
  label,
  hint,
  children,
  tone,
}: {
  index: string;
  label: string;
  hint: string;
  children: React.ReactNode;
  tone: "observation" | "interpretation" | "conclusion";
}) {
  const accent =
    tone === "observation" ? "bg-mint" : tone === "interpretation" ? "bg-accent" : "bg-line-2";
  return (
    <section className="border border-line">
      <header className="flex items-center justify-between gap-3 border-b border-line bg-bg/60 px-3 py-2">
        <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-fg">
          <span aria-hidden className={`size-1.5 ${accent}`} />
          {index} · {label}
        </p>
        <span className="hidden font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint sm:block">
          {hint}
        </span>
      </header>
      <div className="px-3 py-3 text-[12.5px] leading-relaxed">{children}</div>
    </section>
  );
}

export function EvidenceWorkspace({
  findings,
  experiments,
  hypotheses,
  onAdd,
}: {
  findings: EvidenceItem[];
  experiments: Experiment[];
  hypotheses: Hypothesis[];
  onAdd: (draft: EvidenceDraft) => void;
}) {
  const reduce = useReducedMotion();
  const workspaceRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("recent");
  const [selectedId, setSelectedId] = useState<string | null>(findings[0]?.id ?? null);
  const [mobileDetail, setMobileDetail] = useState(false);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return findings
      .filter((f) => {
        const matchesQuery =
          !needle ||
          [f.title, f.observation, f.sourceLabel, f.type].join(" ").toLowerCase().includes(needle);
        const matchesType = type === "all" ? true : f.type === type;
        return matchesQuery && matchesType;
      })
      .sort((a, b) => {
        if (sort === "oldest") return a.date.localeCompare(b.date);
        return b.date.localeCompare(a.date) || a.title.localeCompare(b.title);
      });
  }, [findings, query, sort, type]);

  const selected = findings.find((f) => f.id === selectedId) ?? filtered[0] ?? findings[0] ?? null;
  const experiment = selected ? experiments.find((e) => e.id === selected.relatedExperimentId) : null;
  const hypothesis = selected ? hypotheses.find((h) => h.id === selected.relatedHypothesisId) : null;
  const filtersActive = query !== "" || type !== "all" || sort !== "recent";

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
    setType("all");
    setSort("recent");
  }

  if (findings.length === 0) {
    return (
      <>
        <div className="border border-line bg-panel">
          <PanelHeader title="Evidence & Findings" meta="0 recorded" action={<AddButton label="Add" onClick={() => setOpen(true)} />} />
          <ValidationEmptyState
            title="No findings yet"
            description="Record what an experiment actually produced: the observation first, your interpretation second, and the limitations every time."
            action={
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
              >
                Add Finding
              </button>
            }
          />
        </div>
        <AddFindingDialog
          open={open}
          onClose={() => setOpen(false)}
          experiments={experiments}
          hypotheses={hypotheses}
          onSubmit={onAdd}
        />
      </>
    );
  }

  return (
    <div
      ref={workspaceRef}
      className="grid scroll-mt-14 gap-px border border-line bg-line lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)]"
    >
      <section
        aria-label="Evidence list"
        className={`min-w-0 bg-panel ${mobileDetail ? "hidden lg:block" : "block"}`}
      >
        <PanelHeader
          title="Evidence & Findings"
          meta={`${findings.length} recorded`}
          action={<AddButton label="Add" onClick={() => setOpen(true)} />}
        />
        <WorkspaceToolbar
          count={filtered.length}
          query={query}
          onQueryChange={setQuery}
          searchLabel="findings"
          searchPlaceholder="Search findings…"
          active={filtersActive}
          onReset={resetFilters}
        >
          <FilterSelect label="Type" value={type} options={TYPE_OPTIONS} onChange={setType} />
          <FilterSelect
            label="Sort"
            value={sort}
            options={EVIDENCE_SORT_OPTIONS}
            onChange={setSort}
            className="w-[calc(50%-0.25rem)] sm:w-[8rem]"
          />
        </WorkspaceToolbar>

        {filtered.length === 0 ? (
          <NoResults query={query} onClear={resetFilters} noun={`${findings.length} findings`} />
        ) : (
          <ul className="max-h-[32rem] overflow-y-auto lg:max-h-[calc(100dvh-27rem)]">
            {filtered.map((f, index) => {
              const active = f.id === selected?.id;
              return (
                <li key={f.id} className="border-b border-line last:border-b-0">
                  <button
                    type="button"
                    onClick={() => select(f.id)}
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
                          {f.title}
                        </span>
                        <EvidenceTypeBadge type={f.type} />
                      </span>
                      <span className="mt-1 line-clamp-2 block text-[11.5px] leading-relaxed text-muted">
                        {f.observation}
                      </span>
                      <span className="mt-2 flex flex-wrap items-center gap-2 font-mono text-[8.5px] uppercase tracking-[0.12em] text-faint">
                        <span className="truncate">{f.sourceLabel}</span>
                        <span aria-hidden className="size-0.5 bg-line-2" />
                        <span>{f.date}</span>
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
        aria-label="Selected finding"
        className={`min-w-0 bg-panel ${mobileDetail ? "block" : "hidden lg:block"}`}
      >
        {mobileDetail && selected ? (
          <DetailBackBar context={`Evidence / ${selected.title}`} onBack={() => setMobileDetail(false)} />
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
                      Evidence detail
                    </p>
                    <h3 className="mt-2 text-[1.35rem] font-medium leading-tight tracking-[-0.03em] text-fg">
                      {selected.title}
                    </h3>
                    <p className="mt-1 text-[11.5px] text-muted">
                      {selected.sourceLabel} · {selected.date}
                    </p>
                  </div>
                  <EvidenceTypeBadge type={selected.type} />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="border border-line px-3 py-2">
                    <p className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-faint">
                      From experiment
                    </p>
                    <p className="mt-1 text-[12px] text-fg">
                      {experiment?.title ?? "Unlinked experiment"}
                    </p>
                    {experiment ? (
                      <p className="mt-0.5 font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
                        {experiment.method} · {experiment.status}
                      </p>
                    ) : null}
                  </div>
                  <div className="border border-line px-3 py-2">
                    <p className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-faint">
                      Bearing on hypothesis
                    </p>
                    <p className="mt-1 text-[12px] text-fg">
                      {hypothesis?.title ?? "Unlinked hypothesis"}
                    </p>
                    {hypothesis ? (
                      <p className="mt-0.5 font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
                        {hypothesis.category} · status {hypothesis.status}
                      </p>
                    ) : null}
                  </div>
                </div>
              </header>

              <div className="space-y-4 px-5 py-5 sm:px-6">
                <EvidenceStep
                  index="01"
                  label="Observation"
                  hint="What was actually recorded"
                  tone="observation"
                >
                  <p className="text-fg">{selected.observation}</p>
                </EvidenceStep>

                <EvidenceStep
                  index="02"
                  label="Interpretation"
                  hint="What the observation might mean"
                  tone="interpretation"
                >
                  <p className="text-muted">{selected.interpretation}</p>
                </EvidenceStep>

                <EvidenceStep
                  index="03"
                  label="Conclusion"
                  hint="Current assessment of the hypothesis"
                  tone="conclusion"
                >
                  {hypothesis ? (
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-fg">Assessed as</span>
                        <span className="border border-line-2 px-2 py-[3px] font-mono text-[8.5px] uppercase leading-none tracking-[0.13em] text-fg">
                          {hypothesis.status}
                        </span>
                        <span className="text-muted">— “{hypothesis.title}”</span>
                      </div>
                      <p className="mt-2 text-muted">
                        This assessment is the founder&apos;s current call and is stored as a label on
                        the hypothesis. The interface does not recompute it from this evidence.
                      </p>
                    </div>
                  ) : (
                    <p className="text-faint">
                      No hypothesis linked yet · record the conclusion by hand once you decide what
                      this evidence means.
                    </p>
                  )}
                </EvidenceStep>

                <EvidenceStep
                  index="04"
                  label="Limitations / potential bias"
                  hint="What this cannot tell you"
                  tone="conclusion"
                >
                  <p className="text-muted">{selected.limitations}</p>
                </EvidenceStep>

                <p className="border-t border-line pt-3 font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
                  Sample evidence · no real participants, sources, or statistical claims
                </p>
              </div>
            </motion.article>
          </AnimatePresence>
        ) : (
          <ValidationEmptyState
            title="Select a finding"
            description="Choose an evidence item to read its observation, interpretation, conclusion, and limitations."
          />
        )}
      </section>

      <AddFindingDialog
        open={open}
        onClose={() => setOpen(false)}
        experiments={experiments}
        hypotheses={hypotheses}
        onSubmit={onAdd}
      />
    </div>
  );
}
