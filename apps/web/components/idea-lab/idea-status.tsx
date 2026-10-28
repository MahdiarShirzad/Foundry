import { IDEA_STATUS_META, type IdeaStatusKey } from "@/lib/idea-lab/types";

/**
 * Editorial status label. A square mark carries the tone alongside the text so
 * the status never depends on colour alone.
 */
export function IdeaStatus({
  status,
  className = "",
  markerClassName = "size-1.5",
}: {
  status: IdeaStatusKey;
  className?: string;
  markerClassName?: string;
}) {
  const meta = IDEA_STATUS_META[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.16em] ${meta.text} ${className}`}
    >
      <span aria-hidden className={`shrink-0 ${markerClassName} ${meta.marker}`} />
      {meta.label}
    </span>
  );
}
