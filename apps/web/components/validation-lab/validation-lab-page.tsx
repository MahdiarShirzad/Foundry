"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  DEMO_EVIDENCE,
  DEMO_EXPERIMENTS,
  DEMO_HYPOTHESES,
  DEMO_VALIDATION_IDEAS,
  getEvidenceForIdea,
  getExperimentsForIdea,
  getHypothesesForIdea,
  getValidationIdea,
} from "@/lib/validation-lab/demo";
import { VALIDATION_SECTIONS, type ValidationSection } from "@/lib/validation-lab/types";

import { ValidationLabHeader } from "./validation-lab-header";
import { ValidationOverview } from "./validation-overview";
import { ValidationWorkspaceNavigation } from "./validation-workspace-navigation";
import { ValidationWorkflow } from "./validation-workflow";
import { HypothesisWorkspace } from "./sections/hypothesis-workspace";
import { ExperimentWorkspace } from "./sections/experiment-workspace";
import { EvidenceWorkspace } from "./sections/evidence-workspace";
import { ValidationSummary } from "./sections/validation-summary";
import { ValidationSkeleton } from "./badges";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function ValidationLabPage() {
  const reduce = useReducedMotion();
  const [ideaId, setIdeaId] = useState<string>(DEMO_VALIDATION_IDEAS[0].id);
  const [section, setSection] = useState<ValidationSection>("Overview");
  const [view, setView] = useState<"populated" | "loading">("populated");

  const idea = getValidationIdea(ideaId);
  const hypotheses = useMemo(() => getHypothesesForIdea(ideaId), [ideaId]);
  const experiments = useMemo(() => getExperimentsForIdea(ideaId), [ideaId]);
  const findings = useMemo(() => getEvidenceForIdea(ideaId), [ideaId]);

  if (view === "loading") {
    return (
      <motion.div initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
        <ValidationLabHeader idea={idea} onChangeIdea={setIdeaId} />
        <ValidationSkeleton />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.28, ease: EASE }}
      className="flex flex-col gap-4"
    >
      <ValidationLabHeader idea={idea} onChangeIdea={setIdeaId} />
      <ValidationOverview hypotheses={hypotheses} experiments={experiments} findings={findings} />
      <ValidationWorkspaceNavigation section={section} onChange={setSection} />
      <ValidationWorkflow />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={section}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: reduce ? 0 : 0.18, ease: EASE }}
        >
          {section === "Overview" ? (
            <section className="border border-line bg-panel">
              <header className="border-b border-line px-4 py-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Overview</p>
                <p className="mt-1 text-[11.5px] text-muted">Picture of current validation effort</p>
              </header>
              <div className="grid gap-px bg-line lg:grid-cols-2">
                <article className="bg-panel px-4 py-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Product assumption being investigated</p>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-fg">{idea.assumption}</p>
                  <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">Distinction: belief vs evidence</p>
                  <p className="mt-1 text-[11.5px] text-muted">What the founder believes vs what available evidence supports (presented separately).</p>
                </article>
                <article className="bg-panel px-4 py-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Most important unresolved hypotheses</p>
                  <div className="mt-2 space-y-2">
                    {hypotheses
                      .filter((h) => h.importance === "High" && h.status !== "Supported")
                      .slice(0, 3)
                      .map((h) => (
                        <div key={h.id} className="border border-line px-3 py-2">
                          <p className="text-[12px] text-fg">{h.title}</p>
                          <p className="text-[11px] text-faint">{h.status}</p>
                        </div>
                      ))}
                  </div>
                </article>
                <article className="bg-panel px-4 py-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Recent experiment activity</p>
                  <div className="mt-2 space-y-2">
                    {experiments.slice(0, 3).map((e) => (
                      <div key={e.id} className="border border-line px-3 py-2">
                        <p className="text-[12px] text-fg">{e.title}</p>
                        <p className="text-[11px] text-faint">{e.method} · {e.status}</p>
                      </div>
                    ))}
                  </div>
                </article>
                <article className="bg-panel px-4 py-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Recent findings</p>
                  <div className="mt-2 space-y-2">
                    {findings.slice(0, 3).map((f) => (
                      <div key={f.id} className="border border-line px-3 py-2">
                        <p className="text-[12px] text-fg">{f.title}</p>
                        <p className="text-[11px] text-faint">{f.type}</p>
                      </div>
                    ))}
                  </div>
                </article>
                <article className="bg-panel px-4 py-4 lg:col-span-2">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Open questions</p>
                      <ul className="mt-2 space-y-1 text-[12px] text-muted">
                        {hypotheses.flatMap((h) => h.unresolvedQuestions).slice(0, 4).map((q) => <li key={q}>• {q}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Next validation tasks</p>
                      <ul className="mt-2 space-y-1 text-[12px] text-muted">
                        <li>• Run prototype test for low-friction capture (e-002)</li>
                        <li>• Continue interviews for decision recall (e-001)</li>
                        <li>• Review willingness to pay hypothesis</li>
                      </ul>
                    </div>
                  </div>
                </article>
              </div>
            </section>
          ) : section === "Hypotheses" ? (
            <HypothesisWorkspace hypotheses={hypotheses} experiments={experiments} findings={findings} />
          ) : section === "Experiments" ? (
            <ExperimentWorkspace experiments={experiments} hypotheses={hypotheses} />
          ) : section === "Evidence & Findings" ? (
            <EvidenceWorkspace findings={findings} experiments={experiments} hypotheses={hypotheses} />
          ) : (
            <ValidationSummary hypotheses={hypotheses} experiments={experiments} findings={findings} />
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
