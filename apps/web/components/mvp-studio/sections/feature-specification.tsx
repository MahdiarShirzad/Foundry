"use client";

import { useState } from "react";

import type { Feature } from "@/lib/mvp-studio/types";

import {
  FeaturePriorityBadge,
  FeatureScopeBadge,
  FeatureStatusBadge,
  MVPStudioEmptyState,
} from "../badges";
import { SectionPanel } from "../primitives";

function SpecBlock({
  term,
  children,
}: {
  term: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">{term}</p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function BulletList({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) {
    return <p className="text-[12px] italic text-faint">{empty}</p>;
  }
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-[12.5px] text-muted">
          <span aria-hidden className="mt-[6px] size-1.5 shrink-0 bg-mint" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Feature specification workspace: a structured spec document per feature.
 * Two fields are editable to demonstrate local state; nothing is persisted.
 */
export function FeatureSpecification({
  features,
  onPatch,
  onAddFeature,
}: {
  features: Feature[];
  onPatch: (id: string, patch: Partial<Feature>) => void;
  onAddFeature: () => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(features[0]?.id ?? null);
  const selected =
    features.find((f) => f.id === selectedId) ?? features[0] ?? null;

  if (features.length === 0) {
    return (
      <SectionPanel title="Specifications" subtitle="No specifications yet">
        <MVPStudioEmptyState
          title="No feature specifications"
          description="Specifications are written per feature. Add a feature to the backlog and its specification will appear here."
          action={
            <button
              type="button"
              onClick={onAddFeature}
              className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
            >
              Add Feature
            </button>
          }
        />
      </SectionPanel>
    );
  }

  return (
    <SectionPanel
      title="Specifications"
      subtitle={`${features.length} feature specifications · ${projectWord(features)}`}
      action={
        <span className="border border-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
          Local edits only
        </span>
      }
    >
      <div className="grid gap-px bg-line lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)]">
        {/* ------------------------------------------------------------ list */}
        <div className="bg-panel">
          <p className="border-b border-line px-4 py-3 font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
            Select a feature
          </p>
          <ul className="max-h-[34rem] overflow-y-auto">
            {features.map((f) => {
              const active = f.id === selected?.id;
              return (
                <li key={f.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(f.id)}
                    aria-current={active ? "true" : undefined}
                    className={`w-full border-b border-line px-4 py-2.5 text-left transition-colors ${
                      active ? "bg-mint-tint/40" : "hover:bg-mint-tint/20"
                    }`}
                  >
                    <p className="text-[12.5px] text-fg">{f.name}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <FeatureStatusBadge status={f.status} />
                      <FeatureScopeBadge scope={f.scope} />
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* -------------------------------------------------------- document */}
        <div className="bg-panel">
          {selected ? (
            <article key={selected.id} className="px-4 py-4 sm:px-6 sm:py-5">
              <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
                <div className="min-w-0">
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
                    Feature specification
                  </p>
                  <h3 className="mt-2 text-[clamp(1.15rem,2vw,1.45rem)] font-medium tracking-[-0.03em] text-fg">
                    {selected.name}
                  </h3>
                  <p className="mt-1 text-[11.5px] text-muted">{selected.targetUser}</p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <FeaturePriorityBadge priority={selected.priority} />
                  <FeatureScopeBadge scope={selected.scope} />
                  <FeatureStatusBadge status={selected.status} />
                </div>
              </header>

              <div className="space-y-5 pt-4">
                <SpecBlock term="Feature summary">
                  <p className="text-[13px] leading-relaxed text-fg">{selected.description}</p>
                </SpecBlock>

                <SpecBlock term="User problem">
                  <p className="text-[12.5px] leading-relaxed text-muted">
                    {selected.userProblem}
                  </p>
                </SpecBlock>

                <SpecBlock term="User story">
                  <p className="border-l-2 border-accent/50 pl-3 text-[12.5px] italic leading-relaxed text-fg">
                    {selected.userStory}
                  </p>
                </SpecBlock>

                <SpecBlock term="Proposed behavior">
                  <label htmlFor={`mvp-behavior-${selected.id}`} className="sr-only">
                    Proposed behavior for {selected.name}
                  </label>
                  <textarea
                    id={`mvp-behavior-${selected.id}`}
                    value={selected.behavior}
                    onChange={(event) =>
                      onPatch(selected.id, { behavior: event.target.value })
                    }
                    rows={3}
                    className="w-full resize-y border border-line bg-panel px-3 py-2 text-[12.5px] leading-relaxed text-fg outline-none transition-colors focus:border-accent"
                  />
                </SpecBlock>

                <SpecBlock term={`Acceptance criteria · ${selected.acceptanceCriteria.length}`}>
                  <BulletList items={selected.acceptanceCriteria} empty="None defined yet." />
                </SpecBlock>

                <div className="grid gap-5 sm:grid-cols-2">
                  <SpecBlock term="Edge cases">
                    <BulletList items={selected.edgeCases} empty="None noted." />
                  </SpecBlock>
                  <SpecBlock term="Dependencies">
                    <BulletList items={selected.dependencies} empty="No dependencies." />
                  </SpecBlock>
                </div>

                <SpecBlock term={`Open questions · ${selected.openQuestions.length}`}>
                  <BulletList
                    items={selected.openQuestions}
                    empty="No open questions — the spec is settled for now."
                  />
                </SpecBlock>

                <SpecBlock term="Design notes">
                  <label htmlFor={`mvp-notes-${selected.id}`} className="sr-only">
                    Design notes for {selected.name}
                  </label>
                  <textarea
                    id={`mvp-notes-${selected.id}`}
                    value={selected.designNotes}
                    onChange={(event) =>
                      onPatch(selected.id, { designNotes: event.target.value })
                    }
                    rows={2}
                    className="w-full resize-y border border-line bg-panel px-3 py-2 text-[12.5px] leading-relaxed text-fg outline-none transition-colors focus:border-accent"
                  />
                </SpecBlock>
              </div>

              <p className="mt-5 border-t border-line pt-3 font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
                Editing is a local UI demonstration · changes are not saved or synced anywhere
              </p>
            </article>
          ) : (
            <MVPStudioEmptyState
              title="No specification selected"
              description="Choose a feature to read its specification."
            />
          )}
        </div>
      </div>
    </SectionPanel>
  );
}

function projectWord(features: Feature[]) {
  return features.length === 1 ? "1 document" : `${features.length} documents`;
}
