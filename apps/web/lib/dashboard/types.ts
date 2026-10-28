/**
 * Shapes for the Foundry dashboard.
 *
 * Every panel reads from one `DashboardSnapshot`; no component keeps its own
 * copy of the figures. The snapshot is supplied by the presentation data layer
 * (`lib/dashboard/demo.ts`) until the API can provide it.
 */

/** One ISO week of cycle activity, starting Monday. */
export type Week = {
  /** ISO date of the Monday that starts the week. */
  start: string;
  /** Ideas captured in the Idea Lab. */
  captured: number;
  /** Ideas that passed the Validation Lab gate. */
  validated: number;
  /** Ideas that reached a launch. */
  launched: number;
  /** Evidence logged during the week, by kind. */
  interviews: number;
  experiments: number;
  feedback: number;
  surveys: number;
};

export type Initiative = {
  id: string;
  name: string;
  /** Stage id from the eight-module model: "01" … "08". */
  stageId: string;
  owner: string;
  /** ISO date the initiative entered its current stage. */
  stageSince: string;
  /** ISO date of the next gate review, or null when none is scheduled. */
  nextGate: string | null;
  openFeedback: number;
  /** Why the initiative is stalled, when it is. */
  blocker: string | null;
};

export type GateOutcome = "go" | "pivot" | "stop";

export type GateDecision = {
  id: string;
  date: string;
  initiative: string;
  /** The stage whose gate was reviewed. */
  gate: string;
  outcome: GateOutcome;
  note?: string;
};

export type Workspace = {
  name: string;
  owner: string;
  /** Reference date for every "days since" calculation. */
  asOf: string;
};

export type DashboardSnapshot = {
  workspace: Workspace;
  weeks: Week[];
  initiatives: Initiative[];
  decisions: GateDecision[];
};

/* ------------------------------------------------------------------ formats */

export function formatInt(value: number): string {
  return value.toLocaleString("en-US");
}

export function formatPct(value: number, digits = 0): string {
  return `${value.toFixed(digits)}%`;
}

export function parseISO(value: string): number {
  return Date.parse(`${value}T00:00:00Z`);
}

/** Whole days between two ISO dates, independent of the machine timezone. */
export function daysBetween(from: string, to: string): number {
  return Math.round((parseISO(to) - parseISO(from)) / 86_400_000);
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

/** "Oct 19" — identical on server and client, so no hydration drift. */
export function formatShortDate(value: string): string {
  return dateFormatter.format(new Date(parseISO(value)));
}
