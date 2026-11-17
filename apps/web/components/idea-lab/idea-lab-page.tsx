"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { SplitPane } from "@/components/ui/primitives";
import { useProducts } from "@/lib/product/use-products";
import { useCreateIdea, useIdeas } from "@/lib/idea-lab/use-idea";
import {
  DEFAULT_IDEA_CATEGORIES,
  mergeCategories,
} from "@/lib/idea-lab/categories";
import { useHydrated } from "@/lib/use-hydrated";
import { useWorkspace } from "@/lib/workspace/use-workspace";
import {
  IDEA_STATUSES,
  LAB_TODAY,
  formatIdeaShortDate,
  type IdeaDraft,
  type IdeaStatusFilter,
  type LabView,
} from "@/lib/idea-lab/types";

import { IdeaCaptureModal } from "./idea-capture-modal";
import { IdeaCollection } from "./idea-collection";
import { IdeaDetailPanel } from "./idea-detail-panel";
import {
  IdeaLabDetailEmpty,
  IdeaLabEmptyCollection,
  IdeaLabNoResults,
} from "./idea-lab-empty-state";
import { IdeaLabErrorState } from "./idea-lab-error-state";
import { IdeaLabHeader } from "./idea-lab-header";
import { IdeaLabSkeleton } from "./idea-lab-skeleton";
import { IdeaToolbar } from "./idea-toolbar";

const WORKSPACE_HEIGHT = "md:h-[calc(100dvh-16rem)] md:min-h-[32rem]";

/** Shape returned by `GET /products`. */
type Product = {
  id: string;
  name: string;
  slug?: string;
};

