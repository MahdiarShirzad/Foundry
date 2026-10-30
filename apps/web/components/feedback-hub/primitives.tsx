"use client";

import { type ReactNode } from "react";

import {
  Dialog as SharedDialog,
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

/** Small mono caption used above grouped content inside panels. */
export function PanelLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-faint">{children}</p>
  );
}

/** User-submitted content — kept visually distinct from team notes. */
export function UserContentBlock({
  label = "What the user said",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="border border-line bg-bg">
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <span aria-hidden className="size-1.5 bg-mint" />
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{label}</p>
      </div>
      <div className="px-3 py-3 text-[12.5px] leading-relaxed text-fg">{children}</div>
    </div>
  );
}

/** Internal team note — never presented as customer content. */
export function InternalNoteBlock({
  label = "Internal note · team only",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="border border-dashed border-accent/50 bg-mint-tint/30">
      <div className="flex items-center gap-2 border-b border-dashed border-accent/40 px-3 py-2">
        <span aria-hidden className="size-1.5 bg-accent" />
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent">{label}</p>
      </div>
      <div className="px-3 py-3 text-[12.5px] leading-relaxed text-muted">{children}</div>
    </div>
  );
}

export function PresentationalDialog(props: React.ComponentProps<typeof SharedDialog>) {
  return <SharedDialog {...props} />;
}
