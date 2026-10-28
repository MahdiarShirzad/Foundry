"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { DEMO_IDEAS } from "@/lib/idea-lab/demo";
import {
  formatIdeaShortDate,
  type IdeaStatusFilter,
  type LabView,
} from "@/lib/idea-lab/types";

import { IdeaCaptureModal } from "./idea-capture-modal";
import { IdeaCollection } from "./idea-collection";
import { IdeaDetailPanel } from "./idea-detail-panel";
import { IdeaLabDetailEmpty, IdeaLabEmptyCollection, IdeaLabNoResults } from "./idea-lab-empty-state";
import { IdeaLabErrorState } from "./idea-lab-error-state";
import { IdeaLabHeader } from "./idea-lab-header";
import { IdeaLabSkeleton } from "./idea-lab-skeleton";
import { IdeaToolbar } from "./idea-toolbar";

const WORKSPACE_HEIGHT =
  "md:h-[calc(100dvh-14.75rem)] md:min-h-[32rem]";

const WORKSPACE_COLUMNS =
  "md:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,25.5rem)_minmax(0,1fr)]";

export default function IdeaLabPage() {
  const reduce = useReducedMotion();
  const workspaceRef = useRef<HTMLDivElement>(null);

  const [selectedId, setSelectedId] = useState(DEMO_IDEAS[0].id);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<IdeaStatusFilter>("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("updated");
  const [view, setView] = useState<LabView>("collection");
  const [captureOpen, setCaptureOpen] = useState(false);
  const [mobileDetail, setMobileDetail] = useState(false);

  const selectedIdea = DEMO_IDEAS.find((idea) => idea.id === selectedId) ?? DEMO_IDEAS[0];
  const lastUpdated = DEMO_IDEAS.reduce(
    (latest, idea) => (idea.updatedAt > latest ? idea.updatedAt : latest),
    DEMO_IDEAS[0].updatedAt,
  );

  const exploring = DEMO_IDEAS.filter((idea) => idea.status === "exploring").length;
  const shortlisted = DEMO_IDEAS.filter((idea) => idea.status === "shortlisted").length;
  const visibleCount = view === "no-results" ? 0 : DEMO_IDEAS.length;

  function selectIdea(id: string) {
    setSelectedId(id);
    setMobileDetail(true);

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches
    ) {
      requestAnimationFrame(() => {
        workspaceRef.current?.scrollIntoView({
          block: "start",
          behavior: reduce ? "auto" : "smooth",
        });
      });
    }
  }

  function changeView(next: LabView) {
    setView(next);
    setMobileDetail(false);
  }

  function clearSearchAndFilters() {
    setQuery("");
    setStatus("all");
    setCategory("all");
    setView("collection");
    setMobileDetail(false);
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-4"
    >
      <IdeaLabHeader
        total={DEMO_IDEAS.length}
        exploring={exploring}
        shortlisted={shortlisted}
        lastUpdated={formatIdeaShortDate(lastUpdated)}
        view={view}
        onViewChange={changeView}
        onNewIdea={() => setCaptureOpen(true)}
      />

      <AnimatePresence mode="wait" initial={false}>
        {view === "loading" ? (
          <motion.div
            key="loading"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.16 }}
          >
            <IdeaLabSkeleton />
          </motion.div>
        ) : view === "error" ? (
          <motion.div
            key="error"
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.18 }}
          >
            <IdeaLabErrorState onReset={() => changeView("collection")} />
          </motion.div>
        ) : (
          <motion.div
            key={view}
            ref={workspaceRef}
            initial={reduce ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={`grid scroll-mt-14 gap-px border border-line bg-line ${WORKSPACE_HEIGHT} ${WORKSPACE_COLUMNS} md:overflow-hidden`}
          >
            <section
              aria-label="Idea collection"
              className={`min-h-0 flex-col bg-panel ${
                mobileDetail ? "hidden md:flex" : "flex"
              }`}
            >
              {view === "empty" ? (
                <IdeaLabEmptyCollection onNewIdea={() => setCaptureOpen(true)} />
              ) : (
                <>
                  <IdeaToolbar
                    query={query}
                    onQueryChange={setQuery}
                    status={status}
                    onStatusChange={setStatus}
                    category={category}
                    onCategoryChange={setCategory}
                    sort={sort}
                    onSortChange={setSort}
                    count={visibleCount}
                  />

                  {view === "no-results" ? (
                    <IdeaLabNoResults query={query} onClear={clearSearchAndFilters} />
                  ) : (
                    <IdeaCollection
                      ideas={DEMO_IDEAS}
                      selectedId={selectedId}
                      onSelect={selectIdea}
                    />
                  )}
                </>
              )}
            </section>

            <section
              aria-label="Selected idea"
              className={`min-h-0 bg-panel ${mobileDetail ? "flex" : "hidden md:flex"}`}
            >
              {view === "empty" ? (
                <IdeaLabDetailEmpty />
              ) : (
                <IdeaDetailPanel idea={selectedIdea} onBack={() => setMobileDetail(false)} />
              )}
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
        <span aria-hidden className="size-1.5 bg-accent" />
        Static sample workspace ·
        <span>UI states, search &amp; filters are presentation only</span>
      </p>

      <AnimatePresence>
        {captureOpen ? (
          <IdeaCaptureModal
            key="capture"
            onClose={() => setCaptureOpen(false)}
          />
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
