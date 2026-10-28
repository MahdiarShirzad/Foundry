"use client";

import { useState } from "react";

import type { EvidenceSlice } from "@/lib/dashboard/snapshot";

const SIZE = 148;
const RADIUS = 58;
const STROKE = 15;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 3;

/**
 * Proportion of evidence by kind. Segments never rely on colour alone: the
 * legend carries labels, values and percentages, and the centre repeats the
 * hovered slice in text.
 */
export default function EvidenceDonut({ slices }: { slices: EvidenceSlice[] }) {
  const [active, setActive] = useState<number | null>(null);
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);

  const span = (value: number) => (total === 0 ? 0 : (value / total) * CIRCUMFERENCE);
  const segments = slices.map((slice, index) => ({
    slice,
    length: Math.max(span(slice.value) - GAP, 1),
    offset: slices.slice(0, index).reduce((start, entry) => start + span(entry.value), 0),
  }));

  const focused = active === null ? null : slices[active];
  const summary = slices
    .map((slice) => `${slice.label} ${slice.value} entries`)
    .join(", ");

  return (
    <div>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-5">
        <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            role="img"
            aria-label={`Evidence mix over the period: ${summary}`}
            className="[transform:rotate(-90deg)]"
          >
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="var(--line)"
              strokeWidth="1"
            />
            {segments.map(({ slice, length, offset: start }, index) => (
              <circle
                key={slice.key}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={slice.tone}
                strokeWidth={active === index ? STROKE + 4 : STROKE}
                strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
                strokeDashoffset={-start}
                className="cursor-pointer transition-[stroke-width] duration-200"
                onMouseEnter={() => setActive(index)}
                onMouseLeave={() => setActive(null)}
              />
            ))}
          </svg>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-[21px] leading-none tracking-[-0.02em] text-fg">
              {focused ? focused.value : total.toLocaleString("en-US")}
            </span>
            <span className="mt-1 max-w-[5.5rem] font-mono text-[8.5px] uppercase leading-tight tracking-[0.16em] text-faint">
              {focused ? focused.label : "entries"}
            </span>
          </div>
        </div>

        <ul className="w-full space-y-1.5">
          {slices.map((slice, index) => {
            const pct = total === 0 ? 0 : Math.round((slice.value / total) * 100);
            return (
              <li key={slice.key}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(index)}
                  onBlur={() => setActive(null)}
                  className={`flex w-full items-baseline gap-2 py-0.5 text-left transition-opacity ${
                    active !== null && active !== index ? "opacity-55" : "opacity-100"
                  }`}
                >
                  <span
                    aria-hidden
                    className="mt-[3px] block size-2 shrink-0"
                    style={{ backgroundColor: slice.tone }}
                  />
                  <span className="min-w-0 flex-1 truncate text-[12px] text-muted">
                    {slice.label}
                  </span>
                  <span className="font-mono text-[10.5px] text-fg">{slice.value}</span>
                  <span className="w-8 text-right font-mono text-[10px] text-faint">{pct}%</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="mt-3 border-t border-line pt-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
        interviews dominate · surveys are the thinnest signal
      </p>
    </div>
  );
}
