"use client";

import { MVP_SECTIONS, type MVPSection } from "@/lib/mvp-studio/types";

export function MVPWorkspaceNavigation({
  section,
  onChange,
}: {
  section: MVPSection;
  onChange: (section: MVPSection) => void;
}) {
  return (
    <nav aria-label="MVP workspace sections" className="border border-line bg-panel">
      <div className="flex flex-wrap items-center gap-1 px-2 py-1.5">
        {MVP_SECTIONS.map((s) => {
          const active = section === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              aria-current={active ? "page" : undefined}
              className={`px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.16em] transition-colors ${active ? "text-accent" : "text-faint hover:text-fg"}`}
            >
              {s}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
