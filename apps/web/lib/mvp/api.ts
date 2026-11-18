import { api } from "../apiClient";

import type {
  Feature,
  FeaturePriority,
  FeatureScope,
  FeatureStatus,
  MVPProject,
  MVPStructure,
  ScopeCategory,
  ScopeItem,
} from "../mvp-studio/types";

/* ---------------------------------------------------------------- API rows ---
 * Shapes returned by the `/mvp` endpoints. They mirror the Prisma models:
 * status/priority/scope columns arrive as the same labels the interface uses,
 * while dates arrive as full ISO timestamps and `structure` as loose JSON.
 */

export type ApiMvpProject = {
  id: string;
  productId: string;
  name: string;
  ref: string | null;
  status: string;
  concept: string | null;
  problem: string | null;
  targetAudience: string | null;
  valueProp: string | null;
  mvpObjective: string | null;
  currentScope: string | null;
  essentialCapabilities: string[];
  explicitExclusions: string[];
  successCriteria: string[];
  structure: unknown;
  openDecisions: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type ApiFeature = {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  userProblem: string | null;
  targetUser: string | null;
  area: string | null;
  priority: string;
  scope: string;
  status: string;
  userStory: string | null;
  acceptanceCriteria: string[];
  behavior: string | null;
  edgeCases: string[];
  dependencies: string[];
  openQuestions: string[];
  designNotes: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiScopeItem = {
  id: string;
  projectId: string;
  name: string;
  explanation: string | null;
  category: string;
  status: string;
  featureId: string | null;
  createdAt?: string;
  updatedAt?: string;
};

/* ---------------------------------------------------------------- payloads ---
 * Frontend payloads use the same labels the UI renders. Update payloads are
 * entirely optional so partial saves stay partial.
 */

export type CreateProjectInput = {
  name: string;
  ref?: string;
  status?: string;
  concept?: string;
  problem?: string;
  targetAudience?: string;
  valueProp?: string;
  mvpObjective?: string;
  currentScope?: string;
  essentialCapabilities?: string[];
  explicitExclusions?: string[];
  successCriteria?: string[];
  structure?: MVPStructure;
  openDecisions?: string[];
};

export type UpdateProjectInput = Partial<CreateProjectInput>;

export type CreateFeatureInput = {
  name: string;
  description?: string;
  userProblem?: string;
  targetUser?: string;
  area?: string;
  priority?: FeaturePriority;
  scope?: FeatureScope;
  status?: FeatureStatus;
  userStory?: string;
  acceptanceCriteria?: string[];
  behavior?: string;
  edgeCases?: string[];
  dependencies?: string[];
  openQuestions?: string[];
  designNotes?: string;
};

export type UpdateFeatureInput = Partial<CreateFeatureInput>;

export type CreateScopeItemInput = {
  name: string;
  explanation?: string;
  category?: ScopeCategory;
  status?: string;
  featureId?: string;
};

export type UpdateScopeItemInput = Partial<CreateScopeItemInput>;

/* ---------------------------------------------------------------- mappings --- */

const FEATURE_PRIORITIES: FeaturePriority[] = ["Critical", "High", "Medium", "Low"];
const FEATURE_SCOPES: FeatureScope[] = [
  "Must Have",
  "Should Have",
  "Could Have",
  "Out of Scope",
];
const FEATURE_STATUSES: FeatureStatus[] = [
  "Proposed",
  "Ready",
  "In Progress",
  "Completed",
  "Deferred",
];
const SCOPE_CATEGORIES: ScopeCategory[] = ["included", "later", "excluded"];

function toPriority(value: string): FeaturePriority {
  return FEATURE_PRIORITIES.includes(value as FeaturePriority)
    ? (value as FeaturePriority)
    : "Medium";
}

function toScope(value: string): FeatureScope {
  return FEATURE_SCOPES.includes(value as FeatureScope)
    ? (value as FeatureScope)
    : "Could Have";
}

function toStatus(value: string): FeatureStatus {
  return FEATURE_STATUSES.includes(value as FeatureStatus)
    ? (value as FeatureStatus)
    : "Proposed";
}

function toCategory(value: string): ScopeCategory {
  return SCOPE_CATEGORIES.includes(value as ScopeCategory)
    ? (value as ScopeCategory)
    : "included";
}

/** The workspace renders `structure.areas`/`structure.journey` directly. */
function toStructure(value: unknown): MVPStructure {
  const record = (value ?? {}) as Partial<MVPStructure>;
  return {
    areas: Array.isArray(record.areas) ? record.areas : [],
    journey: Array.isArray(record.journey) ? record.journey : [],
  };
}

export function toMvpProject(project: ApiMvpProject): MVPProject {
  return {
    id: project.id,
    name: project.name,
    ref: project.ref ?? project.id.slice(0, 8),
    status: project.status,
    concept: project.concept ?? "",
    problem: project.problem ?? "",
    targetAudience: project.targetAudience ?? "",
    valueProp: project.valueProp ?? "",
    mvpObjective: project.mvpObjective ?? "",
    currentScope: project.currentScope ?? "",
    essentialCapabilities: project.essentialCapabilities ?? [],
    explicitExclusions: project.explicitExclusions ?? [],
    successCriteria: project.successCriteria ?? [],
    structure: toStructure(project.structure),
    openDecisions: project.openDecisions ?? [],
  };
}

export function toFeature(feature: ApiFeature): Feature {
  return {
    id: feature.id,
    projectId: feature.projectId,
    name: feature.name,
    description: feature.description ?? "",
    userProblem: feature.userProblem ?? "",
    targetUser: feature.targetUser ?? "",
    area: feature.area ?? "",
    priority: toPriority(feature.priority),
    scope: toScope(feature.scope),
    status: toStatus(feature.status),
    userStory: feature.userStory ?? "",
    acceptanceCriteria: feature.acceptanceCriteria ?? [],
    behavior: feature.behavior ?? "",
    edgeCases: feature.edgeCases ?? [],
    dependencies: feature.dependencies ?? [],
    openQuestions: feature.openQuestions ?? [],
    designNotes: feature.designNotes ?? "",
  };
}

export function toScopeItem(item: ApiScopeItem): ScopeItem {
  return {
    id: item.id,
    projectId: item.projectId,
    name: item.name,
    explanation: item.explanation ?? "",
    category: toCategory(item.category),
    status: item.status,
    ...(item.featureId ? { featureId: item.featureId } : {}),
  };
}

/** Build the payload the DTO accepts, dropping undefined optional fields. */
function toProjectPayload(
  input: CreateProjectInput | UpdateProjectInput,
): Record<string, unknown> {
  return {
    ...(input.name !== undefined && { name: input.name }),
    ...(input.ref !== undefined && { ref: input.ref }),
    ...(input.status !== undefined && { status: input.status }),
    ...(input.concept !== undefined && { concept: input.concept }),
    ...(input.problem !== undefined && { problem: input.problem }),
    ...(input.targetAudience !== undefined && {
      targetAudience: input.targetAudience,
    }),
    ...(input.valueProp !== undefined && { valueProp: input.valueProp }),
    ...(input.mvpObjective !== undefined && {
      mvpObjective: input.mvpObjective,
    }),
    ...(input.currentScope !== undefined && {
      currentScope: input.currentScope,
    }),
    ...(input.essentialCapabilities !== undefined && {
      essentialCapabilities: input.essentialCapabilities,
    }),
    ...(input.explicitExclusions !== undefined && {
      explicitExclusions: input.explicitExclusions,
    }),
    ...(input.successCriteria !== undefined && {
      successCriteria: input.successCriteria,
    }),
    ...(input.structure !== undefined && { structure: input.structure }),
    ...(input.openDecisions !== undefined && {
      openDecisions: input.openDecisions,
    }),
  };
}

function toFeaturePayload(
  input: CreateFeatureInput | UpdateFeatureInput,
): Record<string, unknown> {
  return {
    ...(input.name !== undefined && { name: input.name }),
    ...(input.description !== undefined && {
      description: input.description,
    }),
    ...(input.userProblem !== undefined && { userProblem: input.userProblem }),
    ...(input.targetUser !== undefined && { targetUser: input.targetUser }),
    ...(input.area !== undefined && { area: input.area }),
    ...(input.priority !== undefined && { priority: input.priority }),
    ...(input.scope !== undefined && { scope: input.scope }),
    ...(input.status !== undefined && { status: input.status }),
    ...(input.userStory !== undefined && { userStory: input.userStory }),
    ...(input.acceptanceCriteria !== undefined && {
      acceptanceCriteria: input.acceptanceCriteria,
    }),
    ...(input.behavior !== undefined && { behavior: input.behavior }),
    ...(input.edgeCases !== undefined && { edgeCases: input.edgeCases }),
    ...(input.dependencies !== undefined && {
      dependencies: input.dependencies,
    }),
    ...(input.openQuestions !== undefined && {
      openQuestions: input.openQuestions,
    }),
    ...(input.designNotes !== undefined && { designNotes: input.designNotes }),
  };
}

function toScopeItemPayload(
  input: CreateScopeItemInput | UpdateScopeItemInput,
): Record<string, unknown> {
  return {
    ...(input.name !== undefined && { name: input.name }),
    ...(input.explanation !== undefined && {
      explanation: input.explanation,
    }),
    ...(input.category !== undefined && { category: input.category }),
    ...(input.status !== undefined && { status: input.status }),
    ...(input.featureId !== undefined && { featureId: input.featureId }),
  };
}

function mvpPath(productId: string, ...segments: string[]): string {
  const suffix = segments.map(encodeURIComponent).join("/");
  return `/mvp/${encodeURIComponent(productId)}${
    suffix ? `/${suffix}` : ""
  }`;
}

function projectPath(
  productId: string,
  projectId: string,
  ...segments: string[]
): string {
  return mvpPath(productId, "projects", projectId, ...segments);
}

/* ─── Projects ────────────────────────────────────────────────────────────── */

export async function getProjects(productId: string): Promise<MVPProject[]> {
  const projects = await api.get<ApiMvpProject[]>(
    mvpPath(productId, "projects"),
  );
  return (projects ?? []).map(toMvpProject);
}

export async function getProject(
  productId: string,
  id: string,
): Promise<MVPProject> {
  const project = await api.get<ApiMvpProject>(
    mvpPath(productId, "projects", id),
  );
  return toMvpProject(project);
}

export async function createProject(
  productId: string,
  dto: CreateProjectInput,
): Promise<MVPProject> {
  const project = await api.post<ApiMvpProject>(
    mvpPath(productId, "projects"),
    toProjectPayload(dto),
  );
  return toMvpProject(project);
}

export async function updateProject(
  productId: string,
  id: string,
  dto: UpdateProjectInput,
): Promise<MVPProject> {
  const project = await api.patch<ApiMvpProject>(
    mvpPath(productId, "projects", id),
    toProjectPayload(dto),
  );
  return toMvpProject(project);
}

export async function deleteProject(
  productId: string,
  id: string,
): Promise<void> {
  await api.delete<ApiMvpProject>(mvpPath(productId, "projects", id));
}

export async function suggestFeatures(
  productId: string,
  projectId: string,
): Promise<string> {
  return api.post<string>(projectPath(productId, projectId, "ai", "suggest-features"));
}

/* ─── Features ────────────────────────────────────────────────────────────── */

export async function getFeatures(
  productId: string,
  projectId: string,
): Promise<Feature[]> {
  const features = await api.get<ApiFeature[]>(
    projectPath(productId, projectId, "features"),
  );
  return (features ?? []).map(toFeature);
}

export async function getFeature(
  productId: string,
  projectId: string,
  id: string,
): Promise<Feature> {
  const feature = await api.get<ApiFeature>(
    projectPath(productId, projectId, "features", id),
  );
  return toFeature(feature);
}

export async function createFeature(
  productId: string,
  projectId: string,
  dto: CreateFeatureInput,
): Promise<Feature> {
  const feature = await api.post<ApiFeature>(
    projectPath(productId, projectId, "features"),
    toFeaturePayload(dto),
  );
  return toFeature(feature);
}

export async function updateFeature(
  productId: string,
  projectId: string,
  id: string,
  dto: UpdateFeatureInput,
): Promise<Feature> {
  const feature = await api.patch<ApiFeature>(
    projectPath(productId, projectId, "features", id),
    toFeaturePayload(dto),
  );
  return toFeature(feature);
}

export async function deleteFeature(
  productId: string,
  projectId: string,
  id: string,
): Promise<void> {
  await api.delete<ApiFeature>(
    projectPath(productId, projectId, "features", id),
  );
}

export async function generateUserStory(
  productId: string,
  projectId: string,
  id: string,
): Promise<string> {
  return api.post<string>(
    projectPath(productId, projectId, "features", id, "ai", "user-story"),
  );
}

/* ─── Scope items ─────────────────────────────────────────────────────────── */

export async function getScopeItems(
  productId: string,
  projectId: string,
): Promise<ScopeItem[]> {
  const items = await api.get<ApiScopeItem[]>(
    projectPath(productId, projectId, "scope"),
  );
  return (items ?? []).map(toScopeItem);
}

export async function createScopeItem(
  productId: string,
  projectId: string,
  dto: CreateScopeItemInput,
): Promise<ScopeItem> {
  const item = await api.post<ApiScopeItem>(
    projectPath(productId, projectId, "scope"),
    toScopeItemPayload(dto),
  );
  return toScopeItem(item);
}

export async function updateScopeItem(
  productId: string,
  projectId: string,
  id: string,
  dto: UpdateScopeItemInput,
): Promise<ScopeItem> {
  const item = await api.patch<ApiScopeItem>(
    projectPath(productId, projectId, "scope", id),
    toScopeItemPayload(dto),
  );
  return toScopeItem(item);
}

export async function deleteScopeItem(
  productId: string,
  projectId: string,
  id: string,
): Promise<void> {
  await api.delete<ApiScopeItem>(
    projectPath(productId, projectId, "scope", id),
  );
}
