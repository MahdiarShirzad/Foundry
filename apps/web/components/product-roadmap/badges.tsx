"use client";

import { type ReactNode } from "react";

import { StatusBadge } from "@/components/ui/badge";
import { EmptyState, ErrorState } from "@/components/ui/primitives";
import type { RoadmapPriority, RoadmapStatus } from "@/lib/product-roadmap/types";

export function RoadmapPriorityBadge({
  priority,
  className = "",
}: {
  priority: RoadmapPriority;
  className?: string;
}) {
  return <StatusBadge status={priority} size="xs" className={className} />;
}

export function RoadmapStatusBadge({
  status,
  className = "",
}: {
  status: RoadmapStatus;
  className?: string;
}) {
  return <StatusBadge status={status} size="xs" className={className} />;
}

export function ProductRoadmapEmptyState({
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
      eyebrow="Roadmap is clear"
      title={title}
      description={description}
      action={action}
      icon="flag"
    />
  );
}

export function ProductRoadmapErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorState
      eyebrow="Roadmap unavailable"
      title="The roadmap could not be loaded"
      description="This is a presentation-only failure state. No initiative, milestone, release or planning note was changed or lost."
      onRetry={onRetry}
      retryLabel="Return to roadmap"
      footnote="No request was made · this state is part of the interface preview"
    />
  );
}

export function ProductRoadmapSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading roadmap">
      <div className="animate-pulse space-y-2 border-b border-line pb-4">
        <div className="h-2.5 w-32 bg-line" />
        <div className="h-8 w-64 max-w-full bg-line" />
        <div className="h-2.5 w-96 max-w-full bg-line/70" />
      </div>
      <div className="grid gap-px border border-line bg-line sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
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
