import { api, ApiError } from "../apiClient";

import type { Idea } from "../idea-lab/types";

import type {
  EvidenceItem,
  EvidenceType,
  Experiment,
  ExperimentMethod,
  ExperimentStatus,
  Hypothesis,
  HypothesisCategory,
  HypothesisStatus,
  ValidationIdea,
} from "../validation-lab/types";

/* ---------------------------------------------------------------- API rows ---
 * Shapes returned by the `/validation` endpoints. They mirror the Prisma
 * models: enum columns arrive as upper-case API values and dates arrive as
 * full ISO timestamps or `null`.
 */

export const API_HYPOTHESIS_CATEGORIES = [
  "PROBLEM",
  "SOLUTION",
  "MARKET",
  "BUSINESS_MODEL",
  "VALUE_PROPOSITION",
  "CUSTOMER",
  "TECHNICAL",
] as const;

export type ApiHypothesisCategory =
  (typeof API_HYPOTHESIS_CATEGORIES)[number];

export const API_HYPOTHESIS_STATUSES = [
  "DRAFT",
  "ACTIVE",
  "TESTING",
  "VALIDATED",
  "INVALIDATED",
  "PAUSED",
] as const;

export type ApiHypothesisStatus = (typeof API_HYPOTHESIS_STATUSES)[number];

export const API_IMPORTANCES = ["HIGH", "MEDIUM", "LOW"] as const;

export type ApiImportance = (typeof API_IMPORTANCES)[number];

export const API_EXPERIMENT_METHODS = [
  "SURVEY",
  "INTERVIEW",
  "LANDING_PAGE",
  "PROTOTYPE",
  "AB_TEST",
  "SMOKE_TEST",
  "OBSERVATION",
] as const;

export type ApiExperimentMethod = (typeof API_EXPERIMENT_METHODS)[number];

export const API_EXPERIMENT_STATUSES = [
  "DRAFT",
  "PLANNED",
  "RUNNING",
  "COMPLETE",
  "CANCELLED",
] as const;

export type ApiExperimentStatus = (typeof API_EXPERIMENT_STATUSES)[number];

export const API_EVIDENCE_TYPES = [
  "INTERVIEW",
  "SURVEY",
  "OBSERVATION",
  "METRIC",
  "DOCUMENT",
  "OTHER",
] as const;

export type ApiEvidenceType = (typeof API_EVIDENCE_TYPES)[number];

