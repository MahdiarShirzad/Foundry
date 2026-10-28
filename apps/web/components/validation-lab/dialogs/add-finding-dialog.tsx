"use client";

import { useState } from "react";

import { EVIDENCE_TYPES } from "@/lib/validation-lab/types";

import { PresentationalDialog } from "../primitives";

export function AddFindingDialog({ onClose, open = true }: { onClose: () => void; open?: boolean }) {
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
      eyebrow="Stage 03 / Validate"
      title="Add Finding"
      description="Document evidence with observation, interpretation, and limitations."
      footer={
        <>
          <button type="button" onClick={onClose} className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-faint transition-colors hover:border-accent hover:text-accent">
            Cancel
          </button>
          <button form="add-finding-form" type="submit" className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent">
            {submitted ? "Added (preview)" : "Add (preview)"}
          </button>
        </>
      }
    >
      <form id="add-finding-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Title</label>
          <input className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Linked experiment</label>
            <input className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" placeholder="e-001" />
          </div>
          <div>
            <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Linked hypothesis</label>
            <input className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" placeholder="h-001" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Evidence type</label>
            <select className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent">
              {EVIDENCE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Source label</label>
            <input className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" placeholder="e.g. Interview notes" />
          </div>
        </div>
        <div>
          <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Observation (what was recorded)</label>
          <textarea className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" rows={3} required />
        </div>
        <div>
          <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Interpretation (what it might mean)</label>
          <textarea className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" rows={2} />
        </div>
        <div>
          <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Limitations / potential bias</label>
          <textarea className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" rows={2} />
        </div>
      </form>
    </PresentationalDialog>
  );
}
