import { Skeleton } from "@/components/ui/primitives";

export function IdeaLabSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading ideas"
      className="grid overflow-hidden rounded-card border border-line bg-line shadow-card md:h-[calc(100dvh-16rem)] md:min-h-[32rem] md:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] md:gap-px lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,25rem)_minmax(0,1fr)]"
    >
      <span className="sr-only" role="status">
        Loading the idea collection…
      </span>

      <div className="bg-panel">
        <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
          <Skeleton className="size-3.5 rounded-full" />
          <Skeleton className="h-2.5 w-24" />
          <Skeleton className="ml-auto h-2.5 w-6" />
        </div>
        <div className="flex items-center gap-1.5 px-4 py-2.5">
          {[40, 40, 62, 66].map((width) => (
            <Skeleton key={width} className="h-6 rounded-[6px]" />
          ))}
          <Skeleton className="ml-auto h-6 w-24" />
        </div>

        {[0, 1, 2, 3, 4].map((row) => (
          <div key={row} className="border-b border-line/70 px-4 py-3.5">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-2 w-10" />
              <Skeleton className="h-2 w-12" />
            </div>
            <Skeleton className="mt-2.5 h-3 w-32" />
            <Skeleton className="mt-2 h-2 w-full" />
            <Skeleton className="mt-1.5 h-2 w-4/5" />
            <div className="mt-3 flex items-center gap-2">
              <Skeleton className="h-4 w-16 rounded-pill" />
              <Skeleton className="h-2 w-20" />
            </div>
          </div>
        ))}
      </div>

      <div className="hidden bg-panel md:block">
        <div className="px-6 pb-6 pt-5">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-2.5 w-28" />
            <Skeleton className="h-2.5 w-24" />
          </div>
          <Skeleton className="mt-5 h-8 w-52" />
          <Skeleton className="mt-3 h-3 w-64 max-w-full" />
          <Skeleton className="mt-3 h-2.5 w-full max-w-[36rem]" />
          <Skeleton className="mt-1.5 h-2.5 w-3/4 max-w-[28rem]" />
          <div className="mt-4 flex gap-1.5">
            {[52, 60, 46].map((width) => (
              <Skeleton key={width} className="h-5 rounded-pill" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-y border-line px-6 py-4 sm:grid-cols-4">
          {[0, 1, 2, 3].map((cell) => (
            <div key={cell}>
              <Skeleton className="h-2 w-12" />
              <Skeleton className="mt-2 h-2.5 w-16" />
            </div>
          ))}
        </div>

        <div className="space-y-6 px-6 py-6">
          {[0, 1].map((block) => (
            <div key={block}>
              <Skeleton className="h-3.5 w-32" />
              <div className="mt-3 space-y-2">
                <Skeleton className="h-2.5 w-full" />
                <Skeleton className="h-2.5 w-full" />
                <Skeleton className="h-2.5 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
