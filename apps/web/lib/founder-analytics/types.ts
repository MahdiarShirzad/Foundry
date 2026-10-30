/**
 * Presentation types for the Founder Analytics workspace (Stage 08 — Learn).
 *
 * Every shape below describes STATIC demonstration data. Nothing here is
 * measured, computed or fetched: the interface only reads these values.
 */

export const ANALYTICS_PRODUCTS = [
  {
    id: "helio-notes",
    name: "Helio Notes",
    ref: "AN-001",
    summary: "A lightweight decision log for knowledge workers.",
  },
  {
    id: "atlas-scout",
    name: "Atlas Scout",
    ref: "AN-002",
    summary: "A focused shortlist builder for early B2B outreach.",
  },
  {
    id: "beacon-crm",
    name: "Beacon CRM",
    ref: "AN-003",
    summary: "A shared relationship tracker — newly created, no demo history yet.",
  },
] as const;

export type AnalyticsProduct = (typeof ANALYTICS_PRODUCTS)[number];
export type AnalyticsProductId = AnalyticsProduct["id"];

/** Sample windows, expressed in weeks of predefined history. */
export const ANALYTICS_RANGES = [4, 12, 26] as const;
export type RangeKey = (typeof ANALYTICS_RANGES)[number];

/** One sample week of product activity. All values are fictional. */
export type WeekSample = {
  /** ISO date of the Monday that opens the week. */
  start: string;
  active: number;
  newUsers: number;
  sessions: number;
  avgMinutes: number;
  /** Sessions per active user in that sample week. */
  perUser: number;
  /** Percentage of users who returned that week. */
  returnRate: number;
};

/** Series that can be drawn over time from the predefined weekly samples. */
export type SeriesKey =
  | "active"
  | "newUsers"
  | "sessions"
  | "avgMinutes"
  | "perUser"
  | "returnRate";

export type SeriesMeta = {
  key: SeriesKey;
  label: string;
  /** How the value is rendered on the y axis and in tooltips. */
  format: "int" | "decimal" | "percent";
  unit: string;
  tone: "accent" | "mint" | "muted";
  description: string;
};

export const METRIC_CATEGORIES = [
  "Acquisition",
  "Activity",
  "Engagement",
  "Retention",
] as const;
export type MetricCategory = (typeof METRIC_CATEGORIES)[number];

export type MetricDefinition = {
  id: string;
  name: string;
  definition: string;
  category: MetricCategory;
  unit: string;
  /** How to read the metric, and what it does not prove. */
  note: string;
  /** Undefined when the sample data has no trend for this metric. */
  seriesKey: SeriesKey | null;
};

export type Delta = { text: string; direction: "up" | "down"; good: boolean } | null;

/** A predefined value for one metric in one product. Never derived at runtime. */
export type MetricDetail = {
  /** Latest sample week, formatted. */
  value: string;
  /** Latest sample week against the week before it. */
  delta: Delta;
  /** Literal description of the previous sample period figure. */
  previousNote: string;
};

/** A predefined dimension breakdown, e.g. active users by device. */
export type Breakdown = {
  id: string;
  label: string;
  rows: { label: string; value: number; note?: string }[];
};

/** KPI cell — intentionally the same shape as the dashboard KPI strip. */
export type AnalyticsKpi = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  delta: Delta;
  footnote: string;
  spark?: number[];
};

export type DistributionSlice = {
  id: string;
  label: string;
  value: number;
};

export type FeatureArea = {
  id: string;
  name: string;
  description: string;
  /** Static interpretation note shown in the area detail panel. */
  note: string;
};

export type Segment = {
  id: string;
  name: string;
  description: string;
  users: number;
  sessions: number;
  avgMinutes: number;
  /** Share of the sample audience, predefined as a percentage. */
  share: number;
  /** Weekly session counts, aligned with the product's sample weeks. */
  weeklySessions: number[];
  /** Interactions per feature area, aligned with `featureAreas`. */
  usage: number[];
};

/** One cohort row; `observed` weeks are populated, later weeks are null. */
export type CohortRow = {
  id: string;
  label: string;
  size: number;
  /** How many weeks of this cohort have been observed in the sample. */
  observed: number;
  /** Retention percentages for weeks 1–4; null while unobserved. */
  weeks: (number | null)[];
};

/** Static, hand-written interpretation note (§10D of the brief). */
export type InterpretationNote = {
  id: string;
  title: string;
  shows: string;
  suggests: string;
  needs: string;
};

/** Authored observation shown under the overview chart. */
export type SampleObservation = {
  id: string;
  text: string;
  source: string;
};

export type AnalyticsReport = {
  id: string;
  title: string;
  description: string;
  category: string;
  period: string;
  updated: string;
  paragraphs: string[];
  values: { label: string; value: string }[];
  /** Optional predefined series drawn in the report detail. */
  chart?: { seriesKey: SeriesKey; title: string };
  /** Optional predefined category breakdown drawn in the report detail. */
  bars?: { label: string; rows: { label: string; value: number }[] };
};

export const OBSERVATION_TYPES = [
  "Pattern",
  "Question",
  "Risk",
  "Opportunity",
] as const;
export type ObservationType = (typeof OBSERVATION_TYPES)[number];

/** A short note the founder keeps locally in this UI session. */
export type Observation = {
  id: string;
  productId?: string;
  title: string;
  description: string;
  metricId: string;
  type: ObservationType;
  nextStep: string;
  sample?: boolean;
};

/** Everything a product contributes to the analytics prototype. */
export type AnalyticsDataset = {
  weeks: WeekSample[];
  /** KPI cards per sample window; a missing window is an empty state. */
  kpis: Partial<Record<RangeKey, AnalyticsKpi[]>>;
  /** Latest-week retention summary, independent of the selected window. */
  retention: AnalyticsKpi[];
  featureAreas: FeatureArea[];
  segments: Segment[];
  devices: DistributionSlice[];
  channels: DistributionSlice[];
  cohorts: CohortRow[] | null;
  metricDetails: Record<string, MetricDetail>;
  breakdowns: Record<string, Breakdown[]>;
  observations: SampleObservation[];
  notes: InterpretationNote[];
  reports: AnalyticsReport[];
};

export const ANALYTICS_SECTIONS = [
  "Overview",
  "Product Metrics",
  "User Behavior",
  "Retention & Engagement",
  "Reports & Insights",
] as const;
export type AnalyticsSection = (typeof ANALYTICS_SECTIONS)[number];

export type ObservationDraft = {
  title: string;
  description: string;
  metricId: string;
  type: ObservationType;
  nextStep: string;
};
