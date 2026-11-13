"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { StatePreview } from "@/components/ui/primitives";

import { useProducts } from "@/lib/product/use-products";
import {
  getInitiativesForProduct,
  getMilestonesForProduct,
  getNotesForProduct,
  getReleasesForProduct,
} from "@/lib/product-roadmap/demo";
import type { RoadmapProduct, RoadmapSection } from "@/lib/product-roadmap/types";

import { ProductRoadmapHeader } from "./product-roadmap-header";
import { RoadmapOverview } from "./roadmap-overview";
import { RoadmapWorkspaceNavigation } from "./roadmap-workspace-navigation";
import { RoadmapTimeline } from "./sections/roadmap-timeline";
import { InitiativeWorkspace } from "./sections/initiative-workspace";
import { ReleaseMilestoneWorkspace } from "./sections/release-milestone-workspace";
import { PriorityWorkspace } from "./sections/priority-workspace";
import { PlanningNotesWorkspace } from "./sections/planning-notes-workspace";
import { ProductRoadmapErrorState, ProductRoadmapSkeleton } from "./badges";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const STATE_OPTIONS = [
  { value: "populated", label: "Ready" },
  { value: "loading", label: "Loading" },
  { value: "error", label: "Error" },
] as const;

/** Shape returned by `GET /products`. */
type Product = {
  id: string;
  name: string;
  slug?: string;
};

/**
 * The products API stores a name only, so planning metadata is explicitly
 * unset here rather than borrowed from the demo catalogue.
 */
function toRoadmapProduct(product: Product): RoadmapProduct {
  return {
    id: product.id,
    name: product.name,
    ref: product.slug ?? product.id.slice(0, 8),
    direction: "Direction is not set yet.",
    horizon: "Not scheduled",
  };
}

function NoProducts() {
  return (
    <div className="border border-dashed border-line bg-panel px-5 py-10 text-center">
      <p className="text-[13px] leading-relaxed text-muted">
        No products yet — create one to get started
      </p>
    </div>
  );
}

export default function ProductRoadmapPage() {
  const reduce = useReducedMotion();
  const { data, isPending } = useProducts();
  const [productId, setProductId] = useState<string | null>(null);
  const [section, setSection] = useState<RoadmapSection>("Roadmap");
  const [view, setView] = useState<"populated" | "loading" | "error">("populated");

  // `getAllProducts` is untyped at the client wrapper, so narrow here.
  const products = useMemo(() => (data as Product[] | undefined) ?? [], [data]);
  const productOptions = useMemo(() => products.map(toRoadmapProduct), [products]);
  const selected = products.find((entry) => entry.id === productId) ?? products[0] ?? null;
  const product = selected ? toRoadmapProduct(selected) : null;
  const activeId = selected?.id ?? "";

  const initiatives = useMemo(() => getInitiativesForProduct(activeId), [activeId]);
  const releases = useMemo(() => getReleasesForProduct(activeId), [activeId]);
  const milestones = useMemo(() => getMilestonesForProduct(activeId), [activeId]);
  const notes = useMemo(() => getNotesForProduct(activeId), [activeId]);

  if (isPending) {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <ProductRoadmapSkeleton />
      </motion.div>
    );
  }

  if (!product) {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <NoProducts />
      </motion.div>
    );
  }

  if (view === "loading") {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <ProductRoadmapHeader
          product={product}
          onChangeProduct={setProductId}
          products={productOptions}
        />
        <ProductRoadmapSkeleton />
      </motion.div>
    );
  }

  if (view === "error") {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <ProductRoadmapHeader
          product={product}
          onChangeProduct={setProductId}
          products={productOptions}
        />
        <ProductRoadmapErrorState onRetry={() => setView("populated")} />
        <StatePreview
          value={view}
          options={STATE_OPTIONS}
          onChange={(next) => setView(next as typeof view)}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.28, ease: EASE }}
      className="flex flex-col gap-4"
    >
      <ProductRoadmapHeader
        product={product}
        onChangeProduct={setProductId}
        products={productOptions}
      />
      <RoadmapOverview
        product={product}
        initiatives={initiatives}
        releases={releases}
        milestones={milestones}
      />
      <RoadmapWorkspaceNavigation section={section} onChange={setSection} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={section}
          role="tabpanel"
          id={`roadmap-panel-${section}`}
          aria-labelledby={`roadmap-tab-${section}`}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: reduce ? 0 : 0.18, ease: EASE }}
        >
          {section === "Roadmap" ? (
            <RoadmapTimeline initiatives={initiatives} milestones={milestones} releases={releases} />
          ) : section === "Initiatives" ? (
            <InitiativeWorkspace
              initiatives={initiatives}
              milestones={milestones}
              releases={releases}
            />
          ) : section === "Releases & Milestones" ? (
            <ReleaseMilestoneWorkspace
              releases={releases}
              milestones={milestones}
              initiatives={initiatives}
            />
          ) : section === "Priorities" ? (
            <PriorityWorkspace initiatives={initiatives} />
          ) : (
            <PlanningNotesWorkspace notes={notes} />
          )}
        </motion.div>
      </AnimatePresence>

      <StatePreview
        value={view}
        options={STATE_OPTIONS}
        onChange={(next) => setView(next as typeof view)}
      />
    </motion.div>
  );
}
