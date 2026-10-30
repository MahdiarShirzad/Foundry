"use client";

import { type ReactNode } from "react";

import { cn } from "@/components/ui/cn";
import {
  Dialog as SharedDialog,
  EmptyState,
  Field as SharedField,
  Select as SharedSelect,
  TextArea as SharedTextArea,
  TextInput as SharedTextInput,
} from "@/components/ui/primitives";

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

/* ------------------------------------------------------- segmented control --- */

/** Small label switch used for metric, segment and view choices. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  size = "md",
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  size?: "sm" | "md";
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-wrap items-center border border-line bg-panel p-px"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={cn(
              "font-mono uppercase tracking-[0.12em] transition-colors",
              size === "sm" ? "px-2 py-1 text-[10px]" : "px-2.5 py-1.5 text-[10px]",
              active ? "bg-mint-tint text-accent" : "text-faint hover:text-fg",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------ empty state --- */

export function AnalyticsEmptyState({
  title,
  description,
  action,
  compact = false,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <EmptyState
      eyebrow="No sample data"
      title={title}
      description={description}
      action={action}
      icon="search"
      compact={compact}
    />
  );
}

/* ----------------------------------------------------------------- dialog --- */

export function AnalyticsDialog(props: React.ComponentProps<typeof SharedDialog>) {
  return <SharedDialog {...props} />;
}
