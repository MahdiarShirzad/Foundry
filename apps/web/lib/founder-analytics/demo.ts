/**
 * Static demonstration data for the Founder Analytics workspace.
 *
 * Every figure below is fictional and hand-authored. Nothing is measured,
 * ingested or computed at runtime: the interface reads these values, slices
 * predefined series to the selected window, and displays them. The consistency
 * between related figures (weekly series, totals, cohort sizes) is intentional
 * and was checked against the raw arrays during authoring.
 */

import type {
  AnalyticsDataset,
  AnalyticsKpi,
  AnalyticsProductId,
  AnalyticsProduct,
  Breakdown,
  Delta,
  MetricDetail,
  SeriesKey,
  SeriesMeta,
  WeekSample,
} from "./types";
import { ANALYTICS_PRODUCTS } from "./types";

export const DEMO_ANALYTICS_PRODUCTS: AnalyticsProduct[] = [...ANALYTICS_PRODUCTS];

/* ------------------------------------------------------------------ series */

export const SERIES_META: Record<SeriesKey, SeriesMeta> = {
  active: {
    key: "active",
    label: "Active Users",
    format: "int",
    unit: "users",
    tone: "accent",
    description: "Weekly active accounts in the sample data.",
  },
  newUsers: {
    key: "newUsers",
    label: "New Users",
    format: "int",
    unit: "users",
    tone: "mint",
    description: "Accounts created in the sample week.",
  },
  sessions: {
    key: "sessions",
    label: "Sessions",
    format: "int",
    unit: "sessions",
    tone: "accent",
    description: "Sample sessions recorded in the week.",
  },
  avgMinutes: {
    key: "avgMinutes",
    label: "Avg Session",
    format: "decimal",
    unit: "min",
    tone: "mint",
    description: "Mean sample session length, in minutes.",
  },
  perUser: {
    key: "perUser",
    label: "Sessions / User",
    format: "decimal",
    unit: "ratio",
    tone: "accent",
    description: "Sample sessions per active user in the week.",
  },
  returnRate: {
    key: "returnRate",
    label: "Return Rate",
    format: "percent",
    unit: "%",
    tone: "mint",
    description: "Share of the sample audience that came back that week.",
  },
};

/* ------------------------------------------------------------ metric catalog */

export const METRIC_CATALOG = [
  {
    id: "active-users",
    name: "Active Users",
    definition: "Distinct sample accounts that recorded at least one session in the week.",
    category: "Activity",
    unit: "users",
    note: "Weekly activity is a reach measure, not a quality measure — it says nothing about whether those sessions were useful.",
    seriesKey: "active",
  },
  {
    id: "new-users",
    name: "New Users",
    definition: "Accounts created during the sample week that recorded activity.",
    category: "Acquisition",
    unit: "users",
    note: "Creation counts only mean something next to activation: an account that signs up and never returns still counts here.",
    seriesKey: "newUsers",
  },
  {
    id: "sessions",
    name: "Sessions",
    definition: "Sample sign-ins that ended normally or after a period of inactivity.",
    category: "Activity",
    unit: "sessions",
    note: "A session is a container for activity. More sessions can mean more engagement or more friction — read it with duration and feature usage.",
    seriesKey: "sessions",
  },
  {
    id: "sessions-per-user",
    name: "Sessions per User",
    definition: "Sample sessions divided by active users for each week.",
    category: "Engagement",
    unit: "ratio",
    note: "An engagement indicator, not proof of product quality — a high ratio can also describe a workflow people are forced to repeat.",
    seriesKey: "perUser",
  },
  {
    id: "avg-duration",
    name: "Average Session Duration",
    definition: "Mean length of a sample session, in minutes.",
    category: "Engagement",
    unit: "minutes",
    note: "Longer is not automatically better: quick, decisive sessions can be the healthy case for a focused tool.",
    seriesKey: "avgMinutes",
  },
  {
    id: "feature-usage",
    name: "Feature Usage",
    definition: "Sample interactions recorded against each product area.",
    category: "Engagement",
    unit: "interactions",
    note: "Interaction counts show where attention goes in the sample, not whether the area works well.",
    seriesKey: null,
  },
  {
    id: "return-rate",
    name: "Return Rate",
    definition: "Share of the sample audience that came back within the week.",
    category: "Retention",
    unit: "%",
    note: "A short-window return signal, not a cohort study — use the retention table for that.",
    seriesKey: "returnRate",
  },
] as const;

/* ------------------------------------------------------------------- weeks */

const w = (
  start: string,
  active: number,
  newUsers: number,
  sessions: number,
  avgMinutes: number,
  perUser: number,
  returnRate: number,
): WeekSample => ({ start, active, newUsers, sessions, avgMinutes, perUser, returnRate });

