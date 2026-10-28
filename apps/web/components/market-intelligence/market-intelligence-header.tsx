"use client";

import { IdeaSelect } from "@/components/idea-lab/idea-select";
import {
  MARKET_VIEW_OPTIONS,
  formatMarketShortDate,
  type MarketIdea,
  type MarketView,
} from "@/lib/market-intelligence/types";

export function MarketIntelligenceHeader({
  idea,
  ideas,
  ideaId,
  onIdeaChange,
  view,
  onViewChange,
  onAddResearch,
  onAddCompetitor,
}: {
  idea: MarketIdea;
  ideas: readonly { value: string; label: string; shortLabel?: string }[];
  ideaId: string;
  onIdeaChange: (id: string) => void;
  view: MarketView;
  onViewChange: (view: MarketView) => void;
  onAddResearch: () => void;
  onAddCompetitor: () => void;
}) {
  return (
    <header className="flex flex-col gap-5">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2.5 font-mono text-[9.5px] uppercase tracking-[0.24em] text-accent">
            <span aria-hidden className="size-1.5 shrink-0 bg-mint" />
            Stage 02 · Investigate
            <span aria-hidden className="hidden h-px w-9 bg-line sm:block" />
            <span className="hidden font-mono text-[9px] tracking-[0.2em] text-faint sm:inline">
              Eight-stage cycle
            </span>
          </p>

          <h1 className="mt-2.5 text-[clamp(2.1rem,3.8vw,2.9rem)] font-medium leading-[0.94] tracking-[-0.045em] text-fg">
            Market Intelligence
          </h1>

          <p className="mt-2.5 max-w-[62ch] text-[13px] leading-relaxed text-muted">
            Understand your market, examine competitors, and uncover opportunities before
            committing to a product direction.
          </p>

          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
            <span className="text-fg">{idea.ref}</span>
            <span aria-hidden className="size-0.5 bg-line-2" />
            <span>{idea.name}</span>
            <span aria-hidden className="size-0.5 bg-line-2" />
            <span>{idea.competitors.length} competitors</span>
            <span aria-hidden className="size-0.5 bg-line-2" />
            <span>{idea.notes.length} notes</span>
            <span aria-hidden className="size-0.5 bg-line-2" />
            <span>updated {formatMarketShortDate(idea.updatedAt)}</span>
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 xl:items-end">
          <div className="flex flex-wrap items-center gap-2">
            <IdeaSelect
              label="Idea"
              value={ideaId}
              options={ideas}
              onChange={onIdeaChange}
              className="min-w-[11rem] flex-1 sm:flex-none sm:w-[12rem]"
            />
            <IdeaSelect
              label="Preview"
              value={view}
              options={MARKET_VIEW_OPTIONS}
              onChange={(next) => onViewChange(next as MarketView)}
              align="right"
              className="min-w-[11rem] flex-1 sm:flex-none sm:w-[15rem]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <button
              type="button"
              onClick={onAddCompetitor}
              className="inline-flex h-10 items-center justify-center gap-2 border border-line-2 bg-panel px-3.5 font-mono text-[9px] uppercase tracking-[0.14em] text-fg transition-colors hover:border-accent hover:text-accent sm:h-9"
            >
              <span aria-hidden className="text-[12px] leading-none">+</span>
              Add Competitor
            </button>
            <button
              type="button"
              onClick={onAddResearch}
              className="group inline-flex h-10 items-center justify-center gap-2.5 bg-mint px-4 text-[13px] font-medium text-ink transition duration-200 hover:brightness-95 active:translate-y-px sm:h-9"
            >
              <span aria-hidden className="text-[14px] leading-none">+</span>
              Add Research
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
