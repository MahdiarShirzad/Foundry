import { Button, PlusIcon } from "@/components/ui/button";
import { ModuleHeader } from "@/components/ui/primitives";

import { IdeaSelect } from "./idea-select";
import { LAB_VIEW_OPTIONS, type LabView } from "@/lib/idea-lab/types";

export function IdeaLabHeader({
  total,
  exploring,
  shortlisted,
  lastUpdated,
  view,
  onViewChange,
  onNewIdea,
}: {
  total: number;
  exploring: number;
  shortlisted: number;
  lastUpdated: string;
  view: LabView;
  onViewChange: (view: LabView) => void;
  onNewIdea: () => void;
}) {
  return (
    <ModuleHeader
      stage="01"
      stageLabel="Capture"
      title="Idea Lab"
      description="Capture ideas, discover opportunities, and start building."
      meta={[
        <>
          <span className="text-fg">{String(total).padStart(2, "0")}</span> ideas
        </>,
        `${exploring} exploring`,
        `${shortlisted} shortlisted`,
        `updated ${lastUpdated}`,
      ]}
      actions={
        <>
          <IdeaSelect
            label="Preview"
            value={view}
            options={LAB_VIEW_OPTIONS}
            onChange={(next) => onViewChange(next as LabView)}
          />
          <Button variant="primary" size="md" onClick={onNewIdea}>
            <PlusIcon />
            New Idea
          </Button>
        </>
      }
    />
  );
}
