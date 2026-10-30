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
    <section className="border border-line bg-panel">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">Checklist</p>
          <p className="mt-1 text-[11.5px] text-muted">
            {completed} of {total} complete · drives the readiness score
          </p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint tabular-nums">
          {Math.round((completed / total) * 100)}%
        </p>
      </header>
      <div className="grid gap-px bg-line md:grid-cols-2">
        {categories.map(([category, categoryItems]) => {
          const categoryCompleted = categoryItems.filter((item) => completedIds.has(item.id)).length;
          return (
            <article key={category} className="bg-panel px-4 py-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg">
                  {category}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-faint tabular-nums">
                  {categoryCompleted}/{categoryItems.length}
                </p>
              </div>
              <div className="mt-3 space-y-2">
                {categoryItems.map((item) => {
                  const checked = completedIds.has(item.id);
                  return (
                    <label
                      key={item.id}
                      className="flex cursor-pointer items-start gap-2.5 border border-line px-3 py-2 transition-colors hover:border-line-2 has-[:focus-visible]:border-accent"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggle(item.id)}
                        aria-label={`Mark "${item.item}" complete`}
                        className="mt-0.5 size-4 shrink-0 cursor-pointer appearance-none border border-line-2 bg-panel transition-colors checked:border-accent checked:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
