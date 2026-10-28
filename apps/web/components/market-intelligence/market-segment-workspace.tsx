"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { SEGMENT_SORT_OPTIONS, STATUS_FILTER_OPTIONS } from "@/lib/market-intelligence/demo";
import {
  formatMarketUpdated,
  type MarketIdea,
  type Segment,
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
  ResearchStatusBadge,
  SampleNotice,
  WorkspaceEmpty,
  WorkspaceToolbar,
} from "./primitives";

export function MarketSegmentWorkspace({
  idea,
  segments,
  onAddSegment,
  onOpenOpportunity,
  selectedId,
  onSelect,
  openDetail = false,
}: {
  idea: MarketIdea;
  segments: Segment[];
  onAddSegment: () => void;
  onOpenOpportunity: (id: string) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  openDetail?: boolean;
}) {
  const reduce = useReducedMotion();
  const workspaceRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("name");
  const [mobileDetail, setMobileDetail] = useState(openDetail);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return segments
      .filter((segment) => {
        const matchesQuery =
          !needle ||
          [
            segment.name,
            segment.customerType,
            segment.description,
            ...segment.painPoints,
            ...segment.needs,
          ]
            .join(" ")
            .toLowerCase()
            .includes(needle);
        return matchesQuery && (status === "all" || segment.status === status);
      })
      .sort((a, b) => {
        if (sort === "recent") return b.updatedAt.localeCompare(a.updatedAt);
        if (sort === "status") {
          const order = { "not-researched": 0, "in-progress": 1, reviewed: 2 };
          return order[a.status] - order[b.status] || a.name.localeCompare(b.name);
        }
        return a.name.localeCompare(b.name);
      });
  }, [segments, query, sort, status]);

  const selected = segments.find((segment) => segment.id === selectedId) ?? visible[0] ?? segments[0] ?? null;
  const relatedOpportunities = selected
    ? idea.opportunities.filter((opportunity) => opportunity.segmentId === selected.id)
    : [];

  const filtersActive = query !== "" || status !== "all" || sort !== "name";

  function select(id: string) {
    onSelect(id);
    setMobileDetail(true);

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
    setSort("name");
  }

  return (
    <div
      ref={workspaceRef}
      className="grid scroll-mt-14 xl:grid-cols-[minmax(0,27rem)_minmax(0,1fr)]"
    >
      <section
        aria-label="Market segment list"
        className={`min-w-0 flex-col border-b border-line xl:border-b-0 xl:border-r ${
          mobileDetail ? "hidden xl:flex" : "flex"
        }`}
      >
        <PanelHeader
          title="Segment set"
          meta={`${segments.length} groups`}
          action={<AddButton label="Segment" onClick={onAddSegment} tone="quiet" />}
        />

        {segments.length === 0 ? (
          <WorkspaceEmpty
            eyebrow="No segments documented"
            title="Name the people whose problem you are trying to understand."
            description="A useful segment is specific about the situation, the alternatives, and what the customer is trying to get done."
            primary={{ label: "Add the first segment", onClick: onAddSegment }}
            icon="users"
          />
        ) : (
          <>
            <WorkspaceToolbar
              count={visible.length}
              query={query}
              onQueryChange={setQuery}
              searchLabel="segments"
              searchPlaceholder="Search segments…"
              active={filtersActive}
              onReset={resetFilters}
            >
              <FilterSelect
                label="Status"
                value={status}
                options={STATUS_FILTER_OPTIONS}
                onChange={setStatus}
                className="w-[calc(50%-0.25rem)] sm:w-[8.5rem]"
              />
              <FilterSelect
                label="Sort"
                value={sort}
                options={SEGMENT_SORT_OPTIONS}
                onChange={setSort}
                className="w-[calc(50%-0.25rem)] sm:w-[8rem]"
              />
            </WorkspaceToolbar>

            {visible.length === 0 ? (
              <NoResults query={query} onClear={resetFilters} noun={`${segments.length} segments`} />
            ) : (
              <ul className="min-h-0 flex-1 overflow-y-auto [scrollbar-color:var(--line-2)_transparent] [scrollbar-width:thin] xl:max-h-[calc(100dvh-20rem)]">
                {visible.map((segment, index) => {
                  const active = segment.id === selected?.id;
                  return (
                    <li key={segment.id} className="border-b border-line last:border-b-0">
                      <button
                        type="button"
                        onClick={() => select(segment.id)}
                        aria-current={active ? "true" : undefined}
                        className={`group grid w-full grid-cols-[1.5rem_minmax(0,1fr)] gap-2 px-4 py-3.5 text-left transition-colors ${
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
                              {segment.name}
                            </span>
                            <ResearchStatusBadge status={segment.status} />
                          </span>

                          <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="font-mono text-[8px] uppercase tracking-[0.11em] text-faint">
                              {segment.customerType}
                            </span>
                            <span aria-hidden className="size-0.5 bg-line-2" />
                            <span className="font-mono text-[8px] uppercase tracking-[0.11em] text-faint">
                              {formatMarketUpdated(segment.updatedAt)}
                            </span>
                          </span>

                          <span className="mt-1.5 line-clamp-2 block text-[11px] leading-relaxed text-muted">
                            {segment.description}
                          </span>

                          <span className="mt-2 flex flex-wrap items-center gap-2">
                            <EvidenceBadge type={segment.evidence} />
                            <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-faint">
                              {segment.painPoints.length} pain points
                            </span>
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
        aria-label="Selected market segment"
        className={`min-w-0 bg-panel ${mobileDetail ? "block" : "hidden xl:block"}`}
      >
        {mobileDetail ? (
          <DetailBackBar
            context={selected ? `Segments / ${selected.name}` : "Segments"}
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
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-faint">
                      {selected.customerType} · market segment
                    </p>
                    <h2 className="mt-1.5 text-[clamp(1.5rem,2.6vw,2rem)] font-medium leading-[1.05] tracking-[-0.035em] text-fg">
                      {selected.name}
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <ResearchStatusBadge status={selected.status} />
                    <EvidenceBadge type={selected.evidence} />
                  </div>
                </div>

                <p className="mt-3 max-w-[68ch] text-[13px] leading-relaxed text-muted">
                  {selected.description}
                </p>

                <p className="mt-4 border-t border-line pt-3 font-mono text-[8.5px] uppercase tracking-[0.11em] text-faint">
                  Updated {formatMarketUpdated(selected.updatedAt)} · {relatedOpportunities.length}{" "}
                  related {relatedOpportunities.length === 1 ? "opportunity" : "opportunities"}
                </p>
              </header>

              <div className="px-5 sm:px-7">
                <DetailSection label="Pain points">
                  <BulletList items={selected.painPoints} marker="bg-danger" />
                </DetailSection>

                <DetailSection label="Current alternatives">
                  <BulletList items={selected.alternatives} marker="bg-line-2" />
                </DetailSection>

                <DetailSection label="Needs & motivations">
                  <BulletList items={selected.needs} marker="bg-mint" />
                </DetailSection>

                <DetailSection label="Unanswered questions">
                  <QuestionList items={selected.questions} />
                </DetailSection>

                <DetailSection label="Related opportunities">
                  {relatedOpportunities.length ? (
                    <ul className="space-y-2">
                      {relatedOpportunities.map((opportunity) => (
                        <li key={opportunity.id}>
                          <button
                            type="button"
                            onClick={() => onOpenOpportunity(opportunity.id)}
                            className="group flex w-full flex-wrap items-center justify-between gap-2 border border-line bg-bg/35 px-3 py-2 text-left transition-colors hover:border-accent/50 hover:bg-mint-tint/20"
                          >
                            <span className="text-[12px] font-medium text-fg transition-colors group-hover:text-accent">
                              {opportunity.title}
                            </span>
                            <span className="flex items-center gap-2">
                              <EvidenceBadge type={opportunity.evidence} />
                              <OpportunityStatusBadge status={opportunity.status} />
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[12px] leading-relaxed text-faint">
                      No sample opportunity is linked to this segment yet.
                    </p>
                  )}
                </DetailSection>
              </div>

              <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-bg/40 px-5 py-3 sm:px-7">
                <SampleNotice />
                <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-faint">
                  No persona generation · sample observations only
                </span>
              </footer>
            </motion.article>
          ) : (
            <DetailPlaceholder
              eyebrow="Segment research"
              title="Select a segment to read the working profile."
              description="Segment profiles hold the situation, the alternatives people use today, and the questions the sample research has not answered."
              prompts={[
                ["01", "Situation", "What is happening when this group feels the problem?"],
                ["02", "Workaround", "What do they do instead, and why is it good enough?"],
                ["03", "Unknown", "Which needs are assumed rather than observed?"],
              ]}
            />
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
