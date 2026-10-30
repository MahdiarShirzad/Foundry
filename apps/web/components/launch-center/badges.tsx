"use client";

import { type ReactNode } from "react";

import { StatusBadge } from "@/components/ui/badge";
import { EmptyState, ErrorState } from "@/components/ui/primitives";
import type { LaunchTaskStatus, LaunchAssetStatus } from "@/lib/launch-center/types";

export function LaunchStatusBadge({
  status,
  className = "",
}: {
  status: LaunchTaskStatus | LaunchAssetStatus;
  className?: string;
}) {
  return <StatusBadge status={status} size="xs" className={className} />;
}

export function LaunchPhaseBadge({
  phase,
  className = "",
}: {
  phase: string;
  className?: string;
}) {
  return (
    <StatusBadge
      status={phase}
      tone="neutral"
      variant="quiet"
      size="xs"
      className={className}
    />
  );
}

export function LaunchCenterEmptyState({
  title,
  description,
  action,
  eyebrow = "Nothing here yet",
  icon = "flag",
}: {
  title: string;
  description: string;
  action?: ReactNode;
  eyebrow?: string;
  icon?: "plus" | "search" | "note" | "users" | "calendar" | "check" | "flag";
}) {
  return (
    <EmptyState
      eyebrow={eyebrow}
      title={title}
      description={description}
      action={action}
      icon={icon}
    />
  );
}

export function LaunchCenterErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorState
      eyebrow="Launch workspace unavailable"
      title="The launch plan could not be loaded"
      description="This is a presentation-only failure state for the launch workspace. No task, asset, channel or checklist change was lost."
      onRetry={onRetry}
      retryLabel="Return to launch plan"
      footnote="No request was made · this state is part of the interface preview"
    />
  );
}

export function LaunchCenterSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading launch workspace">
      <div className="border border-line bg-panel">
        <div className="animate-pulse space-y-2 border-b border-line px-4 py-3">
          <div className="h-2.5 w-32 bg-line" />
          <div className="h-3 w-64 max-w-full bg-line" />
        </div>
        <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3 bg-panel px-4 py-4">
              <div className="h-2 w-24 animate-pulse bg-line" />
              <div className="h-6 w-16 animate-pulse bg-line" />
              <div className="h-2 w-28 animate-pulse bg-line/70" />
            </div>
          ))}
        </div>
      </div>
      <div className="h-12 animate-pulse border border-line bg-panel" />
      <div className="grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3 bg-panel p-4">
            <div className="h-2.5 w-24 animate-pulse bg-line" />
            <div className="h-12 animate-pulse bg-line/70" />
            <div className="h-12 animate-pulse bg-line/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
