"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import type {
  FeedbackItem,
  FeedbackStatus,
  Theme,
  ThemeImportance,
} from "@/lib/feedback-hub/types";
import { FEEDBACK_STATUSES, THEME_IMPORTANCE } from "@/lib/feedback-hub/types";

import {
  FeedbackCategoryBadge,
  FeedbackHubEmptyState,
  FeedbackPriorityBadge,
  FeedbackStatusBadge,
} from "../badges";
import { Field, InternalNoteBlock, PanelLabel, Select, TextArea, UserContentBlock } from "../primitives";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function FeedbackThemesWorkspace({
  themes,
  feedback,
  selectedId,
  onSelect,
  onImportanceChange,
  onReviewStatusChange,
  onNotesChange,
  onOpenFeedback,
}: {
  themes: Theme[];
  feedback: FeedbackItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onImportanceChange: (id: string, importance: ThemeImportance) => void;
  onReviewStatusChange: (id: string, status: FeedbackStatus) => void;
  onNotesChange: (id: string, notes: string) => void;
  onOpenFeedback: (id: string) => void;
}) {
  const reduce = useReducedMotion();
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [savedId, setSavedId] = useState<string | null>(null);

  const selected = themes.find((t) => t.id === selectedId) ?? themes[0] ?? null;
  const related = selected
    ? feedback.filter((f) => selected.relatedFeedbackIds.includes(f.id))
    : [];

  if (themes.length === 0) {
    return (
      <section className="border border-line bg-panel">
        <FeedbackHubEmptyState
          title="No themes documented"
          description="Themes are written by hand after reviewing feedback. Nothing has been documented for this product yet — and no clustering runs automatically."
        />
      </section>
    );
  }

  const notesValue = selected ? (draft[selected.id] ?? selected.internalNotes ?? "") : "";

  function saveNotes(id: string) {
    if (!(id in draft)) return;
    const value = (draft[id] ?? "").trim();
    onNotesChange(id, value);
    setSavedId(id);
  }

  return (
    <section className="border border-line bg-panel" aria-label="Themes and insights">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-4 py-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
            Themes &amp; Insights
          </p>
          <p className="mt-1 text-[11.5px] text-muted">
            {themes.length} manually documented theme{themes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <p className="border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
          Sample insights · written by hand · no automated analysis
        </p>
      </header>

      <div className="grid gap-px bg-line lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <nav aria-label="Themes" className="min-w-0 bg-panel">
          <ul className="max-h-[24rem] space-y-2 overflow-y-auto p-2 lg:max-h-[38rem]">
            {themes.map((t) => {
              const active = t.id === selected?.id;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(t.id)}
                    aria-current={active ? "true" : undefined}
                    className={`w-full border px-3 py-2.5 text-left transition-colors ${
                      active
                        ? "border-accent/60 bg-mint-tint/30"
                        : "border-line hover:bg-mint-tint/15"
                    }`}
                  >
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="text-[12.5px] font-medium text-fg">{t.name}</span>
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                        {t.importance}
                      </span>
                    </span>
                    <span className="mt-1 block truncate text-[11px] text-muted">
                      {t.explanation}
                    </span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <FeedbackStatusBadge status={t.reviewStatus} />
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                        {t.relatedFeedbackIds.length} linked
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0 bg-panel">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
              className="space-y-5 px-5 py-5 sm:px-6"
            >
              <header>
                <p className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                  <span aria-hidden className="size-1.5 bg-mint" />
                  Theme detail · {selected.id}
                </p>
                <h3 className="mt-2 text-[clamp(1.15rem,2vw,1.5rem)] font-medium tracking-[-0.03em] text-fg">
                  {selected.name}
                </h3>
                <p className="mt-2 max-w-[70ch] text-[12.5px] leading-relaxed text-muted">
                  {selected.explanation}
                </p>
              </header>

              <UserContentBlock label="Representative feedback · user content">
                {related.length === 0 ? (
                  <p className="text-muted">No feedback records are linked to this theme yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {related.map((f) => (
                      <li key={f.id}>
                        <button
                          type="button"
                          onClick={() => onOpenFeedback(f.id)}
                          className="w-full border border-line bg-panel px-3 py-2.5 text-left transition-colors hover:border-accent/70"
                        >
                          <span className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[12.5px] font-medium text-fg">{f.title}</span>
                            <span className="flex items-center gap-1.5">
                              <FeedbackCategoryBadge category={f.category} />
                              <FeedbackPriorityBadge priority={f.priority} />
                            </span>
                          </span>
                          <span className="mt-1 block text-[12px] leading-relaxed text-muted">
                            “{f.excerpt}”
                          </span>
                          <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                            Open record → {f.status}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </UserContentBlock>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Importance · manual" htmlFor={`theme-importance-${selected.id}`}>
                  <Select
                    id={`theme-importance-${selected.id}`}
                    value={selected.importance}
                    onChange={(e) =>
                      onImportanceChange(selected.id, e.target.value as ThemeImportance)
                    }
                  >
                    {THEME_IMPORTANCE.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Research status" htmlFor={`theme-status-${selected.id}`}>
                  <Select
                    id={`theme-status-${selected.id}`}
                    value={selected.reviewStatus}
                    onChange={(e) =>
                      onReviewStatusChange(selected.id, e.target.value as FeedbackStatus)
                    }
                  >
                    {FEEDBACK_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                </Field>
                <div>
                  <PanelLabel>Related product area</PanelLabel>
                  <p className="mt-2 text-[12.5px] text-fg">{selected.productArea}</p>
                </div>
              </div>

              <InternalNoteBlock label="Research notes · team only">
                <Field label="Notes" htmlFor={`theme-notes-${selected.id}`} hint="team only">
                  <TextArea
                    id={`theme-notes-${selected.id}`}
                    rows={3}
                    value={notesValue}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, [selected.id]: e.target.value }))
                    }
                    placeholder="How this theme was written down, and what still needs evidence…"
                  />
                </Field>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => saveNotes(selected.id)}
                    disabled={notesValue === (selected.internalNotes ?? "")}
                    className="border border-accent/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-accent transition-colors hover:border-accent disabled:border-line disabled:text-faint"
                  >
                    Save note
                  </button>
                  <span
                    role="status"
                    className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint"
                  >
                    {savedId === selected.id && notesValue === (selected.internalNotes ?? "")
                      ? "Saved to this preview"
                      : "Local state only · not persisted"}
                  </span>
                </div>
              </InternalNoteBlock>
            </motion.div>
          ) : (
            <FeedbackHubEmptyState
              title="Select a theme"
              description="Choose a documented theme to see its linked feedback records and research notes."
            />
          )}
        </div>
      </div>
    </section>
  );
}
