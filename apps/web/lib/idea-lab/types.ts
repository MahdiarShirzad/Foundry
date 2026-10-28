/** Presentation types for the Idea Lab workspace. */

export const IDEA_STATUSES = ["inbox", "exploring", "shortlisted"] as const;

export type IdeaStatusKey = (typeof IDEA_STATUSES)[number];

export type IdeaStatusFilter = "all" | IdeaStatusKey;

export type IdeaNote = {
  id: string;
  author: string;
  initials: string;
  date: string;
  body: string;
};

export type Idea = {
  id: string;
  ref: string;
  name: string;
  headline: string;
  summary: string;
  problem: string;
  audience: string;
  solution: string;
  category: string;
  tags: string[];
  status: IdeaStatusKey;
  capturedAt: string;
  updatedAt: string;
  source: string;
  context: string;
  openQuestions: string[];
  notes: IdeaNote[];
};

/** The draft shape a future capture handler can accept. */
export type IdeaDraft = {
  title: string;
  summary: string;
  problem: string;
  audience: string;
  category: string;
  tags: string[];
  context: string;
  assumption: string;
};

/**
 * Presentation-only preview states. These let the visual states be reviewed
 * without pretending that asynchronous work, filtering or errors are real.
 */
export const LAB_VIEWS = ["collection", "empty", "no-results", "loading", "error"] as const;

export type LabView = (typeof LAB_VIEWS)[number];

export const LAB_VIEW_OPTIONS: { value: LabView; label: string }[] = [
  { value: "collection", label: "Collection" },
  { value: "empty", label: "Empty lab" },
  { value: "no-results", label: "No matches" },
  { value: "loading", label: "Loading" },
  { value: "error", label: "Error" },
];

export const IDEA_STATUS_META: Record<
  IdeaStatusKey,
  { label: string; short: string; marker: string; text: string }
> = {
  inbox: {
    label: "Inbox",
    short: "unsorted",
    marker: "bg-line-2",
    text: "text-faint",
  },
  exploring: {
    label: "Exploring",
    short: "in the lab",
    marker: "bg-accent",
    text: "text-accent",
  },
  shortlisted: {
    label: "Shortlisted",
    short: "ready for market",
    marker: "bg-mint",
    text: "text-fg",
  },
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Fixed "today" so the sample labels never drift between renders. */
export const LAB_TODAY = "2026-10-28";

function parseIso(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month, day };
}

export function formatIdeaDate(iso: string): string {
  const { year, month, day } = parseIso(iso);
  return `${String(day).padStart(2, "0")} ${MONTHS[month - 1]} ${year}`;
}

export function formatIdeaShortDate(iso: string): string {
  const { month, day } = parseIso(iso);
  return `${day} ${MONTHS[month - 1]}`;
}

function dayNumber(iso: string): number {
  const { year, month, day } = parseIso(iso);
  return Date.UTC(year, month - 1, day) / 86_400_000;
}

export function formatUpdated(iso: string): string {
  const delta = Math.max(0, Math.round(dayNumber(LAB_TODAY) - dayNumber(iso)));
  if (delta === 0) return "Today";
  if (delta === 1) return "Yesterday";
  if (delta <= 7) return `${delta}d ago`;
  return formatIdeaShortDate(iso);
}
