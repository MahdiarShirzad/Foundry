"use client";

import { useRef, useState } from "react";

import {
  EVIDENCE_TYPES,
  type EvidenceDraft,
  type EvidenceType,
  type Experiment,
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

type Errors = Partial<Record<"title" | "relatedExperimentId" | "observation", string>>;

export function AddFindingDialog({
  onClose,
  onSubmit,
  experiments = [],
  hypotheses = [],
  open = true,
}: {
  onClose: () => void;
  onSubmit?: (draft: EvidenceDraft) => void;
  experiments?: Experiment[];
  hypotheses?: Hypothesis[];
  open?: boolean;
}) {
  const [title, setTitle] = useState("");
  const [relatedExperimentId, setRelatedExperimentId] = useState(experiments[0]?.id ?? "");
  const [relatedHypothesisId, setRelatedHypothesisId] = useState(hypotheses[0]?.id ?? "");
  const [type, setType] = useState<EvidenceType>("Interview Observation");
  const [sourceLabel, setSourceLabel] = useState("");
  const [observation, setObservation] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [limitations, setLimitations] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [confirmed, setConfirmed] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  function validate(): Errors {
    const next: Errors = {};
    if (title.trim().length < 3) next.title = "Give the finding a title of at least 3 characters.";
    if (experiments.length > 0 && !relatedExperimentId)
      next.relatedExperimentId = "Link the finding to the experiment that produced it.";
    if (observation.trim().length < 10)
      next.observation = "Record what was actually observed (at least 10 characters).";
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
      relatedExperimentId: relatedExperimentId || (experiments[0]?.id ?? ""),
      relatedHypothesisId: relatedHypothesisId || (hypotheses[0]?.id ?? ""),
      type,
      sourceLabel: sourceLabel.trim() || "Manual entry",
      observation: observation.trim(),
      interpretation: interpretation.trim() || "Not interpreted yet.",
      limitations: limitations.trim() || "Not stated — consider bias and sample limits.",
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
      title="Add Finding"
      description="Record evidence with the observation kept separate from your interpretation. Presentational only — nothing is stored."
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-faint transition-colors hover:border-accent hover:text-accent"
          >
            {confirmed ? "Close" : "Cancel"}
          </button>
          <button
            form="add-finding-form"
            type="submit"
            className="border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
          >
            {confirmed ? "Added (local)" : "Add finding"}
          </button>
        </>
      }
    >
      <form id="add-finding-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        {confirmed ? (
          <ConfirmNotice>
            Finding added to this preview — local state only. No analysis was run and no
            conclusion was derived automatically.
          </ConfirmNotice>
        ) : null}

        <Field label="Title" htmlFor="vl-finding-title" error={errors.title}>
          <TextInput
            id="vl-finding-title"
            ref={titleRef}
            invalid={Boolean(errors.title)}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Decision context lost weekly"
            autoComplete="off"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Linked experiment"
            htmlFor="vl-finding-experiment"
            error={errors.relatedExperimentId}
          >
            {experiments.length > 0 ? (
              <Select
                id="vl-finding-experiment"
                invalid={Boolean(errors.relatedExperimentId)}
                value={relatedExperimentId}
                onChange={(event) => setRelatedExperimentId(event.target.value)}
              >
                <option value="">Select an experiment…</option>
                {experiments.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </Select>
            ) : (
              <TextInput
                id="vl-finding-experiment"
                value={relatedExperimentId}
                onChange={(event) => setRelatedExperimentId(event.target.value)}
                placeholder="e-001"
                autoComplete="off"
              />
            )}
          </Field>

          <Field label="Linked hypothesis" htmlFor="vl-finding-hypothesis" hint="optional">
            {hypotheses.length > 0 ? (
              <Select
                id="vl-finding-hypothesis"
                value={relatedHypothesisId}
                onChange={(event) => setRelatedHypothesisId(event.target.value)}
              >
                <option value="">Not linked yet</option>
                {hypotheses.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.title}
                  </option>
                ))}
              </Select>
            ) : (
              <TextInput
                id="vl-finding-hypothesis"
                value={relatedHypothesisId}
                onChange={(event) => setRelatedHypothesisId(event.target.value)}
                placeholder="h-001"
                autoComplete="off"
              />
            )}
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Evidence type" htmlFor="vl-finding-type">
            <Select
              id="vl-finding-type"
              value={type}
              onChange={(event) => setType(event.target.value as EvidenceType)}
            >
              {EVIDENCE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Source label" htmlFor="vl-finding-source" hint="optional">
            <TextInput
              id="vl-finding-source"
              value={sourceLabel}
              onChange={(event) => setSourceLabel(event.target.value)}
              placeholder="e.g. Interview notes"
              autoComplete="off"
            />
          </Field>
        </div>

        <Field
          label="Observation"
          htmlFor="vl-finding-observation"
          hint="What was actually recorded"
          error={errors.observation}
        >
          <TextArea
            id="vl-finding-observation"
            invalid={Boolean(errors.observation)}
            value={observation}
            onChange={(event) => setObservation(event.target.value)}
            rows={3}
            placeholder="Describe what happened, without explaining it yet."
          />
        </Field>

        <Field
          label="Interpretation"
          htmlFor="vl-finding-interpretation"
          hint="What the observation might mean"
        >
          <TextArea
            id="vl-finding-interpretation"
            value={interpretation}
            onChange={(event) => setInterpretation(event.target.value)}
            rows={2}
            placeholder="Your reading of the observation."
          />
        </Field>

        <Field
          label="Limitations / potential bias"
          htmlFor="vl-finding-limitations"
          hint="What this cannot tell you"
        >
          <TextArea
            id="vl-finding-limitations"
            value={limitations}
            onChange={(event) => setLimitations(event.target.value)}
            rows={2}
            placeholder="Sample size, self-selection, context that may not generalise…"
          />
        </Field>

        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
          Sample evidence only · no real participants, citations, or significance claims
        </p>
      </form>
    </PresentationalDialog>
  );
}
