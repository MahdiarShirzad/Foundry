"use client";

import { useState } from "react";

import { Button, PlusIcon } from "@/components/ui/button";
import { HeaderSelect, ModuleHeader } from "@/components/ui/primitives";

import { DEMO_LAUNCH_PRODUCTS } from "@/lib/launch-center/demo";
import type { LaunchProduct } from "@/lib/launch-center/types";

import { AddCampaignDialog } from "./dialogs/add-campaign-dialog";
import { AddLaunchAssetDialog } from "./dialogs/add-launch-asset-dialog";
import { AddLaunchTaskDialog } from "./dialogs/add-launch-task-dialog";

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
    <>
      <ModuleHeader
        stage="06"
        stageLabel="Launch"
        title="Launch Center"
        description="Prepare your product for release with a clear launch plan, organized launch assets, and a focused readiness checklist."
        meta={[
          <span key="phase" className="text-accent">
            {product.phase}
          </span>,
          <span key="date" className="text-fg">
            {product.launchDate}
          </span>,
          product.summary,
        ]}
        controls={
          <HeaderSelect
            label="Product"
            value={product.id}
            onChange={onChangeProduct}
            ariaLabel="Select product for launch planning"
          >
            {products.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.name} · {entry.ref}
              </option>
            ))}
          </HeaderSelect>
        }
        actions={
          <>
            <Button variant="secondary" size="md" onClick={() => setCampaignOpen(true)}>
              Add Campaign
            </Button>
            <Button variant="secondary" size="md" onClick={() => setAssetOpen(true)}>
              Add Launch Asset
            </Button>
            <Button variant="primary" size="md" onClick={() => setTaskOpen(true)}>
              <PlusIcon />
              Add Launch Task
            </Button>
          </>
        }
      />
      {taskOpen ? <AddLaunchTaskDialog open={taskOpen} onClose={() => setTaskOpen(false)} /> : null}
      {assetOpen ? (
        <AddLaunchAssetDialog open={assetOpen} onClose={() => setAssetOpen(false)} />
      ) : null}
      {campaignOpen ? (
        <AddCampaignDialog open={campaignOpen} onClose={() => setCampaignOpen(false)} />
      ) : null}
    </>
  );
}
