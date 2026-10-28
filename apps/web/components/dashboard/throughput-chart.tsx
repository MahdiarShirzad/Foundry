"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import type { RangeDataset, Series } from "@/lib/dashboard/snapshot";

const TONE: Record<Series["tone"], string> = {
  muted: "var(--faint)",
  accent: "var(--accent)",
  mint: "var(--mint)",
};

const HEIGHT = 300;
const PAD = { top: 16, right: 12, bottom: 24, left: 30 };

function useMeasuredWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      setWidth(Math.round(entries[0].contentRect.width));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}

function niceMax(value: number): number {
  if (value <= 4) return 4;
  if (value <= 8) return 8;
  if (value <= 12) return 12;
  return Math.ceil(value / 4) * 4;
}

export default function ThroughputChart({
  dataset,
  compare,
}: {
  dataset: RangeDataset;
  compare: boolean;
}) {
  const reduce = useReducedMotion();
  const { ref, width } = useMeasuredWidth();
  const [hidden, setHidden] = useState<string[]>([]);
  const [active, setActive] = useState<number | null>(null);

  const visible = dataset.series.filter((series) => !hidden.includes(series.key));

  const geometry = useMemo(() => {
    const chartWidth = Math.max(width, 320);
    const plotWidth = chartWidth - PAD.left - PAD.right;
    const plotHeight = HEIGHT - PAD.top - PAD.bottom;

    const peak = Math.max(
      1,
      ...visible.flatMap((series) => series.values),
      ...(compare && dataset.previous ? dataset.previous.flatMap((series) => series.values) : []),
    );
    const max = niceMax(peak);

    const x = (index: number) =>
      PAD.left +
      (dataset.labels.length === 1
        ? plotWidth / 2
        : (index / (dataset.labels.length - 1)) * plotWidth);
    const y = (value: number) => PAD.top + plotHeight - (value / max) * plotHeight;

    const line = (values: number[]) =>
      values
        .map((value, index) => `${index === 0 ? "M" : "L"}${x(index).toFixed(2)},${y(value).toFixed(2)}`)
        .join(" ");

    const area = (values: number[]) =>
      `${line(values)} L${x(values.length - 1).toFixed(2)},${PAD.top + plotHeight} L${x(0).toFixed(2)},${
        PAD.top + plotHeight
      } Z`;

    return { chartWidth, plotWidth, plotHeight, max, x, y, line, area };
  }, [width, visible, compare, dataset]);

  const { chartWidth, plotWidth, plotHeight, max, x, y, line, area } = geometry;

  const labelStep = width < 480 ? Math.ceil(dataset.labels.length / 4) : Math.ceil(dataset.labels.length / 7);

  const totals = dataset.series.reduce<Record<string, number>>((acc, series) => {
    acc[series.key] = series.values.reduce((total, value) => total + value, 0);
    return acc;
  }, {});

  const peakIndex = useMemo(() => {
    const primary = dataset.series.find((series) => series.key === "captured");
    if (!primary) return 0;
    return primary.values.indexOf(Math.max(...primary.values));
  }, [dataset]);

  const summary = `Cycle throughput for the last ${dataset.label}. Captured ${totals.captured}, validated ${totals.validated}, launched ${totals.launched} initiatives. Busiest week ${dataset.labels[peakIndex]}.`;

  function toggleSeries(key: string) {
    setHidden((current) => {
      if (current.includes(key)) return current.filter((entry) => entry !== key);
      if (dataset.series.length - current.length <= 1) return current;
      return [...current, key];
    });
  }

  function handlePointer(event: React.PointerEvent<SVGSVGElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const relative = ((event.clientX - bounds.left) / bounds.width) * chartWidth;
    const ratio = (relative - PAD.left) / plotWidth;
    const index = Math.round(ratio * (dataset.labels.length - 1));
    setActive(Math.max(0, Math.min(dataset.labels.length - 1, index)));
  }

  const activeX = active === null ? null : x(active);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 pt-3.5 sm:px-5">
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {dataset.series.map((series) => {
            const isHidden = hidden.includes(series.key);
            return (
              <li key={series.key}>
                <button
                  type="button"
                  onClick={() => toggleSeries(series.key)}
                  aria-pressed={!isHidden}
                  className={`group flex items-baseline gap-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-opacity ${
                    isHidden ? "opacity-40" : "opacity-100"
                  }`}
                >
                  <span
                    aria-hidden
                    className="mt-[2px] block h-[2px] w-4 shrink-0"
                    style={{ backgroundColor: TONE[series.tone] }}
                  />
                  <span className={isHidden ? "text-faint" : "text-fg"}>{series.label}</span>
                  <span className="text-faint">{totals[series.key]}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {compare && dataset.previous ? (
          <span className="flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-faint">
            <span aria-hidden className="block h-px w-4 border-t border-dashed border-faint" />
            previous {dataset.label}
          </span>
        ) : null}
        <span className="ml-auto font-mono text-[9.5px] uppercase tracking-[0.14em] text-faint">
          per week
        </span>
      </div>

      <div ref={ref} className="relative mt-2 w-full min-w-0 overflow-hidden" style={{ height: HEIGHT }}>
        {width > 0 ? (
          <svg
            width={chartWidth}
            height={HEIGHT}
            viewBox={`0 0 ${chartWidth} ${HEIGHT}`}
            className="max-w-full touch-pan-y focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            tabIndex={0}
            role="img"
            aria-label={summary}
            onPointerMove={handlePointer}
            onPointerDown={handlePointer}
            onPointerLeave={() => setActive(null)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                event.preventDefault();
                setActive((current) => {
                  const base = current ?? dataset.labels.length - 1;
                  const next = event.key === "ArrowRight" ? base + 1 : base - 1;
                  return Math.max(0, Math.min(dataset.labels.length - 1, next));
                });
              }
              if (event.key === "Escape") setActive(null);
            }}
            onBlur={() => setActive(null)}
          >
            {/* grid + y labels */}
            {Array.from({ length: Math.round(max / (max / 4)) + 1 }, (_, index) => {
              const value = (max / 4) * index;
              const yPos = y(value);
              return (
                <g key={value}>
                  <line
                    x1={PAD.left}
                    x2={chartWidth - PAD.right}
                    y1={yPos}
                    y2={yPos}
                    stroke="var(--line)"
                    strokeWidth="1"
                  />
                  <text
                    x={PAD.left - 6}
                    y={yPos + 3}
                    textAnchor="end"
                    className="fill-faint font-mono text-[9px]"
                  >
                    {value}
                  </text>
                </g>
              );
            })}

            {/* previous period */}
            {compare && dataset.previous
              ? dataset.previous
                  .filter((series) => !hidden.includes(series.key))
                  .map((series) => (
                    <path
                      key={`prev-${series.key}`}
                      d={line(series.values)}
                      fill="none"
                      stroke={TONE[series.tone]}
                      strokeWidth="1.2"
                      strokeDasharray="3 4"
                      strokeOpacity="0.45"
                    />
                  ))
              : null}

            {/* area under the primary (validated) series */}
            {visible.some((series) => series.key === "validated") ? (
              <motion.path
                key={`area-${dataset.key}`}
                d={area(dataset.series.find((series) => series.key === "validated")?.values ?? [])}
                fill="var(--accent)"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 0.08 }}
                transition={{ duration: 0.5 }}
              />
            ) : null}

            {/* lines */}
            {visible.map((series) => (
              <motion.path
                key={`${series.key}-${dataset.key}`}
                d={line(series.values)}
                fill="none"
                stroke={TONE[series.tone]}
                strokeWidth={series.key === "validated" ? 1.9 : 1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduce ? false : { pathLength: 0, opacity: 0.4 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}

            {/* x labels */}
            {dataset.labels.map((label, index) =>
              index % labelStep === 0 || index === dataset.labels.length - 1 ? (
                <text
                  key={`${label}-${index}`}
                  x={x(index)}
                  y={HEIGHT - 6}
                  textAnchor={index === 0 ? "start" : index === dataset.labels.length - 1 ? "end" : "middle"}
                  className="fill-faint font-mono text-[9px]"
                >
                  {label}
                </text>
              ) : null,
            )}

            {/* crosshair */}
            {activeX !== null ? (
              <g>
                <line
                  x1={activeX}
                  x2={activeX}
                  y1={PAD.top}
                  y2={PAD.top + plotHeight}
                  stroke="var(--line-2)"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
                {visible.map((series) => (
                  <circle
                    key={`dot-${series.key}`}
                    cx={activeX}
                    cy={y(series.values[active ?? 0])}
                    r="2.6"
                    fill="var(--panel)"
                    stroke={TONE[series.tone]}
                    strokeWidth="1.6"
                  />
                ))}
              </g>
            ) : null}
          </svg>
        ) : null}

        {/* tooltip */}
        {active !== null && width > 0 ? (
          <div
            className="pointer-events-none absolute top-1 z-10 min-w-[8.5rem] border border-line bg-bg px-2.5 py-2 shadow-[0_10px_24px_-16px_rgb(14_27_29/0.55)]"
            style={{
              left: Math.min(Math.max(x(active) - 68, 0), Math.max(chartWidth - 150, 0)),
            }}
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
              Week of {dataset.labels[active]}
            </p>
            <ul className="mt-1 space-y-0.5">
              {visible.map((series) => (
                <li
                  key={`tip-${series.key}`}
                  className="flex items-baseline justify-between gap-4"
                >
                  <span className="flex items-baseline gap-1.5 text-[11px] text-muted">
                    <span
                      aria-hidden
                      className="mt-[3px] block h-[2px] w-2.5"
                      style={{ backgroundColor: TONE[series.tone] }}
                    />
                    {series.label}
                  </span>
                  <span className="font-mono text-[11px] text-fg">
                    {series.values[active]}
                  </span>
                </li>
              ))}
              {compare && dataset.previous
                ? dataset.previous
                    .filter((series) => !hidden.includes(series.key))
                    .map((series) => (
                      <li
                        key={`tprev-${series.key}`}
                        className="flex items-baseline justify-between gap-4 text-faint"
                      >
                        <span className="text-[10.5px]">{series.label} · prev</span>
                        <span className="font-mono text-[10.5px]">{series.values[active]}</span>
                      </li>
                    ))
                : null}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
