import { formatShortDate } from "@/lib/dashboard/types";

import type { AnalyticsDataset } from "@/lib/founder-analytics/types";

/** "Sep 28 – Oct 26" for the selected window of sample weeks. */
export function formatWindow(dataset: AnalyticsDataset, range: number): string {
  const current = dataset.weeks.slice(-range);
  if (current.length === 0) return "no sample weeks";
  const first = formatShortDate(current[0].start);
  const last = formatShortDate(current[current.length - 1].start);
  return current.length === 1 ? first : `${first} – ${last}`;
}

/** "May 4 – Oct 26" for the product's whole sample history. */
export function formatFullWindow(dataset: AnalyticsDataset): string {
  return formatWindow(dataset, dataset.weeks.length);
}
