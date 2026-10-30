"use client";

import { useState } from "react";

import type { FeatureDraft, FeaturePriority, FeatureScope } from "@/lib/mvp-studio/types";
import { FEATURE_PRIORITIES, FEATURE_SCOPE } from "@/lib/mvp-studio/types";

import { FieldLabel, PresentationalDialog } from "../primitives";

type FormState = {
  name: string;
  description: string;
  userProblem: string;
  targetUser: string;
  priority: FeaturePriority;
  scope: FeatureScope;
  userStory: string;
  acceptance: string;
};

const EMPTY: FormState = {
  name: "",
  description: "",
  userProblem: "",
  targetUser: "",
  priority: "High",
  scope: "Should Have",
  userStory: "",
  acceptance: "",
};

const INPUT =
  "mt-1.5 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none transition-colors placeholder:text-faint focus:border-accent";

function errorBorder(hasError: boolean) {
  return hasError ? " border-danger" : "";
}

/** Presentational Add Feature dialog with local validation. Nothing is saved. */
export function AddFeatureDialog({
  open,
  onClose,
  onAdd,
  targetUserPlaceholder = "Knowledge workers",
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (draft: FeatureDraft) => void;
  targetUserPlaceholder?: string;
}) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    name: form.name.trim() ? "" : "Give the feature a clear name.",
    description: form.description.trim() ? "" : "Describe what the feature does.",
    userProblem: form.userProblem.trim() ? "" : "State the user problem it addresses.",
    userStory: form.userStory.trim() ? "" : "Write a one-line user story.",
  };
  const isValid = Object.values(errors).every((message) => message === "");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    onAdd({
      name: form.name.trim(),
      description: form.description.trim(),
      userProblem: form.userProblem.trim(),
      targetUser: form.targetUser.trim() || targetUserPlaceholder,
      priority: form.priority,
      scope: form.scope,
      userStory: form.userStory.trim(),
      acceptanceCriteria: form.acceptance
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    });
    setForm(EMPTY);
    setSubmitted(false);
  }

  if (!open) return null;

  const show = (key: keyof typeof errors) => submitted && errors[key];

  return (
    <PresentationalDialog
      open
      onClose={onClose}
      eyebrow="Stage 04 / Build"
      title="Add Feature"
      description="Add a proposed feature to this preview. Nothing is sent or persisted."
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-faint transition-colors hover:border-accent hover:text-accent"
          >
            Cancel
          </button>
          <button
            form="mvp-add-feature-form"
            type="submit"
            className="border border-accent/70 bg-mint-tint/60 px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-accent transition-colors hover:bg-mint-tint"
          >
            Add to backlog
          </button>
        </>
      }
    >
      <form id="mvp-add-feature-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        {submitted && !isValid ? (
          <p
            role="alert"
            className="border border-danger/60 bg-danger-tint px-3 py-2 text-[11.5px] leading-snug text-danger"
          >
            Some fields still need attention before this feature can be added.
          </p>
        ) : null}

        <div>
          <FieldLabel htmlFor="mvp-feature-name">Feature name</FieldLabel>
          <input
            id="mvp-feature-name"
            value={form.name}
            onChange={(event) => set("name", event.target.value)}
            placeholder="Decision capture"
            aria-invalid={Boolean(show("name"))}
            className={`${INPUT}${errorBorder(Boolean(show("name")))}`}
          />
          {show("name") ? (
            <p className="mt-1 text-[11px] text-danger">{errors.name}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel htmlFor="mvp-feature-description" hint="One or two sentences">
            Description
          </FieldLabel>
          <textarea
            id="mvp-feature-description"
            rows={2}
            value={form.description}
            onChange={(event) => set("description", event.target.value)}
            placeholder="What the feature does for the user."
            aria-invalid={Boolean(show("description"))}
            className={`${INPUT} resize-y${errorBorder(Boolean(show("description")))}`}
          />
          {show("description") ? (
            <p className="mt-1 text-[11px] text-danger">{errors.description}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel htmlFor="mvp-feature-problem">User problem</FieldLabel>
          <textarea
            id="mvp-feature-problem"
            rows={2}
            value={form.userProblem}
            onChange={(event) => set("userProblem", event.target.value)}
            placeholder="Why this feature needs to exist."
            aria-invalid={Boolean(show("userProblem"))}
            className={`${INPUT} resize-y${errorBorder(Boolean(show("userProblem")))}`}
          />
          {show("userProblem") ? (
            <p className="mt-1 text-[11px] text-danger">{errors.userProblem}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <FieldLabel htmlFor="mvp-feature-user">Target user</FieldLabel>
            <input
              id="mvp-feature-user"
              value={form.targetUser}
              onChange={(event) => set("targetUser", event.target.value)}
              placeholder={targetUserPlaceholder}
              className={INPUT}
            />
          </div>
          <div>
            <FieldLabel htmlFor="mvp-feature-priority">Priority</FieldLabel>
            <select
              id="mvp-feature-priority"
              value={form.priority}
              onChange={(event) => set("priority", event.target.value as FeaturePriority)}
              className={INPUT}
            >
              {FEATURE_PRIORITIES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="mvp-feature-scope">Scope</FieldLabel>
            <select
              id="mvp-feature-scope"
              value={form.scope}
              onChange={(event) => set("scope", event.target.value as FeatureScope)}
              className={INPUT}
            >
              {FEATURE_SCOPE.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="mvp-feature-story" hint="As a… I want… so that…">
            User story
          </FieldLabel>
          <textarea
            id="mvp-feature-story"
            rows={2}
            value={form.userStory}
            onChange={(event) => set("userStory", event.target.value)}
            placeholder="As a…, I want… so that…"
            aria-invalid={Boolean(show("userStory"))}
            className={`${INPUT} resize-y${errorBorder(Boolean(show("userStory")))}`}
          />
          {show("userStory") ? (
            <p className="mt-1 text-[11px] text-danger">{errors.userStory}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel htmlFor="mvp-feature-criteria" hint="Optional · one per line">
            Acceptance criteria
          </FieldLabel>
          <textarea
            id="mvp-feature-criteria"
            rows={3}
            value={form.acceptance}
            onChange={(event) => set("acceptance", event.target.value)}
            placeholder={"Capture takes under 10 seconds\nSaved items appear in the timeline"}
            className={`${INPUT} resize-y`}
          />
        </div>

        <p className="border-t border-line pt-3 font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
          Preview only · the feature lives in local React state until reload
        </p>
      </form>
    </PresentationalDialog>
  );
}
