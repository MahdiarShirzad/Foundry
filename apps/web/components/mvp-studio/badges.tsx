"use client";

import { type ReactNode } from "react";

import type { FeaturePriority, FeatureScope, FeatureStatus } from "@/lib/mvp-studio/types";

export function FeaturePriorityBadge({
  priority,
  className = "",
}: {
  priority: FeaturePriority;
  className?: string;
}) {
  const styles: Record<FeaturePriority, string> = {
    Critical: "border-accent/70 text-accent",
    High: "border-line-2 text-fg",
    Medium: "border-line-2 text-faint",
    Low: "border-line-2 text-faint",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-[3px] font-mono text-[8px] uppercase leading-none tracking-[0.13em] ${styles[priority]} ${className}`}
    >
      <span aria-hidden className="size-1 bg-current opacity-70" />
      {priority}
    </span>
  );
}

export function FeatureScopeBadge({
  scope,
  className = "",
}: {
  scope: FeatureScope;
  className?: string;
}) {
  const styles: Record<FeatureScope, string> = {
    "Must Have": "border-mint text-fg",
    "Should Have": "border-line-2 text-fg",
    "Could Have": "border-line-2 text-faint",
    "Out of Scope": "border-line-2 text-faint",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-[3px] font-mono text-[8px] uppercase leading-none tracking-[0.13em] ${styles[scope]} ${className}`}
    >
      <span aria-hidden className="size-1 bg-current opacity-70" />
      {scope}
    </span>
  );
}

export function FeatureStatusBadge({
  status,
  className = "",
}: {
  status: FeatureStatus;
  className?: string;
}) {
  const styles: Record<FeatureStatus, string> = {
    Proposed: "border-line-2 text-faint",
    Ready: "border-accent/60 text-accent",
    "In Progress": "border-mint/70 text-fg",
    Completed: "border-mint text-fg",
    Deferred: "border-line-2 text-faint",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-[3px] font-mono text-[8px] uppercase leading-none tracking-[0.13em] ${styles[status]} ${className}`}
    >
      <span aria-hidden className="size-1 bg-current opacity-70" />
      {status}
    </span>
  );
}

/* ----------------------------------------------------------- state views --- */

export function MVPStudioEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-faint">
        <span aria-hidden className="size-1.5 bg-line-2" />
        Empty state
      </div>
      <h3 className="text-[clamp(1.1rem,2vw,1.4rem)] font-medium tracking-[-0.03em] text-fg">
        {title}
      </h3>
      <p className="max-w-[44ch] text-[12px] leading-relaxed text-muted">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

/** Presentational loading skeleton for a future data integration. */
export function MVPStudioSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading MVP Studio">
      <div className="grid gap-px border border-line bg-line lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-3 bg-panel px-4 py-4">
          <div className="h-2 w-24 animate-pulse bg-line" />
          <div className="h-4 w-2/3 animate-pulse bg-line" />
          <div className="h-2 w-full animate-pulse bg-line/70" />
          <div className="h-2 w-5/6 animate-pulse bg-line/70" />
          <div className="h-2 w-3/5 animate-pulse bg-line/60" />
        </div>
        <div className="grid grid-cols-2 gap-px bg-line">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2 bg-panel px-4 py-4">
              <div className="h-2 w-16 animate-pulse bg-line" />
              <div className="h-5 w-8 animate-pulse bg-line" />
            </div>
          ))}
        </div>
      </div>

      <div className="border border-line bg-panel px-3 py-2">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-5 w-24 animate-pulse bg-line/70" />
          ))}
        </div>
      </div>

      <div className="grid gap-px border border-line bg-line lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <div className="space-y-3 bg-panel p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2 animate-pulse">
              <div className="h-3 w-3/4 bg-line" />
              <div className="h-2 w-full bg-line/70" />
              <div className="h-4 w-2/5 bg-line/60" />
            </div>
          ))}
        </div>
        <div className="space-y-4 bg-panel p-6">
          <div className="h-2 w-28 animate-pulse bg-line" />
          <div className="h-5 w-2/3 animate-pulse bg-line" />
          <div className="h-2 w-40 animate-pulse bg-line/70" />
          <div className="space-y-2">
            <div className="h-2 w-full animate-pulse bg-line/70" />
            <div className="h-2 w-11/12 animate-pulse bg-line/70" />
            <div className="h-2 w-4/5 animate-pulse bg-line/60" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Presentational error state for a future data integration. */
export function MVPStudioErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="border border-line bg-panel">
      <header className="border-b border-line px-4 py-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-danger">Load failed</p>
        <p className="mt-1 text-[11.5px] text-muted">Presentational error state</p>
      </header>
      <div
        role="alert"
        className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center"
      >
        <div className="flex items-center gap-2 border border-danger/50 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-danger">
          <span aria-hidden className="size-1.5 bg-danger" />
          MVP Studio unavailable
        </div>
        <h3 className="text-[clamp(1.1rem,2vw,1.4rem)] font-medium tracking-[-0.03em] text-fg">
          The MVP workspace could not be loaded
        </h3>
        <p className="max-w-[48ch] text-[12px] leading-relaxed text-muted">
          This is a presentational example of how the workspace behaves when a future data
          integration fails. No request was made, and no feature, scope decision or specification
          was lost.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
        >
          Retry (preview)
        </button>
        <p className="mt-2 border-t border-line pt-3 font-mono text-[8.5px] uppercase leading-relaxed tracking-[0.14em] text-faint">
          No request was made · this state is part of the interface preview
        </p>
      </div>
    </section>
  );
}
