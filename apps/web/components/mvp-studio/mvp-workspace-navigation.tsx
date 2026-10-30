"use client";

import { WorkspaceTabs } from "@/components/ui/primitives";

import { MVP_SECTIONS, type MVPSection } from "@/lib/mvp-studio/types";

export function MVPWorkspaceNavigation({
  section,
  onChange,
  counts,
}: {
  section: MVPSection;
  onChange: (section: MVPSection) => void;
  counts: Record<MVPSection, number>;
}) {
  return (
    <WorkspaceTabs
      label="MVP workspace sections"
      meta="MVP workspace"
      idPrefix="mvp"
      value={section}
      onChange={(next) => onChange(next as MVPSection)}
      items={MVP_SECTIONS.map((value) => ({
        value,
        label: value,
        count: counts[value],
      }))}
    />
  );
}
