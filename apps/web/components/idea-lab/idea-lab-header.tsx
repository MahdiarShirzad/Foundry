import { Button, PlusIcon } from "@/components/ui/button";
import { ModuleHeader } from "@/components/ui/primitives";

export function IdeaLabHeader({
  total,
  exploring,
  shortlisted,
  lastUpdated,
  onNewIdea,
}: {
  total: number;
  exploring: number;
  shortlisted: number;
  lastUpdated: string;
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
        <Button variant="primary" size="md" onClick={onNewIdea}>
          <PlusIcon />
          New Idea
        </Button>
      }
    />
  );
}