export default function IdeaLabPage({
  categoryOptions,
  productId,
}: {
  categoryOptions?: string[];
  productId?: string;
}) {
  const reduce = useReducedMotion();
  const workspaceRef = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();

  const { data: productsData, isPending: productsPending } = useProducts();
  const products = (productsData as Product[] | undefined) ?? [];

  // The dashboard stores the active product in `?product=`; fall back to the
  // first product the same way the other module workspaces do. The fallback is
  // only applied after hydration so the server HTML and the first client
  // render agree on `data-product-id`.
  const activeProductId =
    productId ?? (hydrated ? products[0]?.id : undefined);

  const {
    ideas,
    loading: ideasLoading,
    error,
    refetch,
  } = useIdeas(activeProductId);
  const loading = productId ? ideasLoading : ideasLoading || productsPending;

  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<IdeaStatusFilter>("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("updated");
  const [captureOpen, setCaptureOpen] = useState(false);
  const [mobileDetail, setMobileDetail] = useState(false);

  const { data: workspace } = useWorkspace();
  const { create: createIdea } = useCreateIdea();

  const filteredIdeas = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const categoryKey = category.trim().toLowerCase();

    const matching = ideas.filter((idea) => {
      if (status !== "all" && idea.status !== status) return false;

      if (
        category !== "all" &&
        (idea.category ?? "").trim().toLowerCase() !== categoryKey
      ) {
        return false;
      }

      if (!needle) return true;

      const haystack = [
        idea.ref,
        idea.name,
        idea.headline,
        idea.summary,
        idea.problem,
        idea.audience,
        idea.solution,
        idea.context,
        idea.source,
        idea.category ?? "",
        ...idea.tags,
        ...idea.openQuestions,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    });

    return matching.sort((a, b) => {
      switch (sort) {
        case "alpha":
          return (
            a.name.localeCompare(b.name) ||
            b.updatedAt.localeCompare(a.updatedAt)
          );
        case "captured":
          return (
            b.capturedAt.localeCompare(a.capturedAt) ||
            b.updatedAt.localeCompare(a.updatedAt)
          );
        case "status": {
          const byStatus =
            IDEA_STATUSES.indexOf(a.status) - IDEA_STATUSES.indexOf(b.status);
          return byStatus || b.updatedAt.localeCompare(a.updatedAt);
        }
        case "updated":
        default:
          return (
            b.updatedAt.localeCompare(a.updatedAt) ||
            a.name.localeCompare(b.name)
          );
      }
    });
  }, [ideas, query, status, category, sort]);

  const selectedIdea =
    filteredIdeas.find((idea) => idea.id === selectedId) ??
    filteredIdeas[0] ??
    null;
  const lastUpdated = ideas.reduce(
    (latest, idea) => (idea.updatedAt > latest ? idea.updatedAt : latest),
    ideas[0]?.updatedAt ?? LAB_TODAY,
  );

  const exploring = ideas.filter((idea) => idea.status === "exploring").length;
  const shortlisted = ideas.filter(
    (idea) => idea.status === "shortlisted",
  ).length;

  // The server always renders the loading skeleton (its per-request QueryClient
  // has no data), so hold that view until hydration completes — react-query's
  // hydration snapshot can already contain cached data, which would otherwise
  // render content that never matches the server HTML.
  const renderedView: LabView = !hydrated || loading
    ? "loading"
    : error
      ? "error"
      : ideas.length === 0
        ? "empty"
        : filteredIdeas.length === 0
          ? "no-results"
          : "collection";

  const visibleCount = filteredIdeas.length;

  const availableCategories = useMemo(
    () =>
      mergeCategories(
        categoryOptions ?? DEFAULT_IDEA_CATEGORIES,
        ideas.map((idea) => idea.category ?? ""),
      ),
    [categoryOptions, ideas],
  );

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

  function retry() {
    setMobileDetail(false);
    void refetch();
  }

  function clearSearchAndFilters() {
    setQuery("");
    setStatus("all");
    setCategory("all");
    setMobileDetail(false);
  }

  async function captureIdea(draft: IdeaDraft) {
    if (!activeProductId) {
      throw new Error("Select a product before capturing an idea.");
    }

    if (!workspace?.id) {
      throw new Error(
        "Your workspace is still loading. Try capturing the idea again in a moment.",
      );
    }

    const idea = await createIdea({
      workspaceId: workspace.id,
      productId: activeProductId,
      name: draft.title || "Untitled idea",
      summary: draft.summary,
      problem: draft.problem,
      audience: draft.audience,
      category: draft.category,
      tags: draft.tags,
      context: draft.context,
      openQuestions: draft.assumption ? [draft.assumption] : [],
      status: "INBOX",
    });

    setSelectedId(idea.id);
    setMobileDetail(true);
    setCaptureOpen(false);
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-4"
      data-product-id={activeProductId}
    >
      <IdeaLabHeader
        total={ideas.length}
        exploring={exploring}
        shortlisted={shortlisted}
        lastUpdated={formatIdeaShortDate(lastUpdated)}
        onNewIdea={() => setCaptureOpen(true)}
      />

      <AnimatePresence mode="wait" initial={false}>
        {renderedView === "loading" ? (
          <motion.div
            key="loading"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.16 }}
          >
            <IdeaLabSkeleton />
          </motion.div>
        ) : renderedView === "error" ? (
          <motion.div
            key="error"
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.18 }}
          >
            <IdeaLabErrorState onReset={retry} />
          </motion.div>
        ) : (
          <motion.div
            key={renderedView}
            ref={workspaceRef}
            initial={reduce ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: reduce ? 0 : 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="scroll-mt-16"
          >
            <SplitPane
              className={`${WORKSPACE_HEIGHT} md:overflow-hidden`}
              list={
            <section
              aria-label="Idea collection"
              className={`min-h-0 flex-col bg-panel ${
                mobileDetail ? "hidden md:flex" : "flex"
              }`}
            >
              {renderedView === "empty" ? (
                <IdeaLabEmptyCollection
                  onNewIdea={() => setCaptureOpen(true)}
                />
              ) : (
                <>
                  <IdeaToolbar
                    query={query}
                    onQueryChange={setQuery}
                    status={status}
                    onStatusChange={setStatus}
                    category={category}
                    onCategoryChange={setCategory}
                    categoryOptions={availableCategories}
                    sort={sort}
                    onSortChange={setSort}
                    count={visibleCount}
                  />

                  {renderedView === "no-results" ? (
                    <IdeaLabNoResults
                      query={query}
                      onClear={clearSearchAndFilters}
                    />
                  ) : (
                    <IdeaCollection
                      ideas={filteredIdeas}
                      selectedId={selectedIdea?.id ?? ""}
                      onSelect={selectIdea}
                    />
                  )}
                </>
              )}
            </section>
              }
              detail={
            <section
              aria-label="Selected idea"
              className={`min-h-0 bg-panel ${mobileDetail ? "flex" : "hidden md:flex"}`}
            >
              {renderedView === "empty" || !selectedIdea ? (
                <IdeaLabDetailEmpty />
              ) : (
                <IdeaDetailPanel
                  idea={selectedIdea}
                  onBack={() => setMobileDetail(false)}
                />
              )}
            </section>
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {captureOpen ? (
          <IdeaCaptureModal
            key="capture"
            onClose={() => setCaptureOpen(false)}
            onSubmit={captureIdea}
            categoryOptions={availableCategories}
          />
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Route entry for the Idea Lab. Reads the active product from the URL
 * (`?product=<id>`) and threads it into the page. `useSearchParams` suspends
 * during prerendering, so the route renders this behind a Suspense boundary.
 */
export function IdeaLabRoute({
  categoryOptions,
}: {
  categoryOptions?: string[];
}) {
  const productId = useSearchParams().get("product") ?? undefined;
  return (
    <IdeaLabPage categoryOptions={categoryOptions} productId={productId} />
  );
}
