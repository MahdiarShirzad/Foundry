"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  EVIDENCE_FILTER_OPTIONS,
  OPPORTUNITY_SORT_OPTIONS,
  OPPORTUNITY_STATUS_FILTER_OPTIONS,
} from "@/lib/market-intelligence/demo";
import {
  EVIDENCE_META,
  OPPORTUNITY_STATUSES,
  OPPORTUNITY_STATUS_META,
  formatMarketUpdated,
  type MarketIdea,
  type Opportunity,
  type OpportunityStatus,
} from "@/lib/market-intelligence/types";

import {
  AddButton,
  BulletList,
  DetailBackBar,
  DetailPlaceholder,
  DetailSection,
  EASE,
  EvidenceBadge,
  FilterSelect,
  NoResults,
  OpportunityStatusBadge,
  PanelHeader,
  QuestionList,
  SampleNotice,
  SectionLabel,
  WorkspaceEmpty,
  WorkspaceToolbar,
} from "./primitives";

export function OpportunityWorkspace({
  idea,
  opportunities,
  onAddResearch,
  onOpenNote,
  selectedId,
  onSelect,
  openDetail = false,
}: {
  idea: MarketIdea;
  opportunities: Opportunity[];
  onAddResearch: () => void;
  onOpenNote: (noteId: string) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  openDetail?: boolean;
}) {
  const reduce = useReducedMotion();
  const workspaceRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [evidence, setEvidence] = useState("all");
  const [sort, setSort] = useState("recent");
  const [mobileDetail, setMobileDetail] = useState(openDetail);
  const [overrides, setOverrides] = useState<Record<string, OpportunityStatus>>({});
  const [notice, setNotice] = useState<string | null>(null);

  function effectiveStatus(opportunity: Opportunity): OpportunityStatus {
    return overrides[opportunity.id] ?? opportunity.status;
  }

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return opportunities
      .filter((opportunity) => {
        const matchesQuery =
          !needle ||
          [opportunity.title, opportunity.description, opportunity.problem]
            .join(" ")
            .toLowerCase()
            .includes(needle);
        const currentStatus = overrides[opportunity.id] ?? opportunity.status;
        return (
          matchesQuery &&
          (status === "all" || currentStatus === status) &&
          (evidence === "all" || opportunity.evidence === evidence)
        );
      })
      .sort((a, b) => {
        if (sort === "title") return a.title.localeCompare(b.title);
        if (sort === "status") {
          const order = { open: 0, investigating: 1, parked: 2 };
          return (
            order[overrides[a.id] ?? a.status] - order[overrides[b.id] ?? b.status] ||
            a.title.localeCompare(b.title)
          );
        }
        return b.updatedAt.localeCompare(a.updatedAt);
      });
  }, [evidence, opportunities, overrides, query, sort, status]);

  const selected =
    opportunities.find((opportunity) => opportunity.id === selectedId) ??
    visible[0] ??
    opportunities[0] ??
    null;
  const selectedStatus = selected ? effectiveStatus(selected) : null;
  const segment = selected
    ? idea.segments.find((item) => item.id === selected.segmentId)
    : undefined;
  const supportingNote = selected
    ? idea.notes.find((note) => note.id === selected.noteId)
    : undefined;
  const filtersActive =
    query !== "" || status !== "all" || evidence !== "all" || sort !== "recent";

  function select(id: string) {
    onSelect(id);
    setMobileDetail(true);
    setNotice(null);

    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1279px)").matches) {
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
    setEvidence("all");
    setSort("recent");
  }

  function changeStatus(next: OpportunityStatus) {
    if (!selected || next === selectedStatus) return;
    setOverrides((current) => ({ ...current, [selected.id]: next }));
    setNotice(
      `Moved to “${OPPORTUNITY_STATUS_META[next].label}” in this preview. The change is local and will not survive a reload.`,
    );
  }

  return (
    <div
      ref={workspaceRef}
      className="grid scroll-mt-14 xl:grid-cols-[minmax(0,27rem)_minmax(0,1fr)]"
    >
      <section
        aria-label="Opportunity list"
        className={`min-w-0 flex-col border-b border-line xl:border-b-0 xl:border-r ${
          mobileDetail ? "hidden xl:flex" : "flex"
        }`}
      >
        <PanelHeader
          title="Opportunity log"
          meta={`${opportunities.length} documented`}
          action={<AddButton label="Research" onClick={onAddResearch} tone="quiet" />}
        />

        {opportunities.length === 0 ? (
          <WorkspaceEmpty
            eyebrow="No opportunities documented"
            title="Opportunities should grow out of evidence, not enthusiasm."
            description="Capture a supporting research note first, then shape the observed problem into a working opportunity."
            primary={{ label: "Add a research note", onClick: onAddResearch }}
            icon="note"
          />
        ) : (
          <>
            <WorkspaceToolbar
              count={visible.length}
              query={query}
              onQueryChange={setQuery}
              searchLabel="opportunities"
              searchPlaceholder="Search opportunities…"
              active={filtersActive}
              onReset={resetFilters}
            >
              <FilterSelect
                label="Status"
                value={status}
                options={OPPORTUNITY_STATUS_FILTER_OPTIONS}
                onChange={setStatus}
                className="w-[calc(50%-0.25rem)] sm:w-[8.5rem]"
              />
              <FilterSelect
                label="Evidence"
                value={evidence}
                options={EVIDENCE_FILTER_OPTIONS}
                onChange={setEvidence}
                className="w-[calc(50%-0.25rem)] sm:w-[9rem]"
              />
              <FilterSelect
                label="Sort"
                value={sort}
                options={OPPORTUNITY_SORT_OPTIONS}
                onChange={setSort}
                className="w-[calc(50%-0.25rem)] sm:w-[8rem]"
              />
            </WorkspaceToolbar>

            {visible.length === 0 ? (
              <NoResults
                query={query}
                onClear={resetFilters}
                noun={`${opportunities.length} opportunities`}
              />
            ) : (
              <ul className="min-h-0 flex-1 overflow-y-auto [scrollbar-color:var(--line-2)_transparent] [scrollbar-width:thin] xl:max-h-[calc(100dvh-20rem)]">
                {visible.map((opportunity, index) => {
                  const active = opportunity.id === selected?.id;
                  const currentStatus = effectiveStatus(opportunity);
                  const relatedSegment = idea.segments.find(
                    (item) => item.id === opportunity.segmentId,
                  );
                  return (
                    <li key={opportunity.id} className="border-b border-line last:border-b-0">
                      <button
                        type="button"
                        onClick={() => select(opportunity.id)}
                        aria-current={active ? "true" : undefined}
                        className={`group grid w-full grid-cols-[1.5rem_minmax(0,1fr)] gap-2 px-4 py-3.5 text-left transition-colors ${
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
                          <span className="block text-[13px] font-medium leading-snug tracking-[-0.01em] text-fg">
                            {opportunity.title}
                          </span>

                          <span className="mt-1.5 line-clamp-2 block text-[11px] leading-relaxed text-muted">
                            {opportunity.description}
                          </span>

                          <span className="mt-2 flex flex-wrap items-center gap-1.5">
                            <EvidenceBadge type={opportunity.evidence} />
                            <OpportunityStatusBadge status={currentStatus} />
                            {overrides[opportunity.id] ? (
                              <span className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-accent">
                                local
                              </span>
                            ) : null}
                          </span>

                          <span className="mt-1.5 block truncate font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
                            {relatedSegment?.name ?? "Unassigned segment"} ·{" "}
                            {formatMarketUpdated(opportunity.updatedAt)}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </section>

      <section
        aria-label="Selected opportunity"
        className={`min-w-0 bg-panel ${mobileDetail ? "block" : "hidden xl:block"}`}
      >
        {mobileDetail ? (
          <DetailBackBar
            context={selected ? `Opportunities / ${selected.title}` : "Opportunities"}
            onBack={() => setMobileDetail(false)}
          />
        ) : null}

        <AnimatePresence mode="wait" initial={false}>
          {selected ? (
            <motion.article
              key={selected.id}
              initial={reduce ? false : { opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.18, ease: EASE }}
              className="w-full min-w-0"
            >
              <header className="border-b border-line px-5 pb-5 pt-5 sm:px-7">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                  Opportunity · {segment?.name ?? "Unassigned segment"}
                </p>
                <div className="mt-1.5 flex flex-wrap items-start justify-between gap-3">
                  <h2 className="max-w-[30ch] text-[clamp(1.5rem,2.6vw,2rem)] font-medium leading-[1.06] tracking-[-0.035em] text-fg">
                    {selected.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <EvidenceBadge type={selected.evidence} />
                    {selectedStatus ? <OpportunityStatusBadge status={selectedStatus} /> : null}
                  </div>
                </div>

                <p className="mt-3 max-w-[68ch] text-[13px] leading-relaxed text-muted">
                  {selected.description}
                </p>

                <div className="mt-4 border-t border-line pt-3">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                      Evidence maturity
                    </span>
                    <span className="text-[11px] leading-relaxed text-muted">
                      {EVIDENCE_META[selected.evidence].description}
                    </span>
                  </p>
                </div>
              </header>

              <div className="border-b border-line bg-bg/40 px-5 py-4 sm:px-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <SectionLabel>Investigation status</SectionLabel>
                    <p className="mt-1 text-[11px] leading-relaxed text-faint">
                      {selectedStatus
                        ? OPPORTUNITY_STATUS_META[selectedStatus].description
                        : null}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5" role="group" aria-label="Set investigation status">
                    {OPPORTUNITY_STATUSES.map((option) => {
                      const active = selectedStatus === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => changeStatus(option)}
                          aria-pressed={active}
                          className={`inline-flex h-7 items-center gap-1.5 border px-2.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
                            active
                              ? "border-accent bg-mint-tint/50 text-accent"
                              : "border-line text-faint hover:border-line-2 hover:text-fg"
                          }`}
                        >
                          <span
                            aria-hidden
                            className={`size-1 ${OPPORTUNITY_STATUS_META[option].marker}`}
                          />
                          {OPPORTUNITY_STATUS_META[option].label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {notice ? (
                    <motion.p
                      role="status"
                      initial={reduce ? false : { opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: reduce ? 0 : 0.16 }}
                      className="mt-3 border-l-2 border-accent bg-mint-tint/35 px-3 py-2 text-[11px] leading-relaxed text-fg"
                    >
                      {notice}
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </div>

              <div className="px-5 sm:px-7">
                <DetailSection label="Observed problem">
                  <p className="text-[12.5px] leading-relaxed text-muted">{selected.problem}</p>
                </DetailSection>

                <DetailSection label="Existing alternatives">
                  <BulletList items={[selected.alternatives]} marker="bg-line-2" />
                </DetailSection>

                <DetailSection label="Potential differentiation">
                  <p className="border-l-2 border-mint bg-mint-tint/20 px-3 py-2.5 text-[12.5px] leading-relaxed text-fg">
                    {selected.differentiation}
                  </p>
                </DetailSection>

                <DetailSection label="Supporting note">
                  {supportingNote ? (
                    <button
                      type="button"
                      onClick={() => onOpenNote(supportingNote.id)}
                      className="group flex w-full flex-col gap-1.5 border border-line bg-bg/35 px-3 py-2.5 text-left transition-colors hover:border-accent/50 hover:bg-mint-tint/20 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="min-w-0">
                        <span className="block text-[12px] font-medium text-fg transition-colors group-hover:text-accent">
                          {supportingNote.title}
                        </span>
                        <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
                          {supportingNote.source}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2">
                        <EvidenceBadge type={supportingNote.evidence} />
                        <span
                          aria-hidden
                          className="text-[11px] text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                        >
                          →
                        </span>
                      </span>
                    </button>
                  ) : (
                    <p className="text-[12px] leading-relaxed text-faint">
                      The linked sample note is not available.
                    </p>
                  )}
                </DetailSection>

                <DetailSection label="Open questions">
                  <QuestionList items={selected.questions} />
                </DetailSection>
              </div>

              <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-bg/40 px-5 py-3 sm:px-7">
                <SampleNotice />
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                  Updated {formatMarketUpdated(selected.updatedAt)} · no scoring applied
                </span>
              </footer>
            </motion.article>
          ) : (
            <DetailPlaceholder
              eyebrow="Opportunity research"
              title="Select an opportunity to separate evidence from assumption."
              description="Each opportunity keeps its supporting note, its current investigation status, and the questions that would change the decision."
              prompts={[
                ["01", "Evidence", "What did the sample research actually observe?"],
                ["02", "Hypothesis", "What are we assuming about the customer or the market?"],
                ["03", "Next test", "What would make this opportunity more or less credible?"],
              ]}
            />
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
