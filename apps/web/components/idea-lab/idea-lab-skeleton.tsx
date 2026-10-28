export function IdeaLabSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading ideas"
      className="grid gap-px border border-line bg-line md:h-[calc(100dvh-14.75rem)] md:min-h-[32rem] md:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,25.5rem)_minmax(0,1fr)]"
    >
      <span className="sr-only" role="status">
        Loading the idea collection…
      </span>

      <div className="animate-pulse bg-panel">
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <div className="size-3 border border-line" />
          <div className="h-2 w-28 bg-line" />
          <div className="ml-auto h-2 w-6 bg-line/70" />
        </div>
        <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
          {[24, 34, 46, 56].map((width) => (
            <div key={width} className="h-2 bg-line/80" style={{ width }} />
          ))}
          <div className="ml-auto h-5 w-24 bg-line/60" />
        </div>

        {[0, 1, 2, 3, 4].map((row) => (
          <div key={row} className="border-b border-line px-4 py-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="h-2 w-10 bg-line/80" />
              <div className="h-2 w-12 bg-line/60" />
            </div>
            <div className="mt-2.5 h-3 w-24 bg-line" />
            <div className="mt-2 h-2 w-full bg-line/60" />
            <div className="mt-1.5 h-2 w-4/5 bg-line/50" />
            <div className="mt-3 flex items-center gap-2">
              <div className="h-2 w-14 bg-line/70" />
              <div className="size-1 bg-line" />
              <div className="h-2 w-20 bg-line/50" />
            </div>
          </div>
        ))}
      </div>

      <div className="hidden animate-pulse bg-panel md:block">
        <div className="border-b border-line px-7 pb-6 pt-5">
          <div className="flex items-center justify-between gap-4">
            <div className="h-2 w-28 bg-line/80" />
            <div className="h-2 w-24 bg-line/50" />
          </div>
          <div className="mt-7 h-9 w-40 bg-line" />
          <div className="mt-3 h-3 w-64 max-w-full bg-line/70" />
          <div className="mt-4 h-2 w-full max-w-[38rem] bg-line/50" />
          <div className="mt-1.5 h-2 w-3/4 max-w-[30rem] bg-line/40" />
          <div className="mt-5 flex gap-2">
            {[50, 64, 46].map((width) => (
              <div key={width} className="h-2 bg-line/60" style={{ width }} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-px border-b border-line bg-line">
          {[0, 1, 2, 3].map((cell) => (
            <div key={cell} className="bg-panel px-4 py-3">
              <div className="h-2 w-12 bg-line/60" />
              <div className="mt-2 h-2.5 w-16 bg-line" />
            </div>
          ))}
        </div>

        <div className="px-7 py-6">
          <div className="grid gap-6 sm:grid-cols-[8rem_minmax(0,1fr)]">
            <div className="h-2 w-16 bg-line/70" />
            <div className="space-y-2">
              <div className="h-2.5 w-full bg-line/70" />
              <div className="h-2.5 w-full bg-line/60" />
              <div className="h-2.5 w-2/3 bg-line/50" />
            </div>
          </div>
          <div className="mt-7 grid gap-6 border-t border-line pt-6 sm:grid-cols-[8rem_minmax(0,1fr)]">
            <div className="h-2 w-24 bg-line/70" />
            <div className="space-y-2">
              <div className="h-2.5 w-11/12 bg-line/60" />
              <div className="h-2.5 w-4/5 bg-line/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
