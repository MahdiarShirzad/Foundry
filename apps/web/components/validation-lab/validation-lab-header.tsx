"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";

import { Button, PlusIcon } from "@/components/ui/button";
import { HeaderSelect, ModuleHeader } from "@/components/ui/primitives";

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
    <>
      <ModuleHeader
        stage="03"
        stageLabel="Validate"
        title="Validation Lab"
        description="Challenge your assumptions, design meaningful experiments, and gather evidence before committing to a product direction."
        meta={[
          <span key="workspace" className="text-fg">
            {idea.name} · {idea.ref}
          </span>,
          `${hypotheses.length} hypotheses`,
          `${experiments.length} experiments`,
          `${findings.length} findings`,
        ]}
        controls={
          <HeaderSelect
            label="Idea"
            value={idea.id}
            onChange={onChangeIdea}
            ariaLabel="Select idea for this validation workspace"
          >
            {ideas.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.name} · {entry.ref}
              </option>
            ))}
          </HeaderSelect>
        }
        actions={
          <>
            <Button variant="secondary" size="md" onClick={() => setExperimentOpen(true)}>
              Create Experiment
            </Button>
            <Button variant="secondary" size="md" onClick={() => setFindingOpen(true)}>
              Add Finding
            </Button>
            <Button variant="primary" size="md" onClick={() => setHypothesisOpen(true)}>
              <PlusIcon />
              New Hypothesis
            </Button>
          </>
        }
      />

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
    </>
  );
}
