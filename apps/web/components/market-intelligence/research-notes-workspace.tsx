"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  EVIDENCE_FILTER_OPTIONS,
  NOTE_SORT_OPTIONS,
} from "@/lib/market-intelligence/demo";
import {
  EVIDENCE_META,
  formatMarketDate,
  formatMarketUpdated,
  type RelatedType,
  type ResearchNote,
} from "@/lib/market-intelligence/types";

import {
  AddButton,
  DetailBackBar,
  DetailPlaceholder,
  DetailSection,
  EASE,
  EvidenceBadge,
  FilterSelect,
  NoResults,
  PanelHeader,
  QuestionList,
  SampleNotice,
  WorkspaceEmpty,
  WorkspaceToolbar,
} from "./primitives";

export function ResearchNotesWorkspace({
  notes,
  onAddResearch,
  onOpenRelated,
  selectedId,
  onSelect,
  openDetail = false,
}: {
  notes: ResearchNote[];
  onAddResearch: () => void;
  onOpenRelated: (type: RelatedType, id: string) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  openDetail?: boolean;
}) {
  const reduce = useReducedMotion();
  const workspaceRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [evidence, setEvidence] = useState("all");
  const [sort, setSort] = useState("recent");
  const [mobileDetail, setMobileDetail] = useState(openDetail);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return notes
      .filter((note) => {
        const matchesQuery =
          !needle ||
          [note.title, note.excerpt, note.source, note.relatedLabel, note.observations]
            .join(" ")
            .toLowerCase()
            .includes(needle);
        return matchesQuery && (evidence === "all" || note.evidence === evidence);
      })
      .sort((a, b) => {
        if (sort === "oldest") return a.date.localeCompare(b.date);
        if (sort === "title") return a.title.localeCompare(b.title);
        return b.date.localeCompare(a.date);
      });
  }, [evidence, notes, query, sort]);

  const selected = notes.find((note) => note.id === selectedId) ?? visible[0] ?? notes[0] ?? null;
  const filtersActive = query !== "" || evidence !== "all" || sort !== "recent";

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
    setEvidence("all");
    setSort("recent");
  }

  return (
    <div
      ref={workspaceRef}
      className="grid scroll-mt-14 xl:grid-cols-[minmax(0,27rem)_minmax(0,1fr)]"
    >
      <section
        aria-label="Research note list"
        className={`min-w-0 flex-col border-b border-line xl:border-b-0 xl:border-r ${
          mobileDetail ? "hidden xl:flex" : "flex"
        }`}
      >
        <PanelHeader
          title="Research notes"
          meta={`${notes.length} items`}
          action={<AddButton label="Research" onClick={onAddResearch} tone="quiet" />}
        />

        {notes.length === 0 ? (
          <WorkspaceEmpty
            eyebrow="No research notes yet"
            title="The workspace starts to mean something when you write down what you saw."
            description="Keep observations separate from interpretation so the team can tell the difference later."
            primary={{ label: "Add the first note", onClick: onAddResearch }}
            icon="note"
          />
        ) : (
          <>
            <WorkspaceToolbar
              count={visible.length}
              query={query}
              onQueryChange={setQuery}
              searchLabel="research notes"
              searchPlaceholder="Search notes…"
              active={filtersActive}
              onReset={resetFilters}
            >
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
                options={NOTE_SORT_OPTIONS}
                onChange={setSort}
                className="w-[calc(50%-0.25rem)] sm:w-[8rem]"
              />
            </WorkspaceToolbar>

            {visible.length === 0 ? (
              <NoResults query={query} onClear={resetFilters} noun={`${notes.length} notes`} />
            ) : (
              <ul className="min-h-0 flex-1 overflow-y-auto [scrollbar-color:var(--line-2)_transparent] [scrollbar-width:thin] xl:max-h-[calc(100dvh-20rem)]">
                {visible.map((note, index) => {
                  const active = note.id === selected?.id;
                  return (
                    <li key={note.id} className="border-b border-line last:border-b-0">
                      <button
                        type="button"
                        onClick={() => select(note.id)}
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
                              {note.title}
                            </span>
                            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
                              {formatMarketUpdated(note.date)}
                            </span>
                          </span>

                          <span className="mt-1 line-clamp-2 block text-[11px] leading-relaxed text-muted">
                            {note.excerpt}
                          </span>

                          <span className="mt-2 flex flex-wrap items-center gap-1.5">
                            <EvidenceBadge type={note.evidence} />
                            <span className="truncate font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
                              {note.relatedLabel}
                            </span>
                          </span>

                          <span className="mt-1.5 flex items-center gap-1.5">
                            <span aria-hidden className="size-1 bg-line-2" />
                            <span className="truncate font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
                              {note.source}
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
        aria-label="Selected research note"
        className={`min-w-0 bg-panel ${mobileDetail ? "block" : "hidden xl:block"}`}
      >
        {mobileDetail ? (
          <DetailBackBar
            context={selected ? `Research / ${selected.title}` : "Research notes"}
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
                      Research note · {formatMarketDate(selected.date)}
                    </p>
                    <h2 className="mt-1.5 max-w-[30ch] text-[clamp(1.4rem,2.4vw,1.9rem)] font-medium leading-[1.08] tracking-[-0.035em] text-fg">
                      {selected.title}
                    </h2>
                  </div>
                  <EvidenceBadge type={selected.evidence} />
                </div>

                <p className="mt-3 max-w-[70ch] text-[13px] leading-relaxed text-muted">
                  {selected.excerpt}
                </p>

                <dl className="mt-4 grid gap-px border border-line bg-line sm:grid-cols-3">
                  <div className="bg-panel px-3 py-2">
                    <dt className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-faint">
                      Source
                    </dt>
                    <dd className="mt-1 text-[11px] leading-snug text-fg">{selected.source}</dd>
                  </div>
                  <div className="bg-panel px-3 py-2">
                    <dt className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-faint">
                      Date
                    </dt>
                    <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-fg">
                      {formatMarketDate(selected.date)}
                    </dd>
                  </div>
                  <div className="min-w-0 bg-panel px-3 py-2">
                    <dt className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-faint">
                      Related entity
                    </dt>
                    <dd className="mt-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => onOpenRelated(selected.relatedType, selected.relatedId)}
                        className="group inline-flex max-w-full items-center gap-1 text-left text-[11px] leading-snug text-fg transition-colors hover:text-accent"
                      >
                        <span className="truncate">{selected.relatedLabel}</span>
                        <span aria-hidden className="text-[10px] text-faint">→</span>
                      </button>
                    </dd>
                  </div>
                </dl>
              </header>

              <div className="border-b border-line bg-bg/35 px-5 py-3 sm:px-7">
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-relaxed text-muted">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                    Evidence type ·
                  </span>
                  <span className="font-medium text-fg">
                    {EVIDENCE_META[selected.evidence].label}
                  </span>
                  <span className="text-faint">{EVIDENCE_META[selected.evidence].description}</span>
                </p>
              </div>

              <div className="px-5 sm:px-7">
                <DetailSection label="Observations">
                  <p className="text-[12.5px] leading-relaxed text-muted">{selected.observations}</p>
                </DetailSection>

                <DetailSection label="Interpretation">
                  <p className="border-l-2 border-accent bg-mint-tint/20 px-3 py-2.5 text-[12.5px] leading-relaxed text-fg">
                    {selected.interpretation}
                  </p>
                </DetailSection>

                <DetailSection label="Follow-up questions">
                  <QuestionList items={selected.followUp} />
                </DetailSection>
              </div>

              <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-bg/40 px-5 py-3 sm:px-7">
                <SampleNotice />
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                  Edited {formatMarketUpdated(selected.date)} · no external source fetched
                </span>
              </footer>
            </motion.article>
          ) : (
            <DetailPlaceholder
              eyebrow="Research notes"
              title="Select a note to read what was observed, and what it might mean."
              description="The note keeps observations and interpretation in separate sections so later readers can judge the evidence for themselves."
              prompts={[
                ["01", "Observation", "What was seen, heard or read in the sample material?"],
                ["02", "Interpretation", "What meaning is being assigned, and how confident is it?"],
                ["03", "Follow-up", "Which question would sharpen or challenge this note?"],
              ]}
            />
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
