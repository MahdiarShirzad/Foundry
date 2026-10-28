import type { GateDecision, GateOutcome } from "@/lib/dashboard/types";
import { formatShortDate } from "@/lib/dashboard/types";

const OUTCOME: Record<GateOutcome, { label: string; className: string }> = {
  go: { label: "Go", className: "border-accent/50 bg-mint-tint text-accent" },
  pivot: { label: "Pivot", className: "border-line-2 text-fg" },
  stop: { label: "Stop", className: "border-danger/40 text-danger" },
};

/** The last gate reviews — decisions, not an activity feed. */
export default function GateLog({ rows }: { rows: GateDecision[] }) {
  return (
    <ol className="space-y-0">
      {rows.map((row, index) => {
        const outcome = OUTCOME[row.outcome];
        return (
          <li
            key={row.id}
            className={`flex gap-3 py-2.5 ${index === 0 ? "pt-0" : ""} ${
              index === rows.length - 1 ? "pb-0" : "border-b border-line/70"
            }`}
          >
            <span className="w-11 shrink-0 pt-[3px] font-mono text-[9px] uppercase tracking-[0.1em] text-faint">
              {formatShortDate(row.date)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="min-w-0 truncate text-[12px] text-fg">{row.initiative}</p>
                <span
                  className={`shrink-0 border px-1.5 py-[1px] font-mono text-[8.5px] uppercase tracking-[0.14em] ${outcome.className}`}
                >
                  {outcome.label}
                </span>
              </div>
              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                {row.gate}
              </p>
              {row.note ? (
                <p className="mt-1 line-clamp-2 text-[10.5px] leading-snug text-muted">{row.note}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
