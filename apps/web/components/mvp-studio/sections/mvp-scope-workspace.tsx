"use client";

import { useState } from "react";

import type { Feature, MVPScopeItem } from "@/lib/mvp-studio/types";

import { MVPStudioEmptyState } from "../badges";
import { DefineMVPScopeDialog } from "../dialogs/define-mvp-scope-dialog";

export function MVPScopeWorkspace({
  scopeItems,
  features,
}: {
  scopeItems: MVPScopeItem[];
  features: Feature[];
}) {
  const [open, setOpen] = useState(false);
  const included = scopeItems.filter((s) => s.category === "included");
  const later = scopeItems.filter((s) => s.category === "later");
  const excluded = scopeItems.filter((s) => s.category === "excluded");

  if (scopeItems.length === 0 && features.length === 0) {
    return <MVPStudioEmptyState title="Empty MVP scope" description="Define what belongs in the first release." action={<button type="button" onClick={() => setOpen(true)} className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg">Define MVP Scope</button>} />;
  }

  return (
    <section className="border border-line bg-panel">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">MVP Scope</p>
          <p className="mt-1 text-[11.5px] text-muted">Separate included, planned for later, and explicitly excluded</p>
        </div>
        <button type="button" onClick={() => setOpen(true)} className="border border-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-fg">Define scope</button>
      </header>
      <div className="grid gap-px bg-line lg:grid-cols-3">
        <article className="bg-panel px-4 py-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-fg">Included in MVP</p>
          <div className="mt-3 space-y-2">
            {included.length === 0 ? <p className="text-[11.5px] text-faint">None</p> : included.map((item) => (
              <div key={item.id} className="border border-line px-3 py-2">
                <p className="text-[12px] text-fg">{item.name}</p>
                <p className="mt-1 text-[11px] text-muted">{item.explanation}</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">{item.status}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="bg-panel px-4 py-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Planned for later</p>
          <div className="mt-3 space-y-2">
            {later.length === 0 ? <p className="text-[11.5px] text-faint">None</p> : later.map((item) => (
              <div key={item.id} className="border border-line px-3 py-2">
                <p className="text-[12px] text-fg">{item.name}</p>
                <p className="mt-1 text-[11px] text-muted">{item.explanation}</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">{item.status}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="bg-panel px-4 py-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Explicitly excluded</p>
          <div className="mt-3 space-y-2">
            {excluded.length === 0 ? <p className="text-[11.5px] text-faint">None</p> : excluded.map((item) => (
              <div key={item.id} className="border border-line px-3 py-2">
                <p className="text-[12px] text-fg">{item.name}</p>
                <p className="mt-1 text-[11px] text-muted">{item.explanation}</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">{item.status}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
      <DefineMVPScopeDialog open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
