"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  DEMO_MARKET_IDEAS,
  MARKET_IDEA_OPTIONS,
  getMarketIdea,
} from "@/lib/market-intelligence/demo";
import {
  MARKET_SECTION_META,
  MARKET_VIEW_OPTIONS,
  type MarketIdea,
  type MarketSection,
  type MarketView,
  type RelatedType,
} from "@/lib/market-intelligence/types";

import { CompetitorWorkspace } from "./competitor-workspace";
import { MarketEmptyWorkspace } from "./market-intelligence-empty-state";
import { MarketIntelligenceErrorState } from "./market-intelligence-error-state";
import { MarketIntelligenceHeader } from "./market-intelligence-header";
import { MarketIntelligenceSkeleton } from "./market-intelligence-skeleton";
import { MarketOverview } from "./market-overview";
import { MarketSegmentWorkspace } from "./market-segment-workspace";
import { MarketWorkspaceNavigation } from "./market-workspace-navigation";
import { OpportunityWorkspace } from "./opportunity-workspace";
import { EASE } from "./primitives";
import { ResearchNotesWorkspace } from "./research-notes-workspace";
import { ResearchOverview } from "./research-overview";
import {
  AddCompetitorDialog,
  AddResearchDialog,
  AddSegmentDialog,
} from "./research-dialogs";

type DialogName = "research" | "competitor" | "segment";

const EMPTY_SELECTION: Record<MarketSection, string | null> = {
  overview: null,
  competitors: null,
  segments: null,
  opportunities: null,
  notes: null,
};