export type ApiHypothesis = {
  id: string;
  ideaId: string;
  title: string;
  statement: string;
  customerSegment: string | null;
  category: ApiHypothesisCategory | null;
  rationale: string | null;
  importance: ApiImportance;
  status: ApiHypothesisStatus;
  relatedExperimentIds: string[];
  linkedFindings: string[];
  unresolvedQuestions: string[];
  isDraft?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiExperiment = {
  id: string;
  ideaId: string;
  title: string;
  relatedHypothesisId: string | null;
  objective: string | null;
  method: ApiExperimentMethod | null;
  targetAudience: string | null;
  successCriteria: string | null;
  expectedEvidence: string | null;
  status: ApiExperimentStatus;
  startDate: string | null;
  endDate: string | null;
  observations: string[];
  notes: string | null;
  isDraft?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiEvidenceItem = {
  id: string;
  ideaId: string;
  title: string;
  relatedExperimentId: string | null;
  relatedHypothesisId: string | null;
  type: ApiEvidenceType | null;
  sourceLabel: string | null;
  date: string | null;
  observation: string | null;
  interpretation: string | null;
  limitations: string | null;
  isDraft?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

/* ---------------------------------------------------------------- payloads ---
 * Frontend payloads use the same labels the UI renders. The mappers below
 * translate them to the API's Prisma enum values.
 */

export type CreateHypothesisInput = {
  title: string;
  statement: string;
  customerSegment?: string;
  category?: HypothesisCategory | ApiHypothesisCategory;
  rationale?: string;
  importance?: Hypothesis["importance"] | ApiImportance;
  status?: HypothesisStatus | ApiHypothesisStatus;
  relatedExperimentIds?: string[];
  linkedFindings?: string[];
  unresolvedQuestions?: string[];
  isDraft?: boolean;
};

export type UpdateHypothesisInput = Partial<CreateHypothesisInput>;

export type CreateExperimentInput = {
  title: string;
  relatedHypothesisId?: string;
  objective?: string;
  method?: ExperimentMethod | ApiExperimentMethod;
  targetAudience?: string;
  successCriteria?: string;
  expectedEvidence?: string;
  status?: ExperimentStatus | ApiExperimentStatus;
  startDate?: string;
  endDate?: string;
  observations?: string[];
  notes?: string;
  isDraft?: boolean;
};

export type UpdateExperimentInput = Partial<CreateExperimentInput>;

export type CreateEvidenceInput = {
  title: string;
  relatedExperimentId?: string;
  relatedHypothesisId?: string;
  type?: EvidenceType | ApiEvidenceType;
  sourceLabel?: string;
  date?: string;
  observation?: string;
  interpretation?: string;
  limitations?: string;
  isDraft?: boolean;
};

export type UpdateEvidenceInput = Partial<CreateEvidenceInput>;

export type EvidenceFilters = {
  experimentId?: string;
  hypothesisId?: string;
};

/* ---------------------------------------------------------------- mappings --- */

const HYPOTHESIS_CATEGORY_FROM_API: Record<
  ApiHypothesisCategory,
  HypothesisCategory
> = {
  PROBLEM: "Customer Problem",
  CUSTOMER: "Target Audience",
  MARKET: "Demand",
  BUSINESS_MODEL: "Willingness to Pay",
  SOLUTION: "Solution",
  VALUE_PROPOSITION: "Distribution",
  TECHNICAL: "Retention",
};

const HYPOTHESIS_CATEGORY_TO_API: Record<
  HypothesisCategory,
  ApiHypothesisCategory
> = {
  "Customer Problem": "PROBLEM",
  "Target Audience": "CUSTOMER",
  Demand: "MARKET",
  "Willingness to Pay": "BUSINESS_MODEL",
  Solution: "SOLUTION",
  Distribution: "VALUE_PROPOSITION",
  Retention: "TECHNICAL",
};

const HYPOTHESIS_STATUS_FROM_API: Record<
  ApiHypothesisStatus,
  HypothesisStatus
> = {
  DRAFT: "Unexamined",
  ACTIVE: "Ready to Test",
  TESTING: "Testing",
  VALIDATED: "Supported",
  INVALIDATED: "Rejected",
  PAUSED: "Inconclusive",
};

const HYPOTHESIS_STATUS_TO_API: Record<
  HypothesisStatus,
  ApiHypothesisStatus
> = {
  Unexamined: "DRAFT",
  "Ready to Test": "ACTIVE",
  Testing: "TESTING",
  Supported: "VALIDATED",
  Rejected: "INVALIDATED",
  Inconclusive: "PAUSED",
};

const IMPORTANCE_FROM_API: Record<ApiImportance, Hypothesis["importance"]> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

const IMPORTANCE_TO_API: Record<Hypothesis["importance"], ApiImportance> = {
  High: "HIGH",
  Medium: "MEDIUM",
  Low: "LOW",
};

const EXPERIMENT_METHOD_FROM_API: Record<
  ApiExperimentMethod,
  ExperimentMethod
> = {
  SURVEY: "Surveys",
  INTERVIEW: "Customer Interviews",
  LANDING_PAGE: "Landing Page Tests",
  PROTOTYPE: "Prototype Tests",
  AB_TEST: "Concierge Tests",
  SMOKE_TEST: "Manual Demand Tests",
  OBSERVATION: "Pricing Interviews",
};

const EXPERIMENT_METHOD_TO_API: Record<
  ExperimentMethod,
  ApiExperimentMethod
> = {
  "Customer Interviews": "INTERVIEW",
  Surveys: "SURVEY",
  "Landing Page Tests": "LANDING_PAGE",
  "Prototype Tests": "PROTOTYPE",
  "Concierge Tests": "AB_TEST",
  "Pricing Interviews": "OBSERVATION",
  "Manual Demand Tests": "SMOKE_TEST",
};

const EXPERIMENT_STATUS_FROM_API: Record<
  ApiExperimentStatus,
  ExperimentStatus
> = {
  DRAFT: "Draft",
  PLANNED: "Ready",
  RUNNING: "In Progress",
  COMPLETE: "Completed",
  CANCELLED: "Archived",
};

const EXPERIMENT_STATUS_TO_API: Record<
  ExperimentStatus,
  ApiExperimentStatus
> = {
  Draft: "DRAFT",
  Ready: "PLANNED",
  "In Progress": "RUNNING",
  Completed: "COMPLETE",
  Archived: "CANCELLED",
};

const EVIDENCE_TYPE_FROM_API: Record<ApiEvidenceType, EvidenceType> = {
  INTERVIEW: "Interview Observation",
  SURVEY: "Survey Result",
  OBSERVATION: "Behavioral Observation",
  METRIC: "Quantitative Measurement",
  DOCUMENT: "Qualitative Finding",
  OTHER: "Prototype Feedback",
};

const EVIDENCE_TYPE_TO_API: Record<EvidenceType, ApiEvidenceType> = {
  "Interview Observation": "INTERVIEW",
  "Survey Result": "SURVEY",
  "Behavioral Observation": "OBSERVATION",
  "Prototype Feedback": "OTHER",
  "Quantitative Measurement": "METRIC",
  "Qualitative Finding": "DOCUMENT",
};

/**
 * The API returns full ISO timestamps while the presentation helpers expect
 * `YYYY-MM-DD`. Missing values become an empty string so date formatting never
 * produces `NaN`.
 */
function toDateOnly(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : "";
}

/** Normalise a date input for the API; empty and placeholder values are omitted. */
function toApiDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === "not scheduled") return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return `${trimmed}T00:00:00.000Z`;
  }
  return trimmed;
}

