"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Shared frame for a dashboard panel: one container, quiet header, action. */
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
    <section
      className={`flex min-w-0 flex-col rounded-card border border-line bg-panel shadow-card ${className}`}
    >
      <header className="flex items-start justify-between gap-4 px-5 pb-3 pt-5">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold leading-snug tracking-[-0.015em] text-fg">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      <div className={`min-w-0 flex-1 px-5 pb-5 ${bodyClassName}`}>{children}</div>
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
      className="flex items-center gap-0.5 rounded-control border border-line bg-surface-sunken/40 p-0.5"
    >
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={active}
            className={`relative rounded-[6px] px-2.5 py-1.5 text-[12.5px] font-medium transition-colors duration-150 ${
              active ? "text-fg" : "text-muted hover:text-fg"
            }`}
          >
            {active ? (
              <motion.span
                layoutId="range-indicator"
                aria-hidden
                className="absolute inset-0 rounded-[6px] bg-panel shadow-[var(--elevation-lift)]"
                transition={{ duration: reduce ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
              />
            ) : null}
            <span className="relative tabular-nums">{option}w</span>
          </button>
        );
      })}
    </div>
  );
}

/** Small trend line for KPI cards. Decorative: the value is in the text. */
export function Sparkline({
  values,
  width = 88,
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
        strokeWidth="1.5"
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
      className={`inline-flex shrink-0 items-center gap-1 rounded-pill px-2 py-0.5 text-[11.5px] font-medium tabular-nums ${
        good ? "bg-success-tint text-success" : "bg-danger-tint text-danger"
      }`}
    >
      <span aria-hidden>{direction === "up" ? "▲" : "▼"}</span>
      {text}
      <span className="sr-only">{good ? " improvement" : " decline"}</span>
    </span>
  );
}
