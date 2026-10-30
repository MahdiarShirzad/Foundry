"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { formatShortDate } from "@/lib/dashboard/types";

const TONE: Record<"accent" | "mint" | "muted", string> = {
  accent: "var(--accent)",
  mint: "var(--mint)",
  muted: "var(--faint)",
};

const HEIGHT = 264;
const PAD = { top: 14, right: 12, bottom: 24, left: 42 };
const NICE = [1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10];

export type TrendFormat = "int" | "decimal" | "percent";

function formatValue(value: number, format: TrendFormat, precise = false): string {
  if (format === "percent") return `${Math.round(value)}%`;
  if (format === "decimal") return precise ? value.toFixed(2) : value.toFixed(1);
  return value.toLocaleString("en-US");
}

function niceScale(peak: number, format: TrendFormat): { max: number; step: number } {
  const target = Math.max(peak, format === "int" ? 4 : 0.1) / 5;
  const magnitude = Math.pow(10, Math.floor(Math.log10(target)));
  const normalised = target / magnitude;
  const factor = NICE.find((candidate) => candidate >= normalised) ?? 10;
  let step = factor * magnitude;
  if (format === "int") step = Math.max(1, Math.round(step));
  const max = step * Math.ceil(Math.max(peak, 0.0001) / step);
  return { max, step };
}

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

/**
 * Line chart for a single predefined series over sample weeks, with an
 * optional dashed previous window. Renders only the values it is given:
 * no interpolation, no smoothing, no generated numbers.
 */
