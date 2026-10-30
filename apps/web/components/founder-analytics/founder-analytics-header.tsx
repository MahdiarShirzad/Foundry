"use client";

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
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="min-w-0">
        <p className="flex items-center gap-2.5 font-mono text-[9.5px] uppercase tracking-[0.24em] text-accent">
          <span aria-hidden className="size-1.5 bg-mint" />
          Stage 08 / Learn
        </p>
        <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.8rem)] font-medium leading-[0.98] tracking-[-0.04em] text-fg">
          Founder Analytics
        </h1>
        <p className="mt-2 max-w-[68ch] text-[12.5px] leading-relaxed text-muted">
          Understand product performance, explore user behavior, and turn metrics into better
          product decisions.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 border border-accent/60 bg-mint-tint/50 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
            <span aria-hidden className="size-1.5 bg-accent" />
            Demo data
          </span>
          <label className="flex items-center gap-2 border border-line bg-panel px-2.5 py-1.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
              Product
            </span>
            <select
              value={product.id}
              onChange={(event) => onChangeProduct(event.target.value)}
              className="bg-transparent text-[12px] text-fg outline-none"
              aria-label="Select product for analytics"
            >
              {DEMO_ANALYTICS_PRODUCTS.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.name} · {entry.ref}
                </option>
              ))}
            </select>
          </label>
          <span className="border border-line bg-panel px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
            Sample window · {windowLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <RangeTabs
          options={ANALYTICS_RANGES}
          value={range}
          onChange={onChangeRange}
          label="Sample date range"
        />
        <SegmentedControl
          label="Workspace view"
          value={view}
          onChange={onChangeView}
          options={[
            { value: "overview", label: "Overview" },
            { value: "analysis", label: "Detailed analysis" },
          ]}
        />
        <button
          type="button"
          onClick={onExport}
          className="flex h-[26px] items-center gap-2 border border-line px-2.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-fg transition-colors hover:border-accent hover:text-accent"
        >
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
        </button>
      </div>
    </header>
  );
}
