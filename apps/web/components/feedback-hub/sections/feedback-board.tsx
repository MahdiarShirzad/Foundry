"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import type {
  FeedbackItem,
  FeedbackPriority,
  FeedbackStatus,
} from "@/lib/feedback-hub/types";
import { BOARD_COLUMNS, FEEDBACK_PRIORITIES } from "@/lib/feedback-hub/types";

import {
  FeedbackCategoryBadge,
  FeedbackHubEmptyState,
  FeedbackPriorityBadge,
  FeedbackStatusBadge,
} from "../badges";
import { PanelLabel, Select } from "../primitives";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function FeedbackBoard({
  feedback,
  selectedId,
  onSelect,
  onStatusChange,
  onPriorityChange,
}: {
  feedback: FeedbackItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onStatusChange: (id: string, status: FeedbackStatus) => void;
  onPriorityChange: (id: string, priority: FeedbackPriority) => void;
}) {
  const reduce = useReducedMotion();
  const selected = feedback.find((f) => f.id === selectedId) ?? null;

  if (feedback.length === 0) {
    return (
      <section className="border border-line bg-panel">
        <FeedbackHubEmptyState
          title="Empty feedback board"
          description="The review board has no cards because this product has no feedback records yet. Add a record to start moving work through review."
        />
      </section>
    );
  }

  return (
    <section className="border border-line bg-panel" aria-label="Feedback board">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-4 py-3">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
            Feedback Board
          </p>
          <p className="mt-1 text-[11.5px] text-muted">
            Review workflow by status — change a card&apos;s status with its menu
          </p>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
          {feedback.length} cards
        </p>
      </header>

      <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {BOARD_COLUMNS.map((status) => {
          const items = feedback.filter((f) => f.status === status);
          return (
            <article key={status} className="min-w-0 bg-panel">
              <header className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-fg">
                  {status}
                </p>
                <p className="font-mono text-[10px] text-faint">{items.length}</p>
              </header>
              <div className="space-y-2 p-2">
                {items.length === 0 ? (
                  <p className="px-1 py-3 text-center text-[11px] text-faint">No cards</p>
                ) : (
                  <AnimatePresence initial={false} mode="popLayout">
                    {items.map((f) => {
                      const active = selected?.id === f.id;
                      return (
                        <motion.div
                          key={f.id}
                          layout={!reduce}
                          initial={reduce ? false : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                          transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
                          className={`border p-3 ${
                            active
                              ? "border-accent/70 bg-mint-tint/25 ring-1 ring-accent/60"
                              : "border-line"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => onSelect(f.id)}
                            aria-pressed={active}
                            className="block w-full text-left"
                          >
                            <span className="flex items-start justify-between gap-2">
                              <span className="min-w-0 text-[12px] font-medium leading-snug text-fg">
                                {f.title}
                              </span>
                              <FeedbackPriorityBadge priority={f.priority} />
                            </span>
                            <span className="mt-2 flex flex-wrap items-center gap-1.5">
                              <FeedbackCategoryBadge category={f.category} />
                            </span>
                            <span className="mt-1.5 line-clamp-2 block text-[11px] leading-relaxed text-muted">
                              {f.excerpt}
                            </span>
                          </button>
                          <div className="mt-2.5 border-t border-line pt-2">
                            <label htmlFor={`board-status-${f.id}`} className="sr-only">
                              Status for {f.title}
                            </label>
                            <Select
                              id={`board-status-${f.id}`}
                              value={f.status}
                              onChange={(e) =>
                                onStatusChange(f.id, e.target.value as FeedbackStatus)
                              }
                              className="px-2 py-1 text-[11px]"
                            >
                              {BOARD_COLUMNS.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </Select>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {selected ? (
        <motion.div
          key={selected.id}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.18, ease: EASE }}
          className="space-y-3 border-t border-line px-4 py-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
              Selected card · {selected.id}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <FeedbackStatusBadge status={selected.status} />
              <FeedbackPriorityBadge priority={selected.priority} />
            </div>
          </div>
          <div>
            <h3 className="text-[14px] font-medium text-fg">{selected.title}</h3>
            <p className="mt-1 max-w-[80ch] text-[12px] leading-relaxed text-muted">
              {selected.description}
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <div className="min-w-[11rem]">
              <PanelLabel>Priority</PanelLabel>
              <div className="mt-1.5">
                <Select
                  aria-label="Priority for selected card"
                  value={selected.priority}
                  onChange={(e) => onPriorityChange(selected.id, e.target.value as FeedbackPriority)}
                  className="py-1.5 text-[12px]"
                >
                  {FEEDBACK_PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
              {selected.source} · {selected.date}
              {selected.productArea ? ` · ${selected.productArea}` : ""}
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="border-t border-line px-4 py-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
            Select a card to inspect it
          </p>
        </div>
      )}
    </section>
  );
}
