"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import type {
  EvidenceItem,
  Experiment,
  Hypothesis,
  HypothesisDraft,
  HypothesisStatus,
} from "@/lib/validation-lab/types";
import {
  HYPOTHESIS_CATEGORIES,
  HYPOTHESIS_SORT_OPTIONS,
  HYPOTHESIS_STATUSES,
  IMPORTANCE_ORDER,
} from "@/lib/validation-lab/types";

import { EvidenceTypeBadge, ValidationEmptyState, ValidationStatusBadge } from "../badges";
import { NewHypothesisDialog } from "../dialogs/new-hypothesis-dialog";
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
  ...HYPOTHESIS_STATUSES.map((s) => ({ value: s, label: s })),
];

const CATEGORY_OPTIONS = [
  { value: "all", label: "All categories" },
  ...HYPOTHESIS_CATEGORIES.map((c) => ({ value: c, label: c })),
];

export function HypothesisWorkspace({
  hypotheses,
  experiments,
  findings,
  onAdd,
  onStatusChange,
}: {
  hypotheses: Hypothesis[];
  experiments: Experiment[];
  findings: EvidenceItem[];
  onAdd: (draft: HypothesisDraft) => void;
  onStatusChange: (id: string, status: HypothesisStatus) => void;
}) {
  const reduce = useReducedMotion();
  const workspaceRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("importance");
  const [selectedId, setSelectedId] = useState<string | null>(hypotheses[0]?.id ?? null);
  const [mobileDetail, setMobileDetail] = useState(false);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return hypotheses
      .filter((h) => {
        const matchesQuery =
          !needle ||
          [h.title, h.statement, h.customerSegment, h.category].join(" ").toLowerCase().includes(needle);
        const matchesStatus = status === "all" ? true : h.status === status;
        const matchesCategory = category === "all" ? true : h.category === category;
        return matchesQuery && matchesStatus && matchesCategory;
      })
      .sort((a, b) => {
        if (sort === "category") return a.category.localeCompare(b.category) || a.title.localeCompare(b.title);
        if (sort === "title") return a.title.localeCompare(b.title);
        return IMPORTANCE_ORDER[a.importance] - IMPORTANCE_ORDER[b.importance] || a.title.localeCompare(b.title);
      });
  }, [category, hypotheses, query, sort, status]);

  const selected =
    hypotheses.find((h) => h.id === selectedId) ?? filtered[0] ?? hypotheses[0] ?? null;
  const relatedExperiments = selected
    ? experiments.filter((e) => selected.relatedExperimentIds.includes(e.id))
    : [];
  const relatedFindings = selected ? findings.filter((f) => selected.linkedFindings.includes(f.id)) : [];
  const filtersActive =
    query !== "" || status !== "all" || category !== "all" || sort !== "importance";

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
    setCategory("all");
    setSort("importance");
  }

  const newButton = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
    >
      New Hypothesis
    </button>
  );

  if (hypotheses.length === 0) {
    return (
      <>
        <div className="border border-line bg-panel">
          <PanelHeader title="Hypotheses" meta="0 documented" action={<AddButton label="New" onClick={() => setOpen(true)} />} />
          <ValidationEmptyState
            title="No hypotheses yet"
            description="This workspace starts with the assumptions you are willing to write down. Document the first hypothesis that must be true for the idea to work."
            action={newButton}
          />
        </div>
        <NewHypothesisDialog open={open} onClose={() => setOpen(false)} onSubmit={onAdd} />
      </>
    );
  }

  return (
    <div
      ref={workspaceRef}
      className="grid scroll-mt-14 gap-px border border-line bg-line lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)]"
    >
      <section
        aria-label="Hypothesis list"
        className={`min-w-0 bg-panel ${mobileDetail ? "hidden lg:block" : "block"}`}
      >
        <PanelHeader
          title="Hypotheses"
          meta={`${hypotheses.length} documented`}
          action={<AddButton label="New" onClick={() => setOpen(true)} />}
        />
        <WorkspaceToolbar
          count={filtered.length}
          query={query}
          onQueryChange={setQuery}
          searchLabel="hypotheses"
          searchPlaceholder="Search hypotheses…"
          active={filtersActive}
          onReset={resetFilters}
        >
          <FilterSelect label="Status" value={status} options={STATUS_OPTIONS} onChange={setStatus} />
          <FilterSelect label="Category" value={category} options={CATEGORY_OPTIONS} onChange={setCategory} />
          <FilterSelect
            label="Sort"
            value={sort}
            options={HYPOTHESIS_SORT_OPTIONS}
            onChange={setSort}
            className="w-[calc(50%-0.25rem)] sm:w-[8rem]"
          />
        </WorkspaceToolbar>

        {filtered.length === 0 ? (
          <NoResults query={query} onClear={resetFilters} noun={`${hypotheses.length} hypotheses`} />
        ) : (
          <ul className="max-h-[32rem] overflow-y-auto lg:max-h-[calc(100dvh-27rem)]">
            {filtered.map((h, index) => {
              const active = h.id === selected?.id;
              return (
                <li key={h.id} className="border-b border-line last:border-b-0">
                  <button
                    type="button"
                    onClick={() => select(h.id)}
                    aria-current={active ? "true" : undefined}
                    className={`grid w-full grid-cols-[1.5rem_minmax(0,1fr)] gap-2 px-4 py-3.5 text-left transition-colors ${
                      active ? "bg-mint-tint/30" : "bg-panel hover:bg-bg/60"
                    }`}
                  >
                    <span
                      className={`pt-0.5 font-mono text-[10px] tracking-[0.08em] ${
                        active ? "text-accent" : "text-line-2"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
                        <span className="text-[13px] font-medium leading-snug tracking-[-0.01em] text-fg">
                          {h.title}
                        </span>
                        <ValidationStatusBadge status={h.status} />
                      </span>
                      <span className="mt-1 line-clamp-2 block text-[11.5px] leading-relaxed text-muted">
                        {h.statement}
                      </span>
                      <span className="mt-2 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                        <span>{h.category}</span>
                        <span aria-hidden className="size-0.5 bg-line-2" />
                        <span>{h.importance} importance</span>
                        <span aria-hidden className="size-0.5 bg-line-2" />
                        <span className="truncate">{h.customerSegment}</span>
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
        aria-label="Selected hypothesis"
        className={`min-w-0 bg-panel ${mobileDetail ? "block" : "hidden lg:block"}`}
      >
        {mobileDetail && selected ? (
          <DetailBackBar context={`Hypotheses / ${selected.title}`} onBack={() => setMobileDetail(false)} />
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
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                      Hypothesis detail
                    </p>
                    <h3 className="mt-2 text-[1.35rem] font-medium leading-tight tracking-[-0.03em] text-fg">
                      {selected.title}
                    </h3>
                    <p className="mt-1 text-[11.5px] text-muted">
                      {selected.customerSegment} · {selected.category} · {selected.importance} importance
                    </p>
                  </div>
                  <ValidationStatusBadge status={selected.status} />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <label
                    htmlFor="vl-hypothesis-status"
                    className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint"
                  >
                    Status
                  </label>
                  <select
                    id="vl-hypothesis-status"
                    value={selected.status}
                    onChange={(event) =>
                      onStatusChange(selected.id, event.target.value as HypothesisStatus)
                    }
                    className="border border-line bg-panel px-2 py-1.5 text-[12px] text-fg outline-none transition-colors hover:border-line-2 focus:border-accent"
                  >
                    {HYPOTHESIS_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                    Label you set · never inferred
                  </span>
                </div>
              </header>

              <div className="space-y-6 px-5 py-5 sm:px-6">
                <DetailSection label="Hypothesis statement">
                  <p className="border-l-2 border-accent/50 pl-3 text-[13px] leading-relaxed text-fg">
                    {selected.statement}
                  </p>
                </DetailSection>

                <DetailSection label="Why it matters" hint="Risk if this is wrong">
                  <p className="text-[12.5px] leading-relaxed text-muted">
                    {selected.rationale || "No rationale recorded yet."}
                  </p>
                </DetailSection>

                <DetailSection
                  label="Related experiments"
                  hint={`${relatedExperiments.length} linked`}
                >
                  {relatedExperiments.length === 0 ? (
                    <p className="text-[12px] text-faint">
                      None linked yet · the hypothesis has no designed test.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {relatedExperiments.map((e) => (
                        <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 border border-line px-3 py-2">
                          <span className="min-w-0 text-[12.5px] text-fg">{e.title}</span>
                          <span className="flex shrink-0 items-center gap-2">
                            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                              {e.method}
                            </span>
                            <ValidationStatusBadge status={e.status} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </DetailSection>

                <DetailSection label="Linked findings" hint={`${relatedFindings.length} linked`}>
                  {relatedFindings.length === 0 ? (
                    <p className="text-[12px] text-faint">
                      None linked yet · no evidence recorded against this hypothesis.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {relatedFindings.map((f) => (
                        <li key={f.id} className="flex flex-wrap items-center justify-between gap-2 border border-line px-3 py-2">
                          <span className="min-w-0 text-[12.5px] text-fg">{f.title}</span>
                          <EvidenceTypeBadge type={f.type} />
                        </li>
                      ))}
                    </ul>
                  )}
                </DetailSection>

                <DetailSection label="Unresolved questions">
                  {selected.unresolvedQuestions.length === 0 ? (
                    <p className="text-[12px] text-faint">No open questions recorded.</p>
                  ) : (
                    <ul className="space-y-1.5 text-[12.5px] text-muted">
                      {selected.unresolvedQuestions.map((q) => (
                        <li key={q} className="flex gap-2">
                          <span aria-hidden className="mt-[7px] size-1 shrink-0 bg-line-2" />
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </DetailSection>
              </div>
            </motion.article>
          </AnimatePresence>
        ) : (
          <ValidationEmptyState
            title="Select a hypothesis"
            description="Choose a hypothesis from the list to read its statement, linked experiments, findings, and open questions."
          />
        )}
      </section>

      <NewHypothesisDialog open={open} onClose={() => setOpen(false)} onSubmit={onAdd} />
    </div>
  );
}
