"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Shared frame for a dashboard panel: hairline header, mono eyebrow, action. */
export function Panel({
  title,
  description,
  action,
  children,
  className = "",
  bodyClassName = "",
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={`flex min-w-0 flex-col bg-panel ${className}`}>
      <header className="flex items-start justify-between gap-4 border-b border-line px-4 py-3.5 sm:px-5">
        <div className="min-w-0">
          <h2 className="text-[13.5px] font-medium tracking-[-0.01em] text-fg">{title}</h2>
          {description ? (
            <p className="mt-0.5 text-[11.5px] leading-relaxed text-faint">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      <div className={`min-w-0 flex-1 px-4 py-4 sm:px-5 ${bodyClassName}`}>{children}</div>
    </section>
  );
}

/** Segmented range control with a sliding indicator. */
export function RangeTabs<T extends number>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div
      role="group"
      aria-label={label}
      className="flex items-center border border-line bg-panel p-px"
    >
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={active}
            className={`relative px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
              active ? "text-accent" : "text-faint hover:text-fg"
            }`}
          >
            {active ? (
              <motion.span
                layoutId="range-indicator"
                aria-hidden
                className="absolute inset-0 border border-accent/40 bg-mint-tint"
                transition={{ duration: reduce ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
              />
            ) : null}
            <span className="relative">{option}w</span>
          </button>
        );
      })}
    </div>
  );
}

/** Small trend line for KPI cells. Decorative: the value is in the text. */
export function Sparkline({
  values,
  width = 92,
  height = 26,
}: {
  values: number[];
  width?: number;
  height?: number;
}) {
  if (values.length < 2) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const step = width / (values.length - 1);
  const points = values.map((value, index) => {
    const x = index * step;
    const y = height - 2 - ((value - min) / span) * (height - 5);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
      className="overflow-visible"
    >
      <polyline
        points={`0,${height} ${points.join(" ")} ${width},${height}`}
        className="fill-mint-tint stroke-none"
      />
      <polyline
        points={points.join(" ")}
        className="fill-none stroke-accent"
        strokeWidth="1.25"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle
        cx={width}
        cy={points[points.length - 1].split(",")[1]}
        r="1.8"
        className="fill-accent"
      />
    </svg>
  );
}

export function DeltaTag({
  text,
  direction,
  good,
}: {
  text: string;
  direction: "up" | "down";
  good: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.04em] ${
        good ? "text-accent" : "text-danger"
      }`}
    >
      <span aria-hidden>{direction === "up" ? "▲" : "▼"}</span>
      {text}
      <span className="sr-only">{good ? " improvement" : " decline"}</span>
    </span>
  );
}
