export function MarketIntelligenceSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading market research" className="space-y-4">
      <span className="sr-only" role="status">
        Loading the market research workspace…
      </span>

      <div className="animate-pulse border border-line bg-panel">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div className="h-2 w-32 bg-line" />
          <div className="h-2 w-40 bg-line/60" />
        </div>
        <div className="grid grid-cols-2 gap-px bg-line md:grid-cols-4">
          {[0, 1, 2, 3].map((cell) => (
            <div key={cell} className="bg-panel px-4 py-3.5">
              <div className="h-2 w-20 bg-line/60" />
              <div className="mt-3 flex items-baseline gap-2">
                <div className="h-6 w-8 bg-line" />
                <div className="h-2 w-16 bg-line/50" />
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-line px-4 py-2">
          <div className="h-2 w-52 bg-line/50" />
        </div>
      </div>

      <div className="animate-pulse border border-line bg-panel">
        <div className="flex items-center gap-3 border-b border-line px-4 py-2">
          <div className="h-2 w-28 bg-line/70" />
          <div className="ml-auto h-2 w-24 bg-line/40" />
        </div>
        <div className="flex overflow-hidden border-b border-line">
          {[64, 80, 96, 92, 88].map((width, index) => (
            <div
              key={width}
              className={`flex h-10 items-center gap-2 border-r border-line px-3 ${
                index === 0 ? "bg-panel" : ""
              }`}
              style={{ width: `${width}px` }}
            >
              <div className="h-2 w-3 bg-line/60" />
              <div className="h-2 flex-1 bg-line/70" />
              <div className="h-2 w-4 bg-line/40" />
            </div>
          ))}
        </div>

        <div className="grid gap-px bg-line xl:grid-cols-[minmax(0,27rem)_minmax(0,1fr)]">
          <div className="bg-panel">
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <div className="h-2 w-24 bg-line/70" />
              <div className="h-5 w-20 bg-line/50" />
            </div>
            <div className="space-y-2 border-b border-line px-4 py-3">
              <div className="h-7 w-full bg-line/60" />
              <div className="flex gap-2">
                <div className="h-6 w-24 bg-line/50" />
                <div className="h-6 w-20 bg-line/40" />
              </div>
            </div>
            {[0, 1, 2, 3].map((row) => (
              <div key={row} className="border-b border-line px-4 py-3.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="h-2.5 w-28 bg-line" />
                  <div className="h-2 w-14 bg-line/60" />
                </div>
                <div className="mt-2 h-2 w-24 bg-line/50" />
                <div className="mt-2 h-2 w-full bg-line/40" />
                <div className="mt-1.5 h-2 w-4/5 bg-line/30" />
                <div className="mt-2.5 flex gap-1.5">
                  <div className="h-4 w-16 bg-line/50" />
                  <div className="h-4 w-14 bg-line/40" />
                </div>
              </div>
            ))}
          </div>

          <div className="hidden bg-panel xl:block">
            <div className="border-b border-line px-6 pb-5 pt-5">
              <div className="h-2 w-32 bg-line/60" />
              <div className="mt-3 h-8 w-48 bg-line" />
              <div className="mt-3 h-2.5 w-12 bg-line/60" />
              <div className="mt-3 h-2.5 w-full bg-line/50" />
              <div className="mt-2 h-2.5 w-3/4 bg-line/40" />
            </div>
            <div className="grid grid-cols-2 gap-px bg-line">
              {[0, 1].map((cell) => (
                <div key={cell} className="bg-panel px-6 py-4">
                  <div className="h-2 w-20 bg-line/60" />
                  <div className="mt-2 h-2.5 w-full bg-line/40" />
                </div>
              ))}
            </div>
            <div className="space-y-6 px-6 py-5">
              {[0, 1, 2].map((row) => (
                <div key={row} className="grid gap-4 sm:grid-cols-[7rem_minmax(0,1fr)]">
                  <div className="h-2 w-16 bg-line/60" />
                  <div className="space-y-2">
                    <div className="h-2.5 w-full bg-line/50" />
                    <div className="h-2.5 w-4/5 bg-line/40" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
