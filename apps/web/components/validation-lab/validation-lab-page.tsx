"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { useIdeas } from "@/lib/idea-lab/use-idea";
import { useProducts } from "@/lib/product/use-products";
import { useHydrated } from "@/lib/use-hydrated";
import { toValidationIdea } from "@/lib/validation/api";
import {
  useCreateEvidence,
  useCreateExperiment,
  useCreateHypothesis,
  useEvidence,
  useExperiments,
  useHypotheses,
  useUpdateHypothesis,
} from "@/lib/validation/hooks";
import {
  type EvidenceDraft,
  type ExperimentDraft,
  type HypothesisDraft,
  type HypothesisStatus,
  type ValidationIdea,
  type ValidationSection,
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

/** Shape returned by `GET /products`. */
type Product = {
  id: string;
  name: string;
  slug?: string;
};

const EMPTY_IDEA: ValidationIdea = {
  id: "",
  name: "No idea selected",
  ref: "—",
  assumption: "Capture an idea in the Idea Lab to start validating its assumptions.",
  nextTasks: [],
};

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export default function ValidationLabPage({
  productId,
  ideaId: routeIdeaId,
}: {
  productId?: string;
  ideaId?: string;
}) {
  const reduce = useReducedMotion();
  const hydrated = useHydrated();

  const { data: productsData, isPending: productsPending } = useProducts();
  const products = (productsData as Product[] | undefined) ?? [];

  // The dashboard stores the active product in `?product=`; fall back to the
  // first product the same way the other module workspaces do.
  const activeProductId =
    productId ?? (hydrated ? products[0]?.id : undefined);

  const {
    ideas,
    loading: ideasLoading,
    error: ideasError,
    refetch: refetchIdeas,
  } = useIdeas(activeProductId);

  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [section, setSection] = useState<ValidationSection>("Overview");
  const [toast, setToast] = useState<{ key: number; message: string } | null>(null);

  const activeIdeaId = selectedIdeaId ?? routeIdeaId ?? "";
  const selectedIdea = ideas.find((item) => item.id === activeIdeaId) ?? ideas[0] ?? null;
  const selectedIdeaKey = selectedIdea?.id;
  const idea = selectedIdea ? toValidationIdea(selectedIdea) : EMPTY_IDEA;

  const {
    hypotheses,
    loading: hypothesesLoading,
    error: hypothesesError,
    refetch: refetchHypotheses,
  } = useHypotheses(selectedIdeaKey);

  const {
    experiments,
    loading: experimentsLoading,
    error: experimentsError,
    refetch: refetchExperiments,
  } = useExperiments(selectedIdeaKey);

  const {
    evidence: findings,
    loading: evidenceLoading,
    error: evidenceError,
    refetch: refetchEvidence,
  } = useEvidence(selectedIdeaKey);

  const createHypothesis = useCreateHypothesis(selectedIdeaKey);
  const createExperiment = useCreateExperiment(selectedIdeaKey);
  const createEvidence = useCreateEvidence(selectedIdeaKey);
  const updateHypothesis = useUpdateHypothesis(selectedIdeaKey);

  const ideaOptions = useMemo(
    () => ideas.map((item) => toValidationIdea(item)),
    [ideas],
  );

  const notify = useCallback((message: string) => {
    setToast({ key: Date.now(), message });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  /* ------------------------------------------------------------- persistence --- */

  async function addHypothesis(draft: HypothesisDraft) {
    await createHypothesis.create(draft);
    notify(`Hypothesis added · “${draft.title}”`);
  }

  async function addExperiment(draft: ExperimentDraft) {
    await createExperiment.create({
      title: draft.title,
      relatedHypothesisId: draft.relatedHypothesisId || undefined,
      objective: draft.objective,
      method: draft.method,
      targetAudience: draft.targetAudience,
      successCriteria: draft.successCriteria,
      startDate: draft.startDate,
    });
    notify("Experiment created as a draft · designed, not run");
  }

  async function addFinding(draft: EvidenceDraft) {
    await createEvidence.create({
      ...draft,
      date: new Date().toISOString().slice(0, 10),
    });
    notify("Finding recorded · observation kept separate from interpretation");
  }

  async function changeHypothesisStatus(id: string, status: HypothesisStatus) {
    try {
      await updateHypothesis.update(id, { status });
      notify(`Status set to “${status}” · a label you chose, not an evaluation`);
    } catch (error) {
      notify(errorMessage(error, "Could not update the hypothesis status"));
    }
  }

  function changeIdea(id: string) {
    setSelectedIdeaId(id);
    setSection("Overview");
    const next = ideas.find((item) => item.id === id);
    notify(`Validation workspace · ${next?.name ?? "Idea"}`);
  }

  function retry() {
    if (ideasError) void refetchIdeas();
    if (hypothesesError) void refetchHypotheses();
    if (experimentsError) void refetchExperiments();
    if (evidenceError) void refetchEvidence();
  }

  /* ------------------------------------------------------------------ body --- */

  const loading = productId
    ? ideasLoading || hypothesesLoading || experimentsLoading || evidenceLoading
    : ideasLoading ||
      productsPending ||
      hypothesesLoading ||
      experimentsLoading ||
      evidenceLoading;
  const error =
    ideasError || hypothesesError || experimentsError || evidenceError;

  // The first (hydration) render must match the server, whose QueryClient is
  // always cold. Gate every branch on `hydrated` so both sides render the
  // skeleton no matter what the browser cache already holds.
  if (!hydrated || loading) {
    return <ValidationSkeleton />;
  }

  let body: ReactNode;
  if (error) {
    body = <ValidationErrorState onRetry={retry} />;
  } else {
    body = (
      <>
        <ValidationOverview
          hypotheses={hypotheses}
          experiments={experiments}
          findings={findings}
        />
        <ValidationWorkspaceNavigation section={section} onChange={setSection} />
        <ValidationWorkflow
          hypotheses={hypotheses.length}
          experiments={experiments.length}
          findings={findings.length}
        />

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
                hypotheses={hypotheses}
                experiments={experiments}
                findings={findings}
              />
            ) : section === "Hypotheses" ? (
              <HypothesisWorkspace
                hypotheses={hypotheses}
                experiments={experiments}
                findings={findings}
                onAdd={addHypothesis}
                onStatusChange={changeHypothesisStatus}
              />
            ) : section === "Experiments" ? (
              <ExperimentWorkspace
                experiments={experiments}
                hypotheses={hypotheses}
                onAdd={addExperiment}
              />
            ) : section === "Evidence & Findings" ? (
              <EvidenceWorkspace
                findings={findings}
                experiments={experiments}
                hypotheses={hypotheses}
                onAdd={addFinding}
              />
            ) : (
              <ValidationSummary
                idea={idea}
                hypotheses={hypotheses}
                experiments={experiments}
                findings={findings}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </>
    );
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.28, ease: EASE }}
      className="flex flex-col gap-4"
    >
      <ValidationLabHeader
        idea={idea}
        ideas={ideaOptions}
        onChangeIdea={changeIdea}
        hypotheses={hypotheses}
        experiments={experiments}
        findings={findings}
        onSubmitHypothesis={addHypothesis}
        onSubmitExperiment={addExperiment}
        onSubmitFinding={addFinding}
      />

      {body}

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
            className="fixed bottom-4 left-1/2 z-50 w-[min(92vw,26rem)] -translate-x-1/2 rounded-card border border-accent/40 bg-panel px-4 py-3 text-center shadow-[var(--elevation-toast)] sm:left-auto sm:right-6 sm:w-auto sm:max-w-[26rem] sm:translate-x-0 sm:text-left"
          >
            <p className="text-[12px] leading-snug text-fg">{toast.message}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Route entry for the Validation Lab workspace. Reads the active product from
 * the URL (`?product=<id>`) and an optional idea (`?ideaId=<id>`), then threads
 * both into the page. `useSearchParams` suspends during prerendering, so the
 * route renders this behind a Suspense boundary.
 */
export function ValidationLabRoute() {
  const params = useSearchParams();
  const productId = params.get("product") ?? undefined;
  const ideaId = params.get("ideaId") ?? params.get("idea") ?? undefined;
  return <ValidationLabPage productId={productId} ideaId={ideaId} />;
}
