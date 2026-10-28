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
    <motion.li variants={IDEA_ITEM_VARIANTS} className="border-b border-line last:border-b-0">
      <button
        type="button"
        onClick={() => onSelect(idea.id)}
        aria-current={selected ? "true" : undefined}
        className={`group relative block w-full min-w-0 px-4 py-3.5 text-left transition-colors duration-200 focus-visible:outline-offset-[-2px] ${
          selected ? "bg-mint-tint/35" : "hover:bg-mint-tint/20"
        }`}
      >
        {selected ? (
          <motion.span
            layoutId="idea-selected-rail"
            aria-hidden
            className="absolute inset-y-0 left-0 w-[2px] bg-accent"
            transition={{ duration: reduce ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : null}

        <span className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-[9px] tracking-[0.16em] text-faint">{idea.ref}</span>
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.1em] text-faint">
            {formatUpdated(idea.updatedAt)}
          </span>
        </span>

        <span className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span
            className={`text-[15px] font-medium leading-tight tracking-[-0.015em] transition-colors ${
              selected ? "text-accent" : "text-fg group-hover:text-accent"
            }`}
          >
            {idea.name}
          </span>
          <span className="min-w-0 text-[11.5px] leading-snug text-faint">{idea.headline}</span>
        </span>

        <span className="mt-1.5 line-clamp-2 block text-[11.5px] leading-[1.55] text-muted">
          {idea.summary}
        </span>

        <span className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <IdeaStatus status={idea.status} />
          <span aria-hidden className="size-0.5 bg-line-2" />
          <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
            {idea.category}
          </span>
        </span>
      </button>
    </motion.li>
  );
}