/** Helio Notes — 26 sample weeks, Mondays from 2026-05-04 to 2026-10-26. */
const HELIO_WEEKS: WeekSample[] = [
  w("2026-05-04", 1480, 112, 3010, 6.4, 2.03, 36),
  w("2026-05-11", 1525, 121, 3145, 6.5, 2.06, 37),
  w("2026-05-18", 1510, 108, 3090, 6.3, 2.05, 36),
  w("2026-05-25", 1602, 130, 3350, 6.6, 2.09, 38),
  w("2026-06-01", 1648, 137, 3480, 6.7, 2.11, 38),
  w("2026-06-08", 1690, 142, 3590, 6.8, 2.12, 39),
  w("2026-06-15", 1672, 135, 3520, 6.6, 2.11, 38),
  w("2026-06-22", 1745, 149, 3720, 6.9, 2.13, 40),
  w("2026-06-29", 1802, 156, 3880, 7.0, 2.15, 40),
  w("2026-07-06", 1865, 163, 4040, 7.1, 2.17, 41),
  w("2026-07-13", 1902, 158, 4120, 7.0, 2.17, 41),
  w("2026-07-20", 1878, 151, 4050, 6.9, 2.16, 40),
  w("2026-07-27", 1955, 167, 4290, 7.2, 2.19, 42),
  w("2026-08-03", 2024, 178, 4490, 7.4, 2.22, 42),
  w("2026-08-10", 2088, 186, 4680, 7.5, 2.24, 43),
  w("2026-08-17", 2140, 179, 4790, 7.3, 2.24, 43),
  w("2026-08-24", 2115, 172, 4700, 7.2, 2.22, 42),
  w("2026-08-31", 2205, 191, 4960, 7.6, 2.25, 44),
  w("2026-09-07", 2268, 198, 5140, 7.7, 2.27, 44),
  w("2026-09-14", 2330, 205, 5320, 7.8, 2.28, 45),
  w("2026-09-21", 2302, 197, 5210, 7.6, 2.26, 44),
  w("2026-09-28", 2395, 214, 5520, 7.9, 2.3, 46),
  w("2026-10-05", 2452, 221, 5710, 8.0, 2.33, 46),
  w("2026-10-12", 2510, 228, 5890, 8.1, 2.35, 47),
  w("2026-10-19", 2478, 219, 5780, 7.9, 2.33, 46),
  w("2026-10-26", 2564, 236, 6060, 8.3, 2.36, 48),
];

/** Atlas Scout — 12 sample weeks, Mondays from 2026-08-10 to 2026-10-26. */
const ATLAS_WEEKS: WeekSample[] = [
  w("2026-08-10", 610, 74, 1490, 5.8, 2.44, 31),
  w("2026-08-17", 628, 79, 1520, 5.9, 2.42, 32),
  w("2026-08-24", 641, 81, 1548, 5.7, 2.41, 31),
  w("2026-08-31", 636, 77, 1510, 5.6, 2.37, 31),
  w("2026-09-07", 655, 84, 1552, 5.7, 2.37, 32),
  w("2026-09-14", 672, 88, 1580, 5.8, 2.35, 32),
  w("2026-09-21", 664, 83, 1530, 5.6, 2.3, 31),
  w("2026-09-28", 681, 86, 1552, 5.5, 2.28, 32),
  w("2026-10-05", 695, 90, 1570, 5.5, 2.26, 33),
  w("2026-10-12", 708, 92, 1585, 5.4, 2.24, 32),
  w("2026-10-19", 702, 89, 1545, 5.3, 2.2, 31),
  w("2026-10-26", 719, 94, 1570, 5.2, 2.18, 32),
];

/* ------------------------------------------------------- feature areas --- */

const HELIO_AREAS: AnalyticsDataset["featureAreas"] = [
  {
    id: "onboarding",
    name: "Onboarding",
    description: "First-run setup, the setup checklist and the initial invite flow.",
    note: "Sample interactions are concentrated in a product's first weeks of use; a high count here is expected and is not by itself a problem.",
  },
  {
    id: "dashboard",
    name: "Dashboard",
    description: "The decision timeline, history view and workspace overview.",
    note: "Dashboard traffic is a reach measure: it says the surface is visited, not that the timeline answered the question.",
  },
  {
    id: "core-workflow",
    name: "Core Workflow",
    description: "Capturing, finding and editing decisions day to day.",
    note: "The largest sample area by interaction count. Pair it with duration before concluding the workflow is healthy.",
  },
  {
    id: "billing",
    name: "Billing",
    description: "Plans, invoices and the upgrade path.",
    note: "Low, steady sample traffic is normal here; spikes usually follow an invoice or plan change rather than a product problem.",
  },
  {
    id: "notifications",
    name: "Notifications",
    description: "Emails, badges and outbound alerts about workspace activity.",
    note: "Interaction counts cover opens and dismissals together in this sample, so they cannot separate interest from irritation.",
  },
  {
    id: "account-settings",
    name: "Account Settings",
    description: "Members, roles and workspace preferences.",
    note: "The smallest sample area; changes here are rare by design, so small absolute movements look large in percentages.",
  },
];

