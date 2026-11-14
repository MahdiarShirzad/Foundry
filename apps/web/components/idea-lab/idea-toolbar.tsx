"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { DEFAULT_IDEA_CATEGORIES, mergeCategories } from "@/lib/idea-lab/categories";
import {
  IDEA_SORT_OPTIONS,
  IDEA_STATUS_FILTERS,
  type IdeaStatusFilter,
} from "@/lib/idea-lab/types";

import { IdeaSelect } from "./idea-select";

export function IdeaToolbar({
  query,
  onQueryChange,
  status,
  onStatusChange,
  category,
  onCategoryChange,
  categoryOptions,
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
  categoryOptions?: string[];
  sort: string;
  onSortChange: (value: string) => void;
  count: number;
}) {
  const reduce = useReducedMotion();

  const categorySelectOptions = [
    { value: "all", label: "All categories", shortLabel: "All" },
    ...mergeCategories(categoryOptions ?? DEFAULT_IDEA_CATEGORIES, []).map(
      (value) => ({ value, label: value }),
    ),
  ];

  return (
    <div className="sticky top-0 z-10 shrink-0 border-b border-line bg-panel/95 backdrop-blur">
      <div className="flex items-center gap-2.5 px-4 py-2.5">
        <svg
          width="14"
          height="14"
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
          className="min-w-0 flex-1 bg-transparent py-1 text-[13.5px] text-fg outline-none placeholder:text-faint"
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
              className="flex size-5 shrink-0 items-center justify-center rounded-full bg-surface-sunken/70 text-[12px] leading-none text-muted transition-colors hover:bg-surface-sunken hover:text-fg"
            >
              ×
            </motion.button>
          ) : null}
        </AnimatePresence>

        <span className="shrink-0 text-[12px] tabular-nums text-faint">{count}</span>
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-2 px-4 pb-2.5">
        <div
          role="group"
          aria-label="Filter by status"
          className="inline-flex items-center gap-0.5 rounded-control border border-line bg-surface-sunken/40 p-0.5"
        >
          {IDEA_STATUS_FILTERS.map((option) => {
            const active = option.value === status;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onStatusChange(option.value)}
                aria-pressed={active}
                className={`rounded-[6px] px-2 py-1 text-[12px] font-medium transition-colors duration-150 ${
                  active
                    ? "bg-panel text-fg shadow-[var(--elevation-lift)]"
                    : "text-muted hover:text-fg"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="ml-auto grid w-full grid-cols-2 gap-2 sm:w-auto sm:min-w-[15rem] sm:flex-1 lg:flex lg:flex-none">
          <IdeaSelect
            label="Category"
            value={category}
            options={categorySelectOptions}
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
