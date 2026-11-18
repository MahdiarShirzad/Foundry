import { api } from "../apiClient";

import type {
  Initiative,
  Milestone,
  NoteCategory,
  PlanningNote,
  PlanningPeriod,
  Release,
  RoadmapPriority,
  RoadmapStatus,
} from "../product-roadmap/types";

/* ---------------------------------------------------------------- API rows ---
 * Shapes returned by the `/roadmap` endpoints. Dates are full ISO timestamps
 * (or `null`); status/priority/period/category arrive as the labels the
 * interface already renders.
 */

export type ApiInitiative = {
  id: string;
  productId: string;
  name: string;
  description: string | null;
  objective: string | null;
  userProblem: string | null;
  priority: string;
  status: string;
  period: string;
  relatedFeatures: string[];
  dependencies: string[];
  associatedMilestoneId: string | null;
  rationale: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiRelease = {
  id: string;
  productId: string;
  name: string;
  version: string | null;
  purpose: string | null;
  plannedDate: string | null;
  initiativeIds: string[];
  status: string;
  notesPreview: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiMilestone = {
  id: string;
  productId: string;
  name: string;
  description: string | null;
  targetDate: string | null;
  initiativeIds: string[];
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiPlanningNote = {
  id: string;
  productId: string;
  title: string;
  summary: string | null;
  relatedItemId: string | null;
  period: string;
  date: string | null;
  category: string;
  createdAt?: string;
  updatedAt?: string;
};

/* ---------------------------------------------------------------- payloads --- */

export type CreateInitiativeInput = {
  name: string;
  description?: string;
  objective?: string;
  userProblem?: string;
  priority?: RoadmapPriority;
  status?: RoadmapStatus;
  period?: PlanningPeriod;
  relatedFeatures?: string[];
  dependencies?: string[];
  associatedMilestoneId?: string;
  rationale?: string;
};

export type UpdateInitiativeInput = Partial<CreateInitiativeInput>;

export type CreateReleaseInput = {
  name: string;
  version?: string;
  purpose?: string;
  plannedDate?: string;
  status?: RoadmapStatus;
  notesPreview?: string;
};

export type UpdateReleaseInput = Partial<CreateReleaseInput>;

export type CreateMilestoneInput = {
  name: string;
  description?: string;
  targetDate?: string;
  status?: RoadmapStatus;
};

export type UpdateMilestoneInput = Partial<CreateMilestoneInput>;

export type CreatePlanningNoteInput = {
  title: string;
  summary?: string;
  relatedItemId?: string;
  period?: PlanningPeriod;
  date?: string;
  category?: NoteCategory;
};

export type UpdatePlanningNoteInput = Partial<CreatePlanningNoteInput>;

/* ---------------------------------------------------------------- mappings --- */

const STATUSES: RoadmapStatus[] = [
  "Proposed",
  "Planned",
  "In Progress",
  "Completed",
  "On Hold",
];
const PRIORITIES: RoadmapPriority[] = ["Critical", "High", "Medium", "Low"];
const PERIODS: PlanningPeriod[] = ["Now", "Next", "Later"];
const NOTE_CATEGORIES: NoteCategory[] = [
  "Strategic Decision",
  "Trade-off",
  "Dependency",
  "Open Question",
  "Release Consideration",
];

function toStatus(value: string): RoadmapStatus {
  return STATUSES.includes(value as RoadmapStatus)
    ? (value as RoadmapStatus)
    : "Proposed";
}

function toPriority(value: string): RoadmapPriority {
  return PRIORITIES.includes(value as RoadmapPriority)
    ? (value as RoadmapPriority)
    : "Medium";
}

function toPeriod(value: string): PlanningPeriod {
  return PERIODS.includes(value as PlanningPeriod)
    ? (value as PlanningPeriod)
    : "Next";
}

function toCategory(value: string): NoteCategory {
  return NOTE_CATEGORIES.includes(value as NoteCategory)
    ? (value as NoteCategory)
    : "Strategic Decision";
}

/** The presentation helpers expect `YYYY-MM-DD`; missing dates become "". */
function toDateOnly(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : "";
}

/** Normalise a date input for the API; empty values are omitted. */
function toApiDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return `${trimmed}T00:00:00.000Z`;
  }
  return trimmed;
}

export function toInitiative(initiative: ApiInitiative): Initiative {
  return {
    id: initiative.id,
    productId: initiative.productId,
    name: initiative.name,
    description: initiative.description ?? "",
    objective: initiative.objective ?? "",
    userProblem: initiative.userProblem ?? "",
    priority: toPriority(initiative.priority),
    status: toStatus(initiative.status),
    period: toPeriod(initiative.period),
    relatedFeatures: initiative.relatedFeatures ?? [],
    dependencies: initiative.dependencies ?? [],
    associatedMilestoneId: initiative.associatedMilestoneId ?? undefined,
    rationale: initiative.rationale ?? "",
  };
}

export function toRelease(release: ApiRelease): Release {
  return {
    id: release.id,
    productId: release.productId,
    name: release.name,
    version: release.version ?? "",
    purpose: release.purpose ?? "",
    plannedDate: toDateOnly(release.plannedDate),
    initiativeIds: release.initiativeIds ?? [],
    status: toStatus(release.status),
    notesPreview: release.notesPreview ?? "",
  };
}

export function toMilestone(milestone: ApiMilestone): Milestone {
  return {
    id: milestone.id,
    productId: milestone.productId,
    name: milestone.name,
    description: milestone.description ?? "",
    targetDate: toDateOnly(milestone.targetDate),
    initiativeIds: milestone.initiativeIds ?? [],
    status: toStatus(milestone.status),
  };
}

export function toPlanningNote(note: ApiPlanningNote): PlanningNote {
  return {
    id: note.id,
    productId: note.productId,
    title: note.title,
    summary: note.summary ?? "",
    relatedItemId: note.relatedItemId ?? null,
    period: toPeriod(note.period),
    date: toDateOnly(note.date),
    category: toCategory(note.category),
  };
}

function toInitiativePayload(
  input: CreateInitiativeInput | UpdateInitiativeInput,
): Record<string, unknown> {
  return {
    ...(input.name !== undefined && { name: input.name }),
    ...(input.description !== undefined && {
      description: input.description,
    }),
    ...(input.objective !== undefined && { objective: input.objective }),
    ...(input.userProblem !== undefined && { userProblem: input.userProblem }),
    ...(input.priority !== undefined && { priority: input.priority }),
    ...(input.status !== undefined && { status: input.status }),
    ...(input.period !== undefined && { period: input.period }),
    ...(input.relatedFeatures !== undefined && {
      relatedFeatures: input.relatedFeatures,
    }),
    ...(input.dependencies !== undefined && {
      dependencies: input.dependencies,
    }),
    ...(input.associatedMilestoneId !== undefined && {
      associatedMilestoneId: input.associatedMilestoneId || undefined,
    }),
    ...(input.rationale !== undefined && { rationale: input.rationale }),
  };
}

function toReleasePayload(
  input: CreateReleaseInput | UpdateReleaseInput,
): Record<string, unknown> {
  return {
    ...(input.name !== undefined && { name: input.name }),
    ...(input.version !== undefined && { version: input.version }),
    ...(input.purpose !== undefined && { purpose: input.purpose }),
    ...(input.plannedDate !== undefined && {
      plannedDate: toApiDate(input.plannedDate),
    }),
    ...(input.status !== undefined && { status: input.status }),
    ...(input.notesPreview !== undefined && {
      notesPreview: input.notesPreview,
    }),
  };
}

function toMilestonePayload(
  input: CreateMilestoneInput | UpdateMilestoneInput,
): Record<string, unknown> {
  return {
    ...(input.name !== undefined && { name: input.name }),
    ...(input.description !== undefined && {
      description: input.description,
    }),
    ...(input.targetDate !== undefined && {
      targetDate: toApiDate(input.targetDate),
    }),
    ...(input.status !== undefined && { status: input.status }),
  };
}

function toPlanningNotePayload(
  input: CreatePlanningNoteInput | UpdatePlanningNoteInput,
): Record<string, unknown> {
  return {
    ...(input.title !== undefined && { title: input.title }),
    ...(input.summary !== undefined && { summary: input.summary }),
    ...(input.relatedItemId !== undefined && {
      relatedItemId: input.relatedItemId || undefined,
    }),
    ...(input.period !== undefined && { period: input.period }),
    ...(input.date !== undefined && { date: toApiDate(input.date) }),
    ...(input.category !== undefined && { category: input.category }),
  };
}

function roadmapPath(productId: string, ...segments: string[]): string {
  const suffix = segments.map(encodeURIComponent).join("/");
  return `/roadmap/${encodeURIComponent(productId)}${
    suffix ? `/${suffix}` : ""
  }`;
}

/* ─── Initiatives ─────────────────────────────────────────────────────────── */

export async function getInitiatives(
  productId: string,
): Promise<Initiative[]> {
  const initiatives = await api.get<ApiInitiative[]>(
    roadmapPath(productId, "initiatives"),
  );
  return (initiatives ?? []).map(toInitiative);
}

export async function createInitiative(
  productId: string,
  dto: CreateInitiativeInput,
): Promise<Initiative> {
  const initiative = await api.post<ApiInitiative>(
    roadmapPath(productId, "initiatives"),
    toInitiativePayload(dto),
  );
  return toInitiative(initiative);
}

export async function updateInitiative(
  productId: string,
  id: string,
  dto: UpdateInitiativeInput,
): Promise<Initiative> {
  const initiative = await api.patch<ApiInitiative>(
    roadmapPath(productId, "initiatives", id),
    toInitiativePayload(dto),
  );
  return toInitiative(initiative);
}

export async function deleteInitiative(
  productId: string,
  id: string,
): Promise<void> {
  await api.delete<ApiInitiative>(roadmapPath(productId, "initiatives", id));
}

export async function suggestInitiatives(productId: string): Promise<string> {
  return api.post<string>(roadmapPath(productId, "ai", "suggest-initiatives"));
}

/* ─── Releases ────────────────────────────────────────────────────────────── */

export async function getReleases(productId: string): Promise<Release[]> {
  const releases = await api.get<ApiRelease[]>(
    roadmapPath(productId, "releases"),
  );
  return (releases ?? []).map(toRelease);
}

export async function createRelease(
  productId: string,
  dto: CreateReleaseInput,
): Promise<Release> {
  const release = await api.post<ApiRelease>(
    roadmapPath(productId, "releases"),
    toReleasePayload(dto),
  );
  return toRelease(release);
}

export async function updateRelease(
  productId: string,
  id: string,
  dto: UpdateReleaseInput,
): Promise<Release> {
  const release = await api.patch<ApiRelease>(
    roadmapPath(productId, "releases", id),
    toReleasePayload(dto),
  );
  return toRelease(release);
}

export async function deleteRelease(
  productId: string,
  id: string,
): Promise<void> {
  await api.delete<ApiRelease>(roadmapPath(productId, "releases", id));
}

/* ─── Milestones ──────────────────────────────────────────────────────────── */

export async function getMilestones(productId: string): Promise<Milestone[]> {
  const milestones = await api.get<ApiMilestone[]>(
    roadmapPath(productId, "milestones"),
  );
  return (milestones ?? []).map(toMilestone);
}

export async function createMilestone(
  productId: string,
  dto: CreateMilestoneInput,
): Promise<Milestone> {
  const milestone = await api.post<ApiMilestone>(
    roadmapPath(productId, "milestones"),
    toMilestonePayload(dto),
  );
  return toMilestone(milestone);
}

export async function updateMilestone(
  productId: string,
  id: string,
  dto: UpdateMilestoneInput,
): Promise<Milestone> {
  const milestone = await api.patch<ApiMilestone>(
    roadmapPath(productId, "milestones", id),
    toMilestonePayload(dto),
  );
  return toMilestone(milestone);
}

export async function deleteMilestone(
  productId: string,
  id: string,
): Promise<void> {
  await api.delete<ApiMilestone>(roadmapPath(productId, "milestones", id));
}

/* ─── Planning notes ──────────────────────────────────────────────────────── */

export async function getPlanningNotes(
  productId: string,
): Promise<PlanningNote[]> {
  const notes = await api.get<ApiPlanningNote[]>(
    roadmapPath(productId, "notes"),
  );
  return (notes ?? []).map(toPlanningNote);
}

export async function createPlanningNote(
  productId: string,
  dto: CreatePlanningNoteInput,
): Promise<PlanningNote> {
  const note = await api.post<ApiPlanningNote>(
    roadmapPath(productId, "notes"),
    toPlanningNotePayload(dto),
  );
  return toPlanningNote(note);
}

export async function updatePlanningNote(
  productId: string,
  id: string,
  dto: UpdatePlanningNoteInput,
): Promise<PlanningNote> {
  const note = await api.patch<ApiPlanningNote>(
    roadmapPath(productId, "notes", id),
    toPlanningNotePayload(dto),
  );
  return toPlanningNote(note);
}

export async function deletePlanningNote(
  productId: string,
  id: string,
): Promise<void> {
  await api.delete<ApiPlanningNote>(roadmapPath(productId, "notes", id));
}