const ATLAS_AREAS: AnalyticsDataset["featureAreas"] = [
  {
    id: "onboarding",
    name: "Onboarding",
    description: "Trial start, criteria setup and the first shortlist.",
    note: "Early-sample concentration: most new accounts meet the criteria builder before anything else.",
  },
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Import progress, scoring status and list overview.",
    note: "Import-heavy sessions inflate this surface in the sample; read it together with duration.",
  },
  {
    id: "core-workflow",
    name: "Core Workflow",
    description: "Building, saving and sharing shortlists.",
    note: "The daily path. A falling share here would be the first sign the product is being used less.",
  },
];

/* --------------------------------------------------------------- segments */

/** Weekly session subsets. Each pair sums exactly to the product's weekly total. */
const HELIO_NEW_SESSIONS = [
  421, 440, 433, 469, 487, 503, 493, 521, 543, 566, 577, 567, 601, 629, 655, 671, 658, 694, 720,
  745, 729, 773, 799, 825, 809, 848,
];
const HELIO_RETURNING_SESSIONS = [
  2589, 2705, 2657, 2881, 2993, 3087, 3027, 3199, 3337, 3474, 3543, 3483, 3689, 3861, 4025, 4119,
  4042, 4266, 4420, 4575, 4481, 4747, 4911, 5065, 4971, 5212,
];
const HELIO_DESKTOP_SESSIONS = [
  1806, 1887, 1854, 2010, 2088, 2154, 2112, 2232, 2328, 2424, 2472, 2430, 2574, 2694, 2808, 2874,
  2820, 2976, 3084, 3192, 3126, 3312, 3426, 3534, 3468, 3636,
];
const HELIO_MOBILE_SESSIONS = [
  1054, 1101, 1082, 1173, 1218, 1257, 1232, 1302, 1358, 1414, 1442, 1418, 1502, 1572, 1638, 1677,
  1645, 1736, 1799, 1862, 1824, 1932, 1999, 2062, 2023, 2115,
];

const HELIO_USAGE_ALL = [8420, 21650, 34120, 5240, 9870, 4310];
const HELIO_USAGE_NEW = [6180, 3120, 4460, 640, 1980, 1120];
const HELIO_USAGE_RETURNING = [2240, 18530, 29660, 4600, 7890, 3190];
const HELIO_USAGE_DESKTOP = [4980, 14320, 22610, 3480, 5940, 2870];
const HELIO_USAGE_MOBILE = [3440, 7330, 11510, 1760, 3930, 1440];

const HELIO_SEGMENTS: AnalyticsDataset["segments"] = [
  {
    id: "all",
    name: "All Users",
    description: "Every sample account recorded against the product in the selected window.",
    users: 2564,
    sessions: 115535,
    avgMinutes: 8.3,
    share: 100,
    weeklySessions: HELIO_WEEKS.map((week) => week.sessions),
    usage: HELIO_USAGE_ALL,
  },
  {
    id: "new",
    name: "New Users",
    description: "Accounts created during the sample window — the acquisition audience.",
    users: 236,
    sessions: 16176,
    avgMinutes: 7.1,
    share: 9,
    weeklySessions: HELIO_NEW_SESSIONS,
    usage: HELIO_USAGE_NEW,
  },
  {
    id: "returning",
    name: "Returning Users",
    description: "Accounts that existed before the window and came back during it.",
    users: 2328,
    sessions: 99359,
    avgMinutes: 8.4,
    share: 91,
    weeklySessions: HELIO_RETURNING_SESSIONS,
    usage: HELIO_USAGE_RETURNING,
  },
  {
    id: "desktop",
    name: "Desktop Users",
    description: "Sample sessions started in a desktop browser (about 60% of the audience).",
    users: 1538,
    sessions: 69321,
    avgMinutes: 9.1,
    share: 60,
    weeklySessions: HELIO_DESKTOP_SESSIONS,
    usage: HELIO_USAGE_DESKTOP,
  },
  {
    id: "mobile",
    name: "Mobile Users",
    description: "Sample sessions started in a phone browser (about 35% of the audience).",
    users: 898,
    sessions: 40437,
    avgMinutes: 6.4,
    share: 35,
    weeklySessions: HELIO_MOBILE_SESSIONS,
    usage: HELIO_USAGE_MOBILE,
  },
];

const ATLAS_NEW_SESSIONS = [417, 426, 433, 423, 435, 442, 428, 435, 440, 444, 433, 440];
const ATLAS_RETURNING_SESSIONS = [
  1073, 1094, 1115, 1087, 1117, 1138, 1102, 1117, 1130, 1141, 1112, 1130,
];

