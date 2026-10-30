"use client";

import { type ReactNode } from "react";

import { StatusBadge } from "@/components/ui/badge";
import { EmptyState, ErrorState } from "@/components/ui/primitives";
import type { FeaturePriority, FeatureScope, FeatureStatus } from "@/lib/mvp-studio/types";

export function FeaturePriorityBadge({
  priority,
  className = "",
}: {
  priority: FeaturePriority;
  className?: string;
}) {
  return <StatusBadge status={priority} size="xs" className={className} />;
}

export function FeatureScopeBadge({
  scope,
  className = "",
}: {
  scope: FeatureScope;
  className?: string;
}) {
  return <StatusBadge status={scope} size="xs" className={className} />;
}

export function FeatureStatusBadge({
  status,
  className = "",
}: {
  status: FeatureStatus;
  className?: string;
}) {
  return <StatusBadge status={status} size="xs" className={className} />;
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
    <EmptyState
      eyebrow="No features yet"
      title={title}
      description={description}
      action={action}
      icon="plus"
    />
  );
}

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
            <div key={i} className="h-6 w-24 animate-pulse bg-line/70" />
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

export function MVPStudioErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorState
      eyebrow="MVP Studio unavailable"
      title="The MVP workspace could not be loaded"
      description="This is a presentation-only failure state. No feature, scope decision or specification was changed or lost."
      onRetry={onRetry}
      retryLabel="Return to MVP workspace"
      footnote="No request was made · this state is part of the interface preview"
    />
  );
}
