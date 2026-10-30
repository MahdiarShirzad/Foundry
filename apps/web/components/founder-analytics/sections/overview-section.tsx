"use client";

import { useState } from "react";

import KpiStrip from "@/components/dashboard/kpi-strip";
import { Panel } from "@/components/dashboard/panel";

import type { AnalyticsDataset, AnalyticsProduct, RangeKey } from "@/lib/founder-analytics/types";
import { getKpis, getSeriesSlice, rangeLabel } from "@/lib/founder-analytics/demo";

import DistributionBars from "../charts/distribution-bars";
import TrendChart from "../charts/trend-chart";
import { formatFullWindow, formatWindow } from "../format";
import { AnalyticsEmptyState, SegmentedControl } from "../primitives";

const PRIMARY_METRICS = [
  { value: "active", label: "Active Users" },
  { value: "newUsers", label: "New Users" },
  { value: "sessions", label: "Sessions" },
] as const;

type PrimaryMetric = (typeof PRIMARY_METRICS)[number]["value"];

export function OverviewSection({
  dataset,
  product,
  range,
}: {
  dataset: AnalyticsDataset | null;
  product: AnalyticsProduct;
  range: RangeKey;
}) {
  const [metric, setMetric] = useState<PrimaryMetric>("active");
  const [compare, setCompare] = useState(false);

  if (!dataset) {
    return (
      <section className="border border-line bg-panel">
        <AnalyticsEmptyState
          title={`No sample metrics are available for ${product.name}`}
          description="This product was added to the demo workspace but has no predefined analytics history, so every panel in this module stays empty until sample data is published for it."
        />
      </section>
    );
  }

  const kpis = getKpis(dataset, range);
  const slice = getSeriesSlice(dataset, metric, range);
  const metricName = PRIMARY_METRICS.find((entry) => entry.value === metric)?.label ?? "";
  const canCompare = slice.previous !== null;

  return (
    <div className="space-y-4">
      {kpis ? (
        <KpiStrip kpis={kpis} />
      ) : (
        <section className="border border-line bg-panel">
          <AnalyticsEmptyState
            compact
            title={`No KPI summary for a ${range}-week window`}
            description={`${product.name} does not have ${range} sample weeks of history, so no metric summary is predefined for this window. Try a shorter range.`}
          />
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-12">
        <Panel
          className="lg:col-span-8"
          title={`${metricName} over the sample period`}
          description={`Weekly sample values for the selected ${rangeLabel(range)} window. Focus the chart and use the arrow keys to step through weeks.`}
          action={
            <div className="flex flex-wrap items-center justify-end gap-2">
              <SegmentedControl
                label="Chart metric"
                size="sm"
                value={metric}
                onChange={setMetric}
                options={PRIMARY_METRICS.map((entry) => ({
                  value: entry.value,
                  label: entry.label,
                }))}
              />
              <button
                type="button"
                onClick={() => setCompare((value) => !value)}
                aria-pressed={compare}
                disabled={!canCompare}
                title={
                  canCompare
                    ? "Overlay the previous window of the same length"
                    : `A ${range}-week comparison needs ${range * 2} sample weeks of history`
                }
                className={`flex h-[26px] items-center gap-2 border px-2 font-mono text-[9.5px] uppercase tracking-[0.14em] transition-colors ${
                  compare && canCompare
                    ? "border-accent/40 bg-mint-tint text-accent"
                    : "border-line text-faint hover:text-fg"
                } disabled:cursor-not-allowed disabled:border-line disabled:text-faint/60`}
              >
                <span aria-hidden className="block h-px w-4 border-t border-dashed border-current" />
                compare
              </button>
            </div>
          }
        >
          <TrendChart
            starts={slice.starts}
            values={slice.values}
            previous={compare ? slice.previous : null}
            format="int"
            tone={metric === "newUsers" ? "mint" : "accent"}
            label={metricName}
            caption={formatWindow(dataset, range)}
          />
        </Panel>

        <Panel
          className="lg:col-span-4"
          title="Acquisition channels"
          description="Where the sample accounts came from."
        >
          <DistributionBars
            rows={dataset.channels}
            unit="signups"
            caption={`sample signups · full ${dataset.weeks.length}-week window (${formatFullWindow(dataset)})`}
          />
        </Panel>
      </div>

      <Panel
        title="Recent observations"
        description="Sample observations authored for this demonstration — not generated from the data."
      >
        {dataset.observations.length === 0 ? (
          <AnalyticsEmptyState
            compact
            title="No authored observations"
            description="No sample observations were written for this product."
          />
        ) : (
          <ul className="divide-y divide-line">
            {dataset.observations.map((entry) => (
              <li key={entry.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2.5 first:pt-0 last:pb-0">
                <span aria-hidden className="mt-[6px] size-1.5 shrink-0 bg-mint" />
                <p className="min-w-0 flex-1 text-[12.5px] leading-relaxed text-fg">{entry.text}</p>
                <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                  {entry.source}
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 border-t border-line pt-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
          Sample observations · written by hand for this demo
        </p>
      </Panel>
    </div>
  );
}
