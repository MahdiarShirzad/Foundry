"use client";

import { useState } from "react";

import { PresentationalDialog } from "../primitives";
import { FEATURE_PRIORITIES, FEATURE_SCOPE } from "@/lib/mvp-studio/types";

export function AddFeatureDialog({ onClose, open = true }: { onClose: () => void; open?: boolean }) {
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
      eyebrow="Stage 04 / Build"
      title="Add Feature"
      description="Add a proposed feature. Presentational only — nothing is saved."
      footer={
        <>
          <button type="button" onClick={onClose} className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-faint transition-colors hover:border-accent hover:text-accent">Cancel</button>
          <button form="add-feature-form" type="submit" className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent">{submitted ? "Added (preview)" : "Add (preview)"}</button>
        </>
      }
    >
      <form id="add-feature-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Feature name</label>
          <input className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" required />
        </div>
        <div>
          <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Description</label>
          <textarea className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" rows={2} />
        </div>
        <div>
          <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">User problem</label>
          <textarea className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" rows={2} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Target user</label>
            <input className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" />
          </div>
          <div>
            <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Priority</label>
            <select className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent">
              {FEATURE_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Scope classification</label>
            <select className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent">
              {FEATURE_SCOPE.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">User story</label>
            <input className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" placeholder="As a ..., I want ..." />
          </div>
        </div>
        <div>
          <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Acceptance criteria</label>
          <textarea className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" rows={3} placeholder="One per line (preview)" />
        </div>
      </form>
    </PresentationalDialog>
  );
}
