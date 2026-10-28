"use client";

import { useState } from "react";

import type { EvidenceItem, Experiment, Hypothesis } from "@/lib/validation-lab/types";

import { PresentationalDialog } from "../primitives";
import { HYPOTHESIS_CATEGORIES } from "@/lib/validation-lab/types";

export function NewHypothesisDialog({ onClose, open = true }: { onClose: () => void; open?: boolean }) {
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
      title="New Hypothesis"
      description="Document an assumption to test. Nothing is saved — this is a presentational form."
      footer={
        <>
          <button type="button" onClick={onClose} className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-faint transition-colors hover:border-accent hover:text-accent">
            Cancel
          </button>
          <button form="new-hypothesis-form" type="submit" className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent">
            {submitted ? "Saved (preview)" : "Save (preview)"}
          </button>
        </>
      }
    >
      <form id="new-hypothesis-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Title</label>
          <input className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" placeholder="e.g. Decision recall is painful" required />
        </div>
        <div>
          <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Hypothesis statement</label>
          <textarea className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" rows={3} placeholder="We believe that..." required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Category</label>
            <select className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent">
              {HYPOTHESIS_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Target segment</label>
            <input className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" placeholder="e.g. Knowledge workers" />
          </div>
        </div>
        <div>
          <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Rationale / Why it matters</label>
          <textarea className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" rows={3} />
        </div>
        <div>
          <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Importance</label>
          <select className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent">
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </form>
    </PresentationalDialog>
  );
}
