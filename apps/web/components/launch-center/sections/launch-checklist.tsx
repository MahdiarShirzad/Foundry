"use client";

import { useMemo, useState } from "react";

import type { ChecklistItem } from "@/lib/launch-center/types";

import { LaunchCenterEmptyState } from "../badges";

export function LaunchChecklist({
  items,
}: {
  items: ChecklistItem[];
}) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set(items.filter((i) => i.completed).map((i) => i.id)));

  const categories = useMemo(() => {
    const map = new Map<string, ChecklistItem[]>();
    items.forEach((i) => {
      const arr = map.get(i.category) ?? [];
      map.set(i.category, [...arr, i]);
    });
    return Array.from(map.entries());
  }, [items]);

  const total = items.length;
  const completed = completedIds.size;

  function toggle(id: string) {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (items.length === 0) {
    return <LaunchCenterEmptyState title="Empty checklist" description="Add checklist items to track launch readiness." />;
  }

  return (
    <section className="border border-line bg-panel">
      <header className="border-b border-line px-4 py-3 flex items-center justify-between gap-2">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Checklist</p>
          <p className="mt-1 text-[11px] text-muted">{completed} of {total} complete</p>
        </div>
      </header>
      <div className="grid gap-px bg-line md:grid-cols-2">
        {categories.map(([category, categoryItems]) => (
          <article key={category} className="bg-panel px-4 py-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-fg">{category}</p>
            <div className="mt-3 space-y-2">
              {categoryItems.map((item) => (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggle(item.id)}
                  className="flex items-center gap-2 border border-line px-3 py-2 text-left transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={completedIds.has(item.id)}
                    onChange={() => toggle(item.id)}
                    aria-label={`Mark "${item.item}" complete`}
                    className="size-4 border border-line rounded text-accent"
                  />
                  <p className="text-[12px] leading-relaxed text-fg">{item.item}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
