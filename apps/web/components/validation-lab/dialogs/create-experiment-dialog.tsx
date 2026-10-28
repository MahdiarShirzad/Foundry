"use client";

import { useState } from "react";

import { EXPERIMENT_METHODS } from "@/lib/validation-lab/types";

import { PresentationalDialog } from "../primitives";

export function CreateExperimentDialog({ onClose, open = true }: { onClose: () => void; open?: boolean }) {
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
      title="Create Experiment"
      description="Design a test for a hypothesis. This is presentational only."
      footer={
        <>
          <button type="button" onClick={onClose} className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-faint transition-colors hover:border-accent hover:text-accent">
            Cancel
          </button>
          <button form="create-experiment-form" type="submit" className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent">
            {submitted ? "Created (preview)" : "Create (preview)"}
          </button>
        </>
      }
    >
      <form id="create-experiment-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Experiment title</label>
          <input className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Related hypothesis</label>
            <input className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" placeholder="h-001" />
          </div>
          <div>
            <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Method</label>
            <select className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent">
              {EXPERIMENT_METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Objective</label>
          <textarea className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" rows={3} />
        </div>
        <div>
          <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Success criteria</label>
          <textarea className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" rows={2} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Target participants / audience</label>
            <input className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" />
          </div>
          <div>
            <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Start date</label>
            <input type="date" className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" />
          </div>
        </div>
      </form>
    </PresentationalDialog>
  );
}
