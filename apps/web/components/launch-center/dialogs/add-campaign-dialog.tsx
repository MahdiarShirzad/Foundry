"use client";

import { useState } from "react";

import { LAUNCH_PHASES, LAUNCH_TASK_STATUSES } from "@/lib/launch-center/types";

import { PresentationalDialog } from "../primitives";

export function AddCampaignDialog({ onClose, open = true }: { onClose: () => void; open?: boolean }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => onClose(), 600);
  }

  if (!open) return null;

  return (
    <PresentationalDialog
      open
      onClose={onClose}
      eyebrow="Stage 06 / Launch"
      title="Add Campaign"
      description="Plan a channel campaign. Presentational only — nothing is saved."
      footer={
        <>
          <button type="button" onClick={onClose} className="border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-faint transition-colors hover:border-accent hover:text-accent">Cancel</button>
          <button form="add-campaign-form" type="submit" className="border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent">{submitted ? "Added (preview)" : "Add (preview)"}</button>
        </>
      }
    >
      <form id="add-campaign-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Channel name</label>
          <input className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" required />
        </div>
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Campaign objective</label>
          <textarea className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" rows={2} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Target audience</label>
            <input className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Launch phase</label>
            <select className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent">
              {LAUNCH_PHASES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Planned activity</label>
            <input className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Status</label>
            <select className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent">
              {LAUNCH_TASK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Planned date</label>
            <input type="date" className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Related assets</label>
            <input className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" placeholder="a-001, a-003 (preview)" />
          </div>
        </div>
      </form>
    </PresentationalDialog>
  );
}