function toApiHypothesisCategory(
  value: CreateHypothesisInput["category"],
): ApiHypothesisCategory | undefined {
  if (!value) return undefined;
  if (value in HYPOTHESIS_CATEGORY_TO_API) {
    return HYPOTHESIS_CATEGORY_TO_API[value as HypothesisCategory];
  }
  return API_HYPOTHESIS_CATEGORIES.includes(value as ApiHypothesisCategory)
    ? (value as ApiHypothesisCategory)
    : undefined;
}

function toApiHypothesisStatus(
  value: CreateHypothesisInput["status"],
): ApiHypothesisStatus | undefined {
  if (!value) return undefined;
  if (value in HYPOTHESIS_STATUS_TO_API) {
    return HYPOTHESIS_STATUS_TO_API[value as HypothesisStatus];
  }
  return API_HYPOTHESIS_STATUSES.includes(value as ApiHypothesisStatus)
    ? (value as ApiHypothesisStatus)
    : undefined;
}

function toApiImportance(
  value: CreateHypothesisInput["importance"],
): ApiImportance | undefined {
  if (!value) return undefined;
  if (value in IMPORTANCE_TO_API) {
    return IMPORTANCE_TO_API[value as Hypothesis["importance"]];
  }
  return API_IMPORTANCES.includes(value as ApiImportance)
    ? (value as ApiImportance)
    : undefined;
}

function toApiExperimentMethod(
  value: CreateExperimentInput["method"],
): ApiExperimentMethod | undefined {
  if (!value) return undefined;
  if (value in EXPERIMENT_METHOD_TO_API) {
    return EXPERIMENT_METHOD_TO_API[value as ExperimentMethod];
  }
  return API_EXPERIMENT_METHODS.includes(value as ApiExperimentMethod)
    ? (value as ApiExperimentMethod)
    : undefined;
}

function toApiExperimentStatus(
  value: CreateExperimentInput["status"],
): ApiExperimentStatus | undefined {
  if (!value) return undefined;
  if (value in EXPERIMENT_STATUS_TO_API) {
    return EXPERIMENT_STATUS_TO_API[value as ExperimentStatus];
  }
  return API_EXPERIMENT_STATUSES.includes(value as ApiExperimentStatus)
    ? (value as ApiExperimentStatus)
    : undefined;
}

