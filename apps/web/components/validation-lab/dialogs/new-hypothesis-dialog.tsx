"use client";

import { useRef, useState } from "react";

import {
  HYPOTHESIS_CATEGORIES,
  type HypothesisCategory,
  type HypothesisDraft,
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

type Errors = Partial<Record<"title" | "statement", string>>;

export function NewHypothesisDialog({
  onClose,
  onSubmit,
  open = true,
}: {
  onClose: () => void;
  onSubmit?: (draft: HypothesisDraft) => void;
  open?: boolean;
}) {
  const [title, setTitle] = useState("");
  const [statement, setStatement] = useState("");
  const [category, setCategory] = useState<HypothesisCategory>("Customer Problem");
  const [customerSegment, setCustomerSegment] = useState("");
  const [rationale, setRationale] = useState("");
  const [importance, setImportance] = useState<Hypothesis["importance"]>("High");
  const [errors, setErrors] = useState<Errors>({});
  const [confirmed, setConfirmed] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  function validate(): Errors {
    const next: Errors = {};
    if (title.trim().length < 3) next.title = "Give the hypothesis a title of at least 3 characters.";
    if (statement.trim().length < 10)
      next.statement = "State the hypothesis in at least 10 characters so it can be tested.";
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
      statement: statement.trim(),
      category,
      customerSegment: customerSegment.trim() || "Unspecified segment",
      rationale: rationale.trim(),
      importance,
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
      title="New Hypothesis"
      description="Document an assumption that must be tested. Presentational only — nothing is saved or sent anywhere."
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
            form="new-hypothesis-form"
            type="submit"
            className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
          >
            {confirmed ? "Added (local)" : "Add hypothesis"}
          </button>
        </>
      }
    >
      <form id="new-hypothesis-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        {confirmed ? (
          <ConfirmNotice>
            Hypothesis added to this preview with the status “Unexamined” — local state only,
            nothing was evaluated or saved remotely.
          </ConfirmNotice>
        ) : null}

        <Field label="Title" htmlFor="vl-hypothesis-title" error={errors.title}>
          <TextInput
            id="vl-hypothesis-title"
            ref={titleRef}
            invalid={Boolean(errors.title)}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Decision recall is painful"
            autoComplete="off"
          />
        </Field>

        <Field
          label="Hypothesis statement"
          htmlFor="vl-hypothesis-statement"
          hint="We believe that…"
          error={errors.statement}
        >
          <TextArea
            id="vl-hypothesis-statement"
            invalid={Boolean(errors.statement)}
            value={statement}
            onChange={(event) => setStatement(event.target.value)}
            rows={3}
            placeholder="We believe that [segment] will [behaviour] because [reason]."
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Assumption category" htmlFor="vl-hypothesis-category">
            <Select
              id="vl-hypothesis-category"
              value={category}
              onChange={(event) => setCategory(event.target.value as HypothesisCategory)}
            >
              {HYPOTHESIS_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Target segment" htmlFor="vl-hypothesis-segment" hint="optional">
            <TextInput
              id="vl-hypothesis-segment"
              value={customerSegment}
              onChange={(event) => setCustomerSegment(event.target.value)}
              placeholder="e.g. Knowledge workers"
              autoComplete="off"
            />
          </Field>
        </div>

        <Field
          label="Why it matters"
          htmlFor="vl-hypothesis-rationale"
          hint="Risk if this assumption is wrong"
        >
          <TextArea
            id="vl-hypothesis-rationale"
            value={rationale}
            onChange={(event) => setRationale(event.target.value)}
            rows={3}
            placeholder="What depends on this being true?"
          />
        </Field>

        <Field label="Importance" htmlFor="vl-hypothesis-importance">
          <Select
            id="vl-hypothesis-importance"
            value={importance}
            onChange={(event) => setImportance(event.target.value as Hypothesis["importance"])}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Select>
        </Field>

        <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
          Status is a label you choose later · the interface never evaluates validity for you
        </p>
      </form>
    </PresentationalDialog>
  );
}
