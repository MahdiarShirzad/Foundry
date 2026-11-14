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
  /** Free text; empty means the idea is shown as "Uncategorised". */
  category?: string | null;
  tags: string[];
  status: IdeaStatusKey;
  capturedAt: string;
  updatedAt: string;
  source: string;
  context: string;
  openQuestions: string[];
  notes: IdeaNote[];
};

/* ------------------------------------------------------------ backend types */

/** Status values the API stores and returns (see the Prisma `IdeaStatus`). */
export const IDEA_API_STATUSES = ["INBOX", "EXPLORING", "SHORTLISTED"] as const;

export type IdeaApiStatus = (typeof IDEA_API_STATUSES)[number];

/** Idea note as returned by the API. */
export type ApiIdeaNote = {
  id: string;
  ideaId: string;
  author: string;
  initials: string;
  /** Full ISO timestamp. */
  date: string;
  body: string;
};

/** Idea entity returned by `GET /ideas` and `GET /ideas/:id`. */
export type ApiIdea = {
  id: string;
  workspaceId: string;
  productId: string;
  ref: string;
  name: string;
  headline: string | null;
  summary: string | null;
  problem: string | null;
  audience: string | null;
  category: string | null;
  tags: string[];
  status: IdeaApiStatus;
  source: string | null;
  context: string | null;
  openQuestions: string[];
  /** Full ISO timestamps. */
  capturedAt: string;
  updatedAt: string;
  notes?: ApiIdeaNote[];
};

/** Body accepted by `POST /ideas` (mirrors the API `CreateIdeaDto`). */
export type CreateIdeaInput = {
  workspaceId: string;
  productId: string;
  name: string;
  headline?: string;
  summary?: string;
  problem?: string;
  audience?: string;
  solution?: string;
  category?: string | null;
  tags?: string[];
  status?: IdeaApiStatus;
  source?: string;
  context?: string;
  openQuestions?: string[];
};

/** Body accepted by `PATCH /ideas/:id` (mirrors the API `UpdateIdeaDto`). */
export type UpdateIdeaInput = Partial<CreateIdeaInput>;

/** Body accepted by `POST /ideas/:id/notes`. */
export type CreateIdeaNoteInput = {
  author: string;
  initials: string;
  body: string;
};

/** The draft shape a future capture handler can accept. */
export type IdeaDraft = {
  title: string;
  summary: string;
  problem: string;
  audience: string;
  /** Empty or omitted stays uncategorised. */
  category?: string | null;
  tags: string[];
  context: string;
  assumption: string;
};

/** States the Idea Lab workspace can render while loading real data. */
export const LAB_VIEWS = [
  "collection",
  "empty",
  "no-results",
  "loading",
  "error",
] as const;

export type LabView = (typeof LAB_VIEWS)[number];

/** Sorting options used by the collection toolbar. */
export const IDEA_SORT_OPTIONS = [
  { value: "updated", label: "Last updated", shortLabel: "Updated" },
  { value: "captured", label: "Newest first", shortLabel: "Newest" },
  { value: "alpha", label: "A–Z" },
  { value: "status", label: "Status" },
];

/** Status filter options used by the collection toolbar. */
export const IDEA_STATUS_FILTERS: {
  value: IdeaStatusFilter;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "inbox", label: "Inbox" },
  { value: "exploring", label: "Exploring" },
  { value: "shortlisted", label: "Shortlisted" },
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
