"use client";

import KpiStrip from "@/components/dashboard/kpi-strip";
import { Panel } from "@/components/dashboard/panel";

import type { AnalyticsProduct, RangeKey, SeriesKey } from "@/lib/founder-analytics/types";
import type { AnalyticsDataset } from "@/lib/founder-analytics/types";
import { SERIES_META, getSeriesSlice } from "@/lib/founder-analytics/demo";

import CohortTable from "../charts/cohort-table";
import TrendChart from "../charts/trend-chart";
import { formatWindow } from "../format";
import { AnalyticsEmptyState, SegmentedControl } from "../primitives";

const ENGAGEMENT_METRICS: SeriesKey[] = ["sessions", "avgMinutes", "perUser", "returnRate"];

export function RetentionSection({
  dataset,
  product,
  range,
  engagementKey,
  onEngagementChange,
}: {
  dataset: AnalyticsDataset | null;
  product: AnalyticsProduct;
  range: RangeKey;
  engagementKey: SeriesKey;
  onEngagementChange: (key: SeriesKey) => void;
}) {
  if (!dataset) {
    return (
      <section className="border border-line bg-panel">
        <AnalyticsEmptyState
          title={`No retention samples for ${product.name}`}
          description="Retention summaries, cohorts and engagement series are published per product. This product has none yet."
        />
      </section>
    );
  }

  const slice = getSeriesSlice(dataset, engagementKey, range);
  const meta = SERIES_META[engagementKey];

  return (
    <div className="space-y-4">
      <section aria-label="Retention summary" className="space-y-3">
        <header className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
              Retention overview
            </p>
            <p className="mt-1 max-w-[72ch] text-[11.5px] text-muted">
              Sample figures from the latest sample week — read them as illustration, not as a
              retention study. A fuller judgement needs a longer observation period and consistent
              cohort definitions.
            </p>
          </div>
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
            demo data
          </p>
        </header>
        <KpiStrip kpis={dataset.retention} />
      </section>

      <div className="grid gap-4 lg:grid-cols-12">
        <Panel
          className="lg:col-span-7"
          title="Cohort retention"
          description="Share of each sample signup cohort that was still active in later weeks."
          action={
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
              last {dataset.cohorts?.length ?? 0} cohorts
            </span>
          }
        >
          {dataset.cohorts && dataset.cohorts.length > 0 ? (
            <CohortTable rows={dataset.cohorts} />
          ) : (
            <AnalyticsEmptyState
              compact
              title="No cohort dataset for this product"
              description="Cohort retention is a predefined table that has not been published for this product's demo data. Cohorts are never derived from the weekly samples at runtime."
            />
          )}
        </Panel>

        <Panel
          className="lg:col-span-5"
          title="Interpretation notes"
          description="Hand-written notes on what the sample patterns do and do not show."
        >
          <ul className="space-y-3">
            {dataset.notes.map((note) => (
              <li key={note.id} className="border border-line px-3 py-3">
                <p className="text-[12.5px] font-medium leading-snug text-fg">{note.title}</p>
                <dl className="mt-2 space-y-1.5">
                  {(
                    [
                      ["Sample shows", note.shows],
                      ["Might suggest", note.suggests],
                      ["Would need", note.needs],
                    ] as const
                  ).map(([label, text]) => (
                    <div key={label} className="flex gap-2">
                      <dt className="w-[6.5rem] shrink-0 font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
                        {label}
                      </dt>
                      <dd className="min-w-0 text-[11.5px] leading-relaxed text-muted">{text}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-line pt-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
            Authored by hand · no automated analysis
          </p>
        </Panel>
      </div>

      <Panel
        title="Engagement trend"
        description={`${meta.description} Explain it in plain language: this chart describes behaviour in the sample, not whether the behaviour is good or bad.`}
        action={
          <SegmentedControl
            label="Engagement metric"
            size="sm"
            value={engagementKey}
            onChange={onEngagementChange}
            options={ENGAGEMENT_METRICS.map((key) => ({
              value: key,
              label: SERIES_META[key].label,
            }))}
          />
        }
      >
        <TrendChart
          starts={slice.starts}
          values={slice.values}
          previous={null}
          format={meta.format}
          tone={meta.tone}
          label={meta.label}
          unit={meta.unit}
          caption={formatWindow(dataset, range)}
        />
        <p className="mt-3 border-t border-line pt-2.5 text-[11.5px] leading-relaxed text-faint">
          {meta.description} A high reading is not automatically positive and a low reading is not
          automatically negative — both need context from the rest of this module.
        </p>
      </Panel>
    </div>
  );
}
