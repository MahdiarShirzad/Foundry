import type {
  AnalyticsDataset,
  AnalyticsKpi,
  MetricCategory,
  SeriesKey,
  SeriesMeta,
} from "../founder-analytics/types";

/* ------------------------------------------------------------------ series ---
 * Static presentation metadata: the labels, formats and tones used whenever a
 * weekly series is drawn. It carries no figures.
 */

export const SERIES_META: Record<SeriesKey, SeriesMeta> = {
  active: {
    key: "active",
    label: "Active Users",
    format: "int",
    unit: "users",
    tone: "accent",
    description: "Weekly active accounts.",
  },
  newUsers: {
    key: "newUsers",
    label: "New Users",
    format: "int",
    unit: "users",
    tone: "mint",
    description: "Accounts created in the week.",
  },
  sessions: {
    key: "sessions",
    label: "Sessions",
    format: "int",
    unit: "sessions",
    tone: "accent",
    description: "Sessions recorded in the week.",
  },
  avgMinutes: {
    key: "avgMinutes",
    label: "Avg Session",
    format: "decimal",
    unit: "min",
    tone: "mint",
    description: "Mean session length, in minutes.",
  },
  perUser: {
    key: "perUser",
    label: "Sessions / User",
    format: "decimal",
    unit: "ratio",
    tone: "accent",
    description: "Sessions per active user in the week.",
  },
  returnRate: {
    key: "returnRate",
    label: "Return Rate",
    format: "percent",
    unit: "%",
    tone: "mint",
    description: "Share of the audience that came back that week.",
  },
};

/* ------------------------------------------------------------ metric catalog ---
 * The default dictionary of metric definitions shown before a product has any
 * stored metric definitions of its own.
 */

export type MetricCatalogEntry = {
  id: string;
  name: string;
  definition: string;
  category: MetricCategory;
  unit: string;
  note: string;
  seriesKey: SeriesKey | null;
};

export const METRIC_CATALOG: MetricCatalogEntry[] = [
  {
    id: "active-users",
    name: "Active Users",
    definition: "Distinct accounts that recorded at least one session in the week.",
    category: "Activity",
    unit: "users",
    note: "Weekly activity is a reach measure, not a quality measure — it says nothing about whether those sessions were useful.",
    seriesKey: "active",
  },
  {
    id: "new-users",
    name: "New Users",
    definition: "Accounts created during the week that recorded activity.",
    category: "Acquisition",
    unit: "users",
    note: "Creation counts only mean something next to activation: an account that signs up and never returns still counts here.",
    seriesKey: "newUsers",
  },
  {
    id: "sessions",
    name: "Sessions",
    definition: "Sign-ins that ended normally or after a period of inactivity.",
    category: "Activity",
    unit: "sessions",
    note: "A session is a container for activity. More sessions can mean more engagement or more friction — read it with duration and feature usage.",
    seriesKey: "sessions",
  },
  {
    id: "sessions-per-user",
    name: "Sessions per User",
    definition: "Sessions divided by active users for each week.",
    category: "Engagement",
    unit: "ratio",
    note: "An engagement indicator, not proof of product quality — a high ratio can also describe a workflow people are forced to repeat.",
    seriesKey: "perUser",
  },
  {
    id: "avg-duration",
    name: "Average Session Duration",
    definition: "Mean length of a session, in minutes.",
    category: "Engagement",
    unit: "minutes",
    note: "Longer is not automatically better: quick, decisive sessions can be the healthy case for a focused tool.",
    seriesKey: "avgMinutes",
  },
  {
    id: "feature-usage",
    name: "Feature Usage",
    definition: "Interactions recorded against each product area.",
    category: "Engagement",
    unit: "interactions",
    note: "Interaction counts show where attention goes, not whether the area works well.",
    seriesKey: null,
  },
  {
    id: "return-rate",
    name: "Return Rate",
    definition: "Share of the audience that came back within the week.",
    category: "Retention",
    unit: "%",
    note: "A short-window return signal, not a cohort study.",
    seriesKey: "returnRate",
  },
];

/* ----------------------------------------------------------------- selectors --- */

export type SeriesSlice = {
  /** ISO Monday dates for the selected window. */
  starts: string[];
  values: number[];
  /** The equally long window immediately before it, when one exists. */
  previous: number[] | null;
};

/** Slices a weekly series to the selected window. */
export function getSeriesSlice(
  dataset: AnalyticsDataset,
  key: SeriesKey,
  range: number,
): SeriesSlice {
  const current = dataset.weeks.slice(-range);
  const previous = dataset.weeks.slice(-(range * 2), -range);
  return {
    starts: current.map((week) => week.start),
    values: current.map((week) => week[key]),
    previous: previous.length === range ? previous.map((week) => week[key]) : null,
  };
}

export function getKpis(dataset: AnalyticsDataset, range: number): AnalyticsKpi[] | null {
  const cards = (dataset.kpis as Record<number, AnalyticsKpi[] | undefined>)[range];
  return cards ?? null;
}

export function rangeLabel(range: number): string {
  return `${range} sample weeks`;
}
