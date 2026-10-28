"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  DEMO_LAUNCH_PRODUCTS,
  getLaunchAssetsForProduct,
  getLaunchProduct,
  getLaunchTasksForProduct,
  getChannelsForProduct,
  getChecklistItemsForProduct,
} from "@/lib/launch-center/demo";
import { LAUNCH_SECTIONS, type LaunchSection } from "@/lib/launch-center/types";

import { LaunchCenterHeader } from "./launch-center-header";
import { LaunchOverview } from "./launch-overview";
import { LaunchWorkspaceNavigation } from "./launch-workspace-navigation";
import { LaunchPlanTimeline } from "./sections/launch-plan-timeline";
import { LaunchChecklist } from "./sections/launch-checklist";
import { LaunchAssetWorkspace } from "./sections/launch-asset-workspace";
import { ChannelCampaignWorkspace } from "./sections/channel-campaign-workspace";
import { LaunchTimelineVisualization } from "./sections/launch-timeline-visualization";
import { LaunchCenterSkeleton } from "./badges";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function LaunchCenterPage() {
  const reduce = useReducedMotion();
  const [productId, setProductId] = useState<string>(DEMO_LAUNCH_PRODUCTS[0].id);
  const [section, setSection] = useState<LaunchSection>("Overview");
  const [view, setView] = useState<"populated" | "loading">("populated");

  const product = getLaunchProduct(productId);
  const tasks = useMemo(() => getLaunchTasksForProduct(productId), [productId]);
  const assets = useMemo(() => getLaunchAssetsForProduct(productId), [productId]);
  const channels = useMemo(() => getChannelsForProduct(productId), [productId]);
  const checklist = useMemo(() => getChecklistItemsForProduct(productId), [productId]);

  if (view === "loading") {
    return (
      <motion.div initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
        <LaunchCenterHeader product={product} onChangeProduct={setProductId} />
        <LaunchCenterSkeleton />
      </motion.div>
    );
  }

  return (
    <motion.div initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.28, ease: EASE }} className="flex flex-col gap-4">
      <LaunchCenterHeader product={product} onChangeProduct={setProductId} />
      <LaunchOverview product={product} tasks={tasks} assets={assets} channels={channels} />
      <LaunchWorkspaceNavigation section={section} onChange={setSection} />
      <LaunchTimelineVisualization />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={section} initial={reduce ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -2 }} transition={{ duration: reduce ? 0 : 0.18, ease: EASE }}>
          {section === "Overview" ? (
            <section className="border border-line bg-panel">
              <header className="border-b border-line px-4 py-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Overview</p>
                <p className="mt-1 text-[11.5px] text-muted">Launch context and readiness summary</p>
              </header>
              <div className="grid gap-px bg-line lg:grid-cols-2">
                <article className="bg-panel px-4 py-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Product positioning</p>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-fg">{product.summary}</p>
                </article>
                <article className="bg-panel px-4 py-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Launch objective</p>
                  <p className="mt-2 text-[12px] leading-relaxed text-muted">Release a focused first version to early adopters.</p>
                </article>
                <article className="bg-panel px-4 py-4 lg:col-span-2">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Planned launch date</p>
                      <p className="mt-2 text-[12px] text-fg">{product.launchDate}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Current launch phase</p>
                      <p className="mt-2 text-[12px] text-fg">{product.phase}</p>
                    </div>
                  </div>
                </article>
                <article className="bg-panel px-4 py-4 lg:col-span-2">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Upcoming tasks</p>
                      <ul className="mt-2 space-y-1 text-[12px] text-muted">
                        {tasks.filter((t) => t.status === "Not Started").slice(0, 4).map((t) => <li key={t.id}>• {t.title}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Planned channels</p>
                      <ul className="mt-2 space-y-1 text-[12px] text-muted">
                        {channels.map((c) => <li key={c.id}>• {c.name}</li>)}
                      </ul>
                    </div>
                  </div>
                </article>
              </div>
            </section>
          ) : section === "Launch Plan" ? (
            <LaunchPlanTimeline tasks={tasks} />
          ) : section === "Checklist" ? (
            <LaunchChecklist items={checklist} />
          ) : section === "Launch Assets" ? (
            <LaunchAssetWorkspace assets={assets} channels={channels} />
          ) : (
            <ChannelCampaignWorkspace channels={channels} assets={assets} />
          )}
        </motion.div>
      </AnimatePresence>

      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
        <span aria-hidden className="size-1.5 bg-accent" />
        Frontend UI only · Static mock data · Local state for presentational interactions
      </p>
    </motion.div>
  );
}
