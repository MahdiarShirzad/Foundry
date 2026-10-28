"use client";

import { useState } from "react";

import { formatShortDate } from "@/lib/dashboard/types";

type HeatCell = { week: number; day: number; count: number; date: string };
type Heatmap = {
  cells: HeatCell[];
  max: number;
  weeks: string[];
  total: number;
};

const CELL = 11;
const GAP = 3;

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ActivityHeatmap({ data }: { data: Heatmap }) {
  const [active, setActive] = useState<HeatCell | null>(null);
  const busiest = data.cells.reduce((best, cell) => (cell.count > best.count ? cell : best), data.cells[0]);

  function level(count: number): number {
    if (count === 0) return 0;
    return Math.min(4, Math.max(1, Math.ceil((count / Math.max(data.max, 1)) * 4)));
  }

  const opacity = [0, 0.16, 0.36, 0.62, 1];
  const days = Math.max(data.cells.length, 1);
  const average = data.total / days;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
      <div className="flex w-full gap-2 sm:max-w-[15.5rem]">
        <div
          className="flex flex-col font-mono text-[8px] uppercase text-faint"
          style={{ gap: GAP, paddingTop: 1 }}
          aria-hidden
        >
          {WEEKDAYS.map((day, index) => (
            <span
              key={day}
              className="flex items-center"
              style={{ height: CELL }}
            >
              {index === 0 || index === 2 || index === 4 ? day.slice(0, 1) : ""}
            </span>
          ))}
        </div>

        <div className="relative min-w-0 flex-1">
          <div
            className="grid grid-flow-col"
            style={{
              gridTemplateRows: `repeat(7, ${CELL}px)`,
              gap: GAP,
            }}
            onMouseLeave={() => setActive(null)}
          >
            {data.cells.map((cell) => (
              <span
                key={`${cell.week}-${cell.day}`}
                title={`${formatShortDate(cell.date)} · ${cell.count} entries`}
                onMouseEnter={() => setActive(cell)}
                className="block bg-accent"
                style={{
                  width: CELL,
                  height: CELL,
                  opacity: opacity[level(cell.count)],
                  backgroundColor: level(cell.count) === 0 ? "var(--line)" : undefined,
                }}
              />
            ))}
          </div>

          {active ? (
            <div
              className="pointer-events-none absolute z-10 border border-line bg-bg px-2 py-1 shadow-[0_10px_24px_-16px_rgb(14_27_29/0.55)]"
              style={{
                left: Math.min(active.week * (CELL + GAP), 120),
                top: -34,
              }}
            >
              <p className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                {WEEKDAYS[active.day]} {formatShortDate(active.date)}
              </p>
              <p className="font-mono text-[11px] text-fg">{active.count} entries</p>
            </div>
          ) : null}

          <div className="mt-2 flex justify-between font-mono text-[8px] uppercase tracking-[0.1em] text-faint">
            <span>{data.weeks[0]}</span>
            <span className="hidden sm:inline">{data.weeks[Math.floor(data.weeks.length / 2)]}</span>
            <span>{data.weeks[data.weeks.length - 1]}</span>
          </div>
        </div>
        </div>

        <dl className="flex shrink-0 gap-5 sm:flex-col sm:gap-2.5">
          <div>
            <dt className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
              entries
            </dt>
            <dd className="font-mono text-[15px] leading-tight text-fg">
              {data.total.toLocaleString("en-US")}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
              per day
            </dt>
            <dd className="font-mono text-[15px] leading-tight text-fg">{average.toFixed(1)}</dd>
          </div>
          <div>
            <dt className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">
              peak
            </dt>
            <dd className="font-mono text-[15px] leading-tight text-fg">{data.max}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3 border-t border-line pt-2.5">
        <p className="text-[11px] leading-snug text-faint">
          last 12 weeks · busiest {formatShortDate(busiest.date)} ({busiest.count} entries)
        </p>
        <span className="flex shrink-0 items-center gap-[3px]" aria-hidden>
          <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-faint">less</span>
          {opacity.map((value, index) => (
            <span
              key={index}
              className="block size-[9px]"
              style={{
                backgroundColor: value === 0 ? "var(--line)" : "var(--accent)",
                opacity: value === 0 ? 1 : value,
              }}
            />
          ))}
          <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-faint">more</span>
        </span>
      </div>
    </div>
  );
}
