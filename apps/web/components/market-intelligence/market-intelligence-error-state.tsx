export function MarketIntelligenceErrorState({
  onRetry,
  onOverview,
}: {
  onRetry: () => void;
  onOverview: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex min-h-[24rem] items-center border border-line bg-panel md:min-h-[32rem]"
    >
      <div className="w-full max-w-[48rem] px-6 py-12 sm:px-10 sm:py-14">
        <p className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-danger">
          <span aria-hidden className="size-1.5 bg-danger" />
          Presentation state · error
        </p>
        <h2 className="mt-3 text-[clamp(1.6rem,2.8vw,2.1rem)] font-medium leading-[1.06] tracking-[-0.035em] text-fg">
          The research workspace didn&apos;t load.
        </h2>
        <p className="mt-3 max-w-[56ch] text-[13px] leading-relaxed text-muted">
          The sample market set could not be read. Nothing has been changed, and no research,
          competitor or opportunity has been moved or lost.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-9 items-center gap-2 bg-mint px-3.5 text-[12.5px] font-medium text-ink transition duration-200 hover:brightness-95 active:translate-y-px"
          >
            Try again
            <span aria-hidden>↻</span>
          </button>
          <button
            type="button"
            onClick={onOverview}
            className="h-9 border border-line px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-faint transition-colors hover:border-accent hover:text-accent"
          >
            Return to overview
          </button>
        </div>

        <p className="mt-8 border-t border-line pt-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-faint">
          No request was made · this state is part of the interface preview
        </p>
      </div>
    </div>
  );
}
