"use client";

import { Button, PlusIcon } from "@/components/ui/button";
import { ModuleHeader } from "@/components/ui/primitives";
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
    <ModuleHeader
      stage="02"
      stageLabel="Investigate"
      title="Market Intelligence"
      description="Understand your market, examine competitors, and uncover opportunities before committing to a product direction."
      meta={[
        <span key="ref" className="text-fg">
          {idea.ref}
        </span>,
        idea.name,
        `${idea.competitors.length} competitors`,
        `${idea.notes.length} notes`,
        `updated ${formatMarketShortDate(idea.updatedAt)}`,
      ]}
      controls={
        <>
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
        </>
      }
      actions={
        <>
          <Button variant="secondary" size="md" onClick={onAddCompetitor}>
            <PlusIcon />
            Add Competitor
          </Button>
          <Button variant="primary" size="md" onClick={onAddResearch}>
            <PlusIcon />
            Add Research
          </Button>
        </>
      }
    />
  );
}
