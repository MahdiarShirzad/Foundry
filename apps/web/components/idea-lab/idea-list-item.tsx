"use client";

import { motion, useReducedMotion } from "motion/react";

import { formatUpdated, type Idea } from "@/lib/idea-lab/types";

import { IdeaStatus } from "./idea-status";

export const IDEA_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function IdeaListItem({
  idea,
  selected,
  onSelect,
}: {
  idea: Idea;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.li variants={IDEA_ITEM_VARIANTS} className="border-b border-line/70 last:border-b-0">
      <button
        type="button"
        onClick={() => onSelect(idea.id)}
        aria-current={selected ? "true" : undefined}
        className={`group relative block w-full min-w-0 px-4 py-3.5 text-left transition-colors duration-150 focus-visible:outline-offset-[-2px] ${
          selected ? "bg-mint-tint/45" : "hover:bg-surface-sunken/30"
        }`}
      >
        {selected ? (
          <motion.span
            layoutId="idea-selected-rail"
            aria-hidden
            className="absolute inset-y-2 left-0 w-[2px] rounded-pill bg-accent"
            transition={{ duration: reduce ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : null}

        <span className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-[11px] tracking-[0.04em] text-faint">{idea.ref}</span>
          <span className="shrink-0 text-[11.5px] text-faint">
            {formatUpdated(idea.updatedAt)}
          </span>
        </span>

        <span
          className={`mt-1.5 block text-[14.5px] font-medium leading-snug tracking-[-0.015em] ${
            selected ? "text-fg" : "text-fg group-hover:text-accent"
          }`}
        >
          {idea.name}
        </span>

        <span className="mt-1 line-clamp-2 block text-[12.5px] leading-relaxed text-muted">
          {idea.summary || idea.headline}
        </span>

        <span className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <IdeaStatus status={idea.status} />
          <span className="text-[12px] text-faint">
            {idea.category?.trim() || "Uncategorised"}
          </span>
        </span>
      </button>
    </motion.li>
  );
}