const ATLAS_SEGMENTS: AnalyticsDataset["segments"] = [
  {
    id: "all",
    name: "All Users",
    description: "Every sample account recorded against the product in the selected window.",
    users: 719,
    sessions: 18552,
    avgMinutes: 5.2,
    share: 100,
    weeklySessions: ATLAS_WEEKS.map((week) => week.sessions),
    usage: [5310, 7840, 11260],
  },
  {
    id: "new",
    name: "New Users",
    description: "Accounts created during the sample window — the acquisition audience.",
    users: 94,
    sessions: 5196,
    avgMinutes: 4.8,
    share: 13,
    weeklySessions: ATLAS_NEW_SESSIONS,
    usage: [4120, 1980, 2410],
  },
  {
    id: "returning",
    name: "Returning Users",
    description: "Accounts that existed before the window and came back during it.",
    users: 625,
    sessions: 13356,
    avgMinutes: 5.3,
    share: 87,
    weeklySessions: ATLAS_RETURNING_SESSIONS,
    usage: [1190, 5860, 8850],
  },
];

/* --------------------------------------------------- distributions & cohorts */

const HELIO_DEVICES: AnalyticsDataset["devices"] = [
  { id: "desktop", label: "Desktop", value: 69321 },
  { id: "mobile", label: "Mobile", value: 40437 },
  { id: "tablet", label: "Tablet", value: 5777 },
];

const HELIO_CHANNELS: AnalyticsDataset["channels"] = [
  { id: "organic", label: "Organic search", value: 1559 },
  { id: "direct", label: "Direct", value: 1113 },
  { id: "referral", label: "Referral", value: 891 },
  { id: "community", label: "Community", value: 668 },
  { id: "paid", label: "Paid", value: 222 },
];

const ATLAS_DEVICES: AnalyticsDataset["devices"] = [
  { id: "desktop", label: "Desktop", value: 11131 },
  { id: "mobile", label: "Mobile", value: 6493 },
  { id: "tablet", label: "Tablet", value: 928 },
];

const ATLAS_CHANNELS: AnalyticsDataset["channels"] = [
  { id: "organic", label: "Organic search", value: 356 },
  { id: "direct", label: "Direct", value: 254 },
  { id: "referral", label: "Referral", value: 203 },
  { id: "community", label: "Community", value: 142 },
  { id: "paid", label: "Paid", value: 62 },
];

/** Cohort sizes match the new-user count of the same sample week. */
const HELIO_COHORTS: AnalyticsDataset["cohorts"] = [
  { id: "c-aug31", label: "Week of Aug 31", size: 191, observed: 4, weeks: [58, 46, 40, 35] },
  { id: "c-sep07", label: "Week of Sep 7", size: 198, observed: 4, weeks: [59, 47, 41, 36] },
  { id: "c-sep14", label: "Week of Sep 14", size: 205, observed: 4, weeks: [60, 48, 42, 36] },
  { id: "c-sep21", label: "Week of Sep 21", size: 197, observed: 4, weeks: [57, 45, 39, 34] },
  { id: "c-sep28", label: "Week of Sep 28", size: 214, observed: 4, weeks: [58, 46, 40, 35] },
  { id: "c-oct05", label: "Week of Oct 5", size: 221, observed: 3, weeks: [61, 49, 44, null] },
];

/* -------------------------------------------------------------- KPI blocks */

function kpi(
  id: string,
  label: string,
  value: string,
  delta: Delta,
  footnote: string,
  spark: number[],
  unit?: string,
): AnalyticsKpi {
  return unit ? { id, label, value, unit, delta, footnote, spark } : { id, label, value, delta, footnote, spark };
}

const HELIO_KPIS_4 = [
  kpi("active", "Active Users", "2,564", { text: "+7.1% vs previous 4 weeks", direction: "up", good: true }, "sample · peak weekly active users in the window", HELIO_WEEKS.slice(-4).map((x) => x.active)),
  kpi("new", "New Users", "904", { text: "+11.1% vs previous 4 weeks", direction: "up", good: true }, "sample · new accounts recorded across the window", HELIO_WEEKS.slice(-4).map((x) => x.newUsers)),
  kpi("sessions", "Sessions", "23,440", { text: "+10.6% vs previous 4 weeks", direction: "up", good: true }, "sample · sessions recorded across the window", HELIO_WEEKS.slice(-4).map((x) => x.sessions)),
  kpi("duration", "Avg Session", "8.1", { text: "+3.8% vs previous 4 weeks", direction: "up", good: true }, "sample · mean session length across the window", HELIO_WEEKS.slice(-4).map((x) => x.avgMinutes), "min"),
];

const HELIO_KPIS_12 = [
  kpi("active", "Active Users", "2,564", { text: "+26.7% vs previous 12 weeks", direction: "up", good: true }, "sample · peak weekly active users in the window", HELIO_WEEKS.slice(-12).map((x) => x.active)),
  kpi("new", "New Users", "2,446", { text: "+37.9% vs previous 12 weeks", direction: "up", good: true }, "sample · new accounts recorded across the window", HELIO_WEEKS.slice(-12).map((x) => x.newUsers)),
  kpi("sessions", "Sessions", "63,760", { text: "+39.8% vs previous 12 weeks", direction: "up", good: true }, "sample · sessions recorded across the window", HELIO_WEEKS.slice(-12).map((x) => x.sessions)),
  kpi("duration", "Avg Session", "7.7", { text: "+11.6% vs previous 12 weeks", direction: "up", good: true }, "sample · mean session length across the window", HELIO_WEEKS.slice(-12).map((x) => x.avgMinutes), "min"),
];

