import {
  formatMarketShortDate,
  type MarketIdea,
} from "@/lib/market-intelligence/types";

import { SampleNotice } from "./primitives";

const TILES = [
  { key: "notes", index: "01", label: "Research items", note: "notes & sources" },
  { key: "competitors", index: "02", label: "Competitors", note: "profiles in view" },
  { key: "segments", index: "03", label: "Segments", note: "groups explored" },
  { key: "opportunities", index: "04", label: "Opportunities", note: "documented" },
] as const;

export function ResearchOverview({ idea }: { idea: MarketIdea }) {
  const counts = {
    notes: idea.notes.length,
    competitors: idea.competitors.length,
    segments: idea.segments.length,
    opportunities: idea.opportunities.length,
  };

  const reviewed = idea.notes.filter((note) => note.evidence === "reviewed").length;

  return (
    <section aria-label="Research overview" className="border border-line bg-panel">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line px-4 py-2.5">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg">
            Research overview
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.13em] text-faint">
            {idea.name} · updated {formatMarketShortDate(idea.updatedAt)}
          </span>
        </div>
        <SampleNotice />
      </div>

      <dl className="grid grid-cols-2 gap-px bg-line md:grid-cols-4">
        {TILES.map((tile) => (
          <div key={tile.key} className="min-w-0 bg-panel px-4 py-3.5">
            <div className="flex items-center justify-between gap-2">
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                {tile.label}
              </dt>
              <span aria-hidden className="font-mono text-[10px] tracking-[0.1em] text-line-2">
                {tile.index}
              </span>
            </div>
            <dd className="mt-1.5 flex items-baseline gap-2">
              <span className="font-mono text-[24px] leading-none tracking-[-0.04em] text-fg">
                {String(counts[tile.key]).padStart(2, "0")}
              </span>
              <span className="text-[10.5px] leading-tight text-faint">{tile.note}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line bg-bg/45 px-4 py-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-faint">
          <span className="text-accent">{reviewed}</span> research {reviewed === 1 ? "note" : "notes"} reviewed
        </p>
        <span aria-hidden className="hidden h-2.5 w-px bg-line sm:block" />
        <p className="text-[10.5px] leading-relaxed text-faint">
          Counts reflect this sample set. No market size, growth or revenue figures are implied.
        </p>
      </div>
    </section>
  );
}
