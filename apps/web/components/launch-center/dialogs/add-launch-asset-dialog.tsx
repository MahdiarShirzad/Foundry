"use client";

import { useState } from "react";

import { LAUNCH_ASSET_STATUSES } from "@/lib/launch-center/types";

import { PresentationalDialog } from "../primitives";

export function AddLaunchAssetDialog({ onClose, open = true }: { onClose: () => void; open?: boolean }) {
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
      title="Add Launch Asset"
      description="Add a launch asset. Presentational only — nothing is saved."
      footer={
        <>
          <button type="button" onClick={onClose} className="border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-faint transition-colors hover:border-accent hover:text-accent">Cancel</button>
          <button form="add-launch-asset-form" type="submit" className="border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent">{submitted ? "Added (preview)" : "Add (preview)"}</button>
        </>
      }
    >
      <form id="add-launch-asset-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Asset title</label>
          <input className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" required />
        </div>
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Asset type</label>
          <input className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" placeholder="e.g. Landing page copy" />
        </div>
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Content / preview</label>
          <textarea className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" rows={3} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Status</label>
            <select className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent">
              {LAUNCH_ASSET_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Related channel</label>
            <input className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" placeholder="e.g. c-001 (preview)" />
          </div>
        </div>
      </form>
    </PresentationalDialog>
  );
}
