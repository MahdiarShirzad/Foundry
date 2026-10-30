"use client";

/**
 * Compact horizontal bars for categorical sample values (devices, channels).
 * Percentages are a display encoding of the supplied counts — the counts
 * themselves are the predefined data.
 */

export type DistributionRow = { id: string; label: string; value: number; note?: string };

export default function DistributionBars({
  rows,
  unit,
  caption,
}: {
  rows: DistributionRow[];
  unit: string;
  caption?: string;
}) {
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  const peak = Math.max(1, ...rows.map((row) => row.value));

  if (rows.length === 0 || total === 0) return null;

  return (
    <div>
      <ul className="space-y-2.5">
        {rows.map((row) => {
          const share = Math.round((row.value / total) * 100);
          return (
            <li key={row.id}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate text-[12.5px] text-fg">{row.label}</span>
                <span className="flex shrink-0 items-baseline gap-2">
                  <span className="font-mono text-[11px] text-fg">
                    {row.value.toLocaleString("en-US")}
                  </span>
                  <span className="w-9 text-right font-mono text-[10px] text-faint">{share}%</span>
                </span>
              </div>
              <span aria-hidden className="mt-1.5 block h-[5px] bg-line">
                <span
                  className="block h-full bg-accent"
                  style={{ width: `${(row.value / peak) * 100}%`, opacity: 0.62 }}
                />
              </span>
              {row.note ? (
                <span className="mt-1 block text-[11px] leading-snug text-faint">{row.note}</span>
              ) : null}
            </li>
          );
        })}
      </ul>

      <p className="mt-3 border-t border-line pt-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
        {caption ?? `${total.toLocaleString("en-US")} ${unit} in the sample`}
      </p>
    </div>
  );
}
