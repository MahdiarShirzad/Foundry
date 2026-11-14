"use client";

import { useMemo } from "react";

import type { ChecklistItem } from "@/lib/launch-center/types";

import { LaunchCenterEmptyState } from "../badges";

export function LaunchChecklist({
  items,
  completedIds,
  onToggle,
}: {
  items: ChecklistItem[];
  completedIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  const categories = useMemo(() => {
    const map = new Map<string, ChecklistItem[]>();
    items.forEach((item) => {
      const arr = map.get(item.category) ?? [];
      map.set(item.category, [...arr, item]);
    });
    return Array.from(map.entries());
  }, [items]);

  const total = items.length;
  const completed = items.filter((item) => completedIds.has(item.id)).length;

  if (items.length === 0) {
    return (
      <LaunchCenterEmptyState
        title="No checklist yet"
        description="Checklist items are how this workspace measures launch readiness. Add items to begin."
      />
    );
  }

  return (
    <section className="overflow-hidden rounded-card border border-line bg-panel shadow-card">
      <header className="px-5 pb-4 pt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-semibold tracking-[-0.015em] text-fg">Checklist</h2>
            <p className="mt-1 text-[12.5px] text-muted">
              {completed} of {total} complete · drives the readiness score
            </p>
          </div>
          <p className="font-mono text-[13px] font-medium text-fg tabular-nums">
            {Math.round((completed / total) * 100)}%
          </p>
        </div>
        <div
          role="progressbar"
          aria-label="Launch readiness"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={completed}
          className="mt-3 h-1.5 overflow-hidden rounded-pill bg-surface-sunken/70"
        >
          <span
            aria-hidden
            className="block h-full rounded-pill bg-accent transition-[width] duration-200 ease-out"
            style={{ width: `${Math.round((completed / total) * 100)}%` }}
          />
        </div>
      </header>
      <div className="grid gap-px border-t border-line bg-line md:grid-cols-2">
        {categories.map(([category, categoryItems]) => {
          const categoryCompleted = categoryItems.filter((item) => completedIds.has(item.id)).length;
          return (
            <article key={category} className="bg-panel px-5 py-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[13px] font-medium text-fg">
                  {category}
                </p>
                <p className="text-[12px] text-faint tabular-nums">
                  {categoryCompleted}/{categoryItems.length}
                </p>
              </div>
              <div className="mt-3 space-y-2">
                {categoryItems.map((item) => {
                  const checked = completedIds.has(item.id);
                  return (
                    <label
                      key={item.id}
                      className="flex cursor-pointer items-start gap-2.5 rounded-control border border-line px-3 py-2 transition-colors hover:border-line-2 has-[:focus-visible]:border-accent"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggle(item.id)}
                        aria-label={`Mark "${item.item}" complete`}
                        className="mt-0.5 size-4 shrink-0 cursor-pointer appearance-none rounded-[4px] border border-line-2 bg-panel transition-colors checked:border-accent checked:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      />
                      <span
                        className={`text-[12.5px] leading-relaxed ${
                          checked ? "text-faint line-through decoration-line-2" : "text-fg"
                        }`}
                      >
                        {item.item}
                      </span>
                    </label>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
