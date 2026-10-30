"use client";

import type { CohortRow } from "@/lib/founder-analytics/types";

/**
 * Cohort retention table. Every percentage is a predefined value from the
 * sample dataset; cell shading is a reading aid only, and the number itself
 * is always present so nothing depends on colour.
 */
export default function CohortTable({ rows }: { rows: CohortRow[] }) {
  const weekLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
  const swatches = [0.1, 0.22, 0.34, 0.46, 0.58, 0.7];

  function alpha(value: number): number {
    const bucket = Math.min(swatches.length - 1, Math.floor(value / (100 / swatches.length)));
    return swatches[bucket];
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[30rem] border-collapse text-left">
          <caption className="sr-only">
            Sample retention by signup cohort: starting size and the share returning in weeks one
            to four. Empty cells are weeks that have not been observed in the sample yet.
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="border-b border-line pb-1.5 font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-faint"
              >
                Cohort
              </th>
              <th
                scope="col"
                className="border-b border-line pb-1.5 text-right font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-faint"
              >
                Size
              </th>
              {weekLabels.map((week) => (
                <th
                  key={week}
                  scope="col"
                  className="border-b border-line pb-1.5 text-right font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-faint"
                >
                  {week}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-line/70 last:border-0">
                <th
                  scope="row"
                  className="py-2 pr-3 text-[12.5px] font-normal text-fg"
                >
                  {row.label}
                </th>
                <td className="py-2 pr-3 text-right font-mono text-[11px] text-muted">
                  {row.size}
                </td>
                {row.weeks.map((value, index) => (
                  <td key={index} className="py-1.5 pl-1.5 text-right align-middle">
                    {value === null ? (
                      <span
                        className="inline-flex h-6 min-w-[3.25rem] items-center justify-end border border-dashed border-line px-2 font-mono text-[11px] text-faint"
                        title="Not observed in the sample window yet"
                      >
                        —<span className="sr-only"> not yet observed</span>
                      </span>
                    ) : (
                      <span className="relative inline-flex h-6 min-w-[3.25rem] items-center justify-end overflow-hidden border border-line px-2">
                        <span
                          aria-hidden
                          className="absolute inset-0 bg-accent"
                          style={{ opacity: alpha(value) }}
                        />
                        <span className="relative font-mono text-[11px] text-fg">{value}%</span>
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-2.5">
        <p className="max-w-[52ch] text-[11.5px] leading-snug text-faint">
          Read each row down: the share of one signup cohort that was still active in later sample
          weeks. Dashed cells have not been observed yet.
        </p>
        <span className="flex shrink-0 items-center gap-[3px]" aria-hidden>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">less</span>
          {swatches.map((value) => (
            <span
              key={value}
              className="block size-[9px] border border-line"
              style={{ backgroundColor: "var(--accent)", opacity: value }}
            />
          ))}
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">more</span>
        </span>
      </div>
    </div>
  );
}
