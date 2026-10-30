"use client";

import { useState } from "react";

import { METRIC_CATALOG } from "@/lib/founder-analytics/demo";
import {
  OBSERVATION_TYPES,
  type Observation,
  type ObservationDraft,
  type ObservationType,
} from "@/lib/founder-analytics/types";

import { AnalyticsDialog, Field, Select, TextArea, TextInput } from "../primitives";

type Errors = Partial<Record<"title" | "description", string>>;

export function ObservationDialog({
  open,
  onClose,
  onSubmit,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (draft: ObservationDraft, id?: string) => void;
  initial?: Observation | null;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [metricId, setMetricId] = useState<string>(initial?.metricId ?? METRIC_CATALOG[0].id);
  const [type, setType] = useState<ObservationType>(initial?.type ?? "Pattern");
  const [nextStep, setNextStep] = useState(initial?.nextStep ?? "");
  const [errors, setErrors] = useState<Errors>({});

  function validate(): Errors {
    const found: Errors = {};
    if (title.trim().length < 3) found.title = "Give the observation a title of at least 3 characters.";
    if (description.trim().length < 10)
      found.description = "Describe what you noticed in at least 10 characters.";
    return found;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSubmit(
      {
        title: title.trim(),
        description: description.trim(),
        metricId,
        type,
        nextStep: nextStep.trim(),
      },
      initial?.id,
    );
  }

  if (!open) return null;

  return (
    <AnalyticsDialog
      open
      onClose={onClose}
      eyebrow="Stage 08 / Learn"
      title={initial ? "Edit observation" : "New observation"}
      description="Observations live in this browser session only — they are not saved, synced or analysed."
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-faint transition-colors hover:border-accent hover:text-accent"
          >
            Cancel
          </button>
          <button
            form="observation-form"
            type="submit"
            className="border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
          >
            {initial ? "Save changes" : "Add observation"}
          </button>
        </>
      }
    >
      <form id="observation-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field label="Title" htmlFor="observation-title" error={errors.title}>
          <TextInput
            id="observation-title"
            invalid={Boolean(errors.title)}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What did you notice?"
            autoComplete="off"
          />
        </Field>

        <Field label="Description" htmlFor="observation-description" error={errors.description}>
          <TextArea
            id="observation-description"
            invalid={Boolean(errors.description)}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="Describe the pattern in your own words"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Related metric" htmlFor="observation-metric">
            <Select
              id="observation-metric"
              value={metricId}
              onChange={(event) => setMetricId(event.target.value)}
            >
              {METRIC_CATALOG.map((metric) => (
                <option key={metric.id} value={metric.id}>
                  {metric.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Observation type" htmlFor="observation-type">
            <Select
              id="observation-type"
              value={type}
              onChange={(event) => setType(event.target.value as ObservationType)}
            >
              {OBSERVATION_TYPES.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="What to investigate next" htmlFor="observation-next" hint="optional">
          <TextArea
            id="observation-next"
            value={nextStep}
            onChange={(event) => setNextStep(event.target.value)}
            rows={2}
            placeholder="e.g. compare with the onboarding feedback before deciding"
          />
        </Field>

        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
          Local UI state only · no storage, no sync, no analysis
        </p>
      </form>
    </AnalyticsDialog>
  );
}
