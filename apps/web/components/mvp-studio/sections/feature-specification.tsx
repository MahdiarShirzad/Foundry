"use client";

import { useState } from "react";

import type { Feature } from "@/lib/mvp-studio/types";

import { FeaturePriorityBadge, FeatureScopeBadge, FeatureStatusBadge, MVPStudioEmptyState } from "../badges";

export function FeatureSpecification({
  features,
}: {
  features: Feature[];
}) {
  const [selectedId, setSelectedId] = useState(features[0]?.id ?? null);
  const selected = features.find((f) => f.id === selectedId) ?? features[0] ?? null;

  if (features.length === 0) {
    return <MVPStudioEmptyState title="No feature specifications" description="Add features to create specifications." />;
  }

  return (
    <div className="grid gap-px border border-line bg-line lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
      <section className="bg-panel">
        <header className="border-b border-line px-4 py-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Specifications</p>
          <p className="mt-1 text-[11px] text-muted">Select a feature</p>
        </header>
        <div className="max-h-[520px] overflow-auto">
          {features.map((f) => {
            const active = f.id === selected?.id;
            return (
              <button key={f.id} type="button" onClick={() => setSelectedId(f.id)} className={`w-full border-b border-line px-4 py-2.5 text-left transition-colors ${active ? "bg-mint-tint/30" : "hover:bg-mint-tint/20"}`}>
                <p className="text-[12px] text-fg">{f.name}</p>
                <div className="mt-1 flex items-center gap-2">
                  <FeatureStatusBadge status={f.status} />
                  <FeatureScopeBadge scope={f.scope} />
                </div>
              </button>
            );
          })}
        </div>
      </section>
      <section className="bg-panel">
        {selected ? (
          <div className="space-y-6 px-6 py-5">
            <header>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Feature Specification</p>
                  <h3 className="mt-2 text-[1.3rem] font-medium tracking-[-0.03em] text-fg">{selected.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <FeaturePriorityBadge priority={selected.priority} />
                  <FeatureScopeBadge scope={selected.scope} />
                  <FeatureStatusBadge status={selected.status} />
                </div>
              </div>
              <p className="mt-2 text-[11.5px] text-muted">Local UI demonstration only — not persisted.</p>
            </header>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Feature summary</p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-fg">{selected.description}</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">User problem</p>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">{selected.userProblem}</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">User story</p>
              <p className="mt-2 text-[12px] leading-relaxed text-fg">{selected.userStory}</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Proposed behavior</p>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">{selected.behavior}</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Acceptance criteria</p>
              <ul className="mt-2 space-y-1 text-[12px] text-muted">
                {selected.acceptanceCriteria.map((c) => <li key={c}>• {c}</li>)}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Edge cases</p>
              <ul className="mt-2 space-y-1 text-[12px] text-muted">
                {selected.edgeCases.length === 0 ? <li>None noted</li> : selected.edgeCases.map((c) => <li key={c}>• {c}</li>)}
              </ul>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Dependencies</p>
                <ul className="mt-2 space-y-1 text-[12px] text-muted">
                  {selected.dependencies.length === 0 ? <li>None</li> : selected.dependencies.map((d) => <li key={d}>• {d}</li>)}
                </ul>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Open questions</p>
                <ul className="mt-2 space-y-1 text-[12px] text-muted">
                  {selected.openQuestions.length === 0 ? <li>None</li> : selected.openQuestions.map((q) => <li key={q}>• {q}</li>)}
                </ul>
              </div>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Design notes</p>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">{selected.designNotes}</p>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
