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
 * All labels are sentence case sans type at 12–14px. Hierarchy comes from
 * fill versus outline, not from switching typefaces.
 */
const BASE =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-control border font-sans font-medium transition duration-150 ease-out disabled:pointer-events-none disabled:border-line disabled:bg-surface-sunken disabled:text-disabled-fg";

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    "border-mint bg-mint text-ink shadow-[0_1px_0_rgb(14_27_29/0.08),0_10px_22px_-16px_rgb(14_124_108/0.8)] hover:bg-[#45c3ae] hover:shadow-[0_1px_0_rgb(14_27_29/0.08),0_14px_26px_-16px_rgb(14_124_108/0.9)] active:translate-y-px",
  secondary:
    "border-line bg-panel text-fg hover:border-accent/60 hover:bg-mint-tint/25 hover:text-accent active:translate-y-px",
  ghost:
    "border-transparent bg-transparent text-muted hover:bg-mint-tint/35 hover:text-fg active:translate-y-px",
  danger:
    "border-danger/40 bg-danger-tint/50 text-danger hover:bg-danger-tint active:translate-y-px",
};

const SIZE: Record<ButtonSize, string> = {
  xs: "h-7 px-2 text-[12px]",
  sm: "h-8 px-3 text-[12.5px]",
  md: "h-9 px-3.5 text-[13px]",
  lg: "h-10 px-4 text-[14px]",
};

export function buttonClass({
  variant = "secondary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(BASE, VARIANT[variant], SIZE[size], className);
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
      width="12"
      height="12"
      viewBox="0 0 12 12"
      aria-hidden
      className={cn("fill-none stroke-current stroke-[1.6]", className)}
    >
      <path d="M6 1.5v9M1.5 6h9" strokeLinecap="square" />
    </svg>
  );
}