const HELIO_KPIS_26 = [
  kpi("active", "Active Users", "2,564", null, "sample · peak weekly active users in the window", HELIO_WEEKS.map((x) => x.active)),
  kpi("new", "New Users", "4,453", null, "sample · new accounts recorded across the window", HELIO_WEEKS.map((x) => x.newUsers)),
  kpi("sessions", "Sessions", "115,535", null, "sample · sessions recorded across the window", HELIO_WEEKS.map((x) => x.sessions)),
  kpi("duration", "Avg Session", "7.2", null, "sample · mean session length across the window", HELIO_WEEKS.map((x) => x.avgMinutes), "min"),
];

const ATLAS_KPIS_4 = [
  kpi("active", "Active Users", "719", { text: "+5.6% vs previous 4 weeks", direction: "up", good: true }, "sample · peak weekly active users in the window", ATLAS_WEEKS.slice(-4).map((x) => x.active)),
  kpi("new", "New Users", "365", { text: "+7.0% vs previous 4 weeks", direction: "up", good: true }, "sample · new accounts recorded across the window", ATLAS_WEEKS.slice(-4).map((x) => x.newUsers)),
  kpi("sessions", "Sessions", "6,270", { text: "+0.9% vs previous 4 weeks", direction: "up", good: true }, "sample · sessions recorded across the window", ATLAS_WEEKS.slice(-4).map((x) => x.sessions)),
  kpi("duration", "Avg Session", "5.3", { text: "−7.0% vs previous 4 weeks", direction: "down", good: false }, "sample · mean session length across the window", ATLAS_WEEKS.slice(-4).map((x) => x.avgMinutes), "min"),
];

const ATLAS_KPIS_12 = [
  kpi("active", "Active Users", "719", null, "sample · peak weekly active users in the window", ATLAS_WEEKS.map((x) => x.active)),
  kpi("new", "New Users", "1,017", null, "sample · new accounts recorded across the window", ATLAS_WEEKS.map((x) => x.newUsers)),
  kpi("sessions", "Sessions", "18,552", null, "sample · sessions recorded across the window", ATLAS_WEEKS.map((x) => x.sessions)),
  kpi("duration", "Avg Session", "5.6", null, "sample · mean session length across the window", ATLAS_WEEKS.map((x) => x.avgMinutes), "min"),
];

/* --------------------------------------------------------- metric details */

const HELIO_DETAILS: Record<string, MetricDetail> = {
  "active-users": {
    value: "2,564",
    delta: { text: "+3.5% vs prior week", direction: "up", good: true },
    previousNote: "Latest sample week (Oct 26) reads 2,564 against 2,478 in the week before.",
  },
  "new-users": {
    value: "236",
    delta: { text: "+7.8% vs prior week", direction: "up", good: true },
    previousNote: "Latest sample week (Oct 26) reads 236 against 219 in the week before.",
  },
  sessions: {
    value: "6,060",
    delta: { text: "+4.8% vs prior week", direction: "up", good: true },
    previousNote: "Latest sample week (Oct 26) reads 6,060 against 5,780 in the week before.",
  },
  "sessions-per-user": {
    value: "2.36",
    delta: { text: "+1.3% vs prior week", direction: "up", good: true },
    previousNote: "Latest sample week (Oct 26) reads 2.36 against 2.33 in the week before.",
  },
  "avg-duration": {
    value: "8.3 min",
    delta: { text: "+5.1% vs prior week", direction: "up", good: true },
    previousNote: "Latest sample week (Oct 26) reads 8.3 min against 7.9 min in the week before.",
  },
  "feature-usage": {
    value: "83,610",
    delta: null,
    previousNote: "Interaction totals are published for the full 26-week sample window only; no weekly comparison is predefined.",
  },
  "return-rate": {
    value: "48%",
    delta: { text: "+4.3% vs prior week", direction: "up", good: true },
    previousNote: "Latest sample week (Oct 26) reads 48% against 46% in the week before.",
  },
};

