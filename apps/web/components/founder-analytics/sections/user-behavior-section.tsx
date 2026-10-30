"use client";

import { Panel } from "@/components/dashboard/panel";

import type { AnalyticsProduct, RangeKey } from "@/lib/founder-analytics/types";
import type { AnalyticsDataset } from "@/lib/founder-analytics/types";

import DistributionBars from "../charts/distribution-bars";
import TrendChart from "../charts/trend-chart";
import { formatFullWindow, formatWindow } from "../format";
import { AnalyticsEmptyState, SegmentedControl } from "../primitives";

export function UserBehaviorSection({
  dataset,
  product,
  range,
  segmentId,
  onSegmentChange,
  areaId,
  onAreaChange,
}: {
  dataset: AnalyticsDataset | null;
  product: AnalyticsProduct;
  range: RangeKey;
  segmentId: string;
  onSegmentChange: (id: string) => void;
  areaId: string | null;
  onAreaChange: (id: string | null) => void;
}) {
  if (!dataset) {
    return (
      <section className="border border-line bg-panel">
        <AnalyticsEmptyState
          title={`No behavior samples for ${product.name}`}
          description="Segment, feature-usage and device samples are published per product. This product has none yet, so the behavior workspace stays empty."
        />
      </section>
    );
  }

  const segment = dataset.segments.find((entry) => entry.id === segmentId) ?? dataset.segments[0];
  const slice = segment
    ? {
        starts: dataset.weeks.slice(-range).map((week) => week.start),
        values: segment.weeklySessions.slice(-range),
      }
    : null;
  const area = dataset.featureAreas.find((entry) => entry.id === areaId) ?? null;
  const areaIndex = area ? dataset.featureAreas.findIndex((entry) => entry.id === area.id) : -1;
  const areaValue = segment && areaIndex >= 0 ? segment.usage[areaIndex] : null;
  const usagePeak = segment ? Math.max(1, ...segment.usage) : 1;

  return (
    <div className="space-y-4">
      {/* -------------------------------------------------------- segment --- */}
      <section className="border border-line bg-panel" aria-label="Audience segment">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              Segment explorer
            </p>
            <p className="mt-1 text-[11.5px] text-muted">
              {segment
                ? segment.description
                : "No predefined segments exist for this product."}
            </p>
          </div>
          {dataset.segments.length > 1 ? (
            <SegmentedControl
              label="User segment"
              size="sm"
              value={segment?.id ?? ""}
              onChange={onSegmentChange}
              options={dataset.segments.map((entry) => ({
                value: entry.id,
                label: entry.name,
              }))}
            />
          ) : null}
        </header>

        {segment ? (
          <dl className="grid grid-cols-2 divide-line sm:grid-cols-4 sm:divide-x">
            <div className="px-4 py-3.5">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                Users · latest week
              </dt>
              <dd className="mt-2 font-mono text-[20px] leading-none tracking-[-0.02em] text-fg">
                {segment.users.toLocaleString("en-US")}
              </dd>
            </div>
            <div className="border-t border-line px-4 py-3.5 sm:border-t-0">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                Sessions · full window
              </dt>
              <dd className="mt-2 font-mono text-[20px] leading-none tracking-[-0.02em] text-fg">
                {segment.sessions.toLocaleString("en-US")}
              </dd>
            </div>
            <div className="border-t border-line px-4 py-3.5 sm:border-t-0">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                Avg session · latest week
              </dt>
              <dd className="mt-2 font-mono text-[20px] leading-none tracking-[-0.02em] text-fg">
                {segment.avgMinutes.toFixed(1)}
                <span className="ml-1 font-mono text-[10px] tracking-normal text-faint">min</span>
              </dd>
            </div>
            <div className="border-t border-line px-4 py-3.5 sm:border-t-0">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                Share of audience
              </dt>
              <dd className="mt-2 font-mono text-[20px] leading-none tracking-[-0.02em] text-fg">
                {segment.share}
                <span className="ml-0.5 font-mono text-[11px] text-faint">%</span>
              </dd>
            </div>
          </dl>
        ) : null}
      </section>

      <div className="grid gap-4 lg:grid-cols-12">
        <Panel
          className="lg:col-span-8"
          title="Sessions over time"
          description={`Weekly sample sessions for the selected segment across the ${rangeLabelSafe(range)} window.`}
        >
          {slice ? (
            <TrendChart
              starts={slice.starts}
              values={slice.values}
              format="int"
              tone="accent"
              label={`${segment?.name ?? "All users"} · sessions`}
              caption={formatWindow(dataset, range)}
            />
          ) : (
            <AnalyticsEmptyState
              compact
              title="No segment series"
              description="This segment has no predefined weekly series in the sample data."
            />
          )}
        </Panel>

        <Panel
          className="lg:col-span-4"
          title="Sessions by device"
          description="Where the sample sessions started."
        >
          <DistributionBars
            rows={dataset.devices}
            unit="sessions"
            caption={`all users · full ${dataset.weeks.length}-week window (${formatFullWindow(dataset)})`}
          />
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Panel
          className="lg:col-span-7"
          title="Feature usage by product area"
          description={`Sample interactions for ${segment?.name.toLowerCase() ?? "all users"} · full ${dataset.weeks.length}-week window. Select an area to inspect it.`}
        >
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Sample interactions per product area for the selected segment. Select an area to see
              its detail.
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="border-b border-line pb-1.5 font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-faint"
                >
                  Product area
                </th>
                <th
                  scope="col"
                  className="border-b border-line pb-1.5 text-right font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-faint"
                >
                  Interactions
                </th>
                <th scope="col" className="border-b border-line pb-1.5 pl-4">
                  <span className="sr-only">Relative usage</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {dataset.featureAreas.map((entry, index) => {
                const value = segment?.usage[index] ?? 0;
                const active = area?.id === entry.id;
                return (
                  <tr key={entry.id} className="border-b border-line/70 last:border-0">
                    <td className="py-2 pr-3">
                      <button
                        type="button"
                        onClick={() => onAreaChange(active ? null : entry.id)}
                        aria-pressed={active}
                        className={`text-left text-[12.5px] transition-colors ${
                          active ? "text-accent" : "text-fg hover:text-accent"
                        }`}
                      >
                        {entry.name}
                      </button>
                    </td>
                    <td className="py-2 pr-3 text-right font-mono text-[11.5px] text-fg">
                      {value.toLocaleString("en-US")}
                    </td>
                    <td className="w-1/3 py-2 pl-4">
                      <span aria-hidden className="block h-[5px] bg-line">
                        <span
                          className="block h-full bg-accent transition-[width] duration-300"
                          style={{
                            width: `${(value / usagePeak) * 100}%`,
                            opacity: active ? 1 : 0.55,
                          }}
                        />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-3 border-t border-line pt-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            Sample interactions · counts are predefined, nothing is aggregated at runtime
          </p>
        </Panel>

        <Panel
          className="lg:col-span-5"
          title="Area detail"
          description="Selected product area and how to read it."
        >
          {!area || areaValue === null || !segment ? (
            <AnalyticsEmptyState
              compact
              title="Select a product area"
              description="Choose an area in the usage table to see its sample value and interpretation note."
            />
          ) : (
            <div className="space-y-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                  {product.name} · {segment.name}
                </p>
                <h3 className="mt-1.5 text-[1.15rem] font-medium tracking-[-0.02em] text-fg">
                  {area.name}
                </h3>
                <p className="mt-1 text-[12px] leading-relaxed text-muted">{area.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-px border border-line bg-line">
                <div className="bg-panel px-3 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                    Interactions
                  </p>
                  <p className="mt-1.5 font-mono text-[18px] leading-none text-fg">
                    {areaValue.toLocaleString("en-US")}
                  </p>
                </div>
                <div className="bg-panel px-3 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                    Sample window
                  </p>
                  <p className="mt-1.5 font-mono text-[12px] leading-tight text-fg">
                    full {dataset.weeks.length} weeks
                  </p>
                </div>
              </div>
              <div className="border border-dashed border-accent/50 bg-mint-tint/30 px-3 py-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                  Interpretation note
                </p>
                <p className="mt-2 text-[12px] leading-relaxed text-muted">{area.note}</p>
              </div>
              <button
                type="button"
                onClick={() => onAreaChange(null)}
                className="border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-faint transition-colors hover:border-accent hover:text-accent"
              >
                Clear selection
              </button>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function rangeLabelSafe(range: RangeKey): string {
  return `${range}-week`;
}
