import { api } from "../apiClient";

import type {
  FeatureRequestStatus,
  FeedbackCategory,
  FeedbackItem,
  FeedbackPriority,
  FeedbackSource,
  FeedbackStatus,
  FeatureRequest,
  ProductArea,
  ProductAreaDefinition,
  Theme,
  ThemeImportance,
} from "../feedback-hub/types";

/* ---------------------------------------------------------------- API rows ---
 * Shapes returned by the `/feedback` endpoints. They mirror the Prisma models:
 * dates arrive as full ISO timestamps or `null`, while every label column
 * arrives as the string the interface already renders.
 */

export type ApiFeedbackItem = {
  id: string;
  productId: string;
  title: string;
  excerpt: string | null;
  description: string | null;
  category: string;
  source: string | null;
  date: string | null;
  priority: string;
  status: string;
  productArea: string | null;
  internalNotes: string | null;
  followUpAction: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiTheme = {
  id: string;
  productId: string;
  name: string;
  explanation: string | null;
  relatedFeedbackIds: string[];
  productArea: string | null;
  importance: string;
  reviewStatus: string;
  internalNotes: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiFeatureRequest = {
  id: string;
  productId: string;
  title: string;
  description: string | null;
  userProblem: string | null;
  requestedCapability: string | null;
  relatedFeedbackIds: string[];
  productArea: string | null;
  priority: string;
  status: string;
  roadmapReference: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiProductAreaDefinition = {
  id: string;
  productId: string;
  name: string;
  description: string | null;
  summary: string | null;
  createdAt?: string;
  updatedAt?: string;
};

/* ---------------------------------------------------------------- payloads ---
 * Update payloads are entirely optional so partial saves stay partial.
 */

export type CreateFeedbackInput = {
  title: string;
  excerpt?: string;
  description?: string;
  category?: FeedbackCategory;
  source?: FeedbackSource | string;
  date?: string;
  priority?: FeedbackPriority;
  status?: FeedbackStatus;
  productArea?: string;
  internalNotes?: string;
  followUpAction?: string;
};

export type UpdateFeedbackInput = Partial<CreateFeedbackInput>;

export type CreateThemeInput = {
  name: string;
  explanation?: string;
  relatedFeedbackIds?: string[];
  productArea?: string;
  importance?: ThemeImportance;
  reviewStatus?: FeedbackStatus;
  internalNotes?: string;
};

export type UpdateThemeInput = Partial<CreateThemeInput>;

export type CreateFeatureRequestInput = {
  title: string;
  description?: string;
  userProblem?: string;
  requestedCapability?: string;
  relatedFeedbackIds?: string[];
  productArea?: string;
  priority?: FeedbackPriority;
  status?: FeatureRequestStatus;
  roadmapReference?: string;
};

export type UpdateFeatureRequestInput = Partial<CreateFeatureRequestInput>;

export type CreateProductAreaInput = {
  name: string;
  description?: string;
  summary?: string;
};

export type UpdateProductAreaInput = Partial<CreateProductAreaInput>;

/* ---------------------------------------------------------------- mappings --- */

const CATEGORIES: FeedbackCategory[] = [
  "Bug Report",
  "Feature Request",
  "Usability Issue",
  "Performance Issue",
  "General Feedback",
];
const STATUSES: FeedbackStatus[] = [
  "New",
  "Under Review",
  "Planned",
  "Resolved",
  "Archived",
];
const PRIORITIES: FeedbackPriority[] = ["Critical", "High", "Medium", "Low"];
const REQUEST_STATUSES: FeatureRequestStatus[] = [
  "New",
  "Under Review",
  "Planned",
  "Declined",
  "Delivered",
];
const IMPORTANCES: ThemeImportance[] = ["High", "Medium", "Low"];

function toCategory(value: string): FeedbackCategory {
  return CATEGORIES.includes(value as FeedbackCategory)
    ? (value as FeedbackCategory)
    : "General Feedback";
}

function toStatus(value: string): FeedbackStatus {
  return STATUSES.includes(value as FeedbackStatus)
    ? (value as FeedbackStatus)
    : "New";
}

function toPriority(value: string): FeedbackPriority {
  return PRIORITIES.includes(value as FeedbackPriority)
    ? (value as FeedbackPriority)
    : "Medium";
}

function toRequestStatus(value: string): FeatureRequestStatus {
  return REQUEST_STATUSES.includes(value as FeatureRequestStatus)
    ? (value as FeatureRequestStatus)
    : "New";
}

function toImportance(value: string): ThemeImportance {
  return IMPORTANCES.includes(value as ThemeImportance)
    ? (value as ThemeImportance)
    : "Medium";
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

export function toFeedbackItem(item: ApiFeedbackItem): FeedbackItem {
  return {
    id: item.id,
    productId: item.productId,
    title: item.title,
    excerpt: item.excerpt ?? "",
    description: item.description ?? "",
    category: toCategory(item.category),
    source: item.source ?? "General",
    date: toDateOnly(item.date),
    priority: toPriority(item.priority),
    status: toStatus(item.status),
    productArea: item.productArea ?? undefined,
    internalNotes: item.internalNotes ?? undefined,
    followUpAction: item.followUpAction ?? undefined,
  };
}

export function toTheme(theme: ApiTheme): Theme {
  return {
    id: theme.id,
    productId: theme.productId,
    name: theme.name,
    explanation: theme.explanation ?? "",
    relatedFeedbackIds: theme.relatedFeedbackIds ?? [],
    productArea: theme.productArea ?? "",
    importance: toImportance(theme.importance),
    reviewStatus: toStatus(theme.reviewStatus),
    internalNotes: theme.internalNotes ?? undefined,
  };
}

export function toFeatureRequest(request: ApiFeatureRequest): FeatureRequest {
  return {
    id: request.id,
    productId: request.productId,
    title: request.title,
    description: request.description ?? "",
    userProblem: request.userProblem ?? "",
    requestedCapability: request.requestedCapability ?? "",
    relatedFeedbackIds: request.relatedFeedbackIds ?? [],
    productArea: request.productArea ?? "",
    priority: toPriority(request.priority),
    status: toRequestStatus(request.status),
    roadmapReference: request.roadmapReference ?? undefined,
  };
}

export function toProductAreaDefinition(
  area: ApiProductAreaDefinition,
): ProductAreaDefinition {
  return {
    id: area.id,
    productId: area.productId,
    name: area.name,
    description: area.description ?? "",
    summary: area.summary ?? "",
  };
}

const ISSUE_CATEGORIES = new Set([
  "Bug Report",
  "Usability Issue",
  "Performance Issue",
]);

/** Closed statuses never count as open issues on a product area. */
function isClosedStatus(status: string): boolean {
  return status === "Resolved" || status === "Archived" || status === "Declined";
}

/** Attach counts derived from the loaded feedback and request records. */
export function deriveProductAreas(
  definitions: ProductAreaDefinition[],
  feedback: FeedbackItem[],
  requests: FeatureRequest[],
): ProductArea[] {
  return definitions.map((area) => {
    const areaFeedback = feedback.filter((item) => item.productArea === area.name);
    return {
      ...area,
      feedbackCount: areaFeedback.length,
      openIssues: areaFeedback.filter(
        (item) =>
          ISSUE_CATEGORIES.has(item.category) && !isClosedStatus(item.status),
      ).length,
      featureRequests: requests.filter(
        (request) => request.productArea === area.name,
      ).length,
    };
  });
}

function toFeedbackPayload(
  input: CreateFeedbackInput | UpdateFeedbackInput,
): Record<string, unknown> {
  return {
    ...(input.title !== undefined && { title: input.title }),
    ...(input.excerpt !== undefined && { excerpt: input.excerpt }),
    ...(input.description !== undefined && {
      description: input.description,
    }),
    ...(input.category !== undefined && { category: input.category }),
    ...(input.source !== undefined && { source: input.source }),
    ...(input.date !== undefined && { date: toApiDate(input.date) }),
    ...(input.priority !== undefined && { priority: input.priority }),
    ...(input.status !== undefined && { status: input.status }),
    ...(input.productArea !== undefined && {
      productArea: input.productArea || undefined,
    }),
    ...(input.internalNotes !== undefined && {
      internalNotes: input.internalNotes,
    }),
    ...(input.followUpAction !== undefined && {
      followUpAction: input.followUpAction,
    }),
  };
}

function toThemePayload(
  input: CreateThemeInput | UpdateThemeInput,
): Record<string, unknown> {
  return {
    ...(input.name !== undefined && { name: input.name }),
    ...(input.explanation !== undefined && {
      explanation: input.explanation,
    }),
    ...(input.relatedFeedbackIds !== undefined && {
      relatedFeedbackIds: input.relatedFeedbackIds,
    }),
    ...(input.productArea !== undefined && {
      productArea: input.productArea || undefined,
    }),
    ...(input.importance !== undefined && { importance: input.importance }),
    ...(input.reviewStatus !== undefined && {
      reviewStatus: input.reviewStatus,
    }),
    ...(input.internalNotes !== undefined && {
      internalNotes: input.internalNotes,
    }),
  };
}

function toFeatureRequestPayload(
  input: CreateFeatureRequestInput | UpdateFeatureRequestInput,
): Record<string, unknown> {
  return {
    ...(input.title !== undefined && { title: input.title }),
    ...(input.description !== undefined && {
      description: input.description,
    }),
    ...(input.userProblem !== undefined && { userProblem: input.userProblem }),
    ...(input.requestedCapability !== undefined && {
      requestedCapability: input.requestedCapability,
    }),
    ...(input.relatedFeedbackIds !== undefined && {
      relatedFeedbackIds: input.relatedFeedbackIds,
    }),
    ...(input.productArea !== undefined && {
      productArea: input.productArea || undefined,
    }),
    ...(input.priority !== undefined && { priority: input.priority }),
    ...(input.status !== undefined && { status: input.status }),
    ...(input.roadmapReference !== undefined && {
      roadmapReference: input.roadmapReference,
    }),
  };
}

function toProductAreaPayload(
  input: CreateProductAreaInput | UpdateProductAreaInput,
): Record<string, unknown> {
  return {
    ...(input.name !== undefined && { name: input.name }),
    ...(input.description !== undefined && {
      description: input.description,
    }),
    ...(input.summary !== undefined && { summary: input.summary }),
  };
}

function feedbackPath(productId: string, ...segments: string[]): string {
  const suffix = segments.map(encodeURIComponent).join("/");
  return `/feedback/${encodeURIComponent(productId)}${
    suffix ? `/${suffix}` : ""
  }`;
}

/* ─── Feedback items ──────────────────────────────────────────────────────── */

export async function getFeedback(productId: string): Promise<FeedbackItem[]> {
  const items = await api.get<ApiFeedbackItem[]>(
    feedbackPath(productId, "items"),
  );
  return (items ?? []).map(toFeedbackItem);
}

export async function createFeedback(
  productId: string,
  dto: CreateFeedbackInput,
): Promise<FeedbackItem> {
  const item = await api.post<ApiFeedbackItem>(
    feedbackPath(productId, "items"),
    toFeedbackPayload(dto),
  );
  return toFeedbackItem(item);
}

export async function updateFeedback(
  productId: string,
  id: string,
  dto: UpdateFeedbackInput,
): Promise<FeedbackItem> {
  const item = await api.patch<ApiFeedbackItem>(
    feedbackPath(productId, "items", id),
    toFeedbackPayload(dto),
  );
  return toFeedbackItem(item);
}

export async function deleteFeedback(
  productId: string,
  id: string,
): Promise<void> {
  await api.delete<ApiFeedbackItem>(feedbackPath(productId, "items", id));
}

/** Summarise the product's feedback into key themes with the AI assistant. */
export async function summarizeFeedback(productId: string): Promise<string> {
  return api.post<string>(feedbackPath(productId, "ai", "summarize"));
}

/* ─── Themes ──────────────────────────────────────────────────────────────── */

export async function getThemes(productId: string): Promise<Theme[]> {
  const themes = await api.get<ApiTheme[]>(
    feedbackPath(productId, "themes"),
  );
  return (themes ?? []).map(toTheme);
}

export async function createTheme(
  productId: string,
  dto: CreateThemeInput,
): Promise<Theme> {
  const theme = await api.post<ApiTheme>(
    feedbackPath(productId, "themes"),
    toThemePayload(dto),
  );
  return toTheme(theme);
}

export async function updateTheme(
  productId: string,
  id: string,
  dto: UpdateThemeInput,
): Promise<Theme> {
  const theme = await api.patch<ApiTheme>(
    feedbackPath(productId, "themes", id),
    toThemePayload(dto),
  );
  return toTheme(theme);
}

export async function deleteTheme(
  productId: string,
  id: string,
): Promise<void> {
  await api.delete<ApiTheme>(feedbackPath(productId, "themes", id));
}

/* ─── Feature requests ────────────────────────────────────────────────────── */

export async function getFeatureRequests(
  productId: string,
): Promise<FeatureRequest[]> {
  const requests = await api.get<ApiFeatureRequest[]>(
    feedbackPath(productId, "requests"),
  );
  return (requests ?? []).map(toFeatureRequest);
}

export async function createFeatureRequest(
  productId: string,
  dto: CreateFeatureRequestInput,
): Promise<FeatureRequest> {
  const request = await api.post<ApiFeatureRequest>(
    feedbackPath(productId, "requests"),
    toFeatureRequestPayload(dto),
  );
  return toFeatureRequest(request);
}

export async function updateFeatureRequest(
  productId: string,
  id: string,
  dto: UpdateFeatureRequestInput,
): Promise<FeatureRequest> {
  const request = await api.patch<ApiFeatureRequest>(
    feedbackPath(productId, "requests", id),
    toFeatureRequestPayload(dto),
  );
  return toFeatureRequest(request);
}

export async function deleteFeatureRequest(
  productId: string,
  id: string,
): Promise<void> {
  await api.delete<ApiFeatureRequest>(
    feedbackPath(productId, "requests", id),
  );
}

/* ─── Product areas ───────────────────────────────────────────────────────── */

export async function getProductAreas(
  productId: string,
): Promise<ProductAreaDefinition[]> {
  const areas = await api.get<ApiProductAreaDefinition[]>(
    feedbackPath(productId, "areas"),
  );
  return (areas ?? []).map(toProductAreaDefinition);
}

export async function createProductArea(
  productId: string,
  dto: CreateProductAreaInput,
): Promise<ProductAreaDefinition> {
  const area = await api.post<ApiProductAreaDefinition>(
    feedbackPath(productId, "areas"),
    toProductAreaPayload(dto),
  );
  return toProductAreaDefinition(area);
}

export async function updateProductArea(
  productId: string,
  id: string,
  dto: UpdateProductAreaInput,
): Promise<ProductAreaDefinition> {
  const area = await api.patch<ApiProductAreaDefinition>(
    feedbackPath(productId, "areas", id),
    toProductAreaPayload(dto),
  );
  return toProductAreaDefinition(area);
}

export async function deleteProductArea(
  productId: string,
  id: string,
): Promise<void> {
  await api.delete<ApiProductAreaDefinition>(
    feedbackPath(productId, "areas", id),
  );
}
