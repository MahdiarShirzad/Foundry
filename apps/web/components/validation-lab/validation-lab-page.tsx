"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  DEMO_EVIDENCE,
  DEMO_EXPERIMENTS,
  DEMO_HYPOTHESES,
  DEMO_VALIDATION_IDEAS,
  getValidationIdea,
} from "@/lib/validation-lab/demo";
import {
  type EvidenceDraft,
  type EvidenceItem,
  type Experiment,
  type ExperimentDraft,
  type Hypothesis,
  type HypothesisDraft,
  type HypothesisStatus,
  type ValidationSection,
  type ValidationView,
} from "@/lib/validation-lab/types";

import { ValidationLabHeader } from "./validation-lab-header";
import { ValidationOverview } from "./validation-overview";
import { ValidationWorkspaceNavigation } from "./validation-workspace-navigation";
import { ValidationWorkflow } from "./validation-workflow";
import { OverviewWorkspace } from "./sections/overview-workspace";
import { HypothesisWorkspace } from "./sections/hypothesis-workspace";
import { ExperimentWorkspace } from "./sections/experiment-workspace";
import { EvidenceWorkspace } from "./sections/evidence-workspace";
import { ValidationSummary } from "./sections/validation-summary";
import { ValidationErrorState, ValidationSkeleton } from "./badges";
import { EASE } from "./primitives";

const TODAY = "2026-10-30";

const VIEWS: { label: string; value: ValidationView }[] = [
  { label: "Ready", value: "populated" },
  { label: "Loading", value: "loading" },
  { label: "Error", value: "error" },
];

