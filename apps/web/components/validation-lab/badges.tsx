"use client";

import { type ReactNode } from "react";

import type { EvidenceType, ExperimentStatus, HypothesisStatus } from "@/lib/validation-lab/types";

export function ValidationStatusBadge({
  status,
  className = "",
}: {
  status: HypothesisStatus | ExperimentStatus;
  className?: string;
}) {
  const styles: Record<string, string> = {
    Unexamined: "border-line-2 text-faint",
    "Ready to Test": "border-accent/60 text-accent",
    Testing: "border-mint/70 text-fg",
    Supported: "border-mint text-fg",
    Rejected: "border-line-2 text-faint",
    Inconclusive: "border-line-2 text-faint",
    Draft: "border-line-2 text-faint",
    Ready: "border-accent/60 text-accent",
    "In Progress": "border-mint/70 text-fg",
    Completed: "border-mint text-fg",
    Archived: "border-line-2 text-faint",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-[3px] font-mono text-[8px] uppercase leading-none tracking-[0.13em] ${styles[status] ?? "border-line-2 text-faint"} ${className}`}
    >
      <span aria-hidden className="size-1 bg-current opacity-70" />
      {status}
    </span>
  );
}

export function EvidenceTypeBadge({
  type,
  className = "",
}: {
  type: EvidenceType;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border border-line-2 px-2 py-[3px] font-mono text-[8px] uppercase leading-none tracking-[0.13em] text-faint ${className}`}
    >
      <span aria-hidden className="size-1 bg-accent" />
      {type}
    </span>
  );
}

export function ValidationEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-faint">
        <span aria-hidden className="size-1.5 bg-line-2" />
        Empty state
      </div>
      <h3 className="text-[clamp(1.1rem,2vw,1.4rem)] font-medium tracking-[-0.03em] text-fg">{title}</h3>
      <p className="max-w-[42ch] text-[12px] leading-relaxed text-muted">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

/** Presentational error state for a future data integration. */
export function ValidationErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="border border-line bg-panel" role="alert">
      <header className="border-b border-line px-4 py-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-danger">Load failed</p>
        <p className="mt-1 text-[11.5px] text-muted">Presentational error state</p>
      </header>
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
        <div className="flex items-center gap-2 border border-danger/50 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-danger">
          <span aria-hidden className="size-1.5 bg-danger" />
          Validation workspace unavailable
        </div>
        <h3 className="text-[clamp(1.1rem,2vw,1.4rem)] font-medium tracking-[-0.03em] text-fg">
          The validation workspace could not be loaded.
        </h3>
        <p className="max-w-[46ch] text-[12px] leading-relaxed text-muted">
          This shows how the workspace behaves when a future data integration fails. No request
          was made, and no hypothesis, experiment, or finding was changed or lost.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
        >
          Retry (preview)
        </button>
      </div>
    </section>
  );
}

export function ValidationSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true">
      <div className="animate-pulse space-y-2">
        <div className="h-2.5 w-32 bg-line" />
        <div className="h-8 w-64 bg-line" />
        <div className="h-2.5 w-96 max-w-full bg-line/70" />
      </div>
      <div className="grid gap-px border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3 bg-panel px-4 py-4">
            <div className="h-2 w-24 bg-line" />
            <div className="h-6 w-16 bg-line" />
            <div className="h-2 w-28 bg-line/70" />
          </div>
        ))}
      </div>
    </div>
  );
}
