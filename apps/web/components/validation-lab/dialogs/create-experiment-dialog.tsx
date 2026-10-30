"use client";

import { useRef, useState } from "react";

import {
  EXPERIMENT_METHODS,
  type ExperimentDraft,
  type ExperimentMethod,
  type Hypothesis,
} from "@/lib/validation-lab/types";

import {
  ConfirmNotice,
  Field,
  PresentationalDialog,
  Select,
  TextArea,
  TextInput,
} from "../primitives";

type Errors = Partial<Record<"title" | "relatedHypothesisId" | "objective", string>>;

export function CreateExperimentDialog({
  onClose,
  onSubmit,
  hypotheses = [],
  open = true,
}: {
  onClose: () => void;
  onSubmit?: (draft: ExperimentDraft) => void;
  hypotheses?: Hypothesis[];
  open?: boolean;
}) {
  const [title, setTitle] = useState("");
  const [relatedHypothesisId, setRelatedHypothesisId] = useState(hypotheses[0]?.id ?? "");
  const [method, setMethod] = useState<ExperimentMethod>("Customer Interviews");
  const [objective, setObjective] = useState("");
  const [successCriteria, setSuccessCriteria] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [startDate, setStartDate] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [confirmed, setConfirmed] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  function validate(): Errors {
    const next: Errors = {};
    if (title.trim().length < 3) next.title = "Give the experiment a title of at least 3 characters.";
    if (hypotheses.length > 0 && !relatedHypothesisId)
      next.relatedHypothesisId = "Choose the hypothesis this experiment investigates.";
    if (objective.trim().length < 10)
      next.objective = "Describe what the experiment is trying to learn (at least 10 characters).";
    return next;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      if (found.title) titleRef.current?.focus();
      return;
    }
    onSubmit?.({
      title: title.trim(),
      relatedHypothesisId: relatedHypothesisId || (hypotheses[0]?.id ?? ""),
      method,
      objective: objective.trim(),
      successCriteria: successCriteria.trim(),
      targetAudience: targetAudience.trim() || "Not specified yet",
      startDate: startDate || "Not scheduled",
    });
    setConfirmed(true);
    window.setTimeout(() => onClose(), 1600);
  }

  if (!open) return null;

  return (
    <PresentationalDialog
      open
      onClose={onClose}
      eyebrow="Stage 03 / Validate"
      title="Create Experiment"
      description="Design a test for a hypothesis. Creating it does not run it — no participants are contacted and no data is collected."
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-faint transition-colors hover:border-accent hover:text-accent"
          >
            {confirmed ? "Close" : "Cancel"}
          </button>
          <button
            form="create-experiment-form"
            type="submit"
            className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
          >
            {confirmed ? "Created (local)" : "Create experiment"}
          </button>
        </>
      }
    >
      <form id="create-experiment-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        {confirmed ? (
          <ConfirmNotice>
            Experiment added to this preview with the status “Draft” — it has been designed, not
            run. Local state only.
          </ConfirmNotice>
        ) : null}

        <Field label="Experiment title" htmlFor="vl-experiment-title" error={errors.title}>
          <TextInput
            id="vl-experiment-title"
            ref={titleRef}
            invalid={Boolean(errors.title)}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Interview knowledge workers about decision recall"
            autoComplete="off"
          />
        </Field>

        {hypotheses.length > 0 ? (
          <Field
            label="Related hypothesis"
            htmlFor="vl-experiment-hypothesis"
            error={errors.relatedHypothesisId}
          >
            <Select
              id="vl-experiment-hypothesis"
              invalid={Boolean(errors.relatedHypothesisId)}
              value={relatedHypothesisId}
              onChange={(event) => setRelatedHypothesisId(event.target.value)}
            >
              <option value="">Select a hypothesis…</option>
              {hypotheses.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.title}
                </option>
              ))}
            </Select>
          </Field>
        ) : (
          <Field label="Related hypothesis" htmlFor="vl-experiment-hypothesis" hint="optional">
            <TextInput
              id="vl-experiment-hypothesis"
              value={relatedHypothesisId}
              onChange={(event) => setRelatedHypothesisId(event.target.value)}
              placeholder="h-001"
              autoComplete="off"
            />
          </Field>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Method" htmlFor="vl-experiment-method">
            <Select
              id="vl-experiment-method"
              value={method}
              onChange={(event) => setMethod(event.target.value as ExperimentMethod)}
            >
              {EXPERIMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Target participants / audience" htmlFor="vl-experiment-audience" hint="optional">
            <TextInput
              id="vl-experiment-audience"
              value={targetAudience}
              onChange={(event) => setTargetAudience(event.target.value)}
              placeholder="e.g. 5–8 product/ops knowledge workers"
              autoComplete="off"
            />
          </Field>
        </div>

        <Field label="Objective" htmlFor="vl-experiment-objective" error={errors.objective}>
          <TextArea
            id="vl-experiment-objective"
            invalid={Boolean(errors.objective)}
            value={objective}
            onChange={(event) => setObjective(event.target.value)}
            rows={3}
            placeholder="What should this experiment help you learn?"
          />
        </Field>

        <Field
          label="Success criteria"
          htmlFor="vl-experiment-criteria"
          hint="Decide before running it"
        >
          <TextArea
            id="vl-experiment-criteria"
            value={successCriteria}
            onChange={(event) => setSuccessCriteria(event.target.value)}
            rows={2}
            placeholder="What outcome would count as evidence?"
          />
        </Field>

        <Field label="Start date" htmlFor="vl-experiment-start" hint="optional">
          <TextInput
            id="vl-experiment-start"
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </Field>

        <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
          No surveys sent · no participants recruited · no analytics tracked
        </p>
      </form>
    </PresentationalDialog>
  );
}
