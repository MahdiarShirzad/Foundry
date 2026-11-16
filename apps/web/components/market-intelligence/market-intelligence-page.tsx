"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { useIdeas } from "@/lib/idea-lab/use-idea";
import type { Idea } from "@/lib/idea-lab/types";
import { useProducts } from "@/lib/product/use-products";
import { useSession } from "@/lib/auth/use-session";
import { useHydrated } from "@/lib/use-hydrated";
import {
  toMarketIdea,
  type CreateCompetitorInput,
  type CreateResearchNoteInput,
  type CreateSegmentInput,
} from "@/lib/market-intelligence/api";
import {
  useMarketCompetitors,
  useMarketIdea,
  useMarketNotes,
  useMarketSegments,
} from "@/lib/market-intelligence/use-market";
import {
  MARKET_SECTION_META,
  type MarketIdea,
  type MarketSection,
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

/** Shape returned by `GET /products`. */
type Product = {
  id: string;
  name: string;
  slug?: string;
};

export default function MarketIntelligencePage({
  productId,
}: {
  productId?: string;
}) {
  const reduce = useReducedMotion();
  const workspaceRef = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();

  const { data: productsData, isPending: productsPending } = useProducts();
  const products = (productsData as Product[] | undefined) ?? [];

  // The dashboard stores the active product in `?product=`; fall back to the
  // first product the same way the other module workspaces do.
  const activeProductId =
    productId ?? (hydrated ? products[0]?.id : undefined);

  const {
    ideas,
    loading: ideasLoading,
    error: ideasError,
    refetch: refetchIdeas,
  } = useIdeas(activeProductId);

  const session = useSession();

  const [ideaId, setIdeaId] = useState("");
  const [section, setSection] = useState<MarketSection>("overview");
  const [selected, setSelected] =
    useState<Record<MarketSection, string | null>>(EMPTY_SELECTION);
  const [focus, setFocus] = useState<{ section: MarketSection; id: string } | null>(null);
  const [dialog, setDialog] = useState<DialogName | null>(null);

  const selectedIdea: Idea | null =
    ideas.find((idea) => idea.id === ideaId) ?? ideas[0] ?? null;
  const selectedIdeaId = selectedIdea?.id;

  // `null` market means the workspace was never initialized for this idea.
  const {
    market,
    loading: marketLoading,
    error: marketError,
    refetch: refetchMarket,
  } = useMarketIdea(selectedIdeaId);

  const competitors = useMarketCompetitors(selectedIdeaId);
  const segments = useMarketSegments(selectedIdeaId);
  const notes = useMarketNotes(selectedIdeaId);

  const idea: MarketIdea = useMemo(
    () => toMarketIdea(selectedIdea, market),
    [selectedIdea, market],
  );

  const ideaOptions = useMemo(
    () =>
      ideas.map((item) => ({
        value: item.id,
        label: item.name,
        shortLabel: item.name,
      })),
    [ideas],
  );

  // `marketLoading` is included so switching ideas shows the skeleton instead
  // of flashing the empty workspace while the next aggregate is in flight.
  const loading = productId
    ? ideasLoading || marketLoading
    : ideasLoading || productsPending || marketLoading;
  const error = ideasError || marketError;
  const initialized = market !== null;

  // The first (hydration) render must match the server, whose QueryClient is
  // always cold. Gate every branch on `hydrated` so both sides render the
  // skeleton no matter what the browser cache already holds.
  const renderedView: "loading" | "error" | "no-ideas" | "empty" | "workspace" =
    !hydrated
      ? "loading"
      : loading
        ? "loading"
        : error
          ? "error"
          : !selectedIdea
            ? "no-ideas"
            : !initialized
              ? "empty"
              : "workspace";

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

  function retry() {
    setFocus(null);
    if (ideasError) void refetchIdeas();
    if (marketError) void refetchMarket();
  }

  async function handleAddCompetitor(input: CreateCompetitorInput) {
    await competitors.addCompetitor(input);
  }

  async function handleAddSegment(input: CreateSegmentInput) {
    await segments.addSegment(input);
  }

  async function handleAddResearch(input: CreateResearchNoteInput) {
    const author =
      session.status === "authenticated" ? session.session.email : undefined;
    await notes.addNote(author ? { ...input, author } : input);
  }

  function renderSection() {
    // An idea whose market workspace was never initialized starts empty; the
    // first save creates it (the init endpoint is a get-or-create).
    if (!initialized) {
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

  if (renderedView === "no-ideas") {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.28, ease: EASE }}
        className="border border-line bg-panel px-6 py-14 text-center sm:px-9"
      >
        <p className="flex items-center justify-center gap-2.5 text-[12px] text-accent">
          <span aria-hidden className="size-1.5 bg-mint" />
          No ideas yet
        </p>
        <h2 className="mx-auto mt-3 max-w-[26ch] text-[clamp(1.5rem,2.6vw,2rem)] font-medium leading-[1.08] tracking-[-0.035em] text-fg">
          Market intelligence starts from an idea.
        </h2>
        <p className="mx-auto mt-3 max-w-[46ch] text-[13px] leading-relaxed text-muted">
          Capture an idea in the Idea Lab first — then organise its competitors,
          segments, opportunities and research notes here.
        </p>
      </motion.div>
    );
  }

  if (renderedView === "loading") {
    // Standalone skeleton: the hydration render must match the server, whose
    // QueryClient is always cold, so nothing data-dependent renders here.
    return <MarketIntelligenceSkeleton />;
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
        ideas={ideaOptions}
        ideaId={selectedIdeaId ?? ""}
        onIdeaChange={changeIdea}
        onAddResearch={() => setDialog("research")}
        onAddCompetitor={() => setDialog("competitor")}
      />

      {renderedView !== "error" ? <ResearchOverview idea={idea} /> : null}

      <AnimatePresence mode="wait" initial={false}>
        {renderedView === "error" ? (
          <motion.div
            key="error"
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.18 }}
          >
            <MarketIntelligenceErrorState
              onRetry={retry}
              onOverview={() => changeSection("overview")}
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
                  key={`${idea.id}-${section}`}
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

      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-faint">
        <span aria-hidden className="size-1.5 bg-accent" />
        {MARKET_SECTION_META[section].label}
        {selectedIdea ? (
          <>
            {" "}
            <span aria-hidden className="size-0.5 bg-line-2" /> {idea.ref}{" "}
            {idea.name}
          </>
        ) : null}
      </p>

      <AnimatePresence>
        {dialog === "research" ? (
          <AddResearchDialog
            key="add-research"
            idea={idea}
            onClose={() => setDialog(null)}
            onSubmit={handleAddResearch}
          />
        ) : null}
        {dialog === "competitor" ? (
          <AddCompetitorDialog
            key="add-competitor"
            onClose={() => setDialog(null)}
            onSubmit={handleAddCompetitor}
          />
        ) : null}
        {dialog === "segment" ? (
          <AddSegmentDialog
            key="add-segment"
            onClose={() => setDialog(null)}
            onSubmit={handleAddSegment}
          />
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Route entry for the Market Intelligence workspace. Reads the active product
 * from the URL (`?product=<id>`) and threads it into the page.
 * `useSearchParams` suspends during prerendering, so the route renders this
 * behind a Suspense boundary.
 */
export function MarketIntelligenceRoute() {
  const productId = useSearchParams().get("product") ?? undefined;
  return <MarketIntelligencePage productId={productId} />;
}
