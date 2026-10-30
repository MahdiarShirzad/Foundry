import { cn } from "./cn";
import { TONE_STYLES, toneForStatus, type BadgeVariant, type Tone } from "./status";

/**
 * The only status badge used across Foundry workspaces.
 *
 * A square marker carries the tone alongside the label so meaning never
 * depends on colour alone. Sizes stay close to the type scale so badges read
 * as labels, not decoration.
 */
export function StatusBadge({
  status,
  tone,
  variant = "outline",
  size = "sm",
  dot = true,
  className = "",
}: {
  status: string;
  tone?: Tone;
  variant?: BadgeVariant;
  size?: "xs" | "sm";
  dot?: boolean;
  className?: string;
}) {
  const style = TONE_STYLES[tone ?? toneForStatus(status)];
  const surface =
    variant === "solid"
      ? style.solid
      : variant === "quiet"
        ? "border-transparent bg-transparent"
        : `${style.border} ${style.surface}`;
  const text = variant === "solid" ? "" : style.text;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 border font-mono uppercase leading-none",
        size === "xs"
          ? "px-1.5 py-[3px] text-[9.5px] tracking-[0.12em]"
          : "px-2 py-1 text-[10px] tracking-[0.12em]",
        surface,
        text,
        className,
      )}
    >
      {dot ? <span aria-hidden className={cn("size-1 shrink-0", variant === "solid" ? "bg-current" : style.dot)} /> : null}
      {status}
    </span>
  );
}

/** Small standalone tone marker for lists and legends. */
export function StatusDot({
  tone = "neutral",
  className = "",
}: {
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("inline-block size-1.5 shrink-0", TONE_STYLES[tone].dot, className)}
    />
  );
}
