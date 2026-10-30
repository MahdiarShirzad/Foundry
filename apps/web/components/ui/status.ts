/**
 * Foundry semantic status system.
 *
 * One vocabulary for every module. A status that means the same thing in two
 * workspaces must look the same in both. Tones map to the design tokens in
 * `app/globals.css`; do not introduce ad-hoc colours at call sites.
 */

export type Tone =
  | "neutral"
  | "muted"
  | "info"
  | "accent"
  | "success"
  | "warning"
  | "danger";

export type BadgeVariant = "outline" | "solid" | "quiet";

type ToneStyle = {
  /** Foreground text colour. */
  text: string;
  /** Border colour for outlined badges. */
  border: string;
  /** Tinted surface for outlined badges. */
  surface: string;
  /** Dot / marker colour. */
  dot: string;
  /** High-emphasis filled treatment. */
  solid: string;
};

export const TONE_STYLES: Record<Tone, ToneStyle> = {
  neutral: {
    text: "text-fg",
    border: "border-line-2",
    surface: "bg-panel",
    dot: "bg-fg",
    solid: "border-transparent bg-ink text-bg",
  },
  muted: {
    text: "text-faint",
    border: "border-line",
    surface: "bg-transparent",
    dot: "bg-line-2",
    solid: "border-transparent bg-surface-sunken text-muted",
  },
  info: {
    text: "text-info",
    border: "border-info/35",
    surface: "bg-info-tint",
    dot: "bg-info",
    solid: "border-transparent bg-info text-white",
  },
  accent: {
    text: "text-accent",
    border: "border-accent/40",
    surface: "bg-mint-tint/45",
    dot: "bg-accent",
    solid: "border-transparent bg-accent text-white",
  },
  success: {
    text: "text-success",
    border: "border-success/35",
    surface: "bg-success-tint",
    dot: "bg-success",
    solid: "border-transparent bg-success text-white",
  },
  warning: {
    text: "text-warning",
    border: "border-warning/40",
    surface: "bg-warning-tint",
    dot: "bg-warning",
    solid: "border-transparent bg-warning text-white",
  },
  danger: {
    text: "text-danger",
    border: "border-danger/40",
    surface: "bg-danger-tint",
    dot: "bg-danger",
    solid: "border-transparent bg-danger text-white",
  },
};

/**
 * Status names are normalised to lower case. Keep this table as the single
 * source of truth for cross-module meaning:
 *
 *  - muted   → not started / parked / archived / low signal
 *  - info    → new or actively moving work
 *  - accent  → committed or ready for the next step
 *  - success → finished / reviewed / published
 *  - warning → needs attention or is under review
 *  - danger  → blocked, rejected, critical
 */
const STATUS_TONES: Record<string, Tone> = {
  // dormant
  "not started": "muted",
  "not researched": "muted",
  unexamined: "muted",
  proposed: "muted",
  draft: "muted",
  parked: "muted",
  "on hold": "muted",
  deferred: "muted",
  "out of scope": "muted",
  low: "muted",
  archived: "muted",
  "could have": "muted",
  "needs research": "warning",

  // neutral / unclassified
  inbox: "neutral",
  open: "neutral",
  medium: "neutral",
  "not assigned": "neutral",
  "no owner": "neutral",

  // moving
  new: "info",
  "in progress": "info",
  investigating: "info",
  testing: "info",
  "should have": "info",

  // committed / ready
  exploring: "accent",
  shortlisted: "accent",
  planned: "accent",
  "ready to test": "accent",
  "must have": "accent",

  // attention
  high: "warning",
  "under review": "warning",
  "in review": "warning",
  inconclusive: "warning",

  // complete
  ready: "success",
  reviewed: "success",
  completed: "success",
  supported: "success",
  published: "success",
  delivered: "success",
  resolved: "success",

  // blocked / negative
  blocked: "danger",
  critical: "danger",
  rejected: "danger",
  declined: "danger",
  unverified: "danger",
};

export function toneForStatus(status: string): Tone {
  return STATUS_TONES[status.trim().toLowerCase()] ?? "neutral";
}
