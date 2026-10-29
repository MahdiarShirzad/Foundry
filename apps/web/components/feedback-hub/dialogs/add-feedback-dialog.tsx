"use client";

import { useRef, useState } from "react";

import {
  FEEDBACK_CATEGORIES,
  FEEDBACK_PRIORITIES,
  FEEDBACK_SOURCES,
  type FeedbackCategory,
  type FeedbackDraft,
  type FeedbackPriority,
  type FeedbackSource,
} from "@/lib/feedback-hub/types";

import { Field, PresentationalDialog, Select, TextArea, TextInput } from "../primitives";

type Errors = Partial<Record<"title" | "description" | "source", string>>;

export function AddFeedbackDialog({
  open,
  onClose,
  onAdd,
  productAreas,
  productName,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (draft: FeedbackDraft) => void;
  productAreas: string[];
  productName: string;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<FeedbackCategory>("Bug Report");
  const [source, setSource] = useState<FeedbackSource | "">("");
  const [priority, setPriority] = useState<FeedbackPriority>("Medium");
  const [productArea, setProductArea] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [confirmed, setConfirmed] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  function validate(): Errors {
    const next: Errors = {};
    if (title.trim().length < 3) next.title = "Give the feedback a title of at least 3 characters.";
    if (description.trim().length < 10)
      next.description = "Describe the feedback in at least 10 characters.";
    if (!source) next.source = "Choose where this feedback came from.";
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
    onAdd({
      title: title.trim(),
      description: description.trim(),
      category,
      source: source as FeedbackSource,
      priority,
      productArea,
    });
    setConfirmed(true);
    window.setTimeout(() => onClose(), 900);
  }

  if (!open) return null;

  return (
    <PresentationalDialog
      open
      onClose={onClose}
      eyebrow="Stage 07 / Listen"
      title="Add Feedback"
      description={`Record feedback for ${productName} by hand. Presentational only — nothing is submitted or saved remotely.`}
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
            form="add-feedback-form"
            type="submit"
            className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
          >
            {confirmed ? "Added (local)" : "Add feedback"}
          </button>
        </>
      }
    >
      <form id="add-feedback-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        {confirmed ? (
          <p
            role="status"
            className="border border-mint/70 bg-mint-tint/40 px-3 py-2.5 text-[12px] text-fg"
          >
            Feedback added to this preview — local state only, nothing was sent anywhere.
          </p>
        ) : null}

        <Field label="Title" htmlFor="fb-title" error={errors.title}>
          <TextInput
            id="fb-title"
            ref={titleRef}
            invalid={Boolean(errors.title)}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short summary of the feedback"
            autoComplete="off"
          />
        </Field>

        <Field
          label="Description"
          htmlFor="fb-description"
          hint="What the user reported"
          error={errors.description}
        >
          <TextArea
            id="fb-description"
            invalid={Boolean(errors.description)}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe the experience in the user's own terms"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category" htmlFor="fb-category">
            <Select
              id="fb-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
            >
              {FEEDBACK_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Priority" htmlFor="fb-priority">
            <Select
              id="fb-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as FeedbackPriority)}
            >
              {FEEDBACK_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Source" htmlFor="fb-source" error={errors.source}>
            <Select
              id="fb-source"
              invalid={Boolean(errors.source)}
              value={source}
              onChange={(e) => setSource(e.target.value as FeedbackSource)}
            >
              <option value="">Select a source…</option>
              {FEEDBACK_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Related product area" htmlFor="fb-area" hint="optional">
            <Select
              id="fb-area"
              value={productArea}
              onChange={(e) => setProductArea(e.target.value)}
            >
              <option value="">None yet</option>
              {productAreas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
          No external ingestion · no email or support-desk parsing · demo record only
        </p>
      </form>
    </PresentationalDialog>
  );
}
