"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";

import { DEMO_VALIDATION_IDEAS } from "@/lib/validation-lab/demo";
import type { ValidationIdea } from "@/lib/validation-lab/types";

import { AddFindingDialog } from "./dialogs/add-finding-dialog";
import { CreateExperimentDialog } from "./dialogs/create-experiment-dialog";
import { NewHypothesisDialog } from "./dialogs/new-hypothesis-dialog";

export function ValidationLabHeader({
  idea,
  onChangeIdea,
  ideas = DEMO_VALIDATION_IDEAS,
}: {
  idea: ValidationIdea;
  onChangeIdea: (id: string) => void;
  ideas?: ValidationIdea[];
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
        </p>
        <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.8rem)] font-medium leading-[0.98] tracking-[-0.04em] text-fg">
          Validation Lab
        </h1>
        <p className="mt-2 max-w-[64ch] text-[12.5px] leading-relaxed text-muted">
          Challenge your assumptions, design meaningful experiments, and gather evidence before committing to a product direction.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 border border-line px-2.5 py-1.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Idea</span>
            <select
              value={idea.id}
              onChange={(e) => onChangeIdea(e.target.value)}
              className="bg-transparent text-[12px] text-fg outline-none"
              aria-label="Select idea for validation workspace"
            >
              {ideas.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} · {i.ref}
                </option>
              ))}
            </select>
          </label>
          <span className="border border-line px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
            Validation workspace · {idea.name}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setHypothesisOpen(true)}
          className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
        >
          New Hypothesis
        </button>
        <button
          type="button"
          onClick={() => setExperimentOpen(true)}
          className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
        >
          Create Experiment
        </button>
        <button
          type="button"
          onClick={() => setFindingOpen(true)}
          className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
        >
          Add Finding
        </button>
      </div>
      <AnimatePresence>
        {hypothesisOpen ? <NewHypothesisDialog onClose={() => setHypothesisOpen(false)} /> : null}
        {experimentOpen ? <CreateExperimentDialog onClose={() => setExperimentOpen(false)} /> : null}
        {findingOpen ? <AddFindingDialog onClose={() => setFindingOpen(false)} /> : null}
      </AnimatePresence>
    </header>
  );
}