function toApiEvidenceType(
  value: CreateEvidenceInput["type"],
): ApiEvidenceType | undefined {
  if (!value) return undefined;
  if (value in EVIDENCE_TYPE_TO_API) {
    return EVIDENCE_TYPE_TO_API[value as EvidenceType];
  }
  return API_EVIDENCE_TYPES.includes(value as ApiEvidenceType)
    ? (value as ApiEvidenceType)
    : undefined;
}

/** Map an API hypothesis onto the presentation `Hypothesis` shape. */
export function toHypothesis(hypothesis: ApiHypothesis): Hypothesis {
  return {
    id: hypothesis.id,
    ideaId: hypothesis.ideaId,
    title: hypothesis.title,
    statement: hypothesis.statement,
    customerSegment: hypothesis.customerSegment ?? "",
    category: hypothesis.category
      ? HYPOTHESIS_CATEGORY_FROM_API[hypothesis.category]
      : "Customer Problem",
    rationale: hypothesis.rationale ?? "",
    importance: IMPORTANCE_FROM_API[hypothesis.importance] ?? "Medium",
    status: HYPOTHESIS_STATUS_FROM_API[hypothesis.status] ?? "Unexamined",
    relatedExperimentIds: hypothesis.relatedExperimentIds ?? [],
    linkedFindings: hypothesis.linkedFindings ?? [],
    unresolvedQuestions: hypothesis.unresolvedQuestions ?? [],
  };
}

/** Map an API experiment onto the presentation `Experiment` shape. */
export function toExperiment(experiment: ApiExperiment): Experiment {
  return {
    id: experiment.id,
    ideaId: experiment.ideaId,
    title: experiment.title,
    relatedHypothesisId: experiment.relatedHypothesisId ?? "",
    objective: experiment.objective ?? "",
    method: experiment.method
      ? EXPERIMENT_METHOD_FROM_API[experiment.method]
      : "Customer Interviews",
    targetAudience: experiment.targetAudience ?? "",
    successCriteria: experiment.successCriteria ?? "",
    expectedEvidence: experiment.expectedEvidence ?? "",
    status: EXPERIMENT_STATUS_FROM_API[experiment.status] ?? "Draft",
    startDate: experiment.startDate
      ? toDateOnly(experiment.startDate)
      : "Not scheduled",
    endDate: experiment.endDate ? toDateOnly(experiment.endDate) : undefined,
    observations: experiment.observations ?? [],
    notes: experiment.notes ?? "",
  };
}

/** Map an API evidence row onto the presentation `EvidenceItem` shape. */
export function toEvidenceItem(evidence: ApiEvidenceItem): EvidenceItem {
  return {
    id: evidence.id,
    ideaId: evidence.ideaId,
    title: evidence.title,
    relatedExperimentId: evidence.relatedExperimentId ?? "",
    relatedHypothesisId: evidence.relatedHypothesisId ?? "",
    type: evidence.type
      ? EVIDENCE_TYPE_FROM_API[evidence.type]
      : "Interview Observation",
    sourceLabel: evidence.sourceLabel ?? "",
    date: toDateOnly(evidence.date),
    observation: evidence.observation ?? "",
    interpretation: evidence.interpretation ?? "",
    limitations: evidence.limitations ?? "",
  };
}

/** Compose the validation workspace header from an Idea Lab idea. */
export function toValidationIdea(idea: Idea): ValidationIdea {
  return {
    id: idea.id,
    name: idea.name,
    ref: idea.ref,
    // The idea's captured context is the assumption the lab investigates.
    assumption: idea.context || idea.problem || idea.headline || idea.summary,
    // The ideas table does not store a validation task list yet.
    nextTasks: [],
  };
}

function toHypothesisPayload(
  input: CreateHypothesisInput | UpdateHypothesisInput,
): Record<string, unknown> {
  return {
    ...(input.title !== undefined && { title: input.title }),
    ...(input.statement !== undefined && { statement: input.statement }),
    ...(input.customerSegment !== undefined && {
      customerSegment: input.customerSegment,
    }),
    ...(input.category !== undefined && {
      category: toApiHypothesisCategory(input.category),
    }),
    ...(input.rationale !== undefined && { rationale: input.rationale }),
    ...(input.importance !== undefined && {
      importance: toApiImportance(input.importance),
    }),
    ...(input.status !== undefined && {
      status: toApiHypothesisStatus(input.status),
    }),
    ...(input.relatedExperimentIds !== undefined && {
      relatedExperimentIds: input.relatedExperimentIds,
    }),
    ...(input.linkedFindings !== undefined && {
      linkedFindings: input.linkedFindings,
    }),
    ...(input.unresolvedQuestions !== undefined && {
      unresolvedQuestions: input.unresolvedQuestions,
    }),
    ...(input.isDraft !== undefined && { isDraft: input.isDraft }),
  };
}

