import { DeltaTag, Sparkline } from "./panel";
import type { Kpi } from "@/lib/dashboard/snapshot";

/**
 * Four KPI cards on one row. Label above, 32px value, delta pill and a small
 * sparkline for shape — a readout, not four competing panels.
 */
export default function KpiStrip({ kpis }: { kpis: Kpi[] }) {
  return (
    <section aria-label="Key metrics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <article
          key={kpi.id}
          className="min-w-0 rounded-card border border-line bg-panel px-5 py-4 shadow-card transition-colors duration-150 hover:border-line-2"
        >
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-[13px] font-medium text-muted">{kpi.label}</p>
            {kpi.delta ? (
              <DeltaTag text={kpi.delta.text} direction={kpi.delta.direction} good={kpi.delta.good} />
            ) : null}
          </div>

          <div className="mt-2 flex items-end justify-between gap-4">
            <p className="flex min-w-0 flex-wrap items-baseline gap-x-1.5">
              <span className="font-sans text-[2rem] font-semibold leading-none tracking-[-0.035em] text-fg tabular-nums">
                {kpi.value}
              </span>
              {kpi.unit ? (
                <span className="text-[12.5px] font-medium text-faint">{kpi.unit}</span>
              ) : null}
            </p>
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
                    className="block w-[5px] rounded-pill bg-accent"
                    style={{
                      height: `${6 + slice.count * 3.2}px`,
                      opacity: slice.count ? 0.85 : 0.18,
                    }}
                  />
                ))}
              </span>
            ) : null}
          </div>

          <p className="mt-2.5 text-[12.5px] leading-snug text-faint">{kpi.footnote}</p>
        </article>
      ))}
    </section>
  );
}
