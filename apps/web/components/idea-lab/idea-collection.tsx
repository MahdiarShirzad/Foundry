"use client";

import { motion, useReducedMotion } from "motion/react";

import type { Idea } from "@/lib/idea-lab/types";

import { IdeaListItem } from "./idea-list-item";

export function IdeaCollection({
  ideas,
  selectedId,
  onSelect,
}: {
  ideas: Idea[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <motion.ul
        aria-label="Ideas"
        initial={reduce ? false : "hidden"}
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduce ? 0 : 0.025 } },
        }}
        className="min-h-0 flex-1 overflow-y-auto [scrollbar-color:var(--line-2)_transparent] [scrollbar-width:thin] md:overscroll-contain"
      >
        {ideas.map((idea) => (
          <IdeaListItem
            key={idea.id}
            idea={idea}
            selected={idea.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </motion.ul>

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-line px-4 py-2">
        <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
          {String(ideas.length).padStart(2, "0")} ideas · static sample
        </span>
        <span className="hidden font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint/80 sm:block">
          search &amp; filters preview only
        </span>
      </div>
    </div>
  );
}
