"use client";

import { type ReactNode } from "react";

import { IdeaSelect } from "@/components/idea-lab/idea-select";
import { StatusBadge } from "@/components/ui/badge";
import { Button, PlusIcon } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";
import {
  DetailSection as SharedDetailSection,
  EmptyState as SharedEmptyState,
  NoResults as SharedNoResults,
  SearchField as SharedSearchField,
  SectionLabel as SharedSectionLabel,
  WorkspaceToolbar as SharedWorkspaceToolbar,
} from "@/components/ui/primitives";
import type { Tone } from "@/components/ui/status";
import {
  EVIDENCE_META,
  OPPORTUNITY_STATUS_META,
  RESEARCH_STATUS_META,
  type EvidenceType,
  type OpportunityStatus,
  type ResearchStatus,
} from "@/lib/market-intelligence/types";

export { EASE } from "@/components/ui/primitives";

/* ------------------------------------------------------------------ badges */

const EVIDENCE_TONE: Record<EvidenceType, Tone> = {
  observation: "neutral",
  hypothesis: "accent",
  unverified: "danger",
  "needs-research": "warning",
  reviewed: "success",
};

const RESEARCH_TONE: Record<ResearchStatus, Tone> = {
  "not-researched": "muted",
  "in-progress": "info",
  reviewed: "success",
};

const OPPORTUNITY_TONE: Record<OpportunityStatus, Tone> = {
  open: "neutral",
  investigating: "info",
  parked: "muted",
};

export function EvidenceBadge({
  type,
  className = "",
}: {
  type: EvidenceType;
  className?: string;
}) {
  return (
    <StatusBadge
      status={EVIDENCE_META[type].label}
      tone={EVIDENCE_TONE[type]}
      size="xs"
      className={className}
    />
  );
}

export function ResearchStatusBadge({
  status,
  className = "",
}: {
  status: ResearchStatus;
  className?: string;
}) {
  return (
    <StatusBadge
      status={RESEARCH_STATUS_META[status].label}
      tone={RESEARCH_TONE[status]}
      variant="quiet"
      size="xs"
      className={className}
    />
  );
}

export function OpportunityStatusBadge({
  status,
  className = "",
}: {
  status: OpportunityStatus;
  className?: string;
}) {
  return (
    <StatusBadge
      status={OPPORTUNITY_STATUS_META[status].label}
      tone={OPPORTUNITY_TONE[status]}
      size="xs"
      className={className}
    />
  );
}

/* ----------------------------------------------------------------- toolbar */

export function SearchField(props: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}) {
  return <SharedSearchField {...props} />;
}

export function WorkspaceToolbar({
  count,
  query,
  onQueryChange,
  searchLabel,
  searchPlaceholder,
  active,
  onReset,
  children,
}: {
  count: number;
  query: string;
  onQueryChange: (value: string) => void;
  searchLabel: string;
  searchPlaceholder: string;
  active: boolean;
  onReset: () => void;
  children?: ReactNode;
}) {
  return (
    <SharedWorkspaceToolbar
      count={count}
      query={query}
      onQueryChange={onQueryChange}
      searchLabel={searchLabel}
      searchPlaceholder={searchPlaceholder}
      active={active}
      onReset={onReset}
    >
      {children}
    </SharedWorkspaceToolbar>
  );
}

export function FilterSelect({
  label,
  value,
  options,
  onChange,
  className = "w-[9.5rem]",
}: {
  label: string;
  value: string;
  options: readonly { value: string; label: string; shortLabel?: string }[];
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <IdeaSelect
      label={label}
      value={value}
      options={options}
      onChange={onChange}
      align="right"
      className={cn("shrink-0", className)}
    />
  );
}

/* ------------------------------------------------------------------ panels */

export function DetailBackBar({
  context,
  onBack,
}: {
  context: string;
  onBack: () => void;
}) {
  return (
    <div className="sticky top-14 z-10 flex items-center gap-3 border-b border-line bg-panel/95 px-4 py-2.5 backdrop-blur xl:hidden">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 border border-line px-2 font-mono text-[10px] uppercase tracking-[0.12em] text-fg transition-colors hover:border-accent hover:text-accent"
      >
        <span aria-hidden>←</span>
        Back
      </button>
      <span className="min-w-0 truncate font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
        {context}
      </span>
    </div>
  );
}

