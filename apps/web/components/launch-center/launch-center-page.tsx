"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { StatePreview } from "@/components/ui/primitives";

import { useProducts } from "@/lib/product/use-products";
import {
  DEMO_CHECKLIST_ITEMS,
  getChannelsForProduct,
  getChecklistItemsForProduct,
  getLaunchAssetsForProduct,
  getLaunchTasksForProduct,
} from "@/lib/launch-center/demo";
import type { LaunchProduct, LaunchSection } from "@/lib/launch-center/types";
import { LaunchCenterHeader } from "./launch-center-header";
import { LaunchBrief } from "./launch-brief";
import { LaunchOverview } from "./launch-overview";
import { LaunchWorkspaceNavigation } from "./launch-workspace-navigation";
import { LaunchPlanTimeline } from "./sections/launch-plan-timeline";
import { LaunchChecklist } from "./sections/launch-checklist";
import { LaunchAssetWorkspace } from "./sections/launch-asset-workspace";
import { ChannelCampaignWorkspace } from "./sections/channel-campaign-workspace";
import { LaunchCenterErrorState, LaunchCenterSkeleton } from "./badges";

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
 * The products API stores a name only, so the launch plan metadata starts
 * unset instead of borrowed from the demo catalogue.
 */
function toLaunchProduct(product: Product): LaunchProduct {
  return {
    id: product.id,
    name: product.name,
    ref: product.slug ?? product.id.slice(0, 8),
    summary: "No launch summary yet.",
    launchDate: null,
    phase: "Not set",
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

export default function LaunchCenterPage() {
  const reduce = useReducedMotion();
  const { data, isPending } = useProducts();
  const [productId, setProductId] = useState<string | null>(null);
  const [section, setSection] = useState<LaunchSection>("Overview");
  const [view, setView] = useState<"populated" | "loading" | "error">("populated");
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    () => new Set(DEMO_CHECKLIST_ITEMS.filter((item) => item.completed).map((item) => item.id)),
  );

  // `getAllProducts` is untyped at the client wrapper, so narrow here.
  const products = useMemo(() => (data as Product[] | undefined) ?? [], [data]);
  const productOptions = useMemo(() => products.map(toLaunchProduct), [products]);
  const selected = products.find((entry) => entry.id === productId) ?? products[0] ?? null;
  const product = selected ? toLaunchProduct(selected) : null;
  const activeId = selected?.id ?? "";

  const tasks = useMemo(() => getLaunchTasksForProduct(activeId), [activeId]);
  const assets = useMemo(() => getLaunchAssetsForProduct(activeId), [activeId]);
  const channels = useMemo(() => getChannelsForProduct(activeId), [activeId]);
  const checklist = useMemo(() => getChecklistItemsForProduct(activeId), [activeId]);
  const checklistCompleted = checklist.filter((item) => completedIds.has(item.id)).length;

  function toggleChecklistItem(id: string) {
    setCompletedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (isPending) {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <LaunchCenterSkeleton />
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
        <LaunchCenterHeader
          product={product}
          products={productOptions}
          onChangeProduct={setProductId}
        />
        <LaunchCenterSkeleton />
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
        <LaunchCenterHeader
          product={product}
          products={productOptions}
          onChangeProduct={setProductId}
        />
        <LaunchCenterErrorState onRetry={() => setView("populated")} />
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
      <LaunchCenterHeader
        product={product}
        products={productOptions}
        onChangeProduct={setProductId}
      />

      <LaunchOverview
        product={product}
        tasks={tasks}
        assets={assets}
        channels={channels}
        checklist={checklist}
        checklistCompleted={checklistCompleted}
        onOpenSection={setSection}
      />

      <LaunchWorkspaceNavigation
        section={section}
        onChange={setSection}
        counts={{
          "Launch Plan": tasks.length,
          Checklist: checklist.length,
          "Launch Assets": assets.length,
          "Channels & Campaigns": channels.length,
        }}
      />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={section}
          role="tabpanel"
          id={`launch-panel-${section}`}
          aria-labelledby={`launch-tab-${section}`}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: reduce ? 0 : 0.18, ease: EASE }}
        >
          {section === "Overview" ? (
            <LaunchBrief
              product={product}
              tasks={tasks}
              channels={channels}
              onOpenSection={setSection}
            />
          ) : section === "Launch Plan" ? (
            <LaunchPlanTimeline tasks={tasks} />
          ) : section === "Checklist" ? (
            <LaunchChecklist
              items={checklist}
              completedIds={completedIds}
              onToggle={toggleChecklistItem}
            />
          ) : section === "Launch Assets" ? (
            <LaunchAssetWorkspace assets={assets} channels={channels} />
          ) : (
            <ChannelCampaignWorkspace channels={channels} assets={assets} />
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
