export function IdeaLabEmptyCollection({ onNewIdea }: { onNewIdea: () => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
          The collection
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
          00 ideas
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <span className="relative flex size-12 items-center justify-center border border-line-2">
          <svg
            width="17"
            height="17"
            viewBox="0 0 18 18"
            aria-hidden
            className="fill-none stroke-accent stroke-[1.2]"
          >
            <path d="M9 3v12M3 9h12" strokeLinecap="square" />
          </svg>
          <span aria-hidden className="absolute -right-1 -top-1 size-2 bg-mint" />
        </span>

        <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
          Nothing captured yet
        </p>
        <h2 className="mt-2 max-w-[22ch] text-[18px] font-medium leading-snug tracking-[-0.02em] text-fg">
          Start with the thought you keep returning to.
        </h2>
        <p className="mt-2 max-w-[30ch] text-[12px] leading-relaxed text-muted">
          An idea does not need to be complete. Name the problem and the lab will give you room
          to shape the rest.
        </p>

        <button
          type="button"
          onClick={onNewIdea}
          className="mt-5 inline-flex h-9 items-center gap-2 bg-mint px-3.5 text-[12.5px] font-medium text-ink transition duration-200 hover:brightness-95 active:translate-y-px"
        >
          Capture the first idea
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}

export function IdeaLabNoResults({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
          No matches
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
          00 results
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <span aria-hidden className="font-mono text-[10px] tracking-[0.2em] text-line-2">
          00 / 07
        </span>
        <h2 className="mt-3 max-w-[24ch] text-[17px] font-medium leading-snug tracking-[-0.02em] text-fg">
          {query ? (
            <>Nothing in the lab matches “{query}”.</>
          ) : (
            <>Nothing in the lab matches these filters.</>
          )}
        </h2>
        <p className="mt-2 max-w-[30ch] text-[12px] leading-relaxed text-muted">
          Try a different term or return to the full collection.
        </p>
        <button
          type="button"
          onClick={onClear}
          className="mt-5 h-9 border border-line-2 px-3.5 font-mono text-[9px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
        >
          Clear search &amp; filters
        </button>
      </div>
    </div>
  );
}

export function IdeaLabDetailEmpty() {
  const prompts = [
    ["01", "The problem", "What is broken, expensive, or unnecessarily hard?"],
    ["02", "The person", "Who feels it most often, and what do they do today?"],
    ["03", "The first assumption", "What would have to be true for this to matter?"],
  ];

  return (
    <div className="flex min-h-full items-center justify-center bg-panel px-6 py-14 sm:px-10">
      <div className="w-full max-w-[34rem]">
        <p className="flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
          <span aria-hidden className="size-1.5 bg-mint" />
          Stage 01 · Capture
        </p>
        <h2 className="mt-3 text-[clamp(1.6rem,2.6vw,2.05rem)] font-medium leading-[1.08] tracking-[-0.035em] text-fg">
          A clear idea begins with a problem you can name.
        </h2>
        <p className="mt-3 max-w-[44ch] text-[13px] leading-relaxed text-muted">
          Ideas can arrive messy. The lab gives them a place to become specific — one problem,
          one audience, and one assumption at a time.
        </p>

        <ol className="mt-7 border-t border-line">
          {prompts.map(([number, title, description]) => (
            <li
              key={number}
              className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-3 border-b border-line py-3"
            >
              <span className="font-mono text-[9px] tracking-[0.14em] text-accent">{number}</span>
              <div>
                <p className="text-[12px] font-medium text-fg">{title}</p>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
