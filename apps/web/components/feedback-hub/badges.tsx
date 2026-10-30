"use client";

import { type ReactNode } from "react";

import { StatusBadge } from "@/components/ui/badge";
import { EmptyState, ErrorState } from "@/components/ui/primitives";
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
  return <StatusBadge status={priority} size="xs" className={className} />;
}

export function FeedbackStatusBadge({
  status,
  className = "",
}: {
  status: FeedbackStatus;
  className?: string;
}) {
  return <StatusBadge status={status} size="xs" className={className} />;
}

export function FeedbackRequestStatusBadge({
  status,
  className = "",
}: {
  status: FeatureRequestStatus;
  className?: string;
}) {
  return <StatusBadge status={status} size="xs" className={className} />;
}

export function FeedbackCategoryBadge({
  category,
  className = "",
}: {
  category: FeedbackCategory;
  className?: string;
}) {
  return <StatusBadge status={category} tone="neutral" size="xs" className={className} />;
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
    <EmptyState
      eyebrow="No feedback yet"
      title={title}
      description={description}
      action={action}
      icon="users"
    />
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
    <ErrorState
      eyebrow="Feedback unavailable"
      title="Feedback could not be loaded"
      description="This is a presentation-only failure state for the feedback workspace. No feedback record, theme or request was changed or lost."
      onRetry={onRetry}
      retryLabel="Return to feedback workspace"
      footnote="No request was made · this state is part of the interface preview"
    />
  );
}
