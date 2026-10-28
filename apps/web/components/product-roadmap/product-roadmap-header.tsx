"use client";

import { type ReactNode, useState } from "react";

import type { RoadmapProduct } from "@/lib/product-roadmap/types";

import { RoadmapPriorityBadge, RoadmapStatusBadge } from "./badges";
import { AddInitiativeDialog, AddMilestoneDialog, AddReleaseDialog, AddPlanningNoteDialog } from "./dialogs/roadmap-dialogs";

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
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="min-w-0">
        <p className="flex items-center gap-2.5 font-mono text-[9.5px] uppercase tracking-[0.24em] text-accent">
          <span aria-hidden className="size-1.5 bg-mint" />
          Stage 05 / Plan
        </p>
        <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.8rem)] font-medium leading-[0.98] tracking-[-0.04em] text-fg">
          Product Roadmap
        </h1>
        <p className="mt-2 max-w-[68ch] text-[12.5px] leading-relaxed text-muted">
          Turn product priorities into a clear direction with planned initiatives, meaningful milestones, and an organized release timeline.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 border border-line px-2.5 py-1.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Product</span>
            <select value={product.id} onChange={(e) => onChangeProduct(e.target.value)} className="bg-transparent text-[12px] text-fg outline-none" aria-label="Select product for roadmap">
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.ref}
                </option>
              ))}
            </select>
          </label>
          <span className="border border-line px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">Planning horizon · {product.horizon}</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setAddInitiativeOpen(true)} className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent">Add Initiative</button>
        <button type="button" onClick={() => setAddMilestoneOpen(true)} className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent">Add Milestone</button>
      </div>
      {addInitiativeOpen ? <AddInitiativeDialog open={addInitiativeOpen} onClose={() => setAddInitiativeOpen(false)} /> : null}
      {addMilestoneOpen ? <AddMilestoneDialog open={addMilestoneOpen} onClose={() => setAddMilestoneOpen(false)} /> : null}
      {addReleaseOpen ? <AddReleaseDialog open={addReleaseOpen} onClose={() => setAddReleaseOpen(false)} /> : null}
      {addNoteOpen ? <AddPlanningNoteDialog open={addNoteOpen} onClose={() => setAddNoteOpen(false)} /> : null}
    </header>
  );
}
