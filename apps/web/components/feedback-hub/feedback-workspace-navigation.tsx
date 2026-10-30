"use client";

import { WorkspaceTabs } from "@/components/ui/primitives";

import { FEEDBACK_SECTIONS, type FeedbackSection } from "@/lib/feedback-hub/types";

export function FeedbackWorkspaceNavigation({
  section,
  onChange,
  counts,
}: {
  section: FeedbackSection;
  onChange: (section: FeedbackSection) => void;
  counts: Record<FeedbackSection, number>;
}) {
  return (
    <WorkspaceTabs
      label="Feedback workspace sections"
      meta="Feedback workspace"
      idPrefix="feedback"
      value={section}
      onChange={(next) => onChange(next as FeedbackSection)}
      items={FEEDBACK_SECTIONS.map((value) => ({
        value,
        label: value,
        count: counts[value],
      }))}
    />
  );
}
