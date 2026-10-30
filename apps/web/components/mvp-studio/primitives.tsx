"use client";

import { type ReactNode } from "react";

import {
  Dialog as SharedDialog,
  FieldLabel as SharedFieldLabel,
  Panel,
} from "@/components/ui/primitives";

/** Shared panel chrome so every workspace section reads as one system. */
export function SectionPanel({
  title,
  subtitle,
  action,
  footer,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Panel title={title} description={subtitle} action={action} footer={footer}>
      {children}
    </Panel>
  );
}

/** Shared field label style for dialogs and editable spec fields. */
export function FieldLabel({
  htmlFor,
  children,
  hint,
}: {
  htmlFor?: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <SharedFieldLabel htmlFor={htmlFor} hint={hint}>
      {children}
    </SharedFieldLabel>
  );
}

export function PresentationalDialog(props: React.ComponentProps<typeof SharedDialog>) {
  return <SharedDialog {...props} />;
}
