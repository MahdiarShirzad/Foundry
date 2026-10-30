"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { StatePreview } from "@/components/ui/primitives";

import {
  DEMO_CHECKLIST_ITEMS,
  DEMO_LAUNCH_PRODUCTS,
  getChannelsForProduct,
  getChecklistItemsForProduct,
  getLaunchAssetsForProduct,
  getLaunchProduct,
  getLaunchTasksForProduct,
} from "@/lib/launch-center/demo";
import type { LaunchSection } from "@/lib/launch-center/types";
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

export default function LaunchCenterPage() {
  const reduce = useReducedMotion();
  const [productId, setProductId] = useState<string>(DEMO_LAUNCH_PRODUCTS[0].id);
  const [section, setSection] = useState<LaunchSection>("Overview");
  const [view, setView] = useState<"populated" | "loading" | "error">("populated");
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    () => new Set(DEMO_CHECKLIST_ITEMS.filter((item) => item.completed).map((item) => item.id)),
  );

  const product = getLaunchProduct(productId);
  const tasks = useMemo(() => getLaunchTasksForProduct(productId), [productId]);
  const assets = useMemo(() => getLaunchAssetsForProduct(productId), [productId]);
  const channels = useMemo(() => getChannelsForProduct(productId), [productId]);
  const checklist = useMemo(() => getChecklistItemsForProduct(productId), [productId]);
  const checklistCompleted = checklist.filter((item) => completedIds.has(item.id)).length;

  function toggleChecklistItem(id: string) {
    setCompletedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (view === "loading") {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <LaunchCenterHeader product={product} onChangeProduct={setProductId} />
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
        <LaunchCenterHeader product={product} onChangeProduct={setProductId} />
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
      <LaunchCenterHeader product={product} onChangeProduct={setProductId} />

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