const HELIO_BREAKDOWNS: Record<string, Breakdown[]> = {
  "active-users": [
    {
      id: "device",
      label: "By device",
      rows: [
        { label: "Desktop", value: 1538, note: "60% of the latest sample week" },
        { label: "Mobile", value: 898, note: "35% of the latest sample week" },
        { label: "Tablet", value: 128, note: "5% of the latest sample week" },
      ],
    },
    {
      id: "channel",
      label: "By acquisition channel",
      rows: [
        { label: "Organic search", value: 898 },
        { label: "Direct", value: 641 },
        { label: "Referral", value: 513 },
        { label: "Community", value: 384 },
        { label: "Paid", value: 128 },
      ],
    },
  ],
  sessions: [
    {
      id: "device",
      label: "By device · full sample window",
      rows: HELIO_DEVICES.map((slice) => ({ label: slice.label, value: slice.value })),
    },
  ],
  "new-users": [
    {
      id: "channel",
      label: "By acquisition channel · full sample window",
      rows: HELIO_CHANNELS.map((slice) => ({ label: slice.label, value: slice.value })),
    },
  ],
  "feature-usage": [
    {
      id: "area",
      label: "By product area · full sample window",
      rows: HELIO_AREAS.map((area, index) => ({ label: area.name, value: HELIO_USAGE_ALL[index] })),
    },
  ],
};

const ATLAS_DETAILS: Record<string, MetricDetail> = {
  "active-users": {
    value: "719",
    delta: { text: "+2.4% vs prior week", direction: "up", good: true },
    previousNote: "Latest sample week (Oct 26) reads 719 against 702 in the week before.",
  },
  "new-users": {
    value: "94",
    delta: { text: "+5.6% vs prior week", direction: "up", good: true },
    previousNote: "Latest sample week (Oct 26) reads 94 against 89 in the week before.",
  },
  sessions: {
    value: "1,570",
    delta: { text: "+1.6% vs prior week", direction: "up", good: true },
    previousNote: "Latest sample week (Oct 26) reads 1,570 against 1,545 in the week before.",
  },
  "sessions-per-user": {
    value: "2.18",
    delta: { text: "−0.9% vs prior week", direction: "down", good: false },
    previousNote: "Latest sample week (Oct 26) reads 2.18 against 2.20 in the week before.",
  },
  "avg-duration": {
    value: "5.2 min",
    delta: { text: "−1.9% vs prior week", direction: "down", good: false },
    previousNote: "Latest sample week (Oct 26) reads 5.2 min against 5.3 min in the week before.",
  },
  "feature-usage": {
    value: "24,410",
    delta: null,
    previousNote: "Interaction totals are published for the full 12-week sample window only; no weekly comparison is predefined.",
  },
  "return-rate": {
    value: "32%",
    delta: { text: "+3.2% vs prior week", direction: "up", good: true },
    previousNote: "Latest sample week (Oct 26) reads 32% against 31% in the week before.",
  },
};

const ATLAS_BREAKDOWNS: Record<string, Breakdown[]> = {
  sessions: [
    {
      id: "device",
      label: "By device · full sample window",
      rows: ATLAS_DEVICES.map((slice) => ({ label: slice.label, value: slice.value })),
    },
  ],
  "new-users": [
    {
      id: "channel",
      label: "By acquisition channel · full sample window",
      rows: ATLAS_CHANNELS.map((slice) => ({ label: slice.label, value: slice.value })),
    },
  ],
  "feature-usage": [
    {
      id: "area",
      label: "By product area · full sample window",
      rows: ATLAS_AREAS.map((area, index) => ({ label: area.name, value: ATLAS_SEGMENTS[0].usage[index] })),
    },
  ],
};

/* ------------------------------------------------ observations and reports */

const HELIO_OBSERVATIONS: AnalyticsDataset["observations"] = [
  {
    id: "ob-1",
    text: "Sample weekly active users grew from 1,480 to 2,564 across the 26-week window.",
    source: "weekly samples",
  },
  {
    id: "ob-2",
    text: "Sample sessions grew faster than active users, lifting sessions per user from 2.03 to 2.36.",
    source: "weekly samples",
  },
  {
    id: "ob-3",
    text: "Core Workflow carries the largest share of sample interactions: 34,120 of 83,610.",
    source: "feature usage table",
  },
];

const ATLAS_OBSERVATIONS: AnalyticsDataset["observations"] = [
  {
    id: "ob-1",
    text: "Sample sessions per active user declined from 2.44 to 2.18 across the 12-week window.",
    source: "weekly samples",
  },
  {
    id: "ob-2",
    text: "The sample return rate holds near one third, moving between 31% and 33%.",
    source: "weekly samples",
  },
  {
    id: "ob-3",
    text: "Onboarding absorbs most early sample interactions: 4,120 of 5,310 for new accounts.",
    source: "feature usage table",
  },
];

