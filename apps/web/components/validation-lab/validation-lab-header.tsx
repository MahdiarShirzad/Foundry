"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";

import { DEMO_VALIDATION_IDEAS } from "@/lib/validation-lab/demo";
import type {
  EvidenceDraft,
  Experiment,
  ExperimentDraft,
  Hypothesis,
  HypothesisDraft,
  ValidationIdea,
} from "@/lib/validation-lab/types";

import { AddFindingDialog } from "./dialogs/add-finding-dialog";
import { CreateExperimentDialog } from "./dialogs/create-experiment-dialog";
import { NewHypothesisDialog } from "./dialogs/new-hypothesis-dialog";

export function ValidationLabHeader({
  idea,
  onChangeIdea,
  ideas = DEMO_VALIDATION_IDEAS,
  hypotheses = [],
  experiments = [],
  findings = [],
  onSubmitHypothesis,
  onSubmitExperiment,
  onSubmitFinding,
}: {
  idea: ValidationIdea;
  onChangeIdea: (id: string) => void;
  ideas?: ValidationIdea[];
  hypotheses?: Hypothesis[];
  experiments?: Experiment[];
  findings?: { id: string; title: string }[];
  onSubmitHypothesis?: (draft: HypothesisDraft) => void;
  onSubmitExperiment?: (draft: ExperimentDraft) => void;
  onSubmitFinding?: (draft: EvidenceDraft) => void;
}) {
  const [hypothesisOpen, setHypothesisOpen] = useState(false);
  const [experimentOpen, setExperimentOpen] = useState(false);
  const [findingOpen, setFindingOpen] = useState(false);

  return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="min-w-0">
        <p className="flex items-center gap-2.5 font-mono text-[9.5px] uppercase tracking-[0.24em] text-accent">
          <span aria-hidden className="size-1.5 bg-mint" />
          Stage 03 / Validate
          <span aria-hidden className="hidden h-px w-9 bg-line sm:block" />
          <span className="hidden font-mono text-[9px] tracking-[0.2em] text-faint sm:inline">
            Eight-stage cycle
          </span>
        </p>
        <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.8rem)] font-medium leading-[0.98] tracking-[-0.04em] text-fg">
          Validation Lab
        </h1>
        <p className="mt-2 max-w-[64ch] text-[12.5px] leading-relaxed text-muted">
          Challenge your assumptions, design meaningful experiments, and gather evidence before
          committing to a product direction.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 border border-line px-2.5 py-1.5 transition-colors focus-within:border-accent">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Idea</span>
            <select
              value={idea.id}
              onChange={(event) => onChangeIdea(event.target.value)}
              className="max-w-[13rem] bg-transparent text-[12px] text-fg outline-none"
              aria-label="Select idea for this validation workspace"
            >
              {ideas.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} · {i.ref}
                </option>
              ))}
            </select>
          </label>
          <span className="border border-line px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
            Workspace · {idea.name} · {idea.ref}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
            {hypotheses.length} hypotheses · {experiments.length} experiments · {findings.length}{" "}
            findings
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setHypothesisOpen(true)}
          className="group inline-flex h-9 items-center gap-2 border border-line px-3 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent active:translate-y-px"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 12 12"
            aria-hidden
            className="fill-none stroke-current stroke-[1.6] transition-transform duration-300 group-hover:rotate-90"
          >
            <path d="M6 1.5v9M1.5 6h9" strokeLinecap="square" />
          </svg>
          New Hypothesis
        </button>
        <button
          type="button"
          onClick={() => setExperimentOpen(true)}
          className="h-9 border border-line px-3 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent active:translate-y-px"
        >
          Create Experiment
        </button>
        <button
          type="button"
          onClick={() => setFindingOpen(true)}
          className="h-9 border border-line px-3 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent active:translate-y-px"
        >
          Add Finding
        </button>
      </div>

      <AnimatePresence>
        {hypothesisOpen ? (
          <NewHypothesisDialog
            onClose={() => setHypothesisOpen(false)}
            onSubmit={(draft) => onSubmitHypothesis?.(draft)}
          />
        ) : null}
        {experimentOpen ? (
          <CreateExperimentDialog
            onClose={() => setExperimentOpen(false)}
            hypotheses={hypotheses}
            onSubmit={(draft) => onSubmitExperiment?.(draft)}
          />
        ) : null}
        {findingOpen ? (
          <AddFindingDialog
            onClose={() => setFindingOpen(false)}
            experiments={experiments}
            hypotheses={hypotheses}
            onSubmit={(draft) => onSubmitFinding?.(draft)}
          />
        ) : null}
      </AnimatePresence>
    </header>
  );
}
