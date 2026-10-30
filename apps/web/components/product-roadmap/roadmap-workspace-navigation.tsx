"use client";

import { WorkspaceTabs } from "@/components/ui/primitives";

import { ROADMAP_SECTIONS, type RoadmapSection } from "@/lib/product-roadmap/types";

export function RoadmapWorkspaceNavigation({
  section,
  onChange,
}: {
  section: RoadmapSection;
  onChange: (section: RoadmapSection) => void;
}) {
  return (
    <WorkspaceTabs
      label="Roadmap workspace sections"
      meta="Roadmap workspace"
      idPrefix="roadmap"
      value={section}
      onChange={(next) => onChange(next as RoadmapSection)}
      items={ROADMAP_SECTIONS.map((value) => ({ value, label: value }))}
    />
  );
}