export default function TrendChart({
  starts,
  values,
  previous,
  format = "int",
  tone = "accent",
  label,
  unit,
  caption,
  height = HEIGHT,
}: {
  starts: string[];
  values: number[];
  previous?: number[] | null;
  format?: TrendFormat;
  tone?: "accent" | "mint" | "muted";
  label: string;
  unit?: string;
  caption?: string;
  height?: number;
}) {
  const reduce = useReducedMotion();
  const { ref, width } = useMeasuredWidth();
  const [active, setActive] = useState<number | null>(null);

  const geometry = useMemo(() => {
    const chartWidth = Math.max(width, 320);
    const plotWidth = chartWidth - PAD.left - PAD.right;
    const plotHeight = height - PAD.top - PAD.bottom;
    const peak = Math.max(1, ...values, ...(previous ?? []));
    const { max } = niceScale(peak, format);
    const steps = Math.round(max / (max / 5));

    const x = (index: number) =>
      PAD.left + (values.length <= 1 ? plotWidth / 2 : (index / (values.length - 1)) * plotWidth);
    const y = (value: number) => PAD.top + plotHeight - (value / max) * plotHeight;
    const line = (series: number[]) =>
      series
        .map((value, index) => `${index === 0 ? "M" : "L"}${x(index).toFixed(2)},${y(value).toFixed(2)}`)
        .join(" ");

    return { chartWidth, plotWidth, plotHeight, max, steps, x, y, line };
  }, [width, values, previous, format, height]);

  const { chartWidth, plotWidth, plotHeight, max, steps, x, y, line } = geometry;

  const labelStep = Math.max(
    1,
    Math.ceil(values.length / (width < 480 ? 4 : width < 760 ? 6 : 8)),
  );

  const peak = Math.max(...values);
  const trough = Math.min(...values);
  const summary = `${label} across ${values.length} sample weeks, from ${formatShortDate(starts[0])} to ${formatShortDate(
    starts[starts.length - 1],
  )}. Values run from ${formatValue(trough, format)} to ${formatValue(peak, format)}${
    unit ? ` ${unit}` : ""
  }. Sample data.`;

  function handlePointer(event: React.PointerEvent<SVGSVGElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const relative = ((event.clientX - bounds.left) / bounds.width) * chartWidth;
    const ratio = (relative - PAD.left) / plotWidth;
    const index = Math.round(ratio * (values.length - 1));
    setActive(Math.max(0, Math.min(values.length - 1, index)));
  }

  const activeX = active === null ? null : x(active);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 px-4 pt-3.5 sm:px-5">
        <span className="flex items-baseline gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-fg">
          <span
            aria-hidden
            className="mt-[2px] block h-[2px] w-4 shrink-0"
            style={{ backgroundColor: TONE[tone] }}
          />
          {label}
          {unit ? <span className="text-faint">{unit}</span> : null}
        </span>
        {previous ? (
          <span className="flex items-baseline gap-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-faint">
            <span aria-hidden className="block h-px w-4 border-t border-dashed border-faint" />
            previous window
          </span>
        ) : null}
        {caption ? (
          <span className="ml-auto font-mono text-[9.5px] uppercase tracking-[0.14em] text-faint">
            {caption}
          </span>
        ) : null}
      </div>

      <div ref={ref} className="relative mt-2 w-full min-w-0 overflow-hidden" style={{ height }}>
        {width > 0 ? (
          <svg
            width={chartWidth}
            height={height}
            viewBox={`0 0 ${chartWidth} ${height}`}
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
                  const base = current ?? values.length - 1;
                  const next = event.key === "ArrowRight" ? base + 1 : base - 1;
                  return Math.max(0, Math.min(values.length - 1, next));
                });
              }
              if (event.key === "Escape") setActive(null);
            }}
            onBlur={() => setActive(null)}
          >
            {/* grid + y labels */}
            {Array.from({ length: steps + 1 }, (_, index) => {
              const value = (max / steps) * index;
              const yPos = y(value);
              return (
                <g key={index}>
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
                    {formatValue(value, format)}
                  </text>
                </g>
              );
            })}

            {/* previous window */}
            {previous ? (
              <path
                d={line(previous)}
                fill="none"
                stroke={TONE[tone]}
                strokeWidth="1.2"
                strokeDasharray="3 4"
                strokeOpacity="0.45"
              />
            ) : null}

            {/* series */}
            <motion.path
              key={`${label}-${values.length}-${values[0]}`}
              d={line(values)}
              fill="none"
              stroke={TONE[tone]}
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduce ? false : { pathLength: 0, opacity: 0.4 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: reduce ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* x labels */}
            {starts.map((start, index) =>
              index % labelStep === 0 || index === starts.length - 1 ? (
                <text
                  key={`${start}-${index}`}
                  x={x(index)}
                  y={height - 6}
                  textAnchor={
                    index === 0 ? "start" : index === starts.length - 1 ? "end" : "middle"
                  }
                  className="fill-faint font-mono text-[9px]"
                >
                  {formatShortDate(start)}
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
                <circle
                  cx={activeX}
                  cy={y(values[active ?? 0])}
                  r="3"
                  fill="var(--panel)"
                  stroke={TONE[tone]}
                  strokeWidth="1.8"
                />
                {previous ? (
                  <circle
                    cx={activeX}
                    cy={y(previous[active ?? 0])}
                    r="2.4"
                    fill="var(--panel)"
                    stroke={TONE[tone]}
                    strokeWidth="1.4"
                    strokeDasharray="2 2"
                  />
                ) : null}
              </g>
            ) : null}
          </svg>
        ) : null}

        {/* tooltip */}
        {active !== null && width > 0 ? (
          <div
            className="pointer-events-none absolute top-1 z-10 min-w-[9.5rem] border border-line bg-bg px-2.5 py-2 shadow-[0_10px_24px_-16px_rgb(14_27_29/0.55)]"
            style={{ left: Math.min(Math.max(x(active) - 72, 0), Math.max(chartWidth - 170, 0)) }}
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
              Week of {formatShortDate(starts[active])}
            </p>
            <p className="mt-1 flex items-baseline justify-between gap-4">
              <span className="text-[11px] text-muted">{label}</span>
              <span className="font-mono text-[11.5px] text-fg">
                {formatValue(values[active], format, true)}
              </span>
            </p>
            {previous ? (
              <p className="mt-0.5 flex items-baseline justify-between gap-4 text-faint">
                <span className="text-[10.5px]">previous window</span>
                <span className="font-mono text-[10.5px]">
                  {formatValue(previous[active], format, true)}
                </span>
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
