"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { COMPETITOR_SORT_OPTIONS, STATUS_FILTER_OPTIONS } from "@/lib/market-intelligence/demo";
import {
  RESEARCH_STATUS_META,
  formatMarketUpdated,
  type Competitor,
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
  PanelHeader,
  QuestionList,
  ResearchStatusBadge,
  SampleNotice,
  SectionLabel,
  WorkspaceEmpty,
  WorkspaceToolbar,
} from "./primitives";

export function CompetitorWorkspace({
  competitors,
  onAddCompetitor,
  selectedId,
  onSelect,
  openDetail = false,
}: {
  competitors: Competitor[];
  onAddCompetitor: () => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  openDetail?: boolean;
}) {
  const reduce = useReducedMotion();
  const workspaceRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("recent");
  const [mobileDetail, setMobileDetail] = useState(openDetail);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return competitors
      .filter((competitor) => {
        const matchesQuery =
          !needle ||
          [competitor.name, competitor.category, competitor.description, competitor.audience]
            .join(" ")
            .toLowerCase()
            .includes(needle);
        const matchesStatus = status === "all" || competitor.status === status;
        return matchesQuery && matchesStatus;
      })
      .sort((a, b) => {
        if (sort === "recent") return b.updatedAt.localeCompare(a.updatedAt);
        if (sort === "status") {
          const order = { "not-researched": 0, "in-progress": 1, reviewed: 2 };
          return order[a.status] - order[b.status] || a.name.localeCompare(b.name);
        }
        return a.name.localeCompare(b.name);
      });
  }, [competitors, query, sort, status]);

  const selected =
    competitors.find((competitor) => competitor.id === selectedId) ?? visible[0] ?? competitors[0] ?? null;

  const filtersActive = query !== "" || status !== "all" || sort !== "recent";

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
    setSort("recent");
  }

  return (
    <div
      ref={workspaceRef}
      className="grid scroll-mt-14 xl:grid-cols-[minmax(0,27rem)_minmax(0,1fr)]"
    >
      <section
        aria-label="Competitor list"
        className={`min-w-0 flex-col border-b border-line xl:border-b-0 xl:border-r ${
          mobileDetail ? "hidden xl:flex" : "flex"
        }`}
      >
        <PanelHeader
          title="Competitor set"
          meta={`${competitors.length} profiles`}
          action={<AddButton label="Competitor" onClick={onAddCompetitor} tone="quiet" />}
        />

        {competitors.length === 0 ? (
          <WorkspaceEmpty
            eyebrow="No competitors documented"
            title="Start with the alternatives your customer already uses."
            description="A competitor can be a direct product, a spreadsheet, or the habit people keep instead of switching."
            primary={{ label: "Add the first competitor", onClick: onAddCompetitor }}
            icon="users"
          />
        ) : (
          <>
            <WorkspaceToolbar
              count={visible.length}
              query={query}
              onQueryChange={setQuery}
              searchLabel="competitors"
              searchPlaceholder="Search competitors…"
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
                options={COMPETITOR_SORT_OPTIONS}
                onChange={setSort}
                className="w-[calc(50%-0.25rem)] sm:w-[8rem]"
              />
            </WorkspaceToolbar>

            {visible.length === 0 ? (
              <NoResults query={query} onClear={resetFilters} noun={`${competitors.length} competitors`} />
            ) : (
              <ul className="min-h-0 flex-1 overflow-y-auto [scrollbar-color:var(--line-2)_transparent] [scrollbar-width:thin] xl:max-h-[calc(100dvh-20rem)]">
                {visible.map((competitor, index) => {
                  const active = competitor.id === selected?.id;
                  return (
                    <li key={competitor.id} className="border-b border-line last:border-b-0">
                      <button
                        type="button"
                        onClick={() => select(competitor.id)}
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
                          <span className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
                            <span className="text-[13px] font-medium leading-snug tracking-[-0.01em] text-fg">
                              {competitor.name}
                            </span>
                            <ResearchStatusBadge status={competitor.status} />
                          </span>

                          <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="font-mono text-[10px] uppercase tracking-[0.11em] text-faint">
                              {competitor.category}
                            </span>
                            <span aria-hidden className="size-0.5 bg-line-2" />
                            <span className="font-mono text-[10px] uppercase tracking-[0.11em] text-faint">
                              {formatMarketUpdated(competitor.updatedAt)}
                            </span>
                          </span>

                          <span className="mt-1.5 line-clamp-2 block text-[11px] leading-relaxed text-muted">
                            {competitor.description}
                          </span>

                          <span className="mt-2 flex flex-wrap items-center gap-1.5">
                            <EvidenceBadge type={competitor.evidence} />
                            <span className="truncate font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
                              {competitor.pricing.includes("Not published")
                                ? "Pricing unknown"
                                : "Pricing noted"}
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
        aria-label="Selected competitor"
        className={`min-w-0 bg-panel ${mobileDetail ? "block" : "hidden xl:block"}`}
      >
        {mobileDetail ? (
          <DetailBackBar
            context={selected ? `Competitors / ${selected.name}` : "Competitors"}
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
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                      {selected.category} · competitor profile
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

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-3">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.11em] text-faint">
                    <span aria-hidden className="size-1 bg-accent" />
                    {selected.website}
                    <span className="text-faint/65">· sample domain</span>
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.11em] text-faint">
                    Updated {formatMarketUpdated(selected.updatedAt)}
                  </span>
                </div>
              </header>

              <div className="grid gap-px bg-line sm:grid-cols-2">
                <div className="bg-panel px-5 py-4 sm:px-7">
                  <SectionLabel>Target audience</SectionLabel>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
                    {selected.audience}
                  </p>
                </div>
                <div className="bg-panel px-5 py-4 sm:px-7">
                  <SectionLabel>Pricing model</SectionLabel>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
                    {selected.pricing}
                  </p>
                </div>
              </div>

              <div className="px-5 sm:px-7">
                <DetailSection label="Strengths">
                  <BulletList items={selected.strengths} marker="bg-mint" />
                </DetailSection>

                <DetailSection label="Weaknesses">
                  <BulletList items={selected.weaknesses} marker="bg-danger" />
                </DetailSection>

                <DetailSection label="Differentiation">
                  <p className="border-l-2 border-accent bg-mint-tint/20 px-3 py-2.5 text-[12.5px] leading-relaxed text-fg">
                    {selected.differentiation}
                  </p>
                </DetailSection>

                <DetailSection label="Observations">
                  <BulletList items={selected.observations} marker="bg-fg" />
                </DetailSection>

                <DetailSection label="Research questions">
                  <QuestionList items={selected.questions} />
                </DetailSection>
              </div>

              <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-bg/40 px-5 py-3 sm:px-7">
                <SampleNotice />
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                  {RESEARCH_STATUS_META[selected.status].label} · no external analysis
                </span>
              </footer>
            </motion.article>
          ) : (
            <DetailPlaceholder
              eyebrow="Competitor research"
              title="Select a competitor to read the profile."
              description="Profiles collect what the sample research observed, where the product differs, and what still needs checking."
              prompts={[
                ["01", "Positioning", "What does the competitor promise, and to whom?"],
                ["02", "Gap", "Where could a different product be meaningfully clearer?"],
                ["03", "Evidence", "Which observations are documented, and which are assumptions?"],
              ]}
            />
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
