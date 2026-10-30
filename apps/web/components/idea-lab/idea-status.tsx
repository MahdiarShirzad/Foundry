import { StatusBadge } from "@/components/ui/badge";
import type { Tone } from "@/components/ui/status";
import { IDEA_STATUS_META, type IdeaStatusKey } from "@/lib/idea-lab/types";

const IDEA_TONE: Record<IdeaStatusKey, Tone> = {
  inbox: "neutral",
  exploring: "info",
  shortlisted: "accent",
};

/**
 * Editorial status label. A square marker carries the tone alongside the text
 * so the status never depends on colour alone.
 */
export function IdeaStatus({
  status,
  className = "",
}: {
  status: IdeaStatusKey;
  className?: string;
}) {
  return (
    <StatusBadge
      status={IDEA_STATUS_META[status].label}
      tone={IDEA_TONE[status]}
      variant="quiet"
      size="xs"
      className={className}
    />
  );
}
