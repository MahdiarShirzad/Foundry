import { IdeaLabSkeleton } from "@/components/idea-lab/idea-lab-skeleton";

/** Route-level loading fallback — the same skeleton the preview state uses. */
export default function IdeaLabLoading() {
  return (
    <div className="space-y-4">
      <div className="animate-pulse space-y-2">
        <div className="h-2.5 w-36 bg-line" />
        <div className="h-8 w-52 bg-line" />
        <div className="h-2.5 w-64 max-w-full bg-line/70" />
      </div>
      <IdeaLabSkeleton />
    </div>
  );
}
