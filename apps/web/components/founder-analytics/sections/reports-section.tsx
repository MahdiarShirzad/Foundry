"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { Panel } from "@/components/dashboard/panel";

import type {
  AnalyticsProduct,
  Observation,
  ObservationDraft,
  RangeKey,
} from "@/lib/founder-analytics/types";
import type { AnalyticsDataset } from "@/lib/founder-analytics/types";
import { METRIC_CATALOG, SERIES_META, getSeriesSlice } from "@/lib/founder-analytics/demo";

import DistributionBars from "../charts/distribution-bars";
import TrendChart from "../charts/trend-chart";
import { ObservationDialog } from "../dialogs/observation-dialog";
import { formatWindow } from "../format";
import { AnalyticsEmptyState, TextInput } from "../primitives";

const TYPE_TONE: Record<string, string> = {
  Pattern: "border-accent/60 text-accent",
  Question: "border-line-2 text-muted",
  Risk: "border-danger/50 text-danger",
  Opportunity: "border-mint/70 text-fg",
};

export function ReportsSection({
  dataset,
  product,
  range,
  observations,
  reportId,
  onReportChange,
  onCreate,
  onUpdate,
  onDelete,
  onExport,
}: {
  dataset: AnalyticsDataset | null;
  product: AnalyticsProduct;
  range: RangeKey;
  observations: Observation[];
  reportId: string | null;
  onReportChange: (id: string | null) => void;
  onCreate: (draft: ObservationDraft) => void;
  onUpdate: (id: string, draft: ObservationDraft) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
}) {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Observation | null>(null);

  const reports = useMemo(() => dataset?.reports ?? [], [dataset]);
  const categories = useMemo(
    () => Array.from(new Set(reports.map((report) => report.category))),
    [reports],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return reports.filter((report) => {
      const matchesQuery = needle
        ? `${report.title} ${report.description}`.toLowerCase().includes(needle)
        : true;
      const matchesCategory = category === "all" || report.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [reports, query, category]);

  const filtersActive = query !== "" || category !== "all";
  const selected = filtered.find((report) => report.id === reportId) ?? null;

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  if (!dataset) {
    return (
      <section className="border border-line bg-panel">
        <AnalyticsEmptyState
          title={`No reports for ${product.name}`}
          description="Sample reports are authored per product. This product has none yet, and nothing is generated to fill the gap."
          action={
            <button
              type="button"
              onClick={openCreate}
              className="border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
            >
              New observation
            </button>
          }
        />
        <ObservationDialog
          open
          key={editing?.id ?? "create"}
          onClose={() => setDialogOpen(false)}
          initial={editing}
          onSubmit={(draft) => {
            onCreate(draft);
            setDialogOpen(false);
          }}
        />
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-12">
        {/* ------------------------------------------------ report list --- */}
        <Panel
          className="lg:col-span-5"
          title="Reports"
          description={`${reports.length} predefined sample report${reports.length === 1 ? "" : "s"} for ${product.name}.`}
        >
          <div className="space-y-2">
            <div>
              <label htmlFor="report-search" className="sr-only">
                Search reports
              </label>
              <TextInput
                id="report-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search reports…"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {["all", ...categories].map((entry) => {
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

          <div className="mt-3 max-h-[26rem] overflow-y-auto border-t border-line">
            {filtered.length === 0 ? (
              <div className="px-2 py-8 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                  No matching reports
                </p>
                <p className="mx-auto mt-2 max-w-[30ch] text-[12px] leading-relaxed text-muted">
                  {reports.length === 0
                    ? "No sample reports are authored for this product."
                    : "No report matches the active search and filters."}
                </p>
                {reports.length > 0 ? (
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
                ) : null}
              </div>
            ) : (
              <ul>
                {filtered.map((report) => {
                  const active = report.id === selected?.id;
                  return (
                    <li key={report.id}>
                      <button
                        type="button"
                        onClick={() => onReportChange(report.id)}
                        aria-current={active ? "true" : undefined}
                        className={`w-full border-b border-line px-3 py-3 text-left transition-colors ${
                          active ? "bg-mint-tint/30" : "hover:bg-mint-tint/15"
                        }`}
                      >
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="text-[12.5px] font-medium text-fg">{report.title}</span>
                          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                            {report.category}
                          </span>
                        </span>
                        <span className="mt-1 block text-[11.5px] leading-relaxed text-muted">
                          {report.description}
                        </span>
                        <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                          {report.period} · {report.updated}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Panel>

        {/* ------------------------------------------------ report detail --- */}
        <Panel
          className="lg:col-span-7"
          title={selected ? selected.title : "Report detail"}
          description={selected ? selected.description : "Select a report to read it."}
          action={
            selected ? (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onReportChange(null)}
                  className="border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-faint transition-colors hover:border-accent hover:text-accent"
                >
                  ← All reports
                </button>
                <button
                  type="button"
                  onClick={onExport}
                  className="border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg transition-colors hover:border-accent hover:text-accent"
                >
                  Export
                </button>
              </div>
            ) : undefined
          }
        >
          {!selected ? (
            <AnalyticsEmptyState
              compact
              title="Select a report"
              description="Choose a sample report from the list to read its text, figures and charts."
            />
          ) : (
            <motion.div
              key={selected.id}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                <span className="border border-line-2 px-1.5 py-[2px]">{selected.category}</span>
                <span>{selected.period}</span>
                <span aria-hidden>·</span>
                <span>{selected.updated}</span>
              </div>

              {selected.paragraphs.map((paragraph, index) => (
                <p key={index} className="max-w-[78ch] text-[12.5px] leading-relaxed text-fg">
                  {paragraph}
                </p>
              ))}

              <div className="grid gap-px border border-line bg-line sm:grid-cols-3">
                {selected.values.map((entry) => (
                  <div key={entry.label} className="bg-panel px-3 py-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                      {entry.label}
                    </p>
                    <p className="mt-1.5 font-mono text-[15px] leading-tight text-fg">
                      {entry.value}
                    </p>
                  </div>
                ))}
              </div>

              {selected.chart ? (
                <div className="border border-line">
                  <p className="border-b border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-fg">
                    {selected.chart.title} · {formatWindow(dataset, range)}
                  </p>
                  <TrendChart
                    starts={getSeriesSlice(dataset, selected.chart.seriesKey, range).starts}
                    values={getSeriesSlice(dataset, selected.chart.seriesKey, range).values}
                    format={
                      SERIES_META[selected.chart.seriesKey].format === "decimal"
                        ? "decimal"
                        : SERIES_META[selected.chart.seriesKey].format === "percent"
                          ? "percent"
                          : "int"
                    }
                    tone={SERIES_META[selected.chart.seriesKey].tone === "muted" ? "muted" : SERIES_META[selected.chart.seriesKey].tone}
                    label={SERIES_META[selected.chart.seriesKey].label}
                    unit={SERIES_META[selected.chart.seriesKey].unit}
                    caption={formatWindow(dataset, range)}
                  />
                </div>
              ) : null}

              {selected.bars ? (
                <div className="border border-line px-4 py-4">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-fg">
                    {selected.bars.label}
                  </p>
                  <DistributionBars
                    rows={selected.bars.rows.map((row) => ({
                      id: row.label,
                      label: row.label,
                      value: row.value,
                    }))}
                    unit="interactions"
                  />
                </div>
              ) : null}

              <p className="border-t border-line pt-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                Predefined sample report · not generated from production data
              </p>
            </motion.div>
          )}
        </Panel>
      </div>

      {/* ---------------------------------------------------- observations --- */}
      <section className="border border-line bg-panel" aria-label="Founder observations">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              Founder observations
            </p>
            <p className="mt-1 text-[11.5px] text-muted">
              Notes you keep while exploring · stored in this UI session only
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="border border-accent/70 bg-mint-tint/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-accent transition-colors hover:bg-mint-tint"
          >
            New observation
          </button>
        </header>

        <div className="px-4 py-4">
          {observations.length === 0 ? (
            <AnalyticsEmptyState
              compact
              title="No observations in this session"
              description="Nothing has been written down yet. Add a short observation to capture what you noticed while reading these sample metrics."
              action={
                <button
                  type="button"
                  onClick={openCreate}
                  className="border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
                >
                  New observation
                </button>
              }
            />
          ) : (
            <ul className="space-y-2">
              {observations.map((entry) => {
                const metric = METRIC_CATALOG.find((item) => item.id === entry.metricId);
                return (
                  <li key={entry.id} className="border border-line px-3 py-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`border px-1.5 py-[2px] font-mono text-[10px] uppercase tracking-[0.13em] ${
                              TYPE_TONE[entry.type] ?? "border-line-2 text-faint"
                            }`}
                          >
                            {entry.type}
                          </span>
                          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                            {metric?.name ?? "Unlinked"}
                          </span>
                          {entry.sample ? (
                            <span className="border border-line-2 px-1.5 py-[2px] font-mono text-[10px] uppercase tracking-[0.13em] text-faint">
                              sample note
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 text-[12.5px] font-medium text-fg">{entry.title}</p>
                        <p className="mt-1 max-w-[80ch] text-[12px] leading-relaxed text-muted">
                          {entry.description}
                        </p>
                        {entry.nextStep ? (
                          <p className="mt-1.5 text-[11.5px] leading-relaxed text-faint">
                            Next: {entry.nextStep}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(entry);
                            setDialogOpen(true);
                          }}
                          className="border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-faint transition-colors hover:border-accent hover:text-accent"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(entry.id)}
                          className="border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-faint transition-colors hover:border-danger/60 hover:text-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <ObservationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initial={editing}
        onSubmit={(draft, id) => {
          if (id) onUpdate(id, draft);
          else onCreate(draft);
          setDialogOpen(false);
        }}
      />
    </div>
  );
}
