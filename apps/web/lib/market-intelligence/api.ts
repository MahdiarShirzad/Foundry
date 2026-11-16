import { api, ApiError } from "../apiClient";

import type { Idea } from "../idea-lab/types";

import type {
  Competitor,
  MarketIdea,
  Opportunity,
  RelatedType,
  ResearchNote,
  Segment,
} from "./types";
import { MARKET_TODAY } from "./types";

/**
 * Rows returned by the `/market-intelligence` endpoints. The shapes mirror the
 * Prisma models behind the API. Fields the interface needs but the schema does
 * not store yet (research status, evidence type, questions, ...) are filled
 * with neutral defaults in the mappers below until the backend grows columns.
 */
export type ApiMarketIdea = {
  id: string;
  ideaId: string;
  workspaceId: string;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiCompetitor = {
  id: string;
  marketIdeaId: string;
  name: string;
  website: string | null;
  description: string | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
  pricing: string | null;
  targetAudience: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiSegment = {
  id: string;
  marketIdeaId: string;
  name: string;
  description: string;
  /** `Small` | `Medium` | `Large` — not shown in the interface yet. */
  size: string | null;
  painPoints: string[] | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiOpportunity = {
  id: string;
  marketIdeaId: string;
  segmentId: string | null;
  title: string;
  description: string;
  /** `High` | `Medium` | `Low` — not shown in the interface yet. */
  significance: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiResearchNote = {
  id: string;
  marketIdeaId: string;
  relatedType: string;
  relatedId: string;
  body: string;
  author: string | null;
  createdAt: string;
};

export type ApiMarketAggregate = ApiMarketIdea & {
  competitors: ApiCompetitor[];
  segments: ApiSegment[];
  opportunities: ApiOpportunity[];
  notes: ApiResearchNote[];
};

/** Payloads accepted by the API; validated again by the backend DTOs. */
export type CreateCompetitorInput = {
  name: string;
  website?: string;
  description?: string;
  strengths?: string[];
  weaknesses?: string[];
  pricing?: string;
  targetAudience?: string;
};

export type UpdateCompetitorInput = Partial<CreateCompetitorInput>;

export type CreateSegmentInput = {
  name: string;
  description: string;
  size?: string;
  painPoints?: string[];
};

export type UpdateSegmentInput = Partial<CreateSegmentInput>;

export type CreateOpportunityInput = {
  title: string;
  description: string;
  significance: "High" | "Medium" | "Low";
  segmentId?: string;
};

export type UpdateOpportunityInput = Partial<CreateOpportunityInput>;

export type CreateResearchNoteInput = {
  relatedType: RelatedType;
  relatedId: string;
  body: string;
  author?: string;
};

/** The idea's workspace with its lists already mapped for presentation. */
export type MarketAggregate = {
  id: string;
  summary: string;
  updatedAt: string;
  competitors: Competitor[];
  segments: Segment[];
  opportunities: Opportunity[];
  notes: ResearchNote[];
};

/* ─── Mappers ─────────────────────────────────────────────────────────────── */

/**
 * The API returns full ISO timestamps while the presentation helpers expect
 * `YYYY-MM-DD`. Missing values become an empty string so date formatting never
 * produces `NaN`.
 */
function toDateOnly(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : "";
}

/** First line of a note body is the title; everything after is the body. */
function splitNoteBody(body: string): { title: string; observations: string } {
  const [firstLine = "", ...rest] = body.split("\n");
  const title = firstLine.trim() || "Research note";
  const observations = rest.join("\n").trim();
  return { title, observations: observations || title };
}

const RELATED_TYPES: RelatedType[] = ["competitor", "segment", "opportunity", "idea"];

function toRelatedType(value: string): RelatedType {
  return RELATED_TYPES.includes(value as RelatedType)
    ? (value as RelatedType)
    : "idea";
}

export function toCompetitor(competitor: ApiCompetitor): Competitor {
  return {
    id: competitor.id,
    name: competitor.name,
    // No category column yet — the field stays blank until the backend has one.
    category: "",
    website: competitor.website ?? "",
    description: competitor.description ?? "",
    audience: competitor.targetAudience ?? "",
    pricing: competitor.pricing ?? "",
    strengths: competitor.strengths ?? [],
    weaknesses: competitor.weaknesses ?? [],
    differentiation: "",
    observations: [],
    questions: [],
    status: "not-researched",
    evidence: "observation",
    updatedAt: toDateOnly(competitor.updatedAt),
  };
}

export function toSegment(segment: ApiSegment): Segment {
  return {
    id: segment.id,
    name: segment.name,
    description: segment.description,
    customerType: "",
    painPoints: segment.painPoints ?? [],
    alternatives: [],
    needs: [],
    questions: [],
    status: "not-researched",
    evidence: "observation",
    updatedAt: toDateOnly(segment.updatedAt),
  };
}

export function toOpportunity(opportunity: ApiOpportunity): Opportunity {
  return {
    id: opportunity.id,
    title: opportunity.title,
    description: opportunity.description,
    segmentId: opportunity.segmentId ?? "",
    problem: "",
    alternatives: "",
    differentiation: "",
    /** A supporting research note cannot be linked yet. */
    noteId: "",
    questions: [],
    status: "open",
    evidence: "observation",
    updatedAt: toDateOnly(opportunity.updatedAt),
  };
}

export function toResearchNote(
  note: ApiResearchNote,
  resolveLabel: (type: string, id: string) => string,
): ResearchNote {
  const { title, observations } = splitNoteBody(note.body);
  return {
    id: note.id,
    title,
    excerpt: observations,
    observations,
    interpretation: "",
    followUp: [],
    // Until the API has a source column, the author doubles as provenance.
    source: note.author ?? "",
    date: toDateOnly(note.createdAt),
    relatedType: toRelatedType(note.relatedType),
    relatedId: note.relatedId,
    relatedLabel: resolveLabel(note.relatedType, note.relatedId),
    evidence: "observation",
  };
}

export function toMarketAggregate(
  aggregate: ApiMarketAggregate,
  ideaName?: string,
): MarketAggregate {
  const competitors = (aggregate.competitors ?? []).map(toCompetitor);
  const segments = (aggregate.segments ?? []).map(toSegment);
  const opportunities = (aggregate.opportunities ?? []).map(toOpportunity);

  const resolveLabel = (type: string, id: string): string => {
    if (type === "competitor") {
      return competitors.find((item) => item.id === id)?.name ?? "Competitor";
    }
    if (type === "segment") {
      return segments.find((item) => item.id === id)?.name ?? "Segment";
    }
    if (type === "opportunity") {
      return opportunities.find((item) => item.id === id)?.title ?? "Opportunity";
    }
    return ideaName ?? "Idea";
  };

  return {
    id: aggregate.id,
    summary: aggregate.summary ?? "",
    updatedAt: toDateOnly(aggregate.updatedAt),
    competitors,
    segments,
    opportunities,
    notes: (aggregate.notes ?? []).map((note) => toResearchNote(note, resolveLabel)),
  };
}

/**
 * Compose the workspace `MarketIdea` from the idea (name, framing, questions)
 * and its market aggregate (competitors, segments, opportunities, notes).
 * Either side may be missing while the data loads.
 */
export function toMarketIdea(
  idea: Idea | null,
  aggregate: MarketAggregate | null,
): MarketIdea {
  return {
    id: aggregate?.id ?? idea?.id ?? "",
    ref: idea?.ref ?? "",
    name: idea?.name ?? "",
    headline: idea?.headline ?? "",
    summary: aggregate?.summary || idea?.summary || "",
    // The idea's captured context doubles as the market belief being studied.
    hypothesis: idea?.context ?? "",
    targetAudience: idea?.audience ?? "",
    problem: idea?.problem ?? "",
    // No competitive-summary column exists yet.
    competitiveSummary: "",
    // While the data is still loading the header still renders, so fall back
    // to the module's fixed "today" instead of formatting an empty string.
    updatedAt: aggregate?.updatedAt || idea?.updatedAt || MARKET_TODAY,
    openQuestions: idea?.openQuestions ?? [],
    competitors: aggregate?.competitors ?? [],
    segments: aggregate?.segments ?? [],
    opportunities: aggregate?.opportunities ?? [],
    notes: aggregate?.notes ?? [],
  };
}

/* ─── Endpoints ───────────────────────────────────────────────────────────── */

/**
 * Create the market workspace for an idea when it does not exist yet.
 * The endpoint is a get-or-create, so calling it again is always safe.
 */
export async function initMarketIdea(
  ideaId: string,
  workspaceId: string,
): Promise<ApiMarketIdea> {
  return api.post<ApiMarketIdea>(`/market-intelligence/${ideaId}/init`, {
    workspaceId,
  });
}

/**
 * Full aggregate for an idea. Returns `null` when the workspace was never
 * initialized (the API answers 404) so the interface can offer a fresh start.
 */
export async function getMarketIdea(
  ideaId: string,
): Promise<MarketAggregate | null> {
  try {
    const aggregate = await api.get<ApiMarketAggregate>(
      `/market-intelligence/${ideaId}`,
    );
    return toMarketAggregate(aggregate);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/* ── Competitors ── */

export async function addCompetitor(
  ideaId: string,
  input: CreateCompetitorInput,
): Promise<Competitor> {
  const competitor = await api.post<ApiCompetitor>(
    `/market-intelligence/${ideaId}/competitors`,
    input,
  );
  return toCompetitor(competitor);
}

export async function updateCompetitor(
  ideaId: string,
  competitorId: string,
  input: UpdateCompetitorInput,
): Promise<Competitor> {
  const competitor = await api.patch<ApiCompetitor>(
    `/market-intelligence/${ideaId}/competitors/${competitorId}`,
    input,
  );
  return toCompetitor(competitor);
}

export async function removeCompetitor(
  ideaId: string,
  competitorId: string,
): Promise<void> {
  await api.delete(`/market-intelligence/${ideaId}/competitors/${competitorId}`);
}

/* ── Segments ── */

export async function addSegment(
  ideaId: string,
  input: CreateSegmentInput,
): Promise<Segment> {
  const segment = await api.post<ApiSegment>(
    `/market-intelligence/${ideaId}/segments`,
    input,
  );
  return toSegment(segment);
}

export async function updateSegment(
  ideaId: string,
  segmentId: string,
  input: UpdateSegmentInput,
): Promise<Segment> {
  const segment = await api.patch<ApiSegment>(
    `/market-intelligence/${ideaId}/segments/${segmentId}`,
    input,
  );
  return toSegment(segment);
}

export async function removeSegment(
  ideaId: string,
  segmentId: string,
): Promise<void> {
  await api.delete(`/market-intelligence/${ideaId}/segments/${segmentId}`);
}

/* ── Opportunities ── */

export async function addOpportunity(
  ideaId: string,
  input: CreateOpportunityInput,
): Promise<Opportunity> {
  const opportunity = await api.post<ApiOpportunity>(
    `/market-intelligence/${ideaId}/opportunities`,
    input,
  );
  return toOpportunity(opportunity);
}

export async function updateOpportunity(
  ideaId: string,
  opportunityId: string,
  input: UpdateOpportunityInput,
): Promise<Opportunity> {
  const opportunity = await api.patch<ApiOpportunity>(
    `/market-intelligence/${ideaId}/opportunities/${opportunityId}`,
    input,
  );
  return toOpportunity(opportunity);
}

export async function removeOpportunity(
  ideaId: string,
  opportunityId: string,
): Promise<void> {
  await api.delete(`/market-intelligence/${ideaId}/opportunities/${opportunityId}`);
}

/* ── Research notes ── */

export async function addNote(
  ideaId: string,
  input: CreateResearchNoteInput,
): Promise<ResearchNote> {
  const note = await api.post<ApiResearchNote>(
    `/market-intelligence/${ideaId}/notes`,
    input,
  );
  return toResearchNote(note, () => "Idea");
}

export async function removeNote(
  ideaId: string,
  noteId: string,
): Promise<void> {
  await api.delete(`/market-intelligence/${ideaId}/notes/${noteId}`);
}
