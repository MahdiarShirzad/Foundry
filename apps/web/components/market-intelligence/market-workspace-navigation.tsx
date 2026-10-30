"use client";

import { WorkspaceTabs } from "@/components/ui/primitives";

import {
  MARKET_SECTIONS,
  MARKET_SECTION_META,
  type MarketSection,
} from "@/lib/market-intelligence/types";

export function MarketWorkspaceNavigation({
  section,
  onChange,
  counts,
}: {
  section: MarketSection;
  onChange: (section: MarketSection) => void;
  counts: Record<MarketSection, number>;
}) {
  return (
    <WorkspaceTabs
      label="Market research sections"
      meta="Research workspace"
      note="Local view · no analysis is run"
      idPrefix="market"
      value={section}
      onChange={(next) => onChange(next as MarketSection)}
      items={MARKET_SECTIONS.map((key) => ({
        value: key,
        label: MARKET_SECTION_META[key].label,
        index: MARKET_SECTION_META[key].index,
        count: counts[key],
      }))}
    />
  );
}