export default function MarketIntelligencePage() {
  const reduce = useReducedMotion();
  const workspaceRef = useRef<HTMLDivElement>(null);

  const [ideaId, setIdeaId] = useState(DEMO_MARKET_IDEAS[0].id);
  const [view, setView] = useState<MarketView>("workspace");
  const [section, setSection] = useState<MarketSection>("overview");
  const [selected, setSelected] =
    useState<Record<MarketSection, string | null>>(EMPTY_SELECTION);
  const [focus, setFocus] = useState<{ section: MarketSection; id: string } | null>(null);
  const [dialog, setDialog] = useState<DialogName | null>(null);

  const baseIdea = getMarketIdea(ideaId);

  const idea: MarketIdea = useMemo(() => {
    if (view === "empty") {
      return {
        ...baseIdea,
        competitors: [],
        segments: [],
        opportunities: [],
        notes: [],
        openQuestions: [],
      };
    }
    if (view === "empty-competitors") return { ...baseIdea, competitors: [] };
    if (view === "empty-notes") return { ...baseIdea, notes: [] };
    return baseIdea;
  }, [baseIdea, view]);

  const counts: Record<MarketSection, number> = {
    overview:
      idea.competitors.length +
      idea.segments.length +
      idea.opportunities.length +
      idea.notes.length,
    competitors: idea.competitors.length,
    segments: idea.segments.length,
    opportunities: idea.opportunities.length,
    notes: idea.notes.length,
  };

  function scrollToWorkspace() {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(max-width: 1279px)").matches) return;
    requestAnimationFrame(() => {
      workspaceRef.current?.scrollIntoView({
        block: "start",
        behavior: reduce ? "auto" : "smooth",
      });
    });
  }

  function changeIdea(nextId: string) {
    setIdeaId(nextId);
    setSelected(EMPTY_SELECTION);
    setFocus(null);
  }

  function changeView(next: MarketView) {
    setView(next);
    setFocus(null);

    if (next === "empty") setSection("overview");
    else if (next === "empty-competitors") setSection("competitors");
    else if (next === "empty-notes") setSection("notes");
  }

  function changeSection(next: MarketSection) {
    setSection(next);
    setFocus(null);
  }

  function openSection(next: MarketSection) {
    changeSection(next);
    scrollToWorkspace();
  }

  function openEntity(next: MarketSection, id: string) {
    setSelected((current) => ({ ...current, [next]: id }));
    setFocus({ section: next, id });
    setSection(next);
    scrollToWorkspace();
  }

  function openRelated(type: RelatedType, id: string) {
    if (type === "idea") {
      changeSection("overview");
      return;
    }
    openEntity(type === "competitor" ? "competitors" : type === "segment" ? "segments" : "opportunities", id);
  }

  function selectEntity(next: MarketSection, id: string) {
    setSelected((current) => ({ ...current, [next]: id }));
  }

  function renderSection() {
    if (view === "empty") {
      return (
        <MarketEmptyWorkspace
          onAddResearch={() => setDialog("research")}
          onAddCompetitor={() => setDialog("competitor")}
        />
      );
    }

    if (section === "overview") {
      return (
        <MarketOverview
          idea={idea}
          onOpenSection={openSection}
          onOpenNote={(id) => openEntity("notes", id)}
          onOpenOpportunity={(id) => openEntity("opportunities", id)}
          onAddResearch={() => setDialog("research")}
        />
      );
    }

    if (section === "competitors") {
      return (
        <CompetitorWorkspace
          competitors={idea.competitors}
          onAddCompetitor={() => setDialog("competitor")}
          selectedId={selected.competitors}
          onSelect={(id) => selectEntity("competitors", id)}
          openDetail={focus?.section === "competitors"}
        />
      );
    }

    if (section === "segments") {
      return (
        <MarketSegmentWorkspace
          idea={idea}
          segments={idea.segments}
          onAddSegment={() => setDialog("segment")}
          onOpenOpportunity={(id) => openEntity("opportunities", id)}
          selectedId={selected.segments}
          onSelect={(id) => selectEntity("segments", id)}
          openDetail={focus?.section === "segments"}
        />
      );
    }

    if (section === "opportunities") {
      return (
        <OpportunityWorkspace
          idea={idea}
          opportunities={idea.opportunities}
          onAddResearch={() => setDialog("research")}
          onOpenNote={(id) => openEntity("notes", id)}
          selectedId={selected.opportunities}
          onSelect={(id) => selectEntity("opportunities", id)}
          openDetail={focus?.section === "opportunities"}
        />
      );
    }

    return (
      <ResearchNotesWorkspace
        notes={idea.notes}
        onAddResearch={() => setDialog("research")}
        onOpenRelated={openRelated}
        selectedId={selected.notes}
        onSelect={(id) => selectEntity("notes", id)}
        openDetail={focus?.section === "notes"}
      />
    );
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.28, ease: EASE }}
      className="flex flex-col gap-4"
    >
      <MarketIntelligenceHeader
        idea={idea}
        ideas={MARKET_IDEA_OPTIONS}
        ideaId={ideaId}
        onIdeaChange={changeIdea}
        view={view}
        onViewChange={changeView}
        onAddResearch={() => setDialog("research")}
        onAddCompetitor={() => setDialog("competitor")}
      />

      {view !== "loading" && view !== "error" ? <ResearchOverview idea={idea} /> : null}

      <AnimatePresence mode="wait" initial={false}>
        {view === "loading" ? (
          <motion.div
            key="loading"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.16 }}
          >
            <MarketIntelligenceSkeleton />
          </motion.div>
        ) : view === "error" ? (
          <motion.div
            key="error"
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.18 }}
          >
            <MarketIntelligenceErrorState
              onRetry={() => changeView("workspace")}
              onOverview={() => {
                changeView("workspace");
                changeSection("overview");
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="workspace"
            ref={workspaceRef}
            initial={reduce ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.18, ease: EASE }}
            className="scroll-mt-14"
          >
            <MarketWorkspaceNavigation
              section={section}
              onChange={changeSection}
              counts={counts}
            />

            <div
              id={`market-panel-${section}`}
              role="tabpanel"
              aria-labelledby={`market-tab-${section}`}
              tabIndex={0}
              className="border border-t-0 border-line bg-panel focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${idea.id}-${view}-${section}`}
                  initial={reduce ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.14, ease: EASE }}
                >
                  {renderSection()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[8px] uppercase tracking-[0.14em] text-faint">
        <span aria-hidden className="size-1.5 bg-accent" />
        {MARKET_SECTION_META[section].label} · {idea.ref} {idea.name}
        <span aria-hidden className="size-0.5 bg-line-2" />
        <span>Static sample workspace</span>
        <span aria-hidden className="size-0.5 bg-line-2" />
        <span>{MARKET_VIEW_OPTIONS.find((option) => option.value === view)?.label}</span>
        <span aria-hidden className="size-0.5 bg-line-2" />
        <span>No API, scraping or AI analysis</span>
      </p>

      <AnimatePresence>
        {dialog === "research" ? (
          <AddResearchDialog
            key="add-research"
            idea={baseIdea}
            onClose={() => setDialog(null)}
          />
        ) : null}
        {dialog === "competitor" ? (
          <AddCompetitorDialog key="add-competitor" onClose={() => setDialog(null)} />
        ) : null}
        {dialog === "segment" ? (
          <AddSegmentDialog key="add-segment" onClose={() => setDialog(null)} />
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
