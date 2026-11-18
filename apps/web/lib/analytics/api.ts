import { api } from "../apiClient";

import type {
  AnalyticsDataset,
  AnalyticsKpi,
  AnalyticsReport,
  Delta,
  MetricCategory,
  MetricDefinition,
  Observation,
  ObservationType,
  RangeKey,
  SeriesKey,
  WeekSample,
} from "../founder-analytics/types";

import { METRIC_CATALOG, type MetricCatalogEntry } from "./selectors";

/* ---------------------------------------------------------------- API rows ---
 * Shapes returned by the `/analytics` endpoints. They mirror the Prisma
 * models: `start`, `updated` and the sample dates arrive as full ISO
 * timestamps or `null`; JSON columns arrive as loose objects.
 */

export type ApiWeekSample = {
  id: string;
  productId: string;
  start: string;
  active: number;
  newUsers: number;
  sessions: number;
  avgMinutes: number;
  perUser: number;
  returnRate: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiMetricDefinition = {
  id: string;
  productId: string;
  name: string;
  definition: string | null;
  category: string;
  unit: string | null;
  note: string | null;
  seriesKey: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiObservation = {
  id: string;
  productId: string;
  title: string;
  description: string | null;
  metricId: string | null;
  type: string;
  nextStep: string | null;
  sample: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiAnalyticsReport = {
  id: string;
  productId: string;
  title: string;
  description: string | null;
  category: string;
  period: string | null;
  updated: string | null;
  paragraphs: string[];
  values: unknown;
  chart: unknown;
  bars: unknown;
  createdAt?: string;
  updatedAt?: string;
};

/* ---------------------------------------------------------------- payloads ---
 * Update payloads are entirely optional so partial saves stay partial.
 */

export type CreateWeekSampleInput = {
  start: string;
  active?: number;
  newUsers?: number;
  sessions?: number;
  avgMinutes?: number;
  perUser?: number;
  returnRate?: number;
};

export type UpdateWeekSampleInput = Partial<CreateWeekSampleInput>;

export type CreateMetricInput = {
  name: string;
  definition?: string;
  category?: MetricCategory;
  unit?: string;
  note?: string;
  seriesKey?: SeriesKey;
};

export type UpdateMetricInput = Partial<CreateMetricInput>;

export type CreateObservationInput = {
  title: string;
  description?: string;
  metricId?: string;
  type?: ObservationType;
  nextStep?: string;
  sample?: boolean;
};

export type UpdateObservationInput = Partial<CreateObservationInput>;

export type CreateReportInput = {
  title: string;
  description?: string;
  category?: string;
  period?: string;
  updated?: string;
  paragraphs?: string[];
  values?: AnalyticsReport["values"];
  chart?: AnalyticsReport["chart"];
  bars?: AnalyticsReport["bars"];
};

export type UpdateReportInput = Partial<CreateReportInput>;

/** Everything the workspace needs to assemble one product's dataset. */
export type AnalyticsDatasetSource = {
  weeks: WeekSample[];
  metrics: MetricDefinition[];
  observations: Observation[];
  reports: AnalyticsReport[];
};

/* ---------------------------------------------------------------- mappings --- */

const METRIC_CATEGORIES: MetricCategory[] = [
  "Acquisition",
  "Activity",
  "Engagement",
  "Retention",
];

const SERIES_KEYS: SeriesKey[] = [
  "active",
  "newUsers",
  "sessions",
  "avgMinutes",
  "perUser",
  "returnRate",
];

const OBSERVATION_TYPES: ObservationType[] = [
  "Pattern",
  "Question",
  "Risk",
  "Opportunity",
];

function toMetricCategory(value: string): MetricCategory {
  return METRIC_CATEGORIES.includes(value as MetricCategory)
    ? (value as MetricCategory)
    : "Activity";
}

function toSeriesKey(value: string | null | undefined): SeriesKey | null {
  if (!value) return null;
  return SERIES_KEYS.includes(value as SeriesKey) ? (value as SeriesKey) : null;
}

function toObservationType(value: string): ObservationType {
  return OBSERVATION_TYPES.includes(value as ObservationType)
    ? (value as ObservationType)
    : "Pattern";
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

export function toWeekSample(sample: ApiWeekSample): WeekSample {
  return {
    start: toDateOnly(sample.start),
    active: sample.active,
    newUsers: sample.newUsers,
    sessions: sample.sessions,
    avgMinutes: sample.avgMinutes,
    perUser: sample.perUser,
    returnRate: sample.returnRate,
  };
}

export function toMetricDefinition(metric: ApiMetricDefinition): MetricDefinition {
  return {
    id: metric.id,
    name: metric.name,
    definition: metric.definition ?? "",
    category: toMetricCategory(metric.category),
    unit: metric.unit ?? "",
    note: metric.note ?? "",
    seriesKey: toSeriesKey(metric.seriesKey),
  };
}

export function toObservation(observation: ApiObservation): Observation {
  return {
    id: observation.id,
    productId: observation.productId,
    title: observation.title,
    description: observation.description ?? "",
    metricId: observation.metricId ?? "",
    type: toObservationType(observation.type),
    nextStep: observation.nextStep ?? "",
    sample: observation.sample,
  };
}

function toReportValues(value: unknown): AnalyticsReport["values"] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (entry): entry is { label: string; value: string } =>
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as Record<string, unknown>).label === "string" &&
        typeof (entry as Record<string, unknown>).value === "string",
    )
    .map((entry) => ({ label: entry.label, value: entry.value }));
}

function toReportChart(value: unknown): AnalyticsReport["chart"] {
  if (typeof value !== "object" || value === null) return undefined;
  const record = value as Record<string, unknown>;
  const seriesKey = toSeriesKey(
    typeof record.seriesKey === "string" ? record.seriesKey : null,
  );
  if (!seriesKey || typeof record.title !== "string") return undefined;
  return { seriesKey, title: record.title };
}

function toReportBars(value: unknown): AnalyticsReport["bars"] {
  if (typeof value !== "object" || value === null) return undefined;
  const record = value as Record<string, unknown>;
  if (typeof record.label !== "string" || !Array.isArray(record.rows)) {
    return undefined;
  }
  const rows = record.rows
    .filter(
      (row): row is { label: string; value: number } =>
        typeof row === "object" &&
        row !== null &&
        typeof (row as Record<string, unknown>).label === "string" &&
        typeof (row as Record<string, unknown>).value === "number",
    )
    .map((row) => ({ label: row.label, value: row.value }));
  return { label: record.label, rows };
}

export function toAnalyticsReport(report: ApiAnalyticsReport): AnalyticsReport {
  return {
    id: report.id,
    title: report.title,
    description: report.description ?? "",
    category: report.category,
    period: report.period ?? "",
    updated: toDateOnly(report.updated),
    paragraphs: report.paragraphs ?? [],
    values: toReportValues(report.values),
    chart: toReportChart(report.chart),
    bars: toReportBars(report.bars),
  };
}

function toWeekSamplePayload(
  input: CreateWeekSampleInput | UpdateWeekSampleInput,
): Record<string, unknown> {
  return {
    ...(input.start !== undefined && { start: toApiDate(input.start) }),
    ...(input.active !== undefined && { active: input.active }),
    ...(input.newUsers !== undefined && { newUsers: input.newUsers }),
    ...(input.sessions !== undefined && { sessions: input.sessions }),
    ...(input.avgMinutes !== undefined && { avgMinutes: input.avgMinutes }),
    ...(input.perUser !== undefined && { perUser: input.perUser }),
    ...(input.returnRate !== undefined && { returnRate: input.returnRate }),
  };
}

function toMetricPayload(
  input: CreateMetricInput | UpdateMetricInput,
): Record<string, unknown> {
  return {
    ...(input.name !== undefined && { name: input.name }),
    ...(input.definition !== undefined && {
      definition: input.definition,
    }),
    ...(input.category !== undefined && { category: input.category }),
    ...(input.unit !== undefined && { unit: input.unit }),
    ...(input.note !== undefined && { note: input.note }),
    ...(input.seriesKey !== undefined && { seriesKey: input.seriesKey }),
  };
}

function toObservationPayload(
  input: CreateObservationInput | UpdateObservationInput,
): Record<string, unknown> {
  return {
    ...(input.title !== undefined && { title: input.title }),
    ...(input.description !== undefined && {
      description: input.description,
    }),
    ...(input.metricId !== undefined && {
      metricId: input.metricId || undefined,
    }),
    ...(input.type !== undefined && { type: input.type }),
    ...(input.nextStep !== undefined && { nextStep: input.nextStep }),
    ...(input.sample !== undefined && { sample: input.sample }),
  };
}

function toReportPayload(
  input: CreateReportInput | UpdateReportInput,
): Record<string, unknown> {
  return {
    ...(input.title !== undefined && { title: input.title }),
    ...(input.description !== undefined && {
      description: input.description,
    }),
    ...(input.category !== undefined && { category: input.category }),
    ...(input.period !== undefined && { period: input.period }),
    ...(input.updated !== undefined && { updated: toApiDate(input.updated) }),
    ...(input.paragraphs !== undefined && {
      paragraphs: input.paragraphs,
    }),
    ...(input.values !== undefined && { values: input.values }),
    ...(input.chart !== undefined && { chart: input.chart }),
    ...(input.bars !== undefined && { bars: input.bars }),
  };
}

function analyticsPath(productId: string, ...segments: string[]): string {
  const suffix = segments.map(encodeURIComponent).join("/");
  return `/analytics/${encodeURIComponent(productId)}${
    suffix ? `/${suffix}` : ""
  }`;
}

/* ─── Dataset assembly ────────────────────────────────────────────────────── */

function formatMetricValue(value: number, format: "int" | "decimal" | "percent"): string {
  if (format === "percent") return `${Math.round(value)}%`;
  if (format === "decimal") {
    return Number(value.toFixed(2)).toLocaleString("en-US");
  }
  return Math.round(value).toLocaleString("en-US");
}

function formatDelta(current: number, previous: number): Delta {
  if (!previous) return null;
  const change = ((current - previous) / previous) * 100;
  const direction = change >= 0 ? "up" : "down";
  const text = `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
  return { text, direction, good: change >= 0 };
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function kpi(
  id: string,
  label: string,
  value: string,
  delta: Delta,
  footnote: string,
  spark?: number[],
): AnalyticsKpi {
  return { id, label, value, delta, footnote, spark };
}

/** Build the KPI cards for one window, or null while history is too short. */
function buildKpis(weeks: WeekSample[], range: RangeKey): AnalyticsKpi[] | null {
  if (weeks.length < range) return null;
  const current = weeks.slice(-range);
  const previous = weeks.slice(-(range * 2), -range);
  const hasPrevious = previous.length === range;

  const peakActive = Math.max(...current.map((week) => week.active));
  const previousPeakActive = hasPrevious
    ? Math.max(...previous.map((week) => week.active))
    : null;
  const newUsers = sum(current.map((week) => week.newUsers));
  const previousNewUsers = hasPrevious
    ? sum(previous.map((week) => week.newUsers))
    : null;
  const sessions = sum(current.map((week) => week.sessions));
  const previousSessions = hasPrevious
    ? sum(previous.map((week) => week.sessions))
    : null;
  const duration = mean(current.map((week) => week.avgMinutes));
  const previousDuration = hasPrevious
    ? mean(previous.map((week) => week.avgMinutes))
    : null;

  return [
    kpi(
      "active",
      "Active Users",
      peakActive.toLocaleString("en-US"),
      previousPeakActive === null ? null : formatDelta(peakActive, previousPeakActive),
      `peak of the last ${range} weeks`,
      current.slice(-6).map((week) => week.active),
    ),
    kpi(
      "new",
      "New Users",
      newUsers.toLocaleString("en-US"),
      previousNewUsers === null ? null : formatDelta(newUsers, previousNewUsers),
      `signups over ${range} weeks`,
      current.slice(-6).map((week) => week.newUsers),
    ),
    kpi(
      "sessions",
      "Sessions",
      sessions.toLocaleString("en-US"),
      previousSessions === null ? null : formatDelta(sessions, previousSessions),
      `sessions over ${range} weeks`,
      current.slice(-6).map((week) => week.sessions),
    ),
    kpi(
      "duration",
      "Avg Session",
      `${duration.toFixed(1)} min`,
      previousDuration === null ? null : formatDelta(duration, previousDuration),
      `mean session length over ${range} weeks`,
      current.slice(-6).map((week) => week.avgMinutes),
    ),
  ];
}

/** Latest-week retention summary, independent of the selected window. */
function buildRetention(weeks: WeekSample[]): AnalyticsKpi[] {
  if (weeks.length === 0) return [];
  const latest = weeks[weeks.length - 1];
  const spark = weeks.slice(-6);
  return [
    kpi(
      "returning",
      "Returning Users",
      Math.max(0, latest.active - latest.newUsers).toLocaleString("en-US"),
      null,
      "active accounts that existed before this week",
      spark.map((week) => week.active),
    ),
    kpi(
      "rate",
      "Retention Rate",
      `${Math.round(latest.returnRate)}%`,
      null,
      "share of the audience that returned in the latest week",
      spark.map((week) => week.returnRate),
    ),
    kpi(
      "per-user",
      "Sessions / User",
      latest.perUser.toFixed(2),
      null,
      "sessions per active user in the latest week",
      spark.map((week) => week.perUser),
    ),
  ];
}

/** Latest value and comparison for every catalog metric that has a series. */
type MetricDetail = {
  value: string;
  delta: Delta;
  previousNote: string;
};

function buildMetricDetails(
  weeks: WeekSample[],
  catalog: MetricCatalogEntry[],
): Record<string, MetricDetail> {
  const details: Record<string, MetricDetail> = {};
  if (weeks.length === 0) return details;

  const latest = weeks[weeks.length - 1];
  const previous = weeks.length > 1 ? weeks[weeks.length - 2] : null;

  for (const metric of catalog) {
    if (!metric.seriesKey) continue;
    const meta = SERIES_FORMAT[metric.seriesKey];
    const value = latest[metric.seriesKey];
    const previousValue = previous ? previous[metric.seriesKey] : null;
    details[metric.id] = {
      value: formatMetricValue(value, meta),
      delta: previousValue === null ? null : formatDelta(value, previousValue),
      previousNote:
        previousValue === null
          ? "No previous week to compare against."
          : `Previous week: ${formatMetricValue(previousValue, meta)}.`,
    };
  }

  return details;
}

const SERIES_FORMAT: Record<SeriesKey, "int" | "decimal" | "percent"> = {
  active: "int",
  newUsers: "int",
  sessions: "int",
  avgMinutes: "decimal",
  perUser: "decimal",
  returnRate: "percent",
};

/**
 * Assemble the workspace dataset from the records the API returned. Values that
 * have no backend model (segments, devices, cohorts, authored notes) stay
 * empty so the existing empty states show instead of invented figures.
 */
export function buildAnalyticsDataset(
  source: AnalyticsDatasetSource,
): AnalyticsDataset | null {
  const weeks = [...source.weeks].sort((a, b) => a.start.localeCompare(b.start));
  if (weeks.length === 0) return null;

  const catalog: MetricCatalogEntry[] =
    source.metrics.length > 0
      ? source.metrics.map((metric) => ({
          id: metric.id,
          name: metric.name,
          definition: metric.definition,
          category: metric.category,
          unit: metric.unit,
          note: metric.note,
          seriesKey: metric.seriesKey,
        }))
      : METRIC_CATALOG;

  const kpis: Partial<Record<RangeKey, AnalyticsKpi[]>> = {};
  for (const range of [4, 12, 26] as RangeKey[]) {
    const cards = buildKpis(weeks, range);
    if (cards) kpis[range] = cards;
  }

  return {
    weeks,
    kpis,
    retention: buildRetention(weeks),
    featureAreas: [],
    segments: [],
    devices: [],
    channels: [],
    cohorts: null,
    metricDetails: buildMetricDetails(weeks, catalog),
    breakdowns: {},
    observations: source.observations.map((observation) => ({
      id: observation.id,
      text: observation.description || observation.title,
      source: observation.type,
    })),
    notes: [],
    reports: source.reports,
    metricDefinitions: catalog,
  };
}

/* ─── Week samples ────────────────────────────────────────────────────────── */

export async function getWeekSamples(productId: string): Promise<WeekSample[]> {
  const samples = await api.get<ApiWeekSample[]>(
    analyticsPath(productId, "weeks"),
  );
  return (samples ?? []).map(toWeekSample);
}

export async function createWeekSample(
  productId: string,
  dto: CreateWeekSampleInput,
): Promise<WeekSample> {
  const sample = await api.post<ApiWeekSample>(
    analyticsPath(productId, "weeks"),
    toWeekSamplePayload(dto),
  );
  return toWeekSample(sample);
}

export async function updateWeekSample(
  productId: string,
  id: string,
  dto: UpdateWeekSampleInput,
): Promise<WeekSample> {
  const sample = await api.patch<ApiWeekSample>(
    analyticsPath(productId, "weeks", id),
    toWeekSamplePayload(dto),
  );
  return toWeekSample(sample);
}

export async function deleteWeekSample(
  productId: string,
  id: string,
): Promise<void> {
  await api.delete<ApiWeekSample>(analyticsPath(productId, "weeks", id));
}

/* ─── Metric definitions ──────────────────────────────────────────────────── */

export async function getMetrics(productId: string): Promise<MetricDefinition[]> {
  const metrics = await api.get<ApiMetricDefinition[]>(
    analyticsPath(productId, "metrics"),
  );
  return (metrics ?? []).map(toMetricDefinition);
}

export async function createMetric(
  productId: string,
  dto: CreateMetricInput,
): Promise<MetricDefinition> {
  const metric = await api.post<ApiMetricDefinition>(
    analyticsPath(productId, "metrics"),
    toMetricPayload(dto),
  );
  return toMetricDefinition(metric);
}

export async function updateMetric(
  productId: string,
  id: string,
  dto: UpdateMetricInput,
): Promise<MetricDefinition> {
  const metric = await api.patch<ApiMetricDefinition>(
    analyticsPath(productId, "metrics", id),
    toMetricPayload(dto),
  );
  return toMetricDefinition(metric);
}

export async function deleteMetric(
  productId: string,
  id: string,
): Promise<void> {
  await api.delete<ApiMetricDefinition>(analyticsPath(productId, "metrics", id));
}

/* ─── Observations ────────────────────────────────────────────────────────── */

export async function getObservations(productId: string): Promise<Observation[]> {
  const observations = await api.get<ApiObservation[]>(
    analyticsPath(productId, "observations"),
  );
  return (observations ?? []).map(toObservation);
}

export async function createObservation(
  productId: string,
  dto: CreateObservationInput,
): Promise<Observation> {
  const observation = await api.post<ApiObservation>(
    analyticsPath(productId, "observations"),
    toObservationPayload(dto),
  );
  return toObservation(observation);
}

export async function updateObservation(
  productId: string,
  id: string,
  dto: UpdateObservationInput,
): Promise<Observation> {
  const observation = await api.patch<ApiObservation>(
    analyticsPath(productId, "observations", id),
    toObservationPayload(dto),
  );
  return toObservation(observation);
}

export async function deleteObservation(
  productId: string,
  id: string,
): Promise<void> {
  await api.delete<ApiObservation>(analyticsPath(productId, "observations", id));
}

/* ─── Reports ─────────────────────────────────────────────────────────────── */

export async function getReports(productId: string): Promise<AnalyticsReport[]> {
  const reports = await api.get<ApiAnalyticsReport[]>(
    analyticsPath(productId, "reports"),
  );
  return (reports ?? []).map(toAnalyticsReport);
}

export async function createReport(
  productId: string,
  dto: CreateReportInput,
): Promise<AnalyticsReport> {
  const report = await api.post<ApiAnalyticsReport>(
    analyticsPath(productId, "reports"),
    toReportPayload(dto),
  );
  return toAnalyticsReport(report);
}

export async function updateReport(
  productId: string,
  id: string,
  dto: UpdateReportInput,
): Promise<AnalyticsReport> {
  const report = await api.patch<ApiAnalyticsReport>(
    analyticsPath(productId, "reports", id),
    toReportPayload(dto),
  );
  return toAnalyticsReport(report);
}

export async function deleteReport(
  productId: string,
  id: string,
): Promise<void> {
  await api.delete<ApiAnalyticsReport>(analyticsPath(productId, "reports", id));
}

/* ─── AI ──────────────────────────────────────────────────────────────────── */

/** Interpret the product's latest weekly samples into trends and risks. */
export async function interpretMetrics(productId: string): Promise<string> {
  return api.post<string>(analyticsPath(productId, "ai", "interpret"));
}
