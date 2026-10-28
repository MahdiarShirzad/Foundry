"use client";

import { useState } from "react";

import type { PlanningNote } from "@/lib/product-roadmap/types";
import { NOTE_CATEGORIES } from "@/lib/product-roadmap/types";

import { ProductRoadmapEmptyState } from "../badges";
import { AddPlanningNoteDialog } from "../dialogs/roadmap-dialogs";

export function PlanningNotesWorkspace({
  notes,
}: {
  notes: PlanningNote[];
}) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(notes[0]?.id ?? null);

  const selected = notes.find((n) => n.id === selectedId) ?? notes[0] ?? null;

  if (notes.length === 0) {
    return <ProductRoadmapEmptyState title="No planning notes" description="Capture planning decisions and context." action={<button type="button" onClick={() => setOpen(true)} className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg">Add Note</button>} />;
  }

  return (
    <section className="border border-line bg-panel">
      <header className="border-b border-line px-4 py-3 flex items-center justify-between gap-2">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Planning Notes</p>
          <p className="mt-1 text-[11px] text-muted">{notes.length} note{notes.length !== 1 ? "s" : ""}</p>
        </div>
        <button type="button" onClick={() => setOpen(true)} className="border border-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-fg">Add</button>
      </header>
      <div className="grid gap-px bg-line lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
        <section className="bg-panel">
          <div className="max-h-[520px] overflow-auto p-2 space-y-2">
            {notes.map((n) => {
              const active = n.id === selected?.id;
              return (
                <button key={n.id} type="button" onClick={() => setSelectedId(n.id)} className={`w-full border-b border-line px-3 py-2 text-left transition-colors ${active ? "bg-mint-tint/30" : "hover:bg-mint-tint/20"}`}>
                  <p className="text-[12px] text-fg">{n.title}</p>
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">{n.category}</span>
                </button>
              );
            })}
          </div>
        </section>
        <section className="bg-panel">
          {selected ? (
            <div className="space-y-6 px-6 py-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Planning Note</p>
              <h3 className="mt-2 text-[1.3rem] font-medium tracking-[-0.03em] text-fg">{selected.title}</h3>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">{selected.category}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">{selected.period}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">{selected.date}</span>
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-fg">{selected.summary}</p>
              {selected.relatedItemId ? <p className="mt-2 text-[11px] text-muted">Related item: {selected.relatedItemId}</p> : null}
            </div>
          ) : null}
        </section>
      </div>
      <AddPlanningNoteDialog open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
