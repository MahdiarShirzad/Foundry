import { STAGES } from "@/components/site/data";

import { DEMO_SNAPSHOT } from "./demo";
import { formatShortDate, type Initiative, type Week } from "./types";

/**
 * Presentation data for the dashboard.
 *
 * Everything here is derived once from the static demo snapshot so chart and
 * KPI components stay pure and the figures always agree with each other
 * (a KPI total is the sum of the points you can see in the chart).
 *
 * This is the seam to replace when the API exists: swap `DEMO_SNAPSHOT` for a
 * fetch and keep the exported shapes.
 */

export const RANGES = [4, 12, 26] as const;
export type RangeKey = (typeof RANGES)[number];

export type Series = {
  key: "captured" | "validated" | "launched";
  label: string;
  values: number[];
  tone: "muted" | "accent" | "mint";
};

const rangeLabels: Record<RangeKey, string> = {
  4: "4 weeks",
  12: "12 weeks",
  26: "26 weeks",
};

function lastWeeks(count: number): Week[] {
  return DEMO_SNAPSHOT.weeks.slice(-count);
}

function sum(weeks: Week[], key: keyof Omit<Week, "start">): number {
  return weeks.reduce((total, week) => total + week[key], 0);
}

function evidenceTotal(weeks: Week[]): number {
  return (
    sum(weeks, "interviews") +
    sum(weeks, "experiments") +
    sum(weeks, "feedback") +
    sum(weeks, "surveys")
  );
}

function rate(weeks: Week[]): number {
  const captured = sum(weeks, "captured");
  return captured === 0 ? 0 : (sum(weeks, "validated") / captured) * 100;
}

export type RangeDataset = {
  key: RangeKey;
  label: string;
  caption: string;
  labels: string[];
  series: Series[];
  previous: Series[] | null;
};

function buildRange(key: RangeKey): RangeDataset {
  const current = lastWeeks(key);
  const previous = DEMO_SNAPSHOT.weeks.slice(-(key * 2), -key);
  const hasPrevious = previous.length === key;

  const series: Series[] = [
    {
      key: "captured",
      label: "Captured",
      tone: "muted",
      values: current.map((week) => week.captured),
    },
    {
      key: "validated",
      label: "Validated",
      tone: "accent",
      values: current.map((week) => week.validated),
    },
    {
      key: "launched",
      label: "Launched",
      tone: "mint",
      values: current.map((week) => week.launched),
    },
  ];

  const previousSeries: Series[] | null = hasPrevious
    ? series.map((entry) => ({
        ...entry,
        values: previous.map((week) => week[entry.key]),
      }))
    : null;

  return {
    key,
    label: rangeLabels[key],
    caption: `${formatShortDate(current[0].start)} – ${formatShortDate(current[current.length - 1].start)}`,
    labels: current.map((week) => formatShortDate(week.start)),
    series,
    previous: previousSeries,
  };
}

export const RANGE_DATA: Record<RangeKey, RangeDataset> = {
  4: buildRange(4),
  12: buildRange(12),
  26: buildRange(26),
};

/* --------------------------------------------------------------------- KPIs */

export type KpiDelta = { text: string; direction: "up" | "down"; good: boolean } | null;

export type Kpi = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  delta: KpiDelta;
  footnote: string;
  spark?: number[];
  /** Secondary visual: stage composition for "in the cycle". */
  distribution?: { label: string; count: number }[];
};

function signed(value: number, suffix = ""): string {
  const rounded = Math.round(value * 10) / 10;
  if (rounded === 0) return `0${suffix}`;
  return `${rounded > 0 ? "+" : "−"}${Math.abs(rounded)}${suffix}`;
}

const asOf = DEMO_SNAPSHOT.workspace.asOf;

function daysSince(iso: string): number {
  return Math.round(
    (Date.parse(`${asOf}T00:00:00Z`) - Date.parse(`${iso}T00:00:00Z`)) / 86_400_000,
  );
}

const stageCounts = STAGES.map((stage) => ({
  id: stage.id,
  name: stage.name,
  verb: stage.verb,
  count: DEMO_SNAPSHOT.initiatives.filter((item) => item.stageId === stage.id).length,
}));

const daysInStage = DEMO_SNAPSHOT.initiatives
  .map((item) => daysSince(item.stageSince))
  .sort((a, b) => a - b);

const medianDays =
  daysInStage.length % 2 === 0
    ? (daysInStage[daysInStage.length / 2 - 1] + daysInStage[daysInStage.length / 2]) / 2
    : daysInStage[(daysInStage.length - 1) / 2];

