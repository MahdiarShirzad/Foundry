/**
 * Presentation types for the Market Intelligence workspace.
 *
 * Everything here describes sample research for the interface. There is no
 * market-size model, scoring, ranking or verification layer behind these types.
 */

export const EVIDENCE_TYPES = [
  "observation",
  "hypothesis",
  "unverified",
  "needs-research",
  "reviewed",
] as const;

export type EvidenceType = (typeof EVIDENCE_TYPES)[number];

export const EVIDENCE_META: Record<
  EvidenceType,
  { label: string; short: string; description: string; marker: string; bar: string; chip: string }
> = {
  observation: {
    label: "Observation",
    short: "Observed",
    description: "Something seen directly in the sample notes, not yet tested.",
    marker: "bg-fg",
    bar: "bg-fg",
    chip: "border-line-2 bg-panel text-fg",
  },
  hypothesis: {
    label: "Hypothesis",
    short: "Hypothesis",
    description: "A working interpretation that still needs a deliberate test.",
    marker: "bg-accent",
    bar: "bg-accent",
    chip: "border-accent/40 bg-mint-tint/45 text-accent",
  },
  unverified: {
    label: "Unverified",
    short: "Unverified",
    description: "Suggested by the sample material, but not checked with anyone.",
    marker: "bg-danger",
    bar: "bg-danger",
    chip: "border-danger/35 bg-danger-tint text-danger",
  },
  "needs-research": {
    label: "Needs research",
    short: "Needs work",
    description: "A gap worth investigating before it shapes a product decision.",
    marker: "bg-line-2",
    bar: "bg-line-2",
    chip: "border-dashed border-line-2 bg-transparent text-faint",
  },
  reviewed: {
    label: "Reviewed",
    short: "Reviewed",
    description: "Read and discussed in this sample workspace. Not externally verified.",
    marker: "bg-ink",
    bar: "bg-mint",
    chip: "border-transparent bg-mint text-ink",
  },
};

export const RESEARCH_STATUSES = ["not-researched", "in-progress", "reviewed"] as const;

export type ResearchStatus = (typeof RESEARCH_STATUSES)[number];

export const RESEARCH_STATUS_META: Record<
  ResearchStatus,
  { label: string; marker: string; text: string }
> = {
  "not-researched": {
    label: "Not researched",
    marker: "bg-line-2",
    text: "text-faint",
  },
  "in-progress": {
    label: "In progress",
    marker: "bg-accent",
    text: "text-accent",
  },
  reviewed: {
    label: "Reviewed",
    marker: "bg-mint",
    text: "text-fg",
  },
};

export const OPPORTUNITY_STATUSES = ["open", "investigating", "parked"] as const;

export type OpportunityStatus = (typeof OPPORTUNITY_STATUSES)[number];

export const OPPORTUNITY_STATUS_META: Record<
  OpportunityStatus,
  { label: string; description: string; marker: string }
> = {
  open: {
    label: "Open",
    description: "Documented, with no active investigation yet.",
    marker: "bg-line-2",
  },
  investigating: {
    label: "Investigating",
    description: "Actively being tested against the sample research.",
    marker: "bg-accent",
  },
  parked: {
    label: "Parked",
    description: "Set aside until stronger evidence appears.",
    marker: "bg-line/80",
  },
};

export type RelatedType = "competitor" | "segment" | "opportunity" | "idea";

export type Competitor = {
  id: string;
  name: string;
  category: string;
  /** Reserved `.example` domain — illustrative only, never fetched. */
  website: string;
  description: string;
  audience: string;
  pricing: string;
  strengths: string[];
  weaknesses: string[];
  differentiation: string;
  observations: string[];
  questions: string[];
  status: ResearchStatus;
  evidence: EvidenceType;
  updatedAt: string;
};

export type Segment = {
  id: string;
  name: string;
  description: string;
  customerType: string;
  painPoints: string[];
  alternatives: string[];
  needs: string[];
  questions: string[];
  status: ResearchStatus;
  evidence: EvidenceType;
  updatedAt: string;
};

export type Opportunity = {
  id: string;
  title: string;
  description: string;
  segmentId: string;
  problem: string;
  alternatives: string;
  differentiation: string;
  /** A research note in the same idea's sample set. */
  noteId: string;
  questions: string[];
  status: OpportunityStatus;
  evidence: EvidenceType;
  updatedAt: string;
};

export type ResearchNote = {
  id: string;
  title: string;
  excerpt: string;
  observations: string;
  interpretation: string;
  followUp: string[];
  source: string;
  date: string;
  relatedType: RelatedType;
  relatedId: string;
  relatedLabel: string;
  evidence: EvidenceType;
};

export type MarketIdea = {
  id: string;
  ref: string;
  name: string;
  headline: string;
  summary: string;
  /** The market belief being investigated — not a forecast. */
  hypothesis: string;
  targetAudience: string;
  problem: string;
  competitiveSummary: string;
  updatedAt: string;
  openQuestions: string[];
  competitors: Competitor[];
  segments: Segment[];
  opportunities: Opportunity[];
  notes: ResearchNote[];
};

/** Presentation-only preview states for the workspace. */
export const MARKET_VIEWS = [
  "workspace",
  "empty",
  "empty-competitors",
  "empty-notes",
  "loading",
  "error",
] as const;

export type MarketView = (typeof MARKET_VIEWS)[number];

export const MARKET_VIEW_OPTIONS: { value: MarketView; label: string }[] = [
  { value: "workspace", label: "Populated workspace" },
  { value: "empty", label: "Empty workspace" },
  { value: "empty-competitors", label: "No competitors" },
  { value: "empty-notes", label: "No research notes" },
  { value: "loading", label: "Loading" },
  { value: "error", label: "Error" },
];

export const MARKET_SECTIONS = [
  "overview",
  "competitors",
  "segments",
  "opportunities",
  "notes",
] as const;

export type MarketSection = (typeof MARKET_SECTIONS)[number];

export const MARKET_SECTION_META: Record<MarketSection, { label: string; index: string }> = {
  overview: { label: "Overview", index: "01" },
  competitors: { label: "Competitors", index: "02" },
  segments: { label: "Market Segments", index: "03" },
  opportunities: { label: "Opportunities", index: "04" },
  notes: { label: "Research Notes", index: "05" },
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Fixed "today" so sample labels never drift between renders. */
export const MARKET_TODAY = "2026-10-28";

function parseIso(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month, day };
}

export function formatMarketDate(iso: string): string {
  const { year, month, day } = parseIso(iso);
  return `${String(day).padStart(2, "0")} ${MONTHS[month - 1]} ${year}`;
}

export function formatMarketShortDate(iso: string): string {
  const { month, day } = parseIso(iso);
  return `${day} ${MONTHS[month - 1]}`;
}

function dayNumber(iso: string): number {
  const { year, month, day } = parseIso(iso);
  return Date.UTC(year, month - 1, day) / 86_400_000;
}

export function formatMarketUpdated(iso: string): string {
  const delta = Math.max(0, Math.round(dayNumber(MARKET_TODAY) - dayNumber(iso)));
  if (delta === 0) return "Today";
  if (delta === 1) return "Yesterday";
  if (delta <= 7) return `${delta}d ago`;
  return formatMarketShortDate(iso);
}
