import { IdeaSelect } from "./idea-select";
import { LAB_VIEW_OPTIONS, type LabView } from "@/lib/idea-lab/types";

export function IdeaLabHeader({
  total,
  exploring,
  shortlisted,
  lastUpdated,
  view,
  onViewChange,
  onNewIdea,
}: {
  total: number;
  exploring: number;
  shortlisted: number;
  lastUpdated: string;
  view: LabView;
  onViewChange: (view: LabView) => void;
  onNewIdea: () => void;
}) {
  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2.5 font-mono text-[9.5px] uppercase tracking-[0.24em] text-accent">
            <span aria-hidden className="size-1.5 shrink-0 bg-mint" />
            Stage 01 · Capture
            <span aria-hidden className="hidden h-px w-9 bg-line sm:block" />
            <span className="hidden font-mono text-[9px] tracking-[0.2em] text-faint sm:inline">
              Eight-stage cycle
            </span>
          </p>

          <h1 className="mt-2.5 text-[clamp(2.1rem,3.8vw,2.9rem)] font-medium leading-[0.94] tracking-[-0.045em] text-fg">
            Idea Lab
          </h1>

          <p className="mt-2.5 max-w-[54ch] text-[13px] leading-relaxed text-muted">
            Capture ideas. Discover opportunities. Start building.
          </p>

          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
            <span>
              <span className="text-fg">{String(total).padStart(2, "0")}</span> ideas
            </span>
            <span aria-hidden className="size-0.5 bg-line-2" />
            <span>{exploring} exploring</span>
            <span aria-hidden className="size-0.5 bg-line-2" />
            <span>{shortlisted} shortlisted</span>
            <span aria-hidden className="size-0.5 bg-line-2" />
            <span>updated {lastUpdated}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <IdeaSelect
            label="Preview"
            value={view}
            options={LAB_VIEW_OPTIONS}
            onChange={(next) => onViewChange(next as LabView)}
          />

          <button
            type="button"
            onClick={onNewIdea}
            className="group inline-flex h-10 items-center gap-2.5 bg-mint px-4 text-[13px] font-medium text-ink transition duration-200 hover:brightness-95 active:translate-y-px"
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 12 12"
              aria-hidden
              className="fill-none stroke-current stroke-[1.6] transition-transform duration-300 group-hover:rotate-90"
            >
              <path d="M6 1.5v9M1.5 6h9" strokeLinecap="square" />
            </svg>
            New Idea
          </button>
        </div>
      </div>
    </header>
  );
}