export function PanelHeader({
  eyebrow,
  title,
  meta,
  action,
}: {
  eyebrow?: string;
  title: string;
  meta?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line bg-panel px-4 py-3">
      <div className="flex min-w-0 items-baseline gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
          {title}
        </span>
        {meta ? (
          <span className="truncate font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
            {meta}
          </span>
        ) : null}
      </div>
      {action ?? (
        eyebrow ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
            {eyebrow}
          </span>
        ) : null
      )}
    </div>
  );
}

/* ------------------------------------------------------------- empty states */

export function WorkspaceEmpty({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  icon = "plus",
}: {
  eyebrow: string;
  title: string;
  description: string;
  primary?: { label: string; onClick: () => void };
  secondary?: { label: string; onClick: () => void };
  icon?: "plus" | "search" | "note" | "users";
}) {
  return (
    <SharedEmptyState
      eyebrow={eyebrow}
      title={title}
      description={description}
      primary={primary}
      secondary={secondary}
      icon={icon}
    />
  );
}

export function NoResults({
  query,
  onClear,
  noun,
}: {
  query: string;
  onClear: () => void;
  noun: string;
}) {
  return (
    <SharedNoResults
      query={query}
      onClear={onClear}
      noun={noun}
      description="Try another term, widen the filters, or return to the full sample set."
    />
  );
}

export function DetailPlaceholder({
  eyebrow,
  title,
  description,
  prompts,
}: {
  eyebrow: string;
  title: string;
  description: string;
  prompts: [string, string, string][];
}) {
  return (
    <div className="flex min-h-[24rem] items-center justify-center bg-panel px-6 py-12 sm:px-9">
      <div className="w-full max-w-[32rem]">
        <p className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
          <span aria-hidden className="size-1.5 bg-mint" />
          {eyebrow}
        </p>
        <h2 className="mt-3 text-[clamp(1.4rem,2.4vw,1.85rem)] font-medium leading-[1.1] tracking-[-0.03em] text-fg">
          {title}
        </h2>
        <p className="mt-2.5 max-w-[42ch] text-[13px] leading-relaxed text-muted">{description}</p>

        <ol className="mt-6 border-t border-line">
          {prompts.map(([number, label, body]) => (
            <li
              key={number}
              className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-3 border-b border-line py-3"
            >
              <span className="font-mono text-[10px] tracking-[0.12em] text-accent">{number}</span>
              <div>
                <p className="text-[12px] font-medium text-fg">{label}</p>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ pieces */

export function SectionLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <SharedSectionLabel className={className}>{children}</SharedSectionLabel>;
}

export function DetailSection({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <SharedDetailSection label={label} className={className}>
      {children}
    </SharedDetailSection>
  );
}

export function BulletList({
  items,
  marker = "bg-line-2",
}: {
  items: string[];
  marker?: string;
}) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={`${index}-${item.slice(0, 12)}`}
          className="grid grid-cols-[0.55rem_minmax(0,1fr)] gap-2.5 text-[12px] leading-relaxed text-muted"
        >
          <span aria-hidden className={cn("mt-[0.5rem] size-1", marker)} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function QuestionList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-2.5">
      {items.map((item, index) => (
        <li
          key={`${index}-${item.slice(0, 12)}`}
          className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-2 text-[12px] leading-relaxed text-muted"
        >
          <span className="font-mono text-[10px] leading-[1.7] tracking-[0.1em] text-accent">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

export function SampleNotice({ className = "" }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-[0.1em] text-faint",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 shrink-0 bg-accent" />
      Sample research · illustrative content only
    </p>
  );
}

export function AddButton({
  label,
  onClick,
  tone = "primary",
  className = "",
}: {
  label: string;
  onClick: () => void;
  tone?: "primary" | "secondary" | "quiet";
  className?: string;
}) {
  if (tone === "primary") {
    return (
      <Button variant="primary" size="sm" onClick={onClick} className={className}>
        <PlusIcon />
        {label}
      </Button>
    );
  }

  if (tone === "secondary") {
    return (
      <Button variant="secondary" size="sm" onClick={onClick} className={className}>
        <PlusIcon />
        {label}
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="xs" onClick={onClick} className={className}>
      <PlusIcon />
      {label}
    </Button>
  );
}