const HELIO_NOTES: AnalyticsDataset["notes"] = [
  {
    id: "note-1",
    title: "Week-1 retention sits near 60% in the sample cohorts",
    shows: "The six displayed cohorts retain 57–61% of their starting size after one week.",
    suggests: "The capture habit may be forming quickly for accounts that start.",
    needs: "Activation-step data and a longer run of cohorts before treating this as stable.",
  },
  {
    id: "note-2",
    title: "Week-4 retention settles around a third",
    shows: "By week 4 the fully observed cohorts retain 34–36% of their starting size.",
    suggests: "Occasional users may be dropping out between week 2 and week 4.",
    needs: "Interviews with lapsed sample accounts, plus feature usage for the lapsing weeks.",
  },
  {
    id: "note-3",
    title: "The newest cohort is only partly observed",
    shows: "The cohort of Oct 5 has three observed weeks; its week 4 has not happened yet in the sample.",
    suggests: "Its early weeks look slightly higher than earlier cohorts, but it is too early to call.",
    needs: "Two more sample weeks before comparing it with the fully observed cohorts.",
  },
];

const ATLAS_NOTES: AnalyticsDataset["notes"] = [
  {
    id: "note-1",
    title: "Shorter history, thinner evidence",
    shows: "Atlas Scout has 12 sample weeks and no cohort table in this demonstration data.",
    suggests: "Retention questions cannot be answered from this window alone.",
    needs: "A longer sample window with published cohort definitions before drawing conclusions.",
  },
  {
    id: "note-2",
    title: "Sessions per user is drifting down",
    shows: "Weekly sessions per active user fell from 2.44 to 2.18 across the sample window.",
    suggests: "The product may be getting quicker to complete, or users may have less to do each week.",
    needs: "Feature-usage and duration data split by segment to separate those two explanations.",
  },
];

const HELIO_REPORTS: AnalyticsDataset["reports"] = [
  {
    id: "rp-001",
    title: "Product Performance Overview",
    description: "A sample read of reach and activity across the recent window.",
    category: "Performance",
    period: "Last 12 sample weeks",
    updated: "Oct 26, 2026 · illustrative data",
    paragraphs: [
      "This sample report summarises how the fictional Helio Notes dataset behaved over the most recent twelve sample weeks. Every figure is drawn from the same weekly samples shown in the Overview chart.",
      "It is written to demonstrate the report layout: it was not generated from production data, it does not refresh, and nothing in it is a measurement of a real product.",
    ],
    values: [
      { label: "Peak weekly active users", value: "2,564" },
      { label: "New accounts in window", value: "2,553" },
      { label: "Sessions in window", value: "64,820" },
    ],
    chart: { seriesKey: "active", title: "Weekly active users · sample" },
  },
  {
    id: "rp-002",
    title: "User Engagement Review",
    description: "How the sample audience used the product within a session.",
    category: "Engagement",
    period: "Last 12 sample weeks",
    updated: "Oct 26, 2026 · illustrative data",
    paragraphs: [
      "Engagement in the sample is described with two predefined measures: sessions per active user and average session length. Both are read directly from the weekly sample rows.",
      "Higher engagement is not treated as automatically positive here. A focused tool can show shorter, more decisive sessions and still be healthy — the numbers describe behaviour, not value.",
    ],
    values: [
      { label: "Sessions per user · latest week", value: "2.36" },
      { label: "Average session · latest week", value: "8.3 min" },
      { label: "Return rate · latest week", value: "48%" },
    ],
    chart: { seriesKey: "sessions", title: "Weekly sessions · sample" },
  },
  {
    id: "rp-003",
    title: "Retention Snapshot",
    description: "The six sample cohorts and what has been observed so far.",
    category: "Retention",
    period: "Six sample cohorts to Oct 5",
    updated: "Oct 26, 2026 · illustrative data",
    paragraphs: [
      "Each row of the cohort table is a fictional signup week with its observed weekly retention. The newest cohort is only partly observed, which is why one cell is empty.",
      "Reading a four-week cohort requires four weeks of observation: the newest row in the table has not reached week 4 yet in this sample.",
    ],
    values: [
      { label: "Week-1 retention range", value: "57–61%" },
      { label: "Week-4 retention range", value: "34–36%" },
      { label: "Latest weekly return rate", value: "48%" },
    ],
    chart: { seriesKey: "returnRate", title: "Weekly return rate · sample" },
  },
  {
    id: "rp-004",
    title: "Feature Usage Summary",
    description: "Where sample interactions landed, by product area.",
    category: "Feature usage",
    period: "Full 26-week sample window",
    updated: "Oct 26, 2026 · illustrative data",
    paragraphs: [
      "Interaction totals cover the full sample window for all users. The breakdown is a static table, not a live query, and it treats every interaction the same way.",
      "Counts show where attention went in this sample. They do not describe satisfaction, success or failure within an area.",
    ],
    values: [
      { label: "Interactions in window", value: "83,610" },
      { label: "Largest area", value: "Core Workflow · 34,120" },
      { label: "Smallest area", value: "Account Settings · 4,310" },
    ],
    bars: {
      label: "Sample interactions by product area",
      rows: HELIO_AREAS.map((area, index) => ({ label: area.name, value: HELIO_USAGE_ALL[index] })),
    },
  },
];

