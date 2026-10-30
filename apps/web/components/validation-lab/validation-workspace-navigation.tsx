"use client";

import { WorkspaceTabs } from "@/components/ui/primitives";

import { VALIDATION_SECTIONS, type ValidationSection } from "@/lib/validation-lab/types";

export function ValidationWorkspaceNavigation({
  section,
  onChange,
}: {
  section: ValidationSection;
  onChange: (section: ValidationSection) => void;
}) {
  return (
    <WorkspaceTabs
      label="Validation workspace sections"
      meta="Validation workspace"
      idPrefix="validation"
      value={section}
      onChange={(next) => onChange(next as ValidationSection)}
      items={VALIDATION_SECTIONS.map((value) => ({ value, label: value }))}
    />
  );
}
