"use client";

import { type ReactNode } from "react";

import { StatusBadge } from "@/components/ui/badge";
import { EmptyState, ErrorState } from "@/components/ui/primitives";
import type { EvidenceType, ExperimentStatus, HypothesisStatus } from "@/lib/validation-lab/types";

export function ValidationStatusBadge({
  status,
  className = "",
}: {
  status: HypothesisStatus | ExperimentStatus;
  className?: string;
}) {
  return <StatusBadge status={status} size="xs" className={className} />;
}

export function EvidenceTypeBadge({
  type,
  className = "",
}: {
  type: EvidenceType;
  className?: string;
}) {
  return <StatusBadge status={type} tone="neutral" size="xs" className={className} />;
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
    <EmptyState
      eyebrow="Validation workspace"
      title={title}
      description={description}
      action={action}
      icon="plus"
    />
  );
}

export function ValidationErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorState
      eyebrow="Validation workspace unavailable"
      title="The validation workspace could not be loaded"
      description="This is a presentation-only failure state. No hypothesis, experiment or finding was changed or lost."
      onRetry={onRetry}
      retryLabel="Return to validation workspace"
      footnote="No request was made · this state is part of the interface preview"
    />
  );
}

export function ValidationSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading validation workspace">
      <div className="animate-pulse space-y-2 border-b border-line pb-4">
        <div className="h-2.5 w-32 bg-line" />
        <div className="h-8 w-64 max-w-full bg-line" />
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
