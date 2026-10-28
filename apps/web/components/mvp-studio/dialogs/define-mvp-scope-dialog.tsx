"use client";

import { useState } from "react";

import { PresentationalDialog } from "../primitives";

export function DefineMVPScopeDialog({ onClose, open = true }: { onClose: () => void; open?: boolean }) {
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
      title="Define MVP Scope"
      description="Set boundaries for the first release. Presentational only."
      footer={
        <>
          <button type="button" onClick={onClose} className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-faint transition-colors hover:border-accent hover:text-accent">Cancel</button>
          <button form="define-scope-form" type="submit" className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent">{submitted ? "Saved (preview)" : "Save (preview)"}</button>
        </>
      }
    >
      <form id="define-scope-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">MVP objective</label>
          <input className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" />
        </div>
        <div>
          <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Primary user problem</label>
          <textarea className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" rows={2} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Target audience</label>
            <input className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" />
          </div>
          <div>
            <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Core value proposition</label>
            <input className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" />
          </div>
        </div>
        <div>
          <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Essential capabilities</label>
          <textarea className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" rows={3} placeholder="One per line (preview)" />
        </div>
        <div>
          <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Explicit exclusions</label>
          <textarea className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" rows={2} placeholder="One per line (preview)" />
        </div>
        <div>
          <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">Success criteria</label>
          <textarea className="mt-2 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none focus:border-accent" rows={2} />
        </div>
      </form>
    </PresentationalDialog>
  );
}
