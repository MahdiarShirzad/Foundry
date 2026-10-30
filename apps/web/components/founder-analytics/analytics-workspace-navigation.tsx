"use client";

import { WorkspaceTabs } from "@/components/ui/primitives";

import { ANALYTICS_SECTIONS, type AnalyticsSection } from "@/lib/founder-analytics/types";

export function AnalyticsWorkspaceNavigation({
  section,
  onChange,
}: {
  section: AnalyticsSection;
  onChange: (section: AnalyticsSection) => void;
}) {
  return (
    <WorkspaceTabs
      label="Analytics workspace sections"
      meta="Analytics workspace"
      note="Sample data · fixed window"
      idPrefix="analytics"
      value={section}
      onChange={(next) => onChange(next as AnalyticsSection)}
      items={ANALYTICS_SECTIONS.map((value) => ({ value, label: value }))}
    />
  );
}