const ATLAS_REPORTS: AnalyticsDataset["reports"] = [
  {
    id: "rp-101",
    title: "Acquisition Snapshot",
    description: "Where the sample accounts came from in the recent window.",
    category: "Performance",
    period: "Last 4 sample weeks",
    updated: "Oct 26, 2026 · illustrative data",
    paragraphs: [
      "A short sample report covering the most recent four sample weeks of the fictional Atlas Scout dataset, with channel counts taken from the same predefined table used elsewhere in this module.",
      "It exists to show the report layout with a smaller dataset. Nothing here refreshes or exports.",
    ],
    values: [
      { label: "New accounts in window", value: "365" },
      { label: "Top sample channel", value: "Organic search · 356" },
      { label: "Peak weekly active users", value: "719" },
    ],
    chart: { seriesKey: "newUsers", title: "Weekly new users · sample" },
  },
  {
    id: "rp-102",
    title: "Engagement Review",
    description: "Session behaviour across the twelve sample weeks.",
    category: "Engagement",
    period: "Last 12 sample weeks",
    updated: "Oct 26, 2026 · illustrative data",
    paragraphs: [
      "Sessions per active user in this sample drifts downward across the window while the active audience keeps growing. Both readings come straight from the weekly sample rows.",
      "The sample cannot tell whether that drift is a shorter path to value or a shrinking weekly job. That question needs evidence outside this dataset.",
    ],
    values: [
      { label: "Sessions per user · latest week", value: "2.18" },
      { label: "Average session · latest week", value: "5.2 min" },
      { label: "Return rate · latest week", value: "32%" },
    ],
    chart: { seriesKey: "perUser", title: "Weekly sessions per user · sample" },
  },
];

/* ------------------------------------------------------------------ datasets */

export const DEMO_ANALYTICS_DATA: Partial<Record<AnalyticsProductId, AnalyticsDataset>> = {
  "helio-notes": {
    weeks: HELIO_WEEKS,
    kpis: { 4: HELIO_KPIS_4, 12: HELIO_KPIS_12, 26: HELIO_KPIS_26 },
    retention: [
      kpi("returning", "Returning Users", "2,328", null, "sample · active accounts that existed before this week", HELIO_WEEKS.slice(-6).map((x) => x.active)),
      kpi("rate", "Retention Rate", "48%", null, "sample · share of the audience that returned in the latest week", HELIO_WEEKS.slice(-6).map((x) => x.returnRate)),
      kpi("per-user", "Sessions / User", "2.36", null, "sample · sessions per active user in the latest week", HELIO_WEEKS.slice(-6).map((x) => x.perUser)),
    ],
    featureAreas: HELIO_AREAS,
    segments: HELIO_SEGMENTS,
    devices: HELIO_DEVICES,
    channels: HELIO_CHANNELS,
    cohorts: HELIO_COHORTS,
    metricDetails: HELIO_DETAILS,
    breakdowns: HELIO_BREAKDOWNS,
    observations: HELIO_OBSERVATIONS,
    notes: HELIO_NOTES,
    reports: HELIO_REPORTS,
  },
  "atlas-scout": {
    weeks: ATLAS_WEEKS,
    kpis: { 4: ATLAS_KPIS_4, 12: ATLAS_KPIS_12 },
    retention: [
      kpi("returning", "Returning Users", "625", null, "sample · active accounts that existed before this week", ATLAS_WEEKS.slice(-6).map((x) => x.active)),
      kpi("rate", "Retention Rate", "32%", null, "sample · share of the audience that returned in the latest week", ATLAS_WEEKS.slice(-6).map((x) => x.returnRate)),
      kpi("per-user", "Sessions / User", "2.18", null, "sample · sessions per active user in the latest week", ATLAS_WEEKS.slice(-6).map((x) => x.perUser)),
    ],
    featureAreas: ATLAS_AREAS,
    segments: ATLAS_SEGMENTS,
    devices: ATLAS_DEVICES,
    channels: ATLAS_CHANNELS,
    cohorts: null,
    metricDetails: ATLAS_DETAILS,
    breakdowns: ATLAS_BREAKDOWNS,
    observations: ATLAS_OBSERVATIONS,
    notes: ATLAS_NOTES,
    reports: ATLAS_REPORTS,
  },
  // beacon-crm has no predefined sample history: every section shows an empty state.
};

/* ----------------------------------------------------------------- selectors */

export function getAnalyticsProduct(id: string): AnalyticsProduct {
  return DEMO_ANALYTICS_PRODUCTS.find((product) => product.id === id) ?? DEMO_ANALYTICS_PRODUCTS[0];
}

export function getAnalyticsDataset(id: string): AnalyticsDataset | null {
  return DEMO_ANALYTICS_DATA[id as AnalyticsProductId] ?? null;
}

export type SeriesSlice = {
  /** ISO Monday dates for the selected window. */
  starts: string[];
  values: number[];
  /** The equally long window immediately before it, when one exists. */
  previous: number[] | null;
};

/** Slices a predefined weekly series to the selected sample window. */
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
