/** Skeleton for the analytics workspace while a data source resolves. */
export default function FounderAnalyticsLoading() {
  return (
    <div className="animate-pulse space-y-4" aria-busy>
      <div className="space-y-2">
        <div className="h-2.5 w-32 bg-line" />
        <div className="h-7 w-64 bg-line" />
        <div className="h-2.5 w-96 max-w-full bg-line/70" />
      </div>

      <div className="grid gap-px border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-3 bg-panel px-4 py-4">
            <div className="h-2 w-24 bg-line" />
            <div className="h-6 w-20 bg-line" />
            <div className="h-2 w-32 bg-line/70" />
          </div>
        ))}
      </div>

      <div className="h-8 w-full bg-line/60" />

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="bg-panel px-4 py-3.5 lg:col-span-8">
          <div className="h-2.5 w-40 bg-line" />
          <div className="mt-4 h-[240px] w-full bg-line/60" />
        </div>
        <div className="bg-panel px-4 py-3.5 lg:col-span-4">
          <div className="h-2.5 w-32 bg-line" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-4 w-full bg-line/60" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
