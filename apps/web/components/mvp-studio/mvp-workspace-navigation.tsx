"use client";

import { MVP_SECTIONS, type MVPSection } from "@/lib/mvp-studio/types";

export function MVPWorkspaceNavigation({
  section,
  onChange,
  counts,
}: {
  section: MVPSection;
  onChange: (section: MVPSection) => void;
  counts: Record<MVPSection, number>;
}) {
  function onKeyDown(event: React.KeyboardEvent) {
    const index = MVP_SECTIONS.indexOf(section);
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % MVP_SECTIONS.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + MVP_SECTIONS.length) % MVP_SECTIONS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = MVP_SECTIONS.length - 1;
    else return;
    event.preventDefault();
    onChange(MVP_SECTIONS[next]);
    document.getElementById(`mvp-tab-${MVP_SECTIONS[next]}`)?.focus();
  }

  return (
    <nav aria-label="MVP workspace sections" className="border border-line bg-panel">
      <div
        role="tablist"
        aria-label="MVP workspace sections"
        onKeyDown={onKeyDown}
        className="flex flex-wrap items-center gap-1 px-2 py-1.5"
      >
        {MVP_SECTIONS.map((s) => {
          const active = section === s;
          return (
            <button
              key={s}
              type="button"
              role="tab"
              id={`mvp-tab-${s}`}
              aria-selected={active}
              aria-controls={`mvp-panel-${s}`}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(s)}
              className={`flex items-center gap-2 border px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.16em] transition-colors ${
                active
                  ? "border-accent/60 bg-mint-tint/50 text-accent"
                  : "border-transparent text-faint hover:text-fg"
              }`}
            >
              {s}
              <span className={active ? "text-accent/70" : "text-faint/70"}>
                {counts[s]}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
