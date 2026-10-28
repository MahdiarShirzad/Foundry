"use client";

import { LAUNCH_SECTIONS, type LaunchSection } from "@/lib/launch-center/types";

export function LaunchWorkspaceNavigation({
  section,
  onChange,
}: {
  section: LaunchSection;
  onChange: (section: LaunchSection) => void;
}) {
  return (
    <nav aria-label="Launch workspace sections" className="border border-line bg-panel">
      <div className="flex flex-wrap items-center gap-1 px-2 py-1.5">
        {LAUNCH_SECTIONS.map((s) => {
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
