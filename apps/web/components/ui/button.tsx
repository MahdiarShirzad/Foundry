import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "./cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

/**
 * Foundry button hierarchy:
 *
 *  - primary   → the one brand action in a view (mint fill, dark ink label)
 *  - secondary → outlined supporting action
 *  - ghost     → low-emphasis navigation / inline action
 *  - danger    → destructive or blocking action
 *
 * Primary actions use sentence-case sans type; supporting actions use the
 * mono label voice. That difference is deliberate: it keeps hierarchy legible
 * without adding more colours.
 */
const BASE =
  "inline-flex shrink-0 items-center justify-center gap-2 border transition duration-150 disabled:pointer-events-none disabled:border-line disabled:bg-surface-sunken disabled:text-disabled-fg";

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-mint font-sans font-medium text-ink hover:brightness-95 active:translate-y-px",
  secondary:
    "border-line-2 bg-panel font-mono uppercase text-fg hover:border-accent hover:text-accent active:translate-y-px",
  ghost:
    "border-transparent bg-transparent font-mono uppercase text-muted hover:bg-mint-tint/40 hover:text-fg active:translate-y-px",
  danger:
    "border-danger/45 bg-danger-tint/50 font-mono uppercase text-danger hover:bg-danger-tint active:translate-y-px",
};

const SIZE: Record<ButtonSize, string> = {
  xs: "h-7 px-2 text-[9.5px] tracking-[0.12em]",
  sm: "h-8 px-2.5 text-[10px] tracking-[0.13em]",
  md: "h-9 px-3.5 text-[10.5px] tracking-[0.14em]",
  lg: "h-10 px-4 text-[12.5px] tracking-[0.02em]",
};

/** Primary buttons use sentence-case type, so they need a slightly larger size. */
function sizeClass(variant: ButtonVariant, size: ButtonSize) {
  if (variant === "primary") {
    if (size === "lg") return "h-10 px-4 text-[13px]";
    if (size === "md") return "h-9 px-3.5 text-[12.5px]";
    if (size === "sm") return "h-8 px-3 text-[12px]";
    return "h-7 px-2.5 text-[11.5px]";
  }
  return SIZE[size];
}

export function buttonClass({
  variant = "secondary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(BASE, VARIANT[variant], sizeClass(variant, size), className);
}

export function Button({
  variant = "secondary",
  size = "md",
  className,
  children,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button type={type} className={buttonClass({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "secondary",
  size = "md",
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}) {
  return (
    <a className={buttonClass({ variant, size, className })} {...props}>
      {children}
    </a>
  );
}

/** Plus glyph shared by "add" actions, sized to the surrounding label. */
export function PlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 12 12"
      aria-hidden
      className={cn("fill-none stroke-current stroke-[1.6]", className)}
    >
      <path d="M6 1.5v9M1.5 6h9" strokeLinecap="square" />
    </svg>
  );
}
