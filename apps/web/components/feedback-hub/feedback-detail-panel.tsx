"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import type {
  FeedbackItem,
  FeedbackPriority,
  FeedbackStatus,
  FeatureRequest,
} from "@/lib/feedback-hub/types";
import {
  FEEDBACK_PRIORITIES,
  FEEDBACK_STATUSES,
  NEXT_ACTIONS,
} from "@/lib/feedback-hub/types";

import {
  FeedbackCategoryBadge,
  FeedbackPriorityBadge,
  FeedbackRequestStatusBadge,
  FeedbackStatusBadge,
} from "./badges";
import {
  Field,
  InternalNoteBlock,
  PanelLabel,
  Select,
  TextArea,
  UserContentBlock,
} from "./primitives";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function FeedbackDetailPanel({
  item,
  related,
  linkedRequest,
  areaNames,
  onStatusChange,
  onPriorityChange,
  onNotesChange,
  onFollowUpChange,
  onOpenArea,
  onOpenFeedback,
  onOpenRequest,
  onBack,
}: {
  item: FeedbackItem;
  related: FeedbackItem[];
  linkedRequest: FeatureRequest | null;
  areaNames: string[];
  onStatusChange: (status: FeedbackStatus) => void;
  onPriorityChange: (priority: FeedbackPriority) => void;
  onNotesChange: (notes: string) => void;
  onFollowUpChange: (action: string) => void;
  onOpenArea: (name: string) => void;
  onOpenFeedback: (id: string) => void;
  onOpenRequest: (id: string) => void;
  onBack?: () => void;
}) {
  const reduce = useReducedMotion();
  const [notes, setNotes] = useState(item.internalNotes ?? "");
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const dirty = notes !== (item.internalNotes ?? "");
  const saved = lastSaved !== null && !dirty && lastSaved === (item.internalNotes ?? "");

  function saveNotes() {
    const value = notes.trim();
    setNotes(value);
    onNotesChange(value);
    setLastSaved(value);
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.22, ease: EASE }}
      className="flex h-full flex-col"
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <p className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
            <span aria-hidden className="size-1.5 bg-mint" />
            Feedback record · {item.id}
          </p>
          <h3 className="mt-2 text-[clamp(1.15rem,2vw,1.5rem)] font-medium leading-tight tracking-[-0.03em] text-fg">
            {item.title}
          </h3>
          <p className="mt-1.5 text-[11.5px] text-muted">
            {item.source} · {item.date} · fictional sample record
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FeedbackCategoryBadge category={item.category} />
          <FeedbackPriorityBadge priority={item.priority} />
          <FeedbackStatusBadge status={item.status} />
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-faint transition-colors hover:border-accent hover:text-accent lg:hidden"
            >
              ← Inbox
            </button>
          ) : null}
        </div>
      </header>

      <div className="space-y-5 px-5 py-5 sm:px-6">
        <UserContentBlock>
          <p className="text-fg">{item.excerpt}</p>
          <p className="mt-2 text-muted">{item.description}</p>
        </UserContentBlock>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Review status" htmlFor={`${item.id}-status`}>
            <Select
              id={`${item.id}-status`}
              value={item.status}
              onChange={(e) => onStatusChange(e.target.value as FeedbackStatus)}
            >
              {FEEDBACK_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Priority" htmlFor={`${item.id}-priority`}>
            <Select
              id={`${item.id}-priority`}
              value={item.priority}
              onChange={(e) => onPriorityChange(e.target.value as FeedbackPriority)}
            >
              {FEEDBACK_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div>
          <PanelLabel>Related product area</PanelLabel>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {item.productArea ? (
              <button
                type="button"
                onClick={() => onOpenArea(item.productArea!)}
                className="border border-line px-2.5 py-1 text-[12px] text-fg transition-colors hover:border-accent hover:text-accent"
              >
                {item.productArea} →
              </button>
            ) : (
              <span className="text-[12px] text-muted">None assigned</span>
            )}
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
              {areaNames.length} areas tracked
            </span>
          </div>
        </div>

        <div>
          <PanelLabel>Next action · manually selected</PanelLabel>
          <div className="mt-2 max-w-md">
            <Select
              id={`${item.id}-follow-up`}
              aria-label="Next action for this feedback"
              value={item.followUpAction ?? "No action yet"}
              onChange={(e) => onFollowUpChange(e.target.value)}
            >
              {NEXT_ACTIONS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <InternalNoteBlock>
          <Field label="Notes" htmlFor={`${item.id}-notes`} hint="team only">
            <TextArea
              id={`${item.id}-notes`}
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Team-only context, decisions and open questions…"
            />
          </Field>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={saveNotes}
              disabled={!dirty}
              className="border border-accent/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-accent transition-colors hover:border-accent disabled:border-line disabled:text-faint"
            >
              Save note
            </button>
            {saved ? (
              <span role="status" className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                Saved to this preview
              </span>
            ) : (
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                Local state only · not persisted
              </span>
            )}
          </div>
        </InternalNoteBlock>

        <div>
          <PanelLabel>Related feedback records</PanelLabel>
          {related.length === 0 ? (
            <p className="mt-2 text-[12px] text-muted">No other records link here yet.</p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {related.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => onOpenFeedback(r.id)}
                    className="flex w-full items-baseline gap-2 border border-line px-3 py-2 text-left transition-colors hover:border-accent/70 hover:bg-mint-tint/20"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                      {r.id}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[12px] text-fg">{r.title}</span>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                      {r.status}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <PanelLabel>Linked feature request</PanelLabel>
          {linkedRequest ? (
            <button
              type="button"
              onClick={() => onOpenRequest(linkedRequest.id)}
              className="mt-2 flex w-full flex-wrap items-center justify-between gap-2 border border-line px-3 py-2.5 text-left transition-colors hover:border-accent/70 hover:bg-mint-tint/20"
            >
              <span className="min-w-0">
                <span className="block text-[12.5px] text-fg">{linkedRequest.title}</span>
                <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                  {linkedRequest.roadmapReference ?? "No roadmap reference"}
                </span>
              </span>
              <FeedbackRequestStatusBadge status={linkedRequest.status} />
            </button>
          ) : (
            <p className="mt-2 text-[12px] text-muted">
              No feature request references this record.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
