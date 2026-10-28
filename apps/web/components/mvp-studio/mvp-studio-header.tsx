"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";

import { DEMO_MVP_PROJECTS } from "@/lib/mvp-studio/demo";

import { AddFeatureDialog } from "./dialogs/add-feature-dialog";
import { DefineMVPScopeDialog } from "./dialogs/define-mvp-scope-dialog";

export function MVPStudioHeader({
  project,
  onChangeProject,
  projects = DEMO_MVP_PROJECTS as any,
}: {
  project: any;
  onChangeProject: (id: string) => void;
  projects?: any[];
}) {
  const [addOpen, setAddOpen] = useState(false);
  const [scopeOpen, setScopeOpen] = useState(false);

  return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="min-w-0">
        <p className="flex items-center gap-2.5 font-mono text-[9.5px] uppercase tracking-[0.24em] text-accent">
          <span aria-hidden className="size-1.5 bg-mint" />
          Stage 04 / Build
        </p>
        <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.8rem)] font-medium leading-[0.98] tracking-[-0.04em] text-fg">
          MVP Studio
        </h1>
        <p className="mt-2 max-w-[68ch] text-[12.5px] leading-relaxed text-muted">
          Turn your validated idea into a focused, buildable first version by defining essential features, setting boundaries, and organizing product specifications.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 border border-line px-2.5 py-1.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Product</span>
            <select value={project.id} onChange={(e) => onChangeProject(e.target.value)} className="bg-transparent text-[12px] text-fg outline-none" aria-label="Select product idea for MVP studio">
              {(projects as any[]).map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.ref}
                </option>
              ))}
            </select>
          </label>
          <span className="border border-line px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">MVP project · {project.name}</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setAddOpen(true)} className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent">Add Feature</button>
        <button type="button" onClick={() => setScopeOpen(true)} className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent">Define MVP Scope</button>
      </div>
      <AnimatePresence>
        {addOpen ? <AddFeatureDialog onClose={() => setAddOpen(false)} /> : null}
        {scopeOpen ? <DefineMVPScopeDialog onClose={() => setScopeOpen(false)} /> : null}
      </AnimatePresence>
    </header>
  );
}
