"use client";

import { useState } from "react";

import type { MVPProject, MVPProjectPatch } from "@/lib/mvp-studio/types";

import { FieldLabel, PresentationalDialog } from "../primitives";

const INPUT =
  "mt-1.5 w-full border border-line bg-panel px-3 py-2 text-[12.5px] text-fg outline-none transition-colors placeholder:text-faint focus:border-accent";

function toLines(value: readonly string[]) {
  return value.join("\n");
}

function parseLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Presentational "Define MVP Scope" dialog. Prefills from the selected project
 * and hands the edited definition back to local state on save.
 */
export function DefineMVPScopeDialog({
  open,
  onClose,
  project,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  project: MVPProject;
  onSave: (patch: MVPProjectPatch) => void;
}) {
  const [objective, setObjective] = useState(project.mvpObjective);
  const [problem, setProblem] = useState(project.problem);
  const [audience, setAudience] = useState(project.targetAudience);
  const [valueProp, setValueProp] = useState(project.valueProp);
  const [capabilities, setCapabilities] = useState(toLines(project.essentialCapabilities));
  const [exclusions, setExclusions] = useState(toLines(project.explicitExclusions));
  const [criteria, setCriteria] = useState(toLines(project.successCriteria));
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    objective: objective.trim() ? "" : "The MVP needs one clear objective.",
    problem: problem.trim() ? "" : "State the primary user problem.",
    audience: audience.trim() ? "" : "Name the intended audience.",
  };
  const isValid = Object.values(errors).every((message) => message === "");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    onSave({
      mvpObjective: objective.trim(),
      problem: problem.trim(),
      targetAudience: audience.trim(),
      valueProp: valueProp.trim(),
      essentialCapabilities: parseLines(capabilities),
      explicitExclusions: parseLines(exclusions),
      successCriteria: parseLines(criteria),
    });
  }

  if (!open) return null;

  const show = (key: keyof typeof errors) => submitted && errors[key];

  return (
    <PresentationalDialog
      open
      onClose={onClose}
      eyebrow="Stage 04 / Build"
      title="Define MVP Scope"
      description={`Set the boundaries for ${project.name}'s first release. Saving updates this preview only.`}
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
            form="mvp-define-scope-form"
            type="submit"
            className="border border-accent/70 bg-mint-tint/60 px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-accent transition-colors hover:bg-mint-tint"
          >
            Save definition
          </button>
        </>
      }
    >
      <form id="mvp-define-scope-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        {submitted && !isValid ? (
          <p
            role="alert"
            className="border border-danger/60 bg-danger-tint px-3 py-2 text-[11.5px] leading-snug text-danger"
          >
            Complete the required fields before saving this definition.
          </p>
        ) : null}

        <div>
          <FieldLabel htmlFor="mvp-scope-objective">MVP objective</FieldLabel>
          <input
            id="mvp-scope-objective"
            value={objective}
            onChange={(event) => setObjective(event.target.value)}
            aria-invalid={Boolean(show("objective"))}
            className={`${INPUT}${show("objective") ? " border-danger" : ""}`}
          />
          {show("objective") ? (
            <p className="mt-1 text-[11px] text-danger">{errors.objective}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel htmlFor="mvp-scope-problem">Primary user problem</FieldLabel>
          <textarea
            id="mvp-scope-problem"
            rows={2}
            value={problem}
            onChange={(event) => setProblem(event.target.value)}
            aria-invalid={Boolean(show("problem"))}
            className={`${INPUT} resize-y${show("problem") ? " border-danger" : ""}`}
          />
          {show("problem") ? (
            <p className="mt-1 text-[11px] text-danger">{errors.problem}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="mvp-scope-audience">Target audience</FieldLabel>
            <input
              id="mvp-scope-audience"
              value={audience}
              onChange={(event) => setAudience(event.target.value)}
              aria-invalid={Boolean(show("audience"))}
              className={`${INPUT}${show("audience") ? " border-danger" : ""}`}
            />
            {show("audience") ? (
              <p className="mt-1 text-[11px] text-danger">{errors.audience}</p>
            ) : null}
          </div>
          <div>
            <FieldLabel htmlFor="mvp-scope-value">Core value proposition</FieldLabel>
            <textarea
              id="mvp-scope-value"
              rows={2}
              value={valueProp}
              onChange={(event) => setValueProp(event.target.value)}
              className={`${INPUT} resize-y`}
            />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="mvp-scope-capabilities" hint="One per line">
            Essential capabilities
          </FieldLabel>
          <textarea
            id="mvp-scope-capabilities"
            rows={3}
            value={capabilities}
            onChange={(event) => setCapabilities(event.target.value)}
            className={`${INPUT} resize-y`}
          />
        </div>

        <div>
          <FieldLabel htmlFor="mvp-scope-exclusions" hint="One per line">
            Explicit exclusions
          </FieldLabel>
          <textarea
            id="mvp-scope-exclusions"
            rows={3}
            value={exclusions}
            onChange={(event) => setExclusions(event.target.value)}
            className={`${INPUT} resize-y`}
          />
        </div>

        <div>
          <FieldLabel htmlFor="mvp-scope-criteria" hint="One per line">
            Success criteria
          </FieldLabel>
          <textarea
            id="mvp-scope-criteria"
            rows={2}
            value={criteria}
            onChange={(event) => setCriteria(event.target.value)}
            className={`${INPUT} resize-y`}
          />
        </div>

        <p className="border-t border-line pt-3 font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
          No scope rule, validation engine or backend is involved
        </p>
      </form>
    </PresentationalDialog>
  );
}
