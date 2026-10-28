"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  DEMO_MVP_PROJECTS,
  getFeaturesForProject,
  getMVPProject,
  getScopeForProject,
} from "@/lib/mvp-studio/demo";
import { MVP_SECTIONS, type MVPSection } from "@/lib/mvp-studio/types";

import { MVPStudioHeader } from "./mvp-studio-header";
import { MVPProjectOverview } from "./mvp-project-overview";
import { MVPWorkspaceNavigation } from "./mvp-workspace-navigation";
import { FeatureBacklog } from "./sections/feature-backlog";
import { MVPScopeWorkspace } from "./sections/mvp-scope-workspace";
import { FeatureSpecification } from "./sections/feature-specification";
import { BuildProgressBoard } from "./sections/build-progress-board";
import { ProductStructureVisualization } from "./product-structure-visualization";
import { MVPStudioSkeleton } from "./badges";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function MVPStudioPage() {
  const reduce = useReducedMotion();
  const [projectId, setProjectId] = useState<string>(DEMO_MVP_PROJECTS[0].id);
  const [section, setSection] = useState<MVPSection>("Overview");
  const [view, setView] = useState<"populated" | "loading">("populated");

  const project = getMVPProject(projectId);
  const features = useMemo(() => getFeaturesForProject(projectId), [projectId]);
  const scopeItems = useMemo(() => getScopeForProject(projectId), [projectId]);

  if (view === "loading") {
    return (
      <motion.div initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
        <MVPStudioHeader project={project} onChangeProject={setProjectId} />
        <MVPStudioSkeleton />
      </motion.div>
    );
  }

  return (
    <motion.div initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.28, ease: EASE }} className="flex flex-col gap-4">
      <MVPStudioHeader project={project} onChangeProject={setProjectId} />
      <MVPProjectOverview project={project} features={features} />
      <MVPWorkspaceNavigation section={section} onChange={setSection} />
      <ProductStructureVisualization />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={section} initial={reduce ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -2 }} transition={{ duration: reduce ? 0 : 0.18, ease: EASE }}>
          {section === "Overview" ? (
            <section className="border border-line bg-panel">
              <header className="border-b border-line px-4 py-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Overview</p>
                <p className="mt-1 text-[11.5px] text-muted">Essential context for the MVP</p>
              </header>
              <div className="grid gap-px bg-line lg:grid-cols-2">
                <article className="bg-panel px-4 py-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Product concept</p>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-fg">{project.concept}</p>
                </article>
                <article className="bg-panel px-4 py-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Core user problem</p>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-fg">{project.problem}</p>
                </article>
                <article className="bg-panel px-4 py-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Target audience</p>
                  <p className="mt-2 text-[12px] text-fg">{project.targetAudience}</p>
                </article>
                <article className="bg-panel px-4 py-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Primary value proposition</p>
                  <p className="mt-2 text-[12px] text-fg">{project.valueProp}</p>
                </article>
                <article className="bg-panel px-4 py-4 lg:col-span-2">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">MVP objective</p>
                      <p className="mt-2 text-[12px] leading-relaxed text-fg">{project.mvpObjective}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Current scope summary</p>
                      <p className="mt-2 text-[12px] leading-relaxed text-fg">{project.currentScope}</p>
                    </div>
                  </div>
                </article>
                <article className="bg-panel px-4 py-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Critical features</p>
                  <div className="mt-2 space-y-2">
                    {features.filter((f) => f.priority === "Critical").slice(0, 3).map((f) => (
                      <div key={f.id} className="border border-line px-3 py-2">
                        <p className="text-[12px] text-fg">{f.name}</p>
                        <p className="text-[11px] text-faint">{f.scope}</p>
                      </div>
                    ))}
                  </div>
                </article>
                <article className="bg-panel px-4 py-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Unresolved product decisions</p>
                  <ul className="mt-2 space-y-1 text-[12px] text-muted">
                    {features.flatMap((f) => f.openQuestions).slice(0, 4).map((q) => <li key={q}>• {q}</li>)}
                  </ul>
                </article>
              </div>
            </section>
          ) : section === "Feature Backlog" ? (
            <FeatureBacklog features={features} />
          ) : section === "MVP Scope" ? (
            <MVPScopeWorkspace scopeItems={scopeItems} features={features} />
          ) : section === "Specifications" ? (
            <FeatureSpecification features={features} />
          ) : (
            <BuildProgressBoard features={features} />
          )}
        </motion.div>
      </AnimatePresence>

      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
        <span aria-hidden className="size-1.5 bg-accent" />
        Frontend UI only · Static mock data · Local state for presentational interactions
      </p>
    </motion.div>
  );
}
