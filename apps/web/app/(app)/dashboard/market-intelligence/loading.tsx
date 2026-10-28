import { MarketIntelligenceSkeleton } from "@/components/market-intelligence/market-intelligence-skeleton";

/** Route-level loading fallback — the same skeleton the preview state uses. */
export default function MarketIntelligenceLoading() {
  return (
    <div className="space-y-4">
      <div className="animate-pulse space-y-2">
        <div className="h-2.5 w-40 bg-line" />
        <div className="h-8 w-72 max-w-full bg-line" />
        <div className="h-2.5 w-80 max-w-full bg-line/70" />
      </div>
      <MarketIntelligenceSkeleton />
    </div>
  );
}
