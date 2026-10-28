"use client";

import { useState } from "react";

import { DEMO_LAUNCH_PRODUCTS } from "@/lib/launch-center/demo";
import type { LaunchProduct } from "@/lib/launch-center/types";

import { AddLaunchTaskDialog } from "./dialogs/add-launch-task-dialog";
import { AddLaunchAssetDialog } from "./dialogs/add-launch-asset-dialog";
import { AddCampaignDialog } from "./dialogs/add-campaign-dialog";

export function LaunchCenterHeader({
  product,
  onChangeProduct,
  products = DEMO_LAUNCH_PRODUCTS,
}: {
  product: LaunchProduct;
  onChangeProduct: (id: string) => void;
  products?: LaunchProduct[];
}) {
  const [taskOpen, setTaskOpen] = useState(false);
  const [assetOpen, setAssetOpen] = useState(false);
  const [campaignOpen, setCampaignOpen] = useState(false);

  return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="min-w-0">
        <p className="flex items-center gap-2.5 font-mono text-[9.5px] uppercase tracking-[0.24em] text-accent">
          <span aria-hidden className="size-1.5 bg-mint" />
          Stage 06 / Launch
        </p>
        <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.8rem)] font-medium leading-[0.98] tracking-[-0.04em] text-fg">
          Launch Center
        </h1>
        <p className="mt-2 max-w-[68ch] text-[12.5px] leading-relaxed text-muted">
          Prepare your product for release with a clear launch plan, organized launch assets, and a focused readiness checklist.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 border border-line px-2.5 py-1.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Product</span>
            <select
              value={product.id}
              onChange={(e) => onChangeProduct(e.target.value)}
              className="bg-transparent text-[12px] text-fg outline-none"
              aria-label="Select product for launch planning"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.ref}
                </option>
              ))}
            </select>
          </label>
          <span className="border border-line px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
            {product.phase} · {product.launchDate}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setTaskOpen(true)}
          className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
        >
          Add Launch Task
        </button>
        <button
          type="button"
          onClick={() => setAssetOpen(true)}
          className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
        >
          Add Launch Asset
        </button>
        <button
          type="button"
          onClick={() => setCampaignOpen(true)}
          className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
        >
          Add Campaign
        </button>
      </div>
      {taskOpen ? <AddLaunchTaskDialog open={taskOpen} onClose={() => setTaskOpen(false)} /> : null}
      {assetOpen ? <AddLaunchAssetDialog open={assetOpen} onClose={() => setAssetOpen(false)} /> : null}
      {campaignOpen ? <AddCampaignDialog open={campaignOpen} onClose={() => setCampaignOpen(false)} /> : null}
    </header>
  );
}
