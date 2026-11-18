"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { DevToolsPopover, StatePreview } from "@/components/ui/primitives";

import { useProducts } from "@/lib/product/use-products";
import { useHydrated } from "@/lib/use-hydrated";
import {
  useAssets,
  useChannels,
  useChecklist,
  useTasks,
  useUpdateChecklistItem,
} from "@/lib/launch/hooks";
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

export default function LaunchCenterPage({ productId }: { productId?: string }) {
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const { data, isPending } = useProducts();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [section, setSection] = useState<LaunchSection>("Overview");
  const [view, setView] = useState<"populated" | "loading" | "error">("populated");

  // `getAllProducts` is untyped at the client wrapper, so narrow here.
  const products = useMemo(() => (data as Product[] | undefined) ?? [], [data]);
  const productOptions = useMemo(() => products.map(toLaunchProduct), [products]);
  // The dashboard stores the active product in `?product=`; fall back to the
  // first product the same way the other module workspaces do.
  const activeId =
    selectedProductId ??
    productId ??
    (hydrated ? products[0]?.id : undefined) ??
    "";
  const selected = products.find((entry) => entry.id === activeId) ?? null;
  const product = selected ? toLaunchProduct(selected) : null;

  const { tasks, loading: tasksLoading, error: tasksError, refetch: refetchTasks } =
    useTasks(activeId || undefined);
  const { assets, loading: assetsLoading, error: assetsError, refetch: refetchAssets } =
    useAssets(activeId || undefined);
  const {
    channels,
    loading: channelsLoading,
    error: channelsError,
    refetch: refetchChannels,
  } = useChannels(activeId || undefined);
  const {
    checklist,
    loading: checklistLoading,
    error: checklistError,
    refetch: refetchChecklist,
  } = useChecklist(activeId || undefined);

  const updateChecklistItem = useUpdateChecklistItem(activeId || undefined);

  const dataLoading =
    tasksLoading || assetsLoading || channelsLoading || checklistLoading;
  const dataError = tasksError || assetsError || channelsError || checklistError;
  const checklistCompleted = checklist.filter((item) => item.completed).length;

  async function toggleChecklistItem(id: string) {
    const item = checklist.find((entry) => entry.id === id);
    if (!item) return;
    try {
      await updateChecklistItem.update(id, { completed: !item.completed });
    } catch (error) {
      console.error("Failed to update checklist item", error);
    }
  }

  function retry() {
    if (tasksError) void refetchTasks();
    if (assetsError) void refetchAssets();
    if (channelsError) void refetchChannels();
    if (checklistError) void refetchChecklist();
  }

  if (!hydrated || isPending || (product && dataLoading)) {
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
          onChangeProduct={setSelectedProductId}
        />
        <LaunchCenterSkeleton />
      </motion.div>
    );
  }

  if (dataError || view === "error") {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <LaunchCenterHeader
          product={product}
          products={productOptions}
          onChangeProduct={setSelectedProductId}
        />
        <LaunchCenterErrorState
          onRetry={() => {
            retry();
            setView("populated");
          }}
        />
        <div className="flex justify-end">
          <DevToolsPopover>
            <StatePreview
              value={view}
              options={STATE_OPTIONS}
              onChange={(next) => setView(next as typeof view)}
            />
          </DevToolsPopover>
        </div>
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
        onChangeProduct={setSelectedProductId}
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
              completedIds={
                new Set(checklist.filter((item) => item.completed).map((item) => item.id))
              }
              onToggle={(id) => void toggleChecklistItem(id)}
            />
          ) : section === "Launch Assets" ? (
            <LaunchAssetWorkspace assets={assets} channels={channels} />
          ) : (
            <ChannelCampaignWorkspace channels={channels} assets={assets} />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end">
        <DevToolsPopover>
          <StatePreview
            value={view}
            options={STATE_OPTIONS}
            onChange={(next) => setView(next as typeof view)}
          />
        </DevToolsPopover>
      </div>
    </motion.div>
  );
}

/**
 * Route entry for the Launch Center workspace. Reads the active product from
 * the URL (`?product=<id>`) and threads it into the page.
 */
export function LaunchCenterRoute() {
  const params = useSearchParams();
  const productId = params.get("product") ?? undefined;
  return <LaunchCenterPage productId={productId} />;
}