function toExperimentPayload(
  input: CreateExperimentInput | UpdateExperimentInput,
): Record<string, unknown> {
  return {
    ...(input.title !== undefined && { title: input.title }),
    ...(input.relatedHypothesisId !== undefined && {
      relatedHypothesisId: input.relatedHypothesisId || undefined,
    }),
    ...(input.objective !== undefined && { objective: input.objective }),
    ...(input.method !== undefined && {
      method: toApiExperimentMethod(input.method),
    }),
    ...(input.targetAudience !== undefined && {
      targetAudience: input.targetAudience,
    }),
    ...(input.successCriteria !== undefined && {
      successCriteria: input.successCriteria,
    }),
    ...(input.expectedEvidence !== undefined && {
      expectedEvidence: input.expectedEvidence,
    }),
    ...(input.status !== undefined && {
      status: toApiExperimentStatus(input.status),
    }),
    ...(input.startDate !== undefined && {
      startDate: toApiDate(input.startDate),
    }),
    ...(input.endDate !== undefined && { endDate: toApiDate(input.endDate) }),
    ...(input.observations !== undefined && {
      observations: input.observations,
    }),
    ...(input.notes !== undefined && { notes: input.notes }),
    ...(input.isDraft !== undefined && { isDraft: input.isDraft }),
  };
}

function toEvidencePayload(
  input: CreateEvidenceInput | UpdateEvidenceInput,
): Record<string, unknown> {
  return {
    ...(input.title !== undefined && { title: input.title }),
    ...(input.relatedExperimentId !== undefined && {
      relatedExperimentId: input.relatedExperimentId || undefined,
    }),
    ...(input.relatedHypothesisId !== undefined && {
      relatedHypothesisId: input.relatedHypothesisId || undefined,
    }),
    ...(input.type !== undefined && { type: toApiEvidenceType(input.type) }),
    ...(input.sourceLabel !== undefined && { sourceLabel: input.sourceLabel }),
    ...(input.date !== undefined && { date: toApiDate(input.date) }),
    ...(input.observation !== undefined && {
      observation: input.observation,
    }),
    ...(input.interpretation !== undefined && {
      interpretation: input.interpretation,
    }),
    ...(input.limitations !== undefined && {
      limitations: input.limitations,
    }),
    ...(input.isDraft !== undefined && { isDraft: input.isDraft }),
  };
}

function validationPath(
  ideaId: string,
  ...segments: (string | undefined)[]
): string {
  const suffix = segments
    .filter((segment): segment is string => Boolean(segment))
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `/validation/${encodeURIComponent(ideaId)}${suffix ? `/${suffix}` : ""}`;
}

/** The API answers 404 when a list is empty; that is an empty workspace, not an error. */
function isEmptyListError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}

/* ─── Hypotheses ──────────────────────────────────────────────────────────── */

export async function getHypotheses(ideaId: string): Promise<Hypothesis[]> {
  const hypotheses = await api.get<ApiHypothesis[]>(
    validationPath(ideaId, "hypotheses"),
  );
  return (hypotheses ?? []).map(toHypothesis);
}

export async function getHypothesis(
  ideaId: string,
  id: string,
): Promise<Hypothesis> {
  const hypothesis = await api.get<ApiHypothesis>(
    validationPath(ideaId, "hypotheses", id),
  );
  return toHypothesis(hypothesis);
}

export async function createHypothesis(
  ideaId: string,
  dto: CreateHypothesisInput,
): Promise<Hypothesis> {
  const hypothesis = await api.post<ApiHypothesis>(
    validationPath(ideaId, "hypotheses"),
    { ideaId, ...toHypothesisPayload(dto) },
  );
  return toHypothesis(hypothesis);
}

