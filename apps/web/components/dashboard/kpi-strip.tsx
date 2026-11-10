import { DeltaTag, Sparkline } from "./panel";
import type { Kpi } from "@/lib/dashboard/snapshot";

/**
 * Four metrics in one hairline-divided strip — a readout, not four cards.
 * The first cell carries a stage-composition tick bar instead of a trend line,
 * because "in the cycle" is a snapshot, not a time series.
 */
export default function KpiStrip({ kpis }: { kpis: Kpi[] }) {
  return (
    <section
      aria-label="Key metrics"
      className="overflow-hidden border border-line bg-panel shadow-[var(--elevation-lift)]"
    >
      <dl className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, index) => (
          <div
            key={kpi.id}
            className="group relative flex min-w-0 flex-col justify-between gap-4 bg-panel px-5 py-5 transition-colors hover:bg-mint-tint/10"
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
            />
            <dt className="flex items-baseline justify-between gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
              {kpi.label}
              <span aria-hidden className="font-mono text-[9px] text-faint/60">
                {String(index + 1).padStart(2, "0")}
              </span>
            </dt>

            <dd className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="font-mono text-[2rem] font-medium leading-none tracking-[-0.04em] text-fg tabular-nums">
                  {kpi.value}
                </span>
                {kpi.unit ? (
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-faint">
                    {kpi.unit}
                  </span>
                ) : null}
                {kpi.delta ? (
                  <DeltaTag
                    text={kpi.delta.text}
                    direction={kpi.delta.direction}
                    good={kpi.delta.good}
                  />
                ) : null}
              </div>

              <div className="mt-3 flex items-end justify-between gap-4 border-t border-line/70 pt-3">
                <p className="max-w-[24ch] text-[11px] leading-snug text-faint">{kpi.footnote}</p>
                {kpi.spark ? (
                  <span className="shrink-0">
                    <Sparkline values={kpi.spark} />
                  </span>
                ) : null}
                {kpi.distribution ? (
                  <span className="flex shrink-0 items-end gap-[3px]" aria-hidden>
                    {kpi.distribution.map((slice) => (
                      <span
                        key={slice.label}
                        title={`Stage ${slice.label}: ${slice.count}`}
                        className="block w-[5px] bg-accent"
                        style={{
                          height: `${6 + slice.count * 3.2}px`,
                          opacity: slice.count ? 0.85 : 0.18,
                        }}
                      />
                    ))}
                  </span>
                ) : null}
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