export default function ValidationLabPage() {
  const reduce = useReducedMotion();
  const nextId = useRef(1);

  const [ideaId, setIdeaId] = useState<string>(DEMO_VALIDATION_IDEAS[0].id);
  const [section, setSection] = useState<ValidationSection>("Overview");
  const [view, setView] = useState<ValidationView>("populated");
  const [toast, setToast] = useState<{ key: number; message: string } | null>(null);

  // Local collections: the dialogs add presentational records here, nothing else.
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>(DEMO_HYPOTHESES);
  const [experiments, setExperiments] = useState<Experiment[]>(DEMO_EXPERIMENTS);
  const [findings, setFindings] = useState<EvidenceItem[]>(DEMO_EVIDENCE);

  const idea = getValidationIdea(ideaId);
  const ideaHypotheses = useMemo(
    () => hypotheses.filter((h) => h.ideaId === ideaId),
    [hypotheses, ideaId],
  );
  const ideaExperiments = useMemo(
    () => experiments.filter((e) => e.ideaId === ideaId),
    [experiments, ideaId],
  );
  const ideaFindings = useMemo(
    () => findings.filter((f) => f.ideaId === ideaId),
    [findings, ideaId],
  );

  const notify = useCallback((message: string) => {
    setToast({ key: Date.now(), message });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  /* ---------------------------------------------------- local record adds --- */

  function addHypothesis(draft: HypothesisDraft) {
    const id = `h-local-${nextId.current++}`;
    setHypotheses((current) => [
      {
        id,
        ideaId: ideaId as Hypothesis["ideaId"],
        ...draft,
        status: "Unexamined" as HypothesisStatus,
        relatedExperimentIds: [],
        linkedFindings: [],
        unresolvedQuestions: [],
      },
      ...current,
    ]);
    setView("populated");
    notify(`Hypothesis added · “${draft.title}” · local state only`);
  }

  function addExperiment(draft: ExperimentDraft) {
    const id = `e-local-${nextId.current++}`;
    setExperiments((current) => [
      {
        id,
        ideaId: ideaId as Experiment["ideaId"],
        ...draft,
        status: "Draft",
        expectedEvidence: "Not specified yet",
        observations: [],
        notes: "",
      },
      ...current,
    ]);
    setHypotheses((current) =>
      current.map((h) =>
        h.id === draft.relatedHypothesisId
          ? { ...h, relatedExperimentIds: [...h.relatedExperimentIds, id] }
          : h,
      ),
    );
    setView("populated");
    notify("Experiment created as a draft · designed, not run");
  }

  function addFinding(draft: EvidenceDraft) {
    const id = `f-local-${nextId.current++}`;
    setFindings((current) => [{ id, ideaId: ideaId as EvidenceItem["ideaId"], ...draft, date: TODAY }, ...current]);
    setHypotheses((current) =>
      current.map((h) =>
        h.id === draft.relatedHypothesisId && !h.linkedFindings.includes(id)
          ? { ...h, linkedFindings: [...h.linkedFindings, id] }
          : h,
      ),
    );
    setView("populated");
    notify("Finding recorded · observation kept separate from interpretation");
  }

  function changeHypothesisStatus(id: string, status: HypothesisStatus) {
    setHypotheses((current) => current.map((h) => (h.id === id ? { ...h, status } : h)));
    notify(`Status set to “${status}” · a label you chose, not an evaluation`);
  }

  function changeIdea(id: string) {
    setIdeaId(id);
    setSection("Overview");
    setView("populated");
    notify(`Validation workspace · ${getValidationIdea(id).name} (local view)`);
  }

  /* ------------------------------------------------------------------ body --- */

  let body: ReactNode;
  if (view === "loading") {
    body = <ValidationSkeleton />;
  } else if (view === "error") {
    body = <ValidationErrorState onRetry={() => setView("populated")} />;
  } else {
    body = (
      <>
        <ValidationOverview
          hypotheses={ideaHypotheses}
          experiments={ideaExperiments}
          findings={ideaFindings}
        />
        <ValidationWorkspaceNavigation section={section} onChange={setSection} />
        <ValidationWorkflow />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={section}
            role="tabpanel"
            id={`validation-panel-${section}`}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: reduce ? 0 : 0.18, ease: EASE }}
          >
            {section === "Overview" ? (
              <OverviewWorkspace
                idea={idea}
                hypotheses={ideaHypotheses}
                experiments={ideaExperiments}
                findings={ideaFindings}
              />
            ) : section === "Hypotheses" ? (
              <HypothesisWorkspace
                hypotheses={ideaHypotheses}
                experiments={ideaExperiments}
                findings={ideaFindings}
                onAdd={addHypothesis}
                onStatusChange={changeHypothesisStatus}
              />
            ) : section === "Experiments" ? (
              <ExperimentWorkspace
                experiments={ideaExperiments}
                hypotheses={ideaHypotheses}
                onAdd={addExperiment}
              />
            ) : section === "Evidence & Findings" ? (
              <EvidenceWorkspace
                findings={ideaFindings}
                experiments={ideaExperiments}
                hypotheses={ideaHypotheses}
                onAdd={addFinding}
              />
            ) : (
              <ValidationSummary
                idea={idea}
                hypotheses={ideaHypotheses}
                experiments={ideaExperiments}
                findings={ideaFindings}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </>
    );
  }

  const statePreview = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line pt-3">
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
        <span aria-hidden className="size-1.5 bg-accent" />
        Frontend UI only · Static mock data · Local state for presentational interactions
      </p>
      <div className="ml-auto flex flex-wrap items-center gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
          UI state preview
        </span>
        {VIEWS.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            onClick={() => setView(value)}
            aria-pressed={view === value}
            className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
              view === value
                ? "border-accent/60 bg-mint-tint/50 text-accent"
                : "border-line text-faint hover:border-accent/60 hover:text-accent"
            }`}
          >
            {label}
          </button>
        ))}
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
          Empty workspace · select TideMarket
        </span>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.28, ease: EASE }}
      className="flex flex-col gap-4"
    >
      <ValidationLabHeader
        idea={idea}
        onChangeIdea={changeIdea}
        hypotheses={ideaHypotheses}
        experiments={ideaExperiments}
        findings={ideaFindings}
        onSubmitHypothesis={addHypothesis}
        onSubmitExperiment={addExperiment}
        onSubmitFinding={addFinding}
      />

      {body}
      {statePreview}

      <AnimatePresence>
        {toast ? (
          <motion.div
            key={toast.key}
            role="status"
            aria-live="polite"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
            className="fixed bottom-4 left-1/2 z-50 w-[min(92vw,26rem)] -translate-x-1/2 border border-accent/60 bg-bg px-4 py-3 text-center shadow-[0_18px_44px_-24px_rgb(14_27_29/0.5)] sm:left-auto sm:right-6 sm:w-auto sm:max-w-[26rem] sm:translate-x-0 sm:text-left"
          >
            <p className="text-[12px] leading-snug text-fg">{toast.message}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
