"use client";

import { useRef, type KeyboardEvent } from "react";

import {
  MARKET_SECTIONS,
  MARKET_SECTION_META,
  type MarketSection,
} from "@/lib/market-intelligence/types";

export function MarketWorkspaceNavigation({
  section,
  onChange,
  counts,
}: {
  section: MarketSection;
  onChange: (section: MarketSection) => void;
  counts: Record<MarketSection, number>;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = MARKET_SECTIONS.length - 1;
    let next: number | null = null;

    if (event.key === "ArrowRight") next = index >= last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = index <= 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;

    if (next === null) return;
    event.preventDefault();
    const target = MARKET_SECTIONS[next];
    onChange(target);
    refs.current[next]?.focus();
  }

  return (
    <nav aria-label="Market research sections" className="border border-line bg-panel">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2">
        <p className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-faint">
          Research workspace
        </p>
        <p className="hidden font-mono text-[8px] uppercase tracking-[0.13em] text-faint/75 sm:block">
          Local view · no analysis is run
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Market intelligence sections"
        className="-mb-px flex [scrollbar-width:none] overflow-x-auto [&::-webkit-scrollbar]:hidden"
      >
        {MARKET_SECTIONS.map((key, index) => {
          const meta = MARKET_SECTION_META[key];
          const active = section === key;
          return (
            <button
              key={key}
              ref={(node) => {
                refs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`market-tab-${key}`}
              aria-selected={active}
              aria-controls={`market-panel-${key}`}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(key)}
              onKeyDown={(event) => move(event, index)}
              className={`relative flex min-w-[9.5rem] flex-1 shrink-0 items-center gap-2 border-r border-line px-2.5 py-3 text-left transition-colors last:border-r-0 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent sm:px-3 lg:px-4 ${
                active
                  ? "bg-panel text-fg shadow-[inset_0_-2px_0_var(--accent)]"
                  : "bg-bg/50 text-faint hover:bg-panel/70 hover:text-fg"
              }`}
            >
              <span
                aria-hidden
                className={`hidden font-mono text-[8px] tracking-[0.08em] lg:inline ${
                  active ? "text-accent" : "text-line-2"
                }`}
              >
                {meta.index}
              </span>
              <span className="min-w-0 flex-1 whitespace-nowrap text-[11.5px] font-medium tracking-[-0.005em] sm:text-[12px]">
                {meta.label}
              </span>
              <span
                className={`shrink-0 border px-1.5 py-0.5 font-mono text-[8px] leading-none tracking-[0.08em] ${
                  active
                    ? "border-accent/35 bg-mint-tint/50 text-accent"
                    : "border-line text-faint"
                }`}
              >
                {String(counts[key]).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