function buildKpis(key: RangeKey): Kpi[] {
  const current = lastWeeks(key);
  const previous = DEMO_SNAPSHOT.weeks.slice(-(key * 2), -key);
  const comparable = previous.length === key;

  const rateNow = rate(current);
  const rateBefore = comparable ? rate(previous) : 0;
  const evidenceNow = evidenceTotal(current);
  const evidenceBefore = comparable ? evidenceTotal(previous) : 0;
  const evidenceChange =
    comparable && evidenceBefore > 0 ? ((evidenceNow - evidenceBefore) / evidenceBefore) * 100 : 0;

  const weeklyRate = current.map((week) =>
    week.captured === 0 ? 0 : (week.validated / week.captured) * 100,
  );

  return [
    {
      id: "cycle",
      label: "In the cycle",
      value: String(DEMO_SNAPSHOT.initiatives.length),
      unit: "initiatives",
      delta: null,
      footnote: `${stageCounts.filter((stage) => stage.count > 0).length} of 8 stages in use`,
      distribution: stageCounts.map((stage) => ({ label: stage.id, count: stage.count })),
    },
    {
      id: "rate",
      label: "Validation rate",
      value: `${rateNow.toFixed(0)}%`,
      delta: comparable
        ? {
            text: signed(rateNow - rateBefore, " pts"),
            direction: rateNow >= rateBefore ? "up" : "down",
            good: rateNow >= rateBefore,
          }
        : null,
      footnote: `${sum(current, "validated")} of ${sum(current, "captured")} captured ideas passed`,
      spark: weeklyRate,
    },
    {
      id: "evidence",
      label: "Evidence logged",
      value: evidenceNow.toLocaleString("en-US"),
      unit: "entries",
      delta: comparable
        ? {
            text: signed(evidenceChange, "%"),
            direction: evidenceChange >= 0 ? "up" : "down",
            good: evidenceChange >= 0,
          }
        : null,
      footnote: "Interviews, experiments, feedback and surveys",
      spark: current.map((week) =>
        week.interviews + week.experiments + week.feedback + week.surveys,
      ),
    },
    {
      id: "age",
      label: "Median days in stage",
      value: String(Math.round(medianDays)),
      unit: "days",
      delta: null,
      footnote: `${daysInStage.filter((days) => days > 60).length} initiatives past 60 days`,
    },
  ];
}

export const KPI_BY_RANGE: Record<RangeKey, Kpi[]> = {
  4: buildKpis(4),
  12: buildKpis(12),
  26: buildKpis(26),
};

/* ---------------------------------------------------------------- breakdowns */

export const STAGE_LOAD = stageCounts;

export type EvidenceSlice = { key: string; label: string; value: number; tone: string };

export function evidenceMix(key: RangeKey): EvidenceSlice[] {
  const current = lastWeeks(key);
  return [
    { key: "interviews", label: "Interviews", value: sum(current, "interviews"), tone: "var(--accent)" },
    { key: "experiments", label: "Experiments", value: sum(current, "experiments"), tone: "var(--mint)" },
    { key: "feedback", label: "Feedback", value: sum(current, "feedback"), tone: "var(--line-2)" },
    { key: "surveys", label: "Surveys", value: sum(current, "surveys"), tone: "var(--faint)" },
  ];
}

/** Muted weeks × 7 days heatmap for the last 12 weeks. */
export type HeatCell = { week: number; day: number; count: number; date: string };

const DAY_WEIGHTS = [0.3, 1.15, 1.3, 1.25, 1.15, 0.95, 0.4];

export const HEATMAP = (() => {
  const weeks = lastWeeks(12);
  const cells: HeatCell[] = [];
  weeks.forEach((week, weekIndex) => {
    const total = evidenceTotal([week]);
    const shares = DAY_WEIGHTS.map((weight) => Math.round((total * weight) / 6.5));
    // Keep the week's sum exact by correcting the rounding drift on Thursday.
    const drift = total - shares.reduce((a, b) => a + b, 0);
    shares[3] += drift;
    const weekStart = Date.parse(`${week.start}T00:00:00Z`);
    shares.forEach((count, day) => {
      cells.push({
        week: weekIndex,
        day,
        count,
        date: new Date(weekStart + day * 86_400_000).toISOString().slice(0, 10),
      });
    });
  });
  const max = Math.max(...cells.map((cell) => cell.count));
  return {
    cells,
    max,
    weeks: weeks.map((week) => formatShortDate(week.start)),
    total: cells.reduce((total, cell) => total + cell.count, 0),
  };
})();

/* ----------------------------------------------------------------- attention */

export type AttentionRow = {
  id: string;
  name: string;
  owner: string;
  stageId: string;
  stageName: string;
  days: number;
  nextGate: string | null;
  signal: { label: string; kind: "blocked" | "feedback" | "stale" };
  href: string;
};

export function stageSlug(stageId: string): string {
  const stage = STAGES.find((item) => item.id === stageId);
  if (!stage) return "eight-stages";
  return `${stage.id}-${stage.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function signalFor(initiative: Initiative, days: number): AttentionRow["signal"] | null {
  if (initiative.blocker) return { label: "Blocked", kind: "blocked" };
  if (initiative.openFeedback >= 5) {
    return { label: `${initiative.openFeedback} open feedback`, kind: "feedback" };
  }
  if (days > 60) return { label: `Stale · ${days}d`, kind: "stale" };
  if (days > 21) return { label: `${days}d in stage`, kind: "stale" };
  return null;
}

export const ATTENTION: AttentionRow[] = DEMO_SNAPSHOT.initiatives
  .map((initiative) => {
    const days = daysSince(initiative.stageSince);
    const signal = signalFor(initiative, days);
    if (!signal) return null;
    const stage = STAGES.find((item) => item.id === initiative.stageId);
    return {
      id: initiative.id,
      name: initiative.name,
      owner: initiative.owner,
      stageId: initiative.stageId,
      stageName: stage?.name ?? "—",
      days,
      nextGate: initiative.nextGate,
      signal,
      href: `/dashboard/modules#${stageSlug(initiative.stageId)}`,
    } satisfies AttentionRow;
  })
  .filter((row): row is AttentionRow => row !== null)
  .sort((a, b) => {
    const weight = { blocked: 0, feedback: 1, stale: 2 } as const;
    if (weight[a.signal.kind] !== weight[b.signal.kind]) {
      return weight[a.signal.kind] - weight[b.signal.kind];
    }
    return b.days - a.days;
  });

export const DECISIONS = DEMO_SNAPSHOT.decisions;

export const WORKSPACE = DEMO_SNAPSHOT.workspace;

export { STAGES };
