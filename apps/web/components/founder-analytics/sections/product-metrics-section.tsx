"use client";

import { useMemo, useState } from "react";

import type { AnalyticsProduct, RangeKey } from "@/lib/founder-analytics/types";
import { METRIC_CATEGORIES } from "@/lib/founder-analytics/types";
import type { AnalyticsDataset } from "@/lib/founder-analytics/types";
import { METRIC_CATALOG, getSeriesSlice } from "@/lib/founder-analytics/demo";

import type { DistributionRow } from "../charts/distribution-bars";
import DistributionBars from "../charts/distribution-bars";
import TrendChart from "../charts/trend-chart";
import { formatWindow } from "../format";
import { AnalyticsEmptyState, SegmentedControl, TextInput } from "../primitives";

export function ProductMetricsSection({
  dataset,
  product,
  range,
  metricId,
  onMetricChange,
}: {
  dataset: AnalyticsDataset | null;
  product: AnalyticsProduct;
  range: RangeKey;
  metricId: string;
  onMetricChange: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [compare, setCompare] = useState(false);
  const [breakdownId, setBreakdownId] = useState<string>("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return METRIC_CATALOG.filter((metric) => {
      const matchesQuery = needle
        ? `${metric.name} ${metric.definition}`.toLowerCase().includes(needle)
        : true;
      const matchesCategory = category === "all" || metric.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  const filtersActive = query !== "" || category !== "all";
  const selected = METRIC_CATALOG.find((metric) => metric.id === metricId) ?? METRIC_CATALOG[0];

  if (!dataset) {
    return (
      <section className="border border-line bg-panel">
        <AnalyticsEmptyState
          title={`No sample metrics are available for ${product.name}`}
          description="The metric catalog is defined for every product, but the sample datasets behind the values and trends have not been published for this product yet."
        />
      </section>
    );
  }

  const metricDetail = dataset.metricDetails[selected.id];
  const breakdowns = dataset.breakdowns[selected.id] ?? [];
  const breakdown = breakdowns.find((entry) => entry.id === breakdownId) ?? breakdowns[0] ?? null;
  const slice = selected.seriesKey ? getSeriesSlice(dataset, selected.seriesKey, range) : null;
  const canCompare = Boolean(slice?.previous);

  return (
    <div className="grid gap-px border border-line bg-line lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      {/* -------------------------------------------------------- catalog --- */}
      <section className="min-w-0 bg-panel" aria-label="Metric catalog">
        <header className="border-b border-line px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
            Metric catalog
          </p>
          <p className="mt-1 text-[11px] text-muted">
            {filtered.length} of {METRIC_CATALOG.length} sample metrics
          </p>
        </header>

        <div className="space-y-2 border-b border-line px-4 py-3">
          <div>
            <label htmlFor="metric-search" className="sr-only">
              Search metrics by name or definition
            </label>
            <TextInput
              id="metric-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search metrics…"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {["all", ...METRIC_CATEGORIES].map((entry) => {
              const active = category === entry;
              return (
                <button
                  key={entry}
                  type="button"
                  onClick={() => setCategory(entry)}
                  aria-pressed={active}
                  className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                    active
                      ? "border-accent/60 bg-mint-tint/50 text-accent"
                      : "border-line text-faint hover:text-fg"
                  }`}
                >
                  {entry === "all" ? "All" : entry}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
              disabled={!filtersActive}
              className="border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-faint transition-colors hover:border-accent hover:text-accent disabled:opacity-50 disabled:hover:border-line disabled:hover:text-faint"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="max-h-[30rem] overflow-y-auto lg:max-h-[42rem]">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                No matching metrics
              </p>
              <p className="mx-auto mt-2 max-w-[32ch] text-[12px] leading-relaxed text-muted">
                No catalog metric matches “{query}” in this category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                }}
                className="mt-3 border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <ul>
              {filtered.map((metric) => {
                const active = metric.id === selected.id;
                const hasData = Boolean(dataset.metricDetails[metric.id]);
                return (
                  <li key={metric.id}>
                    <button
                      type="button"
                      onClick={() => onMetricChange(metric.id)}
                      aria-current={active ? "true" : undefined}
                      className={`w-full border-b border-line px-4 py-3 text-left transition-colors ${
                        active ? "bg-mint-tint/30" : "hover:bg-mint-tint/15"
                      }`}
                    >
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="text-[12.5px] font-medium text-fg">{metric.name}</span>
                        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                          {metric.category}
                        </span>
                      </span>
                      <span className="mt-1 block text-[11.5px] leading-relaxed text-muted">
                        {metric.definition}
                      </span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <span className="border border-line-2 px-1.5 py-[2px] font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                          {metric.unit}
                        </span>
                        <span
                          className={`font-mono text-[10px] uppercase tracking-[0.12em] ${
                            hasData ? "text-accent" : "text-faint"
                          }`}
                        >
                          {hasData
                            ? metric.seriesKey
                              ? "trend + value"
                              : "breakdown only"
                            : "no sample data"}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* --------------------------------------------------------- detail --- */}
      <section className="min-w-0 bg-panel" aria-label="Selected metric detail">
        {!metricDetail ? (
          <AnalyticsEmptyState
            title={`No sample detail for ${selected.name}`}
            description={`The ${product.name} demo dataset does not carry a value, comparison or breakdown for this metric. Nothing is generated to fill the gap.`}
          />
        ) : (
          <div className="space-y-5 px-5 py-5 sm:px-6">
            <header className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                  <span aria-hidden className="size-1.5 bg-mint" />
                  {selected.category} · {selected.unit}
                </p>
                <h3 className="mt-2 text-[clamp(1.15rem,2vw,1.5rem)] font-medium leading-tight tracking-[-0.03em] text-fg">
                  {selected.name}
                </h3>
                <p className="mt-1.5 max-w-[70ch] text-[12.5px] leading-relaxed text-muted">
                  {selected.definition}
                </p>
              </div>
              <div className="shrink-0 border border-line px-3 py-2 text-right">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                  Latest sample week
                </p>
                <p className="mt-1 font-mono text-[22px] leading-none tracking-[-0.02em] text-fg">
                  {metricDetail.value}
                </p>
                {metricDetail.delta ? (
                  <p
                    className={`mt-1.5 font-mono text-[10px] ${
                      metricDetail.delta.good ? "text-accent" : "text-danger"
                    }`}
                  >
                    <span aria-hidden>
                      {metricDetail.delta.direction === "up" ? "▲" : "▼"}{" "}
                    </span>
                    {metricDetail.delta.text}
                  </p>
                ) : null}
              </div>
            </header>

            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
              {metricDetail.previousNote}
            </p>

            {slice ? (
              <div className="border border-line">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg">
                    Trend · {formatWindow(dataset, range)}
                  </p>
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
                    className={`flex h-[24px] items-center gap-2 border px-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                      compare && canCompare
                        ? "border-accent/40 bg-mint-tint text-accent"
                        : "border-line text-faint hover:text-fg"
                    } disabled:cursor-not-allowed disabled:border-line disabled:text-faint/60`}
                  >
                    <span aria-hidden className="block h-px w-3.5 border-t border-dashed border-current" />
                    compare
                  </button>
                </div>
                <TrendChart
                  starts={slice.starts}
                  values={slice.values}
                  previous={compare ? slice.previous : null}
                  format={
                    selected.seriesKey === "avgMinutes" || selected.seriesKey === "perUser"
                      ? "decimal"
                      : selected.seriesKey === "returnRate"
                        ? "percent"
                        : "int"
                  }
                  tone={selected.category === "Retention" ? "mint" : "accent"}
                  label={selected.name}
                  caption={formatWindow(dataset, range)}
                />
              </div>
            ) : (
              <div className="border border-dashed border-line px-4 py-6 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                  No trend dataset
                </p>
                <p className="mx-auto mt-2 max-w-[44ch] text-[12px] leading-relaxed text-muted">
                  The sample data for this metric is published as totals and breakdowns only, so
                  no time series is drawn.
                </p>
              </div>
            )}

            {breakdowns.length > 0 && breakdown ? (
              <div className="border border-line">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg">
                    Breakdown
                  </p>
                  {breakdowns.length > 1 ? (
                    <SegmentedControl
                      label="Breakdown dimension"
                      size="sm"
                      value={breakdown.id}
                      onChange={setBreakdownId}
                      options={breakdowns.map((entry) => ({
                        value: entry.id,
                        label: entry.label.split(" · ")[0],
                      }))}
                    />
                  ) : null}
                </div>
                <div className="px-4 py-4">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                    {breakdown.label}
                  </p>
                  <DistributionBars
                    rows={breakdown.rows.map(
                      (row): DistributionRow => ({
                        id: row.label,
                        label: row.label,
                        value: row.value,
                        note: row.note,
                      }),
                    )}
                    unit={selected.unit}
                  />
                </div>
              </div>
            ) : null}

            <div className="border border-dashed border-accent/50 bg-mint-tint/30 px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                How to read this metric
              </p>
              <p className="mt-2 max-w-[70ch] text-[12.5px] leading-relaxed text-muted">
                {selected.note}
              </p>
            </div>

            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
              Values and comparisons are predefined sample figures · nothing is computed at runtime
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
