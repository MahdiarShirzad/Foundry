"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { StatePreview } from "@/components/ui/primitives";

import {
  DEMO_ROADMAP_PRODUCTS,
  getInitiativesForProduct,
  getMilestonesForProduct,
  getNotesForProduct,
  getReleasesForProduct,
  getRoadmapProduct,
} from "@/lib/product-roadmap/demo";
import type { RoadmapSection } from "@/lib/product-roadmap/types";

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

export default function ProductRoadmapPage() {
  const reduce = useReducedMotion();
  const [productId, setProductId] = useState<string>(DEMO_ROADMAP_PRODUCTS[0].id);
  const [section, setSection] = useState<RoadmapSection>("Roadmap");
  const [view, setView] = useState<"populated" | "loading" | "error">("populated");

  const product = getRoadmapProduct(productId);
  const initiatives = useMemo(() => getInitiativesForProduct(productId), [productId]);
  const releases = useMemo(() => getReleasesForProduct(productId), [productId]);
  const milestones = useMemo(() => getMilestonesForProduct(productId), [productId]);
  const notes = useMemo(() => getNotesForProduct(productId), [productId]);

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
          products={DEMO_ROADMAP_PRODUCTS}
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
          products={DEMO_ROADMAP_PRODUCTS}
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
        products={DEMO_ROADMAP_PRODUCTS}
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
