"use client";

import Link from "next/link";

import type { AttentionRow } from "@/lib/dashboard/snapshot";
import { formatShortDate } from "@/lib/dashboard/types";

function Signal({ signal }: { signal: AttentionRow["signal"] }) {
  const tone =
    signal.kind === "blocked"
      ? "border-danger/50 text-danger"
      : signal.kind === "feedback"
        ? "border-accent/50 text-accent"
        : "border-line-2 text-muted";
  const mark = signal.kind === "blocked" ? "bg-danger" : signal.kind === "feedback" ? "bg-accent" : "bg-line-2";

  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-1.5 py-[2px] font-mono text-[9px] uppercase tracking-[0.12em] ${tone}`}
    >
      <span aria-hidden className={`size-1.5 ${mark}`} />
      {signal.label}
    </span>
  );
}

export default function AttentionTable({
  rows,
  stageFilter,
  stageName,
  onClear,
}: {
  rows: AttentionRow[];
  stageFilter: string | null;
  stageName?: string;
  onClear: () => void;
}) {
  const visible = stageFilter ? rows.filter((row) => row.stageId === stageFilter) : rows;

  if (visible.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border border-dashed border-line-2 px-6 py-10 text-center">
        <p className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-accent">clear</p>
        <p className="mt-2 text-[13px] text-fg">
          Nothing needs attention{stageName ? ` in ${stageName}` : ""}.
        </p>
        <p className="mt-1 max-w-[34ch] text-[11.5px] leading-relaxed text-faint">
          Every initiative in this stage is inside its gate window and below the feedback threshold.
        </p>
        {stageFilter ? (
          <button
            type="button"
            onClick={onClear}
            className="mt-4 border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
          >
            Clear filter
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      {/* desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Initiatives that are blocked, carrying unresolved feedback, or past their stage window
          </caption>
          <thead>
            <tr>
              {["Initiative", "Stage", "In stage", "Signal", "Next gate"].map((heading, index) => (
                <th
                  key={heading}
                  scope="col"
                  className={`border-b border-line pb-1.5 font-mono text-[9px] font-normal uppercase tracking-[0.18em] text-faint ${
                    index === 2 ? "text-right" : index === 4 ? "text-right" : ""
                  }`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.id} className="group border-b border-line/70 last:border-0">
                <td className="py-2.5 pr-4">
                  <Link href={row.href} className="flex items-baseline gap-2">
                    <span className="truncate text-[12.5px] text-fg transition-colors group-hover:text-accent">
                      {row.name}
                    </span>
                    <span className="shrink-0 font-mono text-[9px] tracking-[0.1em] text-faint">
                      {row.owner}
                    </span>
                  </Link>
                </td>
                <td className="py-2.5 pr-4">
                  <span className="font-mono text-[9px] tracking-[0.14em] text-accent">
                    {row.stageId}
                  </span>{" "}
                  <span className="text-[11.5px] text-muted">{row.stageName}</span>
                </td>
                <td className="py-2.5 pr-4 text-right font-mono text-[11px] text-fg">
                  {row.days}
                  <span className="ml-0.5 text-[9px] text-faint">d</span>
                </td>
                <td className="py-2.5 pr-4">
                  <Signal signal={row.signal} />
                </td>
                <td className="py-2.5 text-right font-mono text-[10.5px] text-muted">
                  {row.nextGate ? formatShortDate(row.nextGate) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* mobile */}
      <ul className="space-y-px md:hidden">
        {visible.map((row) => (
          <li key={row.id}>
            <Link
              href={row.href}
              className="block border border-line px-3 py-2.5 transition-colors hover:border-accent/60"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="min-w-0 truncate text-[12.5px] text-fg">{row.name}</span>
                <span className="shrink-0 font-mono text-[9px] text-faint">{row.owner}</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className="font-mono text-[9px] tracking-[0.14em] text-accent">
                  {row.stageId}
                </span>
                <span className="text-[11px] text-muted">{row.stageName}</span>
                <span className="font-mono text-[10px] text-faint">{row.days}d</span>
                <Signal signal={row.signal} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
