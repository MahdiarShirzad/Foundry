import { api } from "../apiClient";

import type {
  Channel,
  ChecklistItem,
  LaunchAsset,
  LaunchAssetStatus,
  LaunchPhase,
  LaunchTask,
  LaunchTaskStatus,
} from "../launch-center/types";

/* ---------------------------------------------------------------- API rows ---
 * Shapes returned by the `/launch` endpoints. They mirror the Prisma models:
 * dates arrive as full ISO timestamps or `null`, while phase/status arrive as
 * the same labels the interface renders.
 */

export type ApiLaunchTask = {
  id: string;
  productId: string;
  title: string;
  description: string | null;
  phase: string;
  date: string | null;
  status: string;
  owner: string | null;
  relatedAssetId: string | null;
  relatedChannelId: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiLaunchAsset = {
  id: string;
  productId: string;
  title: string;
  type: string | null;
  preview: string | null;
  status: string;
  lastUpdated: string | null;
  relatedChannelId: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiChannel = {
  id: string;
  productId: string;
  name: string;
  campaignObjective: string | null;
  targetAudience: string | null;
  plannedActivity: string | null;
  phase: string;
  status: string;
  relatedAssetIds: string[];
  date: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiChecklistItem = {
  id: string;
  productId: string;
  category: string;
  item: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
};

/* ---------------------------------------------------------------- payloads ---
 * Update payloads are entirely optional so partial saves stay partial.
 */

export type CreateLaunchTaskInput = {
  title: string;
  description?: string;
  phase?: LaunchPhase;
  date?: string;
  status?: LaunchTaskStatus;
  owner?: string;
  relatedAssetId?: string;
  relatedChannelId?: string;
};

export type UpdateLaunchTaskInput = Partial<CreateLaunchTaskInput>;

export type CreateLaunchAssetInput = {
  title: string;
  type?: string;
  preview?: string;
  status?: LaunchAssetStatus;
  lastUpdated?: string;
  relatedChannelId?: string;
};

export type UpdateLaunchAssetInput = Partial<CreateLaunchAssetInput>;

export type CreateChannelInput = {
  name: string;
  campaignObjective?: string;
  targetAudience?: string;
  plannedActivity?: string;
  phase?: LaunchPhase;
  status?: LaunchTaskStatus;
  relatedAssetIds?: string[];
  date?: string;
};

export type UpdateChannelInput = Partial<CreateChannelInput>;

export type CreateChecklistItemInput = {
  item: string;
  category?: string;
  completed?: boolean;
};

export type UpdateChecklistItemInput = Partial<CreateChecklistItemInput>;

/* ---------------------------------------------------------------- mappings --- */

const LAUNCH_PHASES: LaunchPhase[] = [
  "Preparation",
  "Pre-launch",
  "Launch Day",
  "Post-launch",
];
const TASK_STATUSES: LaunchTaskStatus[] = [
  "Not Started",
  "In Progress",
  "Completed",
  "Blocked",
];
const ASSET_STATUSES: LaunchAssetStatus[] = [
  "Draft",
  "In Review",
  "Ready",
  "Published",
];

function toPhase(value: string): LaunchPhase {
  return LAUNCH_PHASES.includes(value as LaunchPhase)
    ? (value as LaunchPhase)
    : "Preparation";
}

function toTaskStatus(value: string): LaunchTaskStatus {
  return TASK_STATUSES.includes(value as LaunchTaskStatus)
    ? (value as LaunchTaskStatus)
    : "Not Started";
}

function toAssetStatus(value: string): LaunchAssetStatus {
  return ASSET_STATUSES.includes(value as LaunchAssetStatus)
    ? (value as LaunchAssetStatus)
    : "Draft";
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

export function toLaunchTask(task: ApiLaunchTask): LaunchTask {
  return {
    id: task.id,
    productId: task.productId,
    title: task.title,
    description: task.description ?? "",
    phase: toPhase(task.phase),
    date: toDateOnly(task.date),
    status: toTaskStatus(task.status),
    owner: task.owner ?? undefined,
    relatedAssetId: task.relatedAssetId ?? undefined,
    relatedChannelId: task.relatedChannelId ?? undefined,
  };
}

export function toLaunchAsset(asset: ApiLaunchAsset): LaunchAsset {
  return {
    id: asset.id,
    productId: asset.productId,
    title: asset.title,
    type: asset.type ?? "",
    preview: asset.preview ?? "",
    status: toAssetStatus(asset.status),
    lastUpdated: toDateOnly(asset.lastUpdated),
    relatedChannelId: asset.relatedChannelId ?? undefined,
  };
}

export function toChannel(channel: ApiChannel): Channel {
  return {
    id: channel.id,
    productId: channel.productId,
    name: channel.name,
    campaignObjective: channel.campaignObjective ?? "",
    targetAudience: channel.targetAudience ?? "",
    plannedActivity: channel.plannedActivity ?? "",
    phase: toPhase(channel.phase),
    status: toTaskStatus(channel.status),
    relatedAssetIds: channel.relatedAssetIds ?? [],
    date: toDateOnly(channel.date),
  };
}

export function toChecklistItem(item: ApiChecklistItem): ChecklistItem {
  return {
    id: item.id,
    productId: item.productId,
    category: item.category,
    item: item.item,
    completed: item.completed,
  };
}

function toTaskPayload(
  input: CreateLaunchTaskInput | UpdateLaunchTaskInput,
): Record<string, unknown> {
  return {
    ...(input.title !== undefined && { title: input.title }),
    ...(input.description !== undefined && {
      description: input.description,
    }),
    ...(input.phase !== undefined && { phase: input.phase }),
    ...(input.date !== undefined && { date: toApiDate(input.date) }),
    ...(input.status !== undefined && { status: input.status }),
    ...(input.owner !== undefined && { owner: input.owner }),
    ...(input.relatedAssetId !== undefined && {
      relatedAssetId: input.relatedAssetId || undefined,
    }),
    ...(input.relatedChannelId !== undefined && {
      relatedChannelId: input.relatedChannelId || undefined,
    }),
  };
}

function toAssetPayload(
  input: CreateLaunchAssetInput | UpdateLaunchAssetInput,
): Record<string, unknown> {
  return {
    ...(input.title !== undefined && { title: input.title }),
    ...(input.type !== undefined && { type: input.type }),
    ...(input.preview !== undefined && { preview: input.preview }),
    ...(input.status !== undefined && { status: input.status }),
    ...(input.lastUpdated !== undefined && {
      lastUpdated: toApiDate(input.lastUpdated),
    }),
    ...(input.relatedChannelId !== undefined && {
      relatedChannelId: input.relatedChannelId || undefined,
    }),
  };
}

function toChannelPayload(
  input: CreateChannelInput | UpdateChannelInput,
): Record<string, unknown> {
  return {
    ...(input.name !== undefined && { name: input.name }),
    ...(input.campaignObjective !== undefined && {
      campaignObjective: input.campaignObjective,
    }),
    ...(input.targetAudience !== undefined && {
      targetAudience: input.targetAudience,
    }),
    ...(input.plannedActivity !== undefined && {
      plannedActivity: input.plannedActivity,
    }),
    ...(input.phase !== undefined && { phase: input.phase }),
    ...(input.status !== undefined && { status: input.status }),
    ...(input.relatedAssetIds !== undefined && {
      relatedAssetIds: input.relatedAssetIds,
    }),
    ...(input.date !== undefined && { date: toApiDate(input.date) }),
  };
}

function toChecklistPayload(
  input: CreateChecklistItemInput | UpdateChecklistItemInput,
): Record<string, unknown> {
  return {
    ...(input.item !== undefined && { item: input.item }),
    ...(input.category !== undefined && { category: input.category }),
    ...(input.completed !== undefined && { completed: input.completed }),
  };
}

function launchPath(productId: string, ...segments: string[]): string {
  const suffix = segments.map(encodeURIComponent).join("/");
  return `/launch/${encodeURIComponent(productId)}${
    suffix ? `/${suffix}` : ""
  }`;
}

/* ─── Tasks ───────────────────────────────────────────────────────────────── */

export async function getTasks(productId: string): Promise<LaunchTask[]> {
  const tasks = await api.get<ApiLaunchTask[]>(
    launchPath(productId, "tasks"),
  );
  return (tasks ?? []).map(toLaunchTask);
}

export async function createTask(
  productId: string,
  dto: CreateLaunchTaskInput,
): Promise<LaunchTask> {
  const task = await api.post<ApiLaunchTask>(
    launchPath(productId, "tasks"),
    toTaskPayload(dto),
  );
  return toLaunchTask(task);
}

export async function updateTask(
  productId: string,
  id: string,
  dto: UpdateLaunchTaskInput,
): Promise<LaunchTask> {
  const task = await api.patch<ApiLaunchTask>(
    launchPath(productId, "tasks", id),
    toTaskPayload(dto),
  );
  return toLaunchTask(task);
}

export async function deleteTask(
  productId: string,
  id: string,
): Promise<void> {
  await api.delete<ApiLaunchTask>(launchPath(productId, "tasks", id));
}

/** Suggest a go-to-market checklist from the product's concept. */
export async function suggestTasks(productId: string): Promise<string> {
  return api.post<string>(launchPath(productId, "ai", "suggest-tasks"));
}

/* ─── Assets ──────────────────────────────────────────────────────────────── */

export async function getAssets(productId: string): Promise<LaunchAsset[]> {
  const assets = await api.get<ApiLaunchAsset[]>(
    launchPath(productId, "assets"),
  );
  return (assets ?? []).map(toLaunchAsset);
}

export async function createAsset(
  productId: string,
  dto: CreateLaunchAssetInput,
): Promise<LaunchAsset> {
  const asset = await api.post<ApiLaunchAsset>(
    launchPath(productId, "assets"),
    toAssetPayload(dto),
  );
  return toLaunchAsset(asset);
}

export async function updateAsset(
  productId: string,
  id: string,
  dto: UpdateLaunchAssetInput,
): Promise<LaunchAsset> {
  const asset = await api.patch<ApiLaunchAsset>(
    launchPath(productId, "assets", id),
    toAssetPayload(dto),
  );
  return toLaunchAsset(asset);
}

export async function deleteAsset(
  productId: string,
  id: string,
): Promise<void> {
  await api.delete<ApiLaunchAsset>(launchPath(productId, "assets", id));
}

/* ─── Channels ────────────────────────────────────────────────────────────── */

export async function getChannels(productId: string): Promise<Channel[]> {
  const channels = await api.get<ApiChannel[]>(
    launchPath(productId, "channels"),
  );
  return (channels ?? []).map(toChannel);
}

export async function createChannel(
  productId: string,
  dto: CreateChannelInput,
): Promise<Channel> {
  const channel = await api.post<ApiChannel>(
    launchPath(productId, "channels"),
    toChannelPayload(dto),
  );
  return toChannel(channel);
}

export async function updateChannel(
  productId: string,
  id: string,
  dto: UpdateChannelInput,
): Promise<Channel> {
  const channel = await api.patch<ApiChannel>(
    launchPath(productId, "channels", id),
    toChannelPayload(dto),
  );
  return toChannel(channel);
}

export async function deleteChannel(
  productId: string,
  id: string,
): Promise<void> {
  await api.delete<ApiChannel>(launchPath(productId, "channels", id));
}

/* ─── Checklist ───────────────────────────────────────────────────────────── */

export async function getChecklist(
  productId: string,
): Promise<ChecklistItem[]> {
  const items = await api.get<ApiChecklistItem[]>(
    launchPath(productId, "checklist"),
  );
  return (items ?? []).map(toChecklistItem);
}

export async function createChecklistItem(
  productId: string,
  dto: CreateChecklistItemInput,
): Promise<ChecklistItem> {
  const item = await api.post<ApiChecklistItem>(
    launchPath(productId, "checklist"),
    toChecklistPayload(dto),
  );
  return toChecklistItem(item);
}

export async function updateChecklistItem(
  productId: string,
  id: string,
  dto: UpdateChecklistItemInput,
): Promise<ChecklistItem> {
  const item = await api.patch<ApiChecklistItem>(
    launchPath(productId, "checklist", id),
    toChecklistPayload(dto),
  );
  return toChecklistItem(item);
}

export async function deleteChecklistItem(
  productId: string,
  id: string,
): Promise<void> {
  await api.delete<ApiChecklistItem>(launchPath(productId, "checklist", id));
}
