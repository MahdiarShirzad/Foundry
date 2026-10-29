"use client";

import type { ReactNode } from "react";

import type {
  FeatureRequestStatus,
  FeedbackCategory,
  FeedbackPriority,
  FeedbackStatus,
} from "@/lib/feedback-hub/types";

/* ----------------------------------------------------------------- badges --- */

export function FeedbackPriorityBadge({
  priority,
  className = "",
}: {
  priority: FeedbackPriority;
  className?: string;
}) {
  const styles: Record<FeedbackPriority, string> = {
    Critical: "border-danger/60 text-danger",
    High: "border-accent/70 text-accent",
    Medium: "border-line-2 text-muted",
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

export function FeedbackStatusBadge({
  status,
  className = "",
}: {
  status: FeedbackStatus;
  className?: string;
}) {
  const styles: Record<FeedbackStatus, string> = {
    New: "border-line-2 text-faint",
    "Under Review": "border-accent/60 text-accent",
    Planned: "border-mint/70 text-fg",
    Resolved: "border-mint text-fg",
    Archived: "border-line-2 text-faint opacity-70",
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

export function FeedbackRequestStatusBadge({
  status,
  className = "",
}: {
  status: FeatureRequestStatus;
  className?: string;
}) {
  const styles: Record<FeatureRequestStatus, string> = {
    New: "border-line-2 text-faint",
    "Under Review": "border-accent/60 text-accent",
    Planned: "border-mint/70 text-fg",
    Declined: "border-danger/50 text-danger",
    Delivered: "border-mint text-fg",
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

export function FeedbackCategoryBadge({
  category,
  className = "",
}: {
  category: FeedbackCategory;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border border-line-2 px-2 py-[3px] font-mono text-[8px] uppercase leading-none tracking-[0.13em] text-muted ${className}`}
    >
      <span aria-hidden className="size-1 bg-accent" />
      {category}
    </span>
  );
}

/* ----------------------------------------------------------- state views --- */

export function FeedbackHubEmptyState({
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
export function FeedbackHubSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading feedback">
      <div className="grid gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-3 bg-panel px-4 py-4">
            <div className="h-2 w-24 animate-pulse bg-line" />
            <div className="h-6 w-12 animate-pulse bg-line" />
            <div className="h-2 w-28 animate-pulse bg-line/70" />
          </div>
        ))}
      </div>
      <div className="grid gap-px border border-line bg-line lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <div className="space-y-3 bg-panel p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2 animate-pulse">
              <div className="h-3 w-3/4 bg-line" />
              <div className="h-2 w-full bg-line/70" />
              <div className="h-2 w-2/5 bg-line/60" />
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
export function FeedbackHubErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="border border-line bg-panel">
      <header className="border-b border-line px-4 py-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-danger">
          Load failed
        </p>
        <p className="mt-1 text-[11.5px] text-muted">Presentational error state</p>
      </header>
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
        <div className="flex items-center gap-2 border border-danger/50 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-danger">
          <span aria-hidden className="size-1.5 bg-danger" />
          Feedback unavailable
        </div>
        <h3 className="text-[clamp(1.1rem,2vw,1.4rem)] font-medium tracking-[-0.03em] text-fg">
          Feedback could not be loaded
        </h3>
        <p className="max-w-[46ch] text-[12px] leading-relaxed text-muted">
          This is a presentational example of how the workspace behaves when a future feedback
          integration fails. No request was made and no data was lost.
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
