"use client";

import { DEMO_MVP_PROJECTS } from "@/lib/mvp-studio/demo";
import type { MVPProject } from "@/lib/mvp-studio/types";

export function MVPStudioHeader({
  project,
  projects = DEMO_MVP_PROJECTS,
  onChangeProject,
  counts,
  onAddFeature,
  onDefineScope,
}: {
  project: MVPProject;
  projects?: MVPProject[];
  onChangeProject: (id: string) => void;
  counts: { total: number; inMvp: number; inProgress: number; completed: number };
  onAddFeature: () => void;
  onDefineScope: () => void;
}) {
  return (
    <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
      <div className="min-w-0">
        <p className="flex items-center gap-2.5 font-mono text-[9.5px] uppercase tracking-[0.24em] text-accent">
          <span aria-hidden className="size-1.5 shrink-0 bg-mint" />
          Stage 04 / Build
          <span aria-hidden className="hidden h-px w-9 bg-line sm:block" />
          <span className="hidden font-mono text-[9px] tracking-[0.2em] text-faint sm:inline">
            Eight-stage cycle
          </span>
        </p>

        <h1 className="mt-2.5 text-[clamp(1.9rem,4vw,2.8rem)] font-medium leading-[0.98] tracking-[-0.04em] text-fg">
          MVP Studio
        </h1>

        <p className="mt-2.5 max-w-[68ch] text-[12.5px] leading-relaxed text-muted">
          Turn your validated idea into a focused, buildable first version by defining essential
          features, setting boundaries, and organizing product specifications.
        </p>

        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <label className="flex h-8 items-center gap-2 border border-line bg-panel px-2.5">
            <span className="shrink-0 font-mono text-[8.5px] uppercase tracking-[0.16em] text-faint">
              Idea
            </span>
            <span aria-hidden className="h-3 w-px bg-line" />
            <select
              value={project.id}
              onChange={(event) => onChangeProject(event.target.value)}
              aria-label="Select product idea for MVP Studio"
              className="min-w-0 bg-transparent font-mono text-[9.5px] uppercase tracking-[0.1em] text-fg outline-none"
            >
              {projects.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} · {item.ref}
                </option>
              ))}
            </select>
          </label>

          {/* Compact MVP project status */}
          <p className="flex h-8 flex-wrap items-center gap-x-2 gap-y-1 border border-line bg-panel px-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
            <span className="flex items-center gap-1.5 text-accent">
              <span aria-hidden className="size-1.5 bg-mint" />
              {project.status}
            </span>
            <span aria-hidden className="size-0.5 bg-line-2" />
            <span className="text-fg">{project.name}</span>
            <span aria-hidden className="size-0.5 bg-line-2" />
            {counts.total} proposed
            <span aria-hidden className="size-0.5 bg-line-2" />
            {counts.inMvp} in MVP
            <span aria-hidden className="size-0.5 bg-line-2" />
            {counts.inProgress} building
            <span aria-hidden className="size-0.5 bg-line-2" />
            {counts.completed} done
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onAddFeature}
          className="inline-flex h-10 items-center justify-center gap-2 bg-mint px-4 text-[13px] font-medium text-ink transition duration-200 hover:brightness-95 active:translate-y-px sm:h-9"
        >
          <span aria-hidden className="text-[14px] leading-none">
            +
          </span>
          Add Feature
        </button>
        <button
          type="button"
          onClick={onDefineScope}
          className="inline-flex h-10 items-center justify-center gap-2 border border-line-2 bg-panel px-3.5 font-mono text-[9px] uppercase tracking-[0.14em] text-fg transition-colors hover:border-accent hover:text-accent sm:h-9"
        >
          Define MVP Scope
        </button>
      </div>
    </header>
  );
}
