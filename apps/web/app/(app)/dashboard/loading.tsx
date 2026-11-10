/** Skeleton for the overview while a data source resolves. */
export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-5" aria-busy>
      <div className="border border-line bg-panel px-5 py-5 shadow-[var(--elevation-lift)] sm:px-7 sm:py-6">
        <div className="h-2.5 w-28 bg-line" />
        <div className="mt-3 h-8 w-64 max-w-full bg-line" />
        <div className="mt-3 h-3 w-96 max-w-full bg-line/70" />
        <div className="mt-4 flex flex-wrap gap-1.5">
          <div className="h-6 w-28 bg-line/60" />
          <div className="h-6 w-32 bg-line/60" />
        </div>
      </div>

      <div className="grid gap-px overflow-hidden border border-line bg-line shadow-[var(--elevation-lift)] sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-3 bg-panel px-5 py-5">
            <div className="h-2 w-24 bg-line" />
            <div className="h-7 w-20 bg-line" />
            <div className="h-2 w-32 bg-line/70" />
          </div>
        ))}
      </div>

      <div className="h-2.5 w-40 bg-line" />

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="border border-line bg-panel p-5 shadow-[var(--elevation-lift)] lg:col-span-8">
          <div className="h-2.5 w-32 bg-line" />
          <div className="mt-4 h-[260px] w-full bg-line/60" />
        </div>
        <div className="border border-line bg-panel p-5 shadow-[var(--elevation-lift)] lg:col-span-4">
          <div className="h-2.5 w-24 bg-line" />
          <div className="mx-auto mt-6 size-[148px] rounded-full border-[15px] border-line/70" />
        </div>
        <div className="border border-line bg-panel p-5 shadow-[var(--elevation-lift)] lg:col-span-7">
          <div className="h-2.5 w-20 bg-line" />
          <div className="mt-4 space-y-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-4 w-full bg-line/60" />
            ))}
          </div>
        </div>
        <div className="border border-line bg-panel p-5 shadow-[var(--elevation-lift)] lg:col-span-5">
          <div className="h-2.5 w-28 bg-line" />
          <div className="mt-4 h-[120px] w-full bg-line/60" />
        </div>
      </div>
    </div>
  );
}
