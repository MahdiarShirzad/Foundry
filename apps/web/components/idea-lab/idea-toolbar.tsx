"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  IDEA_CATEGORY_OPTIONS,
  IDEA_SORT_OPTIONS,
  IDEA_STATUS_FILTERS,
} from "@/lib/idea-lab/demo";
import type { IdeaStatusFilter } from "@/lib/idea-lab/types";

import { IdeaSelect } from "./idea-select";

export function IdeaToolbar({
  query,
  onQueryChange,
  status,
  onStatusChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  count,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  status: IdeaStatusFilter;
  onStatusChange: (value: IdeaStatusFilter) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  count: number;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="shrink-0 border-b border-line bg-panel">
      <div className="flex items-center gap-2.5 px-4 py-2.5">
        <svg
          width="13"
          height="13"
          viewBox="0 0 16 16"
          aria-hidden
          className="shrink-0 fill-none stroke-faint stroke-[1.5]"
        >
          <circle cx="7" cy="7" r="4.5" />
          <path d="m10.5 10.5 3.5 3.5" strokeLinecap="round" />
        </svg>

        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          aria-label="Search ideas"
          placeholder="Search ideas…"
          className="min-w-0 flex-1 bg-transparent text-[12.5px] text-fg outline-none placeholder:text-faint/80"
        />

        <AnimatePresence initial={false}>
          {query ? (
            <motion.button
              type="button"
              onClick={() => onQueryChange("")}
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: reduce ? 0 : 0.12 }}
              aria-label="Clear search"
              className="flex size-5 shrink-0 items-center justify-center border border-line font-mono text-[10px] leading-none text-faint transition-colors hover:border-accent hover:text-accent"
            >
              ×
            </motion.button>
          ) : null}
        </AnimatePresence>

        <span className="shrink-0 border-l border-line pl-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
          {String(count).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line/70 px-4 py-2">
        <div role="group" aria-label="Filter by status" className="flex items-center gap-0.5">
          {IDEA_STATUS_FILTERS.map((option) => {
            const active = option.value === status;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onStatusChange(option.value)}
                aria-pressed={active}
                className={`relative px-1.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                  active ? "text-accent" : "text-faint hover:text-fg"
                }`}
              >
                {option.label}
                {active ? (
                  <motion.span
                    layoutId="idea-status-filter"
                    aria-hidden
                    className="absolute inset-x-1 -bottom-[3px] h-px bg-accent"
                    transition={{ duration: reduce ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        <span aria-hidden className="hidden h-3 w-px bg-line sm:block" />

        <div className="ml-auto grid w-full grid-cols-2 gap-2 sm:w-auto sm:min-w-[16rem] sm:flex-1 xl:flex xl:flex-none">
          <IdeaSelect
            label="Category"
            value={category}
            options={IDEA_CATEGORY_OPTIONS}
            onChange={onCategoryChange}
          />
          <IdeaSelect
            label="Sort"
            value={sort}
            options={IDEA_SORT_OPTIONS}
            onChange={onSortChange}
            align="right"
          />
        </div>
      </div>
    </div>
  );
}
