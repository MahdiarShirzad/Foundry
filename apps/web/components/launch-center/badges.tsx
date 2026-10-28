"use client";

import { type ReactNode } from "react";

import type { LaunchTaskStatus, LaunchAssetStatus } from "@/lib/launch-center/types";

export function LaunchStatusBadge({
  status,
  className = "",
}: {
  status: LaunchTaskStatus | LaunchAssetStatus;
  className?: string;
}) {
  const styles: Record<string, string> = {
    "Not Started": "border-line-2 text-faint",
    "In Progress": "border-mint/70 text-fg",
    Completed: "border-mint text-fg",
    Blocked: "border-line-2 text-faint",
    Draft: "border-line-2 text-faint",
    "In Review": "border-accent/60 text-accent",
    Ready: "border-mint text-fg",
    Published: "border-mint text-fg",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 border px-2 py-[3px] font-mono text-[8px] uppercase leading-none tracking-[0.13em] ${styles[status] ?? "border-line-2 text-faint"} ${className}`}>
      <span aria-hidden className="size-1 bg-current opacity-70" />
      {status}
    </span>
  );
}

export function LaunchPhaseBadge({
  phase,
  className = "",
}: {
  phase: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 border border-line-2 px-2 py-[3px] font-mono text-[8px] uppercase leading-none tracking-[0.13em] text-faint ${className}`}>
      <span aria-hidden className="size-1 bg-accent" />
      {phase}
    </span>
  );
}

export function LaunchCenterEmptyState({
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

export function LaunchCenterSkeleton() {
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
