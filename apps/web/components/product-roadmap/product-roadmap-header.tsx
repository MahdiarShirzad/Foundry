"use client";

import { useState } from "react";

import { Button, PlusIcon } from "@/components/ui/button";
import { HeaderSelect, ModuleHeader } from "@/components/ui/primitives";

import type { RoadmapProduct } from "@/lib/product-roadmap/types";

import {
  AddInitiativeDialog,
  AddMilestoneDialog,
  AddPlanningNoteDialog,
  AddReleaseDialog,
} from "./dialogs/roadmap-dialogs";

export function ProductRoadmapHeader({
  product,
  onChangeProduct,
  products,
}: {
  product: RoadmapProduct;
  onChangeProduct: (id: string) => void;
  products: RoadmapProduct[];
}) {
  const [addInitiativeOpen, setAddInitiativeOpen] = useState(false);
  const [addMilestoneOpen, setAddMilestoneOpen] = useState(false);
  const [addReleaseOpen, setAddReleaseOpen] = useState(false);
  const [addNoteOpen, setAddNoteOpen] = useState(false);

  return (
    <>
      <ModuleHeader
        stage="05"
        stageLabel="Plan"
        title="Product Roadmap"
        description="Turn product priorities into a clear direction with planned initiatives, meaningful milestones, and an organized release timeline."
        meta={[
          <span key="horizon" className="text-fg">
            Planning horizon · {product.horizon}
          </span>,
          product.direction,
        ]}
        controls={
          <HeaderSelect
            label="Product"
            value={product.id}
            onChange={onChangeProduct}
            ariaLabel="Select product for roadmap"
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
            <Button variant="secondary" size="md" onClick={() => setAddMilestoneOpen(true)}>
              Add Milestone
            </Button>
            <Button variant="secondary" size="md" onClick={() => setAddReleaseOpen(true)}>
              Add Release
            </Button>
            <Button variant="primary" size="md" onClick={() => setAddInitiativeOpen(true)}>
              <PlusIcon />
              Add Initiative
            </Button>
          </>
        }
      />
      {addInitiativeOpen ? (
        <AddInitiativeDialog open={addInitiativeOpen} onClose={() => setAddInitiativeOpen(false)} />
      ) : null}
      {addMilestoneOpen ? (
        <AddMilestoneDialog open={addMilestoneOpen} onClose={() => setAddMilestoneOpen(false)} />
      ) : null}
      {addReleaseOpen ? (
        <AddReleaseDialog open={addReleaseOpen} onClose={() => setAddReleaseOpen(false)} />
      ) : null}
      {addNoteOpen ? (
        <AddPlanningNoteDialog open={addNoteOpen} onClose={() => setAddNoteOpen(false)} />
      ) : null}
    </>
  );
}
