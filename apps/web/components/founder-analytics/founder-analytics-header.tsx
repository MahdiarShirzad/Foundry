"use client";

import { Button } from "@/components/ui/button";
import { HeaderSelect, ModuleHeader } from "@/components/ui/primitives";
import { RangeTabs } from "@/components/dashboard/panel";

import { ANALYTICS_RANGES, type RangeKey } from "@/lib/founder-analytics/types";
import type { AnalyticsProduct } from "@/lib/founder-analytics/types";
import { DEMO_ANALYTICS_PRODUCTS } from "@/lib/founder-analytics/demo";

import { SegmentedControl } from "./primitives";

export type HeaderView = "overview" | "analysis";

export function FounderAnalyticsHeader({
  product,
  onChangeProduct,
  range,
  onChangeRange,
  view,
  onChangeView,
  windowLabel,
  onExport,
}: {
  product: AnalyticsProduct;
  onChangeProduct: (id: string) => void;
  range: RangeKey;
  onChangeRange: (range: RangeKey) => void;
  view: HeaderView;
  onChangeView: (view: HeaderView) => void;
  windowLabel: string;
  onExport: () => void;
}) {
  return (
    <ModuleHeader
      stage="08"
      stageLabel="Learn"
      title="Founder Analytics"
      description="Understand product performance, explore user behavior, and turn metrics into better product decisions."
      meta={[
        <span key="demo" className="text-accent">
          Demo data
        </span>,
        `Sample window · ${windowLabel}`,
        product.name,
      ]}
      controls={
        <>
          <HeaderSelect
            label="Product"
            value={product.id}
            onChange={onChangeProduct}
            ariaLabel="Select product for analytics"
          >
            {DEMO_ANALYTICS_PRODUCTS.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.name} · {entry.ref}
              </option>
            ))}
          </HeaderSelect>
          <RangeTabs
            options={ANALYTICS_RANGES}
            value={range}
            onChange={onChangeRange}
            label="Sample date range"
          />
        </>
      }
      actions={
        <>
          <SegmentedControl
            label="Workspace view"
            value={view}
            onChange={onChangeView}
            size="sm"
            options={[
              { value: "overview", label: "Overview" },
              { value: "analysis", label: "Detailed analysis" },
            ]}
          />
          <Button variant="secondary" size="md" onClick={onExport}>
            <svg
              width="11"
              height="11"
              viewBox="0 0 12 12"
              aria-hidden
              className="fill-none stroke-current stroke-[1.3]"
            >
              <path d="M6 1.5v6m0 0L3.5 5M6 7.5 8.5 5M2 9.5h8" strokeLinecap="square" />
            </svg>
            Export
          </Button>
        </>
      }
    />
  );
}
