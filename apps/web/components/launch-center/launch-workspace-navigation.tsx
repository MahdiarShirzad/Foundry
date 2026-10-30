"use client";

import { WorkspaceTabs } from "@/components/ui/primitives";

import { LAUNCH_SECTIONS, type LaunchSection } from "@/lib/launch-center/types";

export function LaunchWorkspaceNavigation({
  section,
  onChange,
  counts,
}: {
  section: LaunchSection;
  onChange: (section: LaunchSection) => void;
  counts?: Partial<Record<LaunchSection, number>>;
}) {
  return (
    <WorkspaceTabs
      label="Launch workspace sections"
      meta="Launch workspace"
      note="Readiness · plan · assets · channels"
      idPrefix="launch"
      value={section}
      onChange={(next) => onChange(next as LaunchSection)}
      items={LAUNCH_SECTIONS.map((value) => ({
        value,
        label: value,
        count: counts?.[value],
      }))}
    />
  );
}
