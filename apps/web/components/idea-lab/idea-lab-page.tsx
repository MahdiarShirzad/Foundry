"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { useProducts } from "@/lib/product/use-products";
import { useIdeas } from "@/lib/idea-lab/use-idea";
import { useHydrated } from "@/lib/use-hydrated";
import {
  LAB_TODAY,
  formatIdeaShortDate,
  type IdeaStatusFilter,
  type LabView,
} from "@/lib/idea-lab/types";

import { IdeaCaptureModal } from "./idea-capture-modal";
import { IdeaCollection } from "./idea-collection";
import { IdeaDetailPanel } from "./idea-detail-panel";
import { IdeaLabDetailEmpty, IdeaLabEmptyCollection } from "./idea-lab-empty-state";
import { IdeaLabErrorState } from "./idea-lab-error-state";
import { IdeaLabHeader } from "./idea-lab-header";
import { IdeaLabSkeleton } from "./idea-lab-skeleton";
import { IdeaToolbar } from "./idea-toolbar";

const WORKSPACE_HEIGHT = "md:h-[calc(100dvh-14.75rem)] md:min-h-[32rem]";

const WORKSPACE_COLUMNS =
  "md:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,25.5rem)_minmax(0,1fr)]";

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

  const selectedIdea =
    ideas.find((idea) => idea.id === selectedId) ?? ideas[0] ?? null;
  const lastUpdated = ideas.reduce(
    (latest, idea) => (idea.updatedAt > latest ? idea.updatedAt : latest),
    ideas[0]?.updatedAt ?? LAB_TODAY,
  );

  const exploring = ideas.filter((idea) => idea.status === "exploring").length;
  const shortlisted = ideas.filter(
    (idea) => idea.status === "shortlisted",
  ).length;

  const renderedView: LabView = loading
    ? "loading"
    : error
      ? "error"
      : ideas.length === 0
        ? "empty"
        : "collection";

  const visibleCount = ideas.length;

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
            className={`grid scroll-mt-14 gap-px border border-line bg-line ${WORKSPACE_HEIGHT} ${WORKSPACE_COLUMNS} md:overflow-hidden`}
          >
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
                    categoryOptions={categoryOptions}
                    sort={sort}
                    onSortChange={setSort}
                    count={visibleCount}
                  />

                  <IdeaCollection
                    ideas={ideas}
                    selectedId={selectedIdea?.id ?? ""}
                    onSelect={selectIdea}
                  />
                </>
              )}
            </section>

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
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {captureOpen ? (
          <IdeaCaptureModal
            key="capture"
            onClose={() => setCaptureOpen(false)}
            categoryOptions={categoryOptions}
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