export async function updateHypothesis(
  ideaId: string,
  id: string,
  dto: UpdateHypothesisInput,
): Promise<Hypothesis> {
  const hypothesis = await api.patch<ApiHypothesis>(
    validationPath(ideaId, "hypotheses", id),
    toHypothesisPayload(dto),
  );
  return toHypothesis(hypothesis);
}

export async function deleteHypothesis(
  ideaId: string,
  id: string,
): Promise<void> {
  await api.delete<ApiHypothesis>(validationPath(ideaId, "hypotheses", id));
}

/* ─── Experiments ─────────────────────────────────────────────────────────── */

export async function getExperiments(
  ideaId: string,
  hypothesisId?: string,
): Promise<Experiment[]> {
  const query = hypothesisId
    ? `?hypothesisId=${encodeURIComponent(hypothesisId)}`
    : "";

  try {
    const experiments = await api.get<ApiExperiment[]>(
      `${validationPath(ideaId, "experiments")}${query}`,
    );
    return (experiments ?? []).map(toExperiment);
  } catch (error) {
    if (isEmptyListError(error)) return [];
    throw error;
  }
}

export async function getExperiment(
  ideaId: string,
  id: string,
): Promise<Experiment> {
  const experiment = await api.get<ApiExperiment>(
    validationPath(ideaId, "experiments", id),
  );
  return toExperiment(experiment);
}

export async function createExperiment(
  ideaId: string,
  dto: CreateExperimentInput,
): Promise<Experiment> {
  const experiment = await api.post<ApiExperiment>(
    validationPath(ideaId, "experiments"),
    { ideaId, ...toExperimentPayload(dto) },
  );
  return toExperiment(experiment);
}

export async function updateExperiment(
  ideaId: string,
  id: string,
  dto: UpdateExperimentInput,
): Promise<Experiment> {
  const experiment = await api.patch<ApiExperiment>(
    validationPath(ideaId, "experiments", id),
    toExperimentPayload(dto),
  );
  return toExperiment(experiment);
}

export async function deleteExperiment(
  ideaId: string,
  id: string,
): Promise<void> {
  await api.delete<ApiExperiment>(validationPath(ideaId, "experiments", id));
}

/* ─── Evidence ────────────────────────────────────────────────────────────── */

export async function getEvidence(
  ideaId: string,
  filters?: EvidenceFilters,
): Promise<EvidenceItem[]> {
  const params = new URLSearchParams();
  if (filters?.experimentId) params.set("experimentId", filters.experimentId);
  if (filters?.hypothesisId) params.set("hypothesisId", filters.hypothesisId);
  const query = params.toString() ? `?${params.toString()}` : "";

  try {
    const evidence = await api.get<ApiEvidenceItem[]>(
      `${validationPath(ideaId, "evidence")}${query}`,
    );
    return (evidence ?? []).map(toEvidenceItem);
  } catch (error) {
    if (isEmptyListError(error)) return [];
    throw error;
  }
}

export async function getEvidenceItem(
  ideaId: string,
  id: string,
): Promise<EvidenceItem> {
  const evidence = await api.get<ApiEvidenceItem>(
    validationPath(ideaId, "evidence", id),
  );
  return toEvidenceItem(evidence);
}

export async function createEvidence(
  ideaId: string,
  dto: CreateEvidenceInput,
): Promise<EvidenceItem> {
  const evidence = await api.post<ApiEvidenceItem>(
    validationPath(ideaId, "evidence"),
    { ideaId, ...toEvidencePayload(dto) },
  );
  return toEvidenceItem(evidence);
}

export async function updateEvidence(
  ideaId: string,
  id: string,
  dto: UpdateEvidenceInput,
): Promise<EvidenceItem> {
  const evidence = await api.patch<ApiEvidenceItem>(
    validationPath(ideaId, "evidence", id),
    toEvidencePayload(dto),
  );
  return toEvidenceItem(evidence);
}

export async function deleteEvidence(
  ideaId: string,
  id: string,
): Promise<void> {
  await api.delete<ApiEvidenceItem>(validationPath(ideaId, "evidence", id));
}
