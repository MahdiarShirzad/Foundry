import { cn } from "./cn";
import { TONE_STYLES, toneForStatus, type BadgeVariant, type Tone } from "./status";

/**
 * The only status pill used across Foundry workspaces.
 *
 * A leading dot carries the tone alongside the label, so meaning never depends
 * on colour alone. Sentence case, 11.5–12px: a label, not a stamp.
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
        "inline-flex shrink-0 items-center gap-1.5 rounded-pill border font-sans font-medium leading-none",
        size === "xs" ? "px-2 py-px text-[11px]" : "px-2.5 py-1 text-[11.5px]",
        surface,
        text,
        className,
      )}
    >
      {dot ? (
        <span
          aria-hidden
          className={cn("size-1.5 shrink-0 rounded-full", variant === "solid" ? "bg-current" : style.dot)}
        />
      ) : null}
      {status}
    </span>
  );
}

/** StatusPill alias — the shared vocabulary name for the same component. */
export const StatusPill = StatusBadge;

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
      className={cn("inline-block size-1.5 shrink-0 rounded-full", TONE_STYLES[tone].dot, className)}
    />
  );
}
