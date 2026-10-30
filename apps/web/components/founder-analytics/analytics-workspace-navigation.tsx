"use client";

import {
  ANALYTICS_SECTIONS,
  type AnalyticsSection,
} from "@/lib/founder-analytics/types";

export function AnalyticsWorkspaceNavigation({
  section,
  onChange,
}: {
  section: AnalyticsSection;
  onChange: (section: AnalyticsSection) => void;
}) {
  function onKeyDown(event: React.KeyboardEvent) {
    const index = ANALYTICS_SECTIONS.indexOf(section);
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % ANALYTICS_SECTIONS.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + ANALYTICS_SECTIONS.length) % ANALYTICS_SECTIONS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = ANALYTICS_SECTIONS.length - 1;
    else return;
    event.preventDefault();
    onChange(ANALYTICS_SECTIONS[next]);
    document.getElementById(`analytics-tab-${ANALYTICS_SECTIONS[next]}`)?.focus();
  }

  return (
    <nav aria-label="Analytics workspace sections" className="border border-line bg-panel">
      <div
        role="tablist"
        aria-label="Analytics workspace sections"
        onKeyDown={onKeyDown}
        className="flex flex-wrap items-center gap-1 px-2 py-1.5"
      >
        {ANALYTICS_SECTIONS.map((entry) => {
          const active = section === entry;
          return (
            <button
              key={entry}
              type="button"
              role="tab"
              id={`analytics-tab-${entry}`}
              aria-selected={active}
              aria-controls={`analytics-panel-${entry}`}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(entry)}
              className={`border px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.16em] transition-colors ${
                active
                  ? "border-accent/60 bg-mint-tint/50 text-accent"
                  : "border-transparent text-faint hover:text-fg"
              }`}
            >
              {entry}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
