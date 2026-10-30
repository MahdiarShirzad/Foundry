"use client";

import { type ReactNode } from "react";

import { IdeaSelect } from "@/components/idea-lab/idea-select";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";
import {
  DetailBackBar as SharedDetailBackBar,
  DetailSection as SharedDetailSection,
  Dialog as SharedDialog,
  Field as SharedField,
  InlineNotice,
  NoResults as SharedNoResults,
  Select as SharedSelect,
  TextArea as SharedTextArea,
  TextInput as SharedTextInput,
  WorkspaceToolbar as SharedWorkspaceToolbar,
} from "@/components/ui/primitives";

export { EASE } from "@/components/ui/primitives";

/* --------------------------------------------------------- form controls --- */

export function Field(props: React.ComponentProps<typeof SharedField>) {
  return <SharedField {...props} />;
}

export function TextInput(props: React.ComponentProps<typeof SharedTextInput>) {
  return <SharedTextInput {...props} />;
}

export function TextArea(props: React.ComponentProps<typeof SharedTextArea>) {
  return <SharedTextArea {...props} />;
}

export function Select(props: React.ComponentProps<typeof SharedSelect>) {
  return <SharedSelect {...props} />;
}

/* ---------------------------------------------------------------- toolbar --- */

export function PanelHeader({
  title,
  meta,
  action,
}: {
  title: string;
  meta?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
      <div className="min-w-0">
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
          <span aria-hidden className="size-1 bg-mint" />
          {title}
        </p>
        {meta ? <p className="mt-1 text-[11.5px] text-muted">{meta}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button variant="secondary" size="xs" onClick={onClick}>
      {label}
    </Button>
  );
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
      countLabel="shown"
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
      description="Try another term, widen the filters, or return to the full set."
    />
  );
}

export function DetailBackBar({ context, onBack }: { context: string; onBack: () => void }) {
  return <SharedDetailBackBar context={context} onBack={onBack} />;
}

export function DetailSection({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <SharedDetailSection label={label} hint={hint} className={className}>
      {children}
    </SharedDetailSection>
  );
}

export function PresentationalDialog(props: React.ComponentProps<typeof SharedDialog>) {
  return <SharedDialog {...props} />;
}

export function ConfirmNotice({ children }: { children: ReactNode }) {
  return <InlineNotice tone="info">{children}</InlineNotice>;
}
